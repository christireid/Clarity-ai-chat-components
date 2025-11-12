/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives', '@clarity-chat/types'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Static export - no SSR/SSG
}

export default nextConfig
