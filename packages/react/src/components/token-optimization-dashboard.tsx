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

  return (
    <div
      className={`p-6 bg-card rounded-lg border border-border/50 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)] ${className}`}
      onClick={onClick}
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
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
            <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        {tokensSaved.toLocaleString()} tokens saved ({savingsPercent.toFixed(1)}%)
      </span>
    </div>
  )
}
