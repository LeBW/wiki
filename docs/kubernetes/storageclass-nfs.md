# 利用NFS创建StorageClass

首先将[kubernetes-incubator/external-storage](https://github.com/kubernetes-incubator/external-storage)仓库拉取至master节点中。
```
git clone https://github.com/kubernetes-incubator/external-storage
```

然后分别执行以下命令创建相应的deployemnt, service等
```
kubectl create -f deploy/kubernetes/deployment.yaml
kubectl create -f deploy/kubernetes/rbac.yaml
kubectl create -f deploy/kubernetes/class.yaml
```

最后利用`claim.yaml`测试是否成功.

```bash
kubectl create -f deploy/kubernetes/claim.yaml #创建PVC
```
等待大概一分钟左右，会自动创建相应的PV。
如果删除掉该PVC，则对应的PV也会自动被删除。

可以用以下命令将StorageClass设置为默认的StorageSlass
```bash
kubectl patch storageclass <storage-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"true"}}}'
```

与此类似，使用以下命令可以将其取消为默认StorageClass
```bash
kubectl patch storageclass <storage-class-name> -p '{"metadata": {"annotations":{"storageclass.kubernetes.io/is-default-class":"false"}}}'
```

[参考资料](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs)
