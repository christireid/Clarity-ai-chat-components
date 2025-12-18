/**
 * useChatHandlers - Mid-Level Handler Hook
 * 
 * Provides pre-configured handlers for common chat operations, eliminating
 * boilerplate when using useClarityChat with ChatWindow.
 * 
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat State
 * 
 * This hook wraps common patterns like sending messages, clearing chat,
 * retrying messages, and editing messages with proper error handling.
 * 
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom handlers, use low-level `useClarityChat` directly.
 * 
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 * 
 * <ChatWindow
 *   messages={chat.messages}
 *   onSendMessage={handlers.onSendMessage}
 *   onClear={handlers.onClear}
 *   onMessageRetry={handlers.onRetry}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // With callbacks
 * const handlers = useChatHandlers({
 *   chat,
 *   onMessageSent: (content) => logger.debug('Sent:', content),
 *   onMessageError: (error) => logger.error('Error:', error),
 * })
 * ```
 */

'use client'

import * as React from 'react'
import type { UseClarityChatReturn } from './use-clarity-chat'
import type { CoreMessage } from './use-chat-enhanced'

/**
 * Options for useChatHandlers
 */
export interface UseChatHandlersOptions {
  /** The chat instance from useClarityChat */
  chat: UseClarityChatReturn
  /** Optional callback when message is sent */
  onMessageSent?: (content: string) => void | Promise<void>
  /** Optional callback when message send fails */
  onMessageError?: (error: Error) => void
}

/**
 * Pre-configured handlers for ChatWindow
 * 
 * All handlers follow consistent patterns with built-in error handling.
 */
export interface ChatHandlers {
  /** Handler for sending messages - wraps chat.append with error handling (action) */
  onSendMessage: (content: string) => Promise<void>
  
  /** Handler for clearing messages (action) */
  onClear: () => void
  
  /** Handler for retrying a message (action) */
  onRetry: (messageId: string) => Promise<void>
  
  /** Handler for editing a message (action) */
  onEdit: (messageId: string, newContent: string) => Promise<void>
}

/**
 * Creates pre-configured handlers for ChatWindow
 * 
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 * 
 * return (
 *   <ChatWindow
 *     messages={chat.messages}
 *     isLoading={chat.isLoading}
 *     onSendMessage={handlers.onSendMessage}
 *     onClear={handlers.onClear}
 *   />
 * )
 * ```
 */
export function useChatHandlers({
  chat,
  onMessageSent,
  onMessageError,
}: UseChatHandlersOptions): ChatHandlers {
  const handleSendMessage = React.useCallback(
    async (content: string) => {
      try {
        await chat.append({ role: 'user', content })
        await onMessageSent?.(content)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onMessageError?.(err)
        throw err
      }
    },
    [chat, onMessageSent, onMessageError]
  )

  const handleClear = React.useCallback(() => {
    chat.setMessages([])
  }, [chat])

  const handleRetry = React.useCallback(
    async (messageId: string) => {
      try {
        // Find the message and resend
        const message = chat.messages.find((m) => m.id === messageId)
        if (message && message.role === 'user') {
          await chat.append({ role: 'user', content: String(message.content) })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onMessageError?.(err)
        throw err
      }
    },
    [chat, onMessageError]
  )

  const handleEdit = React.useCallback(
    async (messageId: string, newContent: string) => {
      try {
        // Remove messages after the edited one
        const messageIndex = chat.messages.findIndex((m) => m.id === messageId)
        if (messageIndex >= 0) {
          const newMessages = chat.messages.slice(0, messageIndex)
          chat.setMessages(newMessages)
          // Send the edited message
          await chat.append({ role: 'user', content: newContent })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onMessageError?.(err)
        throw err
      }
    },
    [chat, onMessageError]
  )

  return {
    onSendMessage: handleSendMessage,
    onClear: handleClear,
    onRetry: handleRetry,
    onEdit: handleEdit,
  }
}
