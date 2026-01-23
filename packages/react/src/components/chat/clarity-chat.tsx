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
 *
 * @example
 * ```tsx
 * // Ultra-simple with presets
 * import { chat } from '@clarity-chat/react'
 *
 * function App() {
 *   return chat('/api/chat') // Returns JSX.Element!
 * }
 * ```
 */

'use client'

import * as React from 'react'
import {
  useClarityChat,
  type UseClarityChatOptions,
} from '../../hooks/chat/use-clarity-chat'
import { useRateLimitedChat } from '../../hooks/ai/use-rate-limited-chat'
import { ChatWindow } from './chat-window'
import { RequestQueueStatus } from '../ai/request-queue-status'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import { useToast } from '../ui/toast'

// Grouped props interfaces for cleaner API
export interface ClarityChatHeaderProps {
  /** Show header with session info */
  show?: boolean
  /** Session title */
  title?: string
  /** Session subtitle */
  subtitle?: string
  /** Header actions */
  actions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
}

export interface ClarityChatMessageActionsProps {
  /** Callback when a message is copied */
  onCopy?: (id: string, content: string) => void
  /** Callback when message feedback is provided */
  onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  /** Callback when a message is edited */
  onEdit?: (messageId: string) => void
  /** Callback when a message is regenerated */
  onRegenerate?: (messageId: string) => void
  /** Callback when a message is deleted */
  onDelete?: (messageId: string) => void
}

export interface ClarityChatPromptsProps {
  /** Starter prompts to show when chat is empty */
  starterPrompts?: Array<{ text: string; category?: string }>
  /** Enable prompt suggestions */
  enableSuggestions?: boolean
  /** Maximum number of suggestions to show */
  maxSuggestions?: number
}

export interface ClarityChatRateLimitingProps {
  /** Enable rate limiting and request queuing */
  enable?: boolean
  /** Maximum concurrent requests */
  maxConcurrentRequests?: number
  /** Maximum queue size */
  maxQueueSize?: number
  /** Show request queue status */
  showQueueStatus?: boolean
  /** Compact queue status display */
  compactQueueStatus?: boolean
  /** Callback when request is queued */
  onRequestQueued?: (position: number, estimatedWaitMs: number) => void
  /** Callback when rate limit is hit */
  onRateLimited?: (resetAt: number) => void
  /** Callback when queue is full */
  onQueueFull?: () => void
}

export interface ClarityChatProps extends Omit<UseClarityChatOptions, 'api'> {
  /** API endpoint URL - the only required prop */
  api: string
  /** Optional chat ID for persistence */
  chatId?: string
  /** Optional className for the chat container */
  className?: string
  /** Custom empty state */
  emptyState?: React.ReactNode

  // 🎯 NEW: Grouped Props API (recommended)
  /** Header configuration */
  header?: ClarityChatHeaderProps
  /** Message action callbacks */
  messageActions?: ClarityChatMessageActionsProps
  /** Prompt configuration */
  prompts?: ClarityChatPromptsProps
  /** Rate limiting configuration */
  rateLimiting?: ClarityChatRateLimitingProps

  // 🔄 LEGACY: Individual Props API (still supported for backward compatibility)
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

  // Rate limiting options (legacy - use rateLimiting prop instead)
  /** Enable rate limiting and request queuing */
  enableRateLimiting?: boolean
  /** Maximum concurrent requests */
  maxConcurrentRequests?: number
  /** Maximum queue size */
  maxQueueSize?: number
  /** Show request queue status */
  showQueueStatus?: boolean
  /** Compact queue status display */
  compactQueueStatus?: boolean
  /** Callback when request is queued */
  onRequestQueued?: (position: number, estimatedWaitMs: number) => void
  /** Callback when rate limit is hit */
  onRateLimited?: (resetAt: number) => void
  /** Callback when queue is full */
  onQueueFull?: () => void
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

  // 🎯 NEW: Grouped Props API
  header,
  messageActions,
  prompts,
  rateLimiting,

  // 🔄 LEGACY: Individual Props API (for backward compatibility)
  showHeader: legacyShowHeader,
  sessionTitle: legacySessionTitle,
  sessionSubtitle: legacySessionSubtitle,
  headerActions: legacyHeaderActions,
  showMessageCount: legacyShowMessageCount,
  onExport,
  onClear,
  onMessageCopy: legacyOnMessageCopy,
  onMessageFeedback: legacyOnMessageFeedback,
  onEditMessage: legacyOnEditMessage,
  onRegenerateMessage: legacyOnRegenerateMessage,
  onDeleteMessage: legacyOnDeleteMessage,
  autoScroll,
  theme,
  showTokenCounter,
  showNetworkStatus,
  enableMessageOperations,
  memoryStrategy,
  onError,

