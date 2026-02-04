import type { NextConfig } from 'next'

/**
 * Next.js 16 Configuration for Code Assistant Example
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {},

  transpilePackages: ['@clarity-chat/react', '@clarity-chat/types'],

  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
