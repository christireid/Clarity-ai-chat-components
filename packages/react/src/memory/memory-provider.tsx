/**
 * Memory Provider & Hooks
 * 
 * React integration for AI Memory & Context system
 * 
 * Note: This is a React wrapper around the framework-agnostic
 * @clarity-chat/memory package. For non-React usage, import
 * directly from @clarity-chat/memory
 */

import * as React from 'react'
import type {
  MemoryItem,
  MemoryQuery,
  MemorySearchResult,
  MemoryServiceConfig,
  MemoryType,
  MemoryScope,
  MemoryPriority,
  MemoryStats,
  MemoryEvent,
  MemoryContext,
} from '@clarity-chat/memory'
import type { VectorStore } from '../vector-stores/types'
import type { EmbeddingProvider } from '../embeddings/types'
import { MemoryService } from '@clarity-chat/memory'

/**
 * Memory Context
 */
interface MemoryContextValue {
  service: MemoryService | null
  isInitialized: boolean
  
  // Core operations
  addMemory: (
    content: string,
    type: MemoryType,
    scope: MemoryScope,
    metadata?: MemoryItem['metadata'],
    options?: {
      priority?: MemoryPriority
      confidence?: number
    }
  ) => Promise<MemoryItem>
  
  query: (query: MemoryQuery) => Promise<MemorySearchResult[]>
  
  updateMemory: (id: string, updates: Partial<MemoryItem>) => Promise<MemoryItem | null>
  
  deleteMemory: (id: string) => Promise<boolean>
  
  promoteMemory: (id: string, targetScope: MemoryScope) => Promise<MemoryItem | null>
  
  compressMemory: (id: string, ratio?: number) => Promise<MemoryItem | null>
  
  // Stats and context
  getStats: () => MemoryStats
  
  getContext: () => MemoryContext
  
  // Event subscription
  subscribe: (eventType: string, listener: (event: MemoryEvent) => void) => () => void
}

const MemoryContext = React.createContext<MemoryContextValue | null>(null)

/**
 * Memory Provider Props
 */
export interface MemoryProviderProps {
  children: React.ReactNode
  config: MemoryServiceConfig
  vectorStore?: VectorStore
  embeddings?: EmbeddingProvider
  autoStart?: boolean
}

/**
 * Memory Provider
 */
export const MemoryProvider: React.FC<MemoryProviderProps> = ({
  children,
  config,
  vectorStore,
  embeddings,
  autoStart = true,
}) => {
  const [service, setService] = React.useState<MemoryService | null>(null)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Initialize service
  React.useEffect(() => {
    if (!autoStart) return

    const memoryService = new MemoryService(config, vectorStore, embeddings)
    setService(memoryService)
    setIsInitialized(true)

    return () => {
      memoryService.stop()
    }
  }, [config, vectorStore, embeddings, autoStart])

  const addMemory = React.useCallback(
    async (
      content: string,
      type: MemoryType,
      scope: MemoryScope,
      metadata?: MemoryItem['metadata'],
      options?: {
        priority?: MemoryPriority
        confidence?: number
      }
    ) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.addMemory(content, type, scope, metadata, options)
    },
    [service]
  )

  const query = React.useCallback(
    async (query: MemoryQuery) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.query(query)
    },
    [service]
  )

  const updateMemory = React.useCallback(
    async (id: string, updates: Partial<MemoryItem>) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.updateMemory(id, updates)
    },
    [service]
  )

  const deleteMemory = React.useCallback(
    async (id: string) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.deleteMemory(id)
    },
    [service]
  )

  const promoteMemory = React.useCallback(
    async (id: string, targetScope: MemoryScope) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.promoteMemory(id, targetScope)
    },
    [service]
  )

  const compressMemory = React.useCallback(
    async (id: string, ratio?: number) => {
      if (!service) {
        throw new Error('Memory service not initialized')
      }
      return service.compressMemory(id, ratio)
    },
    [service]
  )

  const getStats = React.useCallback(() => {
    if (!service) {
      return {
        total: 0,
        byType: {} as any,
        byScope: {} as any,
        byPriority: {} as any,
        totalTokens: 0,
        averageConfidence: 0,
      }
    }
    return service.getStats()
  }, [service])

  const getContext = React.useCallback(() => {
    if (!service) {
      throw new Error('Memory service not initialized')
    }
    return service.getMemoryContext()
  }, [service])

  const subscribe = React.useCallback(
    (eventType: string, listener: (event: MemoryEvent) => void) => {
      if (!service) {
        return () => {}
      }
      
      service.on(eventType, listener)
      
      return () => {
        service.off(eventType, listener)
      }
    },
    [service]
  )

  const value: MemoryContextValue = {
    service,
    isInitialized,
    addMemory,
    query,
    updateMemory,
    deleteMemory,
    promoteMemory,
    compressMemory,
    getStats,
    getContext,
    subscribe,
  }

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>
}

