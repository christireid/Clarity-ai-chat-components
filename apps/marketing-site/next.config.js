/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Next.js 16: Enhanced caching and performance optimizations
  experimental: {
    optimizePackageImports: ['@clarity-chat/react', '@clarity-chat/primitives', 'lucide-react', 'framer-motion'],
  },
  swcMinify: true,
  images: {
    domains: ['clarity-chat.dev', 'avatars.githubusercontent.com'],
  },
  async redirects() {
    return [
      {
        source: '/buy',
        destination: '/pricing',
        permanent: false,
      },
      {
        source: '/purchase',
        destination: '/pricing',
        permanent: false,
      },
    ]
  },
}

export default nextConfig

