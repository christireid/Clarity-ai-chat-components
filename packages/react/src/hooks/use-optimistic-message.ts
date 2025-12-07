/**
 * Optimistic Message Updates
 *
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 *
 * Now leverages React 19's native `useOptimistic` hook for better
 * integration with React's concurrent features.
 */

'use client'

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

/**
 * Action types for optimistic message reducer
 */
type OptimisticAction =
  | { type: 'add'; message: OptimisticMessage }
  | { type: 'confirm'; id: string; confirmedMessage: Message }
  | { type: 'error'; id: string; error: string }
  | { type: 'remove'; id: string }
  | { type: 'retry'; id: string }

/**
 * Reducer for optimistic message updates
 */
function optimisticReducer(
  messages: OptimisticMessage[],
  action: OptimisticAction
): OptimisticMessage[] {
  switch (action.type) {
    case 'add':
      return [...messages, action.message]
    case 'confirm':
      return messages.map((msg) =>
        msg.id === action.id
          ? { ...action.confirmedMessage, isOptimistic: false }
          : msg
      )
    case 'error':
      return messages.map((msg) =>
        msg.id === action.id
          ? { ...msg, status: 'error' as const, error: action.error }
          : msg
      )
    case 'remove':
      return messages.filter((msg) => msg.id !== action.id)
    case 'retry':
      return messages.map((msg) =>
        msg.id === action.id
          ? { ...msg, status: 'sending' as const, error: undefined }
          : msg
      )
    default:
      return messages
  }
}

export function useOptimisticMessage(
  options: UseOptimisticMessageOptions
): UseOptimisticMessageReturn {
  const { onSend, onConfirm, onError } = options

  // Server-confirmed messages
  const [confirmedMessages, setConfirmedMessages] = React.useState<
    OptimisticMessage[]
  >([])

  // React 19's useOptimistic for instant UI feedback
  const [optimisticMessages, addOptimisticMessage] = React.useOptimistic(
    confirmedMessages,
    optimisticReducer
  )

  // Track sending state
  const [sending, setSending] = React.useState<Set<string>>(new Set())
  const isSending = sending.size > 0

  // Send message optimistically
  const sendOptimistic = React.useCallback(
    async (content: string) => {
      const optimisticId = `optimistic-${Date.now()}-${Math.random()}`
      const optimisticMessage: OptimisticMessage = {
        id: optimisticId,
        chatId: 'optimistic-chat',
        role: 'user',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sending',
        isOptimistic: true,
      }

      // Add optimistic message immediately (React 19 useOptimistic)
      addOptimisticMessage({ type: 'add', message: optimisticMessage })
      setSending((prev) => new Set(prev).add(optimisticId))

      try {
        // Send to server
        const confirmedMessage = await onSend(content)

        // Update confirmed messages (will replace optimistic)
        setConfirmedMessages((prev) => [
          ...prev.filter((m) => m.id !== optimisticId),
          { ...confirmedMessage, isOptimistic: false },
        ])

        onConfirm?.(confirmedMessage)
      } catch (error) {
        // Mark as error in confirmed state
        setConfirmedMessages((prev) => [
          ...prev,
          {
            ...optimisticMessage,
            status: 'error' as const,
            error: error instanceof Error ? error.message : 'Failed to send',
          },
        ])

        onError?.(error as Error, optimisticMessage)
      } finally {
        setSending((prev) => {
          const next = new Set(prev)
          next.delete(optimisticId)
          return next
        })
      }
    },
    [onSend, onConfirm, onError, addOptimisticMessage]
  )

  // Retry failed message
  const retry = React.useCallback(
    async (messageId: string) => {
      const message = confirmedMessages.find((m) => m.id === messageId)
      if (!message || message.status !== 'error') return

      // Show retry state optimistically
      addOptimisticMessage({ type: 'retry', id: messageId })
      setSending((prev) => new Set(prev).add(messageId))

      try {
        const confirmedMessage = await onSend(message.content)

        setConfirmedMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? { ...confirmedMessage, isOptimistic: false }
              : msg
          )
        )

        onConfirm?.(confirmedMessage)
      } catch (error) {
        setConfirmedMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  status: 'error' as const,
                  error:
                    error instanceof Error ? error.message : 'Failed to send',
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
    [confirmedMessages, onSend, onConfirm, onError, addOptimisticMessage]
  )

  // Cancel optimistic message
  const cancel = React.useCallback(
    (messageId: string) => {
      addOptimisticMessage({ type: 'remove', id: messageId })
      setConfirmedMessages((prev) => prev.filter((msg) => msg.id !== messageId))
      setSending((prev) => {
        const next = new Set(prev)
        next.delete(messageId)
        return next
      })
    },
    [addOptimisticMessage]
  )

  // Set messages from server
  const setMessages = React.useCallback((messages: Message[]) => {
    setConfirmedMessages(
      messages.map((m) => ({ ...m, isOptimistic: false } as OptimisticMessage))
    )
  }, [])

  return {
    messages: optimisticMessages,
    sendOptimistic,
    setMessages,
    isSending,
    retry,
    cancel,
  }
}

/**
 * Simple optimistic state hook (generic)
 *
 * Uses React 19's useOptimistic for simpler state management.
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

  // React 19's useOptimistic - returns [optimisticState, addOptimistic]
  const [optimisticState, setOptimisticState] = React.useOptimistic(
    serverState,
    (_current: T, newState: T) => newState
  )

  const [isPending, startTransition] = React.useTransition()

  const update = React.useCallback(
    async (newState: T) => {
      // Apply optimistically using React 19's useOptimistic
      startTransition(async () => {
        setOptimisticState(newState)

        try {
          const confirmedState = await onUpdate(newState)
          onConfirm?.(confirmedState)
        } catch (error) {
          onError?.(error as Error, newState)
        }
      })
    },
    [onUpdate, onConfirm, onError, setOptimisticState]
  )

  const revert = React.useCallback(() => {
    // React 19's useOptimistic automatically reverts when the transition completes
    // No manual revert needed - the state will sync with serverState
  }, [])

  return {
    state: optimisticState,
    update,
    isPending,
    revert,
  }
}
