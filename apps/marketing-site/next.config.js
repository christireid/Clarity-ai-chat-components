/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives'],
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

module.exports = nextConfig

