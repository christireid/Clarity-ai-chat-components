/**
 * Prompt Architect Studio - Type Definitions
 *
 * Core types for the prompt engineering IDE demo.
 *
 * @packageDocumentation
 */
/**
 * Available model configurations with pricing (as of Dec 2024)
 * Prices are per 1M tokens in USD
 */
export const MODEL_CONFIGS = [
    {
        id: 'gpt-4o',
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 128000,
        maxOutputTokens: 16384,
        supportsStructuredOutput: true,
        inputCostPer1M: 2.5,
        outputCostPer1M: 10,
    },
    {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 128000,
        maxOutputTokens: 16384,
        supportsStructuredOutput: true,
        inputCostPer1M: 0.15,
        outputCostPer1M: 0.6,
    },
    {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        provider: 'openai',
        maxTokens: 128000,
        maxOutputTokens: 4096,
        supportsStructuredOutput: true,
        inputCostPer1M: 10,
        outputCostPer1M: 30,
    },
    {
        id: 'claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        maxTokens: 200000,
        maxOutputTokens: 8192,
        supportsStructuredOutput: false,
        inputCostPer1M: 3,
        outputCostPer1M: 15,
    },
    {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        provider: 'anthropic',
        maxTokens: 200000,
        maxOutputTokens: 4096,
        supportsStructuredOutput: false,
        inputCostPer1M: 15,
        outputCostPer1M: 75,
    },
    {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        maxTokens: 1000000,
        maxOutputTokens: 8192,
        supportsStructuredOutput: true,
        inputCostPer1M: 1.25,
        outputCostPer1M: 5,
    },
    {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        maxTokens: 1000000,
        maxOutputTokens: 8192,
        supportsStructuredOutput: true,
        inputCostPer1M: 0.075,
        outputCostPer1M: 0.3,
    },
    {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        provider: 'google',
        maxTokens: 1000000,
        maxOutputTokens: 8192,
        supportsStructuredOutput: true,
        inputCostPer1M: 0.075,
        outputCostPer1M: 0.3,
    },
];
/**
 * Get model config by ID
 */
export function getModelConfig(modelId) {
    return MODEL_CONFIGS.find((m) => m.id === modelId);
}
/**
 * Get default model config
 */
export function getDefaultModelConfig() {
    return MODEL_CONFIGS[0];
}
/**
 * Calculate estimated cost for a given number of tokens
 *
 * @param inputTokens - Number of input tokens
 * @param outputTokens - Estimated number of output tokens (default: model max / 4)
 * @param modelId - Model identifier
 * @returns Object with input, output, and total costs in USD
 */
export function estimateCost(inputTokens, outputTokens, modelId) {
    const model = getModelConfig(modelId);
    if (!model) {
        return { inputCost: 0, outputCost: 0, totalCost: 0 };
    }
    // Cost per token = cost per 1M / 1,000,000
    const inputCost = (inputTokens * model.inputCostPer1M) / 1_000_000;
    const outputCost = (outputTokens * model.outputCostPer1M) / 1_000_000;
    const totalCost = inputCost + outputCost;
    return { inputCost, outputCost, totalCost };
}
/**
 * Format cost as a display string
 *
 * @param cost - Cost in USD
 * @returns Formatted string like "$0.0012" or "<$0.0001"
 */
export function formatCost(cost) {
    if (cost === 0)
        return '$0.00';
    if (cost < 0.0001)
        return '<$0.0001';
    if (cost < 0.01)
        return `$${cost.toFixed(4)}`;
    if (cost < 1)
        return `$${cost.toFixed(3)}`;
    return `$${cost.toFixed(2)}`;
}
//# sourceMappingURL=types.js.map