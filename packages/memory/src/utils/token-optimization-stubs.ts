/**
 * Token Optimization Stubs
 *
 * Local implementations of token optimization utilities
 * that were previously imported from @clarity-chat/token-optimization
 */

import { TokenCounter, countTokens } from './token-counter'
import type { TokenBreakdown, MemoryItem } from '../types'

/**
 * Compression result from MemoryCompressor
 */
export interface CompressionResult {
  compressed: string
  compressedTokens: number
  compressionRatio: number
}

/**
 * Memory Compressor
 *
 * Compresses memory content to reduce token usage
 */
export class MemoryCompressor {
  private targetRatio: number

  constructor(config: { targetRatio?: number } = {}) {
    this.targetRatio = config.targetRatio ?? 0.7
  }

  /**
   * Compress text content
   */
  compress(text: string): string {
    if (!text) return text

    // Simple compression: remove extra whitespace
    let compressed = text.replace(/\s+/g, ' ').trim()

    // If still too long, truncate intelligently
    const currentTokens = countTokens(compressed)
    const targetTokens = Math.floor(currentTokens * this.targetRatio)

    if (currentTokens > targetTokens) {
      compressed = TokenCounter.truncate(compressed, targetTokens)
    }

    return compressed
  }

  /**
   * Decompress (no-op for this implementation)
   */
  decompress(text: string): string {
    return text
  }

  /**
   * Compress memory object
   */
  compressMemory(
    memory: { content: string } | MemoryItem,
    ratio?: number
  ): CompressionResult {
    const targetRatio = ratio ?? this.targetRatio
    const originalTokens = countTokens(memory.content)

    // Simple compression: remove extra whitespace
    let compressed = memory.content.replace(/\s+/g, ' ').trim()

    // Calculate target tokens
    const targetTokens = Math.floor(originalTokens * targetRatio)

    // Truncate if needed
    if (countTokens(compressed) > targetTokens) {
      compressed = TokenCounter.truncate(compressed, targetTokens)
    }

    const compressedTokens = countTokens(compressed)

    return {
      compressed,
      compressedTokens,
      compressionRatio:
        originalTokens > 0 ? compressedTokens / originalTokens : 1,
    }
  }
}

/**
 * Semantic Chunker
 *
 * Splits text into semantically meaningful chunks
 */
export class SemanticChunker {
  private maxChunkSize: number
  private overlap: number

  constructor(config: { maxChunkSize?: number; overlap?: number } = {}) {
    this.maxChunkSize = config.maxChunkSize ?? 512
    this.overlap = config.overlap ?? 50
  }

  /**
   * Chunk text into semantic segments
   */
  chunk(text: string): string[] {
    if (!text) return []

    const sentences = this.splitIntoSentences(text)
    const chunks: string[] = []
    let currentChunk: string[] = []
    let currentSize = 0

    for (const sentence of sentences) {
      const sentenceTokens = countTokens(sentence)

      if (
        currentSize + sentenceTokens > this.maxChunkSize &&
        currentChunk.length > 0
      ) {
        chunks.push(currentChunk.join(' '))

        // Keep overlap
        const overlapSentences: string[] = []
        let overlapSize = 0
        for (let i = currentChunk.length - 1; i >= 0; i--) {
          const size = countTokens(currentChunk[i])
          if (overlapSize + size > this.overlap) break
          overlapSentences.unshift(currentChunk[i])
          overlapSize += size
        }

        currentChunk = overlapSentences
        currentSize = overlapSize
      }

      currentChunk.push(sentence)
      currentSize += sentenceTokens
    }

    if (currentChunk.length > 0) {
      chunks.push(currentChunk.join(' '))
    }

    return chunks
  }

  private splitIntoSentences(text: string): string[] {
    return text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
  }
}

/**
 * Context Optimizer
 *
 * Optimizes context for LLM consumption
 */
export class ContextOptimizer {
  private config: {
    maxTokens?: number
    strategy?: 'truncate' | 'summarize' | 'chunk'
  }

  constructor(config: Record<string, unknown> = {}) {
    this.config = {
      maxTokens: (config.maxTokens as number) ?? 4096,
      strategy:
        (config.strategy as 'truncate' | 'summarize' | 'chunk') ?? 'truncate',
    }
  }

  /**
   * Optimize content for context window
   */
  optimize(content: string, options?: Record<string, unknown>): string {
    if (!content) return content

    const maxTokens =
      (options?.maxTokens as number) ?? this.config.maxTokens ?? 4096
    const currentTokens = countTokens(content)

    if (currentTokens <= maxTokens) {
      return content
    }

    return TokenCounter.truncate(content, maxTokens)
  }

  /**
   * Get a compressor instance
   */
  getCompressor(): MemoryCompressor {
    return new MemoryCompressor()
  }

  /**
   * Get a budget manager instance
   */
  getBudgetManager(): {
    getBudget: () => { maxTokens: number; used: number; remaining: number }
    allocate: (tokens: number) => boolean
    release: (tokens: number) => void
    getAllocation: () => TokenBreakdown
  } {
    let used = 0
    const maxTokens = this.config.maxTokens ?? 4096

    // Default allocation percentages
    const allocations = {
      systemPrompt: 0.15,
      userPreferences: 0.1,
      recentContext: 0.25,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.1,
    }

    return {
      getBudget: () => ({
        maxTokens,
        used,
        remaining: maxTokens - used,
      }),
      allocate: (tokens: number) => {
        if (used + tokens <= maxTokens) {
          used += tokens
          return true
        }
        return false
      },
      release: (tokens: number) => {
        used = Math.max(0, used - tokens)
      },
      getAllocation: (): TokenBreakdown => ({
        systemPrompt: Math.floor(maxTokens * allocations.systemPrompt),
        userPreferences: Math.floor(maxTokens * allocations.userPreferences),
        recentContext: Math.floor(maxTokens * allocations.recentContext),
        semanticMemory: Math.floor(maxTokens * allocations.semanticMemory),
        episodicMemory: Math.floor(maxTokens * allocations.episodicMemory),
        responseReserve: Math.floor(maxTokens * allocations.responseReserve),
        total: maxTokens,
      }),
    }
  }
}
