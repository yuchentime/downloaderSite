import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import Navbar from '@/app/components/navbar/Navbar'
import CustomAlert from '@/app/components/CustomAlert'
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "小红书笔记采集站",
  description: "小红书笔记批量打包下载 | 视频下载 | 免费下载 | 图片文字提取",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cn">
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-3WGZW7MJWK"
        ></script>
        <script async src="@/app/utils/webanalytics.js"></script>
      </head>

      <body className={inter.className}>
        <div>
          <SpeedInsights />
          <CustomAlert/>
          <Navbar/>
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
