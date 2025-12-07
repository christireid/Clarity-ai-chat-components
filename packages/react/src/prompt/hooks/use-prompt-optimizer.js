/**
 * usePromptOptimizer Hook
 *
 * Wraps the prompt optimization engine for React components.
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { optimizePrompt } from '../core/engine/prompt-optimizer';
/**
 * Hook for prompt optimization
 */
export function usePromptOptimizer(options) {
    const { toon, messages = [], memoryContext, model, targetTokens, strategies, userIntent, autoOptimize = true, applyStyleTransformation = true, summarizeFn, getEmbedding, debug = false, } = options;
    const [result, setResult] = useState(null);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [error, setError] = useState(null);
    const optimizeOptions = useMemo(() => ({
        toonDefinition: toon,
        messages,
        memoryContext,
        modelProfile: model,
        targetTokens,
        strategies,
        userIntent,
        applyStyleTransformation,
        summarizeFn,
        getEmbedding,
        debug,
    }), [
        toon,
        messages,
        memoryContext,
        model,
        targetTokens,
        strategies,
        userIntent,
        applyStyleTransformation,
        summarizeFn,
        getEmbedding,
        debug,
    ]);
    const performOptimization = useCallback(async () => {
        setIsOptimizing(true);
        setError(null);
        try {
            const optimizationResult = await optimizePrompt(optimizeOptions);
            setResult(optimizationResult);
        }
        catch (err) {
            const error = err instanceof Error ? err : new Error(String(err));
            setError(error);
            // Error is stored in state and can be accessed by consumer
            // Debug logging can be added by consumer if needed
        }
        finally {
            setIsOptimizing(false);
        }
    }, [optimizeOptions, debug]);
    // Auto-optimize when dependencies change
    useEffect(() => {
        if (autoOptimize) {
            performOptimization();
        }
    }, [autoOptimize, performOptimization]);
    // Return default values if no optimization has run
    if (!result) {
        return {
            optimizedMessages: messages,
            tokenStats: {
                inputTokens: 0,
                remainingBudget: targetTokens ?? 0,
                utilization: 0,
            },
            diagnostics: {
                originalTokens: 0,
                finalTokens: 0,
                totalTokensSaved: 0,
                wasOptimized: false,
                reason: 'Not optimized yet',
                stages: [],
            },
            optimize: performOptimization,
            isOptimizing,
            error,
        };
    }
    return {
        optimizedMessages: result.optimizedMessages,
        tokenStats: result.tokenStats,
        costEstimate: result.costEstimate,
        diagnostics: {
            originalTokens: result.diagnostics.originalTokens,
            finalTokens: result.diagnostics.finalTokens,
            totalTokensSaved: result.diagnostics.totalTokensSaved,
            wasOptimized: result.diagnostics.wasOptimized,
            reason: result.diagnostics.reason,
            stages: result.diagnostics.stages.map((stage) => ({
                name: stage.name,
                tokensBefore: stage.tokensBefore,
                tokensAfter: stage.tokensAfter,
                tokensSaved: stage.tokensSaved,
                details: stage.details,
            })),
        },
        optimize: performOptimization,
        isOptimizing,
        error,
    };
}
//# sourceMappingURL=use-prompt-optimizer.js.map