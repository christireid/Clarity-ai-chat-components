'use client'

/**
 * ClarityChat Component - API Reference Documentation
 *
 * The main drop-in component for adding AI chat to any React application.
 * This is the recommended entry point for most use cases.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Box,
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
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user' as const,
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate streaming response
    const responses = [
      'Hello! I am a demo of the ClarityChat component.',
      'This interactive preview shows how the component handles messages, streaming, and user interactions.',
      'In a real application, this would connect to your API endpoint configured via the `api` prop.',
    ]

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant' as const,
      content: '',
    }
    setMessages((prev) => [...prev, assistantMessage])

    // Simulate character-by-character streaming
    const fullResponse = responses[messages.length % responses.length]
    for (let i = 0; i <= fullResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20))
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessage.id
            ? { ...msg, content: fullResponse.slice(0, i) }
            : msg
        )
      )
    }

    setIsLoading(false)
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
      {/* Header */}
      <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="text-xs font-medium text-muted-foreground">
          Live Preview
        </span>
        <Play className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
      </div>

      {/* Messages Area */}
      <div className="h-64 overflow-y-auto p-4 space-y-4 bg-background/50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">Send a message to see the demo in action</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2',
                message.role === 'user'
                  ? 'ml-auto bg-brand-500 text-white'
                  : 'bg-muted/50 text-foreground'
              )}
            >
              <p className="text-sm">{message.content}</p>
              {message.role === 'assistant' &&
                isLoading &&
                message.content.length > 0 && (
                  <span className="inline-block w-1 h-4 bg-current animate-pulse ml-0.5" />
                )}
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.content === '' && (
          <div className="bg-muted/50 rounded-lg px-4 py-2 max-w-[80%]">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border/50 bg-muted/10"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className={cn(
              'flex-1 px-4 py-2 rounded-lg border border-border/50',
              'bg-background text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500',
              'disabled:opacity-50'
            )}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={cn(
              'px-4 py-2 rounded-lg bg-brand-500 text-white font-medium',
              'hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-colors'
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
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
      { id: 'header-props', title: 'Header Props' },
      { id: 'message-actions-props', title: 'Message Actions Props' },
      { id: 'prompts-props', title: 'Prompts Props' },
      { id: 'rate-limiting-props', title: 'Rate Limiting Props' },
      { id: 'memory-props', title: 'Memory Props' },
      { id: 'legacy-props', title: 'Legacy Props' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Chat' },
      { id: 'example-custom-styling', title: 'Custom Styling' },
      { id: 'example-streaming', title: 'With Streaming' },
      { id: 'example-memory', title: 'With Memory' },
      { id: 'example-tools', title: 'With Tools' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'styling', title: 'Theming & Customization' },
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
    name: 'api',
    type: 'string',
    required: true,
    description:
      'API endpoint URL for chat completions. This is the only required prop.',
  },
  {
    name: 'chatId',
    type: 'string',
    description: 'Optional chat ID for persistence across sessions.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the chat container.',
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    description:
      'Custom empty state component shown when there are no messages.',
  },
  {
    name: 'header',
    type: 'ClarityChatHeaderProps',
    description: 'Header configuration object (recommended grouped API).',
  },
  {
    name: 'messageActions',
    type: 'ClarityChatMessageActionsProps',
    description: 'Message action callbacks configuration object.',
  },
  {
    name: 'prompts',
    type: 'ClarityChatPromptsProps',
    description: 'Prompt suggestions configuration object.',
  },
  {
    name: 'rateLimiting',
    type: 'ClarityChatRateLimitingProps',
    description: 'Rate limiting and request queuing configuration.',
  },
  {
    name: 'memory',
    type: 'ClarityMemoryOptions',
    description: 'Memory configuration for conversation context persistence.',
  },
  {
    name: 'transport',
    type: "'sse' | 'websocket'",
    default: "'sse'",
    description: 'Transport protocol for streaming responses.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    default: '[]',
    description: 'Initial messages to populate the chat.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body data to send with each request.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom headers to include in requests.',
  },
  {
    name: 'maxSteps',
    type: 'number',
    description: 'Maximum number of steps for agentic workflows with tools.',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void',
    description: 'Callback when a response stream finishes.',
  },
  {
    name: 'onError',
    type: '(error: Error, errorInfo?: React.ErrorInfo) => void',
    description: 'Error handler callback with error info.',
  },
]

const headerProps: PropDefinition[] = [
  {
    name: 'show',
    type: 'boolean',
    default: 'false',
    description: 'Show the header with session info.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Session title displayed in the header.',
  },
  {
    name: 'subtitle',
    type: 'string',
    description: 'Session subtitle displayed below the title.',
  },
  {
    name: 'actions',
    type: 'React.ReactNode',
    description: 'Custom actions to render in the header.',
  },
  {
    name: 'showMessageCount',
    type: 'boolean',
    default: 'false',
    description: 'Show a badge with the current message count.',
  },
]

const messageActionsProps: PropDefinition[] = [
  {
    name: 'onCopy',
    type: '(id: string, content: string) => void',
    description: 'Callback when a message is copied.',
  },
  {
    name: 'onFeedback',
    type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
    description: 'Callback when message feedback is provided.',
  },
  {
    name: 'onEdit',
    type: '(messageId: string) => void',
    description: 'Callback when a message edit is initiated.',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description: 'Callback when a message regeneration is requested.',
  },
  {
    name: 'onDelete',
    type: '(messageId: string) => void',
    description: 'Callback when a message is deleted.',
  },
]

const promptsProps: PropDefinition[] = [
  {
    name: 'starterPrompts',
    type: 'Array<{ text: string; category?: string }>',
    description: 'Starter prompts shown when the chat is empty.',
  },
  {
    name: 'enableSuggestions',
    type: 'boolean',
    description: 'Enable prompt suggestions feature.',
  },
  {
    name: 'maxSuggestions',
    type: 'number',
    description: 'Maximum number of suggestions to display.',
  },
]

const rateLimitingProps: PropDefinition[] = [
  {
    name: 'enable',
    type: 'boolean',
    default: 'false',
    description: 'Enable rate limiting and request queuing.',
  },
  {
    name: 'maxConcurrentRequests',
    type: 'number',
    default: '3',
    description: 'Maximum number of concurrent requests.',
  },
  {
    name: 'maxQueueSize',
    type: 'number',
    default: '10',
    description: 'Maximum size of the request queue.',
  },
  {
    name: 'showQueueStatus',
    type: 'boolean',
    default: 'false',
    description: 'Show the request queue status indicator.',
  },
  {
    name: 'compactQueueStatus',
    type: 'boolean',
    default: 'false',
    description: 'Use compact queue status display.',
  },
  {
    name: 'onRequestQueued',
    type: '(position: number, estimatedWaitMs: number) => void',
    description: 'Callback when a request is queued.',
  },
  {
    name: 'onRateLimited',
    type: '(resetAt: number) => void',
    description: 'Callback when rate limit is hit.',
  },
  {
    name: 'onQueueFull',
    type: '() => void',
    description: 'Callback when the queue is full.',
  },
]

const memoryProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'false',
    description: 'Enable memory integration.',
  },
  {
    name: 'autoCapture',
    type: 'boolean',
    default: 'false',
    description:
      'Automatically capture messages to memory. Has privacy implications.',
  },
  {
    name: 'requireConsent',
    type: 'boolean',
    default: 'true',
    description: 'Require user consent before capturing messages.',
  },
  {
    name: 'onConsentRequired',
    type: '() => Promise<boolean> | boolean',
    description:
      'Callback invoked before first memory capture to request consent.',
  },
  {
    name: 'strategy',
    type: "'sliding-window' | 'semantic-chunks' | 'vector-store'",
    description: 'Memory strategy for context management.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for memory context.',
  },
  {
    name: 'retryOnError',
    type: 'boolean',
    default: 'true',
    description: 'Retry failed memory operations.',
  },
  {
    name: 'maxRetryAttempts',
    type: 'number',
    default: '2',
    description: 'Maximum retry attempts for memory operations.',
  },
  {
    name: 'onMemoryError',
    type: "(error: Error, operation: 'query' | 'store') => void",
    description: 'Callback when a memory operation fails.',
  },
]

