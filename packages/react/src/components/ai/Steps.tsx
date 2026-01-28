'use client'

/**
 * Steps Component
 *
 * A workflow/progress component for displaying sequential steps in AI reasoning,
 * task execution, or multi-step processes. Supports multiple variants and
 * real-time status updates.
 *
 * Features:
 * - Sequential step display with status indicators
 * - Multiple variants (vertical, horizontal, compact)
 * - Real-time step updates
 * - Collapsible step details
 * - Duration tracking per step
 * - Accessible with ARIA attributes
 * - Smooth animations with reduced motion support
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Steps
 *   steps={[
 *     { title: 'Analyzing query', status: 'complete' },
 *     { title: 'Searching knowledge base', status: 'active' },
 *     { title: 'Generating response', status: 'pending' },
 *   ]}
 * />
 *
 * // With descriptions and durations
 * <Steps
 *   steps={[
 *     {
 *       title: 'Understanding request',
 *       description: 'Parsing user intent...',
 *       status: 'complete',
 *       duration: 250,
 *     },
 *     {
 *       title: 'Executing tool',
 *       description: 'Running web_search...',
 *       status: 'active',
 *     },
 *   ]}
 * />
 *
 * // Horizontal variant
 * <Steps variant="horizontal" steps={steps} />
 *
 * // Using the hook
 * const steps = useSteps()
 * steps.addStep('Analyzing')
 * steps.completeStep(0)
 * <Steps {...steps.stepsProps} />
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Step status
 */
export type StepStatus = 'pending' | 'active' | 'complete' | 'error' | 'skipped'

/**
 * Step data structure
 */
export interface StepData {
  /** Unique identifier */
  id?: string
  /** Step title */
  title: string
  /** Step description */
  description?: string
  /** Current status */
  status: StepStatus
  /** Duration in ms */
  duration?: number
  /** Sub-steps */
  subSteps?: StepData[]
  /** Custom icon */
  icon?: React.ReactNode
  /** Additional content to show when expanded */
  content?: React.ReactNode
  /** Error message (when status is 'error') */
  error?: string
}

/**
 * Steps variant
 */
export type StepsVariant = 'vertical' | 'horizontal' | 'compact' | 'timeline'

/**
 * Steps size
 */
export type StepsSize = 'sm' | 'md' | 'lg'

/**
 * Props for Steps component
 */
export interface StepsProps {
  /** Steps to display */
  steps: StepData[]
  /** Display variant */
  variant?: StepsVariant
  /** Size preset */
  size?: StepsSize
  /** Show step numbers */
  showNumbers?: boolean
  /** Show durations */
  showDurations?: boolean
  /** Allow collapsible details */
  collapsible?: boolean
  /** Currently expanded step index */
  expandedStep?: number
  /** Callback when step expansion changes */
  onExpandedChange?: (index: number | undefined) => void
  /** Additional CSS class */
  className?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Custom step renderer */
  renderStep?: (step: StepData, index: number) => React.ReactNode
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Size configurations
 */
const SIZE_CONFIG: Record<StepsSize, {
  indicator: string
  title: string
  description: string
  connector: string
  iconSize: number
}> = {
  sm: {
    indicator: 'w-5 h-5',
    title: 'text-xs',
    description: 'text-[10px]',
    connector: 'w-0.5',
    iconSize: 10,
  },
  md: {
    indicator: 'w-7 h-7',
    title: 'text-sm',
    description: 'text-xs',
    connector: 'w-0.5',
    iconSize: 14,
  },
  lg: {
    indicator: 'w-9 h-9',
    title: 'text-base',
    description: 'text-sm',
    connector: 'w-1',
    iconSize: 18,
  },
}

/**
 * Status configurations
 */
const STATUS_CONFIG: Record<StepStatus, {
  bg: string
  text: string
  border: string
  icon: React.ReactNode
}> = {
  pending: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-muted',
    icon: null,
  },
  active: {
    bg: 'bg-primary',
    text: 'text-primary-foreground',
    border: 'border-primary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full animate-spin">
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
    ),
  },
  complete: {
    bg: 'bg-success',
    text: 'text-success-foreground',
    border: 'border-success',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  error: {
    bg: 'bg-destructive',
    text: 'text-destructive-foreground',
    border: 'border-destructive',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    ),
  },
  skipped: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-muted',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-full h-full">
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Format duration
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Step indicator (circle with status icon)
 */
