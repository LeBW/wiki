# Service 实现原理

上文已经提到 Service 实际的路由转发都是由 kube-proxy 组件来实现的，kube-proxy 主要实现了集群内部从 pod 到 service 和集群外部从 nodePort 到 service 的访问，kube-proxy 的路由转发规则是通过其后端的代理模块实现的，kube-proxy 的代理模块目前有四种实现方案，userspace、iptables、ipvs、kernelspace，（kernelspace 主要是在 windows 下使用的，这里暂且不谈）其发展历程如下所示：

* kubernetes v1.0：services 仅是一个“4层”代理，代理模块只有 userspace
* kubernetes v1.1：Ingress API 出现，其代理“7层”服务，并且增加了 iptables 代理模块
* kubernetes v1.2：iptables 成为**默认代理模式**。
* kubernetes v1.8：引入 ipvs 代理模块
* kubernetes v1.9：ipvs 代理模块成为 beta 版本
* kubernetes v1.11：ipvs 代理模式 GA

下面我们分别介绍一下这几种模式
## userspace 模式
在 userspace 模式下，访问服务的请求到达节点后首先进入内核 iptables，然后回到用户空间，由 kube-proxy 转发到后端的 pod，这样流量从用户空间进出内核带来的性能损耗是不可接受的，所以也就有了 iptables 模式。

为什么 userspace 模式要建立 iptables 规则，因为 kube-proxy 监听的端口在用户空间，这个端口不是服务的访问端口也不是服务的 nodePort，因此需要一层 iptables 把访问服务的连接重定向给 kube-proxy 服务。

## iptables 模式
iptables 模式是目前默认的代理方式，基于 netfilter 实现。当客户端请求 service 的 ClusterIP 时，根据 iptables 规则路由到各 pod 上，iptables 使用 DNAT 来完成转发，其采用了随机数实现负载均衡。

举个例子，现在我们创建了一个 Service 如下
```yaml
apiVersion: v1
kind: Service
metadata:
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```
这个 Service 的例子中，我们通过 selector 字段来声明这个 Service 只代理携带了 `app=hostnames` 标签的 Pod。并且，这个 Service 的 80 端口，代理的是 Pod 的 9376 端口。

然后，我们定义一个与之对应的 Deployment，如下所示

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: k8s.gcr.io/serve_hostname
        ports:
        - containerPort: 9376
          protocol: TCP
```
这个应用的作用，就是每次访问 9376 端口时，返回他自己的 hostname。

而被 selector 选中的 Pod，就被称为 Service 的 Endpoints，可以用 `kubectl get ep` 命令看到它们，如下图所示:
```
$ kubectl get endpoints hostnames
NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```
需要注意的是，只有在 Running 状态，且 readinessProbe 检查通过的 Pod，才会出现在 Service 的 Endpoints 列表里。并且，当某一个 Pod 出现问题时，Kubernetes 会自动把它从 Service 里摘除掉。

此时，通过该 Service 的 VIP 地址是 10.0.1.175，我们就可以访问到它所代理的 Pod 了：
```
$ kubectl get svc hostnames
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
 
$ curl 10.0.1.175:80
hostnames-0uton
 
$ curl 10.0.1.175:80
hostnames-yp2kp
 
