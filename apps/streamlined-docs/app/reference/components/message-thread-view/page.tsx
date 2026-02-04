'use client'

/**
 * MessageThreadView Component - API Reference Documentation
 *
 * A Slack-style message threading component for organizing conversations
 * into nested discussions. Supports inline and sidebar layouts with
 * participant tracking, unread counts, and thread archiving.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Users,
  Archive,
  Layers,
  Bell,
  Search,
  GitBranch,
  MessageCircle,
  Timer,
  ChevronDown,
  Send,
  Reply,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props Table Component
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Live Demo Component
// ============================================================================

function LiveDemo() {
  const [threads, setThreads] = React.useState<
    Map<
      string,
      {
        id: string
        parentMessageId: string
        messages: Array<{
          id: string
          role: 'user' | 'assistant'
          content: string
        }>
        participants: Array<{
          id: string
          name: string
          role: 'user' | 'assistant' | 'system'
        }>
        unreadCount: number
        lastActivity: number
      }
    >
  >(
    new Map([
      [
        'thread-1',
        {
          id: 'thread-1',
          parentMessageId: 'msg-1',
          messages: [
            {
              id: 'thread-msg-1',
              role: 'user',
              content: "Let's discuss this in a thread!",
            },
            {
              id: 'thread-msg-2',
              role: 'assistant',
              content:
                'Great idea! Threads help keep conversations organized.',
            },
            {
              id: 'thread-msg-3',
              role: 'user',
              content: 'Yes, and we can have multiple people participating.',
            },
          ],
          participants: [
            { id: 'user-1', name: 'Alice', role: 'user' },
            { id: 'assistant-1', name: 'AI Assistant', role: 'assistant' },
          ],
          unreadCount: 1,
          lastActivity: Date.now() - 5 * 60 * 1000,
        },
      ],
    ])
  )

  const [selectedLayout, setSelectedLayout] = React.useState<
    'inline' | 'sidebar'
  >('inline')
  const [isThreadExpanded, setIsThreadExpanded] = React.useState(false)
  const [replyText, setReplyText] = React.useState('')

  const parentMessage = {
    id: 'msg-1',
    role: 'user' as const,
    content: 'Can we organize this discussion better?',
    status: 'sent' as const,
    chatId: 'chat-1',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000),
  }

  const thread = threads.get('thread-1')

  const handleSendReply = () => {
    if (!replyText.trim() || !thread) return

    const newMessage = {
      id: `thread-msg-${Date.now()}`,
      role: 'user' as const,
      content: replyText,
    }

    const updatedThread = {
      ...thread,
      messages: [...thread.messages, newMessage],
      lastActivity: Date.now(),
      unreadCount: 0,
    }

    setThreads(new Map(threads.set('thread-1', updatedThread)))
    setReplyText('')
  }

  const handleCreateThread = () => {
    setIsThreadExpanded(true)
  }

  const formatRelativeTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <span>Layout:</span>
          <select
            value={selectedLayout}
            onChange={(e) =>
              setSelectedLayout(e.target.value as 'inline' | 'sidebar')
            }
            className="rounded border px-2 py-1 text-sm"
          >
            <option value="inline">Inline</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </label>
        <button
          onClick={() => setIsThreadExpanded(!isThreadExpanded)}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          {isThreadExpanded ? 'Collapse Thread' : 'Expand Thread'}
        </button>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              MessageThreadView Demo
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {thread?.messages.length || 0} replies
          </span>
        </div>

        {/* Parent Message */}
        <div className="p-4 border-b border-border/50 bg-background/50">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-sm font-medium">
              A
            </div>
            <div>
              <div className="text-sm font-medium">Alice</div>
              <div className="text-xs text-muted-foreground">
                {formatRelativeTime(parentMessage.createdAt.getTime())}
              </div>
            </div>
          </div>
          <div className="text-sm text-foreground">{parentMessage.content}</div>

          {/* Thread Preview (when collapsed) */}
          {!isThreadExpanded && thread && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-3 border-l-2 border-brand-500/30 bg-accent/20 rounded-r-lg cursor-pointer hover:bg-accent/30 transition-colors"
              onClick={() => setIsThreadExpanded(true)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  {thread.messages.length} replies
                </span>
                {thread.unreadCount > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                    {thread.unreadCount} new
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {formatRelativeTime(thread.lastActivity)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2">
                {thread.messages[thread.messages.length - 1]?.content}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <Users className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {thread.participants.length} participants
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Expanded Thread */}
        <AnimatePresence>
          {isThreadExpanded && thread && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                'bg-accent/10',
                selectedLayout === 'sidebar' &&
                  'fixed right-0 top-0 bottom-0 w-96 bg-background border-l shadow-lg z-50'
              )}
            >
              {/* Thread Header */}
              <div className="border-b p-4 bg-muted/30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm">Thread</h3>
                    <p className="text-xs text-muted-foreground">
                      {thread.messages.length} replies
                    </p>
                  </div>
                  <button
                    onClick={() => setIsThreadExpanded(false)}
                    className="p-1 hover:bg-muted rounded"
                  >
                    ✕
                  </button>
                </div>

                {/* Parent Message Excerpt */}
                <div className="p-2 bg-muted rounded-lg text-sm">
                  <div className="font-medium text-xs text-muted-foreground mb-1">
                    Original message:
                  </div>
                  <div className="line-clamp-2">{parentMessage.content}</div>
                </div>

                {/* Participants */}
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
              </div>

              {/* Thread Messages */}
              <div className="overflow-y-auto p-4 space-y-3 max-h-96">
                {thread.messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      'p-3 rounded-lg',
                      message.role === 'user'
                        ? 'bg-brand-500/10 ml-4'
                        : 'bg-muted mr-4'
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium">
                        {thread.participants.find(
                          (p) => p.role === message.role
                        )?.name || message.role}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(Date.now() - index * 60000)}
                      </span>
                    </div>
                    <div className="text-sm">{message.content}</div>
                  </motion.div>
                ))}
              </div>

              {/* Reply Input */}
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
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="px-3 py-2 bg-brand-500 text-white rounded-lg text-sm hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'demo', title: 'Live Demo' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props Reference',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'thread-config', title: 'Thread Configuration' },
      { id: 'callback-props', title: 'Callbacks' },
      { id: 'thread-types', title: 'Thread Types' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Thread' },
      { id: 'example-sidebar', title: 'Sidebar Layout' },
      { id: 'example-thread-list', title: 'Thread List' },
      { id: 'example-multiple', title: 'Multiple Branches' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'use-cases', title: 'Use Cases' },
  { id: 'related', title: 'Related' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'parentMessage',
    type: 'Message',
    required: true,
    description:
      'The parent message that this thread is attached to. Must include id and content.',
  },
  {
    name: 'thread',
    type: 'Thread',
    description:
      'Thread data including messages, participants, and metadata. If undefined, component shows "Create Thread" button.',
  },
  {
    name: 'threads',
    type: 'Map<string, Thread>',
    description:
      'All threads in the conversation for context and navigation.',
  },
  {
    name: 'config',
    type: 'Partial<ThreadViewConfig>',
    description:
      'Configuration options for thread behavior (max depth, preview settings, etc.).',
  },
  {
    name: 'currentUser',
    type: 'ThreadParticipant',
    description:
      'Current user information for displaying permissions and customizing UI.',
  },
  {
    name: 'layout',
    type: "'inline' | 'sidebar'",
    default: "'inline'",
    description:
      "Layout mode: 'inline' shows thread below message, 'sidebar' opens in fixed sidebar.",
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
]

const threadConfigProps: PropDefinition[] = [
  {
    name: 'maxDepth',
    type: 'number',
    default: '2',
    description: 'Maximum nesting depth for nested threads.',
  },
  {
    name: 'showPreview',
    type: 'boolean',
    default: 'true',
    description:
      'Show collapsed thread preview below parent message with reply count and last message.',
  },
  {
    name: 'previewLength',
    type: 'number',
    default: '100',
    description: 'Number of characters to show in thread preview.',
  },
  {
    name: 'collapseThreshold',
    type: 'number',
    default: '5',
    description:
      'Auto-collapse threads with more than this many messages. Shows "Show more" button.',
  },
  {
    name: 'notificationsEnabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable notifications for new thread activity.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onSendMessage',
    type: '(threadId: string, content: string) => void',
    description: 'Callback when user sends a message to the thread.',
  },
  {
    name: 'onCreateThread',
    type: '(parentMessageId: string) => void',
    description: 'Callback when user creates a new thread.',
  },
  {
    name: 'onOpenThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is expanded/opened.',
  },
  {
    name: 'onCloseThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is collapsed/closed.',
  },
  {
    name: 'onArchiveThread',
    type: '(threadId: string) => void',
    description: 'Callback when thread is archived.',
  },
]

const threadTypeProps: PropDefinition[] = [
  {
    name: 'Thread.id',
    type: 'string',
    required: true,
    description: 'Unique thread identifier.',
  },
  {
    name: 'Thread.parentMessageId',
    type: 'string',
    required: true,
    description: 'ID of the parent message this thread is attached to.',
  },
  {
    name: 'Thread.messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages in the thread.',
  },
  {
    name: 'Thread.participants',
    type: 'ThreadParticipant[]',
    required: true,
    description: 'Users participating in the thread.',
  },
  {
    name: 'Thread.unreadCount',
    type: 'number',
    required: true,
    description: 'Number of unread messages in the thread.',
  },
  {
    name: 'Thread.lastActivity',
    type: 'number',
    required: true,
    description: 'Unix timestamp of last activity.',
  },
  {
    name: 'Thread.isArchived',
    type: 'boolean',
    required: true,
    description: 'Whether the thread is archived.',
  },
  {
    name: 'Thread.metadata',
    type: '{ createdAt: number; updatedAt: number; tags?: string[] }',
    description: 'Optional metadata for the thread.',
  },
]

const threadListProps: PropDefinition[] = [
  {
    name: 'threads',
    type: 'Thread[]',
    required: true,
    description: 'Array of all threads to display.',
  },
  {
    name: 'parentMessages',
    type: 'Map<string, Message>',
    required: true,
    description: 'Map of parent messages for displaying context.',
  },
  {
    name: 'config',
    type: 'Partial<ThreadViewConfig>',
    description: 'Configuration options.',
  },
  {
    name: 'onSelectThread',
    type: '(threadId: string) => void',
    description: 'Callback when a thread is selected.',
  },
  {
    name: 'selectedThreadId',
    type: 'string',
    description: 'Currently selected thread ID.',
  },
  {
    name: 'showArchived',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show archived threads.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { MessageThreadView, ThreadList } from '@clarity-chat/react'
import type {
  MessageThreadViewProps,
  Thread,
  ThreadParticipant
} from '@clarity-chat/react'`

const basicUsageCode = `import { MessageThreadView } from '@clarity-chat/react'

function ChatMessage({ message, threads }) {
  const thread = threads.get(message.id)

  return (
    <div>
      {/* Original message */}
      <div className="message">{message.content}</div>

      {/* Thread view */}
      <MessageThreadView
        parentMessage={message}
        thread={thread}
        onSendMessage={(threadId, content) => {
          // Send message to thread
          sendThreadMessage(threadId, content)
        }}
        onCreateThread={(parentId) => {
          // Create new thread
          createThread(parentId)
        }}
      />
    </div>
  )
}`

const sidebarLayoutCode = `import { MessageThreadView } from '@clarity-chat/react'

function ChatWithSidebar({ message, thread }) {
  const [isThreadOpen, setIsThreadOpen] = useState(false)

  return (
    <>
      {/* Main chat area */}
      <div className="chat-area">
        <MessageThreadView
          parentMessage={message}
          thread={thread}
          layout="sidebar"
          onOpenThread={() => setIsThreadOpen(true)}
          onCloseThread={() => setIsThreadOpen(false)}
        />
      </div>

      {/* Thread opens in sidebar */}
      {isThreadOpen && (
        <aside className="thread-sidebar">
          {/* Thread content appears here */}
        </aside>
      )}
    </>
  )
}`

const threadListCode = `import { ThreadList } from '@clarity-chat/react'

function ThreadSidebar({ threads, parentMessages }) {
  const [selectedThread, setSelectedThread] = useState<string>()

  return (
    <ThreadList
      threads={Array.from(threads.values())}
      parentMessages={parentMessages}
      onSelectThread={(threadId) => {
        setSelectedThread(threadId)
        // Navigate to thread or open in detail view
      }}
      selectedThreadId={selectedThread}
      config={{
        showPreview: true,
        previewLength: 60,
      }}
    />
  )
}`

const multipleBranchesCode = `import { MessageThreadView } from '@clarity-chat/react'

function MessageWithBranches({ message, threads }) {
  // Get all threads for this message
  const messageThreads = Array.from(threads.values()).filter(
    (t) => t.parentMessageId === message.id
  )

  return (
    <div>
      <div className="message">{message.content}</div>

      {/* Multiple thread branches */}
      {messageThreads.map((thread) => (
        <MessageThreadView
          key={thread.id}
          parentMessage={message}
          thread={thread}
          threads={threads}
          config={{
            maxDepth: 3,
            showPreview: true,
          }}
          onSendMessage={(threadId, content) => {
            sendMessage(threadId, content)
          }}
        />
      ))}
    </div>
  )
}`

const typescriptCode = `// MessageThreadView props
interface MessageThreadViewProps {
  parentMessage: Message
  thread?: Thread
  threads?: Map<string, Thread>
  config?: Partial<ThreadViewConfig>
  onSendMessage?: (threadId: string, content: string) => void
  onCreateThread?: (parentMessageId: string) => void
  onOpenThread?: (threadId: string) => void
  onCloseThread?: (threadId: string) => void
  onArchiveThread?: (threadId: string) => void
  currentUser?: ThreadParticipant
  layout?: 'inline' | 'sidebar'
  className?: string
}

// Thread configuration
interface ThreadViewConfig {
  maxDepth: number
  showPreview: boolean
  previewLength: number
  collapseThreshold: number
  notificationsEnabled: boolean
}

// Thread data structure
interface Thread {
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

// Thread participant
interface ThreadParticipant {
  id: string
  name: string
  role: 'user' | 'assistant' | 'system'
  avatar?: string
  lastReadAt?: number
}

// ThreadList props
interface ThreadListProps {
  threads: Thread[]
  parentMessages: Map<string, Message>
  config?: Partial<ThreadViewConfig>
  onSelectThread?: (threadId: string) => void
  selectedThreadId?: string
  showArchived?: boolean
  className?: string
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function MessageThreadViewPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  <GitBranch className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Beta
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Complex
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                MessageThreadView
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A Slack-style message threading component for organizing
                conversations into nested discussions. Supports inline and
                sidebar layouts, participant tracking, unread counts, thread
                archiving, and search. Ideal for A/B message testing and
                conversation branching.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: GitBranch,
                  label: 'Branch Visualization',
                  desc: 'Nested threads',
                },
                {
                  icon: Reply,
                  label: 'Navigation',
                  desc: 'Jump between branches',
                },
                {
                  icon: Timer,
                  label: 'History',
                  desc: 'Track all versions',
                },
                {
                  icon: MessageCircle,
                  label: 'Interactive',
                  desc: 'Reply & archive',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>MessageThreadView</code> brings Slack-style threading to
                  your chat interface. Users can create nested discussion
                  threads from any message, keeping conversations organized and
                  focused.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Thread Branching:</strong> Create multiple threads
                    from a single message
                  </li>
                  <li>
                    <strong>Layouts:</strong> Inline (below message) or sidebar
                    (fixed panel)
                  </li>
                  <li>
                    <strong>Thread Preview:</strong> Collapsed preview shows
                    reply count and last message
                  </li>
                  <li>
                    <strong>Participant Tracking:</strong> See who's involved in
                    each thread
                  </li>
                  <li>
                    <strong>Unread Counts:</strong> Badge shows new messages in
                    thread
                  </li>
                  <li>
                    <strong>Thread Search:</strong> Find threads by content
                  </li>
                  <li>
                    <strong>Archiving:</strong> Archive old threads to reduce
                    clutter
                  </li>
                  <li>
                    <strong>Configurable:</strong> Max depth, preview length,
                    collapse threshold
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Team Collaboration:</strong> Multiple people
                    discussing a topic
                  </li>
                  <li>
                    <strong>A/B Testing:</strong> Explore different message
                    variations
                  </li>
                  <li>
                    <strong>Conversation History:</strong> Branch to try
                    different conversation paths
                  </li>
                  <li>
                    <strong>Support Tickets:</strong> Organize related
                    discussions
                  </li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/react"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">Import the components:</p>

                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Try the MessageThreadView component. Toggle between inline and
                sidebar layouts, expand the thread, and send replies.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Add MessageThreadView below any message to enable threading:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatMessage.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="thread-config" title="Thread Configuration">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure thread behavior:
                </p>
                <PropsTable props={threadConfigProps} />
              </SubSection>

              <SubSection id="callback-props" title="Callbacks">
                <p className="text-sm text-muted-foreground mb-4">
                  Handle thread interactions:
                </p>
                <PropsTable props={callbackProps} />
              </SubSection>

              <SubSection id="thread-types" title="Thread Types">
                <p className="text-sm text-muted-foreground mb-4">
                  Thread interface fields:
                </p>
                <PropsTable props={threadTypeProps} />
              </SubSection>

              <SubSection id="thread-list-props" title="ThreadList Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Props for the ThreadList component:
                </p>
                <PropsTable props={threadListProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Thread">
                <p className="text-muted-foreground mb-4">
                  Simple inline thread with preview:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicThread.tsx"
                />
              </SubSection>

              <SubSection id="example-sidebar" title="Sidebar Layout">
                <p className="text-muted-foreground mb-4">
                  Open threads in a fixed sidebar:
                </p>
                <CodeBlock
                  code={sidebarLayoutCode}
                  language="tsx"
                  filename="SidebarThread.tsx"
                />
              </SubSection>

              <SubSection id="example-thread-list" title="Thread List">
                <p className="text-muted-foreground mb-4">
                  Display all threads for navigation:
                </p>
                <CodeBlock
                  code={threadListCode}
                  language="tsx"
                  filename="ThreadList.tsx"
                />
              </SubSection>

              <SubSection id="example-multiple" title="Multiple Branches">
                <p className="text-muted-foreground mb-4">
                  Handle multiple thread branches from one message:
                </p>
                <CodeBlock
                  code={multipleBranchesCode}
                  language="tsx"
                  filename="MultipleBranches.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Use Cases Section */}
            <Section id="use-cases" title="Use Cases">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-brand-500" />
                    A/B Message Testing
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Test different message variations by creating branches.
                    Compare responses and choose the best path forward.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-500" />
                    Team Collaboration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Multiple team members can discuss specific messages without
                    cluttering the main conversation.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Search className="w-5 h-5 text-brand-500" />
                    Conversation Exploration
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Branch conversations to explore "what if" scenarios while
                    keeping the original path intact.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Archive className="w-5 h-5 text-brand-500" />
                    Support Tickets
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Organize customer support conversations with threads for
                    different issues or follow-ups.
                  </p>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'MessageList',
                    type: 'component',
                    description:
                      'List component for rendering messages with threads',
                    href: '/reference/components/message-list',
                  },
                  {
                    name: 'Message',
                    type: 'component',
                    description: 'Individual message component',
                    href: '/reference/components/message',
                  },
                  {
                    name: 'ConversationBranches',
                    type: 'component',
                    description: 'Advanced branching with visualization',
                    href: '/reference/components/conversation-branches',
                  },
                  {
                    name: 'MessageActions',
                    type: 'component',
                    description: 'Action buttons for messages',
                    href: '/reference/components/message-actions',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/components/message-list"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      MessageList
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/conversation-branches"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      ConversationBranches
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
