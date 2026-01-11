/**
 * ThinkingBar Component
 *
 * Shows AI processing status with an animated progress bar.
 * Inspired by Prompt-Kit's Thinking Bar pattern, adapted to Clarity's design system.
 *
 * Features:
 * - Multiple status states: thinking, searching, generating, complete
 * - Animated progress bar with smooth transitions
 * - Three visual variants: default, minimal, detailed
 * - Customizable messages
 * - Full accessibility with ARIA live regions
 * - Respects reduced motion preferences
 * - Keyboard accessible
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ThinkingBar status="thinking" />
 *
 * // With custom message and progress
 * <ThinkingBar
 *   status="searching"
 *   message="Searching knowledge base..."
 *   progress={45}
 * />
 *
 * // Minimal variant
 * <ThinkingBar
 *   status="generating"
 *   variant="minimal"
 * />
 *
 * // Detailed variant with all information
 * <ThinkingBar
 *   status="thinking"
 *   message="Analyzing your query..."
 *   progress={30}
 *   variant="detailed"
 *   estimatedTime={5}
 * />
 * ```
 *
 * @packageDocumentation
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
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
 * Processing status states
 */
export type ThinkingBarStatus =
  | 'idle'
  | 'thinking'
  | 'searching'
  | 'generating'
  | 'complete'
  | 'error'

/**
 * Visual variant of the component
 */
export type ThinkingBarVariant = 'default' | 'minimal' | 'detailed'

/**
 * Props for the ThinkingBar component
 */
export interface ThinkingBarProps {
  /** Current processing status */
  status: ThinkingBarStatus
  /** Custom message to display (overrides default status message) */
  message?: string
  /** Progress percentage (0-100) */
  progress?: number
  /** Visual variant */
  variant?: ThinkingBarVariant
  /** Estimated time remaining in seconds */
  estimatedTime?: number
  /** Additional CSS classes */
  className?: string
  /** Custom class for the progress bar */
  progressClassName?: string
  /** Whether to show the animated dots */
  showDots?: boolean
  /** Whether to animate the progress bar (indeterminate mode when no progress provided) */
  indeterminate?: boolean
  /** Callback when complete status is reached */
  onComplete?: () => void
  /** Accessible label override */
  'aria-label'?: string
  /** Disable all animations */
  disableAnimations?: boolean
  /** Custom icon override */
  icon?: React.ReactNode
}

/**
 * Options for useThinkingBar hook
 */
export interface UseThinkingBarOptions {
  /** Initial status */
  initialStatus?: ThinkingBarStatus
  /** Auto-complete after this duration (ms) */
  autoCompleteAfter?: number
  /** Callback when status changes */
  onStatusChange?: (status: ThinkingBarStatus) => void
}

/**
 * Return type for useThinkingBar hook
 */
export interface UseThinkingBarReturn {
  /** Current status */
  status: ThinkingBarStatus
  /** Current progress (0-100) */
  progress: number
  /** Current message */
  message: string | undefined
  /** Set status */
  setStatus: (status: ThinkingBarStatus) => void
  /** Set progress */
  setProgress: (progress: number) => void
  /** Set message */
  setMessage: (message: string | undefined) => void
  /** Start thinking (sets status to thinking and resets progress) */
  startThinking: (message?: string) => void
  /** Start searching */
  startSearching: (message?: string) => void
  /** Start generating */
  startGenerating: (message?: string) => void
  /** Complete (sets status to complete and progress to 100) */
  complete: (message?: string) => void
  /** Set error */
  setError: (message?: string) => void
  /** Reset to idle */
  reset: () => void
  /** Whether currently processing */
  isProcessing: boolean
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

interface StatusConfig {
  label: string
  icon: React.ReactNode
  barColor: string
  bgColor: string
  textColor: string
  borderColor: string
}

const STATUS_ICONS = {
  idle: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  thinking: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  ),
  searching: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  ),
  generating: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  ),
  complete: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
}

