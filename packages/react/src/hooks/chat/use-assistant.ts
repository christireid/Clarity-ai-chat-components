/**
 * useAssistant - Mid-Level Assistant Hook
 * 
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Tools & Agents
 * 
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 * 
 * For chat with tools, use top-level `useClarityChatWithTools` instead.
 * For standalone agents, use top-level `createAgent` instead.
 * 
 * **2025 Improvements**:
 * - Uses shared streaming-helpers for consistent behavior
 * - State machine with granular status tracking
 * - Parallel tool execution support
 * - Tool result caching
 * - Request deduplication cache
 * - Removed deprecated mountedRef pattern
 * - Better error handling with type guards
 * - Progress tracking support
 * 
 * @param options - Assistant configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.assistantId - Assistant ID for OpenAI-compatible APIs
 * @param options.threadId - Thread ID for multi-turn conversations
 * @param options.onToolCall - Callback when tool is invoked
 * @param options.onFinish - Callback when assistant finishes
 * @returns Assistant state and controls
 * 
 * @example
 * ```tsx
 * const { messages, append, status, toolInvocations } = useAssistant({
 *   api: '/api/assistant',
 *   assistantId: 'asst_123',
 *   onToolCall: (invocation) => console.log('Tool called:', invocation),
 * })
 * 
 * await append({ role: 'user', content: 'What is the weather?' })
 * ```
 * 
 * @throws {Error} If API endpoint is invalid or missing
 */

'use client'

import * as React from 'react'
import { generateId } from '@clarity-chat/primitives'
import { processStream, type StreamFormat } from '../utils/streaming-helpers'
import type { CoreMessage } from './use-chat-enhanced'

/**
 * Assistant status with granular state machine
 */
export type AssistantStatus = 
  | 'idle'              // Not doing anything
  | 'loading'           // Initial API call
  | 'streaming'         // Receiving content
  | 'processing_tools'  // Executing tool calls
  | 'complete'          // Finished successfully
  | 'error'             // Error occurred

/**
 * Tool invocation state
 */
export interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result' | 'error'
  result?: any
  error?: string
  duration?: number
}

/**
 * Cache entry for request deduplication
 */
interface AssistantCacheEntry {
  message: CoreMessage
  toolInvocations: ToolInvocation[]
  timestamp: number
  expiresAt: number
}

/**
 * Options for useAssistant hook
 */
export interface UseAssistantOptions {
  /** API endpoint URL */
  api?: string
  
  /** Assistant ID */
  assistantId?: string
  
  /** Thread ID (for multi-turn conversations) */
  threadId?: string
  
  /** Initial messages */
  initialMessages?: CoreMessage[]
  
  /** Additional body data */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Maximum number of steps */
  maxSteps?: number
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when assistant finishes */
  onFinish?: (message: CoreMessage) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback when tool is invoked */
  onToolCall?: (toolCall: ToolInvocation) => void | Promise<void>
  
  /** Callback for progress updates (bytes received) */
  onProgress?: (bytes: number) => void
  
  /** Callback for status changes */
  onStatusChange?: (status: AssistantStatus) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Stream format (default: 'sse') */
  streamFormat?: StreamFormat
  
  /** Execute tools in parallel (default: false) */
  parallelTools?: boolean
  
  /** Enable tool result caching (default: false) */
  cacheToolResults?: boolean
  
  /** Tool cache TTL in milliseconds (default: 5 minutes) */
  toolCacheTTL?: number
  
  /** Enable request deduplication cache (default: false) */
  enableCache?: boolean
  
  /** Cache TTL in milliseconds (default: 5 minutes) */
  cacheTTL?: number
  
  /** Maximum cache size (default: 100 entries) */
  maxCacheSize?: number

  /** Tool definitions for function calling */
  tools?: Record<string, any>[]

  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}

/**
 * Return type for useAssistant hook (mid-level API)
 * 
 * Follows the standard hook return pattern:
 * - Data: `messages`, `status`, `toolInvocations` (current state)
 * - State: `isLoading`, `error`
 * - Actions: `submit`, `stop`, `abort`, `setMessages`
 * 
 * This hook provides Vercel AI SDK compatible assistant functionality with
 * tool calling support and multi-step workflows.
 */
export interface UseAssistantReturn {
  /** Current status (data) */
  status: AssistantStatus
  
