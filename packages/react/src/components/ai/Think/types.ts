/**
 * Type definitions for Think component
 * @packageDocumentation
 */

import type * as React from 'react'

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
