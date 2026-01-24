/**
 * Unified Performance Monitoring Utilities
 *
 * Comprehensive performance layer consolidating all performance utilities:
 * - Performance timing and metrics collection
 * - Memory management and tracking
 * - FPS optimization and animation
 * - Throttle, debounce, and batching
 * - Virtual scrolling calculations
 * - Performance profiling and reporting
 * - Web Vitals tracking
 *
 * @module @clarity-chat/utils/performance-unified
 */

import { formatDuration, formatBytes } from './format/index.js'
import { getLogger } from './logger/index.js'

// ============================================================================
// TYPES
// ============================================================================

export interface OperationTiming {
  name: string
  startTime: number
  endTime?: number
  duration?: number
  count: number
  totalTime: number
  averageTime: number
  minTime: number
  maxTime: number
}

export interface PerformanceMetrics {
  operations: Map<string, OperationTiming>
  totalTime: number
  averageTime: number
  operationCount: number
}

export interface PerformanceOptions {
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error'
  enableWarnings?: boolean
  warningThreshold?: number // ms
  maxOperations?: number
}

export interface MemorySnapshot {
  timestamp: number
  usedHeapSize: number
  totalHeapSize: number
  heapLimit: number
  usedHeapSizeMB: number
  totalHeapSizeMB: number
}

export interface RenderTiming {
  componentName: string
  startTime: number
  endTime: number
  duration: number
  renderCount: number
}

export interface FPSMetrics {
  current: number
  average: number
  min: number
  max: number
  samples: number[]
  jankyFrames: number // Frames > 16.67ms
  longTasks: number // Tasks > 50ms
}

export interface VirtualScrollConfig {
  itemHeight: number
  containerHeight: number
  overscan?: number
  dynamicHeight?: boolean
}

export interface DebounceConfig {
  delay: number
  leading?: boolean
  trailing?: boolean
}

export interface ThrottleConfig {
  delay: number
  leading?: boolean
  trailing?: boolean
}

// ============================================================================
// PERFORMANCE MONITOR CLASS
// ============================================================================

/**
 * Unified performance monitoring utility
 */
export class UnifiedPerformanceMonitor {
  private static operations: Map<string, OperationTiming> = new Map()
  private static activeTimers: Map<string, number> = new Map()
  private static logger = getLogger('performance')
  private static options: Required<PerformanceOptions> = {
    logLevel: 'info',
    enableWarnings: true,
    warningThreshold: 1000, // 1 second
    maxOperations: 1000,
  }

  private static renders: RenderTiming[] = []
  private static memorySnapshots: MemorySnapshot[] = []

  /**
   * Configure performance monitoring
   */
  static configure(options: PerformanceOptions): void {
    this.options = { ...this.options, ...options }
  }

  /**
   * Track execution time of a function
   */
  static track<T>(name: string, fn: () => T): T {
    const startTime = performance.now()

    try {
      const result = fn()

      // Handle both sync and async results
      if (result && typeof result === 'object' && 'then' in result) {
        return (async () => {
          try {
            const asyncResult = await result
            const endTime = performance.now()
            this.recordTiming(name, startTime, endTime)
            return asyncResult
          } catch (error) {
            const endTime = performance.now()
            this.recordTiming(name, startTime, endTime)
            throw error
          }
        })() as T
      } else {
        const endTime = performance.now()
        this.recordTiming(name, startTime, endTime)
        return result
      }
    } catch (error) {
      const endTime = performance.now()
      this.recordTiming(name, startTime, endTime)
      throw error
    }
  }

  /**
   * Track async function execution time
   */
  static async trackAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = performance.now()

