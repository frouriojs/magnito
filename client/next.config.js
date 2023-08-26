/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  pageExtensions: ['page.tsx'],
  basePath:
    process.env.GITHUB_REPOSITORY !== undefined
      ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}`
      : '',
  output: 'export',
  trailingSlash: true,
  transpilePackages: Object.entries(require('./package.json').dependencies)
    .filter((value) => value[1].startsWith('file:'))
    .map(([key]) => key),
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
