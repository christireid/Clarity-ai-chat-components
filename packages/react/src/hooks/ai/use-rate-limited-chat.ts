/**
 * Rate-Limited Chat Hook
 *
 * Provides AI chat functionality with automatic rate limiting, request queuing,
 * and user feedback during queue delays.
 */

'use client'

import * as React from 'react'
import {
  useClarityChat,
  type UseClarityChatOptions,
} from '../chat/use-clarity-chat'
import type { CoreMessage } from '../use-clarity-chat/types'
import { useRequestQueue, type QueuedRequest } from '../../utils/request-queue'
import { ProviderError } from '../../utils/error-handling/provider-error'

export interface RateLimitedChatOptions extends UseClarityChatOptions {
  /** Enable rate limiting */
  enableRateLimiting?: boolean
  /** Maximum concurrent requests */
  maxConcurrent?: number
  /** Maximum queue size */
  maxQueueSize?: number
  /** Rate limit check function */
  rateLimitCheck?: () => Promise<{ allowed: boolean; resetAt: number }>
  /** Callback when request is queued */
  onRequestQueued?: (position: number, estimatedWaitMs: number) => void
  /** Callback when rate limit is hit */
  onRateLimited?: (resetAt: number) => void
  /** Callback when queue is full */
  onQueueFull?: () => void
}

export interface RateLimitedChatReturn {
  /** Chat functionality */
  messages: any[]
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  append: (message: any) => Promise<string | null>
  isLoading: boolean
  error: Error | undefined
  stop: () => void
  reload: () => void

  /** Queue status */
  queueStatus: {
    queueLength: number
    activeCount: number
    maxConcurrent: number
    maxQueueSize: number
  }

  /** Rate limiting status */
  isRateLimited: boolean
  rateLimitResetAt: number | null

  /** Queue management */
  clearQueue: () => void
}

/**
 * Hook that provides rate-limited chat functionality with automatic queuing
 */
export function useRateLimitedChat(
  options: RateLimitedChatOptions = {}
): RateLimitedChatReturn {
  const {
    enableRateLimiting = true,
    maxConcurrent = 3,
    maxQueueSize = 20,
    rateLimitCheck,
    onRequestQueued,
    onRateLimited,
    onQueueFull,
    ...chatOptions
  } = options

  const [isRateLimited, setIsRateLimited] = React.useState(false)
  const [rateLimitResetAt, setRateLimitResetAt] = React.useState<number | null>(
    null
  )

  // Base chat hook
  const chat = useClarityChat(chatOptions)

  // Request queue
  const queue = useRequestQueue({
    maxConcurrent,
    maxQueueSize,
    rateLimitCheck:
      rateLimitCheck || (async () => ({ allowed: true, resetAt: 0 })),
    onQueueFull: (request) => {
      console.warn(
        '[useRateLimitedChat] Queue full, rejecting request:',
        request.id
      )
      onQueueFull?.()
    },
    onRateLimited: (request, resetAt) => {
      console.warn(
        '[useRateLimitedChat] Rate limited, queuing request:',
        request.id
      )
      setIsRateLimited(true)
      setRateLimitResetAt(resetAt)
      onRateLimited?.(resetAt)
    },
  })

  // Enhanced append function with queuing
  const appendWithQueue = React.useCallback(
    async (message: any): Promise<string | null> => {
      if (!enableRateLimiting) {
        return chat.append(message)
      }

      return queue.enqueue(() => chat.append(message), {
        priority: 'normal',
        onQueueUpdate: (position, estimatedWaitMs) => {
          onRequestQueued?.(position, estimatedWaitMs)
        },
        onSuccess: () => {
          setIsRateLimited(false)
          setRateLimitResetAt(null)
        },
        onError: (error) => {
          // Handle rate limit errors
          if (error instanceof ProviderError && error.code === 'RATE_LIMIT') {
            setIsRateLimited(true)
            // The queue will handle retrying
          }
        },
      })
    },
    [enableRateLimiting, queue, onRequestQueued, chat]
  )

  // Clear rate limit status when appropriate
  React.useEffect(() => {
    if (isRateLimited && rateLimitResetAt && Date.now() > rateLimitResetAt) {
      setIsRateLimited(false)
      setRateLimitResetAt(null)
    }
  }, [isRateLimited, rateLimitResetAt])

  return {
    // Chat functionality
    messages: chat.messages,
    setMessages: chat.setMessages,
    append: appendWithQueue,
    isLoading: chat.isLoading,
    error: chat.error,
    stop: chat.stop,
    reload: chat.reload,

    // Queue status
    queueStatus: queue.getStatus(),

    // Rate limiting status
    isRateLimited,
    rateLimitResetAt,

    // Queue management
    clearQueue: queue.clear,
  }
}
