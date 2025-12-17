/**
 * useChat - Unified chat hook with sensible defaults
 *
 * This is a simplified wrapper around useClarityChat that provides:
 * - Automatic message conversion
 * - Better defaults
 * - Common patterns built-in
 *
 * For maximum simplicity, use the ClarityChat component instead.
 * For maximum control, use useClarityChat directly.
 *
 * @example
 * ```tsx
 * // Simple usage
 * const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
 *
 * // With options
 * const chat = useChat({
 *   api: '/api/chat',
 *   autoScroll: true,
 *   persistMessages: true,
 * })
 * ```
 */

'use client'

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import type { Message } from '@clarity-chat/types'
import {
  validateApiEndpoint,
  validateStorageKey,
} from '../utils/runtime-validation'

export interface UseChatOptions extends UseClarityChatOptions {
  /** Enable automatic message persistence to localStorage (default: false) */
  persistMessages?: boolean
  /** Storage key for persistence (default: 'clarity-chat') */
  storageKey?: string
  /** Enable auto-scroll (default: true) */
  autoScroll?: boolean
  /** Chat ID for message grouping (default: 'default') */
  chatId?: string
}

export interface UseChatReturn {
  /** Messages in Message[] format (ready for ChatWindow) */
  messages: Message[]
  /** Send a message (simplified API). Returns message ID if successful. */
  sendMessage: (content: string) => Promise<string | null>
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | undefined
  /** Input value */
  input: string
  /** Set input value */
  setInput: (value: string) => void
  /** Clear all messages */
  clearMessages: () => void
  /** Stop the current generation */
  stop: () => void
  /** Reload/retry the last message */
  reload: () => Promise<string | null>
  /** All original useClarityChat return values for advanced use cases */
  chat: ReturnType<typeof useClarityChat>
}

/**
 * useChat - Simplified chat hook with sensible defaults
 *
 * This hook provides a simpler API than useClarityChat while maintaining
 * access to all advanced features through the `chat` property.
 *
 * @param options - Configuration options
 * @returns Simplified chat interface + full chat object
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  // Runtime validation with developer-friendly errors
  if (options.api) {
    validateApiEndpoint(options.api, 'useChat')
  }

  // Validate storageKey if persistence is enabled
  if (options.persistMessages && options.storageKey) {
    validateStorageKey(options.storageKey, 'useChat')
  }

  const {
    persistMessages = false,
    storageKey = 'clarity-chat',
    autoScroll = true,
    chatId = 'default',
    ...chatOptions
  } = options

  // Use the underlying hook
  const chat = useClarityChat(chatOptions)

  // Convert messages automatically
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages, chatId),
    [chat.messages, chatId]
  )

  // Simplified send message function - returns message ID for tracking
  const sendMessage = React.useCallback(
    async (content: string): Promise<string | null> => {
      return chat.append({
        role: 'user',
        content,
      })
    },
    [chat]
  )

  // Clear messages helper
  const clearMessages = React.useCallback(() => {
    chat.setMessages([])
    if (persistMessages) {
      try {
        localStorage.removeItem(`${storageKey}-messages`)
      } catch {
        // Ignore
      }
    }
  }, [chat, persistMessages, storageKey])

  // Persist messages if enabled
  React.useEffect(() => {
    if (persistMessages && messages.length > 0) {
      try {
        localStorage.setItem(
          `${storageKey}-messages`,
          JSON.stringify(chat.messages) // Store CoreMessage[] format
        )
      } catch (error) {
        console.warn('[useChat] Failed to persist messages:', error)
      }
    }
  }, [messages.length, persistMessages, storageKey, chat.messages])

  // Load persisted messages on mount
  React.useEffect(() => {
    if (persistMessages && chat.messages.length === 0) {
      try {
        const stored = localStorage.getItem(`${storageKey}-messages`)
        if (stored) {
          const parsed = JSON.parse(stored)
          chat.setMessages(parsed)
        }
      } catch (error) {
        console.warn('[useChat] Failed to load persisted messages:', error)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll effect
  React.useEffect(() => {
    if (autoScroll && messages.length > 0) {
      const timer = setTimeout(() => {
        const container = document.querySelector('[data-chat-container]')
        if (container) {
          container.scrollTop = container.scrollHeight
        }
      }, 100)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [messages.length, autoScroll])

  return {
    messages,
    sendMessage,
    isLoading: chat.isLoading,
    error: chat.error,
    input: chat.input,
    setInput: chat.setInput,
    clearMessages,
    stop: chat.stop,
    reload: chat.reload,
    chat, // Full access to underlying hook for advanced use cases
  }
}
