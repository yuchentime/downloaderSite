"use client";
import getImageTexts from "@/app/lib/getImageTexts";
import { extractTitleFromUrl, extractUrl } from "@/app/utils/helper";
import * as React from "react";
import ImageTextModal from "@/app/components/ImageTextModal";
import { useAlertStore } from "@/app/context/store";

const XHSDownloader = () => {
  const [targetUrls, setTargetUrls] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [progressInfo, setProgressInfo] = React.useState("");
  const [imageText, setImageText] = React.useState("");
  const imageTextModalRef = React.useRef(null);
  const [note, setNote] = React.useState(null);
  const [batch, setBatch] = React.useState(false);

  const notify = useAlertStore((state) => state.notify);
  const reset = useAlertStore((state) => state.reset);

  const handleNoteDownload = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const noteMetadatas = targetUrls
      .split("\n")
      .map((url) => {
        if (url) {
          const noteUrl = extractUrl(url);
          const title = extractTitleFromUrl(url);
          return { noteUrl, title };
        }
        return null;
      })
      .filter((url) => url !== null);

    if (!noteMetadatas || noteMetadatas.length === 0) {
      return;
    }
    if (noteMetadatas.length > 10) {
      notifyAlert({
        show: true,
        type: "alert-warning",
        msg: "最多支持10条分享链接",
      });
      return;
    }

    setIsLoading(true);

    await Promise.allSettled(
      noteMetadatas.map((noteMetadata) =>
        download(noteMetadata.noteUrl, noteMetadata.title)
      )
    );

    success();
  };

  const download = async (noteUrl, title) => {
    const noteJson = await fetchNote(noteUrl);
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
    const zipfilename = title;
    const blob = await packageResp.blob();
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = zipfilename;
    downloadLink.click();
  };

  const handleImageText = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const url = extractUrl(targetUrls);
    if (!url) {
      setTargetUrls("");
      return;
    }
    setIsLoading(true);

    const noteJson = await fetchNote(url);
    if (!noteJson) {
      failed();
      return;
    }

    if (noteJson.imageUrls && noteJson.imageUrls.length > 0) {
      setProgressInfo("正在提取图片文本...");
      const imageText = await getImageTexts(noteJson.imageUrls);
      setImageText(imageText);
    }
    if (imageTextModalRef?.current) {
      imageTextModalRef.current.showModal();
    }

    success();
  };

  const fetchNote = async (url) => {
    let noteJson = note;
    if (noteJson && noteJson.url === url) {
      return noteJson;
    }
    setProgressInfo("正在抓取笔记...");
    const noteResp = await fetch(
      `/api/xhs/downloader?url=${JSON.stringify(url)}`
    );
    if (!noteResp.ok) {
      return null;
    }
    noteJson = await noteResp.json();
    if (!batch && !noteJson) {
      setNote(noteJson);
    }
    return noteJson;
  };

  const failed = () => {
    setProgressInfo("");
    setIsLoading(false);
    notifyAlert({
      show: true,
      type: "alert-warning",
      msg: "下载失败, 请重试",
    });
  };

  const success = () => {
    setTargetUrls("");
    setProgressInfo("");
    setIsLoading(false);
  };

  const notifyAlert = (alertInfo) => {
    notify(alertInfo);
    setTimeout(() => {
      reset();
    }, 2000);
  };

  return (
    <>
      <div className="mx-auto lg:w-1/2">
        <div className="w-5/6 pt-4 lg:pt-16 flex-row mx-auto text-center">
          <h1 className="lg:text-3xl font-bold tracking-tight text-white text-xl">
            小红书笔记一键打包下载
          </h1>
          <p className=" text-sm text-red-500">
            zip格式打包下载小红书视频、图片及文本
          </p>
        </div>
        <div className="mt-8 lg:mt-16">
          <div className="flex justify-center items-center">
            {!batch ? (
              <>
                <input
                  value={targetUrls}
                  required
                  type="text"
                  placeholder="输入单个笔记的分享链接"
                  className="input input-bordered input-success w-5/6 mx-auto flex lg:w-full h-14 text-black"
                  onChange={(e) => setTargetUrls(e.target.value)}
                />
              </>
            ) : (
              <>
                <textarea
                  value={targetUrls}
                  required
                  placeholder="输入多个笔记的分享链接，按回车键分隔（最多支持10条分享链接）"
                  className="textarea textarea-bordered textarea-md w-full min-h-44 max-h-44 text-black"
                  onChange={(e) => setTargetUrls(e.target.value)}
                ></textarea>
              </>
            )}
          </div>
          <div className="flex justify-center items-center mt-4 lg:ml-6 lg:mx-auto">
            <button
              type="button"
              className="btn btn-success w-30 lg:text-lg text-white "
              onClick={handleNoteDownload}
            >
              打包下载笔记
            </button>
            {!batch ? (
              <div>
                <button
                  type="button"
                  className="btn btn-accent w-30 lg:text-lg text-white ml-6"
                  onClick={handleImageText}
                >
                  提取图片文本
                </button>
                <div
                  className="tooltip tooltip-right"
                  data-tip="切换为多笔记下载"
                >
                  <input
                    type="checkbox"
                    className="toggle toggle-success ml-4"
                    onChange={() => setBatch(!batch)}
                  />
                </div>
              </div>
            ) : (
              <div
                className="tooltip tooltip-right"
                data-tip="切换为单笔记下载"
              >
                <input
                  type="checkbox"
                  className="toggle toggle-success ml-4"
                  onChange={() => setBatch(!batch)}
                  checked
                />
              </div>
            )}
          </div>
          <div className="flex justify-center items-center w-2/5 mt-4 h-10 mx-auto">
            {isLoading && (
              <div className="w-100 mx-auto h-10">{progressInfo}</div>
            )}
          </div>
        </div>
      </div>

      <ImageTextModal
        ref={imageTextModalRef}
        text={imageText}
        setText={setImageText}
        clearText={() => setImageText("")}
      />
    </>
  );
};

export default XHSDownloader;
