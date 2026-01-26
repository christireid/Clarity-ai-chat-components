import type { NextConfig } from 'next'
import createMDX from '@next/mdx'
import path from 'path'

// Bundle analyzer (only loaded when ANALYZE=true)
const withBundleAnalyzer =
  process.env.ANALYZE === 'true'
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- Conditional require for optional dependency
      require('@next/bundle-analyzer')({
        enabled: true,
        openAnalyzer: true,
      })
    : (config: NextConfig) => config

/**
 * Next.js 16 Configuration for Documentation Site
 *
 * Modernized configuration using TypeScript with:
 * - Turbopack support for faster development
 * - MDX support with Rust compiler
 * - Optimized package imports for tree-shaking
 * - Comprehensive security headers (CSP, HSTS, etc.)
 * - Image optimization
 */

// Content Security Policy - strict but allowing necessary resources
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.openai.com https://api.anthropic.com https://api.github.com https://www.google-analytics.com wss:;
  media-src 'self';
  object-src 'none';
  child-src 'none';
  worker-src 'self' blob:;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  upgrade-insecure-requests;
`
  .replace(/\n/g, ' ')
  .trim()

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],

  // Server-side external packages (Wave 3.3 Agent 32 optimizations)
  serverExternalPackages: [
    // Tokenization (server-only)
    'tiktoken',

    // AI SDKs (server-only) - Wave 3.3 Agent 32: -650 KB from client bundle
    '@anthropic-ai/sdk',
    'openai',
    '@google/generative-ai',
    '@ai-sdk/openai',
    'ai',

    // Vector DB (server-only)
    '@pinecone-database/pinecone',

    // Markdown processing (can be external)
    'gray-matter',
  ],

  // Typed routes disabled - too strict for dynamic href patterns in this codebase
  // typedRoutes: true,

  // Turbopack configuration (Next.js 16 - stable)
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    // Note: resolveAlias with path.resolve() causes Turbopack to treat absolute
    // paths as relative (prepending './'). Relying on pnpm workspace linking instead.
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
  // TODO: Fix 60+ TypeScript errors in docs pages and re-enable strict mode
  // See issue ledger for full list of type errors to fix
  typescript: {
    ignoreBuildErrors: true,
  },

  // Note: ESLint configuration moved to eslint.config.js
  // Next.js 16 no longer supports eslint option in next.config.ts

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Disable source maps in production
  productionBrowserSourceMaps: false,

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },

  // Comprehensive security and ISR cache headers
  async headers() {
    return [
      // ISR Cache optimization for static documentation
      {
        source: '/api/reference/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/get-started/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=7200, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/explore/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/about/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=21600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // Prevent XSS attacks (legacy, but still useful)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Prevent MIME-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Enforce HTTPS with preload
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // Strict referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions/Feature Policy (Wave 3.4 Agent 37 - Enhanced)
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
              'interest-cohort=()', // Disable FLoC
              'sync-xhr=(self)',
              'fullscreen=(self)',
            ].join(', '),
          },
          // DNS prefetch control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
      {
        // Additional headers for API routes (Wave 3.4 Agent 37 - Enhanced)
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // Stricter Permissions-Policy for API routes
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'payment=()',
              'usb=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
              'interest-cohort=()',
            ].join(', '),
          },
          // Stricter CSP for API routes (no scripts/styles)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; frame-ancestors 'none'",
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
  webpack: (config, { isServer, dev }) => {
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

    // Resolve workspace packages - fallback for when pnpm workspace linking fails
    // This ensures webpack (non-Turbopack builds) can find packages even if
    // workspace symlinks aren't properly set up (e.g., in sandboxed environments)
    const primitivesPath = path.resolve(__dirname, '../../packages/primitives')
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Point to package root so package.json exports can resolve correctly
      '@clarity-chat/primitives': primitivesPath,
    }

    // Also add to modules for better resolution
    if (!config.resolve.modules) {
      config.resolve.modules = ['node_modules']
    }
    config.resolve.modules.push(primitivesPath)

    // Ensure package.json exports are respected
    config.resolve.conditionNames = ['import', 'require', 'default']
    config.resolve.mainFields = ['exports', 'module', 'main']

    // Security: Disable source maps in production
    if (!dev && !isServer) {
      config.devtool = false
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

// Apply plugins in order: MDX -> Bundle Analyzer
export default withBundleAnalyzer(withMDX(nextConfig))
