/**
 * Simple Token Count Hook
 *
 * The easiest way to count tokens in React. Just pass text, get a count.
 *
 * @module hooks/use-token-count
 *
 * @example Basic Usage
 * ```tsx
 * import { useTokenCount } from '@clarity-chat/token-optimization'
 *
 * function TokenCounter({ text }) {
 *   const { count, isLoading } = useTokenCount(text)
 *   return <span>{isLoading ? '...' : count} tokens</span>
 * }
 * ```
 *
 * @example With Model Override
 * ```tsx
 * const { count } = useTokenCount(text, { model: 'gpt-4o-mini' })
 * ```
 *
 * @example With Debouncing
 * ```tsx
 * const { count } = useTokenCount(text, { debounceMs: 300 })
 * ```
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { AccurateTokenCounter } from '../tokenizers/accurate-counter'
import { DEFAULT_MODEL, DEFAULT_DEBOUNCE_MS } from '../defaults'

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Options for useTokenCount hook.
 */
export interface UseTokenCountOptions {
  /**
   * Model to use for tokenization.
   * Different models have different tokenizers.
   * @default 'gpt-4o'
   */
  model?: string

  /**
   * Debounce delay in milliseconds.
   * Set to 0 to disable debouncing.
   * @default 150
   */
  debounceMs?: number

  /**
   * Enable or disable the hook.
   * Useful for conditional token counting.
   * @default true
   */
  enabled?: boolean
}

/**
 * Return type for useTokenCount hook.
 */
export interface UseTokenCountReturn {
  /**
   * The token count for the input text.
   * Returns 0 while loading or if text is empty.
   */
  count: number

  /**
   * Whether the count is currently being calculated.
   * True during debounce delay and during counting.
   */
  isLoading: boolean

  /**
   * Error if counting failed, undefined otherwise.
   */
  error: Error | undefined

  /**
   * Additional token information.
   * Includes character count, word count, and token ratio.
   */
  info: {
    /** Character count */
    characters: number
    /** Word count */
    words: number
    /** Characters per token ratio */
    ratio: number
  }

  /**
   * Force a recount immediately, bypassing debounce.
   */
  recount: () => void
}

// ═══════════════════════════════════════════════════════════════════════════
// HOOK IMPLEMENTATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Count tokens in text with React.
 *
 * This is the simplest way to count tokens. It handles:
 * - Automatic debouncing to avoid excessive re-renders
 * - Caching of token counts for performance
 * - Cleanup on unmount
 *
 * For more complex optimization (caching, compression, routing),
 * use {@link useTokenOptimization} instead.
 *
 * @param text - The text to count tokens for
 * @param options - Optional configuration
 * @returns Token count and related information
 *
 * @example Basic Usage
 * ```tsx
 * function MyComponent() {
 *   const [text, setText] = useState('')
 *   const { count, isLoading } = useTokenCount(text)
 *
 *   return (
 *     <div>
 *       <textarea value={text} onChange={e => setText(e.target.value)} />
 *       <span>{isLoading ? 'Counting...' : `${count} tokens`}</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * @example Show Warning at Threshold
 * ```tsx
 * function PromptEditor({ maxTokens = 4096 }) {
 *   const [text, setText] = useState('')
 *   const { count, isLoading } = useTokenCount(text)
 *   const isOverLimit = count > maxTokens
 *
 *   return (
 *     <div>
 *       <textarea value={text} onChange={e => setText(e.target.value)} />
 *       <span style={{ color: isOverLimit ? 'red' : 'inherit' }}>
 *         {count} / {maxTokens} tokens
 *       </span>
 *       {isOverLimit && <span>Reduce text to fit within limit</span>}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example With Model Selection
 * ```tsx
 * function ModelAwareCounter() {
 *   const [model, setModel] = useState('gpt-4o')
 *   const [text, setText] = useState('')
 *   const { count } = useTokenCount(text, { model })
 *
 *   return (
 *     <div>
 *       <select value={model} onChange={e => setModel(e.target.value)}>
 *         <option value="gpt-4o">GPT-4o</option>
 *         <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
 *         <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
 *       </select>
 *       <textarea value={text} onChange={e => setText(e.target.value)} />
 *       <span>{count} tokens for {model}</span>
 *     </div>
 *   )
 * }
 * ```
 *
 * @see useTokenBudget - For tracking against a budget with visual indicator
 * @see useTokenOptimization - For full optimization pipeline
 */
export function useTokenCount(
  text: string,
  options?: UseTokenCountOptions
): UseTokenCountReturn {
  const {
    model = DEFAULT_MODEL,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    enabled = true,
  } = options ?? {}

  // State
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [info, setInfo] = useState({ characters: 0, words: 0, ratio: 0 })

  // Refs
  const counterRef = useRef<AccurateTokenCounter | null>(null)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentModelRef = useRef(model)

  // Create or update counter when model changes
  useEffect(() => {
    if (currentModelRef.current !== model || !counterRef.current) {
      counterRef.current?.destroy()
      counterRef.current = new AccurateTokenCounter({
        model,
        enableCaching: true,
        enableMonitoring: false,
      })
      currentModelRef.current = model
    }

    return () => {
      counterRef.current?.destroy()
      counterRef.current = null
    }
  }, [model])

  // Count function
  const doCount = useCallback((textToCount: string) => {
    if (!counterRef.current) return

    try {
      setError(undefined)
      const tokenInfo = counterRef.current.getTokenInfo(textToCount)
      setCount(tokenInfo.tokens)
      setInfo({
        characters: tokenInfo.characters,
        words: tokenInfo.words,
        ratio: tokenInfo.ratio,
      })
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)))
      setCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Recount function (bypasses debounce)
  const recount = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }
    doCount(text)
  }, [text, doCount])

  // Effect to count tokens with debouncing
  useEffect(() => {
    if (!enabled) {
      setCount(0)
      setIsLoading(false)
      return
    }

    // Handle empty text immediately
    if (!text) {
      setCount(0)
      setInfo({ characters: 0, words: 0, ratio: 0 })
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Debounce the count
    if (debounceMs > 0) {
      debounceTimerRef.current = setTimeout(() => {
        doCount(text)
      }, debounceMs)
    } else {
      // No debounce, count immediately
      doCount(text)
    }

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [text, debounceMs, enabled, doCount])

  // Memoize return value
  return useMemo(
    () => ({
      count,
      isLoading,
      error,
      info,
      recount,
    }),
    [count, isLoading, error, info, recount]
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVENIENCE EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default export for convenient importing.
 *
 * @example
 * ```tsx
 * import useTokenCount from '@clarity-chat/token-optimization/hooks/use-token-count'
 * ```
 */
export default useTokenCount
