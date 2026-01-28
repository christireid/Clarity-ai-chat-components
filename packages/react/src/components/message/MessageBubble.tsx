'use client'

/**
 * MessageBubble Component
 *
 * Modern, accessible message bubble component following design leader patterns
 * from prompt-kit, Ant Design X, and shadcn/ui.
 *
 * Features:
 * - Role-based styling (user, assistant, system)
 * - Streaming support with cursor animation
 * - Avatar support with fallback
 * - Timestamp display
 * - Accessible with ARIA attributes
 * - Respects reduced motion preferences
 * - Integrates with globals.css classes
 *
 * @example
 * ```tsx
 * // User message
 * <MessageBubble role="user">
 *   Hello, how can I help?
 * </MessageBubble>
 *
 * // Assistant message with streaming
 * <MessageBubble role="assistant" isStreaming>
 *   {streamingContent}
 * </MessageBubble>
 *
 * // With avatar and timestamp
 * <MessageBubble
 *   role="assistant"
 *   avatar={{ src: '/ai-avatar.png', alt: 'AI' }}
 *   timestamp={new Date()}
 * >
 *   Here's what I found...
 * </MessageBubble>
 *
 * // System message
 * <MessageBubble role="system">
 *   Session started
 * </MessageBubble>
 * ```
 *
 * @packageDocumentation
 */

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER, ANIMATION_PRESETS } from '../../animations/constants'

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

/**
 * Message role/type
 */
export type MessageRole = 'user' | 'assistant' | 'system'

/**
 * Avatar configuration
 */
export interface MessageAvatar {
  /** Image source URL */
  src?: string
  /** Alt text for accessibility */
  alt?: string
  /** Fallback text (first letter shown if no image) */
  fallback?: string
  /** Custom avatar component */
  component?: React.ReactNode
}

/**
 * Props for MessageBubble component
 */
export interface MessageBubbleProps {
  /** Message role determines styling */
  role: MessageRole
  /** Message content */
  children: React.ReactNode
  /** Avatar configuration */
  avatar?: MessageAvatar
  /** Show avatar (default: true for assistant, false for user) */
  showAvatar?: boolean
  /** Message timestamp */
  timestamp?: Date | string
  /** Whether message is being streamed */
  isStreaming?: boolean
  /** Show streaming cursor */
  showCursor?: boolean
  /** Custom cursor character */
  cursorChar?: string
  /** Message ID for accessibility */
  id?: string
  /** Additional CSS class for container */
  className?: string
  /** Additional CSS class for bubble */
  bubbleClassName?: string
  /** Disable entrance animation */
  disableAnimation?: boolean
  /** Render content without wrapper (for custom rendering) */
  renderContent?: (content: React.ReactNode) => React.ReactNode
  /** Actions to show on hover */
  actions?: React.ReactNode
  /** Error state */
  error?: boolean
  /** Loading state (shows skeleton) */
  loading?: boolean
}

// =============================================================================
// CONFIGURATION
// =============================================================================

/**
 * Role-based CSS classes from globals.css
 */
const ROLE_CONFIG: Record<MessageRole, {
  container: string
  bubble: string
  avatar: string
}> = {
  user: {
    container: 'message message-user',
    bubble: 'message-bubble message-bubble-user',
    avatar: 'message-avatar bg-primary text-primary-foreground',
  },
  assistant: {
    container: 'message',
    bubble: 'message-bubble message-bubble-assistant',
    avatar: 'message-avatar',
  },
  system: {
    container: 'message justify-center',
    bubble: 'message-bubble message-bubble-system',
    avatar: '',
  },
}

/**
 * Default avatars by role
 */
