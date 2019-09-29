(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{290:function(s,a,t){"use strict";t.r(a);var e=t(38),n=Object(e.a)({},function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"搭建nfs服务器"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#搭建nfs服务器","aria-hidden":"true"}},[s._v("#")]),s._v(" 搭建NFS服务器")]),s._v(" "),t("p",[s._v("NFS（Network File System）是一种流行的分布式文件系统协议，使用户能够在服务器上挂载远程目录。下面是在Centos7系统上安装NFS的步骤。")]),s._v(" "),t("h2",{attrs:{id:"安装nfs-utils"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装nfs-utils","aria-hidden":"true"}},[s._v("#")]),s._v(" 安装nfs-utils")]),s._v(" "),t("p",[s._v("在所有需要共享文件夹的服务器上安装"),t("code",[s._v("nfs-utils")]),s._v("工具包。")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("yum install nfs-utils\n")])])]),t("h2",{attrs:{id:"server端"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#server端","aria-hidden":"true"}},[s._v("#")]),s._v(" server端")]),s._v(" "),t("p",[s._v("首先创建需要被共享的文件夹")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("mkdir")]),s._v(" /var/nfsshare\n")])])]),t("p",[s._v("然后修改文件夹的权限")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("chmod")]),s._v(" -R "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("755")]),s._v(" /var/nfsshare  "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# -R表示递归地改变目录下的文件夹和文件")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("chown")]),s._v(" nfsnobody:nfsnobody /var/nfsshare\n")])])]),t("p",[s._v("接下来启动相关服务，并且允许他们在开机时启动")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("systemctl "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" rpcbind\nsystemctl "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" nfs-server\nsystemctl "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" nfs-lock\nsystemctl "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("enable")]),s._v(" nfs-idmap\nsystemctl start rpcbind\nsystemctl start nfs-server\nsystemctl start nfs-lock\nsystemctl start nfs-idmap\n")])])]),t("p",[s._v("然后修改（创建）文件"),t("code",[s._v("/etc/exports")]),s._v("，以将目录共享在网络上。")]),s._v(" "),t("p",[s._v("在其中写入")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("/var/nfsshare   *(rw,sync,no_root_squash,no_all_squash)\n")])])]),t("p",[s._v("如果还需要共享其他文件夹，例如"),t("code",[s._v("home")]),s._v("，继续在下面写入即可.")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("/home           *(rw,sync,no_root_squash,no_all_squash)\n")])])]),t("blockquote",[t("p",[s._v("注意以上的*代表任何客户端都可以访问这些共享文件夹。这里也可以写入具体的IP地址，于是只有拥有相应IP的客户端才可以访问共享文件夹。")])]),s._v(" "),t("p",[s._v("最后重启NFS服务")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("systemctl restart nfs-server\n")])])]),t("h2",{attrs:{id:"client端"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#client端","aria-hidden":"true"}},[s._v("#")]),s._v(" client端")]),s._v(" "),t("p",[s._v("安装完"),t("code",[s._v("nfs-utils")]),s._v("后，首先创建用于挂载的文件夹。")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("mkdir -p /mnt/nfs/var/nfsshare\n")])])]),t("p",[s._v("然后使用mount命令将目录挂载起来")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 其中10.141.212.146是server端的IP地址，需要改成自己的server端地址")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("mount")]),s._v(" -t nfs "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.141")]),s._v(".212.146:/var/nfsshare /mnt/nfs/var/nfsshare/\n")])])]),t("p",[s._v("这样就成功挂载。接下来可以使用df命令查看相关情况")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("[root@lbw-node-3 nfs]# df -kh\nFilesystem               Size  Used Avail Use% Mounted on\n/dev/mapper/centos-root   50G  4.2G   46G   9% /\ndevtmpfs                  12G     0   12G   0% /dev\n/dev/sda1                497M  165M  332M  34% /boot\n/dev/mapper/centos-home   48G   33M   48G   1% /home\n...\ntmpfs                    2.4G     0  2.4G   0% /run/user/0\n10.141.212.146:/var/nfsshare   50G   45G  6.0G  89% /mnt/nfs/var/nfsshare\n")])])]),t("p",[s._v("接下来需要在"),t("code",[s._v("/etc/fstab")]),s._v("文件添加相应条目，使客户端每次重启后无需重新挂载目录。\n例如在这里，可以在其中添加如下条目")]),s._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[s._v("[...]\n10.141.212.146:/var/nfsshare /mnt/nfs/var/nfsshare        nfs     defaults        0 0\n")])])]),t("p",[s._v("至此就成功地在Centos7系统中安装了NFS文件系统。")])])},[],!1,null,null,null);a.default=n.exports}}]);