  /** Current messages (data) */
  messages: CoreMessage[]
  
  /** Set messages directly (action) */
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  
  /** Submit a message to the assistant (action) */
  submitMessage: (
    message: string | CoreMessage,
    options?: { data?: Record<string, any> }
  ) => Promise<void>
  
  /** Handle form submission */
  handleSubmit: (
    event?: React.FormEvent<HTMLFormElement>,
    options?: { data?: Record<string, any> }
  ) => void
  
  /** Input value */
  input: string
  
  /** Set input value */
  setInput: React.Dispatch<React.SetStateAction<string>>
  
  /** Whether currently loading */
  isLoading: boolean
  
  /** Current error */
  error: Error | undefined
  
  /** Current assistant message being streamed */
  data: CoreMessage | undefined
  
  /** Current tool invocations */
  toolInvocations: ToolInvocation[]
  
  /** Stop the current assistant */
  stop: () => void
  
  /** Abort controller for current request */
  abort: () => void
  
  /** Append a message manually */
  append: (message: CoreMessage) => void
  
  /** Clear the request cache */
  clearCache: () => void
  
  /** Clear the tool cache */
  clearToolCache: () => void
  
  /** Get cache statistics */
  getCacheStats: () => { enabled: boolean; size: number; toolCacheSize: number }
}

/**
 * LRU Cache for request deduplication
 */
class AssistantCache {
  private cache = new Map<string, AssistantCacheEntry>()
  private maxSize: number
  private ttl: number

  constructor(maxSize: number = 100, ttl: number = 300000) {
    this.maxSize = maxSize
    this.ttl = ttl
  }

  private hashKey(message: string, context?: Record<string, any>): string {
    return `${message}:${JSON.stringify(context || {})}`
  }

  get(message: string, context?: Record<string, any>): AssistantCacheEntry | null {
    const key = this.hashKey(message, context)
    const entry = this.cache.get(key)

    if (!entry) return null

    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    // Move to end (LRU)
    this.cache.delete(key)
    this.cache.set(key, entry)

    return entry
  }

  set(message: string, entry: Omit<AssistantCacheEntry, 'timestamp' | 'expiresAt'>, context?: Record<string, any>): void {
    const key = this.hashKey(message, context)
    const now = Date.now()

    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      ...entry,
      timestamp: now,
      expiresAt: now + this.ttl,
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * Tool result cache
 */
class ToolCache {
  private cache = new Map<string, { result: any; expiresAt: number }>()
  private ttl: number

  constructor(ttl: number = 300000) {
    this.ttl = ttl
  }

  private hashKey(toolName: string, args: Record<string, any>): string {
    return `${toolName}:${JSON.stringify(args)}`
  }

  get(toolName: string, args: Record<string, any>): any | null {
    const key = this.hashKey(toolName, args)
    const entry = this.cache.get(key)

    if (!entry) return null

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key)
      return null
    }

    return entry.result
  }

  set(toolName: string, args: Record<string, any>, result: any): void {
    const key = this.hashKey(toolName, args)
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + this.ttl,
    })
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

/**
 * useAssistant hook for AI assistants with tool calling
 * 
 * @example
 * ```tsx
 * const { status, messages, submitMessage, input, setInput, isLoading } = useAssistant({
 *   api: '/api/assistant',
 *   assistantId: 'my-assistant',
 *   onToolCall: (toolCall) => {
 *     console.log('Tool called:', toolCall.toolName)
 *   },
 * })
 * 
 * // Submit a message
 * await submitMessage('What is the weather in San Francisco?')
 * ```
 * 
 * @example
 * ```tsx
 * // With caching, parallel tools, and status tracking
 * const { status, submitMessage, toolInvocations } = useAssistant({
 *   api: '/api/assistant',
 *   enableCache: true, // Request deduplication
 *   cacheToolResults: true, // Cache tool results
 *   parallelTools: true, // Execute multiple tools simultaneously
 *   onStatusChange: (status) => {
 *     console.log('Status:', status)
 *     // idle → loading → streaming → processing_tools → complete
 *   },
 *   onProgress: (bytes) => setProgress(bytes),
 * })
 * 
 * // Status-based UI
 * {status === 'processing_tools' && <ToolProcessingIndicator tools={toolInvocations} />}
 * {status === 'streaming' && <StreamingIndicator />}
 * ```
 */
