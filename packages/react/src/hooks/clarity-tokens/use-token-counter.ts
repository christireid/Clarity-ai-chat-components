'use client'

import * as React from 'react'
import {
  countTokens,
  countChatTokens,
  checkWithinLimit,
  getModelConfig,
  getModelEncoding,
} from '@clarity-chat/clarity-tokens'
import type { ChatMessage } from '@clarity-chat/clarity-tokens'
import type { UseTokenCounterConfig, UseTokenCounterReturn } from './types'

/**
 * useTokenCounter - Real-time token counting with model-aware encoding
 *
 * Provides synchronous and debounced token counting for text inputs,
 * chat message arrays, and streaming content. Uses gpt-tokenizer's
 * optimized `isWithinTokenLimit()` for efficient limit checking.
 *
 * @param config - Configuration options
 * @returns Token counting utilities and state
 *
 * @example
 * ```tsx
 * function TokenAwareInput() {
 *   const {
 *     tokenCount,
 *     setInput,
 *     isWithinLimit,
 *     modelMaxTokens,
 *   } = useTokenCounter({ model: 'gpt-4o' })
 *
 *   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
 *     setInput(e.target.value)
 *   }
 *
 *   return (
 *     <div>
 *       <textarea onChange={handleChange} />
 *       <span>{tokenCount} / {modelMaxTokens} tokens</span>
 *       {!isWithinLimit(tokenCount, modelMaxTokens) && (
 *         <span className="error">Token limit exceeded!</span>
 *       )}
 *     </div>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Streaming token counting
 * function StreamingChat() {
 *   const { streamTokenCount, onStreamChunk, resetStreamCount } = useTokenCounter({
 *     model: 'claude-3-5-sonnet',
 *   })
 *
 *   useEffect(() => {
 *     const eventSource = new EventSource('/api/chat')
 *     eventSource.onmessage = (event) => {
 *       onStreamChunk(event.data)
 *     }
 *     eventSource.onerror = () => {
 *       eventSource.close()
 *     }
 *     return () => {
 *       eventSource.close()
 *       resetStreamCount()
 *     }
 *   }, [])
 *
 *   return <div>Streaming tokens: {streamTokenCount}</div>
 * }
 * ```
 */
export function useTokenCounter(
  config: UseTokenCounterConfig
): UseTokenCounterReturn {
  const { model, debounceMs = 150, includeMessageOverhead = true } = config

  // Get model configuration
  const modelConfig = React.useMemo(() => getModelConfig(model), [model])
  const encoding = React.useMemo(() => getModelEncoding(model), [model])

  // State
  const [tokenCount, setTokenCount] = React.useState(0)
  const [streamTokenCount, setStreamTokenCount] = React.useState(0)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  /**
   * Synchronous token count (cached internally)
   */
  const countTokensSync = React.useCallback(
    (text: string): number => {
      return countTokens(text, encoding)
    },
    [encoding]
  )

  /**
   * Count tokens for chat messages
   */
  const countChatTokensSync = React.useCallback(
    (messages: ChatMessage[]): number => {
      if (includeMessageOverhead) {
        return countChatTokens(messages, encoding)
      }
      // Without overhead, just sum content tokens
      return messages.reduce(
        (sum, msg) => sum + countTokens(msg.content, encoding),
        0
      )
    },
    [encoding, includeMessageOverhead]
  )

  /**
   * Check if text is within token limit (optimized)
   */
  const isWithinLimitCheck = React.useCallback(
    (text: string, limit: number): boolean => {
      return checkWithinLimit(text, limit, encoding)
    },
    [encoding]
  )

  /**
   * Set input with debounced token counting
   */
  const setInput = React.useCallback(
    (text: string): void => {
      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }

      // Debounce the token count update
      debounceTimerRef.current = setTimeout(() => {
        setTokenCount(countTokens(text, encoding))
      }, debounceMs)
    },
    [encoding, debounceMs]
  )

  /**
   * Process streaming chunk
   */
  const onStreamChunk = React.useCallback(
    (chunk: string): void => {
      const chunkTokens = countTokens(chunk, encoding)
      setStreamTokenCount((prev) => prev + chunkTokens)
    },
    [encoding]
  )

  /**
   * Reset stream counter
   */
  const resetStreamCount = React.useCallback((): void => {
    setStreamTokenCount(0)
  }, [])

  // Cleanup debounce timer
  React.useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    countTokens: countTokensSync,
    countChatTokens: countChatTokensSync,
    tokenCount,
    setInput,
    isWithinLimit: isWithinLimitCheck,
    streamTokenCount,
    onStreamChunk,
    resetStreamCount,
    modelMaxTokens: modelConfig.contextWindow,
    encodingName: encoding,
  }
}
