'use client'

/**
 * SavingsDashboard Component
 *
 * A comprehensive dashboard for tracking optimization metrics with:
 * - Multiple metric cards (daily/weekly/monthly/all-time)
 * - Total cost savings breakdowns
 * - Optimization strategy analysis
 * - Trend charts showing savings over time
 * - Cache hit rate monitoring
 * - Cost per request metrics
 * - Export functionality (CSV/JSON)
 * - Real-time updates
 * - Responsive design
 *
 * @example
 * ```tsx
 * <SavingsDashboard
 *   metrics={currentMetrics}
 *   historicalData={history}
 *   onExport={(format) => handleExport(format)}
 *   realTime
 * />
 * ```
 */

import * as React from 'react'
import { cn, glassVariants, getSemanticGradient } from '@clarity-chat/primitives'
import {
  TrendingDown,
  DollarSign,
  Activity,
  Download,
  Calendar,
  Zap,
  Database,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
} from 'lucide-react'

// ============================================================================
// Types
// ============================================================================

export interface SavingsMetrics {
  /** Total tokens processed */
  totalTokens: number
  /** Tokens saved through optimization */
  tokensSaved: number
  /** Cost saved in dollars */
  costSaved: number
  /** Number of requests processed */
  requestCount: number
  /** Average cost per request */
  costPerRequest: number
  /** Cache hit rate (0-100) */
  cacheHitRate: number
  /** Overall savings percentage */
  savingsPercent: number
  /** Optimization strategy breakdown */
  strategyBreakdown: {
    providerCaching: { savings: number; percent: number }
    compression: { savings: number; percent: number }
    smartRouting: { savings: number; percent: number }
    responseLimiting: { savings: number; percent: number }
    batching: { savings: number; percent: number }
    throttling: { savings: number; percent: number }
  }
}

export interface TimePeriodMetrics {
  daily: SavingsMetrics
  weekly: SavingsMetrics
  monthly: SavingsMetrics
  allTime: SavingsMetrics
}

export interface TrendDataPoint {
  timestamp: number
  tokensSaved: number
  costSaved: number
  savingsPercent: number
  cacheHitRate: number
  requestCount: number
}

export type ExportFormat = 'csv' | 'json'
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'allTime'

export interface SavingsDashboardProps {
  /** Current metrics by time period */
  metrics: TimePeriodMetrics
  /** Historical trend data for charts */
  historicalData?: TrendDataPoint[]
  /** Show trend charts */
  showCharts?: boolean
  /** Show strategy breakdown */
  showBreakdown?: boolean
  /** Enable real-time updates */
  realTime?: boolean
  /** Refresh interval for real-time (ms) */
  refreshInterval?: number
  /** Export handler */
  onExport?: (format: ExportFormat) => void
  /** Time period change handler */
  onTimePeriodChange?: (period: TimePeriod) => void
  /** Initial time period */
  defaultPeriod?: TimePeriod
  /** Custom CSS class */
  className?: string
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error | string | null
}

// ============================================================================
// Main Component
// ============================================================================

export function SavingsDashboard({
  metrics,
  historicalData = [],
  showCharts = true,
  showBreakdown = true,
  realTime = false,
  refreshInterval = 5000,
  onExport,
  onTimePeriodChange,
  defaultPeriod = 'daily',
  className = '',
  isLoading = false,
  error = null,
}: SavingsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState<TimePeriod>(defaultPeriod)
  const [displayMetrics, setDisplayMetrics] = React.useState(metrics[selectedPeriod])

  // Real-time updates
  React.useEffect(() => {
    if (!realTime) {
      setDisplayMetrics(metrics[selectedPeriod])
      return
    }

    const interval = setInterval(() => {
      setDisplayMetrics(metrics[selectedPeriod])
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [metrics, selectedPeriod, realTime, refreshInterval])

  // Period change handler
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period)
    setDisplayMetrics(metrics[period])
    onTimePeriodChange?.(period)
  }

  // Export handler
  const handleExport = (format: ExportFormat) => {
    if (onExport) {
      onExport(format)
    } else {
      // Default export implementation
      const data = {
        period: selectedPeriod,
        metrics: displayMetrics,
        historicalData,
        exportedAt: new Date().toISOString(),
      }

      if (format === 'json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        downloadFile(blob, `savings-dashboard-${selectedPeriod}-${Date.now()}.json`)
      } else {
        const csv = convertToCSV(data)
        const blob = new Blob([csv], { type: 'text/csv' })
        downloadFile(blob, `savings-dashboard-${selectedPeriod}-${Date.now()}.csv`)
      }
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(
          'p-6 bg-card rounded-xl border border-border/50 shadow-sm',
          className
        )}
        role="status"
        aria-label="Loading Savings Dashboard"
        aria-busy="true"
      >
        <LoadingSkeleton />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div
        className={cn(
          'p-6 bg-card rounded-xl border border-destructive/30 shadow-sm',
          className
        )}
        role="alert"
        aria-live="assertive"
      >
        <ErrorDisplay error={error} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden',
        className
      )}
      role="region"
      aria-label="Savings Dashboard"
    >
      {/* Header */}
      <DashboardHeader
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onExport={handleExport}
        realTime={realTime}
      />

      <div className="p-6 space-y-6">
        {/* Key Metrics Grid */}
        <KeyMetricsGrid metrics={displayMetrics} />

        {/* Cache & Performance Metrics */}
        <CachePerformanceMetrics metrics={displayMetrics} />

        {/* Trend Charts */}
        {showCharts && historicalData.length > 0 && (
          <TrendCharts data={historicalData} period={selectedPeriod} />
        )}

        {/* Strategy Breakdown */}
        {showBreakdown && (
          <StrategyBreakdown breakdown={displayMetrics.strategyBreakdown} />
        )}

        {/* Summary Footer */}
        <SummaryFooter metrics={displayMetrics} period={selectedPeriod} />
      </div>
    </div>
  )
}

