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
  EASING_FRAMER,
  duration,
} from '../animations/constants'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import {
  MarkdownCodeBlock,
  MessageActions,
  MessageMetadata,
  EditableMessageContent,
} from './message/index'
import { ErrorMessage, type ErrorDetails } from './error-message'
import { CopyButton } from './copy-button'

export interface MessageProps {
  message: MessageType
  onCopy?: (content: string) => void
  onFeedback?: (type: 'up' | 'down', comment?: string) => void
  onRetry?: () => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
  /** Callback to stop AI generation (shown during streaming) */
  onStopGeneration?: () => void
  /** Whether this message is currently being edited */
  isEditing?: boolean
  /** Callback when edit is saved - receives message ID and new content */
  onSaveEdit?: (messageId: string, newContent: string) => void
  /** Callback when edit is cancelled */
  onCancelEdit?: (messageId: string) => void
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
  onStopGeneration,
  isEditing = false,
  onSaveEdit,
  onCancelEdit,
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
  const [isFocusWithin, setIsFocusWithin] = React.useState(false)
  const [feedbackGiven, setFeedbackGiven] = React.useState<
    'up' | 'down' | null
  >(message.feedback?.type || null)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isStreaming = message.status === 'streaming'

  const [showConfetti, setShowConfetti] = React.useState(false)

