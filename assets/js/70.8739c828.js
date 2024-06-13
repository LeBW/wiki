(window.webpackJsonp=window.webpackJsonp||[]).push([[70],{520:function(s,a,t){"use strict";t.r(a);var e=t(45),c=Object(e.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h1",{attrs:{id:"容器原理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#容器原理"}},[s._v("#")]),s._v(" 容器原理")]),s._v(" "),t("p",[s._v("容器其实就是一种沙盒技术。顾名思义，沙盒就是能够像一个集装箱一样，把你的应用“装起来”的技术。这样，应用与应用之间，就因为有了边界而不至于互相干扰；而被装进集装箱的应用，也可以被方便的搬来搬去，这就是 PaaS 最理想的状态了。")]),s._v(" "),t("p",[s._v("容器技术的核心功能，就是通过约束和修改进程的动态表现，从而为其创造出一个“边界”。")]),s._v(" "),t("h2",{attrs:{id:"程序和进程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#程序和进程"}},[s._v("#")]),s._v(" 程序和进程")]),s._v(" "),t("p",[s._v("先来回顾一下什么是程序，什么是进程。")]),s._v(" "),t("h3",{attrs:{id:"程序"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#程序"}},[s._v("#")]),s._v(" 程序")]),s._v(" "),t("p",[s._v("由于计算机只认识 0 和 1，所以无论用什么语言编写代码，最后都要通过某种方式翻译成二进制文件，才能在计算机操作系统中运行起来。")]),s._v(" "),t("p",[s._v("而为了使这些代码正常运行，我们往往还需要给它提供数据。这些数据加上代码本身的二进制文件，放在磁盘上，就是我们平常所说的一个“程序”，也叫代码的可执行镜像（executable image）。")]),s._v(" "),t("h3",{attrs:{id:"进程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#进程"}},[s._v("#")]),s._v(" 进程")]),s._v(" "),t("p",[s._v("这时候，我们就可以在计算机上运行这个“程序了”。首先，操作系统从程序中发现输入数据保存在一个文件中，所以这些数据会被加载到内存中待命。同时，操作系统又读取到计算加法的指令，这时它需要指示 CPU 完成加法操作。而 CPU 与内存协作进行加法运算，又会使用寄存器存放数值、内存堆栈保存执行的变量和命令。同时，计算机里还有被打开的文件，以及各种各样的 IO 设备在不断地调用中修改自己的状态。")]),s._v(" "),t("p",[s._v("就这样，“程序”一旦被执行起来，它就从磁盘上的二进制文件，变成了计算机内存中的数据、寄存器中的值、堆栈中的指令、被打开的文件、以及各种设备的状态信息的一个集合。像这样一个程序运行起来后的计算机执行环境的总和，就是我们今天的主角：进程。")]),s._v(" "),t("p",[s._v("再回顾一下，容器技术的核心，就是通过约束和修改进程的动态表现，从而为其创造出一个“边界”。")]),s._v(" "),t("p",[s._v("对于 Docker 等大多数 Linux 容器来说，Cgroups 技术是用来创造约束的主要手段，而 Namespace 技术则是用来修改进程视图，进行资源隔离的主要办法。")]),s._v(" "),t("h2",{attrs:{id:"namespace"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#namespace"}},[s._v("#")]),s._v(" Namespace")]),s._v(" "),t("p",[s._v("Linux 内核中实现了 Namespace 技术，可以用来实现轻量级虚拟化（容器）服务。在同一个 Namespace 下的进程可以感知到彼此的变化，而对外界的进程一无所知。这样就可以让容器中的进程产生错觉，彷佛自己置身于一个独立的系统环境中，以达到独立和隔离的目的。")]),s._v(" "),t("p",[s._v("对于容器的资源隔离，我们一般会使用到 namespace 的 6 项隔离：")]),s._v(" "),t("table",[t("thead",[t("tr",[t("th",[s._v("namespace")]),s._v(" "),t("th",[s._v("系统调用参数")]),s._v(" "),t("th",[s._v("隔离内容")])])]),s._v(" "),t("tbody",[t("tr",[t("td",[s._v("UTS")]),s._v(" "),t("td",[s._v("CLONE_NEWUTS")]),s._v(" "),t("td",[s._v("主机名与域名")])]),s._v(" "),t("tr",[t("td",[s._v("IPC")]),s._v(" "),t("td",[s._v("CLONE_NEWIPC")]),s._v(" "),t("td",[s._v("信号量、消息队列和共享内存")])]),s._v(" "),t("tr",[t("td",[s._v("PID")]),s._v(" "),t("td",[s._v("CLONE_NEWPID")]),s._v(" "),t("td",[s._v("进程编号")])]),s._v(" "),t("tr",[t("td",[s._v("Network")]),s._v(" "),t("td",[s._v("CLONE_NEWNET")]),s._v(" "),t("td",[s._v("网络设备、网络栈、端口等")])]),s._v(" "),t("tr",[t("td",[s._v("Mount")]),s._v(" "),t("td",[s._v("CLONE_NEWNS")]),s._v(" "),t("td",[s._v("挂载点（文件系统）")])]),s._v(" "),t("tr",[t("td",[s._v("User")]),s._v(" "),t("td",[s._v("CLONE_NEWUSER")]),s._v(" "),t("td",[s._v("用户和用户组")])])])]),s._v(" "),t("h3",{attrs:{id:"namespace-使用方式"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#namespace-使用方式"}},[s._v("#")]),s._v(" Namespace 使用方式")]),s._v(" "),t("p",[s._v("而 Namespace 技术的使用方式也非常有意思：它其实是 Linux 创建新进程的一个可选参数。我们知道，在 Linux 中创建新进程的系统调用一般是 clone()，例如：")]),s._v(" "),t("div",{staticClass:"language-c extra-class"},[t("pre",{pre:!0,attrs:{class:"language-c"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" pid "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("clone")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("main_function"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" stack_size"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" SIGCHLD"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("NULL")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("p",[s._v("这个系统调用会为我们创建一个新的进程，并且返回它的进程号 pid。而当我们用这个系统调用创建一个新进程时，就可以在参数中指定相关参数，来使用 Namespace 技术。")]),s._v(" "),t("p",[s._v("例如，我们可以在参数中指定 "),t("code",[s._v("CLONE_NEWPID")]),s._v("，来进行进程空间的隔离")]),s._v(" "),t("div",{staticClass:"language-c extra-class"},[t("pre",{pre:!0,attrs:{class:"language-c"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" pid "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("clone")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("main_function"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" stack_size"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" CLONE_NEWPID "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("|")]),s._v(" SIGCHLD"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token constant"}},[s._v("NULL")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n")])])]),t("p",[s._v("这时，新创建的这个进程将会“看到”一个全新的进程空间，在这个进程空间内，它的 PID 是 1. 之所以说“看到”，是因为这只是一个“障眼法”，在宿主机真实的进程空间里，这个进程的 PID 还是真实的数值，比如说 100.")]),s._v(" "),t("p",[s._v("当然，我们可以多次执行上面的 clone() 调用，这样就会创建多个 PID Namespace，而每个 Namespace 里的应用进程，都会认为自己是当前容器里的第 1 号进程，他们既看不到宿主机里真正的进程空间，也看不到其他 PID Namespace 里的具体情况。")]),s._v(" "),t("p",[s._v("而除了我们刚刚用到的 PID Namespace，Linux 操作系统还提供了 Mount、UTS、IPC、Network 和 User 这些 Namespace，用来对各种不同的进程上下文进行“障眼法”操作。\n比如，Mount Namespace，用于让被隔离进程只看到当前 Namespace 里的挂载点信息；Network Namespace，用于让被隔离进程看到当前 Namespace 里的网络设备和配置。")]),s._v(" "),t("p",[s._v("这，就是 Linux 容器最基本的实现原理了。\n所以，Docker 容器这个听起来玄而又玄的概念，实际上是在创建容器进程时，指定了这个进程所需要启动的一组 Namespace 参数。这样，容器就只能“看”到当前 Namespace 所限定的资源、文件、设备、状态、或者配置。而对于宿主机以及其他不相关的程序，它就完全看不到了。")]),s._v(" "),t("p",[s._v("所以说，容器，其实就是一种特殊的进程而已。")]),s._v(" "),t("p",[s._v("上面我们介绍了 Linux 中用来实现“隔离”的技术手段：Namespace。而通过这些讲解，你应该能够明白：Namespace 技术实际上修改了应用进程看待整个计算机“视图”，即它的“视线”被操作系统做了限制，只能“看到”某些指定的内容。但对于宿主机来说，这些被“隔离”了的进程跟其他进程并没有太大区别。")]),s._v(" "),t("p",[s._v("说到底，Docker 本身并没有对应用进程进行隔离，也没有创建所谓的“容器”，而是通过宿主机的操作系统通过 Namespace 对应用进程进行隔离，通过 cgroups 对被隔离的应用进程限制相关资源属性（后面会讲）。")]),s._v(" "),t("p",[s._v("这样的架构也解释了为什么 Docker 项目比虚拟机更受欢迎的原因。\n这是因为，使用虚拟化技术作为应用沙盒，就必须要由 Hypervisor 来负责创建虚拟机，这个虚拟机是真实存在的，并且它里面必须运行一个完整的 Guest OS 才能执行用户的应用进程，这不可避免的带来额外的资源消耗和占用。")]),s._v(" "),t("p",[s._v("而相比之下，容器化后的用户应用，却依然还是宿主机上的一个普通进程，这就意味着因为虚拟化而带来的性能损耗都是不存在的；而另一方面，使用 Namespace 作为隔离手段的容器并不需要单独的 Guest OS，这就使得容器额外的资源占用几乎可以忽略不计。")]),s._v(" "),t("p",[s._v("所以说，“敏捷”和“高性能”是容器相较于虚拟机最大的优势，也是它能够在 PaaS 这种更细粒度的资源管理平台上大行其道的重要原因。")]),s._v(" "),t("h3",{attrs:{id:"不足"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#不足"}},[s._v("#")]),s._v(" 不足")]),s._v(" "),t("p",[s._v("不过，有利就有弊，基于 Linux Namespace 的隔离机制相比较虚拟化技术也有很多不足之处，其中最主要的问题就是："),t("strong",[s._v("隔离的不彻底。")])]),s._v(" "),t("p",[t("strong",[s._v("首先，既然容器只是运行在宿主机上的一种特殊进程，那么多个容器之间使用的就还是同一个宿主机的操作系统内核。")])]),s._v(" "),t("p",[s._v("尽管我们可以在容器里通过 Mount Namespace 单独挂载其他不同版本的操作系统文件，比如 CentOS 或 Ubuntu，但这并不能改变共享宿主机内核的事实。这意味着，如果我们要在 Windows 宿主机上运行 Linux 容器，或者在低版本的 Linux 宿主机上运行高版本的 Linux 容器，都是行不通的。")]),s._v(" "),t("blockquote",[t("p",[s._v("之所以可以在 Windows10 和 macOS 上运行 Docker，是因为在这些操作系统的 Docker 中，其实封装了一层 Linux 虚拟机")])]),s._v(" "),t("p",[t("strong",[s._v("其次，在 Linux 内核中，有很多资源和对象是不能被 Namespace 化的，最典型的例子就是 时间。")]),s._v("\n这就意味着，如果你的容器中的程序使用 settimeofday(2) 系统调用修改了时间，整个宿主机的时间都会被随之修改，这显然不符合用户的预期。相比于在虚拟机里面可以随便折腾的自由度，在容器里部署应用的时候，“什么能做，什么不能做”，就是用户必须考虑的一个问题。")]),s._v(" "),t("p",[t("strong",[s._v("此外，由于上述问题，尤其是共享宿主机内核的事实，容器给应用暴露出来的攻击面是相当大的，应用“越狱”的难度自然也比虚拟机低得多。")])]),s._v(" "),t("p",[s._v("所以，在生产环境中，没有人敢把运行在物理机上的 Linux 容器直接暴露到公网上。")]),s._v(" "),t("blockquote",[t("p",[s._v("当然，后续会讲到基于虚拟化或者独立内核技术的容器实现，则可以比较好地在隔离与性能之间做出平衡。")])]),s._v(" "),t("h2",{attrs:{id:"cgroups"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#cgroups"}},[s._v("#")]),s._v(" Cgroups")]),s._v(" "),t("p",[s._v("在介绍完容器的“隔离”技术之后，我们再来看一下容器的“限制”问题。")]),s._v(" "),t("p",[s._v("也许你会好奇，我们不是已经通过 Linux Namespace 创建了一个“容器”吗，为什么还需要对容器做“限制”呢？我还是以 PID Namespace 为例，来给你解释这个问题。")]),s._v(" "),t("p",[s._v("虽然容器内的第 1 号进程在“障眼法”的干扰下只能看到容器里的情况，但是宿主机上，它作为第 100 号进程与其他所有进程之间依然是平等的竞争关系。这就意味着，虽然第 100 号进程表面上被隔离了起来，但是它所能够使用到的资源（比如 CPU、内存），却是可以随时被宿主机上的其他进程（或者其他容器）占用的。当然，这个 100 号进程自己也可能把所有资源吃光。这些情况，显然都不是一个“沙盒”应该表现出来的合理行为。")]),s._v(" "),t("p",[t("strong",[s._v("而 Linux Cgroups 就是 Linux 内核中用来为进程设置资源限制的一个重要功能。")]),s._v("\nLinux Cgroups 的全称是 Linux Control Group。它最主要的作用，就是限制一个进程组能够使用的资源上限，包括 CPU、内存、磁盘、网络带宽等等。")]),s._v(" "),t("blockquote",[t("p",[s._v("此外，Cgroups 还能够对进程进行优先级设置、审计，以及将进程挂起和恢复等操作。现在，我们重点探讨它与容器关系最紧密的“限制”能力。")])]),s._v(" "),t("p",[s._v("那么在 Linux 中，该如何使用 Cgroups 呢？在 Linux 中，Cgroups 给用户暴露出来的操作接口是文件系统，即它以文件和目录的方式组织在操作系统的 "),t("code",[s._v("/sys/fs/cgroup/")]),s._v(" 路径下。我们可以用 "),t("code",[s._v("mount -t cgroup")]),s._v(" 命令将他们展示出来。")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("$ "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("mount")]),s._v(" -t cgroup \ncpuset on /sys/fs/cgroup/cpuset "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" cgroup "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("rw,nosuid,nodev,noexec,relatime,cpuset"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ncpu on /sys/fs/cgroup/cpu "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" cgroup "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("rw,nosuid,nodev,noexec,relatime,cpu"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\ncpuacct on /sys/fs/cgroup/cpuacct "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" cgroup "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("rw,nosuid,nodev,noexec,relatime,cpuacct"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nblkio on /sys/fs/cgroup/blkio "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" cgroup "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("rw,nosuid,nodev,noexec,relatime,blkio"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\nmemory on /sys/fs/cgroup/memory "),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("type")]),s._v(" cgroup "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("rw,nosuid,nodev,noexec,relatime,memory"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".\n")])])]),t("p",[s._v("可以看到，它的输出结果是一系列文件系统目录。可以看到，在 "),t("code",[s._v("/sys/fs/cgroup")]),s._v(" 下有很多诸如 cpuset，cpu，memory 这样的子目录，也叫"),t("strong",[s._v("子系统")]),s._v("。这些都是我这台机器当前可以被 Cgroups 进行限制的资源种类。而在子系统对应的资源种类下，你就可以看到该类资源具体可以被限制的方法。")]),s._v(" "),t("p",[s._v("我们可以在子系统（subsystem）中创建一个目录，这个目录就是一个“控制组”（control group），这个控制组可以用来对进程进行相应资源的限制。在极客时间的专栏里就有专门的"),t("a",{attrs:{href:"https://time.geekbang.org/column/article/14653",target:"_blank",rel:"noopener noreferrer"}},[s._v("教程"),t("OutboundLink")],1),s._v("，这里不展开了。")]),s._v(" "),t("p",[s._v("子系统其实就是 cgroups 的资源控制系统，每种子系统独立控制一种资源，目前 Docker 使用如下 9 种子系统，其中 net_cls 子系统在内核中已经广泛实现，但是 Docker 尚未采用，Docker 在网络方面的控制在后面会介绍。")]),s._v(" "),t("ul",[t("li",[s._v("blkio：可以为块设备设定 输入/输出 限制，比如物理驱动设备（包括磁盘，固态硬盘，USB 等）。")]),s._v(" "),t("li",[s._v("cpu：使用调度程序控制任务对 CPU 的使用。")]),s._v(" "),t("li",[s._v("cpuacct：自动生成 cgroup 中任务对 CPU 资源使用情况的报告。")]),s._v(" "),t("li",[s._v("cpuset：可以为 cgroup 中的任务分配独立的 CPU（此处针对多处理器系统）和内存。")]),s._v(" "),t("li",[s._v("devices：可以开启或关闭 cgroup 中任务对设备的访问。")]),s._v(" "),t("li",[s._v("freezer：可以挂起或恢复 cgroup 中的任务。")]),s._v(" "),t("li",[s._v("memory：可以设定 cgroup 中任务对内存使用量的限定，并且自动生成这些任务对内存资源使用情况的报告。")]),s._v(" "),t("li",[s._v("perf_event：使用后使 cgroup 中的任务可以进行统一的性能测试。")]),s._v(" "),t("li",[s._v("net_cls：Docker 没有直接使用它，它通过使用等级识别符（classid）标记网络数据包，从而允许 Linux 流量控制程序识别从具体 cgroup 中生成的数据包。")])]),s._v(" "),t("p",[s._v("在 Docker 的实现中，Docker daemon 会在单独挂载了每一个子系统的控制组目录（例如 "),t("code",[s._v("/sys/fs/cgroup/cpu")]),s._v(" 下创建一个名为 docker 的控制组，然后在 docker 控制组内，再为每个容器创建一个以容器 ID 命名的容器控制组，这个容器里的所有进程的进程号都会写进该控制组的"),t("code",[s._v("tasks")]),s._v("文件中，并且在控制文件（例如"),t("code",[s._v("cpu.cfs_quota_us")]),s._v("）中写入预设的限制参数值。")]),s._v(" "),t("p",[s._v("下图是查看 Docker 对 CPU 的限制情况，即"),t("code",[s._v("/sys/fs/cgroup/cpu/docker/")]),s._v(" 内的结构")]),s._v(" "),t("div",{staticClass:"language-bash extra-class"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("$ tree /sys/fs/cgroup/cpu/docker\n├── 5493674dfa875bbac4b8e653c92fa2e8453013ae63393805fd759e9064df67e9\n│   ├── cgroup.clone_children\n│   ├── cgroup.procs\n│   ├── cpuacct.stat\n│   ├── cpuacct.usage\n│   ├── cpuacct.usage_all\n│   ├── cpuacct.usage_percpu\n│   ├── cpuacct.usage_percpu_sys\n│   ├── cpuacct.usage_percpu_user\n│   ├── cpuacct.usage_sys\n│   ├── cpuacct.usage_user\n│   ├── cpu.cfs_period_us\n│   ├── cpu.cfs_quota_us\n│   ├── cpu.rt_period_us\n│   ├── cpu.rt_runtime_us\n│   ├── cpu.shares\n│   ├── cpu.stat\n│   ├── notify_on_release\n│   └── tasks\n├── cgroup.clone_children\n├── cgroup.procs\n├── cpuacct.stat\n├── cpuacct.usage\n├── cpuacct.usage_all\n├── cpuacct.usage_percpu\n├── cpuacct.usage_percpu_sys\n├── cpuacct.usage_percpu_user\n├── cpuacct.usage_sys\n├── cpuacct.usage_user\n├── cpu.cfs_period_us\n├── cpu.cfs_quota_us\n├── cpu.rt_period_us\n├── cpu.rt_runtime_us\n├── cpu.shares\n├── cpu.stat\n├── notify_on_release\n└── tasks\n")])])]),t("h3",{attrs:{id:"不足-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#不足-2"}},[s._v("#")]),s._v(" 不足")]),s._v(" "),t("p",[s._v("另外，与 Namespace 类似，Cgroups 对资源的限制能力也有很多不完善的地方，被提及最多的就是 "),t("code",[s._v("/proc")]),s._v(" 文件系统的问题。")]),s._v(" "),t("p",[s._v("众所周知，Linux 下的 /proc 目录存储的是记录当前内核运行状态的一系列特殊文件，用户可以通过访问这些文件，查看系统以及当前正在运行的进程的信息，比如 CPU 使用情况、内存占用率等，这些文件也是 top 指令查看系统信息的主要数据来源。")]),s._v(" "),t("p",[s._v("但是，如果我们在容器里执行 top 指令，会发现，它显示的信息居然是宿主机的 CPU 和内存数据，而不是当前容器的数据。")]),s._v(" "),t("p",[s._v("造成这个问题的原因是，/proc 文件系统并不知道用户通过 Cgroups 对这个容器做了什么样的资源限制，即：/proc 文件系统不了解 Cgroups 限制的存在。")]),s._v(" "),t("p",[s._v("在生产环境中，这个问题必须进行修正，否则应用程序在容器里读取到的 CPU 核数、可用内存等信息都是宿主机上的数据，这会给应用的运行带来非常大的困惑和风险。这也是在企业中，容器化应用碰到的一个常见问题，也是容器相较于虚拟机另一个不尽如人意的地方。")]),s._v(" "),t("p",[s._v("那么如何解决这个问题呢？我们可以使用 "),t("code",[s._v("lxcfs")]),s._v(" 工具。")]),s._v(" "),t("p",[s._v("top 是从 /prof/stats 目录下获取数据，所以道理上来讲，容器不挂载宿主机的该目录就可以了。lxcfs就是来实现这个功能的，做法是把宿主机的 /var/lib/lxcfs/proc/memoinfo 文件挂载到Docker容器的/proc/meminfo位置后。容器中进程读取相应文件内容时，LXCFS的FUSE实现会从容器对应的Cgroup中读取正确的内存限制。从而使得应用获得正确的资源约束设定。")]),s._v(" "),t("h2",{attrs:{id:"基于-rootfs-的文件系统"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#基于-rootfs-的文件系统"}},[s._v("#")]),s._v(" 基于 rootfs 的文件系统")]),s._v(" "),t("p",[s._v("未完待续。参考"),t("a",{attrs:{href:"https://time.geekbang.org/column/article/17921",target:"_blank",rel:"noopener noreferrer"}},[s._v("极客时间"),t("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=c.exports}}]);