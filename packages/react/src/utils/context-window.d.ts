/**
 * Context Window Management Utilities
 *
 * Flexible utilities for managing context window limits and token budgets.
 * Works with any tokenizer or estimation function.
 */
export interface ContextMessage {
    role: 'system' | 'user' | 'assistant' | 'function';
    content: string;
    name?: string;
}
export interface ContextWindowOptions {
    /** Maximum context window size in tokens */
    maxTokens: number;
    /** Reserved tokens for response */
    reservedTokens?: number;
    /** Token counter function */
    countTokens: (text: string) => number;
    /** Keep system message */
    keepSystemMessage?: boolean;
    /** Minimum messages to keep */
    minMessages?: number;
}
export interface TruncationStrategy {
    /** Strategy name */
    name: string;
    /** Truncate messages */
    truncate(messages: ContextMessage[], options: ContextWindowOptions): ContextMessage[] | Promise<ContextMessage[]>;
}
/**
 * Simple FIFO truncation - removes oldest messages
 */
export declare class FIFOTruncation implements TruncationStrategy {
    name: string;
    truncate(messages: ContextMessage[], options: ContextWindowOptions): ContextMessage[];
}
/**
 * Sliding window truncation - keeps most recent N messages
 */
export declare class SlidingWindowTruncation implements TruncationStrategy {
    private windowSize;
    name: string;
    constructor(windowSize?: number);
    truncate(messages: ContextMessage[], options: ContextWindowOptions): ContextMessage[];
}
/**
 * Smart truncation - preserves conversation structure
 * Keeps pairs of user/assistant messages together
 */
export declare class SmartTruncation implements TruncationStrategy {
    name: string;
    truncate(messages: ContextMessage[], options: ContextWindowOptions): ContextMessage[];
}
/**
 * Summarization truncation - summarizes old messages
 * Note: Requires a summarization function
 */
export declare class SummarizationTruncation implements TruncationStrategy {
    private summarize;
    private summarizeAfter;
    name: string;
    constructor(summarize: (messages: ContextMessage[]) => Promise<string>, summarizeAfter?: number);
    truncate(messages: ContextMessage[], options: ContextWindowOptions): Promise<ContextMessage[]>;
}
/**
 * Context window manager
 */
export declare class ContextWindowManager {
    private strategy;
    private options;
    constructor(strategy: TruncationStrategy | 'fifo' | 'smart' | 'sliding-window', options: ContextWindowOptions);
    /**
     * Truncate messages to fit within context window
     */
    truncate(messages: ContextMessage[]): ContextMessage[] | Promise<ContextMessage[]>;
    /**
     * Check if messages fit within context window
     */
    fitsInWindow(messages: ContextMessage[]): boolean;
    /**
     * Get total token count for messages
     */
    countTokens(messages: ContextMessage[]): number;
    /**
     * Get remaining tokens in window
     */
    getRemainingTokens(messages: ContextMessage[]): number;
}
/**
 * Simple token estimation (rough, use proper tokenizer in production)
 */
export declare function estimateTokens(text: string): number;
//# sourceMappingURL=context-window.d.ts.map