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
import { useChatEditor } from '../../hooks/chat/use-chat-editor'
import { useMessageNormalization } from '../../hooks/chat/use-message-normalization'
import { ChatWindow } from './ChatWindow'
import { RequestQueueStatus } from '../ai/RequestQueueStatus'
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
  onFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
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
      showMessageCount:
        header?.showMessageCount ?? legacyShowMessageCount ?? false,

      // Message actions - grouped takes precedence
      onMessageCopy: messageActions?.onCopy ?? legacyOnMessageCopy,
      onMessageFeedback: messageActions?.onFeedback ?? legacyOnMessageFeedback,
      onEditMessage: messageActions?.onEdit ?? legacyOnEditMessage,
      onRegenerateMessage:
        messageActions?.onRegenerate ?? legacyOnRegenerateMessage,
      onDeleteMessage: messageActions?.onDelete ?? legacyOnDeleteMessage,

      // Rate limiting - grouped takes precedence
      enableRateLimiting:
        rateLimiting?.enable ?? legacyEnableRateLimiting ?? false,
      maxConcurrentRequests:
        rateLimiting?.maxConcurrentRequests ?? legacyMaxConcurrentRequests ?? 3,
      maxQueueSize: rateLimiting?.maxQueueSize ?? legacyMaxQueueSize ?? 10,
      showQueueStatus:
        rateLimiting?.showQueueStatus ?? legacyShowQueueStatus ?? false,
      compactQueueStatus:
        rateLimiting?.compactQueueStatus ?? legacyCompactQueueStatus ?? false,
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

      // Prompts (grouped) - convert simplified format to full PromptSuggestion format
      prompts: prompts
        ? {
            ...prompts,
            starterPrompts: prompts.starterPrompts?.map((p, i) => ({
              id: `starter-${i}`,
              text: p.text,
              category: p.category,
              type: 'starter' as const,
            })),
          }
        : undefined,
    }
  }, [
    header,
    messageActions,
    prompts,
    rateLimiting,
    legacyShowHeader,
    legacySessionTitle,
    legacySessionSubtitle,
    legacyHeaderActions,
    legacyShowMessageCount,
    legacyOnMessageCopy,
    legacyOnMessageFeedback,
    legacyOnEditMessage,
    legacyOnRegenerateMessage,
    legacyOnDeleteMessage,
    legacyEnableRateLimiting,
    legacyMaxConcurrentRequests,
    legacyMaxQueueSize,
    legacyShowQueueStatus,
    legacyCompactQueueStatus,
    legacyOnRequestQueued,
    legacyOnRateLimited,
    legacyOnQueueFull,
    onExport,
    onClear,
    autoScroll,
    theme,
    showTokenCounter,
    showNetworkStatus,
    enableMessageOperations,
    memoryStrategy,
    onError,
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

  // Use chat editor hook to handle editing, regenerating, and deleting messages
  const {
    editingMessageId,
    isRegenerating,
    handleEdit: handleEditMessage,
    handleSaveEdit,
    handleCancelEdit,
    handleRegenerate: handleRegenerateMessage,
    handleDelete: handleDeleteMessage,
    handleClear,
  } = useChatEditor({
    chat,
    onEdit: processedProps.onEditMessage,
    onRegenerate: processedProps.onRegenerateMessage,
    onDelete: processedProps.onDeleteMessage,
    onClear: processedProps.onClear,
    toast: toast
      ? {
          info: toast.info,
          error: toast.error,
          success: toast.success,
        }
      : undefined,
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = useMessageNormalization(chat.messages)

  // Get memoryErrorInfo if available (only present on UseClarityChatReturn, not RateLimitedChatReturn)
  const memoryErrorInfo =
    'memoryErrorInfo' in chat ? chat.memoryErrorInfo : null

  // Issue #7: Handle silent memory failures
  React.useEffect(() => {
    if (memoryErrorInfo?.memoryError) {
      const { memoryError, memoryErrorOperation } = memoryErrorInfo
      // Only show toast for user-initiated operations or critical failures
      if (
        memoryErrorOperation === 'store' ||
        memoryErrorOperation === 'query'
      ) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            `[ClarityChat] Memory error (${memoryErrorOperation}):`,
            memoryError
          )
        }
        // We avoid showing error toasts for background memory operations to prevent user annoyance
        // unless it's critical. For now, logging is sufficient as useClarityChat handles retry logic.
      }
    }
  }, [memoryErrorInfo])

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      try {
        await chat.append({ role: 'user', content })
      } catch (error) {
        // Only show error if not aborted - aborts are intentional
        if (error instanceof Error && error.name !== 'AbortError') {
          if (process.env.NODE_ENV === 'development') {
            console.error('Failed to send message:', error)
          }
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

  return (
    <div className="clarity-chat-container">
      {/* Request Queue Status */}
      {processedProps.enableRateLimiting &&
        processedProps.showQueueStatus &&
        'queueStatus' in chat && (
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
        // Grouped props
        messageActions={{
          onCopy: processedProps.onMessageCopy,
          onFeedback: processedProps.onMessageFeedback,
          onEdit: processedProps.onEditMessage ? handleEditMessage : undefined,
          onRegenerate: processedProps.onRegenerateMessage
            ? handleRegenerateMessage
            : undefined,
          onDelete: processedProps.onDeleteMessage
            ? handleDeleteMessage
            : undefined,
          onRetry: undefined, // Legacy ClarityChat didn't expose onRetry directly but onMessageRetry legacy prop might be mapped
        }}
        editActions={{
          editingMessageId,
          onSaveEdit: handleSaveEdit,
          onCancelEdit: handleCancelEdit,
        }}
        header={{
          show: processedProps.showHeader,
          title: processedProps.sessionTitle,
          subtitle: processedProps.sessionSubtitle,
          actions: processedProps.headerActions,
          showMessageCount: processedProps.showMessageCount,
        }}
        actions={{
          onExport: processedProps.onExport,
          onClear: processedProps.onClear ? handleClear : undefined,
        }}
        prompts={processedProps.prompts}
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
