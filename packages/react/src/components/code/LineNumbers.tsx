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
        'select-none text-right py-4 font-mono text-[11px] font-medium leading-relaxed tracking-tight',
        // Dark glassmorphism background
        'bg-[#0b1219e6] backdrop-blur-md',
        // Refined border
        'border-r border-[#ffffff0a]',
        // Subtle text color
        'text-[#445b70]',
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
              'px-3 transition-all duration-150 relative min-h-[1.75rem] flex items-center justify-end',
              // Highlighted line
              isHighlighted &&
                'text-[#d6deeb] bg-[#82aaff15] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#82aaff]',
              // Diff: added line
              isAdded &&
                'text-[#addb67] bg-[#addb6715] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#addb67]',
              // Diff: removed line
              isRemoved &&
                'text-[#ef5350] bg-[#ef535015] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#ef5350]'
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
