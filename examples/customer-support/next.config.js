/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives', '@clarity-chat/types'],
}

module.exports = nextConfig
