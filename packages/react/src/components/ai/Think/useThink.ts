/**
 * Hook for managing Think component state
 * @packageDocumentation
 */

import * as React from 'react'
import type { UseThinkOptions, UseThinkReturn, ThinkStep, ThinkStepStatus } from './types'

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
