/**
 * Memory Token Budget Manager
 *
 * Manages token allocation and budgeting for memory-based context building.
 * Migrated from the memory package for consolidation.
 *
 * Supports:
 * - Memory-type based allocation (episodic, semantic, etc.)
 * - Dynamic allocation based on context
 * - Token breakdown by category
 * - Budget validation and adjustment
 *
 * @module memory-budget
 */

/**
 * Memory type for budget allocation
 */
export type MemoryBudgetType =
  | 'episodic'
  | 'semantic'
  | 'procedural'
  | 'short-term'
  | 'profile'

/**
 * Token allocation percentages for different memory categories
 */
export interface MemoryTokenAllocation {
  /** System prompt allocation (0-1) */
  systemPrompt: number
  /** User preferences allocation (0-1) */
  userPreferences: number
  /** Recent context allocation (0-1) */
  recentContext: number
  /** Semantic memory allocation (0-1) */
  semanticMemory: number
  /** Episodic memory allocation (0-1) */
  episodicMemory: number
  /** Reserved for response (0-1) */
  responseReserve: number
}

/**
 * Configuration for memory token budget manager
 */
export interface MemoryTokenBudgetConfig {
  /** Maximum context window size in tokens */
  maxContextWindow: number
  /** Token allocation percentages */
  allocation: MemoryTokenAllocation
  /** Enable dynamic allocation based on context (default: false) */
  dynamicAllocation?: boolean
}

/**
 * Token breakdown by category (absolute token counts)
 */
export interface MemoryTokenBreakdown {
  /** System prompt tokens */
  systemPrompt: number
  /** User preferences tokens */
  userPreferences: number
  /** Recent context tokens */
  recentContext: number
  /** Semantic memory tokens */
  semanticMemory: number
  /** Episodic memory tokens */
  episodicMemory: number
  /** Response reserve tokens */
  responseReserve: number
  /** Summary tokens (fixed 5% of total) */
  summary: number
  /** Total available tokens */
  total: number
}

/**
 * Context for dynamic allocation adjustment
 */
export interface MemoryBudgetContext {
  /** Whether user preferences are present */
  hasPreferences: boolean
  /** Whether recent context is present */
  hasRecent: boolean
  /** Memory richness score (0-1) */
  memoryRichness: number
}

/**
 * Clamp a number to a range, handling NaN/Infinity
 *
 * @param value - Value to clamp
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Clamped value
 */
function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.max(min, Math.min(max, value))
}

/**
 * Ensure a number is non-negative and finite
 *
 * @param value - Value to check
 * @returns Safe non-negative value
 */
function safeNonNegative(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return value
}

/**
 * Memory Token Budget Manager
 *
 * Manages token allocation for memory-based AI systems.
 * Supports both static and dynamic allocation strategies.
 *
 * @example
 * ```typescript
 * const manager = new MemoryTokenBudgetManager({
 *   maxContextWindow: 128000,
 *   allocation: {
 *     systemPrompt: 0.10,
 *     userPreferences: 0.10,
 *     recentContext: 0.20,
 *     semanticMemory: 0.25,
 *     episodicMemory: 0.15,
 *     responseReserve: 0.20,
 *   },
 *   dynamicAllocation: true,
 * });
 *
 * // Get base allocation
 * const allocation = manager.getAllocation();
 *
 * // Adjust based on context
 * const adjusted = manager.adjustAllocation(allocation, {
 *   hasPreferences: true,
 *   hasRecent: true,
 *   memoryRichness: 0.7,
 * });
 * ```
 */
export class MemoryTokenBudgetManager {
  private readonly config: MemoryTokenBudgetConfig

  /**
   * Create a new memory token budget manager
   *
   * @param config - Budget configuration
   */
  constructor(config: MemoryTokenBudgetConfig) {
    this.config = {
      ...config,
      dynamicAllocation: config.dynamicAllocation ?? false,
    }
  }

  /**
   * Get token allocation breakdown
   *
   * @param options - Optional override for max tokens
   * @returns Token breakdown with absolute counts
   */
  getAllocation(options?: { maxTokens?: number }): MemoryTokenBreakdown {
    const maxTokens = Math.max(
      1,
      options?.maxTokens || this.config.maxContextWindow || 1
    )
    const allocation = this.config.allocation

    return {
      systemPrompt: Math.floor(
        maxTokens * safeNonNegative(allocation.systemPrompt)
      ),
      userPreferences: Math.floor(
        maxTokens * safeNonNegative(allocation.userPreferences)
      ),
      recentContext: Math.floor(
        maxTokens * safeNonNegative(allocation.recentContext)
      ),
      semanticMemory: Math.floor(
        maxTokens * safeNonNegative(allocation.semanticMemory)
      ),
      episodicMemory: Math.floor(
        maxTokens * safeNonNegative(allocation.episodicMemory)
      ),
      responseReserve: Math.floor(
        maxTokens * safeNonNegative(allocation.responseReserve)
      ),
      summary: Math.floor(maxTokens * 0.05), // Fixed 5% for summary
      total: maxTokens,
    }
  }

