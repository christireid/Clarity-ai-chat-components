'use client'

/**
 * TokenBadge Component
 *
 * Displays real-time token count with utilization bar.
 */

import * as React from 'react'
import { cn } from '../../../../utils/cn'
import type { TokenStats } from '../types'

export interface TokenBadgeProps {
  /** Token statistics */
  stats: TokenStats
  /** Show detailed breakdown */
  showBreakdown?: boolean
  /** Compact mode */
  compact?: boolean
  /** Additional class name */
  className?: string
}

/**
 * Get status color based on utilization
 */
function getStatusColor(percent: number): {
  text: string
  bar: string
  label: string
} {
  if (percent >= 90) {
    return {
      text: 'text-red-600 dark:text-red-400',
      bar: 'bg-red-500',
      label: 'Critical',
    }
  }
  if (percent >= 70) {
    return {
      text: 'text-yellow-600 dark:text-yellow-400',
      bar: 'bg-yellow-500',
      label: 'Warning',
    }
  }
  return {
    text: 'text-muted-foreground',
    bar: 'bg-primary',
    label: 'OK',
  }
}

/**
 * Format number with K suffix for large numbers
 */
function formatTokenCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 10000) {
    return `${(count / 1000).toFixed(0)}K`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toLocaleString()
}

/**
 * Token count display with progress bar
 */
export function TokenBadge({
  stats,
  showBreakdown = false,
  compact = false,
  className,
}: TokenBadgeProps) {
  const {
    totalTokens,
    maxTokens,
    utilizationPercent,
    systemPromptTokens,
    userPromptTokens,
  } = stats
  const statusColor = getStatusColor(utilizationPercent)

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <span className={cn('text-xs font-mono', statusColor.text)}>
          ~{formatTokenCount(totalTokens)}
        </span>
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              statusColor.bar
            )}
            style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-2', className)}>
      {/* Main stats */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Tokens</span>
        <span className={cn('text-sm font-mono font-medium', statusColor.text)}>
          {formatTokenCount(totalTokens)} / {formatTokenCount(maxTokens)}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300', statusColor.bar)}
          style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
        />
      </div>

      {/* Utilization */}
      <div className="flex items-center justify-between text-xs">
        <span className={statusColor.text}>{statusColor.label}</span>
        <span className="text-muted-foreground">
          {utilizationPercent.toFixed(1)}% used
        </span>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <div className="pt-2 border-t border-border space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">System prompt</span>
            <span className="font-mono">
              {formatTokenCount(systemPromptTokens)}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">User prompt</span>
            <span className="font-mono">
              {formatTokenCount(userPromptTokens)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TokenBadge