const legacyProps: PropDefinition[] = [
  {
    name: 'showHeader',
    type: 'boolean',
    deprecated: true,
    deprecatedMessage: 'Use header.show instead',
    description: 'Show header with session info.',
  },
  {
    name: 'sessionTitle',
    type: 'string',
    deprecated: true,
    deprecatedMessage: 'Use header.title instead',
    description: 'Session title.',
  },
  {
    name: 'sessionSubtitle',
    type: 'string',
    deprecated: true,
    deprecatedMessage: 'Use header.subtitle instead',
    description: 'Session subtitle.',
  },
  {
    name: 'headerActions',
    type: 'React.ReactNode',
    deprecated: true,
    deprecatedMessage: 'Use header.actions instead',
    description: 'Header actions.',
  },
  {
    name: 'showMessageCount',
    type: 'boolean',
    deprecated: true,
    deprecatedMessage: 'Use header.showMessageCount instead',
    description: 'Show message count badge.',
  },
  {
    name: 'onMessageCopy',
    type: '(id: string, content: string) => void',
    deprecated: true,
    deprecatedMessage: 'Use messageActions.onCopy instead',
    description: 'Copy callback.',
  },
  {
    name: 'onMessageFeedback',
    type: 'function',
    deprecated: true,
    deprecatedMessage: 'Use messageActions.onFeedback instead',
    description: 'Feedback callback.',
  },
  {
    name: 'onEditMessage',
    type: 'function',
    deprecated: true,
    deprecatedMessage: 'Use messageActions.onEdit instead',
    description: 'Edit callback.',
  },
  {
    name: 'onRegenerateMessage',
    type: 'function',
    deprecated: true,
    deprecatedMessage: 'Use messageActions.onRegenerate instead',
    description: 'Regenerate callback.',
  },
  {
    name: 'onDeleteMessage',
    type: 'function',
    deprecated: true,
    deprecatedMessage: 'Use messageActions.onDelete instead',
    description: 'Delete callback.',
  },
  {
    name: 'enableRateLimiting',
    type: 'boolean',
    deprecated: true,
    deprecatedMessage: 'Use rateLimiting.enable instead',
    description: 'Enable rate limiting.',
  },
  {
    name: 'autoScroll',
    type: 'boolean',
    description: 'Auto-scroll to bottom on new messages.',
  },
  {
    name: 'theme',
    type: 'string',
    description: 'Theme identifier for the chat interface.',
  },
  {
    name: 'showTokenCounter',
    type: 'boolean',
    description: 'Show token counter in input.',
  },
  {
    name: 'showNetworkStatus',
    type: 'boolean',
    description: 'Show network status indicator.',
  },
  {
    name: 'enableMessageOperations',
    type: 'boolean',
    description: 'Enable message operations (edit, delete, branch).',
  },
  {
    name: 'memoryStrategy',
    type: "'sliding-window' | 'semantic-chunks' | 'vector-store'",
    description: 'Memory strategy for conversation context.',
  },
  {
    name: 'onExport',
    type: '() => void',
    description: 'Callback for export functionality.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Callback for clear chat functionality.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ClarityChat } from '@clarity-chat/react'
import type { ClarityChatProps } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`

const customStylingCode = `import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      className="h-[600px] rounded-xl border shadow-lg"
      header={{
        show: true,
        title: 'AI Assistant',
        subtitle: 'Ask me anything',
        showMessageCount: true,
        actions: (
          <button className="p-2 hover:bg-muted rounded">
            <Settings className="w-4 h-4" />
          </button>
        ),
      }}
      emptyState={
        <div className="flex flex-col items-center justify-center h-full">
          <MessageSquare className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="text-muted-foreground">
            Ask me anything about our products.
          </p>
        </div>
      }
    />
  )
}`

const streamingCode = `import { ClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  return (
    <ClarityChat
      api="/api/chat"
      stream={true}
      transport="sse" // or "websocket" for real-time
      onFinish={(message) => {
        console.log('Stream complete:', message.id)
        // Track completion, update analytics, etc.
      }}
      onError={(error) => {
        console.error('Stream error:', error)
        // Handle error gracefully
      }}
    />
  )
}

