'use client'

import React from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'

/**
 * MessageBranch Component
 *
 * Enables navigation between different versions of regenerated AI responses.
 * Inspired by shadcn.io/ai and assistant-ui patterns.
 *
 * @example
 * ```tsx
 * <MessageBranch
 *   currentIndex={2}
 *   totalVersions={3}
 *   onNavigate={(index) => setCurrentVersion(index)}
 *   onRegenerate={() => regenerateMessage()}
 * />
 * ```
 */

export interface MessageBranchProps {
  /** Current version index (1-based for display) */
  currentIndex: number
  /** Total number of versions available */
  totalVersions: number
  /** Callback when navigating to a different version */
  onNavigate: (index: number) => void
  /** Optional callback to regenerate the current message */
  onRegenerate?: () => void
  /** Whether regeneration is in progress */
  isRegenerating?: boolean
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show regenerate button */
  showRegenerate?: boolean
  /** Pass Through API for styling internal elements */
  pt?: {
    root?: React.HTMLAttributes<HTMLDivElement>
    prevButton?: React.ButtonHTMLAttributes<HTMLButtonElement>
    nextButton?: React.ButtonHTMLAttributes<HTMLButtonElement>
    counter?: React.HTMLAttributes<HTMLSpanElement>
    regenerateButton?: React.ButtonHTMLAttributes<HTMLButtonElement>
  }
}

const sizeClasses = {
  sm: {
    button: 'h-6 w-6',
    icon: 'h-3 w-3',
    text: 'text-xs',
    gap: 'gap-1',
  },
  md: {
    button: 'h-8 w-8',
    icon: 'h-4 w-4',
    text: 'text-sm',
    gap: 'gap-1.5',
  },
  lg: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
    text: 'text-base',
    gap: 'gap-2',
  },
}

export function MessageBranch({
  currentIndex,
  totalVersions,
  onNavigate,
  onRegenerate,
  isRegenerating = false,
  className = '',
  size = 'md',
  showRegenerate = true,
  pt = {},
}: MessageBranchProps) {
  const sizes = sizeClasses[size]

  const canGoPrevious = currentIndex > 1
  const canGoNext = currentIndex < totalVersions

  const handlePrevious = () => {
    if (canGoPrevious) {
      onNavigate(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      onNavigate(currentIndex + 1)
    }
  }

  // Don't render if only one version
  if (totalVersions <= 1 && !showRegenerate) {
    return null
  }

  return (
    <div
      className={`
        inline-flex items-center ${sizes.gap} rounded-lg bg-muted/50 p-1
        ${className}
      `}
      role="group"
      aria-label="Message version navigation"
      {...pt.root}
    >
      {totalVersions > 1 && (
        <>
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`
              ${sizes.button} inline-flex items-center justify-center rounded-md
              transition-colors
              hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary/50
            `}
            aria-label="Previous version"
            {...pt.prevButton}
          >
            <ChevronLeft className={sizes.icon} />
          </button>

          {/* Counter */}
          <span
            className={`
              ${sizes.text} min-w-[3rem] text-center font-medium
              text-muted-foreground tabular-nums
            `}
            aria-live="polite"
            aria-atomic="true"
            {...pt.counter}
          >
            {currentIndex} / {totalVersions}
          </span>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canGoNext}
            className={`
              ${sizes.button} inline-flex items-center justify-center rounded-md
              transition-colors
              hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary/50
            `}
            aria-label="Next version"
            {...pt.nextButton}
          >
            <ChevronRight className={sizes.icon} />
          </button>
        </>
      )}

      {/* Regenerate Button */}
      {showRegenerate && onRegenerate && (
        <>
          {totalVersions > 1 && (
            <div className="w-px h-4 bg-border mx-1" aria-hidden="true" />
          )}
          <button
            type="button"
            onClick={onRegenerate}
            disabled={isRegenerating}
            className={`
              ${sizes.button} inline-flex items-center justify-center rounded-md
              transition-colors
              hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed
              focus:outline-none focus:ring-2 focus:ring-primary/50
            `}
            aria-label={
              isRegenerating ? 'Regenerating...' : 'Regenerate response'
            }
            {...pt.regenerateButton}
          >
            <RotateCcw
              className={`${sizes.icon} ${isRegenerating ? 'animate-spin' : ''}`}
            />
          </button>
        </>
      )}
    </div>
  )
}

export default MessageBranch
