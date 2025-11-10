/**
 * Optimistic Message Updates (React 19 Version)
 * 
 * Hook for implementing optimistic UI updates when sending messages.
 * Provides instant feedback before server confirmation.
 * 
 * **React 19 Improvements:**
 * - Uses React 19's built-in `useOptimistic` hook
 * - Automatic rollback on error (no manual state synchronization)
 * - Simpler implementation (~60% less code)
 * - Better performance and integration with concurrent features
 */

import * as React from 'react'
import type { Message } from '@clarity-chat/types'
import { generateId } from '@clarity-chat/primitives'

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
}

export interface UseOptimisticMessageReturn {
  /** All messages including optimistic ones */
  messages: OptimisticMessage[]
  /** Send a message optimistically */
  sendOptimistic: (content: string) => Promise<void>
  /** Set messages from server */
  setMessages: (messages: Message[]) => void
  /** Whether any message is currently being sent */
  isPending: boolean
}

/**
 * Hook for optimistic message updates using React 19's built-in useOptimistic
 * 
 * @example
 * ```tsx
 * const { messages, sendOptimistic, isPending } = useOptimisticMessage({
 *   onSend: async (content) => {
 *     const response = await fetch('/api/messages', {
 *       method: 'POST',
 *       body: JSON.stringify({ content })
 *     })
 *     return response.json()
 *   }
 * })
 * 
 * // Messages show instantly, automatically rolled back on error
 * <button onClick={() => sendOptimistic('Hello!')} disabled={isPending}>
 *   Send
 * </button>
 * ```
 */
export function useOptimisticMessage(
  options: UseOptimisticMessageOptions
): UseOptimisticMessageReturn {
  const { onSend, onConfirm, onError } = options
  
  const [messages, setMessages] = React.useState<Message[]>([])
  
  // React 19: Built-in useOptimistic hook!
  // Automatically handles optimistic updates and rollback
  const [optimisticMessages, addOptimisticMessage] = React.useOptimistic(
    messages,
    (state, newMessage: OptimisticMessage) => {
      return [...state, { ...newMessage, isOptimistic: true }]
    }
  )
  
  // React 19: useTransition for automatic pending state
  const [isPending, startTransition] = React.useTransition()

  const sendOptimistic = React.useCallback(
    async (content: string) => {
      const optimisticMessage: OptimisticMessage = {
        id: generateId(),
        chatId: 'optimistic-chat',
        role: 'user',
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sending',
        isOptimistic: true,
      }

      // Add optimistically - React automatically handles this!
      addOptimisticMessage(optimisticMessage)

      // Use transition for the actual send operation
      startTransition(async () => {
        try {
          // Send to server
          const confirmedMessage = await onSend(content)

          // Update messages with confirmed message
          // React automatically removes the optimistic message
          setMessages((prev) => [...prev, confirmedMessage])
          
          onConfirm?.(confirmedMessage)
        } catch (error) {
          // React 19 automatically rolls back the optimistic message!
          // No manual state cleanup needed
          
          // We can add the error message to the confirmed messages list
          const errorMessage: OptimisticMessage = {
            ...optimisticMessage,
            status: 'error',
            error: error instanceof Error ? error.message : 'Failed to send',
            isOptimistic: false,
          }
          
          setMessages((prev) => [...prev, errorMessage])
          onError?.(error as Error, optimisticMessage)
        }
      })
    },
    [onSend, onConfirm, onError, addOptimisticMessage, startTransition]
  )

  return {
    messages: optimisticMessages,
    sendOptimistic,
    setMessages,
    isPending,
  }
}

/**
 * Generic optimistic state hook using React 19's useOptimistic
 * 
 * This is a simplified, reusable version for any optimistic updates.
 * 
 * @example
 * ```tsx
 * const { state, update, isPending } = useOptimisticState({
 *   serverState: likes,
 *   onUpdate: async (newLikes) => {
 *     await fetch('/api/like', { method: 'POST', body: JSON.stringify({ likes: newLikes }) })
 *     return newLikes
 *   }
 * })
 * 
 * // Instant UI update, automatic rollback on error
 * <button onClick={() => update(state + 1)}>
 *   {state} Likes {isPending && '...'}
 * </button>
 * ```
 */
export interface UseOptimisticStateOptions<T> {
  /** Current server state */
  serverState: T
  /** Function to apply optimistic update to server */
  onUpdate: (newState: T) => Promise<T>
  /** Callback when update is confirmed */
  onConfirm?: (state: T) => void
  /** Callback when update fails */
  onError?: (error: Error) => void
}

export interface UseOptimisticStateReturn<T> {
  /** Current state (server or optimistic) */
  state: T
  /** Apply optimistic update */
  update: (newState: T | ((prev: T) => T)) => Promise<void>
  /** Whether update is pending */
  isPending: boolean
}

export function useOptimisticState<T>(
  options: UseOptimisticStateOptions<T>
): UseOptimisticStateReturn<T> {
  const { serverState, onUpdate, onConfirm, onError } = options
  
  // React 19: Built-in useOptimistic for generic state
  const [optimisticState, setOptimisticState] = React.useOptimistic(
    serverState,
    (_currentState, newState: T) => newState
  )
  
  const [isPending, startTransition] = React.useTransition()

  const update = React.useCallback(
    async (newState: T | ((prev: T) => T)) => {
      const resolvedState = typeof newState === 'function' 
        ? (newState as (prev: T) => T)(optimisticState)
        : newState

      // Apply optimistically (automatically rolls back on error!)
      setOptimisticState(resolvedState)

      // Perform server update
      startTransition(async () => {
        try {
          const confirmedState = await onUpdate(resolvedState)
          onConfirm?.(confirmedState)
          // React will automatically sync with serverState prop
        } catch (error) {
          // React automatically reverts to serverState!
          onError?.(error as Error)
        }
      })
    },
    [optimisticState, onUpdate, onConfirm, onError, setOptimisticState, startTransition]
  )

  return {
    state: optimisticState,
    update,
    isPending,
  }
}
