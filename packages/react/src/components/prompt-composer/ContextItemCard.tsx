/**
 * ContextItemCard Component
 *
 * Displays a context item (@mention) with progressive expansion controls.
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { glassVariants } from '@clarity-chat/primitives/glass-variants'
import type { ContextItem } from '../../hooks/prompt-composer/types'

export interface ContextItemCardProps {
  item: ContextItem
  currentLevel?: 'summary' | 'preview' | 'full'
  onExpand?: (level: 'preview' | 'full') => void
  onRemove?: () => void
  className?: string
  compact?: boolean
}

/**
 * Context item card with expansion controls
 *
 * @example
 * ```tsx
 * <ContextItemCard
 *   item={contextItem}
 *   currentLevel="summary"
 *   onExpand={(level) => console.log('Expand to', level)}
 *   onRemove={() => console.log('Remove')}
 * />
 * ```
 */
export function ContextItemCard({
  item,
  currentLevel = 'summary',
  onExpand,
  onRemove,
  className,
  compact = false,
}: ContextItemCardProps) {
  const canExpandToPreview = currentLevel === 'summary' && item.preview
  const canExpandToFull =
    (currentLevel === 'summary' || currentLevel === 'preview') && item.full

  return (
    <div
      className={cn(
        'group flex items-start gap-2 p-2 rounded-lg transition-colors',
        glassVariants({
          intensity: 'medium',
          border: 'light',
        }),
        className
      )}
    >
      {/* Icon */}
      {item.icon && (
        <div className="flex-shrink-0 w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5">
          {item.icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1">
        {/* Label */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {item.label}
          </span>
          <span
            className={cn(
              'px-1.5 py-0.5 text-[10px] font-medium rounded',
              currentLevel === 'summary' &&
                'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
              currentLevel === 'preview' &&
                'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
              currentLevel === 'full' &&
                'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
            )}
          >
            {currentLevel}
          </span>
        </div>

        {/* Description */}
        {item.description && !compact && (
          <div className="text-xs text-gray-600 dark:text-gray-400">
            {item.description}
          </div>
        )}

        {/* Token Info */}
        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
          <span className="font-mono">{item.tokens[currentLevel]} tokens</span>
          {item.relevance !== undefined && (
            <span>
              Relevance: {(item.relevance * 100).toFixed(0)}%
            </span>
          )}
        </div>

        {/* Expansion Controls */}
        {!compact && (canExpandToPreview || canExpandToFull) && (
          <div className="flex items-center gap-2 pt-1">
            {canExpandToPreview && (
              <button
                onClick={() => onExpand?.('preview')}
                className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium"
              >
                Expand to Preview (+{item.tokens.preview - item.tokens.summary}{' '}
                tokens)
              </button>
            )}
            {canExpandToFull && (
              <button
                onClick={() => onExpand?.('full')}
                className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
              >
                Expand to Full (
                +
                {item.tokens.full -
                  (currentLevel === 'preview'
                    ? item.tokens.preview
                    : item.tokens.summary)}{' '}
                tokens)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Remove Button */}
      {onRemove && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove context item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  )
}

ContextItemCard.displayName = 'ContextItemCard'
