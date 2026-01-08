/**
 * Memory & Context Domain
 *
 * APIs for conversation memory, context management, and RAG
 */
// Top-level: Drop-in ready APIs
export { useMemoryStore, } from '../../hooks/use-memory-store';
export { createMemoryStore, } from '../../memory/create-memory-store';
// Mid-level: Building blocks
export { MemoryProvider, useMemory } from '../../memory/memory-provider';
export { useMemoryQuery, useMemoryStats, useConversationMemory, } from '../../memory/memory-provider';
// Note: useSlidingWindow hook is not yet available.
// For sliding context management, use SlidingContextManager class from utils/memory
// Low-level: Primitives
// Note: ContextBundle is exported from @clarity-chat/memory below, so we exclude it here
export { buildContextBundle, compressContext, retrieveMemories, } from '../../utils/memory';
// Re-export from memory package (authoritative source for types like ContextBundle)
export * from '@clarity-chat/memory';
//# sourceMappingURL=index.js.map