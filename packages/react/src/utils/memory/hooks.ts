/**
 * React Hooks for Memory Management
 * 
 * Provides convenient React hooks for integrating memory functionality
 * into chat components.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import type {
  MemoryItem,
  MemoryRetrievalOptions,
  MemoryStorageOptions,
  MemoryStats,
} from './types'
import { MemoryService, type MemoryServiceConfig } from './memory-service'
import { estimateTokens } from './prompt-compression'

/**
 * Hook for managing memory service instance
 */
export function useMemoryService(config?: Partial<MemoryServiceConfig>) {
  const service = useMemo(() => {
    return new MemoryService({
      maxRealTimeTokens: config?.maxRealTimeTokens ?? 100,
      maxSessionTokens: config?.maxSessionTokens ?? 500,
      enableCompression: config?.enableCompression ?? true,
      compressionThreshold: config?.compressionThreshold ?? 20,
      vectorStore: config?.vectorStore,
      countTokens: config?.countTokens ?? estimateTokens,
    })
  }, [
    config?.maxRealTimeTokens,
    config?.maxSessionTokens,
    config?.enableCompression,
    config?.compressionThreshold,
    config?.vectorStore,
    config?.countTokens,
  ])

  return service
}

/**
 * Hook for retrieving and managing memories
 */
export function useMemories(
  userId: string,
  options?: Partial<MemoryRetrievalOptions>
) {
  const service = useMemoryService()
  const [memories, setMemories] = useState<MemoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [
    options?.limit,
    options?.scope,
    options?.type,
    options?.minImportanceScore,
  ])

  const retrieve = useCallback(
    async (retrievalOptions?: Partial<MemoryRetrievalOptions>) => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await service.retrieveMemories({
          userId,
          ...memoizedOptions,
          ...retrievalOptions,
        })
        setMemories(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to retrieve memories'))
      } finally {
        setIsLoading(false)
      }
    },
    [service, userId, memoizedOptions]
  )

  useEffect(() => {
    retrieve()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]) // Only re-fetch when userId changes

  const store = useCallback(
    async (
      memory: Omit<MemoryItem, 'id' | 'lastUpdated'>,
      storageOptions?: MemoryStorageOptions
    ) => {
      setIsLoading(true)
      setError(null)

      try {
        const stored = await service.storeMemory(memory, storageOptions)
        await retrieve() // Refresh memories
        return stored
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to store memory'))
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [service, retrieve]
  )

  const remove = useCallback(
    async (memoryId: string) => {
      setIsLoading(true)
      setError(null)

      try {
        // Note: Requires vector store delete method if long-term memory
        // For now, just refresh to exclude it
        await retrieve()
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to remove memory'))
      } finally {
        setIsLoading(false)
      }
    },
    [retrieve]
  )

  const clear = useCallback(() => {
    service.clearUserMemories(userId)
    setMemories([])
  }, [service, userId])

  return {
    memories,
    isLoading,
    error,
    retrieve,
    store,
    remove,
    clear,
  }
}

/**
 * Hook for memory statistics
 */
export function useMemoryStats(userId: string) {
  const service = useMemoryService()
  const [stats, setStats] = useState<MemoryStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(() => {
    setIsLoading(true)
    try {
      const newStats = service.getStats(userId)
      setStats(newStats)
    } catch (err) {
      console.error('Failed to get memory stats:', err)
    } finally {
      setIsLoading(false)
    }
  }, [service, userId])

  useEffect(() => {
    refresh()
  }, [refresh])

  return {
    stats,
    isLoading,
    refresh,
  }
}

/**
 * Hook for storing memories from conversation
 */
export function useMemoryStorage(userId: string) {
  const { store, isLoading, error } = useMemories(userId)

  const storeFromMessage = useCallback(
    async (
      message: { role: 'user' | 'assistant'; content: string },
      options?: {
        scope?: 'session' | 'thread' | 'global'
        type?: 'episodic' | 'semantic' | 'preference' | 'fact' | 'behavior'
        importanceScore?: number
        promoteToGlobal?: boolean
      }
    ) => {
      return store(
        {
          userId,
          label: `${message.role} message`,
          value: message.content,
          scope: options?.scope ?? 'session',
          type: options?.type ?? 'episodic',
          layer: options?.scope === 'session' ? 'real-time' : options?.scope === 'thread' ? 'session' : 'semantic',
          importanceScore: options?.importanceScore,
          tokens: estimateTokens(message.content),
        },
        {
          userId,
          promoteToGlobal: options?.promoteToGlobal,
        }
      )
    },
    [store, userId]
  )

  return {
    store: storeFromMessage,
    isLoading,
    error,
  }
}
