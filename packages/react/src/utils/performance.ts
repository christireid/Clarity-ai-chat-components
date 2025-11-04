/**
 * Performance utilities for chat hooks
 */

/**
 * Throttle function calls
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
 * Debounce function calls
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
 * Measure performance
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): T {
  const start = performance.now()
  const result = fn()
  const end = performance.now()
  
  if (typeof window !== 'undefined' && (window as any).__PERF_LOGGING__) {
    console.log(`[Performance] ${name}: ${end - start}ms`)
  }
  
  return result
}

/**
 * Create a performance monitor
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map()

  start(label: string): () => void {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      const existing = this.metrics.get(label) || []
      existing.push(duration)
      this.metrics.set(label, existing)
    }
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } {
    const values = this.metrics.get(label) || []
    if (values.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0 }
    }

    const sum = values.reduce((a, b) => a + b, 0)
    const avg = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return { avg, min, max, count: values.length }
  }

  reset(label?: string): void {
    if (label) {
      this.metrics.delete(label)
    } else {
      this.metrics.clear()
    }
  }

  getReport(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const report: Record<string, { avg: number; min: number; max: number; count: number }> = {}
    for (const [label] of this.metrics) {
      report[label] = this.getMetrics(label)
    }
    return report
  }
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
export function optimizeArray<T>(
  array: T[],
  maxSize: number = 1000
): T[] {
  if (array.length <= maxSize) {
    return array
  }

  // Keep first and last items, sample middle
  const keepFirst = Math.floor(maxSize * 0.2)
  const keepLast = Math.floor(maxSize * 0.2)
  const sampleSize = maxSize - keepFirst - keepLast

  const first = array.slice(0, keepFirst)
  const last = array.slice(-keepLast)
  const middle = array.slice(keepFirst, -keepLast)

  // Sample middle section
  const step = Math.ceil(middle.length / sampleSize)
  const sampled = middle.filter((_, index) => index % step === 0).slice(0, sampleSize)

  return [...first, ...sampled, ...last]
}
