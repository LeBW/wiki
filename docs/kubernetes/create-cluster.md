# 搭建集群
Kubernetes是如今最为火热的容器编排软件，是谷歌严格保密十几年的秘密武器Borg的开源版本。初学者部署Kubernetes集群，建议从以下两个方面入手：

1. Minikube。Minikube是Kubernetes官方提供的单节点小型集群，可以轻松跑在普通的笔记本电脑上。Minikube其实就是一个虚拟机，用户可以根据[官方指南](https://kubernetes.io/docs/setup/learning-environment/minikube/)进行安装。但是Minikube运行在虚拟机之上，性能有限，并且只支持单节点。如果你拥有超过一台的服务器可以使用，那么建议使用第二种方法。
2. 使用kubeadm部署高可用集群。kubeadm是官方提供的快速部署Kubernetes集群的工具，目前总体上已经达到GA水平，基本满足生产使用，对于学习使用那更是绰绰有余。接下来对kubeadm部署集群的步骤进行详细地指南。

## 系统要求
CPU和内存：双核，4GB以上。
操作系统：基于x86_64的各种Linux发行版，包括CentOS，Federa，Ubuntu等，但是内核要求在3.10及以上。这里我使用的是Centos7系统。
容器运行时：一般情况，使用Docker作为容器运行时。

## 修改主机名和hosts文件
为了使机器之间能够相互通信，首先我们需要给机器提供合适的主机名，并且在hosts文件中添加相关映射。

### 修改主机名

1. 首先修改主机名，centos中利用`hostname server01`可以修改主机名为server01；
2. 然后打开`/etc/sysconfig/network`文件，写入`HOSTNAME=server01`。
3. 然后重新进入服务器，查看名称是否改变。

### 修改hosts文件
进入每一台机器的`/etc/hosts`文件，添加所有映射关系。例如，现在我有两台机器，一台叫做master，IP地址为192.168.0.1，一台叫做node-1，IP地址为192.168.0.2，那么我需要添加以下内容：
```
192.168.0.1 master
192.168.0.2 node-1
```
为了检验映射关系是否添加成功，我们可以利用ping命令。在master中执行`ping node-1`，在node-1中执行`ping master`，如果能够ping通，说明成功。

## 系统基本配置
在每一台机器上执行以下命令
```
# 关闭系统交换空间使用。（每次重启机器时都需要关闭，否则kubelet启动会报错）
swapoff -a 

# 关闭防火墙
systemctl stop firewalld
systemctl disable firewalld

# 设置SELinux
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```
另外，一些Centos7用户报告了由于iptables被绕过而导致路由出错的问题，因此我们需要保证`net.bridge.bridge-nf-call-iptables`设置为1。具体来说，执行以下命令
```
cat <<EOF >  /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
EOF
sysctl --system
```
为了保证`br_netfilter`模块加载，我们需要执行以下命令：
```
modprobe br_netfilter
```
## 安装Docker
如果没有安装过Docker，首先需要安装Docker作为容器运行时。

首先，尝试卸载旧版本的Docker，保证安装环境
```
yum remove docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-engine
```
然后安装相关依赖包
`yum install -y yum-utils device-mapper-persistent-data lvm2`

然后将docker仓库添加到yum的源中
```
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```
然后安装相应版本的Docker。这里我没有说最新版本，因为kubernetes往往没有来得及支持最新版本的Docker，所以在官网会推荐相应的版本，可以从[这里](https://kubernetes.io/docs/setup/production-environment/container-runtimes/)查看。这里我安装的是最新的Kubernetes v1.15.0，官网推荐的Docker版本是docker-ce-18.06.2.ce，于是我用以下命令安装docker-ce-18.06.2.ce
```
yum update && yum install docker-ce-18.06.2.ce
```
安装完毕后，使用`systemctl start docker`来运行docker。然后我们可以用`docker version`命令查看是否成功安装，如果出现Client和Server两个版本信息，说明Docker已经成功安装并且运行。（如果只有Client的信息，说明docker没有成功运行，需要用`systemctl status docker`查看相关信息，寻找错误原因）。

## 安装kubeadm，kubelet和kubectl
* `kubeadm`：快速创建集群的工具
* `kubelet`：这是一个需要在所有集群中机器上安装的组件，它用于执行开启Pod和容器等操作。
* `kubectl`：与集群通信的命令行工具，官方提供的CLI。

首先要在yum中添加Kubernetes的仓库源。官方源的地址为https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64，在国内无法访问，所幸阿里云为我们提供了镜像源（感谢阿里爸爸），使用以下命令添加阿里镜像源
```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg https://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF
```
然后运行yum install命令安装kubeadm和相关工具
```
yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

## 初始化主节点（Master）
成功安装kubeadm等一系列工具后，接下来就是正式部署Kubernetes集群了。首先我们需要在Master主机上执行`kubeadm init `相关命令，将Master节点配置成功，那么此时集群也就基本成功部署了。

具体来说，在master主机中执行以下命令
```
kubeadm init \
	--image-repository=registry.aliyuncs.com/google_containers
	--pod-network-cidr=10.244.0.0/16
```
其中`--imge-repository`指向阿里云的镜像仓库，显然还是因为google镜像仓库在国内无法访问；而`--pod-network-cidr`是为了接下来的Pod间网络通信使用flannel而设置的。如果你想安装其他的网络组件，可以在官网上[这里](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)查看所有支持的网络组件，并修改以上命令。

以上命令执行可能需要几分钟的时间。执行完毕后，主机点就基本上初始化成功了！
>如果初始化失败的话，根据提示寻找原因。第一次我初始化失败后，发现可能是由于在安装kubeadm之后才修改的主机名，造成kubeadm某些配置不正确。这种情况只需卸载并重新安装kubeadm，再次运行kubeadm init相关命令即可。
> `$ kubeadm reset`
> `$ yum remove kubeadm`
> `$ yum install kubeadm --disableexcludes=kubernetes`

安装成功后，会显示一些重要信息。首先按照提示执行以下命令：
```
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```
然后给集群安装一个Pod网络组件。这里我选择flannel组件，执行以下命令安装
```
sysctl net.bridge.bridge-nf-call-iptables=1
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/62e44c867a2846fefb68bd5f178daf4da3095ccb/Documentation/kube-flannel.yml
```
安装完毕后，执行`kubectl get nodes`命令，可以发现master的状态从NotReady变成了Ready。

默认情况下，集群不会在Master节点上部署Pod，这意味着你的集群至少需要两个节点才能正常工作。如果你想要允许集群在Master上部署Pod，可以执行以下命令，这样即使只有一台机器，你也可以正常使用集群
```
kubectl taint nodes --all node-role.kubernetes.io/master-
```
另外，`kubeadm init`成功后会显示有关kubeadm join的命令，我们需要保存这个命令，以便后面为集群添加节点使用。
## 加入工作节点
首先仍然需要为工作节点安装docker，kubeadm等相关工具，具体步骤见上。然后执行上一步骤中保存的`kubeadm join`相关命令，就成功地将该节点添加进集群中了。

如果初始化时的token没有保存或者已经过期，可以在Master使用以下命令重新生成`kubeadm join`相关token及命令：
```
kubeadm token create --print-join-command
```

## 验证集群是否安装完成
执行以下命令，验证集群相关Pod是否都正常创建并运行：
```
kubectl get pods --all-namespaces
```
如果所有Pod都处于Running状态，说明集群正常运行。如果发现有状态错误的Pod，执行`kubectl describe pod <pod_name> --namespace=kube-system`查看错误原因，常见的错误一般是镜像没有下载完成。

至此，我们就通过`kubeadm`工具实现了Kubernetes集群的快速搭建。接下来可以愉快地使用了！

## 踩过的坑
### Cgroup不支持pids子系统。
工作节点加入后，一直是NotReady状态。describe后发现报错如下：
```
Warning  FailedNodeAllocatableEnforcement  <invalid> (x1411 over 23h)     
kubelet, lbw-node-3   
Failed to update Node Allocatable Limits ["kubepods"]: failed to set supported cgroup subsystems for cgroup [kubepods]: Failed to find subsystem mount for required subsystem: pids
```
由错误日志可知是节点中的Cgroup不支持子系统pids所致。于是用`uname -r`查看内核版本：
```
[root@localhost ~]# uname -r 
3.10.0-327.el7.x86_64
```
然后查看该内核所支持的CGROUP，发现的确不支持PIDS。
```
[root@localhost ~]# cat /boot/config-3.10.0-327.el7.x86_64  | grep CGROUP
CONFIG_CGROUPS=y
# CONFIG_CGROUP_DEBUG is not set
CONFIG_CGROUP_FREEZER=y
CONFIG_CGROUP_DEVICE=y
CONFIG_CGROUP_CPUACCT=y
CONFIG_CGROUP_HUGETLB=y
CONFIG_CGROUP_PERF=y
CONFIG_CGROUP_SCHED=y
CONFIG_BLK_CGROUP=y
# CONFIG_DEBUG_BLK_CGROUP is not set
CONFIG_NETFILTER_XT_MATCH_CGROUP=m
CONFIG_NET_CLS_CGROUP=y
CONFIG_NETPRIO_CGROUP=m
```
然后在运行`yum update -y`后，使用` yum list kernel`命令查看当前安装的内核.
```
[root@lbw-master ~]# yum list kernel
Installed Packages
kernel.x86_64		3.10.0-327.el7			    @anaconda
kernel.x86_64		3.10.0-862.3.2.el7 		    @updates
kernel.x86_64		3.10.0-957.21.3.el7 	    @updates
kernel.x86_64		3.10.0-957.27.2.el7			@updates
```
查看新版内核所支持的CGOURP
```
[root@lbw-master ~]# cat /boot/config-3.10.0-957.27.2.el7.x86_64 | grep CGROUP
CONFIG_CGROUPS=y
# CONFIG_CGROUP_DEBUG is not set
CONFIG_CGROUP_FREEZER=y
CONFIG_CGROUP_PIDS=y
CONFIG_CGROUP_DEVICE=y
CONFIG_CGROUP_CPUACCT=y
CONFIG_CGROUP_HUGETLB=y
CONFIG_CGROUP_PERF=y
CONFIG_CGROUP_SCHED=y
CONFIG_BLK_CGROUP=y
# CONFIG_DEBUG_BLK_CGROUP is not set
CONFIG_NETFILTER_XT_MATCH_CGROUP=m
CONFIG_NET_CLS_CGROUP=y
CONFIG_NETPRIO_CGROUP=y
```
发现的确有PIDS支持。于是接下来就是想办法将内核进行升级了。
用以下命令查看所有可用的内核
```
[root@lbw-master ~]# awk -F\' '$1=="menuentry " {print i++ " : " $2}' /etc/grub2.cfg
0 : CentOS Linux (3.10.0-957.27.2.el7.x86_64) 7 (Core)
1 : CentOS Linux (3.10.0-957.21.3.el7.x86_64) 7 (Core)
2 : CentOS Linux (3.10.0-862.3.2.el7.x86_64) 7 (Core)
3 : CentOS Linux (3.10.0-327.el7.x86_64) 7 (Core)
4 : CentOS Linux (0-rescue-c4da2e677e384e85b9fd9f27eb3a9f8a) 7 (Core)
```
用`grub2-set-default`命令设置默认启动内核。利用设为0表示使用上一个命令输出的第一个内核。
```
grub2-set-default 0
```
然后用`grub2-mkconfig`命令生成配置文件并应用在grub.config文件中。
```
grub2-mkconfig -o /boot/grub2/grub.cfg
```
执行完毕后，用`reboot`命令重启机器即可。