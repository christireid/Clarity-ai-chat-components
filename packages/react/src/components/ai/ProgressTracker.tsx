'use client'

/**
 * ProgressTracker Component
 *
 * A visual progress tracker for multi-step processes with rich status display.
 * Shows current step, completion status, and estimated time remaining.
 *
 * Features:
 * - Multiple variants (stepper, dots, progress-bar, circular)
 * - Step completion animations
 * - Time estimation and countdown
 * - Error and warning states
 * - Clickable steps for navigation
 * - Accessible with ARIA attributes
 *
 * @example
 * ```tsx
 * // Basic stepper
 * <ProgressTracker
 *   steps={[
 *     { label: 'Cart', status: 'completed' },
 *     { label: 'Shipping', status: 'current' },
 *     { label: 'Payment', status: 'upcoming' },
 *     { label: 'Confirmation', status: 'upcoming' },
 *   ]}
 * />
 *
 * // Circular progress
 * <ProgressTracker
 *   variant="circular"
 *   currentStep={2}
 *   totalSteps={5}
 *   label="Processing"
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type ProgressTrackerVariant = 'stepper' | 'dots' | 'progress-bar' | 'circular' | 'minimal'
export type ProgressStepStatus = 'completed' | 'current' | 'upcoming' | 'error' | 'warning' | 'skipped'

export interface ProgressStep {
  /** Unique identifier */
  id?: string
  /** Step label */
  label: string
  /** Step description */
  description?: string
  /** Step status */
  status: ProgressStepStatus
  /** Custom icon */
  icon?: React.ReactNode
  /** Error message if status is error */
  errorMessage?: string
  /** Metadata */
  metadata?: Record<string, string | number>
}

