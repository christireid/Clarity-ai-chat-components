'use client'

/**
 * MessageList Component - API Reference Documentation
 *
 * A mid-level composable message list component with auto-scrolling, animations,
 * message grouping, and virtualization support for large conversations.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  List,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Palette,
  Shield,
  Accessibility,
  Code2,
  Settings,
  MessageSquare,
  Gauge,
  Play,
  Send,
  Wrench,
  AlertTriangle,
  HelpCircle,
  Keyboard,
  ArrowDown,
  Timer,
  Layers,
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
  const [messages, setMessages] = React.useState<
    Array<{
      id: string
      role: 'user' | 'assistant'
      content: string
      createdAt: Date
    }>
  >([
    {
      id: '1',
      role: 'user',
      content: 'Hello! Can you tell me about MessageList?',
      createdAt: new Date(Date.now() - 60000),
    },
    {
      id: '2',
      role: 'assistant',
      content:
        'MessageList is a composable component for rendering chat messages with auto-scrolling, animations, and time separators.',
      createdAt: new Date(Date.now() - 55000),
    },
    {
      id: '3',
      role: 'user',
      content: 'Does it support virtualization?',
      createdAt: new Date(Date.now() - 30000),
    },
    {
      id: '4',
      role: 'assistant',
      content:
        'Yes! For large conversations (100+ messages), use VirtualizedMessageList which uses react-window for efficient rendering.',
      createdAt: new Date(Date.now() - 25000),
    },
  ])
  const [enableGrouping, setEnableGrouping] = React.useState(true)
  const [showTimeSeparators, setShowTimeSeparators] = React.useState(true)
  const [isNearBottom, setIsNearBottom] = React.useState(true)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const addMessage = () => {
    const isUser = messages.length % 2 === 0
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        role: isUser ? 'user' : 'assistant',
        content: isUser
          ? 'This is a new user message added to the list.'
          : 'This is a new assistant response with auto-scroll behavior.',
        createdAt: new Date(),
      },
    ])
    // Auto-scroll to bottom
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  const handleScroll = () => {
    if (!scrollRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    setIsNearBottom(scrollHeight - scrollTop - clientHeight < 100)
  }

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={enableGrouping}
            onChange={(e) => setEnableGrouping(e.target.checked)}
            className="rounded"
          />
          Enable Grouping
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showTimeSeparators}
            onChange={(e) => setShowTimeSeparators(e.target.checked)}
            className="rounded"
          />
          Time Separators
        </label>
        <button
          onClick={addMessage}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          Add Message
        </button>
        <button
          onClick={() => setMessages([])}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Clear
        </button>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">MessageList Demo</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {messages.length} messages
          </span>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="h-72 overflow-y-auto p-4 space-y-3 bg-background/50"
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No messages yet</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const prevMessage = messages[index - 1]
              const showSeparator =
                showTimeSeparators &&
                prevMessage &&
                message.createdAt.getTime() - prevMessage.createdAt.getTime() >
                  60000

              const isGrouped =
                enableGrouping &&
                prevMessage &&
                prevMessage.role === message.role &&
                message.createdAt.getTime() - prevMessage.createdAt.getTime() <
                  60000

              return (
                <React.Fragment key={message.id}>
                  {showSeparator && (
                    <div className="flex items-center gap-3 py-2">
                      <div className="flex-1 border-t border-border/50" />
                      <span className="text-xs text-muted-foreground">
                        {message.createdAt.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <div className="flex-1 border-t border-border/50" />
                    </div>
                  )}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: durations.normal,
                      delay: index * 0.03,
                    }}
                    className={cn(
                      'max-w-[80%] rounded-lg px-4 py-2',
                      message.role === 'user'
                        ? 'ml-auto bg-brand-500 text-white'
                        : 'bg-muted/50 text-foreground',
                      isGrouped && 'mt-1'
                    )}
                  >
                    <p className="text-sm">{message.content}</p>
                  </motion.div>
                </React.Fragment>
              )
            })
          )}
        </div>

        {/* Jump to bottom button */}
        <AnimatePresence>
          {!isNearBottom && messages.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={scrollToBottom}
              className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
              aria-label="Jump to bottom"
            >
              <ArrowDown className="w-5 h-5" />
            </motion.button>
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
      { id: 'message-callbacks', title: 'Message Callbacks' },
      { id: 'display-options', title: 'Display Options' },
      { id: 'accessibility-props', title: 'Accessibility' },
    ],
  },
  { id: 'virtualization', title: 'Virtualization' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-with-actions', title: 'With Actions' },
      { id: 'example-virtualized', title: 'Virtualized' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
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
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to display.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description:
      'Show loading skeleton. When true with messages, shows a skeleton for new message.',
  },
  {
    name: 'loadingCount',
    type: 'number',
    default: '3',
    description:
      'Number of skeleton messages to show when loading with no messages.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description: 'Custom empty state content when no messages.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'id',
    type: 'string',
    description: 'HTML id attribute for skip link targeting.',
  },
  {
    name: 'autoScroll',
    type: 'boolean',
    default: 'true',
    description: 'Enable auto-scroll to bottom on new messages.',
  },
]

