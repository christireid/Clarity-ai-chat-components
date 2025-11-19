/**
 * useClarityChat - Top-Level Chat State Hook
 * 
 * This is the primary public API for chat functionality in Clarity.
 * It wraps useChatEnhanced with Clarity-specific enhancements including
 * memory integration and transport selection.
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat State
 * 
 * For Vercel AI SDK compatibility, use mid-level `useChatEnhanced` instead.
 * For raw state management, use low-level `useChat`.
 * 
 * @example
 * ```tsx
 * const { messages, append, isLoading, error } = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true, strategy: 'vector-store' },
 * })
 * ```
 * 
 * @example
 * ```tsx
 * // With handlers for easier integration
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 * 
 * <ChatWindow
 *   messages={chat.messages}
 *   onSendMessage={handlers.onSendMessage}
 * />
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
// TODO: Re-enable once prompt system core/ directory is implemented
// import { buildModelPrompt } from '../prompt/core/builder'
// import { MODEL_PRESETS } from '../prompt/core/tokenizer'
// import type { ModelMetadata } from '../prompt/core/tokenizer'

/**
 * Safe hook to get memory context without throwing
 * Returns null if MemoryProvider is not available
 * This satisfies React hooks rules by always calling useContext unconditionally
 */
function useMemorySafe(): MemoryContextValue | null {
  return React.useContext(MemoryContext)
}

// Import unified error handling
import { classifyError as classifyErrorUtil, normalizeError } from '../utils/error-handling'

/**
 * Classify error type for better error handling
 * @deprecated Use classifyError from utils/error-handling instead
 */
