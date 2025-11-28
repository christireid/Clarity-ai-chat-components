/**
 * Token Budget Manager
 *
 * Manages token allocation and budgeting for context building
 */

import type { TokenBudgetConfig, TokenBreakdown } from '../types'

/**
 * Clamp a number to a range, handling NaN/Infinity
 */
function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

/**
 * Ensure a number is non-negative and finite
 */
function safeNonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return value
}

export class TokenBudgetManager {
  private config: TokenBudgetConfig

  constructor(config: TokenBudgetConfig) {
    this.config = config
  }

  /**
   * Get token allocation breakdown
   */
  getAllocation(options?: { maxTokens?: number }): TokenBreakdown {
    const maxTokens = Math.max(1, options?.maxTokens || this.config.maxContextWindow || 1)
    const allocation = this.config.allocation

    return {
      systemPrompt: Math.floor(maxTokens * safeNonNegative(allocation.systemPrompt)),
      userPreferences: Math.floor(maxTokens * safeNonNegative(allocation.userPreferences)),
      recentContext: Math.floor(maxTokens * safeNonNegative(allocation.recentContext)),
      semanticMemory: Math.floor(maxTokens * safeNonNegative(allocation.semanticMemory)),
      episodicMemory: Math.floor(maxTokens * safeNonNegative(allocation.episodicMemory)),
      responseReserve: Math.floor(maxTokens * safeNonNegative(allocation.responseReserve)),
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
    const maxTokens = Math.max(1, breakdown.total || 1)

    // Normalize memoryRichness to [0, 1]
    const memoryRichness = clamp(context.memoryRichness, 0, 1)

    // If no preferences, redistribute
    if (!context.hasPreferences) {
      const freed = safeNonNegative(adjusted.userPreferences)
      adjusted.userPreferences = 0
      adjusted.semanticMemory += Math.floor(freed * 0.6)
      adjusted.episodicMemory += Math.floor(freed * 0.4)
    }

    // If no recent context, redistribute
    if (!context.hasRecent) {
      const freed = safeNonNegative(adjusted.recentContext)
      adjusted.recentContext = 0
      adjusted.semanticMemory += Math.floor(freed * 0.7)
      adjusted.episodicMemory += Math.floor(freed * 0.3)
    }

    // Adjust based on memory richness
    if (memoryRichness < 0.3) {
      // Low memory richness, reduce memory allocation
      const reduction = Math.floor(safeNonNegative(adjusted.semanticMemory) * 0.2)
      adjusted.semanticMemory -= reduction
      adjusted.recentContext += reduction
    } else if (memoryRichness > 0.7) {
      // High memory richness, increase memory allocation
      const increase = Math.floor(safeNonNegative(adjusted.recentContext) * 0.2)
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

      // Reduce in priority order: semanticMemory → episodicMemory → recentContext → userPreferences → summary → systemPrompt
      // systemPrompt is reduced last as it's critical for operation
      const reductionOrder: (keyof TokenBreakdown)[] = [
        'semanticMemory',
        'episodicMemory',
        'recentContext',
        'userPreferences',
        'summary',
        'systemPrompt', // Last resort
      ]

      for (const field of reductionOrder) {
        if (excess <= 0) break
        const current = safeNonNegative(adjusted[field] as number)
        if (current >= excess) {
          ;(adjusted[field] as number) = current - excess
          excess = 0
        } else {
          excess -= current
          ;(adjusted[field] as number) = 0
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
      breakdown.semanticMemory +
      breakdown.episodicMemory +
      (breakdown.summary ?? 0)

    return total <= breakdown.total
  }
}
