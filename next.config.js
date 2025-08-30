/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['unsplash.com', 'i.imgur.com', 'images.unsplash.com'],
    unoptimized: true,
  },
  // heainlee.github.io는 사용자 저장소이므로 basePath 불필요
}

module.exports = nextConfig
