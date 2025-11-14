/**
 * Truncate Compression Strategy
 * 
 * Simple truncation-based compression
 */

import type { CompressionStrategy, CompressionResult } from './compression-strategy'
import type { Memory } from '../core/types'

export class TruncateStrategy implements CompressionStrategy {
  canCompress(memory: Memory): boolean {
    return memory.content.length > 100 // Only compress if content is substantial
  }

  async compress(memory: Memory, targetRatio: number): Promise<CompressionResult> {
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

    const originalTokens = this.countTokens(original)
    const compressedTokens = this.countTokens(truncated)
    const compressionRatio = compressedTokens / originalTokens

    return {
      compressed: truncated,
      original,
      compressionRatio,
      tokensSaved: originalTokens - compressedTokens,
      method: 'truncate',
    }
  }

  private countTokens(text: string): number {
    return Math.ceil(text.length / 4)
  }
}
