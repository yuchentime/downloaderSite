"use client";
import { useEffect } from "react";

const DownloadWildcard = ({ eventEmitter }) => {
  const handleTaskDownload = (data) => {
    console.info('recevied: ', data['title'])
    const blob = data["blob"];
    if (blob) {
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = data["title"];
      downloadLink.click();
    }
  };

  useEffect(() => {
    eventEmitter.on("downloadData", handleTaskDownload);
    return () => eventEmitter.off("downloadData", handleTaskDownload);
  }, [eventEmitter]);

  return <></>;
};

export default DownloadWildcard;
