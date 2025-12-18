/**
 * useMemoryStore - Top-level hook for memory management
 *
 * Drop-in ready hook for conversation memory with sensible defaults.
 * Wraps the memory system with a simple, ergonomic API.
 *
 * @example
 * ```tsx
 * const memory = useMemoryStore({ enabled: true })
 *
 * // Memory is automatically integrated with chat
 * <ClarityChat api="/api/chat" memory={memory.config} />
 * ```
 */

'use client'

import * as React from 'react'
import {
  useMemory,
  type MemoryContextValue,
} from '../../memory/memory-provider'
import type { MemoryType, MemoryScope } from '@clarity-chat/memory'

/**
 * Options for useMemoryStore
 */
export interface UseMemoryStoreOptions {
  /** Enable memory (default: false) */
  enabled?: boolean
  /** Memory strategy */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Memory scope */
  scope?: MemoryScope
}

/**
 * Return type for useMemoryStore
 */
export interface UseMemoryStoreReturn {
  /** Whether memory is enabled */
  enabled: boolean
  /** Memory service instance */
  service: MemoryContextValue | null
  /** Configuration for useClarityChat */
  config: {
    enabled: boolean
    strategy?: UseMemoryStoreOptions['strategy']
    maxTokens?: number
  }
  /** Add a memory */
  addMemory: (
    content: string,
    type?: MemoryType,
    metadata?: Record<string, any>
  ) => Promise<void>
  /** Query memories */
  query: (query: string) => Promise<any[]>
  /** Clear memories */
  clear: () => Promise<void>
}

/**
 * useMemoryStore - Top-level memory hook
 *
 * Provides a simple API for memory management that integrates
 * seamlessly with ClarityChat.
 */
export function useMemoryStore(
  options: UseMemoryStoreOptions = {}
): UseMemoryStoreReturn {
  const {
    enabled = false,
    strategy = 'sliding-window',
    maxTokens,
    scope = 'session',
  } = options
  const memoryContext = useMemory()

  const addMemory = React.useCallback(
    async (
      content: string,
      type: MemoryType = 'episodic',
      metadata?: Record<string, any>
    ) => {
      if (!enabled || !memoryContext) return
      await memoryContext.addMemory(content, type, scope, metadata)
    },
    [enabled, memoryContext, scope]
  )

  const query = React.useCallback(
    async (query: string) => {
      if (!enabled || !memoryContext) return []
      const results = await memoryContext.query({ query, limit: 10 })
      return results
    },
    [enabled, memoryContext]
  )

  const clear = React.useCallback(async () => {
    if (!enabled || !memoryContext) return
    // Clear memories for current scope
    // Implementation depends on memory service API
  }, [enabled, memoryContext])

  return {
    enabled,
    service: memoryContext,
    config: {
      enabled,
      strategy,
      maxTokens,
    },
    addMemory,
    query,
    clear,
  }
}
