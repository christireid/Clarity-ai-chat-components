/**
 * Performance Profiler
 *
 * Comprehensive profiling utility for measuring and tracking performance metrics
 * in React components, particularly for streaming and virtualization scenarios.
 */

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
 * Memory snapshot at a point in time
 */
export interface MemorySnapshot {
  timestamp: number
  usedHeapSize: number
  totalHeapSize: number
  heapLimit: number
  usedHeapSizeMB: number
  totalHeapSizeMB: number
}

/**
 * Render timing data
 */
export interface RenderTiming {
  componentName: string
  startTime: number
  endTime: number
  duration: number
  renderCount: number
}

/**
 * Layout recalculation data
 */
export interface LayoutMetrics {
  count: number
  totalDuration: number
  averageDuration: number
  maxDuration: number
}

/**
 * FPS measurement data
 */
export interface FPSMetrics {
  current: number
  average: number
  min: number
  max: number
  samples: number[]
  jankyFrames: number // Frames > 16.67ms
  longTasks: number // Tasks > 50ms
}

/**
 * Complete performance report
 */
export interface PerformanceReport {
  timestamp: number
  duration: number
  renders: RenderTiming[]
  layouts: LayoutMetrics
  fps: FPSMetrics
  memory: {
    initial: MemorySnapshot
    peak: MemorySnapshot
    final: MemorySnapshot
    leaked: number
  }
  userExperience: {
    timeToFirstPaint?: number
    timeToInteractive?: number
    totalBlockingTime: number
  }
}

/**
 * Performance Profiler
 *
 * Main class for tracking and measuring performance metrics
 */
export class PerformanceProfiler {
  private startTime: number = 0
  private renders: RenderTiming[] = []
  private layouts: { timestamp: number; duration: number }[] = []
  private fpsFrames: number[] = []
  private memorySnapshots: MemorySnapshot[] = []
  private longTasks: number = 0
  private isActive: boolean = false

  // Performance observer for long tasks
  private performanceObserver?: PerformanceObserver

  // FPS tracking
  private rafId?: number
  private lastFrameTime: number = 0
  private frameCount: number = 0
  private fpsCallback?: (fps: number) => void

