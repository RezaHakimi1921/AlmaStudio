import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/links/outdoor-conditions",
        destination: "/fazabaz",
        permanent: true,
      },
      {
        source: "/links/outdoor-prep",
        destination: "/amadegi-fazabaz",
        permanent: true,
      },
      {
        source: "/links/studio-prep",
        destination: "/amadegi-atelier",
        permanent: true,
      },
      {
        source: "/links/studio-conditions",
        destination: "/sharaet-alma",
        permanent: true,
      },
    ];
  },
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