function classifyError(error: Error): 'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown' {
  return classifyErrorUtil(error) as 'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown'
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
 * Prompt optimization configuration options
 */
export interface ClarityPromptOptimizationOptions {
  /** Enable prompt optimization */
  enabled?: boolean
  /** Target token budget */
  targetTokens?: number
  /** Optimization strategy */
  strategy?: 'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'
  /** Model identifier for token counting */
  model?: string
  /** Message priorities for optimization */
  priorities?: Array<{ messageId: string; priority: number; reason?: string }>
  /** Summarization function for summarize-old strategy */
  summarizeFn?: (messages: CoreMessage[]) => Promise<string> | string
  /** Number of recent messages to always keep */
  keepRecent?: number
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
  /** Prompt optimization configuration */
  promptOptimization?: ClarityPromptOptimizationOptions
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
 * Token statistics from prompt optimization
 */
export interface ClarityChatTokenStats {
  /** Current input tokens */
  inputTokens: number
  /** Remaining budget */
  remainingBudget: number
  /** Budget utilization (0-1) */
  utilization: number
  /** Last optimization reason */
  lastOptimizationReason?: string
  /** Whether optimization was applied */
  wasOptimized: boolean
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
  /** Token statistics (if prompt optimization enabled) */
  tokenStats?: ClarityChatTokenStats
}

/**
 * useClarityChat - Top-Level Chat State Hook
 * 
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat State
 * 
 * Wraps useChatEnhanced with Clarity-specific features:
 * - Memory integration (optional)
 * - Transport selection (SSE/WebSocket)
 * - Prompt optimization
 * - Better defaults for production use
 * 
 * @param options - Configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.memory - Memory configuration (optional)
 * @param options.transport - Transport protocol: 'sse' (default) or 'websocket'
 * @param options.promptOptimization - Prompt optimization configuration (optional)
 * @returns Chat state and methods with memory info and token stats
 * 
 * @example
 * ```tsx
 * // Simple usage
 * const chat = useClarityChat({ api: '/api/chat' })
 * 
 * // With memory
 * const chat = useClarityChat({
 *   api: '/api/chat',
 *   memory: { enabled: true, strategy: 'vector-store' },
 * })
 * 
 * // With handlers for easier integration
 * const handlers = useChatHandlers({ chat })
 * <ChatWindow messages={chat.messages} onSendMessage={handlers.onSendMessage} />
 * ```
 * 
 * @throws {Error} If API endpoint is invalid or missing
 */
export function useClarityChat(
  options: UseClarityChatOptions = {}
): UseClarityChatReturn {
  // Validate API endpoint
  if (!options.api || typeof options.api !== 'string' || options.api.trim().length === 0) {
    throw new Error(
      'useClarityChat: "api" option is required.\n' +
      'Please provide your API endpoint URL.\n\n' +
      'Example:\n' +
      '  const chat = useClarityChat({ api: "/api/chat" })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/getting-started'
    )
  }
  const { memory, transport, promptOptimization, ...rest } = options

  // Get memory context safely (returns null if MemoryProvider is not available)
  // This hook always runs unconditionally, satisfying React hooks rules
  const memoryContext = useMemorySafe()

  // Configure transport protocol
  // For WebSocket, use 'data' protocol (useChatEnhanced will handle it)
  // For SSE, use 'sse' protocol (default, Vercel-compatible)
  const streamProtocol = transport === 'websocket' ? 'data' : 'sse'

  // Store memory context in a ref for synchronous access in transform
  const memoryContextRef = React.useRef<string>('')
  const lastQueryRef = React.useRef<string>('')

  // Track optimized messages and token stats for prompt optimization
  const [optimizedMessagesState, setOptimizedMessagesState] = React.useState<{
    messages: CoreMessage[]
    tokenStats?: ClarityChatTokenStats
  }>({ messages: [] })

  // Enhanced transform function to enrich messages with memory context and optimize
  const originalTransform = rest.transform
  const enhancedTransform = React.useCallback(
    async (messages: CoreMessage[]): Promise<CoreMessage[]> => {
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

      // TODO: Re-enable once prompt system core/ directory is implemented
      // Apply prompt optimization if enabled
      if (promptOptimization?.enabled) {
        console.warn(
          '[useClarityChat] Prompt optimization is currently disabled. ' +
          'The prompt system core/ directory needs to be implemented first.'
        )
        // Optimization disabled - using non-optimized messages
      }
      // if (promptOptimization?.enabled) {
      //   try {
      //     const modelMetadata: ModelMetadata | undefined = promptOptimization.model
      //       ? (MODEL_PRESETS[promptOptimization.model] || {
      //           model: promptOptimization.model,
      //           maxTokens: promptOptimization.targetTokens || 8192,
      //         })
      //       : MODEL_PRESETS['gpt-4']
      //
      //     const result = await buildModelPrompt({
      //       toonNodes: undefined,
      //       variables: {},
      //       memoryContext: memoryContextRef.current || undefined,
      //       userInput: undefined,
      //       modelMetadata,
      //       targetTokens: promptOptimization.targetTokens,
      //       optimization: {
      //         enabled: true,
      //         strategy: promptOptimization.strategy || 'hybrid',
      //         priorities: promptOptimization.priorities,
      //         summarizeFn: promptOptimization.summarizeFn,
      //         keepRecent: promptOptimization.keepRecent || 2,
      //       },
      //     })
      //
      //     // Use optimized messages, but preserve the structure
      //     enrichedMessages = result.messages.length > 0 ? result.messages : enrichedMessages
      //
      //     // Update token stats
      //     setOptimizedMessagesState({
      //       messages: enrichedMessages,
      //       tokenStats: {
      //         inputTokens: result.tokenStats.inputTokens,
      //         remainingBudget: result.tokenStats.remainingBudget,
      //         utilization: result.tokenStats.utilization,
      //         lastOptimizationReason: result.optimizationDiagnostics
      //           ? result.optimizationDiagnostics.details.join(', ')
      //           : undefined,
      //         wasOptimized: result.optimizationDiagnostics !== undefined,
      //       },
      //     })
      //   } catch (error) {
      //     console.warn('[useClarityChat] Prompt optimization failed:', error)
      //     // Fall back to non-optimized messages
      //   }
      // }

      return enrichedMessages
    },
    [
      memory?.enabled,
      originalTransform,
      promptOptimization?.enabled,
      promptOptimization?.targetTokens,
      promptOptimization?.strategy,
      promptOptimization?.priorities,
      promptOptimization?.summarizeFn,
      promptOptimization?.keepRecent,
      promptOptimization?.model,
    ]
  )

  // Synchronous transform wrapper (for compatibility)
  const syncTransform = React.useCallback(
    (messages: CoreMessage[]): CoreMessage[] => {
      // For prompt optimization, we need async, so we'll optimize in a separate effect
      // For now, just apply original transform and memory enrichment
      let enrichedMessages = messages

      if (originalTransform) {
        enrichedMessages = originalTransform(enrichedMessages)
      }

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
      ? syncTransform
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
                  scopes: ['thread'],
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
                  .map((result) => result.memory.content)
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

  // TODO: Re-enable once prompt system core/ directory is implemented
  // Optimize messages when prompt optimization is enabled
  // React.useEffect(() => {
  //   if (promptOptimization?.enabled && chat.messages.length > 0) {
  //     const optimizeMessages = async () => {
  //       try {
  //         const modelMetadata: ModelMetadata | undefined = promptOptimization.model
  //           ? (MODEL_PRESETS[promptOptimization.model] || {
  //               model: promptOptimization.model,
  //               maxTokens: promptOptimization.targetTokens || 8192,
  //             })
  //           : MODEL_PRESETS['gpt-4']
  //
  //         const result = await buildModelPrompt({
  //           toonNodes: undefined,
  //           variables: {},
  //           memoryContext: memoryContextRef.current || undefined,
  //           userInput: undefined,
  //           modelMetadata,
  //           targetTokens: promptOptimization.targetTokens,
  //           optimization: {
  //             enabled: true,
  //             strategy: promptOptimization.strategy || 'hybrid',
  //             priorities: promptOptimization.priorities,
  //             summarizeFn: promptOptimization.summarizeFn,
  //             keepRecent: promptOptimization.keepRecent || 2,
  //           },
  //         })
  //
  //         setOptimizedMessagesState({
  //           messages: result.messages,
  //           tokenStats: {
  //             inputTokens: result.tokenStats.inputTokens,
  //             remainingBudget: result.tokenStats.remainingBudget,
  //             utilization: result.tokenStats.utilization,
  //             lastOptimizationReason: result.optimizationDiagnostics
  //               ? result.optimizationDiagnostics.details.join(', ')
  //               : undefined,
  //             wasOptimized: result.optimizationDiagnostics !== undefined,
  //           },
  //         })
  //       } catch (error) {
  //         console.warn('[useClarityChat] Prompt optimization failed:', error)
  //       }
  //     }
  //
  //     optimizeMessages()
  //   }
  // }, [
  //   promptOptimization?.enabled,
  //   chat.messages.length,
  //   promptOptimization?.targetTokens,
  //   promptOptimization?.strategy,
  //   promptOptimization?.model,
  // ])

  // Update memory stats when memory context changes
  React.useEffect(() => {
    if (memory?.enabled && memoryContext?.service) {
      try {
        const stats = memoryContext.getStats()
        const contextItems = memoryContextRef.current
          ? memoryContextRef.current.split('\n\n').length
          : 0
        setMemoryStats({
          count: stats.totalMemories ?? 0,
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

  // Return enhanced chat with wrapped append, memory info, error info, and token stats
  return {
    ...chat,
    append: memory?.enabled && memoryContext?.service
      ? enhancedAppend
      : chat.append,
    memoryInfo,
    memoryErrorInfo,
    tokenStats: promptOptimization?.enabled ? optimizedMessagesState.tokenStats : undefined,
  }
}
