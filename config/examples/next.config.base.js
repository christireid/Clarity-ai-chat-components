/**
 * Base Next.js Configuration for Clarity Chat Examples
 *
 * All examples extend this configuration.
 * Based on Next.js 16 defaults with Clarity Chat workspace packages.
 * @type {import('next').NextConfig}
 */
const baseNextConfig = {
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {},

  // Transpile workspace packages for Next.js
  transpilePackages: [
    '@clarity-chat/react',
    '@clarity-chat/primitives',
    '@clarity-chat/token-optimization',
    '@clarity-chat/memory',
    '@clarity-chat/utils',
    '@clarity-chat/error-handling',
    '@clarity-chat/analytics',
  ],

  // Static export for examples
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default baseNextConfig
