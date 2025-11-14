/**
 * Memory & Context Domain
 * 
 * APIs for conversation memory, context management, and RAG
 */

// Top-level: Drop-in ready APIs
export {
  useMemoryStore,
  type UseMemoryStoreOptions,
  type UseMemoryStoreReturn,
} from '../../hooks/use-memory-store'

// Mid-level: Building blocks
export { MemoryProvider, useMemory } from '../../memory/memory-provider'
export {
  useMemoryQuery,
  useMemoryStats,
  useConversationMemory,
} from '../../memory/memory-provider'
export {
  useSlidingContextManager as useSlidingWindow,
} from '../../memory/use-sliding-context-manager'

// Low-level: Primitives
export { buildContextBundle } from '../../utils/memory/build-context-bundle'
export { compressContext } from '../../utils/memory/compress-context'
export { retrieveMemories } from '../../utils/memory/retrieve-memories'

// Re-export from memory package
export * from '@clarity-chat/memory'
