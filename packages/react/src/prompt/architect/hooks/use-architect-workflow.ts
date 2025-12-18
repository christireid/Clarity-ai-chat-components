/**
 * useArchitectWorkflow Hook
 *
 * React hook for managing the 4-phase architect workflow state.
 *
 * @packageDocumentation
 */

import { useState, useCallback, useMemo } from 'react'
import type {
  ArchitectPhase,
  ArchitectWorkflowState,
  ArchitectConfig,
  AuditResult,
  StrategicPlan,
  ImplementationOutput,
  ReviewResult,
} from '../types'
import { DEFAULT_ARCHITECT_CONFIG } from '../types'

/**
 * Options for the architect workflow hook
 */
export interface UseArchitectWorkflowOptions {
  /** Initial configuration */
  config?: Partial<ArchitectConfig>
  /** Callback when a phase is completed */
  onPhaseComplete?: (
    phase: ArchitectPhase,
    result: AuditResult | StrategicPlan | ImplementationOutput | ReviewResult
  ) => void
  /** Callback when workflow is complete */
  onWorkflowComplete?: (state: ArchitectWorkflowState) => void
  /** Callback on error */
  onError?: (error: string) => void
}

/**
 * Return type for the architect workflow hook
 */
export interface UseArchitectWorkflowReturn {
  /** Current workflow state */
  state: ArchitectWorkflowState
  /** Current configuration */
  config: ArchitectConfig
  /** Update configuration */
  updateConfig: (config: Partial<ArchitectConfig>) => void
  /** Start a new workflow */
  startWorkflow: () => void
  /** Reset the workflow */
  resetWorkflow: () => void
  /** Complete phase 1 (audit) */
  completeAudit: (result: AuditResult) => void
  /** Complete phase 2 (planning) */
  completePlanning: (plan: StrategicPlan) => void
  /** Complete phase 3 (implementation) */
  completeImplementation: (output: ImplementationOutput) => void
  /** Complete phase 4 (review) */
  completeReview: (result: ReviewResult) => void
  /** Add an error to the workflow */
  addError: (error: string) => void
  /** Clear errors */
  clearErrors: () => void
  /** Check if workflow can proceed to next phase */
  canProceed: boolean
  /** Get progress percentage */
  progress: number
  /** Check if current phase is a specific phase */
  isPhase: (phase: ArchitectPhase) => boolean
}

/**
 * Initial workflow state
 */
const INITIAL_STATE: ArchitectWorkflowState = {
  currentPhase: 'analysis',
  isComplete: false,
  errors: [],
}

/**
 * Hook for managing the 4-phase architect workflow
 *
 * @param options - Configuration options
 * @returns Workflow state and actions
 *
 * @example
 * ```typescript
 * const workflow = useArchitectWorkflow({
 *   onPhaseComplete: (phase, result) => {
 *     logger.debug(`Phase ${phase} complete`)
 *   },
 *   onWorkflowComplete: (state) => {
 *     logger.debug('Workflow complete!', state)
 *   },
 * })
 *
 * // Start the workflow
 * workflow.startWorkflow()
 *
 * // Complete each phase
 * workflow.completeAudit(auditResult)
 * workflow.completePlanning(strategicPlan)
 * workflow.completeImplementation(implementation)
 * workflow.completeReview(reviewResult)
 * ```
 */
