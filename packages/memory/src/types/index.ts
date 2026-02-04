/**
 * AI Memory & Context Types
 *
 * Production-ready memory system for AI chat applications with support for:
 * - Short-term and long-term memory
 * - Episodic and semantic memory
 * - Token optimization
 * - Semantic chunking and compression
 * - Hybrid memory systems
 */

// Export all memory types
export type {
  MemoryScope,
  MemoryType,
  MemoryPriority,
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  SearchOptions,
  AddOptions,
  MemoryBuffer,
  MemoryChunk,
  MemoryContext,
  CompressedMemory,
  MemoryStats,
  MemoryScore,
  MemoryEventType,
  MemoryEvent,
  MemoryEventListener,
  DeletionResult,
  DeletionVerification,
  DataExportResult,
  DataExportOptions,
  MemoryErrorCode,
  Memory,
  SearchResult,
} from './memory.js'

export { MemoryError, MemoryErrorCodes } from './memory.js'

// Export all vector types
export type {
  VectorStoreQuery,
  VectorStoreMatch,
  VectorStoreVector,
  VectorStoreUpsertOptions,
  VectorStore,
  EmbeddingProvider,
  VectorStoreConfig,
} from './vector.js'

// Export all config types
export type {
  TokenAllocation,
  TokenOptimizationConfig,
  TokenBreakdown,
  TokenBudgetConfig,
  CompressionConfig,
  SummarizationConfig,
  MemoryPersistenceOptions,
  ContextBundle,
  ContextOptions,
  MemoryServiceConfig,
  MemoryConfig,
} from './config.js'
