'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message, AIStatus } from '@clarity-chat/types'
import { Card, Button, Badge, cn } from '@clarity-chat/primitives'
import { duration } from '../../animations/constants'
import { MessageList } from '../message/message-list'
import { ChatInput } from './chat-input'
import { ThinkingIndicator } from '../message/thinking-indicator'
import { BotIcon, SparklesIcon } from '../ui/icons'
import type { CoreMessage } from '../../hooks/chat/use-chat-enhanced'
import { convertCoreMessagesToMessages } from '../../utils/message/message-conversion'
import {
  PromptSuggestions,
  type PromptSuggestion,
} from '../prompt/prompt-suggestions'

export interface ChatWindowProps {
  /** Messages in either Message[] or CoreMessage[] format */
  messages: Message[] | CoreMessage[]
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  /** UI Enhancement flags for 2025 features */
  quantumAnimations?: boolean
  glassmorphism?: boolean
  auroraGradients?: boolean
  neumorphism?: boolean
  voiceIntegration?: boolean
  adaptiveColors?: boolean
  wcagAAA?: boolean
  onSendMessage: (content: string) => void
  /**
   * Callback to stop/cancel the current AI generation.
   * When provided, shows a "Stop" button during loading state.
   * Use with AbortController for proper cancellation.
   * @example
   * ```tsx
   * const abortRef = useRef<AbortController | null>(null)
   *
   * const handleSend = async (content: string) => {
   *   abortRef.current = new AbortController()
   *   await sendMessage(content, { signal: abortRef.current.signal })
   * }
   *
   * <ChatWindow
   *   onSendMessage={handleSend}
   *   onStopGeneration={() => abortRef.current?.abort()}
   * />
   * ```
   */
  onStopGeneration?: () => void
  /** Callback when message is copied */
  onMessageCopy?: (messageId: string, content: string) => void
  /** Callback when feedback is given */
  onMessageFeedback?: (
    messageId: string,
    type: 'up' | 'down',
    comment?: string
  ) => void
  /** Callback when retry is requested */
  onMessageRetry?: (messageId: string) => void
  /** Callback when message is edited (starts edit mode) */
  onEditMessage?: (messageId: string) => void
  /** Callback when message is regenerated */
  onRegenerateMessage?: (messageId: string) => void
  /** Callback when message is deleted */
  onDeleteMessage?: (messageId: string) => void
  /** ID of message currently being edited (for inline editing) */
  editingMessageId?: string | null
  /** Callback when edit is saved - receives message ID and new content */
  onSaveEdit?: (messageId: string, newContent: string) => void
  /** Callback when edit is cancelled */
  onCancelEdit?: (messageId: string) => void
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
  className?: string
  /**
   * 2025 UI/UX Enhancement: Quantum Animations
   */
  quantumAnimations?: boolean
  /**
   * 2025 UI/UX Enhancement: Glassmorphism effect
   */
  glassmorphism?: boolean
  /**
   * 2025 UI/UX Enhancement: Aurora gradients
   */
  auroraGradients?: boolean
  /**
   * 2025 UI/UX Enhancement: Neumorphism style
   */
  neumorphism?: boolean
  /**
   * 2025 UI/UX Enhancement: Voice Integration
   */
  voiceIntegration?: boolean
  /**
   * 2025 UI/UX Enhancement: Adaptive Colors
   */
  adaptiveColors?: boolean
  /**
   * 2025 UI/UX Enhancement: WCAG AAA compliance
   */
  wcagAAA?: boolean
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

// Default empty state component - extracted for better performance
interface DefaultEmptyStateProps {
  starterPrompts?: PromptSuggestion[]
  onSelectPrompt?: (suggestion: PromptSuggestion) => void
  showStarterPrompts?: boolean
}

const DefaultEmptyState = React.memo(({
  starterPrompts,
  onSelectPrompt,
  showStarterPrompts = true,
}: DefaultEmptyStateProps) => {
  return (
    <motion.div
      className="text-center space-y-8 px-4 py-8"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: duration('slow'), ease: [0.25, 0.1, 0.25, 1] }}
    >
      {/* Animated icon with decorative rings */}
      <div className="relative inline-flex items-center justify-center">
        {/* Outer decorative ring */}
        <motion.div
          className="absolute w-32 h-32 rounded-full border border-primary/10"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: duration('slower'),
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {/* Middle decorative ring */}
        <motion.div
          className="absolute w-28 h-28 rounded-full border border-primary/20"
          animate={{
            scale: [1, 1.03, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: duration('slower'),
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.5,
          }}
        />
        {/* Main icon container */}
        <motion.div
          className="relative z-10 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/5 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.3)] ring-1 ring-primary/20"
          animate={{
            scale: [1, 1.02, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: duration('slower'),
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: duration('slower'),
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <BotIcon size={40} className="text-primary" />
          </motion.div>
        </motion.div>
      </div>

      <div className="space-y-3">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
          Start a conversation
        </h3>
        <p className="text-sm text-muted-foreground/80 max-w-md mx-auto leading-relaxed">
          Send a message to begin chatting with the AI assistant. I'm here to help
          with your questions and tasks.
        </p>
      </div>

      {/* Starter Prompts - 2024 AI UX Pattern */}
      {showStarterPrompts &&
        starterPrompts &&
        starterPrompts.length > 0 &&
        onSelectPrompt && (
          <motion.div
            className="pt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2,
              duration: duration('slow'),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <div className="flex items-center justify-center gap-2 mb-5">
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  duration: duration('slower'),
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <SparklesIcon size={14} className="text-primary" />
              </motion.div>
              <span className="text-xs font-semibold text-muted-foreground/70 uppercase tracking-wider">
                Try asking
              </span>
            </div>
            <PromptSuggestions
              suggestions={starterPrompts}
              onSelect={onSelectPrompt}
              suggestionType="starter"
              layout="chips"
              maxSuggestions={4}
              className="justify-center"
            />
          </motion.div>
        )}
    </motion.div>
  )
})

DefaultEmptyState.displayName = 'DefaultEmptyState'

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
  quantumAnimations = false,
  glassmorphism = false,
  auroraGradients = false,
  neumorphism = false,
  voiceIntegration = false,
  adaptiveColors = false,
  wcagAAA = false,
  onSendMessage,
  onStopGeneration,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  editingMessageId,
  onSaveEdit,
  onCancelEdit,
  emptyState,
  showHeader = false,
  sessionTitle = 'Chat Session',
  sessionSubtitle,
  headerActions,
  showMessageCount = false,
  onExport,
  onClear,
  error,
  onRetry,
  onDismissError,
  className,
  starterPrompts,
  followUpSuggestions,
  showStarterPrompts = true,
  showFollowUpSuggestions = true,
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
      (typeof firstMessage.content === 'string' ||
        Array.isArray(firstMessage.content)) &&
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

  // Handle prompt selection (starter or follow-up)
  const handlePromptSelect = (suggestion: PromptSuggestion) => {
    onSendMessage(suggestion.text)
  }

  // React 19: Simple derivation - compiler optimizes
  const effectiveEmptyState = emptyState || (
    <DefaultEmptyState
      starterPrompts={starterPrompts}
      onSelectPrompt={handlePromptSelect}
      showStarterPrompts={showStarterPrompts}
    />
  )

  // Check if we should show follow-up suggestions
  // Only show when: not loading, has messages, last message is from assistant, has suggestions
  const lastMessage = normalizedMessages[normalizedMessages.length - 1]
  const shouldShowFollowUp =
    showFollowUpSuggestions &&
    !isLoading &&
    followUpSuggestions &&
    followUpSuggestions.length > 0 &&
    lastMessage?.role === 'assistant' &&
    lastMessage?.status !== 'streaming'

  // React 19: Simple string derivation - compiler optimizes
  const messageCountText =
    normalizedMessages.length === 0
      ? null
      : `${normalizedMessages.length} ${normalizedMessages.length === 1 ? 'message' : 'messages'}`

  return (
    <Card
      className={cn(
        'flex h-full flex-col overflow-hidden',
        'bg-gradient-to-b from-card via-card to-background/50',
        'border-border/30',
        'shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)]',
        'backdrop-blur-sm',
        className
      )}
    >
      {/* Optional Header */}
      {showHeader && (
        <motion.div
          className="flex items-center justify-between gap-4 border-b border-border/60 bg-card/50 px-5 py-4 sm:px-6 backdrop-blur-md"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: duration('slow'),
            ease: [0.25, 0.1, 0.25, 1],
          }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm ring-1 ring-primary/25">
              <BotIcon size={22} />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5 pl-0.5">
              <h2 className="text-sm font-bold text-foreground truncate leading-tight">
                {sessionTitle}
              </h2>
              {sessionSubtitle && (
                <p className="text-xs text-muted-foreground/80 truncate leading-tight">
                  {sessionSubtitle}
                </p>
              )}
            </div>
            {showMessageCount && messageCountText && (
              <Badge
                variant="secondary"
                className="shrink-0"
                aria-label={messageCountText}
              >
                {messageCountText}
              </Badge>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {headerActions}

            {onExport && normalizedMessages.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onExport}
                className="gap-2 hover:bg-accent/50 transition-colors"
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
                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
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

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: duration('normal'),
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="border-b border-destructive/30 bg-destructive/5"
            role="alert"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <svg
                  className="h-4 w-4 text-destructive shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-sm text-destructive truncate">
                  {error}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onRetry && (
                  <Button
                    size="sm"
                    variant="default"
                    onClick={onRetry}
                    className="h-7 px-3 text-xs font-medium"
                  >
                    Retry
                  </Button>
                )}
                {onDismissError && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onDismissError}
                    className="h-7 w-7 p-0"
                    aria-label="Dismiss error"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
          messages={normalizedMessages}
          isLoading={isLoading}
          onMessageCopy={onMessageCopy}
          onMessageFeedback={onMessageFeedback}
          onMessageRetry={onMessageRetry}
          onEditMessage={onEditMessage}
          onRegenerateMessage={onRegenerateMessage}
          onDeleteMessage={onDeleteMessage}
          onStopGeneration={onStopGeneration}
          editingMessageId={editingMessageId}
          onSaveEdit={onSaveEdit}
          onCancelEdit={onCancelEdit}
          emptyState={effectiveEmptyState}
          className="flex-1 min-h-0"
        />

        {/* Follow-up Suggestions - 2024 AI UX Pattern */}
        <AnimatePresence>
          {shouldShowFollowUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                duration: duration('normal'),
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="px-5 pb-3"
            >
              <div className="flex items-center gap-2 mb-3">
                <SparklesIcon size={12} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground/80">
                  Suggested follow-ups
                </span>
              </div>
              <PromptSuggestions
                suggestions={followUpSuggestions!}
                onSelect={handlePromptSelect}
                suggestionType="follow-up"
                layout="chips"
                maxSuggestions={3}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thinking Indicator - positioned above input */}
        <AnimatePresence>
          {isLoading && aiStatus && (
            <div className="px-5 pb-3">
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
