'use client'

import React, { useState, useEffect } from 'react'
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  Cpu,
  MemoryStick,
  Network,
  Package,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Target,
  Gauge,
  Sparkles,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import {
  PerformanceMonitorProvider,
  usePerformanceMonitor,
  withPerformanceProfiler,
} from '@/components/performance-monitor'

// Demo Components for Testing
const HeavyComponent = withPerformanceProfiler(
  ({ iterations = 1000 }: { iterations?: number }) => {
    const [result, setResult] = useState(0)

    useEffect(() => {
      // Simulate heavy computation
      let sum = 0
      for (let i = 0; i < iterations; i++) {
        sum += Math.sqrt(i) * Math.sin(i)
      }
      setResult(sum)
    }, [iterations])

    return (
      <div className="glass-panel p-4">
        <h4 className="font-medium mb-2">Heavy Component</h4>
        <p className="text-sm text-muted-foreground">
          Computed result: {result.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Iterations: {iterations}
        </p>
      </div>
    )
  },
  'HeavyComponent'
)

const FastComponent = withPerformanceProfiler(
  () => {
    return (
      <div className="glass-panel p-4">
        <h4 className="font-medium mb-2">Fast Component</h4>
        <p className="text-sm text-muted-foreground">
          This component renders quickly
        </p>
      </div>
    )
  },
  'FastComponent'
)

// Benchmark Results Component
interface BenchmarkResult {
  name: string
  renderTime: number
  memoryUsed: number
  optimized: boolean
}

function BenchmarkComparison() {
  const benchmarks: BenchmarkResult[] = [
    {
      name: 'Unoptimized List',
      renderTime: 45.3,
      memoryUsed: 12.4,
      optimized: false,
    },
    {
      name: 'Virtualized List',
      renderTime: 8.2,
      memoryUsed: 3.1,
      optimized: true,
    },
    {
      name: 'Heavy Component',
      renderTime: 32.1,
      memoryUsed: 8.7,
      optimized: false,
    },
    {
      name: 'Memoized Component',
      renderTime: 2.4,
      memoryUsed: 2.1,
      optimized: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Before/After Comparison</h3>
      </div>

      <div className="grid gap-4">
        {benchmarks.map((benchmark) => (
          <div
            key={benchmark.name}
            className="glass-panel p-4 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-medium">{benchmark.name}</h4>
                {benchmark.optimized ? (
                  <span className="badge-glass text-xs bg-green-500/20 text-green-500">
                    Optimized
                  </span>
                ) : (
                  <span className="badge-glass text-xs bg-red-500/20 text-red-500">
                    Unoptimized
                  </span>
                )}
              </div>
              {benchmark.optimized ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Render Time
                  </span>
                </div>
                <p
                  className={cn(
                    'text-2xl font-bold',
                    benchmark.renderTime > 16
                      ? 'text-red-500'
                      : 'text-green-500'
                  )}
                >
                  {benchmark.renderTime.toFixed(1)}
                  <span className="text-sm text-muted-foreground ml-1">ms</span>
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <MemoryStick className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Memory</span>
                </div>
                <p
                  className={cn(
                    'text-2xl font-bold',
                    benchmark.memoryUsed > 10
                      ? 'text-red-500'
                      : 'text-green-500'
                  )}
                >
                  {benchmark.memoryUsed.toFixed(1)}
                  <span className="text-sm text-muted-foreground ml-1">MB</span>
                </p>
              </div>
            </div>

            {benchmark.optimized && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-green-500">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>
                    {benchmark.name.includes('List')
                      ? '82% faster with virtualization'
                      : '93% faster with memoization'}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Optimization Suggestions Component
function OptimizationSuggestions() {
  const { metrics, warnings } = usePerformanceMonitor()

  const suggestions = [
    {
      icon: Sparkles,
      title: 'Use React.memo',
      description: 'Prevent unnecessary re-renders of functional components',
      condition: metrics.averageRenderTime > 10,
      priority: 'high',
    },
    {
      icon: Zap,
      title: 'Implement Virtual Scrolling',
      description: 'Render only visible items in long lists',
      condition: metrics.renderCount > 100,
      priority: 'high',
    },
    {
      icon: Package,
      title: 'Code Splitting',
      description: 'Split bundles for faster initial load',
      condition: metrics.bundleSize > 500 * 1024,
      priority: 'medium',
    },
    {
      icon: MemoryStick,
      title: 'Optimize Memory',
      description: 'Clean up listeners and subscriptions',
      condition: metrics.memory.percentage > 70,
      priority: 'high',
    },
    {
      icon: Network,
      title: 'Reduce Network Calls',
      description: 'Batch requests and implement caching',
      condition: metrics.networkRequests > 50,
      priority: 'medium',
    },
    {
      icon: Cpu,
      title: 'Debounce Updates',
      description: 'Throttle frequent state updates',
      condition: metrics.renderCount > 50 && metrics.averageRenderTime > 5,
      priority: 'medium',
    },
  ]

  const activeSuggestions = suggestions.filter((s) => s.condition)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Optimization Suggestions</h3>
      </div>

      {activeSuggestions.length === 0 ? (
        <div className="glass-panel p-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <h4 className="font-medium mb-2">Performance Looks Good!</h4>
          <p className="text-sm text-muted-foreground">
            No optimization suggestions at this time
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className={cn(
                'glass-panel p-4 border-l-4',
                suggestion.priority === 'high'
                  ? 'border-red-500'
                  : 'border-yellow-500'
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    suggestion.priority === 'high'
                      ? 'bg-red-500/20'
                      : 'bg-yellow-500/20'
                  )}
                >
                  <suggestion.icon
                    className={cn(
                      'h-4 w-4',
                      suggestion.priority === 'high'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                    )}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{suggestion.title}</h4>
                    <span
                      className={cn(
                        'badge-glass text-xs',
                        suggestion.priority === 'high'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-yellow-500/20 text-yellow-500'
                      )}
                    >
                      {suggestion.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Performance Dashboard
function PerformanceDashboard() {
  const { metrics, isMonitoring, startMonitoring, stopMonitoring } =
    usePerformanceMonitor()
  const [showHeavy, setShowHeavy] = useState(false)
  const [iterations, setIterations] = useState(1000)

  useEffect(() => {
    startMonitoring()
    return () => stopMonitoring()
  }, [startMonitoring, stopMonitoring])

  const performanceScore = Math.min(
    100,
    Math.round(
      (metrics.fps / 60) * 40 +
        (1 - metrics.memory.percentage / 100) * 30 +
        (metrics.averageRenderTime < 16 ? 30 : 0)
    )
  )

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500'
    if (score >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="icon-container">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Performance Dashboard</h2>
              <p className="text-sm text-muted-foreground">
                Real-time monitoring and optimization insights
              </p>
            </div>
          </div>

          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2',
              isMonitoring
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
                : 'gradient-accent text-white hover:opacity-90'
            )}
          >
            {isMonitoring ? (
              <>
                <Activity className="h-4 w-4 animate-pulse" />
                Stop Monitoring
              </>
            ) : (
              <>
                <Activity className="h-4 w-4" />
                Start Monitoring
              </>
            )}
          </button>
        </div>

        {/* Performance Score */}
        <div className="glass-panel p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Gauge className="h-6 w-6 text-primary" />
            <h3 className="text-lg font-semibold">Performance Score</h3>
          </div>
          <p className={cn('text-6xl font-bold mb-2', getScoreColor(performanceScore))}>
            {performanceScore}
            <span className="text-2xl text-muted-foreground">/100</span>
          </p>
          <p className="text-sm text-muted-foreground">
            {performanceScore >= 90
              ? 'Excellent performance'
              : performanceScore >= 70
                ? 'Good performance with room for improvement'
                : 'Needs optimization'}
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* FPS */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">FPS</span>
            </div>
            {metrics.fps >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
          <p
            className={cn(
              'text-4xl font-bold mb-1',
              metrics.fps >= 50 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {metrics.fps}
          </p>
          <p className="text-xs text-muted-foreground">Target: 60 FPS</p>
          <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                metrics.fps >= 50 ? 'bg-green-500' : 'bg-red-500'
              )}
              style={{ width: `${(metrics.fps / 60) * 100}%` }}
            />
          </div>
        </div>

        {/* Memory */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MemoryStick className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Memory Usage</span>
            </div>
          </div>
          <p
            className={cn(
              'text-4xl font-bold mb-1',
              metrics.memory.percentage > 75
                ? 'text-red-500'
                : metrics.memory.percentage > 50
                  ? 'text-yellow-500'
                  : 'text-green-500'
            )}
          >
            {metrics.memory.percentage.toFixed(0)}%
          </p>
          <p className="text-xs text-muted-foreground">
            {metrics.memory.used.toFixed(1)} MB used
          </p>
          <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                metrics.memory.percentage > 75
                  ? 'bg-red-500'
                  : metrics.memory.percentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
              )}
              style={{ width: `${metrics.memory.percentage}%` }}
            />
          </div>
        </div>

        {/* Render Time */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Render Time</span>
            </div>
          </div>
          <p
            className={cn(
              'text-4xl font-bold mb-1',
              metrics.averageRenderTime > 16 ? 'text-red-500' : 'text-green-500'
            )}
          >
            {metrics.averageRenderTime.toFixed(1)}
            <span className="text-lg text-muted-foreground ml-1">ms</span>
          </p>
          <p className="text-xs text-muted-foreground">Target: &lt;16ms (60 FPS)</p>
          <div className="mt-3 w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                metrics.averageRenderTime > 16 ? 'bg-red-500' : 'bg-green-500'
              )}
              style={{
                width: `${Math.min((metrics.averageRenderTime / 16) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Render Count */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-medium">Total Renders</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">{metrics.renderCount}</p>
          <p className="text-xs text-muted-foreground">Component renders tracked</p>
        </div>

        {/* Network Requests */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Network className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Network Requests</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">{metrics.networkRequests}</p>
          <p className="text-xs text-muted-foreground">HTTP requests made</p>
        </div>

        {/* Bundle Size */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Bundle Size</span>
            </div>
          </div>
          <p className="text-4xl font-bold mb-1">
            {(metrics.bundleSize / 1024).toFixed(0)}
            <span className="text-lg text-muted-foreground ml-1">KB</span>
          </p>
          <p className="text-xs text-muted-foreground">Estimated total size</p>
        </div>
      </div>

      {/* Test Components */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Test Components</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowHeavy(!showHeavy)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium transition-colors',
                showHeavy
                  ? 'bg-red-500/20 text-red-500'
                  : 'gradient-accent text-white'
              )}
            >
              {showHeavy ? 'Hide' : 'Show'} Heavy Component
            </button>

            {showHeavy && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">
                  Iterations:
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={iterations}
                  onChange={(e) => setIterations(Number(e.target.value))}
                  className="w-32"
                />
                <span className="text-sm font-medium">{iterations}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FastComponent />
            {showHeavy && <HeavyComponent iterations={iterations} />}
          </div>
        </div>
      </div>

      {/* Benchmark Comparison */}
      <div className="glass-card p-6">
        <BenchmarkComparison />
      </div>

      {/* Optimization Suggestions */}
      <div className="glass-card p-6">
        <OptimizationSuggestions />
      </div>
    </div>
  )
}

// Main Page Component
export default function PerformancePage() {
  return (
    <PerformanceMonitorProvider>
      <div className="max-w-7xl mx-auto">
        <PerformanceDashboard />
      </div>
    </PerformanceMonitorProvider>
  )
}
