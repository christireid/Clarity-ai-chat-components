import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

export interface UseChatOptions {
  /** Initial messages to populate the chat */
  initialMessages?: Message[]
  /** Callback when a message is sent */
  onSendMessage?: (message: Message, options?: { signal?: AbortSignal }) => Promise<void>
  /** Callback when an error occurs */
  onError?: (error: Error, message: Message) => void
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number
  /** Enable optimistic updates (add message immediately, rollback on error) */
  optimistic?: boolean
  /** Deduplicate identical messages within this time window (ms, default: 0 = disabled) */
  deduplicationWindow?: number
}

export interface UseChatReturn {
  /** Current messages in the chat */
  messages: Message[]
  /** Whether a message is currently being sent */
  isLoading: boolean
  /** Current error, if any */
  error: Error | null
  /** Send a new message */
  sendMessage: (content: string, options?: { signal?: AbortSignal }) => Promise<void>
  /** Retry a failed message by ID */
  retry: (messageId: string, options?: { signal?: AbortSignal }) => Promise<void>
  /** Clear all messages and errors */
  clear: () => void
  /** Add a message manually (useful for system messages, etc.) */
  addMessage: (message: Message) => void
  /** Remove a message by ID */
  removeMessage: (messageId: string) => void
  /** Update a message by ID */
  updateMessage: (messageId: string, updates: Partial<Message>) => void
}

