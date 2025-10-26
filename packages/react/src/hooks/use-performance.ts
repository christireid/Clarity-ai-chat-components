/**
 * Performance Monitoring Utilities
 * 
 * Hooks and utilities for monitoring and optimizing component performance.
 */

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
 * Hook to monitor component render performance
 */
export function useRenderPerformance(componentName: string): PerformanceMetrics {
  const renderCount = React.useRef(0)
  const renderTimes = React.useRef<number[]>([])
  const startTime = React.useRef<number>(0)

  // Mark render start
  startTime.current = performance.now()

  // Mark render end and calculate metrics
  React.useEffect(() => {
    const endTime = performance.now()
    const renderTime = endTime - startTime.current

    renderCount.current += 1
    renderTimes.current.push(renderTime)

    // Keep only last 100 renders
    if (renderTimes.current.length > 100) {
      renderTimes.current.shift()
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > 16) {
      console.warn(
        `[Performance] ${componentName} took ${renderTime.toFixed(2)}ms to render (${renderCount.current} renders)`
      )
    }
  })

  const averageRenderTime =
    renderTimes.current.length > 0
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
      : 0

  return {
    renderCount: renderCount.current,
    renderTime: startTime.current,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
    averageRenderTime,
  }
}

/**
 * Hook to track why component re-rendered
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = React.useRef<Record<string, any>>()

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
    const mountTime = performance.now()
    
    return () => {
      const unmountTime = performance.now()
      const lifetime = unmountTime - mountTime

      if (process.env.NODE_ENV === 'development') {
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

  startTime.current = performance.now()

  React.useEffect(() => {
    const endTime = performance.now()
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
  if (process.env.NODE_ENV !== 'development') return null

  const isSlowRender = metrics.lastRenderTime > threshold
  const isSlowAverage = metrics.averageRenderTime > threshold

  return (
    <div className="fixed bottom-4 left-4 p-3 rounded-lg bg-background border shadow-lg text-xs font-mono space-y-1 z-50">
      <div className="font-semibold text-foreground">Performance Metrics</div>
      <div className="text-muted-foreground">Renders: {metrics.renderCount}</div>
      <div className={isSlowRender ? 'text-destructive' : 'text-muted-foreground'}>
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

  React.useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    loader()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, deps)

  return { data, loading, error }
}

/**
 * Hook to debounce expensive operations
 */
export function useDebouncePerformance<T>(
  value: T,
  delay: number = 300
): T {
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
export function useThrottlePerformance<T>(
  value: T,
  limit: number = 100
): T {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastRan = React.useRef(Date.now())

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (Date.now() - lastRan.current >= limit) {
        setThrottledValue(value)
        lastRan.current = Date.now()
      }
    }, limit - (Date.now() - lastRan.current))

    return () => {
      clearTimeout(handler)
    }
  }, [value, limit])

  return throttledValue
}

/**
 * Memory leak detector
 */
export function useMemoryLeakDetector(componentName: string) {
  React.useEffect(() => {
    const listeners: any[] = []
    const originalAddEventListener = EventTarget.prototype.addEventListener
    const originalRemoveEventListener = EventTarget.prototype.removeEventListener

    // Override addEventListener
    EventTarget.prototype.addEventListener = function (type, listener, options) {
      listeners.push({ type, listener, target: this })
      return originalAddEventListener.call(this, type, listener, options)
    }

    // Check for leaks on unmount
    return () => {
      EventTarget.prototype.addEventListener = originalAddEventListener
      EventTarget.prototype.removeEventListener = originalRemoveEventListener

      if (listeners.length > 0 && process.env.NODE_ENV === 'development') {
        console.warn(
          `[Memory Leak] ${componentName} may have ${listeners.length} unremoved event listeners:`,
          listeners.map((l) => l.type)
        )
      }
    }
  }, [componentName])
}
