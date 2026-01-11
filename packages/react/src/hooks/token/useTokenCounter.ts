/**
 * useTokenCounter - Lazy-loaded, model-aware token counting
 *
 * Features:
 * - CDN-loaded encodings (zero bundle impact)
 * - Cached encoder instances
 * - Sync fallback during loading
 * - Multiple encoding support
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

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

// CDN URLs for encodings
const ENCODING_CDN: Record<TokenEncoding, string> = {
  cl100k_base: 'https://tiktoken.pages.dev/js/cl100k_base.json',
  o200k_base: 'https://tiktoken.pages.dev/js/o200k_base.json',
}

// Model to encoding mapping
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

// Encoder cache
interface TiktokenEncoder {
  encode: (text: string) => number[]
  decode: (tokens: number[]) => string
}

const encoderCache = new Map<TokenEncoding, Promise<TiktokenEncoder>>()

async function loadEncoder(encoding: TokenEncoding): Promise<TiktokenEncoder> {
  const cached = encoderCache.get(encoding)
  if (cached) return cached

  const loadPromise = (async () => {
    const { Tiktoken } = await import('js-tiktoken/lite')
    const response = await fetch(ENCODING_CDN[encoding])

    if (!response.ok) {
      throw new Error(`Failed to load encoding: ${response.statusText}`)
    }

    const encodingData = await response.json()
    return new Tiktoken(encodingData) as TiktokenEncoder
  })()

  encoderCache.set(encoding, loadPromise)
  return loadPromise
}

/**
 * useTokenCounter - Lazy-loaded token counting with CDN-based encodings
 */
export function useTokenCounter(
  options: UseTokenCounterOptions = {}
): UseTokenCounterReturn {
  const { encoding = 'cl100k_base', preload = true } = options

  const [isReady, setIsReady] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const encoderRef = useRef<TiktokenEncoder | null>(null)

  // Load encoder on mount if preload is true
  useEffect(() => {
    if (!preload) return

    let cancelled = false
    setIsLoading(true)
    setError(null)

    loadEncoder(encoding)
      .then((encoder) => {
        if (!cancelled) {
          encoderRef.current = encoder
          setIsReady(true)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [encoding, preload])

  // Count tokens in text
  const countTokens = useCallback((text: string): number => {
    if (encoderRef.current) {
      return encoderRef.current.encode(text).length
    }
    // Fallback: rough estimate (4 chars per token average)
    return Math.ceil(text.length / 4)
  }, [])

  // Count tokens in messages
  const countMessagesTokens = useCallback(
    (messages: Array<{ role: string; content: string }>): number => {
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
 */
export function preloadEncoding(encoding: TokenEncoding): Promise<void> {
  return loadEncoder(encoding).then(() => undefined)
}
