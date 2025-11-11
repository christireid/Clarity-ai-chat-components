import { memo, forwardRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import {
  Avatar,
  Button,
  Badge,
  cn,
  formatRelativeTime,
} from '@clarity-chat/primitives'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
} from '../animations/constants'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import {
  MarkdownCodeBlock,
  MessageActions,
  MessageMetadata,
} from './message/index'

export interface MessageProps {
  message: MessageType
  onCopy?: (content: string) => void
  onFeedback?: (type: 'up' | 'down') => void
  onRetry?: () => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
}

export const Message = memo(
  forwardRef<HTMLDivElement, MessageProps>(function Message(
    {
      message,
      onFeedback,
      onRetry,
      onEdit,
      onRegenerate,
      onDelete,
      showAvatar = true,
      showTimestamp = true,
      className,
    },
    ref
  ) {
    const [isHovered, setIsHovered] = useState(false)
    const [feedbackGiven, setFeedbackGiven] = useState<
      'up' | 'down' | null
    >(message.feedback?.type || null)

    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'
    const isStreaming = message.status === 'streaming'

    const [showConfetti, setShowConfetti] = useState(false)

    // Memoized feedback handler
    const handleFeedback = useCallback(
      (type: 'up' | 'down') => {
        setFeedbackGiven(type)
        onFeedback?.(type)

        // Hooked principle: Variable reward
        if (type === 'up') {
          // Trigger confetti animation
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 1000)
        }
      },
      [onFeedback]
    )

    // Memoize markdown components
    const markdownComponents = useMemo(
      () => ({
        code: MarkdownCodeBlock,
      }),
      []
    )

    // Memoize plugins
    const remarkPlugins = useMemo(() => [remarkGfm], [])
    const rehypePlugins = useMemo(
      () => [
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypeHighlight as any, // Type incompatibility between vfile versions
      ],
      []
    )

    return (
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          x: isUser ? 20 : -20, // Slide from appropriate side
          y: 10,
        }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{
          duration: ANIMATION_DURATION.normal / 1000,
          ease: ANIMATION_EASING.out,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group flex gap-3 p-4 rounded-lg transition-all duration-200',
          isUser && 'flex-row-reverse',
          isHovered && 'bg-muted/30 shadow-[0_2px_8px_rgba(15,23,42,0.08)]',
          className
        )}
      >
        {/* Avatar */}
        {showAvatar && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 25,
              delay: 0.1,
            }}
          >
            <Avatar
              src={isUser ? undefined : '/ai-avatar.png'}
              alt={isUser ? 'User' : 'AI Assistant'}
              fallback={isUser ? 'U' : 'AI'}
              className="flex-shrink-0"
            />
          </motion.div>
        )}

        {/* Message Content */}
        <div
          className={cn(
            'flex-1 space-y-2',
            isUser && 'flex flex-col items-end'
          )}
        >
          {/* Header */}
          <div
            className={cn(
              'flex items-center gap-2',
              isUser && 'flex-row-reverse'
            )}
          >
            <span className="font-semibold text-sm">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            {showTimestamp && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground"
              >
                {formatRelativeTime(message.createdAt)}
              </motion.span>
            )}
            {message.status === 'sending' && (
              <Badge variant="secondary" dot>
                Sending
              </Badge>
            )}
            {message.status === 'error' && (
              <Badge variant="destructive">Error</Badge>
            )}
          </div>

          {/* Content */}
          <div
            className={cn(
              'prose prose-sm dark:prose-invert max-w-none',
              isUser &&
                'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-primary/20'
            )}
          >
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap">{message.content}</p>
            ) : (
              // @ts-expect-error - ReactMarkdown v9 has type compatibility issues
              <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents as any}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {isStreaming && (
              <motion.span
                animate={{
                  opacity: [1, 0.3, 1],
                  scale: [1, 0.95, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: 'easeInOut',
                }}
                className="inline-block w-2 h-4 bg-current ml-1 rounded-sm"
              />
            )}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <Badge key={attachment.id} variant="outline">
                  {attachment.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions - Show for both user and assistant messages */}
          {(isUser || isAssistant) && (
            <MessageActions
              messageContent={message.content}
              messageId={message.id}
              role={message.role}
              feedbackGiven={feedbackGiven}
              showConfetti={showConfetti}
              hasError={message.status === 'error'}
              onFeedback={handleFeedback}
              onRetry={onRetry}
              onEdit={onEdit}
              onRegenerate={onRegenerate}
              onDelete={onDelete}
              show={isHovered || !!feedbackGiven}
            />
          )}

          {/* Metadata */}
          <MessageMetadata metadata={message.metadata} />
        </div>
      </motion.div>
    )
  })
)

Message.displayName = 'Message'
