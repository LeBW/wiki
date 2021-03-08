# Kubernetes 核心组件

Kubernetes 的 Master 节点中有 3 个核心组件，分别是 
* API Server
* Controller Manager
* Scheduler。


另外，Kubernetes 在每个节点上都有 kubelet 和 kube-proxy 两个组件。

* kubelet 用于处理 Master 下发到本节点的任务，管理 Pod 及 Pod 中的容器。每个 kubelet 进程都会在 API Server 上注册节点自身的信息，定期向 Master 汇报节点资源的使用情况，并通过 cAdvisor 监控容器和节点资源。
* kube-proxy 可以看作是 Service 的透明代理兼负载均衡器，其核心功能是将到某个 Service 的访问请求转发到后端的多个 Pod 实例上。

> 具体内容，还是详见 Kubernetes权威指南 吧。。
## kubelet

## kube-proxy
上文已经提到 Service 实际的路由转发都是由 kube-proxy 组件来实现的，kube-proxy 主要实现了集群内部从 pod 到 service 和集群外部从 nodePort 到 service 的访问，kube-proxy 的路由转发规则是通过其后端的代理模块实现的，kube-proxy 的代理模块目前有四种实现方案，userspace、iptables、ipvs、kernelspace，（kernelspace 主要是在 windows 下使用的，这里暂且不谈）。

关于 Service 的实现细节，具体看 [Service实现原理](./service.md) 章节