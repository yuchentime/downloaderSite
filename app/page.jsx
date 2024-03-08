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
            {/* <Image src="/favicon.ico" width={24} height={24} className="mr-2" /> */}
            {/* <a className="text-xl">在线资源下载器</a> */}
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
