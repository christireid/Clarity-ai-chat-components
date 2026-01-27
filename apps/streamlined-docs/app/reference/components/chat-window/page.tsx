'use client'

/**
 * ChatWindow Component - API Reference Documentation
 *
 * A mid-level composable chat window component that accepts messages and handles
 * rendering, input, and user interactions.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Layout,
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
    Array<{ id: string; role: 'user' | 'assistant'; content: string }>
  >([])
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [showHeader, setShowHeader] = React.useState(true)

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

    // Simulate response
    const responses = [
      'This is a ChatWindow demo showing the mid-level component API.',
      'ChatWindow provides composable building blocks for custom chat UIs.',
      'Use it when you need more control over state management than ClarityChat offers.',
    ]

    const assistantMessage = {
      id: `assistant-${Date.now()}`,
      role: 'assistant' as const,
      content: '',
    }
    setMessages((prev) => [...prev, assistantMessage])

    const fullResponse = responses[messages.length % responses.length]
    for (let i = 0; i <= fullResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 15))
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
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showHeader}
            onChange={(e) => setShowHeader(e.target.checked)}
            className="rounded"
          />
          Show Header
        </label>
        <button
          onClick={() => setMessages([])}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Clear Messages
        </button>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        {showHeader && (
          <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Chat Session</h3>
              <p className="text-xs text-muted-foreground">
                {messages.length} messages
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        )}

        {/* Messages Area */}
        <div className="h-64 overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">ChatWindow with grouped props API</p>
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
      { id: 'message-actions-props', title: 'Message Actions' },
      { id: 'edit-actions-props', title: 'Edit Actions' },
      { id: 'header-config-props', title: 'Header Config' },
      { id: 'error-handling-props', title: 'Error Handling' },
      { id: 'prompt-config-props', title: 'Prompt Config' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-with-header', title: 'With Header' },
      { id: 'example-with-actions', title: 'With Actions' },
      { id: 'example-custom-empty-state', title: 'Custom Empty State' },
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
    type: 'Message[] | CoreMessage[]',
    required: true,
    description:
      'Messages to display. Accepts either Message[] or CoreMessage[] format.',
  },
  {
    name: 'onSendMessage',
    type: '(content: string) => void',
    required: true,
    description: 'Callback when user sends a message.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Whether a response is currently being generated.',
  },
  {
    name: 'aiStatus',
    type: 'AIStatus',
    description:
      'AI processing status for the thinking indicator. Shows detailed progress.',
  },
  {
    name: 'onStopGeneration',
    type: '() => void',
    description:
      'Callback to stop the current AI generation. Shows a Stop button when provided.',
  },
  {
    name: 'messageActions',
    type: 'ChatWindowMessageActions',
    description: 'Message interaction callbacks configuration object.',
  },
  {
    name: 'editActions',
    type: 'ChatWindowEditActions',
    description: 'Edit-related callbacks for inline message editing.',
  },
  {
    name: 'header',
    type: 'ChatWindowHeaderConfig',
    description: 'Header configuration object.',
  },
  {
    name: 'actions',
    type: 'ChatWindowActions',
    description: 'Global actions (export, clear) configuration.',
  },
  {
    name: 'errorHandling',
    type: 'ChatWindowErrorHandling',
    description: 'Error handling configuration for displaying errors.',
  },
  {
    name: 'prompts',
    type: 'ChatWindowPromptConfig',
    description: 'Prompt suggestions configuration object.',
  },
  {
    name: 'emptyState',
    type: 'React.ReactNode',
    description: 'Custom empty state component shown when no messages.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the chat container.',
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
]

const messageActionsProps: PropDefinition[] = [
  {
    name: 'onCopy',
    type: '(messageId: string, content: string) => void',
    description: 'Callback when a message is copied.',
  },
  {
    name: 'onFeedback',
    type: "(messageId: string, type: 'up' | 'down', comment?: string) => void",
    description: 'Callback when message feedback is provided.',
  },
  {
    name: 'onRetry',
    type: '(messageId: string) => void',
    description: 'Callback when retry is requested for a message.',
  },
  {
    name: 'onEdit',
    type: '(messageId: string) => void',
    description: 'Callback when message editing is initiated.',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description: 'Callback when message regeneration is requested.',
  },
  {
    name: 'onDelete',
    type: '(messageId: string) => void',
    description: 'Callback when a message is deleted.',
  },
]

