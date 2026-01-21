/**
 * useTokenCounter - Model-aware token counting
 *
 * @deprecated This hook is deprecated in favor of useTokenCounter from clarity-tokens.
 * It now uses @clarity-chat/token-optimization internally for better accuracy.
 *
 * Migration path:
 * ```typescript
 * // Old
 * import { useTokenCounter } from '@clarity-chat/react/hooks/token'
 *
 * // New (recommended)
 * import { useTokenCounter } from '@clarity-chat/react/hooks/clarity-tokens'
 * ```
 *
 * Features:
 * - Accurate token counting using @clarity-chat/token-optimization
 * - Model-aware encoding
 * - Cached encoder instances
 * - Backward compatible API
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

// Types
export type TokenEncoding = 'cl100k_base' | 'o200k_base'

export interface UseTokenCounterOptions {
  /** Which encoding to use */
  encoding?: TokenEncoding
  /** Whether to preload the encoder on mount */
  preload?: boolean
}

export interface UseTokenCounterReturn {
  /** Count tokens in a string */
  countTokens: (text: string) => number
  /** Count tokens in messages (includes per-message overhead) */
  countMessagesTokens: (
    messages: Array<{ role: string; content: string }>
  ) => number
  /** Whether the encoder is loaded and ready */
  isReady: boolean
  /** Loading state */
  isLoading: boolean
  /** Error if loading failed */
  error: Error | null
}

// Encoding to model mapping for token-optimization
const ENCODING_TO_MODEL: Record<TokenEncoding, string> = {
  cl100k_base: 'gpt-4',
  o200k_base: 'gpt-4o',
}

// Model to encoding mapping (for backward compatibility)
const MODEL_ENCODINGS: Record<string, TokenEncoding> = {
  'gpt-4o': 'o200k_base',
  'gpt-4o-mini': 'o200k_base',
  'gpt-4': 'cl100k_base',
  'gpt-4-turbo': 'cl100k_base',
  'gpt-3.5-turbo': 'cl100k_base',
  'claude-3': 'cl100k_base',
  'claude-3.5': 'cl100k_base',
}

// Per-message overhead tokens
const MESSAGE_OVERHEAD = 4

/**
 * useTokenCounter - Token counting using @clarity-chat/token-optimization
 *
 * @deprecated Use useTokenCounter from clarity-tokens for better features
 */
export function useTokenCounter(
  options: UseTokenCounterOptions = {}
): UseTokenCounterReturn {
  const { encoding = 'cl100k_base', preload = true } = options

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const counterRef = useRef<AccurateTokenCounter | null>(null)

  // Initialize encoder using token-optimization package
  useEffect(() => {
    if (!preload) {
      setIsReady(true) // Ready immediately if not preloading
      return
    }

    let cancelled = false
    setIsLoading(true)
    setError(null)

    try {
      // Create AccurateTokenCounter with appropriate model
      const model = ENCODING_TO_MODEL[encoding]
      counterRef.current = new AccurateTokenCounter({
        model,
        enableCaching: true,
        cacheSize: 1000,
      })

      if (!cancelled) {
        setIsReady(true)
        setIsLoading(false)
      }
    } catch (err) {
      if (!cancelled) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setIsLoading(false)
      }
    }

    return () => {
      cancelled = true
      if (counterRef.current) {
        counterRef.current.destroy()
      }
    }
  }, [encoding, preload])

  // Count tokens in text using token-optimization
  const countTokens = useCallback((text: string): number => {
    if (counterRef.current) {
      return counterRef.current.count(text)
    }
    // Fallback: rough estimate (4 chars per token average)
    return Math.ceil(text.length / 4)
  }, [])

  // Count tokens in messages
  const countMessagesTokens = useCallback(
    (messages: Array<{ role: string; content: string }>): number => {
      if (counterRef.current) {
        // Use the built-in countChat method if available
        return counterRef.current.countChat(
          messages.map((msg) => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content,
          }))
        )
      }

      // Fallback implementation
      const contentTokens = messages.reduce((sum, msg) => {
        return sum + countTokens(msg.content)
      }, 0)

      const overheadTokens = messages.length * MESSAGE_OVERHEAD

      return contentTokens + overheadTokens
    },
    [countTokens]
  )

  return {
    countTokens,
    countMessagesTokens,
    isReady,
    isLoading,
    error,
  }
}

/**
 * Get the appropriate encoding for a model
 */
export function getEncodingForModel(model: string): TokenEncoding {
  if (model in MODEL_ENCODINGS) {
    return MODEL_ENCODINGS[model]
  }

  for (const [prefix, encoding] of Object.entries(MODEL_ENCODINGS)) {
    if (model.startsWith(prefix)) {
      return encoding
    }
  }

  return 'cl100k_base'
}

/**
 * Preload an encoding without using the hook
 * @deprecated This function is no longer needed with AccurateTokenCounter
 */
export function preloadEncoding(encoding: TokenEncoding): Promise<void> {
  // No-op: AccurateTokenCounter handles loading internally
  return Promise.resolve()
}
