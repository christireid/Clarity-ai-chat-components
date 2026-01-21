/**
 * Token Optimization Badge Component
 *
 * Compact badge showing token savings and optimization status.
 * Perfect for headers, toolbars, or compact UIs.
 */

import * as React from 'react'
import type { TokenOptimizationStats } from '../../hooks/clarity-tokens/use-token-optimization-stats'
import { cn } from '@clarity-chat/primitives'
import { glassVariants, getSemanticGradient } from '@clarity-chat/primitives/glass-variants'

export interface TokenOptimizationBadgeProps {
  /** Statistics to display */
  stats: TokenOptimizationStats

  /** Show cost savings */
  showCost?: boolean

  /** Custom className */
  className?: string

  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Format number with commas
 */
function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`
  }
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
 * Token Optimization Badge component
 *
 * @example
 * ```tsx
 * const { stats } = useTokenOptimization({ enableCaching: true })
 *
 * <TokenOptimizationBadge stats={stats} showCost={true} />
 * ```
 */
export function TokenOptimizationBadge({
  stats,
  showCost = false,
  className,
  size = 'md',
}: TokenOptimizationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  }

  return (
    <div
      className={cn(
        glassVariants({
          intensity: 'subtle',
          gradient: getSemanticGradient('success'),
          border: 'medium',
          animated: 'glow',
          hover: 'glow',
        }),
        'inline-flex items-center gap-2.5 rounded-full',
        'animate-in fade-in slide-in-from-top-2 duration-300',
        sizeClasses[size],
        className
      )}
    >
      <svg
        className="h-4 w-4 text-success"
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
      <span className="font-semibold text-success">
        {formatNumber(stats.tokensSaved)} saved
      </span>
      {showCost && stats.costSavings > 0 && (
        <>
          <span className="text-muted-foreground/90">•</span>
          <span className="text-muted-foreground/90">
            {formatCost(stats.costSavings)}
          </span>
        </>
      )}
    </div>
  )
}