interface StepIndicatorProps {
  status: StepStatus
  number?: number
  showNumber: boolean
  size: StepsSize
  icon?: React.ReactNode
  prefersReducedMotion: boolean
}

const StepIndicator = React.memo(function StepIndicator({
  status,
  number,
  showNumber,
  size,
  icon,
  prefersReducedMotion,
}: StepIndicatorProps) {
  const sizeConfig = SIZE_CONFIG[size]
  const statusConfig = STATUS_CONFIG[status]

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { scale: 0.8, opacity: 0 }}
      animate={prefersReducedMotion ? {} : { scale: 1, opacity: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        'step-indicator',
        'flex-shrink-0 rounded-full',
        'flex items-center justify-center',
        'border-2 transition-colors duration-200',
        sizeConfig.indicator,
        statusConfig.bg,
        statusConfig.text,
        statusConfig.border
      )}
    >
      {icon || statusConfig.icon || (showNumber && number !== undefined ? (
        <span className="font-medium text-[0.65em]">{number}</span>
      ) : null)}
    </motion.div>
  )
})

StepIndicator.displayName = 'StepIndicator'

/**
 * Connector line between steps
 */
interface StepConnectorProps {
  status: StepStatus
  nextStatus?: StepStatus
  variant: StepsVariant
  size: StepsSize
  prefersReducedMotion: boolean
}

const StepConnector = React.memo(function StepConnector({
  status,
  nextStatus,
  variant,
  size,
  prefersReducedMotion,
}: StepConnectorProps) {
  const sizeConfig = SIZE_CONFIG[size]
  const isComplete = status === 'complete'

  if (variant === 'horizontal') {
    return (
      <div className="flex-1 h-0.5 mx-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={prefersReducedMotion ? {} : { width: 0 }}
          animate={prefersReducedMotion ? {} : { width: isComplete ? '100%' : '0%' }}
          transition={{
            duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
            ease: EASING_FRAMER.out,
          }}
          className="h-full bg-success rounded-full"
        />
      </div>
    )
  }

  // Vertical connector
  return (
    <div
      className={cn(
        'step-connector',
        'absolute left-1/2 -translate-x-1/2',
        'h-full bg-muted rounded-full overflow-hidden',
        sizeConfig.connector
      )}
      style={{ top: '100%' }}
    >
      <motion.div
        initial={prefersReducedMotion ? {} : { height: 0 }}
        animate={prefersReducedMotion ? {} : { height: isComplete ? '100%' : '0%' }}
        transition={{
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.normal,
          ease: EASING_FRAMER.out,
        }}
        className="w-full bg-success rounded-full"
      />
    </div>
  )
})

StepConnector.displayName = 'StepConnector'

/**
 * Single step item
 */
interface StepItemProps {
  step: StepData
  index: number
  total: number
  variant: StepsVariant
  size: StepsSize
  showNumbers: boolean
  showDurations: boolean
  collapsible: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  prefersReducedMotion: boolean
  renderStep?: (step: StepData, index: number) => React.ReactNode
}

