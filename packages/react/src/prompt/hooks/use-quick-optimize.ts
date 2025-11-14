/**
 * useQuickOptimize Hook
 * 
 * Simplest possible hook for prompt optimization - zero configuration needed
 */

import { useState, useEffect, useCallback } from 'react'
import type { CoreMessage } from '../../hooks/use-chat-enhanced'
import { quickOptimizeMessages, needsOptimization } from '../core/quick-start'
import type { ModelProfile } from '../core/model-profiles'

export interface UseQuickOptimizeOptions {
  /** Messages to optimize */
  messages: CoreMessage[]
  /** Model name or profile (defaults to 'gpt-4') */
  model?: ModelProfile | string
  /** Target tokens (defaults to 80% of model max) */
  targetTokens?: number
  /** Preset to use (defaults to 'balanced') */
  preset?: 'conservative' | 'balanced' | 'aggressive' | 'costOptimized' | 'qualityFirst'
  /** Whether to auto-optimize (defaults to true) */
  autoOptimize?: boolean
  /** Summarization function (optional) */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string>
}

export interface UseQuickOptimizeReturn {
  /** Optimized messages */
  optimizedMessages: CoreMessage[]
  /** Whether optimization was applied */
  wasOptimized: boolean
  /** Token statistics */
  tokenStats: {
    original: number
    optimized: number
    saved: number
  }
  /** Whether optimization is in progress */
  isOptimizing: boolean
  /** Error if optimization failed */
  error: Error | null
  /** Manually trigger optimization */
  optimize: () => Promise<void>
}

/**
 * Simplest hook for prompt optimization
 * 
 * @example
 * ```tsx
 * const { optimizedMessages } = useQuickOptimize({
 *   messages: chatMessages,
 *   model: 'gpt-4',
 * })
 * ```
 */
export function useQuickOptimize(
  options: UseQuickOptimizeOptions
): UseQuickOptimizeReturn {
  const {
    messages,
    model = 'gpt-4',
    targetTokens,
    preset = 'balanced',
    autoOptimize = true,
    summarizeFn,
  } = options

  const [optimizedMessages, setOptimizedMessages] = useState<CoreMessage[]>(messages)
  const [wasOptimized, setWasOptimized] = useState(false)
  const [tokenStats, setTokenStats] = useState({
    original: 0,
    optimized: 0,
    saved: 0,
  })
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const optimize = useCallback(async () => {
    if (messages.length === 0) {
      setOptimizedMessages([])
      setWasOptimized(false)
      return
    }

    // Check if optimization is needed
    const needsOpt = needsOptimization(messages, model, targetTokens)
    if (!needsOpt) {
      setOptimizedMessages(messages)
      setWasOptimized(false)
      setTokenStats({
        original: 0,
        optimized: 0,
        saved: 0,
      })
      return
    }

    setIsOptimizing(true)
    setError(null)

    try {
      const result = await quickOptimizeMessages(messages, model, {
        targetTokens,
        preset,
        summarizeFn,
      })

      setOptimizedMessages(result.messages)
      setWasOptimized(true)
      setTokenStats({
        original: result.tokenStats.original,
        optimized: result.tokenStats.optimized,
        saved: result.tokenStats.saved,
      })
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setError(error)
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        console.error('[useQuickOptimize] Optimization failed:', error)
      }
      // Fallback to original messages
      setOptimizedMessages(messages)
      setWasOptimized(false)
    } finally {
      setIsOptimizing(false)
    }
  }, [messages, model, targetTokens, preset, summarizeFn])

  // Auto-optimize when messages change
  useEffect(() => {
    if (autoOptimize) {
      optimize()
    }
  }, [autoOptimize, optimize])

  return {
    optimizedMessages,
    wasOptimized,
    tokenStats,
    isOptimizing,
    error,
    optimize,
  }
}
