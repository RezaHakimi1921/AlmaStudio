import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide Next.js black "N" floating badge in screenshots / local review
  devIndicators: false,
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
