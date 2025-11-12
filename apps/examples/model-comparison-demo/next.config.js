/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives', '@clarity-chat/types'],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Static export - no SSR
}

export default nextConfig
