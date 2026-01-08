/**
 * useTokenBudget Hook
 *
 * React hook for managing token budgets and optimization.
 */
import { useMemo, useCallback } from 'react';
import { estimateMessageTokens, getTokenizerForModel, MODEL_PRESETS, } from '../core/tokenizer';
import { optimizeMessagesForBudget } from '../core/optimizer';
/**
 * Hook for managing token budgets
 */
export function useTokenBudget(options) {
    const { messages, modelMetadata: modelMetadataOption, targetBudget, targetBudgetDollars, priorities = [], summarizeFn, } = options;
    // Resolve model metadata
    const modelMetadata = useMemo(() => {
        if (!modelMetadataOption)
            return undefined;
        if (typeof modelMetadataOption === 'string') {
            return (MODEL_PRESETS[modelMetadataOption] || {
                model: modelMetadataOption,
                maxTokens: 8192,
            });
        }
        return modelMetadataOption;
    }, [modelMetadataOption]);
    // Calculate target budget
    const targetTokens = useMemo(() => {
        if (targetBudget !== undefined) {
            return targetBudget;
        }
        if (targetBudgetDollars !== undefined && modelMetadata?.inputPricePer1K) {
            // Convert dollars to tokens
            return Math.floor((targetBudgetDollars / modelMetadata.inputPricePer1K) * 1000);
        }
        return modelMetadata?.maxTokens ?? 8192;
    }, [targetBudget, targetBudgetDollars, modelMetadata]);
    // Get tokenizer
    const tokenizer = useMemo(() => {
        if (!modelMetadata)
            return getTokenizerForModel('gpt-4');
        return getTokenizerForModel(modelMetadata.model, modelMetadata.tokenizer);
    }, [modelMetadata]);
    // Calculate current tokens
    const currentTokens = useMemo(() => {
        return estimateMessageTokens(messages, tokenizer);
    }, [messages, tokenizer]);
    // Calculate remaining budget
    const remainingBudget = useMemo(() => {
        return Math.max(0, targetTokens - currentTokens);
    }, [targetTokens, currentTokens]);
    // Calculate utilization
    const utilization = useMemo(() => {
        return Math.min(1, currentTokens / targetTokens);
    }, [currentTokens, targetTokens]);
    // Check if exceeded
    const isExceeded = useMemo(() => {
        return currentTokens > targetTokens;
    }, [currentTokens, targetTokens]);
    // Estimate cost
    const estimatedCost = useMemo(() => {
        if (!modelMetadata?.inputPricePer1K)
            return undefined;
        const inputCost = (currentTokens / 1000) * modelMetadata.inputPricePer1K;
        const outputCost = modelMetadata.outputPricePer1K
            ? (0 / 1000) * modelMetadata.outputPricePer1K // Assume 0 output tokens for now
            : 0;
        return {
            inputCost,
            outputCost,
            totalCost: inputCost + outputCost,
        };
    }, [currentTokens, modelMetadata]);
    // Optimize function
    const optimize = useCallback(async (strategy = 'hybrid', customTarget) => {
        const target = customTarget ?? targetTokens;
        const result = await optimizeMessagesForBudget(messages, {
            targetTokens: target,
            strategy,
            modelMetadata,
            tokenizer,
            priorities,
            summarizeFn,
        });
        return result;
    }, [messages, targetTokens, modelMetadata, tokenizer, priorities, summarizeFn]);
    return {
        currentTokens,
        remainingBudget,
        utilization,
        isExceeded,
        estimatedCost,
        optimize,
    };
}
//# sourceMappingURL=use-token-budget.js.map