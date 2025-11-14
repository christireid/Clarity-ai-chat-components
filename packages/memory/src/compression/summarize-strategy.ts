/**
 * Summarize Compression Strategy
 * 
 * Uses LLM to summarize content (requires LLM provider)
 */

import type { CompressionStrategy, CompressionResult } from './compression-strategy'
import type { Memory } from '../core/types'
import type { Summarizer } from '../summarization/summarizer'

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

  async compress(memory: Memory, targetRatio: number): Promise<CompressionResult> {
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
    return Math.ceil(text.length / 4)
  }
}
