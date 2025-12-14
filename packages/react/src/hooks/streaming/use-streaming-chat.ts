/**
 * useStreamingChat - Top-level hook for streaming chat
 *
 * Drop-in ready hook for streaming chat with automatic protocol handling.
 *
 * @example
 * ```tsx
 * const chat = useStreamingChat({
 *   api: '/api/chat/stream',
 *   protocol: 'sse',
 * })
 *
 * await chat.send('Hello')
 * ```
 */

'use client'

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'
import { convertCoreMessagesToMessages } from '../../utils/message'
import {
  validateApiEndpoint,
  validateStreamingProtocol,
} from '../utils/runtime-validation'
import type { Message } from '@clarity-chat/types'

/**
 * Options for useStreamingChat
 */
export interface UseStreamingChatOptions {
  /** API endpoint */
  api: string
  /** Streaming protocol */
  protocol?: 'sse' | 'websocket'
  /** Additional options */
  options?: Omit<UseClarityChatOptions, 'api' | 'transport'>
}

/**
 * Return type for useStreamingChat
 */
export interface UseStreamingChatReturn {
  /** Messages (already converted) */
  messages: Message[]
  /** Send a message */
  send: (content: string) => Promise<void>
  /** Whether streaming is active */
  isStreaming: boolean
  /** Current error */
  error: Error | null
}

/**
 * useStreamingChat - Top-level streaming hook
 *
 * Provides a simple API for streaming chat with automatic
 * protocol selection and message conversion.
 *
 * @param options - Configuration options for streaming chat
 * @param options.api - API endpoint for streaming chat
 * @param options.protocol - Streaming protocol ('sse' or 'websocket', default: 'sse')
 * @param options.options - Additional chat options (optional)
 *
 * @returns Streaming chat instance with messages, send method, streaming state, and error
 *
 * @throws {Error} If streaming connection fails or message sending fails
 *
 * @example
 * ```tsx
 * const chat = useStreamingChat({
 *   api: '/api/chat/stream',
 *   protocol: 'sse',
 * })
 *
 * await chat.send('Hello, world!')
 * // Messages will stream in automatically
 * ```
 */
export function useStreamingChat(
  options: UseStreamingChatOptions
): UseStreamingChatReturn {
  const { api, protocol = 'sse', options: chatOptions } = options

  // Runtime validation
  React.useEffect(() => {
    try {
      validateApiEndpoint(api)
      validateStreamingProtocol(protocol)
    } catch (error) {
      if (process.env['NODE_ENV'] === 'development') {
        console.error('[useStreamingChat] Validation error:', error)
        throw error
      }
    }
  }, [api, protocol])

  const chat = useClarityChat({
    api,
    transport: protocol,
    ...chatOptions,
  })

  const messages = React.useMemo(() => {
    return convertCoreMessagesToMessages(chat.messages)
  }, [chat.messages])

  const send = React.useCallback(
    async (content: string) => {
      await chat.append({ role: 'user', content })
    },
    [chat]
  )

  return {
    messages,
    send,
    isStreaming: chat.isLoading,
    error: chat.error ?? null,
  }
}
