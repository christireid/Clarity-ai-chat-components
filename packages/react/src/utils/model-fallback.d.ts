/**
 * Model Fallback Utilities
 *
 * Flexible utilities for implementing automatic fallback across AI providers.
 * Bring your own retry logic or use these helpers.
 */
export interface FallbackModelConfig {
    provider: string;
    model: string;
    priority: number;
    maxRetries?: number;
}
export interface FallbackOptions {
    models: FallbackModelConfig[];
    maxTotalRetries?: number;
    retryDelay?: number;
    exponentialBackoff?: boolean;
    onFallback?: (from: FallbackModelConfig, to: FallbackModelConfig, error: Error) => void;
    onRetry?: (attempt: number, model: FallbackModelConfig, error: Error) => void;
}
export interface FallbackResult<T> {
    data?: T;
    model: FallbackModelConfig;
    attempts: number;
    errors: Array<{
        model: FallbackModelConfig;
        error: Error;
    }>;
    success: boolean;
}
/**
 * Execute a function with automatic fallback across models
 *
 * @example
 * ```tsx
 * const result = await withModelFallback(
 *   async (model) => {
 *     return await callAI(model.provider, model.model, prompt)
 *   },
 *   {
 *     models: [
 *       { provider: 'openai', model: 'gpt-4', priority: 1 },
 *       { provider: 'anthropic', model: 'claude-3', priority: 2 },
 *       { provider: 'openai', model: 'gpt-3.5', priority: 3 },
 *     ],
 *     onFallback: (from, to, error) => {
 *       console.log(`Falling back from ${from.model} to ${to.model}`)
 *     },
 *   }
 * )
 * ```
 */
export declare function withModelFallback<T>(fn: (model: FallbackModelConfig) => Promise<T>, options: FallbackOptions): Promise<FallbackResult<T>>;
/**
 * Model Fallback Manager
 *
 * Stateful manager for handling fallback logic.
 */
export declare class ModelFallbackManager {
    private models;
    private currentIndex;
    private attempts;
    constructor(models: FallbackModelConfig[]);
    /**
     * Get current model
     */
    getCurrentModel(): FallbackModelConfig;
    /**
     * Get next model (fallback)
     */
    getNextModel(): FallbackModelConfig | null;
    /**
     * Check if more fallback options are available
     */
    hasNextModel(): boolean;
    /**
     * Reset to first model
     */
    reset(): void;
    /**
     * Record an attempt for current model
     */
    recordAttempt(error: Error): void;
    /**
     * Get attempt count for model
     */
    getAttemptCount(model: FallbackModelConfig): number;
    /**
     * Check if should retry current model
     */
    shouldRetry(): boolean;
}
//# sourceMappingURL=model-fallback.d.ts.map