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

import { MemoryService } from '@clarity-chat/memory'
import type { MemoryType, MemoryScope, MemoryServiceConfig } from './types'

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
  const serviceConfig: MemoryServiceConfig = {
    tokenOptimization: {
      maxContextWindow: maxTokens || 8000,
      allocation: {
        systemPrompt: 10,
        userPreferences: 15,
        recentContext: 30,
        semanticMemory: 20,
        episodicMemory: 15,
        responseReserve: 10,
      },
      dynamicAllocation: true,
      enableCompression: false,
      enableChunking: false,
    },
    persistence: {
      useVectorStore: strategy === 'vector-store',
      useCache: true,
      useDatabase: false,
    },
    enableAutoSummarization: false,
    enableAutoCleanup: true,
    cleanupInterval: 60000,
    retentionPolicy: {
      shortTerm: 3600,
      session: 86400,
      thread: 604800,
      global: 0,
    },
    maxTokens: maxTokens || 8000,
    strategy,
  }
  const service = customService || new MemoryService(serviceConfig)

  return {
    enabled,
    service,
    config: {
      enabled,
      strategy,
      maxTokens,
      scope,
    },
    addMemory: async (
      content: string,
      type: MemoryType = 'episodic',
      metadata?: Record<string, any>
    ) => {
      if (!enabled) return
      await service.addMemory(content, type, scope, metadata || {})
    },
    query: async (queryText: string, limit = 10) => {
      if (!enabled) return []
      const results = await service.query({ query: queryText, limit })
      return results.map((r) => r.memory)
    },
    clear: async () => {
      if (!enabled) return
      // Clear memories for current scope by deleting them
      await service.deleteMemories({ scopes: [scope] })
    },
  }
}
