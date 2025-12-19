import type { NextConfig } from 'next'
import createMDX from '@next/mdx'

/**
 * Next.js 16 Configuration for Documentation Site
 *
 * Modernized configuration using TypeScript with:
 * - Turbopack support for faster development
 * - MDX support with Rust compiler
 * - Optimized package imports for tree-shaking
 * - Security headers
 * - Image optimization
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Server-side external packages (tiktoken uses WASM)
  serverExternalPackages: ['tiktoken', '@clarity-chat/token-optimization'],

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Experimental features
  experimental: {
    mdxRs: true,
    // Typed routes for compile-time Link validation (Next.js 16)
    typedRoutes: true,
    // Optimize package imports for better tree-shaking (stable in Next.js 15.5+)
    optimizePackageImports: [
      '@clarity-chat/react',
      '@clarity-chat/primitives',
      'lucide-react',
      'framer-motion',
    ],
  },

  transpilePackages: ['@clarity-chat/react', '@clarity-chat/primitives'],

  // TypeScript configuration
  typescript: {
    // Note: Consider enabling type checking in CI/CD
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    // Note: Consider enabling linting in CI/CD
    ignoreDuringBuilds: true,
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },

  // Redirects for confusing guides section
  async redirects() {
    return [
      {
        source: '/guides',
        destination: '/learn/guides',
        permanent: true,
      },
      {
        source: '/guides/prompt-testing',
        destination: '/learn/guides/prompt-testing',
        permanent: true,
      },
      {
        source: '/guides/testing',
        destination: '/learn/guides/testing',
        permanent: true,
      },
      {
        source: '/guides/accessibility',
        destination: '/learn/guides/accessibility',
        permanent: true,
      },
      {
        source: '/concepts/animations',
        destination: '/learn/concepts/animations',
        permanent: true,
      },
      {
        source: '/demos/accessibility-audit',
        destination: '/learn/demos/accessibility-audit',
        permanent: true,
      },
    ]
  },

  // Webpack configuration for non-Turbopack builds
  webpack: (config) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Optimize module resolution
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    }

    return config
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withMDX(nextConfig)