    try {
      const result = await fn()
      const endTime = performance.now()
      this.recordTiming(name, startTime, endTime)
      return result
    } catch (error) {
      const endTime = performance.now()
      this.recordTiming(name, startTime, endTime)
      throw error
    }
  }

  /**
   * Start timing an operation
   */
  static time(name: string): void {
    if (this.activeTimers.has(name)) {
      this.logger.warn(`Timer '${name}' already started`)
      return
    }

    this.activeTimers.set(name, performance.now())
  }

  /**
   * End timing an operation and record the duration
   */
  static timeEnd(name: string): number | undefined {
    const startTime = this.activeTimers.get(name)

    if (!startTime) {
      this.logger.warn(`Timer '${name}' was not started`)
      return undefined
    }

    const endTime = performance.now()
    const duration = endTime - startTime

    this.activeTimers.delete(name)
    this.recordTiming(name, startTime, endTime)

    return duration
  }

  /**
   * Record timing information
   */
  private static recordTiming(
    name: string,
    startTime: number,
    endTime: number
  ): void {
    const duration = endTime - startTime

    // Check if we should warn about slow operations
    if (
      this.options.enableWarnings &&
      duration > this.options.warningThreshold
    ) {
      this.logger.warn(
        `Slow operation detected: ${name} took ${formatDuration(duration)}`
      )
    }

    const existing = this.operations.get(name)

    if (existing) {
      existing.count++
      existing.totalTime += duration
      existing.averageTime = existing.totalTime / existing.count
      existing.minTime = Math.min(existing.minTime, duration)
      existing.maxTime = Math.max(existing.maxTime, duration)
    } else {
      // Limit the number of tracked operations
      if (this.operations.size >= this.options.maxOperations) {
        // Remove the oldest operation
        const firstKey = this.operations.keys().next().value
        if (firstKey) {
          this.operations.delete(firstKey)
        }
      }

      this.operations.set(name, {
        name,
        startTime,
        endTime,
        duration,
        count: 1,
        totalTime: duration,
        averageTime: duration,
        minTime: duration,
        maxTime: duration,
      })
    }

    // Log based on configured level
    if (this.shouldLog()) {
      this.logger.info(
        `Operation '${name}' completed in ${formatDuration(duration)}`
      )
    }
  }

  /**
   * Check if we should log performance information
   */
  private static shouldLog(): boolean {
    const levels = { trace: 0, debug: 1, info: 2, warn: 3, error: 4 }
    const currentLevel = levels[this.options.logLevel]
    const infoLevel = levels['info']
    return currentLevel <= infoLevel
  }

  /**
   * Get current performance metrics
   */
  static getMetrics(): PerformanceMetrics {
    let totalTime = 0
    let operationCount = 0

    for (const operation of this.operations.values()) {
      totalTime += operation.totalTime
      operationCount += operation.count
    }

    const averageTime = operationCount > 0 ? totalTime / operationCount : 0

    return {
      operations: new Map(this.operations),
      totalTime,
      averageTime,
      operationCount,
    }
  }

  /**
   * Get metrics for a specific operation
   */
  static getOperationMetrics(name: string): OperationTiming | undefined {
    return this.operations.get(name)
  }

  /**
   * Get statistics for an operation
   */
  static getStats(operation: string): {
    count: number
    avgDuration: number
    minDuration: number
    maxDuration: number
    p50: number
    p95: number
    p99: number
  } | null {
    const operationMetrics = this.operations.get(operation)

    if (!operationMetrics) {
      return null
    }

    const durations = [operationMetrics.duration].filter(Boolean) as number[]

    if (durations.length === 0) {
      return {
        count: operationMetrics.count,
        avgDuration: operationMetrics.averageTime,
        minDuration: operationMetrics.minTime,
        maxDuration: operationMetrics.maxTime,
        p50: operationMetrics.averageTime,
        p95: operationMetrics.maxTime,
        p99: operationMetrics.maxTime,
      }
    }

    durations.sort((a, b) => a - b)
    const p50 = durations[Math.floor(durations.length * 0.5)] || 0
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0
    const p99 = durations[Math.floor(durations.length * 0.99)] || 0

    return {
      count: operationMetrics.count,
      avgDuration: operationMetrics.averageTime,
      minDuration: operationMetrics.minTime,
      maxDuration: operationMetrics.maxTime,
      p50,
      p95,
      p99,
    }
  }

  /**
   * Clear all metrics
   */
  static clear(): void {
    this.operations.clear()
    this.activeTimers.clear()
    this.renders = []
    this.memorySnapshots = []
  }

  /**
   * Clear metrics for a specific operation
   */
  static clearOperation(name: string): void {
    this.operations.delete(name)
    this.activeTimers.delete(name)
  }

  /**
   * Get a summary of performance metrics
   */
  static getSummary(): {
    totalOperations: number
    totalTime: number
    averageTime: number
    slowestOperations: OperationTiming[]
    fastestOperations: OperationTiming[]
    mostFrequentOperations: OperationTiming[]
  } {
    const metrics = this.getMetrics()
    const operations = Array.from(metrics.operations.values())

    operations.sort((a, b) => b.averageTime - a.averageTime)
    const slowestOperations = operations.slice(0, 10)

    operations.sort((a, b) => a.averageTime - b.averageTime)
    const fastestOperations = operations.slice(0, 10)

    operations.sort((a, b) => b.count - a.count)
    const mostFrequentOperations = operations.slice(0, 10)

    return {
      totalOperations: operations.length,
      totalTime: metrics.totalTime,
      averageTime: metrics.averageTime,
      slowestOperations,
      fastestOperations,
      mostFrequentOperations,
    }
  }

  /**
   * Format metrics for display
   */
  static formatMetrics(metrics?: PerformanceMetrics): string {
    const data = metrics || this.getMetrics()
    const operations = Array.from(data.operations.values())

    if (operations.length === 0) {
      return 'No performance data available'
    }

    const lines = [
      'Performance Metrics:',
      `Total operations: ${data.operationCount}`,
      `Total time: ${formatDuration(data.totalTime)}`,
      `Average time: ${formatDuration(data.averageTime)}`,
      '',
      'Top 5 operations by average time:',
    ]

    operations
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 5)
      .forEach((op, index) => {
        lines.push(
          `${index + 1}. ${op.name}: ${formatDuration(op.averageTime)} (avg), ${op.count} calls`
        )
      })

    return lines.join('\n')
  }

  /**
   * Measure memory usage
   */
  static measureMemory(): NodeJS.MemoryUsage {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      return process.memoryUsage()
    }

    // Fallback for browser environments
    return {
      rss: 0,
      heapTotal: 0,
      heapUsed: 0,
      external: 0,
      arrayBuffers: 0,
    }
  }

  /**
   * Format memory usage
   */
  static formatMemoryUsage(usage?: NodeJS.MemoryUsage): string {
    const data = usage || this.measureMemory()

    return [
      `RSS: ${formatBytes(data.rss)}`,
      `Heap Total: ${formatBytes(data.heapTotal)}`,
      `Heap Used: ${formatBytes(data.heapUsed)}`,
      `External: ${formatBytes(data.external)}`,
      `Array Buffers: ${formatBytes(data.arrayBuffers)}`,
    ].join(', ')
  }

  /**
   * Capture memory snapshot
   */
  static captureMemorySnapshot(): MemorySnapshot {
    const snapshot: MemorySnapshot = {
      timestamp: performance.now(),
      usedHeapSize: 0,
      totalHeapSize: 0,
      heapLimit: 0,
      usedHeapSizeMB: 0,
      totalHeapSizeMB: 0,
    }

    // @ts-expect-error - memory is Chrome-specific
    if (performance.memory) {
      // @ts-expect-error - memory is Chrome-specific
      snapshot.usedHeapSize = performance.memory.usedJSHeapSize
      // @ts-expect-error - memory is Chrome-specific
      snapshot.totalHeapSize = performance.memory.totalJSHeapSize
      // @ts-expect-error - memory is Chrome-specific
      snapshot.heapLimit = performance.memory.jsHeapSizeLimit
      snapshot.usedHeapSizeMB = snapshot.usedHeapSize / 1024 / 1024
      snapshot.totalHeapSizeMB = snapshot.totalHeapSize / 1024 / 1024
    }

    this.memorySnapshots.push(snapshot)
    return snapshot
  }

  /**
   * Measure render time for a component
   */
  static measureRender(componentName: string): () => void {
    const startTime = performance.now()
    const renderIndex = this.renders.findIndex(
      (r) => r.componentName === componentName
    )

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (renderIndex >= 0) {
        const existing = this.renders[renderIndex]
        this.renders[renderIndex] = {
          componentName,
          startTime,
          endTime,
          duration,
          renderCount: existing.renderCount + 1,
        }
      } else {
        this.renders.push({
          componentName,
          startTime,
          endTime,
          duration,
          renderCount: 1,
        })
      }

      if (duration > 100) {
        this.logger.warn(
          `Slow render: ${componentName} took ${duration.toFixed(2)}ms`
        )
      }
    }
  }
}

