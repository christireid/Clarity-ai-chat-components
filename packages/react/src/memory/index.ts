/**
 * AI Memory & Context System
 *
 * Comprehensive memory management for AI chat applications
 *
 * @module @clarity-chat/react/memory
 */

// Types
export * from './types'

// Core service (re-exported from @clarity-chat/memory)
export { MemoryService } from '@clarity-chat/memory'

// Token optimization (re-exported from @clarity-chat/memory)
export {
  TokenCounter as MemoryTokenCounter,
  TokenBudgetManager,
  ContextOptimizer,
} from '@clarity-chat/memory'

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
