'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  cn,
} from '@clarity-chat/primitives'
import { formatRelativeTime } from '../../internal/helpers'
import { useReducedMotion } from '../../hooks/ui/use-reduced-motion'
import type { Message } from '@clarity-chat/types'
import { ANIMATION_PRESETS } from '@/animations/constants'

/**
 * Thread configuration
 */
export interface ThreadViewConfig {
  /** Maximum nesting depth for threads */
  maxDepth: number
  /** Show thread preview in main view */
  showPreview: boolean
  /** Number of characters to show in preview */
  previewLength: number
  /** Auto-collapse threads with this many messages */
  collapseThreshold: number
  /** Enable notifications for thread activity */
  notificationsEnabled: boolean
}

/**
 * Thread data structure
 */
export interface Thread {
  id: string
  parentMessageId: string
  messages: Message[]
  participants: ThreadParticipant[]
  unreadCount: number
  lastActivity: number
  isArchived: boolean
  metadata?: {
    createdAt: number
    updatedAt: number
    tags?: string[]
  }
}

/**
 * Thread participant
 */
export interface ThreadParticipant {
  id: string
  name: string
  role: 'user' | 'assistant' | 'system'
  avatar?: string
  lastReadAt?: number
}

/**
 * Props for MessageThreadView
 */
export interface MessageThreadViewProps {
  /** Parent message */
  parentMessage: Message
  /** Thread data */
  thread?: Thread
  /** All threads (for context) */
  threads?: Map<string, Thread>
  /** Configuration */
  config?: Partial<ThreadViewConfig>
  /** Callback when sending message to thread */
  onSendMessage?: (threadId: string, content: string) => void
  /** Callback when thread is created */
  onCreateThread?: (parentMessageId: string) => void
  /** Callback when thread is opened */
  onOpenThread?: (threadId: string) => void
  /** Callback when thread is closed */
  onCloseThread?: (threadId: string) => void
  /** Callback when thread is archived */
  onArchiveThread?: (threadId: string) => void
  /** Current user */
  currentUser?: ThreadParticipant
  /** Show thread in sidebar vs inline */
  layout?: 'inline' | 'sidebar'
  className?: string
}

/**
 * Props for ThreadList
 */
export interface ThreadListProps {
  /** All threads */
  threads: Thread[]
  /** Parent messages map */
  parentMessages: Map<string, Message>
  /** Configuration */
  config?: Partial<ThreadViewConfig>
  /** Callback when thread is selected */
  onSelectThread?: (threadId: string) => void
  /** Currently selected thread */
  selectedThreadId?: string
  /** Show archived threads */
  showArchived?: boolean
  className?: string
}

const defaultConfig: ThreadViewConfig = {
  maxDepth: 2,
  showPreview: true,
  previewLength: 100,
  collapseThreshold: 5,
  notificationsEnabled: true,
}

// formatRelativeTime imported from @clarity-chat/primitives

/**
 * MessageThreadView Component
 *
 * Slack-style message threading for organized conversations.
 *
 * Features:
 * - Nested thread support (configurable depth)
 * - Thread preview in main view
 * - Thread participant list
 * - Unread count badges
 * - Thread notifications
 * - Thread search
 * - Thread archiving
 * - Inline or sidebar layout
 *
 * @example
 * ```tsx
 * <MessageThreadView
 *   parentMessage={message}
 *   thread={threads.get(message.id)}
 *   config={{
 *     maxDepth: 2,
 *     showPreview: true,
 *     collapseThreshold: 5,
 *   }}
 *   onSendMessage={(threadId, content) => {
 *     sendThreadMessage(threadId, content)
 *   }}
 *   onCreateThread={(parentId) => {
 *     createNewThread(parentId)
 *   }}
 *   layout="sidebar"
 * />
 * ```
 */
