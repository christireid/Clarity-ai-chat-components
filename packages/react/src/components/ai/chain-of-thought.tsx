/**
 * ChainOfThought Component
 *
 * Visualizes step-by-step AI reasoning with collapsible sections,
 * progress indicators, and streaming support. Inspired by Prompt-Kit's
 * Chain of Thought pattern, adapted to Clarity's design system.
 *
 * Features:
 * - Step-by-step reasoning visualization
 * - Collapsible/expandable sections (individual or all)
 * - Real-time streaming updates
 * - Progress indicators for each step
 * - Status badges (pending, in-progress, complete, error)
 * - Accessible with full ARIA support
 * - Respects reduced motion preferences
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * // Basic usage
 * <ChainOfThought
 *   steps={[
 *     { id: '1', title: 'Analyzing query', content: '...', status: 'complete' },
 *     { id: '2', title: 'Searching database', content: '...', status: 'in-progress' },
 *     { id: '3', title: 'Generating response', content: '...', status: 'pending' }
 *   ]}
 * />
 *
 * // With streaming and callbacks
 * <ChainOfThought
 *   steps={steps}
 *   expanded={true}
 *   showTimestamps
 *   onStepClick={(stepId) => console.log('Clicked:', stepId)}
 *   onExpandChange={(expanded) => console.log('Expanded:', expanded)}
 * />
 *
 * // Compact mode for embedding
 * <ChainOfThought
 *   steps={steps}
 *   variant="compact"
 *   maxVisibleSteps={3}
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
  STAGGER_TIMING,
} from '../../animations/constants'
import { AnimatedDots } from '../ui/animated-dots'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Status of a reasoning step
 */
export type ChainOfThoughtStepStatus =
  | 'pending'
  | 'in-progress'
  | 'complete'
  | 'error'
  | 'skipped'

/**
 * Individual reasoning step
 */
export interface ChainOfThoughtStep {
  /** Unique identifier for the step */
  id: string
  /** Step title/label */
  title: string
  /** Step content/reasoning text */
  content: string
  /** Current status */
  status: ChainOfThoughtStepStatus
  /** Optional icon override */
  icon?: React.ReactNode
  /** Optional timestamp */
  timestamp?: Date
  /** Duration in milliseconds (for completed steps) */
  duration?: number
  /** Progress percentage (0-100, for in-progress steps) */
  progress?: number
  /** Optional metadata to display */
  metadata?: Record<string, string | number | boolean>
  /** Nested sub-steps */
  subSteps?: ChainOfThoughtStep[]
  /** Error message (when status is 'error') */
  error?: string
}

/**
 * Visual variant of the component
 */
export type ChainOfThoughtVariant = 'default' | 'compact' | 'detailed' | 'minimal'

/**
 * Props for the ChainOfThought component
 */
export interface ChainOfThoughtProps {
  /** Array of reasoning steps */
  steps: ChainOfThoughtStep[]
  /** Whether all steps are expanded by default */
  expanded?: boolean
  /** Controlled expanded step IDs */
  expandedSteps?: string[]
  /** Callback when expanded steps change */
  onExpandedStepsChange?: (stepIds: string[]) => void
  /** Callback when a step is clicked */
  onStepClick?: (stepId: string) => void
  /** Callback when retry is requested (for error steps) */
  onRetry?: (stepId: string) => void
  /** Visual variant */
  variant?: ChainOfThoughtVariant
  /** Show timestamps */
  showTimestamps?: boolean
  /** Show step numbers */
  showStepNumbers?: boolean
  /** Show duration for completed steps */
  showDuration?: boolean
  /** Maximum visible steps before "show more" */
  maxVisibleSteps?: number
  /** Header title */
  title?: string
  /** Header subtitle */
  subtitle?: string
  /** Show collapse all/expand all button */
  showToggleAll?: boolean
  /** Custom class name */
  className?: string
  /** Container class name */
  containerClassName?: string
  /** Step class name */
  stepClassName?: string
  /** Animation duration multiplier */
  animationSpeed?: number
  /** Disable animations */
  disableAnimations?: boolean
  /** Loading state (shows skeleton) */
  loading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Accessible label for the component */
  'aria-label'?: string
}

