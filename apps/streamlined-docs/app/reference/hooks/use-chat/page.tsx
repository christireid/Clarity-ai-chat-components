'use client'

/**
 * useChat Hook - API Reference Documentation
 *
 * Basic chat functionality without tool calling support.
 * Provides Vercel AI SDK-compatible chat interface with streaming,
 * message management, and form handling. Simpler alternative to useClarityChat.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Zap,
  MessageSquare,
  RefreshCw,
  Send,
  Loader,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
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
// Props/Return Table Components
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
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  {
    id: 'parameters',
    title: 'Parameters',
  },
  {
    id: 'returns',
    title: 'Return Value',
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-streaming', title: 'Streaming Response' },
      { id: 'example-custom-headers', title: 'Custom Headers' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'related', title: 'Related APIs' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
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

const optionsProps: PropDefinition[] = [
  {
    name: 'api',
    type: 'string',
    default: `'/api/chat'`,
    description: 'API endpoint URL for chat completions',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    default: '[]',
    description: 'Initial messages to populate the chat',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body data to send with each request',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom headers to include in requests',
  },
  {
    name: 'credentials',
    type: 'RequestCredentials',
    description:
      'Fetch credentials mode (same-origin, include, omit)',
  },
  {
    name: 'fetch',
    type: 'typeof fetch',
    description: 'Custom fetch implementation for requests',
  },
  {
    name: 'maxSteps',
    type: 'number',
    description: 'Maximum number of steps for agentic workflows',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses',
  },
  {
    name: 'streamProtocol',
    type: `'sse' | 'data'`,
    default: `'sse'`,
    description: 'Streaming protocol to use',
  },
  {
    name: 'id',
    type: '() => string',
    description: 'Custom ID generator for messages',
  },
  {
    name: 'onResponse',
    type: '(response: Response) => void | Promise<void>',
    description: 'Callback when HTTP response is received',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void | Promise<void>',
    description: 'Callback when a response stream finishes',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs',
  },
  {
    name: 'onMessageAppend',
    type: '(message: CoreMessage) => void',
    description: 'Callback when a message is appended',
  },
  {
    name: 'transform',
    type: '(messages: CoreMessage[]) => CoreMessage[]',
    description: 'Transform messages before sending to API',
  },
  {
    name: 'keepLastMessageOnError',
    type: 'boolean',
    default: 'false',
    description: 'Keep the last message when an error occurs',
  },
  {
    name: 'sendExtraMessageFields',
    type: 'boolean',
    default: 'false',
    description: 'Include extra fields (like id, createdAt) when sending',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Current array of messages in the conversation',
  },
  {
    name: 'setMessages',
    type: 'React.Dispatch<React.SetStateAction<CoreMessage[]>>',
    description: 'Directly set the messages array',
  },
  {
    name: 'input',
    type: 'string',
    description: 'Current value of the input field',
  },
  {
    name: 'setInput',
    type: 'React.Dispatch<React.SetStateAction<string>>',
    description: 'Set the input field value',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether a request is currently in progress',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error if any occurred',
  },
  {
    name: 'data',
    type: 'CoreMessage | undefined',
    description: 'Current assistant message being streamed',
  },
  {
    name: 'append',
    type: '(message: CoreMessage | Pick<CoreMessage, "role" | "content">, options?: { data?: Record<string, any> }) => Promise<string | null>',
    description: 'Append a message and trigger assistant response',
  },
  {
    name: 'reload',
    type: '(options?: { data?: Record<string, any> }) => Promise<string | null>',
    description: 'Retry the last user message',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current stream',
  },
  {
    name: 'handleSubmit',
    type: '(event?: React.FormEvent, options?: { data?: Record<string, any> }) => void',
    description: 'Form submission handler',
  },
  {
    name: 'abort',
    type: '() => void',
    description: 'Abort the current request entirely',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { useChat } from '@clarity-chat/react'
import type { CoreMessage } from '@clarity-chat/react'`

const signatureCode = `function useChat(options?: UseChatOptions): UseChatReturn`

const basicUsageCode = `import { useChat } from '@clarity-chat/react'

function ChatComponent() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
  } = useChat({
    api: '/api/chat',
  })

  return (
    <div>
      <div className="messages">
        {messages.map((message) => (
          <div key={message.id} className={\`message \${message.role}\`}>
            {typeof message.content === 'string'
              ? message.content
              : JSON.stringify(message.content)}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}`

const streamingUsageCode = `import { useChat } from '@clarity-chat/react'

function StreamingChat() {
  const {
    messages,
    append,
    stop,
    isLoading,
    data, // Current streaming message
  } = useChat({
    api: '/api/chat',
    stream: true,
    onFinish: (message) => {
      console.log('Stream finished:', message.id)
    },
  })

  const sendMessage = async () => {
    await append({
      role: 'user',
      content: 'Tell me a story',
    })
  }

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      {/* Show streaming content in real-time */}
      {isLoading && data && (
        <div className="streaming">
          {data.content}
          <span className="cursor">|</span>
        </div>
      )}

      <button onClick={sendMessage} disabled={isLoading}>
        Send
      </button>
      {isLoading && (
        <button onClick={stop}>Stop</button>
      )}
    </div>
  )
}`

const customHeadersCode = `import { useChat } from '@clarity-chat/react'

