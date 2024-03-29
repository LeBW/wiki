# Kubernetes 概览

Kubernetes 是容器编排的事实标准。先来看看 Kubernetes 的整体架构

![overview](./overview.png)

可以看到，Kubernetes 总体上是由 Master 和 Node 两种节点构成，这两种角色分别对应着控制节点和计算节点。

## Master
其中，控制节点（Master）由三个紧密协作的独立组件组合而成，它们分别是：
* 负责 API 服务的 kube-apiserver
* 负责调度的 kube-scheduler
* 负责容器编排的 kube-controller-manager。

整个集群的持久化数据，则由 kube-apiserver 处理后保存在 Etcd 中。

## Node
而计算节点（Node）上最核心的部分，则是一个叫做 kubelet 的组件。kubelet 主要负责同容器运行时（比如 Docker 项目）打交道。而这个交互所依赖的，是一个叫做 CRI（Container Runtime Interface）的远程调用接口，这个接口定义了容器运行时的各项核心操作，比如：启动一个容器所需要的所有参数。

这也是为何，Kubernetes 项目并不关心你部署的是什么容器运行时，使用的是什么技术实现的，只要你的容器运行时能够运行标准的容器镜像，它就可以通过实现 CRI 接入到 Kubernetes 项目中。

而具体的容器运行时，例如 Docker，则一般通过 OCI 这个容器运行时规范同底层的 Linux 操作系统交互，即：把 CRI 请求翻译成对 Linux 操作系统的调用（操作 Linux Namespace 和 Cgroups 等）。

此外，kubelet 还通过 gRPC 协议同一个叫做 Device Plugin 的插件进行交互。这个插件，是 Kubernetes 项目用来管理 GPU 等宿主机物理设备的主要组件，也是基于 Kubernetes 项目进行机器学习训练，高性能作业支持等工作必须关注的功能。

kubelet 的另外一个重要功能，是调用网络插件和存储插件为容器配置网络和持久化存储。这两个插件与 kubelet 进行交互的接口，分别是 CNI（Container Networking Interface）和 CSI（Container Storage Interface）。

## 总结
回过头来，我们发现，从一开始，Kubernetes 项目就没有像同时期的各种“容器云”项目那样，把 Docker 作为整个架构的核心，而仅仅把它作为最底层的一个容器运行时实现。
而 Kubernetes 要着重解决的问题，则来自于 Borg 的研究人员在论文中提到的一个非常重要的观点：**运行在大规模集群中的各种任务之间，实际上存在着各种各样的关系。这些关系的处理，才是作业编排和管理系统最困难的地方。**

Kubernetes 项目最主要的设计思想是，从更宏观的角度，以统一的方式来定义任务之间的各种关系，并且为将来支持更多种类的关系留有余地。

比如，Kubernetes 对容器间的“访问”进行了分类，首先总结出了一类非常常见的“紧密交互”的关系，即：这些应用之间需要非常频繁的交互或访问，又或者，它们直接通过本地文件进行信息交换。

在常规环境下，这类应用往往会被直接部署在同一台机器上，通过 localhost 通信，通过本地磁盘目录交换文件。而在 Kuberenetes 项目中，这些容器则会被划分为一个“Pod”，Pod 里的容器共享同一个 Network Namespace，同一组数据卷，从而达到高效率交换信息的目的。

> Pod 是 Kubernetes 中的最基础的对象，后面会详细描述。

而对于另外一种更为常见的需求，比如 Web 应用与数据库之间的访问关系，Kubernetes 项目则提供了一种叫作“Service”的服务。像这样的两个应用，往往故意不部署在同一台机器上，这样即使 Web 应用所在的机器宕机了，数据库也完全不受影响。可是，我们知道，对于一个容器来说，它的 IP 地址等信息不是固定的，那么 Web 应用又怎么找到数据库容器的 Pod 呢？

所以，Kubernetes 的做法是给 Pod 绑定一个 Service 服务，而 Service 服务声明的 IP 地址等信息是“终生不变”的。这个 Service 服务的主要作用，就是作为 Pod 的代理入口（Portal），从而代替 Pod 对外暴露一个固定的网络地址。

这样，对于 Web 应用的 Pod 来说，它需要关心的就是数据库 Pod 的 Service 信息。不难想象，Service 后端真正代理的 Pod 的 IP 地址、端口等信息的自动更新、维护，则是 Kubernetes 项目的职责。

像这样，围绕着容器和 Pod 不断向真实的技术场景扩展，我们就能够摸索出一幅如下所示的 Kubernetes 项目核心功能的“全景图”。

![landscape](./landscape.png)

按照这幅图的线索，我们从容器这个最基础的概念出发，首先遇到了容器间“紧密协作”关系的难题，于是就扩展到了 Pod；有了 Pod 之后，我们希望能一次启动多个应用的实例，这样就需要 Deployment 这个 Pod 的多实例管理器；而有了这样一组相同的 Pod 后，我们又需要通过一个固定的 IP 地址和端口以负载均衡的方式访问它，于是就有了 Service。

可是，如果现在两个不同 Pod 之间不仅有“访问关系”，还要求在发起时加上授权信息。最典型的例子就是 Web 应用对数据库访问时需要 Credential（数据库的用户名和密码）信息。那么，在 Kubernetes 中这样的关系又如何处理呢？

Kubernetes 项目提供了一种叫作 Secret 的对象，它其实是一个保存在 Etcd 里的键值对数据。这样，你把 Credential 信息以 Secret 的方式存在 Etcd 里，Kubernetes 就会在你指定的 Pod（比如，Web 应用的 Pod）启动时，自动把 Secret 里的数据以 Volume 的方式挂载到容器里。这样，这个 Web 应用就可以访问数据库了。

**除了应用与应用之间的关系外，应用运行的形态是影响“如何容器化这个应用”的第二个重要因素。**

为此，Kubernetes 定义了新的、基于 Pod 改进后的对象。比如 Job，用来描述一次性运行的 Pod（比如，大数据任务）；再比如 DaemonSet，用来描述每个宿主机上必须且只能运行一个副本的守护进程服务；又比如 CronJob，则用于描述定时任务等等。

如此种种，正是 Kubernetes 项目定义容器间关系和形态的主要方法。

在 Kubernetes 项目中，我们所推崇的使用方法是：
* 首先，通过一个“编排对象”，比如 Pod、Job、CronJob 等，来描述你试图管理的应用.
* 然后，再为它定义一些“服务对象”，比如 Service、Secret、Horizontal Pod Autoscaler（自动水平扩展器）等。这些对象，会负责具体的平台级功能。

这种使用方法，就是所谓的“声明式 API”。这种 API 对应的“编排对象”和“服务对象”，都是 Kubernetes 项目中的 API 对象（API Object）。

这就是 Kubernetes 最核心的设计理念.