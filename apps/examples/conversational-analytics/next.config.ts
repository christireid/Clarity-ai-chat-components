import type { NextConfig } from 'next'

/**
 * Next.js 16 Configuration for Conversational Analytics Example
 *
 * Static export configuration for demo deployment.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {},

  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives'],

  typescript: {
    ignoreBuildErrors: true,
  },

  // Static export for demo deployment
  output: 'export',
}

export default nextConfig
