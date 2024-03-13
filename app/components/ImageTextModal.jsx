import React from "react";
import * as Icons from "./Icons";

const ImageTextModal = React.forwardRef(({ text,setText, clearText }, ref) => {
  const [isCopied, setIsCopied] = React.useState(false);
  const copyToChipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <dialog id="image_text_modal" className="modal" ref={ref}>
        {isCopied && (
          <div
            role="alert"
            className="alert w-56 lg:w-1/5 mx-auto fixed top-10 z-10 lg:left-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-info shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span>复制成功！</span>
          </div>
        )}
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-5 top-2 text-black"
              onClick={clearText}
            >
              ✕
            </button>
          </form>
          <div className="flex-row">
            <textarea
              className="textarea textarea-bordered py-5 mt-5 text-black w-full min-h-80 overflow-auto"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="没有提取到任何内容"
            ></textarea>
            <div className="flex justify-end w-full lg:hidden">
              <button
                className="btn btn-sm btn-circle btn-ghost text-black"
                onClick={copyToChipboard}
              >
                {Icons.OuiCopy()}
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
});

export default ImageTextModal;
