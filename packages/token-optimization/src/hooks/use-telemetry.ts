/**
 * useTelemetry Hook
 *
 * React hooks for OpenTelemetry integration with token optimization operations.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import {
  TelemetryCollector,
  type TelemetryConfig,
  type TelemetryMetrics,
  type TelemetrySpan,
  createConsoleExporter,
} from '../telemetry/telemetry-collector'

/**
 * Telemetry hook configuration
 */
export interface UseTelemetryConfig extends TelemetryConfig {
  /** Auto-export interval (ms) */
  autoExportInterval?: number
  /** Enable console exporter */
  enableConsoleExporter?: boolean
}

/**
 * Telemetry state
 */
export interface TelemetryState {
  /** Current metrics */
  metrics: TelemetryMetrics
  /** Recent spans */
  recentSpans: TelemetrySpan[]
  /** Is telemetry enabled */
  enabled: boolean
  /** Total spans collected */
  totalSpans: number
}

/**
 * Main telemetry hook
 *
 * Provides observability for all token optimization operations.
 *
 * @example
 * ```tsx
 * function App() {
 *   const {
 *     metrics,
 *     recentSpans,
 *     startSpan,
 *     endSpan,
 *     recordMetric,
 *     exportData,
 *   } = useTelemetry({
 *     serviceName: 'my-app',
 *     enableTracing: true,
 *     enableMetrics: true,
 *   })
 *
 *   const handleOperation = async () => {
 *     const spanId = startSpan('operation')
 *     try {
 *       // Your operation
 *       recordMetric('operationsPerformed', 1)
 *       endSpan(spanId)
 *     } catch (error) {
 *       recordError(spanId, error)
 *       endSpan(spanId)
 *     }
 *   }
 *
 *   return (
 *     <div>
 *       <p>Operations: {metrics.optimizationsPerformed}</p>
 *       <p>Cache Hits: {metrics.cacheHits}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTelemetry(config: UseTelemetryConfig) {
  const [state, setState] = useState<TelemetryState>({
    metrics: {
      tokensCounted: 0,
      optimizationsPerformed: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorsEncountered: 0,
      currentTokens: 0,
      currentCost: 0,
      cacheSize: 0,
      tokenCountDurations: [],
      optimizationDurations: [],
      costCalculationDurations: [],
    },
    recentSpans: [],
    enabled: true,
    totalSpans: 0,
  })

  const collectorRef = useRef<TelemetryCollector>()
  const exporterIntervalRef = useRef<NodeJS.Timeout>()

  // Initialize collector
  useEffect(() => {
    collectorRef.current = new TelemetryCollector({
      serviceName: config.serviceName,
      enableTracing: config.enableTracing,
      enableMetrics: config.enableMetrics,
      sampleRate: config.sampleRate,
      exportInterval: config.exportInterval,
      attributes: config.attributes,
    })

    // Setup console exporter if enabled
    if (config.enableConsoleExporter) {
      exporterIntervalRef.current = createConsoleExporter(collectorRef.current)
    }

    // Setup auto-export for UI updates
    if (config.autoExportInterval) {
      const interval = setInterval(() => {
        if (collectorRef.current) {
          const metrics = collectorRef.current.getMetrics()
          const spans = collectorRef.current.getSpans()

          setState((prev) => ({
            ...prev,
            metrics,
            recentSpans: spans.slice(-10), // Last 10 spans
            totalSpans: prev.totalSpans + spans.length,
          }))
        }
      }, config.autoExportInterval)

      return () => {
        clearInterval(interval)
        if (exporterIntervalRef.current) {
          clearInterval(exporterIntervalRef.current)
        }
      }
    }

    return () => {
      if (exporterIntervalRef.current) {
        clearInterval(exporterIntervalRef.current)
      }
    }
  }, [])

  /**
   * Start a new span
   */
  const startSpan = useCallback(
    (name: string, attributes?: Record<string, any>): string => {
      if (!collectorRef.current) return ''
      return collectorRef.current.startSpan(name, attributes)
    },
    []
  )

  /**
   * End a span
   */
  const endSpan = useCallback(
    (spanId: string, attributes?: Record<string, any>): void => {
      if (!collectorRef.current) return
      collectorRef.current.endSpan(spanId, attributes)
    },
    []
  )

  /**
   * Record an error
   */
  const recordError = useCallback((spanId: string, error: Error): void => {
    if (!collectorRef.current) return
    collectorRef.current.recordError(spanId, error)
  }, [])

  /**
   * Add event to span
   */
  const addEvent = useCallback(
    (spanId: string, name: string, attributes?: Record<string, any>): void => {
      if (!collectorRef.current) return
      collectorRef.current.addEvent(spanId, name, attributes)
    },
    []
  )

  /**
   * Record a metric
   */
  const recordMetric = useCallback(
    (name: keyof TelemetryMetrics, value: number): void => {
      if (!collectorRef.current) return
      collectorRef.current.recordMetric(name, value)

      // Update state immediately for UI
      setState((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [name]: value,
        },
      }))
    },
    []
  )

  /**
   * Increment a counter
   */
  const incrementCounter = useCallback(
    (name: keyof TelemetryMetrics, delta: number = 1): void => {
      if (!collectorRef.current) return
      collectorRef.current.incrementCounter(name, delta)

      // Update state immediately for UI
      setState((prev) => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          [name]: (prev.metrics[name] as number) + delta,
        },
      }))
    },
    []
  )

  /**
   * Get current metrics
   */
  const getMetrics = useCallback((): TelemetryMetrics => {
    if (!collectorRef.current) return state.metrics
    return collectorRef.current.getMetrics()
  }, [state.metrics])

  /**
   * Get all spans
   */
  const getSpans = useCallback((): TelemetrySpan[] => {
    if (!collectorRef.current) return []
    return collectorRef.current.getSpans()
  }, [])

  /**
   * Export and clear data
   */
  const exportData = useCallback((): {
    spans: TelemetrySpan[]
    metrics: TelemetryMetrics
  } => {
    if (!collectorRef.current) {
      return { spans: [], metrics: state.metrics }
    }

    const data = collectorRef.current.export()

    setState((prev) => ({
      ...prev,
      metrics: {
        tokensCounted: 0,
        optimizationsPerformed: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errorsEncountered: 0,
        currentTokens: 0,
        currentCost: 0,
        cacheSize: 0,
        tokenCountDurations: [],
        optimizationDurations: [],
        costCalculationDurations: [],
      },
      recentSpans: [],
    }))

    return data
  }, [state.metrics])

  /**
   * Clear all data
   */
  const clear = useCallback((): void => {
    if (!collectorRef.current) return
    collectorRef.current.clear()

    setState({
      metrics: {
        tokensCounted: 0,
        optimizationsPerformed: 0,
        cacheHits: 0,
        cacheMisses: 0,
        errorsEncountered: 0,
        currentTokens: 0,
        currentCost: 0,
        cacheSize: 0,
        tokenCountDurations: [],
        optimizationDurations: [],
        costCalculationDurations: [],
      },
      recentSpans: [],
      enabled: true,
      totalSpans: 0,
    })
  }, [])

  return {
    ...state,
    startSpan,
    endSpan,
    recordError,
    addEvent,
    recordMetric,
    incrementCounter,
    getMetrics,
    getSpans,
    exportData,
    clear,
  }
}