export interface ProgressTrackerProps {
  /** Steps to display */
  steps?: ProgressStep[]
  /** Current step index (alternative to steps with status) */
  currentStep?: number
  /** Total number of steps */
  totalSteps?: number
  /** Progress percentage (0-100, for progress-bar/circular) */
  progress?: number
  /** Visual variant */
  variant?: ProgressTrackerVariant
  /** Size preset */
  size?: 'sm' | 'md' | 'lg'
  /** Label text (for circular/progress-bar) */
  label?: string
  /** Show step numbers */
  showNumbers?: boolean
  /** Show descriptions */
  showDescriptions?: boolean
  /** Show connector lines */
  showConnectors?: boolean
  /** Allow clicking on steps */
  clickable?: boolean
  /** Orientation */
  orientation?: 'horizontal' | 'vertical'
  /** Estimated time remaining (seconds) */
  estimatedTimeRemaining?: number
  /** Step click handler */
  onStepClick?: (step: ProgressStep, index: number) => void
  /** Additional class names */
  className?: string
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatTimeRemaining(seconds: number): string {
  if (seconds < 60) return `${seconds}s remaining`
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes < 60) {
    return secs > 0 ? `${minutes}m ${secs}s remaining` : `${minutes}m remaining`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m remaining`
}

function getStepIcon(status: ProgressStepStatus, index: number, showNumbers: boolean) {
  switch (status) {
    case 'completed':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'error':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )
    case 'warning':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      )
    case 'skipped':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M13 5l7 7-7 7" />
          <path d="M5 5l7 7-7 7" />
        </svg>
      )
    default:
      return showNumbers ? <span>{index + 1}</span> : null
  }
}

// ============================================================================
// CircularProgress Component
// ============================================================================

interface CircularProgressProps {
  progress: number
  size?: 'sm' | 'md' | 'lg'
  label?: string
  showValue?: boolean
  currentStep?: number
  totalSteps?: number
}

function CircularProgress({
  progress,
  size = 'md',
  label,
  showValue = true,
  currentStep,
  totalSteps,
}: CircularProgressProps) {
  const prefersReducedMotion = useReducedMotion()

  const sizes = {
    sm: { size: 64, stroke: 4, fontSize: '0.75rem' },
    md: { size: 96, stroke: 6, fontSize: '1rem' },
    lg: { size: 128, stroke: 8, fontSize: '1.25rem' },
  }

  const config = sizes[size]
  const radius = (config.size - config.stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className="progress-tracker-circular">
      <svg
        width={config.size}
        height={config.size}
        viewBox={`0 0 ${config.size} ${config.size}`}
        className="progress-tracker-circular-svg"
      >
        {/* Background circle */}
        <circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          className="progress-tracker-circular-bg"
        />
        {/* Progress circle */}
        <motion.circle
          cx={config.size / 2}
          cy={config.size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={config.stroke}
          strokeLinecap="round"
          className="progress-tracker-circular-progress"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: prefersReducedMotion ? 0 : DURATION_SECONDS.slow,
            ease: EASING_FRAMER.standard,
          }}
          transform={`rotate(-90 ${config.size / 2} ${config.size / 2})`}
        />
      </svg>
      <div
        className="progress-tracker-circular-content"
        style={{ fontSize: config.fontSize }}
      >
        {showValue && (
          <span className="progress-tracker-circular-value">
            {currentStep && totalSteps
              ? `${currentStep}/${totalSteps}`
              : `${Math.round(progress)}%`}
          </span>
        )}
        {label && (
          <span className="progress-tracker-circular-label">{label}</span>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// StepIndicator Component
// ============================================================================

interface StepIndicatorProps {
  step: ProgressStep
  index: number
  isLast: boolean
  variant: ProgressTrackerVariant
  size: 'sm' | 'md' | 'lg'
  showNumbers: boolean
  showDescriptions: boolean
  showConnectors: boolean
  clickable: boolean
  orientation: 'horizontal' | 'vertical'
  onClick?: () => void
}

function StepIndicator({
  step,
  index,
  isLast,
  variant,
  size,
  showNumbers,
  showDescriptions,
  showConnectors,
  clickable,
  orientation,
  onClick,
}: StepIndicatorProps) {
  const prefersReducedMotion = useReducedMotion()

  const handleClick = () => {
    if (clickable && onClick) {
      onClick()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (clickable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.()
    }
  }

  if (variant === 'dots') {
    return (
      <motion.button
        type="button"
        className={cn(
          'progress-tracker-dot',
          `progress-tracker-dot-${step.status}`,
          `progress-tracker-dot-${size}`,
          clickable && 'progress-tracker-dot-clickable'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={!clickable}
        aria-label={`Step ${index + 1}: ${step.label} - ${step.status}`}
        initial={prefersReducedMotion ? {} : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: DURATION_SECONDS.fast,
          delay: prefersReducedMotion ? 0 : index * 0.05,
        }}
        whileHover={clickable ? { scale: 1.2 } : {}}
      />
    )
  }

  return (
    <div
      className={cn(
        'progress-tracker-step',
        `progress-tracker-step-${step.status}`,
        `progress-tracker-step-${size}`,
        `progress-tracker-step-${orientation}`
      )}
    >
      {/* Indicator */}
      <motion.button
        type="button"
        className={cn(
          'progress-tracker-indicator',
          `progress-tracker-indicator-${step.status}`,
          clickable && 'progress-tracker-indicator-clickable'
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={!clickable}
        aria-current={step.status === 'current' ? 'step' : undefined}
        initial={prefersReducedMotion ? {} : { scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          duration: DURATION_SECONDS.fast,
          delay: prefersReducedMotion ? 0 : index * 0.1,
        }}
        whileHover={clickable ? { scale: 1.1 } : {}}
      >
        {step.icon || getStepIcon(step.status, index, showNumbers)}
      </motion.button>

      {/* Connector line */}
      {showConnectors && !isLast && (
        <div
          className={cn(
            'progress-tracker-connector',
            `progress-tracker-connector-${orientation}`,
            step.status === 'completed' && 'progress-tracker-connector-completed'
          )}
        >
          {step.status === 'completed' && (
            <motion.div
              className="progress-tracker-connector-fill"
              initial={{ scaleX: orientation === 'horizontal' ? 0 : 1, scaleY: orientation === 'vertical' ? 0 : 1 }}
              animate={{ scaleX: 1, scaleY: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
                delay: prefersReducedMotion ? 0 : 0.2,
              }}
            />
          )}
        </div>
      )}

      {/* Label and description */}
      {variant !== 'minimal' && (
        <div className="progress-tracker-step-content">
          <span className="progress-tracker-step-label">{step.label}</span>
          {showDescriptions && step.description && (
            <span className="progress-tracker-step-description">
              {step.description}
            </span>
          )}
          {step.status === 'error' && step.errorMessage && (
            <span className="progress-tracker-step-error">
              {step.errorMessage}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// ProgressTracker Component
// ============================================================================

export function ProgressTracker({
  steps = [],
  currentStep,
  totalSteps,
  progress,
  variant = 'stepper',
  size = 'md',
  label,
  showNumbers = true,
  showDescriptions = false,
  showConnectors = true,
  clickable = false,
  orientation = 'horizontal',
  estimatedTimeRemaining,
  onStepClick,
  className,
}: ProgressTrackerProps) {
  const prefersReducedMotion = useReducedMotion()

  // Calculate progress from steps if not provided
  const calculatedProgress = React.useMemo(() => {
    if (progress !== undefined) return progress
    if (currentStep !== undefined && totalSteps !== undefined) {
      return (currentStep / totalSteps) * 100
    }
    if (steps.length > 0) {
      const completed = steps.filter((s) => s.status === 'completed').length
      const current = steps.findIndex((s) => s.status === 'current')
      return ((completed + (current >= 0 ? 0.5 : 0)) / steps.length) * 100
    }
    return 0
  }, [progress, currentStep, totalSteps, steps])

  // Generate steps from currentStep/totalSteps if not provided
  const displaySteps = React.useMemo(() => {
    if (steps.length > 0) return steps
    if (currentStep !== undefined && totalSteps !== undefined) {
      return Array.from({ length: totalSteps }, (_, i) => ({
        id: `step-${i}`,
        label: `Step ${i + 1}`,
        status:
          i < currentStep - 1
            ? 'completed'
            : i === currentStep - 1
              ? 'current'
              : 'upcoming',
      } as ProgressStep))
    }
    return []
  }, [steps, currentStep, totalSteps])

  // Circular variant
  if (variant === 'circular') {
    return (
      <motion.div
        className={cn('progress-tracker', 'progress-tracker-circular-wrapper', className)}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION_SECONDS.normal }}
        role="progressbar"
        aria-valuenow={calculatedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <CircularProgress
          progress={calculatedProgress}
          size={size}
          label={label}
          currentStep={currentStep}
          totalSteps={totalSteps}
        />
        {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
          <span className="progress-tracker-time">
            {formatTimeRemaining(estimatedTimeRemaining)}
          </span>
        )}
      </motion.div>
    )
  }

  // Progress bar variant
  if (variant === 'progress-bar') {
    return (
      <motion.div
        className={cn(
          'progress-tracker',
          'progress-tracker-bar',
          `progress-tracker-bar-${size}`,
          className
        )}
        initial={prefersReducedMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION_SECONDS.normal }}
        role="progressbar"
        aria-valuenow={calculatedProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        {label && (
          <div className="progress-tracker-bar-header">
            <span className="progress-tracker-bar-label">{label}</span>
            <span className="progress-tracker-bar-value">
              {Math.round(calculatedProgress)}%
            </span>
          </div>
        )}
        <div className="progress-tracker-bar-track">
          <motion.div
            className="progress-tracker-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${calculatedProgress}%` }}
            transition={{
              duration: prefersReducedMotion ? 0 : DURATION_SECONDS.slow,
              ease: EASING_FRAMER.standard,
            }}
          />
        </div>
        {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
          <span className="progress-tracker-time">
            {formatTimeRemaining(estimatedTimeRemaining)}
          </span>
        )}
      </motion.div>
    )
  }

  // Stepper/dots/minimal variants
  return (
    <motion.div
      className={cn(
        'progress-tracker',
        `progress-tracker-${variant}`,
        `progress-tracker-${orientation}`,
        `progress-tracker-${size}`,
        className
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION_SECONDS.normal }}
      role="list"
      aria-label="Progress steps"
    >
      {displaySteps.map((step, index) => (
        <StepIndicator
          key={step.id || `step-${index}`}
          step={step}
          index={index}
          isLast={index === displaySteps.length - 1}
          variant={variant}
          size={size}
          showNumbers={showNumbers}
          showDescriptions={showDescriptions}
          showConnectors={showConnectors}
          clickable={clickable}
          orientation={orientation}
          onClick={() => onStepClick?.(step, index)}
        />
      ))}
    </motion.div>
  )
}

