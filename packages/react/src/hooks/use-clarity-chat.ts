/**
 * useClarityChat - Flagship chat hook for Clarity AI Chat Components
 * 
 * This is the primary public API for chat functionality in Clarity.
 * It wraps useChatEnhanced with Clarity-specific features including:
 * - Memory integration (optional)
 * - Transport selection (SSE/WebSocket)
 * - Better defaults for production use
 * 
 * @example
 * ```tsx
 * const { messages, append, input, setInput, isLoading } = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true },
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
import { MemoryContext } from '../memory/memory-provider'
import type { MemoryContextValue } from '../memory/memory-provider'

/**
 * Safe hook to get memory context without throwing
 * Returns null if MemoryProvider is not available
 * This satisfies React hooks rules by always calling useContext unconditionally
 */
function useMemorySafe(): MemoryContextValue | null {
  return React.useContext(MemoryContext)
}

/**
 * Memory configuration options
 */
export interface ClarityMemoryOptions {
  /** Enable memory integration */
  enabled?: boolean
  /** Memory strategy to use */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Auto-capture messages to memory */
  autoCapture?: boolean
}

/**
 * Transport options for streaming
 */
export type ClarityTransport = 'sse' | 'websocket'

/**
 * Options for useClarityChat hook
 */
export interface UseClarityChatOptions
  extends Omit<UseChatEnhancedOptions, 'experimental'> {
  /** Memory configuration */
  memory?: ClarityMemoryOptions
  
  /** Transport protocol for streaming */
  transport?: ClarityTransport
  
  /** User ID for memory context (optional) */
  userId?: string
  
  /** Thread ID for conversation context (optional) */
  threadId?: string
}

/**
 * Return type for useClarityChat hook
 * Extends UseChatEnhancedReturn with Clarity-specific additions
 */
export type UseClarityChatReturn = UseChatEnhancedReturn & {
  /** Whether memory is enabled and available */
  memoryEnabled: boolean
  
  /** Current memory context summary (if memory is enabled) */
  contextSummary?: string
}

/**
 * Convert CoreMessage to a format suitable for memory storage
 */
function extractMessageContent(message: CoreMessage): string {
  if (typeof message.content === 'string') {
    return message.content
  }
  if (Array.isArray(message.content)) {
    return message.content
      .filter((part) => part.type === 'text')
      .map((part) => (part as { type: 'text'; text: string }).text)
      .join('\n')
  }
  return ''
}

/**
 * Flagship chat hook for Clarity AI Chat Components
 * 
 * This hook provides a production-ready chat interface with optional
 * memory integration and flexible transport options.
 * 
 * @param options Configuration options
 * @returns Chat state and control functions
 * 
 * @example
 * ```tsx
 * // Basic usage
 * const chat = useClarityChat({
 *   api: '/api/chat',
 * })
 * 
 * // With memory enabled
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   memory: {
 *     enabled: true,
 *     strategy: 'semantic-chunks',
 *     maxTokens: 4000,
 *   },
 *   userId: 'user-123',
 * })
 * 
 * // With WebSocket transport
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   transport: 'websocket',
 * })
 * ```
 */
export function useClarityChat(
  options: UseClarityChatOptions = {}
): UseClarityChatReturn {
  const {
    memory,
    transport = 'sse',
    userId,
    threadId,
    ...restOptions
  } = options

  // Get memory context safely (returns null if MemoryProvider is not available)
  // This hook always runs unconditionally, satisfying React hooks rules
  const memoryContext = useMemorySafe()

  const memoryEnabled = memory?.enabled === true && memoryContext !== null

  // Configure streaming protocol based on transport
  const streamProtocol = transport === 'websocket' ? 'data' : 'sse'

  // Enhanced onFinish callback that integrates with memory
  const originalOnFinish = restOptions.onFinish
  const enhancedOnFinish = React.useCallback(
    async (message: CoreMessage) => {
      // Call original callback if provided
      if (originalOnFinish) {
        await originalOnFinish(message)
      }

      // Auto-capture to memory if enabled
      if (memoryEnabled && memory?.autoCapture !== false && memoryContext) {
        try {
          const content = extractMessageContent(message)
          if (content.trim()) {
            await memoryContext.addMemory(
              content,
              'episodic',
              'session',
              {
                role: message.role,
                messageId: message.id,
                userId,
                threadId,
              },
              {
                priority: 'medium',
                confidence: 0.8,
              }
            )
          }
        } catch (error) {
          // Silently fail memory capture - don't break chat flow
          if (typeof process !== 'undefined' && process.env?.['NODE_ENV'] === 'development') {
            console.warn('[useClarityChat] Failed to capture message to memory:', error)
          }
        }
      }
    },
    [memoryEnabled, memory?.autoCapture, memoryContext, originalOnFinish, userId, threadId]
  )

  // Use the enhanced chat hook with better defaults
  const chat = useChatEnhanced({
    stream: true,
    streamProtocol,
    ...restOptions,
    onFinish: enhancedOnFinish,
  })

  // Get memory context summary if available
  const contextSummary = React.useMemo(() => {
    if (!memoryEnabled || !memoryContext) {
      return undefined
    }
    try {
      const context = memoryContext.getContext()
      // Return a simple summary (can be enhanced later)
      return `Memory context available (${Object.keys(context).length} items)`
    } catch {
      return undefined
    }
  }, [memoryEnabled, memoryContext])

  return {
    ...chat,
    memoryEnabled,
    contextSummary,
  }
}
