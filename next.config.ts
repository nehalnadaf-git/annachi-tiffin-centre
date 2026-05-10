import type { NextConfig } from "next";

// next-pwa uses webpack — only wrap in production
const isDev = process.env.NODE_ENV === "development";

let config: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Silence the turbopack/webpack mismatch warning in dev
  turbopack: {},
};

if (!isDev) {
  const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: false,
  });
  config = withPWA(config);
}

module.exports = config;
