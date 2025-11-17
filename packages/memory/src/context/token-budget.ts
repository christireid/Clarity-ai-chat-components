/**
 * Token Budget Manager
 * 
 * Manages token allocation and budgeting for context building
 */

import type { TokenBudgetConfig, TokenBreakdown, ContextOptions } from '../core/types'

export class TokenBudgetManager {
  private config: TokenBudgetConfig

  constructor(config: TokenBudgetConfig) {
    this.config = config
  }

  /**
   * Get token allocation breakdown
   */
  getAllocation(options?: { maxTokens?: number }): TokenBreakdown {
    const maxTokens = options?.maxTokens || this.config.maxTokens
    const allocation = this.config.allocation

    return {
      systemPrompt: Math.floor(maxTokens * allocation.systemPrompt),
      userPreferences: Math.floor(maxTokens * allocation.userPreferences),
      recentContext: Math.floor(maxTokens * allocation.recentContext),
      semanticMemories: Math.floor(maxTokens * allocation.semanticMemory),
      episodicMemories: Math.floor(maxTokens * allocation.episodicMemory),
      summary: Math.floor(maxTokens * 0.05), // Fixed 5% for summary
      total: maxTokens,
    }
  }

  /**
   * Adjust allocation dynamically based on context
   */
  adjustAllocation(
    breakdown: TokenBreakdown,
    context: {
      hasPreferences: boolean
      hasRecent: boolean
      memoryRichness: number
    }
  ): TokenBreakdown {
    if (!this.config.dynamicAllocation) {
      return breakdown
    }

    const adjusted = { ...breakdown }
    const maxTokens = breakdown.total

    // If no preferences, redistribute
    if (!context.hasPreferences) {
      const freed = adjusted.userPreferences
      adjusted.userPreferences = 0
      adjusted.semanticMemories += Math.floor(freed * 0.6)
      adjusted.episodicMemories += Math.floor(freed * 0.4)
    }

    // If no recent context, redistribute
    if (!context.hasRecent) {
      const freed = adjusted.recentContext
      adjusted.recentContext = 0
      adjusted.semanticMemories += Math.floor(freed * 0.7)
      adjusted.episodicMemories += Math.floor(freed * 0.3)
    }

    // Adjust based on memory richness
    if (context.memoryRichness < 0.3) {
      // Low memory richness, reduce memory allocation
      const reduction = Math.floor(adjusted.semanticMemories * 0.2)
      adjusted.semanticMemories -= reduction
      adjusted.recentContext += reduction
    } else if (context.memoryRichness > 0.7) {
      // High memory richness, increase memory allocation
      const increase = Math.floor(adjusted.recentContext * 0.2)
      adjusted.recentContext -= increase
      adjusted.semanticMemories += increase
    }

    // Ensure we don't exceed total
    const currentTotal =
      adjusted.systemPrompt +
      adjusted.userPreferences +
      adjusted.recentContext +
      adjusted.semanticMemories +
      adjusted.episodicMemories +
      adjusted.summary

    if (currentTotal > maxTokens) {
      const excess = currentTotal - maxTokens
      // Reduce from largest allocations
      if (adjusted.semanticMemories > excess) {
        adjusted.semanticMemories -= excess
      } else {
        adjusted.semanticMemories = 0
        const remaining = excess - adjusted.semanticMemories
        if (adjusted.episodicMemories > remaining) {
          adjusted.episodicMemories -= remaining
        }
      }
    }

    return adjusted
  }

  /**
   * Check if allocation is within budget
   */
  isWithinBudget(breakdown: TokenBreakdown): boolean {
    const total =
      breakdown.systemPrompt +
      breakdown.userPreferences +
      breakdown.recentContext +
      breakdown.semanticMemories +
      breakdown.episodicMemories +
      breakdown.summary

    return total <= breakdown.total
  }
}
