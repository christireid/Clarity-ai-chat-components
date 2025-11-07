import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card, Button, Badge, cn } from '@clarity-chat/primitives'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from './thinking-indicator'
import { BotIcon } from './icons'

/**
 * Default empty state component for chat window
 * Extracted to prevent recreation on every render
 */
const DefaultEmptyState = React.memo(function DefaultEmptyState() {
  return (
    <motion.div
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm ring-1 ring-primary/20"
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
          Send a message to begin chatting with the AI assistant. I'm here to
          help with your questions and tasks.
        </p>
      </div>
    </motion.div>
  )
})

DefaultEmptyState.displayName = 'DefaultEmptyState'

/**
 * Export icon SVG component
 */
const ExportIcon = React.memo(function ExportIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  )
})

ExportIcon.displayName = 'ExportIcon'

/**
 * Clear icon SVG component
 */
const ClearIcon = React.memo(function ClearIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
      />
    </svg>
  )
})

ClearIcon.displayName = 'ClearIcon'

/**
 * Chat window header component
 */
const ChatWindowHeader = React.memo(function ChatWindowHeader({
  sessionTitle,
  sessionSubtitle,
  messageCount,
  showMessageCount,
  headerActions,
  onExport,
  onClear,
  hasMessages,
}: {
  sessionTitle: string
  sessionSubtitle?: string
  messageCount: number
  showMessageCount: boolean
  headerActions?: React.ReactNode
  onExport?: () => void
  onClear?: () => void
  hasMessages: boolean
}) {
  // Memoize message count text
  const messageCountText = React.useMemo(
    () => (messageCount === 1 ? 'message' : 'messages'),
    [messageCount]
  )

  // Memoize callbacks
  const handleExport = React.useCallback(() => {
    onExport?.()
  }, [onExport])

  const handleClear = React.useCallback(() => {
    onClear?.()
  }, [onClear])

  return (
    <motion.div
      className="flex items-center justify-between gap-4 border-b bg-card px-4 py-3 sm:px-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20">
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
        {showMessageCount && hasMessages && (
          <Badge variant="secondary" className="shrink-0">
            {messageCount} {messageCountText}
          </Badge>
        )}
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {headerActions}

        {onExport && hasMessages && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="gap-1.5"
            title="Export conversation"
            aria-label="Export conversation"
          >
            <ExportIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        )}

        {onClear && hasMessages && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClear}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
            title="Clear conversation"
            aria-label="Clear conversation"
          >
            <ClearIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        )}
      </div>
    </motion.div>
  )
})

ChatWindowHeader.displayName = 'ChatWindowHeader'

export interface ChatWindowProps {
  messages: Message[]
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

export const ChatWindow = React.memo(function ChatWindow({
  messages,
  isLoading = false,
  aiStatus,
  onSendMessage,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
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
  const [input, setInput] = React.useState('')

  // Memoize submit handler to prevent unnecessary re-renders
  const handleSubmit = React.useCallback(
    (content: string) => {
      onSendMessage(content)
      setInput('')
    },
    [onSendMessage]
  )

  // Memoize computed values
  const hasMessages = React.useMemo(() => messages.length > 0, [messages.length])
  const messageCount = React.useMemo(() => messages.length, [messages.length])

  // Memoize empty state to prevent recreation
  const resolvedEmptyState = React.useMemo(
    () => emptyState || <DefaultEmptyState />,
    [emptyState]
  )

  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden shadow-lg',
        className
      )}
    >
      {/* Optional Header */}
      {showHeader && (
        <ChatWindowHeader
          sessionTitle={sessionTitle}
          sessionSubtitle={sessionSubtitle}
          messageCount={messageCount}
          showMessageCount={showMessageCount}
          headerActions={headerActions}
          onExport={onExport}
          onClear={onClear}
          hasMessages={hasMessages}
        />
      )}

      <div className="flex flex-col h-full">
        <MessageList
          messages={messages}
          isLoading={isLoading}
          onMessageCopy={onMessageCopy}
          onMessageFeedback={onMessageFeedback}
          onMessageRetry={onMessageRetry}
          emptyState={resolvedEmptyState}
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
})

ChatWindow.displayName = 'ChatWindow'
