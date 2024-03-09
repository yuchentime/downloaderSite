import DownloaderInput from "@/components/DownloaderInput";
import XiaohongshuPage from "@/components/XHSInstructionsPage";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <div className="bg-gray-800 text-white">
        <div className="navbar w-1/2 mx-auto">
          <div className="navbar-start">
          </div>
          <div className="navbar-end hidden lg:flex text-sm">
            友链：
            <a target="_blank" href="https://www.itdoc666.com/" className="text-white cursor-pointer">
              知识充电站-专业的资料分享平台
            </a>
          </div>
        </div>
        <div className="divider w-1/2 mx-auto my-0"></div>
        <div className="w-5/6 lg:w-1/2 mx-auto lg:mt-16 text-center">
          <h1 className="lg:text-3xl font-bold tracking-tight text-white text-xl">
            小红书笔记下载
          </h1>
          <p className=" text-white text-sm">
            zip格式打包下载小红书视频、图片及文本
          </p>
        </div>
        <DownloaderInput />
      </div>
      <div className="mt-4 lg:mt-16 border-solid border-stone-900">
        <XiaohongshuPage />
      </div>
    </>
  );
}
