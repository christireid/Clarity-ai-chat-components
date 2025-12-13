/**
 * useChatEnhanced - Mid-Level Enhanced Chat Hook
 * 
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat & Completions
 * 
 * Enhanced chat hook with Vercel AI SDK compatibility.
 * Provides a complete chat interface with streaming support, message management,
 * and all features found in Vercel AI SDK's useChat, plus additional enterprise features.
 * 
 * For simpler use cases, use top-level `useClarityChat` instead.
 * For basic chat, use `useChat` (low-level) instead.
 * 
 * @param options - Chat configuration options
 * @param options.api - API endpoint URL (required)
 * @param options.initialMessages - Initial messages array
 * @param options.onFinish - Callback when stream finishes
 * @param options.onError - Callback on error
 * @returns Chat state and controls
 * 
 * @example
 * ```tsx
 * const { messages, append, isLoading } = useChatEnhanced({
 *   api: '/api/chat',
 *   initialMessages: [{ role: 'user', content: 'Hello' }],
 *   onFinish: (message) => console.log('Finished:', message),
 * })
 * 
 * await append({ role: 'user', content: 'Tell me a joke' })
 * ```
 * 
 * @throws {Error} If API endpoint is invalid or missing
 */

'use client'

import * as React from 'react'
import type { MessageRole } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'
import { processStream, type StreamFormat } from '../utils/streaming-helpers'
import {
  extractContentFromChunk,
  parseStreamingChunk,
  type StreamingChunk,
} from '../utils/streaming-parser'

/**
 * Core message content type - supports text and multi-modal content
 */
export type CoreMessageContent = 
  | string
  | Array<{
      type: 'text'
      text: string
    } | {
      type: 'image'
      image: string | ArrayBuffer
    } | {
      type: 'tool-call'
      toolCallId: string
      toolName: string
      args: Record<string, any>
    } | {
      type: 'tool-result'
      toolCallId: string
      toolName: string
      result: any
    }>

/**
 * Core message format compatible with Vercel AI SDK
 */
export interface CoreMessage {
  id?: string
  role: MessageRole | 'function' | 'tool'
  content: CoreMessageContent
  name?: string
  toolCallId?: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }>
}

/**
 * Options for useChat hook (Vercel-compatible + enhancements)
 */
export interface UseChatOptions {
  /** API endpoint URL */
  api?: string
  
  /** Initial messages */
  initialMessages?: CoreMessage[]
  
  /** Additional body data to send with requests */
  body?: Record<string, any>
  
  /** Custom headers */
  headers?: Record<string, string>
  
  /** Fetch credentials mode */
  credentials?: RequestCredentials
  
  /** Custom fetch implementation */
  fetch?: typeof fetch
  
  /** Maximum number of steps for agentic workflows */
  maxSteps?: number
  
  /** Stream protocol: 'sse' | 'data' */
  streamProtocol?: 'sse' | 'data'
  
  /** Generate unique ID for each message */
  id?: () => string
  
  /** Callback when response is received */
  onResponse?: (response: Response) => void | Promise<void>
  
  /** Callback when stream finishes */
  onFinish?: (message: CoreMessage) => void | Promise<void>
  
  /** Callback on error */
  onError?: (error: Error) => void
  
  /** Callback when message is appended */
  onMessageAppend?: (message: CoreMessage) => void
  
  /** Transform messages before sending */
  transform?: (messages: CoreMessage[]) => CoreMessage[]
  
  /** Experimental features */
  experimental?: {
    /** Custom streaming implementation */
    streamProtocol?: 'sse' | 'data' | 'webstream'
    /**
     * Optional transport override for advanced use cases.
     * Used internally by useClarityChat when `transport: 'websocket'`.
     */
    transport?: 'http' | 'websocket'
    /**
     * WebSocket-specific settings (only used when transport === 'websocket').
     * If `url` is omitted, `api` is used and normalized to ws/wss when possible.
     */
    websocket?: {
      url?: string
      protocols?: string | string[]
    }
    /** Additional options */
    [key: string]: any
  }
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Keep previous messages when error occurs */
  keepLastMessageOnError?: boolean
  
