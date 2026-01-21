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
import {
  useClarityChat,
  type UseClarityChatOptions,
  type UseClarityChatReturn,
} from './use-clarity-chat'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'
import {
  validateApiEndpoint,
  validateStorageKey,
} from '../../utils/config/runtime-validation'
import type { Message } from '../../types/messages'

// ============================================================================
// TYPES
// ============================================================================

export interface UseChatOptions extends UseClarityChatOptions {
  /** Persist messages to localStorage */
  persistMessages?: boolean
  /** Key for localStorage */
  storageKey?: string
  /** Auto-scroll to bottom on new messages */
  autoScroll?: boolean
  /** Chat ID for message conversion */
  chatId?: string
}

export interface UseChatReturn {
  /** Converted messages */
  messages: Message[]
  /** Send a message */
  sendMessage: (content: string) => Promise<string | null>
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | undefined
  /** Current input value */
  input: string
  /** Set input value */
  setInput: (value: string) => void
  /** Clear all messages */
  clearMessages: () => void
  /** Stop current generation */
  stop: () => void
  /** Reload last message */
  reload: () => Promise<string | null>
  /** Full access to underlying hook */
  chat: UseClarityChatReturn
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

/**
 * useChat - Simplified chat hook with sensible defaults
 *
 * This hook provides a simpler API than useClarityChat while maintaining
 * access to all advanced features through the `chat` property.
 *
 * @param options - Configuration options
 * @returns Simplified chat interface + full chat object
 *
 * @deprecated Use `useClarityChat` directly instead. This wrapper will be removed in v2.0.
 */
export function useChat(options: UseChatOptions = {}): UseChatReturn {
  // Deprecation warning
  if (process.env['NODE_ENV'] === 'development') {
    console.warn(
      '[Clarity Chat] useChat is deprecated. Use useClarityChat directly for better ' +
        'TypeScript support and direct access to all features. ' +
        'See: https://clarity-chat.dev/docs/migration/deprecated-hooks'
    )
  }

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
    async (content: string) => {
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
  }, [])

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

// Re-export useClarityChat for convenience
export { useClarityChat }
