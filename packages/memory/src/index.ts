/**
 * @clarity-chat/memory
 * 
 * Framework-agnostic AI memory and context management utilities
 * Works with any JavaScript/TypeScript application
 */

// Core types
export * from './types'

// Memory service (framework-agnostic)
export { MemoryService } from './memory-service'

// Token optimization utilities
export {
  TokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
} from './token-optimizer'

// Re-export key interfaces for convenience
export type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryStats,
  MemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryEvent,
  MemoryContext,
  TokenAllocation,
  TokenOptimizationConfig,
  CompressedMemory,
  MemoryChunk,
} from './types'
