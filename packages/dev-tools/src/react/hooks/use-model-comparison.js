/**
 * React 19 Hook for Model Comparison
 * Uses useOptimistic for real-time comparison updates
 */
'use client';
import * as React from 'react';
import { useOptimistic, useCallback, useMemo } from 'react';
import { ModelComparator } from '../../compare/model-comparison';
function reducer(state, action) {
    switch (action.type) {
        case 'ADD_RESPONSE': {
            const newResponses = new Map(state.responses);
            const existing = newResponses.get(action.promptId) || [];
            newResponses.set(action.promptId, [...existing, action.response]);
            return { ...state, responses: newResponses };
        }
        case 'COMPARE': {
            const newComparisons = new Map(state.comparisons);
            newComparisons.set(action.promptId, action.result);
            return { ...state, comparisons: newComparisons };
        }
        case 'CLEAR': {
            if (action.promptId) {
                const newResponses = new Map(state.responses);
                const newComparisons = new Map(state.comparisons);
                newResponses.delete(action.promptId);
                newComparisons.delete(action.promptId);
                return { ...state, responses: newResponses, comparisons: newComparisons };
            }
            return { comparisons: new Map(), responses: new Map() };
        }
        default:
            return state;
    }
}
/**
 * Hook for Model Comparison with optimistic updates
 */
export function useModelComparison(comparator) {
    const modelComparator = comparator || React.useMemo(() => new ModelComparator(), []);
    // Initialize state
    const [initialState] = React.useState(() => ({
        comparisons: new Map(),
        responses: new Map(),
    }));
    const [state, dispatch] = useOptimistic(initialState, reducer);
    const addResponse = useCallback((promptId, response) => {
        modelComparator.addResponse(promptId, response);
        // Optimistically add response
        dispatch({ type: 'ADD_RESPONSE', promptId, response });
    }, [modelComparator, dispatch]);
    const compare = useCallback((promptId, prompt) => {
        const result = modelComparator.compare(promptId, prompt);
        if (result) {
            dispatch({ type: 'COMPARE', promptId, prompt, result });
        }
        return result;
    }, [modelComparator, dispatch]);
    const clear = useCallback((promptId) => {
        if (promptId) {
            // Note: ModelComparator doesn't have per-prompt clear, so we'll clear all
            // In a real implementation, you might want to add this to ModelComparator
            modelComparator.clear();
        }
        else {
            // Clear all
            modelComparator.clear();
        }
        dispatch({ type: 'CLEAR', promptId });
    }, [modelComparator, dispatch]);
    const getComparison = useCallback((promptId) => {
        return state.comparisons.get(promptId) || null;
    }, [state.comparisons]);
    const getResponses = useCallback((promptId) => {
        return state.responses.get(promptId) || [];
    }, [state.responses]);
    const allComparisons = useMemo(() => {
        return Array.from(state.comparisons.values());
    }, [state.comparisons]);
    const stats = useMemo(() => {
        const allResponses = Array.from(state.responses.values()).flat();
        const allComparisons = Array.from(state.comparisons.values());
        return {
            totalPrompts: state.responses.size,
            totalResponses: allResponses.length,
            totalComparisons: allComparisons.length,
            averageLatency: allComparisons.length > 0
                ? allComparisons.reduce((sum, c) => sum + c.analysis.averageLatency, 0) / allComparisons.length
                : 0,
            totalCost: allComparisons.reduce((sum, c) => sum + c.analysis.totalCost, 0),
        };
    }, [state.responses, state.comparisons]);
    return {
        addResponse,
        compare,
        clear,
        getComparison,
        getResponses,
        allComparisons,
        stats,
    };
}
//# sourceMappingURL=use-model-comparison.js.map