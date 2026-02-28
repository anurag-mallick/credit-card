import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // If deploying to a subfolder on GH Pages, set basePath
  // basePath: '/credit-card',
};

export default nextConfig;
