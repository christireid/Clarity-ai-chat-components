/**
 * useChatSimple - Simplified chat hook
 *
 * A simplified version of useClarityChat that returns messages in the correct format
 * without needing manual conversion. Perfect for when you want more control than
 * ClarityChat component but don't need all the advanced features.
 *
 * @example
 * ```tsx
 * import { useChatSimple, ChatWindow } from '@clarity-chat/react'
 *
 * function App() {
 *   const { messages, sendMessage, isLoading } = useChatSimple({ api: '/api/chat' })
 *
 *   return (
 *     <ChatWindow
 *       messages={messages}
 *       isLoading={isLoading}
 *       onSendMessage={sendMessage}
 *     />
 *   )
 * }
 * ```
 */

'use client'

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'
import type { Message } from '@clarity-chat/types'

/** Request body data for chat API */
export type ChatRequestBody = Record<
  string,
  string | number | boolean | string[] | number[] | null
>

/**
 * Simplified options - only the essentials
 */
export interface UseChatSimpleOptions {
  /** API endpoint URL */
  api: string
  /** Initial messages (optional) */
  initialMessages?: Message[]
  /** Additional body data */
  body?: ChatRequestBody
  /** Custom headers */
  headers?: Record<string, string>
  /** Callback when message is sent */
  onMessageSent?: (message: Message) => void
  /** Callback when message is received */
  onMessageReceived?: (message: Message) => void
  /** Callback on error */
  onError?: (error: Error) => void
}

/**
 * Return type for useChatSimple
 */
export interface UseChatSimpleReturn {
  /** Messages in Message[] format (already converted) */
  messages: Message[]
  /** Send a message (simplified API) */
  sendMessage: (content: string) => Promise<void>
  /** Whether a message is currently being sent */
  isLoading: boolean
  /** Current error, if any */
  error: Error | null
  /** Clear all messages */
  clearMessages: () => void
}

/**
 * useChatSimple - Simplified chat hook
 *
 * Returns messages in the correct format without manual conversion.
 * Provides a simpler API than useClarityChat for common use cases.
 */
export function useChatSimple(
  options: UseChatSimpleOptions
): UseChatSimpleReturn {
  const {
    api,
    initialMessages = [],
    onMessageSent,
    onMessageReceived,
    onError,
    ...rest
  } = options

  // Convert initial messages to CoreMessage format
  const initialCoreMessages = React.useMemo(() => {
    return initialMessages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    }))
  }, [initialMessages])

  // Use the flagship hook
  const chat = useClarityChat({
    api,
    initialMessages: initialCoreMessages,
    ...rest,
    onFinish: (message) => {
      const converted = convertCoreMessagesToMessages([message])[0]
      onMessageReceived?.(converted)
    },
    onError: (error) => {
      onError?.(error)
    },
  })

  // Convert messages automatically
  const messages = React.useMemo(() => {
    return convertCoreMessagesToMessages(chat.messages)
  }, [chat.messages])

  // Simplified sendMessage function
  const sendMessage = React.useCallback(
    async (content: string) => {
      try {
        // Create user message for callback
        const userMessage: Message = {
          id: `msg-${Date.now()}`,
          chatId: 'default',
          role: 'user',
          content,
          status: 'sending',
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        onMessageSent?.(userMessage)

        await chat.append({
          role: 'user',
          content,
        })
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error('Failed to send message')
        onError?.(error)
        // Log error for debugging
        if (process.env['NODE_ENV'] === 'development') {
          console.error('[useChatSimple] Send failed:', error)
        }
        throw error
      }
    },
    [chat.append, onMessageSent, onError]
  )

  // Clear all messages
  const clearMessages = React.useCallback(() => {
    // Note: This is a simplified implementation
    // For full message management, use useChatWithOperations
    chat.setMessages([])
  }, [chat])

  return {
    messages,
    sendMessage,
    isLoading: chat.isLoading,
    error: chat.error ?? null,
    clearMessages,
  }
}
