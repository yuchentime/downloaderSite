import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FirendLink from "@/app/components/FriendLink";
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
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-3WGZW7MJWK"
        ></script>
        <script async src="../../utils/webanalytics.js"></script>
      </head>

      <body className={inter.className}>
        <div>
          <SpeedInsights />
          <div className="bg-gray-800 text-white border-solid border-stone-900 bottom-2 shadow-xl">
            <div className="navbar w-1/2 mx-auto">
              <div className="navbar-start"></div>
              <div className="navbar-end hidden lg:flex text-sm">
                <FirendLink />
              </div>
            </div>
          </div>
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
