/**
 * Hook for managing chain of thought state
 *
 * Provides state management and utilities for ChainOfThought component.
 */

import * as React from 'react'
import type {
  ChainOfThoughtStep,
  UseChainOfThoughtOptions,
  UseChainOfThoughtReturn,
} from '../ChainOfThought.types'

/**
 * Hook for managing chain of thought state with streaming updates
 *
 * @example
 * ```tsx
 * const { steps, addStep, updateStep, isProcessing } = useChainOfThought({
 *   initialSteps: [],
 *   autoExpandNew: true,
 *   autoExpandInProgress: true,
 * })
 *
 * // Add a new step
 * addStep({
 *   id: '1',
 *   title: 'Analyzing query',
 *   content: 'Breaking down the user request...',
 *   status: 'in-progress',
 * })
 *
 * // Update step status
 * updateStep('1', { status: 'complete' })
 * ```
 */
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
        (s) =>
          s.status === 'complete' ||
          s.status === 'error' ||
          s.status === 'skipped'
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
