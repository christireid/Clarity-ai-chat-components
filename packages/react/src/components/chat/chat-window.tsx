'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card, Button, cn, glassVariants } from '@clarity-chat/primitives'
import { duration } from '../../animations/constants'
import { MessageList } from '../message/message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from '../message/thinking-indicator'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'
import { ChatWindowHeader, type ChatWindowHeaderProps } from './chat-window-header'
import { DefaultEmptyState } from './empty-state'
import { ErrorBanner } from '../ui/error-banner'
import { FollowUpSuggestions } from './follow-up-suggestions'
import { type PromptSuggestion } from '../prompt/prompt-suggestions'

// Grouped prop interfaces for better API organization
export interface ChatWindowMessageActions {
  /** Callback when message is copied */
  onCopy?: (messageId: string, content: string) => void
  /** Callback when feedback is given */
  onFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
  /** Callback when retry is requested */
  onRetry?: (messageId: string) => void
  /** Callback when message is edited (starts edit mode) */
  onEdit?: (messageId: string) => void
  /** Callback when message is regenerated */
  onRegenerate?: (messageId: string) => void
  /** Callback when message is deleted */
  onDelete?: (messageId: string) => void
}

export interface ChatWindowEditActions {
  /** ID of message currently being edited (for inline editing) */
  editingMessageId?: string | null
  /** Callback when edit is saved - receives message ID and new content */
  onSaveEdit?: (messageId: string, newContent: string) => void
  /** Callback when edit is cancelled */
  onCancelEdit?: (messageId: string) => void
}

export interface ChatWindowHeaderConfig {
  /** Show header with session info */
  show?: boolean
  /** Session title */
  title?: string
  /** Session subtitle or description */
  subtitle?: string
  /** Header actions */
  actions?: React.ReactNode
  /** Show message count badge */
  showMessageCount?: boolean
}

export interface ChatWindowActions {
  /** Enable export functionality */
  onExport?: () => void
  /** Enable clear chat functionality */
  onClear?: () => void
}

export interface ChatWindowErrorHandling {
  /**
   * Error message to display (e.g., network errors).
   * Shows a banner above the chat when set.
   */
  error?: string | null
  /**
   * Callback to retry after an error.
   * When provided along with `error`, shows a "Retry" button.
   */
  onRetry?: () => void
  /**
   * Callback to dismiss the error banner.
   * When provided, shows a dismiss button on the error banner.
   */
  onDismissError?: () => void
}

export interface ChatWindowPromptConfig {
  /**
   * Starter prompts to show in empty state (2024 AI UX trend)
   * These help users discover what the chat can do
   */
  starterPrompts?: PromptSuggestion[]
  /**
   * Suggested follow-up prompts shown after assistant messages
   * Helps maintain conversation flow
   */
  followUpSuggestions?: PromptSuggestion[]
  /**
   * Whether to show starter prompts in empty state
   * @default true when starterPrompts is provided
   */
  showStarterPrompts?: boolean
  /**
   * Whether to show follow-up suggestions after last assistant message
   * @default true when followUpSuggestions is provided
   */
  showFollowUpSuggestions?: boolean
}

export interface ChatWindowProps {
  /** Messages in either Message[] or CoreMessage[] format */
  messages: Message[] | CoreMessage[]
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  onSendMessage: (content: string) => void
  /**
   * Callback to stop/cancel the current AI generation.
   * When provided, shows a "Stop" button during loading state.
   */
  onStopGeneration?: () => void

  /** Message interaction callbacks */
  messageActions?: ChatWindowMessageActions
  /** Edit-related callbacks */
  editActions?: ChatWindowEditActions
  /** Header configuration */
  header?: ChatWindowHeaderConfig
  /** Global actions (export, clear) */
  actions?: ChatWindowActions
  /** Error handling configuration */
  errorHandling?: ChatWindowErrorHandling
  /** Prompt suggestions configuration */
  prompts?: ChatWindowPromptConfig

  /** Custom empty state */
  emptyState?: React.ReactNode
  className?: string