export function useAssistant(options: UseAssistantOptions = {}): UseAssistantReturn {
  // Validate API endpoint
  const apiOption = options.api || '/api/assistant'
  if (!apiOption || typeof apiOption !== 'string' || apiOption.trim().length === 0) {
    throw new Error(
      'useAssistant: "api" option is required.\n' +
      'Please provide a valid API endpoint URL.\n\n' +
      'Example:\n' +
      '  const { messages, append } = useAssistant({ api: "/api/assistant" })\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/assistants'
    )
  }

  const {
    api = apiOption,
    assistantId,
    threadId,
    initialMessages = [],
    body,
    headers = {},
    credentials,
    fetch: customFetch = fetch,
    maxSteps,
    onResponse,
    onFinish,
    onError,
    onToolCall,
    onProgress,
    onStatusChange,
    stream = true,
    streamFormat = 'sse',
    parallelTools = false,
    cacheToolResults = false,
    toolCacheTTL = 300000,
    enableCache = false,
    cacheTTL = 300000,
    maxCacheSize = 100,
    experimental,
  } = options

  const [status, setStatus] = React.useState<AssistantStatus>('idle')
  const [messages, setMessages] = React.useState<CoreMessage[]>(initialMessages)
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | undefined>()
  const [data, setData] = React.useState<CoreMessage | undefined>()
  const [toolInvocations, setToolInvocations] = React.useState<ToolInvocation[]>([])
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const cacheRef = React.useRef<AssistantCache | null>(null)
  const toolCacheRef = React.useRef<ToolCache | null>(null)
  const onStatusChangeRef = React.useRef(onStatusChange)

  // Initialize caches if enabled
  if (enableCache && !cacheRef.current) {
    cacheRef.current = new AssistantCache(maxCacheSize, cacheTTL)
  }
  if (cacheToolResults && !toolCacheRef.current) {
    toolCacheRef.current = new ToolCache(toolCacheTTL)
  }

  // Keep onStatusChange ref up to date
  React.useEffect(() => {
    onStatusChangeRef.current = onStatusChange
  }, [onStatusChange])

  /**
   * Update status with callback
   */
  const updateStatus = React.useCallback((newStatus: AssistantStatus) => {
    setStatus(newStatus)
    onStatusChangeRef.current?.(newStatus)
    setIsLoading(newStatus !== 'idle' && newStatus !== 'complete' && newStatus !== 'error')
  }, [])

  /**
   * Abort current request
   */
  const abort = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  /**
   * Stop assistant
   */
  const stop = React.useCallback(() => {
    abort()
    updateStatus('idle')
  }, [abort, updateStatus])

  /**
   * Append a message manually
   */
  const append = React.useCallback((message: CoreMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  /**
   * Execute tool calls (with optional parallel execution and caching)
   */
  const executeToolCalls = React.useCallback(
    async (tools: ToolInvocation[]): Promise<ToolInvocation[]> => {
      updateStatus('processing_tools')

      const executeToolCall = async (tool: ToolInvocation): Promise<ToolInvocation> => {
        const startTime = performance.now()

        try {
          // Check cache first
          if (cacheToolResults && toolCacheRef.current) {
            const cached = toolCacheRef.current.get(tool.toolName, tool.args)
            if (cached) {
              return {
                ...tool,
                state: 'result',
                result: cached,
                duration: performance.now() - startTime,
              }
            }
          }

          // Call onToolCall callback (user may provide tool implementation)
          await onToolCall?.(tool)

          // In real implementation, this would call actual tool functions
          // For now, we just mark it as complete
          const result = { success: true, message: `${tool.toolName} executed` }

          // Cache result
          if (cacheToolResults && toolCacheRef.current) {
            toolCacheRef.current.set(tool.toolName, tool.args, result)
          }

          return {
            ...tool,
            state: 'result',
            result,
            duration: performance.now() - startTime,
          }
        } catch (err: unknown) {
          const error = err instanceof Error ? err : new Error(String(err))
          return {
            ...tool,
            state: 'error',
            error: error.message,
            duration: performance.now() - startTime,
          }
        }
      }

      // Execute tools in parallel or sequentially
      const results = parallelTools
        ? await Promise.all(tools.map(executeToolCall))
        : await tools.reduce(async (acc, tool) => {
            const results = await acc
            const result = await executeToolCall(tool)
            return [...results, result]
          }, Promise.resolve([] as ToolInvocation[]))

      return results
    },
    [parallelTools, cacheToolResults, onToolCall, updateStatus]
  )

  /**
   * Submit a message to the assistant
   */
  const submitMessage = React.useCallback(
    async (
      message: string | CoreMessage,
      options?: { data?: Record<string, any> }
    ): Promise<void> => {
      const userMessage: CoreMessage =
        typeof message === 'string'
          ? {
              id: generateId(),
              role: 'user',
              content: message,
            }
          : message

      const messageContent = typeof message === 'string' ? message : message.content
      const messageContentStr = typeof messageContent === 'string' 
        ? messageContent 
        : messageContent
          .filter((part) => part.type === 'text')
          .map((part) => (part.type === 'text' ? part.text : ''))
          .join('')

      // Check cache first
      if (enableCache && cacheRef.current) {
        const requestContext = { ...body, ...options?.data, assistantId, threadId }
        const cached = cacheRef.current.get(messageContentStr, requestContext)
        if (cached) {
          setMessages((prev) => [...prev, userMessage, cached.message])
          setData(cached.message)
          setToolInvocations(cached.toolInvocations)
          await onFinish?.(cached.message)
          return
        }
      }

      // Add user message
      setMessages((prev) => [...prev, userMessage])
      updateStatus('loading')
      setError(undefined)
      setData(undefined)
      setToolInvocations([])

      abortControllerRef.current = new AbortController()
      const assistantMessageId = generateId()

      // Create placeholder assistant message
      const assistantMessage: CoreMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        toolInvocations: [],
      }
      setMessages((prev) => [...prev, assistantMessage])
      setData(assistantMessage)

      try {
        const requestBody: Record<string, any> = {
          ...body,
          ...options?.data,
          message: messageContent,
          messages: [...messages, userMessage],
        }

        if (assistantId) requestBody['assistantId'] = assistantId
        if (threadId) requestBody['threadId'] = threadId
        if (maxSteps !== undefined) requestBody['maxSteps'] = maxSteps

        const response = await customFetch(api, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          credentials,
          body: JSON.stringify(requestBody),
          signal: abortControllerRef.current.signal,
        })

        await onResponse?.(response)

        if (!response.ok) {
          const errorText = await response.text().catch(() => '')
          throw new Error(
            `HTTP ${response.status}: ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
          )
        }

        if (!stream || !response.body) {
          // Non-streaming response
          const result = await response.json()
          const finalMessage: CoreMessage = {
            id: assistantMessageId,
            role: 'assistant',
            content: result.content || result.text || '',
            toolInvocations: result.toolInvocations || [],
          }
          
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? finalMessage : msg
            )
          )
          setData(finalMessage)
          setToolInvocations(finalMessage.toolInvocations || [])

          // Execute tools if present
          if (finalMessage.toolInvocations && finalMessage.toolInvocations.length > 0) {
            const toolInvocationsForExecution = finalMessage.toolInvocations.map(tool => ({
              toolCallId: tool.toolCallId,
              toolName: tool.toolName,
              args: tool.args,
              state: tool.state as 'partial-call' | 'call' | 'result',
              result: tool.result,
            })) as ToolInvocation[]
            const executedTools = await executeToolCalls(toolInvocationsForExecution)
            setToolInvocations(executedTools)
          }

          updateStatus('complete')
          await onFinish?.(finalMessage)

          // Cache the result
          if (enableCache && cacheRef.current) {
            const messageContentStr = typeof messageContent === 'string' 
              ? messageContent 
              : messageContent
                .filter((part) => part.type === 'text')
                .map((part) => (part.type === 'text' ? part.text : ''))
                .join('')
            cacheRef.current.set(
              messageContentStr,
              { message: finalMessage, toolInvocations: finalMessage.toolInvocations || [] },
              requestBody
            )
          }
          
          return
        }

        // Streaming response using shared utilities
        updateStatus('streaming')
        
        let accumulatedContent = ''
        let currentToolInvocations: ToolInvocation[] = []
        
        await processStream(response.body, {
          format: streamFormat,
          signal: abortControllerRef.current.signal,
          onData: (parsed: any) => {
            // Handle tool invocations
            if (parsed?.toolInvocation) {
              const toolCall: ToolInvocation = parsed.toolInvocation as ToolInvocation
              currentToolInvocations = [...currentToolInvocations, toolCall]
              onToolCall?.(toolCall)
              setToolInvocations(currentToolInvocations)
            }
          },
          onChunk: (chunk) => {
            accumulatedContent += chunk
            const currentMessage: CoreMessage = {
              id: assistantMessageId,
              role: 'assistant',
              content: accumulatedContent,
              toolInvocations: currentToolInvocations.map(tool => ({
                toolCallId: tool.toolCallId,
                toolName: tool.toolName,
                args: tool.args,
                state: tool.state === 'error' ? 'call' : tool.state as 'partial-call' | 'call' | 'result',
                result: tool.result,
              })),
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? currentMessage : msg
              )
            )
            setData(currentMessage)
          },
          onProgress,
          onError,
        })

        // Finalize message
        const finalMessage: CoreMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: accumulatedContent,
          toolInvocations: currentToolInvocations.map(tool => ({
            toolCallId: tool.toolCallId,
            toolName: tool.toolName,
            args: tool.args,
            state: tool.state === 'error' ? 'call' : tool.state as 'partial-call' | 'call' | 'result',
            result: tool.result,
          })),
        }

        // Execute tools if present
        if (currentToolInvocations.length > 0) {
          const executedTools = await executeToolCalls(currentToolInvocations)
          finalMessage.toolInvocations = executedTools.map(tool => ({
            toolCallId: tool.toolCallId,
            toolName: tool.toolName,
            args: tool.args,
            state: tool.state === 'error' ? 'call' : tool.state as 'partial-call' | 'call' | 'result',
            result: tool.result,
          }))
          setToolInvocations(executedTools)
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? finalMessage : msg
          )
        )
        setData(finalMessage)
        updateStatus('complete')
        await onFinish?.(finalMessage)

        // Cache the result
        if (enableCache && cacheRef.current) {
          const messageContentStr = typeof messageContent === 'string' 
            ? messageContent 
            : messageContent
              .filter((part) => part.type === 'text')
              .map((part) => (part.type === 'text' ? part.text : ''))
              .join('')
          cacheRef.current.set(
            messageContentStr,
            { message: finalMessage, toolInvocations: finalMessage.toolInvocations || [] },
            requestBody
          )
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') {
          updateStatus('idle')
          return
        }

        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)
        updateStatus('error')
      } finally {
        abortControllerRef.current = null
      }
    },
    [
      api,
      assistantId,
      threadId,
      body,
      headers,
      credentials,
      customFetch,
      maxSteps,
      stream,
      streamFormat,
      messages,
      enableCache,
      onResponse,
      onFinish,
      onError,
      onToolCall,
      onProgress,
      updateStatus,
      executeToolCalls,
    ]
  )

  /**
   * Handle form submission
   */
  const handleSubmit = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>, options?: { data?: Record<string, any> }) => {
      event?.preventDefault()
      
      if (!input.trim() || isLoading) return

      submitMessage(input.trim(), options).then(() => {
        setInput('')
      }).catch(() => {
        // Error already handled
      })
    },
    [input, isLoading, submitMessage]
  )

  /**
   * Clear request cache
   */
  const clearCache = React.useCallback(() => {
    if (cacheRef.current) {
      cacheRef.current.clear()
    }
  }, [])

  /**
   * Clear tool cache
   */
  const clearToolCache = React.useCallback(() => {
    if (toolCacheRef.current) {
      toolCacheRef.current.clear()
    }
  }, [])

  /**
   * Get cache statistics
   */
  const getCacheStats = React.useCallback(() => {
    return {
      enabled: enableCache,
      size: cacheRef.current?.size() || 0,
      toolCacheSize: toolCacheRef.current?.size() || 0,
    }
  }, [enableCache])

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abort()
      if (cacheRef.current) cacheRef.current.clear()
      if (toolCacheRef.current) toolCacheRef.current.clear()
    }
  }, [abort])

  return {
    status,
    messages,
    setMessages,
    submitMessage,
    handleSubmit,
    input,
    setInput,
    isLoading,
    error,
    data,
    toolInvocations,
    stop,
    abort,
    append,
    clearCache,
    clearToolCache,
    getCacheStats,
  }
}
