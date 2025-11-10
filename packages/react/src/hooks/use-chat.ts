import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

export interface UseChatOptions {
  initialMessages?: Message[]
  onSendMessage?: (message: Message, options?: { signal?: AbortSignal }) => Promise<void>
}

export interface UseChatReturn {
  messages: Message[]
  isPending: boolean
  error: Error | null
  sendMessage: (content: string, options?: { signal?: AbortSignal }) => Promise<void>
  retry: (messageId: string, options?: { signal?: AbortSignal }) => Promise<void>
  clear: () => void
  /** @deprecated Use isPending instead */
  isLoading: boolean
}

/**
 * Chat state management hook with message handling and async operations.
 * 
 * **React 19 Improvements:**
 * - Uses `useTransition` for automatic pending state management
 * - Simpler error handling with better integration
 * - No manual loading state management needed
 * - Better performance with React's concurrent features
 * 
 * **Features:**
 * - Message state management
 * - Async message sending with AbortController support
 * - Error handling and retry logic
 * - Automatic pending states (via useTransition)
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
 * const { messages, sendMessage, isPending } = useChat({
 *   onSendMessage: async (message, { signal }) => {
 *     const response = await fetch('/api/chat', {
 *       method: 'POST',
 *       body: JSON.stringify(message),
 *       signal // Cancellable request
 *     })
 *     return response.json()
 *   }
 * })
 * 
 * // isPending automatically managed by React 19's useTransition
 * <button disabled={isPending}>Send</button>
 * ```
 */

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { initialMessages = [], onSendMessage } = options
  
  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [error, setError] = React.useState<Error | null>(null)
  
  // React 19: useTransition now supports async functions!
  const [isPending, startTransition] = React.useTransition()
  
  const abortControllerRef = React.useRef<AbortController | null>(null)
  const onSendMessageRef = React.useRef(onSendMessage)
  
  // Keep callback ref fresh without causing re-renders
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

      // Add message immediately (optimistic update)
      setMessages((prev) => [...prev, userMessage])
      setError(null)

      // React 19: useTransition with async function
      // This automatically tracks pending state and doesn't block UI
      startTransition(async () => {
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
          if (abortControllerRef.current === controller) {
            abortControllerRef.current = null
          }
        }
      })
    },
    [startTransition]
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
    isPending,
    error,
    sendMessage,
    retry,
    clear,
    // Backwards compatibility: isLoading is now an alias for isPending
    isLoading: isPending,
  }
}
