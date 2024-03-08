"use client";

const XiaohongshuPage = () => {
  return (
    <div>
      <h1 className="text-xl font-bold flex mx-auto justify-center">如何在Web端下载？</h1>
      <div className="w-5/6 lg:w-1/2 mx-auto container h-full lg:my-6 lg:flex lg:justify-between">
        <p className="text-sm text-start leading-8 mr-6">
          <>
            1. 打开你想要下载的小红书笔记
            <br />
            2. 点击笔记右下角的分享图标（如图所示）
            <br /> 3. 点击二维码下方的分享图标【复制分享链接】
            <br />
            4. 将复制下来的分享链接直接粘贴进输入框
            <br />
            5. 点击下载
          </>
        </p>
        <img
          src="https://yczeh123-oss.oss-cn-hangzhou.aliyuncs.com/xhs_share_url.png"
          alt="小红书"
          width={300}
          height={300}
        />
      </div>
      <h1 className="text-xl font-bold flex mx-auto mt-8 justify-center">如何在移动端下载？</h1>
      <div className="w-5/6 lg:w-1/2 mx-auto container h-full lg:my-6 lg:flex lg:justify-between">
        <p className="text-sm text-start leading-8 mr-6">
          <>
            1. 打开你想要下载的小红书笔记
            <br />
            2. 点击屏幕右上角的分享图标（如图所示）
            <br /> 3. 点击屏幕下方的【复制链接】
            <br />
            4. 将复制下来的分享链接直接粘贴进输入框
            <br />
            5. 点击下载
          </>
        </p>
        <img
          src="https://yczeh123-oss.oss-cn-hangzhou.aliyuncs.com/phone_share_url.jpg"
          alt="小红书"
          width={300}
          height={200}
        />
      </div>
    </div>
  );
};

export default XiaohongshuPage;
