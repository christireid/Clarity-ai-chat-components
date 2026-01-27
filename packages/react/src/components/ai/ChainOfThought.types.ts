/**
 * Type definitions for ChainOfThought component
 *
 * This file contains all type interfaces and enums used by the ChainOfThought component.
 */

import type * as React from 'react'

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
export type ChainOfThoughtVariant =
  | 'default'
  | 'compact'
  | 'detailed'
  | 'minimal'

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

/**
 * Configuration for step status styling
 */
export interface StatusConfig {
  label: string
  badgeVariant: 'default' | 'info' | 'success' | 'warning' | 'destructive'
  iconColor: string
  bgColor: string
  borderColor: string
}

/**
 * Props for step item component
 */
export interface StepItemProps {
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

/**
 * Props for icon components
 */
export interface IconProps {
  size?: number
  className?: string
}

/**
 * Hook options for managing chain of thought state
 */
export interface UseChainOfThoughtOptions {
  /** Initial steps */
  initialSteps?: ChainOfThoughtStep[]
  /** Auto-expand new steps */
  autoExpandNew?: boolean
  /** Auto-expand in-progress steps */
  autoExpandInProgress?: boolean
}

/**
 * Hook return type for managing chain of thought state
 */
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