/**
 * Use Memory Hook
 */
export function useMemory(): MemoryContextValue {
  const context = React.useContext(MemoryContext)
  
  if (!context) {
    throw new Error('useMemory must be used within a MemoryProvider')
  }
  
  return context
}

/**
 * Use Memory Query Hook
 */
export function useMemoryQuery(
  query: MemoryQuery,
  options: {
    enabled?: boolean
    refetchInterval?: number
  } = {}
): {
  data: MemorySearchResult[]
  isLoading: boolean
  error: Error | null
  refetch: () => Promise<void>
} {
  const { query: queryMemory } = useMemory()
  const [data, setData] = React.useState<MemorySearchResult[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const refetch = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const results = await queryMemory(query)
      setData(results)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoading(false)
    }
  }, [query, queryMemory])

  React.useEffect(() => {
    if (options.enabled !== false) {
      refetch()
    }
  }, [query, refetch, options.enabled])

  React.useEffect(() => {
    if (options.refetchInterval) {
      const interval = setInterval(refetch, options.refetchInterval)
      return () => clearInterval(interval)
    }
  }, [options.refetchInterval, refetch])

  return { data, isLoading, error, refetch }
}

/**
 * Use Memory Stats Hook
 */
export function useMemoryStats(refreshInterval?: number): {
  stats: MemoryStats
  refresh: () => void
} {
  const { getStats } = useMemory()
  const [stats, setStats] = React.useState<MemoryStats>(getStats())

  const refresh = React.useCallback(() => {
    setStats(getStats())
  }, [getStats])

  React.useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(refresh, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [refreshInterval, refresh])

  return { stats, refresh }
}

/**
 * Use Memory Events Hook
 */
export function useMemoryEvents(
  eventType: string,
  handler: (event: MemoryEvent) => void
): void {
  const { subscribe } = useMemory()

  React.useEffect(() => {
    const unsubscribe = subscribe(eventType, handler)
    return unsubscribe
  }, [eventType, handler, subscribe])
}

/**
 * Use Conversation Memory Hook
 * High-level hook for managing conversation memory
 */
