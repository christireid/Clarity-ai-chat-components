/**
 * useClarityChat - Flagship chat hook for Clarity AI
 * 
 * This is the primary public API for chat functionality in Clarity.
 * It wraps useChatEnhanced with Clarity-specific enhancements including
 * memory integration and transport selection.
 * 
 * @example
 * ```tsx
 * const { messages, input, setInput, append, isLoading, error } = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true, strategy: 'vector-store' },
 * })
 * ```
 */

import * as React from 'react'
import {
  useChat as useChatEnhanced,
  type UseChatOptions as UseChatEnhancedOptions,
  type UseChatReturn as UseChatEnhancedReturn,
  type CoreMessage,
} from './use-chat-enhanced'
import { useMemory } from '../memory/memory-provider'

/**
 * Memory configuration options
 */
export interface ClarityMemoryOptions {
  /** Enable memory integration */
  enabled?: boolean
  /** Memory strategy: sliding-window, semantic-chunks, or vector-store */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
}

/**
 * Options for useClarityChat hook
 */
export interface UseClarityChatOptions
  extends Omit<UseChatEnhancedOptions, 'experimental'> {
  /** Memory configuration */
  memory?: ClarityMemoryOptions
  /** Transport protocol: 'sse' (default) or 'websocket' */
  transport?: 'sse' | 'websocket'
}

/**
 * Return type for useClarityChat hook
 * Extends UseChatEnhancedReturn with Clarity-specific additions
 */
export type UseClarityChatReturn = UseChatEnhancedReturn & {
  // Future: Add convenience fields like contextSummary, memoryStats, etc.
}

/**
 * useClarityChat - Primary chat hook for Clarity AI
 * 
 * Wraps useChatEnhanced with Clarity-specific features:
 * - Memory integration (optional)
 * - Transport selection (SSE/WebSocket)
 * - Better defaults for production use
 * 
 * @param options - Configuration options
 * @returns Chat state and methods
 */
export function useClarityChat(
  options: UseClarityChatOptions = {}
): UseClarityChatReturn {
  const { memory, transport, ...rest } = options

  // Get memory context if available (optional - won't throw if not provided)
  let memoryContext = null
  try {
    memoryContext = useMemory()
  } catch {
    // MemoryProvider not available - that's okay, memory is optional
    memoryContext = null
  }

  // Configure transport protocol
  const streamProtocol = transport === 'websocket' ? 'data' : 'sse'

  // Set up memory integration if enabled
  React.useEffect(() => {
    if (memory?.enabled && memoryContext?.service) {
      // TODO: In future iterations, integrate memory:
      // - Enrich outgoing messages with context when sending
      // - Store new messages/memories in onFinish callback
      // - Use memory strategy to optimize context window
    }
  }, [memory?.enabled, memoryContext?.service, memory?.strategy])

  // Enhanced onFinish callback to store messages in memory
  const originalOnFinish = rest.onFinish
  const enhancedOnFinish = React.useCallback(
    async (message: CoreMessage) => {
      // Call original callback
      await originalOnFinish?.(message)

      // Store in memory if enabled
      if (memory?.enabled && memoryContext?.service && message.role === 'assistant') {
        try {
          await memoryContext.addMemory(
            typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content),
            'episodic',
            'thread',
            {
              messageId: message.id,
              role: message.role,
            }
          )
        } catch (error) {
          // Silently fail - memory storage is non-critical
          console.warn('Failed to store message in memory:', error)
        }
      }
    },
    [memory?.enabled, memoryContext?.service, originalOnFinish]
  )

  // Wrap useChatEnhanced with Clarity defaults
  const chat = useChatEnhanced({
    stream: true,
    streamProtocol,
    // Prefer SSE by default for parity with Vercel stream protocols
    ...rest,
    // Override onFinish if memory is enabled
    onFinish: memory?.enabled && memoryContext?.service 
      ? enhancedOnFinish 
      : originalOnFinish,
  })

  return chat
}