  /**
   * Adjust allocation dynamically based on context
   *
   * Redistributes tokens when preferences or recent context are missing,
   * and adjusts based on memory richness.
   *
   * @param breakdown - Initial token breakdown
   * @param context - Context for adjustment
   * @returns Adjusted token breakdown
   */
  adjustAllocation(
    breakdown: MemoryTokenBreakdown,
    context: MemoryBudgetContext
  ): MemoryTokenBreakdown {
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
      const reduction = Math.floor(
        safeNonNegative(adjusted.semanticMemory) * 0.2
      )
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

      // Reduce in priority order: semanticMemory -> episodicMemory -> recentContext -> userPreferences -> summary -> systemPrompt
      // systemPrompt is reduced last as it's critical for operation
      const reductionOrder: (keyof MemoryTokenBreakdown)[] = [
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
   *
   * @param breakdown - Token breakdown to check
   * @returns True if within budget
   */
  isWithinBudget(breakdown: MemoryTokenBreakdown): boolean {
    const total =
      breakdown.systemPrompt +
      breakdown.userPreferences +
      breakdown.recentContext +
      breakdown.semanticMemory +
      breakdown.episodicMemory +
      (breakdown.summary ?? 0)

    return total <= breakdown.total
  }

  /**
   * Get budget for a specific memory type
   *
   * @param type - Memory type
   * @param options - Optional override for max tokens
   * @returns Token budget for the memory type
   */
  getBudgetForType(
    type: MemoryBudgetType,
    options?: { maxTokens?: number }
  ): number {
    const allocation = this.getAllocation(options)

    switch (type) {
      case 'episodic':
        return allocation.episodicMemory
      case 'semantic':
        return allocation.semanticMemory
      case 'procedural':
        // Procedural gets a portion of semantic memory
        return Math.floor(allocation.semanticMemory * 0.2)
      case 'short-term':
        return allocation.recentContext
      case 'profile':
        return allocation.userPreferences
      default:
        return 0
    }
  }

  /**
   * Get the configuration
   *
   * @returns Current configuration
   */
  getConfig(): MemoryTokenBudgetConfig {
    return { ...this.config }
  }

  /**
   * Create a new manager with updated configuration
   *
   * @param updates - Configuration updates
   * @returns New manager instance
   */
  withConfig(
    updates: Partial<MemoryTokenBudgetConfig>
  ): MemoryTokenBudgetManager {
    return new MemoryTokenBudgetManager({
      ...this.config,
      ...updates,
      allocation: {
        ...this.config.allocation,
        ...updates.allocation,
      },
    })
  }
}

/**
 * Create a memory token budget manager with default settings
 *
 * @param config - Optional configuration overrides
 * @returns Configured manager instance
 */
export function createMemoryTokenBudgetManager(
  config?: Partial<MemoryTokenBudgetConfig>
): MemoryTokenBudgetManager {
  const defaultConfig: MemoryTokenBudgetConfig = {
    maxContextWindow: 128000,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.1,
      recentContext: 0.2,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.2,
    },
    dynamicAllocation: false,
  }

  return new MemoryTokenBudgetManager({
    ...defaultConfig,
    ...config,
    allocation: {
      ...defaultConfig.allocation,
      ...config?.allocation,
    },
  })
}

/**
 * Default allocation presets for common use cases
 */
export const MemoryBudgetPresets = {
  /**
   * Balanced allocation for general use
   */
  balanced: {
    systemPrompt: 0.1,
    userPreferences: 0.1,
    recentContext: 0.2,
    semanticMemory: 0.25,
    episodicMemory: 0.15,
    responseReserve: 0.2,
  } as MemoryTokenAllocation,

  /**
   * Memory-heavy allocation for knowledge-intensive tasks
   */
  memoryHeavy: {
    systemPrompt: 0.08,
    userPreferences: 0.07,
    recentContext: 0.15,
    semanticMemory: 0.35,
    episodicMemory: 0.2,
    responseReserve: 0.15,
  } as MemoryTokenAllocation,

  /**
   * Conversation-heavy allocation for chat applications
   */
  conversationHeavy: {
    systemPrompt: 0.1,
    userPreferences: 0.05,
    recentContext: 0.35,
    semanticMemory: 0.15,
    episodicMemory: 0.15,
    responseReserve: 0.2,
  } as MemoryTokenAllocation,

  /**
   * Response-heavy allocation for tasks requiring long outputs
   */
  responseHeavy: {
    systemPrompt: 0.1,
    userPreferences: 0.05,
    recentContext: 0.15,
    semanticMemory: 0.15,
    episodicMemory: 0.1,
    responseReserve: 0.45,
  } as MemoryTokenAllocation,
} as const
