/**
 * Memory Adaptive Compression Strategy
 *
 * Automatically selects the best compression method based on content characteristics.
 * Migrated from the memory package for consolidation.
 *
 * This strategy analyzes content to determine:
 * - If it's too short to compress (< 100 chars)
 * - If it has structured format (lists, bullet points) -> use extract
 * - If it's long with LLM available (> 500 chars) -> use summarize
 * - If it has narrative structure (> 300 chars, multiple sentences) -> use extract
 * - Default -> use truncate
 *
 * @module memory-adaptive
 */

import { SimpleTokenCounter } from '../../tokenizers/simple-counter'
import {
  MemoryExtractStrategy,
  type MemoryContent,
  type MemoryExtractResult,
} from './memory-extract'
import {
  MemorySummarizeStrategy,
  type LLMSummarizer,
  type Summarizer,
  type MemorySummarizeResult,
} from './memory-summarize'

/**
 * Truncation compression result
 */
export interface MemoryTruncateResult {
  /** Compressed content */
  compressed: string
  /** Original content */
  original: string
  /** Compression ratio (compressed tokens / original tokens) */
  compressionRatio: number
  /** Number of tokens saved */
  tokensSaved: number
  /** Compression method identifier */
  method: 'truncate'
}

/**
 * No compression result (content too short)
 */
export interface MemoryNoCompressionResult {
  /** Original content (unchanged) */
  compressed: string
  /** Original content */
  original: string
  /** Compression ratio (always 1.0) */
  compressionRatio: 1.0
  /** Number of tokens saved (always 0) */
  tokensSaved: 0
  /** Compression method identifier */
  method: 'none'
}

/**
 * Union type of all possible adaptive compression results
 */
export type MemoryAdaptiveResult =
  | MemoryExtractResult
  | MemorySummarizeResult
  | MemoryTruncateResult
  | MemoryNoCompressionResult

/**
 * Options for memory adaptive compression
 */
export interface MemoryAdaptiveOptions {
  /** Minimum content length to compress (default: 100) */
  minContentLength?: number
  /** Content length threshold for summarization (default: 500) */
  summarizeThreshold?: number
  /** Content length threshold for extraction (default: 300) */
  extractThreshold?: number
  /** Enable debug output */
  debug?: boolean
}

/**
 * Internal truncate strategy for simple truncation
 */
class TruncateStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly minContentLength: number

  constructor(minContentLength: number = 100) {
    this.tokenCounter = new SimpleTokenCounter()
    this.minContentLength = minContentLength
  }

  canCompress(memory: MemoryContent): boolean {
    return memory.content.length > this.minContentLength
  }

  async compress(
    memory: MemoryContent,
    targetRatio: number
  ): Promise<MemoryTruncateResult> {
    const original = memory.content
    const targetLength = Math.floor(original.length * targetRatio)

    // Truncate to target length, preserving sentence boundaries
    let truncated = original.slice(0, targetLength)

    // Try to end at a sentence boundary
    const lastPeriod = truncated.lastIndexOf('.')
    const lastExclamation = truncated.lastIndexOf('!')
    const lastQuestion = truncated.lastIndexOf('?')
    const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion)

    if (lastSentenceEnd > targetLength * 0.7) {
      truncated = truncated.slice(0, lastSentenceEnd + 1)
    } else {
      truncated = truncated.trim() + '...'
    }

    const originalTokens = this.tokenCounter.count(original)
    const compressedTokens = this.tokenCounter.count(truncated)
    const compressionRatio =
      originalTokens > 0 ? compressedTokens / originalTokens : 1

    return {
      compressed: truncated,
      original,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      method: 'truncate',
    }
  }
}

/**
 * Memory Adaptive Strategy
 *
 * Automatically selects the best compression method based on content
 * characteristics. Supports extract, summarize, and truncate strategies.
 *
 * @example
 * ```typescript
 * // Without LLM summarizer (uses extract/truncate)
 * const strategy = new MemoryAdaptiveStrategy();
 *
 * // With LLM summarizer (can also use summarize)
 * const strategyWithLLM = new MemoryAdaptiveStrategy({
 *   async summarize(text, maxTokens) {
 *     return await llm.summarize(text, { maxTokens });
 *   }
 * });
 *
 * const result = await strategy.compress({ content: text }, 0.5);
 * console.log(`Used ${result.method} strategy`);
 * ```
 */
export class MemoryAdaptiveStrategy {
  private readonly truncateStrategy: TruncateStrategy
  private readonly extractStrategy: MemoryExtractStrategy
  private readonly summarizeStrategy?: MemorySummarizeStrategy
  private readonly options: Required<MemoryAdaptiveOptions>

  /**
   * Create a new memory adaptive strategy
   *
   * @param summarizer - Optional LLM summarizer for summarization strategy
   * @param options - Configuration options
   */
  constructor(
    summarizer?: LLMSummarizer | Summarizer,
    options: MemoryAdaptiveOptions = {}
  ) {
    this.options = {
      minContentLength: options.minContentLength ?? 100,
      summarizeThreshold: options.summarizeThreshold ?? 500,
      extractThreshold: options.extractThreshold ?? 300,
      debug: options.debug ?? false,
    }

    this.truncateStrategy = new TruncateStrategy(this.options.minContentLength)
    this.extractStrategy = new MemoryExtractStrategy()

    if (summarizer) {
      this.summarizeStrategy = new MemorySummarizeStrategy(summarizer)
    }
  }

