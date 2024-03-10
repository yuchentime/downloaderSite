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
  const regex = /http:\/\/xhslink\.com\/[a-zA-Z0-9]+/;
  var matches = originUrl.match(regex);
  if (matches && matches.length > 0) {
    return matches[0];
  } else {
    return null;
  }
};