$ curl 10.0.1.175:80
hostnames-bvc05
```
而这个 VIP 是 Kubernetes 自动为 Service 分配的。像上面这样，通过三次连续访问 Servic 的 VIP 地址和代理端口 80，它为我们依次返回了三个 Pod 的 hostname。这也正印证了 Service 提供的是 Round Robin 方式的负载均衡。对于这种方式，我们称为：ClusterIP 模式的 Service。

那么下面看看 Service 到底是如何用 iptables 实现的。

例如，对于前面创建的 hostnames 的 Service 来说，一旦它被提交给 Kubernetes，那么 kube-proxy 就可以通过 Service 的 Informer 感知到这样一个 Service 对象的添加。而作为对这个事件的响应，它就会在宿主机上创建这样一条 iptables 规则（可以通过 `iptables-save` 看到它），如下所示：
```
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
```

这条 iptables 链的规则是：凡是 目的地址是 10.0.1.175、目的端口是 80 的 IP 包，都应该跳转到另外一条名叫 `KUBE-SVC-NWV5X2332I4OT4T3` 的 iptables 链进行处理。

而我们前面看到，10.0.1.175 正是这个 Service 的 VIP。所以这一条规则，就为这个 Service 设置了一个固定的入口地址。并且，由于 10.0.1.175 只是一条 iptables 规则上的配置，并没有真正的网络设备，所以你 ping 这个地址，是没有任何响应的。

那么，我们即将跳转到的 KUBE-SVC-NWV5X2332I4OT4T3 规则，又有什么作用呢？

实际上，它是一组规则的集合，如下图所示：
```
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```
可以看到，这组规则，其实是一组随机模式（-mode random）的 iptables 链。
而随机转发的目的，分别是 KUBE-SEP-WNBA2IHDGP2BOBGZ、KUBE-SEP-X3P2623AGDH6CDF3 和 KUBE-SEP-57KPRZ3JQVENLNBR。

而这三条链指向的最终目的地，其实就是这个 Service 代理的三个 Pod。所以这一组规则，就是 Service 实现负载均衡的位置。

需要注意的是，iptables 规则的匹配是从上到下逐条进行的，所以为了保证上述三条规则每条被选中的概率都相同，我们应该将它们的 probability 字段的值分别设为 1/3（0.3333...），1/2 和 1.

这么设置的原理很简单：第一条规则被选中的概率就是 1/3；而如果第一条规则没有被选中，那么这时候就只剩下两条规则了，所以第二条规则的 probability 就必须设置为 1/2；类似地，最后一条就必须设置为 1。

然后我们看看这三条链的的细节。通过查看上述三条链的明细，我们就很容易理解 Service 进行转发的具体原理了，如下所示：
```
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
 
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
 
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
```
可以看到，这三条链其实是三条 DNAT 规则。但在 DNAT 规则之前，iptables 对流入的 IP包 还设置了一个“标志”（set-xmark）。这个标志的作用，我们下次再说。

而 DNAT 规则的作用，就是在 PREROUTING 检查点之前，也就是在路由之前，将流入 IP 包的目的地址和端口，改成 `--to-destination` 所指定的新的目的地址和端口。可以看到，这个目的地址和端口，正是被代理 Pod 的 IP 地址和端口。

这样，访问 Service VIP 的 IP 包经过上述 iptables 处理之后，就已经变成了访问具体某一个后端 Pod 的 IP 包了。不难理解，这些 Endpoints 对应的 iptables 规则，正是 kube-porxy 通过监听 Pod 的变化事件，在宿主机上生成并维护的。

以上，就是 Service 工作的基本原理。

通过上面的讲解，我们可以发现其实 kube-proxy 通过 iptables 处理 Service 的过程，其实需要在宿主机上设置相当多的 iptables 规则。而且，kube-proxy 还需要在控制循环里不断刷新这些规则来确保它们是正确的。

不难想到，当宿主机上有大量 Pod 时，成本上千条 iptables 规则不断地被刷新，会大量占用该宿主机的 CPU 资源，甚至会让宿主机“卡”在这个过程中。所以说，**一直以来，基于 iptables 的 Service 实现，都是制约 Kubernetes 项目承载更多量级的 Pod 的主要障碍。**

而下面提到的 ipvs 模式，就是解决这个问题的一个行之有效的办法。
## IPVS 模式
当集群规模比较大时，iptables 规则刷新会非常慢，难以支持大规模集群，因其底层路由表的实现是链表，对路由规则的增删改查都要涉及遍历一次链表，IPVS 的问世正是解决此问题的，IPVS 是 LVS 的负载均衡模块，与 iptables 比较像的是，IPVS 的实现虽然也基于 netfilter 的钩子函数，但是它却使用哈希表作为底层的数据结构并且工作在内核态，也就是说 IPVS 在重定向流量和同步代理规则有着更好的性能，几乎允许无限的规模扩张。

ipvs 支持三种负载均衡模式：DR模式（Direct Routing）、NAT 模式（Network Address Translation）、Tunneling（也称 ipip 模式）。三种模式中只有 NAT 支持端口映射，所以 ipvs 使用 NAT 模式。linux 内核原生的 ipvs 只支持 DNAT，当在数据包过滤，SNAT 和支持 NodePort 类型的服务这几个场景中ipvs 还是会使用 iptables。

此外，ipvs 也支持更多的负载均衡算法，例如：
* rr：round-robin/轮询
* lc：least connection/最少连接
* dh：destination hashing/目标哈希
* sh：source hashing/源哈希
* sed：shortest expected delay/预计延迟时间最短
* nq：never queue/从不排队

IPVS 模式的工作原理，其实跟 iptables 模式类似。当我们创建了前面的 Service 之后，kube-proxy 首先会在宿主机上创建一个虚拟网卡（叫做：kube-ipvs0），并为它分配 Service VIP 作为 IP 地址，如下所示：
```
# ip addr
  ...
  73：kube-ipvs0：<BROADCAST,NOARP>  mtu 1500 qdisc noop state DOWN qlen 1000
  link/ether  1a:ce:f5:5f:c1:4d brd ff:ff:ff:ff:ff:ff
  inet 10.0.1.175/32  scope global kube-ipvs0
  valid_lft forever  preferred_lft forever