function AuthenticatedChat() {
  const {
    messages,
    append,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    headers: {
      'Authorization': \`Bearer \${process.env.NEXT_PUBLIC_API_KEY}\`,
      'X-Custom-Header': 'value',
    },
    credentials: 'include',
    onError: (error) => {
      console.error('Chat error:', error)
    },
  })

  return (
    <div>
      {error && (
        <div className="error">Error: {error.message}</div>
      )}
      {/* Chat UI */}
    </div>
  )
}`

const typesCode = `// Core message type
interface CoreMessage {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: CoreMessageContent
  name?: string
  toolCallId?: string
}

// Content can be string or multi-modal array
type CoreMessageContent =
  | string
  | Array<
      | { type: 'text'; text: string }
      | { type: 'image'; image: string | ArrayBuffer }
      | { type: 'tool-call'; toolCallId: string; toolName: string; args: Record<string, any> }
      | { type: 'tool-result'; toolCallId: string; toolName: string; result: any }
    >

// Options interface
interface UseChatOptions {
  api?: string
  initialMessages?: CoreMessage[]
  body?: Record<string, any>
  headers?: Record<string, string>
  credentials?: RequestCredentials
  fetch?: typeof fetch
  maxSteps?: number
  streamProtocol?: 'sse' | 'data'
  id?: () => string
  onResponse?: (response: Response) => void | Promise<void>
  onFinish?: (message: CoreMessage) => void | Promise<void>
  onError?: (error: Error) => void
  onMessageAppend?: (message: CoreMessage) => void
  transform?: (messages: CoreMessage[]) => CoreMessage[]
  stream?: boolean
  keepLastMessageOnError?: boolean
  sendExtraMessageFields?: boolean
}

// Return interface
interface UseChatReturn {
  messages: CoreMessage[]
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  append: (message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>, options?: { data?: Record<string, any> }) => Promise<string | null>
  reload: (options?: { data?: Record<string, any> }) => Promise<string | null>
  stop: () => void
  handleSubmit: (event?: React.FormEvent, options?: { data?: Record<string, any> }) => void
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  isLoading: boolean
  error: Error | undefined
  data: CoreMessage | undefined
  abort: () => void
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseChatPage() {
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
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                  <MessageSquare className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hook
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useChat
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Basic chat functionality without tool calling support. Provides
                Vercel AI SDK-compatible interface with streaming, message
                management, and form handling. Simpler alternative to
                useClarityChat for standard chat use cases.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: Zap, label: 'Streaming', desc: 'SSE support' },
                { icon: Send, label: 'Simple', desc: 'Easy to use' },
                { icon: RefreshCw, label: 'Retry', desc: 'Built-in reload' },
                { icon: Loader, label: 'Loading', desc: 'State management' },
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
                  <code>useChat</code> is a mid-level hook that provides basic
                  chat functionality with Vercel AI SDK compatibility. It is
                  simpler than <code>useClarityChat</code> and does not include
                  memory integration, prompt optimization, or tool calling
                  support.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Streaming Support:</strong> Real-time responses via
                    SSE
                  </li>
                  <li>
                    <strong>Vercel AI SDK Compatible:</strong> Drop-in
                    replacement for useChat
                  </li>
                  <li>
                    <strong>Form Integration:</strong> Built-in form handling
                    with handleSubmit
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Comprehensive error states
                    and callbacks
                  </li>
                  <li>
                    <strong>TypeScript First:</strong> Full type safety and
                    autocomplete
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <p>
                  Use <code>useChat</code> when you need basic chat
                  functionality without advanced features like memory, prompt
                  optimization, or tool calling. For more advanced use cases,
                  use <code>useClarityChat</code> instead.
                </p>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <div className="space-y-4">
                <CodeBlock
                  code={importCode}
                  language="tsx"
                  filename="Import"
                  showDownloadButton={false}
                />
              </div>
            </Section>

            {/* Signature Section */}
            <Section id="signature" title="Signature">
              <div className="space-y-4">
                <CodeBlock
                  code={signatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Note:</strong> All options are optional. The hook
                    works with default values for quick setup.
                  </p>
                </div>
              </div>
            </Section>

            {/* Parameters Section */}
            <Section id="parameters" title="Parameters">
              <p className="text-muted-foreground mb-6">
                The hook accepts a single options object with the following
                properties.
              </p>

              <PropsTable props={optionsProps} />
            </Section>

            {/* Return Value Section */}
            <Section id="returns" title="Return Value">
              <p className="text-muted-foreground mb-6">
                The hook returns an object with state, actions, and data for
                managing the chat interface.
              </p>

              <PropsTable props={returnProps} />
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  A minimal implementation with form handling and message
                  display:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicChat.tsx"
                />
              </SubSection>

              <SubSection id="example-streaming" title="Streaming Response">
                <p className="text-muted-foreground mb-4">
                  Handle real-time streaming responses with stop functionality:
                </p>
                <CodeBlock
                  code={streamingUsageCode}
                  language="tsx"
                  filename="StreamingChat.tsx"
                />
              </SubSection>

              <SubSection id="example-custom-headers" title="Custom Headers">
                <p className="text-muted-foreground mb-4">
                  Use custom headers for authentication and configuration:
                </p>
                <CodeBlock
                  code={customHeadersCode}
                  language="tsx"
                  filename="AuthenticatedChat.tsx"
                />
              </SubSection>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for the hook options and return value:
              </p>
              <CodeBlock
                code={typesCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description:
                      'Enhanced version with memory and optimization',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'UI component for rendering chat messages',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'useStreamingSSE',
                    type: 'hook',
                    description: 'Lower-level SSE streaming hook',
                    href: '/reference/hooks/use-streaming-sse',
                  },
                  {
                    name: 'ChatInput',
                    type: 'component',
                    description: 'Input component for chat messages',
                    href: '/reference/components/chat-input',
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

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Messages not streaming
                  </h4>
                  <p className="text-muted-foreground mb-2">
                    Ensure your API endpoint returns data in SSE format with
                    proper headers:
                  </p>
                  <div className="p-3 bg-muted/30 rounded font-mono text-sm">
                    Content-Type: text/event-stream
                    <br />
                    Cache-Control: no-cache
                    <br />
                    Connection: keep-alive
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Empty input not prevented
                  </h4>
                  <p className="text-muted-foreground">
                    The hook automatically validates input and calls onError if
                    empty. Make sure to handle the error callback to show user
                    feedback.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Request not aborting
                  </h4>
                  <p className="text-muted-foreground">
                    Use the <code>abort()</code> or <code>stop()</code> method
                    to cancel ongoing requests. The hook automatically cleans up
                    on unmount.
                  </p>
                </div>
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-clarity-chat"
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
                      useClarityChat
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-streaming-sse"
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
                      useStreamingSSE
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
