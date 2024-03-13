/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 如果依赖了node.js特定功能的第三方依赖
    serverComponentsExternalPackages: ["tesseract.js"],
    // 加载静态文件
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/**/*.wasm", "./node_modules/**/*.proto"],
    },
  },
  images: {
    domains: ["www.appstools.net"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
