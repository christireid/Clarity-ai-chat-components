/**
 * React Hook for Clarity Memory
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ClarityMemory } from '../memory-service'
import type {
  MemoryConfig,
  Memory,
  SearchResult,
  ContextBundle,
} from '../types'

export interface UseMemoryOptions extends MemoryConfig {
  autoInitialize?: boolean
}

/** Decay statistics for memory health monitoring */
export interface DecayStats {
  total: number
  healthy: number
  atRisk: number
  expiring: number
  expired: number
  byAction: { keep: number; compress: number; delete: number }
  averageDecayScore: number
}

export interface UseMemoryReturn {
  memory: ClarityMemory | null
  initialized: boolean
  loading: boolean
  error: Error | null

  // Memory operations
  add: (
    content: string,
    options?: Parameters<ClarityMemory['add']>[1]
  ) => Promise<string>
  recall: (
    query: string,
    options?: Parameters<ClarityMemory['recall']>[1]
  ) => Promise<SearchResult[]>
  context: (
    options?: Parameters<ClarityMemory['context']>[0]
  ) => Promise<ContextBundle>
  get: (id: string) => Promise<Memory | null>
  update: (id: string, updates: Partial<Memory>) => Promise<void>
  promote: (id: string) => Promise<void>
  compress: (id: string) => Promise<void>
  forget: (id: string) => Promise<boolean>
  flush: () => Promise<void>

  // Stats
  stats: Awaited<ReturnType<ClarityMemory['getStats']>> | null
  /** Decay statistics for monitoring memory health */
  decayStats: DecayStats | null
  /** Manually trigger decay evaluation */
  runDecay: () => Promise<void>

  // Utilities
  initialize: () => Promise<void>
  close: () => Promise<void>
}

/**
 * React hook for using Clarity Memory
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { add, recall, context, initialized } = useMemory({
 *     userId: 'user123',
 *     embeddingProvider: {
 *       provider: 'openai',
 *       apiKey: process.env.OPENAI_API_KEY,
 *     },
 *   })
 *
 *   const handleMessage = async (text: string) => {
 *     await add(text, { type: 'episodic', scope: 'session' })
 *     const results = await recall(text)
 *     const ctx = await context({ maxTokens: 2000 })
 *   }
 *
 *   return <div>...</div>
 * }
 * ```
 */
export function useMemory(options?: UseMemoryOptions): UseMemoryReturn {
  const [memory, setMemory] = useState<ClarityMemory | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [stats, setStats] = useState<Awaited<
    ReturnType<ClarityMemory['getStats']>
  > | null>(null)
  const [decayStats, setDecayStats] = useState<DecayStats | null>(null)

  const memoryRef = useRef<ClarityMemory | null>(null)

  // Initialize memory instance
  useEffect(() => {
    if (!memoryRef.current) {
      // @ts-expect-error - UseMemoryOptions extends MemoryConfig with smart defaults
      const mem = new ClarityMemory(options)
      memoryRef.current = mem
      setMemory(mem)
    }

    return () => {
      // Cleanup on unmount
      memoryRef.current?.close().catch(console.error)
    }
  }, []) // Only create once

  // Auto-initialize if enabled
  useEffect(() => {
    if (options?.autoInitialize !== false && memory && !initialized) {
      initialize()
    }
  }, [memory, initialized, options?.autoInitialize])

  const initialize = useCallback(async () => {
    if (!memory || initialized) return

    setLoading(true)
    setError(null)

    try {
      await memory.initialize()
      setInitialized(true)

      // Load initial stats
      const initialStats = await memory.getStats()
      setStats(initialStats)

      // Load decay stats if available
      const initialDecayStats = memory.getDecayStats?.()
      if (initialDecayStats) {
        setDecayStats(initialDecayStats)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [memory, initialized])

  const add = useCallback(
    async (content: string, opts?: Parameters<ClarityMemory['add']>[1]) => {
      if (!memory) throw new Error('Memory not initialized')
      const result = await memory.add(content, opts)
      // Refresh stats
      const newStats = await memory.getStats()
      setStats(newStats)
      return result
    },
    [memory]
  )

  const recall = useCallback(
    async (query: string, opts?: Parameters<ClarityMemory['recall']>[1]) => {
      if (!memory) throw new Error('Memory not initialized')
      return memory.recall(query, opts)
    },
    [memory]
  )

  const context = useCallback(
    async (opts?: Parameters<ClarityMemory['context']>[0]) => {
      if (!memory) throw new Error('Memory not initialized')
      return memory.context(opts)
    },
    [memory]
  )

  const get = useCallback(
    async (id: string) => {
      if (!memory) throw new Error('Memory not initialized')
      return memory.get(id)
    },
    [memory]
  )

  const update = useCallback(
    async (id: string, updates: Partial<Memory>) => {
      if (!memory) throw new Error('Memory not initialized')
      const result = await memory.update(id, updates)
      // Refresh stats
      const newStats = await memory.getStats()
      setStats(newStats)
      return result
    },
    [memory]
  )

  const promote = useCallback(
    async (id: string) => {
      if (!memory) throw new Error('Memory not initialized')
      await memory.promote(id)
      // Refresh stats
      const newStats = await memory.getStats()
      setStats(newStats)
    },
    [memory]
  )

  const compress = useCallback(
    async (id: string) => {
      if (!memory) throw new Error('Memory not initialized')
      await memory.compress(id)
      // Refresh stats
      const newStats = await memory.getStats()
      setStats(newStats)
    },
    [memory]
  )

  const forget = useCallback(
    async (id: string) => {
      if (!memory) throw new Error('Memory not initialized')
      const result = await memory.forget(id)
      // Refresh stats
      const newStats = await memory.getStats()
      setStats(newStats)
      return result
    },
    [memory]
  )

  const flush = useCallback(async () => {
    if (!memory) throw new Error('Memory not initialized')
    await memory.flush()
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
  }, [memory])

  const close = useCallback(async () => {
    if (!memory) return
    await memory.close()
    setInitialized(false)
  }, [memory])

  const runDecay = useCallback(async () => {
    if (!memory) throw new Error('Memory not initialized')
    if (!memory.runDecay) return // Decay not supported

    await memory.runDecay()

    // Refresh both stats after decay
    const newStats = await memory.getStats()
    setStats(newStats)

    const newDecayStats = memory.getDecayStats?.()
    if (newDecayStats) {
      setDecayStats(newDecayStats)
    }
  }, [memory])

  return {
    memory,
    initialized,
    loading,
    error,
    add,
    recall,
    context,
    get,
    update,
    promote,
    compress,
    forget,
    flush,
    stats,
    decayStats,
    runDecay,
    initialize,
    close,
  }
}