/**
 * Performance Monitoring Utilities
 *
 * Lightweight utilities for tracking performance metrics in demo applications.
 * Uses standard Web Performance APIs.
 *
 * @module performance
 */

// =============================================================================
// 💡 Types
// =============================================================================

export interface PerformanceMetrics {
  /** First Contentful Paint time in milliseconds */
  fcp: number | null
  /** Largest Contentful Paint time in milliseconds */
  lcp: number | null
  /** First Input Delay in milliseconds */
  fid: number | null
  /** Cumulative Layout Shift score */
  cls: number | null
  /** Time to First Byte in milliseconds */
  ttfb: number | null
  /** DOM Content Loaded time in milliseconds */
  domContentLoaded: number | null
  /** Full page load time in milliseconds */
  loadTime: number | null
}

export interface RenderMetrics {
  /** Component name */
  componentName: string
  /** Render count */
  renderCount: number
  /** Average render time in milliseconds */
  avgRenderTime: number
  /** Last render time in milliseconds */
  lastRenderTime: number
}

export interface MemoryMetrics {
  /** Used JS heap size in bytes */
  usedJSHeapSize: number | null
  /** Total JS heap size in bytes */
  totalJSHeapSize: number | null
  /** JS heap size limit in bytes */
  jsHeapSizeLimit: number | null
  /** Usage percentage */
  usagePercent: number | null
}

// =============================================================================
// 💡 Web Vitals Observer
// =============================================================================

type MetricsCallback = (metrics: Partial<PerformanceMetrics>) => void

/**
 * Creates a Web Vitals observer that tracks Core Web Vitals metrics.
 *
 * @param callback - Function called when metrics are collected
 * @returns Cleanup function to stop observing
 *
 * @example
 * ```tsx
 * useEffect(() => {
 *   return observeWebVitals((metrics) => {
 *     SecureLogger.debug('Web Vitals:', metrics)
 *   })
 * }, [])
 * ```
 */
export function observeWebVitals(callback: MetricsCallback): () => void {
  const metrics: Partial<PerformanceMetrics> = {}
  const observers: PerformanceObserver[] = []

  // Observe Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]
      metrics.lcp = lastEntry?.startTime ?? null
      callback(metrics)
    })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    observers.push(lcpObserver)
  } catch (e) {
    // LCP not supported
  }

  // Observe First Input Delay
  try {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEventTiming[]
      const firstEntry = entries[0]
      metrics.fid = firstEntry?.processingStart - firstEntry?.startTime ?? null
      callback(metrics)
    })
    fidObserver.observe({ type: 'first-input', buffered: true })
    observers.push(fidObserver)
  } catch (e) {
    // FID not supported
  }

  // Observe Cumulative Layout Shift
  try {
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        // @ts-expect-error - hadRecentInput is not in the type definition
        if (!entry.hadRecentInput) {
          // @ts-expect-error - value is not in the type definition
          clsValue += entry.value
        }
      }
      metrics.cls = clsValue
      callback(metrics)
    })
    clsObserver.observe({ type: 'layout-shift', buffered: true })
    observers.push(clsObserver)
  } catch (e) {
    // CLS not supported
  }

  // Observe Paint timing (FCP)
  try {
    const paintObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          metrics.fcp = entry.startTime
          callback(metrics)
        }
      }
    })
    paintObserver.observe({ type: 'paint', buffered: true })
    observers.push(paintObserver)
  } catch (e) {
    // Paint timing not supported
  }

  // Get navigation timing
  if (typeof window !== 'undefined' && window.performance) {
    const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (navEntry) {
      metrics.ttfb = navEntry.responseStart - navEntry.requestStart
      metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.startTime
      metrics.loadTime = navEntry.loadEventEnd - navEntry.startTime
      callback(metrics)
    }
  }

  return () => {
    observers.forEach(observer => observer.disconnect())
  }
}

// =============================================================================
// 💡 Render Performance Tracker
// =============================================================================

const renderMetricsMap = new Map<string, RenderMetrics>()

/**
 * Tracks render performance for a component.
 *
 * @param componentName - Name of the component being tracked
 * @returns Object with start and end functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const tracker = useRef(trackRender('MyComponent'))
 *
 *   useEffect(() => {
 *     tracker.current.start()
 *     // render logic
 *     tracker.current.end()
 *   })
 * }
 * ```
 */
export function trackRender(componentName: string) {
  let startTime = 0

  return {
    start: () => {
      startTime = performance.now()
    },
    end: () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime

      const existing = renderMetricsMap.get(componentName) || {
        componentName,
        renderCount: 0,
        avgRenderTime: 0,
        lastRenderTime: 0,
      }

      const newCount = existing.renderCount + 1
      const newAvg = (existing.avgRenderTime * existing.renderCount + renderTime) / newCount

      renderMetricsMap.set(componentName, {
        componentName,
        renderCount: newCount,
        avgRenderTime: newAvg,
        lastRenderTime: renderTime,
      })

      return renderTime
    },
    getMetrics: () => renderMetricsMap.get(componentName) || null,
  }
}

