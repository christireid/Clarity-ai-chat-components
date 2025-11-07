/**
 * Advanced Performance Utilities with Web Vitals Integration
 * 
 * Provides comprehensive performance monitoring for React applications including:
 * - Function execution timing
 * - Async operation tracking
 * - Statistical analysis (avg, min, max, percentiles)
 * - Performance API integration
 * - Web Vitals monitoring
 * - Memory profiling
 */

// ============================================================================
// Types
// ============================================================================

export interface PerformanceMetrics {
  /** Average duration in milliseconds */
  avg: number
  /** Minimum duration in milliseconds */
  min: number
  /** Maximum duration in milliseconds */
  max: number
  /** 50th percentile (median) */
  p50: number
  /** 95th percentile */
  p95: number
  /** 99th percentile */
  p99: number
  /** Total number of measurements */
  count: number
  /** Standard deviation */
  stdDev: number
}

export interface AsyncPerformanceResult<T> {
  /** Result of the async operation */
  result: T
  /** Duration in milliseconds */
  duration: number
  /** Whether the operation succeeded */
  success: boolean
  /** Error if operation failed */
  error?: Error
}

// ============================================================================
// Throttle & Debounce (simplified exports - use hook versions in React)
// ============================================================================

/**
 * Throttle function calls (utility version for non-React code)
 * For React components, use useThrottledCallback hook instead
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  let lastCall = 0

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= wait) {
      lastCall = now
      func(...args)
    } else {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        lastCall = Date.now()
        func(...args)
      }, wait - timeSinceLastCall)
    }
  }
}

/**
 * Debounce function calls (utility version for non-React code)
 * For React components, use useDebouncedCallback hook instead
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function debounced(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// ============================================================================
// Batch Processing
// ============================================================================

export interface BatcherOptions<T> {
  /** Function to process batch */
  processor: (items: T[]) => void | Promise<void>
  /** Maximum batch size before auto-flush */
  batchSize?: number
  /** Maximum time to wait before auto-flush (ms) */
  batchTimeout?: number
}

/**
 * Batch function calls for performance optimization
 * Automatically flushes when batch size reached or timeout expires
 */
export class Batcher<T> {
  private batch: T[] = []
  private timeout: NodeJS.Timeout | null = null
  private readonly processor: (items: T[]) => void | Promise<void>
  private readonly batchSize: number
  private readonly batchTimeout: number
  private isProcessing = false

  constructor(options: BatcherOptions<T>) {
    this.processor = options.processor
    this.batchSize = options.batchSize ?? 10
    this.batchTimeout = options.batchTimeout ?? 100
  }

  /**
   * Add item to batch
   */
  add(item: T): void {
    this.batch.push(item)

    if (this.batch.length >= this.batchSize) {
      void this.flush()
    } else {
      this.scheduleFlush()
    }
  }

  /**
   * Add multiple items to batch
   */
  addMany(items: T[]): void {
    items.forEach(item => this.add(item))
  }

  /**
   * Flush batch immediately
   */
  async flush(): Promise<void> {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }

    if (this.batch.length === 0 || this.isProcessing) {
      return
    }

    const itemsToProcess = [...this.batch]
    this.batch = []
    this.isProcessing = true

    try {
      await this.processor(itemsToProcess)
    } catch (error) {
      console.error('[Batcher] Error processing batch:', error)
      throw error
    } finally {
      this.isProcessing = false
    }
  }

  /**
   * Get current batch size
   */
  size(): number {
    return this.batch.length
  }

  /**
   * Clear batch without processing
   */
  clear(): void {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    this.batch = []
  }

  private scheduleFlush(): void {
    if (this.timeout) return

    this.timeout = setTimeout(() => {
      void this.flush()
    }, this.batchTimeout)
  }
}

// ============================================================================
// Performance Measurement
// ============================================================================

/**
 * Measure synchronous function performance
 * Uses Performance API when available for better accuracy
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T,
  options?: { log?: boolean }
): T {
  const usePerformanceAPI = typeof performance !== 'undefined' && performance.mark && performance.measure
  
  if (usePerformanceAPI) {
    const startMark = `${name}-start`
    const endMark = `${name}-end`
    
    performance.mark(startMark)
    const result = fn()
    performance.mark(endMark)
    
    try {
      performance.measure(name, startMark, endMark)
      const measure = performance.getEntriesByName(name)[0]
      
      if (options?.log || (typeof window !== 'undefined' && (window as any).__PERF_LOGGING__)) {
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`)
      }
      
      // Cleanup
      performance.clearMarks(startMark)
      performance.clearMarks(endMark)
      performance.clearMeasures(name)
    } catch (error) {
      // Silently fail if performance APIs not fully supported
    }
    
    return result
  } else {
    // Fallback to Date.now()
    const start = Date.now()
    const result = fn()
    const end = Date.now()
    
    if (options?.log || (typeof window !== 'undefined' && (window as any).__PERF_LOGGING__)) {
      console.log(`[Performance] ${name}: ${end - start}ms`)
    }
    
    return result
  }
}

/**
 * Measure async function performance
 * Returns both result and duration
 */
