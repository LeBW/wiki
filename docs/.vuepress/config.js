module.exports = {
  title: 'LBW\'s Wiki Pages',
  description: 'Organize all of my knowledge.',
  base: '/wiki/',
  head: [
    ['link', { rel: 'icon', href: `/lbw-wiki.png` }],
  ],
  themeConfig: {
    nav: require('./nav.js'),
    sidebar: {
      '/backend/tomcat/': getTomcatSidebar(),
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

function getDatabaseSidebar() {
  return [
    'theory',
    'jdbc',
    'mysql',
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
    'process-thread',
    'deadlock',
    'memory-management',
  ]
}

function getJavaSidebar() {
  return [
    'jvm',
    'memory-management',
    'garbage-collection',
    'hashmap',
  ]
}


function getKubernetesSidebar() {
  return [
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
  ]
}