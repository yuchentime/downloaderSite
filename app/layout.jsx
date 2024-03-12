import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "小红书笔记工具盒",
  description: "小红书笔记打包下载 | 视频下载 | 免费下载 | 图片文字提取",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cn">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
