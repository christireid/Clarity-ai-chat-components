/**
 * Contextual Compression Chain
 *
 * Multi-pass compression pipeline for reducing token usage while
 * preserving semantic meaning.
 */
import type { CoreMessage } from '../../hooks/use-chat-enhanced';
import type { Tokenizer } from './tokenizer';
/**
 * Compression strategy types
 */
export type CompressionStrategy = 'semantic-grouping' | 'tool-condensing' | 'intent-summarization';
/**
 * Compression options
 */
export interface CompressionOptions {
    /** Target token budget */
    targetTokens: number;
    /** Tokenizer to use */
    tokenizer: Tokenizer;
    /** Strategies to apply (in order) */
    strategies?: CompressionStrategy[];
    /** Summarization function */
    summarizeFn?: (messages: CoreMessage[], context?: string) => Promise<string> | string;
    /** Minimum messages to keep before summarizing */
    keepRecentMessages?: number;
    /** Maximum tokens for tool outputs before condensing */
    maxToolOutputTokens?: number;
}
/**
 * Compression result
 */
export interface CompressionResult {
    /** Compressed messages */
    messages: CoreMessage[];
    /** Compression logs */
    logs: CompressionLog[];
    /** Overall compression ratio */
    compressionRatio: number;
}
/**
 * Compression log entry
 */
export interface CompressionLog {
    /** Strategy applied */
    strategy: CompressionStrategy;
    /** Tokens before */
    tokensBefore: number;
    /** Tokens after */
    tokensAfter: number;
    /** Description of what was done */
    description: string;
}
/**
 * Compress context using multi-pass pipeline
 */
export declare function compressContext(messages: CoreMessage[], options: CompressionOptions): Promise<CompressionResult>;
/**
 * Extract key points from messages for summarization
 */
export declare function extractKeyPoints(messages: CoreMessage[]): string[];
//# sourceMappingURL=compression-chain.d.ts.map