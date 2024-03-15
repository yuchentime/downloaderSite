import { useState } from "react";

const useFetchNoteHook = (url) => {
  const [note, setNote] = useState(null);
  fetch(`/api/xhs/downloader?url=${JSON.stringify(url)}`).then((res) => {
    if (res.ok) {
      setNote(res.json());
    }
  });
  return [note];
};

export default useFetchNoteHook;
