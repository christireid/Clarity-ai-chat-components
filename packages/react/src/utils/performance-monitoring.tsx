/**
 * Performance Monitoring Utilities
 *
 * Comprehensive performance tracking for content components.
 * Measures render times, memory usage, and provides performance insights.
 */

import { useEffect, useRef, useCallback } from 'react'

// ============================================================================
// TYPES
// ============================================================================

export interface PerformanceMetrics {
  /** Component name */
  component: string
  /** Render time in milliseconds */
  renderTime: number
  /** Memory usage delta */
  memoryDelta?: number
  /** Timestamp */
  timestamp: number
  /** Additional metadata */
  metadata?: Record<string, any>
}

export interface PerformanceConfig {
  /** Enable performance tracking */
  enabled: boolean
  /** Log to console */
  logToConsole: boolean
  /** Send to analytics */
  sendToAnalytics: boolean
  /** Performance thresholds */
  thresholds: {
    slowRender: number // ms
    memoryLeak: number // bytes
  }
}

export interface UsePerformanceTrackingOptions {
  /** Component name for tracking */
  componentName: string
  /** Enable memory tracking */
  trackMemory?: boolean
  /** Custom metadata */
  metadata?: Record<string, any>
  /** Performance config override */
  config?: Partial<PerformanceConfig>
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: PerformanceConfig = {
  enabled: process.env['NODE_ENV'] === 'development',
  logToConsole: process.env['NODE_ENV'] === 'development',
  sendToAnalytics: process.env['NODE_ENV'] === 'production',
  thresholds: {
    slowRender: 16, // 60fps threshold
    memoryLeak: 1024 * 1024, // 1MB
  },
}

// ============================================================================
// PERFORMANCE TRACKING HOOK
// ============================================================================

/**
 * Hook for tracking component performance metrics
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformanceTracking({
 *     componentName: 'MyComponent',
 *     trackMemory: true,
 *     metadata: { variant: 'large' }
 *   })
 *
 *   return <div>Content</div>
 * }
 * ```
 */
export function usePerformanceTracking({
  componentName,
  trackMemory = false,
  metadata = {},
  config = {},
}: UsePerformanceTrackingOptions) {
  const renderStartRef = useRef<number | undefined>(undefined)
  const memoryStartRef = useRef<number | undefined>(undefined)
  const configRef = useRef({ ...DEFAULT_CONFIG, ...config })

  const startTracking = useCallback(() => {
    renderStartRef.current = performance.now()

    if (trackMemory && 'memory' in performance) {
      memoryStartRef.current = (performance as any).memory.usedJSHeapSize
    }
  }, [trackMemory])

  const endTracking = useCallback(() => {
    if (!renderStartRef.current) return

    const renderTime = performance.now() - renderStartRef.current
    const metrics: PerformanceMetrics = {
      component: componentName,
      renderTime,
      timestamp: Date.now(),
      metadata,
    }

    // Track memory usage
    if (trackMemory && memoryStartRef.current && 'memory' in performance) {
      const memoryEnd = (performance as any).memory.usedJSHeapSize
      metrics.memoryDelta = memoryEnd - memoryStartRef.current
    }

    // Log performance metrics
    logPerformanceMetrics(metrics)

    // Send to analytics if enabled
    if (configRef.current.sendToAnalytics) {
      sendToAnalytics(metrics)
    }
  }, [componentName, trackMemory, metadata])

  useEffect(() => {
    if (!configRef.current.enabled) return

    startTracking()

    return () => {
      endTracking()
    }
  })

  return { startTracking, endTracking }
}

// ============================================================================
// PERFORMANCE LOGGING
// ============================================================================

/**
 * Log performance metrics with appropriate formatting
 */
export function logPerformanceMetrics(metrics: PerformanceMetrics) {
  const config = DEFAULT_CONFIG

  if (!config.logToConsole) return

  const { component, renderTime, memoryDelta } = metrics

  // Color coding based on performance
  const isSlow = renderTime > config.thresholds.slowRender
  const hasMemoryLeak = memoryDelta && memoryDelta > config.thresholds.memoryLeak

  const status = isSlow || hasMemoryLeak ? '🔴' : renderTime > 8 ? '🟡' : '🟢'

  console.group(`%c${status} Performance: ${component}`, getLogStyle(Boolean(isSlow || hasMemoryLeak)))

  console.log(`Render time: ${renderTime.toFixed(2)}ms`)

  if (memoryDelta !== undefined) {
    const memoryMB = (memoryDelta / (1024 * 1024)).toFixed(2)
    console.log(`Memory delta: ${memoryMB}MB`)
  }

  if (metrics.metadata && Object.keys(metrics.metadata).length > 0) {
    console.log('Metadata:', metrics.metadata)
  }

  console.groupEnd()
}

/**
 * Get console log styling based on performance status
 */
function getLogStyle(isPoor: boolean): string {
  return isPoor
    ? 'color: #dc2626; font-weight: bold; font-size: 12px;'
    : 'color: #059669; font-weight: bold; font-size: 12px;'
}

// ============================================================================
// ANALYTICS INTEGRATION
// ============================================================================

/**
 * Send performance metrics to analytics service
 * This is a placeholder - integrate with your analytics provider
 */
function sendToAnalytics(metrics: PerformanceMetrics) {
  // Example: Send to Google Analytics, Mixpanel, etc.
  // gtag('event', 'component_performance', {
  //   component: metrics.component,
  //   render_time: metrics.renderTime,
  //   memory_delta: metrics.memoryDelta,
  //   timestamp: metrics.timestamp,
  //   ...metrics.metadata
  // })

  // For now, just store in localStorage for debugging
  try {
    const stored = localStorage.getItem('clarity-performance-metrics')
    const metricsArray = stored ? JSON.parse(stored) : []
    metricsArray.push(metrics)

    // Keep only last 100 metrics to prevent storage bloat
    if (metricsArray.length > 100) {
      metricsArray.shift()
    }

    localStorage.setItem('clarity-performance-metrics', JSON.stringify(metricsArray))
  } catch (error) {
    // Ignore localStorage errors (private browsing, quota exceeded, etc.)
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Measure function execution time
 */
export function measureExecutionTime<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()

  console.log(`%c⏱️ ${label}: ${(end - start).toFixed(2)}ms`, 'color: #7c3aed;')

  return result
}

/**
 * Create a performance-marked callback
 */
export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  label: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()

    console.log(`%c⚡ ${label}: ${(end - start).toFixed(2)}ms`, 'color: #0891b2;')

    return result
  }) as T
}

