/**
 * Summarize Compression Strategy
 *
 * Uses LLM to summarize content (requires LLM provider)
 */

import type { Memory } from '../types'
import type { Summarizer } from '../summarization/summarizer'
import { countTokens } from '../utils/token-counter'

/**
 * Compression strategy interface
 */
export interface CompressionStrategy {
  canCompress(memory: Memory): boolean
  compress(memory: Memory, targetRatio: number): Promise<CompressionResult>
}

/**
 * Result of compression operation
 */
export interface CompressionResult {
  compressed: string
  original: string
  compressionRatio: number
  tokensSaved: number
  method: string
}

export interface LLMSummarizer {
  summarize(text: string, maxTokens: number): Promise<string>
}

export class SummarizeStrategy implements CompressionStrategy {
  private summarizer?: LLMSummarizer | Summarizer

  constructor(summarizer?: LLMSummarizer | Summarizer) {
    this.summarizer = summarizer
  }

  canCompress(memory: Memory): boolean {
    return this.summarizer !== undefined && memory.content.length > 300
  }

  async compress(
    memory: Memory,
    targetRatio: number
  ): Promise<CompressionResult> {
    if (!this.summarizer) {
      throw new Error('Summarizer not available')
    }

    const original = memory.content
    const originalTokens = this.countTokens(original)
    const targetTokens = Math.floor(originalTokens * targetRatio)

    // Summarize using LLM
    const summarized = await this.summarizer.summarize(original, targetTokens)

    const compressedTokens = this.countTokens(summarized)
    const compressionRatio = compressedTokens / originalTokens

    return {
      compressed: summarized,
      original,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      method: 'summarize',
    }
  }

  private countTokens(text: string): number {
    return countTokens(text)
  }
}
