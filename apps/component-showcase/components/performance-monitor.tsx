'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Activity,
  Cpu,
  MemoryStick,
  Network,
  Zap,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  Package,
  Clock,
  BarChart3,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'

// Types
interface RenderMetrics {
  componentName: string
  renderTime: number
  renderCount: number
  timestamp: number
  phase: 'mount' | 'update'
}

interface PerformanceMetrics {
  fps: number
  memory: {
    used: number
    limit: number
    percentage: number
  }
  renderCount: number
  averageRenderTime: number
  networkRequests: number
  bundleSize: number
}

interface PerformanceWarning {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  timestamp: number
}

// Performance Monitor Context
interface PerformanceMonitorContextValue {
  metrics: PerformanceMetrics
  warnings: PerformanceWarning[]
  isMonitoring: boolean
  startMonitoring: () => void
  stopMonitoring: () => void
  recordRender: (metrics: RenderMetrics) => void
}

const PerformanceMonitorContext =
  React.createContext<PerformanceMonitorContextValue | null>(null)

export function usePerformanceMonitor() {
  const context = React.useContext(PerformanceMonitorContext)
  if (!context) {
    throw new Error(
      'usePerformanceMonitor must be used within PerformanceMonitorProvider'
    )
  }
  return context
}

// Performance Monitor Provider
export function PerformanceMonitorProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: { used: 0, limit: 0, percentage: 0 },
    renderCount: 0,
    averageRenderTime: 0,
    networkRequests: 0,
    bundleSize: 0,
  })
  const [warnings, setWarnings] = useState<PerformanceWarning[]>([])
  const renderMetricsRef = useRef<RenderMetrics[]>([])
  const fpsCounterRef = useRef<number[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  const addWarning = useCallback(
    (type: PerformanceWarning['type'], message: string) => {
      const warning: PerformanceWarning = {
        id: `${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp: Date.now(),
      }
      setWarnings((prev) => [...prev.slice(-9), warning])
    },
    []
  )

  // FPS Counter
  useEffect(() => {
    if (!isMonitoring) return

    let lastTime = performance.now()
    let frames = 0

    const measureFPS = () => {
      frames++
      const currentTime = performance.now()
      const delta = currentTime - lastTime

      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta)
        fpsCounterRef.current.push(fps)

        if (fpsCounterRef.current.length > 60) {
          fpsCounterRef.current.shift()
        }

        const avgFps =
          fpsCounterRef.current.reduce((a, b) => a + b, 0) /
          fpsCounterRef.current.length

        setMetrics((prev) => ({ ...prev, fps: Math.round(avgFps) }))

        if (avgFps < 30) {
          addWarning('error', `Low FPS detected: ${Math.round(avgFps)} FPS`)
        } else if (avgFps < 50) {
          addWarning('warning', `FPS dropping: ${Math.round(avgFps)} FPS`)
        }

        frames = 0
        lastTime = currentTime
      }

      animationFrameRef.current = requestAnimationFrame(measureFPS)
    }

    animationFrameRef.current = requestAnimationFrame(measureFPS)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isMonitoring, addWarning])

  // Memory Usage
  useEffect(() => {
    if (!isMonitoring) return

    const measureMemory = () => {
      if ('memory' in performance) {
        const mem = (performance as any).memory
        const used = mem.usedJSHeapSize / 1024 / 1024
        const limit = mem.jsHeapSizeLimit / 1024 / 1024
        const percentage = (used / limit) * 100

        setMetrics((prev) => ({
          ...prev,
          memory: { used, limit, percentage },
        }))

        if (percentage > 90) {
          addWarning('error', `Critical memory usage: ${percentage.toFixed(1)}%`)
        } else if (percentage > 75) {
          addWarning('warning', `High memory usage: ${percentage.toFixed(1)}%`)
        }
      }
    }

    const interval = setInterval(measureMemory, 1000)
    return () => clearInterval(interval)
  }, [isMonitoring, addWarning])

  // Network Monitor
  useEffect(() => {
    if (!isMonitoring) return

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      setMetrics((prev) => ({
        ...prev,
        networkRequests: prev.networkRequests + entries.length,
      }))

      entries.forEach((entry) => {
        if (entry.duration > 1000) {
          addWarning(
            'warning',
            `Slow request: ${entry.name} (${entry.duration.toFixed(0)}ms)`
          )
        }
      })
    })

    observer.observe({ entryTypes: ['resource'] })

    return () => observer.disconnect()
  }, [isMonitoring, addWarning])

  const recordRender = useCallback(
    (renderMetrics: RenderMetrics) => {
      if (!isMonitoring) return

      renderMetricsRef.current.push(renderMetrics)

      if (renderMetricsRef.current.length > 100) {
        renderMetricsRef.current.shift()
      }

      const avgRenderTime =
        renderMetricsRef.current.reduce((sum, m) => sum + m.renderTime, 0) /
        renderMetricsRef.current.length

      setMetrics((prev) => ({
        ...prev,
        renderCount: prev.renderCount + 1,
        averageRenderTime: avgRenderTime,
      }))

      if (renderMetrics.renderTime > 16) {
        addWarning(
          'warning',
          `Slow render: ${renderMetrics.componentName} (${renderMetrics.renderTime.toFixed(1)}ms)`
        )
      }
    },
    [addWarning, isMonitoring]
  )

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
    setMetrics({
      fps: 60,
      memory: { used: 0, limit: 0, percentage: 0 },
      renderCount: 0,
      averageRenderTime: 0,
      networkRequests: 0,
      bundleSize: 0,
    })
    setWarnings([])
    renderMetricsRef.current = []
    fpsCounterRef.current = []
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  return (
    <PerformanceMonitorContext.Provider
      value={{
        metrics,
        warnings,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
        recordRender,
      }}
    >
      {children}
    </PerformanceMonitorContext.Provider>
  )
}

// Performance Profiler HOC
export function withPerformanceProfiler<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const { recordRender } = usePerformanceMonitor()

    const onRenderCallback = useCallback(
      (
        id: string,
        phase: 'mount' | 'update' | 'nested-update',
        actualDuration: number,
        baseDuration: number,
        startTime: number,
        commitTime: number
      ) => {
        recordRender({
          componentName: componentName || id,
          renderTime: actualDuration,
          renderCount: 1,
          timestamp: startTime,
          phase: phase === 'nested-update' ? 'update' : phase,
        })
      },
      [recordRender]
    )

    return (
      <React.Profiler id={componentName} onRender={onRenderCallback}>
        <Component {...(props as any)} ref={ref} />
      </React.Profiler>
    )
  })

  WrappedComponent.displayName = `withPerformanceProfiler(${componentName})`
  return WrappedComponent
}

// Performance Monitor Display Component
export function PerformanceMonitorDisplay() {
  const { metrics, warnings, isMonitoring, startMonitoring, stopMonitoring } =
    usePerformanceMonitor()
  const [isExpanded, setIsExpanded] = useState(false)

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value >= thresholds[1]) return 'text-green-500'
    if (value >= thresholds[0]) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getMemoryColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-500'
    if (percentage < 75) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="glass-card w-[400px] max-h-[600px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Performance Monitor</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                className={cn(
                  'px-3 py-1 rounded-lg text-sm font-medium transition-colors',
                  isMonitoring
                    ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                    : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                )}
              >
                {isMonitoring ? 'Stop' : 'Start'}
              </button>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="p-4 space-y-3">
            {/* FPS */}
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">FPS</span>
                </div>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    getStatusColor(metrics.fps, [30, 50])
                  )}
                >
                  {metrics.fps}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {metrics.fps >= 50 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className="text-xs text-muted-foreground">
                  Target: 60 FPS
                </span>
              </div>
            </div>

            {/* Memory */}
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MemoryStick className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <span
                  className={cn(
                    'text-2xl font-bold',
                    getMemoryColor(metrics.memory.percentage)
                  )}
                >
                  {metrics.memory.percentage.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all rounded-full',
                      metrics.memory.percentage > 75
                        ? 'bg-red-500'
                        : metrics.memory.percentage > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    )}
                    style={{ width: `${metrics.memory.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {metrics.memory.used.toFixed(1)} MB /{' '}
                  {metrics.memory.limit.toFixed(1)} MB
                </span>
              </div>
            </div>

            {/* Render Performance */}
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Renders</span>
                </div>
                <span className="text-2xl font-bold">{metrics.renderCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Avg Time:</span>
                <span
                  className={cn(
                    'font-medium',
                    metrics.averageRenderTime > 16
                      ? 'text-red-500'
                      : 'text-green-500'
                  )}
                >
                  {metrics.averageRenderTime.toFixed(2)}ms
                </span>
              </div>
            </div>

            {/* Network */}
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Network className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-medium">Network</span>
                </div>
                <span className="text-2xl font-bold">
                  {metrics.networkRequests}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Total requests made
              </span>
            </div>

            {/* Bundle Size */}
            <div className="glass-panel p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Bundle</span>
                </div>
                <span className="text-2xl font-bold">
                  {(metrics.bundleSize / 1024).toFixed(1)}
                  <span className="text-sm text-muted-foreground ml-1">KB</span>
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Estimated size
              </span>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <h4 className="font-medium text-sm">Recent Warnings</h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {warnings.slice(-5).map((warning) => (
                  <div
                    key={warning.id}
                    className={cn(
                      'glass-panel p-2 flex items-start gap-2 text-xs',
                      warning.type === 'error' && 'border-red-500/30',
                      warning.type === 'warning' && 'border-yellow-500/30',
                      warning.type === 'info' && 'border-blue-500/30'
                    )}
                  >
                    {warning.type === 'error' && (
                      <XCircle className="h-3 w-3 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    {warning.type === 'warning' && (
                      <AlertTriangle className="h-3 w-3 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    {warning.type === 'info' && (
                      <CheckCircle2 className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className="flex-1">{warning.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="glass-card p-3 flex items-center gap-2 hover:bg-white/10 transition-colors"
        >
          <Activity className="h-5 w-5 text-primary" />
          <span className="font-medium">Performance</span>
          {isMonitoring && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
          )}
        </button>
      )}
    </div>
  )
}
