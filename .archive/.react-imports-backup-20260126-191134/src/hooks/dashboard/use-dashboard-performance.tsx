'use client'

import * as React from 'react'

/**
 * Performance metrics captured by the hook
 */
export interface DashboardPerformanceMetrics {
  /** Number of renders */
  renderCount: number
  /** Time of last render (ms since epoch) */
  lastRenderTime: number
  /** Duration of last render (ms) */
  lastRenderDuration: number
  /** Average render duration (ms) */
  averageRenderDuration: number
  /** Number of data fetches */
  fetchCount: number
  /** Average fetch duration (ms) */
  averageFetchDuration: number
  /** Last fetch duration (ms) */
  lastFetchDuration: number
  /** Time since component mounted (ms) */
  mountDuration: number
  /** First contentful paint time (ms) - time until first data load */
  firstContentfulPaint: number | null
  /** Peak memory usage if available */
  peakMemoryMB: number | null
}

/**
 * Options for useDashboardPerformance
 */
export interface UseDashboardPerformanceOptions {
  /** Unique identifier for this dashboard instance */
  dashboardId: string
  /** Enable console logging of metrics */
  debug?: boolean
  /** Callback when metrics are updated */
  onMetricsUpdate?: (metrics: DashboardPerformanceMetrics) => void
  /** Threshold (ms) above which renders are considered slow */
  slowRenderThreshold?: number
  /** Threshold (ms) above which fetches are considered slow */
  slowFetchThreshold?: number
  /** Callback when a slow render is detected */
  onSlowRender?: (duration: number) => void
  /** Callback when a slow fetch is detected */
  onSlowFetch?: (duration: number) => void
}

/**
 * Return type for useDashboardPerformance
 */
export interface UseDashboardPerformanceReturn {
  /** Current performance metrics */
  metrics: DashboardPerformanceMetrics
  /** Start timing a fetch operation */
  startFetchTiming: () => () => void
  /** Record a custom performance mark */
  mark: (name: string) => void
  /** Measure time between two marks */
  measure: (name: string, startMark: string, endMark?: string) => number | null
  /** Reset all metrics */
  reset: () => void
  /** Export metrics as JSON */
  exportMetrics: () => string
  /** Get a performance summary for logging/display */
  getSummary: () => string
}

const initialMetrics: DashboardPerformanceMetrics = {
  renderCount: 0,
  lastRenderTime: 0,
  lastRenderDuration: 0,
  averageRenderDuration: 0,
  fetchCount: 0,
  averageFetchDuration: 0,
  lastFetchDuration: 0,
  mountDuration: 0,
  firstContentfulPaint: null,
  peakMemoryMB: null,
}

/**
 * Hook for monitoring dashboard performance.
 *
 * Tracks render counts, fetch timing, and memory usage.
 * Provides callbacks for slow operation detection.
 *
 * @example
 * ```tsx
 * function AnalyticsDashboard() {
 *   const { metrics, startFetchTiming, getSummary } = useDashboardPerformance({
 *     dashboardId: 'analytics',
 *     slowRenderThreshold: 16, // 60fps target
 *     onSlowRender: (duration) => {
 *       console.warn(`Slow render: ${duration}ms`)
 *     },
 *   })
 *
 *   const fetchData = async () => {
 *     const endTiming = startFetchTiming()
 *     try {
 *       const data = await api.getData()
 *       return data
 *     } finally {
 *       endTiming()
 *     }
 *   }
 *
 *   // In dev tools or debug panel
 *   console.log(getSummary())
 *
 *   return <Dashboard />
 * }
 * ```
 */
