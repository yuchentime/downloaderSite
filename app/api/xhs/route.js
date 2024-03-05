import { createWorker, createScheduler } from "tesseract.js";
import * as CommonConstants from "@/constans/CommonConstant";
import axios from "axios";
import cheerio from "cheerio";
import JSZip from "jszip";

export async function GET(request) {
  const searchParams = new URL(request.url);
  const url = JSON.parse(searchParams.searchParams.get("url"));
  if (!url) {
    console.error("url is null");
    return Response.status(500).error();
  }
  const note = await downloadNote(url);
  if (!note) {
    return Response.status(500).error();
  }
  //   TODO zip 打包
  const zip = new JSZip();
  zip.file(note.title + "." + CommonConstants.TEXT_TYPE, note.desc);

  if (note.imageUrls && note.imageUrls.length > 0) {
    const imagePromises = await Promise.allSettled(
      note.imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          try {
            axios({ url: url, responseType: "stream" }).then((resp) => {
              resolve({ url: url, data: resp.data });
            });
          } catch (err) {
            console.error(err);
            reject("error");
          }
        });
      })
    );
    imagePromises.forEach((res) => {
      if (res["status"] === "fulfilled") {
        const value = res["value"];
        const url = value["url"];
        const fileName = url.substring(url.lastIndexOf("/") + 1);
        zip.file(fileName + "." + CommonConstants.IMAGE_TYPE, value["data"]);
      }
    });

    const imageText = await readTextFromImages(note.imageUrls);
    zip.file("ImageText." + CommonConstants.TEXT_TYPE, imageText);
  }

  if (note.videoUrl) {
    const url = note.videoUrl;
    try {
      const resp = await axios({ url: url, responseType: "stream" });
      const fileNameWithType = url.substring(url.lastIndexOf("/") + 1);
      zip.file(fileNameWithType, resp.data);
    } catch (err) {
      console.error(err);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="zipname.zip"');
  headers.append("Content-Type", "application/zip");
  return new Response(content, { headers });
}

const downloadNote = (noteUrl) => {
  return new Promise((resolve, reject) => {
    axios.get(noteUrl).then((response) => {
      if (!response || response.status !== 200) {
        resolve(null);
        return;
      }
      // Parse the HTML body
      const html = response.data;
      // Select elements with Cheerio
      const $ = cheerio.load(html);
      $("script").each(function () {
        // console.log($(this).text());
        if ($(this).text().includes("window.__INITIAL_STATE__=")) {
          const nodeData = $(this)
            .text()
            .substring($(this).text().indexOf("=") + 1)
            .toString()
            .trim();
          resolve(formatNote(nodeData));
          return;
        }
      });
      resolve(null);
    });
  });
};

const formatNote = (data) => {
  if (!data) {
    return null;
  }
  const jsonstr = data.replace(/undefined/g, null);
  const jsonObject = JSON.parse(jsonstr);

  if (!jsonObject || !jsonObject.note) {
    return null;
  }
  const noteDetailMap =
    jsonObject.note.noteDetailMap[jsonObject.note.firstNoteId];
  if (!noteDetailMap) {
    return null;
  }
  const noteJson = noteDetailMap.note;
  if (!noteJson) {
    return null;
  }

  const title = noteJson.title;
  const noteId = noteJson.noteId;
  const desc = noteJson.desc;
  const imageList = noteJson.imageList;
  const imageUrls = imageList?.map((image) => {
    return image.urlDefault;
  });
  const videoUrl = noteJson.video?.media.stream.h264[0].masterUrl;
  return {
    noteId: noteId,
    title: title,
    desc: desc,
    imageUrls: imageUrls,
    videoUrl: videoUrl,
  };
};

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
  const results = await Promise.all(
    imageUrls.map((imageUrl) => scheduler.addJob("recognize", imageUrl))
  );
  await scheduler.terminate(); // It also terminates all workers.
  if (!results) {
    return null;
  }
  const texts = results.map((result) => {
    return result.data?.text;
  });
  // 组合成单个字符串
  return texts.join("\n\n");
};