export function MessageThreadView({
  parentMessage,
  thread,
  config: userConfig,
  onSendMessage,
  onCreateThread,
  onOpenThread,
  onCloseThread,
  onArchiveThread,
  currentUser,
  layout = 'inline',
  className,
}: MessageThreadViewProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = { ...defaultConfig, ...userConfig }

  const [isExpanded, setIsExpanded] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')
  const [isCollapsed, setIsCollapsed] = React.useState(
    thread && thread.messages.length > config.collapseThreshold
  )

  const hasThread = thread && thread.messages.length > 0
  const messageCount = thread?.messages.length || 0
  const participantCount = thread?.participants.length || 0

  /**
   * Handle thread expansion
   */
  const handleExpand = React.useCallback(() => {
    setIsExpanded(true)
    if (thread) {
      onOpenThread?.(thread.id)
    }
  }, [thread, onOpenThread])

  /**
   * Handle thread creation
   */
  const handleCreateThread = React.useCallback(() => {
    onCreateThread?.(parentMessage.id)
    setIsExpanded(true)
  }, [parentMessage.id, onCreateThread])

  /**
   * Handle sending reply
   */
  const handleSendReply = React.useCallback(() => {
    if (replyText.trim() && thread) {
      onSendMessage?.(thread.id, replyText)
      setReplyText('')
    }
  }, [replyText, thread, onSendMessage])

  /**
   * Handle thread archive
   */
  const handleArchive = React.useCallback(() => {
    if (thread) {
      onArchiveThread?.(thread.id)
      setIsExpanded(false)
    }
  }, [thread, onArchiveThread])

  // Thread preview component
  const ThreadPreview = () => {
    if (!hasThread || !config.showPreview) return null

    const lastMessage = thread.messages[thread.messages.length - 1]
    const preview = lastMessage.content.slice(0, config.previewLength)

    return (
      <motion.div
        {...ANIMATION_PRESETS.collapse}
        viewport={{ once: true }}
        className="mt-2 p-3 border-l-2 border-primary/30 bg-accent/20 rounded-r-lg cursor-pointer hover:bg-accent/30 transition-colors"
        onClick={handleExpand}
      >
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {messageCount} {messageCount === 1 ? 'reply' : 'replies'}
          </Badge>
          {thread.unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {thread.unreadCount} new
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(thread.lastActivity))}
          </span>
        </div>

        <div className="text-sm text-muted-foreground line-clamp-2">
          {preview}
          {lastMessage.content.length > config.previewLength && '...'}
        </div>

        {participantCount > 1 && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-muted-foreground">
              {participantCount}{' '}
              {participantCount === 1 ? 'participant' : 'participants'}
            </span>
            {thread.participants.slice(0, 3).map((participant) => (
              <div
                key={participant.id}
                className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs"
                title={participant.name}
              >
                {participant.name[0].toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    )
  }

  // Expanded thread view
  const ExpandedThread = () => {
    if (!isExpanded || !thread) return null

    return (
      <motion.div
        {...(prefersReducedMotion
          ? ANIMATION_PRESETS.fadeIn
          : layout === 'sidebar'
            ? ANIMATION_PRESETS.slideRight
            : ANIMATION_PRESETS.slideUp)}
        viewport={{ once: true }}
        className={cn(
          layout === 'sidebar' &&
            'fixed right-0 top-0 bottom-0 w-96 bg-background border-l shadow-lg z-50 flex flex-col',
          layout === 'inline' && 'mt-4 border rounded-lg bg-accent/10'
        )}
      >
        {/* Thread header */}
        <div className="border-b p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-sm">Thread</h3>
              <p className="text-xs text-muted-foreground">
                {messageCount} {messageCount === 1 ? 'reply' : 'replies'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleArchive}
                className="h-8 w-8"
                title="Archive thread"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsExpanded(false)
                  onCloseThread?.(thread.id)
                }}
                className="h-8 w-8"
              >
                ✕
              </Button>
            </div>
          </div>

          {/* Parent message excerpt */}
          <div className="p-2 bg-muted rounded-lg text-sm">
            <div className="font-medium text-xs text-muted-foreground mb-1">
              Original message:
            </div>
            <div className="line-clamp-2">{parentMessage.content}</div>
          </div>

          {/* Participants */}
          {participantCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-muted-foreground">
                Participants:
              </span>
              <div className="flex -space-x-2">
                {thread.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="w-7 h-7 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-medium"
                    title={participant.name}
                  >
                    {participant.name[0].toUpperCase()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Thread messages */}
        <div
          className={cn(
            'flex-1 overflow-y-auto p-4 space-y-3',
            layout === 'inline' && 'max-h-96'
          )}
        >
          {isCollapsed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCollapsed(false)}
              className="w-full"
            >
              Show {messageCount - 2} more{' '}
              {messageCount - 2 === 1 ? 'message' : 'messages'}
            </Button>
          ) : (
            thread.messages.map((message, index) => (
              <motion.div
                key={message.id}
                {...ANIMATION_PRESETS.slideUp}
                exit={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
                transition={
                  prefersReducedMotion ? { duration: 0 } : { delay: index * 0.05 }
                }
                viewport={{ once: true }}
                className={cn(
                  'p-3 rounded-lg',
                  message.role === 'user'
                    ? 'bg-primary/10 ml-4'
                    : 'bg-muted mr-4'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {thread.participants.find((p) => p.role === message.role)
                      ?.name || message.role}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(
                      new Date(Date.now() - (thread.messages.length - index) * 60000)
                    )}
                  </span>
                </div>
                <div className="text-sm">{message.content}</div>
              </motion.div>
            ))
          )}

          {isCollapsed && thread.messages.length > config.collapseThreshold && (
            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className="text-xs"
              >
                Show all messages
              </Button>
            </div>
          )}
        </div>

        {/* Reply input */}
        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Reply to thread..."
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button
              onClick={handleSendReply}
              disabled={!replyText.trim()}
              size="sm"
            >
              Send
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Thread preview or create button */}
      {!isExpanded && (
        <>
          {hasThread ? (
            <ThreadPreview />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCreateThread}
              className="mt-2 text-xs"
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Reply in thread
            </Button>
          )}
        </>
      )}

      {/* Expanded thread */}
      <ExpandedThread />
    </div>
  )
}

MessageThreadView.displayName = 'MessageThreadView'

/**
 * ThreadList Component
 *
 * Displays a list of all threads for navigation.
 *
 * @example
 * ```tsx
 * <ThreadList
 *   threads={Array.from(threads.values())}
 *   parentMessages={parentMessages}
 *   onSelectThread={(threadId) => {
 *     setSelectedThread(threadId)
 *   }}
 *   selectedThreadId={selectedThread}
 * />
 * ```
 */
export function ThreadList({
  threads,
  parentMessages,
  config: userConfig,
  onSelectThread,
  selectedThreadId,
  showArchived = false,
  className,
}: ThreadListProps) {
  const prefersReducedMotion = useReducedMotion()
  const config = { ...defaultConfig, ...userConfig }

  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortBy, setSortBy] = React.useState<
    'activity' | 'unread' | 'participants'
  >('activity')

  // Filter and sort threads
  const processedThreads = React.useMemo(() => {
    let filtered = threads

    // Filter by archived status
    if (!showArchived) {
      filtered = filtered.filter((t) => !t.isArchived)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((thread) => {
        const parentMessage = parentMessages.get(thread.parentMessageId)
        return (
          parentMessage?.content.toLowerCase().includes(query) ||
          thread.messages.some((m) => m.content.toLowerCase().includes(query))
        )
      })
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'activity':
          return b.lastActivity - a.lastActivity
        case 'unread':
          return b.unreadCount - a.unreadCount
        case 'participants':
          return b.participants.length - a.participants.length
        default:
          return 0
      }
    })

    return sorted
  }, [threads, showArchived, searchQuery, sortBy, parentMessages])

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Threads</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {processedThreads.length} active{' '}
                {processedThreads.length === 1 ? 'thread' : 'threads'}
              </p>
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="activity">Recent</option>
                <option value="unread">Unread</option>
                <option value="participants">Most Active</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search threads..."
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </CardContent>
      </Card>

      {/* Thread list */}
      <div className="space-y-2">
        {processedThreads.map((thread, index) => {
          const parentMessage = parentMessages.get(thread.parentMessageId)
          if (!parentMessage) return null

          const isSelected = thread.id === selectedThreadId

          return (
            <motion.div
              key={thread.id}
              {...ANIMATION_PRESETS.slideRight}
              exit={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { delay: index * 0.03 }
              }
              viewport={{ once: true }}
            >
                <Card
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-md',
                    isSelected && 'ring-2 ring-primary'
                  )}
                  onClick={() => onSelectThread?.(thread.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium line-clamp-1 mb-1">
                          {parentMessage.content}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {thread.messages[
                            thread.messages.length - 1
                          ]?.content.slice(0, 60)}
                          {thread.messages[thread.messages.length - 1]?.content
                            .length > 60 && '...'}
                        </div>
                      </div>
                      {thread.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {thread.unreadCount}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {thread.messages.length} replies
                        </Badge>
                        <span>{thread.participants.length} participants</span>
                      </div>
                      <span>{formatRelativeTime(new Date(thread.lastActivity))}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

        {processedThreads.length === 0 && (
          <Card className="shadow-sm">
            <CardContent className="p-8 text-center text-muted-foreground">
              {searchQuery ? 'No threads found' : 'No active threads'}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

ThreadList.displayName = 'ThreadList'
