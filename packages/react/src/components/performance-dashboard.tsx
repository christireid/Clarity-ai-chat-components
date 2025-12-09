/**
 * Performance Monitoring Dashboard
 *
 * Visual dashboard for performance metrics
 */

'use client'

import * as React from 'react'
import { useRenderPerformance } from '../hooks/use-performance'

// Stub hook for memory usage (not available in all browsers)
function useMemoryUsage() {
  return {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0,
  }
}

export interface PerformanceDashboardProps {
  /**
   * Show detailed metrics
   */
  detailed?: boolean

  /**
   * Update interval in ms
   */
  updateInterval?: number

  /**
   * Custom className
   */
  className?: string

  /**
   * Whether the dashboard is in a loading state
   */
  isLoading?: boolean

  /**
   * Error to display (renders error state when provided)
   */
  error?: Error | string | null
}

interface PerformanceMetric {
  name: string
  value: number | string
  unit?: string
  status?: 'good' | 'warning' | 'poor'
}

/**
 * Performance Dashboard Component
 *
 * Real-time performance monitoring UI
 *
 * @example
 * ```tsx
 * <PerformanceDashboard
 *   detailed
 *   updateInterval={1000}
 * />
 * ```
 */
export function PerformanceDashboard({
  detailed = false,
  updateInterval = 2000,
  className,
  isLoading = false,
  error = null,
}: PerformanceDashboardProps) {
  const performanceMetrics = useRenderPerformance('PerformanceDashboard')
  const memoryInfo = useMemoryUsage()
  const [metrics, setMetrics] = React.useState<PerformanceMetric[]>([])

  React.useEffect(() => {
    const updateMetrics = () => {
      const newMetrics: PerformanceMetric[] = []

      // Render performance
      newMetrics.push({
        name: 'Render Count',
        value: performanceMetrics.renderCount,
        status: 'good',
      })

      newMetrics.push({
        name: 'Last Render',
        value: performanceMetrics.lastRenderTime.toFixed(2),
        unit: 'ms',
        status: performanceMetrics.lastRenderTime > 16 ? 'warning' : 'good',
      })

      newMetrics.push({
        name: 'Average Render',
        value: performanceMetrics.averageRenderTime.toFixed(2),
        unit: 'ms',
        status: performanceMetrics.averageRenderTime > 16 ? 'warning' : 'good',
      })

      // Memory usage
      if (memoryInfo) {
        newMetrics.push({
          name: 'Memory Used',
          value: formatBytes(memoryInfo.usedJSHeapSize),
          status:
            memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8
              ? 'warning'
              : 'good',
        })

        if (detailed) {
          newMetrics.push({
            name: 'Total Memory',
            value: formatBytes(memoryInfo.totalJSHeapSize),
            status: 'good',
          })

          newMetrics.push({
            name: 'Memory Limit',
            value: formatBytes(memoryInfo.jsHeapSizeLimit),
            status: 'good',
          })
        }
      }

      // Page load metrics (if available) - use modern Navigation Timing API
      if (detailed && typeof performance !== 'undefined') {
        let loadTime = -1

        // Modern API: Performance Navigation Timing Level 2
        const navigationEntries = performance.getEntriesByType(
          'navigation'
        ) as PerformanceNavigationTiming[]
        if (navigationEntries.length > 0) {
          const navEntry = navigationEntries[0]
          loadTime = navEntry.loadEventEnd - navEntry.startTime
        }
        // Fallback: deprecated timing API (for older browsers)
        else if (performance.timing) {
          const timing = performance.timing
          loadTime = timing.loadEventEnd - timing.navigationStart
        }

        if (loadTime >= 0) {
          newMetrics.push({
            name: 'Page Load',
            value: loadTime > 0 ? (loadTime / 1000).toFixed(2) : 'N/A',
            unit: 's',
            status: loadTime > 3000 ? 'warning' : 'good',
          })
        }
      }

      setMetrics(newMetrics)
    }

    updateMetrics()
    const interval = setInterval(updateMetrics, updateInterval)

    return () => clearInterval(interval)
  }, [performanceMetrics, memoryInfo, detailed, updateInterval])

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`}
        role="status"
        aria-label="Loading Performance Dashboard"
        aria-busy="true"
      >
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 w-16 bg-muted/60 rounded" />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-3 rounded-lg border border-border/50 bg-muted/30"
              >
                <div className="h-4 w-20 bg-muted rounded mb-2" />
                <div className="h-8 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading performance metrics...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return (
      <div
        className={`performance-dashboard p-4 rounded-lg border border-destructive/30 bg-card ${className || ''}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-5 w-5 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Failed to load performance metrics
            </p>
            <p className="text-xs text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`}
      role="region"
      aria-label="Performance Metrics Dashboard"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Performance Metrics
        </h3>
        <div
          className="flex gap-2 text-xs text-muted-foreground"
          role="legend"
          aria-label="Status indicator legend"
        >
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-[hsl(var(--success))]"
              aria-hidden="true"
            ></span>
            Good
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-[hsl(var(--warning))]"
              aria-hidden="true"
            ></span>
            Warning
          </span>
          <span className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full bg-destructive"
              aria-hidden="true"
            ></span>
            Poor
          </span>
        </div>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-4"
        role="list"
        aria-label="Performance metrics list"
      >
        {metrics.map((metric) => (
          <div
            key={metric.name}
            className="p-3 rounded-lg border border-border/50 bg-muted/30 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] transition-all duration-150 ease-out"
            role="listitem"
            aria-label={`${metric.name}: ${metric.value}${metric.unit || ''}, status ${metric.status}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">
                {metric.name}
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  metric.status === 'good'
                    ? 'bg-[hsl(var(--success))]'
                    : metric.status === 'warning'
                      ? 'bg-[hsl(var(--warning))]'
                      : 'bg-destructive'
                }`}
                role="img"
                aria-label={`Status: ${metric.status}`}
              />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {metric.value}
              {metric.unit && (
                <span className="text-sm ml-1 text-muted-foreground">
                  {metric.unit}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {detailed && (
        <div className="mt-4 p-3 rounded-md bg-muted text-xs">
          <p className="text-muted-foreground">
            💡 Tip: Keep render times below 16ms for 60fps. Monitor memory usage
            to prevent leaks.
          </p>
        </div>
      )}
    </div>
  )
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

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
    if (performanceMetrics.lastRenderTime > 50) return 'poor'
    if (performanceMetrics.lastRenderTime > 16) return 'warning'
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
  }, [performanceMetrics.lastRenderTime, memoryInfo])

  return (
    <div
      className={`performance-badge inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] transition-all duration-150 ease-out hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] ${
        status === 'good'
          ? 'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20'
          : status === 'warning'
            ? 'bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))] border-[hsl(var(--warning))]/20'
            : 'bg-destructive/10 text-destructive border-destructive/20'
      } ${className || ''}`}
      title={`Last render: ${performanceMetrics.lastRenderTime.toFixed(2)}ms`}
      role="status"
      aria-label={`Performance status: ${status}, last render ${performanceMetrics.lastRenderTime.toFixed(1)} milliseconds`}
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
      {performanceMetrics.lastRenderTime.toFixed(1)}ms
    </div>
  )
}

PerformanceBadge.displayName = 'PerformanceBadge'
