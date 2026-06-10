import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "LBW's Wiki Pages",
  description: 'Organize all of my knowledge.',
  base: '/',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', href: '/lbw-wiki.png' }],
  ],
  themeConfig: {
    nav: [
      {
        text: '概览',
        link: '/overview/',
      },
      {
        text: '基础知识',
        items: [
          { text: '数据结构与算法', link: '/algorithm/' },
          { text: '操作系统', link: '/operating-system/' },
          { text: '计算机网络', link: '/computer-network/' },
          { text: '分布式系统', link: '/distributed-system/' },
        ],
      },
      {
        text: '编程语言',
        items: [
          { text: 'Java', link: '/language/java/' },
          { text: 'C/C++', link: '/language/c/' },
        ],
      },
      {
        text: '后端',
        items: [
          { text: 'Tomcat', link: '/backend/tomcat/' },
          { text: 'Jetty', link: '/backend/jetty/' },
          { text: 'Spring', link: '/backend/spring/' },
          { text: '数据库', link: '/backend/database/' },
          { text: 'Redis', link: '/backend/redis/' },
        ],
      },
      {
        text: '微服务',
        items: [
          { text: '微服务架构', link: '/microservice/' },
          { text: 'Docker', link: '/docker/' },
          { text: 'Kubernetes', link: '/kubernetes/' },
        ],
      },
      {
        text: '其他',
        items: [
          { text: '前端', link: '/frontend/' },
          { text: 'Linux', link: '/linux/' },
          { text: 'Dev-Ops', link: '/devops/' },
          { text: '科学上网', link: '/circumvent-internet/' },
        ],
      },
      {
        text: 'Blog',
        link: 'https://lebw.github.io',
      },
      {
        text: 'Github',
        link: 'https://github.com/lebw/my-wiki',
      },
    ],
    sidebar: {
      '/backend/tomcat/': [
        { text: 'Tomcat', link: '/backend/tomcat/' },
        { text: 'Servlet', link: '/backend/tomcat/servlet' },
        { text: 'JSP', link: '/backend/tomcat/jsp' },
      ],
      '/backend/jetty/': [
        { text: 'Jetty', link: '/backend/jetty/' },
      ],
      '/backend/database/': [
        { text: '数据库理论', link: '/backend/database/theory' },
        { text: 'JDBC', link: '/backend/database/jdbc' },
        { text: 'MySQL', link: '/backend/database/mysql' },
        { text: '数据库索引', link: '/backend/database/database-index' },
        { text: 'MongoDB', link: '/backend/database/mongo' },
      ],
      '/language/c/': [
        { text: '标准库', link: '/language/c/standard-library' },
        { text: '字符串操作', link: '/language/c/string-operation' },
        { text: '内存操作', link: '/language/c/memory-operation' },
        { text: '文件操作', link: '/language/c/file-operation' },
      ],
      '/frontend/': [
        { text: 'HTTP', link: '/frontend/http' },
        { text: 'CSS', link: '/frontend/css' },
        { text: 'JavaScript', link: '/frontend/javascript' },
        { text: 'Ajax', link: '/frontend/ajax' },
        { text: '同源策略', link: '/frontend/same-origin' },
      ],
      '/linux/': [
        { text: '常用命令', link: '/linux/common-command' },
        { text: '文件系统', link: '/linux/file-system' },
        { text: 'Vim 配置', link: '/linux/vim-config' },
      ],
      '/operating-system/': [
        { text: '进程', link: '/operating-system/process' },
        { text: '上下文切换', link: '/operating-system/context-switch' },
        { text: '调度', link: '/operating-system/schedule' },
        { text: '进程间通信', link: '/operating-system/ipc' },
        { text: '进程与线程', link: '/operating-system/process-thread' },
        { text: '死锁', link: '/operating-system/deadlock' },
        { text: '内存管理', link: '/operating-system/memory-management' },
        { text: '文件系统', link: '/operating-system/file-system' },
        { text: 'IO', link: '/operating-system/io' },
      ],
      '/language/java/': [
        { text: '语法', link: '/language/java/grammer' },
        { text: 'JVM', link: '/language/java/jvm' },
        { text: '类加载', link: '/language/java/classload' },
        { text: '内存管理', link: '/language/java/memory-management' },
        { text: '四种引用', link: '/language/java/four-references' },
        { text: '垃圾回收', link: '/language/java/garbage-collection' },
        { text: 'JMM', link: '/language/java/jmm' },
        { text: 'HashMap', link: '/language/java/hashmap' },
        { text: 'Arrays.sort', link: '/language/java/arrayssort' },
        { text: 'String', link: '/language/java/string' },
        { text: '反射', link: '/language/java/reflection' },
        { text: 'Java IO', link: '/language/java/javaio' },
        { text: '并发基础', link: '/language/java/concurrent-base' },
        { text: '共享资源', link: '/language/java/shared-resources' },
        { text: '线程池', link: '/language/java/thread-pool' },
      ],
      '/kubernetes/': [
        { text: '概览', link: '/kubernetes/overview' },
        { text: '核心组件', link: '/kubernetes/core-components' },
        { text: 'Service', link: '/kubernetes/service' },
        { text: 'Ingress', link: '/kubernetes/ingress' },
        { text: 'Scheduler', link: '/kubernetes/scheduler' },
        { text: '搭建集群', link: '/kubernetes/create-cluster' },
        { text: '搭建NFS', link: '/kubernetes/create-nfs' },
        { text: 'NFS StorageClass', link: '/kubernetes/storageclass-nfs' },
      ],
      '/devops/': [
        { text: 'DevOps 团队结构', link: '/devops/DevOps之团队结构' },
        { text: 'DevOps 代码管理', link: '/devops/DevOps之代码管理' },
        { text: 'Jenkins 安装', link: '/devops/jenkins-installation' },
      ],
      '/circumvent-internet/': [
        { text: '科学上网', link: '/circumvent-internet/circumvent-internet' },
      ],
      '/microservice/': [
        { text: 'SOA', link: '/microservice/SOA' },
      ],
      '/backend/spring/': [
        { text: 'Spring Boot', link: '/backend/spring/spring-boot' },
        { text: 'Spring Data', link: '/backend/spring/spring-data' },
        { text: 'Spring Security', link: '/backend/spring/spring-security' },
        { text: 'Filter/Listener/Interceptor', link: '/backend/spring/filter-listener-intecepter' },
        { text: '跨域', link: '/backend/spring/cross-domain' },
      ],
      '/distributed-system/': [
        { text: 'CAP 定理', link: '/distributed-system/cap' },
        { text: '分布式事务', link: '/distributed-system/distributed-transaction' },
      ],
      '/computer-network/': [
        { text: 'HTTP', link: '/computer-network/http' },
        { text: 'TCP', link: '/computer-network/tcp' },
        { text: 'UDP', link: '/computer-network/udp' },
        { text: 'IP', link: '/computer-network/ip' },
      ],
      '/algorithm/': [
        { text: '排序', link: '/algorithm/sort' },
        { text: '二叉查找树', link: '/algorithm/binary-search-tree' },
      ],
      '/docker/': [
        { text: '容器', link: '/docker/container' },
        { text: '实践', link: '/docker/practice' },
      ],
      '/backend/redis/': [
        { text: '基础', link: '/backend/redis/basis' },
        { text: '集群', link: '/backend/redis/cluster' },
      ],
    },
  },
})
