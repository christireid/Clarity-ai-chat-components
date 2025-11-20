'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card, Button, Badge, cn } from '@clarity-chat/primitives'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from './thinking-indicator'
import { BotIcon } from './icons'
import type { CoreMessage } from '../hooks/use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../utils/message-conversion'

export interface ChatWindowProps {
  /** Messages in either Message[] or CoreMessage[] format */
  messages: Message[] | CoreMessage[]
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  onSendMessage: (content: string) => void
  /** Callback when message is copied */
  onMessageCopy?: (messageId: string, content: string) => void
  /** Callback when feedback is given */
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  /** Callback when retry is requested */
  onMessageRetry?: (messageId: string) => void
  /** Callback when message is edited */
  onEditMessage?: (messageId: string) => void
  /** Callback when message is regenerated */
  onRegenerateMessage?: (messageId: string) => void
  /** Callback when message is deleted */
  onDeleteMessage?: (messageId: string) => void
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Show header with session info */
  showHeader?: boolean
  /** Session title */
  sessionTitle?: string
  /** Session subtitle or description */
  sessionSubtitle?: string
  /** Header actions */
  headerActions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
  /** Enable export functionality */
  onExport?: () => void
  /** Enable clear chat functionality */
  onClear?: () => void
  className?: string
}

// Default empty state component - extracted for better performance
const DefaultEmptyState = () => (
  <motion.div
    className="text-center space-y-6"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <motion.div
      className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-primary/20"
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 2, -2, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <BotIcon size={36} className="text-primary" />
    </motion.div>
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-foreground">
        Start a conversation
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
        Send a message to begin chatting with the AI assistant. I'm here to help
        with your questions and tasks.
      </p>
    </div>
  </motion.div>
)

/**
 * ChatWindow - Mid-Level Composable Component
 * 
 * A composable chat window component that accepts messages and handles
 * rendering, input, and user interactions.
 * 
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 * 
 * For drop-in usage, use top-level `ClarityChat` instead.
 * For custom rendering, use low-level `Message` components.
 * 
 * @example
 * ```tsx
 * const chat = useClarityChat({ api: '/api/chat' })
 * const handlers = useChatHandlers({ chat })
 * 
 * <ChatWindow
 *   messages={chat.messages}
 *   isLoading={chat.isLoading}
 *   onSendMessage={handlers.onSendMessage}
 * />
 * ```
 * 
 * A mid-level building block for rendering chat interfaces. Provides full control
 * over message rendering, input handling, and UI customization.
 * 
 * **Features:**
 * - Message list rendering with animations
 * - Chat input with send functionality
 * - Loading states and thinking indicators
 * - Message actions (copy, feedback, retry, edit, delete)
 * - Customizable empty state
 * - Optional header with session info
 * - Export and clear functionality
 * 
 * **When to use:**
 * - You need full control over the chat UI
 * - You're using `useChat` or `useClarityChat` hooks
 * - You want to customize message rendering
 * 
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component instead
 * - For pre-configured setups, use recipe components (`ChatWithMemory`, etc.)
 * 
 * @param props - ChatWindow configuration
 * @param props.messages - Array of messages to display
 * @param props.isLoading - Whether a request is in progress
 * @param props.onSendMessage - Callback when user sends a message
 * @param props.onMessageCopy - Optional callback when message is copied
 * @param props.onMessageFeedback - Optional callback for message feedback (up/down)
 * @param props.onMessageRetry - Optional callback to retry a message
 * @param props.onEditMessage - Optional callback to edit a message
 * @param props.onRegenerateMessage - Optional callback to regenerate a message
 * @param props.onDeleteMessage - Optional callback to delete a message
 * @param props.emptyState - Optional custom empty state component
 * @param props.showHeader - Show header with session info (default: false)
 * @param props.sessionTitle - Session title displayed in header
 * @param props.sessionSubtitle - Session subtitle/description
 * @param props.headerActions - Custom actions in header
 * @param props.showMessageCount - Show message count badge (default: false)
 * @param props.onExport - Optional callback for export functionality
 * @param props.onClear - Optional callback for clear chat functionality
 * @param props.className - Optional CSS class name
 * @param props.aiStatus - Optional AI processing status for thinking indicator
 * 
 * @example Basic usage with useChat hook
 * ```tsx
 * import { useChat, ChatWindow } from '@clarity-chat/react'
 * 
 * function MyChat() {
 *   const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
 *   
 *   return (
 *     <ChatWindow
 *       messages={messages}
 *       isLoading={isLoading}
 *       onSendMessage={sendMessage}
 *     />
 *   )
 * }
 * ```
 * 
 * @example With custom header and actions
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   isLoading={isLoading}
 *   onSendMessage={sendMessage}
 *   showHeader
 *   sessionTitle="Customer Support"
 *   sessionSubtitle="We're here to help"
 *   headerActions={<Button>Settings</Button>}
 *   showMessageCount
 *   onExport={() => exportMessages(messages)}
 *   onClear={() => clearMessages()}
 * />
 * ```
 * 
 * @example With message callbacks
 * ```tsx
 * <ChatWindow
 *   messages={messages}
 *   isLoading={isLoading}
 *   onSendMessage={sendMessage}
 *   onMessageCopy={(id, content) => {
 *     navigator.clipboard.writeText(content)
 *     toast.success('Copied!')
 *   }}
 *   onMessageFeedback={(id, type) => {
 *     analytics.track('message_feedback', { id, type })
 *   }}
 *   onMessageRetry={(id) => {
 *     retryMessage(id)
 *   }}
 * />
 * ```
 */
