'use client'

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
  /** React 19: ref as prop */
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Message - Individual message component for chat interfaces
 * 
 * A low-level building block for rendering individual chat messages. Provides
 * message display, markdown rendering, actions (copy, feedback, retry, edit, delete),
 * and animations.
 * 
 * **Features:**
 * - Markdown rendering with syntax highlighting
 * - Message actions (copy, feedback, retry, edit, regenerate, delete)
 * - Avatar display
 * - Timestamp display
 * - Streaming indicator
 * - Feedback animations (confetti on positive feedback)
 * - Hover states
 * 
 * **When to use:**
 * - Building custom message lists
 * - Need fine-grained control over message rendering
 * - Want to customize message appearance
 * 
 * **When NOT to use:**
 * - For simplest setup, use `ClarityChat` component (includes messages)
 * - For standard message lists, use `MessageList` component
 * 
 * @param props - Message configuration
 * @param props.message - Message data to display
 * @param props.onCopy - Optional callback when message is copied
 * @param props.onFeedback - Optional callback for feedback (up/down)
 * @param props.onRetry - Optional callback to retry a message
 * @param props.onEdit - Optional callback to edit a message
 * @param props.onRegenerate - Optional callback to regenerate a message
 * @param props.onDelete - Optional callback to delete a message
 * @param props.showAvatar - Show avatar (default: true)
 * @param props.showTimestamp - Show timestamp (default: true)
 * @param props.className - Optional CSS class name
 * @param props.ref - Optional ref for the message container
 * 
 * @example Basic usage
 * ```tsx
 * <Message
 *   message={message}
 *   onCopy={(content) => navigator.clipboard.writeText(content)}
 *   onFeedback={(type) => trackFeedback(message.id, type)}
 * />
 * ```
 * 
 * @example With all actions
 * ```tsx
 * <Message
 *   message={message}
 *   onCopy={handleCopy}
 *   onFeedback={handleFeedback}
 *   onRetry={handleRetry}
 *   onEdit={handleEdit}
 *   onRegenerate={handleRegenerate}
 *   onDelete={handleDelete}
 * />
 * ```
 * 
 * @example Without avatar or timestamp
 * ```tsx
 * <Message
 *   message={message}
 *   showAvatar={false}
 *   showTimestamp={false}
 * />
 * ```
 */
export function Message({
  message,
  onFeedback,
  onRetry,
  onEdit,
  onRegenerate,
  onDelete,
  showAvatar = true,
  showTimestamp = true,
  className,
  ref,
}: MessageProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [feedbackGiven, setFeedbackGiven] = React.useState<
    'up' | 'down' | null
  >(message.feedback?.type || null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isStreaming = message.status === 'streaming'

  const [showConfetti, setShowConfetti] = React.useState(false)

  // React 19: Compiler optimizes this - no useCallback needed
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

  // React 19: Compiler optimizes static objects - no useMemo needed
  const markdownComponents = {
    code: MarkdownCodeBlock,
    // Table styling
    table: ({ children, ...props }: any) => (
      <div className="overflow-x-auto my-4 w-full">
        <table className="min-w-full table-auto border-collapse divide-y divide-border" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: any) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: any) => (
      <tbody className="bg-background divide-y divide-border" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: any) => (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: any) => (
      <td className="px-6 py-4 text-sm border border-border" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }: any) => (
      <tr className="hover:bg-muted/50 transition-colors" {...props}>
        {children}
      </tr>
    ),
  }

  // Static plugin arrays - compiler optimizes
  const remarkPlugins = [remarkGfm]
  const rehypePlugins = [
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypeHighlight as any, // Type incompatibility between vfile versions
  ]

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
          'group flex gap-3 p-4 rounded-xl transition-all duration-200 ease-out',
          isUser && 'flex-row-reverse',
          isHovered && 'bg-muted/30',
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
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground/80"
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
              !isUser && 'prose prose-sm dark:prose-invert max-w-none',
              isUser &&
                'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-[0_1px_3px_rgba(15,23,42,0.1)] ring-1 ring-primary/20'
            )}
          >
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap text-primary-foreground">{message.content}</p>
            ) : (
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
}

Message.displayName = 'Message'
