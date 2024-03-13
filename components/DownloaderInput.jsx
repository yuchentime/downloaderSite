"use client";
import { extractTitleFromUrl, extractUrl } from "@/utils/helper";
import * as React from "react";
import { createScheduler, createWorker } from "tesseract.js";
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
  const [batch, setBatch] = React.useState(false);


  const handleNoteDownload = async () => {
    if (isLoading || !targetUrls) {
      return;
    }
    const noteMetadatas = targetUrls.split("\n").map((url) => {
      if (url) {
        const noteUrl = extractUrl(url);
        const title = extractTitleFromUrl(url);
        return {noteUrl, title}
      }
      return null;
    }).filter(url => url !== null)

    if (!noteMetadatas || noteMetadatas.length === 0) {
      return;
    }
    if (noteMetadatas.length > 10) {
      notifyAlert({
        show: true,
        type: "alert-warning",
        msg: "最多支持10条分享链接",
      })
      return
    }

    setIsLoading(true);

    await Promise.allSettled(noteMetadatas.map(noteMetadata => download(noteMetadata.noteUrl, noteMetadata.title)))

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
  }

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
      const imageText = await readTextFromImages(noteJson.imageUrls);
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
    })
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

  const notifyAlert = (alertInfo) => {
    setAlertInfo(alertInfo);
    setTimeout(() => {
      setAlertInfo({
        show: false,
        type: "alert-warning",
        msg: "",
      });
    }, 2000);
  }
  
const readTextFromImages = async (imageUrls) => {
  if (!imageUrls) {
    return null;
  }
  const scheduler = createScheduler();
  // chi_tra指繁中
  const worker1 = await createWorker(["eng", "chi_sim"]);
  const worker2 = await createWorker(["eng", "chi_sim"]);
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const imageTextPromises = await Promise.allSettled(
    // imageUrls.map((imageUrl) => scheduler.addJob("recognize", `/api/xhs/image?url=${JSON.stringify(imageUrl?imageUrl:"")}`))
    imageUrls.map((imageUrl) => scheduler.addJob("recognize", imageUrl))
  );
  await scheduler.terminate(); // It also terminates all workers.
  const texts = [];
  imageTextPromises.forEach((res) => {
    if (res["status"] === "fulfilled") {
      const result = res["value"];
      const text = String(result.data?.text);
      console.log('text: ', text)
      // 按行移除text中的空格
      texts.push(text.replace(/ /g, ""));
    }
  }); 
  // 组合成单个字符串
  return texts.join("\n");
};

  return (
    <>
      {alertInfo.show && (
        <CustomAlertByLazy props={...alertInfo}/>
      )}
      <div>
        <div className="mt-8 lg:w-1/2 lg:mx-auto lg:mt-16">
          <div className="flex justify-center items-center">
            {
              !batch ? 
              <>
                <input
                  value={targetUrls}
                  required
                  type="text"
                  placeholder="输入单个笔记的分享链接"
                  className="input input-bordered input-success w-5/6 mx-auto flex lg:w-full h-14 text-black"
                  onChange={(e) => setTargetUrls(e.target.value)}
                />
                <button className="btn btn-link text-pink-400" onClick={() => setBatch(!batch)}>
                  切换为多笔记下载
                </button>
              </>:
              <>
                <textarea 
                  value={targetUrls} 
                  required
                  placeholder="输入多个笔记的分享链接，按回车键分隔（最多支持10条分享链接）" 
                  className="textarea textarea-bordered textarea-md w-full min-h-44 max-h-44 text-black" 
                  onChange={(e) => setTargetUrls(e.target.value)}
                >

                </textarea>
                <button className="btn btn-link text-pink-400" onClick={() => setBatch(!batch)}>
                  切换为单笔记下载
                </button>
              </>
            }
          </div>
          <div className="flex justify-center mt-4 lg:ml-6 lg:mx-auto">
            <button
              type="button"
              className="btn btn-success  w-36 lg:text-lg text-white "
              onClick={handleNoteDownload}
            >
              打包下载笔记
            </button>
            {!batch && 
              <button
                type="button"
                className="btn btn-accent  w-36 lg:text-lg text-white ml-6"
                onClick={handleImageText}
              >
                提取图片文本
              </button>
            }
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
        setText={setImageText}
        clearText={() => setImageText("")}
      />
    </>
  );
};

export default DownloaderInput;
