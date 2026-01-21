/**
 * Token Optimization Panel Component
 *
 * Displays real-time token optimization statistics and controls.
 * Shows savings, cache performance, and optimization metrics.
 */

import * as React from 'react'
import type { TokenOptimizationStats } from '../../hooks/clarity-tokens/use-token-optimization-stats'
import { cn, glassVariants, getSemanticGradient } from '@clarity-chat/primitives'

export interface TokenOptimizationPanelProps {
  /** Statistics to display */
  stats: TokenOptimizationStats

  /** Show detailed breakdown */
  showDetails?: boolean

  /** Show cache performance */
  showCacheStats?: boolean

  /** Show routing stats */
  showRoutingStats?: boolean

  /** Custom className */
  className?: string

  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  return num.toLocaleString()
}

/**
 * Format cost in dollars
 */
function formatCost(cost: number): string {
  if (cost < 0.01) {
    return `$${(cost * 1000).toFixed(2)}`
  }
  return `$${cost.toFixed(2)}`
}

/**
 * Token Optimization Panel component
 *
 * @example
 * ```tsx
 * const { stats } = useTokenOptimization({ enableCaching: true })
 *
 * <TokenOptimizationPanel
 *   stats={stats}
 *   showDetails={true}
 *   showCacheStats={true}
 * />
 * ```
 */
export function TokenOptimizationPanel({
  stats,
  showDetails = true,
  showCacheStats = true,
  showRoutingStats = true,
  className,
  size = 'md',
}: TokenOptimizationPanelProps) {
  const cacheHitRate =
    stats.cacheHits + stats.cacheMisses > 0
      ? (stats.cacheHits / (stats.cacheHits + stats.cacheMisses)) * 100
      : 0

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  }

  return (
    <div
      className={cn(
        glassVariants({
          intensity: 'strong',
          gradient: getSemanticGradient('premium'),
          border: 'medium',
          animated: 'gradient',
        }),
        'rounded-xl p-6',
        sizeClasses[size],
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Token Optimization</h3>
        <div className="flex items-center gap-2">
          <span className="text-success font-medium">
            {formatNumber(stats.tokensSaved)} tokens saved
          </span>
          {stats.costSavings > 0 && (
            <span className="text-muted-foreground">
              ({formatCost(stats.costSavings)})
            </span>
          )}
        </div>
      </div>

      {/* Main stats with individual glass cards */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Tokens Saved - Green gradient for success */}
        <div
          className={cn(
            glassVariants({
              intensity: 'medium',
              gradient: getSemanticGradient('success'),
              border: 'light',
              hover: 'glow',
            }),
            'rounded-lg p-4'
          )}
        >
          <div className="text-muted-foreground text-xs">Tokens Saved</div>
          <div className="text-lg font-semibold text-success">
            {formatNumber(stats.tokensSaved)}
          </div>
          <div className="text-xs text-muted-foreground">
            {stats.percentageSaved.toFixed(1)}% reduction
          </div>
        </div>

        {/* Cache Stats - Amber gradient for cache/warning */}
        {showCacheStats && (
          <div
            className={cn(
              glassVariants({
                intensity: 'medium',
                gradient: getSemanticGradient('warning'),
                border: 'light',
                hover: 'glow',
              }),
              'rounded-lg p-4'
            )}
          >
            <div className="text-muted-foreground text-xs">Cache Hit Rate</div>
            <div className="text-lg font-semibold">
              {cacheHitRate.toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {stats.cacheHits} hits / {stats.cacheMisses} misses
            </div>
          </div>
        )}
      </div>

      {/* Detailed breakdown */}
      {showDetails && (
        <div className="space-y-2 border-t pt-4">
          {/* Cache performance */}
          {showCacheStats && stats.cacheHits + stats.cacheMisses > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cache Performance</span>
              <span className="font-medium">
                {stats.cacheHits} / {stats.cacheHits + stats.cacheMisses} hits
              </span>
            </div>
          )}

          {/* Throttling */}
          {stats.requestsThrottled > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Requests Throttled</span>
              <span className="font-medium">{stats.requestsThrottled}</span>
            </div>
          )}

          {/* Model routing */}
          {showRoutingStats &&
            stats.simpleModelRoutes + stats.complexModelRoutes > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Model Routing</span>
                <span className="font-medium">
                  {stats.simpleModelRoutes} simple / {stats.complexModelRoutes}{' '}
                  complex
                </span>
              </div>
            )}

          {/* Cost savings */}
          {stats.costSavings > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Cost Savings</span>
              <span className="font-medium text-success">
                {formatCost(stats.costSavings)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
