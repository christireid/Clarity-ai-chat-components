/**
 * @clarity-chat/memory
 *
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
 */

// Main API - Legacy memory service (core/memory not yet implemented)
// TODO: Implement clarityMemory when core/ directory is created
// export { clarityMemory } from './core/memory'
// export type { MemoryInstance } from './core/memory'

// Core types from types.ts
// export * from './core/types'

// Configuration (not yet implemented)
// export * from './core/config'

// Storage adapters
export { InMemoryStore } from './stores/in-memory'
export { FileStore } from './stores/file'
export { IndexedDBStore } from './stores/indexeddb'
export { createStoreFromConfig } from './stores/factory'
export type { VectorStore, SearchOptions } from './stores/base'

// Utilities
export * from './utils/token-counter'
export * from './utils/validation'
export * from './utils/vector'

// Legacy exports (for backward compatibility)
export { MemoryService } from './memory-service'
export {
  TokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
} from './token-optimizer'

// Re-export legacy types
export type {
  MemoryItem as LegacyMemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats as LegacyMemoryStats,
  MemoryType as LegacyMemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryEvent,
  MemoryContext,
  TokenAllocation as LegacyTokenAllocation,
  TokenOptimizationConfig,
  CompressedMemory,
  MemoryChunk as LegacyMemoryChunk,
} from './types'
