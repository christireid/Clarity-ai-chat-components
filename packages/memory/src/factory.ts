/**
 * Clarity Memory Factory
 * 
 * Creates and returns a configured ClarityMemory instance
 */

import { ClarityMemory } from './core/clarity-memory'
import type { MemoryConfig } from './core/types'

/**
 * Create a Clarity Memory instance
 * 
 * @example
 * ```typescript
 * // Zero-config usage
 * const memory = clarityMemory()
 * await memory.add("User prefers dark mode")
 * 
 * // With configuration
 * const memory = clarityMemory({
 *   embeddingProvider: {
 *     provider: 'openai',
 *     apiKey: process.env.OPENAI_API_KEY,
 *   },
 *   tokenBudget: {
 *     maxTokens: 4096,
 *     allocation: {
 *       systemPrompt: 0.10,
 *       userPreferences: 0.15,
 *       recentContext: 0.30,
 *       semanticMemory: 0.25,
 *       episodicMemory: 0.15,
 *       responseReserve: 0.05,
 *     },
 *     dynamicAllocation: true,
 *     strictMode: false,
 *   },
 * })
 * ```
 */
export function clarityMemory(config?: MemoryConfig): ClarityMemory {
  return new ClarityMemory(config)
}
