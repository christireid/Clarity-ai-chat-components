'use client'

import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
  ScrollArea,
  cn,
} from '@clarity-chat/primitives'
import {
  User,
  Bot,
  ThumbsUp,
  Copy,
  MoreHorizontal,
  Reply,
  MessagesSquare,
  ChevronDown,
  ChevronRight,
  MessageCircle,
  CornerDownRight,
  ArrowUp,
  X,
  Send,
  Quote,
  Users,
} from 'lucide-react'

// ============================================================================
// MESSAGE THREADING DEMO
// ============================================================================

interface ThreadMessage {
  id: string
  content: string
  author: string
  timestamp: string
  isBot: boolean
  parentId?: string
  replies: ThreadMessage[]
  replyCount: number
}

export function MessageThreadingDemo() {
  const [threads, setThreads] = useState<ThreadMessage[]>([
    {
      id: '1',
      content: 'How do I implement authentication in Next.js?',
      author: 'Alex',
      timestamp: '10:30 AM',
      isBot: false,
      replyCount: 3,
      replies: [
        {
          id: '2',
          content:
            'Great question! Next.js offers several authentication solutions. The most popular are NextAuth.js and custom JWT implementation.',
          author: 'AI Assistant',
          timestamp: '10:31 AM',
          isBot: true,
          parentId: '1',
          replyCount: 2,
          replies: [
            {
              id: '3',
              content: 'Which one would you recommend for a production app?',
              author: 'Alex',
              timestamp: '10:32 AM',
              isBot: false,
              parentId: '2',
              replyCount: 1,
              replies: [
                {
                  id: '4',
                  content:
                    'For production, I recommend NextAuth.js. It supports multiple providers, handles session management, and has excellent security practices built-in.',
                  author: 'AI Assistant',
                  timestamp: '10:33 AM',
                  isBot: true,
                  parentId: '3',
                  replyCount: 0,
                  replies: [],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: '5',
      content: 'Can you explain React Server Components?',
      author: 'Jordan',
      timestamp: '11:15 AM',
      isBot: false,
      replyCount: 2,
      replies: [
        {
          id: '6',
          content:
            'Server Components let you write components that render on the server and send minimal JavaScript to the client. They can directly access backend resources.',
          author: 'AI Assistant',
          timestamp: '11:16 AM',
          isBot: true,
          parentId: '5',
          replyCount: 1,
          replies: [
            {
              id: '7',
              content:
                'That sounds powerful! What are the main benefits compared to client components?',
              author: 'Jordan',
              timestamp: '11:17 AM',
              isBot: false,
              parentId: '6',
              replyCount: 0,
              replies: [],
            },
          ],
        },
      ],
    },
    {
      id: '8',
      content: 'What is the best state management library for React in 2024?',
      author: 'Sam',
      timestamp: '2:45 PM',
      isBot: false,
      replyCount: 4,
      replies: [
        {
          id: '9',
          content:
            'The landscape has evolved significantly. Popular choices include Zustand for simplicity, Jotai for atomic state, and TanStack Query for server state.',
          author: 'AI Assistant',
          timestamp: '2:46 PM',
          isBot: true,
          parentId: '8',
          replyCount: 3,
          replies: [
            {
              id: '10',
              content: 'I have heard good things about Zustand. Is it easy to learn?',
              author: 'Sam',
              timestamp: '2:47 PM',
              isBot: false,
              parentId: '9',
              replyCount: 2,
              replies: [
                {
                  id: '11',
                  content:
                    'Yes! Zustand has a very minimal API. You can create a store in just a few lines of code. It is also unopinionated and works with any React pattern.',
                  author: 'AI Assistant',
                  timestamp: '2:48 PM',
                  isBot: true,
                  parentId: '10',
                  replyCount: 1,
                  replies: [
                    {
                      id: '12',
                      content: 'Perfect, I will give it a try. Thanks!',
                      author: 'Sam',
                      timestamp: '2:49 PM',
                      isBot: false,
                      parentId: '11',
                      replyCount: 0,
                      replies: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ])

  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(
    new Set(['1', '5', '8'])
  )
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null)

  const toggleThread = (messageId: string) => {
    const newExpanded = new Set(expandedThreads)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedThreads(newExpanded)
  }

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId)
    setReplyText('')
  }

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return

    const newReply: ThreadMessage = {
      id: Date.now().toString(),
      content: replyText,
      author: 'You',
      timestamp: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      }),
      isBot: false,
      parentId,
      replyCount: 0,
      replies: [],
    }

    const addReplyToThread = (messages: ThreadMessage[]): ThreadMessage[] => {
      return messages.map((msg) => {
        if (msg.id === parentId) {
          return {
            ...msg,
            replies: [...msg.replies, newReply],
            replyCount: msg.replyCount + 1,
          }
        }
        if (msg.replies.length > 0) {
          return {
            ...msg,
            replies: addReplyToThread(msg.replies),
          }
        }
        return msg
      })
    }

    setThreads(addReplyToThread(threads))
    setReplyingTo(null)
    setReplyText('')
    setExpandedThreads(new Set([...expandedThreads, parentId]))
  }

  const scrollToParent = (parentId: string) => {
    const element = document.getElementById(`message-${parentId}`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    element?.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
    setTimeout(() => {
      element?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')
    }, 2000)
  }

  const getThreadSummary = (message: ThreadMessage): string => {
    if (message.replyCount === 0) return ''
    const lastReply = message.replies[message.replies.length - 1]
    const deepestReply = getDeepestReply(lastReply)
    return deepestReply?.content || lastReply?.content || ''
  }

  const getDeepestReply = (message: ThreadMessage): ThreadMessage | null => {
    if (message.replies.length === 0) return message
    return getDeepestReply(message.replies[message.replies.length - 1])
  }

  const renderMessage = (message: ThreadMessage, depth: number = 0) => {
    const isExpanded = expandedThreads.has(message.id)
    const hasReplies = message.replyCount > 0
    const isReplying = replyingTo === message.id
    const isHovered = hoveredMessage === message.id

    return (
      <div key={message.id} className="space-y-2">
        {/* Main Message */}
        <div
          id={`message-${message.id}`}
          className={cn(
            'transition-all duration-200',
            depth > 0 && 'ml-8 border-l-2 border-primary/20 pl-4'
          )}
          onMouseEnter={() => setHoveredMessage(message.id)}
          onMouseLeave={() => setHoveredMessage(null)}
        >
          <div
            className={cn(
              'flex gap-3',
              message.isBot ? 'flex-row' : 'flex-row-reverse'
            )}
          >
            {/* Avatar */}
            <div
              className={cn(
                'shrink-0',
                message.isBot
                  ? 'icon-container-sm'
                  : 'icon-container-sm gradient-accent text-white'
              )}
            >
              {message.isBot ? (
                <Bot className="h-4 w-4" />
              ) : (
                <User className="h-4 w-4" />
              )}
            </div>

            {/* Message Content */}
            <div className="flex-1 space-y-2">
              <div
                className={cn(
                  'group relative rounded-xl p-3',
                  message.isBot
                    ? 'glass-subtle rounded-tl-none'
                    : 'gradient-accent text-white rounded-tr-none glow-sm',
                  'max-w-[85%]',
                  message.isBot ? '' : 'ml-auto'
                )}
              >
                {/* Parent Reference for Replies */}
                {message.parentId && depth > 0 && (
                  <button
                    onClick={() => scrollToParent(message.parentId!)}
                    className={cn(
                      'flex items-center gap-2 text-xs mb-2 pb-2 border-b opacity-70 hover:opacity-100 transition-opacity',
                      message.isBot
                        ? 'border-border text-muted-foreground'
                        : 'border-white/20 text-white'
                    )}
                  >
                    <Quote className="h-3 w-3" />
                    <span>Replying to previous message</span>
                    <ArrowUp className="h-3 w-3" />
                  </button>
                )}

                {/* Author & Time */}
                <div
                  className={cn(
                    'flex items-center gap-2 mb-1 text-xs',
                    message.isBot ? 'text-muted-foreground' : 'text-white/70'
                  )}
                >
                  <span className="font-medium">{message.author}</span>
                  <span>•</span>
                  <span>{message.timestamp}</span>
                </div>

                {/* Message Text */}
                <p className="text-sm leading-relaxed">{message.content}</p>

                {/* Reply Count Badge */}
                {hasReplies && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10">
                    <Badge
                      variant="secondary"
                      className={cn(
                        'gap-1 cursor-pointer hover:scale-105 transition-transform',
                        message.isBot
                          ? 'bg-primary/10 text-primary'
                          : 'bg-white/20 text-white'
                      )}
                      onClick={() => toggleThread(message.id)}
                    >
                      <MessageCircle className="h-3 w-3" />
                      {message.replyCount}{' '}
                      {message.replyCount === 1 ? 'reply' : 'replies'}
                      {isExpanded ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Badge>

                    {/* Thread Summary Preview */}
                    {!isExpanded && (
                      <span
                        className={cn(
                          'text-xs truncate max-w-[200px]',
                          message.isBot
                            ? 'text-muted-foreground'
                            : 'text-white/60'
                        )}
                      >
                        {getThreadSummary(message).substring(0, 50)}...
                      </span>
                    )}
                  </div>
                )}

                {/* Quick Actions (on hover) */}
                {isHovered && (
                  <div
                    className={cn(
                      'absolute -bottom-3 flex items-center gap-1 p-1 rounded-lg glass-card shadow-lg',
                      message.isBot ? 'left-0' : 'right-0'
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleReply(message.id)}
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ThumbsUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Reply Composer */}
              {isReplying && (
                <div className="glass-card rounded-lg p-3 border border-primary/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <CornerDownRight className="h-3 w-3" />
                    <span>Replying to {message.author}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-auto"
                      onClick={() => setReplyingTo(null)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full p-2 bg-background/50 rounded border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyingTo(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => submitReply(message.id)}
                      className="gap-2"
                    >
                      <Send className="h-3 w-3" />
                      Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Nested Replies */}
          {isExpanded && hasReplies && (
            <div className="mt-3 space-y-3 animate-in slide-in-from-top-2">
              {message.replies.map((reply) => renderMessage(reply, depth + 1))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessagesSquare className="h-5 w-5" />
              Message Threading
            </CardTitle>
            <CardDescription>
              Threaded conversations with nested replies and visual indicators
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Users className="h-3 w-3" />
              {threads.length} conversations
            </Badge>
            <Badge variant="outline" className="gap-1">
              <MessageCircle className="h-3 w-3" />
              {threads.reduce((acc, t) => acc + t.replyCount, 0)} replies
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="space-y-6 pr-4">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="pb-6 border-b border-border/50 last:border-0"
              >
                {renderMessage(thread, 0)}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
