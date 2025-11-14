/**
 * React Hook for Clarity Memory
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ClarityMemory } from '../core/clarity-memory'
import type { MemoryConfig, Memory, SearchResult, ContextBundle } from '../core/types'

export interface UseMemoryOptions extends MemoryConfig {
  autoInitialize?: boolean
}

export interface UseMemoryReturn {
  memory: ClarityMemory | null
  initialized: boolean
  loading: boolean
  error: Error | null
  
  // Memory operations
  add: (content: string, options?: Parameters<ClarityMemory['add']>[1]) => Promise<Memory>
  recall: (query: string, options?: Parameters<ClarityMemory['recall']>[1]) => Promise<SearchResult[]>
  context: (options?: Parameters<ClarityMemory['context']>[0]) => Promise<ContextBundle>
  get: (id: string) => Promise<Memory | null>
  update: (id: string, updates: Partial<Memory>) => Promise<Memory>
  promote: (id: string, scope: Parameters<ClarityMemory['promote']>[1]) => Promise<Memory>
  compress: (id: string, ratio?: number) => Promise<Memory>
  forget: (id: string, soft?: boolean) => Promise<void>
  flush: (options?: Parameters<ClarityMemory['flush']>[0]) => Promise<void>
  
  // Stats
  stats: Awaited<ReturnType<ClarityMemory['getStats']>> | null
  
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
  const [stats, setStats] = useState<Awaited<ReturnType<ClarityMemory['getStats']>> | null>(null)
  
  const memoryRef = useRef<ClarityMemory | null>(null)

  // Initialize memory instance
  useEffect(() => {
    if (!memoryRef.current) {
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
    } finally {
      setLoading(false)
    }
  }, [memory, initialized])

  const add = useCallback(async (
    content: string,
    opts?: Parameters<ClarityMemory['add']>[1]
  ) => {
    if (!memory) throw new Error('Memory not initialized')
    const result = await memory.add(content, opts)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
    return result
  }, [memory])

  const recall = useCallback(async (
    query: string,
    opts?: Parameters<ClarityMemory['recall']>[1]
  ) => {
    if (!memory) throw new Error('Memory not initialized')
    return memory.recall(query, opts)
  }, [memory])

  const context = useCallback(async (
    opts?: Parameters<ClarityMemory['context']>[0]
  ) => {
    if (!memory) throw new Error('Memory not initialized')
    return memory.context(opts)
  }, [memory])

  const get = useCallback(async (id: string) => {
    if (!memory) throw new Error('Memory not initialized')
    return memory.get(id)
  }, [memory])

  const update = useCallback(async (id: string, updates: Partial<Memory>) => {
    if (!memory) throw new Error('Memory not initialized')
    const result = await memory.update(id, updates)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
    return result
  }, [memory])

  const promote = useCallback(async (
    id: string,
    scope: Parameters<ClarityMemory['promote']>[1]
  ) => {
    if (!memory) throw new Error('Memory not initialized')
    const result = await memory.promote(id, scope)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
    return result
  }, [memory])

  const compress = useCallback(async (id: string, ratio?: number) => {
    if (!memory) throw new Error('Memory not initialized')
    const result = await memory.compress(id, ratio)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
    return result
  }, [memory])

  const forget = useCallback(async (id: string, soft?: boolean) => {
    if (!memory) throw new Error('Memory not initialized')
    await memory.forget(id, soft)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
  }, [memory])

  const flush = useCallback(async (
    opts?: Parameters<ClarityMemory['flush']>[0]
  ) => {
    if (!memory) throw new Error('Memory not initialized')
    await memory.flush(opts)
    // Refresh stats
    const newStats = await memory.getStats()
    setStats(newStats)
  }, [memory])

  const close = useCallback(async () => {
    if (!memory) return
    await memory.close()
    setInitialized(false)
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
    initialize,
    close,
  }
}