// ============================================================================
// THROTTLE AND DEBOUNCE
// ============================================================================

/**
 * Throttle function calls
 *
 * Re-exported from async utilities for convenience in performance context.
 * Uses the canonical implementation with leading and trailing support.
 */
export { throttle } from './async/index.js'

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeout: NodeJS.Timeout | null = null

  const debounced = function debounced(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
      timeout = null
    }, wait)
  } as ((...args: Parameters<T>) => void) & { cancel: () => void }

  debounced.cancel = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  return debounced
}

/**
 * Create a debounced function
 */
export function createDebouncedFunction<
  T extends (...args: unknown[]) => unknown,
>(fn: T, config: DebounceConfig): (...args: Parameters<T>) => void {
  const { delay, leading = false, trailing = true } = config
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function debounced(...args: Parameters<T>) {
    if (leading && !timeoutId) {
      fn(...args)
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (trailing) {
        fn(...args)
      }
      timeoutId = null
    }, delay)
  }
}

/**
 * Create a throttled function
 */
export function createThrottledFunction<
  T extends (...args: unknown[]) => unknown,
>(fn: T, config: ThrottleConfig): (...args: Parameters<T>) => void {
  const { delay, leading = true, trailing = true } = config
  let lastCallTime = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    if (leading && timeSinceLastCall >= delay) {
      fn(...args)
      lastCallTime = now
      return
    }

    if (!timeoutId && trailing) {
      timeoutId = setTimeout(() => {
        fn(...args)
        lastCallTime = Date.now()
        timeoutId = null
      }, delay - timeSinceLastCall)
    }
  }
}

