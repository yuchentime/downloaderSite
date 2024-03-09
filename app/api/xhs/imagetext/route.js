import { createScheduler, createWorker } from "tesseract.js";
import * as urlUtil from "@/utils/url";

export async function POST(request) {
  if (!request.body) {
    return Response.error();
  }
  const note = await request.json();
  if (!note) {
    return Response.error();
  }

  console.log("ready to extract text from images");
  const imageText = await readTextFromImages(note.imageUrls);
  console.log("finished to extract text from images ");

  return Response.json({ data: imageText });
}

const readTextFromImages = async (imageUrls) => {
  if (!imageUrls) {
    return null;
  }
  const proxyImageUrls = imageUrls.map((url) => {
    return urlUtil.replaceUrlWithProxy(url);
  })
  console.log("proxyImageUrls: ", imageUrls);

  const scheduler = createScheduler();
  // chi_tra指繁中
  const worker1 = await createWorker(["eng", "chi_sim"]);
  const worker2 = await createWorker(["eng", "chi_sim"]);
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const results = await Promise.all(
    proxyImageUrls.map((imageUrl) => scheduler.addJob("recognize", imageUrl))
  );
  await scheduler.terminate(); // It also terminates all workers.
  if (!results) {
    return null;
  }
  const texts = results.map((result) => {
    return result.data?.text + "\n\r";
  });
  // 组合成单个字符串
  return texts.join("\n\n");
};
