'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { formatBytes } from '../../internal/helpers'
import { DURATION_SECONDS, ANIMATION_PRESETS } from '../../animations/constants'
import { useReducedMotion } from '@clarity-chat/primitives'
import {
  getMotionSafeDuration,
  getMotionSafeValue,
} from '../../animations/motion-safe'

/**
 * Web Vitals metric
 */
export interface WebVital {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB' | 'INP'
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
}

/**
 * Component performance metric
 */
export interface ComponentMetric {
  name: string
  renderCount: number
  averageRenderTime: number
  maxRenderTime: number
  minRenderTime: number
  lastRenderTime: number
  memoryUsage?: number
}

/**
 * Network performance metric
 */
export interface NetworkMetric {
  url: string
  method: string
  duration: number
  size: number
  status: number
  timestamp: number
}

/**
 * Performance analytics data
 */
export interface PerformanceAnalytics {
  webVitals: WebVital[]
  componentMetrics: ComponentMetric[]
  networkMetrics: NetworkMetric[]
  memoryUsage?: {
    used: number
    total: number
    limit: number
  }
  fps?: number
  timestamp: number
}

/**
 * Props for PerformanceAnalyticsDashboard
 */
export interface PerformanceAnalyticsDashboardProps {
  /** Performance data to display */
  data?: PerformanceAnalytics
  /** Update interval in milliseconds */
  updateInterval?: number
  /** Show Web Vitals section */
  showWebVitals?: boolean
  /** Show component metrics section */
  showComponentMetrics?: boolean
  /** Show network metrics section */
  showNetworkMetrics?: boolean
  /** Show memory usage section */
  showMemoryUsage?: boolean
  /** Show FPS counter */
  showFPS?: boolean
  /** Callback when performance data updates */
  onDataUpdate?: (data: PerformanceAnalytics) => void
  /** Compact mode */
  compact?: boolean
  className?: string
}

/**
 * Hook to collect performance metrics
 */
function usePerformanceMetrics(updateInterval: number = 1000) {
  const [metrics, setMetrics] = React.useState<PerformanceAnalytics>({
    webVitals: [],
    componentMetrics: [],
    networkMetrics: [],
    timestamp: Date.now(),
  })

  // Collect Web Vitals
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if web-vitals is available
    const collectWebVitals = async () => {
      try {
        // Use Performance Observer API for basic metrics
        if ('PerformanceObserver' in window) {
          // Largest Contentful Paint (LCP)
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            const lastEntry = entries[
              entries.length - 1
            ] as PerformanceEntry & {
              renderTime: number
              loadTime: number
            }
            if (lastEntry) {
              const value = lastEntry.renderTime || lastEntry.loadTime
              setMetrics((prev) => ({
                ...prev,
                webVitals: [
                  ...prev.webVitals.filter((v) => v.name !== 'LCP'),
                  {
                    name: 'LCP',
                    value,
                    rating:
                      value < 2500
                        ? 'good'
                        : value < 4000
                          ? 'needs-improvement'
                          : 'poor',
                    delta: 0,
                  },
                ],
              }))
            }
          })

          try {
            lcpObserver.observe({
              type: 'largest-contentful-paint',
              buffered: true,
            })
          } catch {
            // LCP not supported
          }

          // First Input Delay (FID) / Interaction to Next Paint (INP)
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach(
              (entry: PerformanceEntry & { processingStart?: number }) => {
                if (entry.processingStart) {
                  const value = entry.processingStart - entry.startTime
                  setMetrics((prev) => ({
                    ...prev,
                    webVitals: [
                      ...prev.webVitals.filter((v) => v.name !== 'FID'),
                      {
                        name: 'FID',
                        value,
                        rating:
                          value < 100
                            ? 'good'
                            : value < 300
                              ? 'needs-improvement'
                              : 'poor',
                        delta: 0,
                      },
                    ],
                  }))
                }
              }
            )
          })

          try {
            fidObserver.observe({ type: 'first-input', buffered: true })
          } catch {
            // FID not supported
          }

          // First Contentful Paint (FCP)
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries()
            entries.forEach((entry) => {
              setMetrics((prev) => ({
                ...prev,
                webVitals: [
                  ...prev.webVitals.filter((v) => v.name !== 'FCP'),
                  {
                    name: 'FCP',
                    value: entry.startTime,
                    rating:
                      entry.startTime < 1800
                        ? 'good'
                        : entry.startTime < 3000
                          ? 'needs-improvement'
                          : 'poor',
                    delta: 0,
                  },
                ],
              }))
            })
          })

          try {
            fcpObserver.observe({ type: 'paint', buffered: true })
          } catch {
            // FCP not supported
          }

          return () => {
            lcpObserver.disconnect()
            fidObserver.disconnect()
            fcpObserver.disconnect()
          }
        }
        return undefined
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to collect Web Vitals:', error)
        }
        return undefined
      }
    }

    collectWebVitals()
  }, [])

  // Collect memory usage
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const interval = setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        setMetrics((prev) => ({
          ...prev,
          memoryUsage: {
            used: memory.usedJSHeapSize,
            total: memory.totalJSHeapSize,
            limit: memory.jsHeapSizeLimit,
          },
          timestamp: Date.now(),
        }))
      }
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  // Collect FPS
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    let frameCount = 0
    let lastTime = performance.now()
    let animationFrameId: number

    const measureFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime))
        setMetrics((prev) => ({ ...prev, fps }))

        frameCount = 0
        lastTime = currentTime
      }

      animationFrameId = requestAnimationFrame(measureFPS)
    }

    animationFrameId = requestAnimationFrame(measureFPS)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  return metrics
}