export async function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>,
  options?: { log?: boolean }
): Promise<AsyncPerformanceResult<T>> {
  const start = Date.now()
  
  try {
    const result = await fn()
    const duration = Date.now() - start
    
    if (options?.log || (typeof window !== 'undefined' && (window as any).__PERF_LOGGING__)) {
      console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms (async)`)
    }
    
    return {
      result,
      duration,
      success: true,
    }
  } catch (error) {
    const duration = Date.now() - start
    
    if (options?.log || (typeof window !== 'undefined' && (window as any).__PERF_LOGGING__)) {
      console.error(`[Performance] ${name}: ${duration.toFixed(2)}ms (failed)`, error)
    }
    
    return {
      result: undefined as any,
      duration,
      success: false,
      error: error instanceof Error ? error : new Error(String(error)),
    }
  }
}

// ============================================================================
// Advanced Performance Monitor
// ============================================================================

/**
 * Calculate percentile from sorted array
 */
function calculatePercentile(sortedValues: number[], percentile: number): number {
  if (sortedValues.length === 0) return 0
  const index = Math.ceil((percentile / 100) * sortedValues.length) - 1
  return sortedValues[Math.max(0, index)]
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values: number[], mean: number): number {
  if (values.length === 0) return 0
  const squaredDiffs = values.map(v => Math.pow(v - mean, 2))
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length
  return Math.sqrt(avgSquaredDiff)
}

/**
 * Advanced performance monitor with statistical analysis
 * Tracks multiple metrics and provides comprehensive performance insights
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()
  private maxSamplesPerMetric: number

  constructor(options?: { maxSamplesPerMetric?: number }) {
    this.maxSamplesPerMetric = options?.maxSamplesPerMetric ?? 1000
  }

  /**
   * Start timing an operation
   * Returns a function to stop timing
   */
  start(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      this.record(label, duration)
    }
  }

  /**
   * Record a manual measurement
   */
  record(label: string, duration: number): void {
    const existing = this.metrics.get(label) || []
    existing.push(duration)
    
    // Limit samples to prevent memory issues
    if (existing.length > this.maxSamplesPerMetric) {
      existing.shift()
    }
    
    this.metrics.set(label, existing)
  }

  /**
   * Get comprehensive metrics for a label
   */
  getMetrics(label: string): PerformanceMetrics {
    const values = this.metrics.get(label) || []
    
    if (values.length === 0) {
      return {
        avg: 0,
        min: 0,
        max: 0,
        p50: 0,
        p95: 0,
        p99: 0,
        count: 0,
        stdDev: 0,
      }
    }

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length

    return {
      avg,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      p50: calculatePercentile(sorted, 50),
      p95: calculatePercentile(sorted, 95),
      p99: calculatePercentile(sorted, 99),
      count: values.length,
      stdDev: calculateStdDev(values, avg),
    }
  }

  /**
   * Get all metrics
   */
  getAllMetrics(): Map<string, PerformanceMetrics> {
    const allMetrics = new Map<string, PerformanceMetrics>()
    for (const label of this.metrics.keys()) {
      allMetrics.set(label, this.getMetrics(label))
    }
    return allMetrics
  }

  /**
   * Get formatted report
   */
  getReport(): Record<string, PerformanceMetrics> {
    const report: Record<string, PerformanceMetrics> = {}
    for (const [label] of this.metrics) {
      report[label] = this.getMetrics(label)
    }
    return report
  }

  /**
   * Reset specific metric or all metrics
   */
  reset(label?: string): void {
    if (label) {
      this.metrics.delete(label)
    } else {
      this.metrics.clear()
    }
  }

  /**
   * Export metrics as JSON
   */
  export(): string {
    return JSON.stringify(this.getReport(), null, 2)
  }
}

// ============================================================================
// Lazy Loading
// ============================================================================

export class LazyLoadTimeoutError extends Error {
  constructor(timeout: number) {
    super(`Lazy load timeout after ${timeout}ms`)
    this.name = 'LazyLoadTimeoutError'
  }
}

/**
 * Lazy load with timeout
 * Rejects with LazyLoadTimeoutError if loader takes too long
 */
export function lazyLoad<T>(
  loader: () => Promise<T>,
  timeout: number = 5000
): Promise<T> {
  return Promise.race([
    loader(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new LazyLoadTimeoutError(timeout)), timeout)
    ),
  ])
}

// ============================================================================
// Array Optimization
// ============================================================================

export interface OptimizeArrayOptions {
  /** Maximum array size */
  maxSize?: number
  /** Percentage to keep from start (0-1) */
  keepStartRatio?: number
  /** Percentage to keep from end (0-1) */
  keepEndRatio?: number
  /** Sampling strategy */
  strategy?: 'uniform' | 'random' | 'weighted'
}

/**
 * Optimize large arrays by intelligently sampling
 * Keeps first/last items and samples middle section
 */
export function optimizeArray<T>(
  array: T[],
  options: OptimizeArrayOptions = {}
): T[] {
  const {
    maxSize = 1000,
    keepStartRatio = 0.2,
    keepEndRatio = 0.2,
    strategy = 'uniform',
  } = options

  if (array.length <= maxSize) {
    return array
  }

  const keepFirst = Math.floor(maxSize * keepStartRatio)
  const keepLast = Math.floor(maxSize * keepEndRatio)
  const sampleSize = maxSize - keepFirst - keepLast

  const first = array.slice(0, keepFirst)
  const last = array.slice(-keepLast)
  const middle = array.slice(keepFirst, -keepLast)

  let sampled: T[]

  if (strategy === 'uniform') {
    // Sample uniformly
    const step = Math.ceil(middle.length / sampleSize)
    sampled = middle.filter((_, index) => index % step === 0).slice(0, sampleSize)
  } else if (strategy === 'random') {
    // Random sampling
    sampled = []
    const indices = new Set<number>()
    while (sampled.length < sampleSize && indices.size < middle.length) {
      const index = Math.floor(Math.random() * middle.length)
      if (!indices.has(index)) {
        indices.add(index)
        sampled.push(middle[index])
      }
    }
  } else {
    // Weighted sampling (favor more recent)
    sampled = []
    const weights = middle.map((_, i) => i + 1) // Linear weights
    const totalWeight = weights.reduce((a, b) => a + b, 0)
    
    for (let i = 0; i < sampleSize && i < middle.length; i++) {
      let random = Math.random() * totalWeight
      for (let j = 0; j < weights.length; j++) {
        random -= weights[j]
        if (random <= 0) {
          sampled.push(middle[j])
          break
        }
      }
    }
  }

  return [...first, ...sampled, ...last]
}

// ============================================================================
// Web Vitals Integration (Basic)
// ============================================================================

export interface WebVitalsMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

/**
 * Simple Web Vitals observer
 * For production use, consider using the official web-vitals library
 */
export function observeWebVitals(
  callback: (metric: WebVitalsMetric) => void
): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {}
  }

  const observers: PerformanceObserver[] = []

  try {
    // Observe LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as any
      
      if (lastEntry) {
        const value = lastEntry.renderTime || lastEntry.loadTime
        callback({
          name: 'LCP',
          value,
          rating: value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor',
          delta: value,
        })
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    observers.push(lcpObserver)

    // Observe FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.name === 'first-contentful-paint') {
          callback({
            name: 'FCP',
            value: entry.startTime,
            rating: entry.startTime < 1800 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
            delta: entry.startTime,
          })
        }
      })
    })
    fcpObserver.observe({ entryTypes: ['paint'] })
    observers.push(fcpObserver)

    // Add more observers as needed...
  } catch (error) {
    console.error('[observeWebVitals] Error setting up observers:', error)
  }

  // Return cleanup function
  return () => {
    observers.forEach(observer => observer.disconnect())
  }
}

// ============================================================================
// Memory Profiling (Basic)
// ============================================================================

export interface MemoryInfo {
  /** Used JS heap size in bytes */
  usedJSHeapSize: number
  /** Total JS heap size in bytes */
  totalJSHeapSize: number
  /** JS heap size limit in bytes */
  jsHeapSizeLimit: number
  /** Usage percentage */
  usagePercentage: number
}

/**
 * Get current memory usage (Chrome only)
 */
export function getMemoryInfo(): MemoryInfo | null {
  if (typeof window === 'undefined') return null
  
  const perf = (window as any).performance
  if (!perf || !perf.memory) return null

  const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = perf.memory

  return {
    usedJSHeapSize,
    totalJSHeapSize,
    jsHeapSizeLimit,
    usagePercentage: (usedJSHeapSize / jsHeapSizeLimit) * 100,
  }
}
