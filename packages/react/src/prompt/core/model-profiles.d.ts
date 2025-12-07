/**
 * Model Capability Profiles
 *
 * Detailed profiles for different AI models including:
 * - Token limits and pricing
 * - Optimal prompt styles
 * - Compression thresholds
 * - Feature capabilities
 */
import type { Tokenizer } from './tokenizer';
/**
 * Prompt style preference
 */
export type PromptStyle = 'concise' | 'dense' | 'structured' | 'verbose';
/**
 * Model family identifier
 */
export type ModelFamily = 'openai' | 'anthropic' | 'google' | 'mistral' | 'meta' | 'other';
/**
 * Model capability profile
 */
export interface ModelProfile {
    /** Model identifier */
    name: string;
    /** Display name */
    displayName: string;
    /** Model family */
    family: ModelFamily;
    /** Maximum context tokens */
    maxTokens: number;
    /** Maximum output tokens */
    maxOutputTokens: number;
    /** Tokenizer to use */
    tokenizer: Tokenizer;
    /** Input cost per 1K tokens */
    costPer1K: number;
    /** Output cost per 1K tokens */
    outputCostPer1K: number;
    /** Optimal prompt style for this model */
    optimalPromptStyle: PromptStyle;
    /** Compression threshold (0-1, start compressing at this utilization) */
    compressionThreshold: number;
    /** Feature flags */
    features: {
        /** Supports function/tool calling */
        functions: boolean;
        /** Supports streaming */
        streaming: boolean;
        /** Supports vision/images */
        vision: boolean;
        /** Supports JSON mode */
        jsonMode: boolean;
    };
    /** Model-specific notes */
    notes?: string;
}
/**
 * Model profiles for common models
 */
export declare const MODEL_PROFILES: Record<string, ModelProfile>;
/**
 * Get model profile by name
 */
export declare function getModelProfile(modelName: string): ModelProfile | undefined;
/**
 * Get model profile with fallback to default
 */
export declare function getModelProfileOrDefault(modelName: string, defaultProfile?: ModelProfile): ModelProfile;
/**
 * Get models by family
 */
export declare function getModelsByFamily(family: ModelFamily): ModelProfile[];
/**
 * Get models within token budget
 */
export declare function getModelsWithinBudget(requiredTokens: number): ModelProfile[];
/**
 * Get models within cost budget
 */
export declare function getModelsWithinCostBudget(estimatedTokens: number, maxCostPerRequest: number): ModelProfile[];
/**
 * Compare models for a given use case
 */
export declare function compareModels(modelNames: string[], estimatedInputTokens: number, estimatedOutputTokens: number): Array<{
    profile: ModelProfile;
    estimatedCost: number;
    fitsContext: boolean;
}>;
//# sourceMappingURL=model-profiles.d.ts.map