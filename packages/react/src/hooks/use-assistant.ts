/**
 * useAssistant hook - Vercel AI SDK compatible
 * 
 * Hook for managing AI assistant interactions with tool calling support,
 * multi-step workflows, and thread/run management.
 */

import * as React from 'react'
import { generateId } from '@clarity-chat/primitives'
import type { CoreMessage } from './use-chat-enhanced'

/**
 * Assistant status
 */
export type AssistantStatus = 'idle' | 'in_progress' | 'awaiting_message'

/**
 * Tool invocation state
 */
export interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result'
  result?: any
  error?: string
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
  onToolCall?: (toolCall: ToolInvocation) => void
  
  /** Enable streaming (default: true) */
  stream?: boolean
  
  /** Experimental features */
  experimental?: {
    [key: string]: any
  }
}

/**
 * Return type for useAssistant hook
 */
export interface UseAssistantReturn {
  /** Current status */
  status: AssistantStatus
  
  /** Current messages */
  messages: CoreMessage[]
  
  /** Set messages directly */
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  
  /** Submit a message to the assistant */
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
 */
export function useAssistant(options: UseAssistantOptions = {}): UseAssistantReturn {
  const {
    api = '/api/assistant',
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
    stream = true,
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
  const currentAssistantMessageRef = React.useRef<CoreMessage | null>(null)
  const messageIdRef = React.useRef<string | null>(null)
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
   * Stop assistant
   */
  const stop = React.useCallback(() => {
    abort()
    if (mountedRef.current) {
      setIsLoading(false)
      setStatus('idle')
    }
  }, [abort])

  /**
   * Append a message manually
   */
  const append = React.useCallback((message: CoreMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

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

      // Add user message
      setMessages((prev) => [...prev, userMessage])
      setStatus('in_progress')
      setIsLoading(true)
      setError(undefined)
      setData(undefined)
      setToolInvocations([])

      abortControllerRef.current = new AbortController()
      const assistantMessageId = generateId()
      messageIdRef.current = assistantMessageId

      // Create placeholder assistant message
      const assistantMessage: CoreMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        toolInvocations: [],
      }
      currentAssistantMessageRef.current = assistantMessage
      setMessages((prev) => [...prev, assistantMessage])
      setData(assistantMessage)

      try {
        const requestBody: Record<string, any> = {
          ...body,
          ...options?.data,
          message: typeof message === 'string' ? message : message.content,
          messages: [...messages, userMessage],
        }

        if (assistantId) {
          requestBody.assistantId = assistantId
        }
        if (threadId) {
          requestBody.threadId = threadId
        }
        if (maxSteps !== undefined) {
          requestBody.maxSteps = maxSteps
        }

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
            toolInvocations: result.toolInvocations || [],
          }
          
          if (mountedRef.current) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId ? finalMessage : msg
              )
            )
            setData(finalMessage)
            setToolInvocations(finalMessage.toolInvocations || [])
            setStatus('idle')
            setIsLoading(false)
            await onFinish?.(finalMessage)
          }
          
          return
        }

        // Streaming response
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedContent = ''
        let currentToolInvocations: ToolInvocation[] = []
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
                
                // Handle tool invocations
                if (parsed.toolInvocation) {
                  const toolCall: ToolInvocation = parsed.toolInvocation
                  currentToolInvocations = [...currentToolInvocations, toolCall]
                  onToolCall?.(toolCall)
                  
                  if (mountedRef.current) {
                    setToolInvocations(currentToolInvocations)
                    currentMessage = {
                      ...currentMessage,
                      toolInvocations: currentToolInvocations,
                    }
                    setMessages((prev) =>
                      prev.map((msg) =>
                        msg.id === assistantMessageId ? currentMessage : msg
                      )
                    )
                    setData(currentMessage)
                  }
                }
                
                // Handle content
                if (parsed.content) {
                  accumulatedContent += parsed.content
                } else if (parsed.text) {
                  accumulatedContent += parsed.text
                } else if (parsed.delta) {
                  accumulatedContent += parsed.delta
                }

                if (mountedRef.current && accumulatedContent) {
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
              } catch {
                // Non-JSON line, treat as plain text
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
            toolInvocations: currentToolInvocations,
          }
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? finalMessage : msg
            )
          )
          setData(finalMessage)
          setToolInvocations(currentToolInvocations)
          setStatus('idle')
          setIsLoading(false)
          await onFinish?.(finalMessage)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }

        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        onError?.(error)

        if (mountedRef.current) {
          setStatus('idle')
          setIsLoading(false)
        }
      } finally {
        if (mountedRef.current) {
          abortControllerRef.current = null
          currentAssistantMessageRef.current = null
          messageIdRef.current = null
        }
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
      messages,
      onResponse,
      onFinish,
      onError,
      onToolCall,
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

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abort()
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
  }
}
