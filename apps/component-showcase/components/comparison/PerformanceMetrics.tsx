'use client'

import { BarChart3, Clock, Database, Package, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import { cn } from '@clarity-chat/primitives'
import type { PerformanceMetrics as Metrics } from './ComparisonView'

interface PerformanceMetricsProps {
  leftComponent: string
  rightComponent: string
  leftMetrics: Metrics
  rightMetrics: Metrics
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  leftValue: number
  rightValue: number
  unit: string
  betterWhen: 'lower' | 'higher'
}

function MetricCard({ icon, label, leftValue, rightValue, unit, betterWhen }: MetricCardProps) {
  const leftIsBetter =
    betterWhen === 'lower' ? leftValue < rightValue : leftValue > rightValue
  const rightIsBetter =
    betterWhen === 'lower' ? rightValue < leftValue : rightValue > leftValue
  const difference = Math.abs(((leftValue - rightValue) / leftValue) * 100)

  return (
    <div className="glass-panel p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Left Component */}
        <div>
          <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">Component A</div>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'text-2xl font-bold tabular-nums',
                leftIsBetter && 'text-green-600 dark:text-green-400'
              )}
            >
              {leftValue.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {leftIsBetter && <TrendingDown className="h-4 w-4 text-green-500 ml-1" />}
          </div>
        </div>

        {/* Right Component */}
        <div>
          <div className="text-xs text-purple-600 dark:text-purple-400 mb-1">Component B</div>
          <div className="flex items-baseline gap-1">
            <span
              className={cn(
                'text-2xl font-bold tabular-nums',
                rightIsBetter && 'text-green-600 dark:text-green-400'
              )}
            >
              {rightValue.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {rightIsBetter && <TrendingDown className="h-4 w-4 text-green-500 ml-1" />}
          </div>
        </div>
      </div>

      {/* Difference */}
      <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
        {difference.toFixed(1)}% difference
      </div>
    </div>
  )
}

export function PerformanceMetrics({
  leftComponent,
  rightComponent,
  leftMetrics,
  rightMetrics,
}: PerformanceMetricsProps) {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="icon-container">
          <BarChart3 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Performance Metrics</h3>
          <p className="text-sm text-muted-foreground">
            Real-time performance comparison between components
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock className="h-4 w-4" />}
          label="Render Time"
          leftValue={leftMetrics.renderTime}
          rightValue={rightMetrics.renderTime}
          unit="ms"
          betterWhen="lower"
        />
        <MetricCard
          icon={<Database className="h-4 w-4" />}
          label="Memory Usage"
          leftValue={leftMetrics.memoryUsage}
          rightValue={rightMetrics.memoryUsage}
          unit="MB"
          betterWhen="lower"
        />
        <MetricCard
          icon={<Package className="h-4 w-4" />}
          label="Bundle Size"
          leftValue={leftMetrics.bundleSize}
          rightValue={rightMetrics.bundleSize}
          unit="KB"
          betterWhen="lower"
        />
        <MetricCard
          icon={<RefreshCw className="h-4 w-4" />}
          label="Re-renders"
          leftValue={leftMetrics.reRenders}
          rightValue={rightMetrics.reRenders}
          unit="count"
          betterWhen="lower"
        />
      </div>

      {/* Performance Summary */}
      <div className="mt-6 glass-panel p-4 rounded-lg">
        <h4 className="text-sm font-semibold mb-2">Performance Summary</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          {leftMetrics.renderTime < rightMetrics.renderTime ? (
            <p>✓ Component A renders {((1 - leftMetrics.renderTime / rightMetrics.renderTime) * 100).toFixed(0)}% faster</p>
          ) : (
            <p>✓ Component B renders {((1 - rightMetrics.renderTime / leftMetrics.renderTime) * 100).toFixed(0)}% faster</p>
          )}
          {leftMetrics.bundleSize < rightMetrics.bundleSize ? (
            <p>✓ Component A is {((1 - leftMetrics.bundleSize / rightMetrics.bundleSize) * 100).toFixed(0)}% smaller</p>
          ) : (
            <p>✓ Component B is {((1 - rightMetrics.bundleSize / leftMetrics.bundleSize) * 100).toFixed(0)}% smaller</p>
          )}
          {leftMetrics.memoryUsage < rightMetrics.memoryUsage ? (
            <p>✓ Component A uses {((1 - leftMetrics.memoryUsage / rightMetrics.memoryUsage) * 100).toFixed(0)}% less memory</p>
          ) : (
            <p>✓ Component B uses {((1 - rightMetrics.memoryUsage / leftMetrics.memoryUsage) * 100).toFixed(0)}% less memory</p>
          )}
        </div>
      </div>
    </div>
  )
}