const messageCallbackProps: PropDefinition[] = [
  {
    name: 'onMessageCopy',
    type: '(messageId: string, content: string) => void',
    description: 'Callback when a message is copied.',
  },
  {
    name: 'onMessageFeedback',
    type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
    description: 'Callback when message feedback is provided.',
  },
  {
    name: 'onMessageRetry',
    type: '(messageId: string) => void',
    description: 'Callback when retry is requested.',
  },
  {
    name: 'onEditMessage',
    type: '(messageId: string) => void',
    description: 'Callback when message editing starts.',
  },
  {
    name: 'onRegenerateMessage',
    type: '(messageId: string) => void',
    description: 'Callback when regeneration is requested.',
  },
  {
    name: 'onDeleteMessage',
    type: '(messageId: string) => void',
    description: 'Callback when a message is deleted.',
  },
  {
    name: 'onStopGeneration',
    type: '() => void',
    description: 'Callback to stop AI generation during streaming.',
  },
  {
    name: 'editingMessageId',
    type: 'string | null',
    description: 'ID of message currently being edited.',
  },
  {
    name: 'onSaveEdit',
    type: '(messageId: string, newContent: string) => void',
    description: 'Callback when an edit is saved.',
  },
  {
    name: 'onCancelEdit',
    type: '(messageId: string) => void',
    description: 'Callback when an edit is cancelled.',
  },
]

const displayOptionsProps: PropDefinition[] = [
  {
    name: 'enableGrouping',
    type: 'boolean',
    default: 'true',
    description:
      'Enable message grouping for consecutive messages from same sender.',
  },
  {
    name: 'showTimeSeparators',
    type: 'boolean',
    default: 'true',
    description: 'Show time separators between message groups.',
  },
  {
    name: 'announceNewMessages',
    type: 'boolean',
    default: 'true',
    description: 'Announce new messages to screen readers via aria-live.',
  },
]

const accessibilityProps: PropDefinition[] = [
  {
    name: 'role',
    type: "'log' | 'feed' | 'list' | 'region'",
    default: "'log'",
    description: 'ARIA role for the message list container.',
  },
  {
    name: 'aria-label',
    type: 'string',
    description: 'ARIA label for screen readers.',
  },
  {
    name: 'aria-live',
    type: "'polite' | 'assertive' | 'off'",
    default: "'polite'",
    description: 'ARIA live region behavior.',
  },
]

const virtualizedProps: PropDefinition[] = [
  {
    name: 'renderMessage',
    type: '(message: Message, index: number) => ReactNode',
    required: true,
    description: 'Render function for each message.',
  },
  {
    name: 'estimatedItemSize',
    type: 'number',
    default: '150',
    description: 'Estimated height of each message in pixels.',
  },
  {
    name: 'overscanCount',
    type: 'number',
    default: '3',
    description: 'Number of items to render outside the visible area.',
  },
  {
    name: 'autoScrollToBottom',
    type: 'boolean',
    default: 'true',
    description: 'Auto-scroll to bottom when new messages arrive.',
  },
  {
    name: 'maxMessages',
    type: 'number',
    default: '1000',
    description: 'Maximum number of messages to render (windowing).',
  },
  {
    name: 'virtualizationThreshold',
    type: 'number',
    default: '100',
    description:
      'Message count threshold for enabling virtualization (AutoVirtualizedMessageList).',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { MessageList } from '@clarity-chat/react'
import type { MessageListProps } from '@clarity-chat/react'

// For large conversations
import { VirtualizedMessageList, AutoVirtualizedMessageList } from '@clarity-chat/react'`

const basicUsageCode = `import { MessageList } from '@clarity-chat/react'

function ChatMessages({ messages }) {
  return (
    <MessageList
      messages={messages}
      isLoading={isLoading}
      emptyState={
        <div className="text-center text-muted-foreground p-8">
          Start a conversation
        </div>
      }
    />
  )
}`

const withActionsCode = `import { MessageList } from '@clarity-chat/react'

function ChatMessagesWithActions({ messages }) {
  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content)
  }

  const handleFeedback = (id: string, type: 'up' | 'down') => {
    console.log('Feedback:', id, type)
  }

  return (
    <MessageList
      messages={messages}
      onMessageCopy={handleCopy}
      onMessageFeedback={handleFeedback}
      onMessageRetry={(id) => retryMessage(id)}
      onEditMessage={(id) => startEdit(id)}
      onRegenerateMessage={(id) => regenerate(id)}
      onDeleteMessage={(id) => deleteMessage(id)}
      enableGrouping={true}
      showTimeSeparators={true}
      autoScroll={true}
    />
  )
}`

const virtualizedCode = `import { VirtualizedMessageList, AutoVirtualizedMessageList } from '@clarity-chat/react'
import { Message } from '@clarity-chat/react/components/message'

