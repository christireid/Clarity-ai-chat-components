/**
 * React hook for Component Performance Monitor
 *
 * Tracks component renders and performance metrics
 */

'use client'

import * as React from 'react'
import {
  getComponentMonitor,
  createComponentMonitor,
  type ComponentMonitor,
  type ComponentMetrics,
  type PerformanceThresholds,
} from '../../debug/component-monitor'

export interface UseComponentMonitorOptions {
  componentName?: string
  enabled?: boolean
  trackProps?: boolean
  trackState?: boolean
  thresholds?: Partial<PerformanceThresholds>
}

export interface UseComponentMonitorReturn {
  metrics: ComponentMetrics | null
  renderCount: number
  avgRenderTime: number
  warnings: string[]
  onRender: () => void
  getReport: () => void
}

/**
 * Hook to monitor component performance
 */
export function useComponentMonitor(
  options: UseComponentMonitorOptions = {}
): UseComponentMonitorReturn {
  const {
    componentName = 'Unknown',
    enabled = process.env.NODE_ENV === 'development',
    trackProps = true,
    trackState = true,
    thresholds,
  } = options

  const monitor = React.useMemo(() => {
    if (thresholds) {
      const m = createComponentMonitor({ enabled, thresholds })
      return m
    }
    return getComponentMonitor()
  }, [enabled, thresholds])

  const instanceIdRef = React.useRef<string>('')
  const renderStartRef = React.useRef<number>(0)
  const prevPropsRef = React.useRef<Record<string, unknown>>({})
  const renderCountRef = React.useRef<number>(0)

  const [metrics, setMetrics] = React.useState<ComponentMetrics | null>(null)

  // Generate instance ID on mount
  React.useEffect(() => {
    if (!enabled) return

    instanceIdRef.current = `${componentName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    monitor.onMount(componentName, instanceIdRef.current)

    // Subscribe to metrics updates
    const unsubscribe = monitor.addListener((updatedMetrics) => {
      if (updatedMetrics.instanceId === instanceIdRef.current) {
        setMetrics({ ...updatedMetrics })
      }
    })

    return () => {
      unsubscribe()
      if (instanceIdRef.current) {
        monitor.onUnmount(instanceIdRef.current)
      }
    }
  }, [componentName, enabled, monitor])

  // Track render start
  renderStartRef.current = performance.now()

  // Record render on effect
  React.useEffect(() => {
    if (!enabled || !instanceIdRef.current) return

    const duration = performance.now() - renderStartRef.current
    renderCountRef.current++

    monitor.onRender(instanceIdRef.current, duration, {
      phase: renderCountRef.current === 1 ? 'mount' : 'update',
    })
  })

  const onRender = React.useCallback(() => {
    if (!enabled || !instanceIdRef.current) return

    const duration = performance.now() - renderStartRef.current
    monitor.onRender(instanceIdRef.current, duration, {
      phase: 'update',
    })
  }, [enabled, monitor])

  const getReport = React.useCallback(() => {
    monitor.printReport()
  }, [monitor])

  return {
    metrics,
    renderCount: metrics?.renderCount ?? 0,
    avgRenderTime: metrics?.avgRenderTime ?? 0,
    warnings: metrics?.warnings ?? [],
    onRender,
    getReport,
  }
}

/**
 * Higher-order component for automatic performance monitoring
 */
export function withComponentMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: UseComponentMonitorOptions
): React.ComponentType<P> {
  const displayName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Unknown'

  function MonitoredComponent(props: P) {
    useComponentMonitor({
      componentName: displayName,
      ...options,
    })

    return <WrappedComponent {...props} />
  }

  MonitoredComponent.displayName = `withComponentMonitor(${displayName})`

  return MonitoredComponent
}

export default useComponentMonitor