/**
 * PerformanceAnalyticsDashboard Component
 *
 * Displays comprehensive performance analytics including:
 * - Web Vitals (LCP, FID, CLS, etc.)
 * - Component render metrics
 * - Network performance
 * - Memory usage
 * - FPS counter
 *
 * @example
 * ```tsx
 * <PerformanceAnalyticsDashboard
 *   updateInterval={1000}
 *   showWebVitals
 *   showComponentMetrics
 *   showMemoryUsage
 *   showFPS
 *   onDataUpdate={(data) => {
 *     console.debug('Performance:', data)
 *   }}
 * />
 * ```
 */
export function PerformanceAnalyticsDashboard({
  data: externalData,
  updateInterval = 1000,
  showWebVitals = true,
  showComponentMetrics = true,
  showNetworkMetrics = false,
  showMemoryUsage = true,
  showFPS = true,
  onDataUpdate,
  compact = false,
  className,
}: PerformanceAnalyticsDashboardProps) {
  const collectedMetrics = usePerformanceMetrics(updateInterval)
  const data = externalData || collectedMetrics
  const prefersReducedMotion = useReducedMotion()

  React.useEffect(() => {
    onDataUpdate?.(data)
  }, [data, onDataUpdate])

  /**
   * Get rating color
   */
  const getRatingColor = (
    rating: 'good' | 'needs-improvement' | 'poor'
  ): string => {
    switch (rating) {
      case 'good':
        return 'text-green-500'
      case 'needs-improvement':
        return 'text-yellow-500'
      case 'poor':
        return 'text-red-500'
    }
  }

  /**
   * Get rating badge variant
   */
  const getRatingVariant = (
    rating: 'good' | 'needs-improvement' | 'poor'
  ): 'success' | 'warning' | 'destructive' => {
    switch (rating) {
      case 'good':
        return 'success'
      case 'needs-improvement':
        return 'warning'
      case 'poor':
        return 'destructive'
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader className="">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <CardTitle className="text-base">
                  Performance Analytics
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time performance monitoring
                </CardDescription>
              </div>
            </div>
            {showFPS && data.fps !== undefined && (
              <Badge
                variant={
                  data.fps >= 50
                    ? 'success'
                    : data.fps >= 30
                      ? 'warning'
                      : 'destructive'
                }
              >
                {data.fps} FPS
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Web Vitals */}
      {showWebVitals && data.webVitals.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-sm">Core Web Vitals</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div
              className={cn(
                'grid gap-4',
                compact ? 'grid-cols-2' : 'grid-cols-3'
              )}
            >
              {data.webVitals.map((vital) => (
                <motion.div
                  key={vital.name}
                  className="flex flex-col items-center rounded-lg border p-4"
                  {...(prefersReducedMotion
                    ? ANIMATION_PRESETS.fadeIn
                    : ANIMATION_PRESETS.slideUp)}
                  transition={{
                    duration: getMotionSafeDuration(
                      prefersReducedMotion,
                      DURATION_SECONDS.normal
                    ),
                  }}
                >
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    {vital.name}
                  </div>
                  <div
                    className={cn(
                      'text-2xl font-bold mb-2',
                      getRatingColor(vital.rating)
                    )}
                  >
                    {vital.name === 'CLS'
                      ? vital.value.toFixed(3)
                      : `${Math.round(vital.value)}ms`}
                  </div>
                  <Badge
                    variant={getRatingVariant(vital.rating)}
                    className="text-xs"
                  >
                    {vital.rating}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Component Metrics */}
      {showComponentMetrics && data.componentMetrics.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-sm">Component Performance</CardTitle>
            <CardDescription className="text-xs">
              {data.componentMetrics.length} components tracked
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-2">
              {data.componentMetrics.slice(0, compact ? 3 : 5).map((metric) => (
                <div
                  key={metric.name}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium">{metric.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {metric.renderCount} renders • avg{' '}
                      {metric.averageRenderTime.toFixed(2)}ms
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        metric.averageRenderTime < 16
                          ? 'success'
                          : metric.averageRenderTime < 50
                            ? 'warning'
                            : 'destructive'
                      }
                      className="text-xs"
                    >
                      {metric.lastRenderTime.toFixed(1)}ms
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Usage */}
      {showMemoryUsage && data.memoryUsage && (
        <Card className="shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-sm">Memory Usage</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Used</span>
                <span className="text-sm font-medium">
                  {formatBytes(data.memoryUsage.used)}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{
                    width: prefersReducedMotion
                      ? `${(data.memoryUsage.used / data.memoryUsage.limit) * 100}%`
                      : 0,
                  }}
                  animate={{
                    width: `${(data.memoryUsage.used / data.memoryUsage.limit) * 100}%`,
                  }}
                  transition={{
                    duration: getMotionSafeDuration(
                      prefersReducedMotion,
                      DURATION_SECONDS.slow
                    ),
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Total: {formatBytes(data.memoryUsage.total)}</span>
                <span>Limit: {formatBytes(data.memoryUsage.limit)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Network Metrics */}
      {showNetworkMetrics && data.networkMetrics.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="">
            <CardTitle className="text-sm">Network Performance</CardTitle>
            <CardDescription className="text-xs">
              {data.networkMetrics.length} requests tracked
            </CardDescription>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-2">
              {data.networkMetrics
                .slice(0, compact ? 3 : 5)
                .map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {metric.url}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.method} • {formatBytes(metric.size)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          metric.status >= 200 && metric.status < 300
                            ? 'success'
                            : 'destructive'
                        }
                        className="text-xs"
                      >
                        {metric.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {metric.duration.toFixed(0)}ms
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

PerformanceAnalyticsDashboard.displayName = 'PerformanceAnalyticsDashboard'