/**
 * Get current memory usage (if available)
 */
export function getMemoryUsage(): { used: number; total: number; limit: number } | null {
  if (!('memory' in performance)) return null

  const memory = (performance as any).memory
  return {
    used: memory.usedJSHeapSize,
    total: memory.totalJSHeapSize,
    limit: memory.jsHeapSizeLimit,
  }
}

/**
 * Get performance metrics summary
 */
export function getPerformanceSummary(): {
  averageRenderTime: number
  slowestComponent: string
  totalComponents: number
  memoryUsage?: number
} {
  try {
    const stored = localStorage.getItem('clarity-performance-metrics')
    if (!stored) return { averageRenderTime: 0, slowestComponent: '', totalComponents: 0 }

    const metrics: PerformanceMetrics[] = JSON.parse(stored)
    if (metrics.length === 0) return { averageRenderTime: 0, slowestComponent: '', totalComponents: 0 }

    const totalRenderTime = metrics.reduce((sum, m) => sum + m.renderTime, 0)
    const averageRenderTime = totalRenderTime / metrics.length

    const slowestMetric = metrics.reduce((slowest, current) =>
      current.renderTime > slowest.renderTime ? current : slowest
    )

    const memoryUsage = getMemoryUsage()

    return {
      averageRenderTime,
      slowestComponent: slowestMetric.component,
      totalComponents: metrics.length,
      memoryUsage: memoryUsage?.used,
    }
  } catch (error) {
    return { averageRenderTime: 0, slowestComponent: '', totalComponents: 0 }
  }
}

// ============================================================================
// COMPONENT PERFORMANCE WRAPPER
// ============================================================================

/**
 * Higher-order component for performance tracking
 */
export function withComponentPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => {
    usePerformanceTracking({ componentName })

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withComponentPerformanceTracking(${componentName})`

  return WrappedComponent
}

// ============================================================================
// REACT PROFILER INTEGRATION
// ============================================================================

/**
 * Custom profiler callback for React DevTools integration
 */
export function createProfilerCallback(componentName: string) {
  return (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    if (DEFAULT_CONFIG.logToConsole) {
      console.log(
        `%c⚛️ ${componentName} ${phase}`,
        'color: #06b6d4;',
        {
          actualDuration: `${actualDuration.toFixed(2)}ms`,
          baseDuration: `${baseDuration.toFixed(2)}ms`,
          startTime,
          commitTime,
        }
      )
    }
  }
}