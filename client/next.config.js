/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  output: 'export',
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  env: { APP_VERSION: `v${require('../package.json').version}` },
  webpack: (config) => {
    config.resolve.symlinks = false;

    return config;
  },
};