/**
 * Gets all render metrics for all tracked components.
 */
export function getAllRenderMetrics(): RenderMetrics[] {
  return Array.from(renderMetricsMap.values())
}

/**
 * Clears all render metrics.
 */
export function clearRenderMetrics(): void {
  renderMetricsMap.clear()
}

// =============================================================================
// 💡 Memory Usage Tracker
// =============================================================================

/**
 * Gets current memory usage metrics.
 * Only available in Chrome-based browsers.
 *
 * @returns Memory metrics or null if not supported
 */
export function getMemoryMetrics(): MemoryMetrics | null {
  // @ts-expect-error - memory is not in the Performance type definition
  const memory = performance.memory

  if (!memory) {
    return null
  }

  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    usagePercent: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}

// =============================================================================
// 💡 Performance Hook
// =============================================================================

import { useEffect, useState, useCallback, useRef } from 'react'

import { SecureLogger } from '@/lib/security/secureLogger';
interface UsePerformanceOptions {
  /** Update interval in milliseconds */
  updateInterval?: number
  /** Enable Web Vitals tracking */
  trackWebVitals?: boolean
  /** Enable memory tracking */
  trackMemory?: boolean
  /** Component name for render tracking */
  componentName?: string
}

interface UsePerformanceResult {
  /** Web Vitals metrics */
  webVitals: Partial<PerformanceMetrics>
  /** Memory metrics */
  memory: MemoryMetrics | null
  /** Render metrics for this component */
  renderMetrics: RenderMetrics | null
  /** All render metrics */
  allRenderMetrics: RenderMetrics[]
  /** FPS counter */
  fps: number
  /** Mark render start */
  markRenderStart: () => void
  /** Mark render end */
  markRenderEnd: () => number
}

/**
 * Hook for tracking performance metrics.
 *
 * @param options - Configuration options
 * @returns Performance metrics and tracking functions
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { webVitals, memory, fps } = usePerformance({
 *     trackWebVitals: true,
 *     trackMemory: true,
 *   })
 *
 *   return (
 *     <div>
 *       <p>FPS: {fps}</p>
 *       <p>LCP: {webVitals.lcp}ms</p>
 *       <p>Memory: {memory?.usagePercent}%</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePerformance(options: UsePerformanceOptions = {}): UsePerformanceResult {
  const {
    updateInterval = 1000,
    trackWebVitals = true,
    trackMemory = true,
    componentName,
  } = options

  const [webVitals, setWebVitals] = useState<Partial<PerformanceMetrics>>({})
  const [memory, setMemory] = useState<MemoryMetrics | null>(null)
  const [fps, setFps] = useState(0)

  const renderTracker = useRef(componentName ? trackRender(componentName) : null)

  // Track Web Vitals
  useEffect(() => {
    if (!trackWebVitals) return

    return observeWebVitals((metrics) => {
      setWebVitals(metrics)
    })
  }, [trackWebVitals])

  // Track memory and FPS
  useEffect(() => {
    if (!trackMemory) return

    let frameCount = 0
    let lastTime = performance.now()
    let animationFrameId: number

    const updateMetrics = () => {
      // Update memory
      setMemory(getMemoryMetrics())

      // Calculate FPS
      const now = performance.now()
      const elapsed = now - lastTime

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount * 1000) / elapsed))
        frameCount = 0
        lastTime = now
      }
    }

    const countFrame = () => {
      frameCount++
      animationFrameId = requestAnimationFrame(countFrame)
    }

    animationFrameId = requestAnimationFrame(countFrame)
    const interval = setInterval(updateMetrics, updateInterval)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(interval)
    }
  }, [trackMemory, updateInterval])

  const markRenderStart = useCallback(() => {
    renderTracker.current?.start()
  }, [])

  const markRenderEnd = useCallback(() => {
    return renderTracker.current?.end() || 0
  }, [])

  return {
    webVitals,
    memory,
    renderMetrics: renderTracker.current?.getMetrics() || null,
    allRenderMetrics: getAllRenderMetrics(),
    fps,
    markRenderStart,
    markRenderEnd,
  }
}

// =============================================================================
// 💡 Format Helpers
// =============================================================================

/**
 * Formats bytes to human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Formats milliseconds to human-readable string.
 */
export function formatMs(ms: number): string {
  if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`
  if (ms < 1000) return `${ms.toFixed(1)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}
