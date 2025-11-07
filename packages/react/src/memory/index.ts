/**
 * AI Memory & Context System
 * 
 * Production-ready memory management for AI chat applications
 * 
 * @module @clarity-chat/react/memory
 */

// Types
export * from './types'

// Core service
export { MemoryService } from './memory-service'

// Token optimization
export {
  TokenCounter,
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
  useTokenOptimization,
} from './memory-provider'

export type { MemoryProviderProps } from './memory-provider'
