# Docker 实操
## Mac 容器如何访问主机网络
由于 Mac 的容器底层是用虚拟机实现的，因此容器无法使用 `--network host` 的方式与主机共享网络。
好在默认的桥接网络模式下，容器可以通过 NAT 来访问主机和外部网络。如果要访问主机，可以使用主机的特殊IP地址 `host.docker.internal`，这个地址会自动解析为主机的IP地址。
```bash
ping host.docker.internal
```