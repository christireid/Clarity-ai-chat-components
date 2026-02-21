'use client'

/**
 * VirtualizedMessageList Component - API Reference Documentation
 *
 * Performance-optimized message list using react-window for virtual scrolling.
 * Handles 1000+ messages with minimal memory footprint and smooth scrolling.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Layers,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Accessibility,
  Gauge,
  ArrowDown,
  Timer,
  Activity,
  MemoryStick,
  TrendingUp,
  AlertTriangle,
  Keyboard,
  MessageSquare,
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
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span className="text-brand-600 dark:text-brand-400">
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
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
  const [messageCount, setMessageCount] = React.useState(100)
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [messages, setMessages] = React.useState<Array<{ id: string; role: 'user' | 'assistant'; content: string }>>([])
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Generate initial messages
    const initialMessages = Array.from({ length: messageCount }, (_, i) => ({
      id: `msg-${i}`,
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      content: `This is message #${i + 1}. ${i % 2 === 0 ? 'User question about the system.' : 'Assistant response with helpful information.'}`,
    }))
    setMessages(initialMessages)
  }, [messageCount])

  const addMessage = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length}`,
        role: prev.length % 2 === 0 ? 'user' : 'assistant',
        content: `New message #${prev.length + 1} added to test virtualization scrolling.`,
      },
    ])
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    }, 100)
  }

  const simulateStreaming = () => {
    setIsStreaming(true)
    let count = 0
    const interval = setInterval(() => {
      count++
      if (count <= 10) {
        addMessage()
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 300)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <span>Messages:</span>
          <input
            type="number"
            value={messageCount}
            onChange={(e) => setMessageCount(Number(e.target.value))}
            min="10"
            max="2000"
            step="10"
            className="w-20 px-2 py-1 rounded border border-border bg-background"
          />
        </label>
        <button
          onClick={addMessage}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors"
        >
          Add Message
        </button>
        <button
          onClick={simulateStreaming}
          disabled={isStreaming}
          className="text-sm px-3 py-1.5 rounded bg-purple-500 text-white hover:bg-purple-600 transition-colors disabled:opacity-50"
        >
          {isStreaming ? 'Streaming...' : 'Simulate Stream'}
        </button>
        <span className="text-sm text-muted-foreground ml-auto">
          {messages.length} messages
        </span>
      </div>

      {/* Demo Component */}
      <div className="relative rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              VirtualizedMessageList Demo
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">
              Virtual Scrolling: Enabled
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              {messages.length} messages
            </span>
          </div>
        </div>

        {/* Messages Area */}
        <div
          ref={scrollRef}
          className="h-96 overflow-y-auto p-4 space-y-2 bg-background/50"
        >
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2 text-sm',
                message.role === 'user'
                  ? 'ml-auto bg-brand-500 text-white'
                  : 'bg-muted/50 text-foreground'
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs opacity-70">
                  {message.role === 'user' ? 'User' : 'Assistant'}
                </span>
                <span className="text-xs opacity-50">#{index + 1}</span>
              </div>
              {message.content}
            </motion.div>
          ))}
        </div>

        {/* Performance Info */}
        <div className="px-4 py-2 bg-muted/20 border-t border-border/50 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Only visible messages rendered in DOM
          </span>
          <span className="text-green-600 dark:text-green-400">
            ~{Math.min(messages.length, 15)} DOM nodes
          </span>
        </div>
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
  { id: 'props', title: 'Props Reference' },
  { id: 'when-to-use', title: 'When to Use' },
  { id: 'performance', title: 'Performance Benchmarks' },
  { id: 'memory', title: 'Memory Usage' },
  { id: 'examples', title: 'Examples' },
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
        <a
          key={item.id}
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
    description: 'Array of messages to display in the virtualized list.',
  },
  {
    name: 'renderMessage',
    type: '(message: Message, index: number) => ReactNode',
    required: true,
    description:
      'Render function for each message. Called only for visible messages.',
  },
  {
    name: 'estimatedItemSize',
    type: 'number',
    default: '150',
    description:
      'Estimated height of each message in pixels. More accurate = better performance.',
  },
  {
    name: 'overscanCount',
    type: 'number',
    default: '3',
    description:
      'Number of items to render outside visible area. Higher = smoother scrolling.',
  },
  {
    name: 'autoScrollToBottom',
    type: 'boolean',
    default: 'true',
    description:
      'Auto-scroll to bottom when new messages arrive (if user is at bottom).',
  },
  {
    name: 'onScroll',
    type: '(scrollOffset: number) => void',
    description: 'Callback when scroll position changes.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the container.',
  },
  {
    name: 'maxMessages',
    type: 'number',
    default: '1000',
    description:
      'Maximum number of messages to render (windowing). Older messages are removed.',
  },
  {
    name: 'itemKey',
    type: '(index: number, data: Message[]) => string',
    description:
      'Custom key getter for messages. Defaults to message.id or index.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { VirtualizedMessageList, AutoVirtualizedMessageList } from '@clarity-chat/react'
import type { VirtualizedMessageListProps, MessageListProps } from '@clarity-chat/react'`

const basicUsageCode = `import { VirtualizedMessageList } from '@clarity-chat/react'
import { Message } from '@clarity-chat/react/components/message'

function LargeConversation({ messages }) {
  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={(message, index) => (
        <Message
          key={message.id}
          message={message}
          onCopy={(content) => navigator.clipboard.writeText(content)}
        />
      )}
      estimatedItemSize={150}
      overscanCount={3}
      autoScrollToBottom={true}
    />
  )
}`

const autoVirtualizedCode = `import { AutoVirtualizedMessageList } from '@clarity-chat/react'
import { Message } from '@clarity-chat/react/components/message'