// ============================================================================
// BATCHING
// ============================================================================

/**
 * Batch function calls
 */
export class Batcher<T> {
  private batch: T[] = []
  private timeout: NodeJS.Timeout | null = null

  constructor(
    private processor: (items: T[]) => void,
    private batchSize: number = 10,
    private batchTimeout: number = 100
  ) {}

  add(item: T): void {
    this.batch.push(item)

    if (this.batch.length >= this.batchSize) {
      this.flush()
    } else {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.flush()
      }, this.batchTimeout)
    }
  }

  flush(): void {
    if (this.batch.length > 0) {
      this.processor([...this.batch])
      this.batch = []
    }
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }
}

/**
 * Batch operations utility
 */
export class BatchProcessor<T> {
  private queue: T[] = []
  private processor: (items: T[]) => Promise<void> | void
  private batchSize: number
  private delay: number
  private timeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(
    processor: (items: T[]) => Promise<void> | void,
    batchSize: number = 10,
    delay: number = 100
  ) {
    this.processor = processor
    this.batchSize = batchSize
    this.delay = delay
  }

  add(item: T): void {
    this.queue.push(item)

    if (this.queue.length >= this.batchSize) {
      this.flush()
    } else {
      this.scheduleFlush()
    }
  }

  private scheduleFlush(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.flush()
    }, this.delay)
  }

  async flush(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)
    await this.processor(batch)
  }

  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.queue = []
  }
}

// ============================================================================
// VIRTUAL SCROLLING
// ============================================================================

/**
 * Calculate visible range for virtual scrolling
 */
export function calculateVisibleRange(
  totalItems: number,
  scrollTop: number,
  config: VirtualScrollConfig
): { start: number; end: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 3 } = config

  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const end = Math.min(totalItems, start + visibleCount + overscan * 2)
  const offsetY = start * itemHeight

  return { start, end, offsetY }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Measure performance for synchronous functions
 */
export function measurePerformance<T>(name: string, fn: () => T): T {
  return UnifiedPerformanceMonitor.track(name, fn)
}

/**
 * Measure performance for asynchronous functions
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  return UnifiedPerformanceMonitor.trackAsync(name, fn)
}

/**
 * Start performance timer
 */
export function startPerformanceTimer(name: string): void {
  UnifiedPerformanceMonitor.time(name)
}

/**
 * End performance timer
 */
export function endPerformanceTimer(name: string): number | undefined {
  return UnifiedPerformanceMonitor.timeEnd(name)
}

/**
 * Get performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return UnifiedPerformanceMonitor.getMetrics()
}

/**
 * Format performance metrics
 */
export function formatPerformanceMetrics(metrics?: PerformanceMetrics): string {
  return UnifiedPerformanceMonitor.formatMetrics(metrics)
}

/**
 * Get performance summary
 */
export function getPerformanceSummary() {
  return UnifiedPerformanceMonitor.getSummary()
}

/**
 * Lazy load content
 */
export function lazyLoad<T>(
  loader: () => Promise<T>,
  timeout: number = 5000
): Promise<T> {
  return Promise.race([
    loader(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Lazy load timeout')), timeout)
    ),
  ])
}

/**
 * Optimize large arrays
 */
export function optimizeArray<T>(array: T[], maxSize: number = 1000): T[] {
  if (array.length <= maxSize) {
    return array
  }

  const keepFirst = Math.floor(maxSize * 0.2)
  const keepLast = Math.floor(maxSize * 0.2)
  const sampleSize = maxSize - keepFirst - keepLast

  const first = array.slice(0, keepFirst)
  const last = array.slice(-keepLast)
  const middle = array.slice(keepFirst, -keepLast)

  const step = Math.ceil(middle.length / sampleSize)
  const sampled = middle
    .filter((_, index) => index % step === 0)
    .slice(0, sampleSize)

  return [...first, ...sampled, ...last]
}

/**
 * Check if performance target is met
 */
export function checkPerformanceTarget(
  actualTime: number,
  targetTime: number = 50
): { met: boolean; deviation: number; percentage: number } {
  const met = actualTime <= targetTime
  const deviation = actualTime - targetTime
  const percentage = (actualTime / targetTime) * 100

  return { met, deviation, percentage }
}

// Export the main monitor
export const PerformanceMonitor = UnifiedPerformanceMonitor
export const performanceMonitor = UnifiedPerformanceMonitor
