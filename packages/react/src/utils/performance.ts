/**
 * Clarity Chat - Performance Optimization Utilities
 *
 * Comprehensive performance layer providing:
 * - 60fps animation optimization
 * - <100ms render time targets
 * - Memory management
 * - Bundle size optimization
 * - Runtime performance monitoring
 */

import * as React from 'react'

// Extend Performance interface for Chrome-specific memory API
declare global {
  interface Performance {
    memory?: {
      usedJSHeapSize: number
      totalJSHeapSize: number
      jsHeapSizeLimit: number
    }
  }
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Target FPS (default: 60) */
  targetFPS: number
  /** Target render time in ms (default: 100) */
  targetRenderTime: number
  /** Enable performance monitoring */
  enableMonitoring: boolean
  /** Enable memory management */
  enableMemoryManagement: boolean
  /** Enable bundle optimization */
  enableBundleOptimization: boolean
  /** Maximum memory usage in MB */
  maxMemoryUsage: number
}

export const defaultPerformanceConfig: PerformanceConfig = {
  targetFPS: 60,
  targetRenderTime: 100,
  enableMonitoring: true,
  enableMemoryManagement: true,
  enableBundleOptimization: true,
  maxMemoryUsage: 512,
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  fps: number
  renderTime: number
  memoryUsage: number
  bundleSize: number
  componentCount: number
  rerenderCount: number
}

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
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    fps: 60,
    renderTime: 50,
    memoryUsage: 0,
    bundleSize: 0,
    componentCount: 0,
    rerenderCount: 0,
  }

  private lastFrameTime = performance.now()
  private frameCount = 0
  private isMonitoring = false

  /**
   * Start performance monitoring
   */
  start(): void {
    if (this.isMonitoring) return
    this.isMonitoring = true

    const measureFrame = () => {
      if (!this.isMonitoring) return

      const now = performance.now()
      const delta = now - this.lastFrameTime

      // Calculate FPS
      this.frameCount++
      if (delta >= 1000) {
        this.metrics.fps = Math.round((this.frameCount * 1000) / delta)
        this.frameCount = 0
        this.lastFrameTime = now
      }

      // Update memory usage
      if (performance.memory) {
        this.metrics.memoryUsage = Math.round(
          (performance.memory.usedJSHeapSize || 0) / 1024 / 1024
        )
      }

      animationFrame.schedule(measureFrame)
    }

    measureFrame()
  }

  /**
   * Stop performance monitoring
   */
  stop(): void {
    this.isMonitoring = false
    animationFrame.cancel()
  }

  /**
   * Measure component render time
   */
  measureRenderTime<T>(componentName: string, renderFn: () => T): T {
    const start = performance.now()
    const result = renderFn()
    const end = performance.now()

    const renderTime = end - start
    this.metrics.renderTime = renderTime

    if (renderTime > 100) {
      console.warn(
        `Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`
      )
    }

    return result
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  /**
   * Check if performance is acceptable
   */
  isPerformanceAcceptable(): boolean {
    return this.metrics.fps >= 30 && this.metrics.renderTime <= 100
  }
}

export const performanceMonitor = new PerformanceMonitor()

/**
 * Memory management utilities
 */
export class MemoryManager {
  private cleanupCallbacks: Set<() => void> = new Set()
  private maxMemoryUsage: number

  constructor(maxMemoryUsage: number = 512) {
    this.maxMemoryUsage = maxMemoryUsage
  }

  /**
   * Register a cleanup callback
   */
  registerCleanup(callback: () => void): () => void {
    this.cleanupCallbacks.add(callback)
    return () => this.cleanupCallbacks.delete(callback)
  }

