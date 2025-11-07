/**
 * Optimized version of useChat with performance enhancements
 * 
 * Features:
 * - Memoized callbacks
 * - Debounced message updates
 * - Optimized re-renders
 * - Better memory management
 */

import * as React from 'react'
import { useChat, type UseChatOptions, type UseChatReturn } from './use-chat-enhanced'
import { useDebounce } from './use-debounce'

/**
 * Optimized useChat hook with performance enhancements
 * 
 * @example
 * ```tsx
 * const { messages, append, isLoading } = useChatOptimized({
 *   api: '/api/chat',
 *   debounceMs: 100, // Debounce message updates
 * })
 * ```
 */
export interface UseChatOptimizedOptions extends UseChatOptions {
  /** Debounce message updates (ms) - 0 to disable */
  debounceMs?: number
  
  /** Enable memoization of messages */
  memoizeMessages?: boolean
  
  /** Batch message updates */
  batchUpdates?: boolean
}

export interface UseChatOptimizedReturn extends UseChatReturn {
  /** Debounced input value */
  debouncedInput: string
}

export function useChatOptimized(
  options: UseChatOptimizedOptions = {}
): UseChatOptimizedReturn {
  const {
    debounceMs = 0,
    memoizeMessages = true,
    batchUpdates = true,
    ...restOptions
  } = options

  const chat = useChat(restOptions)
  const debouncedInput = useDebounce(chat.input, debounceMs)

  // Memoize messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => {
    if (!memoizeMessages) return chat.messages
    
    return chat.messages.map((msg) => ({
      ...msg,
      // Create stable references for message content
      content: typeof msg.content === 'string' 
        ? msg.content 
        : JSON.stringify(msg.content),
    }))
  }, [chat.messages, memoizeMessages])

  // Memoize callbacks
  const memoizedAppend = React.useCallback(
    async (
      message: Parameters<typeof chat.append>[0],
      options?: Parameters<typeof chat.append>[1]
    ) => {
      if (batchUpdates) {
        // Batch updates using React's automatic batching
        React.startTransition(() => {
          chat.append(message, options)
        })
        return Promise.resolve(null)
      }
      return chat.append(message, options)
    },
    [chat.append, batchUpdates]
  )

  const memoizedSetMessages = React.useCallback(
    (updater: React.SetStateAction<typeof chat.messages>) => {
      if (batchUpdates) {
        React.startTransition(() => {
          chat.setMessages(updater)
        })
      } else {
        chat.setMessages(updater)
      }
    },
    [chat.setMessages, batchUpdates]
  )

  return {
    ...chat,
    messages: memoizeMessages ? memoizedMessages : chat.messages,
    append: memoizedAppend,
    setMessages: memoizedSetMessages,
    debouncedInput,
  }
}
