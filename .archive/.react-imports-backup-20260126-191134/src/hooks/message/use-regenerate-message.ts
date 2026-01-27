'use client'

import * as React from 'react'

/**
 * Message format for regeneration
 */
export interface RegenerateMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  [key: string]: unknown
}

/**
 * Options for useRegenerateMessage hook
 */
export interface UseRegenerateMessageOptions<
  T extends RegenerateMessage = RegenerateMessage,
> {
  /**
   * Current messages array
   */
  messages: T[]

  /**
   * Callback to send a message for regeneration
   * Should trigger a new AI response
   */
  onRegenerate: (message: T) => void | Promise<void>

  /**
   * Callback when messages are updated (e.g., to trim conversation)
   * @param messages - New messages array after trimming
   */
  onMessagesChange?: (messages: T[]) => void

  /**
   * Callback when regeneration starts
   * @param messageId - ID of message being regenerated
   */
  onRegenerateStart?: (messageId: string) => void

  /**
   * Callback when regeneration completes
   * @param messageId - ID of message that was regenerated
   */
  onRegenerateComplete?: (messageId: string) => void

  /**
   * Callback when regeneration fails
   * @param messageId - ID of message that failed
   * @param error - Error that occurred
   */
  onRegenerateError?: (messageId: string, error: Error) => void
}

/**
 * Return type for useRegenerateMessage hook
 */
export interface UseRegenerateMessageReturn {
  /**
   * Regenerate the last assistant message
   * Removes all messages after the last user message and triggers a new response
   * @returns Promise that resolves when regeneration starts (not when it completes)
   */
  regenerateLast: () => Promise<void>

  /**
   * Regenerate from a specific message
   * Removes all messages after the specified message and triggers a new response
   * @param messageId - ID of the message to regenerate from
   * @returns Promise that resolves when regeneration starts
   */
  regenerateFrom: (messageId: string) => Promise<void>

  /**
   * Whether a regeneration is currently in progress
   */
  isRegenerating: boolean

  /**
   * ID of the message currently being regenerated (if any)
   */
  regeneratingMessageId: string | null
}

/**
 * Hook for regenerating assistant messages
 *
 * Provides a clean API for regenerating AI responses by removing old messages
 * and triggering new completions. Handles edge cases like finding the last user
 * message and preventing duplicate regenerations.
 *
 * @example
 * ```tsx
 * const { messages, append, setMessages } = useClarityChat({ api: '/api/chat' })
 *
 * const { regenerateLast, regenerateFrom, isRegenerating } = useRegenerateMessage({
 *   messages,
 *   onRegenerate: async (message) => {
 *     await append(message)
 *   },
 *   onMessagesChange: setMessages,
 * })
 *
 * // Regenerate last assistant response
 * <Button onClick={regenerateLast} disabled={isRegenerating}>
 *   Regenerate
 * </Button>
 *
 * // Regenerate from specific message
 * <Button onClick={() => regenerateFrom('msg-123')}>
 *   Regenerate from here
 * </Button>
 * ```
 */
export function useRegenerateMessage<
  T extends RegenerateMessage = RegenerateMessage,
>(options: UseRegenerateMessageOptions<T>): UseRegenerateMessageReturn {
  const {
    messages,
    onRegenerate,
    onMessagesChange,
    onRegenerateStart,
    onRegenerateComplete,
    onRegenerateError,
  } = options

  const [isRegenerating, setIsRegenerating] = React.useState(false)
  const [regeneratingMessageId, setRegeneratingMessageId] = React.useState<
    string | null
  >(null)

  // Keep a ref to messages to avoid stale closures
  const messagesRef = React.useRef<T[]>(messages)
  React.useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  /**
   * Regenerate the last assistant message
   */
  const regenerateLast = React.useCallback(async () => {
    if (isRegenerating) {
      console.warn(
        '[useRegenerateMessage] Already regenerating, ignoring request'
      )
      return
    }

    const currentMessages = messagesRef.current

    // Find last user message
    let lastUserMessageIndex = -1
    for (let i = currentMessages.length - 1; i >= 0; i--) {
      if (currentMessages[i]?.role === 'user') {
        lastUserMessageIndex = i
        break
      }
    }

    if (lastUserMessageIndex === -1) {
      console.warn(
        '[useRegenerateMessage] No user message found, cannot regenerate'
      )
      return
    }

    const lastUserMessage = currentMessages[lastUserMessageIndex]
    if (!lastUserMessage) return

    setIsRegenerating(true)
    setRegeneratingMessageId(lastUserMessage.id)
    onRegenerateStart?.(lastUserMessage.id)

    try {
      // Trim messages to last user message
      const trimmedMessages = currentMessages.slice(0, lastUserMessageIndex + 1)
      onMessagesChange?.(trimmedMessages)

      // Trigger regeneration
      await onRegenerate(lastUserMessage)

      onRegenerateComplete?.(lastUserMessage.id)
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      onRegenerateError?.(lastUserMessage.id, err)
      throw err
    } finally {
      setIsRegenerating(false)
      setRegeneratingMessageId(null)
    }
  }, [
    isRegenerating,
    onRegenerate,
    onMessagesChange,
    onRegenerateStart,
    onRegenerateComplete,
    onRegenerateError,
  ])

  /**
   * Regenerate from a specific message
   */
  const regenerateFrom = React.useCallback(
    async (messageId: string) => {
      if (isRegenerating) {
        console.warn(
          '[useRegenerateMessage] Already regenerating, ignoring request'
        )
        return
      }

      const currentMessages = messagesRef.current

      // Find the message
      const messageIndex = currentMessages.findIndex((m) => m.id === messageId)
      if (messageIndex === -1) {
        console.warn(`[useRegenerateMessage] Message ${messageId} not found`)
        return
      }

      const message = currentMessages[messageIndex]
      if (!message) return

      // Only regenerate from user messages
      if (message.role !== 'user') {
        console.warn(
          '[useRegenerateMessage] Can only regenerate from user messages'
        )
        return
      }

      setIsRegenerating(true)
      setRegeneratingMessageId(messageId)
      onRegenerateStart?.(messageId)

      try {
        // Trim messages to this message
        const trimmedMessages = currentMessages.slice(0, messageIndex + 1)
        onMessagesChange?.(trimmedMessages)

        // Trigger regeneration
        await onRegenerate(message)

        onRegenerateComplete?.(messageId)
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error))
        onRegenerateError?.(messageId, err)
        throw err
      } finally {
        setIsRegenerating(false)
        setRegeneratingMessageId(null)
      }
    },
    [
      isRegenerating,
      onRegenerate,
      onMessagesChange,
      onRegenerateStart,
      onRegenerateComplete,
      onRegenerateError,
    ]
  )

  return {
    regenerateLast,
    regenerateFrom,
    isRegenerating,
    regeneratingMessageId,
  }
}
