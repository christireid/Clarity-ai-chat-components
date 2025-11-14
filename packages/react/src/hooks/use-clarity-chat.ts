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
 * Classify error type for better error handling
 */
function classifyError(error: Error): 'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown' {
  const message = error.message.toLowerCase()
  
  if (message.includes('memory') || message.includes('vector') || message.includes('embedding')) {
    return 'memory'
  }
  
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'network'
  }
  
  if (message.includes('rate limit') || message.includes('too many requests') || message.includes('429')) {
    return 'ratelimit'
  }
  
  if (message.includes('500') || message.includes('502') || message.includes('503') || message.includes('504')) {
    return 'server'
  }
  
  if (message.includes('401') || message.includes('403') || message.includes('unauthorized') || message.includes('forbidden')) {
    return 'auth'
  }
  
  return 'unknown'
}

/**
 * Retry an async operation with exponential backoff
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxAttempts: number = 2,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on last attempt
      if (attempt < maxAttempts) {
        // Exponential backoff: delayMs * 2^(attempt-1)
        const delay = delayMs * Math.pow(2, attempt - 1)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError || new Error('Operation failed after retries')
}

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
  /** Retry failed memory operations (default: true) */
  retryOnError?: boolean
  /** Maximum retry attempts for memory operations (default: 2) */
  maxRetryAttempts?: number
  /** Callback when memory operation fails */
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}

/**
 * WebSocket configuration options (when transport is 'websocket')
 */
export interface ClarityWebSocketOptions {
  /** Enable automatic reconnection (default: true) */
  autoReconnect?: boolean
  /** Maximum reconnection attempts (default: 5) */
  maxReconnectAttempts?: number
  /** Enable heartbeat/ping-pong (default: true) */
  enableHeartbeat?: boolean
  /** WebSocket protocols */
  protocols?: string | string[]
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
  /** WebSocket-specific options (only used when transport is 'websocket') */
  websocket?: ClarityWebSocketOptions
}

/**
 * Memory statistics and context summary
 */
export interface ClarityChatMemoryInfo {
  /** Number of memories stored */
  memoryCount: number
  /** Whether memory is enabled */
  enabled: boolean
  /** Current memory strategy */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Last context that was added to messages */
  lastContextSummary?: string
}

/**
 * Error information for Clarity Chat
 */
export interface ClarityChatErrorInfo {
  /** Last memory operation error */
  memoryError: Error | null
  /** Last memory operation that failed */
  memoryErrorOperation: 'query' | 'store' | null
  /** Error type classification */
  memoryErrorType: 'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown' | null
}

/**
 * Return type for useClarityChat hook
 * Extends UseChatEnhancedReturn with Clarity-specific additions
 */
