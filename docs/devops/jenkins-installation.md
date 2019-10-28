# Jenkins安装与配置
## 在Centos上安装Jenkins
下面介绍在Centos系统下安装jenkins的步骤

首先需要安装Java

    yum install java

然后把Jenkins库添加到yum中，Jenkins将从这里下载安装

    wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo
    rpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key
    yum install jenkins

安装过程完成后，用以下命令启动Jenkins

    systemctl start jenkins

用以下命令查看Jenkins启动状态

    systemctl status jenkins

如果想开机自动启动jenkins，可以执行以下命令

    systemctl enable jenkins

Jenkins默认使用端口8080。可以通过访问 http://localhost:8080 来访问Jenkins。

Jenkins的配置文件存放在 `/etc/sysconfig/jenkins`，如果需要修改配置，可通过修改此文件完成。

## 在Jenkins中使用Docker
要在 Jenkins 中使用 Docker，首先需要安装相关插件。

1. 进入 Manage Jenkins -> Manage Plugins -> Avaliable.
2. 搜索 Docker，选择`Docker plugin`插件，勾选后点击 `Install without Restart`，等待插件安装完毕。

安装好插件后，需要进行相关配置。

1. 进入 `Manage Jenkins -> Configure System`。
2. 拉到最底部，点击 `Add a new cloud -> Docker`.
3. 点击 `Docker Cloud Detail`，在 Docker Host URL 中填写 `unix:///var/run/docker.sock`
4. 点击 Test Connection 测试是否能够连接本机上的 Docker Engine。
> 如果在 Test Connection 时出现权限不够的问题，可以在终端中执行 `chmod 777 /var/run/docker.sock`来修改文件的访问权限。
5. 勾选 `Enabled`

然后对 Docker Agent Template进行配置。

6. 点击 `Docker Agent Templates`，点击 `Add Docker Template`。
7. 在 Labels 中填入 `docker-agent`
8. 勾选 `Enabled`
9. 在 Name 中填入 `docker`.
10. 在 Docker Image 中填入 `benhall/dind-jenkins-agent:v2`。（该镜像来自[这里](https://hub.docker.com/r/benhall/dind-jenkins-agent/))
11. 点击 Container Settings，在volumes中填写 `/var/run/docker.sock:/var/run/docker.sock`. 该选项使我们创建的容器能够访问宿主机的 docker.sock
12. 在 Connect Method 中选择 `Connect with SSH`.因为这个镜像是基于 `Jenkins SSH Slave` image建立的，所以默认的SSH Key就能够处理认证问题。
13. 确认勾选了Enabled，点击保存。

至此 Docker配置完成，可以在 Pipeline中使用 Docker相关命令了。

## 参考资料
[Installing Jenkins on RedHat distributions](https://wiki.jenkins.io/display/JENKINS/Installing+Jenkins+on+Red+Hat+distributions)

[Build docker image in Jenkins](https://www.katacoda.com/courses/jenkins/build-docker-images#)

