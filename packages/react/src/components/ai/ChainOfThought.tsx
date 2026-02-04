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
} from '../../animations/constants'

// Import types
import type { ChainOfThoughtProps } from './ChainOfThought.types'

// Import components
import {
  ThoughtStep,
  ChainOfThoughtSkeleton,
  ChainOfThoughtEmpty,
  BrainIcon,
} from './components'

// Re-export types and hooks
export type {
  ChainOfThoughtStep,
  ChainOfThoughtStepStatus,
  ChainOfThoughtVariant,
  ChainOfThoughtProps,
  UseChainOfThoughtOptions,
  UseChainOfThoughtReturn,
} from './ChainOfThought.types'

export { useChainOfThought } from './hooks/useThoughtProcess'

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
    return <ChainOfThoughtEmpty message={emptyMessage} className={className} />
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
                aria-label={
                  allExpanded ? 'Collapse all steps' : 'Expand all steps'
                }
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
            <ThoughtStep
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
