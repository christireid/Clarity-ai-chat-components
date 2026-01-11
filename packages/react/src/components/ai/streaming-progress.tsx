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
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import {
  DURATION_SECONDS as durations,
  EASING_FRAMER,
} from '../../animations/constants'
import { AnimatedDots } from '../ui/animated-dots'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Token information for display
 */
export interface StreamStatusTokens {
  /** Tokens received so far */
  received: number
  /** Estimated total tokens (optional) */
  estimated?: number
  /** Tokens per second throughput (optional) */
  tokensPerSecond?: number
}

/**
 * Visual variant of the progress component
 */
export type StreamStatusProgressVariant = 'bar' | 'circular' | 'text' | 'minimal'

/**
 * Size variant
 */
export type StreamStatusProgressSize = 'sm' | 'md' | 'lg'

/**
 * Color variant based on status
 */
export type StreamStatusProgressColor = 'default' | 'success' | 'warning' | 'error' | 'auto'

/**
 * Props for StreamStatusProgress component
 */
export interface StreamStatusProgressProps {
  /** Progress percentage (0-100) */
  progress: number
  /** Token information */
  tokens?: StreamStatusTokens
  /** Visual variant */
  variant?: StreamStatusProgressVariant
  /** Size variant */
  size?: StreamStatusProgressSize
  /** Color variant */
  color?: StreamStatusProgressColor
  /** Whether streaming is active */
  isStreaming?: boolean
  /** Whether streaming is complete */
  isComplete?: boolean
  /** Whether an error occurred */
  hasError?: boolean
  /** Show percentage text */
  showPercentage?: boolean
  /** Show token count */
  showTokenCount?: boolean
  /** Show throughput (tokens/second) */
  showThroughput?: boolean
  /** Show time remaining */
  showTimeRemaining?: boolean
  /** Time remaining in milliseconds */
  timeRemaining?: number
  /** Time elapsed in milliseconds */
  timeElapsed?: number
  /** Show time to first token */
  showTimeToFirstToken?: boolean
  /** Time to first token in milliseconds */
  timeToFirstToken?: number
  /** Custom label */
  label?: string
  /** Thresholds for auto color */
  thresholds?: { warning: number; error: number }
  /** Disable animations */
  disableAnimations?: boolean
  /** Custom class name */
  className?: string
  /** Accessible label */
  'aria-label'?: string
  /** Callback when progress bar is clicked */
  onClick?: () => void
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format time in milliseconds to human-readable string
 */
function formatTime(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}

/**
 * Format token count with K/M suffix for large numbers
 */
function formatTokenCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(2)}M`
}

/**
 * Get color classes based on variant and progress
 */
function getColorClasses(
  color: StreamStatusProgressColor,
  progress: number,
  thresholds: { warning: number; error: number },
  hasError: boolean
): { bg: string; text: string; fill: string } {
  if (hasError) {
    return {
      bg: 'bg-destructive/20',
      text: 'text-destructive',
      fill: 'bg-destructive',
    }
  }

  if (color === 'auto') {
    if (progress >= thresholds.error) {
      return {
        bg: 'bg-destructive/20',
        text: 'text-destructive',
        fill: 'bg-destructive',
      }
    }
    if (progress >= thresholds.warning) {
      return {
        bg: 'bg-warning/20',
        text: 'text-warning',
        fill: 'bg-warning',
      }
    }
    return {
      bg: 'bg-primary/20',
      text: 'text-primary',
      fill: 'bg-primary',
    }
  }

  switch (color) {
    case 'success':
      return {
        bg: 'bg-success/20',
        text: 'text-success',
        fill: 'bg-success',
      }
    case 'warning':
      return {
        bg: 'bg-warning/20',
        text: 'text-warning',
        fill: 'bg-warning',
      }
    case 'error':
      return {
        bg: 'bg-destructive/20',
        text: 'text-destructive',
        fill: 'bg-destructive',
      }
    default:
      return {
        bg: 'bg-primary/20',
        text: 'text-primary',
        fill: 'bg-primary',
      }
  }
}

// =============================================================================
// SIZE CONFIGURATION
// =============================================================================

const SIZE_CONFIG = {
  sm: {
    bar: 'h-1.5',
    circular: 32,
    strokeWidth: 3,
    text: 'text-xs',
    gap: 'gap-1.5',
    padding: 'px-2 py-1',
  },
  md: {
    bar: 'h-2',
    circular: 48,
    strokeWidth: 4,
    text: 'text-sm',
    gap: 'gap-2',
    padding: 'px-3 py-1.5',
  },
  lg: {
    bar: 'h-3',
    circular: 64,
    strokeWidth: 5,
    text: 'text-base',
    gap: 'gap-3',
    padding: 'px-4 py-2',
  },
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Bar progress indicator
 */
interface BarProgressProps {
  progress: number
  size: StreamStatusProgressSize
  colors: ReturnType<typeof getColorClasses>
  prefersReducedMotion: boolean
  isStreaming: boolean
}

const BarProgress: React.FC<BarProgressProps> = ({
  progress,
  size,
  colors,
  prefersReducedMotion,
  isStreaming,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full',
        colors.bg,
        sizeConfig.bar
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{
          duration: prefersReducedMotion ? 0.1 : durations.normal,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          'h-full rounded-full transition-colors',
          colors.fill,
          isStreaming && !prefersReducedMotion && 'animate-pulse'
        )}
      />
      {/* Shimmer effect for streaming */}
      {isStreaming && !prefersReducedMotion && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      )}
    </div>
  )
}

/**
 * Circular progress indicator
 */
interface CircularProgressProps {
  progress: number
  size: StreamStatusProgressSize
  colors: ReturnType<typeof getColorClasses>
  prefersReducedMotion: boolean
  isStreaming: boolean
  showPercentage: boolean
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  progress,
  size,
  colors,
  prefersReducedMotion,
  isStreaming,
  showPercentage,
}) => {
  const sizeConfig = SIZE_CONFIG[size]
  const circleSize = sizeConfig.circular
  const strokeWidth = sizeConfig.strokeWidth
  const radius = (circleSize - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: circleSize, height: circleSize }}
    >
      <svg
        className="transform -rotate-90"
        width={circleSize}
        height={circleSize}
      >
        {/* Background circle */}
        <circle
          className={cn(
            'transition-colors',
            colors.bg.replace('bg-', 'stroke-').replace('/20', '/40')
          )}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: prefersReducedMotion ? 0.1 : durations.normal,
            ease: EASING_FRAMER.out,
          }}
          className={cn(
            'transition-colors',
            colors.fill.replace('bg-', 'stroke-')
          )}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={circleSize / 2}
          cy={circleSize / 2}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showPercentage && (
        <span
          className={cn(
            'absolute font-semibold tabular-nums',
            colors.text,
            size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'
          )}
        >
          {Math.round(progress)}
        </span>
      )}
      {/* Spinning indicator for streaming */}
      {isStreaming && !prefersReducedMotion && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: durations.slower,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(transparent 0deg, transparent 270deg, currentColor 360deg)`,
            opacity: 0.3,
          }}
        />
      )}
    </div>
  )
}

