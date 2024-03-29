# Service 与 Ingress
我们知道，将 Service 暴露给外面大概有三种方法：
1. 使用 NodePort 类型的 Service
2. 使用 LoadBalancer 类型的 Service。适用于公有云上的 Kubernetes 服务。
3. 在 1.7 之后，可以使用新特性，ExternalName，来将外网上的服务映射至集群内。

## NodePort
Nodeport 服务是引导外部流量到你的服务的最原始的方式。正如名字所示，它在所有节点（虚拟机）上开放一个特定端口，任何发送到该端口的流量都被转发到对应服务。
![node-port](./nodeport.png)

Nodeport 的实现原理与普通 Service 类似，都是 kube-proxy 通过增添 iptables 规则或者 ipvs 等来实现流量转发的，唯一的区别是对于 NodePort 类型的 Service，kube-proxy 还会在主机上监听该端口，并做转发。
> 其实对于 NodePort 类型的服务，会自动创建与之对应的 ClusterIP，只不过在其基础上再加上了一个从集群外部访问的方式。

该方法有一些局限性：
1. 每个端口只能是一种服务。
2. 端口范围只能是 30000-32767。
3. 如果节点的 IP 地址发生变化，服务的访问也会出现变化。

基于以上原因，一般不建议在生产环境下使用这种方式暴露服务。如果你运行的服务不要求一直可用，或者对成本比较敏感，你可以使用这种方法。这样的应用的最佳例子是 demo 应用，或者某些临时应用。
## LoadBalancer
LoadBalancer 是将服务暴露到外部的标准方式，这种方式需要云服务商的支持。例如，在 GKE 上，这种方式会启动一个 Network Load Balancer，它将给你一个单独的 IP 地址，转发所有的流量到你的服务。
![load-balancer](./load-balancer.png)

来自这个外部 load balancer 的流量会全部转发到你的服务上，云提供商会决定该如何做负载均衡。
> 注意，部分厂商允许用户在 yaml 中指定 loadbalancerIP。在这种情况下，可以确定负载均衡器的地址（也就是服务的访问地址）。但是也有些云厂商不支持定义 loadbalancerIP，因此会在运行时自动分配一个临时的 IP。

这个方式的最大缺点是每一个用 LoadBalancer 暴露的服务都会有它自己的 IP 地址，每个用到的 LoadBalancer 都需要付费，这将是非常昂贵的。
## Ingress

可以发现，对于第二种方式 LoadBalancer，由于每个服务都需要一个负载均衡服务，所以这个做法实际上既浪费，成本又高。作为用户，我们更希望 Kubernetes 为我内置一个全局的负载均衡器。然后，通过我访问的 URL，把请求转发给不同的后端 Service。

这种全局的，为了代理不同后端 Service 后端而设置的负载均衡服务，就是 Kubernetes 里面的 Ingress 服务。

所以，其实 Ingress 的作用很容易理解，就是 Service 的 “Service”。

举个例子，假如我现在有这样一个站点：https://cafe.example.com。其中，https://cafe.example.com/coffee，对应的是“咖啡点餐系统”。而，https://cafe.example.com/tea，对应的则是“茶水点餐系统”。这两个系统，分别由名叫 coffee 和 tea 这样两个 Deployment 来提供服务。

那么现在，我如何能使用 Kubernetes 的 Ingress 来创建一个统一的负载均衡器，从而实现当用户访问不同的域名时，能够访问到不同的 Deployment 呢？

上述功能，在 Kubernetes 里就需要通过 Ingress 对象来描述，如下所示：
```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: cafe-ingress
spec:
  tls:
  - hosts:
    - cafe.example.com
    secretName: cafe-secret
  rules:
  - host: cafe.example.com
    http:
      paths:
      - path: /tea
        backend:
          serviceName: tea-svc
          servicePort: 80
      - path: /coffee
        backend:
          serviceName: coffee-svc
          servicePort: 80
```

