'use client'

/**
 * Think Component
 *
 * Collapsible reasoning/thinking display panel inspired by Ant Design X's
 * Think component and the RICH paradigm (Reasoning, Insight, Content, Help).
 *
 * Shows AI's thought process in a collapsible panel with visual indicators
 * for thinking state, streaming content, and step-by-step reasoning.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <Think content="Let me analyze this step by step..." />
 *
 * // Streaming with title
 * <Think
 *   title="Reasoning"
 *   content={streamingThought}
 *   isStreaming
 * />
 *
 * // Controlled expansion
 * <Think
 *   content="My thought process..."
 *   expanded={isExpanded}
 *   onExpandedChange={setIsExpanded}
 * />
 *
 * // With steps
 * <Think
 *   title="Analysis"
 *   steps={[
 *     { text: 'Understanding the query', status: 'complete' },
 *     { text: 'Searching knowledge base', status: 'active' },
 *     { text: 'Formulating response', status: 'pending' }
 *   ]}
 * />
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
export type ThinkStepStatus = 'pending' | 'active' | 'complete' | 'error'

/**
 * Individual thinking step
 */
export interface ThinkStep {
  /** Step text */
  text: string
  /** Step status */
  status: ThinkStepStatus
  /** Optional duration in ms */
  duration?: number
}

/**
 * Think component variant
 */
export type ThinkVariant = 'default' | 'minimal' | 'bordered'

/**
 * Props for Think component
 */
export interface ThinkProps {
  /** Title for the thinking section */
  title?: string
  /** Main thinking content (can be streaming) */
  content?: React.ReactNode
  /** Discrete thinking steps */
  steps?: ThinkStep[]
  /** Whether content is streaming */
  isStreaming?: boolean
  /** Whether expanded (controlled) */
  expanded?: boolean
  /** Default expanded state (uncontrolled) */
  defaultExpanded?: boolean
  /** Callback when expansion changes */
  onExpandedChange?: (expanded: boolean) => void
  /** Visual variant */
  variant?: ThinkVariant
  /** Show expand/collapse toggle */
  collapsible?: boolean
  /** Show thinking indicator animation */
  showIndicator?: boolean
  /** Additional CSS class */
  className?: string
  /** Disable animations */
  disableAnimations?: boolean
  /** Custom icon */
  icon?: React.ReactNode
  /** Accessible label */
  'aria-label'?: string
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Variant configurations
 */
const VARIANT_CONFIG: Record<ThinkVariant, {
  container: string
  header: string
  content: string
}> = {
  default: {
    container: 'reasoning-container',
    header: 'reasoning-header',
    content: 'reasoning-content',
  },
  minimal: {
    container: 'rounded-lg overflow-hidden',
    header: 'flex items-center gap-2 px-2 py-1.5 cursor-pointer',
    content: 'px-2 py-2 text-sm',
  },
  bordered: {
    container: 'border rounded-xl overflow-hidden shadow-sm',
    header: 'flex items-center justify-between px-4 py-3 bg-muted/30 cursor-pointer',
    content: 'px-4 py-3 bg-card',
  },
}

/**
 * Step status icons and colors
 */
const STEP_STATUS_CONFIG: Record<ThinkStepStatus, {
  icon: React.ReactNode
  color: string
  dotColor: string
}> = {
  pending: {
    icon: null,
    color: 'text-muted-foreground',
    dotColor: 'bg-muted-foreground/50',
  },
  active: {
    icon: (
      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    ),
    color: 'text-primary',
    dotColor: 'bg-primary',
  },
  complete: {
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
      </svg>
    ),
    color: 'text-success',
    dotColor: 'bg-success',
  },
  error: {
    icon: (
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
      </svg>
    ),
    color: 'text-destructive',
    dotColor: 'bg-destructive',
  },
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Brain/thinking icon
 */
const BrainIcon = React.memo(function BrainIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.54" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.54" />
    </svg>
  )
})

BrainIcon.displayName = 'BrainIcon'

/**
 * Chevron icon for expand/collapse
 */
const ChevronIcon = React.memo(function ChevronIcon({
  expanded,
  className,
}: {
  expanded: boolean
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'reasoning-chevron transition-transform',
        className
      )}
      data-open={expanded}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
})

ChevronIcon.displayName = 'ChevronIcon'

