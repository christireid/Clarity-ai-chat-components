/**
 * @clarity-chat/memory
 * 
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
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

// Main export - clarityMemory factory function
export { clarityMemory, ClarityMemory } from './clarity-memory'

// Core types
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
  StoreConfig,
  VectorStoreConfig,
  TokenBudget,
  ImportanceScore,
  Embedder,
  ImportanceScorer,
  MemoryStore,
} from './core/types'

// Core utilities
export { createMemoryItem, isExpired, getAge, updateMemoryItem } from './core/memory-item'
export { createContextBundle, ContextBundleImpl } from './core/context-bundle'

// Token utilities
export {
  estimateTokens,
  estimateTokensBatch,
  estimateMemoryTokens,
  estimateMemoriesTokens,
  truncateToTokens,
  chunkByTokens,
} from './utils/token-counter'

// Stores
export { InMemoryStore } from './stores/in-memory'

// Legacy exports (for backward compatibility)
export * from './types'
export { MemoryService } from './memory-service'
export {
  TokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
} from './token-optimizer'
