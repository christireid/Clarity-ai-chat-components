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
 * @module hooks/use-clarity-chat
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

'use client'

import * as React from 'react'
import {
  useChat as useChatEnhanced,
  type CoreMessage,
} from '../chat/use-chat-enhanced'

// Prompt optimization imports
import { buildModelPrompt } from '../../prompt/core/builder'
import { MODEL_PRESETS } from '../../prompt/core/tokenizer'
import type { ModelMetadata } from '../../prompt/core/tokenizer'

// Internal helpers
import {
  useMemorySafe,
  classifyError,
  retryOperation,
  extractTextContent,
  validateApiEndpoint,
  warnIfMemoryMisconfigured,
  warnIfTooManyMessages,
} from './helpers'

// Debug utilities
import { debug } from '../../internal/debug'

// Types
import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityChatMemoryInfo,
  ClarityChatErrorInfo,
  ClarityChatTokenStats,
  MemoryErrorState,
} from './types'

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
  validateApiEndpoint(options.api)

  const { memory, transport, promptOptimization, ...rest } = options

  // Get memory context safely (returns null if MemoryProvider is not available)
  const memoryContext = useMemorySafe()

  // Warn if memory is misconfigured
  warnIfMemoryMisconfigured(memory?.enabled, memoryContext)

  // Configure transport protocol
  const streamProtocol = transport === 'websocket' ? 'data' : 'sse'

  // Refs for synchronous access
  const memoryContextRef = React.useRef<string>('')
  const lastQueryRef = React.useRef<string>('')

  // State for current memory context to trigger re-renders
  const [currentMemoryContext, setCurrentMemoryContext] = React.useState<string>('')

  // State for optimized messages and token stats
  const [optimizedMessagesState, setOptimizedMessagesState] = React.useState<{
    messages: CoreMessage[]
    tokenStats?: ClarityChatTokenStats
  }>({ messages: [] })

  // State for memory stats
  const [memoryStats, setMemoryStats] = React.useState<{
    count: number
    contextItems: number
  }>({ count: 0, contextItems: 0 })

  // State for memory errors
  const [memoryError, setMemoryError] = React.useState<MemoryErrorState>({
    error: null,
    operation: null,
    errorType: null,
  })

  // State for consent tracking
  const [consentGranted, setConsentGranted] = React.useState<boolean | null>(null)
  const consentRequestedRef = React.useRef<boolean>(false)
  const autoCaptureWarnedRef = React.useRef<boolean>(false)

  // Transform function with memory enrichment
  const originalTransform = rest.transform
  const syncTransform = React.useCallback(
    (messages: CoreMessage[]): CoreMessage[] => {
      let enrichedMessages = messages

      if (originalTransform) {
        enrichedMessages = originalTransform(enrichedMessages)
      }

      // Use state variable to ensure reactivity
      if (memory?.enabled && currentMemoryContext) {
        enrichedMessages = [
          {
            role: 'system',
            content: `Relevant context from memory:\n${currentMemoryContext}`,
          } as CoreMessage,
          ...enrichedMessages,
        ]
      }

      return enrichedMessages
    },
    [memory?.enabled, originalTransform, currentMemoryContext]
  )

  // Enhanced onFinish callback to store messages in memory
  const originalOnFinish = rest.onFinish
  const enhancedOnFinish = React.useCallback(
    async (message: CoreMessage) => {
      await originalOnFinish?.(message)

      // Check if memory is enabled
      if (!memory?.enabled || !memoryContext?.service) {
        return
      }

      // Check if autoCapture is enabled (default: false)
      const autoCapture = memory.autoCapture ?? false
      if (!autoCapture) {
        // Auto-capture is disabled - messages must be manually added to memory
        return
      }

      // Warn once about auto-capture being enabled (privacy implications)
      if (!autoCaptureWarnedRef.current) {
        console.warn(
          '[Clarity Chat] Auto-capture is enabled. All messages will be automatically stored to memory. ' +
          'Ensure users have given explicit consent for data collection. ' +
          'See privacy documentation for GDPR/CCPA compliance guidance.'
        )
        autoCaptureWarnedRef.current = true
      }

      // Check consent if required (default: true)
      const requireConsent = memory.requireConsent ?? true
      if (requireConsent) {
        // Request consent on first capture if not already requested
        if (consentGranted === null && !consentRequestedRef.current) {
          consentRequestedRef.current = true

          try {
            const consent = memory.onConsentRequired
              ? await Promise.resolve(memory.onConsentRequired())
              : false

            setConsentGranted(consent)

            if (!consent) {
              debug.log('[Clarity Chat] Memory capture consent denied by user')
              return
            }

            debug.log('[Clarity Chat] Memory capture consent granted by user')
          } catch (error) {
            console.error('[Clarity Chat] Error obtaining consent:', error)
            setConsentGranted(false)
            return
          }
        } else if (consentGranted === false) {
          // Consent was previously denied
          return
        }
        // If consentGranted === true, proceed with storage
      }

      // Store message to memory
      try {
        const content = extractTextContent(message.content)

        if (content) {
          const storeMemory = async () => {
            return await memoryContext.addMemory(
              content,
              'episodic',
              'thread',
              {
                messageId: message.id,
                role: message.role,
                timestamp: new Date().toISOString(),
                autoCapture: true, // Mark as auto-captured for audit trail
              },
              {
                priority: message.role === 'assistant' ? 'high' : 'medium',
              }
            )
          }

          if (memory.retryOnError !== false) {
            await retryOperation(
              storeMemory,
              memory.maxRetryAttempts || 2,
              500
            )
          } else {
            await storeMemory()
          }
        }
      } catch (error) {
        const err = error as Error
        const errorType = classifyError(err)

        setMemoryError({ error: err, operation: 'store', errorType })
        memory.onMemoryError?.(err, 'store')
        console.warn(
          `[Clarity Chat] Memory storage failed (${errorType}):`,
          err.message
        )
      }
    },
    [
      memory?.enabled,
      memory?.autoCapture,
      memory?.requireConsent,
      memory?.onConsentRequired,
      memoryContext?.service,
      memory?.retryOnError,
      memory?.maxRetryAttempts,
      memory?.onMemoryError,
      consentGranted,
      originalOnFinish,
    ]
  )

  // Create the chat instance
  const chat = useChatEnhanced({
    stream: true,
    streamProtocol,
    ...rest,
    transform:
      memory?.enabled && memoryContext?.service
        ? syncTransform
        : originalTransform,
    onFinish:
      memory?.enabled && memoryContext?.service
        ? enhancedOnFinish
        : rest.onFinish,
  })

  // Enhanced append wrapper to query memory before sending
  const originalAppend = chat.append
  const enhancedAppend = React.useCallback(
    async (
      message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
      options?: { data?: Record<string, unknown> }
    ): Promise<string | null> => {
      // Step 1: Query memory first and wait for completion if needed
      if (
        memory?.enabled &&
        memoryContext?.service &&
        (message.role === 'user' || !('role' in message))
      ) {
        try {
          const queryText = extractTextContent(message.content)

          if (queryText && queryText !== lastQueryRef.current) {
            lastQueryRef.current = queryText

            const queryMemory = async () => {
              return await memoryContext.query({
                query: queryText,
                limit: memory.strategy === 'vector-store' ? 5 : 10,
                scopes: ['thread'],
              })
            }

            try {
              const memoryResults =
                memory.retryOnError !== false
                  ? await retryOperation(
                      queryMemory,
                      memory.maxRetryAttempts || 2,
                      500
                    )
                  : await queryMemory()

              const contextString = memoryResults.length > 0
                ? memoryResults
                    .map((result) => result.memory.content)
                    .join('\n\n')
                : ''

              memoryContextRef.current = contextString
              setCurrentMemoryContext(contextString)
            } catch (error) {
              const err = error as Error
              const errorType = classifyError(err)

              setMemoryError({ error: err, operation: 'query', errorType })
              memory.onMemoryError?.(err, 'query')
              console.warn(
                `[Clarity Chat] Memory query failed (${errorType}):`,
                err.message
              )

              if (errorType === 'memory' || errorType === 'unknown') {
                memoryContextRef.current = ''
                setCurrentMemoryContext('')
              }
            }
          }
        } catch (error) {
          const err = error as Error
          const errorType = classifyError(err)
          memory.onMemoryError?.(err, 'query')
          console.warn(
            `[Clarity Chat] Memory operation failed (${errorType}):`,
            err.message
          )
          memoryContextRef.current = ''
          setCurrentMemoryContext('')
        }
      }

      // Debug log the message append
      debug.hook('useClarityChat', 'Appending message', {
        role: message.role,
        contentLength:
          typeof message.content === 'string'
            ? message.content.length
            : 'complex',
        memoryEnabled: memory?.enabled,
        hasMemoryContext: !!memoryContextRef.current,
      })

      return originalAppend(message, options)
    },
    [
      memory?.enabled,
      memoryContext?.service,
      memory?.strategy,
      memory?.retryOnError,
      memory?.maxRetryAttempts,
      memory?.onMemoryError,
      originalAppend,
    ]
  )

  // Effect for prompt optimization
  React.useEffect(() => {
    if (promptOptimization?.enabled && chat.messages.length > 0) {
      const optimizeMessages = async () => {
        try {
          const modelMetadata: ModelMetadata | undefined =
            promptOptimization.model
              ? MODEL_PRESETS[promptOptimization.model] || {
                  model: promptOptimization.model,
                  maxTokens: promptOptimization.targetTokens || 8192,
                }
              : MODEL_PRESETS['gpt-4']

          const result = await buildModelPrompt({
            toonNodes: undefined,
            variables: {},
            memoryContext: memoryContextRef.current || undefined,
            userInput: undefined,
            modelMetadata,
            messages: chat.messages,
            targetTokens: promptOptimization.targetTokens,
            optimization: {
              enabled: true,
              strategy: promptOptimization.strategy || 'hybrid',
              priorities: promptOptimization.priorities,
              summarizeFn: promptOptimization.summarizeFn,
              keepRecent: promptOptimization.keepRecent || 2,
            },
          })

          setOptimizedMessagesState({
            messages: result.messages,
            tokenStats: {
              inputTokens: result.tokenStats.inputTokens,
              remainingBudget: result.tokenStats.remainingBudget,
              utilization: result.tokenStats.utilization,
              lastOptimizationReason: result.optimizationDiagnostics
                ? result.optimizationDiagnostics.details.join(', ')
                : undefined,
              wasOptimized: result.optimizationDiagnostics !== undefined,
            },
          })
        } catch (error) {
          console.warn('[useClarityChat] Prompt optimization failed:', error)
        }
      }

      optimizeMessages()
    }
  }, [
    promptOptimization?.enabled,
    chat.messages, // Include full messages array to detect content changes
    promptOptimization?.targetTokens,
    promptOptimization?.strategy,
    promptOptimization?.model,
    promptOptimization?.priorities,
    promptOptimization?.summarizeFn,
    promptOptimization?.keepRecent,
  ])

  // Warn about too many messages without optimization
  React.useEffect(() => {
    warnIfTooManyMessages(chat.messages.length, !!promptOptimization?.enabled)
  }, [chat.messages.length, promptOptimization?.enabled])

  // Effect to update memory stats
  React.useEffect(() => {
    if (memory?.enabled && memoryContext?.service) {
      try {
        // Use getStats method if available, otherwise provide safe defaults
        const stats = memoryContext.getStats?.() || { totalMemories: 0 }
        const contextItems = currentMemoryContext
          ? currentMemoryContext.split('\n\n').length
          : 0
        setMemoryStats({ count: stats.totalMemories ?? 0, contextItems })
      } catch (error) {
        console.warn('[useClarityChat] Memory stats unavailable:', error)
        setMemoryStats({ count: 0, contextItems: 0 })
      }
    } else {
      setMemoryStats({ count: 0, contextItems: 0 })
    }
  }, [memory?.enabled, memoryContext?.service, chat.messages.length, currentMemoryContext])

  // Calculate memory info
  const memoryInfo: ClarityChatMemoryInfo = React.useMemo(() => {
    if (!memory?.enabled || !memoryContext?.service) {
      // Even when memory is disabled, show the configured strategy for UX clarity
      return {
        memoryCount: 0,
        enabled: false,
        strategy: memory?.strategy,
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

  return {
    ...chat,
    append:
      memory?.enabled && memoryContext?.service ? enhancedAppend : chat.append,
    memoryInfo,
    memoryErrorInfo,
    tokenStats: promptOptimization?.enabled
      ? optimizedMessagesState.tokenStats
      : undefined,
  }
}
