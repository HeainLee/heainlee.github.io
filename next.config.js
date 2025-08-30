/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['unsplash.com', 'i.imgur.com', 'images.unsplash.com'],
    unoptimized: true,
  },
  // 프로젝트 저장소이므로 basePath 필요
  basePath: process.env.NODE_ENV === 'production' ? '/blogwithai.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/blogwithai.github.io' : '',
}

module.exports = nextConfig
