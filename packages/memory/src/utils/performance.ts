/**
 * Clarity Memory - Performance Utilities
 * 
 * Performance monitoring and optimization utilities
 */

/**
 * Performance timer for measuring execution time
 */
export class PerformanceTimer {
  private startTime: number
  private label: string

  constructor(label: string) {
    this.label = label
    this.startTime = performance.now()
  }

  end(): number {
    const duration = performance.now() - this.startTime
    if (typeof console !== 'undefined' && console.timeEnd) {
      console.timeEnd(this.label)
    }
    return duration
  }

  elapsed(): number {
    return performance.now() - this.startTime
  }
}

/**
 * Measure execution time of a function
 */
export async function measureTime<T>(
  fn: () => T | Promise<T>,
  label?: string
): Promise<{ result: T; duration: number }> {
  const timer = new PerformanceTimer(label || 'measureTime')
  const result = await fn()
  const duration = timer.end()
  return { result, duration }
}

/**
 * Batch operations for better performance
 */
export async function batch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = []

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map(processor))
    results.push(...batchResults)
  }

  return results
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  
  return chunks
}

/**
 * Deduplicate array by key function
 */
export function deduplicate<T>(
  array: T[],
  keyFn?: (item: T) => any
): T[] {
  const seen = new Set<any>()
  const result: T[] = []

  for (const item of array) {
    const key = keyFn ? keyFn(item) : item
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}

/**
 * Lazy evaluation wrapper
 */
export class Lazy<T> {
  private factory: () => T
  private value?: T
  private computed: boolean = false

  constructor(factory: () => T) {
    this.factory = factory
  }

  get(): T {
    if (!this.computed) {
      this.value = this.factory()
      this.computed = true
    }
    return this.value!
  }

  reset(): void {
    this.computed = false
    this.value = undefined
  }
}

/**
 * Performance statistics tracker
 */
export class PerformanceStats {
  private measurements: Map<string, number[]> = new Map()

  record(operation: string, duration: number): void {
    if (!this.measurements.has(operation)) {
      this.measurements.set(operation, [])
    }
    this.measurements.get(operation)!.push(duration)
  }

  getStats(operation: string): {
    count: number
    total: number
    average: number
    min: number
    max: number
  } | null {
    const measurements = this.measurements.get(operation)
    if (!measurements || measurements.length === 0) {
      return null
    }

    const total = measurements.reduce((a, b) => a + b, 0)
    const average = total / measurements.length
    const min = Math.min(...measurements)
    const max = Math.max(...measurements)

    return {
      count: measurements.length,
      total,
      average,
      min,
      max,
    }
  }

  getAllStats(): Record<string, ReturnType<typeof this.getStats>> {
    const stats: Record<string, any> = {}
    
    for (const operation of this.measurements.keys()) {
      stats[operation] = this.getStats(operation)
    }
    
    return stats
  }

  reset(): void {
    this.measurements.clear()
  }
}
