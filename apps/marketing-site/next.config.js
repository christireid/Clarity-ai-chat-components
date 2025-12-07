/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Next.js 16: Optimize package imports for better tree-shaking
    // Automatically optimizes imports from specified packages, reducing bundle size
    optimizePackageImports: [
      '@clarity-chat/react',
      '@clarity-chat/primitives',
      'lucide-react',
      'framer-motion',
    ],
  },
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

