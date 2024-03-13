import * as CommonConstants from "@/app/constans/CommonConstant";
import axios from "axios";
import JSZip from "jszip";

export async function POST(request) {
  if (!request.body) {
    return Response.error();
  }
  const note = await request.json();
  if (!note) {
    return Response.error();
  }
  console.log("ready to package, note: ", note);
  const zip = new JSZip();
  zip.file(note.title + "." + CommonConstants.TEXT_TYPE, note.desc);

  console.log("ready to package images");
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
  }

  console.log("ready to package videos");
  if (note.videoUrl) {
    const url = note.videoUrl;
    try {
      const resp = await axios({ url: url, responseType: "stream" });
      let fileNameWithType = url.substring(url.lastIndexOf("/") + 1);
      const suffixSignIndex = fileNameWithType.lastIndexOf("_sign=");
      if (suffixSignIndex !== -1) {
        fileNameWithType = fileNameWithType.substring(0, suffixSignIndex);
      }
      zip.file(fileNameWithType, resp.data);
    } catch (err) {
      console.error(err);
    }
  }

  console.log("success to package all of sources");
  const content = await zip.generateAsync({ type: "blob" });
  const headers = new Headers();
  headers.append("Content-Disposition", 'attachment; filename="zipname.zip"');
  headers.append("Content-Type", "application/zip");
  return new Response(content, { headers });
}
