/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@clarity-chat/react',
    '@clarity-chat/primitives',
    '@clarity-chat/types',
    '@clarity-chat/utils',
    '@clarity-chat/memory',
    '@clarity-chat/token-optimization',
    '@clarity-chat/error-handling',
    '@clarity-chat/license',
  ],
  experimental: {
    optimizePackageImports: [
      '@clarity-chat/react',
      '@clarity-chat/primitives',
      'lucide-react',
    ],
  },
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'via.placeholder.com'],
  },
}

module.exports = nextConfig
