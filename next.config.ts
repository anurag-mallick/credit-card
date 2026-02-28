import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/credit-card',
  assetPrefix: '/credit-card/',
};

export default nextConfig;
