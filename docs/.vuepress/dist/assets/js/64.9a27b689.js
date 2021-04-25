(window.webpackJsonp=window.webpackJsonp||[]).push([[64],{479:function(e,r,t){"use strict";t.r(r);var s=t(45),v=Object(s.a)({},(function(){var e=this,r=e.$createElement,t=e._self._c||r;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"kubernetes-核心组件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kubernetes-核心组件"}},[e._v("#")]),e._v(" Kubernetes 核心组件")]),e._v(" "),t("p",[e._v("Kubernetes 的 Master 节点中有 3 个核心组件，分别是")]),e._v(" "),t("ul",[t("li",[e._v("API Server")]),e._v(" "),t("li",[e._v("Controller Manager")]),e._v(" "),t("li",[e._v("Scheduler。")])]),e._v(" "),t("p",[e._v("另外，Kubernetes 在每个节点上都有 kubelet 和 kube-proxy 两个组件。")]),e._v(" "),t("ul",[t("li",[e._v("kubelet 用于处理 Master 下发到本节点的任务，管理 Pod 及 Pod 中的容器。每个 kubelet 进程都会在 API Server 上注册节点自身的信息，定期向 Master 汇报节点资源的使用情况，并通过 cAdvisor 监控容器和节点资源。")]),e._v(" "),t("li",[e._v("kube-proxy 可以看作是 Service 的透明代理兼负载均衡器，其核心功能是将到某个 Service 的访问请求转发到后端的多个 Pod 实例上。")])]),e._v(" "),t("blockquote",[t("p",[e._v("具体内容，还是详见 Kubernetes权威指南 吧。。")])]),e._v(" "),t("h2",{attrs:{id:"kubelet"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kubelet"}},[e._v("#")]),e._v(" kubelet")]),e._v(" "),t("h2",{attrs:{id:"kube-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#kube-proxy"}},[e._v("#")]),e._v(" kube-proxy")]),e._v(" "),t("p",[e._v("上文已经提到 Service 实际的路由转发都是由 kube-proxy 组件来实现的，kube-proxy 主要实现了集群内部从 pod 到 service 和集群外部从 nodePort 到 service 的访问，kube-proxy 的路由转发规则是通过其后端的代理模块实现的，kube-proxy 的代理模块目前有四种实现方案，userspace、iptables、ipvs、kernelspace，（kernelspace 主要是在 windows 下使用的，这里暂且不谈）。")]),e._v(" "),t("p",[e._v("关于 Service 的实现细节，具体看 "),t("RouterLink",{attrs:{to:"/kubernetes/service.html"}},[e._v("Service实现原理")]),e._v(" 章节")],1)])}),[],!1,null,null,null);r.default=v.exports}}]);