import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide Next.js black "N" floating badge in screenshots / local review
  devIndicators: false,
  // Smaller production image for Docker
  output: "standalone",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