// ============================================================================
// useProgressTracker Hook
// ============================================================================

export interface UseProgressTrackerOptions {
  /** Initial steps */
  initialSteps?: ProgressStep[]
  /** Total steps (if not using steps array) */
  totalSteps?: number
  /** Starting step index */
  startingStep?: number
}

export interface UseProgressTrackerReturn {
  /** Current steps */
  steps: ProgressStep[]
  /** Current step index */
  currentIndex: number
  /** Progress percentage */
  progress: number
  /** Go to next step */
  next: () => void
  /** Go to previous step */
  previous: () => void
  /** Go to specific step */
  goTo: (index: number) => void
  /** Mark current step as completed */
  complete: () => void
  /** Mark current step as error */
  setError: (message?: string) => void
  /** Reset to initial state */
  reset: () => void
  /** Whether at first step */
  isFirst: boolean
  /** Whether at last step */
  isLast: boolean
  /** Whether all steps completed */
  isComplete: boolean
}

export function useProgressTracker(
  options: UseProgressTrackerOptions = {}
): UseProgressTrackerReturn {
  const { initialSteps = [], totalSteps = 0, startingStep = 0 } = options

  const defaultSteps = React.useMemo(() => {
    if (initialSteps.length > 0) return initialSteps
    return Array.from({ length: totalSteps }, (_, i) => ({
      id: `step-${i}`,
      label: `Step ${i + 1}`,
      status: i === startingStep ? 'current' : 'upcoming',
    } as ProgressStep))
  }, [initialSteps, totalSteps, startingStep])

  const [steps, setSteps] = React.useState<ProgressStep[]>(defaultSteps)
  const [currentIndex, setCurrentIndex] = React.useState(startingStep)

  const progress = React.useMemo(() => {
    const completed = steps.filter((s) => s.status === 'completed').length
    return (completed / steps.length) * 100
  }, [steps])

  const updateStepStatus = (index: number, status: ProgressStepStatus, errorMessage?: string) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === index) {
          return { ...step, status, errorMessage }
        }
        return step
      })
    )
  }

  const next = React.useCallback(() => {
    if (currentIndex < steps.length - 1) {
      updateStepStatus(currentIndex, 'completed')
      updateStepStatus(currentIndex + 1, 'current')
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, steps.length])

  const previous = React.useCallback(() => {
    if (currentIndex > 0) {
      updateStepStatus(currentIndex, 'upcoming')
      updateStepStatus(currentIndex - 1, 'current')
      setCurrentIndex(currentIndex - 1)
    }
  }, [currentIndex])

  const goTo = React.useCallback(
    (index: number) => {
      if (index >= 0 && index < steps.length) {
        setSteps((prev) =>
          prev.map((step, i) => ({
            ...step,
            status:
              i < index ? 'completed' : i === index ? 'current' : 'upcoming',
          }))
        )
        setCurrentIndex(index)
      }
    },
    [steps.length]
  )

  const complete = React.useCallback(() => {
    updateStepStatus(currentIndex, 'completed')
    if (currentIndex < steps.length - 1) {
      updateStepStatus(currentIndex + 1, 'current')
      setCurrentIndex(currentIndex + 1)
    }
  }, [currentIndex, steps.length])

  const setError = React.useCallback(
    (message?: string) => {
      updateStepStatus(currentIndex, 'error', message)
    },
    [currentIndex]
  )

  const reset = React.useCallback(() => {
    setSteps(defaultSteps)
    setCurrentIndex(startingStep)
  }, [defaultSteps, startingStep])

  return {
    steps,
    currentIndex,
    progress,
    next,
    previous,
    goTo,
    complete,
    setError,
    reset,
    isFirst: currentIndex === 0,
    isLast: currentIndex === steps.length - 1,
    isComplete: steps.every((s) => s.status === 'completed'),
  }
}

export default ProgressTracker
