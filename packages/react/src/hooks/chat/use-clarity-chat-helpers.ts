import { logger } from '@clarity-chat/utils/logger';
/**
 * Helper Hooks for useClarityChat
 *
 * Common patterns and utilities built on top of useClarityChat
 */

'use client'

import * as React from 'react'
import { useClarityChat, type UseClarityChatOptions } from './use-clarity-chat'
import type { CoreMessage } from './use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import type { Message } from '@clarity-chat/types'

/**
 * useClarityChatWithWindow - Pre-configured hook for ChatWindow component
 *
 * Automatically converts messages and provides ChatWindow-compatible interface.
 * This is now mainly for backward compatibility - consider using ClarityChat component instead.
 *
 * @deprecated Consider using the ClarityChat component for a simpler API
 * @example
 * ```tsx
 * // Old way (still works)
 * const { messages, handleSendMessage, isLoading } = useClarityChatWithWindow({ api: '/api/chat' })
 *
 * // New way (recommended)
 * <ClarityChat api="/api/chat" />
 * ```
 */
export function useClarityChatWithWindow(options: UseClarityChatOptions = {}) {
  const chat = useClarityChat(options)

  const chatId =
    typeof options.id === 'function' ? options.id() : options.id || 'default'
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages, chatId),
    [chat.messages, chatId]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await chat.append({
        role: 'user',
        content,
      })
    },
    [chat]
  )

  return {
    ...chat,
    messages, // Converted to Message[] format
    handleSendMessage,
  }
}

/**
 * useClarityChatWithAnalytics - Hook with built-in analytics tracking
 */
export function useClarityChatWithAnalytics(
  options: UseClarityChatOptions & {
    analytics?: {
      trackMessageSent?: (content: string) => void
      trackMessageReceived?: (message: CoreMessage) => void
      trackError?: (error: Error) => void
      trackMemoryOperation?: (operation: 'query' | 'store') => void
    }
  } = {}
) {
  const { analytics, ...chatOptions } = options

  const chat = useClarityChat({
    ...chatOptions,
    memory: chatOptions.memory
      ? {
          ...chatOptions.memory,
          onMemoryError: (error, operation) => {
            analytics?.trackMemoryOperation?.(operation)
            analytics?.trackError?.(error)
            chatOptions.memory?.onMemoryError?.(error, operation)
          },
        }
      : undefined,
    onFinish: async (message) => {
      analytics?.trackMessageReceived?.(message)
      await chatOptions.onFinish?.(message)
    },
  })

  const enhancedAppend = React.useCallback(
    async (
      message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>,
      options?: { data?: Record<string, any> }
    ) => {
      if (message.role === 'user') {
        const content =
          typeof message.content === 'string'
            ? message.content
            : JSON.stringify(message.content)
        analytics?.trackMessageSent?.(content)
      }
      return chat.append(message, options)
    },
    [chat.append, analytics]
  )

  return {
    ...chat,
    append: enhancedAppend,
  }
}

/**
 * useClarityChatWithPersistence - Hook with local storage persistence
 */
export function useClarityChatWithPersistence(
  options: UseClarityChatOptions & {
    storageKey?: string
    persistMessages?: boolean
    persistInput?: boolean
  } = {}
) {
  const {
    storageKey = 'clarity-chat',
    persistMessages = true,
    persistInput = true,
    ...chatOptions
  } = options

  // Load persisted state
  const [persistedMessages, setPersistedMessages] = React.useState<
    CoreMessage[]
  >(() => {
    if (!persistMessages) return []
    try {
      const stored = localStorage.getItem(`${storageKey}-messages`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  const [persistedInput, setPersistedInput] = React.useState<string>(() => {
    if (!persistInput) return ''
    try {
      return localStorage.getItem(`${storageKey}-input`) || ''
    } catch {
      return ''
    }
  })

  const chat = useClarityChat({
    ...chatOptions,
    initialMessages: chatOptions.initialMessages || persistedMessages,
  })

  // Persist messages
  React.useEffect(() => {
    if (persistMessages && chat.messages.length > 0) {
      try {
        localStorage.setItem(
          `${storageKey}-messages`,
          JSON.stringify(chat.messages)
        )
      } catch (error) {
        logger.warn('Failed to persist messages:', error)
      }
    }
  }, [chat.messages, persistMessages, storageKey])

  // Persist input
  React.useEffect(() => {
    if (persistInput) {
      try {
        localStorage.setItem(`${storageKey}-input`, chat.input)
      } catch (error) {
        logger.warn('Failed to persist input:', error)
      }
    }
  }, [chat.input, persistInput, storageKey])

  // Clear persistence
  const clearPersistence = React.useCallback(() => {
    try {
      localStorage.removeItem(`${storageKey}-messages`)
      localStorage.removeItem(`${storageKey}-input`)
    } catch (error) {
      logger.warn('Failed to clear persistence:', error)
    }
  }, [storageKey])

  return {
    ...chat,
    clearPersistence,
  }
}

/**
 * useClarityChatWithDebounce - Hook with debounced input
 */
export function useClarityChatWithDebounce(
  options: UseClarityChatOptions & {
    debounceMs?: number
  } = {}
) {
  const { debounceMs = 300, ...chatOptions } = options

  const chat = useClarityChat(chatOptions)
  const [debouncedInput, setDebouncedInput] = React.useState(chat.input)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(chat.input)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [chat.input, debounceMs])

  return {
    ...chat,
    debouncedInput,
  }
}

/**
 * useClarityChatWithAutoSave - Hook with automatic draft saving
 */
export function useClarityChatWithAutoSave(
  options: UseClarityChatOptions & {
    autoSaveKey?: string
    autoSaveInterval?: number
  } = {}
) {
  const {
    autoSaveKey = 'clarity-chat-draft',
    autoSaveInterval = 5000, // 5 seconds
    ...chatOptions
  } = options

  const chat = useClarityChat(chatOptions)

  // Auto-save input as draft
  React.useEffect(() => {
    if (!chat.input) {
      try {
        localStorage.removeItem(autoSaveKey)
      } catch {
        // Ignore
      }
      return
    }

    const interval = setInterval(() => {
      try {
        localStorage.setItem(autoSaveKey, chat.input)
      } catch (error) {
        logger.warn('Failed to auto-save draft:', error)
      }
    }, autoSaveInterval)

    return () => clearInterval(interval)
  }, [chat.input, autoSaveKey, autoSaveInterval])

  // Load draft on mount
  React.useEffect(() => {
    try {
      const draft = localStorage.getItem(autoSaveKey)
      if (draft) {
        chat.setInput(draft)
      }
    } catch {
      // Ignore
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const clearDraft = React.useCallback(() => {
    try {
      localStorage.removeItem(autoSaveKey)
      chat.setInput('')
    } catch (error) {
      logger.warn('Failed to clear draft:', error)
    }
  }, [autoSaveKey, chat.setInput])

  return {
    ...chat,
    clearDraft,
  }
}
