import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  serverExternalPackages: ["pdf-parse", "openai", "ffmpeg-static"],
};

export default nextConfig;