const DEFAULT_AVATARS: Record<MessageRole, MessageAvatar> = {
  user: { fallback: 'U', alt: 'User' },
  assistant: { fallback: 'AI', alt: 'AI Assistant' },
  system: { fallback: 'S', alt: 'System' },
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Avatar component
 */
interface AvatarProps {
  avatar: MessageAvatar
  className?: string
}

const Avatar = React.memo(function Avatar({ avatar, className }: AvatarProps) {
  const [imageError, setImageError] = React.useState(false)

  if (avatar.component) {
    return <>{avatar.component}</>
  }

  const showFallback = !avatar.src || imageError
  const fallbackText = avatar.fallback || avatar.alt?.charAt(0) || '?'

  return (
    <div className={className} aria-hidden="true">
      {showFallback ? (
        <span className="text-xs font-medium">
          {fallbackText}
        </span>
      ) : (
        <img
          src={avatar.src}
          alt={avatar.alt || ''}
          className="w-full h-full object-cover rounded-full"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  )
})

Avatar.displayName = 'Avatar'

/**
 * Streaming cursor
 */
interface CursorProps {
  char?: string
}

const StreamingCursor = React.memo(function StreamingCursor({ char = '▋' }: CursorProps) {
  return (
    <span className="message-cursor" aria-hidden="true">
      {char}
    </span>
  )
})

StreamingCursor.displayName = 'StreamingCursor'

/**
 * Timestamp display
 */
interface TimestampProps {
  timestamp: Date | string
  className?: string
}

const Timestamp = React.memo(function Timestamp({ timestamp, className }: TimestampProps) {
  const formatted = React.useMemo(() => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [timestamp])

  return (
    <time
      dateTime={typeof timestamp === 'string' ? timestamp : timestamp.toISOString()}
      className={cn('text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity', className)}
    >
      {formatted}
    </time>
  )
})

Timestamp.displayName = 'Timestamp'

/**
 * Loading skeleton
 */
const MessageSkeleton = React.memo(function MessageSkeleton({ role }: { role: MessageRole }) {
  const config = ROLE_CONFIG[role]

  return (
    <div className={cn(config.container, 'animate-pulse')}>
      {role !== 'system' && role !== 'user' && (
        <div className="message-avatar skeleton" />
      )}
      <div className={cn(config.bubble, 'min-w-[120px]')}>
        <div className="skeleton h-4 w-full mb-2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
    </div>
  )
})

MessageSkeleton.displayName = 'MessageSkeleton'

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * MessageBubble - Modern message bubble component
 *
 * Renders messages with role-based styling, avatars, timestamps,
 * and streaming support. Uses CSS classes from globals.css for
 * consistent styling across the application.
 *
 * Accessibility:
 * - Uses semantic HTML with article and proper ARIA attributes
 * - Announces streaming status to screen readers
 * - Supports keyboard navigation
 * - Respects prefers-reduced-motion
 */
export function MessageBubble({
  role,
  children,
  avatar,
  showAvatar,
  timestamp,
  isStreaming = false,
  showCursor = true,
  cursorChar,
  id,
  className,
  bubbleClassName,
  disableAnimation = false,
  renderContent,
  actions,
  error = false,
  loading = false,
}: MessageBubbleProps) {
  const prefersReducedMotion = useReducedMotion() || disableAnimation

  // Determine if avatar should be shown
  const shouldShowAvatar = showAvatar ?? (role === 'assistant')

  // Get role configuration
  const config = ROLE_CONFIG[role]

  // Get avatar config with defaults
  const avatarConfig = avatar || DEFAULT_AVATARS[role]

  // Loading state
  if (loading) {
    return <MessageSkeleton role={role} />
  }

  // Render content with optional wrapper
  const renderedContent = renderContent ? renderContent(children) : children

  return (
    <motion.article
      id={id}
      role="article"
      aria-label={`${role} message`}
      {...(prefersReducedMotion ? ANIMATION_PRESETS.fadeIn : ANIMATION_PRESETS.slideUp)}
      transition={{
        duration: prefersReducedMotion ? 0.1 : DURATION_SECONDS.fast,
        ease: EASING_FRAMER.out,
      }}
      className={cn(
        config.container,
        'group',
        error && 'border-l-2 border-destructive',
        className
      )}
    >
      {/* Avatar */}
      {shouldShowAvatar && role !== 'system' && (
        <Avatar avatar={avatarConfig} className={config.avatar} />
      )}

      {/* Content wrapper */}
      <div className="flex flex-col gap-1 min-w-0">
        {/* Bubble */}
        <div
          className={cn(
            config.bubble,
            isStreaming && 'streaming-stable',
            error && 'bg-destructive/5 border-destructive/30',
            bubbleClassName
          )}
          aria-busy={isStreaming}
          aria-live={isStreaming ? 'polite' : undefined}
        >
          {/* Content */}
          <div className="streaming-text">
            {renderedContent}
            {isStreaming && showCursor && (
              <StreamingCursor char={cursorChar} />
            )}
          </div>
        </div>

        {/* Footer: Timestamp and Actions */}
        {(timestamp || actions) && (
          <div className={cn(
            'flex items-center gap-2 px-1',
            role === 'user' ? 'flex-row-reverse' : 'flex-row'
          )}>
            {timestamp && <Timestamp timestamp={timestamp} />}
            {actions && (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                {actions}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.article>
  )
}

MessageBubble.displayName = 'MessageBubble'

// =============================================================================
// COMPOUND COMPONENTS
// =============================================================================

/**
 * UserMessage - Pre-configured for user messages
 */
export function UserMessage(props: Omit<MessageBubbleProps, 'role'>) {
  return <MessageBubble {...props} role="user" />
}

UserMessage.displayName = 'UserMessage'

/**
 * AssistantMessage - Pre-configured for assistant messages
 */
export function AssistantMessage(props: Omit<MessageBubbleProps, 'role'>) {
  return <MessageBubble {...props} role="assistant" />
}

AssistantMessage.displayName = 'AssistantMessage'

/**
 * SystemMessage - Pre-configured for system messages
 */
export function SystemMessage(props: Omit<MessageBubbleProps, 'role'>) {
  return <MessageBubble {...props} role="system" />
}

SystemMessage.displayName = 'SystemMessage'

// =============================================================================
// MESSAGE GROUP COMPONENT
// =============================================================================

/**
 * Props for MessageGroup
 */
export interface MessageGroupProps {
  /** Messages to render */
  children: React.ReactNode
  /** Gap between messages */
  gap?: 'sm' | 'md' | 'lg'
  /** Additional CSS class */
  className?: string
}

const GAP_CLASSES = {
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
}

/**
 * MessageGroup - Container for grouping messages
 */
export function MessageGroup({
  children,
  gap = 'md',
  className,
}: MessageGroupProps) {
  return (
    <div
      role="log"
      aria-label="Chat messages"
      className={cn('flex flex-col', GAP_CLASSES[gap], className)}
    >
      {children}
    </div>
  )
}

MessageGroup.displayName = 'MessageGroup'
