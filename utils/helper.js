export const generateRandomString = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
};


export const extractTitleFromUrl = (str) => {
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
  return generateRandomString(15);
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