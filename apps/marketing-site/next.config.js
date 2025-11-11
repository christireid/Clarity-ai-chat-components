/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Next.js 15: React 19 support
  experimental: {
    // React 19 features enabled by default in Next.js 15
  },
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

