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
      try {
        // Clear editing state first
        setEditingMessageId(null)

        // Track if we need to regenerate (will be set inside setMessages)
        let shouldRegenerate = false

        // Single atomic update to avoid race conditions
        chat.setMessages((prevMessages: CoreMessage[]) => {
          const messageIndex = prevMessages.findIndex((m) => m.id === messageId)
          if (messageIndex === -1) return prevMessages

          // Check if there are messages after this one
          if (messageIndex < prevMessages.length - 1) {
            // There are messages after - truncate and update
            shouldRegenerate = true
            const truncated = prevMessages.slice(0, messageIndex + 1)
            truncated[messageIndex] = {
              ...truncated[messageIndex]!,
              content: newContent,
            }
            return truncated
          } else {
            // This is the last message - just update content
            return prevMessages.map((m) =>
              m.id === messageId ? { ...m, content: newContent } : m
            )
          }
        })

        // If we truncated, regenerate the response
        if (shouldRegenerate) {
          setIsRegenerating(true)
          toast?.info('Regenerating response...')
          try {
            await chat.append({ role: 'user', content: newContent })
          } finally {
            setIsRegenerating(false)
          }
        }

        toast?.success('Message updated')
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
      try {
        // Find the message and regenerate from that point
        const currentMessages = chat.messages
        const messageIndex = currentMessages.findIndex(
          (m) => m.id === messageId
        )
        if (messageIndex === -1) {
          console.warn('Cannot regenerate: message not found')
          toast?.error('Cannot regenerate: message not found')
          return
        }

        // Get the preceding user message to resend
        const userMessage = currentMessages
          .slice(0, messageIndex)
          .reverse()
          .find((m) => m.role === 'user')

        if (!userMessage) {
          console.warn('Cannot regenerate: no preceding user message found')
          toast?.error('Cannot regenerate: no previous message to resend')
          return
        }

        // Remove messages from the regenerate point
        const newMessages = currentMessages.slice(0, messageIndex)
        chat.setMessages(newMessages)

        // Resend the user message
        await chat.append({ role: 'user', content: userMessage.content })

        onRegenerateMessage?.(messageId)
      } catch (error) {
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
      isLoading={chat.isLoading}
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
