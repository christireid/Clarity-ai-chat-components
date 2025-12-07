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
import type { Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import {
  MarkdownCodeBlock,
  MessageActions,
  MessageMetadata,
} from './message/index'
import { ErrorMessage, type ErrorDetails } from './error-message'
import { CopyButton } from './copy-button'

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
  /** Whether this message is the first in a group (default: true) */
  isGroupStart?: boolean
  /** Whether this message is the last in a group (default: true) */
  isGroupEnd?: boolean
  /** Whether this message is part of a group (default: false) */
  isGrouped?: boolean
  /** Error details for failed messages */
  errorDetails?: ErrorDetails | string
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
  isGroupStart = true,
  isGroupEnd = true,
  isGrouped = false,
  errorDetails,
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

  // Memoize markdown components to avoid recreation on every render
  // Using Partial<Components> to allow custom component types
  const markdownComponents = React.useMemo<Partial<Components>>(() => {
    // Create wrapper for memoized component to match react-markdown's expected type
    const CodeWrapper: Components['code'] = (props) => {
      return <MarkdownCodeBlock {...props} />
    }
    
    return {
      code: CodeWrapper,
    // Custom pre handler - wrap code blocks with styling and copy button
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement> & { node?: unknown }) => {
      // Extract code string from the code element for copy button
      let codeString = ''
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.props) {
          // Get from data attribute or extract text content
          const props = child.props as Record<string, unknown>
          codeString = (props['data-code-string'] as string) || ''
          if (!codeString && props.children) {
            // Fallback: extract text from children
            const extractText = (node: React.ReactNode): string => {
              if (typeof node === 'string') return node
              if (Array.isArray(node)) return node.map(extractText).join('')
              if (React.isValidElement(node)) {
                const nodeProps = node.props as { children?: React.ReactNode }
                if (nodeProps?.children) {
                  return extractText(nodeProps.children)
                }
              }
              return ''
            }
            codeString = extractText(props.children as React.ReactNode)
          }
        }
      })

      return (
        <div className="relative group/code my-4">
          <pre
            className="relative overflow-x-auto bg-muted/50 border border-border rounded-lg p-4"
            {...props}
          >
            {children}
          </pre>
          {codeString && (
            <CopyButton
              text={codeString}
              className="absolute top-2 right-2 opacity-0 group-hover/code:opacity-100 transition-opacity"
            />
          )}
        </div>
      )
    },
    // Always use div for paragraphs to prevent hydration mismatches
    // The <p> element cannot contain block elements, and detecting them
    // reliably across server/client is problematic. Using div is safe.
    p: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className="mb-4 leading-relaxed" {...props}>{children}</div>
    ),
    // Table styling
    table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="overflow-x-auto my-4 w-full">
        <table className="min-w-full table-auto border-collapse divide-y divide-border" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <thead className="bg-muted" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
      <tbody className="bg-background divide-y divide-border" {...props}>
        {children}
      </tbody>
    ),
    th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
        {...props}
      >
        {children}
      </th>
    ),
    td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
      <td className="px-6 py-4 text-sm border border-border" {...props}>
        {children}
      </td>
    ),
    tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
      <tr className="hover:bg-muted/50 transition-colors" {...props}>
        {children}
      </tr>
    ),
    }
  }, [])

  // Memoize plugin arrays to avoid recreation on every render
  const remarkPlugins = React.useMemo(() => [remarkGfm], [])
  const rehypePlugins = React.useMemo(() => [
    // Type incompatibility between vfile versions - using type assertion as last resort
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rehypeHighlight as any,
  ], [])

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
          'group flex gap-3 rounded-xl transition-all duration-200 ease-out',
          // Reduced padding for grouped messages
          isGrouped && !isGroupStart && !isGroupEnd ? 'px-4 py-1.5' : 'p-4',
          isUser && 'flex-row-reverse',
          isHovered && 'bg-muted/40',
          className
        )}
      >
        {/* Avatar - only show on group start */}
        {showAvatar && isGroupStart ? (
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
              alt={isUser ? 'User' : 'AI Assistant'}
              fallback={isUser ? 'U' : 'AI'}
              className="flex-shrink-0"
            />
          </motion.div>
        ) : showAvatar && isGrouped ? (
          // Spacer to maintain alignment in grouped messages
          <div className="w-10 flex-shrink-0" aria-hidden="true" />
        ) : null}

        {/* Message Content */}
        <div
          className={cn(
            'flex-1 space-y-2.5',
            isUser && 'flex flex-col items-end'
          )}
        >
          {/* Header - only show on group start */}
          {isGroupStart && (
            <div
              className={cn(
                'flex items-center',
                isUser ? 'gap-2 flex-row-reverse' : 'gap-2'
              )}
            >
              <span className="font-semibold text-sm whitespace-nowrap">
                {isUser ? 'You' : 'AI Assistant'}
              </span>
              {showTimestamp && (
                <>
                  <span className="text-muted-foreground/50">·</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.7 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs text-muted-foreground/90 whitespace-nowrap"
                  >
                    {formatRelativeTime(message.createdAt)}
                  </motion.span>
                </>
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
          )}

          {/* Content */}
          <div
            className={cn(
              // Base streaming stability classes for assistant messages
              !isUser && 'clarity-streaming-container',
              !isUser && 'prose prose-sm dark:prose-invert max-w-none',
              // Apply streaming-specific optimizations
              !isUser && isStreaming && 'clarity-streaming-markdown',
              isUser &&
                'bg-primary text-primary-foreground px-4 py-3 rounded-xl inline-block shadow-sm ring-1 ring-primary/30'
            )}
          >
            {isUser ? (
              <p className="m-0 whitespace-pre-wrap text-primary-foreground">{message.content}</p>
            ) : (
              <div className={cn(isStreaming && 'clarity-streaming-text')}>
                <ReactMarkdown
                  remarkPlugins={remarkPlugins}
                  rehypePlugins={rehypePlugins}
                  components={markdownComponents as any}
                >
                  {message.content}
                </ReactMarkdown>
                {/* Cursor inside the streaming wrapper for proper inline positioning */}
                {isStreaming && (
                  <span
                    role="status"
                    aria-live="polite"
                    aria-label="Streaming response"
                    className="clarity-streaming-cursor"
                  />
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {message.status === 'error' && errorDetails && (
            <div role="alert" aria-live="assertive">
              <ErrorMessage
                error={errorDetails}
                onRetry={onRetry}
                compact={isGrouped}
                maxRetryAttempts={3}
              />
            </div>
          )}

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
