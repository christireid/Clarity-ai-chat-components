/**
 * Performance Optimization Utilities
 * 
 * Utilities for optimizing AI chat application performance as specified in the blueprint.
 * 
 * Features:
 * - Virtual scrolling optimization
 * - Debounced input handling
 * - Efficient re-rendering strategies
 * - Memory management
 * - Bundle size optimization helpers
 */

/**
 * Virtual scrolling configuration
 */
export interface VirtualScrollConfig {
  /** Item height in pixels */
  itemHeight: number
  /** Container height in pixels */
  containerHeight: number
  /** Overscan count (items to render outside viewport) */
  overscan?: number
  /** Enable dynamic height calculation */
  dynamicHeight?: boolean
}

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

/**
 * Debounce configuration
 */
export interface DebounceConfig {
  /** Delay in milliseconds */
  delay: number
  /** Leading edge execution */
  leading?: boolean
  /** Trailing edge execution */
  trailing?: boolean
}

/**
 * Create a debounced function
 */
export function createDebouncedFunction<T extends (...args: any[]) => any>(
  fn: T,
  config: DebounceConfig
): (...args: Parameters<T>) => void {
  const { delay, leading = false, trailing = true } = config
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastCallTime = 0

  return function debounced(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    if (leading && !timeoutId) {
      fn(...args)
      lastCallTime = now
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      if (trailing) {
        fn(...args)
        lastCallTime = Date.now()
      }
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttle configuration
 */
export interface ThrottleConfig {
  /** Delay in milliseconds */
  delay: number
  /** Leading edge execution */
  leading?: boolean
  /** Trailing edge execution */
  trailing?: boolean
}

/**
 * Create a throttled function
 */
export function createThrottledFunction<T extends (...args: any[]) => any>(
  fn: T,
  config: ThrottleConfig
): (...args: Parameters<T>) => void {
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

/**
 * Memory management utilities
 */
export class MemoryManager {
  private cache: Map<string, any> = new Map()
  private maxSize: number
  private accessOrder: string[] = []

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize
  }

  /**
   * Get item from cache
   */
  get(key: string): any | undefined {
    if (this.cache.has(key)) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter((k) => k !== key)
      this.accessOrder.push(key)
      return this.cache.get(key)
    }
    return undefined
  }

  /**
   * Set item in cache
   */
  set(key: string, value: any): void {
    if (this.cache.has(key)) {
      this.cache.set(key, value)
      // Move to end
      this.accessOrder = this.accessOrder.filter((k) => k !== key)
      this.accessOrder.push(key)
    } else {
      // Check if we need to evict
      if (this.cache.size >= this.maxSize) {
        const oldestKey = this.accessOrder.shift()
        if (oldestKey) {
          this.cache.delete(oldestKey)
        }
      }
      this.cache.set(key, value)
      this.accessOrder.push(key)
    }
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear()
    this.accessOrder = []
  }

  /**
   * Get cache size
   */
  get size(): number {
    return this.cache.size
  }
}

/**
 * Message diff utility for efficient re-rendering
 */
export function calculateMessageDiff(
  oldMessages: Array<{ id: string; [key: string]: any }>,
  newMessages: Array<{ id: string; [key: string]: any }>
): {
  added: Array<{ id: string; [key: string]: any }>
  removed: Array<{ id: string; [key: string]: any }>
  updated: Array<{ id: string; old: any; new: any }>
  unchanged: string[]
} {
  const oldMap = new Map(oldMessages.map((msg) => [msg.id, msg]))
  const newMap = new Map(newMessages.map((msg) => [msg.id, msg]))

  const added: Array<{ id: string; [key: string]: any }> = []
  const removed: Array<{ id: string; [key: string]: any }> = []
  const updated: Array<{ id: string; old: any; new: any }> = []
  const unchanged: string[] = []

  // Find added and updated
  for (const [id, newMsg] of newMap) {
    const oldMsg = oldMap.get(id)
    if (!oldMsg) {
      added.push(newMsg)
    } else if (JSON.stringify(oldMsg) !== JSON.stringify(newMsg)) {
      updated.push({ id, old: oldMsg, new: newMsg })
    } else {
      unchanged.push(id)
    }
  }

  // Find removed
  for (const [id, oldMsg] of oldMap) {
    if (!newMap.has(id)) {
      removed.push(oldMsg)
    }
  }

  return { added, removed, updated, unchanged }
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

  /**
   * Add item to batch queue
   */
  add(item: T): void {
    this.queue.push(item)

    if (this.queue.length >= this.batchSize) {
      this.flush()
    } else {
      this.scheduleFlush()
    }
  }

  /**
   * Schedule batch processing
   */
  private scheduleFlush(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }

    this.timeoutId = setTimeout(() => {
      this.flush()
    }, this.delay)
  }

  /**
   * Process batch immediately
   */
  async flush(): Promise<void> {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }

    if (this.queue.length === 0) return

    const batch = this.queue.splice(0, this.batchSize)
    await this.processor(batch)
  }

  /**
   * Clear queue
   */
  clear(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      this.timeoutId = null
    }
    this.queue = []
  }
}

/**
 * Performance metrics tracker
 */
export class PerformanceTracker {
  private metrics: Map<string, number[]> = new Map()

  /**
   * Start timing an operation
   */
  start(label: string): () => void {
    const startTime = performance.now()

    return () => {
      const duration = performance.now() - startTime
      const times = this.metrics.get(label) || []
      times.push(duration)
      this.metrics.set(label, times)
    }
  }

  /**
   * Get average time for a label
   */
  getAverage(label: string): number {
    const times = this.metrics.get(label)
    if (!times || times.length === 0) return 0
    return times.reduce((sum, time) => sum + time, 0) / times.length
  }

  /**
   * Get all metrics
   */
  getMetrics(): Record<string, { average: number; count: number; min: number; max: number }> {
    const result: Record<string, any> = {}

    for (const [label, times] of this.metrics) {
      result[label] = {
        average: this.getAverage(label),
        count: times.length,
        min: Math.min(...times),
        max: Math.max(...times),
      }
    }

    return result
  }

  /**
   * Clear metrics
   */
  clear(): void {
    this.metrics.clear()
  }
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
