'use client'

import { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  pageLoadTime?: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  timeToInteractive?: number
}

export function usePerformanceMonitoring() {
  const metricsRef = useRef<PerformanceMetrics>({})

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Measure page load time
    const navigationStart =
      performance.timing?.navigationStart || performance.now()
    const loadComplete = () => {
      const loadTime = performance.now() - navigationStart
      metricsRef.current.pageLoadTime = loadTime

      // Log to console (in production, you'd send to analytics)
      logger.debug('📊 Performance Metrics:', {
        pageLoadTime: Math.round(loadTime),
        ...metricsRef.current,
      })
    }

    // Use Performance Observer for more detailed metrics
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
              metricsRef.current.firstContentfulPaint = entry.startTime
            }
          }
        })
        fcpObserver.observe({ entryTypes: ['paint'] })
      } catch (error) {
        logger.warn('Failed to observe paint metrics:', error)
      }

      // Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          metricsRef.current.largestContentfulPaint = lastEntry?.startTime
        })
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (error) {
        logger.warn('Failed to observe LCP metrics:', error)
      }

      // First Input Delay
      try {
        const fidObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            metricsRef.current.firstInputDelay =
              entry.processingStart - entry.startTime
          }
        })
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (error) {
        logger.warn('Failed to observe FID metrics:', error)
      }

      // Layout Shift
      try {
        let clsValue = 0
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          }
          metricsRef.current.cumulativeLayoutShift = clsValue
        })
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (error) {
        logger.warn('Failed to observe CLS metrics:', error)
      }
    }

    // Measure time to interactive
    const measureTTI = () => {
      if ('PerformanceObserver' in window) {
        try {
          const ttiObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.name === 'time-to-interactive') {
                metricsRef.current.timeToInteractive = entry.startTime
              }
            }
          })
          ttiObserver.observe({ entryTypes: ['measure'] })
        } catch (error) {
          // Fallback: estimate TTI based on when the page becomes interactive
          setTimeout(() => {
            metricsRef.current.timeToInteractive =
              performance.now() - navigationStart
          }, 5000) // Estimate after 5 seconds
        }
      }
    }

    // Wait for page to load before measuring
    if (document.readyState === 'complete') {
      loadComplete()
      measureTTI()
    } else {
      window.addEventListener('load', () => {
        loadComplete()
        measureTTI()
      })
    }

    return () => {
      window.removeEventListener('load', loadComplete)
    }
  }, [])

  return metricsRef.current
}

export function AnalyticsScript() {
  useEffect(() => {
    // Simple page view tracking
    const trackPageView = () => {
      const data = {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        device: {
          pixelRatio: window.devicePixelRatio,
          touch: 'ontouchstart' in window,
        },
      }

      // In production, you'd send this to your analytics service
      logger.debug('📈 Page View:', data)
    }

    trackPageView()

    // Track outbound links
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLAnchorElement
      if (
        target.tagName === 'A' &&
        target.href.startsWith('http') &&
        !target.href.includes(window.location.hostname)
      ) {
        logger.debug('🔗 Outbound Link:', target.href)
      }
    }

    document.addEventListener('click', handleLinkClick)

    return () => {
      document.removeEventListener('click', handleLinkClick)
    }
  }, [])

  return null
}
