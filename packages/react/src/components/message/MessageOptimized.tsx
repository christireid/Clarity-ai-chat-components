/**
 * Optimized Message Component
 *
 * Performance-optimized version of the Message component with:
 * - React.memo to prevent unnecessary re-renders
 * - useMemo for expensive markdown parsing
 * - useCallback for event handlers
 * - Lazy loading for syntax highlighting
 */

'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Avatar, Button, Badge, cn } from '@clarity-chat/primitives'
import { formatRelativeTime } from '../../internal/helpers'
import { CopyButton } from './CopyButton'
import { ThumbsUpIcon, ThumbsDownIcon, RefreshIcon } from '../ui/icons'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  INTERACTION_VARIANTS,
  DURATION_SECONDS as durations,
  ANIMATION_PRESETS,
} from '../../animations/constants'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import ReactMarkdown from 'react-markdown'
import type { Components, ExtraProps } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

// Type for markdown component props that have children
interface MarkdownElementProps
  extends React.HTMLAttributes<HTMLElement>, ExtraProps {
  children?: React.ReactNode
}

// Type for code block component props
interface CodeBlockProps extends React.HTMLAttributes<HTMLElement>, ExtraProps {
  children?: React.ReactNode
  inline?: boolean
}

export interface MessageOptimizedProps {
  message: MessageType
  onCopy?: (content: string) => void
  onFeedback?: (type: 'up' | 'down') => void
  onRetry?: () => void
  onEdit?: (content: string) => void
  showAvatar?: boolean
  showTimestamp?: boolean
  className?: string
  // React 19: ref as prop (replaces forwardRef)
  ref?: React.Ref<HTMLDivElement>
}

/**
 * Memoized markdown components to avoid recreation
 */
const markdownComponents: Components = {
  code(props: CodeBlockProps) {
    const { node: _node, inline, className, children, ...rest } = props
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
  // Table styling
  table(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <div className="overflow-x-auto my-4 w-full">
        <table
          className="min-w-full table-auto border-collapse divide-y divide-border"
          {...rest}
        >
          {children}
        </table>
      </div>
    )
  },
  thead(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <thead className="bg-muted" {...rest}>
        {children}
      </thead>
    )
  },
  tbody(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <tbody className="bg-background divide-y divide-border" {...rest}>
        {children}
      </tbody>
    )
  },
  th(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
        {...rest}
      >
        {children}
      </th>
    )
  },
  td(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <td className="px-6 py-4 text-sm border border-border" {...rest}>
        {children}
      </td>
    )
  },
  tr(props: MarkdownElementProps) {
    const { node: _node, children, ...rest } = props
    return (
      <tr className="hover:bg-muted/50 transition-colors" {...rest}>
        {children}
      </tr>
    )
  },
}

/**
 * Optimized Message component with React.memo
 *
 * React 19: Now uses ref as a prop instead of forwardRef wrapper.
 * This simplifies the component API and improves type inference.
 */