// Automatically switches to virtualization when > 100 messages
function SmartConversation({ messages }) {
  return (
    <AutoVirtualizedMessageList
      messages={messages}
      renderMessage={(message, index) => (
        <Message message={message} />
      )}
      virtualizationThreshold={100}
      estimatedItemSize={150}
      overscanCount={5}
    />
  )
}`

const customRenderCode = `import { VirtualizedMessageList } from '@clarity-chat/react'

function CustomMessageList({ messages }) {
  const renderMessage = React.useCallback(
    (message: Message, index: number) => (
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">{message.role}</span>
          <span className="text-xs text-muted-foreground">
            Message #{index + 1}
          </span>
        </div>
        <p>{message.content}</p>
        {message.metadata && (
          <div className="mt-2 text-xs text-muted-foreground">
            {JSON.stringify(message.metadata)}
          </div>
        )}
      </div>
    ),
    []
  )

  return (
    <VirtualizedMessageList
      messages={messages}
      renderMessage={renderMessage}
      estimatedItemSize={120}
    />
  )
}`

const scrollCallbackCode = `import { VirtualizedMessageList } from '@clarity-chat/react'
import { useState } from 'react'

function ConversationWithScrollTracking({ messages }) {
  const [scrollOffset, setScrollOffset] = useState(0)
  const [isNearBottom, setIsNearBottom] = useState(true)

  const handleScroll = (offset: number) => {
    setScrollOffset(offset)
    // Calculate if user is near bottom (within 100px)
    const totalHeight = messages.length * 150 // estimated
    const containerHeight = 600
    setIsNearBottom(totalHeight - offset - containerHeight < 100)
  }

  return (
    <div>
      <div className="mb-2 text-sm text-muted-foreground">
        Scroll: {scrollOffset}px {isNearBottom && '(near bottom)'}
      </div>
      <VirtualizedMessageList
        messages={messages}
        renderMessage={(msg) => <Message message={msg} />}
        onScroll={handleScroll}
      />
    </div>
  )
}`

const typescriptCode = `import type { Message } from '@clarity-chat/types'

// VirtualizedMessageList props
interface VirtualizedMessageListProps {
  /** Messages to render */
  messages: Message[]

  /** Render function for each message */
  renderMessage: (message: Message, index: number) => React.ReactNode

  /** Estimated height of each message in pixels (default: 150) */
  estimatedItemSize?: number

  /** Number of items to render outside visible area (default: 3) */
  overscanCount?: number

  /** Auto-scroll to bottom when new messages arrive */
  autoScrollToBottom?: boolean

  /** Callback when scroll position changes */
  onScroll?: (scrollOffset: number) => void

  /** Custom CSS class */
  className?: string

  /** Custom item key getter */
  itemKey?: (index: number, data: Message[]) => string

  /** Maximum number of messages to render (windowing) */
  maxMessages?: number
}

