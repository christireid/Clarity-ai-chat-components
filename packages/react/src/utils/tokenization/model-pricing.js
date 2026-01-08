/**
 * Model Pricing and Cost Calculation
 *
 * Pricing data is derived from MODEL_REGISTRY (single source of truth).
 * This module provides cost calculation utilities and a backwards-compatible
 * MODEL_PRICING export for existing consumers.
 */
import { MODEL_REGISTRY, } from './model-registry';
/**
 * Convert MODEL_REGISTRY TokenModelConfig to ModelPricing format
 */
function toModelPricing(config) {
    // Map providers not supported in ModelPricing to 'other'
    const normalizedProvider = config.provider === 'meta' || config.provider === 'mistral'
        ? 'other'
        : config.provider;
    return {
        inputCostPer1M: config.inputCostPer1M,
        outputCostPer1M: config.outputCostPer1M,
        cachedInputCostPer1M: config.cachedInputCostPer1M,
        contextWindow: config.contextWindow,
        maxOutputTokens: config.maxOutputTokens,
        provider: normalizedProvider,
    };
}
/**
 * Model pricing database - derived from MODEL_REGISTRY
 *
 * This is the backwards-compatible export. All pricing data now comes from
 * MODEL_REGISTRY to ensure consistency across the codebase.
 */
export const MODEL_PRICING = Object.fromEntries(Object.entries(MODEL_REGISTRY).map(([id, config]) => [
    id,
    toModelPricing(config),
]));
/**
 * Calculate cost for a given number of tokens
 *
 * @example
 * ```ts
 * const cost = calculateCost({
 *   model: 'gpt-4',
 *   inputTokens: 1000,
 *   outputTokens: 500
 * })
 * console.log(cost.totalCost) // $0.06
 * ```
 */
export function calculateCost(params) {
    const { model, inputTokens, outputTokens, cachedInputTokens = 0 } = params;
    const pricing = MODEL_PRICING[model];
    if (!pricing) {
        throw new Error(`Unknown model: ${model}`);
    }
    const inputCost = (inputTokens / 1_000_000) * pricing.inputCostPer1M;
    const outputCost = (outputTokens / 1_000_000) * pricing.outputCostPer1M;
    let cachedInputCost = 0;
    if (cachedInputTokens > 0 && pricing.cachedInputCostPer1M) {
        cachedInputCost =
            (cachedInputTokens / 1_000_000) * pricing.cachedInputCostPer1M;
    }
    return {
        inputCost,
        outputCost,
        cachedInputCost: cachedInputTokens > 0 ? cachedInputCost : undefined,
        totalCost: inputCost + outputCost + cachedInputCost,
        model,
        breakdown: {
            inputTokens,
            outputTokens,
            cachedInputTokens: cachedInputTokens > 0 ? cachedInputTokens : undefined,
        },
    };
}
/**
 * Calculate potential savings from caching
 */
export function calculateCacheSavings(params) {
    const { model, inputTokens, cacheHitRate } = params;
    const pricing = MODEL_PRICING[model];
    if (!pricing || !pricing.cachedInputCostPer1M) {
        return {
            withoutCache: 0,
            withCache: 0,
            savings: 0,
            savingsPercent: 0,
        };
    }
    const cachedTokens = Math.floor(inputTokens * cacheHitRate);
    const uncachedTokens = inputTokens - cachedTokens;
    const withoutCache = (inputTokens / 1_000_000) * pricing.inputCostPer1M;
    const withCache = (uncachedTokens / 1_000_000) * pricing.inputCostPer1M +
        (cachedTokens / 1_000_000) * pricing.cachedInputCostPer1M;
    const savings = withoutCache - withCache;
    const savingsPercent = withoutCache > 0 ? (savings / withoutCache) * 100 : 0;
    return {
        withoutCache,
        withCache,
        savings,
        savingsPercent,
    };
}
/**
 * Estimate cost for a conversation
 */
export function estimateConversationCost(params) {
    const { model, averageInputTokens, averageOutputTokens, messagesPerDay, daysPerMonth = 30, } = params;
    const costPerMessage = calculateCost({
        model,
        inputTokens: averageInputTokens,
        outputTokens: averageOutputTokens,
    }).totalCost;
    const costPerDay = costPerMessage * messagesPerDay;
    const costPerMonth = costPerDay * daysPerMonth;
    return {
        costPerMessage,
        costPerDay,
        costPerMonth,
    };
}
/**
 * Compare costs across models
 */
export function compareModelCosts(params) {
    const { models, inputTokens, outputTokens } = params;
    const results = models.map((model) => {
        const cost = calculateCost({ model, inputTokens, outputTokens });
        return {
            model,
            cost: cost.totalCost,
            pricing: MODEL_PRICING[model],
        };
    });
    // Sort by cost (ascending)
    results.sort((a, b) => a.cost - b.cost);
    // Calculate savings relative to most expensive
    const maxCost = Math.max(...results.map((r) => r.cost));
    return results.map((r) => ({
        model: r.model,
        cost: r.cost,
        savings: maxCost - r.cost,
        savingsPercent: maxCost > 0 ? ((maxCost - r.cost) / maxCost) * 100 : 0,
        pricing: r.pricing,
    }));
}
/**
 * Get recommended model based on budget and requirements
 */
export function recommendModel(params) {
    const { inputTokens, outputTokens, maxCostPerRequest, minContextWindow = 8000, providers, } = params;
    // Filter models by requirements
    const candidateModels = Object.entries(MODEL_PRICING).filter(([_, pricing]) => {
        if (minContextWindow && pricing.contextWindow < minContextWindow)
            return false;
        if (providers &&
            !providers.includes(pricing.provider))
            return false;
        return true;
    });
    // Calculate costs and filter by budget
    const modelsWithCosts = candidateModels
        .map(([model, pricing]) => {
        const cost = calculateCost({ model, inputTokens, outputTokens });
        return { model, cost: cost.totalCost, pricing };
    })
        .filter((m) => !maxCostPerRequest || m.cost <= maxCostPerRequest)
        .sort((a, b) => a.cost - b.cost);
    if (modelsWithCosts.length === 0) {
        return {
            recommended: 'gpt-3.5-turbo',
            alternatives: [],
            reasoning: 'No models match requirements. Using fallback.',
        };
    }
    const recommended = modelsWithCosts[0];
    const alternatives = modelsWithCosts.slice(1, 4).map((m) => m.model);
    return {
        recommended: recommended.model,
        alternatives,
        reasoning: `Cheapest option at $${recommended.cost.toFixed(4)} per request with ${recommended.pricing.contextWindow.toLocaleString()} token context window.`,
    };
}
/**
 * Get pricing info for a specific model
 *
 * @param modelId - Model identifier
 * @returns ModelPricing or undefined if not found
 */
export function getModelPricing(modelId) {
    return MODEL_PRICING[modelId];
}
/**
 * Check if a model supports caching
 */
export function modelSupportsCaching(modelId) {
    const pricing = MODEL_PRICING[modelId];
    return pricing?.cachedInputCostPer1M !== undefined;
}
/**
 * Get all models that support caching
 */
export function getModelsWithCaching() {
    return Object.entries(MODEL_PRICING)
        .filter(([_, pricing]) => pricing.cachedInputCostPer1M !== undefined)
        .map(([id]) => id);
}
//# sourceMappingURL=model-pricing.js.map