  constructor() {
    // Initialize performance observer for long tasks if available
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        this.performanceObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              this.longTasks++
            }
          }
        })
      } catch (e) {
        // PerformanceObserver not supported in this environment
      }
    }
  }

  /**
   * Start profiling session
   */
  start(): void {
    if (this.isActive) {
      console.warn('[PerformanceProfiler] Already active')
      return
    }

    this.isActive = true
    this.startTime = performance.now()
    this.renders = []
    this.layouts = []
    this.fpsFrames = []
    this.memorySnapshots = []
    this.longTasks = 0

    // Capture initial memory snapshot
    this.captureMemorySnapshot()

    // Start observing long tasks
    if (this.performanceObserver) {
      try {
        this.performanceObserver.observe({ entryTypes: ['longtask'] })
      } catch (e) {
        // longtask not supported
      }
    }

    console.log('[PerformanceProfiler] Started profiling session')
  }

  /**
   * Stop profiling session
   */
  stop(): void {
    if (!this.isActive) {
      console.warn('[PerformanceProfiler] Not active')
      return
    }

    this.isActive = false

    // Stop FPS tracking
    this.stopFPSTracking()

    // Stop observing performance
    if (this.performanceObserver) {
      this.performanceObserver.disconnect()
    }

    // Capture final memory snapshot
    this.captureMemorySnapshot()

    console.log('[PerformanceProfiler] Stopped profiling session')
  }

  /**
   * Measure render time for a component
   * Returns a cleanup function to mark render end
   */
  measureRender(componentName: string): () => void {
    const startTime = performance.now()
    const renderIndex = this.renders.findIndex(r => r.componentName === componentName)

    return () => {
      const endTime = performance.now()
      const duration = endTime - startTime

      if (renderIndex >= 0) {
        // Update existing render timing
        const existing = this.renders[renderIndex]
        this.renders[renderIndex] = {
          componentName,
          startTime,
          endTime,
          duration,
          renderCount: existing.renderCount + 1,
        }
      } else {
        // Add new render timing
        this.renders.push({
          componentName,
          startTime,
          endTime,
          duration,
          renderCount: 1,
        })
      }

      if (duration > 100) {
        console.warn(
          `[PerformanceProfiler] Slow render: ${componentName} took ${duration.toFixed(2)}ms`
        )
      }
    }
  }

  /**
   * Track layout recalculations
   * Call this before operations that might cause layout thrashing
   */
  trackLayoutRecalculations(): number {
    const start = performance.now()

    // Force a layout recalculation by reading offsetHeight
    if (typeof document !== 'undefined') {
      const body = document.body
      const _ = body.offsetHeight // Force reflow
    }

    const end = performance.now()
    const duration = end - start

    this.layouts.push({
      timestamp: start,
      duration,
    })

    if (duration > 10) {
      console.warn(
        `[PerformanceProfiler] Expensive layout recalculation: ${duration.toFixed(2)}ms`
      )
    }

    return this.layouts.length
  }

  /**
   * Capture memory snapshot
   */
  captureMemorySnapshot(): MemorySnapshot {
    const snapshot: MemorySnapshot = {
      timestamp: performance.now(),
      usedHeapSize: 0,
      totalHeapSize: 0,
      heapLimit: 0,
      usedHeapSizeMB: 0,
      totalHeapSizeMB: 0,
    }

    if (performance.memory) {
      snapshot.usedHeapSize = performance.memory.usedJSHeapSize
      snapshot.totalHeapSize = performance.memory.totalJSHeapSize
      snapshot.heapLimit = performance.memory.jsHeapSizeLimit
      snapshot.usedHeapSizeMB = snapshot.usedHeapSize / 1024 / 1024
      snapshot.totalHeapSizeMB = snapshot.totalHeapSize / 1024 / 1024
    }

    this.memorySnapshots.push(snapshot)
    return snapshot
  }

  /**
   * Start FPS tracking
   */
  startFPSTracking(callback?: (fps: number) => void): void {
    if (this.rafId) {
      console.warn('[PerformanceProfiler] FPS tracking already started')
      return
    }

    this.fpsCallback = callback
    this.lastFrameTime = performance.now()
    this.frameCount = 0

    const measureFPS = () => {
      const now = performance.now()
      const delta = now - this.lastFrameTime

      this.frameCount++

      if (delta >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / delta)
        this.fpsFrames.push(fps)

        if (this.fpsCallback) {
          this.fpsCallback(fps)
        }

        this.frameCount = 0
        this.lastFrameTime = now
      }

      if (this.rafId) {
        this.rafId = requestAnimationFrame(measureFPS)
      }
    }

    this.rafId = requestAnimationFrame(measureFPS)
  }

  /**
   * Stop FPS tracking
   */
  stopFPSTracking(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = undefined
      this.fpsCallback = undefined
    }
  }

  /**
   * Measure FPS for a specific duration
   */
  async measureFPS(duration: number): Promise<number> {
    return new Promise((resolve) => {
      const frames: number[] = []
      const startTime = performance.now()

      this.startFPSTracking((fps) => {
        frames.push(fps)

        if (performance.now() - startTime >= duration) {
          this.stopFPSTracking()
          const averageFPS = frames.reduce((a, b) => a + b, 0) / frames.length
          resolve(Math.round(averageFPS))
        }
      })
    })
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const now = performance.now()
    const duration = now - this.startTime

    // Calculate FPS metrics
    const fpsMetrics: FPSMetrics = {
      current: this.fpsFrames[this.fpsFrames.length - 1] || 0,
      average: this.fpsFrames.length > 0
        ? this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length
        : 0,
      min: this.fpsFrames.length > 0 ? Math.min(...this.fpsFrames) : 0,
      max: this.fpsFrames.length > 0 ? Math.max(...this.fpsFrames) : 0,
      samples: [...this.fpsFrames],
      jankyFrames: this.fpsFrames.filter(fps => 1000 / fps > 16.67).length,
      longTasks: this.longTasks,
    }

    // Calculate layout metrics
    const layoutMetrics: LayoutMetrics = {
      count: this.layouts.length,
      totalDuration: this.layouts.reduce((sum, l) => sum + l.duration, 0),
      averageDuration: this.layouts.length > 0
        ? this.layouts.reduce((sum, l) => sum + l.duration, 0) / this.layouts.length
        : 0,
      maxDuration: this.layouts.length > 0
        ? Math.max(...this.layouts.map(l => l.duration))
        : 0,
    }

    // Calculate memory metrics
    const peakMemory = this.memorySnapshots.reduce(
      (peak, snapshot) =>
        snapshot.usedHeapSizeMB > peak.usedHeapSizeMB ? snapshot : peak,
      this.memorySnapshots[0] || { usedHeapSizeMB: 0 } as MemorySnapshot
    )

    const initialMemory = this.memorySnapshots[0] || {
      timestamp: 0,
      usedHeapSize: 0,
      totalHeapSize: 0,
      heapLimit: 0,
      usedHeapSizeMB: 0,
      totalHeapSizeMB: 0,
    }

    const finalMemory = this.memorySnapshots[this.memorySnapshots.length - 1] || initialMemory

    const leakedMemory = finalMemory.usedHeapSizeMB - initialMemory.usedHeapSizeMB

    return {
      timestamp: this.startTime,
      duration,
      renders: [...this.renders],
      layouts: layoutMetrics,
      fps: fpsMetrics,
      memory: {
        initial: initialMemory,
        peak: peakMemory,
        final: finalMemory,
        leaked: Math.max(0, leakedMemory),
      },
      userExperience: {
        totalBlockingTime: this.layouts.reduce((sum, l) => sum + Math.max(0, l.duration - 50), 0),
      },
    }
  }

  /**
   * Export report in JSON format
   */
  exportJSON(): string {
    const report = this.generateReport()
    return JSON.stringify(report, null, 2)
  }

  /**
   * Export report in HTML format
   */
  exportHTML(): string {
    const report = this.generateReport()

    return `
<!DOCTYPE html>
<html>
<head>
  <title>Performance Report</title>
  <style>
    body { font-family: system-ui; padding: 20px; max-width: 1200px; margin: 0 auto; }
    h1 { color: #333; }
    h2 { color: #666; margin-top: 30px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 600; }
    .metric { display: inline-block; margin: 10px 20px 10px 0; }
    .metric-label { color: #666; font-size: 14px; }
    .metric-value { font-size: 24px; font-weight: 600; color: #333; }
    .good { color: #22c55e; }
    .warning { color: #f59e0b; }
    .bad { color: #ef4444; }
  </style>
</head>
<body>
  <h1>Performance Report</h1>
  <p>Duration: ${(report.duration / 1000).toFixed(2)}s</p>

  <h2>FPS Metrics</h2>
  <div class="metric">
    <div class="metric-label">Average FPS</div>
    <div class="metric-value ${report.fps.average >= 55 ? 'good' : report.fps.average >= 30 ? 'warning' : 'bad'}">
      ${report.fps.average.toFixed(1)}
    </div>
  </div>
  <div class="metric">
    <div class="metric-label">Min FPS</div>
    <div class="metric-value">${report.fps.min}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Max FPS</div>
    <div class="metric-value">${report.fps.max}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Janky Frames</div>
    <div class="metric-value ${report.fps.jankyFrames === 0 ? 'good' : 'warning'}">
      ${report.fps.jankyFrames}
    </div>
  </div>
  <div class="metric">
    <div class="metric-label">Long Tasks</div>
    <div class="metric-value ${report.fps.longTasks === 0 ? 'good' : 'warning'}">
      ${report.fps.longTasks}
    </div>
  </div>

  <h2>Memory Usage</h2>
  <div class="metric">
    <div class="metric-label">Initial (MB)</div>
    <div class="metric-value">${report.memory.initial.usedHeapSizeMB.toFixed(2)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Peak (MB)</div>
    <div class="metric-value">${report.memory.peak.usedHeapSizeMB.toFixed(2)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Final (MB)</div>
    <div class="metric-value">${report.memory.final.usedHeapSizeMB.toFixed(2)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Leaked (MB)</div>
    <div class="metric-value ${report.memory.leaked < 1 ? 'good' : report.memory.leaked < 5 ? 'warning' : 'bad'}">
      ${report.memory.leaked.toFixed(2)}
    </div>
  </div>

  <h2>Render Performance</h2>
  <table>
    <thead>
      <tr>
        <th>Component</th>
        <th>Render Count</th>
        <th>Last Duration (ms)</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${report.renders.map(r => `
        <tr>
          <td>${r.componentName}</td>
          <td>${r.renderCount}</td>
          <td>${r.duration.toFixed(2)}</td>
          <td class="${r.duration < 16 ? 'good' : r.duration < 100 ? 'warning' : 'bad'}">
            ${r.duration < 16 ? '✓ Good' : r.duration < 100 ? '⚠ Acceptable' : '✗ Slow'}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>Layout Metrics</h2>
  <div class="metric">
    <div class="metric-label">Total Layouts</div>
    <div class="metric-value">${report.layouts.count}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Average Duration (ms)</div>
    <div class="metric-value">${report.layouts.averageDuration.toFixed(2)}</div>
  </div>
  <div class="metric">
    <div class="metric-label">Max Duration (ms)</div>
    <div class="metric-value ${report.layouts.maxDuration < 10 ? 'good' : 'warning'}">
      ${report.layouts.maxDuration.toFixed(2)}
    </div>
  </div>

  <h2>User Experience</h2>
  <div class="metric">
    <div class="metric-label">Total Blocking Time (ms)</div>
    <div class="metric-value ${report.userExperience.totalBlockingTime < 200 ? 'good' : report.userExperience.totalBlockingTime < 600 ? 'warning' : 'bad'}">
      ${report.userExperience.totalBlockingTime.toFixed(2)}
    </div>
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Export report in Markdown format
   */
  exportMarkdown(): string {
    const report = this.generateReport()

    return `# Performance Report

**Duration:** ${(report.duration / 1000).toFixed(2)}s

## FPS Metrics

- **Average FPS:** ${report.fps.average.toFixed(1)}
- **Min FPS:** ${report.fps.min}
- **Max FPS:** ${report.fps.max}
- **Janky Frames:** ${report.fps.jankyFrames}
- **Long Tasks:** ${report.fps.longTasks}

## Memory Usage

- **Initial:** ${report.memory.initial.usedHeapSizeMB.toFixed(2)} MB
- **Peak:** ${report.memory.peak.usedHeapSizeMB.toFixed(2)} MB
- **Final:** ${report.memory.final.usedHeapSizeMB.toFixed(2)} MB
- **Leaked:** ${report.memory.leaked.toFixed(2)} MB

## Render Performance

| Component | Render Count | Last Duration (ms) | Status |
|-----------|--------------|-------------------|--------|
${report.renders.map(r =>
  `| ${r.componentName} | ${r.renderCount} | ${r.duration.toFixed(2)} | ${r.duration < 16 ? '✓ Good' : r.duration < 100 ? '⚠ Acceptable' : '✗ Slow'} |`
).join('\n')}

## Layout Metrics

- **Total Layouts:** ${report.layouts.count}
- **Average Duration:** ${report.layouts.averageDuration.toFixed(2)} ms
- **Max Duration:** ${report.layouts.maxDuration.toFixed(2)} ms

## User Experience

- **Total Blocking Time:** ${report.userExperience.totalBlockingTime.toFixed(2)} ms
`.trim()
  }

  /**
   * Export report in specified format
   */
  exportReport(format: 'json' | 'html' | 'markdown'): string {
    switch (format) {
      case 'json':
        return this.exportJSON()
      case 'html':
        return this.exportHTML()
      case 'markdown':
        return this.exportMarkdown()
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }

  /**
   * Reset profiler state
   */
  reset(): void {
    this.stop()
    this.startTime = 0
    this.renders = []
    this.layouts = []
    this.fpsFrames = []
    this.memorySnapshots = []
    this.longTasks = 0
  }
}

/**
 * Create a new performance profiler instance
 */
export function createProfiler(): PerformanceProfiler {
  return new PerformanceProfiler()
}

/**
 * Global profiler instance for convenience
 */
export const profiler = new PerformanceProfiler()