```

而接下来，kube-proxy 就会通过 Linux 的 IPVS 模块，为这个 IP 地址设置三个 IPVS 虚拟主机，并设置这三个虚拟主机之间使用轮询模式（rr）来作为负载均衡策略。我们可以通过 ipvsadm 命令来查看到这个设置，如下所示：
```
# ipvsadm -ln
 IP Virtual Server version 1.2.1 (size=4096)
  Prot LocalAddress:Port Scheduler Flags
    ->  RemoteAddress:Port           Forward  Weight ActiveConn InActConn     
  TCP  10.102.128.4:80 rr
    ->  10.244.3.6:9376    Masq    1       0          0         
    ->  10.244.1.7:9376    Masq    1       0          0
    ->  10.244.2.3:9376    Masq    1       0          0
```

可以看到，这三个 IPVS 虚拟主机的 IP 地址和端口，对应的正是三个被代理的 Pod。

这时候，任何发往 10.102.128.4:80 的请求，就都会被 IPVS 模块转发到某一个后端 Pod 上了。

相比于 iptables，IPVS 在内核中的实现其实也是基于 Netfilter 的 NAT 模式，所以在转发这一层上，理论上 IPVS 并没有显著的性能提升。但是，IPVS 并不需要在宿主机上为每个 Pod 设置 iptables 规则，而是把对这些规则的处理放到了内核态，从而极大降低了维护这些规则的代价。这也正印证了我们之前所说的，“将重要操作放到内核态”是提升性能的重要手段。

不过需要注意的是，IPVS 模块只负责上述的负载均衡和代理功能。而一个完整的 Service 流程正常工作所需要的包过滤、SNAT 等操作，还是要靠 iptables 来实现。只不过，这些辅助性的 iptables 规则数量有限，也不会随着 Pod 数量的增加而增加。

所以，在大规模集群里，我非常建议你为 kube-proxy 设置–proxy-mode=ipvs 来开启这个功能。它为 Kubernetes 集群规模带来的提升，还是非常巨大的。

## DNS
在 Kubernetes 中，Service 和 Pod 都会被分配对应的 DNS A 记录（从域名解析 IP 的记录）。

对于 ClusterIP 模式的 Service 来说（比如我们上面的例子），它的 A 记录的格式是：..svc.cluster.local。当你访问这条 A 记录的时候，它解析到的就是该 Service 的 VIP 地址。

而对于指定了 clusterIP=None 的 Headless Service 来说，它的 A 记录的格式也是：..svc.cluster.local。但是，当你访问这条 A 记录的时候，它返回的是所有被代理的 Pod 的 IP 地址的集合。当然，如果你的客户端没办法解析这个集合的话，它可能会只会拿到第一个 Pod 的 IP 地址。

此外，对于 ClusterIP 模式的 Service 来说，它代理的 Pod 被自动分配的 A 记录的格式是：..pod.cluster.local。这条记录指向 Pod 的 IP 地址。

而对 Headless Service 来说，它代理的 Pod 被自动分配的 A 记录的格式是：...svc.cluster.local。这条记录也指向 Pod 的 IP 地址。

但如果你为 Pod 指定了 Headless Service，并且 Pod 本身声明了 hostname 和 subdomain 字段，那么这时候 Pod 的 A 记录就会变成：<pod 的 hostname>...svc.cluster.local，比如：
```yaml
apiVersion: v1
kind: Service
metadata:
  name: default-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo
    port: 1234
    targetPort: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: default-subdomain
  containers:
  - image: busybox
    command:
      - sleep
      - "3600"
    name: busybox
```

在上面这个 Service 和 Pod 被创建之后，你就可以通过 `busybox-1.default-subdomain.default.svc.cluster.local` 解析到这个 Pod 的 IP 地址了。

需要注意的是，在 Kubernetes 里，`/etc/hosts` 文件是单独挂载的，这也是为什么 kubelet 能够对 hostname 进行修改并且 Pod 重建后依然有效的原因。这跟 Docker 的 Init 层是一个原理。