// =============================================================================
// STATUS CONFIGURATION
// =============================================================================

const STATUS_CONFIG: Record<
  ChainOfThoughtStepStatus,
  {
    label: string
    badgeVariant: 'default' | 'info' | 'success' | 'warning' | 'destructive'
    iconColor: string
    bgColor: string
    borderColor: string
  }
> = {
  pending: {
    label: 'Pending',
    badgeVariant: 'default',
    iconColor: 'text-muted-foreground',
    bgColor: 'bg-muted/30',
    borderColor: 'border-muted/50',
  },
  'in-progress': {
    label: 'In Progress',
    badgeVariant: 'info',
    iconColor: 'text-primary',
    bgColor: 'bg-primary/5',
    borderColor: 'border-primary/30',
  },
  complete: {
    label: 'Complete',
    badgeVariant: 'success',
    iconColor: 'text-success',
    bgColor: 'bg-success/5',
    borderColor: 'border-success/30',
  },
  error: {
    label: 'Error',
    badgeVariant: 'destructive',
    iconColor: 'text-destructive',
    bgColor: 'bg-destructive/5',
    borderColor: 'border-destructive/30',
  },
  skipped: {
    label: 'Skipped',
    badgeVariant: 'default',
    iconColor: 'text-muted-foreground/60',
    bgColor: 'bg-muted/20',
    borderColor: 'border-muted/30',
  },
}

// =============================================================================
// ICONS
// =============================================================================

interface IconProps {
  size?: number
  className?: string
}

const CheckCircleIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
)

const CircleIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
)

const SpinnerIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('animate-spin', className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
)

const AlertCircleIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
)

const SkipIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6" />
  </svg>
)

const ChevronDownIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
)

const BrainIcon: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
  </svg>
)

/**
 * Get the appropriate icon for a step status
 */