// Option 1: Always virtualized (for guaranteed large lists)
function LargeConversation({ messages }) {
  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={(message, index) => (
        <Message
          message={message}
          onCopy={(content) => handleCopy(message.id, content)}
        />
      )}
      estimatedItemSize={150}
      overscanCount={5}
      autoScrollToBottom={true}
    />
  )
}

// Option 2: Auto-virtualize based on message count (recommended)
function SmartConversation({ messages }) {
  return (
    <AutoVirtualizedMessageList
      messages={messages}
      renderMessage={(message, index) => (
        <Message message={message} />
      )}
      virtualizationThreshold={100} // Virtualize when > 100 messages
    />
  )
}`

const typescriptCode = `// MessageList props
interface MessageListProps {
  messages: Message[]
  onMessageCopy?: (messageId: string, content: string) => void
  onMessageFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  onMessageRetry?: (messageId: string) => void
  onEditMessage?: (messageId: string) => void
  onRegenerateMessage?: (messageId: string) => void
  onDeleteMessage?: (messageId: string) => void
  onStopGeneration?: () => void
  editingMessageId?: string | null
  onSaveEdit?: (messageId: string, newContent: string) => void
  onCancelEdit?: (messageId: string) => void
  isLoading?: boolean
  loadingCount?: number
  emptyState?: ReactNode
  enableGrouping?: boolean
  showTimeSeparators?: boolean
  announceNewMessages?: boolean
  className?: string
  id?: string
  role?: 'log' | 'feed' | 'list' | 'region'
  'aria-label'?: string
  'aria-live'?: 'polite' | 'assertive' | 'off'
  autoScroll?: boolean
}

// VirtualizedMessageList props
interface VirtualizedMessageListProps {
  messages: Message[]
  renderMessage: (message: Message, index: number) => ReactNode
  estimatedItemSize?: number // default: 150
  overscanCount?: number // default: 3
  autoScrollToBottom?: boolean // default: true
  onScroll?: (scrollOffset: number) => void
  className?: string
  threshold?: number
  itemKey?: (index: number, data: Message[]) => string
  maxMessages?: number // default: 1000
}

