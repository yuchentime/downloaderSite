import getNotePackage from "./getNotePackage";
import getNoteJson from "./getNoteJson";

class BatchProcessor {
  constructor(batchSize = 10, interval = 1000, eventEmitter) {
    this.queue = [];
    this.batchSize = batchSize;
    this.interval = interval;
    this.isProcessing = false;
    this.eventEmitter = eventEmitter;
    this.currentBundle = 1;
  }

  addTask(tasks) {
    this.queue.push(...tasks);
    this.bundleSize = Math.ceil(this.queue.length / this.batchSize);
    this.startProcessing();
  }

  async startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.slice(0, this.batchSize);
      this.queue = this.queue.slice(this.batchSize);

      try {
        this.eventEmitter.emit("downloadCompleted", {
          status: "downloading",
          msg: `正在下载第${this.currentBundle}/${this.bundleSize}批数据...`,
        });
        const resultPromise = await Promise.allSettled(batch.map(handleTask));
        resultPromise.forEach((result) => {
          if (result.status === "fulfilled") {
            this.eventEmitter.emit("taskDownload", result.value);
          }
        });
        this.currentBundle += 1;
      } catch (error) {
        console.error("Error processing batch:", error);
      }

      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval));
      } else {
        this.eventEmitter.emit("downloadCompleted", {
          status: "downloaded",
          msg: "已全部下载完成!",
        });
        this.currentBundle = 1;
      }
    }

    this.isProcessing = false;
  }
}

export default BatchProcessor;

const handleTask = async (task) => {
  const note = await getNoteJson(task.noteUrl);
  const blob = await getNotePackage(note);
  return { title: task.title, blob: blob };
};
