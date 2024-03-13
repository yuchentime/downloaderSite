import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "小红书笔记工具箱",
  description: "小红书笔记批量打包下载 | 视频下载 | 免费下载 | 图片文字提取",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cn">
    <head>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-3WGZW7MJWK"></script>
      <script async src="../../utils/webanalytics.js"></script>
    </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
