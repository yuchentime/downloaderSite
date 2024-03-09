"use client";
import { extractTitleFromUrl, extractUrl } from "@/utils/helper";
import * as React from "react";
import ImageTextModal from "./ImageTextModal";
const CustomAlertByLazy = React.lazy(() => import("./CustomAlert"));

const DownloaderInput = () => {
  const [targetUrls, setTargetUrls] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [progressInfo, setProgressInfo] = React.useState("");
  const [imageText, setImageText] = React.useState("");
  const imageTextModalRef = React.useRef(null);
  const [note, setNote] = React.useState(null);
  const [alertInfo, setAlertInfo] = React.useState({
    show: false,
    type: "alert-warning",
    msg: "",
  });
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

    const noteJson = await fetchNote(urls);
    if (!noteJson) {
      failed();
      return;
    }

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
        setImageText(imageTextJson.data);
      }
    }
    if (imageTextModalRef?.current) {
      imageTextModalRef.current.showModal();
    }

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
    setTimeout(() => {
      setAlertInfo({
        show: false,
        type: "alert-warning",
        msg: "",
      });
    }, 2000);
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

  return (
    <>
      {alertInfo.show && (
        <CustomAlertByLazy props={...alertInfo}/>
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
            {/* <button
              className="btn btn-link text-pink-400"
              onClick={handleImageText}
            >
              提取图片中文本
            </button> */}
          </div>
        </div>
        <div className="w-2/5 mx-auto mt-4 h-10 flex justify-center">
          {isLoading && (
            <div className="w-100 mx-auto h-10">{progressInfo}</div>
          )}
        </div>
      </div>

      <ImageTextModal
        ref={imageTextModalRef}
        text={imageText}
        clearText={() => setImageText("")}
      />
    </>
  );
};

export default DownloaderInput;
