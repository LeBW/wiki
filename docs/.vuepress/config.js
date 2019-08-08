module.exports = {
  title: 'LBW\'s Wiki Pages',
  description: 'Organize all of my knowledge.',
  base: '/wiki/',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/'},
      { text: '概览', link: '/overview/'},
      {
        text: '编程语言',
        items: [
          {
            text: 'Java',
            link: '/language/java/',
          },
          {
            text: 'C/C++',
            link: '/language/c/',
          },
        ],
      },
      {
        text: '后端',
        items: [
          {
            text: 'Tomcat',
            link: '/backend/',
          },
          {
            text: 'Spring',
            link: '/backend/spring',
          }
        ],
      },
      { text: 'Blog', link: 'https://lebw.github.io'},
      { text: 'Github', link: 'https://github.com/lebw/my-wiki'},
    ],
    sidebar: {
      '/wiki/': getWikiSidebar(),
    },
  },
}

function getWikiSidebar() {
  return [
    'Operating Systems',
    'BackEnd',
    'Docker',
    'Kubernetes',
  ]
}
