import { extractTitleFromUrl, extractUrl } from "@/app/utils/helper";

export const fromShareUrl = (shareUrl) => {
  const noteUrl = extractUrl(shareUrl);
  const title = extractTitleFromUrl(shareUrl);
  if (!noteUrl) {
    return null;
  }
  return { noteUrl, title };
};
