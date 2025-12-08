'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { TimeSeparator } from './time-separator'
import { ScrollArea, Button, cn } from '@clarity-chat/primitives'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { ArrowDownIcon } from './icons'
import { SkeletonMessage } from './skeleton'
import {
  createStaggerContainerVariant,
  createStaggerChildVariant,
} from '../animations/utils'
import { INTERACTION_VARIANTS } from '../animations/constants'
import {
  getMotionSafeDuration,
  getMotionSafeScale,
  getMotionSafeValue,
} from '../animations/motion-safe'
import {
  getMessageGrouping,
  getTimeSeparator,
  shouldShowTimeSeparator,
} from '../utils/message-grouping'
import type { ReactNode } from 'react'

export interface MessageListProps {
  messages: MessageType[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  onMessageRetry?: (messageId: string) => void
  onEditMessage?: (messageId: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  /** Show loading skeleton while messages are being fetched */
  isLoading?: boolean
  /** Number of skeleton messages to show while loading */
  loadingCount?: number
  /** Empty state content */
  emptyState?: ReactNode
  /** Enable message grouping (default: true) */
  enableGrouping?: boolean
  /** Show time separators between days (default: true) */
  showTimeSeparators?: boolean
  className?: string
}

/**
 * MessageList - Mid-Level Composable Component
 *
 * **Architecture Layer**: Mid-Level (Composable Building Blocks)
 * **Domain**: Chat UI
 *
 * A composable message list component with auto-scrolling, animations, and
 * message interaction handlers.
 *
 * For drop-in usage, use top-level `ClarityChat` component instead.
 * For custom message rendering, use low-level `Message` component.
 *
 * React 19 Enhancements:
 * - Removed memo() wrapper - compiler handles optimization
 * - Removed simple useMemo - compiler optimizes static values
 *
 * @param props - MessageList configuration
 * @param props.messages - Array of messages to display (required)
 * @param props.onMessageCopy - Callback when message is copied
 * @param props.onMessageFeedback - Callback for message feedback (up/down)
 * @param props.onMessageRetry - Callback to retry a message
 * @param props.isLoading - Show loading skeleton (default: false)
 * @param props.emptyState - Custom empty state content
 * @returns Message list component
 *
 * @example
 * ```tsx
 * <MessageList
 *   messages={messages}
 *   onMessageCopy={(id, content) => navigator.clipboard.writeText(content)}
 *   onMessageRetry={(id) => retryMessage(id)}
 *   isLoading={isLoading}
 * />
 * ```
 */
export function MessageList({
  messages,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  onEditMessage,
  onRegenerateMessage,
  onDeleteMessage,
  isLoading = false,
  loadingCount = 3,
  emptyState,
  enableGrouping = true,
  showTimeSeparators = true,
  className,
}: MessageListProps) {
  // Runtime validation
  if (!Array.isArray(messages)) {
    throw new Error(
      'MessageList: "messages" prop must be an array.\n\n' +
        'Example:\n' +
        '  <MessageList messages={[]} />\n\n' +
        'For more help, see: https://clarity-chat.dev/docs/components'
    )
  }
  // Use auto-scroll hook with smooth scrolling
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth',
    threshold: 100,
  })

  // Accessibility: Respect user's motion preferences
  const prefersReducedMotion = useReducedMotion()

  // Track message count when user scrolls away
  const [messageCountWhenScrolledAway, setMessageCountWhenScrolledAway] =
    React.useState<number | null>(null)
  const [showPulse, setShowPulse] = React.useState(false)

  // Track when user scrolls away from bottom
  React.useEffect(() => {
    if (!isNearBottom && messageCountWhenScrolledAway === null) {
      setMessageCountWhenScrolledAway(messages.length)
    } else if (isNearBottom) {
      setMessageCountWhenScrolledAway(null)
      setShowPulse(false)
    }
  }, [isNearBottom, messageCountWhenScrolledAway, messages.length])

