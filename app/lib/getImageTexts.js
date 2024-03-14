import { createScheduler, createWorker } from "tesseract.js";

const scheduler = createScheduler();

const getImageTexts = async (imageUrls) => {
  if (!imageUrls) {
    return null;
  }
  // chi_tra指繁中
  const worker1 = await createWorker(["eng", "chi_sim"]);
  const worker2 = await createWorker(["eng", "chi_sim"]);
  scheduler.addWorker(worker1);
  scheduler.addWorker(worker2);
  /** Add 10 recognition jobs */
  const imageTextPromises = await Promise.allSettled(
    imageUrls.map((imageUrl) =>
      scheduler.addJob(
        "recognize",
        `/api/xhs/image?url=${JSON.stringify(imageUrl ? imageUrl : "")}`
      )
    )
  );
  await scheduler.terminate(); // It also terminates all workers.
  const texts = [];
  imageTextPromises.forEach((res) => {
    if (res["status"] === "fulfilled") {
      const result = res["value"];
      const text = String(result.data?.text);
      console.log("text: ", text);
      // 按行移除text中的空格
      texts.push(text.replace(/ /g, ""));
    }
  });
  // 组合成单个字符串
  return texts.join("\n");
};

export default getImageTexts;