const editActionsProps: PropDefinition[] = [
  {
    name: 'editingMessageId',
    type: 'string | null',
    description: 'ID of the message currently being edited.',
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

const headerConfigProps: PropDefinition[] = [
  {
    name: 'show',
    type: 'boolean',
    default: 'false',
    description: 'Whether to show the header.',
  },
  {
    name: 'title',
    type: 'string',
    description: 'Title displayed in the header.',
  },
  {
    name: 'subtitle',
    type: 'string',
    description: 'Subtitle displayed below the title.',
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

const errorHandlingProps: PropDefinition[] = [
  {
    name: 'error',
    type: 'string | null',
    description: 'Error message to display in a banner.',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback to retry after an error. Shows a Retry button.',
  },
  {
    name: 'onDismissError',
    type: '() => void',
    description: 'Callback to dismiss the error banner.',
  },
]

const promptConfigProps: PropDefinition[] = [
  {
    name: 'starterPrompts',
    type: 'PromptSuggestion[]',
    description: 'Starter prompts shown in the empty state.',
  },
  {
    name: 'followUpSuggestions',
    type: 'PromptSuggestion[]',
    description: 'Suggested follow-up prompts after assistant messages.',
  },
  {
    name: 'showStarterPrompts',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show starter prompts in empty state.',
  },
  {
    name: 'showFollowUpSuggestions',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show follow-up suggestions.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { ChatWindow } from '@clarity-chat/react'
import type { ChatWindowProps } from '@clarity-chat/react'

// Don't forget to import styles
import '@clarity-chat/react/styles.css'`

const basicUsageCode = `import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function App() {
  const { messages, sendMessage, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
    />
  )
}`

const withHeaderCode = `import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithHeader() {
  const { messages, sendMessage, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
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
    />
  )
}`

const withActionsCode = `import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat, useChatHandlers } from '@clarity-chat/react'

function ChatWithActions() {
  const { messages, sendMessage, isLoading, stop } = useClarityChat({
    api: '/api/chat',
  })

  const {
    handleCopy,
    handleFeedback,
    handleEdit,
    handleRegenerate,
    handleDelete,
    editingMessageId,
    handleSaveEdit,
    handleCancelEdit,
  } = useChatHandlers(messages)

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      onStopGeneration={stop}
      messageActions={{
        onCopy: handleCopy,
        onFeedback: handleFeedback,
        onEdit: handleEdit,
        onRegenerate: handleRegenerate,
        onDelete: handleDelete,
      }}
      editActions={{
        editingMessageId,
        onSaveEdit: handleSaveEdit,
        onCancelEdit: handleCancelEdit,
      }}
    />
  )
}`

const customEmptyStateCode = `import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithCustomEmpty() {
  const { messages, sendMessage, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={sendMessage}
      isLoading={isLoading}
      emptyState={
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="w-16 h-16 bg-brand-500/10 rounded-full flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-brand-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Welcome!</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Start a conversation with our AI assistant.
            Ask questions, get help with tasks, or just chat.
          </p>
        </div>
      }
      prompts={{
        starterPrompts: [
          { text: 'What can you help me with?', category: 'general' },
          { text: 'Tell me about your capabilities', category: 'general' },
          { text: 'Help me write some code', category: 'coding' },
        ],
        showStarterPrompts: true,
      }}
    />
  )
}`

const typescriptCode = `// Main component props
interface ChatWindowProps {
  /** Messages to display */
  messages: Message[] | CoreMessage[]
  /** Whether a response is being generated */
  isLoading?: boolean
  /** AI processing status for thinking indicator */
  aiStatus?: AIStatus
  /** Callback when user sends a message */
  onSendMessage: (content: string) => void
  /** Callback to stop current generation */
  onStopGeneration?: () => void
  /** Message interaction callbacks */
  messageActions?: ChatWindowMessageActions
  /** Edit-related callbacks */
  editActions?: ChatWindowEditActions
  /** Header configuration */
  header?: ChatWindowHeaderConfig
  /** Global actions (export, clear) */
  actions?: ChatWindowActions
  /** Error handling configuration */
  errorHandling?: ChatWindowErrorHandling
  /** Prompt suggestions configuration */
  prompts?: ChatWindowPromptConfig
  /** Custom empty state */
  emptyState?: React.ReactNode
  /** Additional CSS class */
  className?: string
}

// Message actions configuration
interface ChatWindowMessageActions {
  onCopy?: (messageId: string, content: string) => void
  onFeedback?: (messageId: string, type: 'up' | 'down', comment?: string) => void
  onRetry?: (messageId: string) => void
  onEdit?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onDelete?: (messageId: string) => void
}

// Edit actions configuration
interface ChatWindowEditActions {
  editingMessageId?: string | null
  onSaveEdit?: (messageId: string, newContent: string) => void
  onCancelEdit?: (messageId: string) => void
}

// Header configuration
interface ChatWindowHeaderConfig {
  show?: boolean
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  showMessageCount?: boolean
}

// Error handling configuration
interface ChatWindowErrorHandling {
  error?: string | null
  onRetry?: () => void
  onDismissError?: () => void
}

// Prompt configuration
interface ChatWindowPromptConfig {
  starterPrompts?: PromptSuggestion[]
  followUpSuggestions?: PromptSuggestion[]
  showStarterPrompts?: boolean
  showFollowUpSuggestions?: boolean
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function ChatWindowPage() {
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
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Layout className="w-6 h-6" aria-hidden="true" />
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
                ChatWindow
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A mid-level composable chat window component for building custom
                chat interfaces. Use ChatWindow when you need more control over
                state management than ClarityChat provides, while still getting
                a complete UI for messages, input, and interactions.
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
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: Layers,
                  label: 'Composable',
                  desc: 'Bring your own state',
                },
                { icon: Wrench, label: 'Grouped Props', desc: 'Organized API' },
                {
                  icon: MessageSquare,
                  label: 'Full UI',
                  desc: 'Complete chat interface',
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
                  <code>ChatWindow</code> is a mid-level component in the
                  Clarity Chat architecture. It sits between the low-level
                  primitives (<code>MessageList</code>, <code>ChatInput</code>)
                  and the high-level <code>ClarityChat</code> component.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Responsive by Default
                </h4>
                <p>
                  ChatWindow is fully responsive with self-contained styles. It
                  automatically adapts from mobile (320px) to desktop (2560px+)
                  with mobile-first breakpoints and hidden scrollbars for a
                  clean UI. No additional CSS configuration needed.
                </p>
                <ul className="space-y-2">
                  <li>
                    <strong>Mobile-First:</strong> Uses <code>sm:</code>,{' '}
                    <code>md:</code>, <code>lg:</code> breakpoints
                  </li>
                  <li>
                    <strong>Self-Contained:</strong> All styles included, works
                    out-of-the-box
                  </li>
                  <li>
                    <strong>Clean UI:</strong> Hidden scrollbars by default (
                    <code>scrollbar-hide</code>)
                  </li>
                  <li>
                    <strong>Viewport-Aware:</strong> Prevents overflow with
                    adaptive sizing
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use ChatWindow
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Custom State Management:</strong> When you want to
                    use your own hooks or state solution
                  </li>
                  <li>
                    <strong>Multiple Chat Instances:</strong> When managing
                    multiple conversations in one view
                  </li>
                  <li>
                    <strong>Complex Layouts:</strong> When embedding chat in
                    custom layouts or dashboards
                  </li>
                  <li>
                    <strong>Custom Message Handling:</strong> When you need
                    fine-grained control over message operations
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Architecture Position
                </h4>
                <p>
                  ChatWindow is designed to be used with{' '}
                  <code>useClarityChat</code> hook for state management, but you
                  can also provide your own message state. It uses{' '}
                  <code>MessageList</code> internally for rendering messages.
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
                Try the ChatWindow component. Toggle the header visibility and
                test the message interactions.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  ChatWindow requires <code>messages</code> and{' '}
                  <code>onSendMessage</code> props. Typically used with{' '}
                  <code>useClarityChat</code>:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="App.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                ChatWindow uses a <strong>grouped props API</strong> for better
                organization. Related props are grouped into configuration
                objects.
              </p>

              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection
                id="message-actions-props"
                title="Message Actions (messageActions)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Handle message interactions using the{' '}
                  <code>messageActions</code> prop object:
                </p>
                <PropsTable props={messageActionsProps} />
              </SubSection>

              <SubSection
                id="edit-actions-props"
                title="Edit Actions (editActions)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Handle inline message editing using the{' '}
                  <code>editActions</code> prop object:
                </p>
                <PropsTable props={editActionsProps} />
              </SubSection>

              <SubSection
                id="header-config-props"
                title="Header Config (header)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure the chat header using the <code>header</code> prop
                  object:
                </p>
                <PropsTable props={headerConfigProps} />
              </SubSection>

              <SubSection
                id="error-handling-props"
                title="Error Handling (errorHandling)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure error display using the <code>errorHandling</code>{' '}
                  prop object:
                </p>
                <PropsTable props={errorHandlingProps} />
              </SubSection>

              <SubSection
                id="prompt-config-props"
                title="Prompt Config (prompts)"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure prompt suggestions using the <code>prompts</code>{' '}
                  prop object:
                </p>
                <PropsTable props={promptConfigProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Minimal setup with <code>useClarityChat</code>:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicChat.tsx"
                />
              </SubSection>

              <SubSection id="example-with-header" title="With Header">
                <p className="text-muted-foreground mb-4">
                  Add a header with title, subtitle, and actions:
                </p>
                <CodeBlock
                  code={withHeaderCode}
                  language="tsx"
                  filename="ChatWithHeader.tsx"
                />
              </SubSection>

              <SubSection id="example-with-actions" title="With Actions">
                <p className="text-muted-foreground mb-4">
                  Enable all message actions with <code>useChatHandlers</code>:
                </p>
                <CodeBlock
                  code={withActionsCode}
                  language="tsx"
                  filename="ChatWithActions.tsx"
                />
              </SubSection>

              <SubSection
                id="example-custom-empty-state"
                title="Custom Empty State"
              >
                <p className="text-muted-foreground mb-4">
                  Create a branded empty state with starter prompts:
                </p>
                <CodeBlock
                  code={customEmptyStateCode}
                  language="tsx"
                  filename="ChatWithCustomEmpty.tsx"
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

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>ChatWindow includes comprehensive accessibility features:</p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Keyboard className="w-5 h-5" aria-hidden="true" />
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs">
                      Tab
                    </kbd>{' '}
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
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Skip Links</h4>
                <p>
                  ChatWindow includes skip links for jumping directly to
                  messages or input, visible on focus for keyboard users.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Live Regions
                </h4>
                <p>
                  New messages and loading states are announced to screen
                  readers via <code>aria-live</code> regions.
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
                        Messages not rendering
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Messages are passed but not displayed.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure messages is an array with <code>id</code>,{' '}
                          <code>role</code>, and <code>content</code> properties
                        </li>
                        <li>
                          Check that each message has a unique <code>id</code>
                        </li>
                        <li>Verify the component has a defined height</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Runtime validation errors
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Getting errors about invalid props.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          <code>messages</code> must be an array
                        </li>
                        <li>
                          <code>onSendMessage</code> must be a function
                        </li>
                        <li>
                          Check the error message for specific requirements
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
                    name: 'ClarityChat',
                    type: 'component',
                    description: 'All-in-one drop-in chat component',
                    href: '/reference/components/clarity-chat',
                  },
                  {
                    name: 'MessageList',
                    type: 'component',
                    description:
                      'Message list with auto-scrolling and animations',
                    href: '/reference/components/message-list',
                  },
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'Hook for chat state management',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'useChatHandlers',
                    type: 'hook',
                    description: 'Hook for message operations',
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
                  href="/reference/components/clarity-chat"
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
                      ClarityChat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/message-list"
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
                      MessageList
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