  // Rate limiting (legacy API)
  enableRateLimiting: legacyEnableRateLimiting,
  maxConcurrentRequests: legacyMaxConcurrentRequests,
  maxQueueSize: legacyMaxQueueSize,
  showQueueStatus: legacyShowQueueStatus,
  compactQueueStatus: legacyCompactQueueStatus,
  onRequestQueued: legacyOnRequestQueued,
  onRateLimited: legacyOnRateLimited,
  onQueueFull: legacyOnQueueFull,

  ...hookOptions
}: ClarityChatProps) {
  // 🎯 Process grouped props with fallback to legacy individual props
  const processedProps = React.useMemo(() => {
    return {
      // Header configuration - grouped takes precedence
      showHeader: header?.show ?? legacyShowHeader ?? false,
      sessionTitle: header?.title ?? legacySessionTitle ?? '',
      sessionSubtitle: header?.subtitle ?? legacySessionSubtitle ?? '',
      headerActions: header?.actions ?? legacyHeaderActions,
      showMessageCount: header?.showMessageCount ?? legacyShowMessageCount ?? false,

      // Message actions - grouped takes precedence
      onMessageCopy: messageActions?.onCopy ?? legacyOnMessageCopy,
      onMessageFeedback: messageActions?.onFeedback ?? legacyOnMessageFeedback,
      onEditMessage: messageActions?.onEdit ?? legacyOnEditMessage,
      onRegenerateMessage: messageActions?.onRegenerate ?? legacyOnRegenerateMessage,
      onDeleteMessage: messageActions?.onDelete ?? legacyOnDeleteMessage,

      // Rate limiting - grouped takes precedence
      enableRateLimiting: rateLimiting?.enable ?? legacyEnableRateLimiting ?? false,
      maxConcurrentRequests: rateLimiting?.maxConcurrentRequests ?? legacyMaxConcurrentRequests ?? 3,
      maxQueueSize: rateLimiting?.maxQueueSize ?? legacyMaxQueueSize ?? 10,
      showQueueStatus: rateLimiting?.showQueueStatus ?? legacyShowQueueStatus ?? false,
      compactQueueStatus: rateLimiting?.compactQueueStatus ?? legacyCompactQueueStatus ?? false,
      onRequestQueued: rateLimiting?.onRequestQueued ?? legacyOnRequestQueued,
      onRateLimited: rateLimiting?.onRateLimited ?? legacyOnRateLimited,
      onQueueFull: rateLimiting?.onQueueFull ?? legacyOnQueueFull,

      // Other props (no grouping needed yet)
      onExport,
      onClear,
      autoScroll,
      theme,
      showTokenCounter,
      showNetworkStatus,
      enableMessageOperations,
      memoryStrategy,
      onError,

      // Prompts (grouped)
      prompts,
    }
  }, [
    header, messageActions, prompts, rateLimiting,
    legacyShowHeader, legacySessionTitle, legacySessionSubtitle, legacyHeaderActions, legacyShowMessageCount,
    legacyOnMessageCopy, legacyOnMessageFeedback, legacyOnEditMessage, legacyOnRegenerateMessage, legacyOnDeleteMessage,
    legacyEnableRateLimiting, legacyMaxConcurrentRequests, legacyMaxQueueSize, legacyShowQueueStatus, legacyCompactQueueStatus,
    legacyOnRequestQueued, legacyOnRateLimited, legacyOnQueueFull,
    onExport, onClear, autoScroll, theme, showTokenCounter, showNetworkStatus, enableMessageOperations, memoryStrategy, onError
  ])
  // Note: API validation is handled by useClarityChat hook via validateApiEndpoint()
  // which provides a ComponentError with helpful messaging and security checks
  const toast = useToast()

  // Use rate-limited chat if enabled
  const chat = processedProps.enableRateLimiting
    ? useRateLimitedChat({
        api,
        enableRateLimiting: true,
        maxConcurrent: processedProps.maxConcurrentRequests,
        maxQueueSize: processedProps.maxQueueSize,
        onRequestQueued: processedProps.onRequestQueued,
        onRateLimited: processedProps.onRateLimited,
        onQueueFull: processedProps.onQueueFull,
        ...hookOptions,
      })
    : useClarityChat({
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
    // Prevent clearing while a request is in progress to avoid race conditions
    if (chat.isLoading || isRegenerating) {
      toast?.info('Please wait for the current request to complete')
      return
    }
    // Clear editing state as well
    setEditingMessageId(null)
    chat.setMessages([])
    onClear?.()
  }, [chat, isRegenerating, onClear, toast])

  const handleDeleteMessage = React.useCallback(
    (messageId: string) => {
      // Prevent deletion while a request is in progress to avoid race conditions
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }
      // Clear editing state if deleting the message being edited
      if (editingMessageId === messageId) {
        setEditingMessageId(null)
      }
      // Use functional update to avoid stale closure
      chat.setMessages((prevMessages: CoreMessage[]) =>
        prevMessages.filter((m) => m.id !== messageId)
      )
      // Show toast after successful deletion (not in child component to avoid
      // showing toast when loading guard blocks the action)
      toast?.info('Message deleted')
      processedProps.onDeleteMessage?.(messageId)
    },
    [
      chat.isLoading,
      chat.setMessages,
      editingMessageId,
      isRegenerating,
      processedProps.onDeleteMessage,
      toast,
    ]
  )

  // Handle starting edit mode
  const handleEditMessage = React.useCallback(
    (messageId: string) => {
      // Prevent editing while a request is in progress to avoid race conditions
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }
      setEditingMessageId(messageId)
      processedProps.onEditMessage?.(messageId)
    },
    [chat.isLoading, isRegenerating, processedProps.onEditMessage, toast]
  )

  // Handle saving edits
  const handleSaveEdit = React.useCallback(
    async (messageId: string, newContent: string) => {
      // Prevent saving while a request is in progress (defense in depth)
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }

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
    [chat, isRegenerating, toast]
  )

  // Handle canceling edits
  const handleCancelEdit = React.useCallback(() => {
    setEditingMessageId(null)
  }, [])

  const handleRegenerateMessage = React.useCallback(
    async (messageId: string) => {
      // Prevent regeneration while a request is in progress to avoid race conditions
      if (chat.isLoading || isRegenerating) {
        toast?.info('Please wait for the current request to complete')
        return
      }

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

        // Set loading state for UI feedback and show toast
        // (toast shown here, not in child component, to avoid double toasts when loading guard blocks)
        setIsRegenerating(true)
        toast?.info('Regenerating response...')

        try {
          // Resend the user message - append adds it and triggers AI response
          await chat.append({ role: 'user', content: userMessage.content })
          processedProps.onRegenerateMessage?.(messageId)
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
    [chat, isRegenerating, processedProps.onRegenerateMessage, toast]
  )

  return (
    <div className="clarity-chat-container">
      {/* Request Queue Status */}
      {processedProps.enableRateLimiting && processedProps.showQueueStatus && 'queueStatus' in chat && (
        <RequestQueueStatus
          queueStatus={chat.queueStatus}
          isRateLimited={chat.isRateLimited}
          rateLimitResetAt={chat.rateLimitResetAt}
          compact={processedProps.compactQueueStatus}
          onClearQueue={chat.clearQueue}
        />
      )}

      <ChatWindow
        messages={messages}
        isLoading={chat.isLoading || isRegenerating}
        onSendMessage={handleSendMessage}
        onStopGeneration={handleStopGeneration}
        onMessageCopy={processedProps.onMessageCopy}
        onMessageFeedback={processedProps.onMessageFeedback}
        onEditMessage={processedProps.onEditMessage ? handleEditMessage : undefined}
        onRegenerateMessage={processedProps.onRegenerateMessage ? handleRegenerateMessage : undefined}
        onDeleteMessage={processedProps.onDeleteMessage ? handleDeleteMessage : undefined}
        editingMessageId={editingMessageId}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        className={className}
        emptyState={emptyState}
        showHeader={processedProps.showHeader}
        sessionTitle={processedProps.sessionTitle}
        sessionSubtitle={processedProps.sessionSubtitle}
        headerActions={processedProps.headerActions}
        showMessageCount={processedProps.showMessageCount}
        onExport={processedProps.onExport}
        onClear={processedProps.onClear ? handleClear : undefined}
        autoScroll={processedProps.autoScroll}
        theme={processedProps.theme}
        showTokenCounter={processedProps.showTokenCounter}
        showNetworkStatus={processedProps.showNetworkStatus}
        enableMessageOperations={processedProps.enableMessageOperations}
      />
    </div>
  )
}

ClarityChat.displayName = 'ClarityChat'