  // Legacy props for backward compatibility
  /** @deprecated Use messageActions.onCopy instead */
  onMessageCopy?: (messageId: string, content: string) => void
  /** @deprecated Use messageActions.onFeedback instead */
  onMessageFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
  /** @deprecated Use messageActions.onRetry instead */
  onMessageRetry?: (messageId: string) => void
  /** @deprecated Use messageActions.onEdit instead */
  onEditMessage?: (messageId: string) => void
  /** @deprecated Use messageActions.onRegenerate instead */
  onRegenerateMessage?: (messageId: string) => void
  /** @deprecated Use messageActions.onDelete instead */
  onDeleteMessage?: (messageId: string) => void
  /** @deprecated Use editActions.editingMessageId instead */
  editingMessageId?: string | null
  /** @deprecated Use editActions.onSaveEdit instead */
  onSaveEdit?: (messageId: string, newContent: string) => void
  /** @deprecated Use editActions.onCancelEdit instead */
  onCancelEdit?: (messageId: string) => void
  /** @deprecated Use header.show instead */
  showHeader?: boolean
  /** @deprecated Use header.title instead */
  sessionTitle?: string
  /** @deprecated Use header.subtitle instead */
  sessionSubtitle?: string
  /** @deprecated Use header.actions instead */
  headerActions?: React.ReactNode
  /** @deprecated Use header.showMessageCount instead */
  showMessageCount?: boolean
  /** @deprecated Use actions.onExport instead */
  onExport?: () => void
  /** @deprecated Use actions.onClear instead */
  onClear?: () => void
  /** @deprecated Use errorHandling.error instead */
  error?: string | null
  /** @deprecated Use errorHandling.onRetry instead */
  onRetry?: () => void
  /** @deprecated Use errorHandling.onDismissError instead */
  onDismissError?: () => void
  /** @deprecated Use prompts.starterPrompts instead */
  starterPrompts?: PromptSuggestion[]
  /** @deprecated Use prompts.followUpSuggestions instead */
  followUpSuggestions?: PromptSuggestion[]
  /** @deprecated Use prompts.showStarterPrompts instead */
  showStarterPrompts?: boolean
  /** @deprecated Use prompts.showFollowUpSuggestions instead */
  showFollowUpSuggestions?: boolean
}

// Skip Links Navigation Component
interface SkipLinksProps {
  messagesId: string
  inputId: string
}

const SkipLinks = ({ messagesId, inputId }: SkipLinksProps) => (
  <nav
    className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:top-0 focus-within:left-0 focus-within:right-0 focus-within:z-50 focus-within:bg-background focus-within:p-2 focus-within:border-b"
    aria-label="Skip links"
  >
    <ul className="flex gap-4 justify-center">
      <li>
        <a
          href={`#${messagesId}`}
          className="text-sm font-medium text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
        >
          Skip to messages
        </a>
      </li>
      <li>
        <a
          href={`#${inputId}`}
          className="text-sm font-medium text-primary underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2 py-1"
        >
          Skip to chat input
        </a>
      </li>
    </ul>
  </nav>
)

// Live Region for Screen Reader Announcements Component
interface LiveRegionProps {
  lastAnnouncedMessageId: string | null
  setLastAnnouncedMessageId: (id: string | null) => void
  normalizedMessages: Message[]
  isLoading: boolean
}

const LiveRegion = ({
  lastAnnouncedMessageId,
  setLastAnnouncedMessageId,
  normalizedMessages,
  isLoading
}: LiveRegionProps) => {
  const liveRegionRef = React.useRef<HTMLDivElement>(null)

  // Accessibility: Announce new messages to screen readers
  React.useEffect(() => {
    if (normalizedMessages.length === 0) return

    const latestMessage = normalizedMessages[normalizedMessages.length - 1]
    if (!latestMessage || latestMessage.id === lastAnnouncedMessageId) return

    // Only announce completed messages (not streaming)
    if (latestMessage.status === 'streaming') return

    setLastAnnouncedMessageId(latestMessage.id)

    // Construct announcement text
    const roleLabel = latestMessage.role === 'assistant' ? 'Assistant' : 'You'
    const contentPreview =
      typeof latestMessage.content === 'string'
        ? latestMessage.content.slice(0, 100) +
          (latestMessage.content.length > 100 ? '...' : '')
        : 'Message received'

    // Update the live region for screen reader announcement
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `${roleLabel} said: ${contentPreview}`
    }
  }, [normalizedMessages, lastAnnouncedMessageId, setLastAnnouncedMessageId])

  // Accessibility: Announce loading state changes
  React.useEffect(() => {
    if (liveRegionRef.current) {
      if (isLoading) {
        liveRegionRef.current.textContent = 'AI is generating a response...'
      }
    }
  }, [isLoading])

  return (
    <div
      ref={liveRegionRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  )
}

/**
 * ChatWindow - Mid-Level Composable Component
 *
 * A composable chat window component that accepts messages and handles
 * rendering, input, and user interactions.
 */
