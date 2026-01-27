import type { NextConfig } from 'next'

/**
 * Base Next.js Configuration for Clarity Chat Examples
 *
 * Shared configuration that all examples can extend.
 * Optimized for static export and monorepo structure.
 */
export const baseNextConfig: NextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16)
  turbopack: {},

  // Transpile Clarity Chat workspace packages
  transpilePackages: [
    '@clarity-chat/react',
    '@clarity-chat/primitives',
    '@clarity-chat/types',
    '@clarity-chat/utils',
    '@clarity-chat/memory',
    '@clarity-chat/token-optimization',
    '@clarity-chat/error-handling',
  ],

  // Static export for demo deployment (examples don't need server)
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
}

export default baseNextConfig
