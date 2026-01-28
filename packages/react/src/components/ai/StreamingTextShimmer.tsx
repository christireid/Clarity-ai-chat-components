'use client'

/**
 * StreamingTextShimmer Component
 *
 * Applies a shimmer animation effect to streaming text content.
 * Inspired by prompt-kit's text-shimmer pattern - this is for actual text,
 * not placeholder/skeleton loading states.
 *
 * Unlike TextShimmer (which shows placeholder lines), this component wraps
 * actual text content and applies a gradient shimmer animation during streaming.
 *
 * @example
 * ```tsx
 * // Basic streaming text with shimmer
 * <StreamingTextShimmer isStreaming={true}>
 *   {streamingContent}
 * </StreamingTextShimmer>
 *
 * // With custom speed
 * <StreamingTextShimmer isStreaming={true} speed="fast">
 *   {content}
 * </StreamingTextShimmer>
 *
 * // Primary colored shimmer
 * <StreamingTextShimmer isStreaming={true} variant="primary">
 *   Processing your request...
 * </StreamingTextShimmer>
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { cn, useReducedMotion } from '@clarity-chat/primitives'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Shimmer speed presets
 */
export type StreamingTextShimmerSpeed = 'slow' | 'normal' | 'fast'

/**
 * Shimmer color variants
 */
export type StreamingTextShimmerVariant = 'default' | 'primary' | 'muted'

/**
 * Props for StreamingTextShimmer component
 */
export interface StreamingTextShimmerProps {
  /** Text content to display */
  children: React.ReactNode
  /** Whether streaming is active (enables shimmer) */
  isStreaming?: boolean
  /** Animation speed (default: 'normal') */
  speed?: StreamingTextShimmerSpeed
  /** Color variant (default: 'default') */
  variant?: StreamingTextShimmerVariant
  /** Additional CSS class */
  className?: string
  /** Show blinking cursor at the end */
  showCursor?: boolean
  /** Cursor character (default: '▋') */
  cursorChar?: string
  /** Disable shimmer animation (shows static text) */
  disableAnimation?: boolean
  /** Accessible label */
  'aria-label'?: string
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Speed class mapping
 */
const SPEED_CLASSES: Record<StreamingTextShimmerSpeed, string> = {
  slow: 'text-shimmer-slow',
  normal: '',
  fast: 'text-shimmer-fast',
}

/**
 * Variant class mapping
 */
const VARIANT_CLASSES: Record<StreamingTextShimmerVariant, string> = {
  default: 'text-shimmer',
  primary: 'text-shimmer text-shimmer-primary',
  muted: '',
}

// =============================================================================
// STREAMING CURSOR COMPONENT
// =============================================================================

interface StreamingCursorProps {
  char?: string
  className?: string
}

const StreamingCursor = React.memo(function StreamingCursor({
  char = '▋',
  className,
}: StreamingCursorProps) {
  return (
    <span
      className={cn('message-cursor', className)}
      aria-hidden="true"
    >
      {char}
    </span>
  )
})

StreamingCursor.displayName = 'StreamingCursor'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * StreamingTextShimmer - Apply shimmer animation to streaming text
 *
 * A component that wraps text content and applies a gradient shimmer
 * animation effect during streaming. Perfect for indicating that content
 * is being generated in real-time.
 *
 * Features:
 * - Gradient shimmer animation across text
 * - Multiple speed presets (slow, normal, fast)
 * - Color variants (default, primary, muted)
 * - Optional blinking cursor
 * - Respects prefers-reduced-motion
 * - Accessible with ARIA attributes
 */
export function StreamingTextShimmer({
  children,
  isStreaming = false,
  speed = 'normal',
  variant = 'default',
  className,
  showCursor = true,
  cursorChar,
  disableAnimation = false,
  'aria-label': ariaLabel,
}: StreamingTextShimmerProps) {
  const prefersReducedMotion = useReducedMotion()

  // Determine if shimmer should be active
  const shouldShimmer = isStreaming && !disableAnimation && !prefersReducedMotion

  // Build class names
  const shimmerClasses = shouldShimmer
    ? cn(VARIANT_CLASSES[variant], SPEED_CLASSES[speed])
    : ''

  return (
    <span
      className={cn(
        'streaming-text',
        shimmerClasses,
        className
      )}
      role={isStreaming ? 'status' : undefined}
      aria-live={isStreaming ? 'polite' : undefined}
      aria-busy={isStreaming}
      aria-label={ariaLabel}
    >
      {children}
      {isStreaming && showCursor && (
        <StreamingCursor char={cursorChar} />
      )}
    </span>
  )
}

StreamingTextShimmer.displayName = 'StreamingTextShimmer'

// =============================================================================
// CONVENIENCE EXPORTS
// =============================================================================

/**
 * Re-export cursor for standalone use
 */
export { StreamingCursor }

/**
 * Hook for managing streaming text shimmer state
 */
export interface UseStreamingShimmerOptions {
  /** Auto-disable shimmer after timeout (ms) */
  timeout?: number
  /** Initial streaming state */
  initialStreaming?: boolean
}

export interface UseStreamingShimmerReturn {
  /** Whether streaming is active */
  isStreaming: boolean
  /** Start streaming */
  startStreaming: () => void
  /** Stop streaming */
  stopStreaming: () => void
  /** Toggle streaming state */
  toggleStreaming: () => void
  /** Props to spread on StreamingTextShimmer */
  shimmerProps: { isStreaming: boolean }
}

export function useStreamingShimmer({
  timeout,
  initialStreaming = false,
}: UseStreamingShimmerOptions = {}): UseStreamingShimmerReturn {
  const [isStreaming, setIsStreaming] = React.useState(initialStreaming)
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

  const clearTimeoutRef = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [])

  const startStreaming = React.useCallback(() => {
    clearTimeoutRef()
    setIsStreaming(true)

    if (timeout) {
      timeoutRef.current = setTimeout(() => {
        setIsStreaming(false)
      }, timeout)
    }
  }, [timeout, clearTimeoutRef])

  const stopStreaming = React.useCallback(() => {
    clearTimeoutRef()
    setIsStreaming(false)
  }, [clearTimeoutRef])

  const toggleStreaming = React.useCallback(() => {
    setIsStreaming((prev) => !prev)
  }, [])

  // Cleanup on unmount
  React.useEffect(() => {
    return clearTimeoutRef
  }, [clearTimeoutRef])

  return {
    isStreaming,
    startStreaming,
    stopStreaming,
    toggleStreaming,
    shimmerProps: { isStreaming },
  }
}
