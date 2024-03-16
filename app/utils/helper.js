export const formateDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${seconds}`;
};

export const extractTitleFromUrl = (str) => {
  const isMobile = String(str).endsWith("打开【小红书】App查看精彩内容！");
  if (isMobile) {
    return "小红书笔记-" + formateDate(Date.now());
  }
  const pattern = /【(.*?)】/;
  const match = str.match(pattern);
  if (match) {
    const originalTitle = String(match[1]);
    return originalTitle.substring(
      0,
      originalTitle.lastIndexOf(" | ") !== -1
        ? originalTitle.lastIndexOf(" | ")
        : originalTitle.length - 1
    );
  }
  return "小红书笔记-" + formateDate(Date.now());
};

export const extractUrl = (originUrl) => {
  const sharedRegex = /http:\/\/xhslink\.com\/[a-zA-Z0-9]+/;
  let matches = originUrl.match(sharedRegex);
  if (matches && matches.length > 0) {
    return matches[0];
  }
  const realRegex = /https:\/\/www\.xiaohongshu\.com\/explore\/[a-zA-Z0-9]+/;
  matches = originUrl.match(realRegex);
  if (matches && matches.length > 0) {
    return matches[0];
  }

  return null;
};

export const replaceUrlWithProxy = (url) => {
  if (!process.env.NEXT_PUBLIC_XHS_PROXY_URL) {
    return url;
  }
  return process.env.NEXT_PUBLIC_XHS_PROXY_URL.replace("%s", url);
};
