import DownloaderInput from "@/components/DownloaderInput";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { lazy } from "react";
const XiaohongshuPageByLazy = lazy(() => import("@/components/XHSInstructionsPage"));
const FirendLinkByLazy = lazy(() => import("@/components/FriendLink"));

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <div className="bg-gray-800 text-white">
        <div className="navbar w-1/2 mx-auto">
          <div className="navbar-start"></div>
          <div className="navbar-end hidden lg:flex text-sm">
            <FirendLinkByLazy />
          </div>
        </div>
        <div className="divider w-1/2 mx-auto my-0"></div>
        <div className="w-5/6 lg:w-1/2 mx-auto lg:mt-16 text-center">
          <h1 className="lg:text-3xl font-bold tracking-tight text-white text-xl">
            小红书笔记一键打包下载
          </h1>
          <p className=" text-white text-sm">
            zip格式打包下载小红书视频、图片及文本
          </p>
        </div>
        <DownloaderInput />
      </div>
      <div className="mt-4 lg:mt-16 border-solid border-stone-900">
        <XiaohongshuPageByLazy />
      </div>
    </>
  );
}
