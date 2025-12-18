/**
 * Performance Monitoring Utilities
 *
 * Hooks and utilities for monitoring and optimizing component performance.
 */

'use client'

import * as React from 'react'

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  renderCount: number
  renderTime: number
  lastRenderTime: number
  averageRenderTime: number
}

/**
 * Numeric circular buffer for O(1) operations on fixed-size number arrays.
 * Used to store render times without O(n) shift operations.
 *
 * Note: This is intentionally NOT generic to ensure type-safety for sum().
 * Using a specific numeric type prevents accidental misuse with non-numeric values.
 */
class NumericCircularBuffer {
  private buffer: number[]
  private head: number = 0
  private count: number = 0
  private readonly capacity: number

  constructor(capacity: number) {
    // Validate capacity to prevent divide-by-zero and undefined behavior
    if (!Number.isInteger(capacity) || capacity < 1) {
      throw new Error(
        `NumericCircularBuffer: capacity must be a positive integer, got ${capacity}`
      )
    }
    this.capacity = capacity
    this.buffer = new Array(capacity)
  }

  push(item: number): void {
    this.buffer[this.head] = item
    this.head = (this.head + 1) % this.capacity
    if (this.count < this.capacity) {
      this.count++
    }
  }

  toArray(): number[] {
    if (this.count === 0) return []
    if (this.count < this.capacity) {
      return this.buffer.slice(0, this.count)
    }
    // Return items in order: oldest to newest
    return [...this.buffer.slice(this.head), ...this.buffer.slice(0, this.head)]
  }

  get length(): number {
    return this.count
  }

  get last(): number | undefined {
    if (this.count === 0) return undefined
    const lastIndex = (this.head - 1 + this.capacity) % this.capacity
    return this.buffer[lastIndex]
  }

  sum(): number {
    if (this.count === 0) return 0
    let total = 0
    for (let i = 0; i < this.count; i++) {
      const index = (this.head - this.count + i + this.capacity) % this.capacity
      total += this.buffer[index]
    }
    return total
  }
}

/**
 * Hook to monitor component render performance
 * Uses circular buffer for O(1) render time tracking instead of O(n) array.shift()
 */
