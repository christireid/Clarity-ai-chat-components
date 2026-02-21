'use client'

/**
 * useClarityChat Hook - API Reference Documentation
 *
 * The primary hook for chat functionality in Clarity. This is the recommended
 * entry point for building chat interfaces with state management, streaming,
 * memory integration, and prompt optimization.
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
  Database,
  Settings,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Gauge,
  Brain,
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
// Props/Return Table Components
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
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  {
    id: 'parameters',
    title: 'Parameters',
    children: [
      { id: 'core-options', title: 'Core Options' },
      { id: 'memory-options', title: 'Memory Options' },
      { id: 'prompt-optimization-options', title: 'Prompt Optimization' },
      { id: 'websocket-options', title: 'WebSocket Options' },
      { id: 'callback-options', title: 'Callbacks' },
    ],
  },
  {
    id: 'returns',
    title: 'Return Value',
    children: [
      { id: 'state-properties', title: 'State' },
      { id: 'action-methods', title: 'Actions' },
      { id: 'memory-info', title: 'Memory Info' },
      { id: 'token-stats', title: 'Token Stats' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-streaming', title: 'With Streaming' },
      { id: 'example-memory', title: 'With Memory' },
      { id: 'example-optimization', title: 'With Optimization' },
      { id: 'example-handlers', title: 'With Handlers' },
    ],
  },
  { id: 'typescript', title: 'TypeScript' },
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

const coreOptionsProps: PropDefinition[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description:
      'API endpoint URL for chat completions. Must be a valid URL path or full URL.',
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
    name: 'credentials',
    type: 'RequestCredentials',
    description:
      'Fetch credentials mode. Use "include" for cross-origin requests with cookies.',
  },
  {
    name: 'fetch',
    type: 'typeof fetch',
    description: 'Custom fetch implementation for requests.',
  },
  {
    name: 'maxSteps',
    type: 'number',
    description: 'Maximum number of steps for agentic workflows with tools.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses.',
  },
  {
    name: 'transport',
    type: "'sse' | 'websocket'",
    default: "'sse'",
    description:
      'Transport protocol for streaming. SSE for standard, WebSocket for real-time.',
  },
  {
    name: 'keepLastMessageOnError',
    type: 'boolean',
    default: 'false',
    description:
      'Keep the last assistant message when an error occurs instead of removing it.',
  },
  {
    name: 'sendExtraMessageFields',
    type: 'boolean',
    default: 'false',
    description:
      'Include extra fields (like id, createdAt) when sending messages.',
  },
]

const memoryOptionsProps: PropDefinition[] = [
  {
    name: 'memory.enabled',
    type: 'boolean',
    default: 'false',
    description:
      'Enable memory integration. Requires MemoryProvider in component tree.',
  },
  {
    name: 'memory.autoCapture',
    type: 'boolean',
    default: 'false',
    description:
      'Automatically capture messages to memory. Has privacy implications - ensure user consent.',
  },
  {
    name: 'memory.requireConsent',
    type: 'boolean',
    default: 'true',
    description: 'Require user consent before capturing messages to memory.',
  },
  {
    name: 'memory.onConsentRequired',
    type: '() => Promise<boolean> | boolean',
    description:
      'Callback invoked before first memory capture to request consent. Return true if granted.',
  },
  {
    name: 'memory.strategy',
    type: "'sliding-window' | 'semantic-chunks' | 'vector-store'",
    description:
      'Memory strategy for context management. Vector-store provides semantic search.',
  },
  {
    name: 'memory.maxTokens',
    type: 'number',
    description: 'Maximum tokens for memory context injection.',
  },
  {
    name: 'memory.retryOnError',
    type: 'boolean',
    default: 'true',
    description: 'Retry failed memory operations with exponential backoff.',
  },
  {
    name: 'memory.maxRetryAttempts',
    type: 'number',
    default: '2',
    description: 'Maximum retry attempts for memory operations.',
  },
  {
    name: 'memory.onMemoryError',
    type: "(error: Error, operation: 'query' | 'store') => void",
    description: 'Callback when a memory operation fails.',
  },
]

const promptOptimizationProps: PropDefinition[] = [
  {
    name: 'promptOptimization.enabled',
    type: 'boolean',
    default: 'false',
    description:
      'Enable prompt optimization to prevent context window overflow.',
  },
  {
    name: 'promptOptimization.targetTokens',
    type: 'number',
    description: 'Target token budget for optimization.',
  },
  {
    name: 'promptOptimization.strategy',
    type: "'sliding-window' | 'summarize-old' | 'drop-low-priority' | 'hybrid'",
    default: "'hybrid'",
    description: 'Optimization strategy for trimming messages.',
  },
  {
    name: 'promptOptimization.model',
    type: 'string',
    description:
      'Model identifier for accurate token counting (e.g., "gpt-4", "claude-3").',
  },
  {
    name: 'promptOptimization.priorities',
    type: 'Array<{ messageId: string; priority: number; reason?: string }>',
    description: 'Custom message priorities for optimization decisions.',
  },
  {
    name: 'promptOptimization.summarizeFn',
    type: '(messages: CoreMessage[]) => Promise<string> | string',
    description: 'Custom summarization function for summarize-old strategy.',
  },
  {
    name: 'promptOptimization.keepRecent',
    type: 'number',
    default: '2',
    description: 'Number of recent messages to always keep.',
  },
]

const websocketOptionsProps: PropDefinition[] = [
  {
    name: 'websocket.autoReconnect',
    type: 'boolean',
    default: 'true',
    description: 'Enable automatic reconnection on connection loss.',
  },
  {
    name: 'websocket.maxReconnectAttempts',
    type: 'number',
    default: '5',
    description: 'Maximum reconnection attempts before giving up.',
  },
  {
    name: 'websocket.enableHeartbeat',
    type: 'boolean',
    default: 'true',
    description: 'Enable heartbeat/ping-pong to detect connection health.',
  },
  {
    name: 'websocket.protocols',
    type: 'string | string[]',
    description: 'WebSocket sub-protocols to use.',
  },
]

const callbackOptionsProps: PropDefinition[] = [
  {
    name: 'onResponse',
    type: '(response: Response) => void | Promise<void>',
    description: 'Callback when HTTP response is received (before streaming).',
  },
  {
    name: 'onFinish',
    type: '(message: CoreMessage) => void | Promise<void>',
    description: 'Callback when a response stream finishes successfully.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'onMessageAppend',
    type: '(message: CoreMessage) => void',
    description: 'Callback when a message is appended to the conversation.',
  },
  {
    name: 'transform',
    type: '(messages: CoreMessage[]) => CoreMessage[]',
    description:
      'Transform messages before sending to the API. Useful for filtering or adding context.',
  },
]

const stateReturnProps: PropDefinition[] = [
  {
    name: 'messages',
    type: 'CoreMessage[]',
    description: 'Current array of messages in the conversation.',
  },
  {
    name: 'input',
    type: 'string',
    description: 'Current value of the input field.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether a request is currently in progress.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error if any occurred.',
  },
  {
    name: 'data',
    type: 'CoreMessage | undefined',
    description:
      'Current assistant message being streamed (updates in real-time).',
  },
]

const actionReturnProps: PropDefinition[] = [
  {
    name: 'append',
    type: '(message: CoreMessage | Pick<CoreMessage, "role" | "content">, options?: { data?: Record<string, any> }) => Promise<string | null>',
    description:
      'Append a message and trigger assistant response. Returns message ID or null if aborted.',
  },
  {
    name: 'reload',
    type: '(options?: { data?: Record<string, any> }) => Promise<string | null>',
    description:
      'Retry the last user message. Removes messages after it and re-triggers response.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current stream and finalize the partial message.',
  },
  {
    name: 'abort',
    type: '() => void',
    description:
      'Abort the current request entirely. More aggressive than stop.',
  },
  {
    name: 'handleSubmit',
    type: '(event?: React.FormEvent, options?: { data?: Record<string, any> }) => void',
    description:
      'Form submission handler. Creates user message from input and triggers response.',
  },
  {
    name: 'setMessages',
    type: 'React.Dispatch<React.SetStateAction<CoreMessage[]>>',
    description: 'Directly set the messages array.',
  },
  {
    name: 'setInput',
    type: 'React.Dispatch<React.SetStateAction<string>>',
    description: 'Set the input field value.',
  },
]

const memoryInfoProps: PropDefinition[] = [
  {
    name: 'memoryInfo.enabled',
    type: 'boolean',
    description: 'Whether memory is currently enabled.',
  },
  {
    name: 'memoryInfo.memoryCount',
    type: 'number',
    description: 'Total number of memories stored.',
  },
  {
    name: 'memoryInfo.strategy',
    type: "'sliding-window' | 'semantic-chunks' | 'vector-store' | undefined",
    description: 'Currently configured memory strategy.',
  },
  {
    name: 'memoryInfo.lastContextSummary',
    type: 'string | undefined',
    description: 'Summary of the last memory context injected.',
  },
]

const memoryErrorInfoProps: PropDefinition[] = [
  {
    name: 'memoryErrorInfo.memoryError',
    type: 'Error | null',
    description: 'Last memory operation error if any.',
  },
  {
    name: 'memoryErrorInfo.memoryErrorOperation',
    type: "'query' | 'store' | null",
    description: 'The operation that caused the last error.',
  },
  {
    name: 'memoryErrorInfo.memoryErrorType',
    type: "'network' | 'ratelimit' | 'server' | 'auth' | 'memory' | 'unknown' | null",
    description: 'Classification of the error type for handling.',
  },
]

const tokenStatsProps: PropDefinition[] = [
  {
    name: 'tokenStats.inputTokens',
    type: 'number',
    description: 'Current number of input tokens.',
  },
  {
    name: 'tokenStats.remainingBudget',
    type: 'number',
    description: 'Remaining token budget.',
  },
  {
    name: 'tokenStats.utilization',
    type: 'number',
    description: 'Budget utilization as a decimal (0-1).',
  },
  {
    name: 'tokenStats.wasOptimized',
    type: 'boolean',
    description: 'Whether optimization was applied.',
  },
  {
    name: 'tokenStats.lastOptimizationReason',
    type: 'string | undefined',
    description: 'Reason for the last optimization if applied.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { useClarityChat } from '@clarity-chat/react'
import type {
  UseClarityChatOptions,
  UseClarityChatReturn,
  ClarityMemoryOptions,
  ClarityChatMemoryInfo,
  ClarityChatTokenStats,
  CoreMessage,
} from '@clarity-chat/react'`

const signatureCode = `function useClarityChat(
  options: UseClarityChatOptions
): UseClarityChatReturn`

const basicUsageCode = `import { useClarityChat } from '@clarity-chat/react'

function ChatComponent() {
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error,
  } = useClarityChat({
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

      {error && <div className="error">{error.message}</div>}

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

const streamingUsageCode = `import { useClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  const {
    messages,
    append,
    stop,
    isLoading,
    data, // Current streaming message
  } = useClarityChat({
    api: '/api/chat',
    stream: true,
    onFinish: (message) => {
      console.log('Stream finished:', message.id)
    },
    onError: (error) => {
      console.error('Stream error:', error)
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

const memoryUsageCode = `import { useClarityChat } from '@clarity-chat/react'
import { MemoryProvider } from '@clarity-chat/react'

// Wrap your app with MemoryProvider first
function App() {
  return (
    <MemoryProvider>
      <ChatWithMemory />
    </MemoryProvider>
  )
}

function ChatWithMemory() {
  const {
    messages,
    append,
    memoryInfo,
    memoryErrorInfo,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
      autoCapture: true,
      requireConsent: true,
      onConsentRequired: async () => {
        // Show consent dialog
        return await showConsentDialog()
      },
      maxTokens: 4000,
      retryOnError: true,
      maxRetryAttempts: 3,
      onMemoryError: (error, operation) => {
        console.error(\`Memory \${operation} failed:\`, error)
      },
    },
  })

  return (
    <div>
      {/* Memory status indicator */}
      <div className="memory-status">
        {memoryInfo.enabled ? (
          <span>
            Memory: {memoryInfo.memoryCount} items
            ({memoryInfo.strategy})
          </span>
        ) : (
          <span>Memory disabled</span>
        )}
      </div>

      {/* Memory error display */}
      {memoryErrorInfo.memoryError && (
        <div className="memory-error">
          Memory {memoryErrorInfo.memoryErrorOperation} failed:
          {memoryErrorInfo.memoryError.message}
          (Type: {memoryErrorInfo.memoryErrorType})
        </div>
      )}

      {/* Chat messages */}
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`

const optimizationUsageCode = `import { useClarityChat } from '@clarity-chat/react'

