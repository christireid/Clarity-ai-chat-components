/**
 * AI Model Registry
 *
 * Comprehensive model information including pricing, capabilities,
 * and context windows. Updated for 2024/2025 models.
 *
 * Pricing is in USD per 1M tokens.
 * Last updated: December 2024
 */
export interface ModelInfo {
    id: string;
    name: string;
    provider: 'OpenAI' | 'Anthropic' | 'Google' | 'Meta' | 'Mistral' | 'Cohere';
    contextWindow: number;
    maxOutputTokens: number;
    pricing: {
        input: number;
        output: number;
        cached?: number;
    };
    capabilities: string[];
    bestFor: string[];
    releaseDate: string;
    deprecated?: boolean;
    notes?: string;
}
export declare const MODELS: Record<string, ModelInfo>;
/**
 * Get model by ID (case-insensitive, supports aliases)
 */
export declare function getModel(modelId: string): ModelInfo | undefined;
/**
 * Calculate cost for token usage
 */
export declare function calculateCost(modelId: string, inputTokens: number, outputTokens: number, cachedInputTokens?: number): {
    modelId: string;
    inputTokens: number;
    outputTokens: number;
    cachedInputTokens: number;
    inputCost: number;
    outputCost: number;
    cachedCost: number;
    totalCost: number;
    currency: string;
} | null;
/**
 * Get all models by provider
 */
export declare function getModelsByProvider(provider: ModelInfo['provider']): ModelInfo[];
/**
 * Get all available models
 */
export declare function getAllModels(): ModelInfo[];
/**
 * Get recommended models for a use case
 */
export declare function getRecommendedModels(useCase: string): ModelInfo[];
/**
 * Format pricing for display
 */
export declare function formatPricing(model: ModelInfo): string;
//# sourceMappingURL=model-registry.d.ts.map