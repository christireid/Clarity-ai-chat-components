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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration: API documentation changes with code updates
export const revalidate = 3600

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
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'installation', title: 'Installation' },
  { id: 'basic-usage', title: 'Basic Usage' },
  {
    id: 'props',
    title: 'Props API',
    children: [
      { id: 'core-props', title: 'Core Props' },
      { id: 'header-props', title: 'Header Props' },
      { id: 'message-actions-props', title: 'Message Actions Props' },
      { id: 'prompts-props', title: 'Prompts Props' },
      { id: 'rate-limiting-props', title: 'Rate Limiting Props' },
      { id: 'legacy-props', title: 'Legacy Props' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Chat' },
      { id: 'example-custom-header', title: 'With Custom Header' },
      { id: 'example-memory', title: 'With Memory' },
      { id: 'example-rate-limiting', title: 'With Rate Limiting' },
      { id: 'example-full', title: 'Fully Customized' },
    ],
  },
  { id: 'styling', title: 'Styling & Theming' },
  { id: 'accessibility', title: 'Accessibility' },
  { id: 'related', title: 'Related APIs' },
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
    name: 'initialMessages',
    type: 'CoreMessage[]',
    default: '[]',
    description: 'Initial messages to populate the chat.',
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
    description: 'Callback when a message is edited.',
  },
  {
    name: 'onRegenerate',
    type: '(messageId: string) => void',
    description: 'Callback when a message is regenerated.',
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

const basicUsageCode = `import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`

const withHeaderCode = `import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      header={{
        show: true,
        title: 'AI Assistant',
        subtitle: 'Ask me anything',
        showMessageCount: true,
        actions: (
          <button onClick={() => console.log('Settings clicked')}>
            Settings
          </button>
        ),
      }}
    />
  )
}`

const withMemoryCode = `import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'vector-store',
        autoCapture: true,
        requireConsent: true,
        onConsentRequired: async () => {
          // Show consent dialog and return user's choice
          return await showConsentDialog()
        },
        maxTokens: 4000,
        onMemoryError: (error, operation) => {
          console.error(\`Memory \${operation} failed:\`, error)
        },
      }}
    />
  )
}`

const withRateLimitingCode = `import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      rateLimiting={{
        enable: true,
        maxConcurrentRequests: 3,
        maxQueueSize: 10,
        showQueueStatus: true,
        onRequestQueued: (position, estimatedWaitMs) => {
          console.log(\`Request queued at position \${position}\`)
        },
        onRateLimited: (resetAt) => {
          console.log(\`Rate limited until \${new Date(resetAt)}\`)
        },
        onQueueFull: () => {
          alert('Too many requests. Please wait.')
        },
      }}
    />
  )
}`

const fullCustomizationCode = `import { ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <ClarityChat
      api="/api/chat"
      className="h-[600px] rounded-xl border shadow-lg"

      // Header configuration
      header={{
        show: true,
        title: 'Support Assistant',
        subtitle: 'Online - Typically replies instantly',
        showMessageCount: true,
      }}

      // Message action handlers
      messageActions={{
        onCopy: (id, content) => {
          navigator.clipboard.writeText(content)
          toast.success('Copied to clipboard')
        },
        onFeedback: async (messageId, type, comment) => {
          await fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify({ messageId, type, comment }),
          })
        },
        onEdit: (messageId) => setEditingId(messageId),
        onRegenerate: (messageId) => regenerateMessage(messageId),
        onDelete: (messageId) => deleteMessage(messageId),
      }}

      // Prompt suggestions
      prompts={{
        starterPrompts: [
          { text: 'How do I reset my password?', category: 'Account' },
          { text: 'What are your business hours?', category: 'General' },
          { text: 'Track my order status', category: 'Orders' },
        ],
        enableSuggestions: true,
        maxSuggestions: 5,
      }}

      // Memory configuration
      memory={{
        enabled: true,
        strategy: 'semantic-chunks',
        autoCapture: false,
        maxTokens: 8000,
      }}

      // Rate limiting
      rateLimiting={{
        enable: true,
        maxConcurrentRequests: 2,
        showQueueStatus: true,
        compactQueueStatus: true,
      }}

      // Callbacks
      onError={(error) => {
        console.error('Chat error:', error)
        toast.error('Something went wrong. Please try again.')
      }}
      onFinish={(message) => {
        analytics.track('chat_response_received', {
          messageId: message.id,
          length: message.content.length,
        })
      }}

      // Custom empty state
      emptyState={
        <div className="flex flex-col items-center justify-center h-full">
          <MessageSquareIcon className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Start a conversation</h3>
          <p className="text-muted-foreground">
            Ask me anything about our products and services.
          </p>
        </div>
      }
    />
  )
}`

const stylingCode = `/* Custom CSS for ClarityChat */
.clarity-chat-container {
  /* Container styles */
  --clarity-chat-bg: theme('colors.white');
  --clarity-chat-border: theme('colors.neutral.200');
  --clarity-chat-radius: theme('borderRadius.xl');
}

.dark .clarity-chat-container {
  --clarity-chat-bg: theme('colors.neutral.900');
  --clarity-chat-border: theme('colors.neutral.700');
}

/* Message bubble customization */
.clarity-message-user {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
}

.clarity-message-assistant {
  background: theme('colors.neutral.100');
}

.dark .clarity-message-assistant {
  background: theme('colors.neutral.800');
}`

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
                { icon: Zap, label: 'Streaming', desc: 'Real-time responses' },
                {
                  icon: MessageSquare,
                  label: 'Memory',
                  desc: 'Context persistence',
                },
                {
                  icon: Gauge,
                  label: 'Rate Limiting',
                  desc: 'Request queuing',
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
                  hook and <code>ChatWindow</code>
                  component into a single, easy-to-use interface.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>Automatic message format conversion</li>
                  <li>Built-in loading states and error handling</li>
                  <li>Memory support with multiple strategies</li>
                  <li>Real-time streaming with SSE or WebSocket</li>
                  <li>Rate limiting with request queuing</li>
                  <li>Full keyboard navigation and screen reader support</li>
                  <li>Customizable theming and styling</li>
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
                  code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
                  language="tsx"
                  filename="App.tsx"
                  showDownloadButton={false}
                />
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
                    responses in SSE format.
                  </p>
                </div>
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props API">
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
                  prop object:
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

              <SubSection id="example-custom-header" title="With Custom Header">
                <p className="text-muted-foreground mb-4">
                  Add a header with title, subtitle, and custom actions:
                </p>
                <CodeBlock
                  code={withHeaderCode}
                  language="tsx"
                  filename="ChatWithHeader.tsx"
                />
              </SubSection>

              <SubSection id="example-memory" title="With Memory">
                <p className="text-muted-foreground mb-4">
                  Enable conversation memory for context persistence:
                </p>
                <CodeBlock
                  code={withMemoryCode}
                  language="tsx"
                  filename="ChatWithMemory.tsx"
                />
              </SubSection>

              <SubSection id="example-rate-limiting" title="With Rate Limiting">
                <p className="text-muted-foreground mb-4">
                  Handle high-traffic scenarios with request queuing:
                </p>
                <CodeBlock
                  code={withRateLimitingCode}
                  language="tsx"
                  filename="ChatWithRateLimiting.tsx"
                />
              </SubSection>

              <SubSection id="example-full" title="Fully Customized">
                <p className="text-muted-foreground mb-4">
                  A complete example with all features configured:
                </p>
                <CodeBlock
                  code={fullCustomizationCode}
                  language="tsx"
                  filename="FullyCustomizedChat.tsx"
                />
              </SubSection>
            </Section>

            {/* Styling Section */}
            <Section id="styling" title="Styling & Theming">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  ClarityChat can be customized using CSS custom properties and
                  Tailwind classes.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">CSS Classes</h4>
                <p>
                  The component uses the following CSS classes that can be
                  targeted:
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
                  Theme Prop
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use the <code>theme</code> prop to apply a predefined theme.
                  Available themes include: <code>default</code>,{' '}
                  <code>minimal</code>,<code>corporate</code>,{' '}
                  <code>playful</code>, and more.
                </p>
              </div>
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  ClarityChat is designed with accessibility as a first-class
                  concern:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Keyboard Navigation
                </h4>
                <ul className="space-y-2">
                  <li>
                    <kbd>Tab</kbd> - Navigate between interactive elements
                  </li>
                  <li>
                    <kbd>Enter</kbd> - Send message when input is focused
                  </li>
                  <li>
                    <kbd>Shift + Enter</kbd> - Add new line in message input
                  </li>
                  <li>
                    <kbd>Escape</kbd> - Cancel current action or close modals
                  </li>
                  <li>
                    <kbd>Arrow Up/Down</kbd> - Navigate through message history
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>All interactive elements have appropriate ARIA labels</li>
                  <li>New messages are announced via live regions</li>
                  <li>Loading states are communicated with aria-busy</li>
                  <li>Error messages are announced immediately</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Visual</h4>
                <ul className="space-y-2">
                  <li>Focus indicators are visible and high-contrast</li>
                  <li>Color contrast meets WCAG AA standards</li>
                  <li>
                    Respects user motion preferences (prefers-reduced-motion)
                  </li>
                </ul>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description:
                      'The underlying hook for chat state management',
                    href: '/api/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'The UI component for rendering chat messages',
                    href: '/api/reference/components/chat-window',
                  },
                  {
                    name: 'useChatHandlers',
                    type: 'hook',
                    description:
                      'Hook for message editing, deletion, and regeneration',
                    href: '/api/reference/hooks/use-chat-handlers',
                  },
                  {
                    name: 'ClarityChatSimple',
                    type: 'component',
                    description: 'Simplified version for basic use cases',
                    href: '/api/reference/components/clarity-chat-simple',
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
                  href="/api/reference/components"
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
                  href="/api/reference/components/chat-window"
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
