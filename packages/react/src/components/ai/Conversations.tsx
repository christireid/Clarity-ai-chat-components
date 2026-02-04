'use client'

/**
 * Conversations Component
 *
 * A comprehensive chat conversation display component inspired by Ant Design X.
 * Manages the display of message threads with support for different message types,
 * avatars, timestamps, and interactive elements.
 *
 * Features:
 * - Multiple conversation threads
 * - Message grouping by time/sender
 * - Avatar and role display
 * - Typing indicators
 * - Message status (sending, sent, error)
 * - Scroll management (auto-scroll, scroll to bottom)
 * - Message selection and actions
 * - Keyboard navigation
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <Conversations
 *   items={[
 *     {
 *       key: 'conv-1',
 *       label: 'Chat with AI',
 *       messages: messages,
 *     },
 *   ]}
 *   activeKey="conv-1"
 *   onActiveChange={setActiveKey}
 * />
 * ```
 */

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn, useReducedMotion } from '@clarity-chat/primitives'
import { DURATION_SECONDS, EASING_FRAMER } from '../../animations/constants'

// ============================================================================
// Types
// ============================================================================

export type MessagePlacement = 'start' | 'end'
export type MessageStatus = 'sending' | 'sent' | 'error' | 'streaming'

export interface ConversationMessage {
  /** Unique message ID */
  id: string
  /** Message content (text or React node) */
  content: React.ReactNode
  /** Message role */
  role: 'user' | 'assistant' | 'system'
  /** Avatar URL or element */
  avatar?: string | React.ReactNode
  /** Display name */
  name?: string
  /** Timestamp */
  timestamp?: Date | string | number
  /** Message status */
  status?: MessageStatus
  /** Whether message is loading/streaming */
  isLoading?: boolean
  /** Error message if status is error */
  error?: string
  /** Additional metadata */
  metadata?: Record<string, unknown>
  /** Footer content (actions, reactions, etc.) */
  footer?: React.ReactNode
  /** Whether message is selected */
  isSelected?: boolean
}

export interface ConversationItem {
  /** Unique conversation key */
  key: string
  /** Conversation label/title */
  label: string
  /** Optional icon */
  icon?: React.ReactNode
  /** Messages in this conversation */
  messages?: ConversationMessage[]
  /** Whether conversation is disabled */
  disabled?: boolean
  /** Timestamp of last activity */
  lastActivity?: Date | string | number
  /** Unread count */
  unreadCount?: number
  /** Conversation metadata */
  metadata?: Record<string, unknown>
}

export interface ConversationsProps {
  /** Conversation items */
  items: ConversationItem[]
  /** Active conversation key */
  activeKey?: string
  /** Default active key */
  defaultActiveKey?: string
  /** Callback when active conversation changes */
  onActiveChange?: (key: string) => void
  /** Render function for message content */
  renderMessage?: (message: ConversationMessage, index: number) => React.ReactNode
  /** Render function for avatar */
  renderAvatar?: (message: ConversationMessage) => React.ReactNode
  /** Whether to show conversation list sidebar */
  showSidebar?: boolean
  /** Sidebar width */
  sidebarWidth?: number | string
  /** Whether to group messages by sender */
  groupMessages?: boolean
  /** Time threshold for grouping (ms) */
  groupThreshold?: number
  /** Whether to auto-scroll on new messages */
  autoScroll?: boolean
  /** Whether to show timestamps */
  showTimestamps?: boolean
  /** Timestamp format function */
  formatTimestamp?: (date: Date) => string
  /** Whether conversation is loading */
  isLoading?: boolean
  /** Loading component */
  loadingComponent?: React.ReactNode
  /** Empty state component */
  emptyComponent?: React.ReactNode
  /** Header component */
  header?: React.ReactNode
  /** Footer component (usually input) */
  footer?: React.ReactNode
  /** On message click */
  onMessageClick?: (message: ConversationMessage) => void
  /** On message select */
  onMessageSelect?: (message: ConversationMessage, selected: boolean) => void
  /** Additional class names */
  className?: string
  /** Messages container class */
  messagesClassName?: string
}

// ============================================================================
// Helper Components
// ============================================================================

const DefaultAvatar: React.FC<{ role: string; name?: string }> = ({ role, name }) => {
  const initial = name ? name[0].toUpperCase() : role === 'user' ? 'U' : 'A'
  const bgColor = role === 'user' ? 'bg-primary' : 'bg-muted'
  const textColor = role === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'

  return (
    <div className={cn('conversations-avatar-default', bgColor, textColor)}>
      {initial}
    </div>
  )
}