/**
 * Individual step display
 */
interface StepItemProps {
  step: ThinkStep
  index: number
  prefersReducedMotion: boolean
}

const StepItem = React.memo(function StepItem({
  step,
  index,
  prefersReducedMotion,
}: StepItemProps) {
  const config = STEP_STATUS_CONFIG[step.status]

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, x: -10 }}
      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        duration: prefersReducedMotion ? 0 : DURATION_SECONDS.fast,
      }}
      className="reasoning-step"
    >
      {/* Status indicator */}
      <div className={cn('flex items-center justify-center w-4 h-4 flex-shrink-0', config.color)}>
        {config.icon || (
          <div className={cn('reasoning-step-dot', config.dotColor)} />
        )}
      </div>

      {/* Step text */}
      <div className="flex-1 min-w-0">
        <span className={cn('text-sm', config.color)}>
          {step.text}
        </span>
        {step.duration && step.status === 'complete' && (
          <span className="ml-2 text-xs text-muted-foreground tabular-nums">
            {(step.duration / 1000).toFixed(1)}s
          </span>
        )}
      </div>
    </motion.div>
  )
})

StepItem.displayName = 'StepItem'

/**
 * Thinking indicator with animated dots
 */
const ThinkingIndicator = React.memo(function ThinkingIndicator({
  prefersReducedMotion,
}: {
  prefersReducedMotion: boolean
}) {
  return (
    <span className="inline-flex items-center gap-1 ml-2" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1 h-1 rounded-full bg-current"
          animate={
            prefersReducedMotion
              ? { opacity: [0.4, 0.8, 0.4] }
              : { y: [-1, -3, -1], opacity: [0.4, 1, 0.4] }
          }
          transition={{
            duration: 0.6,
            delay: i * 0.15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </span>
  )
})

ThinkingIndicator.displayName = 'ThinkingIndicator'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * Think - Collapsible reasoning/thinking display
 *
 * A component for displaying AI's thought process in a clean,
 * collapsible panel. Supports streaming content, discrete steps,
 * and various visual variants.
 *
 * Following Ant Design X's RICH paradigm:
 * - Reasoning: Shows the AI's thought process
 * - Insight: Highlights key observations
 * - Content: Main response content
 * - Help: Suggestions and guidance
 */
export function Think({
  title = 'Thinking',
  content,
  steps,
  isStreaming = false,
  expanded: controlledExpanded,
  defaultExpanded = false,
  onExpandedChange,
  variant = 'default',
  collapsible = true,
  showIndicator = true,
  className,
  disableAnimations = false,
  icon,
  'aria-label': ariaLabel,
}: ThinkProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimations

  // Expansion state
  const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded)
  const isExpanded = controlledExpanded ?? internalExpanded

  const toggleExpanded = React.useCallback(() => {
    const newValue = !isExpanded
    if (controlledExpanded === undefined) {
      setInternalExpanded(newValue)
    }
    onExpandedChange?.(newValue)
  }, [isExpanded, controlledExpanded, onExpandedChange])

  // Variant config
  const config = VARIANT_CONFIG[variant]

  // Determine if there's any content to show
  const hasContent = content || (steps && steps.length > 0)

  // Auto-expand when streaming starts
  React.useEffect(() => {
    if (isStreaming && !isExpanded && controlledExpanded === undefined) {
      setInternalExpanded(true)
      onExpandedChange?.(true)
    }
  }, [isStreaming, isExpanded, controlledExpanded, onExpandedChange])

  return (
    <div
      className={cn(config.container, className)}
      role="region"
      aria-label={ariaLabel || `${title} section`}
    >
      {/* Header */}
      <div
        className={config.header}
        onClick={collapsible ? toggleExpanded : undefined}
        role={collapsible ? 'button' : undefined}
        aria-expanded={collapsible ? isExpanded : undefined}
        tabIndex={collapsible ? 0 : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  toggleExpanded()
                }
              }
            : undefined
        }
      >
        <div className="reasoning-title">
          {/* Icon */}
          <motion.span
            animate={
              isStreaming && !prefersReducedMotion
                ? { rotate: [0, 5, -5, 0] }
                : {}
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-4 h-4"
          >
            {icon || <BrainIcon className="w-full h-full" />}
          </motion.span>

          {/* Title */}
          <span>{title}</span>

          {/* Streaming indicator */}
          {isStreaming && showIndicator && (
            <ThinkingIndicator prefersReducedMotion={prefersReducedMotion} />
          )}
        </div>

        {/* Expand/collapse chevron */}
        {collapsible && hasContent && (
          <ChevronIcon expanded={isExpanded} className="w-4 h-4" />
        )}
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && hasContent && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.normal,
              ease: EASING_FRAMER.out,
            }}
            className="overflow-hidden"
          >
            <div className={config.content}>
              {/* Steps */}
              {steps && steps.length > 0 && (
                <div className="space-y-1 mb-3">
                  {steps.map((step, index) => (
                    <StepItem
                      key={`step-${index}`}
                      step={step}
                      index={index}
                      prefersReducedMotion={prefersReducedMotion}
                    />
                  ))}
                </div>
              )}

              {/* Main content */}
              {content && (
                <div
                  className={cn(
                    'text-sm text-muted-foreground leading-relaxed',
                    isStreaming && 'streaming-stable'
                  )}
                  aria-busy={isStreaming}
                >
                  {content}
                  {isStreaming && (
                    <span className="message-cursor" aria-hidden="true">▋</span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

Think.displayName = 'Think'

// =============================================================================
// HOOK
// =============================================================================

/**
 * Options for useThink hook
 */
export interface UseThinkOptions {
  /** Initial expanded state */
  initialExpanded?: boolean
  /** Auto-expand on content change */
  autoExpand?: boolean
}

/**
 * Return type for useThink hook
 */
export interface UseThinkReturn {
  /** Whether expanded */
  expanded: boolean
  /** Toggle expansion */
  toggle: () => void
  /** Expand */
  expand: () => void
  /** Collapse */
  collapse: () => void
  /** Current steps */
  steps: ThinkStep[]
  /** Add a step */
  addStep: (text: string, status?: ThinkStepStatus) => void
  /** Update step status */
  updateStepStatus: (index: number, status: ThinkStepStatus, duration?: number) => void
  /** Clear all steps */
  clearSteps: () => void
  /** Props to spread on Think */
  thinkProps: {
    expanded: boolean
    onExpandedChange: (expanded: boolean) => void
    steps: ThinkStep[]
  }
}

/**
 * Hook for managing Think component state
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const think = useThink()
 *
 *   const handleQuery = async () => {
 *     think.expand()
 *     think.addStep('Analyzing query', 'active')
 *
 *     await analyzeQuery()
 *
 *     think.updateStepStatus(0, 'complete', 500)
 *     think.addStep('Generating response', 'active')
 *
 *     await generateResponse()
 *
 *     think.updateStepStatus(1, 'complete', 1200)
 *   }
 *
 *   return (
 *     <>
 *       <Think {...think.thinkProps} title="Processing" />
 *       <button onClick={handleQuery}>Submit</button>
 *     </>
 *   )
 * }
 * ```
 */
export function useThink({
  initialExpanded = false,
  autoExpand = true,
}: UseThinkOptions = {}): UseThinkReturn {
  const [expanded, setExpanded] = React.useState(initialExpanded)
  const [steps, setSteps] = React.useState<ThinkStep[]>([])

  const toggle = React.useCallback(() => setExpanded((prev) => !prev), [])
  const expand = React.useCallback(() => setExpanded(true), [])
  const collapse = React.useCallback(() => setExpanded(false), [])

  const addStep = React.useCallback(
    (text: string, status: ThinkStepStatus = 'pending') => {
      if (autoExpand) {
        setExpanded(true)
      }
      setSteps((prev) => [...prev, { text, status }])
    },
    [autoExpand]
  )

  const updateStepStatus = React.useCallback(
    (index: number, status: ThinkStepStatus, duration?: number) => {
      setSteps((prev) =>
        prev.map((step, i) =>
          i === index ? { ...step, status, duration } : step
        )
      )
    },
    []
  )

  const clearSteps = React.useCallback(() => {
    setSteps([])
  }, [])

  return {
    expanded,
    toggle,
    expand,
    collapse,
    steps,
    addStep,
    updateStepStatus,
    clearSteps,
    thinkProps: {
      expanded,
      onExpandedChange: setExpanded,
      steps,
    },
  }
}
