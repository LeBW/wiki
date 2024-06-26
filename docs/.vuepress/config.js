module.exports = {
  title: 'LBW\'s Wiki Pages',
  description: 'Organize all of my knowledge.',
  base: '/',
  head: [
    ['link', { rel: 'icon', href: `/lbw-wiki.png` }],
  ],
  host: '0.0.0.0',
  themeConfig: {
    nav: require('./nav.js'),
    sidebarDepth: 2,
    sidebar: {
      '/backend/tomcat/': getTomcatSidebar(),
      '/backend/jetty/': getJettySidebar(),
      '/backend/database/': getDatabaseSidebar(),
      '/language/c/': getCSidebar(),
      '/frontend/': getFrontendSidebar(),
      '/linux/': getLinuxSidebar(),
      '/operating-system/': getOperatingSystemSidebar(),
      '/language/java/': getJavaSidebar(),
      '/kubernetes/': getKubernetesSidebar(),
      '/devops/': getDevOpsSidebar(),
      '/circumvent-internet/': getCircumventSidebar(),
      '/microservice/': getMicroserviceSidebar(),
      '/backend/spring/': getSpringSidebar(),
      '/distributed-system/': getDistributedSystemSidebar(),
      '/computer-network/': getComputerNetworkSidebar(),
      '/algorithm/': getAlgorithmSidebar(),
      '/docker/': getDockerSidebar(),
      '/backend/redis/': getRedisSidebar(),
    },
  },
}

function getTomcatSidebar() {
  return [
    'tomcat',
    'servlet',
    'jsp',
  ]
}

function getJettySidebar() {
  return [
    'jetty',
  ]
}

function getDatabaseSidebar() {
  return [
    'theory',
    'jdbc',
    'mysql',
    'database-index',
    'mongo',
  ]
}

function getCSidebar() {
  return [
    'standard-library',
    'string-operation',
    'memory-operation',
    'file-operation',
  ]
}

function getFrontendSidebar() {
  return [
    'http',
    'css',
    'javascript',
    'ajax',
    'same-origin',
  ]
}

function getLinuxSidebar() {
  return [
    'common-command',
    'file-system',
    'vim-config',
  ]
}

function getOperatingSystemSidebar() {
  return [
    'process',
    'context-switch',
    'schedule',
    'ipc',
    'process-thread',
    'deadlock',
    'memory-management',
    'file-system',
    'io',
  ]
}

function getJavaSidebar() {
  return [
    'grammer',
    'jvm',
    'classload',
    'memory-management',
    'four-references',
    'garbage-collection',
    'jmm',
    'hashmap',
    'arrayssort',
    'string',
    'reflection',
    'javaio',
    'concurrent-base',
    'shared-resources',
    'thread-pool',
  ]
}


function getKubernetesSidebar() {
  return [
    'overview',
    'core-components',
    'service',
    'ingress',
    'scheduler',
    'create-cluster',
    'create-nfs',
    'storageclass-nfs',
  ]
}

function getDevOpsSidebar() {
  return [
    'DevOps之团队结构',
    'DevOps之代码管理',
    'jenkins-installation',
  ]
}

function getCircumventSidebar() {
  return [
    'circumvent-internet',
  ]
}

function getMicroserviceSidebar() {
  return [
    'SOA',
  ]
}

function getSpringSidebar() {
  return [
    'spring-boot',
    'spring-data',
    'spring-security',
    'filter-listener-intecepter',
    'cross-domain'
  ]
}

function getDistributedSystemSidebar() {
  return [
    'cap',
    'distributed-transaction',
  ]
}

function getComputerNetworkSidebar() {
  return [
    'http',
    'tcp',
    'udp',
    'ip',
  ]
}

function getAlgorithmSidebar() {
  return [
    'sort',
    'binary-search-tree',
  ]
}

function getDockerSidebar() {
  return [
    'container',
    'practice',
  ]
}

function getRedisSidebar() {
  return [
    'basis',
    'cluster',
  ]
}