'use client'

/**
 * useThread Hook
 *
 * Manages conversation threads for AI chat interfaces.
 * Handles message streaming, component rendering, tool calls,
 * and conversation history.
 *
 * Features:
 * - Message management (send, receive, stream)
 * - Support for AI-rendered components in messages
 * - Tool call tracking within messages
 * - Conversation history with persistence
 * - Branch/fork support for conversation trees
 * - Message editing and regeneration
 *
 * @example
 * ```tsx
 * const {
 *   messages,
 *   sendMessage,
 *   isStreaming,
 *   streamingContent,
 * } = useThread({
 *   threadId: 'main',
 *   onMessage: (message) => console.log('New message:', message),
 * })
 *
 * // Send a user message
 * await sendMessage({ content: 'Hello!' })
 *
 * // Render messages with components
 * {messages.map((msg) => (
 *   <Message key={msg.id}>
 *     {msg.renderedComponent || msg.content}
 *   </Message>
 * ))}
 * ```
 */

import * as React from 'react'

// ============================================================================
// Types
// ============================================================================

/** Message role */
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool'

/** Message status */
export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error'

/** Tool call within a message */
export interface MessageToolCall {
  /** Tool call ID */
  id: string
  /** Tool name */
  name: string
  /** Input arguments */
  arguments: Record<string, unknown>
  /** Result if completed */
  result?: unknown
  /** Error if failed */
  error?: string
  /** Status */
  status: 'pending' | 'running' | 'complete' | 'error'
}

/** Rendered component in a message */
export interface RenderedComponent {
  /** Component name */
  name: string
  /** Component props */
  props: Record<string, unknown>
  /** React element (set by renderer) */
  element?: React.ReactNode
}

/** Message in a thread */
export interface ThreadMessage {
  /** Unique message ID */
  id: string
  /** Message role */
  role: MessageRole
  /** Text content */
  content: string
  /** Rendered component (if AI returned a component) */
  renderedComponent?: RenderedComponent
  /** Tool calls in this message */
  toolCalls?: MessageToolCall[]
  /** Message status */
  status: MessageStatus
  /** Creation timestamp */
  createdAt: number
  /** Last updated timestamp */
  updatedAt?: number
  /** Parent message ID (for branching) */
  parentId?: string
  /** Metadata */
  metadata?: Record<string, unknown>
  /** Attachments */
  attachments?: Array<{
    type: 'file' | 'image' | 'audio'
    url: string
    name: string
    size?: number
    mimeType?: string
  }>
}

/** Thread state */
export interface Thread {
  /** Thread ID */
  id: string
  /** Thread title */
  title?: string
  /** Messages in thread */
  messages: ThreadMessage[]
  /** Creation timestamp */
  createdAt: number
  /** Last activity timestamp */
  lastActivityAt: number
  /** Thread metadata */
  metadata?: Record<string, unknown>
}

/** Options for useThread hook */
export interface UseThreadOptions {
  /** Thread ID */
  threadId?: string
  /** Initial messages */
  initialMessages?: ThreadMessage[]
  /** Callback when message is added */
  onMessage?: (message: ThreadMessage) => void
  /** Callback when streaming starts */
  onStreamStart?: () => void
  /** Callback when streaming ends */
  onStreamEnd?: (message: ThreadMessage) => void
  /** Callback for tool calls */
  onToolCall?: (toolCall: MessageToolCall) => void
  /** Persist messages to storage */
  persist?: boolean
  /** Storage key */
  storageKey?: string
  /** Maximum messages to keep */
  maxMessages?: number
  /** API endpoint for sending messages */
  apiEndpoint?: string
  /** Custom fetch function */
  customFetch?: (input: RequestInfo, init?: RequestInit) => Promise<Response>
}

