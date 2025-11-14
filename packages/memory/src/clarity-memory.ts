/**
 * Clarity Memory - Main Export Function
 * 
 * Factory function to create a ClarityMemory instance
 */

import { ClarityMemory } from './core/memory'
import type { MemoryConfig } from './core/types'

/**
 * Create a new Clarity Memory instance
 * 
 * @example
 * ```typescript
 * import { clarityMemory } from '@clarity-chat/memory'
 * 
 * const memory = clarityMemory()
 * await memory.add("User prefers TypeScript")
 * const context = await memory.recall("What does user prefer?")
 * ```
 */
export function clarityMemory(config?: MemoryConfig): ClarityMemory {
  return new ClarityMemory(config)
}

// Re-export types
export type {
  MemoryConfig,
  MemoryItem,
  MemoryType,
  ContextBundle,
  AddMemoryOptions,
  SearchOptions,
  RecallOptions,
  ContextOptions,
  CompressOptions,
  CompressionResult,
  SummarizeOptions,
  ListOptions,
  RankedMemory,
  MemoryStats,
  MemoryStatistics,
} from './core/types'

// Re-export main class
export { ClarityMemory } from './core/memory'