// For WebSocket transport with auto-reconnect
function WebSocketChat() {
  return (
    <ClarityChat
      api="wss://api.example.com/chat"
      transport="websocket"
      websocket={{
        autoReconnect: true,
        maxReconnectAttempts: 5,
        enableHeartbeat: true,
      }}
    />
  )
}`

const withMemoryCode = `import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

// Memory requires the MemoryProvider wrapper
function App() {
  return (
    <MemoryProvider>
      <ChatWithMemory />
    </MemoryProvider>
  )
}

function ChatWithMemory() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'vector-store', // Best for semantic search
        autoCapture: true,
        requireConsent: true,
        onConsentRequired: async () => {
          // Show consent dialog and return user's choice
          return await showConsentDialog()
        },
        maxTokens: 4000,
        retryOnError: true,
        maxRetryAttempts: 3,
        onMemoryError: (error, operation) => {
          console.error(\`Memory \${operation} failed:\`, error)
          // Optionally show user feedback
        },
      }}
    />
  )
}`

const withToolsCode = `import { ClarityChat } from '@clarity-chat/react'

// Define your tools on the backend, ClarityChat handles the UI
function ChatWithTools() {
  return (
    <ClarityChat
      api="/api/chat"
      maxSteps={5} // Allow up to 5 tool call iterations
      body={{
        // Pass additional context to your API
        tools: ['web_search', 'calculator', 'code_interpreter'],
      }}
      header={{
        show: true,
        title: 'AI Agent',
        subtitle: 'I can search the web and run code',
      }}
      onFinish={(message) => {
        // message.toolInvocations contains tool call results
        if (message.toolInvocations) {
          console.log('Tools used:', message.toolInvocations)
        }
      }}
    />
  )
}

// Backend API handler example (Next.js App Router)
// app/api/chat/route.ts
import { openai } from '@ai-sdk/openai'
import { streamText, tool } from 'ai'
import { z } from 'zod'

export async function POST(req: Request) {
  const { messages, tools } = await req.json()

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    tools: {
      web_search: tool({
        description: 'Search the web for information',
        parameters: z.object({
          query: z.string().describe('Search query'),
        }),
        execute: async ({ query }) => {
          // Implement web search
          return { results: ['Result 1', 'Result 2'] }
        },
      }),
      calculator: tool({
        description: 'Perform calculations',
        parameters: z.object({
          expression: z.string().describe('Math expression'),
        }),
        execute: async ({ expression }) => {
          return { result: eval(expression) }
        },
      }),
    },
    maxSteps: 5,
  })

  return result.toDataStreamResponse()
}`

const typescriptCode = `// Main component props
interface ClarityChatProps extends Omit<UseClarityChatOptions, 'api'> {
  /** API endpoint URL - the only required prop */
  api: string
  /** Optional chat ID for persistence */
  chatId?: string
  /** Optional className for the chat container */
  className?: string
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Header configuration */
  header?: ClarityChatHeaderProps
  /** Message action callbacks */
  messageActions?: ClarityChatMessageActionsProps
  /** Prompt configuration */
  prompts?: ClarityChatPromptsProps
  /** Rate limiting configuration */
  rateLimiting?: ClarityChatRateLimitingProps
}

// Header configuration
interface ClarityChatHeaderProps {
  show?: boolean
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  showMessageCount?: boolean
}

// Message action callbacks
interface ClarityChatMessageActionsProps {
  onCopy?: (id: string, content: string) => void
  onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
}

// Prompts configuration
interface ClarityChatPromptsProps {
  starterPrompts?: Array<{ text: string; category?: string }>
  enableSuggestions?: boolean
  maxSuggestions?: number
}

// Rate limiting configuration
interface ClarityChatRateLimitingProps {
  enable?: boolean
  maxConcurrentRequests?: number
  maxQueueSize?: number
  showQueueStatus?: boolean
  compactQueueStatus?: boolean
  onRequestQueued?: (position: number, estimatedWaitMs: number) => void
  onRateLimited?: (resetAt: number) => void
  onQueueFull?: () => void
}

// Memory configuration (from UseClarityChatOptions)
interface ClarityMemoryOptions {
  enabled?: boolean
  autoCapture?: boolean
  requireConsent?: boolean
  onConsentRequired?: () => Promise<boolean> | boolean
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens?: number
  retryOnError?: boolean
  maxRetryAttempts?: number
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}

// Core message type
interface CoreMessage {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: string | CoreMessageContent[]
  name?: string
  toolCallId?: string
  toolInvocations?: ToolInvocation[]
}

interface ToolInvocation {
  toolCallId: string
  toolName: string
  args: Record<string, any>
  state: 'partial-call' | 'call' | 'result'
  result?: any
}`

const stylingCode = `/* Custom CSS for ClarityChat */

/* Main container */
.clarity-chat-container {
  --clarity-chat-bg: theme('colors.white');
  --clarity-chat-border: theme('colors.neutral.200');
  --clarity-chat-radius: theme('borderRadius.xl');
}

.dark .clarity-chat-container {
  --clarity-chat-bg: theme('colors.neutral.900');
  --clarity-chat-border: theme('colors.neutral.700');
}

/* Header customization */
.clarity-chat-header {
  background: linear-gradient(to right, var(--clarity-chat-bg), transparent);
}

/* Message bubbles */
.clarity-message-user {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 1rem 1rem 0.25rem 1rem;
}

.clarity-message-assistant {
  background: theme('colors.neutral.100');
  border-radius: 1rem 1rem 1rem 0.25rem;
}

.dark .clarity-message-assistant {
  background: theme('colors.neutral.800');
}

/* Input area */
.clarity-chat-input {
  background: var(--clarity-chat-bg);
  border-top: 1px solid var(--clarity-chat-border);
}

/* Streaming cursor effect */
.clarity-streaming-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Using Tailwind classes */
<ClarityChat
  api="/api/chat"
  className="
    h-[600px]
    rounded-xl
    border border-neutral-200 dark:border-neutral-700
    shadow-lg
    bg-white dark:bg-neutral-900
  "
/>`

// ============================================================================
// Main Page Component
// ============================================================================

export default function ClarityChatPage() {
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
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <Box className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Core
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                ClarityChat
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                The simplest way to add AI chat to your React application.
                ClarityChat is an all-in-one component that handles streaming,
                message management, memory, rate limiting, and more. Just
                provide an API endpoint and you are ready to go.
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
                { icon: Zap, label: 'Streaming', desc: 'SSE & WebSocket' },
                {
                  icon: MessageSquare,
                  label: 'Memory',
                  desc: 'Context persistence',
                },
                {
                  icon: Wrench,
                  label: 'Tools',
                  desc: 'Agentic workflows',
                },
                {
                  icon: Accessibility,
                  label: 'Accessible',
                  desc: 'WCAG AA compliant',
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
                  <code>ClarityChat</code> is the recommended entry point for
                  most use cases. It combines the <code>useClarityChat</code>{' '}
                  hook and <code>ChatWindow</code> component into a single,
                  easy-to-use interface.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Streaming Support:</strong> Real-time responses via
                    SSE or WebSocket
                  </li>
                  <li>
                    <strong>Memory Integration:</strong> Automatic context
                    retrieval and storage with multiple strategies
                  </li>
                  <li>
                    <strong>Tool Support:</strong> Built-in handling for agentic
                    workflows with tool calls
                  </li>
                  <li>
                    <strong>Rate Limiting:</strong> Request queuing to handle
                    high-traffic scenarios
                  </li>
                  <li>
                    <strong>Accessibility:</strong> Full keyboard navigation and
                    screen reader support
                  </li>
                  <li>
                    <strong>Customizable:</strong> Theming, custom empty states,
                    and grouped props API
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Architecture
                </h4>
                <p>
                  ClarityChat is a <strong>top-level, drop-in ready</strong>{' '}
                  component. For more granular control, consider using the
                  mid-level APIs like <code>ChatWindow</code> +{' '}
                  <code>useClarityChat</code> + <code>useChatHandlers</code>.
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

                <p className="text-muted-foreground">
                  Import the component and required styles:
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
                Try the component directly in your browser. This demo simulates
                streaming responses to show how ClarityChat handles real-time
                interactions.
              </p>

              <LiveDemo />

              <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> This demo uses simulated responses. In
                  a real application, responses come from your API endpoint
                  configured via the <code>api</code> prop.
                </p>
              </div>
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The simplest usage requires only the <code>api</code> prop:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="App.tsx"
                />

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Note:</strong> You need to set up an API endpoint
                    that handles chat completions. The endpoint should accept
                    POST requests with a messages array and return streaming
                    responses in SSE format. See the{' '}
                    <Link
                      href="/guides/backend-setup"
                      className="underline hover:no-underline"
                    >
                      Backend Setup Guide
                    </Link>{' '}
                    for details.
                  </p>
                </div>
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                ClarityChat uses a <strong>grouped props API</strong> for better
                organization. Legacy individual props are still supported for
                backward compatibility.
              </p>

              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="header-props" title="Header Props (header)">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure the chat header using the <code>header</code> prop
                  object:
                </p>
                <PropsTable props={headerProps} />
              </SubSection>

              <SubSection
                id="message-actions-props"
                title="Message Actions Props (messageActions)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Handle message interactions using the{' '}
                  <code>messageActions</code> prop object:
                </p>
                <PropsTable props={messageActionsProps} />
              </SubSection>

              <SubSection id="prompts-props" title="Prompts Props (prompts)">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure prompt suggestions using the <code>prompts</code>{' '}
                  prop object:
                </p>
                <PropsTable props={promptsProps} />
              </SubSection>

              <SubSection
                id="rate-limiting-props"
                title="Rate Limiting Props (rateLimiting)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure rate limiting using the <code>rateLimiting</code>{' '}
                  prop object:
                </p>
                <PropsTable props={rateLimitingProps} />
              </SubSection>

              <SubSection id="memory-props" title="Memory Props (memory)">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure memory integration using the <code>memory</code>{' '}
                  prop object. Requires <code>MemoryProvider</code> wrapper.
                </p>
                <PropsTable props={memoryProps} />
              </SubSection>

              <SubSection id="legacy-props" title="Legacy Props (Deprecated)">
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800 mb-4">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    These props are deprecated and will be removed in a future
                    version. Please migrate to the grouped props API.
                  </p>
                </div>
                <PropsTable props={legacyProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Chat">
                <p className="text-muted-foreground mb-4">
                  A minimal chat implementation with just the API endpoint:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicChat.tsx"
                />
              </SubSection>

              <SubSection id="example-custom-styling" title="Custom Styling">
                <p className="text-muted-foreground mb-4">
                  Customize the appearance with classes, header configuration,
                  and custom empty states:
                </p>
                <CodeBlock
                  code={customStylingCode}
                  language="tsx"
                  filename="StyledChat.tsx"
                />
              </SubSection>

              <SubSection id="example-streaming" title="With Streaming">
                <p className="text-muted-foreground mb-4">
                  Configure streaming transport and handle completion callbacks:
                </p>
                <CodeBlock
                  code={streamingCode}
                  language="tsx"
                  filename="StreamingChat.tsx"
                />
              </SubSection>

              <SubSection id="example-memory" title="With Memory">
                <p className="text-muted-foreground mb-4">
                  Enable conversation memory for context persistence across
                  sessions:
                </p>
                <CodeBlock
                  code={withMemoryCode}
                  language="tsx"
                  filename="ChatWithMemory.tsx"
                />
              </SubSection>

              <SubSection id="example-tools" title="With Tools">
                <p className="text-muted-foreground mb-4">
                  Build agentic chat experiences with tool calling support:
                </p>
                <CodeBlock
                  code={withToolsCode}
                  language="tsx"
                  filename="ChatWithTools.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for all props and configurations:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Styling Section */}
            <Section id="styling" title="Theming & Customization">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  ClarityChat can be customized using CSS custom properties,
                  Tailwind classes, and the <code>theme</code> prop.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">CSS Classes</h4>
                <p>
                  The component uses semantic CSS classes that can be targeted
                  for customization:
                </p>

                <ul className="space-y-2 text-sm">
                  <li>
                    <code>.clarity-chat-container</code> - Main container
                  </li>
                  <li>
                    <code>.clarity-chat-header</code> - Header section
                  </li>
                  <li>
                    <code>.clarity-chat-messages</code> - Messages container
                  </li>
                  <li>
                    <code>.clarity-message-user</code> - User message bubble
                  </li>
                  <li>
                    <code>.clarity-message-assistant</code> - Assistant message
                    bubble
                  </li>
                  <li>
                    <code>.clarity-chat-input</code> - Input container
                  </li>
                </ul>
              </div>

              <div className="mt-6">
                <CodeBlock
                  code={stylingCode}
                  language="css"
                  filename="custom-styles.css"
                />
              </div>

              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
                <h4 className="font-semibold text-foreground mb-2">
                  Built-in Themes
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use the <code>theme</code> prop to apply a predefined theme.
                  Available themes: <code>default</code>, <code>minimal</code>,
                  <code>corporate</code>, <code>playful</code>, and more. Or use
                  the <code>ThemeProvider</code> for app-wide theming.
                </p>
              </div>
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  ClarityChat is designed with accessibility as a first-class
                  concern, meeting WCAG 2.1 AA standards.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">Tab</kbd>{' '}
                    - Navigate between interactive elements
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Enter
                    </kbd>{' '}
                    - Send message when input is focused
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Shift + Enter
                    </kbd>{' '}
                    - Add new line in message input
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Escape
                    </kbd>{' '}
                    - Cancel current action or close modals
                  </li>
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Arrow Up/Down
                    </kbd>{' '}
                    - Navigate through message history
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>All interactive elements have appropriate ARIA labels</li>
                  <li>
                    New messages are announced via <code>aria-live</code>{' '}
                    regions
                  </li>
                  <li>
                    Loading states are communicated with{' '}
                    <code>aria-busy</code>
                  </li>
                  <li>Error messages are announced immediately</li>
                  <li>Tool invocations are described accessibly</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Visual Accessibility
                </h4>
                <ul className="space-y-2">
                  <li>Focus indicators are visible and high-contrast</li>
                  <li>Color contrast meets WCAG AA standards (4.5:1 minimum)</li>
                  <li>
                    Respects <code>prefers-reduced-motion</code> for animations
                  </li>
                  <li>
                    Supports <code>prefers-color-scheme</code> for dark mode
                  </li>
                </ul>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <p className="text-muted-foreground mb-6">
                Common issues and their solutions:
              </p>

              <div className="space-y-6">
                {/* Issue 1 */}
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Messages not appearing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Messages are sent but not displayed in the chat window.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">Solutions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            Ensure your API returns the correct SSE format with{' '}
                            <code>data:</code> prefix
                          </li>
                          <li>
                            Check that <code>Content-Type</code> is{' '}
                            <code>text/event-stream</code>
                          </li>
                          <li>
                            Verify CORS headers allow your frontend origin
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue 2 */}
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Memory not working
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Memory is enabled but context is not being retrieved.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">Solutions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            Wrap your app with <code>MemoryProvider</code>
                          </li>
                          <li>
                            Ensure <code>memory.enabled</code> is{' '}
                            <code>true</code>
                          </li>
                          <li>
                            Check that <code>onConsentRequired</code> returns{' '}
                            <code>true</code> if <code>requireConsent</code> is
                            enabled
                          </li>
                          <li>
                            Handle <code>onMemoryError</code> to diagnose issues
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue 3 */}
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Styles not applied
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Component renders but looks unstyled or broken.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">Solutions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            Import the CSS file:{' '}
                            <code>
                              import &apos;@clarity-chat/react/styles.css&apos;
                            </code>
                          </li>
                          <li>
                            If using Tailwind, ensure <code>@clarity-chat</code>{' '}
                            is in your <code>content</code> config
                          </li>
                          <li>
                            Check for CSS conflicts with your existing styles
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue 4 */}
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Tool calls not executing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        AI suggests tool calls but they are not being executed.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">Solutions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            Set <code>maxSteps</code> to allow multiple
                            iterations (e.g., <code>maxSteps=&#123;5&#125;</code>
                            )
                          </li>
                          <li>
                            Ensure tools are properly defined on your backend
                          </li>
                          <li>
                            Check that your API is returning tool invocations in
                            the correct format
                          </li>
                          <li>
                            Use the <code>onFinish</code> callback to debug tool
                            invocations
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Issue 5 */}
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Rate limit errors
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Requests are failing due to rate limiting.
                      </p>
                      <div className="text-sm space-y-2">
                        <p className="font-medium text-foreground">Solutions:</p>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            Enable rate limiting:{' '}
                            <code>
                              rateLimiting=&#123;&#123; enable: true
                              &#125;&#125;
                            </code>
                          </li>
                          <li>
                            Show queue status to users:{' '}
                            <code>showQueueStatus: true</code>
                          </li>
                          <li>
                            Handle <code>onRateLimited</code> to show feedback
                          </li>
                          <li>
                            Implement retry logic with{' '}
                            <code>onQueueFull</code>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Need more help?
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Check our{' '}
                      <Link
                        href="/guides"
                        className="text-brand-500 hover:underline"
                      >
                        comprehensive guides
                      </Link>{' '}
                      or{' '}
                      <Link
                        href="https://github.com/clarity-chat/clarity-chat/issues"
                        className="text-brand-500 hover:underline"
                      >
                        open an issue on GitHub
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description:
                      'The underlying hook for chat state management',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'The UI component for rendering chat messages',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'useClarityChatWithTools',
                    type: 'hook',
                    description: 'Extended hook with tool calling support',
                    href: '/reference/hooks/use-clarity-chat-with-tools',
                  },
                  {
                    name: 'MemoryProvider',
                    type: 'component',
                    description: 'Required provider for memory features',
                    href: '/reference/components/memory-provider',
                  },
                  {
                    name: 'ClarityChatApp',
                    type: 'component',
                    description:
                      'Unified App API with presets for quick setup',
                    href: '/reference/components/clarity-chat-app',
                  },
                  {
                    name: 'useChatHandlers',
                    type: 'hook',
                    description:
                      'Hook for message editing, deletion, and regeneration',
                    href: '/reference/hooks/use-chat-handlers',
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
                  href="/reference/components"
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
                      Components Overview
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/chat-window"
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
                      ChatWindow
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
