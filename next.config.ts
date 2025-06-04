// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ❗ WARNING: This ignores all TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