  /**
   * Check if the memory content can be compressed
   *
   * @param memory - Memory content to check
   * @returns True if any strategy can compress the content
   */
  canCompress(memory: MemoryContent): boolean {
    return (
      this.truncateStrategy.canCompress(memory) ||
      this.extractStrategy.canCompress(memory) ||
      (this.summarizeStrategy?.canCompress(memory) ?? false)
    )
  }

  /**
   * Compress memory content using the best strategy for the content
   *
   * @param memory - Memory content to compress
   * @param targetRatio - Target compression ratio (0.1-1.0)
   * @returns Compression result with method indicator
   */
  async compress(
    memory: MemoryContent,
    targetRatio: number
  ): Promise<MemoryAdaptiveResult> {
    // Select strategy based on content characteristics
    const strategy = this.selectStrategy(memory)

    if (!strategy) {
      // Fallback: return original with minimal compression
      const original = memory.content
      return {
        compressed: original,
        original,
        compressionRatio: 1.0 as const,
        tokensSaved: 0 as const,
        method: 'none' as const,
      }
    }

    return strategy.compress(memory, targetRatio)
  }

  /**
   * Select the best compression strategy for the content
   *
   * @param memory - Memory content to analyze
   * @returns Selected strategy or null if content too short
   */
  private selectStrategy(
    memory: MemoryContent
  ): TruncateStrategy | MemoryExtractStrategy | MemorySummarizeStrategy | null {
    const content = memory.content
    const length = content.length

    // For very short content, don't compress
    if (length < this.options.minContentLength) {
      return null
    }

    // For structured content (lists, bullet points), use extract
    if (this.isStructured(content)) {
      return this.extractStrategy
    }

    // For long content with LLM available, use summarize
    if (
      length > this.options.summarizeThreshold &&
      this.summarizeStrategy?.canCompress(memory)
    ) {
      return this.summarizeStrategy
    }

    // For narrative content, use extract
    if (
      length > this.options.extractThreshold &&
      this.hasNarrativeStructure(content)
    ) {
      return this.extractStrategy
    }

    // Default: truncate
    return this.truncateStrategy
  }

  /**
   * Check if content has structured format (lists, bullet points, key-value pairs)
   *
   * @param text - Text to analyze
   * @returns True if content appears structured
   */
  private isStructured(text: string): boolean {
    // Check for lists, bullet points, numbered items
    const listPatterns = [
      /^\s*[-\u2022*]\s+/m, // Bullet points
      /^\s*\d+[.)]\s+/m, // Numbered lists
      /^\s*\w+:\s+/m, // Key-value pairs
    ]

    return listPatterns.some((pattern) => pattern.test(text))
  }

  /**
   * Check if content has narrative structure (multiple sentences)
   *
   * @param text - Text to analyze
   * @returns True if content has narrative structure
   */
  private hasNarrativeStructure(text: string): boolean {
    // Check for multiple sentences (narrative structure)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    return sentences.length > 3
  }

  /**
   * Get information about which strategy would be selected
   *
   * @param memory - Memory content to analyze
   * @returns Strategy name that would be used
   */
  getStrategyInfo(memory: MemoryContent): {
    strategy: 'extract' | 'summarize' | 'truncate' | 'none'
    reason: string
  } {
    const content = memory.content
    const length = content.length

    if (length < this.options.minContentLength) {
      return {
        strategy: 'none',
        reason: `Content too short (${length} < ${this.options.minContentLength})`,
      }
    }

    if (this.isStructured(content)) {
      return { strategy: 'extract', reason: 'Content has structured format' }
    }

    if (
      length > this.options.summarizeThreshold &&
      this.summarizeStrategy?.canCompress(memory)
    ) {
      return {
        strategy: 'summarize',
        reason: 'Long content with LLM summarizer available',
      }
    }

    if (
      length > this.options.extractThreshold &&
      this.hasNarrativeStructure(content)
    ) {
      return { strategy: 'extract', reason: 'Narrative content structure' }
    }

    return { strategy: 'truncate', reason: 'Default strategy' }
  }
}

/**
 * Create a memory adaptive strategy
 *
 * @param summarizer - Optional LLM summarizer
 * @param options - Configuration options
 * @returns Configured strategy instance
 */
export function createMemoryAdaptiveStrategy(
  summarizer?: LLMSummarizer | Summarizer,
  options?: MemoryAdaptiveOptions
): MemoryAdaptiveStrategy {
  return new MemoryAdaptiveStrategy(summarizer, options)
}

/**
 * Quick adaptive compression with default settings
 *
 * @param content - Content to compress
 * @param targetRatio - Target compression ratio (default: 0.5)
 * @param summarizer - Optional LLM summarizer
 * @returns Compressed content string
 */
export async function compressWithMemoryAdaptive(
  content: string,
  targetRatio: number = 0.5,
  summarizer?: LLMSummarizer | Summarizer
): Promise<string> {
  const strategy = new MemoryAdaptiveStrategy(summarizer)
  const result = await strategy.compress({ content }, targetRatio)
  return result.compressed
}
