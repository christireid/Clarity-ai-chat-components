'use client'

import { useEffect, useState, useCallback } from 'react'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

interface PerformanceMetrics {
  fps: number
  memory: number
  latency: number
  renderTime: number
}

interface PerformanceMonitorProps {
  className?: string
  showDetailed?: boolean
}

export function PerformanceMonitor({ className, showDetailed = false }: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    latency: 0,
    renderTime: 0,
  })
  const [history, setHistory] = useState<PerformanceMetrics[]>([])

  const measurePerformance = useCallback(() => {
    // FPS measurement
    let fps = 60
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation')
      if (entries.length > 0) {
        const navEntry = entries[0] as PerformanceNavigationTiming
        fps = Math.round(1000 / (navEntry.loadEventEnd - navEntry.fetchStart || 16.67))
      }
    }

    // Memory usage (if available)
    let memory = 0
    if ('memory' in performance) {
      const memInfo = (performance as any).memory
      memory = Math.round((memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100)
    }

    // Network latency
    let latency = 0
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation')
      if (entries.length > 0) {
        const navEntry = entries[0] as PerformanceNavigationTiming
        latency = Math.round(navEntry.responseStart - navEntry.requestStart)
      }
    }

    // Render time
    let renderTime = 0
    if (typeof window !== 'undefined' && 'performance' in window) {
      const paintEntries = performance.getEntriesByType('paint')
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint')
      if (fcp) {
        renderTime = Math.round(fcp.startTime)
      }
    }

    const newMetrics = { fps, memory, latency, renderTime }
    setMetrics(newMetrics)

    // Keep last 20 measurements for history
    setHistory((prev) => [...prev.slice(-19), newMetrics])
  }, [])

  useEffect(() => {
    measurePerformance()
    const interval = setInterval(measurePerformance, 1000)
    return () => clearInterval(interval)
  }, [measurePerformance])

  const getStatus = (value: number, good: number, bad: number) => {
    if (value >= good) return 'good'
    if (value >= bad) return 'warning'
    return 'poor'
  }

  const getTrend = (metric: keyof PerformanceMetrics) => {
    if (history.length < 2) return 'stable'
    const recent = history.slice(-5).map((h) => h[metric])
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length
    const current = metrics[metric]

    if (current > avg * 1.1) return 'up'
    if (current < avg * 0.9) return 'down'
    return 'stable'
  }

  if (!showDetailed) {
    return (
      <div className={cn('flex items-center gap-3 text-sm', className)}>
        <div className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-green-500" />
          <span className="font-mono">{metrics.fps}</span>
          <span className="text-muted-foreground text-xs">fps</span>
        </div>
        {metrics.memory > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="font-mono">{metrics.memory}%</span>
            <span className="text-muted-foreground text-xs">mem</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('glass-card p-4 space-y-3', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-sm">Performance</h3>
      </div>

      {/* FPS */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Frames Per Second</span>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                'font-mono',
                getStatus(metrics.fps, 55, 30) === 'good' && 'text-green-500',
                getStatus(metrics.fps, 55, 30) === 'warning' && 'text-yellow-500',
                getStatus(metrics.fps, 55, 30) === 'poor' && 'text-red-500'
              )}
            >
              {metrics.fps} fps
            </span>
            {getTrend('fps') === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
            {getTrend('fps') === 'down' && <TrendingDown className="h-3 w-3 text-red-500" />}
            {getTrend('fps') === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
          </div>
        </div>
        <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all',
              getStatus(metrics.fps, 55, 30) === 'good' && 'bg-green-500',
              getStatus(metrics.fps, 55, 30) === 'warning' && 'bg-yellow-500',
              getStatus(metrics.fps, 55, 30) === 'poor' && 'bg-red-500'
            )}
            style={{ width: `${(metrics.fps / 60) * 100}%` }}
          />
        </div>
      </div>

      {/* Memory */}
      {metrics.memory > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Memory Usage</span>
            <div className="flex items-center gap-1">
              <span
                className={cn(
                  'font-mono',
                  getStatus(100 - metrics.memory, 70, 50) === 'good' && 'text-green-500',
                  getStatus(100 - metrics.memory, 70, 50) === 'warning' && 'text-yellow-500',
                  getStatus(100 - metrics.memory, 70, 50) === 'poor' && 'text-red-500'
                )}
              >
                {metrics.memory}%
              </span>
              {getTrend('memory') === 'up' && <TrendingUp className="h-3 w-3 text-red-500" />}
              {getTrend('memory') === 'down' && <TrendingDown className="h-3 w-3 text-green-500" />}
              {getTrend('memory') === 'stable' && <Minus className="h-3 w-3 text-gray-500" />}
            </div>
          </div>
          <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                getStatus(100 - metrics.memory, 70, 50) === 'good' && 'bg-green-500',
                getStatus(100 - metrics.memory, 70, 50) === 'warning' && 'bg-yellow-500',
                getStatus(100 - metrics.memory, 70, 50) === 'poor' && 'bg-red-500'
              )}
              style={{ width: `${metrics.memory}%` }}
            />
          </div>
        </div>
      )}

      {/* Latency */}
      {metrics.latency > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Network Latency</span>
            <span className="font-mono">{metrics.latency}ms</span>
          </div>
        </div>
      )}

      {/* Render Time */}
      {metrics.renderTime > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">First Paint</span>
            <span className="font-mono">{metrics.renderTime}ms</span>
          </div>
        </div>
      )}
    </div>
  )
}