  /** Send extra message fields */
  sendExtraMessageFields?: boolean
}

/**
 * Return type for useChat hook (mid-level API)
 * 
 * Follows the standard hook return pattern:
 * - Data: `messages`, `input`, `data` (current state)
 * - State: `isLoading`, `error`
 * - Actions: `append`, `reload`, `stop`, `handleSubmit`, `abort`, `setMessages`, `setInput`
 * 
 * This is Vercel AI SDK compatible and provides enhanced features.
 */
export interface UseChatReturn {
  /** Current messages (data) */
  messages: CoreMessage[]
  
  /** Set messages directly (action) */
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  
  /** Append a message (action) */
  append: (message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>, options?: { data?: Record<string, any> }) => Promise<string | null>
  
  /** Reload/retry the last assistant message (action) */
  reload: (options?: { data?: Record<string, any> }) => Promise<string | null>
  
  /** Stop the current stream (action) */
  stop: () => void
  
  /** Submit a user message (creates user message and triggers assistant response) (action) */
  handleSubmit: (event?: React.FormEvent<HTMLFormElement>, options?: { data?: Record<string, any> }) => void
  
  /** Input value (data) */
  input: string
  
  /** Set input value (action) */
  setInput: React.Dispatch<React.SetStateAction<string>>
  
  /** Whether currently loading (state) */
  isLoading: boolean
  
  /** Current error (state) */
  error: Error | undefined
  
  /** Current assistant message being streamed (data) */
  data: CoreMessage | undefined
  
  /** Abort controller for current request (action) */
  abort: () => void
}

