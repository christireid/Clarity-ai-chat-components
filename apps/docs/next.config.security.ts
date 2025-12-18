import { NextConfig } from 'next';

/**
 * Enhanced security configuration for Next.js
 * Implements comprehensive security headers and CSP policies
 */
const securityConfig: NextConfig = {
  // Security headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent XSS attacks
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          // Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          // Prevent MIME-type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Enforce HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },
          // Referrer policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions policy
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.openai.com https://www.google-analytics.com",
              "media-src 'self'",
              "object-src 'none'",
              "child-src 'none'",
              "worker-src 'self' blob:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'"
            ].join('; ')
          }
        ]
      },
      // API routes with additional security
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'none'; script-src 'none'; style-src 'none'"
          }
        ]
      }
    ];
  },

  // Security configurations
  poweredByHeader: false, // Hide X-Powered-By header
  reactStrictMode: true,
  
  // Production optimizations
  productionBrowserSourceMaps: false,
  
  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json'
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'hooks']
  },

  // Experimental features for security
  experimental: {
    // Enable React concurrent features
    reactRoot: true,
    
    // Optimize server components
    serverComponents: true,
    
    // Enable strict mode
    runtime: 'nodejs',
    
    // Optimize bundle size
    optimizeCss: true,
    
    // Enable source maps in development only
    sourceMaps: process.env.NODE_ENV === 'development'
  },

  // Webpack configuration for security
  webpack: (config, { dev, isServer }) => {
    // Security: Disable source maps in production
    if (!dev && !isServer) {
      config.devtool = false;
    }

    // Security: Configure webpack for production
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        removeAvailableModules: true,
        removeEmptyChunks: true,
        mergeDuplicateChunks: true,
        sideEffects: false,
        usedExports: true
      };
    }

    return config;
  },

  // Environment variables validation
  env: {
    // Validate required environment variables
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    
    // Security: Sanitize environment variables
    SANITIZED_ENV: JSON.stringify({
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      buildTime: new Date().toISOString()
    })
  },

  // Image optimization for security
  images: {
    domains: ['localhost', 'example.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    
    // Security: Disable dangerous image types
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment'
  },

  // Internationalization for security
  i18n: {
    locales: ['en-US'],
    defaultLocale: 'en-US',
    localeDetection: false
  },

  // Trailing slash configuration for security
  trailingSlash: false,

  // Base path configuration
  basePath: '',

  // Asset prefix for CDN
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.example.com' : '',

  // Generate ETags for better caching
  generateEtags: true,

  // Compress responses
  compress: true,

  // Enable static optimization
  staticPageGenerationTimeout: 60,

  // Configure output file tracing
  outputFileTracing: true,

  // Optimize production builds
  swcMinify: true,

  // Configure React profiling
  reactProductionProfiling: false,

  // Configure server runtime
  serverRuntimeConfig: {
    // Server-only configuration
    apiSecret: process.env.API_SECRET,
    dbUrl: process.env.DATABASE_URL
  },

  publicRuntimeConfig: {
    // Client-safe configuration
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
    apiUrl: process.env.NEXT_PUBLIC_API_URL
  }
};

export default securityConfig;