import * as helper from "@/app/utils/helper";
import axios from "axios";
import cheerio from "cheerio";

export async function GET(request) {
  const searchParams = new URL(request.url);
  const url = JSON.parse(searchParams.searchParams.get("url"));
  if (!url) {
    console.error("url is null");
    return Response.error();
  }
  const note = await downloadNote(url);
  if (!note) {
    return Response.error();
  }
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  return Response.json(note);
}

const downloadNote = (noteUrl) => {
  let targetUrl = helper.replaceUrlWithProxy(noteUrl);
  console.log("ready to fecth: ", targetUrl);
  return new Promise((resolve, reject) => {
    axios.get(targetUrl).then((response) => {
      console.log("sccuess to fecth");
      if (!response || response.status !== 200) {
        resolve(null);
        return;
      }
      // Parse the HTML body
      const html = response.data;
      // Select elements with Cheerio
      const $ = cheerio.load(html);
      $("script").each(function () {
        // console.log($(this).text());
        if ($(this).text().includes("window.__INITIAL_STATE__=")) {
          const nodeData = $(this)
            .text()
            .substring($(this).text().indexOf("=") + 1)
            .toString()
            .trim();
          const note = formatNote(nodeData);
          resolve({ ...note, url: noteUrl });
          return;
        }
      });
      resolve(null);
    });
  });
};

const formatNote = (data) => {
  if (!data) {
    return null;
  }
  const jsonstr = data.replace(/undefined/g, null);
  const jsonObject = JSON.parse(jsonstr);

  if (!jsonObject || !jsonObject.note) {
    return null;
  }
  const noteDetailMap =
    jsonObject.note.noteDetailMap[jsonObject.note.firstNoteId];
  if (!noteDetailMap) {
    return null;
  }
  const noteJson = noteDetailMap.note;
  if (!noteJson) {
    return null;
  }

  const title = noteJson.title;
  const noteId = noteJson.noteId;
  const desc = noteJson.desc;
  const imageList = noteJson.imageList;
  const imageUrls = imageList?.map((image) => {
    return image.urlDefault;
  });
  const videoUrl = noteJson.video?.media.stream.h264[0].masterUrl;
  return {
    noteId: noteId,
    title: title,
    desc: desc,
    imageUrls: imageUrls,
    videoUrl: videoUrl,
  };
};
