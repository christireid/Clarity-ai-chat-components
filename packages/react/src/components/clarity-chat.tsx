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
import { useClarityChat, type UseClarityChatOptions } from '../hooks/use-clarity-chat'
import { ChatWindow } from './chat-window'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'
import type { CoreMessage } from '../hooks/use-chat-enhanced'

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
    feedbackType: 'up' | 'down' | 'positive' | 'negative'
  ) => void
  /** Callback when retry is requested (message-level) */
  onMessageRetry?: (messageId: string) => void
  /** Callback when a message is edited */
  onEditMessage?: (messageId: string) => void
  /** Callback when a message is regenerated */
  onRegenerateMessage?: (messageId: string) => void
  /** Callback when a message is deleted */
  onDeleteMessage?: (messageId: string) => void
  /** Starter prompts to show in empty state */
  starterPrompts?: import('./prompt-suggestions').PromptSuggestion[]
  /** Follow-up suggestions shown after last assistant message */
  followUpSuggestions?: import('./prompt-suggestions').PromptSuggestion[]
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
  chatId = 'default',
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
  onMessageRetry,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  starterPrompts,
  followUpSuggestions,
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

  const chat = useClarityChat({
    api,
    ...hookOptions,
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = React.useMemo(
    () => convertCoreMessagesToMessages(chat.messages, chatId),
    [chat.messages, chatId]
  )

  const handleSendMessage = React.useCallback(
    async (content: string) => {
      await chat.append({ role: 'user', content })
    },
    [chat]
  )

  // Dismissable error banner (since useChatEnhanced doesn't currently expose clearError)
  const [dismissedErrorMessage, setDismissedErrorMessage] = React.useState<
    string | null
  >(null)
  React.useEffect(() => {
    setDismissedErrorMessage(null)
  }, [chat.error?.message])

  const errorMessage =
    chat.error && chat.error.message !== dismissedErrorMessage
      ? chat.error.message
      : null

  const handleDismissError = React.useCallback(() => {
    setDismissedErrorMessage(chat.error?.message ?? null)
  }, [chat.error?.message])

  const handleRetry = React.useCallback(() => {
    void chat.reload()
  }, [chat])

  const handleFeedback = React.useCallback(
    (messageId: string, type: 'up' | 'down') => {
      // Provide both vocabularies for maximum compatibility
      onMessageFeedback?.(messageId, type)
      onMessageFeedback?.(messageId, type === 'up' ? 'positive' : 'negative')
    },
    [onMessageFeedback]
  )

  const handleClear = React.useCallback(() => {
    chat.setMessages([])
    onClear?.()
  }, [chat, onClear])

  return (
    <ChatWindow
      messages={messages}
      isLoading={chat.isLoading}
      onSendMessage={handleSendMessage}
      onStopGeneration={chat.stop}
      className={className}
      emptyState={emptyState}
      showHeader={showHeader}
      sessionTitle={sessionTitle}
      sessionSubtitle={sessionSubtitle}
      headerActions={headerActions}
      showMessageCount={showMessageCount}
      onExport={onExport}
      onClear={onClear ? handleClear : undefined}
      error={errorMessage}
      onRetry={chat.error ? handleRetry : undefined}
      onDismissError={chat.error ? handleDismissError : undefined}
      onMessageCopy={onMessageCopy}
      onMessageFeedback={onMessageFeedback ? handleFeedback : undefined}
      onMessageRetry={onMessageRetry}
      onEditMessage={onEditMessage}
      onRegenerateMessage={onRegenerateMessage}
      onDeleteMessage={onDeleteMessage}
      starterPrompts={starterPrompts}
      followUpSuggestions={followUpSuggestions}
    />
  )
}

ClarityChat.displayName = 'ClarityChat'
