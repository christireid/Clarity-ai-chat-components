'use client'

import * as React from 'react'
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import type { ChatMessage } from '@clarity-chat/token-optimization'
import {
  MODEL_REGISTRY,
  getModelConfig,
  type ModelId,
  type TokenizerEncoding,
} from '../../utils/tokenization/model-registry'
import type { UseTokenCounterConfig, UseTokenCounterReturn } from './types'

/**
 * useTokenCounter - Real-time token counting with model-aware encoding
 *
 * Wraps the AccurateTokenCounter from @clarity-chat/token-optimization to provide
 * React-friendly token counting with caching, debouncing, and streaming support.
 * Uses gpt-tokenizer's optimized `isWithinTokenLimit()` for efficient limit checking.
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

  // Get model configuration from existing registry
  const modelConfig = React.useMemo(() => {
    if (model in MODEL_REGISTRY) {
      return getModelConfig(model as ModelId)
    }
    // Fallback for unknown models
    return {
      contextWindow: 128000,
      encoding: 'cl100k_base' as TokenizerEncoding,
    }
  }, [model])

  // Create AccurateTokenCounter instance from token-optimization package
  const counterRef = React.useRef<AccurateTokenCounter | null>(null)

  React.useEffect(() => {
    counterRef.current = new AccurateTokenCounter({
      model: model,
      enableCaching: true,
      cacheSize: 1000,
    })

    return () => {
      if (counterRef.current) {
        counterRef.current.destroy()
      }
    }
  }, [model])

  // State
  const [tokenCount, setTokenCount] = React.useState(0)
  const [streamTokenCount, setStreamTokenCount] = React.useState(0)
  const debounceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  )

  /**
   * Synchronous token count using AccurateTokenCounter
   */
  const countTokensSync = React.useCallback((text: string): number => {
    if (!counterRef.current) {
      // Fallback estimation if counter not ready
      return Math.ceil(text.length / 4)
    }
    return counterRef.current.count(text)
  }, [])

  /**
   * Count tokens for chat messages using AccurateTokenCounter
   */
  const countChatTokensSync = React.useCallback(
    (messages: ChatMessage[]): number => {
      if (!counterRef.current) {
        // Fallback estimation
        return messages.reduce(
          (sum, msg) => sum + Math.ceil(msg.content.length / 4) + 4,
          3
        )
      }

      if (includeMessageOverhead) {
        return counterRef.current.countChat(messages)
      }
      // Without overhead, just sum content tokens
      return messages.reduce(
        (sum, msg) => sum + counterRef.current!.count(msg.content),
        0
      )
    },
    [includeMessageOverhead]
  )

  /**
   * Check if text is within token limit using AccurateTokenCounter (optimized)
   */
  const isWithinLimitCheck = React.useCallback(
    (text: string, limit: number): boolean => {
      if (!counterRef.current) {
        return Math.ceil(text.length / 4) <= limit
      }
      return counterRef.current.isWithinLimit(text, limit)
    },
    []
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
        if (counterRef.current) {
          setTokenCount(counterRef.current.count(text))
        } else {
          setTokenCount(Math.ceil(text.length / 4))
        }
      }, debounceMs)
    },
    [debounceMs]
  )

  /**
   * Process streaming chunk
   */
  const onStreamChunk = React.useCallback((chunk: string): void => {
    const chunkTokens = counterRef.current
      ? counterRef.current.count(chunk)
      : Math.ceil(chunk.length / 4)
    setStreamTokenCount((prev) => prev + chunkTokens)
  }, [])

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
    encodingName: modelConfig.encoding,
  }
}
