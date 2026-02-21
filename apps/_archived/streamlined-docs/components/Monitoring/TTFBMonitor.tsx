'use client'

import { useEffect } from 'react'
import { onTTFB, onLCP, onINP, onCLS, type Metric } from 'web-vitals'

/**
 * TTFB (Time to First Byte) Monitoring Component
 *
 * Wave 3.3 Agent 35 - ISR Cache Optimizer
 *
 * Monitors Core Web Vitals and tracks cache performance:
 * - TTFB: Time to First Byte
 * - LCP: Largest Contentful Paint
 * - INP: Interaction to Next Paint (replaces FID)
 * - CLS: Cumulative Layout Shift
 * - Cache Hit Rate: Whether page was served from cache
 *
 * Performance targets:
 * - TTFB: < 100ms (cached), < 800ms (uncached)
 * - LCP: < 2.5s
 * - INP: < 200ms
 * - CLS: < 0.1
 * - Cache Hit Rate: > 95%
 */
export function TTFBMonitor() {
  useEffect(() => {
    // Monitor TTFB
    onTTFB((metric: Metric) => {
      const ttfb = metric.value

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[TTFB] ${Math.round(ttfb)}ms`, {
          rating: metric.rating,
          navigationType: metric.navigationType,
        })
      }

      // Send to analytics in production
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'TTFB',
          value: Math.round(ttfb),
          metric_rating: metric.rating,
          non_interaction: true,
        })
      }

      // Track cache status
      if (performance.getEntriesByType) {
        const navEntry = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming

        // Determine if served from cache
        const fromCache =
          navEntry?.deliveryType === 'cache' ||
          navEntry?.transferSize === 0 ||
          (navEntry?.transferSize > 0 &&
            navEntry?.transferSize < navEntry?.encodedBodySize * 0.1)

        // Log cache status
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Cache] ${fromCache ? 'HIT' : 'MISS'}`, {
            deliveryType: navEntry?.deliveryType,
            transferSize: navEntry?.transferSize,
            encodedBodySize: navEntry?.encodedBodySize,
          })
        }

        // Send cache status to analytics
        if (window.gtag) {
          window.gtag('event', 'cache_status', {
            from_cache: fromCache,
            ttfb: Math.round(ttfb),
            delivery_type: navEntry?.deliveryType,
          })
        }

        // Alert if TTFB is too high for cached content
        if (fromCache && ttfb > 100) {
          console.warn(
            `[Performance Warning] High TTFB for cached content: ${Math.round(ttfb)}ms`
          )
        }

        // Alert if cache miss on static page
        const isStaticPage =
          window.location.pathname.startsWith('/api/reference/') ||
          window.location.pathname.startsWith('/get-started/') ||
          window.location.pathname.startsWith('/explore/')

        if (!fromCache && isStaticPage && ttfb > 800) {
          console.warn(
            `[Performance Warning] Slow cache miss on static page: ${Math.round(ttfb)}ms`
          )
        }
      }
    })

    // Monitor LCP (Largest Contentful Paint)
    onLCP((metric: Metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[LCP] ${Math.round(metric.value)}ms`, {
          rating: metric.rating,
        })
      }

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'LCP',
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          non_interaction: true,
        })
      }
    })

    // Monitor INP (Interaction to Next Paint) - replaces FID in web-vitals 5.x
    onINP((metric: Metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[INP] ${Math.round(metric.value)}ms`, {
          rating: metric.rating,
        })
      }

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'INP',
          value: Math.round(metric.value),
          metric_rating: metric.rating,
          non_interaction: true,
        })
      }
    })

    // Monitor CLS (Cumulative Layout Shift)
    onCLS((metric: Metric) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CLS] ${metric.value.toFixed(3)}`, {
          rating: metric.rating,
        })
      }

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Performance',
          event_label: 'CLS',
          value: Math.round(metric.value * 1000), // Convert to integer for GA
          metric_rating: metric.rating,
          non_interaction: true,
        })
      }
    })
  }, [])

  // This component doesn't render anything
  return null
}

// TypeScript augmentation for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      eventName: string,
      params: Record<string, string | number | boolean>
    ) => void
  }
}