function OptimizedChat() {
  const {
    messages,
    append,
    tokenStats,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    promptOptimization: {
      enabled: true,
      targetTokens: 8192,
      strategy: 'hybrid', // Combines multiple strategies
      model: 'gpt-4', // For accurate token counting
      keepRecent: 3, // Always keep last 3 messages
      priorities: [
        { messageId: 'system-1', priority: 10, reason: 'System prompt' },
      ],
      summarizeFn: async (messages) => {
        // Custom summarization logic
        const response = await fetch('/api/summarize', {
          method: 'POST',
          body: JSON.stringify({ messages }),
        })
        const { summary } = await response.json()
        return summary
      },
    },
  })

  return (
    <div>
      {/* Token usage indicator */}
      {tokenStats && (
        <div className="token-stats">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: \`\${tokenStats.utilization * 100}%\` }}
            />
          </div>
          <span>
            {tokenStats.inputTokens} / {tokenStats.remainingBudget + tokenStats.inputTokens} tokens
            {tokenStats.wasOptimized && ' (optimized)'}
          </span>
        </div>
      )}

      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`

const handlersUsageCode = `import { useClarityChat, useChatHandlers } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

function ChatWithHandlers() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Get pre-built handlers for common operations
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      input={chat.input}
      onInputChange={chat.setInput}
      onSendMessage={handlers.onSendMessage}
      onStopGenerating={handlers.onStopGenerating}
      onRegenerateMessage={handlers.onRegenerateMessage}
      onEditMessage={handlers.onEditMessage}
      onDeleteMessage={handlers.onDeleteMessage}
      onCopyMessage={handlers.onCopyMessage}
    />
  )
}`

const typesCode = `// Core message type
interface CoreMessage {
  id?: string
  role: 'user' | 'assistant' | 'system' | 'function' | 'tool'
  content: CoreMessageContent
  name?: string
  toolCallId?: string
  toolInvocations?: Array<{
    toolCallId: string
    toolName: string
    args: Record<string, any>
    state: 'partial-call' | 'call' | 'result'
    result?: any
  }>
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
interface UseClarityChatOptions {
  api?: string
  initialMessages?: CoreMessage[]
  body?: Record<string, any>
  headers?: Record<string, string>
  credentials?: RequestCredentials
  fetch?: typeof fetch
  maxSteps?: number
  stream?: boolean
  transport?: 'sse' | 'websocket'
  memory?: ClarityMemoryOptions
  promptOptimization?: ClarityPromptOptimizationOptions
  websocket?: ClarityWebSocketOptions
  onResponse?: (response: Response) => void | Promise<void>
  onFinish?: (message: CoreMessage) => void | Promise<void>
  onError?: (error: Error) => void
  onMessageAppend?: (message: CoreMessage) => void
  transform?: (messages: CoreMessage[]) => CoreMessage[]
  keepLastMessageOnError?: boolean
  sendExtraMessageFields?: boolean
}

// Return interface
interface UseClarityChatReturn {
  // State
  messages: CoreMessage[]
  input: string
  isLoading: boolean
  error: Error | undefined
  data: CoreMessage | undefined

  // Actions
  append: (message: CoreMessage | Pick<CoreMessage, 'role' | 'content'>, options?: { data?: Record<string, any> }) => Promise<string | null>
  reload: (options?: { data?: Record<string, any> }) => Promise<string | null>
  stop: () => void
  abort: () => void
  handleSubmit: (event?: React.FormEvent, options?: { data?: Record<string, any> }) => void
  setMessages: React.Dispatch<React.SetStateAction<CoreMessage[]>>
  setInput: React.Dispatch<React.SetStateAction<string>>

  // Memory
  memoryInfo: ClarityChatMemoryInfo
  memoryErrorInfo: ClarityChatErrorInfo

  // Token optimization
  tokenStats?: ClarityChatTokenStats
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseClarityChatPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            {}
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
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Code2 className="w-6 h-6" aria-hidden="true" />
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
                useClarityChat
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                The primary hook for chat functionality in Clarity. Provides
                complete chat state management with streaming, memory
                integration, prompt optimization, and Vercel AI SDK
                compatibility. This is the recommended entry point for building
                custom chat interfaces.
              </p>
            </motion.header>

            {/* Feature highlights */}
            {}
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
                { icon: Zap, label: 'Streaming', desc: 'SSE & WebSocket' },
                {
                  icon: Database,
                  label: 'Memory',
                  desc: 'Context persistence',
                },
                {
                  icon: Brain,
                  label: 'Optimization',
                  desc: 'Token management',
                },
                {
                  icon: RefreshCw,
                  label: 'Retry',
                  desc: 'Built-in resilience',
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
                  <code>useClarityChat</code> is the top-level hook for chat
                  state management in Clarity. It wraps the mid-level{' '}
                  <code>useChatEnhanced</code> hook with additional
                  Clarity-specific features including memory integration,
                  transport selection, and prompt optimization.
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
                    <strong>Prompt Optimization:</strong> Automatic message
                    trimming to prevent context overflow
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Built-in retry with
                    exponential backoff
                  </li>
                  <li>
                    <strong>Vercel AI SDK Compatible:</strong> Drop-in
                    replacement for useChat
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Architecture Layer
                </h4>
                <p>
                  This hook is in the <strong>Top-Level (Drop-in Ready)</strong>{' '}
                  layer. For more control, use the mid-level{' '}
                  <code>useChatEnhanced</code> hook directly, or compose with{' '}
                  <code>useChatHandlers</code> for pre-built message operations.
                </p>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <div className="space-y-4">
                <div className="relative">
                  <CodeBlock
                    code={importCode}
                    language="tsx"
                    filename="Import"
                    showDownloadButton={false}
                  />
                </div>
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
                    <strong>Tip:</strong> The <code>api</code> option is the
                    only required parameter. All other options have sensible
                    defaults for quick setup.
                  </p>
                </div>
              </div>
            </Section>

            {/* Parameters Section */}
            <Section id="parameters" title="Parameters">
              <p className="text-muted-foreground mb-6">
                The hook accepts a single options object with the following
                properties, organized by feature area.
              </p>

              <SubSection id="core-options" title="Core Options">
                <PropsTable props={coreOptionsProps} />
              </SubSection>

              <SubSection id="memory-options" title="Memory Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure memory integration using the <code>memory</code>{' '}
                  option object. Requires <code>MemoryProvider</code> in the
                  component tree.
                </p>
                <PropsTable props={memoryOptionsProps} />
              </SubSection>

              <SubSection
                id="prompt-optimization-options"
                title="Prompt Optimization Options"
              >
                <p className="text-sm text-muted-foreground mb-4">
                  Configure prompt optimization using the{' '}
                  <code>promptOptimization</code> option object.
                </p>
                <PropsTable props={promptOptimizationProps} />
              </SubSection>

              <SubSection id="websocket-options" title="WebSocket Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure WebSocket behavior when <code>transport</code> is
                  set to <code>&quot;websocket&quot;</code>.
                </p>
                <PropsTable props={websocketOptionsProps} />
              </SubSection>

              <SubSection id="callback-options" title="Callback Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Event callbacks for response lifecycle and message handling.
                </p>
                <PropsTable props={callbackOptionsProps} />
              </SubSection>
            </Section>

            {/* Return Value Section */}
            <Section id="returns" title="Return Value">
              <p className="text-muted-foreground mb-6">
                The hook returns an object with state, actions, and information
                about memory and token optimization.
              </p>

              <SubSection id="state-properties" title="State Properties">
                <PropsTable props={stateReturnProps} />
              </SubSection>

              <SubSection id="action-methods" title="Action Methods">
                <PropsTable props={actionReturnProps} />
              </SubSection>

              <SubSection id="memory-info" title="Memory Information">
                <p className="text-sm text-muted-foreground mb-4">
                  Information about memory state returned via{' '}
                  <code>memoryInfo</code> and <code>memoryErrorInfo</code>.
                </p>
                <PropsTable props={memoryInfoProps} title="memoryInfo" />
                <div className="mt-4">
                  <PropsTable
                    props={memoryErrorInfoProps}
                    title="memoryErrorInfo"
                  />
                </div>
              </SubSection>

              <SubSection id="token-stats" title="Token Statistics">
                <p className="text-sm text-muted-foreground mb-4">
                  Token usage statistics returned via <code>tokenStats</code>{' '}
                  when prompt optimization is enabled.
                </p>
                <PropsTable props={tokenStatsProps} />
              </SubSection>
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

              <SubSection id="example-streaming" title="With Streaming">
                <p className="text-muted-foreground mb-4">
                  Handle real-time streaming responses with stop functionality:
                </p>
                <CodeBlock
                  code={streamingUsageCode}
                  language="tsx"
                  filename="StreamingChat.tsx"
                />
              </SubSection>

              <SubSection id="example-memory" title="With Memory">
                <p className="text-muted-foreground mb-4">
                  Enable conversation memory for context persistence:
                </p>
                <CodeBlock
                  code={memoryUsageCode}
                  language="tsx"
                  filename="MemoryChat.tsx"
                />
              </SubSection>

              <SubSection
                id="example-optimization"
                title="With Prompt Optimization"
              >
                <p className="text-muted-foreground mb-4">
                  Prevent context overflow with automatic token management:
                </p>
                <CodeBlock
                  code={optimizationUsageCode}
                  language="tsx"
                  filename="OptimizedChat.tsx"
                />
              </SubSection>

              <SubSection id="example-handlers" title="With Chat Handlers">
                <p className="text-muted-foreground mb-4">
                  Compose with <code>useChatHandlers</code> for pre-built
                  message operations:
                </p>
                <CodeBlock
                  code={handlersUsageCode}
                  language="tsx"
                  filename="ChatWithHandlers.tsx"
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
                    name: 'ClarityChat',
                    type: 'component',
                    description:
                      'Drop-in component that uses this hook internally',
                    href: '/reference/components/clarity-chat',
                  },
                  {
                    name: 'useChatHandlers',
                    type: 'hook',
                    description:
                      'Pre-built handlers for edit, delete, regenerate operations',
                    href: '/reference/hooks/use-chat-handlers',
                  },
                  {
                    name: 'useClarityChatWithTools',
                    type: 'hook',
                    description: 'Extended version with tool calling support',
                    href: '/reference/hooks/use-clarity-chat-with-tools',
                  },
                  {
                    name: 'ChatWindow',
                    type: 'component',
                    description: 'UI component for rendering chat messages',
                    href: '/reference/components/chat-window',
                  },
                  {
                    name: 'MemoryProvider',
                    type: 'component',
                    description: 'Required provider for memory features',
                    href: '/reference/components/memory-provider',
                  },
                  {
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description: 'Advanced token monitoring with auto-trim',
                    href: '/api/reference/hooks/use-token-budget-monitor',
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
                  href="/reference/hooks"
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
                      Hooks Overview
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-clarity-chat-with-tools"
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
                      useClarityChatWithTools
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
