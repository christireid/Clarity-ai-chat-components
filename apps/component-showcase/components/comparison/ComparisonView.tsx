'use client'

import { useState, useEffect, useRef } from 'react'
import { SplitView } from './SplitView'
import { OverlayView } from './OverlayView'
import { DiffView } from './DiffView'
import { PerformanceMetrics } from './PerformanceMetrics'
import { PropsComparison } from './PropsComparison'

interface ComparisonViewProps {
  leftComponent: string
  rightComponent: string
  mode: 'side-by-side' | 'overlay' | 'diff'
  showPerformance: boolean
  showProps: boolean
}

export function ComparisonView({
  leftComponent,
  rightComponent,
  mode,
  showPerformance,
  showProps,
}: ComparisonViewProps) {
  const [leftMetrics, setLeftMetrics] = useState<PerformanceMetrics | null>(null)
  const [rightMetrics, setRightMetrics] = useState<PerformanceMetrics | null>(null)
  const viewRef = useRef<HTMLDivElement>(null)

  // Simulate performance measurement
  useEffect(() => {
    // In a real implementation, this would measure actual component performance
    const measurePerformance = () => {
      setLeftMetrics({
        renderTime: Math.random() * 50 + 10,
        memoryUsage: Math.random() * 5 + 2,
        bundleSize: Math.random() * 50 + 20,
        reRenders: Math.floor(Math.random() * 5) + 1,
      })
      setRightMetrics({
        renderTime: Math.random() * 50 + 10,
        memoryUsage: Math.random() * 5 + 2,
        bundleSize: Math.random() * 50 + 20,
        reRenders: Math.floor(Math.random() * 5) + 1,
      })
    }

    measurePerformance()
  }, [leftComponent, rightComponent])

  return (
    <div ref={viewRef} className="space-y-6">
      {/* Main Comparison View */}
      <div className="glass-card p-6">
        {mode === 'side-by-side' && (
          <SplitView leftComponent={leftComponent} rightComponent={rightComponent} />
        )}
        {mode === 'overlay' && (
          <OverlayView leftComponent={leftComponent} rightComponent={rightComponent} />
        )}
        {mode === 'diff' && (
          <DiffView leftComponent={leftComponent} rightComponent={rightComponent} />
        )}
      </div>

      {/* Performance Metrics */}
      {showPerformance && leftMetrics && rightMetrics && (
        <PerformanceMetrics
          leftComponent={leftComponent}
          rightComponent={rightComponent}
          leftMetrics={leftMetrics}
          rightMetrics={rightMetrics}
        />
      )}

      {/* Props Comparison */}
      {showProps && (
        <PropsComparison leftComponent={leftComponent} rightComponent={rightComponent} />
      )}
    </div>
  )
}

export interface PerformanceMetrics {
  renderTime: number // ms
  memoryUsage: number // MB
  bundleSize: number // KB
  reRenders: number
}
