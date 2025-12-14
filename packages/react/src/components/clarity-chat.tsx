/**
 * ClarityChat - Top-Level Drop-in Component
 *
 * The simplest way to add AI chat to your app. Just provide an API endpoint
 * and you're done. All the complexity is handled internally.
 *
 * **Architecture Layer**: Top-Level (Drop-in Ready)
 * **Domain**: Chat UI
 *
 * This is the recommended entry point for most use cases. For more control,
 * use mid-level APIs like `ChatWindow` + `useClarityChat` + `useChatHandlers`.
 *
 * @example
 * ```tsx
 * import { ClarityChat } from '@clarity-chat/react'
 * import '@clarity-chat/react/styles.css'
 *
 * function App() {
 *   return <ClarityChat api="/api/chat" />
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With memory enabled
 * <ClarityChat
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'vector-store' }}
 * />
 * ```
 */

'use client'

import * as React from 'react'
import {
  useClarityChat,
  type UseClarityChatOptions,
} from '../hooks/use-clarity-chat'
import { ChatWindow } from './chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import { useToast } from './toast'

export interface ClarityChatProps extends Omit<UseClarityChatOptions, 'api'> {
  /** API endpoint URL - the only required prop */
  api: string
  /** Optional chat ID for persistence */
  chatId?: string
  /** Optional className for the chat container */
  className?: string
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Show header with session info */
  showHeader?: boolean
  /** Session title */
  sessionTitle?: string
  /** Session subtitle */
  sessionSubtitle?: string
  /** Header actions */
  headerActions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
  /** Enable export functionality */
  onExport?: () => void
  /** Enable clear chat functionality */
  onClear?: () => void
  /** Auto-scroll to bottom on new messages */
  autoScroll?: boolean
  /** Callback when a message is copied */
  onMessageCopy?: (id: string, content: string) => void
  /** Callback when message feedback is provided */
  onMessageFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
  /** Callback when a message is edited */
  onEditMessage?: (messageId: string) => void
  /** Callback when a message is regenerated */
  onRegenerateMessage?: (messageId: string) => void
  /** Callback when a message is deleted */
  onDeleteMessage?: (messageId: string) => void
  /** Theme for the chat interface */
  theme?: string
  /** Show token counter in input */
  showTokenCounter?: boolean
  /** Show network status indicator */
  showNetworkStatus?: boolean
  /** Enable message operations (edit, delete, branch) */
  enableMessageOperations?: boolean
  /** Memory strategy for conversation context */
  memoryStrategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Error handler with error info */
  onError?: (error: Error, errorInfo?: React.ErrorInfo) => void
}

/**
 * ClarityChat - All-in-one chat component
 *
 * This is the recommended way to use Clarity Chat. It combines the hook
 * and component into a single, easy-to-use interface.
 *
 * Features:
 * - Automatic message format conversion
 * - Built-in loading states
 * - Error handling
 * - Memory support (when configured)
 * - Streaming support
 * - All ChatWindow features
 *
 * @example Basic usage
 * ```tsx
 * <ClarityChat api="/api/chat" />
 * ```
 *
 * @example With memory
 * ```tsx
 * <ClarityChat
 *   api="/api/chat"
 *   memory={{ enabled: true, strategy: 'sliding-window' }}
 * />
 * ```
 *
 * @example With custom styling
 * ```tsx
 * <ClarityChat
 *   api="/api/chat"
 *   className="h-screen"
 *   showHeader
 *   sessionTitle="AI Assistant"
 * />
 * ```
 */
