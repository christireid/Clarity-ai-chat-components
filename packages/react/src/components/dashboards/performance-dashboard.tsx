'use client'

import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { cn } from '../../utils/cn'
import {
  getPerformanceSummary,
  type PerformanceMetrics,
  measureExecutionTime,
} from '../../utils/performance-monitoring'
import { useRenderPerformance } from '../../utils/analytics'

/**
 * Hook to get browser memory info (Chrome only)
 */
function useMemoryUsage() {
  const [memoryInfo, setMemoryInfo] = React.useState<{
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  } | null>(null)

  React.useEffect(() => {
    // @ts-expect-error - memory is Chrome-only
    if (typeof performance === 'undefined' || !performance.memory) {
      return
    }
    const updateMemory = () => {
      // @ts-expect-error - memory is Chrome-only
      const memory = performance.memory
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      })
    }
    updateMemory()
    const interval = setInterval(updateMemory, 1000)
    return () => clearInterval(interval)
  }, [])

  return memoryInfo
}

interface PerformanceDashboardProps {
  className?: string
  autoRefresh?: boolean
  refreshInterval?: number
}

/**
 * Performance Dashboard Component
 *
 * Displays real-time performance metrics for content components.
 * Shows render times, memory usage, and performance insights.
 */
export function PerformanceDashboard({
  className,
  autoRefresh = true,
  refreshInterval = 5000,
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics[]>([])
  const [summary, setSummary] = React.useState(() => getPerformanceSummary())

  // Load metrics from localStorage
  const loadMetrics = React.useCallback(() => {
    try {
      const stored = localStorage.getItem('clarity-performance-metrics')
      if (stored) {
        const parsedMetrics: PerformanceMetrics[] = JSON.parse(stored)
        setMetrics(parsedMetrics.slice(-50)) // Show last 50 metrics
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error)
    }
  }, [])

  // Update summary
  const updateSummary = React.useCallback(() => {
    setSummary(getPerformanceSummary())
  }, [])

  // Load and update data
  const refreshData = React.useCallback(() => {
    loadMetrics()
    updateSummary()
  }, [loadMetrics, updateSummary])

  // Auto-refresh
  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(refreshData, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, refreshData])

  // Initial load
  React.useEffect(() => {
    refreshData()
  }, [refreshData])

  // Clear metrics
  const clearMetrics = React.useCallback(() => {
    try {
      localStorage.removeItem('clarity-performance-metrics')
      setMetrics([])
      setSummary(getPerformanceSummary())
    } catch (error) {
      console.warn('Failed to clear performance metrics:', error)
    }
  }, [])

  const formatTime = (ms: number) => `${ms.toFixed(2)}ms`
  const formatMemory = (bytes: number) =>
    `${(bytes / (1024 * 1024)).toFixed(2)}MB`

  const getPerformanceColor = (renderTime: number) => {
    if (renderTime > 16) return 'destructive' // > 60fps
    if (renderTime > 8) return 'warning' // > 120fps
    return 'success' // >= 120fps
  }

  const getMemoryColor = (delta: number) => {
    if (delta > 1024 * 1024) return 'destructive' // > 1MB
    if (delta > 512 * 1024) return 'warning' // > 512KB
    return 'success'
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Render Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(summary.averageRenderTime)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {summary.totalComponents} components
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Slowest Component
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold truncate">
              {summary.slowestComponent || 'None tracked'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Highest render time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.memoryUsage ? formatMemory(summary.memoryUsage) : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Current heap usage
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Metrics */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Performance Metrics</CardTitle>
          <div className="flex gap-2">
            <button
              onClick={refreshData}
              className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={clearMetrics}
              className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors"
            >
              Clear
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {metrics.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No performance metrics collected yet.
              <br />
              Enable performance tracking in development mode.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {metrics
                .slice()
                .reverse()
                .map((metric, index) => (
                  <div
                    key={`${metric.timestamp}-${index}`}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant={getPerformanceColor(metric.renderTime)}>
                        {formatTime(metric.renderTime)}
                      </Badge>
                      <span className="font-medium text-sm">
                        {metric.component}
                      </span>
                      {metric.metadata && (
                        <span className="text-xs text-muted-foreground">
                          {Object.entries(metric.metadata)
                            .slice(0, 2)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {metric.memoryDelta !== undefined && (
                        <Badge
                          variant={getMemoryColor(Math.abs(metric.memoryDelta))}
                          className="text-xs"
                        >
                          {metric.memoryDelta > 0 ? '+' : ''}
                          {(metric.memoryDelta / 1024).toFixed(0)}KB
                        </Badge>
                      )}
                      <span>
                        {new Date(metric.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {summary.averageRenderTime > 16 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-semibold text-destructive mb-2">
                ⚠️ Slow Render Performance
              </h4>
              <p className="text-sm text-destructive/80">
                Average render time ({formatTime(summary.averageRenderTime)})
                exceeds 60fps threshold. Consider optimizing component
                re-renders or implementing virtualization for large lists.
              </p>
            </div>
          )}

          {summary.memoryUsage && summary.memoryUsage > 50 * 1024 * 1024 && (
            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <h4 className="font-semibold text-warning mb-2">
                ⚠️ High Memory Usage
              </h4>
              <p className="text-sm text-warning/80">
                Current memory usage ({formatMemory(summary.memoryUsage)}) is
                high. Consider implementing lazy loading or code splitting for
                heavy components.
              </p>
            </div>
          )}

          {summary.totalComponents > 0 && summary.averageRenderTime <= 8 && (
            <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
              <h4 className="font-semibold text-success mb-2">
                ✅ Excellent Performance
              </h4>
              <p className="text-sm text-success/80">
                All tracked components are rendering efficiently with average
                times under 8ms. Performance optimizations are working well!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Performance Badge - shows current render performance status
 */
function formatBytes(bytes: number): string {
  if (bytes <= 0 || !Number.isFinite(bytes)) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  )

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * Compact Performance Badge
 *
 * Small performance indicator for corners
 */
PerformanceDashboard.displayName = 'PerformanceDashboard'

export function PerformanceBadge({ className }: { className?: string }) {
  const performanceMetrics = useRenderPerformance('PerformanceBadge')
  const memoryInfo = useMemoryUsage()

  const status = React.useMemo(() => {
    if (performanceMetrics.lastRenderDuration > 50) return 'poor'
    if (performanceMetrics.lastRenderDuration > 16) return 'warning'
    if (
      memoryInfo &&
      memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9
    )
      return 'poor'
    if (
      memoryInfo &&
      memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.7
    )
      return 'warning'
    return 'good'
  }, [performanceMetrics.lastRenderDuration, memoryInfo])

  return (
    <div
      className={`performance-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border/50 shadow-xs transition-all duration-150 ease-out hover:shadow-md ${
        status === 'good'
          ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20'
          : status === 'warning'
            ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20'
            : 'bg-destructive/10 text-destructive border-destructive/20'
      } ${className || ''}`}
      title={`Last render: ${performanceMetrics.lastRenderDuration.toFixed(2)}ms`}
      role="status"
      aria-label={`Performance status: ${status}, last render ${performanceMetrics.lastRenderDuration.toFixed(1)} milliseconds`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'good'
            ? 'bg-[hsl(var(--success))]'
            : status === 'warning'
              ? 'bg-[hsl(var(--warning))]'
              : 'bg-destructive'
        }`}
        aria-hidden="true"
      />
      {performanceMetrics.lastRenderDuration.toFixed(1)}ms
    </div>
  )
}

PerformanceBadge.displayName = 'PerformanceBadge'
