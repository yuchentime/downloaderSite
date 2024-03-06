"use client";
import * as React from "react";
import { generateRandomString } from "@/utils/helper";

const DownloaderInput = () => {
  const [targetUrls, setTargetUrls] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [downloadFailed, setDownloadFailed] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setDownloadFailed(false);
    }, 2000);
  }, [downloadFailed]);

  const handleClick = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const urls = extractUrl(targetUrls);
    if (!urls) {
      setTargetUrls("");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      console.log("下载超时");
      setIsLoading(false);
      setDownloadFailed(true);
    }, 15000);

    const response = await fetch(`/api/xhs?url=${JSON.stringify(urls)}`);
    if (response.ok) {
      const zipfilename = matchZipTile(targetUrls);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = zipfilename;
      downloadLink.click();

      setTargetUrls("");
      setIsLoading(false);
    }
  };

  const matchZipTile = (str) => {
    const pattern = /【(.*?)】/;
    const match = str.match(pattern);
    if (match) {
      const originalTitle = String(match[1]);
      return originalTitle.substring(
        0,
        originalTitle.lastIndexOf(" | ") !== -1
          ? originalTitle.lastIndexOf(" | ")
          : originalTitle.length - 1
      );
    } else {
      return generateRandomString(15);
    }
  };

  const extractUrl = (originUrl) => {
    const regex = /((https?:\/\/)[\S]+)/;
    var matches = originUrl.match(regex);
    if (
      matches &&
      matches.length > 1 &&
      String(matches[1]).startsWith("http://xhslink.com")
    ) {
      return matches[1];
    } else {
      return null;
    }
  };

  return (
    <>
      {downloadFailed && (
        <div
          role="alert"
          className="alert alert-warning w-1/5 mx-auto fixed top-10 left-1/2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>下载失败!</span>
        </div>
      )}
      <div className="relative">
        <div className="w-1/2 mx-auto flex justify-center items-center mt-16">
          <input
            value={targetUrls}
            required
            type="text"
            placeholder="直接输入复制的笔记链接，无需格式化"
            className="input input-bordered input-success w-full h-14 text-black"
            onChange={(e) => setTargetUrls(e.target.value)}
          />
          <button
            type="button"
            onClick={handleClick}
            className="btn btn-success ml-8 h-14 w-40 text-xl text-white"
          >
            {isLoading ? "下载中..." : "点击下载"}
          </button>
        </div>
        <div className="w-1/2 mx-auto mt-16 flex justify-center"></div>
      </div>
    </>
  );
};

export default DownloaderInput;
