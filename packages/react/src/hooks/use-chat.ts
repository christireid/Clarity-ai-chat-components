import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

export interface UseChatOptions {
  initialMessages?: Message[]
  onSendMessage?: (message: Message, options?: { signal?: AbortSignal }) => Promise<void>
}

/**
 * Return type for useChat hook (low-level primitive)
 * 
 * Follows the standard hook return pattern:
 * - Data: `messages` (array of messages)
 * - State: `isLoading`, `error`
 * - Actions: `sendMessage`, `retry`, `clear`
 */
export interface UseChatReturn {
  /** Current messages (data) */
  messages: Message[]
  
  /** Whether currently loading (state) */
  isLoading: boolean
  
  /** Current error, if any (state) */
  error: Error | null
  
  /** Send a message (action) */
  sendMessage: (content: string, options?: { signal?: AbortSignal }) => Promise<void>
  
  /** Retry a failed message (action) */
  retry: (messageId: string, options?: { signal?: AbortSignal }) => Promise<void>
  
  /** Clear all messages (action) */
  clear: () => void
}

/**
 * Chat state management hook with message handling and async operations.
 * 
 * **Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Loading states
 * 
 * **Use Cases:**
 * - Chat applications
 * - Messaging interfaces
 * - AI assistants
 * 
 * @param {UseChatOptions} [options] - Configuration options
 * @param {Message[]} [options.initialMessages] - Initial messages array
 * @param {Function} [options.onSendMessage] - Async callback when message is sent
 * @returns {UseChatReturn} Chat state and control functions
 * @example
 * ```tsx
 * const { messages, sendMessage, isLoading } = useChat({
 *   onSendMessage: async (message, { signal }) => {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       body: JSON.stringify(message),
 *       signal // Cancellable request
 *     })
 *     return response.json()
 *   }
 * })
 * ```
 */

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { initialMessages = [], onSendMessage } = options
  
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  const abortControllerRef = React.useRef<AbortController | null>(null)
  
  // Store callback in ref to avoid recreating sendMessage when callback changes
  const onSendMessageRef = React.useRef(onSendMessage)
  
  React.useLayoutEffect(() => {
    onSendMessageRef.current = onSendMessage
  }, [onSendMessage])

  const sendMessage = React.useCallback(
    async (content: string, options?: { signal?: AbortSignal }) => {
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
        content,
        status: 'sent',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        await onSendMessageRef.current?.(userMessage, { signal })
      } catch (err) {
        // Don't set error if request was aborted
        if (err instanceof Error && err.name === 'AbortError') {
          return
        }
        
        setError(err as Error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: 'error' as const } : msg
          )
        )
      } finally {
        setIsLoading(false)
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null
        }
      }
    },
    [] // Callback accessed via ref, so not in deps
  )

  const retry = React.useCallback(
    async (messageId: string, options?: { signal?: AbortSignal }) => {
      const message = messages.find((msg) => msg.id === messageId)
      if (!message) return

      await sendMessage(message.content, options)
    },
    [messages, sendMessage]
  )

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const clear = React.useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retry,
    clear,
  }
}
