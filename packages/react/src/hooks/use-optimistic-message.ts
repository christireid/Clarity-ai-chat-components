/**
 * Optimistic Message Updates
 * 
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 */

import * as React from 'react'
import type { Message } from '@clarity-chat/types'

export interface OptimisticMessage extends Message {
  /** Whether this is an optimistic (not yet confirmed) message */
  isOptimistic?: boolean
  /** Error that occurred during sending */
  error?: string
}

export interface UseOptimisticMessageOptions {
  /** Callback to send message to server */
  onSend: (content: string) => Promise<Message>
  /** Callback when message is confirmed */
  onConfirm?: (message: Message) => void
  /** Callback when message fails */
  onError?: (error: Error, optimisticMessage: OptimisticMessage) => void
  /** Default user for optimistic messages */
  defaultUser?: {
    id: string
    name?: string
    avatar?: string
  }
}

export interface UseOptimisticMessageReturn {
  /** All messages including optimistic ones */
  messages: OptimisticMessage[]
  /** Send a message optimistically */
  sendOptimistic: (content: string) => Promise<void>
  /** Set messages from server */
  setMessages: (messages: Message[]) => void
  /** Whether any message is currently being sent */
  isSending: boolean
  /** Retry a failed optimistic message */
  retry: (messageId: string) => Promise<void>
  /** Cancel an optimistic message */
  cancel: (messageId: string) => void
}

export function useOptimisticMessage(
  options: UseOptimisticMessageOptions
): UseOptimisticMessageReturn {
  const { onSend, onConfirm, onError, defaultUser } = options
  
  const [messages, setMessages] = React.useState<OptimisticMessage[]>([])
  const [sending, setSending] = React.useState<Set<string>>(new Set())

  const isSending = sending.size > 0

  // Send message optimistically
  const sendOptimistic = React.useCallback(
    async (content: string) => {
      // Create optimistic message
      const optimisticId = `optimistic-${Date.now()}-${Math.random()}`
      const optimisticMessage: OptimisticMessage = {
        id: optimisticId,
        role: 'user',
        content,
        createdAt: new Date(),
        status: 'sending',
        isOptimistic: true,
        userId: defaultUser?.id,
        userName: defaultUser?.name,
        userAvatar: defaultUser?.avatar,
      }

      // Add optimistic message immediately
      setMessages((prev) => [...prev, optimisticMessage])
      setSending((prev) => new Set(prev).add(optimisticId))

      try {
        // Send to server
        const confirmedMessage = await onSend(content)

        // Replace optimistic message with confirmed one
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticId
              ? { ...confirmedMessage, isOptimistic: false }
              : msg
          )
        )

        onConfirm?.(confirmedMessage)
      } catch (error) {
        // Mark as error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticId
              ? {
                  ...msg,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Failed to send',
                }
              : msg
          )
        )

        onError?.(error as Error, optimisticMessage)
      } finally {
        setSending((prev) => {
          const next = new Set(prev)
          next.delete(optimisticId)
          return next
        })
      }
    },
    [onSend, onConfirm, onError, defaultUser]
  )

  // Retry failed message
  const retry = React.useCallback(
    async (messageId: string) => {
      const message = messages.find((m) => m.id === messageId)
      if (!message || message.status !== 'error') return

      // Reset status to sending
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === messageId
            ? { ...msg, status: 'sending' as const, error: undefined }
            : msg
        )
      )
      setSending((prev) => new Set(prev).add(messageId))

      try {
        const confirmedMessage = await onSend(message.content)

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...confirmedMessage, isOptimistic: false }
              : msg
          )
        )

        onConfirm?.(confirmedMessage)
      } catch (error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: 'error' as const,
                  error: error instanceof Error ? error.message : 'Failed to send',
                }
              : msg
          )
        )

        onError?.(error as Error, message)
      } finally {
        setSending((prev) => {
          const next = new Set(prev)
          next.delete(messageId)
          return next
        })
      }
    },
    [messages, onSend, onConfirm, onError]
  )

  // Cancel optimistic message
  const cancel = React.useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId))
    setSending((prev) => {
      const next = new Set(prev)
      next.delete(messageId)
      return next
    })
  }, [])

  return {
    messages,
    sendOptimistic,
    setMessages,
    isSending,
    retry,
    cancel,
  }
}

/**
 * Simple optimistic state hook (generic)
 */
export interface UseOptimisticStateOptions<T> {
  /** Current server state */
  serverState: T
  /** Function to apply optimistic update to server */
  onUpdate: (newState: T) => Promise<T>
  /** Callback when update is confirmed */
  onConfirm?: (state: T) => void
  /** Callback when update fails */
  onError?: (error: Error, optimisticState: T) => void
}

export interface UseOptimisticStateReturn<T> {
  /** Current state (server or optimistic) */
  state: T
  /** Apply optimistic update */
  update: (newState: T) => Promise<void>
  /** Whether update is pending */
  isPending: boolean
  /** Revert to server state */
  revert: () => void
}

export function useOptimisticState<T>(
  options: UseOptimisticStateOptions<T>
): UseOptimisticStateReturn<T> {
  const { serverState, onUpdate, onConfirm, onError } = options
  
  const [optimisticState, setOptimisticState] = React.useState<T | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  const state = optimisticState ?? serverState

  const update = React.useCallback(
    async (newState: T) => {
      // Apply optimistically
      setOptimisticState(newState)
      setIsPending(true)

      try {
        // Send to server
        const confirmedState = await onUpdate(newState)
        
        // Clear optimistic state (use server state)
        setOptimisticState(null)
        onConfirm?.(confirmedState)
      } catch (error) {
        // Revert to server state
        setOptimisticState(null)
        onError?.(error as Error, newState)
      } finally {
        setIsPending(false)
      }
    },
    [onUpdate, onConfirm, onError]
  )

  const revert = React.useCallback(() => {
    setOptimisticState(null)
    setIsPending(false)
  }, [])

  // Update when server state changes
  React.useEffect(() => {
    if (!isPending) {
      setOptimisticState(null)
    }
  }, [serverState, isPending])

  return {
    state,
    update,
    isPending,
    revert,
  }
}
