/**
 * useArchitectWorkflow Hook
 *
 * React hook for managing the 4-phase architect workflow state.
 *
 * @packageDocumentation
 */
import { useState, useCallback, useMemo } from 'react';
import { DEFAULT_ARCHITECT_CONFIG } from '../types';
/**
 * Initial workflow state
 */
const INITIAL_STATE = {
    currentPhase: 'analysis',
    isComplete: false,
    errors: [],
};
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
 *     console.log(`Phase ${phase} complete`)
 *   },
 *   onWorkflowComplete: (state) => {
 *     console.log('Workflow complete!', state)
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
export function useArchitectWorkflow(options = {}) {
    const { onPhaseComplete, onWorkflowComplete, onError } = options;
    // Merge config with defaults
    const [config, setConfig] = useState(() => ({
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
    }));
    const [state, setState] = useState(INITIAL_STATE);
    /**
     * Update configuration
     */
    const updateConfig = useCallback((newConfig) => {
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
        }));
    }, []);
    /**
     * Start a new workflow
     */
    const startWorkflow = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);
    /**
     * Reset the workflow
     */
    const resetWorkflow = useCallback(() => {
        setState(INITIAL_STATE);
    }, []);
    /**
     * Add an error
     */
    const addError = useCallback((error) => {
        setState((prev) => ({
            ...prev,
            errors: [...prev.errors, error],
        }));
        onError?.(error);
    }, [onError]);
    /**
     * Clear errors
     */
    const clearErrors = useCallback(() => {
        setState((prev) => ({
            ...prev,
            errors: [],
        }));
    }, []);
    /**
     * Complete phase 1 (audit)
     */
    const completeAudit = useCallback((result) => {
        setState((prev) => ({
            ...prev,
            auditResult: result,
            currentPhase: 'planning',
        }));
        onPhaseComplete?.('analysis', result);
    }, [onPhaseComplete]);
    /**
     * Complete phase 2 (planning)
     */
    const completePlanning = useCallback((plan) => {
        setState((prev) => ({
            ...prev,
            strategicPlan: plan,
            currentPhase: 'implementation',
        }));
        onPhaseComplete?.('planning', plan);
    }, [onPhaseComplete]);
    /**
     * Complete phase 3 (implementation)
     */
    const completeImplementation = useCallback((output) => {
        setState((prev) => ({
            ...prev,
            implementationOutput: output,
            currentPhase: 'review',
        }));
        onPhaseComplete?.('implementation', output);
    }, [onPhaseComplete]);
    /**
     * Complete phase 4 (review)
     */
    const completeReview = useCallback((result) => {
        const newState = {
            ...state,
            reviewResult: result,
            isComplete: true,
        };
        setState(newState);
        onPhaseComplete?.('review', result);
        onWorkflowComplete?.(newState);
    }, [state, onPhaseComplete, onWorkflowComplete]);
    /**
     * Check if workflow can proceed
     */
    const canProceed = useMemo(() => {
        switch (state.currentPhase) {
            case 'analysis':
                return true;
            case 'planning':
                return state.auditResult !== undefined;
            case 'implementation':
                return state.strategicPlan !== undefined;
            case 'review':
                return state.implementationOutput !== undefined;
            default:
                return false;
        }
    }, [state]);
    /**
     * Calculate progress percentage
     */
    const progress = useMemo(() => {
        if (state.isComplete)
            return 100;
        switch (state.currentPhase) {
            case 'analysis':
                return 0;
            case 'planning':
                return 25;
            case 'implementation':
                return 50;
            case 'review':
                return 75;
            default:
                return 0;
        }
    }, [state.currentPhase, state.isComplete]);
    /**
     * Check if current phase matches
     */
    const isPhase = useCallback((phase) => state.currentPhase === phase, [state.currentPhase]);
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
    };
}
//# sourceMappingURL=use-architect-workflow.js.map