export function ChatWindow({
  messages,
  isLoading = false,
  aiStatus,
  onSendMessage,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  emptyState,
  showHeader = false,
  sessionTitle = 'Chat Session',
  sessionSubtitle,
  headerActions,
  showMessageCount = false,
  onExport,
  onClear,
  className,
}: ChatWindowProps) {
  // Runtime validation
  if (!Array.isArray(messages)) {
    throw new Error(
      'ChatWindow: "messages" prop must be an array.\n\n' +
      'Example:\n' +
      '  <ChatWindow messages={[]} onSendMessage={handleSend} />\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/components'
    )
  }

  if (typeof onSendMessage !== 'function') {
    throw new Error(
      'ChatWindow: "onSendMessage" prop is required and must be a function.\n\n' +
      'Example:\n' +
      '  <ChatWindow messages={messages} onSendMessage={(msg) => sendMessage(msg)} />\n\n' +
      'For more help, see: https://clarity-chat.dev/docs/components'
    )
  }

  const [input, setInput] = React.useState('')

  // Convert CoreMessage[] to Message[] if needed
  // Check if first message has 'content' property that could be string or array
  // CoreMessage has content: string | Array<...>, Message has content: string
  const normalizedMessages = React.useMemo(() => {
    if (messages.length === 0) return []
    
    // Check if it's CoreMessage[] format by checking first message structure
    const firstMessage = messages[0]
    const isCoreMessage =
      firstMessage &&
      'content' in firstMessage &&
      (typeof firstMessage.content === 'string' || Array.isArray(firstMessage.content)) &&
      !('status' in firstMessage) // Message has 'status', CoreMessage doesn't
    
    if (isCoreMessage) {
      return convertCoreMessagesToMessages(messages as CoreMessage[])
    }
    
    return messages as Message[]
  }, [messages])

  // React 19: Compiler optimizes - no useCallback needed
  const handleSubmit = (content: string) => {
    onSendMessage(content)
    setInput('')
  }

  // React 19: Simple derivation - compiler optimizes
  const effectiveEmptyState = emptyState || <DefaultEmptyState />

  // React 19: Simple string derivation - compiler optimizes
  const messageCountText =
    normalizedMessages.length === 0
      ? null
      : `${normalizedMessages.length} ${normalizedMessages.length === 1 ? 'message' : 'messages'}`

  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden shadow-[0_10px_24px_rgba(15,23,42,0.12)]',
        className
      )}
    >
      {/* Optional Header */}
      {showHeader && (
        <motion.div
          className="flex items-center justify-between gap-4 border-b border-border/50 bg-card px-4 py-3 sm:px-6 backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary shadow-[0_1px_2px_rgba(15,23,42,0.08)] ring-1 ring-primary/20">
              <BotIcon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-foreground truncate">
                {sessionTitle}
              </h2>
              {sessionSubtitle && (
                <p className="text-xs text-muted-foreground truncate">
                  {sessionSubtitle}
                </p>
              )}
            </div>
            {showMessageCount && messageCountText && (
              <Badge variant="secondary" className="shrink-0" aria-label={messageCountText}>
                {messageCountText}
              </Badge>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {headerActions}

            {onExport && normalizedMessages.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onExport}
                className="gap-1.5"
                title="Export conversation"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span className="hidden sm:inline">Export</span>
              </Button>
            )}

            {onClear && normalizedMessages.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClear}
                className="gap-1.5 text-muted-foreground hover:text-destructive"
                title="Clear conversation"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </motion.div>
      )}

      <div className="flex flex-col h-full">
        <MessageList
          messages={normalizedMessages}
          isLoading={isLoading}
          onMessageCopy={onMessageCopy}
          onMessageFeedback={onMessageFeedback}
          onMessageRetry={onMessageRetry}
          onEditMessage={onEditMessage}
          onRegenerateMessage={onRegenerateMessage}
          onDeleteMessage={onDeleteMessage}
          emptyState={effectiveEmptyState}
          className="flex-1"
        />

        {/* Thinking Indicator - positioned above input */}
        <AnimatePresence>
          {isLoading && aiStatus && (
            <div className="px-4 pb-2">
              <ThinkingIndicator status={aiStatus} />
            </div>
          )}
        </AnimatePresence>

        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
        />
      </div>
    </Card>
  )
}

ChatWindow.displayName = 'ChatWindow'