function getStatusIcon(
  status: ChainOfThoughtStepStatus,
  customIcon?: React.ReactNode
): React.ReactNode {
  if (customIcon) return customIcon

  const iconProps = { size: 18 }
  const config = STATUS_CONFIG[status]

  switch (status) {
    case 'complete':
      return <CheckCircleIcon {...iconProps} className={config.iconColor} />
    case 'in-progress':
      return <SpinnerIcon {...iconProps} className={config.iconColor} />
    case 'error':
      return <AlertCircleIcon {...iconProps} className={config.iconColor} />
    case 'skipped':
      return <SkipIcon {...iconProps} className={config.iconColor} />
    case 'pending':
    default:
      return <CircleIcon {...iconProps} className={config.iconColor} />
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format duration in milliseconds to human-readable string
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`
}

/**
 * Format timestamp to time string
 */
function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Progress bar for in-progress steps
 */
const StepProgress: React.FC<{
  progress: number
  prefersReducedMotion: boolean
}> = ({ progress, prefersReducedMotion }) => (
  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.slow,
        ease: EASING_FRAMER.out,
      }}
      className="h-full bg-primary rounded-full"
    />
  </div>
)

/**
 * Status badge component
 */
const StatusBadge: React.FC<{
  status: ChainOfThoughtStepStatus
  showDots?: boolean
}> = ({ status, showDots }) => {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
        'transition-colors duration-150',
        {
          'bg-muted/60 text-muted-foreground': config.badgeVariant === 'default',
          'bg-primary/10 text-primary': config.badgeVariant === 'info',
          'bg-success/10 text-success': config.badgeVariant === 'success',
          'bg-warning/10 text-warning': config.badgeVariant === 'warning',
          'bg-destructive/10 text-destructive':
            config.badgeVariant === 'destructive',
        }
      )}
    >
      {config.label}
      {showDots && status === 'in-progress' && (
        <AnimatedDots variant="fade" size="sm" className="ml-0.5" />
      )}
    </span>
  )
}

/**
 * Individual step component
 */
interface StepItemProps {
  step: ChainOfThoughtStep
  index: number
  isExpanded: boolean
  onToggle: () => void
  onClick?: () => void
  onRetry?: () => void
  showStepNumber: boolean
  showTimestamp: boolean
  showDuration: boolean
  variant: ChainOfThoughtVariant
  prefersReducedMotion: boolean
  className?: string
}

const StepItem: React.FC<StepItemProps> = ({
  step,
  index,
  isExpanded,
  onToggle,
  onClick,
  onRetry,
  showStepNumber,
  showTimestamp,
  showDuration,
  variant,
  prefersReducedMotion,
  className,
}) => {
  const config = STATUS_CONFIG[step.status]
  const isCompact = variant === 'compact' || variant === 'minimal'
  const hasContent = step.content && step.content.trim().length > 0

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (hasContent) {
        onToggle()
      }
      onClick?.()
    }
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
      transition={{
        duration: prefersReducedMotion ? 0.1 : durations.normal,
        ease: EASING_FRAMER.out,
        delay: index * STAGGER_TIMING.fast,
      }}
      className={cn(
        'relative rounded-lg border transition-all duration-150',
        config.bgColor,
        config.borderColor,
        'hover:shadow-sm',
        {
          'ring-2 ring-primary/20': step.status === 'in-progress',
        },
        className
      )}
      role="article"
      aria-label={`Step ${index + 1}: ${step.title}, ${config.label}`}
    >
      {/* Step Header */}
      <button
        type="button"
        onClick={() => {
          if (hasContent) onToggle()
          onClick?.()
        }}
        onKeyDown={handleKeyDown}
        disabled={!hasContent && !onClick}
        className={cn(
          'w-full flex items-start gap-3 text-left',
          isCompact ? 'p-2.5' : 'p-3.5',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-offset-1',
          'disabled:cursor-default',
          hasContent && 'cursor-pointer'
        )}
        aria-expanded={hasContent ? isExpanded : undefined}
        aria-controls={hasContent ? `step-content-${step.id}` : undefined}
      >
        {/* Step Number / Icon */}
        <div
          className={cn(
            'flex-shrink-0 flex items-center justify-center rounded-full',
            isCompact ? 'w-6 h-6' : 'w-8 h-8',
            config.bgColor,
            'border',
            config.borderColor
          )}
        >
          {showStepNumber ? (
            <span
              className={cn(
                'font-semibold tabular-nums',
                isCompact ? 'text-xs' : 'text-sm',
                config.iconColor
              )}
            >
              {index + 1}
            </span>
          ) : (
            getStatusIcon(step.status, step.icon)
          )}
        </div>

        {/* Step Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={cn(
                'font-semibold text-foreground truncate',
                isCompact ? 'text-sm' : 'text-base'
              )}
            >
              {step.title}
            </h4>
            {variant !== 'minimal' && <StatusBadge status={step.status} showDots />}
          </div>

          {/* Metadata row */}
          {(showTimestamp || showDuration) && variant !== 'minimal' && (
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground/80">
              {showTimestamp && step.timestamp && (
                <span>{formatTimestamp(step.timestamp)}</span>
              )}
              {showDuration && step.duration !== undefined && (
                <span className="tabular-nums">{formatDuration(step.duration)}</span>
              )}
            </div>
          )}

          {/* In-progress indicator with progress bar */}
          {step.status === 'in-progress' && step.progress !== undefined && (
            <StepProgress
              progress={step.progress}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
        </div>

        {/* Expand/Collapse indicator */}
        {hasContent && (
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : durations.fast,
              ease: EASING_FRAMER.out,
            }}
            className="flex-shrink-0 text-muted-foreground"
          >
            <ChevronDownIcon size={16} />
          </motion.div>
        )}
      </button>

      {/* Step Content (Collapsible) */}
      <AnimatePresence initial={false}>
        {isExpanded && hasContent && (
          <motion.div
            id={`step-content-${step.id}`}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: 'auto', opacity: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.1 : durations.normal,
              ease: EASING_FRAMER.out,
            }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                'border-t',
                config.borderColor,
                isCompact ? 'px-2.5 py-2' : 'px-3.5 py-3'
              )}
            >
              {/* Main content */}
              <div
                className={cn(
                  'text-muted-foreground whitespace-pre-wrap',
                  isCompact ? 'text-xs' : 'text-sm',
                  'leading-relaxed'
                )}
              >
                {step.content}
              </div>

              {/* Error message */}
              {step.status === 'error' && step.error && (
                <div className="mt-3 p-2.5 rounded-md bg-destructive/10 border border-destructive/30">
                  <p className="text-sm text-destructive font-medium">
                    {step.error}
                  </p>
                  {onRetry && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRetry()
                      }}
                      className={cn(
                        'mt-2 px-3 py-1.5 text-xs font-medium rounded-md',
                        'bg-destructive text-destructive-foreground',
                        'hover:bg-destructive/90 transition-colors',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                      )}
                    >
                      Retry
                    </button>
                  )}
                </div>
              )}

              {/* Metadata */}
              {step.metadata &&
                Object.keys(step.metadata).length > 0 &&
                variant === 'detailed' && (
                  <div className="mt-3 pt-3 border-t border-border/30">
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                      {Object.entries(step.metadata).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-muted-foreground">{key}:</dt>
                          <dd className="font-medium text-foreground">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

              {/* Sub-steps (recursive) */}
              {step.subSteps && step.subSteps.length > 0 && (
                <div className="mt-3 pl-4 border-l-2 border-border/40 space-y-2">
                  {step.subSteps.map((subStep, subIndex) => (
                    <div
                      key={subStep.id}
                      className="flex items-start gap-2 text-xs"
                    >
                      <span className={STATUS_CONFIG[subStep.status].iconColor}>
                        {getStatusIcon(subStep.status)}
                      </span>
                      <div>
                        <span className="font-medium">{subStep.title}</span>
                        {subStep.content && (
                          <p className="text-muted-foreground mt-0.5">
                            {subStep.content}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * Skeleton loader for loading state
 */
const ChainOfThoughtSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-3" role="status" aria-label="Loading reasoning steps">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-lg border border-border/40 bg-muted/20 p-3.5 animate-pulse"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-muted/60" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted/60 rounded w-1/3" />
            <div className="h-3 bg-muted/40 rounded w-1/4" />
          </div>
        </div>
      </div>
    ))}
  </div>
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * ChainOfThought - Visualize AI reasoning step-by-step
 *
 * A comprehensive component for displaying the chain of thought reasoning
 * process of AI models. Supports streaming updates, collapsible sections,
 * progress indicators, and full accessibility.
 */
export function ChainOfThought({
  steps,
  expanded = false,
  expandedSteps: controlledExpandedSteps,
  onExpandedStepsChange,
  onStepClick,
  onRetry,
  variant = 'default',
  showTimestamps = false,
  showStepNumbers = false,
  showDuration = true,
  maxVisibleSteps,
  title,
  subtitle,
  showToggleAll = true,
  className,
  containerClassName,
  stepClassName,
  animationSpeed = 1,
  disableAnimations = false,
  loading = false,
  emptyMessage = 'No reasoning steps available',
  'aria-label': ariaLabel,
}: ChainOfThoughtProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations

  // Expanded state management
  const [internalExpandedSteps, setInternalExpandedSteps] = React.useState<
    Set<string>
  >(() => new Set(expanded ? steps.map((s) => s.id) : []))

  const expandedStepSet = React.useMemo(() => {
    if (controlledExpandedSteps !== undefined) {
      return new Set(controlledExpandedSteps)
    }
    return internalExpandedSteps
  }, [controlledExpandedSteps, internalExpandedSteps])

  const setExpandedSteps = React.useCallback(
    (updater: (prev: Set<string>) => Set<string>) => {
      const newSet = updater(expandedStepSet)
      if (controlledExpandedSteps === undefined) {
        setInternalExpandedSteps(newSet)
      }
      onExpandedStepsChange?.(Array.from(newSet))
    },
    [controlledExpandedSteps, expandedStepSet, onExpandedStepsChange]
  )

  // Update expanded steps when `expanded` prop changes
  React.useEffect(() => {
    if (expanded) {
      setExpandedSteps(() => new Set(steps.map((s) => s.id)))
    }
  }, [expanded, steps, setExpandedSteps])

  // Show more state
  const [showAll, setShowAll] = React.useState(false)

  // Calculate visible steps
  const visibleSteps = React.useMemo(() => {
    if (!maxVisibleSteps || showAll) return steps
    return steps.slice(0, maxVisibleSteps)
  }, [steps, maxVisibleSteps, showAll])

  const hiddenCount = steps.length - visibleSteps.length

  // Toggle step expansion
  const toggleStep = React.useCallback(
    (stepId: string) => {
      setExpandedSteps((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(stepId)) {
          newSet.delete(stepId)
        } else {
          newSet.add(stepId)
        }
        return newSet
      })
    },
    [setExpandedSteps]
  )

  // Toggle all steps
  const toggleAll = React.useCallback(() => {
    const allExpanded = steps.every((s) => expandedStepSet.has(s.id))
    setExpandedSteps(() => {
      if (allExpanded) {
        return new Set()
      }
      return new Set(steps.map((s) => s.id))
    })
  }, [steps, expandedStepSet, setExpandedSteps])

  const allExpanded = steps.every((s) => expandedStepSet.has(s.id))

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (steps.length === 0) return 0
    const completed = steps.filter(
      (s) => s.status === 'complete' || s.status === 'skipped'
    ).length
    return Math.round((completed / steps.length) * 100)
  }, [steps])

  // Loading state
  if (loading) {
    return <ChainOfThoughtSkeleton count={3} />
  }

  // Empty state
  if (steps.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-8 text-center',
          className
        )}
        role="status"
      >
        <BrainIcon size={40} className="text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div
      className={cn('w-full', containerClassName)}
      role="region"
      aria-label={ariaLabel || 'AI Reasoning Chain'}
    >
      {/* Header */}
      {(title || subtitle || showToggleAll) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                <BrainIcon size={18} className="text-primary" />
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Overall progress indicator */}
            {variant !== 'minimal' && (
              <div className="text-xs text-muted-foreground tabular-nums">
                {overallProgress}% complete
              </div>
            )}

            {/* Toggle all button */}
            {showToggleAll && steps.some((s) => s.content) && (
              <button
                type="button"
                onClick={toggleAll}
                className={cn(
                  'text-xs font-medium text-primary hover:text-primary/80',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  'transition-colors'
                )}
                aria-label={allExpanded ? 'Collapse all steps' : 'Expand all steps'}
              >
                {allExpanded ? 'Collapse all' : 'Expand all'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Steps List */}
      <div
        className={cn('space-y-2.5', className)}
        role="list"
        aria-label="Reasoning steps"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {visibleSteps.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              index={index}
              isExpanded={expandedStepSet.has(step.id)}
              onToggle={() => toggleStep(step.id)}
              onClick={onStepClick ? () => onStepClick(step.id) : undefined}
              onRetry={onRetry ? () => onRetry(step.id) : undefined}
              showStepNumber={showStepNumbers}
              showTimestamp={showTimestamps}
              showDuration={showDuration}
              variant={variant}
              prefersReducedMotion={prefersReducedMotion}
              className={stepClassName}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Show more button */}
      {hiddenCount > 0 && (
        <motion.button
          type="button"
          onClick={() => setShowAll(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn(
            'mt-3 w-full py-2 text-sm font-medium text-primary',
            'rounded-lg border border-primary/30 bg-primary/5',
            'hover:bg-primary/10 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          )}
        >
          Show {hiddenCount} more step{hiddenCount > 1 ? 's' : ''}
        </motion.button>
      )}
    </div>
  )
}

ChainOfThought.displayName = 'ChainOfThought'

// =============================================================================
// CONVENIENCE HOOKS
// =============================================================================

/**
 * Hook for managing chain of thought state with streaming updates
 */
export interface UseChainOfThoughtOptions {
  /** Initial steps */
  initialSteps?: ChainOfThoughtStep[]
  /** Auto-expand new steps */
  autoExpandNew?: boolean
  /** Auto-expand in-progress steps */
  autoExpandInProgress?: boolean
}

export interface UseChainOfThoughtReturn {
  /** Current steps */
  steps: ChainOfThoughtStep[]
  /** Add a new step */
  addStep: (step: ChainOfThoughtStep) => void
  /** Update an existing step */
  updateStep: (
    stepId: string,
    updates: Partial<Omit<ChainOfThoughtStep, 'id'>>
  ) => void
  /** Remove a step */
  removeStep: (stepId: string) => void
  /** Clear all steps */
  clearSteps: () => void
  /** Set all steps (replace) */
  setSteps: (steps: ChainOfThoughtStep[]) => void
  /** Get step by ID */
  getStep: (stepId: string) => ChainOfThoughtStep | undefined
  /** Check if any step is in progress */
  isProcessing: boolean
  /** Check if all steps are complete */
  isComplete: boolean
  /** Get completion percentage */
  completionPercentage: number
}

export function useChainOfThought({
  initialSteps = [],
  autoExpandNew = true,
  autoExpandInProgress = true,
}: UseChainOfThoughtOptions = {}): UseChainOfThoughtReturn {
  const [steps, setSteps] = React.useState<ChainOfThoughtStep[]>(initialSteps)

  const addStep = React.useCallback((step: ChainOfThoughtStep) => {
    setSteps((prev) => [...prev, step])
  }, [])

  const updateStep = React.useCallback(
    (stepId: string, updates: Partial<Omit<ChainOfThoughtStep, 'id'>>) => {
      setSteps((prev) =>
        prev.map((step) =>
          step.id === stepId ? { ...step, ...updates } : step
        )
      )
    },
    []
  )

  const removeStep = React.useCallback((stepId: string) => {
    setSteps((prev) => prev.filter((step) => step.id !== stepId))
  }, [])

  const clearSteps = React.useCallback(() => {
    setSteps([])
  }, [])

  const getStep = React.useCallback(
    (stepId: string) => steps.find((s) => s.id === stepId),
    [steps]
  )

  const isProcessing = React.useMemo(
    () => steps.some((s) => s.status === 'in-progress'),
    [steps]
  )

  const isComplete = React.useMemo(
    () =>
      steps.length > 0 &&
      steps.every(
        (s) => s.status === 'complete' || s.status === 'error' || s.status === 'skipped'
      ),
    [steps]
  )

  const completionPercentage = React.useMemo(() => {
    if (steps.length === 0) return 0
    const completed = steps.filter(
      (s) => s.status === 'complete' || s.status === 'skipped'
    ).length
    return Math.round((completed / steps.length) * 100)
  }, [steps])

  return {
    steps,
    addStep,
    updateStep,
    removeStep,
    clearSteps,
    setSteps,
    getStep,
    isProcessing,
    isComplete,
    completionPercentage,
  }
}
