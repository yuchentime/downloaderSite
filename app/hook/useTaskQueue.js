import { extractTitleFromUrl, extractUrl } from "@/app/utils/helper";
import * as React from "react";

const useTaskQueue = () => {
  const [queue, setQueue] = React.useState([]);
  const add = (originalUrl) => {
    const noteUrl = extractUrl(originalUrl);
    const title = extractTitleFromUrl(originalUrl);
    if (noteUrl) {
      setQueue([...queue, { title, noteUrl }]);
    }
  };
  const remove = (task) => {
    setQueue(queue.filter((t) => t !== task));
  };
  const take = () => {
    const currentTask = [];
    Array.from(10).forEach(() => {
      const task = queue.shift();
      if (!task) {
        return currentTask;
      }
      currentTask.push(task);
    });
    return currentTask;
  };

  return [add, remove, take];
};

export default useTaskQueue;
