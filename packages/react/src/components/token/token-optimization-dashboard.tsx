'use client'

import * as React from 'react'

export interface OptimizationMetrics {
  /** Total tokens processed */
  totalTokens: number
  /** Tokens saved through optimization */
  tokensSaved: number
  /** Cost saved in dollars */
  costSaved: number
  /** Optimization breakdown by technique */
  breakdown: {
    promptCompression: { tokens: number; percent: number }
    caching: { hits: number; savings: number }
    modelRouting: { savings: number; percent: number }
    responseLimiting: { tokens: number; percent: number }
    batching: { requests: number; savings: number }
    throttling: { callsSaved: number }
    referencing: { bytesSaved: number; percent: number }
  }
  /** Overall savings percentage */
  savingsPercent: number
}

export interface TokenOptimizationDashboardProps {
  /** Current optimization metrics */
  metrics: OptimizationMetrics
  /** Show detailed breakdown */
  showBreakdown?: boolean
  /** Enable real-time updates */
  realTime?: boolean
  /** Refresh interval for real-time (ms) */
  refreshInterval?: number
  /** Cost per token for calculations */
  costPerToken?: number
  /** Custom CSS class */
  className?: string
  /** Callback when dashboard is clicked */
  onClick?: () => void
  /** Whether the dashboard is in a loading state */
  isLoading?: boolean
  /** Error to display (renders error state when provided) */
  error?: Error | string | null
}

/**
 * Token Optimization Dashboard Component
 *
 * Displays comprehensive token optimization metrics and savings.
 *
 * @example
 * ```tsx
 * <TokenOptimizationDashboard
 *   metrics={{
 *     totalTokens: 50000,
 *     tokensSaved: 15000,
 *     costSaved: 0.45,
 *     breakdown: {
 *       promptCompression: { tokens: 4000, percent: 27 },
 *       caching: { hits: 120, savings: 5000 },
 *       modelRouting: { savings: 3000, percent: 40 },
 *       responseLimiting: { tokens: 2000, percent: 15 },
 *       batching: { requests: 50, savings: 800 },
 *       throttling: { callsSaved: 200 },
 *       referencing: { bytesSaved: 50000, percent: 60 },
 *     },
 *     savingsPercent: 30,
 *   }}
 *   showBreakdown={true}
 * />
 * ```
 */