export function useArchitectWorkflow(
  options: UseArchitectWorkflowOptions = {}
): UseArchitectWorkflowReturn {
  const { onPhaseComplete, onWorkflowComplete, onError } = options

  // Merge config with defaults
  const [config, setConfig] = useState<ArchitectConfig>(() => ({
    ...DEFAULT_ARCHITECT_CONFIG,
    ...options.config,
    styleGuide: {
      ...DEFAULT_ARCHITECT_CONFIG.styleGuide,
      ...options.config?.styleGuide,
      naming: {
        ...DEFAULT_ARCHITECT_CONFIG.styleGuide.naming,
        ...options.config?.styleGuide?.naming,
      },
    },
    documentation: {
      ...DEFAULT_ARCHITECT_CONFIG.documentation,
      ...options.config?.documentation,
    },
  }))

  const [state, setState] = useState<ArchitectWorkflowState>(INITIAL_STATE)

  /**
   * Update configuration
   */
  const updateConfig = useCallback((newConfig: Partial<ArchitectConfig>) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      styleGuide: {
        ...prev.styleGuide,
        ...newConfig.styleGuide,
        naming: {
          ...prev.styleGuide.naming,
          ...newConfig.styleGuide?.naming,
        },
      },
      documentation: {
        ...prev.documentation,
        ...newConfig.documentation,
      },
    }))
  }, [])

  /**
   * Start a new workflow
   */
  const startWorkflow = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  /**
   * Reset the workflow
   */
  const resetWorkflow = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  /**
   * Add an error
   */
  const addError = useCallback(
    (error: string) => {
      setState((prev) => ({
        ...prev,
        errors: [...prev.errors, error],
      }))
      onError?.(error)
    },
    [onError]
  )

  /**
   * Clear errors
   */
  const clearErrors = useCallback(() => {
    setState((prev) => ({
      ...prev,
      errors: [],
    }))
  }, [])

  /**
   * Complete phase 1 (audit)
   */
  const completeAudit = useCallback(
    (result: AuditResult) => {
      setState((prev) => ({
        ...prev,
        auditResult: result,
        currentPhase: 'planning',
      }))
      onPhaseComplete?.('analysis', result)
    },
    [onPhaseComplete]
  )

  /**
   * Complete phase 2 (planning)
   */
  const completePlanning = useCallback(
    (plan: StrategicPlan) => {
      setState((prev) => ({
        ...prev,
        strategicPlan: plan,
        currentPhase: 'implementation',
      }))
      onPhaseComplete?.('planning', plan)
    },
    [onPhaseComplete]
  )

  /**
   * Complete phase 3 (implementation)
   */
  const completeImplementation = useCallback(
    (output: ImplementationOutput) => {
      setState((prev) => ({
        ...prev,
        implementationOutput: output,
        currentPhase: 'review',
      }))
      onPhaseComplete?.('implementation', output)
    },
    [onPhaseComplete]
  )

  /**
   * Complete phase 4 (review)
   */
  const completeReview = useCallback(
    (result: ReviewResult) => {
      const newState: ArchitectWorkflowState = {
        ...state,
        reviewResult: result,
        isComplete: true,
      }
      setState(newState)
      onPhaseComplete?.('review', result)
      onWorkflowComplete?.(newState)
    },
    [state, onPhaseComplete, onWorkflowComplete]
  )

  /**
   * Check if workflow can proceed
   */
  const canProceed = useMemo(() => {
    switch (state.currentPhase) {
      case 'analysis':
        return true
      case 'planning':
        return state.auditResult !== undefined
      case 'implementation':
        return state.strategicPlan !== undefined
      case 'review':
        return state.implementationOutput !== undefined
      default:
        return false
    }
  }, [state])

  /**
   * Calculate progress percentage
   */
  const progress = useMemo(() => {
    if (state.isComplete) return 100
    switch (state.currentPhase) {
      case 'analysis':
        return 0
      case 'planning':
        return 25
      case 'implementation':
        return 50
      case 'review':
        return 75
      default:
        return 0
    }
  }, [state.currentPhase, state.isComplete])

  /**
   * Check if current phase matches
   */
  const isPhase = useCallback(
    (phase: ArchitectPhase) => state.currentPhase === phase,
    [state.currentPhase]
  )

  return {
    state,
    config,
    updateConfig,
    startWorkflow,
    resetWorkflow,
    completeAudit,
    completePlanning,
    completeImplementation,
    completeReview,
    addError,
    clearErrors,
    canProceed,
    progress,
    isPhase,
  }
}
