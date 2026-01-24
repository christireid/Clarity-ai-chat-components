'use client'

import * as React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@clarity-chat/primitives'
import { Badge } from '@clarity-chat/primitives'
import { cn } from '@clarity-chat/primitives'
import {
  UnifiedPerformanceMonitor as PerformanceMonitor,
} from '@clarity-chat/utils'

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
 *
 * @deprecated This component needs refactoring for the new UnifiedPerformanceMonitor API
 */
export function PerformanceDashboard({
  className,
  autoRefresh = false,
  refreshInterval = 5000,
}: PerformanceDashboardProps) {
  const [metrics, setMetrics] = React.useState(() => PerformanceMonitor.getMetrics())

  React.useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      setMetrics(PerformanceMonitor.getMetrics())
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval])

  const formatTime = (ms: number) => `${ms.toFixed(2)}ms`

  return (
    <div className={cn('space-y-6', className)}>
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Total Operations
            </div>
            <div className="text-2xl font-bold">{metrics.operationCount}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Average Time
            </div>
            <div className="text-2xl font-bold">
              {formatTime(metrics.averageTime)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground">
              Total Time
            </div>
            <div className="text-2xl font-bold">
              {formatTime(metrics.totalTime)}
            </div>
          </div>
          <Badge variant="secondary">
            This dashboard needs refactoring for the new UnifiedPerformanceMonitor
            API
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}

PerformanceDashboard.displayName = 'PerformanceDashboard'
