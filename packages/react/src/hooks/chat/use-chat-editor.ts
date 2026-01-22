'use client'

import * as React from 'react'
import type { CoreMessage } from './use-chat-enhanced'

export interface UseChatEditorOptions {
  /** The chat instance from useClarityChat or useChatEnhanced */
  chat: {
    messages: CoreMessage[]
    setMessages: (messages: CoreMessage[] | ((messages: CoreMessage[]) => CoreMessage[])) => void
    append: (
      message: Pick<CoreMessage, 'role' | 'content'>,
      options?: { data?: Record<string, unknown> }
    ) => Promise<string | null>
    isLoading: boolean
  }
  /** Optional callbacks */
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  onClear?: () => void
  /** Toast notification handler */
  toast?: {
    info: (message: string) => void
    error: (message: string) => void
    success: (message: string) => void
  }
}

export interface UseChatEditorReturn {
  /** ID of the message currently being edited */
  editingMessageId: string | null
  /** Whether a regeneration is in progress */
  isRegenerating: boolean
  /** Start editing a message */
  handleEdit: (messageId: string) => void
  /** Save edited message (optionally regenerating response) */
  handleSaveEdit: (messageId: string, newContent: string) => Promise<void>
  /** Cancel editing */
  handleCancelEdit: () => void
  /** Regenerate response from a specific message point */
  handleRegenerate: (messageId: string) => Promise<void>
  /** Delete a message */
  handleDelete: (messageId: string) => void
  /** Clear all messages */
  handleClear: () => void
}

/**
 * useChatEditor - Hook for managing chat message editing and regeneration
 *
 * Encapsulates complex logic for:
 * - Inline message editing
 * - Response regeneration (branching/retrying)
 * - Message deletion with state cleanup
 * - Preventing race conditions during loading states
 *
 * @param options - Configuration options including the chat instance
 * @returns Editor state and handlers
 */
export function useChatEditor({
  chat,
  onEdit,
  onRegenerate,
  onDelete,
  onClear,
  toast,
}: UseChatEditorOptions): UseChatEditorReturn {
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(
    null
  )
  const [isRegenerating, setIsRegenerating] = React.useState(false)

  // Clear editing state when messages are cleared externally
  React.useEffect(() => {
    if (chat.messages.length === 0 && editingMessageId) {
      setEditingMessageId(null)
    }
  }, [chat.messages.length, editingMessageId])

  const handleEdit = React.useCallback(
    (messageId: string) => {
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }
      setEditingMessageId(messageId)
      onEdit?.(messageId)
    },
    [chat.isLoading, isRegenerating, onEdit, toast]
  )

  const handleCancelEdit = React.useCallback(() => {
    setEditingMessageId(null)
  }, [])

  const handleSaveEdit = React.useCallback(
    async (messageId: string, newContent: string) => {
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }

      const trimmedContent = newContent.trim()
      if (!trimmedContent) {
        toast?.error('Message cannot be empty')
        return
      }

      try {
        setEditingMessageId(null)
        const originalMessages = chat.messages
        const messageIndex = originalMessages.findIndex((m) => m.id === messageId)

        if (messageIndex === -1) {
          toast?.error('Message not found')
          return
        }

        const needsRegeneration = messageIndex < originalMessages.length - 1

        if (needsRegeneration) {
          // Truncate to BEFORE the edited message
          const truncated = originalMessages.slice(0, messageIndex)
          chat.setMessages(truncated)

          setIsRegenerating(true)
          toast?.info('Regenerating response...')
          
          try {
            // Re-append the edited message which triggers generation
            await chat.append({ role: 'user', content: trimmedContent })
            toast?.success('Response regenerated')
          } catch (error) {
            // Restore state on error
            chat.setMessages(originalMessages)
            throw error
          } finally {
            setIsRegenerating(false)
          }
        } else {
          // Just update content
          chat.setMessages((prevMessages) =>
            prevMessages.map((m) =>
              m.id === messageId ? { ...m, content: trimmedContent } : m
            )
          )
          toast?.success('Message updated')
        }
      } catch (error) {
        setIsRegenerating(false)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to update message:', error)
          toast?.error('Failed to update message. Please try again.')
        }
      }
    },
    [chat, isRegenerating, toast]
  )

  const handleRegenerate = React.useCallback(
    async (messageId: string) => {
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }

      const originalMessages = chat.messages
      try {
        const messageIndex = originalMessages.findIndex((m) => m.id === messageId)
        if (messageIndex === -1) {
          toast?.error('Cannot regenerate: message not found')
          return
        }

        // Find preceding user message
        let userMessageIndex = -1
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (originalMessages[i]?.role === 'user') {
            userMessageIndex = i
            break
          }
        }

        if (userMessageIndex === -1) {
          toast?.error('Cannot regenerate: no previous message to resend')
          return
        }

        const userMessage = originalMessages[userMessageIndex]!
        const newMessages = originalMessages.slice(0, userMessageIndex)
        chat.setMessages(newMessages)

        setIsRegenerating(true)
        toast?.info('Regenerating response...')

        try {
          await chat.append({ role: 'user', content: userMessage.content as string })
          onRegenerate?.(messageId)
        } catch (error) {
          chat.setMessages(originalMessages)
          throw error
        } finally {
          setIsRegenerating(false)
        }
      } catch (error) {
        setIsRegenerating(false)
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to regenerate message:', error)
          toast?.error('Failed to regenerate response. Please try again.')
        }
      }
    },
    [chat, isRegenerating, onRegenerate, toast]
  )

  const handleDelete = React.useCallback(
    (messageId: string) => {
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }

      if (editingMessageId === messageId) {
        setEditingMessageId(null)
      }

      chat.setMessages((prevMessages) =>
        prevMessages.filter((m) => m.id !== messageId)
      )
      
      toast?.info('Message deleted')
      onDelete?.(messageId)
    },
    [chat, editingMessageId, isRegenerating, onDelete, toast]
  )

  const handleClear = React.useCallback(() => {
    if (chat.isLoading || isRegenerating) {
      toast?.info('Please wait for the current request to complete')
      return
    }
    setEditingMessageId(null)
    chat.setMessages([])
    onClear?.()
  }, [chat, isRegenerating, onClear, toast])

  return {
    editingMessageId,
    isRegenerating,
    handleEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleRegenerate,
    handleDelete,
    handleClear,
  }
}
