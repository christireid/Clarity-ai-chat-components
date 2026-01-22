/**
 * useChatEnhanced - Internal Enhanced Chat Hook
 *
 * @internal
 * This hook is for internal use only. External consumers should use `useClarityChat`.
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat & Completions
 *
 * Enhanced chat hook with Vercel AI SDK compatibility.
 * Provides a complete chat interface with streaming support, message management,
 * and all features found in Vercel AI SDK's useChat, plus additional enterprise features.
 *
 * For external use, please use `useClarityChat` instead.
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
 * // Internal usage only
 * const { messages, append, isLoading } = useChatEnhanced({
 *   api: '/api/chat',
 *   initialMessages: [{ role: 'user', content: 'Hello' }],
 *   onFinish: (message) => logger.debug('Finished:', message),
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

// Re-export MessageRole for modules that import from this file
export type { MessageRole }

// Simple ID generator (inline to avoid primitives utils export issue)
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Core message content type - supports text and multi-modal content
 */
export type CoreMessageContent =
  | string
  | Array<
      | {
          type: 'text'
          text: string
        }
      | {
          type: 'image'
          image: string | ArrayBuffer
        }
      | {
          type: 'tool-call'
          toolCallId: string
          toolName: string
          args: Record<string, any>
        }
      | {
          type: 'tool-result'
          toolCallId: string
          toolName: string
          result: any
        }
    >

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
  append: (
    message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
    options?: { data?: Record<string, any> }
  ) => Promise<string | null>

  /** Reload/retry the last assistant message (action) */
  reload: (options?: { data?: Record<string, any> }) => Promise<string | null>

  /** Stop the current stream (action) */
  stop: () => void

  /** Submit a user message (creates user message and triggers assistant response) (action) */
  handleSubmit: (
    event?: React.FormEvent<HTMLFormElement>,
    options?: { data?: Record<string, any> }
  ) => void

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
 * @internal This hook is for internal use only. Use `useClarityChat` instead.
 *
 * @example
 * ```tsx
 * const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
 *   api: '/api/chat',
 *   initialMessages: [],
 *   onFinish: (message) => logger.debug('Finished:', message),
 *   onError: (error) => logger.logger.error('Error:', error),
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

  // Track if component is mounted
  const mountedRef = React.useRef(true)
  React.useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
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
   * Stop streaming
   */
  const stop = React.useCallback(() => {
    abort()
    setIsLoading(false)
    if (currentAssistantMessageRef.current && messageIdRef.current) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageIdRef.current
            ? {
                ...currentAssistantMessageRef.current!,
                id: messageIdRef.current,
              }
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
      options?: { data?: Record<string, any> }
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
          // Prepare request body
          const requestBody: Record<string, any> = {
            ...body,
            ...options?.data,
            messages: transform
              ? transform([...messages, fullMessage])
              : [...messages, fullMessage],
          }

          if (maxSteps !== undefined) {
            requestBody['maxSteps'] = maxSteps
          }

          // Make request
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

          // Streaming response
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          let accumulatedContent = ''
          let currentMessage = { ...assistantMessage }

          while (true) {
            const { done, value } = await reader.read()

            if (done) break

            const chunk = decoder.decode(value, { stream: true })
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (!line.trim()) continue

              // Handle SSE format
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  break
                }

                try {
                  const parsed = JSON.parse(data)

                  // Handle different streaming formats
                  let contentDelta = ''

                  if (parsed.choices?.[0]?.delta?.content) {
                    // OpenAI chat completions format
                    contentDelta = parsed.choices[0].delta.content
                  } else if (parsed.choices?.[0]?.text) {
                    // OpenAI completions format
                    contentDelta = parsed.choices[0].text
                  } else if (parsed.content) {
                    // Direct content field
                    contentDelta =
                      typeof parsed.content === 'string' ? parsed.content : ''
                  } else if (parsed.text) {
                    // Text field
                    contentDelta = parsed.text
                  } else if (parsed.delta) {
                    // Delta format
                    contentDelta =
                      typeof parsed.delta === 'string' ? parsed.delta : ''
                  } else if (parsed.message?.content) {
                    // Message wrapper format
                    contentDelta = parsed.message.content
                  } else if (typeof parsed === 'string') {
                    // String response
                    contentDelta = parsed
                  }

                  if (contentDelta) {
                    accumulatedContent += contentDelta

                    if (mountedRef.current) {
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
                  }
                } catch {
                  // Non-JSON line, treat as plain text
                  if (data.trim() && data !== '[DONE]') {
                    accumulatedContent += data
                    if (mountedRef.current) {
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
                  }
                }
              } else if (line.trim()) {
                // Plain text streaming
                accumulatedContent += line
                if (mountedRef.current) {
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
              }
            }
          }

          // Finalize message
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
            // FIX: Issue #14 - Remove partial message on abort to prevent incomplete messages in history
            if (!keepLastMessageOnError && mountedRef.current) {
              setMessages((prev) =>
                prev.filter((msg) => msg.id !== assistantMessageId)
              )
            }
            return null
          }

          const error = err instanceof Error ? err : new Error(String(err))
          setError(error)
          onError?.(error)

          if (!keepLastMessageOnError && mountedRef.current) {
            setMessages((prev) =>
              prev.filter((msg) => msg.id !== assistantMessageId)
            )
          }

          throw error
        } finally {
          if (mountedRef.current) {
            setIsLoading(false)
            abortControllerRef.current = null
            currentAssistantMessageRef.current = null
            messageIdRef.current = null
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
      transform,
      messages,
      generateMessageId,
      onResponse,
      onFinish,
      onError,
      onMessageAppend,
      keepLastMessageOnError,
    ]
  )

  /**
   * Reload/retry the last assistant message
   */
  const reload = React.useCallback(
    async (options?: {
      data?: Record<string, any>
    }): Promise<string | null> => {
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
    (
      event?: React.FormEvent<HTMLFormElement>,
      options?: { data?: Record<string, any> }
    ) => {
      event?.preventDefault()

      // FIX: Issue #13 - Provide feedback when input is empty
      if (!input.trim()) {
        const error = new Error('Message cannot be empty')
        onError?.(error)
        return
      }

      // Check if already loading
      if (isLoading) {
        const error = new Error('Please wait for the current response to complete')
        onError?.(error)
        return
      }

      const userMessage: CoreMessage = {
        role: 'user',
        content: input.trim(),
      }

      append(userMessage, options)
        .then(() => {
          setInput('')
        })
        .catch(() => {
          // Error already handled in append
        })
    },
    [input, isLoading, append, onError]
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

// Export as both useChat and useChatEnhanced for internal compatibility
export { useChat as useChatEnhanced }
