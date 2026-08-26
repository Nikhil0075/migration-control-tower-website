import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 430, 768, 1024, 1280, 1440, 1920, 2560],
  },
  poweredByHeader: false,
  devIndicators: false,
};

export default nextConfig;
