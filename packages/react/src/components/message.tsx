import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Avatar, Button, Badge, cn, formatRelativeTime } from '@clarity-chat/primitives'
import { CopyButton } from './copy-button'
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from './icons'
import { ANIMATION_DURATION, ANIMATION_EASING, INTERACTION_VARIANTS } from '../animations/constants'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

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

export const Message = React.forwardRef<HTMLDivElement, MessageProps>(
  (
    {
      message,
      onFeedback,
      onRetry,
      showAvatar = true,
      showTimestamp = true,
      className,
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false)
    const [feedbackGiven, setFeedbackGiven] = React.useState<'up' | 'down' | null>(
      message.feedback?.type || null
    )

    const isUser = message.role === 'user'
    const isAssistant = message.role === 'assistant'
    const isStreaming = message.status === 'streaming'

    const handleFeedback = (type: 'up' | 'down') => {
      setFeedbackGiven(type)
      onFeedback?.(type)
      
      // Hooked principle: Variable reward
      if (type === 'up') {
        // Could trigger confetti or positive animation
        console.log('🎉 Positive feedback received!')
      }
    }

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ 
          duration: ANIMATION_DURATION.normal / 1000, 
          ease: ANIMATION_EASING.out,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'group flex gap-3 p-4 rounded-lg transition-colors',
          isUser && 'flex-row-reverse',
          isHovered && 'bg-muted/50',
          className
        )}
      >
        {/* Avatar */}
        {showAvatar && (
          <Avatar
            src={isUser ? undefined : '/ai-avatar.png'}
            alt={isUser ? 'User' : 'AI Assistant'}
            fallback={isUser ? 'U' : 'AI'}
            className="flex-shrink-0"
          />
        )}

        {/* Message Content */}
        <div className={cn('flex-1 space-y-2', isUser && 'flex flex-col items-end')}>
          {/* Header */}
          <div className={cn('flex items-center gap-2', isUser && 'flex-row-reverse')}>
            <span className="font-semibold text-sm">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            {showTimestamp && (
              <span className="text-xs text-muted-foreground">
                {formatRelativeTime(message.createdAt)}
              </span>
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
                'bg-primary text-primary-foreground px-4 py-2 rounded-lg inline-block'
            )}
          >
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap">{message.content}</p>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code(props: any) {
                    const { node, inline, className, children, ...rest } = props
                    return inline ? (
                      <code className="bg-muted px-1 py-0.5 rounded text-sm" {...rest}>
                        {children}
                      </code>
                    ) : (
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
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
            
            {isStreaming && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-current ml-1"
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

          {/* Actions */}
          <AnimatePresence>
            {isAssistant && (isHovered || feedbackGiven) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ 
                  duration: ANIMATION_DURATION.fast / 1000,
                  ease: ANIMATION_EASING.out,
                }}
                className="flex items-center gap-2"
              >
                <CopyButton text={message.content} size="sm" />
                
                <motion.div
                  whileHover={INTERACTION_VARIANTS.iconButton.hover}
                  whileTap={INTERACTION_VARIANTS.iconButton.tap}
                  transition={INTERACTION_VARIANTS.iconButton.transition}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('up')}
                    className={cn(
                      'transition-colors',
                      feedbackGiven === 'up' && 'text-success bg-success/10'
                    )}
                    aria-label="Good response"
                  >
                    <ThumbsUpIcon size={16} />
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={INTERACTION_VARIANTS.iconButton.hover}
                  whileTap={INTERACTION_VARIANTS.iconButton.tap}
                  transition={INTERACTION_VARIANTS.iconButton.transition}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('down')}
                    className={cn(
                      'transition-colors',
                      feedbackGiven === 'down' && 'text-destructive bg-destructive/10'
                    )}
                    aria-label="Poor response"
                  >
                    <ThumbsDownIcon size={16} />
                  </Button>
                </motion.div>

                {message.status === 'error' && onRetry && (
                  <motion.div
                    whileHover={INTERACTION_VARIANTS.button.hover}
                    whileTap={INTERACTION_VARIANTS.button.tap}
                    transition={INTERACTION_VARIANTS.button.transition}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={onRetry}
                      className="gap-1.5"
                    >
                      <RefreshIcon size={16} />
                      Retry
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Metadata */}
          {message.metadata && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {message.metadata.tokens && (
                <span>{message.metadata.tokens} tokens</span>
              )}
              {message.metadata.processingTime && (
                <span>• {message.metadata.processingTime}ms</span>
              )}
              {message.metadata.model && (
                <span>• {message.metadata.model}</span>
              )}
            </div>
          )}
        </div>
      </motion.div>
    )
  }
)
Message.displayName = 'Message'
