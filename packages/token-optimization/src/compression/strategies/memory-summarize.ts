/**
 * Memory Summarize Compression Strategy
 *
 * Uses LLM-based summarization to compress memory content.
 * Migrated from the memory package for consolidation.
 *
 * This strategy:
 * - Requires an LLM summarizer to be provided
 * - Calculates target token count based on compression ratio
 * - Delegates to the summarizer for actual compression
 * - Tracks compression metrics
 *
 * @module memory-summarize
 */

import { SimpleTokenCounter } from '../../tokenizers/simple-counter'

/**
 * Memory item interface for compression (standalone, no memory package dependency)
 */
export interface MemoryContent {
  /** The content to compress */
  content: string
  /** Optional metadata */
  metadata?: Record<string, unknown>
}

/**
 * Result of memory summarization compression
 */
export interface MemorySummarizeResult {
  /** Compressed/summarized content */
  compressed: string
  /** Original content */
  original: string
  /** Compression ratio (compressed tokens / original tokens) */
  compressionRatio: number
  /** Number of tokens saved */
  tokensSaved: number
  /** Compression method identifier */
  method: 'summarize'
}

/**
 * LLM Summarizer interface
 *
 * Implement this interface to provide LLM-based summarization.
 */
export interface LLMSummarizer {
  /**
   * Summarize text to fit within a target token count
   *
   * @param text - Text to summarize
   * @param maxTokens - Maximum tokens for the summary
   * @returns Summarized text
   */
  summarize(text: string, maxTokens: number): Promise<string>
}

/**
 * Generic Summarizer interface (alternate form)
 *
 * Some implementations may use this simpler interface.
 */
export interface Summarizer {
  /**
   * Summarize text to fit within a target token count
   *
   * @param text - Text to summarize
   * @param maxTokens - Maximum tokens for the summary
   * @returns Summarized text
   */
  summarize(text: string, maxTokens: number): Promise<string>
}

/**
 * Options for memory summarization
 */
export interface MemorySummarizeOptions {
  /** Minimum content length to compress (default: 300) */
  minContentLength?: number
  /** Enable debug output */
  debug?: boolean
}

/**
 * Memory Summarize Strategy
 *
 * Compresses memory content using LLM-based summarization.
 * Requires an LLM summarizer to be provided at construction.
 *
 * @example
 * ```typescript
 * // With an LLM summarizer
 * const summarizer = {
 *   async summarize(text: string, maxTokens: number): Promise<string> {
 *     // Call your LLM API here
 *     return await llm.summarize(text, { maxTokens });
 *   }
 * };
 *
 * const strategy = new MemorySummarizeStrategy(summarizer);
 *
 * if (strategy.canCompress({ content: longText })) {
 *   const result = await strategy.compress({ content: longText }, 0.3);
 *   console.log(`Saved ${result.tokensSaved} tokens`);
 * }
 * ```
 */
export class MemorySummarizeStrategy {
  private readonly summarizer?: LLMSummarizer | Summarizer
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<MemorySummarizeOptions>

  /**
   * Create a new memory summarize strategy
   *
   * @param summarizer - Optional LLM summarizer for actual compression
   * @param options - Configuration options
   */
  constructor(
    summarizer?: LLMSummarizer | Summarizer,
    options: MemorySummarizeOptions = {}
  ) {
    this.summarizer = summarizer
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      minContentLength: options.minContentLength ?? 300,
      debug: options.debug ?? false,
    }
  }

  /**
   * Check if the memory content can be compressed
   *
   * Requires both a summarizer and content exceeding minimum length.
   *
   * @param memory - Memory content to check
   * @returns True if summarizer is available and content is long enough
   */
  canCompress(memory: MemoryContent): boolean {
    return (
      this.summarizer !== undefined &&
      memory.content.length > this.options.minContentLength
    )
  }

  /**
   * Check if a summarizer is configured
   *
   * @returns True if summarizer is available
   */
  hasSummarizer(): boolean {
    return this.summarizer !== undefined
  }

  /**
   * Compress memory content using LLM summarization
   *
   * @param memory - Memory content to compress
   * @param targetRatio - Target compression ratio (0.1-1.0, where 0.3 = 30% of original)
   * @returns Compression result with metrics
   * @throws Error if summarizer is not available
   */
  async compress(
    memory: MemoryContent,
    targetRatio: number
  ): Promise<MemorySummarizeResult> {
    if (!this.summarizer) {
      throw new Error('Summarizer not available')
    }

    const original = memory.content
    const originalTokens = this.countTokens(original)
    const targetTokens = Math.floor(originalTokens * targetRatio)

    // Summarize using LLM
    const summarized = await this.summarizer.summarize(original, targetTokens)

    const compressedTokens = this.countTokens(summarized)
    const compressionRatio =
      originalTokens > 0 ? compressedTokens / originalTokens : 1

    return {
      compressed: summarized,
      original,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      method: 'summarize',
    }
  }

  /**
   * Count tokens in text
   *
   * @param text - Text to count
   * @returns Token count
   */
  private countTokens(text: string): number {
    return this.tokenCounter.count(text)
  }
}

/**
 * Create a memory summarize strategy with a summarizer
 *
 * @param summarizer - LLM summarizer implementation
 * @param options - Optional configuration
 * @returns Configured strategy instance
 */
export function createMemorySummarizeStrategy(
  summarizer?: LLMSummarizer | Summarizer,
  options?: MemorySummarizeOptions
): MemorySummarizeStrategy {
  return new MemorySummarizeStrategy(summarizer, options)
}

/**
 * Quick summarization compression with provided summarizer
 *
 * @param content - Content to compress
 * @param summarizer - LLM summarizer implementation
 * @param targetRatio - Target compression ratio (default: 0.3)
 * @returns Compressed content string
 * @throws Error if summarizer is not provided
 */
export async function compressWithMemorySummarize(
  content: string,
  summarizer: LLMSummarizer | Summarizer,
  targetRatio: number = 0.3
): Promise<string> {
  const strategy = new MemorySummarizeStrategy(summarizer)
  const result = await strategy.compress({ content }, targetRatio)
  return result.compressed
}
