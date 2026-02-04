/**
 * ISR (Incremental Static Regeneration) Configuration
 *
 * Performance optimization strategy for API documentation:
 * - Static generation for faster initial load
 * - Automatic revalidation every hour for fresh content
 * - Target: 90% TTFB reduction (850ms → 85ms)
 */

/**
 * Revalidation interval for stable documentation pages (1 hour)
 * Balances freshness with cache efficiency
 */
export const DOCS_REVALIDATE_SECONDS = 3600

/**
 * Revalidation interval for frequently updated content (5 minutes)
 */
export const DYNAMIC_REVALIDATE_SECONDS = 300

/**
 * Route segments that should use ISR
 */
export const ISR_ROUTES = [
  '/api/reference',
  '/get-started',
  '/explore',
  '/about',
] as const

/**
 * Generate static params for API reference pages
 * This enables static generation at build time
 */
export function generateAPIReferenceParams() {
  return [
    // Top-level reference pages
    { slug: [] },
    { slug: ['components'] },
    { slug: ['hooks'] },
    { slug: ['utilities'] },
    { slug: ['adapters'] },
    { slug: ['templates'] },
    { slug: ['services'] },
    { slug: ['cheat-sheet'] },
    { slug: ['quick-reference'] },
    { slug: ['api-standalone'] },

    // API nested pages
    { slug: ['api'] },
    { slug: ['api', 'components'] },
    { slug: ['api', 'hooks'] },
    { slug: ['api', 'primitives'] },
    { slug: ['api', 'utilities'] },
    { slug: ['api', 'types'] },
    { slug: ['api', 'configuration'] },
    { slug: ['api', 'streaming-components'] },
    { slug: ['api', 'model-adapters'] },
    { slug: ['api', 'react-components'] },
  ]
}

/**
 * Performance monitoring metadata for ISR pages
 */
export interface ISRPerformanceMetrics {
  route: string
  ttfb: number // Time to First Byte
  fcp: number // First Contentful Paint
  lcp: number // Largest Contentful Paint
  cacheStatus: 'HIT' | 'MISS' | 'STALE'
  generatedAt: string
}

/**
 * Log ISR performance metrics (development only)
 */
export function logISRMetrics(metrics: ISRPerformanceMetrics): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[ISR Performance]', {
      route: metrics.route,
      ttfb: `${metrics.ttfb}ms`,
      fcp: `${metrics.fcp}ms`,
      lcp: `${metrics.lcp}ms`,
      cache: metrics.cacheStatus,
      generated: metrics.generatedAt,
    })
  }
}