  // React 19: Compiler optimizes this - no useCallback needed
  const handleFeedback = (type: 'up' | 'down', comment?: string) => {
    setFeedbackGiven(type)
    onFeedback?.(type, comment)

    // Hooked principle: Variable reward
    if (type === 'up') {
      // Trigger confetti animation
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 1000)
    }
  }

  // Handle saving edits
  const handleSaveEdit = React.useCallback(
    (newContent: string) => {
      onSaveEdit?.(message.id, newContent)
    },
    [message.id, onSaveEdit]
  )

  // Handle canceling edits
  const handleCancelEdit = React.useCallback(() => {
    onCancelEdit?.(message.id)
  }, [message.id, onCancelEdit])

  // Memoize markdown components to avoid recreation on every render.
  // react-markdown's `components` prop accepts Partial<Components>, allowing us to
  // override only specific elements while using defaults for the rest.
  const markdownComponents = React.useMemo<Partial<Components>>(() => {
    // Create wrapper for memoized component to match react-markdown's expected type
    const CodeWrapper: Components['code'] = (props) => {
      return <MarkdownCodeBlock {...props} />
    }

    return {
      code: CodeWrapper,
      // Custom pre handler - wrap code blocks with styling and copy button
      pre: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLPreElement> & { node?: unknown }) => {
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
              className={cn(
                'relative overflow-x-auto p-4',
                'bg-gradient-to-br from-muted/60 to-muted/40',
                'border border-border/50',
                'rounded-xl',
                'shadow-sm',
                'transition-shadow duration-200',
                'group-hover/code:shadow-md'
              )}
              {...props}
            >
              {children}
            </pre>
            {codeString && (
              <CopyButton
                text={codeString}
                className="absolute top-2.5 right-2.5 opacity-0 group-hover/code:opacity-100 transition-all duration-200 translate-y-1 group-hover/code:translate-y-0"
              />
            )}
          </div>
        )
      },
      // Always use div for paragraphs to prevent hydration mismatches
      // The <p> element cannot contain block elements, and detecting them
      // reliably across server/client is problematic. Using div is safe.
      p: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div className="mb-4 leading-relaxed" {...props}>
          {children}
        </div>
      ),
      // Table styling
      table: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="overflow-x-auto my-4 w-full">
          <table
            className="min-w-full table-auto border-collapse divide-y divide-border"
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <thead className="bg-muted" {...props}>
          {children}
        </thead>
      ),
      tbody: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableSectionElement>) => (
        <tbody className="bg-background divide-y divide-border" {...props}>
          {children}
        </tbody>
      ),
      th: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <th
          className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider border border-border"
          {...props}
        >
          {children}
        </th>
      ),
      td: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableCellElement>) => (
        <td className="px-6 py-4 text-sm border border-border" {...props}>
          {children}
        </td>
      ),
      tr: ({
        children,
        ...props
      }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr className="hover:bg-muted/50 transition-colors" {...props}>
          {children}
        </tr>
      ),
    }
  }, [])

  // Memoize plugin arrays to avoid recreation on every render
  const remarkPlugins = React.useMemo(() => [remarkGfm], [])
  // rehypeHighlight has type incompatibilities due to vfile version mismatches across
  // the unified ecosystem. This is a known upstream issue. We use a readonly tuple
  // assertion to preserve the plugin reference while satisfying the type checker.
  // See: https://github.com/rehypejs/rehype-highlight/issues/26
  const rehypePlugins = React.useMemo(
    () => [rehypeHighlight] as unknown as any[],
    []
  )

  // Build descriptive ARIA label for screen readers
  const messageAuthor = isUser ? 'You' : 'AI Assistant'
  const messageTime = message.createdAt
    ? formatRelativeTime(message.createdAt)
    : ''
  const messageStatus =
    message.status === 'streaming'
      ? ', currently streaming'
      : message.status === 'error'
        ? ', has error'
        : ''
  const ariaLabel = `${messageAuthor}${messageTime ? `, ${messageTime}` : ''}${messageStatus}`

  // Generate stable content ID for aria-describedby (fallback if message.id is missing)
  const contentId = message.id ? `message-content-${message.id}` : undefined

  return (
    <motion.div
      ref={ref}
      role="article"
      aria-label={ariaLabel}
      aria-describedby={contentId}
      initial={{
        opacity: 0,
        x: isUser ? 20 : -20, // Slide from appropriate side
        y: 10,
      }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: ANIMATION_DURATION.normal / 1000,
        ease: EASING_FRAMER.out,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocusWithin(true)}
      onBlur={(e) => {
        // Only set false if focus moved outside this component
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocusWithin(false)
        }
      }}
      tabIndex={0}
      className={cn(
        'group flex gap-3.5 rounded-2xl transition-all duration-200 ease-out',
        // Reduced padding for grouped messages
        isGrouped && !isGroupStart && !isGroupEnd ? 'px-4 py-1.5' : 'p-4',
        isUser && 'flex-row-reverse',
        isHovered && 'bg-muted/30 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]',
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
                  transition={{ duration: duration('normal') }}
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
          id={contentId}
          className={cn(
            // Base streaming stability classes for assistant messages
            !isUser && 'clarity-streaming-container',
            !isUser && 'prose prose-sm dark:prose-invert max-w-none',
            // Apply streaming-specific optimizations
            !isUser && isStreaming && 'clarity-streaming-markdown',
            isUser &&
              !isEditing && [
                'px-4 py-3 rounded-2xl inline-block',
                'bg-gradient-to-br from-primary via-primary to-primary/90',
                'text-primary-foreground',
                'shadow-[0_4px_16px_-4px_hsl(var(--primary)/0.35)]',
                'ring-1 ring-primary/20',
              ]
          )}
        >
          {isUser ? (
            isEditing ? (
              <EditableMessageContent
                content={message.content}
                isEditing={isEditing}
                onSave={handleSaveEdit}
                onCancel={handleCancelEdit}
              />
            ) : (
              <p className="m-0 whitespace-pre-wrap text-primary-foreground">
                {message.content}
              </p>
            )
          ) : (
            <div className={cn(isStreaming && 'clarity-streaming-text')}>
              <ReactMarkdown
                remarkPlugins={remarkPlugins}
                rehypePlugins={rehypePlugins}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
              {/* Cursor inside the streaming wrapper for proper inline positioning */}
              {/* Note: Cursor is purely visual - parent MessageList handles aria-live announcements */}
              {isStreaming && (
                <span aria-hidden="true" className="clarity-streaming-cursor" />
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

        {/* Actions - Show for both user and assistant messages (hide when editing) */}
        {(isUser || isAssistant) && !isEditing && (
          <MessageActions
            messageContent={message.content}
            messageId={message.id}
            role={message.role}
            feedbackGiven={feedbackGiven}
            showConfetti={showConfetti}
            hasError={message.status === 'error'}
            isStreaming={isStreaming}
            onFeedback={handleFeedback}
            onRetry={onRetry}
            onEdit={onEdit}
            onRegenerate={onRegenerate}
            onDelete={onDelete}
            onStopGeneration={onStopGeneration}
            show={isHovered || isFocusWithin || !!feedbackGiven || isStreaming}
          />
        )}

        {/* Metadata */}
        <MessageMetadata metadata={message.metadata} />
      </div>
    </motion.div>
  )
}

Message.displayName = 'Message'