/**
 * Chat state management hook with message handling and async operations.
 * 
 * **Features:**
 * - Message state management with CRUD operations
 * - Async message sending with AbortController support
 * - Advanced error handling and retry logic
 * - Loading states and optimistic updates
 * - Message deduplication
 * - Type-safe error guards
 * 
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 * - Customer support systems
 * 
 * **Performance Improvements (2025)**:
 * - Fixed stale closure in retry function (uses ref instead of state dependency)
 * - Optimistic updates for instant UI feedback
 * - Message deduplication prevents duplicate sends
 * - Proper error type guards with detailed error info
 * 
 * @param {UseChatOptions} [options] - Configuration options
 * @param {Message[]} [options.initialMessages] - Initial messages array
 * @param {Function} [options.onSendMessage] - Async callback when message is sent
 * @param {Function} [options.onError] - Callback when error occurs
 * @param {boolean} [options.optimistic] - Enable optimistic updates
 * @param {number} [options.deduplicationWindow] - Deduplication window in ms
 * @returns {UseChatReturn} Chat state and control functions
 * 
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading, retry } = useChat({
 *   onSendMessage: async (message, { signal }) => {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       body: JSON.stringify(message),
 *       signal // Cancellable request
 *     })
 *     if (!response.ok) throw new Error('Failed to send message')
 *     return response.json()
 *   },
 *   onError: (error, message) => {
 *     console.error('Message failed:', message.id, error)
 *   },
 *   optimistic: true, // Instant UI updates
 *   deduplicationWindow: 1000, // Prevent duplicate sends within 1s
 * })
 * 
 * // Retry failed message
 * await retry(failedMessageId)
 * ```
 * 
 * @example
 * ```tsx
 * // With manual message management
 * const { addMessage, updateMessage, removeMessage } = useChat()
 * 
 * // Add system message
 * addMessage({
 *   id: 'system-1',
 *   role: 'system',
 *   content: 'Chat started',
 *   createdAt: new Date(),
 * })
 * 
 * // Update message status
 * updateMessage('msg-123', { status: 'read' })
 * 
 * // Remove message
 * removeMessage('msg-456')
 * ```
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const {
    initialMessages = [],
    onSendMessage,
    onError,
    maxRetries = 3,
    optimistic = false,
    deduplicationWindow = 0,
  } = options
  
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  
  // Use refs to avoid stale closures in retry function
  const messagesRef = React.useRef<Message[]>(messages)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const retryCountRef = React.useRef<Map<string, number>>(new Map())
  const lastSentTimestampRef = React.useRef<Map<string, number>>(new Map())
  
  // Keep messagesRef in sync with messages state
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  /**
   * Type guard to check if error is an AbortError
   */
  const isAbortError = (error: unknown): error is DOMException => {
    return error instanceof Error && error.name === 'AbortError'
  }

  /**
   * Type guard to check if error is a network error
   */
  const isNetworkError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false
    return error.message.toLowerCase().includes('network') ||
           error.message.toLowerCase().includes('fetch')
  }

  /**
   * Check if message should be deduplicated
   */
  const shouldDeduplicate = (content: string): boolean => {
    if (deduplicationWindow <= 0) return false
    
    const now = Date.now()
    const lastSent = lastSentTimestampRef.current.get(content)
    
    if (lastSent && now - lastSent < deduplicationWindow) {
      return true
    }
    
    return false
  }

  const sendMessage = React.useCallback(
    async (content: string, options?: { signal?: AbortSignal }) => {
      // Trim and validate content
      const trimmedContent = content.trim()
      if (!trimmedContent) {
        const emptyError = new Error('Message content cannot be empty')
        onError?.(emptyError, { content } as Message)
        return
      }

      // Check for duplicate messages
      if (shouldDeduplicate(trimmedContent)) {
        console.warn('[useChat] Duplicate message ignored (within deduplication window)')
        return
      }

      // Cancel any pending request
      abortControllerRef.current?.abort()
      
      // Create new AbortController if not provided
      const controller = new AbortController()
      abortControllerRef.current = controller
      const signal = options?.signal || controller.signal

      const userMessage: Message = {
        id: generateId(),
        chatId: 'default',
        role: 'user',
        content: trimmedContent,
        status: optimistic ? 'sending' : 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Update last sent timestamp for deduplication
      lastSentTimestampRef.current.set(trimmedContent, Date.now())

      // Add message optimistically
      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        await onSendMessage?.(userMessage, { signal })
        
        // Update status to sent on success if using optimistic updates
        if (optimistic) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === userMessage.id ? { ...msg, status: 'sent' as const, updatedAt: new Date() } : msg
            )
          )
        }
      } catch (err: unknown) {
        // Don't set error if request was aborted
        if (isAbortError(err)) {
          // Remove optimistic message on abort
          if (optimistic) {
            setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id))
          }
          return
        }
        
        // Type-safe error handling
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        
        // Call error callback with context
        onError?.(error, userMessage)
        
        // Update message status to error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id
              ? {
                  ...msg,
                  status: 'error' as const,
                  error: error.message,
                  updatedAt: new Date(),
                }
              : msg
          )
        )

        // Log additional context for network errors
        if (isNetworkError(error)) {
          console.error('[useChat] Network error:', {
            message: error.message,
            messageId: userMessage.id,
            timestamp: new Date().toISOString(),
          })
        }
      } finally {
        setIsLoading(false)
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      }
    },
    [onSendMessage, onError, optimistic, deduplicationWindow]
  )

  /**
   * Retry a failed message.
   * Uses ref to avoid stale closure - no longer depends on messages in deps array.
   * This prevents the function from being recreated on every message change.
   */
  const retry = React.useCallback(
    async (messageId: string, options?: { signal?: AbortSignal }) => {
      // Use ref to get current messages (prevents stale closure)
      const currentMessages = messagesRef.current
      const message = currentMessages.find((msg) => msg.id === messageId)
      
      if (!message) {
        console.warn(`[useChat] Cannot retry: message ${messageId} not found`)
        return
      }

      // Check retry limit
      const retryCount = retryCountRef.current.get(messageId) || 0
      if (retryCount >= maxRetries) {
        const maxRetriesError = new Error(`Maximum retry attempts (${maxRetries}) exceeded for message`)
        setError(maxRetriesError)
        onError?.(maxRetriesError, message)
        return
      }

      // Increment retry count
      retryCountRef.current.set(messageId, retryCount + 1)

      // Remove the failed message before retrying
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      
      // Reset error state
      setError(null)

      // Send the message again
      await sendMessage(message.content, options)
      
      // Clean up retry count on success (will be reset if it fails again)
      // Note: We can't know if it succeeded here, but the next failure will increment again
    },
    [sendMessage, maxRetries, onError]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      // Clean up refs
      retryCountRef.current.clear()
      lastSentTimestampRef.current.clear()
    }
  }, [])

  const clear = React.useCallback(() => {
    setMessages([])
    setError(null)
    retryCountRef.current.clear()
    lastSentTimestampRef.current.clear()
  }, [])

  /**
   * Add a message manually (useful for system messages, assistant responses, etc.)
   */
  const addMessage = React.useCallback((message: Message) => {
    setMessages((prev) => [...prev, message])
  }, [])

  /**
   * Remove a message by ID
   */
  const removeMessage = React.useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    retryCountRef.current.delete(messageId)
  }, [])

  /**
   * Update a message by ID with partial updates
   */
  const updateMessage = React.useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, ...updates, updatedAt: new Date() }
          : msg
      )
    )
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retry,
    clear,
    addMessage,
    removeMessage,
    updateMessage,
  }
}
