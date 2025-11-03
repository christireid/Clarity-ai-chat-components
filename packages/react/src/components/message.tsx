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

    const [showConfetti, setShowConfetti] = React.useState(false)

    const handleFeedback = (type: 'up' | 'down') => {
      setFeedbackGiven(type)
      onFeedback?.(type)
      
      // Hooked principle: Variable reward
      if (type === 'up') {
        // Trigger confetti animation
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 1000)
      }
    }

    return (
      <motion.div
        ref={ref}
        initial={{ 
          opacity: 0, 
          x: isUser ? 20 : -20,  // Slide from appropriate side
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
          'group relative flex gap-4 rounded-2xl border border-transparent bg-[hsl(var(--surface-muted))] p-5 transition-all duration-200 hover:border-border/60 hover:shadow-[0_16px_36px_rgba(15,23,42,0.12)]',
          isUser && 'flex-row-reverse bg-gradient-to-l from-primary/12 via-primary/8 to-transparent border-primary/35 shadow-[0_14px_36px_rgba(22,119,255,0.18)] hover:shadow-[0_20px_44px_rgba(22,119,255,0.25)]',
          isAssistant && 'hover:border-primary/20',
          isHovered && !isUser && 'border-primary/25 shadow-[0_18px_42px_rgba(15,23,42,0.16)]',
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
        <div className={cn('flex-1 space-y-3', isUser && 'flex flex-col items-end text-right')}>
          {/* Header */}
          <div className={cn('flex items-center gap-2 text-sm text-muted-foreground', isUser && 'flex-row-reverse justify-end text-right')}>
            <span className="font-semibold text-foreground">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            {showTimestamp && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.6 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground/80"
              >
                {formatRelativeTime(message.createdAt)}
              </motion.span>
            )}
            {message.status === 'sending' && (
              <Badge variant="info" dot>
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
              'prose prose-sm dark:prose-invert max-w-none text-left',
              isAssistant && 'w-full'
            )}
          >
            {isUser ? (
              <div className="inline-block max-w-full rounded-2xl bg-gradient-to-r from-primary to-[hsl(var(--primary))] px-5 py-3 text-left text-sm font-medium leading-relaxed text-primary-foreground shadow-[0_16px_32px_rgba(22,119,255,0.25)]">
                <p className="m-0 whitespace-pre-wrap">{message.content}</p>
              </div>
            ) : (
              <div className="w-full rounded-2xl border border-border/60 bg-[hsl(var(--surface-elevated))] px-5 py-4 shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    code(props: any) {
                      const { node, inline, className, children, ...rest } = props
                      return inline ? (
                        <code className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.85em] text-primary" {...rest}>
                          {children}
                        </code>
                      ) : (
                        <div className="relative group/code">
                          <pre className={cn('relative overflow-auto rounded-xl border border-border/60 bg-[hsl(var(--surface-muted))] p-4 shadow-inner', className)}>
                            <code {...rest}>{children}</code>
                          </pre>
                          <CopyButton
                            text={String(children).replace(/\n$/, '')}
                            className="absolute top-3 right-3 opacity-0 transition-opacity group-hover/code:opacity-100"
                          />
                        </div>
                      )
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
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
                  ease: "easeInOut",
                }}
                className="inline-block w-2 h-4 bg-current ml-1 rounded-sm"
              />
            )}
          </div>

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {message.attachments.map((attachment) => (
                <Badge key={attachment.id} variant="subtle">
                  {attachment.name}
                </Badge>
              ))}
            </div>
          )}

          {/* Actions */}
          <AnimatePresence>
            {isAssistant && (isHovered || feedbackGiven) && (
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
                <CopyButton text={message.content} size="sm" />
                
                {/* Thumbs Up with Confetti */}
                <div className="relative">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: feedbackGiven === 'up' ? 0 : -15 }}
                    whileTap={{ scale: 0.9 }}
                    animate={feedbackGiven === 'up' ? { 
                      scale: [1, 1.2, 1],
                      rotate: [0, -15, 15, -15, 0],
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFeedback('up')}
                      className={cn(
                        'rounded-full transition-colors',
                        feedbackGiven === 'up' && 'bg-success/15 text-success shadow-[0_10px_24px_rgba(34,197,94,0.22)]'
                      )}
                      aria-label="Good response"
                    >
                      <ThumbsUpIcon size={16} />
                    </Button>
                  </motion.div>
                  
                  {/* Confetti Effect */}
                  <AnimatePresence>
                    {showConfetti && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
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
                            className="absolute top-1/2 left-1/2 w-2 h-2 bg-success rounded-full pointer-events-none"
                            style={{
                              backgroundColor: ['#10b981', '#f59e0b', '#3b82f6', '#ef4444'][i % 4],
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Thumbs Down */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: feedbackGiven === 'down' ? 0 : 15 }}
                  whileTap={{ scale: 0.9 }}
                  animate={feedbackGiven === 'down' ? { 
                    scale: [1, 1.1, 1],
                    rotate: [0, 15, -15, 15, 0],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('down')}
                    className={cn(
                      'rounded-full transition-colors',
                      feedbackGiven === 'down' && 'bg-destructive/15 text-destructive shadow-[0_10px_24px_rgba(255,77,79,0.22)]'
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
                      variant="surface" 
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
  }
)
Message.displayName = 'Message'