// Message type
interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status?: 'pending' | 'streaming' | 'complete' | 'error'
  createdAt?: Date | string
  metadata?: Record<string, unknown>
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function MessageListPage() {
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
                <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <List className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Mid-Level
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                MessageList
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A composable message list component with auto-scrolling,
                staggered animations, message grouping, time separators, and
                screen reader announcements. For large conversations (100+
                messages), use VirtualizedMessageList for optimal performance.
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
                  icon: ArrowDown,
                  label: 'Auto-Scroll',
                  desc: 'Smart scrolling',
                },
                {
                  icon: Timer,
                  label: 'Time Groups',
                  desc: 'Message separators',
                },
                { icon: Layers, label: 'Virtualized', desc: '1000+ messages' },
                {
                  icon: Accessibility,
                  label: 'Accessible',
                  desc: 'Screen reader ready',
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
                  <code>MessageList</code> is a mid-level component for
                  rendering chat messages with a polished user experience. It
                  handles scrolling behavior, animations, grouping, and
                  accessibility out of the box.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Auto-Scroll:</strong> Automatically scrolls to
                    bottom on new messages, with smart detection when user has
                    scrolled up
                  </li>
                  <li>
                    <strong>Jump to Bottom:</strong> Shows a floating button
                    with new message count when scrolled away
                  </li>
                  <li>
                    <strong>Message Grouping:</strong> Groups consecutive
                    messages from the same sender for cleaner UI
                  </li>
                  <li>
                    <strong>Time Separators:</strong> Displays time separators
                    between message groups
                  </li>
                  <li>
                    <strong>Staggered Animations:</strong> Messages animate in
                    with staggered delays (respects reduced motion)
                  </li>
                  <li>
                    <strong>Screen Reader:</strong> Announces new messages via
                    aria-live regions
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Virtualization
                </h4>
                <p>
                  For conversations with 100+ messages, use{' '}
                  <code>VirtualizedMessageList</code> which uses react-window
                  for efficient rendering. Only visible messages are in the DOM.
                </p>
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
                Try the MessageList component. Toggle grouping, time separators,
                and add messages to see auto-scroll behavior.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  MessageList accepts an array of messages and renders them with
                  animations:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="ChatMessages.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="message-callbacks" title="Message Callbacks">
                <p className="text-sm text-muted-foreground mb-4">
                  Callbacks for message interactions:
                </p>
                <PropsTable props={messageCallbackProps} />
              </SubSection>

              <SubSection id="display-options" title="Display Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure visual features:
                </p>
                <PropsTable props={displayOptionsProps} />
              </SubSection>

              <SubSection id="accessibility-props" title="Accessibility Props">
                <p className="text-sm text-muted-foreground mb-4">
                  ARIA attributes for screen readers:
                </p>
                <PropsTable props={accessibilityProps} />
              </SubSection>
            </Section>

            {/* Virtualization Section */}
            <Section id="virtualization" title="Virtualization">
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p>
                  For large conversations, <code>VirtualizedMessageList</code>{' '}
                  uses react-window to render only visible messages. This
                  enables smooth scrolling even with 1000+ messages.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use Virtualization
                </h4>
                <ul className="space-y-2">
                  <li>Conversations with 100+ messages</li>
                  <li>Long-running support chats</li>
                  <li>Historical conversation viewing</li>
                  <li>Performance-sensitive applications</li>
                </ul>
              </div>

              <h4 className="text-lg font-semibold mb-4">
                VirtualizedMessageList Props
              </h4>
              <PropsTable props={virtualizedProps} />

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-foreground mb-2">
                  Screen Reader Mode
                </h4>
                <p className="text-sm text-muted-foreground">
                  VirtualizedMessageList automatically detects screen readers
                  and switches to non-virtualized rendering for full
                  accessibility. All messages remain in the DOM for navigation.
                </p>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple message list with loading and empty states:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicMessageList.tsx"
                />
              </SubSection>

              <SubSection id="example-with-actions" title="With Actions">
                <p className="text-muted-foreground mb-4">
                  Full-featured message list with all interaction callbacks:
                </p>
                <CodeBlock
                  code={withActionsCode}
                  language="tsx"
                  filename="MessageListWithActions.tsx"
                />
              </SubSection>

              <SubSection id="example-virtualized" title="Virtualized">
                <p className="text-muted-foreground mb-4">
                  Use virtualization for large conversations:
                </p>
                <CodeBlock
                  code={virtualizedCode}
                  language="tsx"
                  filename="VirtualizedConversation.tsx"
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

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      End
                    </kbd>{' '}
                    - Jump to bottom of messages
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate between messages (virtualized mode)
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Page Up/Down
                    </kbd>{' '}
                    - Jump 10 messages (virtualized mode)
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Home
                    </kbd>{' '}
                    - Jump to first message (virtualized mode)
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    Uses <code>role="log"</code> for chat-appropriate semantics
                  </li>
                  <li>
                    Announces new messages via <code>aria-live="polite"</code>
                  </li>
                  <li>
                    Shows <code>aria-busy</code> during streaming
                  </li>
                  <li>
                    Each message has <code>aria-posinset</code> and{' '}
                    <code>aria-setsize</code>
                  </li>
                  <li>Virtualization disabled when screen reader detected</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  Respects <code>prefers-reduced-motion</code>. When enabled,
                  animations use opacity-only transitions instead of slide
                  effects.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Messages not scrolling
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ensure the container has a defined height</li>
                        <li>
                          Check <code>autoScroll</code> is enabled (default:
                          true)
                        </li>
                        <li>
                          Verify <code>flex-1 min-h-0</code> on parent
                          containers
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Virtualization performance issues
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Set accurate <code>estimatedItemSize</code> for your
                          messages
                        </li>
                        <li>
                          Increase <code>overscanCount</code> for smoother
                          scrolling
                        </li>
                        <li>
                          Ensure <code>renderMessage</code> is memoized
                        </li>
                        <li>Use unique, stable keys for messages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Complete chat UI with input and MessageList',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'StreamingMessage',
                    type: 'component',
                    description: 'Message component with streaming animation',
                    href: '/reference/components/streaming-message',
                  },
                  {
                    name: 'Message',
                    type: 'component',
                    description: 'Individual message bubble component',
                    href: '/reference/components/message',
                  },
                  {
                    name: 'useAutoScroll',
                    type: 'hook',
                    description: 'Hook for auto-scroll behavior',
                    href: '/reference/hooks/use-auto-scroll',
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
                  href="/reference/components/chat-window"
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
                      ChatWindow
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/streaming-message"
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
                      StreamingMessage
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
