/**
 * @clarity-chat/memory
 * 
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
 */

// Main factory function
export { clarityMemory } from './factory'

// Core classes
export { ClarityMemory } from './core/clarity-memory'

// Types
export * from './core/types'

// Storage adapters
export { StorageAdapter } from './stores/storage-adapter'
export { InMemoryStore } from './stores/in-memory-store'

// Embedding providers
export { EmbeddingProvider } from './embeddings/embedding-provider'
export { OpenAIEmbeddingProvider } from './embeddings/openai-provider'

// Context management
export { TokenBudgetManager } from './context/token-budget'
export { ContextBuilder } from './context/context-builder'

// Scoring
export { ImportanceScorer } from './scoring/importance-scorer'

// Legacy exports (for backward compatibility)
export { MemoryService } from './memory-service'
export {
  TokenCounter,
  TokenBudgetManager as TokenBudgetManagerLegacy,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
} from './token-optimizer'
export type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats,
  MemoryType as LegacyMemoryType,
  MemoryScope as LegacyMemoryScope,
  MemoryPriority,
  MemoryEvent,
  MemoryContext,
  TokenAllocation,
  TokenOptimizationConfig,
  CompressedMemory,
  MemoryChunk,
} from './types'
