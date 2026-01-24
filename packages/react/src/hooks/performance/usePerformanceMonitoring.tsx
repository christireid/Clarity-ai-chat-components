'use client'

/**
 * React Performance Monitoring Hooks
 *
 * React-specific hooks that integrate with the unified performance monitor
 * from @clarity-chat/utils
 */

import { useEffect, useRef, useCallback, useState } from 'react'
import {
  UnifiedPerformanceMonitor as PerformanceMonitor,
  type PerformanceMetrics,
  type FPSMetrics,
} from '@clarity-chat/utils'

// ============================================================================
// TYPES
// ============================================================================

export interface UsePerformanceTrackingOptions {
  /** Component name for tracking */
  componentName: string
  /** Enable memory tracking */
  trackMemory?: boolean
  /** Custom metadata */
  metadata?: Record<string, any>
  /** Log to console */
  logToConsole?: boolean
  /** Send to analytics */
  sendToAnalytics?: boolean
  /** Performance thresholds */
  thresholds?: {
    slowRender: number // ms
    memoryLeak: number // bytes
  }
}

export interface UsePerformanceMonitoringOptions {
  /** Enable FPS monitoring */
  enableFPS?: boolean
  /** Enable memory monitoring */
  enableMemory?: boolean
  /** Update interval in ms */
  updateInterval?: number
}

// ============================================================================
// PERFORMANCE TRACKING HOOK
// ============================================================================

/**
 * Hook for tracking component performance metrics
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformanceTracking({
 *     componentName: 'MyComponent',
 *     trackMemory: true,
 *     metadata: { variant: 'large' }
 *   })
 *
 *   return <div>Content</div>
 * }
 * ```
 */
export function usePerformanceTracking({
  componentName,
  trackMemory = false,
  metadata = {},
  logToConsole = process.env['NODE_ENV'] === 'development',
  sendToAnalytics = false,
  thresholds = {
    slowRender: 16, // 60fps threshold
    memoryLeak: 1024 * 1024, // 1MB
  },
}: UsePerformanceTrackingOptions) {
  const renderCountRef = useRef(0)
  const mountTimeRef = useRef<number>(0)

  useEffect(() => {
    const cleanupRender = PerformanceMonitor.measureRender(componentName)
    renderCountRef.current++

    if (renderCountRef.current === 1) {
      mountTimeRef.current = performance.now()
    }

    // Copy ref value to local variable for cleanup
    const currentRenderCount = renderCountRef.current

    return () => {
      cleanupRender()

      const timing = PerformanceMonitor.getOperationMetrics(componentName)
      if (!timing) return

      // Log if slow
      if (logToConsole && timing.duration && timing.duration > thresholds.slowRender) {
        console.warn(
          `Slow render: ${componentName} took ${timing.duration.toFixed(2)}ms`,
          { metadata, renderCount: currentRenderCount }
        )
      }

      // Send to analytics (placeholder)
      if (sendToAnalytics) {
        // Integrate with your analytics service
        try {
          const stored = localStorage.getItem('clarity-performance-metrics')
          const metricsArray = stored ? JSON.parse(stored) : []
          metricsArray.push({
            component: componentName,
            renderTime: timing.duration,
            timestamp: Date.now(),
            metadata,
          })

          if (metricsArray.length > 100) {
            metricsArray.shift()
          }

          localStorage.setItem('clarity-performance-metrics', JSON.stringify(metricsArray))
        } catch (error) {
          // Ignore localStorage errors
        }
      }
    }
  })

  return {
    renderCount: renderCountRef.current,
    mountTime: mountTimeRef.current,
  }
}

// ============================================================================
// COMPREHENSIVE PERFORMANCE MONITORING HOOK
// ============================================================================

/**
 * Hook for comprehensive performance monitoring
 *
 * @example
 * ```tsx
 * function App() {
 *   const { metrics, fps, cleanup } = usePerformanceMonitoring({
 *     enableFPS: true,
 *     enableMemory: true
 *   })
 *
 *   return <div>FPS: {fps.current}</div>
 * }
 * ```
 */
export function usePerformanceMonitoring(
  options: UsePerformanceMonitoringOptions = {}
) {
  const {
    enableFPS = false,
    enableMemory = false,
    updateInterval = 1000,
  } = options

  const [metrics, setMetrics] = useState<PerformanceMetrics>(() =>
    PerformanceMonitor.getMetrics()
  )
  const [fps, setFPS] = useState<FPSMetrics>(() => PerformanceMonitor.getFPSMetrics())

  useEffect(() => {
    if (enableFPS) {
      PerformanceMonitor.startFPSMonitoring()
    }

    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getMetrics())
      if (enableFPS) {
        setFPS(PerformanceMonitor.getFPSMetrics())
      }
    }, updateInterval)

    return () => {
      clearInterval(interval)
      if (enableFPS) {
        PerformanceMonitor.stopFPSMonitoring()
      }
    }
  }, [enableFPS, enableMemory, updateInterval])

  const measureRender = useCallback(
    <T,>(componentName: string, renderFn: () => T): T => {
      const cleanup = PerformanceMonitor.measureRender(componentName)
      const result = renderFn()
      cleanup()
      return result
    },
    []
  )

  const isPerformanceAcceptable = useCallback(() => {
    const fpsOk = !enableFPS || PerformanceMonitor.isFPSAcceptable()
    return fpsOk
  }, [enableFPS])

  const cleanup = useCallback(() => {
    PerformanceMonitor.clear()
  }, [])

  return {
    metrics,
    fps,
    measureRender,
    isPerformanceAcceptable,
    cleanup,
  }
}

