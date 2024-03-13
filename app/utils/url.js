export const replaceUrlWithProxy = (url) => {
  if (!process.env.NEXT_PUBLIC_XHS_PROXY_URL) {
    return url;
  }
  return process.env.NEXT_PUBLIC_XHS_PROXY_URL.replace("%s", url);
};