/**
 * Simplified telemetry hook for metrics only
 *
 * @example
 * ```tsx
 * function MetricsDisplay() {
 *   const { metrics, recordMetric, incrementCounter } = useTelemetryMetrics({
 *     serviceName: 'my-app',
 *   })
 *
 *   return (
 *     <div>
 *       <p>Tokens Counted: {metrics.tokensCounted}</p>
 *       <p>Cache Hits: {metrics.cacheHits}</p>
 *       <p>Errors: {metrics.errorsEncountered}</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function useTelemetryMetrics(config: {
  serviceName: string
  attributes?: Record<string, any>
}) {
  const [metrics, setMetrics] = useState<TelemetryMetrics>({
    tokensCounted: 0,
    optimizationsPerformed: 0,
    cacheHits: 0,
    cacheMisses: 0,
    errorsEncountered: 0,
    currentTokens: 0,
    currentCost: 0,
    cacheSize: 0,
    tokenCountDurations: [],
    optimizationDurations: [],
    costCalculationDurations: [],
  })

  const collectorRef = useRef<TelemetryCollector>()

  useEffect(() => {
    collectorRef.current = new TelemetryCollector({
      serviceName: config.serviceName,
      enableTracing: false,
      enableMetrics: true,
      attributes: config.attributes,
    })
  }, [])

  const recordMetric = useCallback(
    (name: keyof TelemetryMetrics, value: number): void => {
      if (!collectorRef.current) return
      collectorRef.current.recordMetric(name, value)

      setMetrics((prev) => ({
        ...prev,
        [name]: value,
      }))
    },
    []
  )

  const incrementCounter = useCallback(
    (name: keyof TelemetryMetrics, delta: number = 1): void => {
      if (!collectorRef.current) return
      collectorRef.current.incrementCounter(name, delta)

      setMetrics((prev) => ({
        ...prev,
        [name]: (prev[name] as number) + delta,
      }))
    },
    []
  )

  const reset = useCallback((): void => {
    setMetrics({
      tokensCounted: 0,
      optimizationsPerformed: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorsEncountered: 0,
      currentTokens: 0,
      currentCost: 0,
      cacheSize: 0,
      tokenCountDurations: [],
      optimizationDurations: [],
      costCalculationDurations: [],
    })
  }, [])

  return {
    metrics,
    recordMetric,
    incrementCounter,
    reset,
  }
}

/**
 * Performance monitoring hook
 *
 * Tracks operation duration and provides percentile calculations.
 *
 * @example
 * ```tsx
 * function PerformanceMonitor() {
 *   const { track, stats } = usePerformanceMonitor()
 *
 *   const handleOperation = async () => {
 *     await track('myOperation', async () => {
 *       // Your async operation
 *     })
 *   }
 *
 *   return (
 *     <div>
 *       <p>P50: {stats.p50}ms</p>
 *       <p>P95: {stats.p95}ms</p>
 *       <p>P99: {stats.p99}ms</p>
 *     </div>
 *   )
 * }
 * ```
 */
