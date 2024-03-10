
export const replaceUrlWithProxy = (url) => {
  let targetUrl = "";
  if (process.env.NEXT_PUBLIC_XHS_PROXY_URL) {
    targetUrl = process.env.NEXT_PUBLIC_XHS_PROXY_URL.replace("%s", url);
  }
  return targetUrl;
};
