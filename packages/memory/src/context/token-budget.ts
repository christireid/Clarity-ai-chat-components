/**
 * Token Budget Manager
 * 
 * Manages token allocation and budgeting for context building
 */

import type { TokenBudgetConfig, TokenBreakdown } from '../types'

export class TokenBudgetManager {
  private config: TokenBudgetConfig

  constructor(config: TokenBudgetConfig) {
    this.config = config
  }

  /**
   * Get token allocation breakdown
   */
  getAllocation(options?: { maxTokens?: number }): TokenBreakdown {
    const maxTokens = options?.maxTokens || this.config.maxContextWindow
    const allocation = this.config.allocation

    return {
      systemPrompt: Math.floor(maxTokens * allocation.systemPrompt),
      userPreferences: Math.floor(maxTokens * allocation.userPreferences),
      recentContext: Math.floor(maxTokens * allocation.recentContext),
      semanticMemory: Math.floor(maxTokens * allocation.semanticMemory),
      episodicMemory: Math.floor(maxTokens * allocation.episodicMemory),
      responseReserve: Math.floor(maxTokens * allocation.responseReserve),
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
      adjusted.semanticMemory += Math.floor(freed * 0.6)
      adjusted.episodicMemory += Math.floor(freed * 0.4)
    }

    // If no recent context, redistribute
    if (!context.hasRecent) {
      const freed = adjusted.recentContext
      adjusted.recentContext = 0
      adjusted.semanticMemory += Math.floor(freed * 0.7)
      adjusted.episodicMemory += Math.floor(freed * 0.3)
    }

    // Adjust based on memory richness
    if (context.memoryRichness < 0.3) {
      // Low memory richness, reduce memory allocation
      const reduction = Math.floor(adjusted.semanticMemory * 0.2)
      adjusted.semanticMemory -= reduction
      adjusted.recentContext += reduction
    } else if (context.memoryRichness > 0.7) {
      // High memory richness, increase memory allocation
      const increase = Math.floor(adjusted.recentContext * 0.2)
      adjusted.recentContext -= increase
      adjusted.semanticMemory += increase
    }

    // Ensure we don't exceed total
    // Note: responseReserve is excluded as it's reserved for the model's response
    const currentTotal =
      adjusted.systemPrompt +
      adjusted.userPreferences +
      adjusted.recentContext +
      adjusted.semanticMemory +
      adjusted.episodicMemory +
      (adjusted.summary ?? 0)

    if (currentTotal > maxTokens) {
      let excess = currentTotal - maxTokens

      // Reduce in priority order: semanticMemory → episodicMemory → recentContext → userPreferences
      // systemPrompt is never reduced as it's critical for operation
      const reductionOrder: (keyof TokenBreakdown)[] = [
        'semanticMemory',
        'episodicMemory',
        'recentContext',
        'userPreferences',
      ]

      for (const field of reductionOrder) {
        if (excess <= 0) break
        const current = adjusted[field] as number
        if (current >= excess) {
          ;(adjusted[field] as number) = current - excess
          excess = 0
        } else {
          excess -= current
          ;(adjusted[field] as number) = 0
        }
      }

      // If still over budget after all reductions, log warning (systemPrompt protection)
      if (excess > 0 && process.env.NODE_ENV === 'development') {
        console.warn(
          `TokenBudgetManager: Unable to reduce allocation by ${excess} tokens. ` +
            `systemPrompt (${adjusted.systemPrompt}) is protected from reduction.`
        )
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
      breakdown.semanticMemory +
      breakdown.episodicMemory +
      (breakdown.summary ?? 0)

    return total <= breakdown.total
  }
}
