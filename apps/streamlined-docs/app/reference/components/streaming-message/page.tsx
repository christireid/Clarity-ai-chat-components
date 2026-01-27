'use client'

/**
 * StreamingMessage Component - API Reference Documentation
 *
 * Displays AI responses with support for token-by-token streaming, smooth text
 * animation, tool call visualization, thinking steps, citations, and error states.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Wrench,
  AlertTriangle,
  Brain,
  BookOpen,
  RefreshCw,
  Waves,
  Radio,
  Wifi,
  Activity,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'
import { DocumentationPage } from '@/components/Docs/DocumentationPage'
import type { TocItem } from '@/components/Docs/TableOfContents'

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
  const [content, setContent] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [smoothStreaming, setSmoothStreaming] = React.useState(true)
  const [streamingSpeed, setStreamingSpeed] = React.useState<
    'fast' | 'normal' | 'slow'
  >('normal')
  const [showThinking, setShowThinking] = React.useState(false)
  const [thinkingSteps, setThinkingSteps] = React.useState<string[]>([])
  const [currentThinkingStep, setCurrentThinkingStep] = React.useState<
    string | undefined
  >(undefined)

  const sampleText =
    'StreamingMessage renders AI responses with smooth character-by-character animation. It supports tool calls, thinking steps, citations, and error handling. The smooth streaming feature buffers incoming tokens and displays them at a consistent, readable pace for a polished user experience.'

  const startStreaming = async () => {
    setContent('')
    setIsStreaming(true)
    setThinkingSteps([])
    setCurrentThinkingStep(undefined)

    // Simulate thinking phase
    if (showThinking) {
      setCurrentThinkingStep('Understanding the question...')
      await new Promise((r) => setTimeout(r, 800))
      setThinkingSteps(['Understanding the question...'])

      setCurrentThinkingStep('Gathering relevant information...')
      await new Promise((r) => setTimeout(r, 600))
      setThinkingSteps((prev) => [...prev, 'Gathering relevant information...'])

      setCurrentThinkingStep('Formulating response...')
      await new Promise((r) => setTimeout(r, 500))
      setThinkingSteps((prev) => [...prev, 'Formulating response...'])
      setCurrentThinkingStep(undefined)
    }

    // Stream content
    const chunkSize =
      streamingSpeed === 'fast' ? 8 : streamingSpeed === 'slow' ? 2 : 4
    const delay =
      streamingSpeed === 'fast' ? 20 : streamingSpeed === 'slow' ? 80 : 40

    for (let i = 0; i <= sampleText.length; i += chunkSize) {
      setContent(sampleText.slice(0, i))
      await new Promise((r) => setTimeout(r, delay))
    }

    setContent(sampleText)
    setIsStreaming(false)
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={smoothStreaming}
            onChange={(e) => setSmoothStreaming(e.target.checked)}
            className="rounded"
          />
          Smooth Streaming
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showThinking}
            onChange={(e) => setShowThinking(e.target.checked)}
            className="rounded"
          />
          Show Thinking
        </label>
        <select
          value={streamingSpeed}
          onChange={(e) =>
            setStreamingSpeed(e.target.value as 'fast' | 'normal' | 'slow')
          }
          className="text-sm px-2 py-1 rounded border border-border/50 bg-background"
        >
          <option value="fast">Fast (120 cps)</option>
          <option value="normal">Normal (80 cps)</option>
          <option value="slow">Slow (50 cps)</option>
        </select>
        <button
          onClick={startStreaming}
          disabled={isStreaming}
          className="text-sm px-3 py-1.5 rounded bg-brand-500 text-white hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          {isStreaming ? 'Streaming...' : 'Start Demo'}
        </button>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-lg">
        {/* Header */}
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span className="text-sm font-medium">StreamingMessage Demo</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {content.length} / {sampleText.length} characters
          </span>
        </div>

        {/* Content Area */}
        <div className="p-6 min-h-[200px] bg-background/50">
          {/* Thinking Steps */}
          <AnimatePresence>
            {showThinking &&
              (thinkingSteps.length > 0 || currentThinkingStep) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 p-4 rounded-lg bg-blue-500/5 border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">
                        Thinking...
                      </h4>
                      {thinkingSteps.map((step, i) => (
                        <div
                          key={i}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <Check className="w-4 h-4 text-green-500" />
                          {step}
                        </div>
                      ))}
                      {currentThinkingStep && (
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                          {currentThinkingStep}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
          </AnimatePresence>

          {/* Message Content */}
          {content || !isStreaming ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground">
                {smoothStreaming ? content : content}
                {isStreaming && (
                  <motion.span
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      stiffness: 100,
                      repeat: Infinity,
                    }}
                    className="inline-block ml-1"
                  >
                    &#9612;
                  </motion.span>
                )}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="text-sm">Starting stream...</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          Smooth Streaming Explained
        </h4>
        <p className="text-sm text-muted-foreground">
          When <code>smoothStreaming</code> is enabled, tokens are buffered and
          released at a consistent rate (characters per second) for a polished
          experience. This prevents the jarring effect of variable-speed token
          arrival from the API.
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const coreProps: PropDefinition[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Accumulated message content to display.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Whether streaming is currently in progress. Shows cursor.',
  },
  {
    name: 'error',
    type: 'string',
    description:
      'Error message if streaming failed. Shows error UI with retry option.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

const displayProps: PropDefinition[] = [
  {
    name: 'toolCalls',
    type: 'ToolCall[]',
    default: '[]',
    description: 'Tool calls made during streaming.',
  },
  {
    name: 'citations',
    type: 'Citation[]',
    default: '[]',
    description: 'Citations/sources for the response.',
  },
  {
    name: 'thinkingSteps',
    type: 'string[]',
    default: '[]',
    description: 'Completed thinking steps (chain-of-thought).',
  },
  {
    name: 'currentThinkingStep',
    type: 'string',
    description: 'Current thinking step being processed.',
  },
  {
    name: 'showThinking',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show thinking steps UI.',
  },
  {
    name: 'showCitations',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show citations inline.',
  },
  {
    name: 'showTools',
    type: 'boolean',
    default: 'true',
    description: 'Whether to show tool call UI.',
  },
]

const streamingProps: PropDefinition[] = [
  {
    name: 'smoothStreaming',
    type: 'boolean',
    default: 'false',
    description:
      'Enable smooth text animation. Buffers content and renders at consistent pace.',
  },
  {
    name: 'streamingSpeed',
    type: "'fast' | 'normal' | 'slow'",
    default: "'normal'",
    description:
      'Speed for smooth streaming. fast=120cps, normal=80cps, slow=50cps.',
  },
]

const callbackProps: PropDefinition[] = [
  {
    name: 'onToolApprove',
    type: '(toolCall: ToolCall) => void',
    description: 'Callback when a tool call is approved.',
  },
  {
    name: 'onToolReject',
    type: '(toolCall: ToolCall) => void',
    description: 'Callback when a tool call is rejected.',
  },
  {
    name: 'onRetry',
    type: '() => void',
    description: 'Callback when retry is requested after an error.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { StreamingMessage } from '@clarity-chat/react'
import type { StreamingMessageProps, ToolCall, Citation } from '@clarity-chat/react'`

const basicUsageCode = `import { StreamingMessage } from '@clarity-chat/react'

function AIResponse({ content, isStreaming }) {
  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
    />
  )
}`

const smoothStreamingCode = `import { StreamingMessage } from '@clarity-chat/react'

function SmoothAIResponse({ content, isStreaming }) {
  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      smoothStreaming={true}
      streamingSpeed="normal" // 'fast' | 'normal' | 'slow'
    />
  )
}

// Speed options:
// - 'fast': 120 characters per second - snappy, responsive
// - 'normal': 80 characters per second - comfortable reading
// - 'slow': 50 characters per second - deliberate, thoughtful`

const withToolsCode = `import { StreamingMessage } from '@clarity-chat/react'
import type { ToolCall } from '@clarity-chat/react'

function AIResponseWithTools({ content, isStreaming, toolCalls }) {
  const handleToolApprove = (tool: ToolCall) => {
    console.log('Approved tool:', tool.function.name)
    executeToolCall(tool)
  }

  const handleToolReject = (tool: ToolCall) => {
    console.log('Rejected tool:', tool.function.name)
  }

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      toolCalls={toolCalls}
      showTools={true}
      onToolApprove={handleToolApprove}
      onToolReject={handleToolReject}
    />
  )
}

// Tool call structure
const exampleToolCall: ToolCall = {
  id: 'call_123',
  type: 'function',
  function: {
    name: 'web_search',
    arguments: JSON.stringify({ query: 'latest news' }),
  },
}`

const withThinkingCode = `import { StreamingMessage } from '@clarity-chat/react'

function AIResponseWithThinking() {
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string>()
  const [content, setContent] = useState('')

  // These would be populated from your streaming response
  // Example: OpenAI's new reasoning models return thinking steps

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      thinkingSteps={thinkingSteps}
      currentThinkingStep={currentStep}
      showThinking={true}
      citations={[
        {
          id: 'cite_1',
          source: 'Wikipedia',
          chunkText: 'Relevant information...',
          confidence: 0.95,
        },
      ]}
      showCitations={true}
    />
  )
}`

const sseIntegrationCode = `import { StreamingMessage } from '@clarity-chat/react'
import { useStreamingSSE } from '@clarity-chat/react'

function SSEStreamingChat() {
  const { data, status, error, connect, disconnect } = useStreamingSSE({
    url: '/api/chat/stream',
    method: 'POST',
    body: { message: 'Tell me about quantum computing' },
    authToken: 'your-auth-token',
    autoReconnect: true,
    onMessage: (event) => {
      // Handle special events
      if (event.type === 'thinking') {
        console.log('AI is thinking:', event.data)
      }
    },
  })

  return (
    <div>
      <button onClick={connect} disabled={status !== 'idle'}>
        Start Stream
      </button>
      <button onClick={disconnect} disabled={status === 'idle'}>
        Cancel
      </button>

      <StreamingMessage
        content={data}
        isStreaming={status === 'streaming'}
        error={error?.message}
        smoothStreaming={true}
        streamingSpeed="normal"
      />
    </div>
  )
}`

const websocketIntegrationCode = `import { StreamingMessage } from '@clarity-chat/react'
import { useStreamingWebSocket } from '@clarity-chat/react'

function WebSocketStreamingChat() {
  const [content, setContent] = useState('')
  const { status, connect, disconnect, send } = useStreamingWebSocket({
    url: 'wss://api.example.com/chat',
    autoReconnect: true,
    enableHeartbeat: true,
    onMessage: (message) => {
      if (message.data.type === 'content') {
        setContent(prev => prev + message.data.chunk)
      }
    },
  })

  const handleSendMessage = () => {
    send({ type: 'chat', content: 'Hello!' })
  }

  return (
    <div>
      <button onClick={connect} disabled={status === 'connected'}>
        Connect
      </button>
      <button onClick={handleSendMessage} disabled={status !== 'connected'}>
        Send Message
      </button>

      <StreamingMessage
        content={content}
        isStreaming={status === 'connected'}
        smoothStreaming={true}
      />
    </div>
  )
}`

const typescriptCode = `// Main component props
interface StreamingMessageProps {
  /** Accumulated message content */
  content: string
  /** Whether streaming is in progress */
  isStreaming?: boolean
  /** Tool calls made during streaming */
  toolCalls?: ToolCall[]
  /** Citations/sources */
  citations?: Citation[]
  /** Thinking steps (chain-of-thought) */
  thinkingSteps?: string[]
  /** Current thinking step being processed */
  currentThinkingStep?: string
  /** Error message if streaming failed */
  error?: string
  /** Show thinking steps */
  showThinking?: boolean
  /** Show citations inline */
  showCitations?: boolean
  /** Show tool calls */
  showTools?: boolean
  /** Callback when tool needs approval */
  onToolApprove?: (toolCall: ToolCall) => void
  /** Callback when tool is rejected */
  onToolReject?: (toolCall: ToolCall) => void
  /** Callback when retry is requested after an error */
  onRetry?: () => void
  /** Additional CSS class */
  className?: string
  /** Enable smooth text streaming animation */
  smoothStreaming?: boolean
  /** Speed for smooth streaming */
  streamingSpeed?: 'fast' | 'normal' | 'slow'
}

// Tool call type
interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}

// Citation type
interface Citation {
  id: string
  source: string
  chunkText: string
  confidence?: number // 0-1
  url?: string
}

// Streaming speeds (characters per second)
const STREAMING_SPEEDS = {
  fast: 120,   // ~7200 chars/min
  normal: 80,  // ~4800 chars/min
  slow: 50,    // ~3000 chars/min
}`

// ============================================================================
// SSE vs WebSocket Comparison Component
// ============================================================================

function StreamingComparison() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* SSE */}
      <div className="p-6 rounded-lg border border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Radio className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">
              Server-Sent Events (SSE)
            </h4>
            <p className="text-xs text-muted-foreground">Unidirectional</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Simple HTTP/2</p>
              <p className="text-xs text-muted-foreground">
                Works through firewalls, auto-reconnects
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Low Latency</p>
              <p className="text-xs text-muted-foreground">
                Ideal for OpenAI/Anthropic streaming
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Built-in Resume</p>
              <p className="text-xs text-muted-foreground">
                Last-Event-ID for continuation
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Best For:
          </p>
          <p className="text-sm text-foreground">
            AI responses, notifications, one-way updates
          </p>
        </div>
      </div>

      {/* WebSocket */}
      <div className="p-6 rounded-lg border border-border/50 bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Wifi className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground">WebSocket</h4>
            <p className="text-xs text-muted-foreground">Bidirectional</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Full Duplex</p>
              <p className="text-xs text-muted-foreground">
                Real-time two-way communication
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Binary Support</p>
              <p className="text-xs text-muted-foreground">
                Text and binary messages
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Persistent</p>
              <p className="text-xs text-muted-foreground">
                Long-lived connection
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Best For:
          </p>
          <p className="text-sm text-foreground">
            Chat, collaborative editing, gaming
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function StreamingMessagePage() {
  const tableOfContents: TocItem[] = [
    { id: 'overview', title: 'Overview' },
    { id: 'installation', title: 'Installation' },
    { id: 'demo', title: 'Live Demo' },
    { id: 'basic-usage', title: 'Basic Usage' },
    {
      id: 'props',
      title: 'Props Reference',
      children: [
        { id: 'core-props', title: 'Core Props' },
        { id: 'display-props', title: 'Display Props' },
        { id: 'streaming-props', title: 'Streaming Props' },
        { id: 'callback-props', title: 'Callbacks' },
      ],
    },
    {
      id: 'examples',
      title: 'Examples',
      children: [
        { id: 'example-basic', title: 'Basic Streaming' },
        { id: 'example-smooth', title: 'Smooth Streaming' },
        { id: 'example-tools', title: 'With Tool Calls' },
        { id: 'example-thinking', title: 'With Thinking Steps' },
        { id: 'example-sse', title: 'SSE Integration' },
        { id: 'example-websocket', title: 'WebSocket Integration' },
      ],
    },
    { id: 'sse-vs-websocket', title: 'SSE vs WebSocket' },
    { id: 'streaming-hooks', title: 'Related Hooks' },
    { id: 'typescript', title: 'TypeScript' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'troubleshooting', title: 'Troubleshooting' },
    { id: 'related', title: 'Related' },
  ]

  return (
    <DocumentationPage
      title="StreamingMessage"
      description="A component for displaying AI responses with character-by-character streaming animation, tool call visualization, thinking steps, citations, and error states. Features smooth streaming for a polished, readable experience."
      icon={Sparkles}
      badges={[
        { label: 'Stable', variant: 'stable' },
        { label: 'Low-Level', variant: 'beta' },
      ]}
      packageName="@clarity-chat/react"
      features={[
        {
          icon: Zap,
          label: 'Smooth Streaming',
          description: 'Consistent rendering pace',
        },
        {
          icon: Wrench,
          label: 'Tool Calls',
          description: 'Approve/reject actions',
        },
        {
          icon: Brain,
          label: 'Thinking Steps',
          description: 'Chain-of-thought display',
        },
        {
          icon: BookOpen,
          label: 'Citations',
          description: 'Source references',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'MessageList',
          type: 'component',
          description: 'Container for rendering messages with animations',
          href: '/reference/components/message-list',
        },
        {
          name: 'Message',
          type: 'component',
          description: 'Base message bubble component',
          href: '/reference/components/message',
        },
        {
          name: 'useStreaming',
          type: 'hook',
          description: 'Low-level ReadableStream processing hook',
          href: '/reference/hooks/use-streaming',
        },
        {
          name: 'useStreamingSSE',
          type: 'hook',
          description: 'Server-Sent Events streaming hook',
          href: '/reference/hooks/use-streaming-sse',
        },
        {
          name: 'useStreamingWebSocket',
          type: 'hook',
          description: 'WebSocket streaming hook with reconnection',
          href: '/reference/hooks/use-streaming-websocket',
        },
      ]}
      footerNavigation={[
        {
          label: 'MessageList',
          href: '/reference/components/message-list',
          direction: 'previous',
        },
        {
          label: 'Message',
          href: '/reference/components/message',
          direction: 'next',
        },
      ]}
    >

      {/* Overview Section */}
      <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>StreamingMessage</code> handles the complexity of
                  displaying AI responses during streaming. It provides a
                  polished UX with animated cursor, smooth text rendering, and
                  support for advanced features like tool calls and thinking
                  steps.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Smooth Streaming:</strong> Buffers incoming tokens
                    and renders at a consistent, readable pace
                  </li>
                  <li>
                    <strong>Animated Cursor:</strong> Spring-physics pulse
                    animation during active streaming
                  </li>
                  <li>
                    <strong>Tool Calls:</strong> Displays function calls with
                    approve/reject buttons for human-in-the-loop
                  </li>
                  <li>
                    <strong>Thinking Steps:</strong> Shows chain-of-thought
                    reasoning as it progresses
                  </li>
                  <li>
                    <strong>Citations:</strong> Inline source display with
                    confidence scores
                  </li>
                  <li>
                    <strong>Error Handling:</strong> Error state with retry
                    button
                  </li>
                  <li>
                    <strong>Partial JSON:</strong> Safely parses and renders
                    incomplete JSON during streaming
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Smooth Streaming
                </h4>
                <p>
                  The <code>smoothStreaming</code> feature solves the common UX
                  problem of variable token arrival speed. Instead of showing
                  text in jarring chunks, it buffers content and releases it at
                  60fps with configurable character-per-second rates.
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

                <p className="text-muted-foreground">Import the component:</p>

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
                Try the StreamingMessage component. Toggle smooth streaming,
                adjust speed, and enable thinking steps to see the various
                features.
              </p>

              <LiveDemo />
            </Section>

            {/* Basic Usage Section */}
            <Section id="basic-usage" title="Basic Usage">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  The simplest usage passes content and streaming state:
                </p>

                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="AIResponse.tsx"
                />
              </div>
            </Section>

            {/* Props API Section */}
            <Section id="props" title="Props Reference">
              <SubSection id="core-props" title="Core Props">
                <PropsTable props={coreProps} />
              </SubSection>

              <SubSection id="display-props" title="Display Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure what additional content to display:
                </p>
                <PropsTable props={displayProps} />
              </SubSection>

              <SubSection id="streaming-props" title="Streaming Props">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure the streaming animation behavior:
                </p>
                <PropsTable props={streamingProps} />
              </SubSection>

              <SubSection id="callback-props" title="Callbacks">
                <p className="text-sm text-muted-foreground mb-4">
                  Handle user interactions:
                </p>
                <PropsTable props={callbackProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Streaming">
                <p className="text-muted-foreground mb-4">
                  Simple streaming message:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicStreaming.tsx"
                />
              </SubSection>

              <SubSection id="example-smooth" title="Smooth Streaming">
                <p className="text-muted-foreground mb-4">
                  Enable smooth animation for consistent text rendering:
                </p>
                <CodeBlock
                  code={smoothStreamingCode}
                  language="tsx"
                  filename="SmoothStreaming.tsx"
                />
              </SubSection>

              <SubSection id="example-tools" title="With Tool Calls">
                <p className="text-muted-foreground mb-4">
                  Display and handle tool calls:
                </p>
                <CodeBlock
                  code={withToolsCode}
                  language="tsx"
                  filename="StreamingWithTools.tsx"
                />
              </SubSection>

              <SubSection id="example-thinking" title="With Thinking Steps">
                <p className="text-muted-foreground mb-4">
                  Show chain-of-thought reasoning:
                </p>
                <CodeBlock
                  code={withThinkingCode}
                  language="tsx"
                  filename="StreamingWithThinking.tsx"
                />
              </SubSection>

              <SubSection id="example-sse" title="SSE Integration">
                <p className="text-muted-foreground mb-4">
                  Complete example with useStreamingSSE:
                </p>
                <CodeBlock
                  code={sseIntegrationCode}
                  language="tsx"
                  filename="SSEIntegration.tsx"
                />
              </SubSection>

              <SubSection id="example-websocket" title="WebSocket Integration">
                <p className="text-muted-foreground mb-4">
                  Complete example with useStreamingWebSocket:
                </p>
                <CodeBlock
                  code={websocketIntegrationCode}
                  language="tsx"
                  filename="WebSocketIntegration.tsx"
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
                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Reduced Motion
                </h4>
                <p>
                  StreamingMessage respects <code>prefers-reduced-motion</code>.
                  When enabled:
                </p>
                <ul className="space-y-2">
                  <li>Cursor pulse animation is disabled</li>
                  <li>Slide animations become fade transitions</li>
                  <li>Spring physics are replaced with instant transitions</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Screen Readers
                </h4>
                <ul className="space-y-2">
                  <li>
                    Cursor uses <code>aria-hidden="true"</code> to prevent
                    announcement
                  </li>
                  <li>
                    Error states use <code>role="alert"</code> for immediate
                    announcement
                  </li>
                  <li>Tool call buttons have descriptive labels</li>
                  <li>Citations include source names in accessible text</li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Focus Management
                </h4>
                <p>
                  Tool approval buttons are focusable with clear visual focus
                  indicators. Error retry buttons receive appropriate focus
                  after error display.
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
                        Text appears choppy
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Enable <code>smoothStreaming={'{true}'}</code> for
                          consistent rendering
                        </li>
                        <li>
                          Try <code>streamingSpeed="slow"</code> for more
                          deliberate pacing
                        </li>
                        <li>
                          Check if your API is sending tokens in large batches
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
                        JSON rendering incorrectly
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          The component safely parses partial JSON during
                          streaming
                        </li>
                        <li>Complete JSON is formatted in a code block</li>
                        <li>Incomplete JSON shows the raw text with cursor</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Tool calls not showing
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>showTools={'{true}'}</code> (default)
                        </li>
                        <li>
                          Verify <code>toolCalls</code> array has items with
                          correct structure
                        </li>
                        <li>
                          Each tool call needs <code>id</code>,{' '}
                          <code>function.name</code>, and{' '}
                          <code>function.arguments</code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

      {/* SSE vs WebSocket Section */}
      <Section id="sse-vs-websocket" title="SSE vs WebSocket">
        <p className="text-muted-foreground mb-6">
          Choose the right transport protocol for your streaming needs:
        </p>
        <StreamingComparison />

        <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <Activity className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold text-foreground mb-2">
                Recommendation
              </h4>
              <p className="text-sm text-muted-foreground">
                For AI response streaming (OpenAI, Anthropic, etc.), use{' '}
                <strong>SSE</strong> with <code>useStreamingSSE</code>. For
                interactive chat with user input during streaming, use{' '}
                <strong>WebSocket</strong> with{' '}
                <code>useStreamingWebSocket</code>.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Related Streaming Hooks Section */}
      <Section id="streaming-hooks" title="Related Streaming Hooks">
        <p className="text-muted-foreground mb-6">
          StreamingMessage works with these low-level and mid-level streaming
          hooks:
        </p>

        <div className="space-y-4">
          {/* useStreaming */}
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Waves className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">useStreaming</h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  hook
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Low-level primitive for processing ReadableStream with automatic
              text decoding and accumulation.
            </p>
            <CodeBlock
              code={`const { content, isStreaming, startStreaming } = useStreaming({
  onChunk: (chunk) => console.log('Chunk:', chunk),
  onComplete: (full) => console.log('Done:', full),
})

// Use with fetch
const response = await fetch('/api/stream')
await startStreaming(response.body)`}
              language="tsx"
              showLineNumbers={false}
            />
          </div>

          {/* useStreamingSSE */}
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Radio className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  useStreamingSSE
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  hook
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Mid-level hook for Server-Sent Events with automatic reconnection,
              heartbeat monitoring, and event parsing.
            </p>
            <CodeBlock
              code={`const { data, status, connect, disconnect } = useStreamingSSE({
  url: '/api/chat/stream',
  method: 'POST',
  body: { message: 'Hello' },
  authToken: user.token,
  onMessage: (event) => {
    console.log('Event:', event.type, event.data)
  },
})

// StreamingMessage integration
<StreamingMessage
  content={data}
  isStreaming={status === 'streaming'}
/>`}
              language="tsx"
              showLineNumbers={false}
            />
          </div>

          {/* useStreamingWebSocket */}
          <div className="p-4 rounded-lg border border-border/50 bg-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Wifi className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">
                  useStreamingWebSocket
                </h4>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  hook
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Mid-level hook for WebSocket connections with automatic
              reconnection, heartbeat/ping-pong, and bidirectional messaging.
            </p>
            <CodeBlock
              code={`const { lastMessage, status, connect, send } = useStreamingWebSocket({
  url: 'wss://api.example.com/chat',
  autoReconnect: true,
  enableHeartbeat: true,
  onMessage: (msg) => {
    console.log('Message:', msg.data)
  },
})

// StreamingMessage integration
<StreamingMessage
  content={lastMessage?.data || ''}
  isStreaming={status === 'connected'}
/>`}
              language="tsx"
              showLineNumbers={false}
            />
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
