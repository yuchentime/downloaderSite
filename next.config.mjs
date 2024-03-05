/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 如果依赖使用了node.js的功能，则需要将这些依赖从nextjs的server component中剔除掉，因为nextjs是运行在浏览器端
    serverComponentsExternalPackages: ["tesseract.js"],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // distDir: "vercel/output"
};

export default nextConfig;