const STATUS_CONFIG: Record<ThinkingBarStatus, StatusConfig> = {
  idle: {
    label: 'Ready',
    icon: STATUS_ICONS.idle,
    barColor: 'bg-muted',
    bgColor: 'bg-muted/20',
    textColor: 'text-muted-foreground',
    borderColor: 'border-muted/50',
  },
  thinking: {
    label: 'Thinking',
    icon: STATUS_ICONS.thinking,
    barColor: 'bg-primary',
    bgColor: 'bg-primary/5',
    textColor: 'text-primary',
    borderColor: 'border-primary/30',
  },
  searching: {
    label: 'Searching',
    icon: STATUS_ICONS.searching,
    barColor: 'bg-info',
    bgColor: 'bg-info/5',
    textColor: 'text-info',
    borderColor: 'border-info/30',
  },
  generating: {
    label: 'Generating',
    icon: STATUS_ICONS.generating,
    barColor: 'bg-success',
    bgColor: 'bg-success/5',
    textColor: 'text-success',
    borderColor: 'border-success/30',
  },
  complete: {
    label: 'Complete',
    icon: STATUS_ICONS.complete,
    barColor: 'bg-success',
    bgColor: 'bg-success/5',
    textColor: 'text-success',
    borderColor: 'border-success/30',
  },
  error: {
    label: 'Error',
    icon: STATUS_ICONS.error,
    barColor: 'bg-destructive',
    bgColor: 'bg-destructive/5',
    textColor: 'text-destructive',
    borderColor: 'border-destructive/30',
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format estimated time to human-readable string
 */
function formatEstimatedTime(seconds: number): string {
  if (seconds < 1) return 'less than 1s'
  if (seconds < 60) return `~${Math.round(seconds)}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.round(seconds % 60)
  if (remainingSeconds === 0) return `~${minutes}m`
  return `~${minutes}m ${remainingSeconds}s`
}

/**
 * Get default message for a status
 */
function getDefaultMessage(status: ThinkingBarStatus): string {
  switch (status) {
    case 'idle':
      return 'Ready'
    case 'thinking':
      return 'Analyzing your request...'
    case 'searching':
      return 'Searching for information...'
    case 'generating':
      return 'Generating response...'
    case 'complete':
      return 'Done!'
    case 'error':
      return 'Something went wrong'
    default:
      return 'Processing...'
  }
}

// =============================================================================
// INDETERMINATE PROGRESS BAR
// =============================================================================

interface IndeterminateProgressProps {
  barColor: string
  prefersReducedMotion: boolean
}

const IndeterminateProgress: React.FC<IndeterminateProgressProps> = ({
  barColor,
  prefersReducedMotion,
}) => (
  <motion.div
    className={cn('h-full rounded-full', barColor)}
    initial={{ x: '-100%', width: '30%' }}
    animate={
      prefersReducedMotion
        ? { x: '0%', width: '100%', opacity: [0.5, 1, 0.5] }
        : { x: ['0%', '200%', '0%'] }
    }
    transition={
      prefersReducedMotion
        ? { duration: durations.slower, repeat: Infinity, ease: 'easeInOut' }
        : {
            duration: durations.slower,
            repeat: Infinity,
            ease: 'easeInOut',
          }
    }
    style={{ width: prefersReducedMotion ? '100%' : '30%' }}
  />
)

// =============================================================================
// DETERMINATE PROGRESS BAR
// =============================================================================

interface DeterminateProgressProps {
  progress: number
  barColor: string
  prefersReducedMotion: boolean
}

const DeterminateProgress: React.FC<DeterminateProgressProps> = ({
  progress,
  barColor,
  prefersReducedMotion,
}) => (
  <motion.div
    className={cn('h-full rounded-full', barColor)}
    initial={{ width: 0 }}
    animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    transition={{
      duration: prefersReducedMotion ? 0.1 : durations.slow,
      ease: EASING_FRAMER.out,
    }}
  />
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ThinkingBar - Show AI processing status with animated progress
 *
 * A versatile component for displaying AI processing status with
 * visual feedback through animated progress bars and status indicators.
 */
export function ThinkingBar({
  status,
  message,
  progress,
  variant = 'default',
  estimatedTime,
  className,
  progressClassName,
  showDots = true,
  indeterminate,
  onComplete,
  'aria-label': ariaLabel,
  disableAnimations = false,
  icon,
}: ThinkingBarProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const config = STATUS_CONFIG[status]
  const displayMessage = message ?? getDefaultMessage(status)

  // Determine if we should show indeterminate animation
  const isIndeterminate =
    indeterminate ?? (progress === undefined && status !== 'complete' && status !== 'idle')

  // Handle complete callback
  React.useEffect(() => {
    if (status === 'complete' && onComplete) {
      onComplete()
    }
  }, [status, onComplete])

  // Build accessible label
  const computedAriaLabel = React.useMemo(() => {
    if (ariaLabel) return ariaLabel
    const progressText = progress !== undefined ? `, ${progress}% complete` : ''
    const timeText = estimatedTime ? `, ${formatEstimatedTime(estimatedTime)} remaining` : ''
    return `AI Status: ${config.label}. ${displayMessage}${progressText}${timeText}`
  }, [ariaLabel, config.label, displayMessage, progress, estimatedTime])

  // Animation variants based on reduced motion preference
  const containerVariants = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
      }

  const iconVariants = prefersReducedMotion
    ? {}
    : {
        animate: status === 'thinking' || status === 'searching' || status === 'generating'
          ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
          : {},
      }

  // Render minimal variant
  if (variant === 'minimal') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        aria-label={computedAriaLabel}
        {...containerVariants}
        transition={{
          duration: prefersReducedMotion ? 0.1 : durations.normal,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2',
          'bg-muted/30 backdrop-blur-sm',
          className
        )}
      >
        <motion.span
          {...iconVariants}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: durations.slower, repeat: Infinity, ease: EASING_FRAMER.inOut }
          }
          className={config.textColor}
        >
          {icon ?? config.icon}
        </motion.span>
        <span className="text-sm text-foreground">{displayMessage}</span>
        {showDots && status !== 'complete' && status !== 'idle' && status !== 'error' && (
          <AnimatedDots variant="fade" size="sm" className={config.textColor} />
        )}
      </motion.div>
    )
  }

  // Render detailed variant
  if (variant === 'detailed') {
    return (
      <motion.div
        role="status"
        aria-live="polite"
        aria-label={computedAriaLabel}
        {...containerVariants}
        transition={{
          duration: prefersReducedMotion ? 0.1 : durations.normal,
          ease: EASING_FRAMER.out,
        }}
        className={cn(
          'rounded-xl border p-4',
          'bg-gradient-to-r from-card/95 via-card to-surface-muted/50',
          'backdrop-blur-sm shadow-sm',
          config.borderColor,
          className
        )}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Animated icon with pulse ring */}
            <div className="relative flex-shrink-0 flex items-center justify-center w-10 h-10">
              {/* Pulse ring */}
              {!prefersReducedMotion && status !== 'complete' && status !== 'idle' && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.6, 1.6], opacity: [0.5, 0, 0] }}
                    transition={{ duration: durations.slower, repeat: Infinity, ease: 'easeOut' }}
                    className={cn('absolute inset-0 rounded-full', config.bgColor)}
                  />
                  <motion.div
                    animate={{ scale: [1, 1.3, 1.3], opacity: [0.3, 0, 0] }}
                    transition={{ duration: durations.slower, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
                    className={cn('absolute inset-0 rounded-full', config.bgColor)}
                  />
                </>
              )}
              {/* Icon */}
              <motion.div
                {...iconVariants}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: durations.slower, repeat: Infinity, ease: EASING_FRAMER.inOut }
                }
                className={cn(
                  'relative z-10 flex items-center justify-center w-10 h-10',
                  'rounded-xl border shadow-sm',
                  config.bgColor,
                  config.borderColor,
                  config.textColor
                )}
              >
                {icon ?? config.icon}
              </motion.div>
            </div>

            {/* Status and message */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className={cn('font-semibold text-sm', config.textColor)}>
                  {config.label}
                </span>
                {showDots && status !== 'complete' && status !== 'idle' && status !== 'error' && (
                  <AnimatedDots variant="fade" size="sm" className={config.textColor} />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">
                {displayMessage}
              </p>
            </div>
          </div>

          {/* Estimated time / Progress percentage */}
          <div className="flex-shrink-0 text-right">
            {progress !== undefined && (
              <span className="text-sm font-medium tabular-nums text-foreground">
                {Math.round(progress)}%
              </span>
            )}
            {estimatedTime !== undefined && estimatedTime > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5 tabular-nums">
                {formatEstimatedTime(estimatedTime)}
              </p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className={cn('h-2 overflow-hidden rounded-full bg-muted/40', progressClassName)}>
          {isIndeterminate ? (
            <IndeterminateProgress
              barColor={config.barColor}
              prefersReducedMotion={prefersReducedMotion}
            />
          ) : (
            <DeterminateProgress
              progress={progress ?? (status === 'complete' ? 100 : 0)}
              barColor={config.barColor}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </div>
      </motion.div>
    )
  }

  // Render default variant
  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label={computedAriaLabel}
      {...containerVariants}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'rounded-xl border p-3',
        'bg-gradient-to-r from-card/95 via-card to-surface-muted/50',
        'backdrop-blur-sm shadow-sm',
        config.borderColor,
        className
      )}
    >
      {/* Content row */}
      <div className="flex items-center gap-3 mb-2.5">
        {/* Icon */}
        <motion.span
          {...iconVariants}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: durations.slower, repeat: Infinity, ease: EASING_FRAMER.inOut }
          }
          className={cn(
            'flex-shrink-0 flex items-center justify-center w-8 h-8',
            'rounded-lg border',
            config.bgColor,
            config.borderColor,
            config.textColor
          )}
        >
          {icon ?? config.icon}
        </motion.span>

        {/* Message */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {displayMessage}
          </span>
          {showDots && status !== 'complete' && status !== 'idle' && status !== 'error' && (
            <AnimatedDots variant="fade" size="sm" className={config.textColor} />
          )}
        </div>

        {/* Progress / Time */}
        {(progress !== undefined || estimatedTime !== undefined) && (
          <span className="flex-shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
            {progress !== undefined
              ? `${Math.round(progress)}%`
              : estimatedTime !== undefined
                ? formatEstimatedTime(estimatedTime)
                : null}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div className={cn('h-1.5 overflow-hidden rounded-full bg-muted/40', progressClassName)}>
        {isIndeterminate ? (
          <IndeterminateProgress
            barColor={config.barColor}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : (
          <DeterminateProgress
            progress={progress ?? (status === 'complete' ? 100 : 0)}
            barColor={config.barColor}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    </motion.div>
  )
}

ThinkingBar.displayName = 'ThinkingBar'

// =============================================================================
// CONVENIENCE HOOK
// =============================================================================

/**
 * Hook for managing ThinkingBar state
 *
 * Provides convenient methods for controlling the ThinkingBar component
 * with automatic state transitions and progress tracking.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const thinking = useThinkingBar()
 *
 *   const handleSubmit = async () => {
 *     thinking.startThinking('Processing your request...')
 *     thinking.setProgress(25)
 *
 *     await doSomething()
 *
 *     thinking.startGenerating('Almost there...')
 *     thinking.setProgress(75)
 *
 *     await doMoreThings()
 *
 *     thinking.complete('All done!')
 *   }
 *
 *   return (
 *     <>
 *       <ThinkingBar
 *         status={thinking.status}
 *         message={thinking.message}
 *         progress={thinking.progress}
 *       />
 *       <button onClick={handleSubmit}>Submit</button>
 *     </>
 *   )
 * }
 * ```
 */
export function useThinkingBar({
  initialStatus = 'idle',
  autoCompleteAfter,
  onStatusChange,
}: UseThinkingBarOptions = {}): UseThinkingBarReturn {
  const [status, setStatusState] = React.useState<ThinkingBarStatus>(initialStatus)
  const [progress, setProgress] = React.useState(0)
  const [message, setMessage] = React.useState<string | undefined>(undefined)

  const setStatus = React.useCallback(
    (newStatus: ThinkingBarStatus) => {
      setStatusState(newStatus)
      onStatusChange?.(newStatus)
    },
    [onStatusChange]
  )

  const startThinking = React.useCallback(
    (msg?: string) => {
      setProgress(0)
      setMessage(msg)
      setStatus('thinking')
    },
    [setStatus]
  )

  const startSearching = React.useCallback(
    (msg?: string) => {
      setMessage(msg)
      setStatus('searching')
    },
    [setStatus]
  )

  const startGenerating = React.useCallback(
    (msg?: string) => {
      setMessage(msg)
      setStatus('generating')
    },
    [setStatus]
  )

  const complete = React.useCallback(
    (msg?: string) => {
      setProgress(100)
      setMessage(msg)
      setStatus('complete')
    },
    [setStatus]
  )

  const setError = React.useCallback(
    (msg?: string) => {
      setMessage(msg)
      setStatus('error')
    },
    [setStatus]
  )

  const reset = React.useCallback(() => {
    setProgress(0)
    setMessage(undefined)
    setStatus('idle')
  }, [setStatus])

  // Auto-complete timer
  React.useEffect(() => {
    if (autoCompleteAfter && status !== 'idle' && status !== 'complete' && status !== 'error') {
      const timer = setTimeout(() => {
        complete()
      }, autoCompleteAfter)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [autoCompleteAfter, status, complete])

  const isProcessing =
    status === 'thinking' || status === 'searching' || status === 'generating'

  return {
    status,
    progress,
    message,
    setStatus,
    setProgress,
    setMessage,
    startThinking,
    startSearching,
    startGenerating,
    complete,
    setError,
    reset,
    isProcessing,
  }
}
