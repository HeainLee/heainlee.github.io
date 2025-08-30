/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    domains: ['unsplash.com', 'i.imgur.com', 'images.unsplash.com'],
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/tech-blog' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/tech-blog' : '',
}

module.exports = nextConfig
