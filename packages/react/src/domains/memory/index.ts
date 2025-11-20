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
export {
  createMemoryStore,
  type CreateMemoryStoreOptions,
  type MemoryStore,
} from '../../memory/create-memory-store'

// Mid-level: Building blocks
export { MemoryProvider, useMemory } from '../../memory/memory-provider'
export {
  useMemoryQuery,
  useMemoryStats,
  useConversationMemory,
} from '../../memory/memory-provider'
// TODO: Re-enable once useSlidingContextManager is implemented
// export {
//   useSlidingContextManager as useSlidingWindow,
// } from '../../memory/use-sliding-context-manager'

// Low-level: Primitives
// TODO: Re-enable once utils/memory is implemented
// export * from '../../utils/memory'

// Re-export from memory package
export * from '@clarity-chat/memory'
