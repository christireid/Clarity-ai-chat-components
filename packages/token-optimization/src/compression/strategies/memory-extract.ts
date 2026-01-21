/**
 * Memory Extract Compression Strategy
 *
 * Extracts key information from memory content using simple heuristics.
 * Migrated from the memory package for consolidation.
 *
 * This strategy:
 * - Splits content into sentences
 * - Extracts important keywords based on frequency
 * - Scores sentences by importance (keyword density + question/action indicators)
 * - Selects top-scoring sentences to meet target compression ratio
 *
 * @module memory-extract
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
 * Result of memory extraction compression
 */
export interface MemoryExtractResult {
  /** Compressed content */
  compressed: string
  /** Original content */
  original: string
  /** Compression ratio (compressed tokens / original tokens) */
  compressionRatio: number
  /** Number of tokens saved */
  tokensSaved: number
  /** Compression method identifier */
  method: 'extract'
}

/**
 * Options for memory extraction
 */
export interface MemoryExtractOptions {
  /** Minimum content length to compress (default: 200) */
  minContentLength?: number
  /** Number of top keywords to extract (default: 10) */
  topKeywords?: number
  /** Minimum word length for keyword consideration (default: 3) */
  minWordLength?: number
  /** Enable debug output */
  debug?: boolean
}

/**
 * Memory Extract Strategy
 *
 * Extracts key information from memory content using heuristic-based
 * sentence scoring and selection.
 *
 * @example
 * ```typescript
 * const strategy = new MemoryExtractStrategy();
 *
 * if (strategy.canCompress({ content: longText })) {
 *   const result = await strategy.compress({ content: longText }, 0.5);
 *   console.log(`Saved ${result.tokensSaved} tokens`);
 * }
 * ```
 */
export class MemoryExtractStrategy {
  private readonly tokenCounter: SimpleTokenCounter
  private readonly options: Required<MemoryExtractOptions>

  /**
   * Create a new memory extract strategy
   *
   * @param options - Configuration options
   */
  constructor(options: MemoryExtractOptions = {}) {
    this.tokenCounter = new SimpleTokenCounter()
    this.options = {
      minContentLength: options.minContentLength ?? 200,
      topKeywords: options.topKeywords ?? 10,
      minWordLength: options.minWordLength ?? 3,
      debug: options.debug ?? false,
    }
  }

  /**
   * Check if the memory content can be compressed
   *
   * @param memory - Memory content to check
   * @returns True if content exceeds minimum length threshold
   */
  canCompress(memory: MemoryContent): boolean {
    return memory.content.length > this.options.minContentLength
  }

  /**
   * Compress memory content by extracting key sentences
   *
   * @param memory - Memory content to compress
   * @param targetRatio - Target compression ratio (0.1-1.0, where 0.5 = keep 50%)
   * @returns Compression result with metrics
   */
  async compress(
    memory: MemoryContent,
    targetRatio: number
  ): Promise<MemoryExtractResult> {
    const original = memory.content

    // Extract key sentences (simple heuristic: sentences with important words)
    const sentences = this.splitSentences(original)
    const importantWords = this.extractImportantWords(original)

    // Score sentences by importance
    const scoredSentences = sentences.map((sentence) => ({
      sentence,
      score: this.scoreSentence(sentence, importantWords),
    }))

    // Sort by score and take top sentences
    scoredSentences.sort((a, b) => b.score - a.score)

    const targetSentences = Math.max(
      1,
      Math.floor(sentences.length * targetRatio)
    )
    const extracted = scoredSentences
      .slice(0, targetSentences)
      .map((s) => s.sentence)
      .join(' ')
      .trim()

    const originalTokens = this.countTokens(original)
    const compressedTokens = this.countTokens(extracted)
    const compressionRatio =
      originalTokens > 0 ? compressedTokens / originalTokens : 1

    return {
      compressed: extracted,
      original,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      method: 'extract',
    }
  }

  /**
   * Split text into sentences
   *
   * @param text - Text to split
   * @returns Array of sentence strings
   */
  private splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }

  /**
   * Extract important words based on frequency
   *
   * @param text - Text to analyze
   * @returns Set of important keywords
   */
  private extractImportantWords(text: string): Set<string> {
    // Simple keyword extraction (in production, use NLP)
    const words = text.toLowerCase().split(/\s+/)
    const wordFreq = new Map<string, number>()

    for (const word of words) {
      const cleaned = word.replace(/[^\w]/g, '')
      if (cleaned.length > this.options.minWordLength) {
        wordFreq.set(cleaned, (wordFreq.get(cleaned) || 0) + 1)
      }
    }

    // Get top words
    const sorted = Array.from(wordFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, this.options.topKeywords)
      .map(([word]) => word)

    return new Set(sorted)
  }

  /**
   * Score a sentence based on importance indicators
   *
   * @param sentence - Sentence to score
   * @param importantWords - Set of important keywords
   * @returns Importance score
   */
  private scoreSentence(sentence: string, importantWords: Set<string>): number {
    const words = sentence.toLowerCase().split(/\s+/)
    let score = 0

    for (const word of words) {
      const cleaned = word.replace(/[^\w]/g, '')
      if (importantWords.has(cleaned)) {
        score += 1
      }
    }

    // Boost for question words and action verbs
    if (/^(what|who|when|where|why|how|can|should|will|must)/i.test(sentence)) {
      score += 2
    }

    return score
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
 * Create a memory extract strategy with default options
 *
 * @param options - Optional configuration
 * @returns Configured strategy instance
 */
export function createMemoryExtractStrategy(
  options?: MemoryExtractOptions
): MemoryExtractStrategy {
  return new MemoryExtractStrategy(options)
}

/**
 * Quick extraction compression with default settings
 *
 * @param content - Content to compress
 * @param targetRatio - Target compression ratio (default: 0.5)
 * @returns Compressed content string
 */
export async function compressWithMemoryExtract(
  content: string,
  targetRatio: number = 0.5
): Promise<string> {
  const strategy = new MemoryExtractStrategy()
  const result = await strategy.compress({ content }, targetRatio)
  return result.compressed
}