/** Return type for useThread hook */
export interface UseThreadReturn {
  /** Thread data */
  thread: Thread
  /** All messages */
  messages: ThreadMessage[]
  /** Whether currently streaming */
  isStreaming: boolean
  /** Whether loading */
  isLoading: boolean
  /** Current streaming content */
  streamingContent: string
  /** Current streaming message (partial) */
  streamingMessage: ThreadMessage | null
  /** Error state */
  error: Error | null
  /** Send a user message */
  sendMessage: (content: string | { content: string; attachments?: ThreadMessage['attachments'] }) => Promise<void>
  /** Regenerate last assistant message */
  regenerate: () => Promise<void>
  /** Edit a message and regenerate from there */
  editMessage: (messageId: string, newContent: string) => Promise<void>
  /** Stop current stream */
  stopStream: () => void
  /** Clear all messages */
  clearMessages: () => void
  /** Delete a specific message */
  deleteMessage: (messageId: string) => void
  /** Fork conversation from a message */
  forkFrom: (messageId: string) => Thread
  /** Add a message manually */
  addMessage: (message: Omit<ThreadMessage, 'id' | 'createdAt' | 'status'>) => void
  /** Update a message */
  updateMessage: (messageId: string, updates: Partial<ThreadMessage>) => void
  /** Get message by ID */
  getMessage: (messageId: string) => ThreadMessage | undefined
}

// ============================================================================
// Helper Functions
// ============================================================================

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function createMessage(
  role: MessageRole,
  content: string,
  options: Partial<ThreadMessage> = {}
): ThreadMessage {
  return {
    id: generateId(),
    role,
    content,
    status: 'complete',
    createdAt: Date.now(),
    ...options,
  }
}

// ============================================================================
// Context
// ============================================================================

export interface ThreadContextValue {
  /** Current thread */
  thread: Thread | null
  /** All threads */
  threads: Thread[]
  /** Create a new thread */
  createThread: (title?: string) => Thread
  /** Switch to a thread */
  switchThread: (threadId: string) => void
  /** Delete a thread */
  deleteThread: (threadId: string) => void
  /** Get thread by ID */
  getThread: (threadId: string) => Thread | undefined
}

const ThreadContext = React.createContext<ThreadContextValue | null>(null)

export interface ThreadProviderProps {
  /** Children */
  children: React.ReactNode
  /** Initial thread ID */
  initialThreadId?: string
  /** Persist to storage */
  persist?: boolean
  /** Storage key */
  storageKey?: string
}

/**
 * Provider for managing multiple threads
 */
export function ThreadProvider({
  children,
  initialThreadId,
  persist = false,
  storageKey = 'chat-threads',
}: ThreadProviderProps) {
  const [threads, setThreads] = React.useState<Thread[]>(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {
        console.warn('Failed to load threads from storage:', e)
      }
    }
    return []
  })

  const [currentThreadId, setCurrentThreadId] = React.useState<string | undefined>(
    initialThreadId
  )

  // Persist threads
  React.useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(threads))
      } catch (e) {
        console.warn('Failed to persist threads:', e)
      }
    }
  }, [threads, persist, storageKey])

  const value = React.useMemo<ThreadContextValue>(() => ({
    thread: threads.find((t) => t.id === currentThreadId) || null,
    threads,
    createThread: (title) => {
      const newThread: Thread = {
        id: generateId(),
        title,
        messages: [],
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
      }
      setThreads((prev) => [...prev, newThread])
      setCurrentThreadId(newThread.id)
      return newThread
    },
    switchThread: (threadId) => {
      setCurrentThreadId(threadId)
    },
    deleteThread: (threadId) => {
      setThreads((prev) => prev.filter((t) => t.id !== threadId))
      if (currentThreadId === threadId) {
        setCurrentThreadId(undefined)
      }
    },
    getThread: (threadId) => threads.find((t) => t.id === threadId),
  }), [threads, currentThreadId])

  return (
    <ThreadContext.Provider value={value}>
      {children}
    </ThreadContext.Provider>
  )
}

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Hook for managing a conversation thread
 */