/**
 * Token stats display
 */
interface TokenStatsProps {
  tokens: StreamStatusTokens
  showTokenCount: boolean
  showThroughput: boolean
  size: StreamStatusProgressSize
  colors: ReturnType<typeof getColorClasses>
  isStreaming: boolean
}

const TokenStats: React.FC<TokenStatsProps> = ({
  tokens,
  showTokenCount,
  showThroughput,
  size,
  colors,
  isStreaming,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  return (
    <div className={cn('flex items-center flex-wrap', sizeConfig.gap, sizeConfig.text)}>
      {showTokenCount && (
        <span className="text-muted-foreground tabular-nums">
          <span className={cn('font-medium', colors.text)}>
            {formatTokenCount(tokens.received)}
          </span>
          {tokens.estimated && (
            <>
              <span className="mx-0.5">/</span>
              <span>{formatTokenCount(tokens.estimated)}</span>
            </>
          )}
          <span className="ml-1">tokens</span>
        </span>
      )}
      {showThroughput && tokens.tokensPerSecond !== undefined && (
        <span className="text-muted-foreground/80 tabular-nums">
          {tokens.tokensPerSecond.toFixed(1)} tok/s
          {isStreaming && <AnimatedDots variant="fade" size="sm" className="ml-1 inline-flex" />}
        </span>
      )}
    </div>
  )
}

/**
 * Time stats display
 */
interface TimeStatsProps {
  showTimeRemaining: boolean
  timeRemaining?: number
  showTimeElapsed?: boolean
  timeElapsed?: number
  showTimeToFirstToken: boolean
  timeToFirstToken?: number
  size: StreamStatusProgressSize
  isComplete: boolean
}

const TimeStats: React.FC<TimeStatsProps> = ({
  showTimeRemaining,
  timeRemaining,
  showTimeElapsed,
  timeElapsed,
  showTimeToFirstToken,
  timeToFirstToken,
  size,
  isComplete,
}) => {
  const sizeConfig = SIZE_CONFIG[size]

  const items: { label: string; value: string }[] = []

  if (showTimeRemaining && timeRemaining !== undefined && !isComplete) {
    items.push({ label: 'Remaining', value: formatTime(timeRemaining) })
  }

  if (showTimeElapsed && timeElapsed !== undefined) {
    items.push({ label: 'Elapsed', value: formatTime(timeElapsed) })
  }

  if (showTimeToFirstToken && timeToFirstToken !== undefined) {
    items.push({ label: 'TTFT', value: formatTime(timeToFirstToken) })
  }

  if (items.length === 0) return null

  return (
    <div className={cn('flex items-center flex-wrap', sizeConfig.gap, sizeConfig.text)}>
      {items.map((item, index) => (
        <span key={item.label} className="text-muted-foreground/70 tabular-nums">
          {index > 0 && <span className="mx-1.5">|</span>}
          <span className="text-muted-foreground/50">{item.label}:</span>{' '}
          <span className="font-medium">{item.value}</span>
        </span>
      ))}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

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
  const prefersReducedMotion = useReducedMotion() || disableAnimations

  // Guard against invalid values
  const safeProgress = Number.isFinite(progress)
    ? Math.min(Math.max(progress, 0), 100)
    : 0

  const colors = getColorClasses(color, safeProgress, thresholds, hasError)
  const sizeConfig = SIZE_CONFIG[size]

  // Accessibility label
  const accessibleLabel =
    ariaLabel ||
    `Streaming progress: ${Math.round(safeProgress)}%${tokens ? `, ${tokens.received} tokens received` : ''}`

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
          <span className={cn('text-muted-foreground', sizeConfig.text)}>{label}</span>
        )}
        <span className={cn('font-semibold tabular-nums', colors.text, sizeConfig.text)}>
          {Math.round(safeProgress)}%
        </span>
        {isStreaming && !prefersReducedMotion && (
          <AnimatedDots variant="fade" size={size === 'lg' ? 'md' : 'sm'} />
        )}
        {tokens && (
          <TokenStats
            tokens={tokens}
            showTokenCount={showTokenCount}
            showThroughput={showThroughput}
            size={size}
            colors={colors}
            isStreaming={isStreaming}
          />
        )}
        <TimeStats
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
        <span className={cn('font-medium tabular-nums', colors.text, sizeConfig.text)}>
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
          <TokenStats
            tokens={tokens}
            showTokenCount={showTokenCount}
            showThroughput={showThroughput}
            size={size}
            colors={colors}
            isStreaming={isStreaming}
          />
        )}
        <TimeStats
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
                <AnimatedDots variant="fade" size="sm" className="ml-1.5 inline-flex" />
              )}
            </span>
          )}
          {showPercentage && (
            <span className={cn('font-semibold tabular-nums', colors.text, sizeConfig.text)}>
              {Math.round(safeProgress)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar */}
      <BarProgress
        progress={safeProgress}
        size={size}
        colors={colors}
        prefersReducedMotion={prefersReducedMotion}
        isStreaming={isStreaming}
      />

      {/* Stats row */}
      {(tokens || showTimeRemaining || showTimeToFirstToken) && (
        <div className={cn('flex items-center justify-between mt-1.5 flex-wrap', sizeConfig.gap)}>
          {tokens && (
            <TokenStats
              tokens={tokens}
              showTokenCount={showTokenCount}
              showThroughput={showThroughput}
              size={size}
              colors={colors}
              isStreaming={isStreaming}
            />
          )}
          <TimeStats
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

// =============================================================================
// COMPOUND COMPONENTS
// =============================================================================

/**
 * Streaming progress with field status display
 */
export interface StreamStatusProgressWithFieldsProps extends StreamStatusProgressProps {
  /** Per-field status map */
  fieldStatus?: Map<string, {
    name: string
    status: 'pending' | 'streaming' | 'complete' | 'error'
    tokensReceived: number
    progress: number
    error?: string
  }>
  /** Show field progress bars */
  showFieldProgress?: boolean
}

/**
 * Extended StreamStatusProgress with per-field status display
 */
export function StreamStatusProgressWithFields({
  fieldStatus,
  showFieldProgress = true,
  ...props
}: StreamStatusProgressWithFieldsProps) {
  const prefersReducedMotion = useReducedMotion() || props.disableAnimations

  const fieldArray = fieldStatus ? Array.from(fieldStatus.values()) : []

  return (
    <div className="space-y-3">
      <StreamStatusProgress {...props} />

      {showFieldProgress && fieldArray.length > 0 && (
        <div className="space-y-2 mt-3 pl-2 border-l-2 border-border/40">
          <AnimatePresence>
            {fieldArray.map((field) => {
              const statusColors = {
                pending: 'bg-muted/40',
                streaming: 'bg-primary',
                complete: 'bg-success',
                error: 'bg-destructive',
              }

              const statusTextColors = {
                pending: 'text-muted-foreground',
                streaming: 'text-primary',
                complete: 'text-success',
                error: 'text-destructive',
              }

              return (
                <motion.div
                  key={field.name}
                  initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -8 }}
                  className="flex items-center gap-2"
                >
                  {/* Status indicator dot */}
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full flex-shrink-0',
                      statusColors[field.status],
                      field.status === 'streaming' && !prefersReducedMotion && 'animate-pulse'
                    )}
                  />

                  {/* Field name */}
                  <span
                    className={cn(
                      'text-xs font-medium capitalize',
                      statusTextColors[field.status]
                    )}
                  >
                    {field.name}
                  </span>

                  {/* Mini progress bar */}
                  {field.status === 'streaming' && (
                    <div className="flex-1 h-1 rounded-full bg-primary/20 overflow-hidden max-w-24">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${field.progress}%` }}
                        className="h-full bg-primary rounded-full"
                        transition={{
                          duration: prefersReducedMotion ? 0.1 : 0.3,
                          ease: 'easeOut',
                        }}
                      />
                    </div>
                  )}

                  {/* Token count */}
                  {field.tokensReceived > 0 && (
                    <span className="text-xs text-muted-foreground/70 tabular-nums">
                      {formatTokenCount(field.tokensReceived)}
                    </span>
                  )}

                  {/* Streaming dots */}
                  {field.status === 'streaming' && !prefersReducedMotion && (
                    <AnimatedDots variant="fade" size="sm" />
                  )}

                  {/* Error indicator */}
                  {field.status === 'error' && field.error && (
                    <span className="text-xs text-destructive truncate max-w-32" title={field.error}>
                      {field.error}
                    </span>
                  )}

                  {/* Complete checkmark */}
                  {field.status === 'complete' && (
                    <svg
                      className="w-3 h-3 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

StreamStatusProgressWithFields.displayName = 'StreamStatusProgressWithFields'
