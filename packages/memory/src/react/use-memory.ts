/**
 * Clarity Memory - React Hook
 * 
 * React hook for using Clarity Memory in React components
 * 
 * Note: This module requires React to be installed. It's exported conditionally.
 */

// @ts-ignore - React is a peer dependency, types may not be available
import { useState, useEffect, useCallback, useRef } from 'react'
import type { ClarityMemory } from '../core/memory'
import type {
  MemoryItem,
  MemoryConfig,
  ContextBundle,
  SearchOptions,
  RecallOptions,
  AddMemoryOptions,
} from '../core/types'
import { clarityMemory } from '../clarity-memory'

/**
 * React hook for Clarity Memory
 * 
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const memory = useMemory({ userId: 'user-123' })
 *   const [context, setContext] = useState<ContextBundle | null>(null)
 *   
 *   useEffect(() => {
 *     async function loadContext() {
 *       const ctx = await memory.recall("user preferences")
 *       setContext(ctx)
 *     }
 *     loadContext()
 *   }, [memory])
 *   
 *   return <div>{context?.toPrompt()}</div>
 * }
 * ```
 */
export function useMemory(config?: MemoryConfig) {
  const memoryRef = useRef<ClarityMemory | null>(null)
  
  if (!memoryRef.current) {
    memoryRef.current = clarityMemory(config)
  }
  
  return memoryRef.current
}

/**
 * Hook for managing a single memory item
 */
export function useMemoryItem(id: string | null, memory: ClarityMemory) {
  const [item, setItem] = useState<MemoryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!id || !memory) {
      setItem(null)
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      if (!id) {
        setItem(null)
        setLoading(false)
        return
      }
      
      try {
        setLoading(true)
        setError(null)
        const result = await memory.get(id)
        if (!cancelled) {
          setItem(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [id, memory])

  return { item, loading, error }
}

/**
 * Hook for searching memories
 */
export function useMemorySearch(
  query: string,
  options: SearchOptions = {},
  memory: ClarityMemory
) {
  const [results, setResults] = useState<MemoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query || !query.trim()) {
      setResults([])
      return
    }

    let cancelled = false

    async function search() {
      try {
        setLoading(true)
        setError(null)
        const result = await memory.search(query, options)
        if (!cancelled) {
          setResults(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    search()

    return () => {
      cancelled = true
    }
  }, [query, JSON.stringify(options), memory])

  return { results, loading, error }
}

/**
 * Hook for recalling context
 */
export function useMemoryRecall(
  query: string,
  options: RecallOptions = {},
  memory: ClarityMemory
) {
  const [context, setContext] = useState<ContextBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query || !query.trim()) {
      setContext(null)
      return
    }

    let cancelled = false

    async function recall() {
      try {
        setLoading(true)
        setError(null)
        const result = await memory.recall(query, options)
        if (!cancelled) {
          setContext(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    recall()

    return () => {
      cancelled = true
    }
  }, [query, JSON.stringify(options), memory])

  return { context, loading, error }
}

/**
 * Hook for memory statistics
 */
export function useMemoryStats(memory: ClarityMemory) {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        setLoading(true)
        setError(null)
        const result = await memory.stats()
        if (!cancelled) {
          setStats(result)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'))
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadStats()

    return () => {
      cancelled = true
    }
  }, [memory])

  const refresh = useCallback(() => {
    async function reload() {
      try {
        setLoading(true)
        setError(null)
        const result = await memory.stats()
        setStats(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setLoading(false)
      }
    }
    reload()
  }, [memory])

  return { stats, loading, error, refresh }
}

/**
 * Hook for adding memories with optimistic updates
 */
export function useAddMemory(memory: ClarityMemory) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const add = useCallback(async (
    content: string,
    options?: AddMemoryOptions
  ): Promise<MemoryItem | null> => {
    try {
      setLoading(true)
      setError(null)
      const result = await memory.add(content, options)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [memory])

  return { add, loading, error }
}
