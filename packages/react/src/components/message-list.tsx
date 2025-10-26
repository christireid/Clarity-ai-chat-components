import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Message } from './message'
import { ScrollArea, Button } from '@clarity-chat/primitives'
import { useAutoScroll } from '../hooks/use-auto-scroll'
import { ArrowDownIcon } from './icons'
import { SkeletonMessage } from './skeleton'
import { 
  createStaggerContainerVariant, 
  createStaggerChildVariant 
} from '../animations/utils'
import { INTERACTION_VARIANTS } from '../animations/constants'

export interface MessageListProps {
  messages: MessageType[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down') => void
  onMessageRetry?: (messageId: string) => void
  /** Show loading skeleton while messages are being fetched */
  isLoading?: boolean
  /** Number of skeleton messages to show while loading */
  loadingCount?: number
  /** Empty state content */
  emptyState?: React.ReactNode
  className?: string
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onMessageCopy,
  onMessageFeedback,
  onMessageRetry,
  isLoading = false,
  loadingCount = 3,
  emptyState,
  className,
}) => {
  // Use auto-scroll hook with smooth scrolling
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    behavior: 'smooth',
    threshold: 100,
  })

  // Animation variants
  const containerVariants = createStaggerContainerVariant('normal', 0)
  const itemVariants = createStaggerChildVariant('slide', 'fast')

  // Show empty state if no messages and not loading
  const showEmptyState = messages.length === 0 && !isLoading && emptyState

  return (
    <div className="relative h-full">
      <ScrollArea ref={scrollRef as React.RefObject<HTMLDivElement>} className={className}>
        {/* Loading skeletons */}
        {isLoading && messages.length === 0 && (
          <div className="space-y-4 p-4">
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
            className="flex items-center justify-center h-full p-8"
          >
            {emptyState}
          </motion.div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <motion.div 
            className="space-y-4 p-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  layout
                >
                  <Message
                    message={message}
                    onCopy={(content) => onMessageCopy?.(message.id, content)}
                    onFeedback={(type) => onMessageFeedback?.(message.id, type)}
                    onRetry={() => onMessageRetry?.(message.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show loading skeleton for new messages while fetching */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              whileHover={INTERACTION_VARIANTS.button.hover}
              whileTap={INTERACTION_VARIANTS.button.tap}
              transition={INTERACTION_VARIANTS.button.transition}
            >
              <Button
                size="sm"
                variant="secondary"
                onClick={scrollToBottom}
                className="shadow-lg gap-1.5"
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