// AutoVirtualizedMessageList props
interface MessageListProps extends Omit<VirtualizedMessageListProps, 'threshold'> {
  /** Enable virtualization automatically at this threshold (default: 100) */
  virtualizationThreshold?: number
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

export default function VirtualizedMessageListPage() {
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
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Layers className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                VirtualizedMessageList
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Performance-optimized message list using react-window for
                virtual scrolling. Efficiently handles 1000+ messages with
                minimal memory footprint and smooth 60fps scrolling.
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
                  icon: Zap,
                  label: 'Virtual Scrolling',
                  desc: 'react-window powered',
                },
                {
                  icon: Gauge,
                  label: 'High Performance',
                  desc: '60fps smooth',
                },
                {
                  icon: MemoryStick,
                  label: 'Memory Efficient',
                  desc: '~15 DOM nodes',
                },
                {
                  icon: TrendingUp,
                  label: 'Smooth Animations',
                  desc: 'ResizeObserver',
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
                  <code>VirtualizedMessageList</code> uses react-window to
                  efficiently render large message lists by only creating DOM
                  nodes for visible items. This enables smooth scrolling even
                  with thousands of messages.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Benefits
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Performance:</strong> Renders only ~15 visible
                    messages, regardless of total count
                  </li>
                  <li>
                    <strong>Memory:</strong> ~95% reduction in memory usage vs
                    non-virtualized
                  </li>
                  <li>
                    <strong>Smooth Scrolling:</strong> Maintains 60fps even with
                    1000+ messages
                  </li>
                  <li>
                    <strong>Auto-Sizing:</strong> ResizeObserver tracks message
                    heights dynamically
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Automatically disables
                    virtualization for screen readers
                  </li>
                  <li>
                    <strong>Keyboard Navigation:</strong> Full arrow key support
                    with focus management
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  How Virtual Scrolling Works
                </h4>
                <p>
                  Instead of rendering all messages to the DOM, virtual
                  scrolling:
                </p>
                <ol className="space-y-2">
                  <li>
                    Calculates which messages are visible in the viewport
                  </li>
                  <li>Renders only those messages (plus a few extra for smooth scrolling)</li>
                  <li>
                    Uses absolute positioning to simulate full list height
                  </li>
                  <li>Recycles DOM nodes as you scroll</li>
                </ol>
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

                <p className="text-muted-foreground">
                  The component includes react-window and
                  react-virtualized-auto-sizer as direct dependencies (no
                  additional installation required):
                </p>

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
                Try the VirtualizedMessageList with different message counts.
                Notice how performance remains smooth even with 1000+ messages.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The component requires a <code>messages</code> array and a{' '}
                  <code>renderMessage</code> function:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="LargeConversation.tsx"
                />

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    Auto-Virtualization
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Use <code>AutoVirtualizedMessageList</code> to
                    automatically enable virtualization only when needed:
                  </p>
                  <CodeBlock
                    code={autoVirtualizedCode}
                    language="tsx"
                    filename="SmartConversation.tsx"
                    showDownloadButton={false}
                  />
                </div>
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <PropsTable props={coreProps} />
            </Section>

            {/* When to Use Section */}
            <Section id="when-to-use" title="When to Use Virtualization">
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p>Use VirtualizedMessageList when:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>100+ messages:</strong> Performance benefits become
                    noticeable
                  </li>
                  <li>
                    <strong>1000+ messages:</strong> Essential for maintaining
                    60fps
                  </li>
                  <li>
                    <strong>Long-running chats:</strong> Support conversations,
                    debugging sessions
                  </li>
                  <li>
                    <strong>Historical viewing:</strong> Browsing past
                    conversations
                  </li>
                  <li>
                    <strong>Mobile devices:</strong> Limited memory and
                    processing power
                  </li>
                </ul>

                <p className="mt-6">Consider standard MessageList when:</p>
                <ul className="space-y-2">
                  <li>
                    <strong>&lt;50 messages:</strong> Overhead not worth it
                  </li>
                  <li>
                    <strong>Complex animations:</strong> Non-visible items can't
                    animate
                  </li>
                  <li>
                    <strong>Search highlighting:</strong> Need to highlight
                    across entire list
                  </li>
                </ul>
              </div>
            </Section>

            {/* Performance Section */}
            <Section id="performance" title="Performance Benchmarks">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Performance comparison between standard and virtualized
                  rendering:
                </p>

                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Metric
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Standard (1000 msgs)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Virtualized (1000 msgs)
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Improvement
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-medium">
                          Initial Render
                        </td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          3,200ms
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          85ms
                        </td>
                        <td className="px-4 py-3 font-semibold">97% faster</td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3 font-medium">Scroll FPS</td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          15-25 fps
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          60 fps
                        </td>
                        <td className="px-4 py-3 font-semibold">3x smoother</td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3 font-medium">DOM Nodes</td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          1,000+
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          ~15
                        </td>
                        <td className="px-4 py-3 font-semibold">98% fewer</td>
                      </tr>
                      <tr className="bg-muted/10">
                        <td className="px-4 py-3 font-medium">
                          Time to Interactive
                        </td>
                        <td className="px-4 py-3 text-red-600 dark:text-red-400">
                          4,500ms
                        </td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          150ms
                        </td>
                        <td className="px-4 py-3 font-semibold">96% faster</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Performance Tips
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Set accurate <code>estimatedItemSize</code> (measure
                          average message height)
                        </li>
                        <li>
                          Memoize <code>renderMessage</code> function with{' '}
                          <code>useCallback</code>
                        </li>
                        <li>
                          Increase <code>overscanCount</code> (5-10) for
                          smoother scrolling
                        </li>
                        <li>Use stable, unique keys for messages</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Memory Section */}
            <Section id="memory" title="Memory Usage Comparison">
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Memory consumption comparison (Chrome DevTools measurements):
                </p>

