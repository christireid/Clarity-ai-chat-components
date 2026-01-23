'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import type { Message as MessageType } from '@clarity-chat/types'
import { Avatar, Badge, cn, useA11y } from '@clarity-chat/primitives'
import {
  ANIMATION_DURATION,
  EASING_FRAMER,
  duration,
} from '../../animations/constants'
import { LazyMarkdownRenderer } from './markdown-renderer'
import { MessageActions } from './message-actions'
import { MessageMetadata } from './message-metadata'
import { EditableMessageContent } from './editable-message-content'
import { ErrorMessage, type ErrorDetails } from '../feedback/error-message'
import { MessageHeader } from './message-header'
import { formatRelativeTime } from '../../internal/helpers'

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
  const [wasEditing, setWasEditing] = React.useState(false)

  const isUser = message.role === 'user'
  const isAssistant = message.role === 'assistant'
  const isStreaming = message.status === 'streaming'

  const [showConfetti, setShowConfetti] = React.useState(false)

  // Accessibility announcements
  const { announce } = useA11y()

  // Ref for returning focus after edit
  const editButtonRef = React.useRef<HTMLButtonElement>(null)

  // Announce edit mode changes for screen readers
  React.useEffect(() => {
    if (isEditing && !wasEditing) {
      announce(
        'Editing message. Press Escape to cancel or use the save button.',
        {
          assertive: true,
        }
      )
    } else if (!isEditing && wasEditing) {
      announce('Edit mode closed', { assertive: false })
      // Return focus to the edit button after save/cancel
      setTimeout(() => {
        editButtonRef.current?.focus()
      }, 100)
    }
    setWasEditing(isEditing)
  }, [isEditing, wasEditing, announce])

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
          <MessageHeader
            role={message.role}
            timestamp={message.createdAt}
            status={message.status}
            showTimestamp={showTimestamp}
            isHovered={isHovered}
          />
        )}

        {/* Content */}
        <div
          id={contentId}
          className={cn(
            // Base streaming stability classes for assistant messages
            !isUser && 'clarity-streaming-container',
            !isUser && 'prose prose-sm dark:prose-invert max-w-3xl mx-auto',
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
            <LazyMarkdownRenderer
              content={message.content}
              isStreaming={isStreaming}
            />
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
            editButtonRef={editButtonRef}
          />
        )}

        {/* Metadata */}
        <MessageMetadata message={message} />
      </div>
    </motion.div>
  )
}

Message.displayName = 'Message'
