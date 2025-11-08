/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives', '@clarity-chat/types'],
  typescript: {
    ignoreBuildErrors: true, // Skip type checking during build
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Static export - no SSR
}

export default nextConfig
