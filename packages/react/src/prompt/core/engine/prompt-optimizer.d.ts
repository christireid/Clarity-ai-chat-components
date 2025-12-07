/**
 * Prompt Optimization Engine
 *
 * Compiler-like pipeline for optimizing prompts:
 * 1. Lexing - Convert inputs to messages
 * 2. Structuring - Apply prompt style transformation
 * 3. Analysis - Semantic prioritization
 * 4. Optimization - Compression and pruning
 * 5. Emission - Final optimized prompt
 */
import type { CoreMessage } from '../../../hooks/use-chat-enhanced';
import type { ToonNode } from '../toon';
import type { ModelProfile } from '../model-profiles';
import type { OptimizationStrategy } from '../optimizer';
import type { CompressionStrategy } from '../compression-chain';
/**
 * Optimization stage result
 */
export interface OptimizationStage {
    /** Stage name */
    name: string;
    /** Tokens before stage */
    tokensBefore: number;
    /** Tokens after stage */
    tokensAfter: number;
    /** Tokens saved */
    tokensSaved: number;
    /** Details of what was done */
    details: string[];
    /** Duration in ms */
    duration?: number;
}
/**
 * Optimization diagnostics (for external use)
 */
export interface OptimizationDiagnostics {
    originalTokens: number;
    finalTokens: number;
    totalTokensSaved: number;
    wasOptimized: boolean;
    reason: string;
    strategy?: string;
    stages: OptimizationStage[];
}
/**
 * Options for prompt optimization
 */
export interface OptimizePromptOptions {
    /** Toon DSL definition */
    toonDefinition?: ToonNode[];
    /** Variables for toon substitution */
    variables?: Record<string, unknown>;
    /** Existing messages */
    messages?: CoreMessage[];
    /** Memory context */
    memoryContext?: string | CoreMessage[];
    /** Model profile or name */
    modelProfile: ModelProfile | string;
    /** Target token budget */
    targetTokens?: number;
    /** Optimization strategies to try */
    strategies?: (OptimizationStrategy | CompressionStrategy)[];
    /** User intent for semantic prioritization */
    userIntent?: string;
    /** Apply style transformation based on model */
    applyStyleTransformation?: boolean;
    /** Summarization function */
    summarizeFn?: (messages: CoreMessage[], context?: string) => Promise<string> | string;
    /** Embedding function for semantic matching */
    getEmbedding?: (text: string) => Promise<number[]> | number[];
    /** Debug mode */
    debug?: boolean;
}
/**
 * Result from prompt optimization
 */
export interface OptimizePromptResult {
    /** Optimized messages */
    optimizedMessages: CoreMessage[];
    /** Token statistics */
    tokenStats: {
        inputTokens: number;
        remainingBudget: number;
        utilization: number;
    };
    /** Cost estimate */
    costEstimate?: {
        inputCost: number;
        outputCost: number;
        totalCost: number;
    };
    /** Optimization diagnostics */
    diagnostics: {
        originalTokens: number;
        finalTokens: number;
        totalTokensSaved: number;
        wasOptimized: boolean;
        reason: string;
        stages: OptimizationStage[];
    };
}
/**
 * Main optimization function - compiler-like pipeline
 */
export declare function optimizePrompt(options: OptimizePromptOptions): Promise<OptimizePromptResult>;
//# sourceMappingURL=prompt-optimizer.d.ts.map