/**
 * Bundle Optimization Configuration
 *
 * Defines strategies for code splitting, lazy loading, and bundle optimization.
 *
 * Performance Targets:
 * - Initial bundle: < 400 KB
 * - Per-route chunks: < 100 KB
 * - Shared vendor chunk: < 200 KB
 * - Total reduction goal: 56% (782 KB → 342 KB)
 */

/**
 * Heavy dependencies that should be code-split
 */
export const CODE_SPLIT_DEPENDENCIES = [
  // Editor components
  '@monaco-editor/react',
  'monaco-editor',

  // 3D and animation libraries
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
  'three',

  // AI/ML libraries
  '@anthropic-ai/sdk',
  '@ai-sdk/openai',
  '@google/generative-ai',

  // Database clients
  '@pinecone-database/pinecone',
  '@upstash/redis',

  // Large utilities
  'framer-motion',
  'mermaid',
] as const

/**
 * Components that should be dynamically imported
 */
export const DYNAMIC_COMPONENTS = {
  // High priority - loaded on most pages
  DocsAssistant: {
    path: '@/components/Dynamic/DynamicDocsAssistant',
    size: 120, // KB estimate
    loading: 'skeleton',
  },

  // Medium priority - loaded on specific pages
  LivePlayground: {
    path: '@/components/Dynamic/DynamicLivePlayground',
    size: 100, // KB estimate
    loading: 'skeleton',
  },

  // Low priority - loaded on interaction
  ThemePlayground: {
    path: '@/components/Playground/ThemePlayground',
    size: 50,
    loading: 'spinner',
  },
} as const

/**
 * Routes that should use ISR for optimal performance
 */
export const ISR_ROUTES_CONFIG = {
  '/api/reference/**': {
    revalidate: 3600, // 1 hour
    generateStaticParams: true,
  },
  '/get-started/**': {
    revalidate: 3600,
    generateStaticParams: true,
  },
  '/explore/**': {
    revalidate: 1800, // 30 minutes (more dynamic)
    generateStaticParams: false,
  },
  '/about/**': {
    revalidate: 7200, // 2 hours (stable content)
    generateStaticParams: true,
  },
} as const

/**
 * Performance budgets per route type
 */
export const PERFORMANCE_BUDGETS = {
  // Page load budgets
  initialLoad: {
    javascript: 400 * 1024, // 400 KB
    css: 50 * 1024, // 50 KB
    fonts: 100 * 1024, // 100 KB (if any)
    images: 500 * 1024, // 500 KB initial
  },

  // Core Web Vitals targets
  coreWebVitals: {
    lcp: 2500, // Largest Contentful Paint < 2.5s
    fid: 100, // First Input Delay < 100ms
    cls: 0.1, // Cumulative Layout Shift < 0.1
    fcp: 1800, // First Contentful Paint < 1.8s
    ttfb: 600, // Time to First Byte < 600ms
  },

  // ISR targets (much faster due to static serving)
  isrWebVitals: {
    lcp: 1200,
    fid: 50,
    cls: 0.05,
    fcp: 800,
    ttfb: 100, // Target: 85ms after optimization
  },
} as const

/**
 * Webpack bundle analyzer configuration
 */
export const BUNDLE_ANALYZER_CONFIG = {
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: process.env.ANALYZE === 'true',
  analyzerMode: 'static' as const,
  reportFilename: './bundle-analysis.html',
  defaultSizes: 'gzip' as const,
  generateStatsFile: true,
  statsFilename: './bundle-stats.json',
}

/**
 * Get bundle optimization recommendations based on analysis
 */
export function getBundleOptimizationRecommendations(stats: {
  totalSize: number
  largestChunk: number
  vendorSize: number
}): string[] {
  const recommendations: string[] = []

  if (stats.totalSize > PERFORMANCE_BUDGETS.initialLoad.javascript) {
    recommendations.push(
      `Total bundle size (${Math.round(stats.totalSize / 1024)}KB) exceeds budget (${PERFORMANCE_BUDGETS.initialLoad.javascript / 1024}KB)`
    )
    recommendations.push(
      '→ Consider adding more dynamic imports or removing unused dependencies'
    )
  }

  if (stats.largestChunk > 150 * 1024) {
    recommendations.push(
      `Largest chunk (${Math.round(stats.largestChunk / 1024)}KB) is too large`
    )
    recommendations.push(
      '→ Split large components or use route-based code splitting'
    )
  }

  if (stats.vendorSize > 200 * 1024) {
    recommendations.push(
      `Vendor bundle (${Math.round(stats.vendorSize / 1024)}KB) is too large`
    )
    recommendations.push(
      '→ Check for duplicate dependencies or consider using a CDN for large libraries'
    )
  }

  if (recommendations.length === 0) {
    recommendations.push('✅ Bundle size is within performance budgets')
  }

  return recommendations
}
