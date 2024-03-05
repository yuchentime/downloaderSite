"use client";
import Instructions from "@/components/Instructions";

const XiaohongshuPage = () => {
  return (
    <div>
      <div className="w-1/2 mx-auto container h-full my-6">
        <Instructions
          title="基本用法"
          descriptionNode={
            <>
              1. 打开你想要下载的小红书笔记
              <br />
              2. 点击笔记右下角的分享图标
              <br /> 3. 点击二维码下方的第一个图标，复制分享链接
              <br />
              4.
              将复制下来的分享链接直接粘贴进输入框
              <br />
              5. 点击下载
            </>
          }
        />
      </div>
      {/* <div className="divider w-1/2 mx-auto "></div> */}
      {/* <div className="w-1/2 mx-auto container h-full my-6">
        <Instructions
          title="进阶使用"
          subtitle="为减少单独操作分享链接的麻烦，可利用浏览器扩展插件【甚陌采集器】，直接在小红书上批量下载选中的笔记。如果是登录用户，网站会记录导出历史，以便将来重新下载。"
          descriptionNode={
            <>
              1. 到Chrome应用商店下载【甚陌采集器】：
              <a
                href="https://chromewebstore.google.com/"
                target="_blank"
                className="text-blue-300"
              >
                https://chromewebstore.google.com/
              </a>
              <br />
              2. 进入小红书主页或是某博主的主页
              <br />
              3.
              点击【甚陌采集器】的应用图标，弹出操作窗口，里面显示了当前页面的笔记列表
              <br />
              4. 勾选想要下载的笔记后，点击【批量下载】（最多10个笔记）
              <br />
              5.
              如果你遗失了下载过的笔记，并且是本站的注册用户，可在本站的【个人中心】找到自己的下载历史
            </>
          }
        />
      </div> */}
    </div>
  );
};

export default XiaohongshuPage;