/**
 * Enhanced useChat hook with full Vercel AI SDK compatibility
 * 
 * @example
 * ```tsx
 * const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
 *   api: '/api/chat',
 *   initialMessages: [],
 *   onFinish: (message) => console.log('Finished:', message),
 *   onError: (error) => console.error('Error:', error),
 * })
 * ```
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    api = '/api/chat',
    initialMessages = [],
    body,
    headers = {},
    credentials,
    fetch: customFetch = fetch,
    maxSteps,
    streamProtocol = 'sse',
    id: generateMessageId = () => generateId(),
    onResponse,
    onFinish,
    onError,
    onMessageAppend,
    transform,
    experimental,
    stream = true,
    keepLastMessageOnError = false,
    sendExtraMessageFields = false,
  } = options

  const [messages, setMessages] = React.useState<CoreMessage[]>(initialMessages)
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | undefined>()
  const [data, setData] = React.useState<CoreMessage | undefined>()
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const currentAssistantMessageRef = React.useRef<CoreMessage | null>(null)
  const messageIdRef = React.useRef<string | null>(null)
  const wsRef = React.useRef<WebSocket | null>(null)

  // Track if component is mounted
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  /**
   * Normalize an API string into a WebSocket URL.
   * Accepts ws/wss URLs, http/https URLs, or relative paths (client-only).
   */
  const normalizeWebSocketUrl = React.useCallback((input: string): string => {
    if (input.startsWith('ws://') || input.startsWith('wss://')) return input
    if (input.startsWith('http://')) return `ws://${input.slice('http://'.length)}`
    if (input.startsWith('https://')) return `wss://${input.slice('https://'.length)}`

    // Relative path - only valid in browser.
    if (typeof window === 'undefined') {
      throw new Error(
        '[useChatEnhanced] WebSocket transport requires an absolute ws(s):// URL when used outside the browser.'
      )
    }
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${protocol}//${window.location.host}${input.startsWith('/') ? input : `/${input}`}`
  }, [])

  /**
   * Abort current request
   */
  const abort = React.useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }

    if (wsRef.current) {
      try {
        wsRef.current.close(1000, 'Client abort')
      } catch {
        // ignore
      } finally {
        wsRef.current = null
      }
    }
  }, [])

  /**
   * Stop streaming
   */
  const stop = React.useCallback(() => {
    abort()
    setIsLoading(false)
    if (currentAssistantMessageRef.current && messageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageIdRef.current
            ? { ...currentAssistantMessageRef.current!, id: messageIdRef.current }
            : msg
        )
      )
      currentAssistantMessageRef.current = null
      messageIdRef.current = null
    }
  }, [abort])

  /**
   * Append a message and optionally trigger assistant response
   */
  const append = React.useCallback(
    async (
      message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
      appendOptions?: { data?: Record<string, any> }
    ): Promise<string | null> => {
      const messageId = generateMessageId()
      const fullMessage: CoreMessage = {
        ...message,
        id: messageId,
      }

      // Add user message immediately
      if (message.role === 'user') {
        setMessages((prev) => [...prev, fullMessage])
        onMessageAppend?.(fullMessage)
      }

      // If assistant message, don't auto-trigger API call
      if (message.role === 'assistant') {
        setMessages((prev) => [...prev, fullMessage])
        onMessageAppend?.(fullMessage)
        return messageId
      }

      // For user messages, trigger assistant response if API is configured
      if (message.role === 'user' && api) {
        setIsLoading(true)
        setError(undefined)
        setData(undefined)

        abortControllerRef.current = new AbortController()
        const assistantMessageId = generateMessageId()
        messageIdRef.current = assistantMessageId

        // Create placeholder assistant message
        const assistantMessage: CoreMessage = {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
        }
        currentAssistantMessageRef.current = assistantMessage
        setMessages((prev) => [...prev, assistantMessage])
        setData(assistantMessage)

        try {
          // Prepare request body (shared between http + websocket)
          const transformedMessages = transform
            ? transform([...messages, fullMessage])
            : [...messages, fullMessage]

          const requestBody: Record<string, any> = {
            ...body,
            ...appendOptions?.data,
            messages: transformedMessages,
          }

          if (maxSteps !== undefined) {
            requestBody['maxSteps'] = maxSteps
          }

          const useWsFinal = (experimental?.transport ?? 'http') === 'websocket'

          if (useWsFinal) {
            // WebSocket transport streaming (client-only)
            const wsUrl =
              experimental?.websocket?.url ??
              normalizeWebSocketUrl(api)

            // Close any previous socket
            if (wsRef.current) {
              try {
                wsRef.current.close(1000, 'New request')
              } catch {
                // ignore
              }
              wsRef.current = null
            }

            let accumulatedContent = ''
            let currentMessage = { ...assistantMessage }
            let rafScheduled = false
            let pendingDelta = ''

            const flush = () => {
              rafScheduled = false
              if (!pendingDelta) return
              accumulatedContent += pendingDelta
              pendingDelta = ''
              if (!mountedRef.current) return
              currentMessage = {
                ...currentMessage,
                content: accumulatedContent,
              }
              currentAssistantMessageRef.current = currentMessage
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId ? currentMessage : msg
                )
              )
              setData(currentMessage)
            }

            const scheduleFlush = () => {
              if (rafScheduled) return
              rafScheduled = true
              if (typeof requestAnimationFrame !== 'undefined') {
                requestAnimationFrame(flush)
              } else {
                setTimeout(flush, 16)
              }
            }

            const mergeToolInvocation = (
              toolInvocation: NonNullable<StreamingChunk['toolInvocation']>
            ) => {
              const invocations = currentMessage.toolInvocations
                ? [...currentMessage.toolInvocations]
                : []
              const idx = invocations.findIndex(
                (t) => t.toolCallId === toolInvocation.toolCallId
              )
              const normalized = {
                toolCallId: toolInvocation.toolCallId,
                toolName: toolInvocation.toolName,
                args: toolInvocation.args ?? {},
                state: toolInvocation.state,
                result: toolInvocation.result,
              }
              if (idx === -1) invocations.push(normalized)
              else invocations[idx] = { ...invocations[idx]!, ...normalized }
              currentMessage = { ...currentMessage, toolInvocations: invocations }
            }

            await new Promise<void>((resolve, reject) => {
              const ws = new WebSocket(
                wsUrl,
                experimental?.websocket?.protocols
              )
              wsRef.current = ws

              let finished = false

              const finish = async () => {
                if (finished) return
                finished = true
                flush()
                if (mountedRef.current) {
                  const finalMessage: CoreMessage = {
                    ...currentMessage,
                    content: accumulatedContent,
                  }
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? finalMessage : msg
                    )
                  )
                  setData(finalMessage)
                  await onFinish?.(finalMessage)
                }
                resolve()
              }

              ws.addEventListener('open', () => {
                try {
                  ws.send(
                    JSON.stringify({
                      type: 'chat_request',
                      ...requestBody,
                    })
                  )
                } catch (err) {
                  reject(err)
                }
              })

              ws.addEventListener('message', (event) => {
                const raw =
                  typeof event.data === 'string' ? event.data : String(event.data)

                // Done sentinel support
                if (raw === '[DONE]') {
                  void finish()
                  return
                }

                const parsed = parseStreamingChunk(raw) ?? { content: raw }

                // Recognize explicit done-ish objects
                const anyParsed = parsed as any
                if (
                  anyParsed?.done === true ||
                  anyParsed?.type === 'done' ||
                  anyParsed?.event === 'done'
                ) {
                  void finish()
                  return
                }

                // Tool invocation support
                if (parsed.toolInvocation) {
                  mergeToolInvocation(parsed.toolInvocation)
                  if (mountedRef.current) {
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId ? currentMessage : msg
                      )
                    )
                    setData(currentMessage)
                  }
                }

                const delta = extractContentFromChunk(parsed)
                if (delta) {
                  pendingDelta += delta
                  scheduleFlush()
                }
              })

              ws.addEventListener('error', () => {
                if (!finished) reject(new Error('WebSocket streaming error'))
              })

              ws.addEventListener('close', (event) => {
                // If server closes cleanly, treat as completion.
                if (event.code === 1000 || event.wasClean) {
                  void finish()
                  return
                }
                if (!finished) reject(new Error(`WebSocket closed: ${event.code}`))
              })
            })

            return assistantMessageId
          }

          // HTTP transport
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
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          if (!stream || !response.body) {
            // Non-streaming response
            const result = await response.json()
            const finalMessage: CoreMessage = {
              id: assistantMessageId,
              role: 'assistant',
              content: result.content || result.text || '',
            }

            if (mountedRef.current) {
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId ? finalMessage : msg
                )
              )
              setData(finalMessage)
              await onFinish?.(finalMessage)
            }

            return assistantMessageId
          }

          // Streaming response (robust buffering + tool support + frame batching)
          let accumulatedContent = ''
          let currentMessage = { ...assistantMessage }
          let rafScheduled = false
          let pendingDelta = ''

          const flush = () => {
            rafScheduled = false
            if (!pendingDelta) return
            accumulatedContent += pendingDelta
            pendingDelta = ''
            if (!mountedRef.current) return
            currentMessage = { ...currentMessage, content: accumulatedContent }
            currentAssistantMessageRef.current = currentMessage
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? currentMessage : msg
              )
            )
            setData(currentMessage)
          }

          const scheduleFlush = () => {
            if (rafScheduled) return
            rafScheduled = true
            if (typeof requestAnimationFrame !== 'undefined') {
              requestAnimationFrame(flush)
            } else {
              setTimeout(flush, 16)
            }
          }

          const mergeToolInvocation = (
            toolInvocation: NonNullable<StreamingChunk['toolInvocation']>
          ) => {
            const invocations = currentMessage.toolInvocations
              ? [...currentMessage.toolInvocations]
              : []
            const idx = invocations.findIndex(
              (t) => t.toolCallId === toolInvocation.toolCallId
            )
            const normalized = {
              toolCallId: toolInvocation.toolCallId,
              toolName: toolInvocation.toolName,
              args: toolInvocation.args ?? {},
              state: toolInvocation.state,
              result: toolInvocation.result,
            }
            if (idx === -1) invocations.push(normalized)
            else invocations[idx] = { ...invocations[idx]!, ...normalized }
            currentMessage = { ...currentMessage, toolInvocations: invocations }
          }

          const format: StreamFormat =
            streamProtocol === 'sse' ? 'sse' : 'ndjson'

          await processStream(response.body, {
            signal: abortControllerRef.current.signal,
            format,
            onChunk: (delta) => {
              if (!delta) return
              pendingDelta += delta
              scheduleFlush()
            },
            onData: (data) => {
              // Format-aware data parsing happens inside processStream.
              if (typeof data !== 'object' || data === null) return
              const chunk = data as StreamingChunk
              if (chunk.toolInvocation) {
                mergeToolInvocation(chunk.toolInvocation)
                if (mountedRef.current) {
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessageId ? currentMessage : msg
                    )
                  )
                  setData(currentMessage)
                }
              }
            },
          })

          flush()

          if (mountedRef.current) {
            const finalMessage: CoreMessage = {
              ...currentMessage,
              content: accumulatedContent,
            }
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? finalMessage : msg
              )
            )
            setData(finalMessage)
            await onFinish?.(finalMessage)
          }

          return assistantMessageId
        } catch (err) {
          if (err instanceof Error && err.name === 'AbortError') {
            return null
          }

          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          onError?.(error)

          if (!keepLastMessageOnError && mountedRef.current) {
            setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId))
          }

          throw error
        } finally {
          if (mountedRef.current) {
            setIsLoading(false)
            abortControllerRef.current = null
            currentAssistantMessageRef.current = null
            messageIdRef.current = null
            if (wsRef.current) {
              try {
                wsRef.current.close(1000, 'Request finished')
              } catch {
                // ignore
              } finally {
                wsRef.current = null
              }
            }
          }
        }
      }

      return messageId
    },
    [
      api,
      body,
      headers,
      credentials,
      customFetch,
      maxSteps,
      stream,
      streamProtocol,
      transform,
      messages,
      generateMessageId,
      onResponse,
      onFinish,
      onError,
      onMessageAppend,
      keepLastMessageOnError,
      experimental,
      normalizeWebSocketUrl,
    ]
  )

  /**
   * Reload/retry the last assistant message
   */
  const reload = React.useCallback(
    async (options?: { data?: Record<string, any> }): Promise<string | null> => {
      // Find last user message (manual implementation for ES2022 compatibility)
      let lastUserMessageIndex = -1
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i]?.role === 'user') {
          lastUserMessageIndex = i
          break
        }
      }
      if (lastUserMessageIndex === -1) return null

      // Remove messages after last user message
      const messagesUpToUser = messages.slice(0, lastUserMessageIndex + 1)
      setMessages(messagesUpToUser)

      // Trigger new assistant response
      const lastUserMessage = messagesUpToUser[lastUserMessageIndex]
      if (!lastUserMessage) return null
      return append(lastUserMessage, options)
    },
    [messages, append]
  )

  /**
   * Handle form submission
   */
  const handleSubmit = React.useCallback(
    (event?: React.FormEvent<HTMLFormElement>, options?: { data?: Record<string, any> }) => {
      event?.preventDefault()
      
      if (!input.trim() || isLoading) return

      const userMessage: CoreMessage = {
        role: 'user',
        content: input.trim(),
      }

      append(userMessage, options).then(() => {
        setInput('')
      }).catch(() => {
        // Error already handled in append
      })
    },
    [input, isLoading, append]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abort()
    }
  }, [abort])

  return {
    messages,
    setMessages,
    append,
    reload,
    stop,
    handleSubmit,
    input,
    setInput,
    isLoading,
    error,
    data,
    abort,
  }
}
