'use client'

import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import type { Message } from '@clarity-chat/types'
import type {
  UseClarityChatAppOptions,
  UseClarityChatAppReturn,
  ClarityMeta,
  TokenStats,
  MemoryStats,
  RAGStats,
  SafetyStats,
  ToolStats,
  ClarityEvent,
  ClarityResolvedConfig,
} from './types'
import { resolveConfig } from './resolve-config'
import {
  createClarityError,
  httpStatusToErrorCode,
  devHint,
  logInitialization,
  logPerformanceWarning,
  detectCommonMistakes,
  logValidationWarnings,
  showQuickStartOnError,
} from './dx-hints'

// =============================================================================
// Default Metadata
// =============================================================================

const DEFAULT_TOKEN_STATS: TokenStats = {
  inputTokens: 0,
  outputTokens: 0,
  totalTokens: 0,
  utilization: 0,
  budgetRemaining: 8192,
  estimatedCost: 0,
}

const DEFAULT_MEMORY_STATS: MemoryStats = {
  enabled: false,
  hits: 0,
  itemsInjected: 0,
  totalItems: 0,
  lastQueryLatencyMs: undefined,
  storeLatencyMs: undefined,
}

const DEFAULT_RAG_STATS: RAGStats = {
  enabled: false,
  sources: 0,
  chunksRetrieved: 0,
  queryLatencyMs: undefined,
}

const DEFAULT_SAFETY_STATS: SafetyStats = {
  enabled: false,
  riskLevel: 'none',
  redactions: 0,
  blockedRequests: 0,
}

const DEFAULT_TOOL_STATS: ToolStats = {
  enabled: false,
  callsTotal: 0,
  callsPending: 0,
  lastResult: undefined,
}

// =============================================================================
// Hook Implementation
// =============================================================================

/**
 * Unified hook for ClarityChat with all advanced features
 *
 * This hook provides a single entry point for chat functionality with
 * automatic integration of memory, token optimization, tools, RAG, and safety.
 *
 * @example Basic usage
 * ```tsx
 * const chat = useClarityChatApp({ api: '/api/chat' })
 * ```
 *
 * @example With memory enabled
 * ```tsx
 * const chat = useClarityChatApp({
 *   api: '/api/chat',
 *   preset: 'memory',
 * })
 * ```
 *
 * @example Enterprise configuration
 * ```tsx
 * const chat = useClarityChatApp({
 *   api: '/api/chat',
 *   preset: 'enterprise',
 *   config: {
 *     tokenOptimization: { budget: 16000 },
 *   },
 * })
 * ```
 */
