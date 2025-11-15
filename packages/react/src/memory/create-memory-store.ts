/**
 * createMemoryStore - Top-level factory for memory store
 * 
 * Creates a memory store instance with sensible defaults. Use this when you
 * need a memory store outside of React components or want to configure it
 * imperatively.
 * 
 * @example
 * ```tsx
 * // Create a memory store
 * const memoryStore = createMemoryStore({
 *   strategy: 'vector-store',
 *   maxTokens: 8000,
 * })
 * 
 * // Use in non-React context
 * await memoryStore.addMemory('User prefers dark mode', 'episodic')
 * const results = await memoryStore.query('What are user preferences?')
 * ```
 * 
 * @example
 * ```tsx
 * // Use with React Provider
 * const memoryStore = createMemoryStore({ enabled: true })
 * 
 * <MemoryProvider service={memoryStore}>
 *   <App />
 * </MemoryProvider>
 * ```
 */

import { MemoryService } from './memory-service'
import type { MemoryType, MemoryScope } from '@clarity-chat/memory'

/**
 * Options for creating a memory store
 */
export interface CreateMemoryStoreOptions {
  /** Enable memory (default: true) */
  enabled?: boolean
  /** Memory strategy */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Memory scope */
  scope?: MemoryScope
  /** Custom memory service instance */
  service?: MemoryService
}

/**
 * Memory store interface
 */
export interface MemoryStore {
  /** Whether memory is enabled */
  enabled: boolean
  /** Memory service instance */
  service: MemoryService
  /** Configuration */
  config: {
    enabled: boolean
    strategy?: CreateMemoryStoreOptions['strategy']
    maxTokens?: number
    scope?: MemoryScope
  }
  /** Add a memory */
  addMemory: (
    content: string,
    type?: MemoryType,
    metadata?: Record<string, any>
  ) => Promise<void>
  /** Query memories */
  query: (query: string, limit?: number) => Promise<any[]>
  /** Clear memories */
  clear: () => Promise<void>
}

/**
 * createMemoryStore - Create a memory store instance
 * 
 * Factory function that creates a memory store with the specified configuration.
 * Can be used in both React and non-React contexts.
 */
export function createMemoryStore(
  options: CreateMemoryStoreOptions = {}
): MemoryStore {
  const {
    enabled = true,
    strategy = 'sliding-window',
    maxTokens,
    scope = 'session',
    service: customService,
  } = options

  // Create or use provided service
  const service = customService || new MemoryService({
    maxTokens: maxTokens || 8000,
    strategy,
  })

  return {
    enabled,
    service,
    config: {
      enabled,
      strategy,
      maxTokens,
      scope,
    },
    addMemory: async (content: string, type: MemoryType = 'episodic', metadata?: Record<string, any>) => {
      if (!enabled) return
      await service.addMemory({
        content,
        type,
        scope,
        metadata,
        timestamp: Date.now(),
      })
    },
    query: async (query: string, limit = 10) => {
      if (!enabled) return []
      const results = await service.query({ query, limit })
      return results.map((r) => r.memory)
    },
    clear: async () => {
      if (!enabled) return
      // Clear memories for current scope
      // Implementation depends on service API
      await service.clear(scope)
    },
  }
}
