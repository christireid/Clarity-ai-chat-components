/**
 * Performance Monitoring Integration
 */

import * as React from 'react'
import { UnifiedPerformanceMonitor as PerformanceMonitor } from '@clarity-chat/utils'
import type { PerformanceSkeletonProps } from '../types'

export const PerformanceSkeleton: React.FC<PerformanceSkeletonProps> = ({
  children,
  performanceId,
  onPerformanceReport,
  enableDetailedMetrics = false,
}) => {
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    // Start observer-based monitoring
    PerformanceMonitor.startObserver(performanceId, ['measure', 'navigation'])

    return () => {
      const metrics = PerformanceMonitor.stopObserver(performanceId)

      if (enableDetailedMetrics) {
        console.log(`Performance metrics for ${performanceId}:`, {
          metrics,
          summary: {
            totalEntries: metrics.length,
            averageDuration:
              metrics.reduce((sum, entry) => sum + entry.duration, 0) /
              (metrics.length || 1),
            totalDuration: metrics.reduce(
              (sum, entry) => sum + entry.duration,
              0
            ),
          },
        })
      }

      if (onPerformanceReport) {
        onPerformanceReport(metrics)
      }
    }
  }, [performanceId, onPerformanceReport, enableDetailedMetrics])

  return <>{children}</>
}
