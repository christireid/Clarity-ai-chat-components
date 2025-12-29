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

  // Server-side external packages
  serverExternalPackages: ['tiktoken'],

  // Typed routes for compile-time Link validation (Next.js 16 - moved from experimental)
  typedRoutes: true,

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
    // Optimize package imports for better tree-shaking (stable in Next.js 15.5+)
    optimizePackageImports: [
      '@clarity-chat/react',
      '@clarity-chat/primitives',
      'lucide-react',
      'framer-motion',
    ],
  },

  transpilePackages: [
    '@clarity-chat/react',
    '@clarity-chat/primitives',
    '@clarity-chat/license',
    '@clarity-chat/memory',
    '@clarity-chat/token-optimization',
    '@clarity-chat/error-handling',
    '@clarity-chat/utils',
    '@clarity-chat/types',
  ],

  // TypeScript configuration
  typescript: {
    // Note: Consider enabling type checking in CI/CD
    ignoreBuildErrors: true,
  },

  // Note: ESLint configuration moved to eslint.config.js (Next.js 16)

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

  // Redirects for legacy routes
  async redirects() {
    return [
      // Redirect /guides sub-routes that have been moved to /learn/guides
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
      // Redirect legacy /concepts routes
      {
        source: '/concepts/animations',
        destination: '/learn/concepts/animations',
        permanent: true,
      },
    ]
  },

  // Webpack configuration for non-Turbopack builds
  webpack: (config, { isServer }) => {
    // Handle SVG imports
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })

    // Handle WASM for tiktoken
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    // Add fallback for tiktoken WASM files
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }

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