export function useRenderPerformance(
  componentName: string
): PerformanceMetrics {
  const renderCount = React.useRef(0)
  // Use circular buffer instead of array.shift() for O(1) performance
  const renderTimes = React.useRef<NumericCircularBuffer>(
    new NumericCircularBuffer(100)
  )
  const startTime = React.useRef<number>(0)

  // Mark render start (guard for SSR)
  startTime.current =
    typeof performance !== 'undefined' ? performance.now() : Date.now()

  // Mark render end and calculate metrics
  React.useEffect(() => {
    const endTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    const renderTime = endTime - startTime.current

    renderCount.current += 1
    // O(1) push operation with automatic overflow handling
    renderTimes.current.push(renderTime)

    // Log slow renders in development
    if (process.env['NODE_ENV'] === 'development' && renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (${renderCount.current} renders)`
      )
    }
  })

  const bufferLength = renderTimes.current.length
  const averageRenderTime =
    bufferLength > 0 ? renderTimes.current.sum() / bufferLength : 0

  return {
    renderCount: renderCount.current,
    renderTime: startTime.current,
    lastRenderTime: renderTimes.current.last || 0,
    averageRenderTime,
  }
}

/**
 * Hook to track why component re-rendered
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = React.useRef<Record<string, any> | undefined>(undefined)

  React.useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changedProps: Record<string, { from: any; to: any }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          }
        }
      })

      if (Object.keys(changedProps).length > 0) {
        console.log('[WhyDidYouUpdate]', name, changedProps)
      }
    }

    previousProps.current = props
  })
}

/**
 * Hook to measure component mount time
 */
export function useMountTime(componentName: string) {
  React.useEffect(() => {
    const mountTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now()

    return () => {
      const unmountTime =
        typeof performance !== 'undefined' ? performance.now() : Date.now()
      const lifetime = unmountTime - mountTime

      if (process.env['NODE_ENV'] === 'development') {
        console.log(
          `[Mount Time] ${componentName} was mounted for ${lifetime.toFixed(2)}ms`
        )
      }
    }
  }, [componentName])
}

/**
 * Hook to detect slow renders
 */
export function useSlowRenderDetection(
  threshold: number = 16,
  onSlowRender?: (renderTime: number) => void
) {
  const startTime = React.useRef<number>(0)

  startTime.current =
    typeof performance !== 'undefined' ? performance.now() : Date.now()

  React.useEffect(() => {
    const endTime =
      typeof performance !== 'undefined' ? performance.now() : Date.now()
    const renderTime = endTime - startTime.current

    if (renderTime > threshold) {
      onSlowRender?.(renderTime)
    }
  })
}

/**
 * Performance report component
 */
export interface PerformanceReportProps {
  metrics: PerformanceMetrics
  threshold?: number
}

export const PerformanceReport: React.FC<PerformanceReportProps> = ({
  metrics,
  threshold = 16,
}) => {
  if (process.env['NODE_ENV'] !== 'development') return null

  const isSlowRender = metrics.lastRenderTime > threshold
  const isSlowAverage = metrics.averageRenderTime > threshold

  return (
    <div className="fixed bottom-4 left-4 p-3 rounded-lg bg-background border border-border/60 shadow-[0_10px_24px_rgba(15,23,42,0.12)] text-xs font-mono space-y-1 z-50 backdrop-blur-sm">
      <div className="font-semibold text-foreground">Performance Metrics</div>
      <div className="text-muted-foreground">
        Renders: {metrics.renderCount}
      </div>
      <div
        className={isSlowRender ? 'text-destructive' : 'text-muted-foreground'}
      >
        Last: {metrics.lastRenderTime.toFixed(2)}ms
        {isSlowRender && ' ⚠️'}
      </div>
      <div className={isSlowAverage ? 'text-warning' : 'text-muted-foreground'}>
        Avg: {metrics.averageRenderTime.toFixed(2)}ms
        {isSlowAverage && ' ⚠️'}
      </div>
    </div>
  )
}

/**
 * Hook for lazy loading components
 */
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<Error | null>(null)

  // Store loader in ref to avoid dependency issues
  const loaderRef = React.useRef(loader)

  React.useLayoutEffect(() => {
    loaderRef.current = loader
  }, [loader])

  React.useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    loaderRef
      .current()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps) // Loader accessed via ref

  return { data, loading, error }
}

/**
 * Hook to debounce expensive operations
 */
export function useDebouncePerformance<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook to throttle expensive operations
 */
export function useThrottlePerformance<T>(value: T, limit: number = 100): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRan = React.useRef<number>(Date.now())
  const timeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined)

  React.useEffect(() => {
    const now = Date.now()
    const timeSinceLastRun = now - lastRan.current

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // If enough time has passed, update immediately
    if (timeSinceLastRun >= limit) {
      setThrottledValue(value)
      lastRan.current = now
    } else {
      // Schedule update for remaining time
      const remainingTime = limit - timeSinceLastRun
      timeoutRef.current = setTimeout(
        () => {
          setThrottledValue(value)
          lastRan.current = Date.now()
          timeoutRef.current = undefined
        },
        Math.max(0, remainingTime)
      )
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, limit])

  return throttledValue
}

/**
 * Memory leak detector
 * WARNING: Modifying global prototypes can cause issues. Use with caution and only in development.
 * Consider using React DevTools Profiler for production-safe memory analysis.
 */
export function useMemoryLeakDetector(componentName: string) {
  React.useEffect(() => {
    if (
      typeof window === 'undefined' ||
      process.env['NODE_ENV'] !== 'development'
    ) {
      return
    }

    const listeners: any[] = []
    const originalAddEventListener = EventTarget.prototype.addEventListener
    const originalRemoveEventListener =
      EventTarget.prototype.removeEventListener

    // Override addEventListener (only in dev)
    EventTarget.prototype.addEventListener = function (
      type,
      listener,
      options
    ) {
      listeners.push({ type, listener, target: this })
      return originalAddEventListener.call(this, type, listener, options)
    }

    // Check for leaks on unmount
    return () => {
      EventTarget.prototype.addEventListener = originalAddEventListener
      EventTarget.prototype.removeEventListener = originalRemoveEventListener

      if (listeners.length > 0) {
        console.warn(
          `[Memory Leak] ${componentName} may have ${listeners.length} unremoved event listeners:`,
          listeners.map((l) => l.type)
        )
      }
    }
  }, [componentName])
}