const TypingIndicator: React.FC = () => (
  <div className="conversations-typing">
    <span className="conversations-typing-dot" />
    <span className="conversations-typing-dot" />
    <span className="conversations-typing-dot" />
  </div>
)

const MessageStatusIcon: React.FC<{ status?: MessageStatus }> = ({ status }) => {
  switch (status) {
    case 'sending':
      return (
        <svg className="conversations-status-icon animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" />
        </svg>
      )
    case 'sent':
      return (
        <svg className="conversations-status-icon text-green-500" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )
    case 'error':
      return (
        <svg className="conversations-status-icon text-destructive" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    default:
      return null
  }
}

// ============================================================================
// ConversationMessage Component
// ============================================================================

interface MessageItemProps {
  message: ConversationMessage
  renderAvatar?: (message: ConversationMessage) => React.ReactNode
  showTimestamp?: boolean
  formatTimestamp?: (date: Date) => string
  isGrouped?: boolean
  isFirst?: boolean
  isLast?: boolean
  onClick?: () => void
  onSelect?: (selected: boolean) => void
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  renderAvatar,
  showTimestamp,
  formatTimestamp,
  isGrouped,
  isFirst,
  isLast,
  onClick,
  onSelect,
}) => {
  const prefersReducedMotion = useReducedMotion()
  const isUser = message.role === 'user'
  const placement: MessagePlacement = isUser ? 'end' : 'start'

  const defaultFormatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const timestamp = message.timestamp
    ? (formatTimestamp || defaultFormatTimestamp)(
        message.timestamp instanceof Date
          ? message.timestamp
          : new Date(message.timestamp)
      )
    : null

  const avatar = renderAvatar
    ? renderAvatar(message)
    : message.avatar
    ? typeof message.avatar === 'string'
      ? <img src={message.avatar} alt={message.name || message.role} className="conversations-avatar-img" />
      : message.avatar
    : <DefaultAvatar role={message.role} name={message.name} />

  return (
    <motion.div
      className={cn(
        'conversations-message',
        `conversations-message-${placement}`,
        isGrouped && 'conversations-message-grouped',
        isFirst && 'conversations-message-first',
        isLast && 'conversations-message-last',
        message.isSelected && 'conversations-message-selected',
        message.status === 'error' && 'conversations-message-error'
      )}
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: DURATION_SECONDS.fast,
        ease: EASING_FRAMER.standard,
      }}
      onClick={onClick}
      role="article"
      aria-label={`Message from ${message.name || message.role}`}
    >
      {/* Avatar */}
      {(!isGrouped || isFirst) && placement === 'start' && (
        <div className="conversations-message-avatar">{avatar}</div>
      )}

      {/* Content */}
      <div className="conversations-message-content-wrapper">
        {/* Header */}
        {(!isGrouped || isFirst) && (
          <div className="conversations-message-header">
            {message.name && (
              <span className="conversations-message-name">{message.name}</span>
            )}
            {showTimestamp && timestamp && (
              <span className="conversations-message-time">{timestamp}</span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div className={cn(
          'conversations-message-bubble',
          `conversations-message-bubble-${message.role}`
        )}>
          {message.isLoading ? (
            <TypingIndicator />
          ) : (
            message.content
          )}
        </div>

        {/* Footer */}
        {(message.footer || message.status) && (
          <div className="conversations-message-footer">
            {message.status && <MessageStatusIcon status={message.status} />}
            {message.error && (
              <span className="conversations-message-error-text">{message.error}</span>
            )}
            {message.footer}
          </div>
        )}
      </div>

      {/* Avatar (end placement) */}
      {(!isGrouped || isFirst) && placement === 'end' && (
        <div className="conversations-message-avatar">{avatar}</div>
      )}
    </motion.div>
  )
}

// ============================================================================
// ConversationSidebar Component
// ============================================================================

interface ConversationSidebarProps {
  items: ConversationItem[]
  activeKey?: string
  onSelect: (key: string) => void
  width?: number | string
}

const ConversationSidebar: React.FC<ConversationSidebarProps> = ({
  items,
  activeKey,
  onSelect,
  width = 280,
}) => {
  return (
    <div className="conversations-sidebar" style={{ width }}>
      <div className="conversations-sidebar-header">
        <h3 className="conversations-sidebar-title">Conversations</h3>
      </div>
      <div className="conversations-sidebar-list">
        {items.map((item) => (
          <button
            key={item.key}
            className={cn(
              'conversations-sidebar-item',
              activeKey === item.key && 'conversations-sidebar-item-active',
              item.disabled && 'conversations-sidebar-item-disabled'
            )}
            onClick={() => !item.disabled && onSelect(item.key)}
            disabled={item.disabled}
          >
            {item.icon && (
              <span className="conversations-sidebar-item-icon">{item.icon}</span>
            )}
            <div className="conversations-sidebar-item-content">
              <span className="conversations-sidebar-item-label">{item.label}</span>
              {item.lastActivity && (
                <span className="conversations-sidebar-item-time">
                  {new Date(item.lastActivity).toLocaleDateString()}
                </span>
              )}
            </div>
            {item.unreadCount && item.unreadCount > 0 && (
              <span className="conversations-sidebar-item-badge">
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// Conversations Component
// ============================================================================

export function Conversations({
  items,
  activeKey: controlledActiveKey,
  defaultActiveKey,
  onActiveChange,
  renderMessage,
  renderAvatar,
  showSidebar = false,
  sidebarWidth = 280,
  groupMessages = true,
  groupThreshold = 60000, // 1 minute
  autoScroll = true,
  showTimestamps = true,
  formatTimestamp,
  isLoading = false,
  loadingComponent,
  emptyComponent,
  header,
  footer,
  onMessageClick,
  onMessageSelect,
  className,
  messagesClassName,
}: ConversationsProps) {
  const prefersReducedMotion = useReducedMotion()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const messagesContainerRef = React.useRef<HTMLDivElement>(null)

  const [internalActiveKey, setInternalActiveKey] = React.useState(
    defaultActiveKey || items[0]?.key
  )

  const activeKey = controlledActiveKey ?? internalActiveKey

  const handleActiveChange = (key: string) => {
    setInternalActiveKey(key)
    onActiveChange?.(key)
  }

  const activeConversation = items.find((item) => item.key === activeKey)
  const messages = React.useMemo(
    () => activeConversation?.messages || [],
    [activeConversation?.messages]
  )

  // Group messages by sender and time
  const groupedMessages = React.useMemo(() => {
    if (!groupMessages) {
      return messages.map((msg, idx) => ({
        message: msg,
        isGrouped: false,
        isFirst: true,
        isLast: true,
      }))
    }

    return messages.map((msg, idx) => {
      const prevMsg = messages[idx - 1]
      const nextMsg = messages[idx + 1]

      const prevTimestamp = prevMsg?.timestamp
        ? new Date(prevMsg.timestamp).getTime()
        : 0
      const currTimestamp = msg.timestamp
        ? new Date(msg.timestamp).getTime()
        : Date.now()
      const nextTimestamp = nextMsg?.timestamp
        ? new Date(nextMsg.timestamp).getTime()
        : Infinity

      const isGroupedWithPrev =
        prevMsg?.role === msg.role &&
        currTimestamp - prevTimestamp < groupThreshold

      const isGroupedWithNext =
        nextMsg?.role === msg.role &&
        nextTimestamp - currTimestamp < groupThreshold

      return {
        message: msg,
        isGrouped: isGroupedWithPrev,
        isFirst: !isGroupedWithPrev,
        isLast: !isGroupedWithNext,
      }
    })
  }, [messages, groupMessages, groupThreshold])

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }, [messages.length, autoScroll, prefersReducedMotion])

  return (
    <div className={cn('conversations', className)}>
      {/* Sidebar */}
      {showSidebar && (
        <ConversationSidebar
          items={items}
          activeKey={activeKey}
          onSelect={handleActiveChange}
          width={sidebarWidth}
        />
      )}

      {/* Main content */}
      <div className="conversations-main">
        {/* Header */}
        {header && <div className="conversations-header">{header}</div>}

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className={cn('conversations-messages', messagesClassName)}
          role="log"
          aria-label="Conversation messages"
          aria-live="polite"
        >
          {isLoading ? (
            loadingComponent || (
              <div className="conversations-loading">
                <div className="conversations-loading-spinner" />
                <span>Loading conversation...</span>
              </div>
            )
          ) : groupedMessages.length === 0 ? (
            emptyComponent || (
              <div className="conversations-empty">
                <span>No messages yet</span>
                <span className="conversations-empty-hint">
                  Start a conversation to see messages here
                </span>
              </div>
            )
          ) : (
            <AnimatePresence mode="popLayout">
              {groupedMessages.map(({ message, isGrouped, isFirst, isLast }, index) => (
                <React.Fragment key={message.id}>
                  {renderMessage ? (
                    renderMessage(message, index)
                  ) : (
                    <MessageItem
                      message={message}
                      renderAvatar={renderAvatar}
                      showTimestamp={showTimestamps}
                      formatTimestamp={formatTimestamp}
                      isGrouped={isGrouped}
                      isFirst={isFirst}
                      isLast={isLast}
                      onClick={() => onMessageClick?.(message)}
                      onSelect={(selected) => onMessageSelect?.(message, selected)}
                    />
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        {footer && <div className="conversations-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ============================================================================
// useConversations Hook
// ============================================================================

export interface UseConversationsOptions {
  /** Initial conversations */
  initialConversations?: ConversationItem[]
  /** Initial active key */
  initialActiveKey?: string
  /** Persist to storage */
  persist?: boolean
  /** Storage key */
  storageKey?: string
}

export interface UseConversationsReturn {
  /** All conversations */
  conversations: ConversationItem[]
  /** Active conversation key */
  activeKey: string | undefined
  /** Active conversation */
  activeConversation: ConversationItem | undefined
  /** Set active conversation */
  setActiveKey: (key: string) => void
  /** Add a new conversation */
  addConversation: (conversation: Omit<ConversationItem, 'key'>) => string
  /** Remove a conversation */
  removeConversation: (key: string) => void
  /** Update a conversation */
  updateConversation: (key: string, updates: Partial<ConversationItem>) => void
  /** Add message to active conversation */
  addMessage: (message: Omit<ConversationMessage, 'id'>) => string
  /** Update a message */
  updateMessage: (messageId: string, updates: Partial<ConversationMessage>) => void
  /** Remove a message */
  removeMessage: (messageId: string) => void
  /** Clear messages in active conversation */
  clearMessages: () => void
}

export function useConversations(
  options: UseConversationsOptions = {}
): UseConversationsReturn {
  const {
    initialConversations = [],
    initialActiveKey,
    persist = false,
    storageKey = 'conversations',
  } = options

  const [conversations, setConversations] = React.useState<ConversationItem[]>(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(storageKey)
        if (stored) return JSON.parse(stored)
      } catch (e) {
        console.warn('Failed to load conversations:', e)
      }
    }
    return initialConversations
  })

  const [activeKey, setActiveKey] = React.useState<string | undefined>(
    initialActiveKey || initialConversations[0]?.key
  )

  // Persist
  React.useEffect(() => {
    if (persist && typeof window !== 'undefined') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(conversations))
      } catch (e) {
        console.warn('Failed to persist conversations:', e)
      }
    }
  }, [conversations, persist, storageKey])

  const activeConversation = conversations.find((c) => c.key === activeKey)

  const addConversation = React.useCallback(
    (conversation: Omit<ConversationItem, 'key'>) => {
      const key = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setConversations((prev) => [
        ...prev,
        { ...conversation, key, messages: conversation.messages || [] },
      ])
      return key
    },
    []
  )

  const removeConversation = React.useCallback((key: string) => {
    setConversations((prev) => prev.filter((c) => c.key !== key))
    setActiveKey((prev) => (prev === key ? undefined : prev))
  }, [])

  const updateConversation = React.useCallback(
    (key: string, updates: Partial<ConversationItem>) => {
      setConversations((prev) =>
        prev.map((c) => (c.key === key ? { ...c, ...updates } : c))
      )
    },
    []
  )

  const addMessage = React.useCallback(
    (message: Omit<ConversationMessage, 'id'>) => {
      const id = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setConversations((prev) =>
        prev.map((c) =>
          c.key === activeKey
            ? {
                ...c,
                messages: [...(c.messages || []), { ...message, id }],
                lastActivity: new Date(),
              }
            : c
        )
      )
      return id
    },
    [activeKey]
  )

  const updateMessage = React.useCallback(
    (messageId: string, updates: Partial<ConversationMessage>) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.key === activeKey
            ? {
                ...c,
                messages: c.messages?.map((m) =>
                  m.id === messageId ? { ...m, ...updates } : m
                ),
              }
            : c
        )
      )
    },
    [activeKey]
  )

  const removeMessage = React.useCallback(
    (messageId: string) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.key === activeKey
            ? { ...c, messages: c.messages?.filter((m) => m.id !== messageId) }
            : c
        )
      )
    },
    [activeKey]
  )

  const clearMessages = React.useCallback(() => {
    setConversations((prev) =>
      prev.map((c) => (c.key === activeKey ? { ...c, messages: [] } : c))
    )
  }, [activeKey])

  return {
    conversations,
    activeKey,
    activeConversation,
    setActiveKey,
    addConversation,
    removeConversation,
    updateConversation,
    addMessage,
    updateMessage,
    removeMessage,
    clearMessages,
  }
}

export default Conversations