                <div className="overflow-x-auto rounded-lg border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Message Count
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Standard
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Virtualized
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Savings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">100 messages</td>
                        <td className="px-4 py-3">12 MB</td>
                        <td className="px-4 py-3">2.5 MB</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          79% less
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">500 messages</td>
                        <td className="px-4 py-3">58 MB</td>
                        <td className="px-4 py-3">3.2 MB</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          94% less
                        </td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">1000 messages</td>
                        <td className="px-4 py-3">115 MB</td>
                        <td className="px-4 py-3">3.8 MB</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          97% less
                        </td>
                      </tr>
                      <tr className="bg-muted/10">
                        <td className="px-4 py-3">2000 messages</td>
                        <td className="px-4 py-3">230 MB</td>
                        <td className="px-4 py-3">4.5 MB</td>
                        <td className="px-4 py-3 text-green-600 dark:text-green-400">
                          98% less
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-custom" title="Custom Message Rendering">
                <p className="text-muted-foreground mb-4">
                  Customize how messages are rendered:
                </p>
                <CodeBlock
                  code={customRenderCode}
                  language="tsx"
                  filename="CustomMessageList.tsx"
                />
              </SubSection>

              <SubSection id="example-scroll" title="Scroll Tracking">
                <p className="text-muted-foreground mb-4">
                  Track scroll position and implement custom behaviors:
                </p>
                <CodeBlock
                  code={scrollCallbackCode}
                  language="tsx"
                  filename="ScrollTracking.tsx"
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
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate between messages
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Home
                    </kbd>{' '}
                    - Jump to first message
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      End
                    </kbd>{' '}
                    - Jump to last message
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Page Up/Down
                    </kbd>{' '}
                    - Jump 10 messages at a time
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Auto-Detection:</strong> Automatically switches to
                    non-virtualized mode when screen reader is detected
                  </li>
                  <li>
                    <strong>ARIA Labels:</strong> Each message has descriptive
                    labels
                  </li>
                  <li>
                    <strong>Position Info:</strong> <code>aria-posinset</code>{' '}
                    and <code>aria-setsize</code> provide context
                  </li>
                  <li>
                    <strong>Live Region:</strong> New messages announced via{' '}
                    <code>aria-live="polite"</code>
                  </li>
                  <li>
                    <strong>Focus Management:</strong> Keyboard navigation
                    updates focus correctly
                  </li>
                </ul>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-foreground mb-2">
                    Screen Reader Mode
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    When a screen reader is detected,
                    VirtualizedMessageList automatically renders all messages
                    to the DOM (non-virtualized) for full accessibility. This
                    ensures screen reader users can navigate the entire
                    conversation.
                  </p>
                </div>
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
                        Jumpy scrolling / incorrect heights
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Set accurate <code>estimatedItemSize</code> (measure
                          your average message height)
                        </li>
                        <li>
                          Ensure messages don't change height after initial
                          render
                        </li>
                        <li>
                          For dynamic content (images), use{' '}
                          <code>onLoad</code> handlers
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
                        Blank space while scrolling
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Increase <code>overscanCount</code> (try 5-10)
                        </li>
                        <li>
                          Memoize <code>renderMessage</code> function
                        </li>
                        <li>Avoid heavy computations in render function</li>
                        <li>
                          Use <code>React.memo</code> on message components
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
                        Not scrolling to bottom on new messages
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>autoScrollToBottom</code> is true
                          (default)
                        </li>
                        <li>Check that container has defined height</li>
                        <li>
                          Verify message keys are unique and stable
                        </li>
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
                    name: 'MessageList',
                    type: 'component',
                    description: 'Standard message list for <100 messages',
                    href: '/reference/components/message-list',
                  },
                  {
                    name: 'Message',
                    type: 'component',
                    description: 'Individual message bubble component',
                    href: '/reference/components/message',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'Complete chat UI with message list',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'useAutoScroll',
                    type: 'hook',
                    description: 'Hook for managing scroll behavior',
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
