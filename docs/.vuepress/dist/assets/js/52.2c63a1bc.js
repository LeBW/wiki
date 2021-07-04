(window.webpackJsonp=window.webpackJsonp||[]).push([[52],{465:function(e,n,a){"use strict";a.r(n);var t=a(45),v=Object(t.a)({},(function(){var e=this,n=e.$createElement,a=e._self._c||n;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"jenkins安装与配置"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#jenkins安装与配置"}},[e._v("#")]),e._v(" Jenkins安装与配置")]),e._v(" "),a("h2",{attrs:{id:"在centos上安装jenkins"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在centos上安装jenkins"}},[e._v("#")]),e._v(" 在Centos上安装Jenkins")]),e._v(" "),a("p",[e._v("下面介绍在Centos系统下安装jenkins的步骤")]),e._v(" "),a("p",[e._v("首先需要安装Java")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("yum install java\n")])])]),a("p",[e._v("然后把Jenkins库添加到yum中，Jenkins将从这里下载安装")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("wget -O /etc/yum.repos.d/jenkins.repo http://pkg.jenkins-ci.org/redhat-stable/jenkins.repo\nrpm --import https://jenkins-ci.org/redhat/jenkins-ci.org.key\nyum install jenkins\n")])])]),a("p",[e._v("安装过程完成后，用以下命令启动Jenkins")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("systemctl start jenkins\n")])])]),a("p",[e._v("用以下命令查看Jenkins启动状态")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("systemctl status jenkins\n")])])]),a("p",[e._v("如果想开机自动启动jenkins，可以执行以下命令")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",[a("code",[e._v("systemctl enable jenkins\n")])])]),a("p",[e._v("Jenkins默认使用端口8080。可以通过访问 http://localhost:8080 来访问Jenkins。")]),e._v(" "),a("p",[e._v("Jenkins的配置文件存放在 "),a("code",[e._v("/etc/sysconfig/jenkins")]),e._v("，如果需要修改配置，可通过修改此文件完成。")]),e._v(" "),a("p",[e._v("首次启动后，需要使用初始密钥，并且建议安装建议的插件。")]),e._v(" "),a("h2",{attrs:{id:"在-jenkins-中配置-jdk-maven-和-docker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在-jenkins-中配置-jdk-maven-和-docker"}},[e._v("#")]),e._v(" 在 Jenkins 中配置 JDK，Maven 和 Docker")]),e._v(" "),a("ul",[a("li",[e._v("对于Java应用来说，需要使用 JDK 包。同时还需要Maven 工具进行构建，于是需要在 Jenkins 中配置 JDK，Maven。")]),e._v(" "),a("li",[e._v("对于应用的发布，部署等，使用 Docker 容器化是一个好的方案，因此需要在 Jenkins 中配置 Docker。")])]),e._v(" "),a("p",[e._v("三者都是在 Manage Jenkins -> Global Tool Configuration 中进行配置。")]),e._v(" "),a("blockquote",[a("p",[e._v("配置 Docker 需要提前装好 Docker Commons Plugin 插件，不过只要在安装Jenkins时安装了建议的插件，就无需手动安装")])]),e._v(" "),a("h3",{attrs:{id:"jdk"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#jdk"}},[e._v("#")]),e._v(" JDK")]),e._v(" "),a("ul",[a("li",[e._v("在 Global Tool Configuration 中找到 JDK，点击 JDK Installations")]),e._v(" "),a("li",[e._v("点击 ADD JDK，Name中填写 "),a("code",[e._v("jdk-8u221")])]),e._v(" "),a("li",[e._v("勾选 "),a("code",[e._v("Install automatically")])]),e._v(" "),a("li",[e._v("点击 Add Installer，选择"),a("code",[e._v("Install from Java SE Development Kit from the website")]),e._v("，版本选择 8u221")]),e._v(" "),a("li",[e._v("根据提示输入 Oracle 账号密码。")]),e._v(" "),a("li",[e._v("点击 Apply 应用此配置。")])]),e._v(" "),a("h3",{attrs:{id:"maven"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#maven"}},[e._v("#")]),e._v(" Maven")]),e._v(" "),a("ul",[a("li",[e._v("在 Global Tool Configuration 中找到 Maven，点击 Maven Installations")]),e._v(" "),a("li",[e._v("点击 Add Maven，Name 填写 "),a("code",[e._v("mvn-3.6.2")])]),e._v(" "),a("li",[e._v("勾选 "),a("code",[e._v("Install automatically")])]),e._v(" "),a("li",[e._v("点击 Add Installer，选择 Install from Apache，选择版本"),a("code",[e._v("3.6.2")])]),e._v(" "),a("li",[e._v("点击 Apply 应用此配置")])]),e._v(" "),a("h3",{attrs:{id:"docker"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#docker"}},[e._v("#")]),e._v(" Docker")]),e._v(" "),a("ul",[a("li",[e._v("在 Global Tool Configuration 中找到 Docker，点击 Docker Installations")]),e._v(" "),a("li",[e._v("点击 Add Docker，Name中填写 "),a("code",[e._v("myDocker")])]),e._v(" "),a("li",[e._v("勾选 "),a("code",[e._v("Install automatically")])]),e._v(" "),a("li",[e._v("点击 Add Installer，版本选择 latest")]),e._v(" "),a("li",[e._v("点击 Apply 应用此配置。")])]),e._v(" "),a("blockquote",[a("p",[e._v("注意此方法是在 Jenkins 环境中安装 Docker Client，其默认还是与宿主机上的"),a("code",[e._v("/var/run/docker.sock")]),e._v("进行通信，因此需要保证Jenkins的宿主机上有可用的 Docker Engine")])]),e._v(" "),a("h2",{attrs:{id:"在-jenkins-中使用-docker-plugin-一般无需使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#在-jenkins-中使用-docker-plugin-一般无需使用"}},[e._v("#")]),e._v(" 在 Jenkins 中使用 Docker Plugin （一般无需使用）")]),e._v(" "),a("p",[e._v("这是除了以上方法外，另一种在 Jenkins 中使用Docker的方法，主要由Docker Plugin插件实现。由于配置比较麻烦，一般无需使用。")]),e._v(" "),a("ol",[a("li",[e._v("进入 Manage Jenkins -> Manage Plugins -> Avaliable.")]),e._v(" "),a("li",[e._v("搜索 Docker，选择"),a("code",[e._v("Docker plugin")]),e._v("插件，勾选后点击 "),a("code",[e._v("Install without Restart")]),e._v("，等待插件安装完毕。")])]),e._v(" "),a("p",[e._v("安装好插件后，需要进行相关配置。")]),e._v(" "),a("ol",[a("li",[e._v("进入 "),a("code",[e._v("Manage Jenkins -> Configure System")]),e._v("。")]),e._v(" "),a("li",[e._v("拉到最底部，点击 "),a("code",[e._v("Add a new cloud -> Docker")]),e._v(".")]),e._v(" "),a("li",[e._v("点击 "),a("code",[e._v("Docker Cloud Detail")]),e._v("，在 Docker Host URL 中填写 "),a("code",[e._v("unix:///var/run/docker.sock")])]),e._v(" "),a("li",[e._v("点击 Test Connection 测试是否能够连接本机上的 Docker Engine。")])]),e._v(" "),a("blockquote",[a("p",[e._v("如果在 Test Connection 时出现权限不够的问题，可以在终端中执行 "),a("code",[e._v("chmod 777 /var/run/docker.sock")]),e._v("来修改文件的访问权限。")])]),e._v(" "),a("ol",{attrs:{start:"5"}},[a("li",[e._v("勾选 "),a("code",[e._v("Enabled")])])]),e._v(" "),a("p",[e._v("然后对 Docker Agent Template进行配置。")]),e._v(" "),a("ol",{attrs:{start:"6"}},[a("li",[e._v("点击 "),a("code",[e._v("Docker Agent Templates")]),e._v("，点击 "),a("code",[e._v("Add Docker Template")]),e._v("。")]),e._v(" "),a("li",[e._v("在 Labels 中填入 "),a("code",[e._v("docker-agent")])]),e._v(" "),a("li",[e._v("勾选 "),a("code",[e._v("Enabled")])]),e._v(" "),a("li",[e._v("在 Name 中填入 "),a("code",[e._v("docker")]),e._v(".")]),e._v(" "),a("li",[e._v("在 Docker Image 中填入 "),a("code",[e._v("benhall/dind-jenkins-agent:v2")]),e._v("。（该镜像来自"),a("a",{attrs:{href:"https://hub.docker.com/r/benhall/dind-jenkins-agent/",target:"_blank",rel:"noopener noreferrer"}},[e._v("这里"),a("OutboundLink")],1),e._v(")")]),e._v(" "),a("li",[e._v("点击 Container Settings，在volumes中填写 "),a("code",[e._v("/var/run/docker.sock:/var/run/docker.sock")]),e._v(". 该选项使我们创建的容器能够访问宿主机的 docker.sock")]),e._v(" "),a("li",[e._v("在 Connect Method 中选择 "),a("code",[e._v("Connect with SSH")]),e._v(".因为这个镜像是基于 "),a("code",[e._v("Jenkins SSH Slave")]),e._v(" image建立的，所以默认的SSH Key就能够处理认证问题。")]),e._v(" "),a("li",[e._v("确认勾选了Enabled，点击保存。")])]),e._v(" "),a("p",[e._v("至此 Docker配置完成，可以在 Pipeline中使用 Docker相关命令了。")]),e._v(" "),a("h2",{attrs:{id:"参考资料"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#参考资料"}},[e._v("#")]),e._v(" 参考资料")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://wiki.jenkins.io/display/JENKINS/Installing+Jenkins+on+Red+Hat+distributions",target:"_blank",rel:"noopener noreferrer"}},[e._v("Installing Jenkins on RedHat distributions"),a("OutboundLink")],1)]),e._v(" "),a("p",[a("a",{attrs:{href:"https://www.katacoda.com/courses/jenkins/build-docker-images#",target:"_blank",rel:"noopener noreferrer"}},[e._v("Build docker image in Jenkins"),a("OutboundLink")],1)])])}),[],!1,null,null,null);n.default=v.exports}}]);