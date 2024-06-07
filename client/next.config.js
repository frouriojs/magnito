/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: { APP_VERSION: `v${require('../package.json').version}` },
  webpack: (config) => {
    config.resolve.symlinks = false;

    return config;
  },
};