export function TokenOptimizationDashboard({
  metrics,
  showBreakdown = true,
  realTime = false,
  refreshInterval = 5000,
  costPerToken: _costPerToken = 0.000002,
  className = '',
  onClick,
  isLoading = false,
  error = null,
}: TokenOptimizationDashboardProps) {
  const [displayMetrics, setDisplayMetrics] = React.useState(metrics)

  // Real-time updates
  React.useEffect(() => {
    if (!realTime) {
      setDisplayMetrics(metrics)
      return
    }

    const interval = setInterval(() => {
      setDisplayMetrics(metrics)
    }, refreshInterval)

    return () => clearInterval(interval)
  }, [metrics, realTime, refreshInterval])

  const formatNumber = (num: number) => num.toLocaleString()
  const formatCost = (cost: number) => {
    if (cost < 0.01) return `$${(cost * 100).toFixed(3)}¢`
    return `$${cost.toFixed(2)}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`p-6 bg-card rounded-lg border border-border/50 shadow-xs ${className}`}
        role="status"
        aria-label="Loading Token Optimization Dashboard"
        aria-busy="true"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-5 w-36 bg-muted rounded" />
              <div className="h-4 w-48 bg-muted/60 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 bg-muted/20 rounded-lg">
                <div className="h-8 w-20 bg-muted rounded mb-2" />
                <div className="h-4 w-16 bg-muted/60 rounded" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">Loading token optimization data...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return (
      <div
        className={`p-6 bg-card rounded-lg border border-destructive/30 shadow-xs ${className}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex flex-col items-center justify-center gap-3 text-center py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <svg
              className="h-5 w-5 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">
              Failed to load optimization data
            </p>
            <p className="text-xs text-muted-foreground">{errorMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`p-6 bg-card rounded-lg border border-border/50 shadow-xs ${className}`}
      onClick={onClick}
      role="region"
      aria-label="Token Optimization Dashboard"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Token Optimization
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time savings and efficiency metrics
          </p>
        </div>
        {realTime && (
          <div
            className="flex items-center gap-2 text-xs text-muted-foreground"
            role="status"
            aria-live="polite"
            aria-label="Real-time updates active"
          >
            <div
              className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              aria-hidden="true"
            />
            Live
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Tokens Saved */}
        <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
          <div className="text-2xl font-bold text-success">
            {formatNumber(displayMetrics.tokensSaved)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Tokens Saved</div>
          <div className="text-xs text-success mt-2">
            {displayMetrics.savingsPercent.toFixed(1)}% reduction
          </div>
        </div>

        {/* Cost Saved */}
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="text-2xl font-bold text-primary">
            {formatCost(displayMetrics.costSaved)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Cost Saved</div>
          <div className="text-xs text-primary mt-2">
            Per {formatNumber(displayMetrics.totalTokens)} tokens
          </div>
        </div>

        {/* Total Processed */}
        <div className="p-4 bg-muted border border-border rounded-lg">
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(displayMetrics.totalTokens)}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Total Tokens</div>
          <div className="text-xs text-muted-foreground mt-2">
            Processed in session
          </div>
        </div>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Optimization Breakdown
          </h4>

          {/* Prompt Compression */}
          {displayMetrics.breakdown.promptCompression.tokens > 0 && (
            <OptimizationItem
              label="Prompt Compression"
              value={formatNumber(
                displayMetrics.breakdown.promptCompression.tokens
              )}
              percent={displayMetrics.breakdown.promptCompression.percent}
              icon="✂️"
              description="Shortened prompts while preserving meaning"
            />
          )}

          {/* Caching */}
          {displayMetrics.breakdown.caching.hits > 0 && (
            <OptimizationItem
              label="Smart Caching"
              value={formatNumber(displayMetrics.breakdown.caching.savings)}
              percent={
                (displayMetrics.breakdown.caching.savings /
                  displayMetrics.totalTokens) *
                100
              }
              icon="💾"
              description={`${displayMetrics.breakdown.caching.hits} cache hits`}
            />
          )}

          {/* Model Routing */}
          {displayMetrics.breakdown.modelRouting.savings > 0 && (
            <OptimizationItem
              label="Model Routing"
              value={formatNumber(
                displayMetrics.breakdown.modelRouting.savings
              )}
              percent={displayMetrics.breakdown.modelRouting.percent}
              icon="🎯"
              description="Used cheaper models for simple queries"
            />
          )}

          {/* Response Limiting */}
          {displayMetrics.breakdown.responseLimiting.tokens > 0 && (
            <OptimizationItem
              label="Response Limiting"
              value={formatNumber(
                displayMetrics.breakdown.responseLimiting.tokens
              )}
              percent={displayMetrics.breakdown.responseLimiting.percent}
              icon="✨"
              description="Enforced concise responses"
            />
          )}

          {/* Batching */}
          {displayMetrics.breakdown.batching.requests > 0 && (
            <OptimizationItem
              label="Request Batching"
              value={formatNumber(displayMetrics.breakdown.batching.savings)}
              percent={
                (displayMetrics.breakdown.batching.savings /
                  displayMetrics.totalTokens) *
                100
              }
              icon="📦"
              description={`${displayMetrics.breakdown.batching.requests} requests batched`}
            />
          )}

          {/* Throttling */}
          {displayMetrics.breakdown.throttling.callsSaved > 0 && (
            <OptimizationItem
              label="Smart Throttling"
              value={`${displayMetrics.breakdown.throttling.callsSaved} calls`}
              percent={0}
              icon="⏱️"
              description="Prevented unnecessary API calls"
            />
          )}

          {/* Referencing */}
          {displayMetrics.breakdown.referencing.bytesSaved > 0 && (
            <OptimizationItem
              label="Reference Handling"
              value={`${(displayMetrics.breakdown.referencing.bytesSaved / 1024).toFixed(1)} KB`}
              percent={displayMetrics.breakdown.referencing.percent}
              icon="🔗"
              description="Used references instead of full data"
            />
          )}
        </div>
      )}

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Average savings per request
          </span>
          <span className="font-medium text-foreground">
            {displayMetrics.savingsPercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  )
}

interface OptimizationItemProps {
  label: string
  value: string
  percent: number
  icon: string
  description: string
}

function OptimizationItem({
  label,
  value,
  percent,
  icon,
  description,
}: OptimizationItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
      <div className="text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-sm font-semibold text-success">{value}</span>
        </div>
        <div className="text-xs text-muted-foreground">{description}</div>
        {percent > 0 && (
          <div className="mt-2">
            <div
              className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden"
              role="progressbar"
              aria-label={`${label} savings progress`}
              aria-valuenow={Math.round(Math.min(percent, 100))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuetext={`${Math.min(percent, 100).toFixed(1)}% savings`}
            >
              <div
                className="h-full bg-success transition-all duration-500"
                style={{ width: `${Math.min(percent, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
/**
 * Compact version for minimal UI (internal component)
 * Reserved for future use
 */

function TokenOptimizationCompactBadge({
  tokensSaved,
  savingsPercent,
  className = '',
}: {
  tokensSaved: number
  savingsPercent: number
  className?: string
}) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full ${className}`}
      role="status"
      aria-label={`${tokensSaved.toLocaleString()} tokens saved, ${savingsPercent.toFixed(1)}% savings`}
    >
      <svg
        className="w-4 h-4 text-success"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
      <span className="text-sm font-medium text-success">
        {tokensSaved.toLocaleString()} tokens saved ({savingsPercent.toFixed(1)}
        %)
      </span>
    </div>
  )
}

TokenOptimizationDashboard.displayName = 'TokenOptimizationDashboard'
OptimizationItem.displayName = 'OptimizationItem'
TokenOptimizationCompactBadge.displayName = 'TokenOptimizationCompactBadge'