export function useDashboardPerformance(
  options: UseDashboardPerformanceOptions
): UseDashboardPerformanceReturn {
  const {
    dashboardId,
    debug = false,
    onMetricsUpdate,
    slowRenderThreshold = 16, // 60fps target
    slowFetchThreshold = 1000, // 1 second
    onSlowRender,
    onSlowFetch,
  } = options

  const [metrics, setMetrics] = React.useState<DashboardPerformanceMetrics>(
    () => ({ ...initialMetrics })
  )

  const mountTimeRef = React.useRef<number>(Date.now())
  const renderStartRef = React.useRef<number>(0)
  const totalRenderDurationRef = React.useRef<number>(0)
  const totalFetchDurationRef = React.useRef<number>(0)
  const marksRef = React.useRef<Map<string, number>>(new Map())

  const log = React.useCallback(
    (message: string, ...args: unknown[]) => {
      if (debug) {
        console.log(`[DashboardPerf:${dashboardId}] ${message}`, ...args)
      }
    },
    [debug, dashboardId]
  )

  // Track render timing
  React.useLayoutEffect(() => {
    renderStartRef.current = performance.now()
  })

  React.useEffect(() => {
    const renderDuration = performance.now() - renderStartRef.current
    totalRenderDurationRef.current += renderDuration

    setMetrics((prev) => {
      const newRenderCount = prev.renderCount + 1
      const newMetrics: DashboardPerformanceMetrics = {
        ...prev,
        renderCount: newRenderCount,
        lastRenderTime: Date.now(),
        lastRenderDuration: renderDuration,
        averageRenderDuration: totalRenderDurationRef.current / newRenderCount,
        mountDuration: Date.now() - mountTimeRef.current,
      }

      // Check for slow render
      if (renderDuration > slowRenderThreshold) {
        log(`Slow render detected: ${renderDuration.toFixed(2)}ms`)
        onSlowRender?.(renderDuration)
      }

      onMetricsUpdate?.(newMetrics)
      return newMetrics
    })
  }, [slowRenderThreshold, log, onSlowRender, onMetricsUpdate])

  // Track memory usage (if available)
  React.useEffect(() => {
    const updateMemory = () => {
      if ('memory' in performance) {
        const memory = (
          performance as unknown as { memory: { usedJSHeapSize: number } }
        ).memory
        const memoryMB = memory.usedJSHeapSize / (1024 * 1024)

        setMetrics((prev) => {
          if (prev.peakMemoryMB === null || memoryMB > prev.peakMemoryMB) {
            return { ...prev, peakMemoryMB: memoryMB }
          }
          return prev
        })
      }
    }

    updateMemory()
    const interval = setInterval(updateMemory, 5000)
    return () => clearInterval(interval)
  }, [])

  const startFetchTiming = React.useCallback((): (() => void) => {
    const startTime = performance.now()
    log('Fetch started')

    return () => {
      const duration = performance.now() - startTime
      totalFetchDurationRef.current += duration

      setMetrics((prev) => {
        const newFetchCount = prev.fetchCount + 1
        const newMetrics: DashboardPerformanceMetrics = {
          ...prev,
          fetchCount: newFetchCount,
          lastFetchDuration: duration,
          averageFetchDuration: totalFetchDurationRef.current / newFetchCount,
          firstContentfulPaint:
            prev.firstContentfulPaint === null
              ? Date.now() - mountTimeRef.current
              : prev.firstContentfulPaint,
        }

        log(`Fetch completed in ${duration.toFixed(2)}ms`)

        // Check for slow fetch
        if (duration > slowFetchThreshold) {
          log(`Slow fetch detected: ${duration.toFixed(2)}ms`)
          onSlowFetch?.(duration)
        }

        onMetricsUpdate?.(newMetrics)
        return newMetrics
      })
    }
  }, [log, slowFetchThreshold, onSlowFetch, onMetricsUpdate])

  const mark = React.useCallback(
    (name: string) => {
      const fullName = `${dashboardId}:${name}`
      marksRef.current.set(fullName, performance.now())
      log(`Mark: ${name}`)
    },
    [dashboardId, log]
  )

  const measure = React.useCallback(
    (name: string, startMark: string, endMark?: string): number | null => {
      const startFullName = `${dashboardId}:${startMark}`
      const endFullName = endMark ? `${dashboardId}:${endMark}` : null

      const startTime = marksRef.current.get(startFullName)
      if (startTime === undefined) {
        log(`Mark not found: ${startMark}`)
        return null
      }

      const endTime = endFullName
        ? marksRef.current.get(endFullName)
        : performance.now()

      if (endTime === undefined) {
        log(`Mark not found: ${endMark}`)
        return null
      }

      const duration = endTime - startTime
      log(`Measure ${name}: ${duration.toFixed(2)}ms`)
      return duration
    },
    [dashboardId, log]
  )

  const reset = React.useCallback(() => {
    mountTimeRef.current = Date.now()
    totalRenderDurationRef.current = 0
    totalFetchDurationRef.current = 0
    marksRef.current.clear()
    setMetrics({ ...initialMetrics })
    log('Metrics reset')
  }, [log])

  const exportMetrics = React.useCallback((): string => {
    return JSON.stringify(
      {
        dashboardId,
        timestamp: new Date().toISOString(),
        metrics,
      },
      null,
      2
    )
  }, [dashboardId, metrics])

  const getSummary = React.useCallback((): string => {
    const lines = [
      `Dashboard Performance: ${dashboardId}`,
      `------------------------`,
      `Renders: ${metrics.renderCount}`,
      `Avg Render: ${metrics.averageRenderDuration.toFixed(2)}ms`,
      `Fetches: ${metrics.fetchCount}`,
      `Avg Fetch: ${metrics.averageFetchDuration.toFixed(2)}ms`,
      `FCP: ${metrics.firstContentfulPaint?.toFixed(0) ?? 'N/A'}ms`,
      `Uptime: ${(metrics.mountDuration / 1000).toFixed(1)}s`,
    ]

    if (metrics.peakMemoryMB !== null) {
      lines.push(`Peak Memory: ${metrics.peakMemoryMB.toFixed(2)}MB`)
    }

    return lines.join('\n')
  }, [dashboardId, metrics])

  return {
    metrics,
    startFetchTiming,
    mark,
    measure,
    reset,
    exportMetrics,
    getSummary,
  }
}

