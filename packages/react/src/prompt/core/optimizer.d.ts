/**
 * Message Optimization Strategies
 *
 * Strategies for optimizing message arrays to fit within token budgets.
 */
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced';
import type { Tokenizer, ModelMetadata } from './tokenizer';
/**
 * Optimization strategy types
 */
export type OptimizationStrategy = 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid';
/**
 * Message priority definition
 */
export interface MessagePriority {
    /** Message ID or index */
    messageId: string | number;
    /** Priority score (0-10, higher is more important) */
    priority: number;
    /** Optional reason for priority */
    reason?: string;
}
/**
 * Optimization options
 */
export interface OptimizationOptions {
    /** Target token budget */
    targetTokens: number;
    /** Optimization strategy */
    strategy: OptimizationStrategy;
    /** Model metadata for accurate token counting */
    modelMetadata?: ModelMetadata | string;
    /** Tokenizer to use */
    tokenizer?: Tokenizer;
    /** Message priorities */
    priorities?: MessagePriority[];
    /** Summarization function for summarize-old strategy */
    summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string;
    /** Number of recent messages to always keep */
    keepRecent?: number;
}
/**
 * Optimization result
 */
export interface OptimizationResult {
    /** Optimized messages */
    optimizedMessages: CoreMessage[];
    /** Optimization diagnostics */
    diagnostics: {
        originalTokens: number;
        optimizedTokens: number;
        messagesRemoved: number;
        messagesSummarized: number;
        strategy: string;
        details: string[];
    };
}
/**
 * Optimize messages to fit within token budget
 */
export declare function optimizeMessagesForBudget(messages: CoreMessage[], options: OptimizationOptions): Promise<OptimizationResult>;
/**
 * Summarize message history for compression
 * Creates a simple extractive summary
 */
export declare function summarizeHistoryForCompression(messages: CoreMessage[], maxLength?: number): string;
//# sourceMappingURL=optimizer.d.ts.map