export type UseClarityChatReturn = UseChatEnhancedReturn & {
  /** Memory information and statistics */
  memoryInfo: ClarityChatMemoryInfo
  /** Error information for memory operations */
  memoryErrorInfo: ClarityChatErrorInfo
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
  // For WebSocket, use 'data' protocol (useChatEnhanced will handle it)
  // For SSE, use 'sse' protocol (default, Vercel-compatible)
  const streamProtocol = transport === 'websocket' ? 'data' : 'sse'

  // Store memory context in a ref for synchronous access in transform
  const memoryContextRef = React.useRef<string>('')
  const lastQueryRef = React.useRef<string>('')

  // Enhanced transform function to enrich messages with memory context
  const originalTransform = rest.transform
  const enhancedTransform = React.useCallback(
    (messages: CoreMessage[]): CoreMessage[] => {
      let enrichedMessages = messages

      // Apply original transform if provided
      if (originalTransform) {
        enrichedMessages = originalTransform(enrichedMessages)
      }

      // Enrich with memory context if available (from ref)
      if (memory?.enabled && memoryContextRef.current) {
        enrichedMessages = [
          {
            role: 'system',
            content: `Relevant context from memory:\n${memoryContextRef.current}`,
          } as CoreMessage,
          ...enrichedMessages,
        ]
      }

      return enrichedMessages
    },
    [memory?.enabled, originalTransform]
  )

  // Enhanced onFinish callback to store messages in memory
  const originalOnFinish = rest.onFinish
  const enhancedOnFinish = React.useCallback(
    async (message: CoreMessage) => {
      // Call original callback first
      await originalOnFinish?.(message)

      // Store in memory if enabled
      if (memory?.enabled && memoryContext?.service) {
        try {
          const content =
            typeof message.content === 'string'
              ? message.content
              : Array.isArray(message.content)
              ? message.content
                  .filter((part) => part.type === 'text')
                  .map((part) => (part as { type: 'text'; text: string }).text)
                  .join(' ')
              : JSON.stringify(message.content)

          if (content) {
            try {
              const storeMemory = async () => {
                return await memoryContext.addMemory(
                  content,
                  'episodic',
                  'thread',
                  {
                    messageId: message.id,
                    role: message.role,
                    timestamp: new Date().toISOString(),
                  },
                  {
                    priority: message.role === 'assistant' ? 'high' : 'medium',
                  }
                )
              }

              // Store with retry logic if enabled
              if (memory.retryOnError !== false) {
                await retryOperation(
                  storeMemory,
                  memory.maxRetryAttempts || 2,
                  500
                )
              } else {
                await storeMemory()
              }
            } catch (error) {
              const err = error as Error
              const errorType = classifyError(err)
              
              // Update error state
              setMemoryError({
                error: err,
                operation: 'store',
                errorType,
              })
              
              // Call error callback if provided
              memory.onMemoryError?.(err, 'store')
              
              // Log error with classification
              console.warn(`[Clarity Chat] Memory storage failed (${errorType}):`, err.message)
              
              // Memory storage failure is non-critical - don't throw
            }
          }
        } catch (error) {
          const err = error as Error
          const errorType = classifyError(err)
          
          memory.onMemoryError?.(err, 'store')
          console.warn(`[Clarity Chat] Memory operation failed (${errorType}):`, err.message)
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
    // Override transform if memory is enabled
    transform: memory?.enabled && memoryContext?.service
      ? enhancedTransform
      : originalTransform,
    // Override onFinish if memory is enabled
    onFinish: memory?.enabled && memoryContext?.service
      ? enhancedOnFinish
      : rest.onFinish,
  })

  // Enhanced append wrapper to query memory before sending
  const originalAppend = chat.append
  const enhancedAppend = React.useCallback(
    async (
      message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
      options?: { data?: Record<string, any> }
    ): Promise<string | null> => {
      // Query memory if enabled and this is a user message
      if (
        memory?.enabled &&
        memoryContext?.service &&
        (message.role === 'user' || !('role' in message))
      ) {
        try {
          const queryText =
            typeof message.content === 'string'
              ? message.content
              : Array.isArray(message.content)
              ? message.content
                  .filter((part) => part.type === 'text')
                  .map((part) => (part as { type: 'text'; text: string }).text)
                  .join(' ')
              : ''

          if (queryText && queryText !== lastQueryRef.current) {
            lastQueryRef.current = queryText

            try {
              // Query memory for relevant context with retry logic
              const queryMemory = async () => {
                return await memoryContext.query({
                  query: queryText,
                  limit: memory.strategy === 'vector-store' ? 5 : 10,
                  scope: 'thread',
                })
              }

              const memoryResults = memory.retryOnError !== false
                ? await retryOperation(
                    queryMemory,
                    memory.maxRetryAttempts || 2,
                    500
                  )
                : await queryMemory()

              // Store context in ref for transform function
              if (memoryResults.length > 0) {
                memoryContextRef.current = memoryResults
                  .map((result) => result.content)
                  .join('\n\n')
              } else {
                memoryContextRef.current = ''
              }
            } catch (error) {
              const err = error as Error
              const errorType = classifyError(err)
              
              // Update error state
              setMemoryError({
                error: err,
                operation: 'query',
                errorType,
              })
              
              // Call error callback if provided
              memory.onMemoryError?.(err, 'query')
              
              // Log error with classification
              console.warn(`[Clarity Chat] Memory query failed (${errorType}):`, err.message)
              
              // Only fail silently if it's a non-critical error
              if (errorType === 'memory' || errorType === 'unknown') {
                memoryContextRef.current = ''
              } else {
                // For network/server errors, keep previous context if available
                // Don't clear memoryContextRef to avoid losing context
              }
            }
          }
        } catch (error) {
          const err = error as Error
          const errorType = classifyError(err)
          
          memory.onMemoryError?.(err, 'query')
          console.warn(`[Clarity Chat] Memory operation failed (${errorType}):`, err.message)
          memoryContextRef.current = ''
        }
      }

      // Call original append
      return originalAppend(message, options)
    },
    [memory?.enabled, memoryContext?.service, memory?.strategy, originalAppend]
  )

  // Track memory stats with state to trigger updates
  const [memoryStats, setMemoryStats] = React.useState<{
    count: number
    contextItems: number
  }>({ count: 0, contextItems: 0 })

  // Track memory errors
  const [memoryError, setMemoryError] = React.useState<{
    error: Error | null
    operation: 'query' | 'store' | null
    errorType: 'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown' | null
  }>({
    error: null,
    operation: null,
    errorType: null,
  })

  // Update memory stats when memory context changes
  React.useEffect(() => {
    if (memory?.enabled && memoryContext?.service) {
      try {
        const stats = memoryContext.getStats()
        const contextItems = memoryContextRef.current
          ? memoryContextRef.current.split('\n\n').length
          : 0
        setMemoryStats({
          count: stats.totalMemories,
          contextItems,
        })
      } catch {
        setMemoryStats({ count: 0, contextItems: 0 })
      }
    } else {
      setMemoryStats({ count: 0, contextItems: 0 })
    }
  }, [memory?.enabled, memoryContext?.service, chat.messages.length])

  // Calculate memory info for return value
  const memoryInfo: ClarityChatMemoryInfo = React.useMemo(() => {
    if (!memory?.enabled || !memoryContext?.service) {
      return {
        memoryCount: 0,
        enabled: false,
      }
    }

    return {
      memoryCount: memoryStats.count,
      enabled: true,
      strategy: memory.strategy,
      lastContextSummary:
        memoryStats.contextItems > 0
          ? `Added ${memoryStats.contextItems} memory context items`
          : undefined,
    }
  }, [memory?.enabled, memory?.strategy, memoryContext?.service, memoryStats])

  // Memory error info
  const memoryErrorInfo: ClarityChatErrorInfo = React.useMemo(
    () => ({
      memoryError: memoryError.error,
      memoryErrorOperation: memoryError.operation,
      memoryErrorType: memoryError.errorType,
    }),
    [memoryError]
  )

  // Return enhanced chat with wrapped append, memory info, and error info
  return {
    ...chat,
    append: memory?.enabled && memoryContext?.service
      ? enhancedAppend
      : chat.append,
    memoryInfo,
    memoryErrorInfo,
  }
}
