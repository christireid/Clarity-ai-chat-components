'use client'

import * as React from 'react'
import { cn } from '../../utils/cn'

/**
 * LineNumbers Component Props
 */
export interface LineNumbersProps {
  /** Total number of lines */
  count: number
  /** Starting line number (default: 1) */
  startFrom?: number
  /** Set of highlighted line numbers */
  highlightedLines?: Set<number>
  /** Set of added line numbers (diff) */
  addedLines?: Set<number>
  /** Set of removed line numbers (diff) */
  removedLines?: Set<number>
  /** Additional CSS class */
  className?: string
}

/**
 * LineNumbers Component
 *
 * Renders a vertical gutter of line numbers for code blocks.
 * Supports highlighting specific lines and diff visualization.
 *
 * @example
 * ```tsx
 * <LineNumbers
 *   count={10}
 *   startFrom={1}
 *   highlightedLines={new Set([2, 5])}
 * />
 * ```
 */
export const LineNumbers = React.memo<LineNumbersProps>(function LineNumbers({
  count,
  startFrom = 1,
  highlightedLines,
  addedLines,
  removedLines,
  className,
}) {
  // Generate array of line numbers
  const lines = React.useMemo(
    () => Array.from({ length: count }, (_, i) => startFrom + i),
    [count, startFrom]
  )

  // Calculate the width needed for the largest line number
  const maxLineNumber = startFrom + count - 1
  const digitCount = String(maxLineNumber).length
  const minWidth = `${Math.max(digitCount, 2)}ch`

  return (
    <div
      className={cn(
        // Base styles
        'select-none text-right py-4 font-mono text-sm leading-relaxed',
        // Border and background
        'border-r border-border/50 bg-muted/20',
        // Text color
        'text-muted-foreground/70',
        className
      )}
      style={{ minWidth }}
      aria-hidden="true"
      role="presentation"
    >
      {lines.map((lineNum) => {
        const isHighlighted = highlightedLines?.has(lineNum)
        const isAdded = addedLines?.has(lineNum)
        const isRemoved = removedLines?.has(lineNum)

        return (
          <div
            key={lineNum}
            className={cn(
              'px-3 transition-colors duration-150',
              // Highlighted line
              isHighlighted && 'text-muted-foreground bg-primary/10',
              // Diff: added line
              isAdded && 'text-green-600 dark:text-green-400 bg-green-500/10',
              // Diff: removed line
              isRemoved && 'text-red-600 dark:text-red-400 bg-red-500/10'
            )}
          >
            {lineNum}
          </div>
        )
      })}
    </div>
  )
})

LineNumbers.displayName = 'LineNumbers'

export default LineNumbers
