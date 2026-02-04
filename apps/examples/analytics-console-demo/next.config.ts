import type { NextConfig } from 'next'

/**
 * Next.js 16 Configuration for Analytics Console Demo
 *
 * Standalone output for deployment flexibility.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {},

  // Standalone output for containerized deployments
  output: 'standalone',

  // Optimize package imports for tree-shaking
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