export function ChatWindow({
  messages,
  isLoading = false,
  aiStatus,
  onSendMessage,
  onStopGeneration,

  // Grouped props
  messageActions,
  editActions,
  header,
  actions,
  errorHandling,
  prompts,

  // Legacy props for backward compatibility
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  editingMessageId,
  onSaveEdit,
  onCancelEdit,
  showHeader,
  sessionTitle,
  sessionSubtitle,
  headerActions,
  showMessageCount,
  onExport,
  onClear,
  error,
  onRetry,
  onDismissError,
  starterPrompts,
  followUpSuggestions,
  showStarterPrompts,
  showFollowUpSuggestions,

  // Other props
  emptyState,
  className,
}: ChatWindowProps) {
  // Map legacy props to grouped props for backward compatibility
  const effectiveMessageActions = React.useMemo(() => ({
    onCopy: messageActions?.onCopy ?? onMessageCopy,
    onFeedback: messageActions?.onFeedback ?? onMessageFeedback,
    onRetry: messageActions?.onRetry ?? onMessageRetry,
    onEdit: messageActions?.onEdit ?? onEditMessage,
    onRegenerate: messageActions?.onRegenerate ?? onRegenerateMessage,
    onDelete: messageActions?.onDelete ?? onDeleteMessage,
  }), [messageActions, onMessageCopy, onMessageFeedback, onMessageRetry, onEditMessage, onRegenerateMessage, onDeleteMessage])

  const effectiveEditActions = React.useMemo(() => ({
    editingMessageId: editActions?.editingMessageId ?? editingMessageId,
    onSaveEdit: editActions?.onSaveEdit ?? onSaveEdit,
    onCancelEdit: editActions?.onCancelEdit ?? onCancelEdit,
  }), [editActions, editingMessageId, onSaveEdit, onCancelEdit])

  const effectiveHeader = React.useMemo(() => ({
    show: header?.show ?? showHeader ?? false,
    title: header?.title ?? sessionTitle ?? 'Chat Session',
    subtitle: header?.subtitle ?? sessionSubtitle,
    actions: header?.actions ?? headerActions,
    showMessageCount: header?.showMessageCount ?? showMessageCount ?? false,
  }), [header, showHeader, sessionTitle, sessionSubtitle, headerActions, showMessageCount])

  const effectiveActions = React.useMemo(() => ({
    onExport: actions?.onExport ?? onExport,
    onClear: actions?.onClear ?? onClear,
  }), [actions, onExport, onClear])

  const effectiveErrorHandling = React.useMemo(() => ({
    error: errorHandling?.error ?? error,
    onRetry: errorHandling?.onRetry ?? onRetry,
    onDismissError: errorHandling?.onDismissError ?? onDismissError,
  }), [errorHandling, error, onRetry, onDismissError])

  const effectivePrompts = React.useMemo(() => ({
    starterPrompts: prompts?.starterPrompts ?? starterPrompts,
    followUpSuggestions: prompts?.followUpSuggestions ?? followUpSuggestions,
    showStarterPrompts: prompts?.showStarterPrompts ?? showStarterPrompts ?? true,
    showFollowUpSuggestions: prompts?.showFollowUpSuggestions ?? showFollowUpSuggestions ?? true,
  }), [prompts, starterPrompts, followUpSuggestions, showStarterPrompts, showFollowUpSuggestions])

  // Runtime validation
  if (!Array.isArray(messages)) {
    throw new Error(
      'ChatWindow: "messages" prop must be an array.'
    )
  }

  if (typeof onSendMessage !== 'function') {
    throw new Error(
      'ChatWindow: "onSendMessage" prop is required and must be a function.'
    )
  }

  const [input, setInput] = React.useState('')

  // Accessibility: Track the latest message for screen reader announcements
  const [lastAnnouncedMessageId, setLastAnnouncedMessageId] = React.useState<
    string | null
  >(null)

  // Unique IDs for skip link targets
  const chatWindowId = React.useId()
  const messagesId = `${chatWindowId}-messages`
  const inputId = `${chatWindowId}-input`

  // Convert CoreMessage[] to Message[] if needed
  const normalizedMessages = React.useMemo(() => {
    if (messages.length === 0) return []

    // Check if it's CoreMessage[] format by checking first message structure
    const firstMessage = messages[0]
    const isCoreMessage =
      firstMessage &&
      'content' in firstMessage &&
      (typeof firstMessage.content === 'string' ||
        Array.isArray(firstMessage.content)) &&
      !('status' in firstMessage)

    if (isCoreMessage) {
      return convertCoreMessagesToMessages(messages as CoreMessage[])
    }

    return messages as Message[]
  }, [messages])

  const handleSubmit = (content: string) => {
    onSendMessage(content)
    setInput('')
  }

  const handlePromptSelect = (suggestion: PromptSuggestion) => {
    onSendMessage(suggestion.text)
  }

  const effectiveEmptyState = emptyState || (
    <DefaultEmptyState
      starterPrompts={effectivePrompts.starterPrompts}
      onSelectPrompt={handlePromptSelect}
      showStarterPrompts={effectivePrompts.showStarterPrompts}
    />
  )

  const lastMessage = normalizedMessages[normalizedMessages.length - 1]
  const shouldShowFollowUp =
    effectivePrompts.showFollowUpSuggestions &&
    !isLoading &&
    effectivePrompts.followUpSuggestions &&
    effectivePrompts.followUpSuggestions.length > 0 &&
    lastMessage?.role === 'assistant' &&
    lastMessage?.status !== 'streaming'

  const messageCountText =
    normalizedMessages.length === 0
      ? null
      : `${normalizedMessages.length} ${normalizedMessages.length === 1 ? 'message' : 'messages'}`

  return (
    <Card
      className={cn(
        glassVariants({
          intensity: 'medium',
          gradient: 'none',
          border: 'light',
          animated: 'none',
        }),
        'flex h-full flex-col overflow-hidden',
        'relative',
        className
      )}
      role="region"
      aria-label={effectiveHeader.title}
    >
      <SkipLinks messagesId={messagesId} inputId={inputId} />

      <LiveRegion
        lastAnnouncedMessageId={lastAnnouncedMessageId}
        setLastAnnouncedMessageId={setLastAnnouncedMessageId}
        normalizedMessages={normalizedMessages}
        isLoading={isLoading}
      />

      <ChatWindowHeader
        show={effectiveHeader.show}
        title={effectiveHeader.title}
        subtitle={effectiveHeader.subtitle}
        actions={effectiveHeader.actions}
        showMessageCount={effectiveHeader.showMessageCount}
        messageCountText={messageCountText}
        onExport={effectiveActions.onExport}
        onClear={effectiveActions.onClear}
        normalizedMessagesLength={normalizedMessages.length}
      />

      <ErrorBanner
        error={effectiveErrorHandling.error}
        onRetry={effectiveErrorHandling.onRetry}
        onDismissError={effectiveErrorHandling.onDismissError}
      />

      {/* Stop Generation Banner */}
      <AnimatePresence>
        {isLoading && onStopGeneration && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: duration('normal'),
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="border-b border-amber-300/50 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700/50"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: duration('slower'),
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full"
                />
                <span className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                  AI is generating response...
                </span>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={onStopGeneration}
                className="h-7 px-3 text-xs font-medium"
              >
                Stop
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <MessageList
          id={messagesId}
          messages={normalizedMessages}
          isLoading={isLoading}
          onMessageCopy={effectiveMessageActions.onCopy}
          onMessageFeedback={effectiveMessageActions.onFeedback}
          onMessageRetry={effectiveMessageActions.onRetry}
          onEditMessage={effectiveMessageActions.onEdit}
          onRegenerateMessage={effectiveMessageActions.onRegenerate}
          onDeleteMessage={effectiveMessageActions.onDelete}
          onStopGeneration={onStopGeneration}
          editingMessageId={effectiveEditActions.editingMessageId}
          onSaveEdit={effectiveEditActions.onSaveEdit}
          onCancelEdit={effectiveEditActions.onCancelEdit}
          emptyState={effectiveEmptyState}
          className="flex-1 min-h-0"
          aria-label="Chat messages"
          role="log"
          aria-live="polite"
        />

        <FollowUpSuggestions
          showFollowUp={shouldShowFollowUp ?? false}
          followUpSuggestions={effectivePrompts.followUpSuggestions}
          onPromptSelect={handlePromptSelect}
        />

        {/* Thinking Indicator - positioned above input */}
        <AnimatePresence>
          {isLoading && aiStatus && (
            <div className="px-5 pb-3">
              <ThinkingIndicator status={aiStatus} />
            </div>
          )}
        </AnimatePresence>

        <ChatInput
          id={inputId}
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
          disabled={isLoading}
          aria-label="Type your message"
        />
      </div>
    </Card>
  )
}

ChatWindow.displayName = 'ChatWindow'