  /**
   * Perform memory cleanup
   */
  cleanup(): void {
    this.cleanupCallbacks.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error('Memory cleanup error:', error)
      }
    })

    // Force garbage collection (if available)
    if (global.gc) {
      global.gc()
    }
  }

  /**
   * Check if memory usage is acceptable
   */
  isMemoryUsageAcceptable(): boolean {
    if (!performance.memory) return true

    const usedMemory = Math.round(
      (performance.memory.usedJSHeapSize || 0) / 1024 / 1024
    )
    return usedMemory < this.maxMemoryUsage
  }

  /**
   * Create a memory-efficient object pool
   */
  createObjectPool<T>(
    createFn: () => T,
    resetFn: (obj: T) => void,
    maxSize: number = 100
  ): ObjectPool<T> {
    return new ObjectPool(createFn, resetFn, maxSize)
  }
}

export const memoryManager = new MemoryManager()

/**
 * Object pool for memory efficiency
 */
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void
  private maxSize: number

  constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize: number) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.maxSize = maxSize
  }

  /**
   * Acquire an object from the pool
   */
  acquire(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.createFn()
  }

  /**
   * Release an object back to the pool
   */
  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool.length = 0
  }
}

/**
 * Bundle size optimization utilities
 */
export class BundleOptimizer {
  /**
   * Lazy load a component
   */
  static lazyLoadComponent<T extends React.ComponentType<any>>(
    loader: () => Promise<{ default: T }>
  ): React.LazyExoticComponent<T> {
    return React.lazy(loader)
  }

  /**
   * Code split a module
   */
  static codeSplitModule<T>(
    loader: () => Promise<T>,
    moduleName: string
  ): Promise<T> {
    console.log(`[BundleOptimizer] Loading module: ${moduleName}`)
    return loader()
  }

  /**
   * Optimize images for web
   */
  static optimizeImage(
    src: string,
    options: {
      width?: number
      height?: number
      quality?: number
      format?: 'webp' | 'avif' | 'jpeg'
    } = {}
  ): string {
    // In a real implementation, use an image optimization service
    // This is a placeholder that returns the original src
    return src
  }

  /**
   * Tree shake unused code
   */
  static treeShakeUnusedCode(): void {
    // In a real implementation, use webpack's tree shaking
    // This is a placeholder
    console.log('[BundleOptimizer] Tree shaking unused code')
  }
}

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

export const fpsOptimizer = new FPSOptimizer()

/**
 * React hook for performance monitoring
 */
export function usePerformanceMonitoring(
  config: Partial<PerformanceConfig> = {}
) {
  const [monitor] = React.useState(() => new PerformanceMonitor())
  const [memory] = React.useState(() => new MemoryManager())
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>({
    fps: 60,
    renderTime: 50,
    memoryUsage: 0,
    bundleSize: 0,
    componentCount: 0,
    rerenderCount: 0,
  })

  React.useEffect(() => {
    monitor.start()

    const updateMetrics = () => {
      setMetrics(monitor.getMetrics())
      animationFrame.schedule(updateMetrics)
    }

    updateMetrics()

    return () => {
      monitor.stop()
    }
  }, [monitor])

  const measureRender = React.useCallback(
    <T>(componentName: string, renderFn: () => T): T => {
      return monitor.measureRenderTime(componentName, renderFn)
    },
    [monitor]
  )

  const isPerformanceAcceptable = React.useCallback(() => {
    return monitor.isPerformanceAcceptable()
  }, [monitor])

  const cleanup = React.useCallback(() => {
    memory.cleanup()
  }, [memory])

  return {
    metrics,
    measureRender,
    isPerformanceAcceptable,
    cleanup,
    animationFrame,
    memoryManager: memory,
  }
}

/**
 * React hook for optimizing re-renders
 */
export function useRenderOptimization<T>(
  value: T,
  comparator?: (prev: T, next: T) => boolean
): T {
  const ref = React.useRef<T>(value)

  const shouldUpdate = React.useMemo(() => {
    if (comparator) {
      return !comparator(ref.current, value)
    }
    return ref.current !== value
  }, [value, comparator])

  if (shouldUpdate) {
    ref.current = value
  }

  return ref.current
}

/**
 * React hook for 60fps animations
 */
export function use60FPSAnimation(enabled: boolean = true) {
  const [fpsOptimizer] = React.useState(() => new FPSOptimizer())
  const lastTimeRef = React.useRef<number>(0)

  const animate = React.useCallback(
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
