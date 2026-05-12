import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI 评测编年史',
  description: '大模型与 AI Agent 评测技术发展时间线',
  lang: 'zh-CN',
  cleanUrls: true,
  base: '/ai-eval-chronicle/',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/ai-eval-chronicle/favicon.svg' }],
  ],

  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide' },
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '概览', link: '/guide' },
          { text: '演进趋势', link: '/trends' },
          { text: '面临的挑战', link: '/challenges' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/xyluorui/ai-eval-chronicle' },
    ],

    footer: {
      message: '基于 CC BY-SA 4.0 许可发布',
      copyright: `© ${new Date().getFullYear()} AI 评测编年史`,
    },

    outline: {
      label: '页面导航',
    },

    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
})