/**
 * Context for sharing performance metrics across components
 */
export interface PerformanceContextValue {
  registerDashboard: (id: string) => void
  unregisterDashboard: (id: string) => void
  getMetrics: (id: string) => DashboardPerformanceMetrics | null
  getAllMetrics: () => Record<string, DashboardPerformanceMetrics>
}

const PerformanceContext = React.createContext<PerformanceContextValue | null>(
  null
)

/**
 * Provider for dashboard performance monitoring
 */
export function DashboardPerformanceProvider({
  children,
}: {
  children: React.ReactNode
}): React.ReactElement {
  const metricsRef = React.useRef<Map<string, DashboardPerformanceMetrics>>(
    new Map()
  )

  const registerDashboard = React.useCallback((id: string) => {
    if (!metricsRef.current.has(id)) {
      metricsRef.current.set(id, { ...initialMetrics })
    }
  }, [])

  const unregisterDashboard = React.useCallback((id: string) => {
    metricsRef.current.delete(id)
  }, [])

  const getMetrics = React.useCallback(
    (id: string): DashboardPerformanceMetrics | null => {
      return metricsRef.current.get(id) ?? null
    },
    []
  )

  const getAllMetrics = React.useCallback((): Record<
    string,
    DashboardPerformanceMetrics
  > => {
    const result: Record<string, DashboardPerformanceMetrics> = {}
    metricsRef.current.forEach((value, key) => {
      result[key] = value
    })
    return result
  }, [])

  const value = React.useMemo(
    () => ({
      registerDashboard,
      unregisterDashboard,
      getMetrics,
      getAllMetrics,
    }),
    [registerDashboard, unregisterDashboard, getMetrics, getAllMetrics]
  )

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}

/**
 * Hook to access dashboard performance context
 */
export function usePerformanceContext(): PerformanceContextValue {
  const context = React.useContext(PerformanceContext)
  if (!context) {
    throw new Error(
      'usePerformanceContext must be used within DashboardPerformanceProvider'
    )
  }
  return context
}
