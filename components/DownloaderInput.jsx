"use client";
import { extractTitleFromUrl, extractUrl } from "@/utils/helper";
import * as React from "react";
import * as Icons from "./Icons";

const DownloaderInput = () => {
  const [targetUrls, setTargetUrls] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [progressInfo, setProgressInfo] = React.useState("");
  const [imageText, setImageText] = React.useState("");
  const [note, setNote] = React.useState(null);
  const [alertInfo, setAlertInfo] = React.useState({
    show: false,
    type: "alert-warning",
    msg: "",
  });

  React.useEffect(() => {
    setTimeout(() => {
      setAlertInfo({
        show: false,
        type: "alert",
        msg: "",
      });
    }, 2000);
  }, [alertInfo]);

  const handleDownload = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const urls = extractUrl(targetUrls);
    if (!urls) {
      setTargetUrls("");
      return;
    }
    setIsLoading(true);

    const noteJson = await fetchNote(urls);
    if (!noteJson) {
      failed();
      return;
    }

    setProgressInfo("正在打包笔记...");
    const packageResp = await fetch("/api/xhs/package", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(noteJson),
    });
    if (!packageResp.ok) {
      failed();
      return;
    }
    const zipfilename = extractTitleFromUrl(targetUrls);
    const blob = await packageResp.blob();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = zipfilename;
    downloadLink.click();

    success();
  };

  const handleImageText = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const urls = extractUrl(targetUrls);
    if (!urls) {
      setTargetUrls("");
      return;
    }
    setIsLoading(true);

    console.log("urls: ", urls);
    const noteJson = await fetchNote(urls);
    if (!noteJson) {
      failed();
      return;
    }

    console.log("noteJson: ", noteJson);

    if (noteJson.imageUrls && noteJson.imageUrls.length > 0) {
      setProgressInfo("正在提取图片文本...");
      const imageTextResp = await fetch("/api/xhs/imagetext", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteJson),
      });
      if (imageTextResp.ok) {
        const imageTextJson = await imageTextResp.json();
        console.log("imageTextJson.data: ", imageTextJson.data);
        setImageText(imageTextJson.data);
      }
    }
    document.getElementById("image_text_modal").showModal();

    success();
  };

  const fetchNote = async (urls) => {
    let noteJson = note;
    if (noteJson && noteJson.url === urls) {
      return noteJson;
    }
    setProgressInfo("正在抓取笔记...");
    const noteResp = await fetch(
      `/api/xhs/downloader?url=${JSON.stringify(urls)}`
    );
    if (!noteResp.ok) {
      return null;
    }
    noteJson = await noteResp.json();
    if (!noteJson) {
      return null;
    }
    setNote(noteJson);
    return noteJson;
  };

  const failed = () => {
    setProgressInfo("");
    setIsLoading(false);
    setAlertInfo({
      show: true,
      type: "alert-warning",
      msg: "下载失败, 请重试",
    });
  };

  const success = () => {
    setTargetUrls("");
    setProgressInfo("");
    setIsLoading(false);
    setAlertInfo({
      show: false,
      type: "alert-warning",
      msg: "",
    });
  };

  const copyToChipboard = () => {
    if (imageText) {
      navigator.clipboard.writeText(imageText);
    }
  };

  return (
    <>
      {alertInfo.show && (
        <div
          role="alert"
          className={`alert w-1/2 lg:w-1/5 mx-auto fixed top-10 left-1/2 ${alertInfo.type}`}
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
          <span>{alertInfo.msg}</span>
        </div>
      )}
      <div>
        <div className="mt-8 lg:w-1/2 lg:mx-auto lg:flex lg:justify-center lg:items-center lg:mt-16">
          <input
            value={targetUrls}
            required
            type="text"
            placeholder="输入笔记分享链接"
            className="input input-bordered input-success w-5/6 mx-auto flex lg:w-full h-14 text-black"
            onChange={(e) => setTargetUrls(e.target.value)}
          />
          <div className="flex justify-center mt-4 lg:mt-0 lg:ml-16 lg:mx-auto">
            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-success lg:h-14 w-40 lg:text-xl text-white "
            >
              点击下载
            </button>
            <button
              className="btn btn-link text-pink-400"
              onClick={handleImageText}
            >
              提取图片中文本
            </button>
          </div>
        </div>
        <div className="w-2/5 mx-auto mt-4 h-10 flex justify-center">
          {isLoading && (
            <div className="w-100 mx-auto h-10">{progressInfo}</div>
          )}
        </div>
      </div>

      <dialog id="image_text_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-black"
              onClick={() => setImageText("")}
            >
              ✕
            </button>
          </form>
          <p className="py-4 text-black">
            {imageText ? imageText : <i>没有提取到任何内容</i>}
          </p>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 bottom-2 text-black"
            onClick={copyToChipboard}
          >
            {Icons.OuiCopy()}
          </button>
        </div>
      </dialog>
    </>
  );
};

export default DownloaderInput;