function MessageOptimizedInner({
  message,
  onFeedback,
  onRetry,
  showAvatar = true,
  showTimestamp = true,
  className,
  ref,
}: MessageOptimizedProps) {
  const prefersReducedMotion = useReducedMotion()
  const [isHovered, setIsHovered] = React.useState(false)
  const [feedbackGiven, setFeedbackGiven] = React.useState<
    'up' | 'down' | null
  >(message.feedback?.type || null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isStreaming = message.status === 'streaming'

  // Memoize expensive markdown parsing
  const markdownContent = React.useMemo(() => {
    if (isUser) return null

    return (
      <>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight as unknown as typeof remarkGfm]}
          components={markdownComponents}
        >
          {message.content}
        </ReactMarkdown>
      </>
    )
  }, [message.content, isUser])

  // Memoize event handlers with useCallback
  const handleFeedback = React.useCallback(
    (type: 'up' | 'down') => {
      setFeedbackGiven(type)
      onFeedback?.(type)

      if (type === 'up') {
        if (process.env.NODE_ENV === 'development') {
          console.log('🎉 Positive feedback received!')
        }
      }
    },
    [onFeedback]
  )

  const handleMouseEnter = React.useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false)
  }, [])

  const handleRetry = React.useCallback(() => {
    onRetry?.()
  }, [onRetry])

  return (
    <motion.div
      ref={ref}
      {...ANIMATION_PRESETS.slideUp}
      exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
      transition={{
        duration: prefersReducedMotion ? 0 : ANIMATION_DURATION.normal / 1000,
        ease: EASING_FRAMER.out,
      }}
      viewport={{ once: true }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          alt={isUser ? 'User' : 'AI Assistant'}
          fallback={isUser ? 'U' : 'AI'}
          className="flex-shrink-0"
        />
      )}

      {/* Message Content */}
      <div
        className={cn('flex-1 space-y-2', isUser && 'flex flex-col items-end')}
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
            !isUser && 'prose prose-sm dark:prose-invert max-w-3xl mx-auto',
            isUser &&
              'bg-primary text-primary-foreground px-4 py-2 rounded-lg inline-block'
          )}
        >
          {isUser ? (
            <p className="m-0 whitespace-pre-wrap text-primary-foreground">
              {message.content}
            </p>
          ) : (
            markdownContent
          )}

          {isStreaming && (
            <motion.span
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { repeat: Infinity, duration: durations.slower }
              }
              viewport={{ once: true }}
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
        {isAssistant && (isHovered || feedbackGiven) && (
          <motion.div
            {...ANIMATION_PRESETS.slideDown}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{
              duration: prefersReducedMotion
                ? 0
                : ANIMATION_DURATION.fast / 1000,
              ease: EASING_FRAMER.out,
            }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <CopyButton text={message.content} size="sm" />

            <motion.div
              whileHover={
                prefersReducedMotion
                  ? {}
                  : INTERACTION_VARIANTS.iconButton.hover
              }
              whileTap={
                prefersReducedMotion ? {} : INTERACTION_VARIANTS.iconButton.tap
              }
              transition={INTERACTION_VARIANTS.iconButton.transition}
              viewport={{ once: true }}
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
                <ThumbsUpIcon size={6} />
              </Button>
            </motion.div>

            <motion.div
              whileHover={
                prefersReducedMotion
                  ? {}
                  : INTERACTION_VARIANTS.iconButton.hover
              }
              whileTap={
                prefersReducedMotion ? {} : INTERACTION_VARIANTS.iconButton.tap
              }
              transition={INTERACTION_VARIANTS.iconButton.transition}
              viewport={{ once: true }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback('down')}
                className={cn(
                  'transition-colors',
                  feedbackGiven === 'down' &&
                    'text-destructive bg-destructive/10'
                )}
                aria-label="Poor response"
              >
                <ThumbsDownIcon size={6} />
              </Button>
            </motion.div>

            {message.status === 'error' && onRetry && (
              <motion.div
                whileHover={
                  prefersReducedMotion ? {} : INTERACTION_VARIANTS.button.hover
                }
                whileTap={
                  prefersReducedMotion ? {} : INTERACTION_VARIANTS.button.tap
                }
                transition={INTERACTION_VARIANTS.button.transition}
                viewport={{ once: true }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="gap-1.5"
                >
                  <RefreshIcon size={6} />
                  Retry
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Metadata */}
        {message.metadata && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {message.metadata.tokens && (
              <span>{message.metadata.tokens} tokens</span>
            )}
            {message.metadata.processingTime && (
              <span>• {message.metadata.processingTime}ms</span>
            )}
            {message.metadata.model && <span>• {message.metadata.model}</span>}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Custom comparison function for React.memo
const messageOptimizedAreEqual = (
  prevProps: MessageOptimizedProps,
  nextProps: MessageOptimizedProps
) => {
  // Compare all props that affect rendering
  // Note: ref comparison ensures new refs get attached (React 19 ref-as-prop pattern)
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.feedback?.type === nextProps.message.feedback?.type &&
    prevProps.showAvatar === nextProps.showAvatar &&
    prevProps.showTimestamp === nextProps.showTimestamp &&
    prevProps.className === nextProps.className &&
    // Ref comparison: re-render if ref identity changes to attach new ref
    // Note: stable refs (useRef objects) maintain identity, so this rarely triggers
    prevProps.ref === nextProps.ref
  )
}

/**
 * Memoized and exported MessageOptimized component
 * React 19: Uses ref as prop with React.memo
 */
export const MessageOptimized = React.memo(
  MessageOptimizedInner,
  messageOptimizedAreEqual
)

MessageOptimized.displayName = 'MessageOptimized'
