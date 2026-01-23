/**
 * AI Memory & Context System
 *
 * Production-ready memory management for AI chat applications
 *
 * @module @clarity-chat/react/memory
 */

// Types
export * from './types'

// Core service (re-exported from @clarity-chat/memory)
export { MemoryService } from '@clarity-chat/memory'

// Token optimization
export {
  TokenCounter as MemoryTokenCounter,
  TokenBudgetManager,
  MemoryCompressor,
  SemanticChunker,
  ContextOptimizer,
} from './token-optimizer'

// React integration
export {
  MemoryProvider,
  useMemory,
  useMemoryQuery,
  useMemoryStats,
  useMemoryEvents,
  useConversationMemory,
  useMemoryOptimization,
} from './memory-provider'

export type { MemoryProviderProps } from './memory-provider'

// Top-level factory
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from './create-memory-store'
