import { useState, useCallback, useRef, useEffect } from 'react'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { getTokenizerStats, clearTokenCache } from './accurate-counter'

/**
 * Performance metrics for token counting operations
 */
export interface TokenPerformanceMetrics {
  /** Average execution time in milliseconds */
  avgExecutionTime: number
  /** Total number of operations */
  totalOperations: number
  /** Cache hit rate percentage */
  cacheHitRate: number
  /** Memory usage in MB */
  memoryUsage: number
  /** Operations per second */
  operationsPerSecond: number
  /** Last operation time */
  lastOperationTime: number
}

/**
 * Hook for monitoring token counting performance
 *
 * Provides real-time performance metrics and optimization suggestions
 * for token counting operations.
 *
 * @example
 * ```typescript
 * const { metrics, benchmarkOperation, clearMetrics, isPerformanceDegraded } = useTokenPerformance();
 *
 * // Benchmark a specific operation
 * const result = await benchmarkOperation(async () => {
 *   return TokenCounter.count(largeText);
 * });
 *
 * // Check if performance is degraded
 * if (isPerformanceDegraded) {
 *   console.warn('Token counting performance is degraded');
 * }
 * ```
 */
export function useTokenPerformance() {
  const [metrics, setMetrics] = useState<TokenPerformanceMetrics>({
    avgExecutionTime: 0,
    totalOperations: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    operationsPerSecond: 0,
    lastOperationTime: 0,
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const operationsRef = useRef<Array<{ duration: number; timestamp: number }>>(
    []
  )
  const monitoringIntervalRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Update performance metrics
   */
  const updateMetrics = useCallback(() => {
    const tokenizerStats = getTokenizerStats()
    const now = performance.now()

    // Filter operations from the last minute
    const recentOperations = operationsRef.current.filter(
      (op) => now - op.timestamp < 60000
    )
    operationsRef.current = recentOperations

    const totalOps = recentOperations.length
    const avgTime =
      totalOps > 0
        ? recentOperations.reduce((sum, op) => sum + op.duration, 0) / totalOps
        : 0

    // Calculate operations per second
    const opsPerSecond = totalOps > 0 ? (totalOps / 60) * 1000 : 0

    // Estimate memory usage (simplified)
    const memoryUsage = (performance as any).memory
      ? (performance as any).memory.usedJSHeapSize / 1024 / 1024
      : 0

    setMetrics({
      avgExecutionTime: avgTime,
      totalOperations: totalOps,
      cacheHitRate: tokenizerStats.hitRatePercent,
      memoryUsage: memoryUsage,
      operationsPerSecond: opsPerSecond,
      lastOperationTime:
        totalOps > 0 ? recentOperations[totalOps - 1].duration : 0,
    })
  }, [])

  /**
   * Benchmark a specific operation
   */
  const benchmarkOperation = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: { name?: string; updateMetrics?: boolean } = {}
    ): Promise<{ result: T; duration: number; timestamp: number }> => {
      const start = performance.now()
      let result: T

      try {
        result = await operation()
      } catch (error) {
        const duration = performance.now() - start
        if (options.updateMetrics !== false) {
          operationsRef.current.push({ duration, timestamp: start })
          updateMetrics()
        }
        throw error
      }

      const duration = performance.now() - start

      if (options.updateMetrics !== false) {
        operationsRef.current.push({ duration, timestamp: start })
        updateMetrics()
      }

      return { result, duration, timestamp: start }
    },
    [updateMetrics]
  )

  /**
   * Measure token counting performance for text
   */
  const measureTokenCount = useCallback(
    async (text: string, iterations: number = 100) => {
      const counter = new AccurateTokenCounter({ model: 'gpt-4' })
      const results: Array<{ duration: number; count: number }> = []

      for (let i = 0; i < iterations; i++) {
        const benchmark = await benchmarkOperation(
          async () => {
            return counter.count(text)
          },
          { updateMetrics: false }
        )

        results.push({ duration: benchmark.duration, count: benchmark.result })
      }

      return results
    },
    [benchmarkOperation]
  )

  /**
   * Start performance monitoring
   */
  const startMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) return

    setIsMonitoring(true)
    updateMetrics()

    // Update metrics every 5 seconds
    monitoringIntervalRef.current = setInterval(updateMetrics, 5000)
  }, [updateMetrics])

  /**
   * Stop performance monitoring
   */
  const stopMonitoring = useCallback(() => {
    if (monitoringIntervalRef.current) {
      clearInterval(monitoringIntervalRef.current)
      monitoringIntervalRef.current = null
    }
    setIsMonitoring(false)
  }, [])

  /**
   * Clear performance metrics
   */
  const clearMetrics = useCallback(() => {
    operationsRef.current = []
    clearTokenCache()
    updateMetrics()
  }, [updateMetrics])

  /**
   * Check if performance is degraded
   */
  const isPerformanceDegraded = useCallback(
    (threshold: number = 100) => {
      return metrics.avgExecutionTime > threshold || metrics.cacheHitRate < 50
    },
    [metrics]
  )

  /**
   * Get performance optimization suggestions
   */
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = []

    if (metrics.cacheHitRate < 70) {
      suggestions.push('Consider enabling caching for better performance')
    }

    if (metrics.avgExecutionTime > 50) {
      suggestions.push(
        'Large average execution time detected - consider batching operations'
      )
    }

    if (metrics.memoryUsage > 100) {
      suggestions.push('High memory usage detected - consider clearing caches')
    }

    if (metrics.operationsPerSecond < 10) {
      suggestions.push(
        'Low operations per second - consider optimizing your code'
      )
    }

    return suggestions
  }, [metrics])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring()
    }
  }, [stopMonitoring])

  return {
    // Metrics
    metrics,

    // Monitoring controls
    isMonitoring,
    startMonitoring,
    stopMonitoring,

    // Benchmarking
    benchmarkOperation,
    measureTokenCount,

    // Utilities
    clearMetrics,
    updateMetrics,

    // Performance analysis
    isPerformanceDegraded,
    getOptimizationSuggestions,
  }
}

/**
 * Hook for token performance with automatic monitoring
 *
 * @param autoStart - Start monitoring automatically
 * @param updateInterval - Update interval in milliseconds
 */
export function useAutoTokenPerformance(
  autoStart: boolean = true,
  updateInterval: number = 5000
) {
  const performance = useTokenPerformance()

  useEffect(() => {
    if (autoStart) {
      performance.startMonitoring()
    }

    return () => {
      performance.stopMonitoring()
    }
  }, [autoStart, performance])

  return performance
}