export function useClarityChatApp(
  options: UseClarityChatAppOptions
): UseClarityChatAppReturn {
  const { api, initialMessages = [], systemPrompt, onEvent } = options

  // Resolve configuration
  const config = useMemo(
    () =>
      resolveConfig({
        preset: options.preset,
        features: options.features,
        config: options.config,
        model: options.model,
        sources: options.sources,
      }),
    [
      options.preset,
      options.features,
      options.config,
      options.model,
      options.sources,
    ]
  )

  // Development mode initialization logging
  const hasLoggedInit = useRef(false)
  useEffect(() => {
    if (!hasLoggedInit.current) {
      hasLoggedInit.current = true

      // Log initialization
      logInitialization({
        api,
        preset: options.preset,
        features: config.features,
      })

      // Check for common mistakes
      const warnings = detectCommonMistakes({
        api,
        preset: options.preset,
        features: config.features,
        ragSources: config.rag.sources,
        toolsRegistry: config.tools.registry,
        memoryEnabled: config.features.memory,
        tokenBudget: config.tokenOptimization.budget,
      })
      logValidationWarnings(warnings)

      // Performance hints
      if (config.features.memory && config.memory.limit > 50) {
        logPerformanceWarning(
          'High memory limit may slow down responses',
          'Consider reducing memory.limit to 20-30 messages for optimal performance'
        )
      }
    }
  }, [api, options.preset, config])

  // Core chat state
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Metadata state
  const [tokenStats, setTokenStats] = useState<TokenStats>({
    ...DEFAULT_TOKEN_STATS,
    budgetRemaining: config.tokenOptimization.budget,
  })
  const [memoryStats, setMemoryStats] = useState<MemoryStats>({
    ...DEFAULT_MEMORY_STATS,
    enabled: config.features.memory,
  })
  const [ragStats, setRagStats] = useState<RAGStats>({
    ...DEFAULT_RAG_STATS,
    enabled: config.features.rag,
    sources: config.rag.sources?.length ?? 0,
  })
  const [safetyStats, setSafetyStats] = useState<SafetyStats>({
    ...DEFAULT_SAFETY_STATS,
    enabled: config.features.safety,
  })
  const [toolStats, setToolStats] = useState<ToolStats>({
    ...DEFAULT_TOOL_STATS,
    enabled: config.features.tools,
  })

  // Refs
  const abortControllerRef = useRef<AbortController | null>(null)
  const retryCountRef = useRef(0)

  // Event emitter
  const emitEvent = useCallback(
    (type: ClarityEvent['type'], data: Record<string, unknown>) => {
      const event: ClarityEvent = {
        type,
        timestamp: Date.now(),
        data,
      }
      onEvent?.(event)
      config.observability.onEvent?.(event)
    },
    [onEvent, config.observability]
  )

  // Token counting (simplified - in production would use actual tokenizer)
  const countTokens = useCallback((text: string): number => {
    // Simple approximation: ~4 characters per token
    return Math.ceil(text.length / 4)
  }, [])

  // Update token stats
  const updateTokenStats = useCallback(
    (inputText: string, outputText: string) => {
      const inputTokens = countTokens(inputText)
      const outputTokens = countTokens(outputText)
      const totalTokens = inputTokens + outputTokens
      const budget = config.tokenOptimization.budget

      setTokenStats({
        inputTokens,
        outputTokens,
        totalTokens,
        utilization: totalTokens / budget,
        budgetRemaining: Math.max(0, budget - totalTokens),
        estimatedCost: totalTokens * 0.00001, // Simplified cost estimate
      })

      emitEvent('token:counted', { inputTokens, outputTokens, totalTokens })
    },
    [config.tokenOptimization.budget, countTokens, emitEvent]
  )

  // Memory injection (simplified implementation)
  const injectMemoryContext = useCallback(
    async (messageHistory: Message[]): Promise<string> => {
      if (!config.features.memory) {
        return ''
      }

      const startTime = Date.now()

      // Simple sliding window implementation
      const windowSize = Math.min(messageHistory.length, config.memory.limit)
      const recentMessages = messageHistory.slice(-windowSize)

      const contextTokens = countTokens(
        recentMessages.map((m) => m.content).join('\n')
      )

      setMemoryStats((prev) => ({
        ...prev,
        itemsInjected: windowSize,
        totalItems: messageHistory.length,
        lastQueryLatencyMs: Date.now() - startTime,
      }))

      emitEvent('memory:injected', {
        itemsInjected: windowSize,
        contextTokens,
      })

      return recentMessages.map((m) => `${m.role}: ${m.content}`).join('\n')
    },
    [config.features.memory, config.memory.limit, countTokens, emitEvent]
  )

  // Safety check (simplified implementation)
  const checkSafety = useCallback(
    async (text: string): Promise<{ allowed: boolean; reason?: string }> => {
      if (!config.features.safety) {
        return { allowed: true }
      }

      // Simple checks
      const hasInjection = /ignore.*previous|system.*prompt|jailbreak/i.test(
        text
      )

      if (hasInjection && config.safety.promptInjectionDetection) {
        setSafetyStats((prev) => ({
          ...prev,
          blockedRequests: prev.blockedRequests + 1,
          riskLevel: 'high',
        }))
        emitEvent('safety:blocked', { reason: 'prompt_injection' })
        return { allowed: false, reason: 'Potential prompt injection detected' }
      }

      emitEvent('safety:checked', { riskLevel: 'none' })
      return { allowed: true }
    },
    [config.features.safety, config.safety.promptInjectionDetection, emitEvent]
  )

  // Send message
  const send = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return

      setError(null)
      setIsLoading(true)

      // Safety check
      const safetyResult = await checkSafety(content)
      if (!safetyResult.allowed) {
        setError(new Error(safetyResult.reason))
        setIsLoading(false)
        return
      }

      // Create user message
      const now = new Date()
      const userMessage: Message = {
        id: `msg_${Date.now()}`,
        chatId: 'default',
        role: 'user',
        content,
        status: 'sent',
        createdAt: now,
        updatedAt: now,
      }

      const newMessages = [...messages, userMessage]
      setMessages(newMessages)
      emitEvent('message:sent', { message: userMessage })

      // Inject memory context
      const memoryContext = await injectMemoryContext(newMessages)

      // Prepare request body
      const requestBody = {
        messages: newMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        systemPrompt: systemPrompt
          ? `${systemPrompt}\n\nContext from memory:\n${memoryContext}`
          : memoryContext || undefined,
        model: config.tokenOptimization.model,
        stream: config.features.streaming,
      }

      // Create abort controller
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          const errorCode = httpStatusToErrorCode(response.status)
          throw createClarityError(
            errorCode,
            `Status ${response.status} from ${api}`
          )
        }

        // Handle streaming response
        if (config.features.streaming && response.body) {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let assistantContent = ''

          const assistantNow = new Date()
          const assistantMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            chatId: 'default',
            role: 'assistant',
            content: '',
            status: 'streaming',
            createdAt: assistantNow,
            updatedAt: assistantNow,
          }

          setMessages([...newMessages, assistantMessage])

          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            assistantContent += chunk

            setMessages((prev) => {
              const updated = [...prev]
              updated[updated.length - 1] = {
                ...updated[updated.length - 1],
                content: assistantContent,
              }
              return updated
            })
          }

          emitEvent('message:received', {
            message: { ...assistantMessage, content: assistantContent },
          })
          updateTokenStats(content, assistantContent)
        } else {
          // Non-streaming response
          const data = await response.json()
          const nonStreamNow = new Date()
          const assistantMessage: Message = {
            id: `msg_${Date.now() + 1}`,
            chatId: 'default',
            role: 'assistant',
            content: data.content || data.message || '',
            status: 'sent',
            createdAt: nonStreamNow,
            updatedAt: nonStreamNow,
          }

          setMessages([...newMessages, assistantMessage])
          emitEvent('message:received', { message: assistantMessage })
          updateTokenStats(content, assistantMessage.content)
        }

        retryCountRef.current = 0
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          // Request was cancelled
          return
        }

        // Handle different error types with actionable messages
        let error: Error
        if (err instanceof Error && 'code' in err) {
          // Already a ClarityError
          error = err
        } else if (
          err instanceof TypeError &&
          (err as Error).message.includes('fetch')
        ) {
          // Network error
          error = createClarityError('NETWORK_ERROR', (err as Error).message)
        } else if (err instanceof Error) {
          error = err
        } else {
          error = createClarityError('API_ERROR_UNKNOWN', String(err))
        }

        // Show quick start guide on first error in dev
        showQuickStartOnError()

        // Log helpful hint in development
        devHint('error', `Request failed: ${error.message}`, {
          api,
          retryCount: retryCountRef.current,
          suggestion:
            'code' in error
              ? (error as { suggestion?: string }).suggestion
              : undefined,
        })

        // Retry logic
        if (
          config.features.errorRecovery &&
          retryCountRef.current < config.errorRecovery.maxRetries
        ) {
          retryCountRef.current++
          const delay = config.errorRecovery.exponentialBackoff
            ? config.errorRecovery.retryDelayMs *
              Math.pow(2, retryCountRef.current - 1)
            : config.errorRecovery.retryDelayMs

          devHint(
            'info',
            `Retrying in ${delay}ms (attempt ${retryCountRef.current}/${config.errorRecovery.maxRetries})`
          )
          setTimeout(() => send(content), delay)
          return
        }

        setError(error)
        emitEvent('message:error', { error: error.message })
      } finally {
        setIsLoading(false)
        abortControllerRef.current = null
      }
    },
    [
      api,
      messages,
      systemPrompt,
      isLoading,
      config,
      checkSafety,
      injectMemoryContext,
      updateTokenStats,
      emitEvent,
    ]
  )

  // Append message
  const append = useCallback(
    async (
      message: Omit<Message, 'id' | 'createdAt' | 'updatedAt'> & {
        chatId?: string
        status?: Message['status']
      }
    ) => {
      if (message.role === 'user') {
        await send(message.content)
      } else {
        const appendNow = new Date()
        const { chatId, status, ...rest } = message
        const newMessage: Message = {
          ...rest,
          id: `msg_${Date.now()}`,
          chatId: chatId ?? 'default',
          status: status ?? 'sent',
          createdAt: appendNow,
          updatedAt: appendNow,
        }
        setMessages((prev) => [...prev, newMessage])
      }
    },
    [send]
  )

  // Stop streaming
  const stop = useCallback(() => {
    abortControllerRef.current?.abort()
    setIsLoading(false)
  }, [])

  // Retry last failed request
  const retry = useCallback(async () => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((m) => m.role === 'user')
    if (lastUserMessage) {
      // Remove the last user message and any subsequent messages
      const lastUserIndex = messages.findIndex(
        (m) => m.id === lastUserMessage.id
      )
      setMessages(messages.slice(0, lastUserIndex))
      await send(lastUserMessage.content)
    }
  }, [messages, send])

  // Clear messages
  const clear = useCallback(() => {
    setMessages([])
    setError(null)
    retryCountRef.current = 0
  }, [])

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInput(e.target.value)
    },
    []
  )

  // Handle form submit
  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault()
      if (input.trim()) {
        send(input)
        setInput('')
      }
    },
    [input, send]
  )

  // Combine metadata
  const meta: ClarityMeta = useMemo(
    () => ({
      token: tokenStats,
      memory: memoryStats,
      rag: ragStats,
      safety: safetyStats,
      tools: toolStats,
    }),
    [tokenStats, memoryStats, ragStats, safetyStats, toolStats]
  )

  // Update stats when config changes
  useEffect(() => {
    setMemoryStats((prev) => ({ ...prev, enabled: config.features.memory }))
    setRagStats((prev) => ({
      ...prev,
      enabled: config.features.rag,
      sources: config.rag.sources?.length ?? 0,
    }))
    setSafetyStats((prev) => ({ ...prev, enabled: config.features.safety }))
    setToolStats((prev) => ({ ...prev, enabled: config.features.tools }))
  }, [config])

  return {
    messages,
    append,
    send,
    isLoading,
    error,
    stop,
    retry,
    clear,
    setMessages,
    meta,
    config,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
  }
}
