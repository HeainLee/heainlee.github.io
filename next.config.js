/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['unsplash.com', 'i.imgur.com', 'images.unsplash.com'],
    unoptimized: true,
  },
  // blogwithai.github.io는 사용자 저장소이므로 basePath가 필요 없음
}

module.exports = nextConfig