const StepItem = React.memo(function StepItem({
  step,
  index,
  total,
  variant,
  size,
  showNumbers,
  showDurations,
  collapsible,
  isExpanded,
  onToggleExpand,
  prefersReducedMotion,
  renderStep,
}: StepItemProps) {
  const sizeConfig = SIZE_CONFIG[size]
  const statusConfig = STATUS_CONFIG[step.status]
  const isLast = index === total - 1
  const hasExpandableContent = step.description || step.content || step.error || (step.subSteps && step.subSteps.length > 0)

  // Custom renderer
  if (renderStep) {
    return <>{renderStep(step, index)}</>
  }

  // Horizontal variant
  if (variant === 'horizontal') {
    return (
      <div className="step-item flex items-center">
        <div className="flex flex-col items-center">
          <StepIndicator
            status={step.status}
            number={index + 1}
            showNumber={showNumbers}
            size={size}
            icon={step.icon}
            prefersReducedMotion={prefersReducedMotion}
          />
          <span className={cn('mt-2 text-center', sizeConfig.title, statusConfig.text)}>
            {step.title}
          </span>
          {showDurations && step.duration !== undefined && (
            <span className={cn('text-muted-foreground tabular-nums', sizeConfig.description)}>
              {formatDuration(step.duration)}
            </span>
          )}
        </div>
        {!isLast && (
          <StepConnector
            status={step.status}
            variant={variant}
            size={size}
            prefersReducedMotion={prefersReducedMotion}
          />
        )}
      </div>
    )
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
        transition={{
          delay: index * 0.05,
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        }}
        className={cn(
          'step-item-compact',
          'flex items-center gap-2 py-1'
        )}
      >
        <div className={cn(
          'w-1.5 h-1.5 rounded-full flex-shrink-0',
          statusConfig.bg
        )} />
        <span className={cn(
          sizeConfig.title,
          step.status === 'active' ? 'text-foreground font-medium' : 'text-muted-foreground'
        )}>
          {step.title}
        </span>
        {step.status === 'active' && (
          <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {showDurations && step.duration !== undefined && step.status === 'complete' && (
          <span className={cn('text-muted-foreground tabular-nums ml-auto', sizeConfig.description)}>
            {formatDuration(step.duration)}
          </span>
        )}
      </motion.div>
    )
  }

  // Timeline variant
  if (variant === 'timeline') {
    return (
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        transition={{
          delay: index * 0.1,
          duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
        }}
        className="step-item-timeline relative pl-8 pb-6 last:pb-0"
      >
        {/* Timeline line */}
        {!isLast && (
          <div className="absolute left-[0.6875rem] top-7 bottom-0 w-0.5 bg-muted" />
        )}

        {/* Indicator */}
        <div className="absolute left-0 top-0">
          <StepIndicator
            status={step.status}
            number={index + 1}
            showNumber={showNumbers}
            size="sm"
            icon={step.icon}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            collapsible && hasExpandableContent && 'cursor-pointer'
          )}
          onClick={collapsible && hasExpandableContent ? onToggleExpand : undefined}
        >
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-medium',
              sizeConfig.title,
              step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
            )}>
              {step.title}
            </span>
            {showDurations && step.duration !== undefined && (
              <span className={cn('text-muted-foreground tabular-nums', sizeConfig.description)}>
                {formatDuration(step.duration)}
              </span>
            )}
          </div>

          {/* Expandable content */}
          <AnimatePresence>
            {(isExpanded || !collapsible) && hasExpandableContent && (
              <motion.div
                initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{
                  duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
                }}
                className="overflow-hidden"
              >
                {step.description && (
                  <p className={cn('mt-1 text-muted-foreground', sizeConfig.description)}>
                    {step.description}
                  </p>
                )}
                {step.error && (
                  <p className={cn('mt-1 text-destructive', sizeConfig.description)}>
                    {step.error}
                  </p>
                )}
                {step.content && (
                  <div className="mt-2">{step.content}</div>
                )}
                {step.subSteps && step.subSteps.length > 0 && (
                  <div className="mt-2 ml-2 border-l-2 border-muted pl-3 space-y-1">
                    {step.subSteps.map((subStep, subIndex) => (
                      <div key={subStep.id || subIndex} className="flex items-center gap-2">
                        <div className={cn(
                          'w-1 h-1 rounded-full',
                          STATUS_CONFIG[subStep.status].bg
                        )} />
                        <span className={cn(
                          sizeConfig.description,
                          subStep.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                        )}>
                          {subStep.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Vertical variant (default)
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
      }}
      className="step-item flex gap-4"
    >
      {/* Indicator column */}
      <div className="relative flex flex-col items-center">
        <StepIndicator
          status={step.status}
          number={index + 1}
          showNumber={showNumbers}
          size={size}
          icon={step.icon}
          prefersReducedMotion={prefersReducedMotion}
        />
        {!isLast && (
          <div className="flex-1 min-h-[2rem] py-2">
            <StepConnector
              status={step.status}
              variant={variant}
              size={size}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>
        )}
      </div>

      {/* Content column */}
      <div
        className={cn(
          'flex-1 min-w-0 pb-6',
          collapsible && hasExpandableContent && 'cursor-pointer'
        )}
        onClick={collapsible && hasExpandableContent ? onToggleExpand : undefined}
      >
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium',
            sizeConfig.title,
            step.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
          )}>
            {step.title}
          </span>
          {showDurations && step.duration !== undefined && (
            <span className={cn('text-muted-foreground tabular-nums', sizeConfig.description)}>
              {formatDuration(step.duration)}
            </span>
          )}
          {collapsible && hasExpandableContent && (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                'w-4 h-4 text-muted-foreground transition-transform',
                isExpanded && 'rotate-180'
              )}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </div>

        {/* Expandable content */}
        <AnimatePresence>
          {(isExpanded || !collapsible) && hasExpandableContent && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
              transition={{
                duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
              }}
              className="overflow-hidden"
            >
              {step.description && (
                <p className={cn('mt-1 text-muted-foreground', sizeConfig.description)}>
                  {step.description}
                </p>
              )}
              {step.error && (
                <p className={cn('mt-1 text-destructive', sizeConfig.description)}>
                  {step.error}
                </p>
              )}
              {step.content && (
                <div className="mt-2">{step.content}</div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})

StepItem.displayName = 'StepItem'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Steps - Workflow/progress component
 *
 * Displays sequential steps with status indicators. Perfect for showing
 * AI reasoning, task progress, or multi-step workflows.
 */
export function Steps({
  steps,
  variant = 'vertical',
  size = 'md',
  showNumbers = true,
  showDurations = true,
  collapsible = false,
  expandedStep,
  onExpandedChange,
  className,
  disableAnimations = false,
  renderStep,
}: StepsProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations
  const [internalExpanded, setInternalExpanded] = React.useState<number | undefined>(undefined)
  const expanded = expandedStep ?? internalExpanded

  const handleToggleExpand = React.useCallback((index: number) => {
    const newExpanded = expanded === index ? undefined : index
    if (expandedStep === undefined) {
      setInternalExpanded(newExpanded)
    }
    onExpandedChange?.(newExpanded)
  }, [expanded, expandedStep, onExpandedChange])

  if (steps.length === 0) return null

  // Horizontal variant layout
  if (variant === 'horizontal') {
    return (
      <div
        className={cn('steps steps-horizontal flex items-start justify-between', className)}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => (
          <StepItem
            key={step.id || index}
            step={step}
            index={index}
            total={steps.length}
            variant={variant}
            size={size}
            showNumbers={showNumbers}
            showDurations={showDurations}
            collapsible={collapsible}
            isExpanded={expanded === index}
            onToggleExpand={() => handleToggleExpand(index)}
            prefersReducedMotion={prefersReducedMotion}
            renderStep={renderStep}
          />
        ))}
      </div>
    )
  }

  // Compact variant layout
  if (variant === 'compact') {
    return (
      <div
        className={cn('steps steps-compact', className)}
        role="list"
        aria-label="Progress steps"
      >
        {steps.map((step, index) => (
          <StepItem
            key={step.id || index}
            step={step}
            index={index}
            total={steps.length}
            variant={variant}
            size={size}
            showNumbers={showNumbers}
            showDurations={showDurations}
            collapsible={collapsible}
            isExpanded={expanded === index}
            onToggleExpand={() => handleToggleExpand(index)}
            prefersReducedMotion={prefersReducedMotion}
            renderStep={renderStep}
          />
        ))}
      </div>
    )
  }

  // Vertical/timeline variant layout
  return (
    <div
      className={cn('steps', `steps-${variant}`, className)}
      role="list"
      aria-label="Progress steps"
    >
      {steps.map((step, index) => (
        <StepItem
          key={step.id || index}
          step={step}
          index={index}
          total={steps.length}
          variant={variant}
          size={size}
          showNumbers={showNumbers}
          showDurations={showDurations}
          collapsible={collapsible}
          isExpanded={expanded === index}
          onToggleExpand={() => handleToggleExpand(index)}
          prefersReducedMotion={prefersReducedMotion}
          renderStep={renderStep}
        />
      ))}
    </div>
  )
}

Steps.displayName = 'Steps'

// =============================================================================
// HOOK
// =============================================================================

/**
 * Options for useSteps hook
 */
export interface UseStepsOptions {
  /** Initial steps */
  initialSteps?: StepData[]
  /** Auto-advance to next step on complete */
  autoAdvance?: boolean
}

/**
 * Return type for useSteps hook
 */
export interface UseStepsReturn {
  /** Current steps */
  steps: StepData[]
  /** Current active step index */
  activeIndex: number
  /** Add a new step */
  addStep: (title: string, description?: string) => void
  /** Update step status */
  updateStep: (index: number, updates: Partial<StepData>) => void
  /** Complete a step */
  completeStep: (index: number, duration?: number) => void
  /** Fail a step */
  failStep: (index: number, error?: string) => void
  /** Skip a step */
  skipStep: (index: number) => void
  /** Set step as active */
  setActive: (index: number) => void
  /** Reset all steps */
  reset: () => void
  /** Clear all steps */
  clear: () => void
  /** Props for Steps component */
  stepsProps: { steps: StepData[] }
}

/**
 * Hook for managing Steps state
 */
export function useSteps({
  initialSteps = [],
  autoAdvance = true,
}: UseStepsOptions = {}): UseStepsReturn {
  const [steps, setSteps] = React.useState<StepData[]>(initialSteps)
  const startTimesRef = React.useRef<Map<number, number>>(new Map())

  const activeIndex = React.useMemo(() => {
    const idx = steps.findIndex((s) => s.status === 'active')
    return idx >= 0 ? idx : steps.length - 1
  }, [steps])

  const addStep = React.useCallback((title: string, description?: string) => {
    setSteps((prev) => [
      ...prev,
      {
        id: `step-${Date.now()}`,
        title,
        description,
        status: prev.length === 0 ? 'active' : 'pending',
      },
    ])
    if (steps.length === 0) {
      startTimesRef.current.set(0, Date.now())
    }
  }, [steps.length])

  const updateStep = React.useCallback((index: number, updates: Partial<StepData>) => {
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, ...updates } : step
      )
    )
  }, [])

  const completeStep = React.useCallback((index: number, duration?: number) => {
    const startTime = startTimesRef.current.get(index)
    const computedDuration = duration ?? (startTime ? Date.now() - startTime : undefined)

    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === index) {
          return { ...step, status: 'complete', duration: computedDuration }
        }
        if (autoAdvance && i === index + 1 && step.status === 'pending') {
          startTimesRef.current.set(i, Date.now())
          return { ...step, status: 'active' }
        }
        return step
      })
    )
  }, [autoAdvance])

  const failStep = React.useCallback((index: number, error?: string) => {
    const startTime = startTimesRef.current.get(index)
    const duration = startTime ? Date.now() - startTime : undefined

    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, status: 'error', error, duration } : step
      )
    )
  }, [])

  const skipStep = React.useCallback((index: number) => {
    setSteps((prev) =>
      prev.map((step, i) => {
        if (i === index) {
          return { ...step, status: 'skipped' }
        }
        if (autoAdvance && i === index + 1 && step.status === 'pending') {
          startTimesRef.current.set(i, Date.now())
          return { ...step, status: 'active' }
        }
        return step
      })
    )
  }, [autoAdvance])

  const setActive = React.useCallback((index: number) => {
    startTimesRef.current.set(index, Date.now())
    setSteps((prev) =>
      prev.map((step, i) =>
        i === index ? { ...step, status: 'active' } : step
      )
    )
  }, [])

  const reset = React.useCallback(() => {
    startTimesRef.current.clear()
    setSteps((prev) =>
      prev.map((step, i) => ({
        ...step,
        status: i === 0 ? 'active' : 'pending',
        duration: undefined,
        error: undefined,
      }))
    )
    startTimesRef.current.set(0, Date.now())
  }, [])

  const clear = React.useCallback(() => {
    startTimesRef.current.clear()
    setSteps([])
  }, [])

  return {
    steps,
    activeIndex,
    addStep,
    updateStep,
    completeStep,
    failStep,
    skipStep,
    setActive,
    reset,
    clear,
    stepsProps: { steps },
  }
}
