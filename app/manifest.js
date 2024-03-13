export default function manifest() {
    return {
      name: '小红书笔记工具箱',
      short_name: 'xhs',
      description: '小红书笔记批量打包下载 | 视频下载 | 免费下载 | 图片文字提取',
      start_url: '/',
      display: 'standalone',
      background_color: '#fff',
      theme_color: '#fff',
      icons: [
        {
          src: '/favicon.ico',
          sizes: 'any',
          type: 'image/x-icon',
        },
      ],
    }
  }