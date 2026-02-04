/**
 * StreamStatusProgress Component
 *
 * Visualizes streaming progress with multiple variants (bar, circular, text).
 * Pairs with useStreamStatus hook for comprehensive streaming tracking.
 *
 * Features:
 * - Multiple visual variants (bar, circular, text, minimal)
 * - Token count display
 * - Throughput visualization (tokens/second)
 * - Time remaining estimation
 * - Smooth animations with reduced motion support
 * - Full accessibility with ARIA attributes
 * - Responsive design
 *
 * @example
 * ```tsx
 * // Basic usage with bar variant
 * <StreamStatusProgress
 *   progress={65}
 *   tokens={{ received: 325, estimated: 500 }}
 * />
 *
 * // Circular variant
 * <StreamStatusProgress
 *   progress={progress}
 *   variant="circular"
 *   tokens={{ received: 150, estimated: 500, tokensPerSecond: 45 }}
 *   showThroughput
 * />
 *
 * // Text-only variant
 * <StreamStatusProgress
 *   progress={80}
 *   variant="text"
 *   showTimeRemaining
 *   timeRemaining={5000}
 * />
 * ```
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { AnimatedDots } from '../ui/AnimatedDots'
import {
  ProgressBar,
  CircularProgress,
  TokenCounter,
  StreamingIndicator,
  FieldStatusDisplay,
} from './components'
import { useStreamingProgress } from './hooks/useStreamingProgress'
import type {
  StreamStatusProgressProps,
  StreamStatusProgressWithFieldsProps,
} from './StreamingProgress.types'

// Re-export types
export type {
  StreamStatusTokens,
  StreamStatusProgressVariant,
  StreamStatusProgressSize,
  StreamStatusProgressColor,
  StreamStatusProgressProps,
  StreamStatusProgressWithFieldsProps,
  ColorClasses,
  SizeConfig,
  FieldStatus,
} from './StreamingProgress.types'

/**
 * StreamStatusProgress - Visualize streaming progress with statistics
 *
 * A versatile progress indicator for streaming operations with multiple
 * visual variants and comprehensive statistics display. Pairs with
 * useStreamStatus hook for full streaming state tracking.
 *
 * Note: This is different from the simpler StreamingProgress in ui/progress.tsx
 * which is just an animated dots indicator. This component provides full
 * progress tracking with tokens, time, and field-level status.
 */