export function useThread(options: UseThreadOptions = {}): UseThreadReturn {
  const {
    threadId = 'default',
    initialMessages = [],
    onMessage,
    onStreamStart,
    onStreamEnd,
    onToolCall,
    persist = false,
    storageKey,
    maxMessages = 100,
  } = options

  const [thread, setThread] = React.useState<Thread>(() => {
    // Load from storage if persisting
    if (persist && typeof window !== 'undefined') {
      try {
        const key = storageKey || `thread-${threadId}`
        const stored = localStorage.getItem(key)
        if (stored) {
          return JSON.parse(stored)
        }
      } catch (e) {
        console.warn('Failed to load thread from storage:', e)
      }
    }

    return {
      id: threadId,
      messages: initialMessages,
      createdAt: Date.now(),
      lastActivityAt: Date.now(),
    }
  })

  const [isStreaming, setIsStreaming] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [streamingContent, setStreamingContent] = React.useState('')
  const [streamingMessage, setStreamingMessage] = React.useState<ThreadMessage | null>(null)
  const [error, setError] = React.useState<Error | null>(null)

  const abortControllerRef = React.useRef<AbortController | null>(null)

  // Persist thread
  React.useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const key = storageKey || `thread-${threadId}`
        localStorage.setItem(key, JSON.stringify(thread))
      } catch (e) {
        console.warn('Failed to persist thread:', e)
      }
    }
  }, [thread, persist, storageKey, threadId])

  // Add message to thread
  const addMessageInternal = React.useCallback(
    (message: ThreadMessage) => {
      setThread((prev) => ({
        ...prev,
        messages: [...prev.messages.slice(-maxMessages + 1), message],
        lastActivityAt: Date.now(),
      }))
      onMessage?.(message)
    },
    [maxMessages, onMessage]
  )

  // Send message
  const sendMessage = React.useCallback(
    async (input: string | { content: string; attachments?: ThreadMessage['attachments'] }) => {
      const content = typeof input === 'string' ? input : input.content
      const attachments = typeof input === 'string' ? undefined : input.attachments

      // Create user message
      const userMessage = createMessage('user', content, { attachments })
      addMessageInternal(userMessage)

      setIsLoading(true)
      setError(null)

      // Create placeholder assistant message
      const assistantMessage = createMessage('assistant', '', { status: 'streaming' })
      setStreamingMessage(assistantMessage)
      setStreamingContent('')
      setIsStreaming(true)
      onStreamStart?.()

      try {
        // This is a placeholder for actual API integration
        // In real implementation, this would call an AI API with streaming
        // For now, simulate streaming response

        abortControllerRef.current = new AbortController()

        // Simulated streaming (replace with actual API call)
        const responseText = `I received your message: "${content}". This is a simulated response.`
        let currentContent = ''

        for (let i = 0; i < responseText.length; i++) {
          if (abortControllerRef.current.signal.aborted) {
            break
          }

          await new Promise((resolve) => setTimeout(resolve, 20))
          currentContent += responseText[i]
          setStreamingContent(currentContent)
        }

        // Complete the message
        const completedMessage: ThreadMessage = {
          ...assistantMessage,
          content: currentContent,
          status: 'complete',
          updatedAt: Date.now(),
        }

        addMessageInternal(completedMessage)
        onStreamEnd?.(completedMessage)
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error(String(err))
        setError(errorMessage)

        const erroredMessage: ThreadMessage = {
          ...assistantMessage,
          content: streamingContent || 'An error occurred',
          status: 'error',
          updatedAt: Date.now(),
          metadata: { error: errorMessage.message },
        }

        addMessageInternal(erroredMessage)
      } finally {
        setIsLoading(false)
        setIsStreaming(false)
        setStreamingMessage(null)
        setStreamingContent('')
        abortControllerRef.current = null
      }
    },
    [addMessageInternal, onStreamStart, onStreamEnd, streamingContent]
  )

  // Regenerate last assistant message
  const regenerate = React.useCallback(async () => {
    const lastUserMessage = [...thread.messages].reverse().find((m) => m.role === 'user')
    if (lastUserMessage) {
      // Remove last assistant message
      setThread((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, -1),
      }))

      // Resend
      await sendMessage(lastUserMessage.content)
    }
  }, [thread.messages, sendMessage])

  // Edit message and regenerate
  const editMessage = React.useCallback(
    async (messageId: string, newContent: string) => {
      const messageIndex = thread.messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) return

      // Keep messages up to and including the edited one
      setThread((prev) => ({
        ...prev,
        messages: prev.messages.slice(0, messageIndex).concat({
          ...prev.messages[messageIndex],
          content: newContent,
          updatedAt: Date.now(),
        }),
      }))

      // If it was a user message, regenerate
      if (thread.messages[messageIndex].role === 'user') {
        await sendMessage(newContent)
      }
    },
    [thread.messages, sendMessage]
  )

  // Stop streaming
  const stopStream = React.useCallback(() => {
    abortControllerRef.current?.abort()
  }, [])

  // Clear messages
  const clearMessages = React.useCallback(() => {
    setThread((prev) => ({
      ...prev,
      messages: [],
      lastActivityAt: Date.now(),
    }))
  }, [])

  // Delete message
  const deleteMessage = React.useCallback((messageId: string) => {
    setThread((prev) => ({
      ...prev,
      messages: prev.messages.filter((m) => m.id !== messageId),
      lastActivityAt: Date.now(),
    }))
  }, [])

  // Fork conversation
  const forkFrom = React.useCallback(
    (messageId: string): Thread => {
      const messageIndex = thread.messages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) {
        return thread
      }

      return {
        id: generateId(),
        title: `Fork of ${thread.title || thread.id}`,
        messages: thread.messages.slice(0, messageIndex + 1),
        createdAt: Date.now(),
        lastActivityAt: Date.now(),
        metadata: { forkedFrom: thread.id, forkedAt: messageId },
      }
    },
    [thread]
  )

  // Add message manually
  const addMessage = React.useCallback(
    (message: Omit<ThreadMessage, 'id' | 'createdAt' | 'status'>) => {
      addMessageInternal({
        id: generateId(),
        createdAt: Date.now(),
        status: 'complete',
        ...message,
      })
    },
    [addMessageInternal]
  )

  // Update message
  const updateMessage = React.useCallback(
    (messageId: string, updates: Partial<ThreadMessage>) => {
      setThread((prev) => ({
        ...prev,
        messages: prev.messages.map((m) =>
          m.id === messageId ? { ...m, ...updates, updatedAt: Date.now() } : m
        ),
        lastActivityAt: Date.now(),
      }))
    },
    []
  )

  // Get message by ID
  const getMessage = React.useCallback(
    (messageId: string) => thread.messages.find((m) => m.id === messageId),
    [thread.messages]
  )

  return {
    thread,
    messages: thread.messages,
    isStreaming,
    isLoading,
    streamingContent,
    streamingMessage,
    error,
    sendMessage,
    regenerate,
    editMessage,
    stopStream,
    clearMessages,
    deleteMessage,
    forkFrom,
    addMessage,
    updateMessage,
    getMessage,
  }
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Hook to access thread context
 */
export function useThreadContext(): ThreadContextValue {
  const context = React.useContext(ThreadContext)
  if (!context) {
    throw new Error('useThreadContext must be used within a ThreadProvider')
  }
  return context
}

/**
 * Hook for thread input management
 */
export function useThreadInput(): {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  submit: () => void
  isPending: boolean
  clear: () => void
} {
  const [value, setValue] = React.useState('')
  const [isPending, setIsPending] = React.useState(false)

  const submit = React.useCallback(() => {
    setIsPending(true)
    // Actual submission would be handled by the component using this
    setTimeout(() => setIsPending(false), 100)
  }, [])

  const clear = React.useCallback(() => {
    setValue('')
  }, [])

  return { value, setValue, submit, isPending, clear }
}

export default useThread
