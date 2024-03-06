import DownloaderInput from "@/components/DownloaderInput";
import XiaohongshuPage from "@/components/XHSInstructionsPage";
import Image from "next/image";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <>
      <SpeedInsights />
      <div className="bg-gray-800 text-white">
        <div className="navbar w-1/2 mx-auto">
          <div className="navbar-start">
            <Image src="/favicon.ico" width={24} height={24} className="mr-2" />
            <a className="text-xl">在线资源下载器</a>
          </div>
          {/* <div className="navbar-end hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li>
            <a>小红书</a>
          </li>
          <li>
            <a>抖音</a>
          </li>
        </ul>
      </div> */}
        </div>
        <div className="divider w-1/2 mx-auto my-0"></div>
        <div className="w-1/2 mx-auto mt-16 text-center">
          <h1 className="text-3xl font-bold tracking-tight  text-white">
            小红书笔记下载
          </h1>
          <p className=" text-white text-sm">
            小红书视频图片下载，同时支持提取图片内文本，最后以<b>zip压缩包</b>
            形式打包下载
          </p>
        </div>
        <DownloaderInput />
      </div>
      <div className="mt-24 border-solid border-stone-900">
        <XiaohongshuPage />
      </div>
    </>
  );
}
