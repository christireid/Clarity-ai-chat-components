import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { ScrollArea, Button, cn } from '@clarity-chat/primitives'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import { ArrowDownIcon } from './icons'
import { SkeletonMessage } from './skeleton'
import {
  createStaggerContainerVariant,
  createStaggerChildVariant,
} from '../animations/utils'
import { INTERACTION_VARIANTS } from '../animations/constants'
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
  className?: string
}

/**
 * MessageList component - Enhanced with React 19 features
 * 
 * React 19 Enhancements:
 * - Removed memo() wrapper - compiler handles optimization
 * - Removed simple useMemo - compiler optimizes static values
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
  className,
}: MessageListProps) {
  // Use auto-scroll hook with smooth scrolling
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth',
    threshold: 100,
  })

  // React 19: Static function calls - compiler optimizes, no useMemo needed
  const containerVariants = createStaggerContainerVariant('normal', 0)
  const itemVariants = createStaggerChildVariant('slide', 'fast')

  // React 19: Simple boolean derivation - compiler optimizes
  const showEmptyState = messages.length === 0 && !isLoading && emptyState

  return (
    <div className="relative h-full">
      <ScrollArea
        ref={scrollRef as React.LegacyRef<HTMLDivElement>}
        className={cn('h-full bg-transparent px-2 py-4 sm:px-4', className)}
      >
        {/* Loading skeletons */}
        {isLoading && messages.length === 0 && (
          <div className="space-y-4 px-4 py-6">
            {Array.from({ length: loadingCount }).map((_, index) => (
              <SkeletonMessage
                key={`skeleton-${index}`}
                role={index % 2 === 0 ? 'user' : 'assistant'}
                lines={index % 2 === 0 ? 2 : 4}
                variant="shimmer"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {showEmptyState && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex h-full items-center justify-center px-6 py-12 bg-gradient-to-b from-background/0 to-muted/10"
          >
            {emptyState}
          </motion.div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <motion.div
            className="space-y-3 px-2 pb-6 sm:px-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div key={message.id} variants={itemVariants} layout>
                  <Message
                    message={message}
                    onCopy={(content) => onMessageCopy?.(message.id, content)}
                    onFeedback={(type) => onMessageFeedback?.(message.id, type)}
                    onRetry={() => onMessageRetry?.(message.id)}
                    onEdit={() => onEditMessage?.(message.id)}
                    onRegenerate={() => onRegenerateMessage?.(message.id)}
                    onDelete={() => onDeleteMessage?.(message.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show loading skeleton for new messages while fetching */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <SkeletonMessage role="assistant" lines={3} variant="shimmer" />
              </motion.div>
            )}
          </motion.div>
        )}
      </ScrollArea>

      {/* Show scroll-to-bottom button when not at bottom */}
      <AnimatePresence>
        {!isNearBottom && messages.length > 0 && (
          <motion.div
            className="absolute bottom-4 right-4"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              whileHover={INTERACTION_VARIANTS.button.hover}
              whileTap={INTERACTION_VARIANTS.button.tap}
              transition={INTERACTION_VARIANTS.button.transition}
            >
              <Button
                size="sm"
                variant="default"
                onClick={scrollToBottom}
                className="shadow-[0_4px_16px_rgba(0,0,0,0.12)] gap-1.5 bg-primary/95 hover:bg-primary hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] backdrop-blur-sm rounded-full"
                aria-label="Scroll to bottom of messages"
              >
                <ArrowDownIcon size={16} />
                Scroll to bottom
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

MessageList.displayName = 'MessageList'
