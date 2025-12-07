/**
 * Token Estimation Utilities
 *
 * Provides token counting and estimation for different models.
 * Uses approximate tokenization by default, with pluggable tokenizers.
 */
import type { CoreMessage } from '../../hooks/use-chat-enhanced';
import type { ToonNode } from './toon';
/**
 * Tokenizer interface for pluggable tokenization
 */
export interface Tokenizer {
    /** Estimate tokens for text */
    estimate(text: string): number;
    /** Name of the tokenizer */
    name: string;
}
/**
 * Model metadata with token limits and pricing
 */
export interface ModelMetadata {
    /** Model identifier */
    model: string;
    /** Maximum context tokens */
    maxTokens: number;
    /** Maximum output tokens */
    maxOutputTokens?: number;
    /** Tokenizer to use */
    tokenizer?: Tokenizer;
    /** Input price per 1K tokens */
    inputPricePer1K?: number;
    /** Output price per 1K tokens */
    outputPricePer1K?: number;
}
/**
 * Approximate tokenizer using character-to-token ratio
 * Uses ~4 characters per token as a reasonable default for English text
 */
export declare class ApproximateTokenizer implements Tokenizer {
    name: string;
    private charsPerToken;
    constructor(charsPerToken?: number);
    estimate(text: string): number;
}
/**
 * Claude-optimized tokenizer (slightly different ratio)
 */
export declare class ClaudeTokenizer implements Tokenizer {
    name: string;
    estimate(text: string): number;
}
/**
 * Get tokenizer for a specific model
 */
export declare function getTokenizerForModel(modelName: string, customTokenizer?: Tokenizer): Tokenizer;
/**
 * Model presets with common configurations
 */
export declare const MODEL_PRESETS: Record<string, ModelMetadata>;
/**
 * Estimate tokens for a single message
 */
export declare function estimateSingleMessageTokens(message: CoreMessage, tokenizer?: Tokenizer): number;
/**
 * Estimate tokens for an array of messages
 */
export declare function estimateMessageTokens(messages: CoreMessage[], tokenizer?: Tokenizer): number;
/**
 * Estimate tokens for toon nodes or raw text
 */
export declare function estimatePromptTokens(input: ToonNode[] | ToonNode | string, variables?: Record<string, unknown>, tokenizer?: Tokenizer): number;
/**
 * Estimate cost for a given number of tokens
 */
export declare function estimateCost(inputTokens: number, outputTokens: number, modelMetadata: ModelMetadata): {
    inputCost: number;
    outputCost: number;
    totalCost: number;
};
//# sourceMappingURL=tokenizer.d.ts.map