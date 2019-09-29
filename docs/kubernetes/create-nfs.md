# 搭建NFS服务器
NFS（Network File System）是一种流行的分布式文件系统协议，使用户能够在服务器上挂载远程目录。下面是在Centos7系统上安装NFS的步骤。

## 安装nfs-utils
在所有需要共享文件夹的服务器上安装`nfs-utils`工具包。
```
yum install nfs-utils
```

## server端
首先创建需要被共享的文件夹
``` bash
mkdir /var/nfsshare
```
然后修改文件夹的权限
``` bash
chmod -R 755 /var/nfsshare  # -R表示递归地改变目录下的文件夹和文件
chown nfsnobody:nfsnobody /var/nfsshare
```
接下来启动相关服务，并且允许他们在开机时启动
``` bash
systemctl enable rpcbind
systemctl enable nfs-server
systemctl enable nfs-lock
systemctl enable nfs-idmap
systemctl start rpcbind
systemctl start nfs-server
systemctl start nfs-lock
systemctl start nfs-idmap
```
然后修改（创建）文件`/etc/exports`，以将目录共享在网络上。

在其中写入
```
/var/nfsshare   *(rw,sync,no_root_squash,no_all_squash)
```
如果还需要共享其他文件夹，例如`home`，继续在下面写入即可.
```
/home           *(rw,sync,no_root_squash,no_all_squash)
```

> 注意以上的*代表任何客户端都可以访问这些共享文件夹。这里也可以写入具体的IP地址，于是只有拥有相应IP的客户端才可以访问共享文件夹。

最后重启NFS服务
```
systemctl restart nfs-server
```

## client端
安装完`nfs-utils`后，首先创建用于挂载的文件夹。
```
mkdir -p /mnt/nfs/var/nfsshare
```

然后使用mount命令将目录挂载起来
``` bash 
# 其中10.141.212.146是server端的IP地址，需要改成自己的server端地址
mount -t nfs 10.141.212.146:/var/nfsshare /mnt/nfs/var/nfsshare/
```

这样就成功挂载。接下来可以使用df命令查看相关情况
```
[root@lbw-node-3 nfs]# df -kh
Filesystem               Size  Used Avail Use% Mounted on
/dev/mapper/centos-root   50G  4.2G   46G   9% /
devtmpfs                  12G     0   12G   0% /dev
/dev/sda1                497M  165M  332M  34% /boot
/dev/mapper/centos-home   48G   33M   48G   1% /home
...
tmpfs                    2.4G     0  2.4G   0% /run/user/0
10.141.212.146:/var/nfsshare   50G   45G  6.0G  89% /mnt/nfs/var/nfsshare
```

接下来需要在`/etc/fstab`文件添加相应条目，使客户端每次重启后无需重新挂载目录。
例如在这里，可以在其中添加如下条目
```
[...]
10.141.212.146:/var/nfsshare /mnt/nfs/var/nfsshare        nfs     defaults        0 0
```
至此就成功地在Centos7系统中安装了NFS文件系统。