// ============================================================================
// Sub-Components
// ============================================================================

interface DashboardHeaderProps {
  selectedPeriod: TimePeriod
  onPeriodChange: (period: TimePeriod) => void
  onExport: (format: ExportFormat) => void
  realTime: boolean
}

function DashboardHeader({
  selectedPeriod,
  onPeriodChange,
  onExport,
  realTime,
}: DashboardHeaderProps) {
  const [showExportMenu, setShowExportMenu] = React.useState(false)

  const periods: { value: TimePeriod; label: string }[] = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'This Week' },
    { value: 'monthly', label: 'This Month' },
    { value: 'allTime', label: 'All Time' },
  ]

  return (
    <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10 border border-success/20">
            <TrendingDown className="w-5 h-5 text-success" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Cost Savings Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Track optimization performance and ROI
            </p>
          </div>
          {realTime && (
            <div
              className="flex items-center gap-2 px-2 py-1 rounded-full bg-success/10 border border-success/20"
              role="status"
              aria-live="polite"
              aria-label="Real-time updates active"
            >
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              <span className="text-xs font-medium text-success">Live</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Time Period Selector */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg border border-border/50">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => onPeriodChange(period.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  selectedPeriod === period.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                )}
                aria-pressed={selectedPeriod === period.value}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Export Menu */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm font-medium',
                'bg-muted hover:bg-muted/80 rounded-lg border border-border/50',
                'transition-colors'
              )}
              aria-label="Export data"
              aria-expanded={showExportMenu}
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Export
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-40 bg-card rounded-lg border border-border/50 shadow-lg z-10">
                <button
                  onClick={() => {
                    onExport('csv')
                    setShowExportMenu(false)
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => {
                    onExport('json')
                    setShowExportMenu(false)
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors"
                >
                  Export as JSON
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function KeyMetricsGrid({ metrics }: { metrics: SavingsMetrics }) {
  const formatCost = (cost: number) => {
    if (cost < 0.01) return `$${(cost * 100).toFixed(3)}¢`
    return `$${cost.toFixed(2)}`
  }

  const metricCards = [
    {
      label: 'Total Cost Saved',
      value: formatCost(metrics.costSaved),
      subtext: `${metrics.savingsPercent.toFixed(1)}% reduction`,
      icon: DollarSign,
      gradient: 'success' as const,
      trend: '+12.3%',
    },
    {
      label: 'Tokens Optimized',
      value: metrics.tokensSaved.toLocaleString(),
      subtext: `Out of ${metrics.totalTokens.toLocaleString()}`,
      icon: Zap,
      gradient: 'analytics' as const,
      trend: '+8.7%',
    },
    {
      label: 'Avg Cost/Request',
      value: formatCost(metrics.costPerRequest),
      subtext: `${metrics.requestCount.toLocaleString()} requests`,
      icon: Activity,
      gradient: 'highlight' as const,
      trend: '-15.2%',
    },
    {
      label: 'Cache Hit Rate',
      value: `${metrics.cacheHitRate.toFixed(1)}%`,
      subtext: 'Provider caching',
      icon: Database,
      gradient: 'info' as const,
      trend: '+5.4%',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((card) => (
        <div
          key={card.label}
          className={cn(
            glassVariants({
              intensity: 'medium',
              gradient: getSemanticGradient(card.gradient),
              border: 'light',
              animated: 'glow',
              hover: 'glow',
            }),
            'p-4 rounded-lg'
          )}
        >
          <div className="flex items-start justify-between mb-3">
            <card.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
            <span className="text-xs font-medium text-success">{card.trend}</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-foreground">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.label}</div>
            <div className="text-xs text-muted-foreground/80">{card.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function CachePerformanceMetrics({ metrics }: { metrics: SavingsMetrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Cache Hit Rate */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              Cache Performance
            </span>
          </div>
          <span className="text-lg font-bold text-primary">
            {metrics.cacheHitRate.toFixed(1)}%
          </span>
        </div>

        <div className="space-y-2">
          <div
            className="h-2 bg-muted rounded-full overflow-hidden"
            role="progressbar"
            aria-label="Cache hit rate"
            aria-valuenow={Math.round(metrics.cacheHitRate)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${metrics.cacheHitRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>Target: 90%</span>
            <span>100%</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          {metrics.cacheHitRate >= 90 ? (
            <CheckCircle2 className="w-4 h-4 text-success" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-500" aria-hidden="true" />
          )}
          <span className="text-xs text-muted-foreground">
            {metrics.cacheHitRate >= 90
              ? 'Excellent cache performance'
              : 'Consider increasing cache TTL'}
          </span>
        </div>
      </div>

      {/* Cost Per Request Trend */}
      <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-success" aria-hidden="true" />
            <span className="text-sm font-medium text-foreground">
              Cost Per Request
            </span>
          </div>
          <span className="text-lg font-bold text-success">
            ${metrics.costPerRequest.toFixed(4)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Industry avg: $0.0050</span>
            <span className="text-success font-medium">
              {((1 - metrics.costPerRequest / 0.005) * 100).toFixed(1)}% below
            </span>
          </div>

          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-success transition-all duration-500"
              style={{ width: `${Math.min((metrics.costPerRequest / 0.005) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Processing {metrics.requestCount.toLocaleString()} requests efficiently
        </div>
      </div>
    </div>
  )
}

function TrendCharts({
  data,
  period,
}: {
  data: TrendDataPoint[]
  period: TimePeriod
}) {
  // Simple sparkline chart using SVG
  const width = 400
  const height = 80
  const padding = 10

  const maxCost = Math.max(...data.map((d) => d.costSaved))
  const maxTokens = Math.max(...data.map((d) => d.tokensSaved))

  const costPoints = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((d.costSaved / maxCost) * (height - 2 * padding))
      return `${x},${y}`
    })
    .join(' ')

  const tokensPoints = data
    .map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((d.tokensSaved / maxTokens) * (height - 2 * padding))
      return `${x},${y}`
    })
    .join(' ')

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
        <BarChart3 className="w-4 h-4" aria-hidden="true" />
        Savings Trends
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cost Savings Trend */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Cost Saved ({period})</div>
            <div className="text-2xl font-bold text-success">
              ${data[data.length - 1]?.costSaved.toFixed(2) || '0.00'}
            </div>
          </div>

          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
            role="img"
            aria-label="Cost savings trend chart"
          >
            <polyline
              points={costPoints}
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
              const y = height - padding - ((d.costSaved / maxCost) * (height - 2 * padding))
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="hsl(var(--success))"
                  className="hover:r-5 transition-all"
                />
              )
            })}
          </svg>
        </div>

        {/* Token Savings Trend */}
        <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Tokens Saved ({period})</div>
            <div className="text-2xl font-bold text-primary">
              {data[data.length - 1]?.tokensSaved.toLocaleString() || '0'}
            </div>
          </div>

          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
            role="img"
            aria-label="Token savings trend chart"
          >
            <polyline
              points={tokensPoints}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {data.map((d, i) => {
              const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
              const y = height - padding - ((d.tokensSaved / maxTokens) * (height - 2 * padding))
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="hsl(var(--primary))"
                  className="hover:r-5 transition-all"
                />
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

function StrategyBreakdown({
  breakdown,
}: {
  breakdown: SavingsMetrics['strategyBreakdown']
}) {
  const strategies = [
    {
      key: 'providerCaching' as const,
      label: 'Provider Caching',
      icon: '💾',
      description: 'Anthropic/OpenAI prompt caching',
      color: 'text-blue-600 dark:text-blue-400',
    },
    {
      key: 'compression' as const,
      label: 'Compression',
      icon: '✂️',
      description: 'Prompt compression algorithms',
      color: 'text-green-600 dark:text-green-400',
    },
    {
      key: 'smartRouting' as const,
      label: 'Smart Routing',
      icon: '🎯',
      description: 'Intelligent model selection',
      color: 'text-purple-600 dark:text-purple-400',
    },
    {
      key: 'responseLimiting' as const,
      label: 'Response Limiting',
      icon: '✨',
      description: 'Token limit enforcement',
      color: 'text-amber-600 dark:text-amber-400',
    },
    {
      key: 'batching' as const,
      label: 'Batching',
      icon: '📦',
      description: 'Request batching',
      color: 'text-cyan-600 dark:text-cyan-400',
    },
    {
      key: 'throttling' as const,
      label: 'Throttling',
      icon: '⏱️',
      description: 'Rate limiting',
      color: 'text-pink-600 dark:text-pink-400',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-foreground">
        Optimization Strategy Breakdown
      </h3>

      <div className="space-y-3">
        {strategies.map((strategy) => {
          const data = breakdown[strategy.key]
          if (!data || data.savings === 0) return null

          return (
            <div
              key={strategy.key}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-2xl" aria-hidden="true">{strategy.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {strategy.label}
                  </span>
                  <span className={cn('text-sm font-semibold', strategy.color)}>
                    ${data.savings.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {strategy.description}
                </div>
                <div
                  className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden"
                  role="progressbar"
                  aria-label={`${strategy.label} contribution`}
                  aria-valuenow={Math.round(data.percent)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={cn('h-full transition-all duration-500', strategy.color.replace('text-', 'bg-'))}
                    style={{ width: `${data.percent}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SummaryFooter({
  metrics,
  period,
}: {
  metrics: SavingsMetrics
  period: TimePeriod
}) {
  const periodLabels: Record<TimePeriod, string> = {
    daily: 'today',
    weekly: 'this week',
    monthly: 'this month',
    allTime: 'all time',
  }

  return (
    <div className="pt-4 border-t border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Requests {periodLabels[period]}</span>
          <div className="text-lg font-semibold text-foreground mt-1">
            {metrics.requestCount.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Average Savings per Request</span>
          <div className="text-lg font-semibold text-success mt-1">
            {metrics.savingsPercent.toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-muted-foreground">Projected Monthly Savings</span>
          <div className="text-lg font-semibold text-success mt-1">
            ${(metrics.costSaved * 30).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted/60 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 bg-muted/20 rounded-lg">
            <div className="h-8 w-20 bg-muted rounded mb-2" />
            <div className="h-4 w-16 bg-muted/60 rounded" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-muted/20 rounded-lg h-32" />
        ))}
      </div>
    </div>
  )
}

function ErrorDisplay({ error }: { error: Error | string }) {
  const errorMessage = error instanceof Error ? error.message : String(error)

  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center py-8">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">
          Failed to load savings dashboard
        </p>
        <p className="text-xs text-muted-foreground">{errorMessage}</p>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        Retry
      </button>
    </div>
  )
}

// ============================================================================
// Utilities
// ============================================================================

function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

function convertToCSV(data: {
  period: string
  metrics: SavingsMetrics
  historicalData: TrendDataPoint[]
  exportedAt: string
}): string {
  const { metrics, historicalData, period, exportedAt } = data

  // Header rows
  const header = [
    `Savings Dashboard Export - ${period}`,
    `Exported: ${exportedAt}`,
    '',
    'Summary Metrics',
    'Metric,Value',
    `Total Tokens,${metrics.totalTokens}`,
    `Tokens Saved,${metrics.tokensSaved}`,
    `Cost Saved,$${metrics.costSaved.toFixed(4)}`,
    `Savings Percent,${metrics.savingsPercent.toFixed(2)}%`,
    `Request Count,${metrics.requestCount}`,
    `Cost Per Request,$${metrics.costPerRequest.toFixed(4)}`,
    `Cache Hit Rate,${metrics.cacheHitRate.toFixed(2)}%`,
    '',
    'Strategy Breakdown',
    'Strategy,Savings,Percent',
  ]

  // Strategy breakdown rows
  const strategies = Object.entries(metrics.strategyBreakdown).map(
    ([key, value]) => `${key},$${value.savings.toFixed(4)},${value.percent.toFixed(2)}%`
  )

  // Historical data rows
  const historyHeader = ['', 'Historical Trend Data', 'Timestamp,Tokens Saved,Cost Saved,Savings %,Cache Hit Rate,Requests']
  const historyRows = historicalData.map(
    (point) =>
      `${new Date(point.timestamp).toISOString()},${point.tokensSaved},$${point.costSaved.toFixed(4)},${point.savingsPercent.toFixed(2)}%,${point.cacheHitRate.toFixed(2)}%,${point.requestCount}`
  )

  return [...header, ...strategies, ...historyHeader, ...historyRows].join('\n')
}

// Display names
SavingsDashboard.displayName = 'SavingsDashboard'
