/**
 * Clarity Memory - Main Entry Point
 * 
 * A superior, developer-friendly memory system for AI applications.
 */

// Core exports
export { clarityMemory, Memory } from './core/memory'

// Type exports
export type {
  MemoryItem,
  MemoryConfig,
  MemoryChunk,
  Embedding,
  MemoryScore,
  SearchResult,
  ContextBundle,
  SummarizationResult,
  CompressionResult,
  EmbeddingConfig,
  StoreConfig,
  ShortTermConfig,
  LongTermConfig,
  ScoringConfig,
  SummarizationConfig,
  TokenBudgetConfig,
  SearchOptions,
  StoreStats,
  MemoryStore,
  Embedder,
  Scorer,
  MemoryErrorCode,
} from './types'

export { MemoryError, MemoryErrorCodes } from './types'

// React exports (will be added when React integration is implemented)
// export { useMemory, MemoryProvider, MemoryInspector } from './react'

// Store adapters (will be added when implemented)
// export { InMemoryStore } from './stores/in-memory'
// export { FileStore } from './stores/file'
// export { IndexedDBStore } from './stores/indexeddb'

// Embedding providers (will be added when implemented)
// export { OpenAIEmbedder } from './embeddings/openai'
// export { AnthropicEmbedder } from './embeddings/anthropic'

// Version
export const VERSION = '0.1.0'
