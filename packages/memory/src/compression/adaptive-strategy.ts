/**
 * Adaptive Compression Strategy
 *
 * Automatically selects the best compression method based on content
 */

import type { Memory } from '../types'
import { TruncateStrategy } from './truncate-strategy'
import { ExtractStrategy } from './extract-strategy'
import { SummarizeStrategy, type LLMSummarizer } from './summarize-strategy'
import type { Summarizer } from '../summarization/summarizer'

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

export class AdaptiveStrategy implements CompressionStrategy {
  private truncateStrategy: TruncateStrategy
  private extractStrategy: ExtractStrategy
  private summarizeStrategy?: SummarizeStrategy

  constructor(summarizer?: LLMSummarizer | Summarizer) {
    this.truncateStrategy = new TruncateStrategy()
    this.extractStrategy = new ExtractStrategy()
    if (summarizer) {
      this.summarizeStrategy = new SummarizeStrategy(summarizer)
    }
  }

  canCompress(memory: Memory): boolean {
    return (
      this.truncateStrategy.canCompress(memory) ||
      this.extractStrategy.canCompress(memory) ||
      (this.summarizeStrategy?.canCompress(memory) ?? false)
    )
  }

  async compress(
    memory: Memory,
    targetRatio: number
  ): Promise<CompressionResult> {
    // Select strategy based on content characteristics
    const strategy = this.selectStrategy(memory)

    if (!strategy) {
      // Fallback: return original with minimal compression
      const original = memory.content
      return {
        compressed: original,
        original,
        compressionRatio: 1.0,
        tokensSaved: 0,
        method: 'none',
      }
    }

    return strategy.compress(memory, targetRatio)
  }

  private selectStrategy(memory: Memory): CompressionStrategy | null {
    const content = memory.content
    const length = content.length

    // For very short content, don't compress
    if (length < 100) {
      return null
    }

    // For structured content (lists, bullet points), use extract
    if (this.isStructured(content)) {
      return this.extractStrategy
    }

    // For long content with LLM available, use summarize
    if (length > 500 && this.summarizeStrategy?.canCompress(memory)) {
      return this.summarizeStrategy
    }

    // For narrative content, use extract
    if (length > 300 && this.hasNarrativeStructure(content)) {
      return this.extractStrategy
    }

    // Default: truncate
    return this.truncateStrategy
  }

  private isStructured(text: string): boolean {
    // Check for lists, bullet points, numbered items
    const listPatterns = [
      /^\s*[-•*]\s+/m, // Bullet points
      /^\s*\d+[.)]\s+/m, // Numbered lists
      /^\s*\w+:\s+/m, // Key-value pairs
    ]

    return listPatterns.some((pattern) => pattern.test(text))
  }

  private hasNarrativeStructure(text: string): boolean {
    // Check for multiple sentences (narrative structure)
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    return sentences.length > 3
  }
}
