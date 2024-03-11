import { createScheduler, createWorker } from "tesseract.js";

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

  const scheduler = createScheduler();
  // chi_tra指繁中
  const worker1 = await createWorker(["eng", "chi_sim"]);
  const worker2 = await createWorker(["eng", "chi_sim"]);
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const imageTextPromises = await Promise.allSettled(
    imageUrls.map((imageUrl) => scheduler.addJob("recognize", imageUrl))
  );
  await scheduler.terminate(); // It also terminates all workers.
  const texts = [];
  imageTextPromises.forEach((res) => {
    if (res["status"] === "fulfilled") {
      const result = res["value"];
      const text = result.data?.text;
      texts.push(text + "\n\r\t");
    }
  });
  // 组合成单个字符串
  return texts.join("\n\n");
};
