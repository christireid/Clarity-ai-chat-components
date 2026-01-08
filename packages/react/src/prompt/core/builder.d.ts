/**
 * Model Prompt Builder
 *
 * High-level API for building optimized, model-ready prompts.
 * Integrates recipes, memory, user input, and optimization.
 */
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced';
import type { ToonNode } from './toon';
import type { PromptRecipe } from './recipe';
import type { ModelMetadata } from './tokenizer';
import type { OptimizationStrategy, MessagePriority } from './optimizer';
import type { ModelProfile } from './model-profiles';
/**
 * Options for building a model prompt
 */
export interface BuildModelPromptOptions {
    /** Toon DSL nodes */
    toonNodes?: ToonNode[];
    /** Prompt recipe */
    recipe?: PromptRecipe;
    /** Variables for template substitution */
    variables?: Record<string, unknown>;
    /** Existing messages to include */
    messages?: CoreMessage[];
    /** Memory context to include */
    memoryContext?: string | CoreMessage[];
    /** User input to include */
    userInput?: string;
    /** Model metadata for token counting */
    modelMetadata?: ModelMetadata | ModelProfile | string;
    /** Target token budget */
    targetTokens?: number;
    /** Optimization configuration */
    optimization?: {
        /** Enable optimization */
        enabled: boolean;
        /** Optimization strategy */
        strategy?: OptimizationStrategy;
        /** Message priorities */
        priorities?: MessagePriority[];
        /** Summarization function */
        summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string;
        /** Messages to keep at end */
        keepRecent?: number;
    };
}
/**
 * Result from building a model prompt
 */
export interface BuildModelPromptResult {
    /** Final messages array */
    messages: CoreMessage[];
    /** Token statistics */
    tokenStats: {
        /** Input tokens */
        inputTokens: number;
        /** Remaining budget */
        remainingBudget: number;
        /** Budget utilization (0-1) */
        utilization: number;
    };
    /** Cost estimates (if model pricing available) */
    costEstimate?: {
        inputCost: number;
        outputCost: number;
        totalCost: number;
    };
    /** Optimization diagnostics (if optimization was applied) */
    optimizationDiagnostics?: {
        originalTokens: number;
        optimizedTokens: number;
        messagesRemoved: number;
        messagesSummarized: number;
        strategy: string;
        details: string[];
    };
}
/**
 * Build a model-ready prompt with optional optimization
 */
export declare function buildModelPrompt(options: BuildModelPromptOptions): Promise<BuildModelPromptResult>;
/**
 * Simple prompt builder for quick usage
 */
export declare function buildPrompt(systemPrompt: string, userMessage: string, options?: {
    memoryContext?: string;
    maxTokens?: number;
    model?: string;
}): CoreMessage[];
/**
 * Append a message to an existing conversation
 */
export declare function appendToConversation(messages: CoreMessage[], newMessage: CoreMessage | string, role?: 'user' | 'assistant'): CoreMessage[];
/**
 * Create a conversation from alternating messages
 */
export declare function createConversation(systemPrompt: string, ...exchanges: Array<{
    user: string;
    assistant?: string;
}>): CoreMessage[];
//# sourceMappingURL=builder.d.ts.map