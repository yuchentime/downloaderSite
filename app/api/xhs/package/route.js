import * as CommonConstants from "@/constans/CommonConstant";
import axios from "axios";
import JSZip from "jszip";
import { createScheduler, createWorker } from "tesseract.js";

export async function POST(request) {
  if (!request.body) {
    return Response.error();
  }
  const note = await request.json();
  if (!note) {
    return Response.error();
  }

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
