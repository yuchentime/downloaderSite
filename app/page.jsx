import XHSDownloader from "@/app/components/xhs/XHSDownloader";
import { lazy } from "react";
const XHSGuidelineByLazy = lazy(() =>
  import("@/app/components/xhs/XHSGuideline")
);

export default function Home() {
  return (
    <>
      <div className="bg-gray-700 text-white">
        <XHSDownloader />
      </div>
      <div className="mt-4 lg:mt-16 border-solid border-stone-900">
        <XHSGuidelineByLazy />
      </div>
    </>
  );
}
