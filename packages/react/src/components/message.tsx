import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import {
  Avatar,
  Button,
  Badge,
  cn,
  formatRelativeTime,
} from '@clarity-chat/primitives'
import { CopyButton } from './copy-button'
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from './icons'
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  INTERACTION_VARIANTS,
} from '../animations/constants'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

// Memoize markdown plugins to prevent recreation on every render
const markdownPlugins = {
  remark: [remarkGfm],
  rehype: [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypeHighlight as any, // Type incompatibility between vfile versions in react-markdown
  ],
} as const

/**
 * Code block component for markdown rendering
 * Extracted to prevent recreation on every render
 */
const CodeBlock = React.memo(function CodeBlock({
  inline,
  className,
  children,
  ...rest
}: {
  inline?: boolean
  className?: string
  children: React.ReactNode
  [key: string]: unknown
}) {
  if (inline) {
    return (
      <code className="bg-muted px-1 py-0.5 rounded text-sm" {...rest}>
        {children}
      </code>
    )
  }

  return (
    <div className="relative group/code">
      <pre className={cn('relative', className)}>
        <code {...rest}>{children}</code>
      </pre>
      <CopyButton
        text={String(children).replace(/\n$/, '')}
        className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity"
      />
    </div>
  )
})

CodeBlock.displayName = 'CodeBlock'

/**
 * Streaming cursor indicator component
 */
const StreamingCursor = React.memo(function StreamingCursor() {
  return (
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
      aria-hidden="true"
    />
  )
})

StreamingCursor.displayName = 'StreamingCursor'

/**
 * Confetti effect component
 */
const ConfettiEffect = React.memo(function ConfettiEffect() {
  return (
    <>
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{
            opacity: 1,
            scale: 0,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: 0,
            scale: 1,
            x: Math.cos((i * Math.PI * 2) / 8) * 30,
            y: Math.sin((i * Math.PI * 2) / 8) * 30,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
          style={{
            backgroundColor: [
              '#10b981',
              '#f59e0b',
              '#3b82f6',
              '#ef4444',
            ][i % 4],
          }}
        />
      ))}
    </>
  )
})

ConfettiEffect.displayName = 'ConfettiEffect'

/**
 * Feedback button component with confetti support
 */
const FeedbackButton = React.memo(function FeedbackButton({
  type,
  feedbackGiven,
  onClick,
  showConfetti,
}: {
  type: 'up' | 'down'
  feedbackGiven: 'up' | 'down' | null
  onClick: () => void
  showConfetti: boolean
}) {
  const isActive = feedbackGiven === type
  const Icon = type === 'up' ? ThumbsUpIcon : ThumbsDownIcon

  return (
    <div className="relative">
      <motion.div
        whileHover={{
          scale: 1.1,
          rotate: isActive ? 0 : type === 'up' ? -15 : 15,
        }}
        whileTap={{ scale: 0.9 }}
        animate={
          isActive
            ? {
                scale: [1, type === 'up' ? 1.2 : 1.1, 1],
                rotate: [0, type === 'up' ? -15 : 15, type === 'up' ? 15 : -15, type === 'up' ? -15 : 15, 0],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onClick}
          className={cn(
            'transition-colors',
            isActive &&
              (type === 'up'
                ? 'text-success bg-success/10'
                : 'text-destructive bg-destructive/10')
          )}
          aria-label={type === 'up' ? 'Good response' : 'Poor response'}
        >
          <Icon size={16} />
        </Button>
      </motion.div>

      {/* Confetti Effect for thumbs up */}
      {type === 'up' && showConfetti && (
        <AnimatePresence>
          <ConfettiEffect />
        </AnimatePresence>
      )}
    </div>
  )
})

FeedbackButton.displayName = 'FeedbackButton'

/**
 * Message actions toolbar component
 */
const MessageActions = React.memo(function MessageActions({
  message,
  feedbackGiven,
  onCopy,
  onFeedback,
  onRetry,
  showConfetti,
}: {
  message: MessageType
  feedbackGiven: 'up' | 'down' | null
  onCopy?: (content: string) => void
  onFeedback?: (type: 'up' | 'down') => void
  onRetry?: () => void
  showConfetti: boolean
}) {
  const handleFeedback = React.useCallback(
    (type: 'up' | 'down') => {
      onFeedback?.(type)
    },
    [onFeedback]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: 10, height: 0 }}
      transition={{
        duration: ANIMATION_DURATION.fast / 1000,
        ease: ANIMATION_EASING.out,
      }}
      className="flex items-center gap-2 overflow-hidden"
    >
      <CopyButton text={message.content} size="sm" onCopy={onCopy} />

      <FeedbackButton
        type="up"
        feedbackGiven={feedbackGiven}
        onClick={() => handleFeedback('up')}
        showConfetti={showConfetti}
      />

      <FeedbackButton
        type="down"
        feedbackGiven={feedbackGiven}
        onClick={() => handleFeedback('down')}
        showConfetti={false}
      />

      {message.status === 'error' && onRetry && (
        <motion.div
          whileHover={INTERACTION_VARIANTS.button.hover}
          whileTap={INTERACTION_VARIANTS.button.tap}
          transition={INTERACTION_VARIANTS.button.transition}
        >
          <Button variant="ghost" size="sm" onClick={onRetry} className="gap-1.5">
            <RefreshIcon size={16} />
            Retry
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
})

MessageActions.displayName = 'MessageActions'

export interface MessageProps {
  message: MessageType
  onCopy?: (content: string) => void
  onFeedback?: (type: 'up' | 'down') => void
  onRetry?: () => void
  onEdit?: (content: string) => void
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
}

export const Message = React.memo(
  React.forwardRef<HTMLDivElement, MessageProps>(function Message(
    {
      message,
      onFeedback,
      onRetry,
      showAvatar = true,
      showTimestamp = true,
      className,
    },
    ref
  ) {
    const [isHovered, setIsHovered] = React.useState(false)
    const [feedbackGiven, setFeedbackGiven] = React.useState<
      'up' | 'down' | null
    >(message.feedback?.type || null)

    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'
    const isStreaming = message.status === 'streaming'

    const [showConfetti, setShowConfetti] = React.useState(false)

    const handleFeedback = React.useCallback(
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
          'group flex gap-3 p-4 rounded-xl transition-all duration-200',
          isUser && 'flex-row-reverse',
          isHovered && 'bg-muted/50 shadow-sm',
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
                'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-sm'
            )}
          >
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={markdownPlugins.remark}
                rehypePlugins={markdownPlugins.rehype}
                components={{
                  code: CodeBlock,
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}

            {isStreaming && <StreamingCursor />}
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

          {/* Actions */}
          <AnimatePresence>
            {isAssistant && (isHovered || feedbackGiven) && (
              <MessageActions
                message={message}
                feedbackGiven={feedbackGiven}
                onCopy={onCopy}
                onFeedback={onFeedback}
                onRetry={onRetry}
                showConfetti={showConfetti}
              />
            )}
          </AnimatePresence>

          {/* Metadata */}
          {message.metadata && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {message.metadata.tokens && (
                <span>{message.metadata.tokens} tokens</span>
              )}
              {message.metadata.processingTime && (
                <span>? {message.metadata.processingTime}ms</span>
              )}
              {message.metadata.model && (
                <span>? {message.metadata.model}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  })
)

Message.displayName = 'Message'