// ============================================================================
// RENDER OPTIMIZATION HOOK
// ============================================================================

/**
 * Hook for optimizing re-renders
 *
 * @example
 * ```tsx
 * function Component({ data }) {
 *   const optimizedData = useRenderOptimization(data, (prev, next) =>
 *     prev.id === next.id
 *   )
 *
 *   return <div>{optimizedData.value}</div>
 * }
 * ```
 */
export function useRenderOptimization<T>(
  value: T,
  comparator?: (prev: T, next: T) => boolean
): T {
  const ref = useRef<T>(value)

  const shouldUpdate = comparator
    ? !comparator(ref.current, value)
    : ref.current !== value

  if (shouldUpdate) {
    ref.current = value
  }

  return ref.current
}

// ============================================================================
// COMPONENT PERFORMANCE WRAPPER (HOC)
// ============================================================================

/**
 * Higher-order component for performance tracking
 *
 * @example
 * ```tsx
 * const TrackedComponent = withComponentPerformanceTracking(
 *   MyComponent,
 *   'MyComponent'
 * )
 * ```
 */
export function withComponentPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = (props: P) => {
    usePerformanceTracking({ componentName })

    return <Component {...props} />
  }

  WrappedComponent.displayName = `withPerformanceTracking(${componentName})`

  return WrappedComponent
}

// ============================================================================
// ANIMATION FRAME UTILITIES
// ============================================================================

/**
 * Animation frame utilities for 60fps
 */
export class AnimationFrame {
  private rafId: number | null = null
  private callbacks: Set<() => void> = new Set()
  private isRunning = false

  /**
   * Schedule a callback for the next animation frame
   */
  schedule(callback: () => void): () => void {
    this.callbacks.add(callback)
    this.start()

    return () => {
      this.callbacks.delete(callback)
      if (this.callbacks.size === 0) {
        this.stop()
      }
    }
  }

  /**
   * Start the animation frame loop
   */
  private start(): void {
    if (this.isRunning) return

    this.isRunning = true
    const loop = () => {
      if (!this.isRunning) return

      const callbacks = Array.from(this.callbacks)
      this.callbacks.clear()

      callbacks.forEach((callback) => {
        try {
          callback()
        } catch (error) {
          console.error('Animation frame callback error:', error)
        }
      })

      if (this.callbacks.size > 0) {
        this.rafId = requestAnimationFrame(loop)
      } else {
        this.isRunning = false
      }
    }

    this.rafId = requestAnimationFrame(loop)
  }

  /**
   * Stop the animation frame loop
   */
  private stop(): void {
    this.isRunning = false
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  /**
   * Cancel all pending callbacks
   */
  cancel(): void {
    this.callbacks.clear()
    this.stop()
  }
}

export const animationFrame = new AnimationFrame()

/**
 * 60fps animation utilities
 */
export class FPSOptimizer {
  private targetFPS: number
  private frameInterval: number
  private lastFrameTime = 0

  constructor(targetFPS: number = 60) {
    this.targetFPS = targetFPS
    this.frameInterval = 1000 / targetFPS
  }

  /**
   * Optimize animation for target FPS
   */
  optimizeAnimation(currentTime: number, callback: () => void): void {
    const delta = currentTime - this.lastFrameTime

    if (delta >= this.frameInterval) {
      callback()
      this.lastFrameTime = currentTime - (delta % this.frameInterval)
    }
  }

  /**
   * Get recommended animation duration for smooth 60fps
   */
  getOptimalDuration(): number {
    return 150 // 150ms for smooth animations
  }

  /**
   * Get recommended easing for smooth animations
   */
  getOptimalEasing(): string {
    return 'cubic-bezier(0.16, 1, 0.3, 1)'
  }
}

/**
 * React hook for 60fps animations
 */
export function use60FPSAnimation(enabled: boolean = true) {
  const [fpsOptimizer] = useState(() => new FPSOptimizer())
  const lastTimeRef = useRef<number>(0)

  const animate = useCallback(
    (callback: () => void) => {
      if (!enabled) {
        callback()
        return
      }

      const currentTime = performance.now()
      fpsOptimizer.optimizeAnimation(currentTime, callback)
      lastTimeRef.current = currentTime
    },
    [enabled, fpsOptimizer]
  )

  return {
    animate,
    getOptimalDuration: fpsOptimizer.getOptimalDuration.bind(fpsOptimizer),
  }
}

// ============================================================================
// PROFILER CALLBACK HELPER
// ============================================================================

/**
 * Custom profiler callback for React DevTools integration
 *
 * @example
 * ```tsx
 * <Profiler id="MyComponent" onRender={createProfilerCallback('MyComponent')}>
 *   <MyComponent />
 * </Profiler>
 * ```
 */
export function createProfilerCallback(componentName: string) {
  return (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => {
    if (process.env['NODE_ENV'] === 'development') {
      console.log(`⚛️ ${componentName} ${phase}`, {
        actualDuration: `${actualDuration.toFixed(2)}ms`,
        baseDuration: `${baseDuration.toFixed(2)}ms`,
        startTime,
        commitTime,
      })
    }

    // Record in performance monitor
    PerformanceMonitor.time(`${componentName}-${phase}`)
    setTimeout(() => {
      PerformanceMonitor.timeEnd(`${componentName}-${phase}`)
    }, actualDuration)
  }
}
