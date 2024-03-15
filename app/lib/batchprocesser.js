class BatchProcessor { 
  constructor(batchSize = 10, interval = 1000, eventEmitter) {
    this.queue = [];
    this.batchSize = batchSize;
    this.interval = interval;
    this.isProcessing = false;
    this.eventEmitter = eventEmitter;
  }

  addTask(tasks) {
    this.queue.push(...tasks);
    this.startProcessing();
  }

  async startProcessing() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.slice(0, this.batchSize);
      this.queue = this.queue.slice(this.batchSize);

      try {
        const resultPromise = await Promise.allSettled(batch.map(handleTask));
        resultPromise.forEach((result) => {
          if (result.status === "fulfilled") {
            this.eventEmitter.emit("taskDownload", result.value);
          }
        })
      } catch (error) {
        console.error("Error processing batch:", error);
      }

      if (this.queue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.interval));
      }
    }

    this.isProcessing = false;
  }
}

export default BatchProcessor;

const handleTask = async (task) => {
  const note = await fetchNoteJson(task.noteUrl);
  const blob = await packageNoteBlob(note);
  return { title: task.title, blob: blob };
};

const fetchNoteJson = async (url) => {
  const noteResp = await fetch(
    `/api/xhs/downloader?url=${JSON.stringify(url)}`
  );
  if (!noteResp.ok) {
    return null;
  }
  return await noteResp.json();
};

const packageNoteBlob = async (noteJson) => {
  const packageResp = await fetch("/api/xhs/package", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(noteJson),
  });
  if (!packageResp.ok) {
    return null;
  }
  return await packageResp.blob();
};
