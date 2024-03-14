import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import Navbar from "@/app/components/navbar/Navbar";
import CustomAlert from "@/app/components/CustomAlert";
import Script from "next/script";
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
        <Script
          id="clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
                          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                      })(window, document, "clarity", "script", "lglphlpsb8");`,
          }}
        />
      </head>

      <body className={inter.className}>
        <div>
          <SpeedInsights />
          <CustomAlert />
          <Navbar />
        </div>
        <div>{children}</div>
      </body>
    </html>
  );
}
