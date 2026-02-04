'use client'

import * as React from 'react'
import { cn } from '@clarity-chat/primitives'
import { Button } from '@clarity-chat/primitives'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@clarity-chat/primitives'
import { Textarea } from '@clarity-chat/primitives'
import {
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Send,
  X,
  Reply,
  CornerDownRight,
} from 'lucide-react'

// ============================================================================
// TYPES
// ============================================================================

export interface ThreadMessage {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  timestamp: Date
  isEdited?: boolean
}

export interface Thread {
  id: string
  parentMessageId: string
  messages: ThreadMessage[]
  participantCount: number
  lastActivity: Date
}

// ============================================================================
// THREAD INDICATOR
// ============================================================================

interface ThreadIndicatorProps {
  replyCount: number
  participants: Array<{ name: string; avatar?: string }>
  lastReplyTime?: Date
  onClick?: () => void
  className?: string
}

export function ThreadIndicator({
  replyCount,
  participants,
  lastReplyTime,
  onClick,
  className,
}: ThreadIndicatorProps) {
  if (replyCount === 0) return null

  const maxAvatars = 3
  const visibleParticipants = participants.slice(0, maxAvatars)

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors',
        className
      )}
    >
      <div className="flex -space-x-1.5">
        {visibleParticipants.map((p, i) => (
          <div
            key={i}
            className="h-5 w-5 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium"
            style={{ zIndex: maxAvatars - i }}
          >
            {p.avatar ? (
              <img
                src={p.avatar || '/placeholder.svg'}
                alt={p.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              p.name.charAt(0).toUpperCase()
            )}
          </div>
        ))}
      </div>
      <span className="text-sm font-medium">
        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
      </span>
      {lastReplyTime && (
        <span className="text-xs text-muted-foreground">
          Last reply {formatTimeAgo(lastReplyTime)}
        </span>
      )}
    </button>
  )
}

// ============================================================================
// THREAD VIEW
// ============================================================================

interface ThreadViewProps {
  thread: Thread
  parentMessage: ThreadMessage
  onReply: (content: string) => void
  onClose?: () => void
  className?: string
}

export function ThreadView({
  thread,
  parentMessage,
  onReply,
  onClose,
  className,
}: ThreadViewProps) {
  const [replyText, setReplyText] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread.messages.length])

  const handleSubmit = () => {
    if (replyText.trim()) {
      onReply(replyText.trim())
      setReplyText('')
    }
  }

  return (
    <div
      className={cn('flex flex-col h-full border-l border-border', className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span className="font-medium">Thread</span>
          <span className="text-sm text-muted-foreground">
            {thread.messages.length}{' '}
            {thread.messages.length === 1 ? 'reply' : 'replies'}
          </span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Parent Message */}
      <div className="p-4 border-b border-border bg-muted/30">
        <ThreadMessageItem message={parentMessage} isParent />
      </div>

      {/* Thread Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.map((message) => (
          <ThreadMessageItem key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Reply in thread..."
            className="min-h-[80px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit()
              }
            }}
          />
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">
            Press Cmd+Enter to send
          </span>
          <Button onClick={handleSubmit} disabled={!replyText.trim()} size="sm">
            <Send className="h-4 w-4 mr-2" />
            Reply
          </Button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// THREAD MESSAGE ITEM
// ============================================================================

interface ThreadMessageItemProps {
  message: ThreadMessage
  isParent?: boolean
  className?: string
}

export function ThreadMessageItem({
  message,
  isParent = false,
  className,
}: ThreadMessageItemProps) {
  return (
    <div className={cn('flex gap-3', className)}>
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {message.author.avatar ? (
          <img
            src={message.author.avatar || '/placeholder.svg'}
            alt={message.author.name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className="text-sm font-medium">
            {message.author.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-medium text-sm">{message.author.name}</span>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {message.isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
          {isParent && (
            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
              Original
            </span>
          )}
        </div>
        <p className="text-sm mt-1 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}

// ============================================================================
// INLINE THREAD
// ============================================================================

interface InlineThreadProps {
  thread: Thread
  parentMessage: ThreadMessage
  onReply: (content: string) => void
  defaultOpen?: boolean
  className?: string
}

export function InlineThread({
  thread,
  parentMessage,
  onReply,
  defaultOpen = false,
  className,
}: InlineThreadProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  const [replyText, setReplyText] = React.useState('')
  const [showReplyInput, setShowReplyInput] = React.useState(false)

  const handleSubmit = () => {
    if (replyText.trim()) {
      onReply(replyText.trim())
      setReplyText('')
      setShowReplyInput(false)
    }
  }

  const participants = React.useMemo(() => {
    const seen = new Set<string>()
    return thread.messages
      .filter((m) => {
        if (seen.has(m.author.id)) return false
        seen.add(m.author.id)
        return true
      })
      .map((m) => ({ name: m.author.name, avatar: m.author.avatar }))
  }, [thread.messages])

  return (
    <div className={cn('ml-11 mt-2', className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button className="flex items-center gap-2 text-primary hover:underline text-sm">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <ThreadIndicator
              replyCount={thread.messages.length}
              participants={participants}
              lastReplyTime={thread.lastActivity}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3 pl-4 border-l-2 border-muted">
          {thread.messages.map((message) => (
            <ThreadMessageItem key={message.id} message={message} />
          ))}

          {showReplyInput ? (
            <div className="mt-3 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="min-h-[60px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!replyText.trim()}
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowReplyInput(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => setShowReplyInput(true)}
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </Button>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

// ============================================================================
// REPLY PREVIEW
// ============================================================================

interface ReplyPreviewProps {
  message: ThreadMessage
  onClear?: () => void
  className?: string
}

export function ReplyPreview({
  message,
  onClear,
  className,
}: ReplyPreviewProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-2 p-2 rounded-lg bg-muted/50 border-l-2 border-primary',
        className
      )}
    >
      <CornerDownRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-primary">
          Replying to {message.author.name}
        </p>
        <p className="text-xs text-muted-foreground truncate mt-0.5">
          {message.content}
        </p>
      </div>
      {onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={onClear}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  )
}

// ============================================================================
// QUOTED MESSAGE
// ============================================================================

interface QuotedMessageProps {
  message: ThreadMessage
  onClick?: () => void
  className?: string
}

export function QuotedMessage({
  message,
  onClick,
  className,
}: QuotedMessageProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-2 rounded-lg bg-muted/50 border-l-2 border-muted-foreground/50 hover:bg-muted transition-colors',
        className
      )}
    >
      <p className="text-xs font-medium">{message.author.name}</p>
      <p className="text-xs text-muted-foreground truncate mt-0.5">
        {message.content}
      </p>
    </button>
  )
}

// ============================================================================
// HELPERS
// ============================================================================

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// ============================================================================
// HOOKS
// ============================================================================

export function useThread(initialMessages: ThreadMessage[] = []) {
  const [messages, setMessages] =
    React.useState<ThreadMessage[]>(initialMessages)

  const addReply = React.useCallback(
    (content: string, author: ThreadMessage['author']) => {
      const newMessage: ThreadMessage = {
        id: `reply-${Date.now()}`,
        content,
        author,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, newMessage])
      return newMessage
    },
    []
  )

  const editMessage = React.useCallback(
    (messageId: string, newContent: string) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, content: newContent, isEdited: true } : m
        )
      )
    },
    []
  )

  const deleteMessage = React.useCallback((messageId: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== messageId))
  }, [])

  return {
    messages,
    addReply,
    editMessage,
    deleteMessage,
    setMessages,
  }
}