export function useConversationMemory(options: {
  userId?: string
  threadId?: string
  sessionId?: string
  autoCapture?: boolean
} = {}) {
  const { addMemory, query, getContext } = useMemory()
  const [context, setContext] = React.useState<MemoryContext | null>(null)

  // Update context periodically
  React.useEffect(() => {
    const updateContext = () => {
      try {
        setContext(getContext())
      } catch (err) {
        // Service not initialized yet
      }
    }

    updateContext()
    const interval = setInterval(updateContext, 10000) // Every 10s
    return () => clearInterval(interval)
  }, [getContext])

  /**
   * Capture message as memory
   */
  const captureMessage = React.useCallback(
    async (
      content: string,
      role: 'user' | 'assistant',
      metadata: Record<string, any> = {}
    ) => {
      const memoryMetadata = {
        ...metadata,
        role,
        userId: options.userId,
        threadId: options.threadId,
        sessionId: options.sessionId,
      }

      return addMemory(
        content,
        'episodic',
        'session',
        memoryMetadata,
        {
          priority: 'medium',
          confidence: 0.8,
        }
      )
    },
    [addMemory, options.userId, options.threadId, options.sessionId]
  )

  /**
   * Capture user preference
   */
  const capturePreference = React.useCallback(
    async (
      key: string,
      value: string,
      metadata: Record<string, any> = {}
    ) => {
      return addMemory(
        `User preference: ${key} = ${value}`,
        'semantic',
        'global',
        {
          ...metadata,
          preferenceKey: key,
          preferenceValue: value,
          userId: options.userId,
        },
        {
          priority: 'high',
          confidence: 0.9,
        }
      )
    },
    [addMemory, options.userId]
  )

  /**
   * Get relevant memories for current context
   */
  const getRelevantMemories = React.useCallback(
    async (queryText: string, limit: number = 5) => {
      return query({
        query: queryText,
        limit,
        userId: options.userId,
        threadId: options.threadId,
        sessionId: options.sessionId,
        minConfidence: 0.5,
      })
    },
    [query, options.userId, options.threadId, options.sessionId]
  )

  /**
   * Get recent conversation history
   */
  const getRecentHistory = React.useCallback(
    async (limit: number = 10) => {
      return query({
        types: ['episodic'],
        scopes: ['session'],
        limit,
        userId: options.userId,
        threadId: options.threadId,
        sessionId: options.sessionId,
      })
    },
    [query, options.userId, options.threadId, options.sessionId]
  )

  /**
   * Get user preferences
   */
  const getPreferences = React.useCallback(
    async () => {
      return query({
        types: ['semantic'],
        scopes: ['global', 'user'],
        userId: options.userId,
      })
    },
    [query, options.userId]
  )

  return {
    context,
    captureMessage,
    capturePreference,
    getRelevantMemories,
    getRecentHistory,
    getPreferences,
  }
}

/**
 * Use Memory Token Optimization Hook
 */
export function useMemoryTokenOptimization(options: {
  systemPrompt: string
  userPreferences?: Record<string, any>
  recentMessages?: string[]
  includeSemanticMemory?: boolean
  includeEpisodicMemory?: boolean
}) {
  const { service, query, getContext } = useMemory()
  const [optimizedContext, setOptimizedContext] = React.useState<any>(null)
  const [isOptimizing, setIsOptimizing] = React.useState(false)

  const optimize = React.useCallback(async () => {
    if (!service) return

    setIsOptimizing(true)

    try {
      const optimizer = service.getOptimizer()
      const memoryContext = getContext()

      // Get semantic and episodic memories
      const semanticMemories = options.includeSemanticMemory
        ? (await query({ types: ['semantic'], limit: 20 })).map(r => r.memory)
        : []

      const episodicMemories = options.includeEpisodicMemory
        ? (await query({ types: ['episodic'], limit: 20 })).map(r => r.memory)
        : []

      const result = optimizer.optimizeContext({
        systemPrompt: options.systemPrompt,
        userPreferences: options.userPreferences || {},
        recentMessages: options.recentMessages || [],
        semanticMemories,
        episodicMemories,
        context: memoryContext,
      })

      setOptimizedContext(result)
    } catch (err) {
      console.error('Optimization failed:', err)
    } finally {
      setIsOptimizing(false)
    }
  }, [service, query, getContext, options])

  React.useEffect(() => {
    optimize()
  }, [
    options.systemPrompt,
    options.userPreferences,
    options.recentMessages,
    options.includeSemanticMemory,
    options.includeEpisodicMemory,
  ])

  return {
    optimizedContext,
    isOptimizing,
    reoptimize: optimize,
  }
}
