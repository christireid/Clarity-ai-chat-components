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
  Brain,
  BookOpen,
  RefreshCw,
  Timer,
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
// Main Page Component
// ============================================================================

export default function StreamingMessagePage() {
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
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Low-Level
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                StreamingMessage
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A component for displaying AI responses with
                character-by-character streaming animation, tool call
                visualization, thinking steps, citations, and error states.
                Features smooth streaming for a polished, readable experience.
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
                  label: 'Smooth Streaming',
                  desc: 'Consistent pace',
                },
                { icon: Wrench, label: 'Tool Calls', desc: 'Approve/reject' },
                {
                  icon: Brain,
                  label: 'Thinking Steps',
                  desc: 'Chain-of-thought',
                },
                { icon: BookOpen, label: 'Citations', desc: 'Source display' },
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

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'MessageList',
                    type: 'component',
                    description:
                      'Container for rendering messages with animations',
                    href: '/reference/components/message-list',
                  },
                  {
                    name: 'Message',
                    type: 'component',
                    description: 'Base message bubble component',
                    href: '/reference/components/message',
                  },
                  {
                    name: 'ThinkingIndicator',
                    type: 'component',
                    description: 'Standalone thinking/processing indicator',
                    href: '/reference/components/thinking-indicator',
                  },
                  {
                    name: 'ToolInvocationCard',
                    type: 'component',
                    description: 'Detailed tool call display component',
                    href: '/reference/components/tool-invocation-card',
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
                  href="/reference/components/message"
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
                      Message
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
