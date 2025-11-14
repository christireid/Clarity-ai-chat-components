/**
 * useChat - Legacy chat hook (DEPRECATED)
 * 
 * ⚠️ **DEPRECATED**: This hook is deprecated in favor of `useClarityChat`.
 * 
 * **Migration Guide:**
 * 
 * ```tsx
 * // Old (deprecated)
 * import { useChat } from '@clarity-chat/react'
 * const { messages, sendMessage, isLoading } = useChat({ ... })
 * 
 * // New (recommended)
 * import { useClarityChat } from '@clarity-chat/react'
 * const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })
 * ```
 * 
 * **Why deprecated:**
 * - `useClarityChat` provides better TypeScript support
 * - `useClarityChat` includes memory integration, error handling, and more features
 * - `useClarityChat` follows the new API shape conventions
 * 
 * This hook will be removed in v3.0. Please migrate to `useClarityChat`.
 * 
 * @deprecated Use `useClarityChat` instead. This will be removed in v3.0.
 */

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
 * @deprecated Use `useClarityChat` instead. This will be removed in v3.0.
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  // Log deprecation warning in development
  if (process.env['NODE_ENV'] === 'development') {
    console.warn(
      '[useChat] This hook is deprecated. Please migrate to `useClarityChat` from @clarity-chat/react. ' +
      'See migration guide: https://github.com/clarity-chat/clarity-chat/blob/main/MIGRATION_GUIDE.md'
    )
  }

  const { initialMessages = [], onSendMessage } = options

  const [messages, setMessages] = React.useState<Message[]>(initialMessages)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)

  const sendMessage = React.useCallback(
    async (content: string, options?: { signal?: AbortSignal }) => {
      if (!onSendMessage) {
        console.warn('[useChat] onSendMessage is required to send messages')
        return
      }

      setIsLoading(true)
      setError(null)

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])

      try {
        await onSendMessage(userMessage, options)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to send message')
        setError(error)
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id))
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [onSendMessage]
  )

  const retry = React.useCallback(
    async (messageId: string, options?: { signal?: AbortSignal }) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.role !== 'user') {
        console.warn('[useChat] Cannot retry: message not found or not a user message')
        return
      }

      // Remove the failed message and its response
      setMessages((prev) => {
        const index = prev.findIndex((m) => m.id === messageId)
        if (index === -1) return prev
        return prev.slice(0, index)
      })

      await sendMessage(message.content, options)
    },
    [messages, sendMessage]
  )

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