export function ClarityChat({
  api,
  className,
  emptyState,
  showHeader,
  sessionTitle,
  sessionSubtitle,
  headerActions,
  showMessageCount,
  onExport,
  onClear,
  onMessageCopy,
  onMessageFeedback,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  ...hookOptions
}: ClarityChatProps) {
  // Validate required prop with helpful error message
  if (!api || typeof api !== 'string' || api.trim().length === 0) {
    throw new Error(
      'ClarityChat: "api" prop is required.\n' +
        'Please provide your API endpoint URL.\n\n' +
        'Example:\n' +
        '  <ClarityChat api="/api/chat" />\n\n' +
        'Or use environment variable:\n' +
        '  CLARITY_CHAT_API=/api/chat\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/getting-started'
    )
  }

  const toast = useToast()

  const chat = useClarityChat({
    api,
    ...hookOptions,
  })

  // Track which message is currently being edited
  const [editingMessageId, setEditingMessageId] = React.useState<string | null>(
    null
  )

  // Track when we're regenerating after an edit
  const [isRegenerating, setIsRegenerating] = React.useState(false)

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages),
    [chat.messages]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      try {
        await chat.append({ role: 'user', content })
      } catch (error) {
        // Only show error if not aborted - aborts are intentional
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to send message:', error)
          toast?.error('Failed to send message. Please try again.')
        }
      }
    },
    [chat, toast]
  )

  const handleStopGeneration = React.useCallback(() => {
    // Use the chat's built-in stop method to cancel streaming
    chat.stop()
  }, [chat])

  const handleClear = React.useCallback(() => {
    chat.setMessages([])
    onClear?.()
  }, [chat, onClear])

  const handleDeleteMessage = React.useCallback(
    (messageId: string) => {
      // Use functional update to avoid stale closure
      chat.setMessages((prevMessages: CoreMessage[]) =>
        prevMessages.filter((m) => m.id !== messageId)
      )
      onDeleteMessage?.(messageId)
    },
    [chat.setMessages, onDeleteMessage]
  )

  // Handle starting edit mode
  const handleEditMessage = React.useCallback(
    (messageId: string) => {
      setEditingMessageId(messageId)
      onEditMessage?.(messageId)
    },
    [onEditMessage]
  )

  // Handle saving edits
  const handleSaveEdit = React.useCallback(
    async (messageId: string, newContent: string) => {
      // Validate content - reject empty or whitespace-only
      const trimmedContent = newContent.trim()
      if (!trimmedContent) {
        toast?.error('Message cannot be empty')
        return
      }

      try {
        // Clear editing state first
        setEditingMessageId(null)

        // Capture current messages for potential rollback
        const originalMessages = chat.messages

        // Find the message and determine if we need to regenerate
        const messageIndex = originalMessages.findIndex(
          (m) => m.id === messageId
        )
        if (messageIndex === -1) {
          toast?.error('Message not found')
          return
        }

        const needsRegeneration = messageIndex < originalMessages.length - 1

        if (needsRegeneration) {
          // Truncate to BEFORE the edited message - append will add it back with new content
          // This avoids duplicate user messages (setMessages + append would create two)
          const truncated = originalMessages.slice(0, messageIndex)
          chat.setMessages(truncated)

          // Regenerate response - append adds the edited user message and triggers AI response
          setIsRegenerating(true)
          toast?.info('Regenerating response...')
          try {
            await chat.append({ role: 'user', content: trimmedContent })
            toast?.success('Response regenerated')
          } catch (error) {
            // CRITICAL: Restore original messages on failure to prevent data loss
            chat.setMessages(originalMessages)
            throw error // Re-throw to be caught by outer catch
          } finally {
            setIsRegenerating(false)
          }
        } else {
          // Just update the content (no regeneration needed)
          chat.setMessages((prevMessages: CoreMessage[]) =>
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
    [chat, toast]
  )

  // Handle canceling edits
  const handleCancelEdit = React.useCallback(() => {
    setEditingMessageId(null)
  }, [])

  const handleRegenerateMessage = React.useCallback(
    async (messageId: string) => {
      // Capture current messages for potential rollback
      const originalMessages = chat.messages

      try {
        // Find the message and regenerate from that point
        const messageIndex = originalMessages.findIndex(
          (m) => m.id === messageId
        )
        if (messageIndex === -1) {
          console.warn('Cannot regenerate: message not found')
          toast?.error('Cannot regenerate: message not found')
          return
        }

        // Find the preceding user message AND its index
        // We need the index to truncate properly and avoid duplicate messages
        let userMessageIndex = -1
        for (let i = messageIndex - 1; i >= 0; i--) {
          if (originalMessages[i]?.role === 'user') {
            userMessageIndex = i
            break
          }
        }

        if (userMessageIndex === -1) {
          console.warn('Cannot regenerate: no preceding user message found')
          toast?.error('Cannot regenerate: no previous message to resend')
          return
        }

        const userMessage = originalMessages[userMessageIndex]!

        // Truncate to BEFORE the user message - append will add it back
        // This avoids duplicate user messages
        const newMessages = originalMessages.slice(0, userMessageIndex)
        chat.setMessages(newMessages)

        // Set loading state for UI feedback
        setIsRegenerating(true)

        try {
          // Resend the user message - append adds it and triggers AI response
          await chat.append({ role: 'user', content: userMessage.content })
          onRegenerateMessage?.(messageId)
        } catch (error) {
          // CRITICAL: Restore original messages on failure to prevent data loss
          chat.setMessages(originalMessages)
          throw error // Re-throw to be caught by outer catch
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
    [chat, onRegenerateMessage, toast]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading || isRegenerating}
      onSendMessage={handleSendMessage}
      onStopGeneration={handleStopGeneration}
      onMessageCopy={onMessageCopy}
      onMessageFeedback={onMessageFeedback}
      onEditMessage={handleEditMessage}
      onRegenerateMessage={handleRegenerateMessage}
      onDeleteMessage={handleDeleteMessage}
      editingMessageId={editingMessageId}
      onSaveEdit={handleSaveEdit}
      onCancelEdit={handleCancelEdit}
      className={className}
      emptyState={emptyState}
      showHeader={showHeader}
      sessionTitle={sessionTitle}
      sessionSubtitle={sessionSubtitle}
      headerActions={headerActions}
      showMessageCount={showMessageCount}
      onExport={onExport}
      onClear={onClear ? handleClear : undefined}
    />
  )
}

ClarityChat.displayName = 'ClarityChat'
