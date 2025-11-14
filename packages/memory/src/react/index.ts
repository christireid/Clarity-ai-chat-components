/**
 * Clarity Memory - React Exports
 * 
 * Conditional exports - only available if React is installed
 */

// Re-export hooks (will fail at runtime if React is not installed)
export {
  useMemory,
  useMemoryItem,
  useMemorySearch,
  useMemoryRecall,
  useMemoryStats,
  useAddMemory,
} from './use-memory'