  // Show pulse animation when new messages arrive while scrolled away
  React.useEffect(() => {
    if (
      !isNearBottom &&
      messageCountWhenScrolledAway !== null &&
      messages.length > messageCountWhenScrolledAway
    ) {
      setShowPulse(true)
      const timeout = setTimeout(() => setShowPulse(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [messages.length, messageCountWhenScrolledAway, isNearBottom])

  // Keyboard shortcut: End key to jump to bottom
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'End' && !isNearBottom) {
        e.preventDefault()
        scrollToBottom()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNearBottom, scrollToBottom])

  // Calculate new message count
  const newMessageCount =
    messageCountWhenScrolledAway !== null
      ? Math.max(0, messages.length - messageCountWhenScrolledAway)
      : 0

  // React 19: Static function calls - compiler optimizes, no useMemo needed
  const containerVariants = createStaggerContainerVariant('normal', 0)
  const itemVariants = createStaggerChildVariant('slide', 'fast')

  // React 19: Simple boolean derivation - compiler optimizes
  const showEmptyState = messages.length === 0 && !isLoading && emptyState

  // Check if any message is currently streaming (for aria-busy)
  // React 19 compiler auto-memoizes; useMemo added for React 18 compatibility
  const isStreaming = React.useMemo(
    () => messages.some((m) => m.status === 'streaming'),
    [messages]
  )

  return (
    <div
      className={cn('flex flex-col flex-1 min-h-0 overflow-hidden', className)}
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
      aria-relevant="additions"
      aria-busy={isStreaming}
    >
      <ScrollArea
        ref={scrollRef as React.LegacyRef<HTMLDivElement>}
        className="flex-1 min-h-0 bg-transparent px-2 py-4 sm:px-4"
      >
        <AnimatePresence mode="wait" initial={false}>
          {/* Loading skeletons - only when no messages exist */}
          {isLoading && messages.length === 0 && (
            <motion.div
              key="loading-skeletons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-y-4 px-4 py-6"
            >
              {Array.from({ length: loadingCount }).map((_, index) => (
                <SkeletonMessage
                  key={`skeleton-${index}`}
                  role={index % 2 === 0 ? 'user' : 'assistant'}
                  lines={index % 2 === 0 ? 2 : 4}
                  variant="shimmer"
                />
              ))}
            </motion.div>
          )}

          {/* Empty state */}
          {showEmptyState && (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="px-2 py-4"
            >
              {emptyState}
            </motion.div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <motion.div
              key="messages-container"
              className="space-y-3 px-2 pb-6 sm:px-4"
              variants={containerVariants}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {messages.map((message, index) => {
                // Calculate grouping for this message
                const grouping = enableGrouping
                  ? getMessageGrouping(messages, index)
                  : {
                      isGroupStart: true,
                      isGroupEnd: true,
                      isGrouped: false,
                      showTimestamp: true,
                    }

                // Check if we should show a time separator before this message
                const showSeparator =
                  showTimeSeparators &&
                  shouldShowTimeSeparator(messages[index - 1], message)

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="w-full"
                  >
                    {/* Time separator */}
                    {showSeparator && message.createdAt && (
                      <TimeSeparator>
                        {getTimeSeparator(
                          new Date(message.createdAt).toISOString()
                        )}
                      </TimeSeparator>
                    )}

                    {/* Message */}
                    <motion.div variants={itemVariants}>
                      <Message
                        message={message}
                        onCopy={(content) =>
                          onMessageCopy?.(message.id, content)
                        }
                        onFeedback={(type) =>
                          onMessageFeedback?.(message.id, type)
                        }
                        onRetry={() => onMessageRetry?.(message.id)}
                        onEdit={() => onEditMessage?.(message.id)}
                        onRegenerate={() => onRegenerateMessage?.(message.id)}
                        onDelete={() => onDeleteMessage?.(message.id)}
                        {...grouping}
                      />
                    </motion.div>
                  </motion.div>
                )
              })}

              {/* Show loading skeleton for new messages while fetching */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <SkeletonMessage
                    role="assistant"
                    lines={3}
                    variant="shimmer"
                  />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      {/* Jump-to-bottom button with new message count */}
      <AnimatePresence>
        {!isNearBottom && messages.length > 0 && (
          <motion.div
            className="absolute bottom-6 right-6 z-10"
            initial={{
              opacity: 0,
              y: getMotionSafeValue(prefersReducedMotion, 10, 0),
              scale: getMotionSafeScale(prefersReducedMotion, 0.9),
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: getMotionSafeValue(prefersReducedMotion, 10, 0),
              scale: getMotionSafeScale(prefersReducedMotion, 0.9),
            }}
            transition={{
              duration: getMotionSafeDuration(prefersReducedMotion, 0.2),
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <motion.div
              className="relative"
              whileHover={{
                scale: getMotionSafeScale(prefersReducedMotion, 1.05),
              }}
              whileTap={{
                scale: getMotionSafeScale(prefersReducedMotion, 0.95),
              }}
              animate={
                showPulse && !prefersReducedMotion
                  ? {
                      scale: [1, 1.08, 1],
                      transition: {
                        duration: 0.6,
                        repeat: 3,
                        ease: 'easeInOut',
                      },
                    }
                  : {}
              }
            >
              {/* New message count badge */}
              <AnimatePresence>
                {newMessageCount > 0 && (
                  <motion.div
                    initial={{
                      scale: getMotionSafeScale(prefersReducedMotion, 0),
                      opacity: 0,
                    }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{
                      scale: getMotionSafeScale(prefersReducedMotion, 0),
                      opacity: 0,
                    }}
                    transition={{
                      duration: getMotionSafeDuration(
                        prefersReducedMotion,
                        0.2
                      ),
                      ease: prefersReducedMotion ? 'linear' : 'backOut',
                    }}
                    className="absolute -top-2 -right-2 z-20"
                  >
                    <div className="bg-primary text-primary-foreground text-xs font-semibold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1.5 shadow-lg border-2 border-background">
                      {newMessageCount > 99 ? '99+' : newMessageCount}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                size="icon"
                variant="default"
                onClick={scrollToBottom}
                className={cn(
                  'h-12 w-12 rounded-full shadow-lg hover:shadow-xl',
                  'bg-primary/95 hover:bg-primary backdrop-blur-md',
                  'border border-primary-foreground/10',
                  'transition-all duration-200'
                )}
                aria-label={
                  newMessageCount > 0
                    ? `Jump to bottom (${newMessageCount} new ${newMessageCount === 1 ? 'message' : 'messages'})`
                    : 'Jump to bottom (End key)'
                }
                title={
                  newMessageCount > 0
                    ? `${newMessageCount} new ${newMessageCount === 1 ? 'message' : 'messages'}`
                    : 'Jump to bottom (End key)'
                }
              >
                <ArrowDownIcon size={20} className="text-primary-foreground" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

MessageList.displayName = 'MessageList'