export function StreamStatusProgress({
  progress,
  tokens,
  variant = 'bar',
  size = 'md',
  color = 'default',
  isStreaming = false,
  isComplete = false,
  hasError = false,
  showPercentage = true,
  showTokenCount = true,
  showThroughput = false,
  showTimeRemaining = false,
  timeRemaining,
  timeElapsed,
  showTimeToFirstToken = false,
  timeToFirstToken,
  label,
  thresholds = { warning: 80, error: 95 },
  disableAnimations = false,
  className,
  'aria-label': ariaLabel,
  onClick,
}: StreamStatusProgressProps) {
  const {
    prefersReducedMotion,
    safeProgress,
    colors,
    sizeConfig,
    accessibleLabel,
  } = useStreamingProgress({
    progress,
    color,
    size,
    hasError,
    thresholds,
    disableAnimations,
    tokens,
    ariaLabel,
  })

  // ==========================================================================
  // TEXT VARIANT
  // ==========================================================================

  if (variant === 'text') {
    return (
      <div
        className={cn('flex items-center', sizeConfig.gap, className)}
        role="progressbar"
        aria-valuenow={Math.round(safeProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        onClick={onClick}
      >
        {label && (
          <span className={cn('text-muted-foreground', sizeConfig.text)}>
            {label}
          </span>
        )}
        <span
          className={cn(
            'font-semibold tabular-nums',
            colors.text,
            sizeConfig.text
          )}
        >
          {Math.round(safeProgress)}%
        </span>
        {isStreaming && !prefersReducedMotion && (
          <AnimatedDots variant="fade" size={size === 'lg' ? 'md' : 'sm'} />
        )}
        {tokens && (
          <TokenCounter
            tokens={tokens}
            showTokenCount={showTokenCount}
            showThroughput={showThroughput}
            size={size}
            colors={colors}
            isStreaming={isStreaming}
          />
        )}
        <StreamingIndicator
          showTimeRemaining={showTimeRemaining}
          timeRemaining={timeRemaining}
          showTimeElapsed={!!timeElapsed}
          timeElapsed={timeElapsed}
          showTimeToFirstToken={showTimeToFirstToken}
          timeToFirstToken={timeToFirstToken}
          size={size}
          isComplete={isComplete}
        />
      </div>
    )
  }

  // ==========================================================================
  // MINIMAL VARIANT
  // ==========================================================================

  if (variant === 'minimal') {
    return (
      <div
        className={cn('inline-flex items-center', sizeConfig.gap, className)}
        role="progressbar"
        aria-valuenow={Math.round(safeProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        onClick={onClick}
      >
        <span
          className={cn(
            'font-medium tabular-nums',
            colors.text,
            sizeConfig.text
          )}
        >
          {Math.round(safeProgress)}%
        </span>
        {isStreaming && !prefersReducedMotion && (
          <AnimatedDots variant="fade" size="sm" />
        )}
      </div>
    )
  }

  // ==========================================================================
  // CIRCULAR VARIANT
  // ==========================================================================

  if (variant === 'circular') {
    return (
      <div
        className={cn('flex flex-col items-center', sizeConfig.gap, className)}
        role="progressbar"
        aria-valuenow={Math.round(safeProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={accessibleLabel}
        onClick={onClick}
      >
        {label && (
          <span className={cn('text-muted-foreground mb-1', sizeConfig.text)}>
            {label}
          </span>
        )}
        <CircularProgress
          progress={safeProgress}
          size={size}
          colors={colors}
          prefersReducedMotion={prefersReducedMotion}
          isStreaming={isStreaming}
          showPercentage={showPercentage}
        />
        {tokens && (
          <TokenCounter
            tokens={tokens}
            showTokenCount={showTokenCount}
            showThroughput={showThroughput}
            size={size}
            colors={colors}
            isStreaming={isStreaming}
          />
        )}
        <StreamingIndicator
          showTimeRemaining={showTimeRemaining}
          timeRemaining={timeRemaining}
          showTimeElapsed={!!timeElapsed}
          timeElapsed={timeElapsed}
          showTimeToFirstToken={showTimeToFirstToken}
          timeToFirstToken={timeToFirstToken}
          size={size}
          isComplete={isComplete}
        />
      </div>
    )
  }

  // ==========================================================================
  // BAR VARIANT (Default)
  // ==========================================================================

  return (
    <div
      className={cn('w-full', className)}
      role="progressbar"
      aria-valuenow={Math.round(safeProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={accessibleLabel}
      onClick={onClick}
    >
      {/* Header row */}
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className={cn('text-muted-foreground', sizeConfig.text)}>
              {label}
              {isStreaming && !prefersReducedMotion && (
                <AnimatedDots
                  variant="fade"
                  size="sm"
                  className="ml-1.5 inline-flex"
                />
              )}
            </span>
          )}
          {showPercentage && (
            <span
              className={cn(
                'font-semibold tabular-nums',
                colors.text,
                sizeConfig.text
              )}
            >
              {Math.round(safeProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <ProgressBar
        progress={safeProgress}
        size={size}
        colors={colors}
        prefersReducedMotion={prefersReducedMotion}
        isStreaming={isStreaming}
      />

      {/* Stats row */}
      {(tokens || showTimeRemaining || showTimeToFirstToken) && (
        <div
          className={cn(
            'flex items-center justify-between mt-1.5 flex-wrap',
            sizeConfig.gap
          )}
        >
          {tokens && (
            <TokenCounter
              tokens={tokens}
              showTokenCount={showTokenCount}
              showThroughput={showThroughput}
              size={size}
              colors={colors}
              isStreaming={isStreaming}
            />
          )}
          <StreamingIndicator
            showTimeRemaining={showTimeRemaining}
            timeRemaining={timeRemaining}
            showTimeElapsed={!!timeElapsed}
            timeElapsed={timeElapsed}
            showTimeToFirstToken={showTimeToFirstToken}
            timeToFirstToken={timeToFirstToken}
            size={size}
            isComplete={isComplete}
          />
        </div>
      )}
    </div>
  )
}

StreamStatusProgress.displayName = 'StreamStatusProgress'

/**
 * Extended StreamStatusProgress with per-field status display
 */
export function StreamStatusProgressWithFields({
  fieldStatus,
  showFieldProgress = true,
  ...props
}: StreamStatusProgressWithFieldsProps) {
  const { prefersReducedMotion } = useStreamingProgress({
    progress: props.progress,
    color: props.color,
    size: props.size,
    hasError: props.hasError || false,
    thresholds: props.thresholds || { warning: 80, error: 95 },
    disableAnimations: props.disableAnimations || false,
    tokens: props.tokens,
    ariaLabel: props['aria-label'],
  })

  return (
    <div className="space-y-3">
      <StreamStatusProgress {...props} />

      {showFieldProgress && fieldStatus && (
        <FieldStatusDisplay
          fieldStatus={fieldStatus}
          prefersReducedMotion={prefersReducedMotion}
        />
      )}
    </div>
  )
}

StreamStatusProgressWithFields.displayName = 'StreamStatusProgressWithFields'
