/**
 * Performance Monitoring Dashboard
 * 
 * Visual dashboard for performance metrics
 */

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
          status: memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8 ? 'warning' : 'good',
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
      
      // Page load metrics (if available)
      if (performance.timing && detailed) {
        const timing = performance.timing
        const loadTime = timing.loadEventEnd - timing.navigationStart
        
        newMetrics.push({
          name: 'Page Load',
          value: loadTime > 0 ? (loadTime / 1000).toFixed(2) : 'N/A',
          unit: 's',
          status: loadTime > 3000 ? 'warning' : 'good',
        })
      }
      
      setMetrics(newMetrics)
    }
    
    updateMetrics()
    const interval = setInterval(updateMetrics, updateInterval)
    
    return () => clearInterval(interval)
  }, [performanceMetrics, memoryInfo, detailed, updateInterval])
  
  return (
    <div className={`performance-dashboard p-4 rounded-lg border border-border bg-card ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Performance Metrics</h3>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--success))]"></span>
            Good
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--warning))]"></span>
            Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive"></span>
            Poor
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map(metric => (
          <div
            key={metric.name}
            className="p-3 rounded-lg border border-border/50 bg-muted/30 hover:shadow-[0_4px_6px_-1px_rgb(0_0_0_/_0.1),0_2px_4px_-2px_rgb(0_0_0_/_0.1)] transition-all duration-150 ease-out"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{metric.name}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  metric.status === 'good'
                    ? 'bg-[hsl(var(--success))]'
                    : metric.status === 'warning'
                    ? 'bg-[hsl(var(--warning))]'
                    : 'bg-destructive'
                }`}
              />
            </div>
            <div className="text-2xl font-bold text-foreground">
              {metric.value}
              {metric.unit && <span className="text-sm ml-1 text-muted-foreground">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>
      
      {detailed && (
        <div className="mt-4 p-3 rounded-md bg-muted text-xs">
          <p className="text-muted-foreground">
            💡 Tip: Keep render times below 16ms for 60fps. Monitor memory usage to prevent leaks.
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
export function PerformanceBadge({ className }: { className?: string }) {
  const performanceMetrics = useRenderPerformance('PerformanceBadge')
  const memoryInfo = useMemoryUsage()
  
  const status = React.useMemo(() => {
    if (performanceMetrics.lastRenderTime > 50) return 'poor'
    if (performanceMetrics.lastRenderTime > 16) return 'warning'
    if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.9) return 'poor'
    if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.7) return 'warning'
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
    >
      <span
        className={`w-2 h-2 rounded-full ${
          status === 'good' ? 'bg-[hsl(var(--success))]' : status === 'warning' ? 'bg-[hsl(var(--warning))]' : 'bg-destructive'
        }`}
      />
      {performanceMetrics.lastRenderTime.toFixed(1)}ms
    </div>
  )
}
