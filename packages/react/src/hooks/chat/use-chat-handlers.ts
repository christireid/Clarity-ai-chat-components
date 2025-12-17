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
 * Handler names match ChatWindow props exactly, enabling spread usage.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom handlers, use low-level `useClarityChat` directly.
 *
 * @example Spread all handlers directly to ChatWindow
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 *
 * // All handlers spread directly - no mapping needed!
 * <ChatWindow
 *   messages={chat.messages}
 *   isLoading={chat.isLoading}
 *   {...handlers}
 * />
 * ```
 *
 * @example With callbacks for analytics/logging
 * ```tsx
 * const handlers = useChatHandlers({
 *   chat,
 *   onMessageSent: (content) => console.log('Sent:', content),
 *   onMessageError: (error) => console.error('Error:', error),
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
 * Property names match ChatWindow props for seamless spread usage:
 *
 * @example
 * ```tsx
 * const handlers = useChatHandlers({ chat })
 * <ChatWindow {...handlers} messages={chat.messages} />
 * ```
 */
export interface ChatHandlers {
  /** Handler for sending messages - wraps chat.append with error handling */
  onSendMessage: (content: string) => Promise<void>

  /** Handler for clearing messages */
  onClear: () => void

  /** Handler for stopping the current generation */
  onStopGeneration: () => void

  /** Handler for retrying a message */
  onMessageRetry: (messageId: string) => Promise<void>

  /** Handler for editing a message */
  onEditMessage: (messageId: string, newContent: string) => Promise<void>

  /** Handler for regenerating a message */
  onRegenerateMessage: (messageId: string) => Promise<void>

  /** Handler for deleting a message */
  onDeleteMessage: (messageId: string) => void
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

  const handleStopGeneration = React.useCallback(() => {
    chat.stop()
  }, [chat])

  const handleMessageRetry = React.useCallback(
    async (messageId: string) => {
      try {
        // Find the message and resend
        const message = chat.messages.find((m) => m.id === messageId)
        if (message && message.role === 'user') {
          // Pass content directly - it may be string or multi-part array (CoreMessageContent)
          await chat.append({ role: 'user', content: message.content })
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onMessageError?.(err)
        throw err
      }
    },
    [chat, onMessageError]
  )

  const handleEditMessage = React.useCallback(
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

  const handleRegenerateMessage = React.useCallback(
    async (messageId: string) => {
      try {
        // Find the assistant message and the preceding user message
        const messageIndex = chat.messages.findIndex((m) => m.id === messageId)
        if (messageIndex > 0) {
          // Get the user message before this assistant message
          const userMessage = chat.messages
            .slice(0, messageIndex)
            .reverse()
            .find((m) => m.role === 'user')

          if (userMessage) {
            // Remove the assistant message and resend the user message
            const newMessages = chat.messages.slice(0, messageIndex)
            chat.setMessages(newMessages)
            // Pass content directly - it may be string or multi-part array (CoreMessageContent)
            await chat.append({
              role: 'user',
              content: userMessage.content,
            })
          }
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onMessageError?.(err)
        throw err
      }
    },
    [chat, onMessageError]
  )

  const handleDeleteMessage = React.useCallback(
    (messageId: string) => {
      const newMessages = chat.messages.filter((m) => m.id !== messageId)
      chat.setMessages(newMessages)
    },
    [chat]
  )

  return {
    onSendMessage: handleSendMessage,
    onClear: handleClear,
    onStopGeneration: handleStopGeneration,
    onMessageRetry: handleMessageRetry,
    onEditMessage: handleEditMessage,
    onRegenerateMessage: handleRegenerateMessage,
    onDeleteMessage: handleDeleteMessage,
  }
}
