/**
 * TokenBudgetIndicator Component
 *
 * Visualizes token usage with progressive context expansion details.
 * Shows token savings compared to traditional approaches.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { glassVariants } from '@clarity-chat/primitives/glass-variants'
import { calculateTokenSavings } from '../../hooks/prompt-composer/context-utils'
import type { ContextItem } from '../../hooks/prompt-composer/types'

export interface TokenBudgetIndicatorProps {
  current: number
  max: number
  contextItems?: ContextItem[]
  itemsIncluded?: Array<{
    id: string
    level: 'summary' | 'preview' | 'full'
    tokens: number
  }>
  className?: string
  showSavings?: boolean
  showBreakdown?: boolean
}

/**
 * Token budget indicator with progressive context visualization
 *
 * @example
 * ```tsx
 * <TokenBudgetIndicator
 *   current={2300}
 *   max={8000}
 *   contextItems={contextItems}
 *   showSavings
 *   showBreakdown
 * />
 * ```
 */
export function TokenBudgetIndicator({
  current,
  max,
  contextItems = [],
  itemsIncluded = [],
  className,
  showSavings = false,
  showBreakdown = false,
}: TokenBudgetIndicatorProps) {
  const usage = Math.min((current / max) * 100, 100)

  // Color based on usage
  const color = React.useMemo(() => {
    if (usage < 60) return 'green'
    if (usage < 80) return 'yellow'
    return 'red'
  }, [usage])

  // Calculate savings
  const savings = React.useMemo(() => {
    if (!showSavings || contextItems.length === 0) return null
    return calculateTokenSavings(contextItems, itemsIncluded)
  }, [showSavings, contextItems, itemsIncluded])

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-300',
              color === 'green' && 'bg-green-500',
              color === 'yellow' && 'bg-yellow-500',
              color === 'red' && 'bg-red-500'
            )}
            style={{ width: `${usage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[80px] text-right">
          {current.toLocaleString()}/{max.toLocaleString()}
        </span>
      </div>

      {/* Usage Percentage */}
      <div className="text-xs text-gray-600 dark:text-gray-400">
        {usage.toFixed(1)}% of token budget used
      </div>

      {/* Token Savings Display */}
      {savings && (
        <div
          className={cn(
            'p-3 rounded-lg',
            glassVariants({
              intensity: 'medium',
              gradient: 'green',
              border: 'light',
            })
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Token Savings
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              {savings.savedPercentage.toFixed(0)}%
            </span>
          </div>
          <div className="space-y-1 text-xs text-green-700 dark:text-green-300">
            <div className="flex justify-between">
              <span>Traditional:</span>
              <span className="font-mono">
                {savings.traditional.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex justify-between">
              <span>Clarity:</span>
              <span className="font-mono">
                {savings.clarity.toLocaleString()} tokens
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Saved:</span>
              <span className="font-mono">
                {savings.saved.toLocaleString()} tokens
              </span>
            </div>
            {savings.costSaved > 0 && (
              <div className="flex justify-between font-medium pt-1 border-t border-green-200 dark:border-green-800">
                <span>Cost Saved:</span>
                <span className="font-mono">
                  ${savings.costSaved.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Context Breakdown */}
      {showBreakdown && itemsIncluded.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
            Context Items
          </div>
          {itemsIncluded.map((item) => {
            const contextItem = contextItems.find((c) => c.id === item.id)
            if (!contextItem) return null

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs"
              >
                <span className="truncate flex-1">{contextItem.label}</span>
                <div className="flex items-center gap-2 ml-2">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-medium',
                      item.level === 'summary' &&
                        'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                      item.level === 'preview' &&
                        'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
                      item.level === 'full' &&
                        'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                    )}
                  >
                    {item.level}
                  </span>
                  <span className="font-mono text-gray-600 dark:text-gray-400">
                    {item.tokens}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

TokenBudgetIndicator.displayName = 'TokenBudgetIndicator'