在上面这个名叫 cafe-ingress.yaml 文件中，最值得我们关注的，是 rules 字段。在 Kubernetes 里，这个字段叫作：IngressRule。

IngressRule 的 Key，就叫做：host。它必须是一个标准的域名格式（Fully Qualified Domain Name）的字符串，而不能是 IP 地址。

而 host 字段定义的值，就是这个 Ingress 的入口。这也就意味着，当用户访问 cafe.example.com 的时候，实际上访问到的是这个 Ingress 对象。这样，Kubernetes 就能使用 IngressRule 来对你的请求进行下一步转发。

而接下来 IngressRule 规则的定义，则依赖于 path 字段。你可以简单地理解为，这里的每一个 path 都对应一个后端 Service。所以在我们的例子里，我定义了两个 path，它们分别对应 coffee 和 tea 这两个 Deployment 的 Service（即：coffee-svc 和 tea-svc）。

通过上面的讲解，不难看到，所谓 Ingress 对象，其实就是 Kubernetes 项目对“反向代理”的一种抽象。

一个 Ingress 对象的主要内容，实际上就是一个“反向代理”服务（比如：Nginx）的配置文件的描述。而这个代理服务对应的转发规则，就是 IngressRule。

这就是为什么在每条 IngressRule 里，需要有一个 host 字段来作为这条 IngressRule 的入口，然后还需要有一系列 path 字段来声明具体的转发策略。这其实跟 Nginx、HAproxy 等项目的配置文件的写法是一致的。

而有了 Ingress 这样一个统一的抽象，Kubernetes 的用户就无需关心 Ingress 的具体细节了。

在实际的使用中，你只需要从社区里选择一个具体的 Ingress Controller，把它部署在 Kubernetes 集群里即可。

然后，这个 Ingress Controller 会根据你定义的 Ingress 对象，提供对应的代理能力。目前，业界常用的各种反向代理项目，比如 Nginx、HAProxy、Envoy、Traefik 等，都已经为 Kubernetes 专门维护了对应的 Ingress Controller。

接下来，我就以最常用的 Nginx Ingress Controller 为例，在我们前面用 kubeadm 部署的 Bare-metal 环境中，和你实践一下 Ingress 机制的使用过程。

部署 Nginx Ingress Controller 的方法非常简单，如下所示：

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
```

其中，在`mandatory.yaml`这个文件里，正是 Nginx 官方为你维护的 Ingress Controller 的定义。

可以看到，在上述 YAML 文件中，我们定义了一个使用 nginx-ingress-controller 镜像的 Pod。需要注意的是，这个 Pod 的启动命令需要使用该 Pod 所在的 Namespace 作为参数。而这个信息，当然是通过 Downward API 拿到的，即：Pod 的 env 字段里的定义（env.valueFrom.fieldRef.fieldPath）。

而这个 Pod 本身，就是一个监听 Ingress 对象以及它所代理的后端 Service 变化的控制器。

当一个新的 Ingress 对象由用户创建后，nginx-ingress-controller 就会根据 Ingress 对象里定义的内容，生成一份对应的 Nginx 配置文件（/etc/nginx/nginx.conf），并使用这个配置文件启动一个 Nginx 服务。

而一旦 Ingress 对象被更新，nginx-ingress-controller 就会更新这个配置文件。需要注意的是，如果这里只是被代理的 Service 对象被更新，nginx-ingress-controller 所管理的 Nginx 服务是不需要重新加载（reload）的。这当然是因为 nginx-ingress-controller 通过Nginx Lua方案实现了 Nginx Upstream 的动态配置。

此外，nginx-ingress-controller 还允许你通过 Kubernetes 的 ConfigMap 对象来对上述 Nginx 配置文件进行定制。这个 ConfigMap 的名字，需要以参数的方式传递给 nginx-ingress-controller。而你在这个 ConfigMap 里添加的字段，将会被合并到最后生成的 Nginx 配置文件当中。

**可以看到，一个 Nginx Ingress Controller 为你提供的服务，其实是一个可以根据 Ingress 对象和被代理后端 Service 的变化，来自动进行更新的 Nginx 负载均衡器。**

当然，为了让用户能够用到这个 Nginx，我们就需要创建一个 Service 来把 Nginx Ingress Controller 管理的 Nginx 服务暴露出去，如下所示：

```
$ kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/baremetal/service-nodeport.yaml
```

由于我们使用的是 Bare-metal 环境，所以 service-nodeport.yaml 文件里的内容，就是一个 NodePort 类型的 Service.
```yaml
apiVersion: v1
kind: Service
metadata:
  name: ingress-nginx
  namespace: ingress-nginx
  labels:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx
spec:
  type: NodePort
  ports:
    - name: http
      port: 80
      targetPort: 80
      protocol: TCP
    - name: https
      port: 443
      targetPort: 443
      protocol: TCP
  selector:
    app.kubernetes.io/name: ingress-nginx
    app.kubernetes.io/part-of: ingress-nginx

```

可以看到，这个 Service 的唯一工作，就是将所有携带 ingress-nginx 标签的 Pod 的 80 和 433 端口暴露出去。
> 而如果你是公有云上的环境，你需要创建的就是 LoadBalancer 类型的 Service 了。

上述操作完成后，我们可以记录下这个 Service 的访问入口，即：宿主机的地址和 NodePort 的端口，如下所示：
```
$ kubectl get svc -n ingress-nginx
NAME            TYPE       CLUSTER-IP     EXTERNAL-IP   PORT(S)                      AGE
ingress-nginx   NodePort   10.105.72.96   <none>        80:30044/TCP,443:31453/TCP   3h
```

当我们访问上面的端口时，该 Ingress Controller 就会帮我们将请求分发到相应的后端 Service。

不过，你可能会有一个疑问，如果我的请求没有匹配到任何一条 IngressRule，那么会发生什么呢？

首先，既然 Nginx Ingress Controller 是用 Nginx 实现的，那么它当然会为你返回一个 Nginx 的 404 页面。

不过，Ingress Controller 也允许你通过 Pod 启动命令里的–default-backend-service 参数，设置一条默认规则，比如：–default-backend-service=nginx-default-backend。

这样，任何匹配失败的请求，就都会被转发到这个名叫 nginx-default-backend 的 Service。所以，你就可以通过部署一个专门的 Pod，来为用户返回自定义的 404 页面了。

## 总结
在这篇文章里，我为你详细讲解了 Ingress 这个概念在 Kubernetes 里到底是怎么一回事儿。正如我在文章里所描述的，Ingress 实际上就是 Kubernetes 对“反向代理”的抽象。

目前，Ingress 只能工作在七层，而 Service 只能工作在四层。所以当你想要在 Kubernetes 里为应用进行 TLS 配置等 HTTP 相关的操作时，都必须通过 Ingress 来进行。

当然，正如同很多负载均衡项目可以同时提供七层和四层代理一样，将来 Ingress 的进化中，也会加入四层代理的能力。这样，一个比较完善的“反向代理”机制就比较成熟了。

而 Kubernetes 提出 Ingress 概念的原因其实也非常容易理解，有了 Ingress 这个抽象，用户就可以根据自己的需求来自由选择 Ingress Controller。比如，如果你的应用对代理服务的中断非常敏感，那么你就应该考虑选择类似于 Traefik 这样支持“热加载”的 Ingress Controller 实现。

更重要的是，一旦你对社区里现有的 Ingress 方案感到不满意，或者你已经有了自己的负载均衡方案时，你只需要做很少的编程工作，就可以实现一个自己的 Ingress Controller。

在实际的生产环境中，Ingress 带来的灵活度和自由度，对于使用容器的用户来说，其实是非常有意义的。要知道，当年在 Cloud Foundry 项目里，不知道有多少人为了给 Gorouter 组件配置一个 TLS 而伤透了脑筋。