export function usePerformanceMonitor() {
  const [durations, setDurations] = useState<number[]>([])
  const collectorRef = useRef<TelemetryCollector>()

  useEffect(() => {
    collectorRef.current = new TelemetryCollector({
      serviceName: 'performance-monitor',
      enableTracing: true,
      enableMetrics: true,
    })
  }, [])

  const track = useCallback(
    async <T,>(
      operationName: string,
      operation: () => Promise<T>
    ): Promise<T> => {
      const spanId = collectorRef.current?.startSpan(operationName) || ''
      const startTime = performance.now()

      try {
        const result = await operation()
        const duration = performance.now() - startTime

        setDurations((prev) => [...prev, duration].slice(-100)) // Keep last 100

        collectorRef.current?.endSpan(spanId, { duration })

        return result
      } catch (error) {
        const duration = performance.now() - startTime
        collectorRef.current?.recordError(spanId, error as Error)
        collectorRef.current?.endSpan(spanId, { duration, error: true })
        throw error
      }
    },
    []
  )

  const stats = useCallback(() => {
    if (durations.length === 0) {
      return { p50: 0, p95: 0, p99: 0, avg: 0, min: 0, max: 0 }
    }

    const sorted = [...durations].sort((a, b) => a - b)
    const p50 = sorted[Math.floor(sorted.length * 0.5)]
    const p95 = sorted[Math.floor(sorted.length * 0.95)]
    const p99 = sorted[Math.floor(sorted.length * 0.99)]
    const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length
    const min = sorted[0]
    const max = sorted[sorted.length - 1]

    return { p50, p95, p99, avg, min, max }
  }, [durations])

  const reset = useCallback(() => {
    setDurations([])
  }, [])

  return {
    track,
    stats: stats(),
    durations,
    reset,
  }
}
