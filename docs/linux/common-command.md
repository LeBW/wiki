# Linux常用命令

## 查看系统相关命令

### 查看系统内核
三个命令可以用来查看系统内核以及其他信息。
#### 1. uname
uname 是用来查看系统信息的命令。用法： `uname [OPTION]...`. 当没有option时，视为`uname -s`.

* `-a` 打印所有信息
* `-s` 打印内核名称
* `-r` 打印内核发行版本
* ...其他见 `uname --help`

所以最直观的，可以用 `uname -r`来查看内核版本。

#### 2. cat /proc/version
`cat /proc/version` 可以打印系统版本信息。

#### 3. hostnamectl
`hostnamectl`是用来控制系统主机名称的工具，也可以用来打印系统相关信息。

### 查看系统版本
不同的Linux发行版系统所用的命令不太一样。比较通用的可以使用
```
cat /etc/*release
```

## 监控性能相关命令
### top
top命令用来监控Linux系统的性能，它可以实时地展示所有正在运行的进程，并且展示了CPU使用率，内存占用率等有用信息。

### vmstat
显示（虚拟）内存使用情况。

### ifconfig
显示和设置网卡（network interface）。

### tcpdump
用来对特定网卡抓包，同时提供过滤等功能，也可以把包数据保存下来，以供后续分析。

### netstat
用来监控网络连接的状态。

### lscpu lsmem
分别可以用来查看CPU信息，内存信息。


## 查看文件（目录）大小

### ls
```bash
ls -lh filename 
```
* `-l`表示每个文件（目录）显示一行
* `-h`表示使用 human readable 的形式输出。
* 不可用于查看目录大小。

### du
```bash
du -sh <filename>/<directory name>
```
* `-s`表示只显示概要（也就是说当参数是目录的时候，不显示子目录信息）
* `-h`表示使用 human readable 的形式输出。
* 可用于查看文件和目录的大小。


## sed 命令
Sed是一个用于修改文件的特殊编辑器。如果你想要写一个程序来改变一个文件，sed是一个很合适的工具。

### s子命令
Sed含有几个命令，其中最常用的是s命令，用于字符替换。 `sed 's/old/new' `。

例如把文件中的`day`换成`night`可以使用如下命令

```bash
# 输入为文件old，输出到文件new
sed s/day/night/ <old >new 
# 输入为echo输出的值，输出到控制台
echo 'day' | sed 's/day/night/'
# Output: night
```

> 分隔符也可以使用`_ : | `等，特别是当你要替换的字符里包含`/`时，那就必须使用其他的分隔符了。

> 注意在使用分隔符的时候，必须包含**三个**，少一个都不行。

### 支持正则表达式
sed命令支持正则表达式，-r参数可以使其支持扩展的正则表达式(extended regular expressions)
&用来指代寻到的pattern。(Mac OS上是-E）.
```bash
$ echo '123 abc' | sed -r 's/[0-9]+/(&)/'
(123) abc
```

### 全局替换
`/g`用于全局替换。Sed在默认情况下只会对**每一行**的第一次配对成功的字符串进行替换。在替换的最后加上/g可以使所有匹配的字符串被替换.
```bash
$ echo 'abc abc' | sed 's/abc/123/'
123 abc
$ echo 'abc abc' | sed 's/abc/123/g'
123 123
```

## 查看端口使用情况
查看端口使用情况，一般使用两个命令：`netstat`或者`lsof`. 其中`netstat`是要一个用于监控网络的工具，而`lsof`是一个用于列出被某一个具体线程所打开的文件的工具。

### netstat
* 用于监控网络连接状况，路由表等
* 一般使用格式为 `netstat -nlp | grep <port-number>`
* 其中`-n`代表以数字形式输出，`-l`代表显示正在监听的网络连接，`-p`代表显示与该连接对应的进程号和进程名
* `grep`用于筛选出我们需要的端口号。
> 以上是 Linux 系统中的`netstat`，与 Mac 中不一样。Mac中可以使用`netstat -na | grep <port-number>`来检查。

查看各个端口的连接数情况
```
netstat -ant | awk '/^tcp/{print $4}' | awk -F: '{print $(NF)}' | sort | uniq -c | sort -nr | head
```

### lsof
* 全称是 `list open files`，用于列出被某一个具体进程所打开的文件。这里的文件是广义上的文件，包括常规文件、目录、库、流或者网络文件（网络套接字，NFS文件，Unix域套接字等）。
* 直接输入`lsof`,会列出所有活跃进程打开的文件。
* 要查看占用某特定端口的进程，使用命令`lsof -i :<port-number>`.
* `-i [i]`的作用：
    * 列出网络地址符合一定规律的`network file`。该规律以`[i]`的格式展现。
    * `[i]`的格式：`[46][protocol][@hostname|hostaddr][:service|port]`
    * 其具体含义为：
    ```
    46 specifies the IP version, IPv4 or IPv6
        that applies to the following address.
        '6' may be be specified only if the UNIX
        dialect supports IPv6.  If neither '4' nor
        '6' is specified, the following address
        applies to all IP versions.
    protocol is a protocol name - TCP, UDP
    hostname is an Internet host name.  Unless a
        specific IP version is specified, open
        network files associated with host names
        of all versions will be selected.
    hostaddr is a numeric Internet IPv4 address in
        dot form; or an IPv6 numeric address in
        colon form, enclosed in brackets, if the
        UNIX dialect supports IPv6.  When an IP
        version is selected, only its numeric
        addresses may be specified.
    service is an /etc/services name - e.g., smtp -
        or a list of them.
    port is a port number, or a list of them.
    ```
    * 举例如下：
        * `-i6` - IPv6 only
        * `TCP:25` - TCP and port 25
        * `@1.2.3.4` - Internet IPv4 host address 1.2.3.4
        * `@[3ffe:1ebc::1]:1234` - Internet IPv6 host address 3ffe:1ebc::1, port 1234
        * `UDP:who` - UDP who service port
        * `TCP@lsof.itap:513` - TCP, port 513 and host name lsof.itap
        * `tcp@foo:1-10,smtp,99` - TCP, ports 1 through 10, service name smtp, port 99, host name foo
        * `tcp@bar:1-smtp - TCP`, ports 1 through smtp, host bar
        * `:time` - either TCP, UDP or UDPLITE time service port