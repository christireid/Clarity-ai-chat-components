/**
 * Compression Engine
 * 
 * Orchestrates compression strategies
 */

import type { Memory, CompressionConfig } from '../core/types'
import type { CompressionStrategy, CompressionResult } from './compression-strategy'
import { TruncateStrategy } from './truncate-strategy'
import { ExtractStrategy } from './extract-strategy'
import { SummarizeStrategy, type LLMSummarizer } from './summarize-strategy'
import { AdaptiveStrategy } from './adaptive-strategy'
import type { Summarizer } from '../summarization/summarizer'
import type { SummarizationPipeline } from '../summarization/summarization-pipeline'
import { countTokens } from '../utils/token-counter'

export class CompressionEngine {
  private config: CompressionConfig
  private strategies: Map<string, CompressionStrategy>
  private defaultStrategy: CompressionStrategy

  constructor(config: CompressionConfig, summarizer?: LLMSummarizer | Summarizer | SummarizationPipeline) {
    this.config = config
    this.strategies = new Map()
    
    // Register strategies
    this.strategies.set('truncate', new TruncateStrategy())
    this.strategies.set('extract', new ExtractStrategy())
    
    // Use summarizer if available (can be SummarizationPipeline or direct Summarizer)
    const effectiveSummarizer = summarizer instanceof SummarizationPipeline
      ? undefined // Compression engine will use its own summarization if needed
      : summarizer
    
    if (effectiveSummarizer) {
      this.strategies.set('summarize', new SummarizeStrategy(effectiveSummarizer))
    }
    
    this.strategies.set('adaptive', new AdaptiveStrategy(effectiveSummarizer))
    
    // Set default strategy
    this.defaultStrategy = this.strategies.get(config.strategy) || this.strategies.get('adaptive')!
  }

  /**
   * Compress a memory
   */
  async compress(memory: Memory, targetRatio?: number): Promise<CompressionResult> {
    if (!this.config.enabled) {
      return {
        compressed: memory.content,
        original: memory.content,
        compressionRatio: 1.0,
        tokensSaved: 0,
        method: 'none',
      }
    }

    const ratio = targetRatio ?? (1 - this.config.threshold)
    
    // Check if compression is needed
    const currentTokens = this.countTokens(memory.content)
    const targetTokens = Math.floor(currentTokens * ratio)
    
    if (currentTokens <= targetTokens) {
      return {
        compressed: memory.content,
        original: memory.content,
        compressionRatio: 1.0,
        tokensSaved: 0,
        method: 'none',
      }
    }

    // Select strategy
    const strategy = this.selectStrategy(memory)
    
    if (!strategy || !strategy.canCompress(memory)) {
      return {
        compressed: memory.content,
        original: memory.content,
        compressionRatio: 1.0,
        tokensSaved: 0,
        method: 'none',
      }
    }

    // Compress
    const result = await strategy.compress(memory, ratio)
    
    // Validate quality
    if (result.compressionRatio < this.config.minQuality) {
      // Compression too aggressive, return original
      return {
        compressed: memory.content,
        original: memory.content,
        compressionRatio: 1.0,
        tokensSaved: 0,
        method: 'none',
      }
    }

    return result
  }

  /**
   * Compress multiple memories
   */
  async compressBatch(
    memories: Memory[],
    targetRatio?: number
  ): Promise<CompressionResult[]> {
    return Promise.all(memories.map(m => this.compress(m, targetRatio)))
  }

  private selectStrategy(memory: Memory): CompressionStrategy {
    const strategyName = this.config.strategy
    
    if (strategyName === 'adaptive') {
      return this.defaultStrategy
    }
    
    return this.strategies.get(strategyName) || this.defaultStrategy
  }

  private countTokens(text: string): number {
    return countTokens(text)
  }
}
