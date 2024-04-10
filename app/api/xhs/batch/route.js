import puppeteer from "puppeteer-extra";
import { Stealth } from "puppeteer-extra-plugin-stealth";

export async function GET(request) {
  await batchDownload();
}

async function batchDownload () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.xiaohongshu.com/explore");
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    console.log("request url: ", request.url);
  });
  page.on("response", (response) => {
    if (response.url().includes("/homefeed") && response.status() === 200) {
      (async () => {
        console.log("response: ", await response.json());
      })();
    }
  });
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      let totalHeight = 0;
      const distance = 500;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
  
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 500);
    });
  });
  
  await browser.close();
};
