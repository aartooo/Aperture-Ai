// FILE: frontend/next.config.js
// (This is the full code for this file)

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add the following configuration for images:
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
    ],
  },
};

module.exports = nextConfig;