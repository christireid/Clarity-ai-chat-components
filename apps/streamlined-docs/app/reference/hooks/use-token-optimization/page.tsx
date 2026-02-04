'use client'

/**
 * useTokenOptimization Hook - API Reference Documentation
 *
 * Comprehensive documentation for the useContextWindow hook (also known as useTokenOptimization).
 * This hook provides complete token optimization with compression, caching, and context management
 * to achieve 50-70% cost reduction in React applications.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Gauge,
  Coins,
  Zap,
  AlertTriangle,
  TrendingDown,
  Calculator,
  Layers,
  PiggyBank,
  Sparkles,
  Maximize2,
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
  { id: 'cost-impact', title: 'Cost Impact' },
  { id: 'import', title: 'Import' },
  { id: 'signature', title: 'Signature' },
  {
    id: 'configuration',
    title: 'Configuration',
    children: [
      { id: 'core-config', title: 'Core Options' },
      { id: 'compression-config', title: 'Compression Options' },
      { id: 'strategy-config', title: 'Strategy Selection' },
    ],
  },
  {
    id: 'return-values',
    title: 'Return Values',
    children: [
      { id: 'state-properties', title: 'State' },
      { id: 'action-methods', title: 'Methods' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-compression', title: 'With Compression' },
      { id: 'example-strategies', title: 'Memory Strategies' },
      { id: 'example-rsc', title: 'React Server Components' },
      { id: 'example-advanced', title: 'Advanced Patterns' },
    ],
  },
  { id: 'performance', title: 'Performance Considerations' },
  { id: 'best-practices', title: 'Best Practices' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
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

const coreConfigProps: PropDefinition[] = [
  {
    name: 'maxTokens',
    type: 'number',
    required: true,
    description:
      'Maximum token limit for the context window (e.g., 128000 for GPT-4o).',
  },
  {
    name: 'strategy',
    type: "'buffer' | 'bufferWindow' | 'summaryBuffer'",
    default: "'buffer'",
    description:
      'Context management strategy. Buffer keeps all, bufferWindow keeps last k messages, summaryBuffer summarizes old ones.',
  },
  {
    name: 'reservedTokens',
    type: 'number',
    default: '4000',
    description: 'Tokens reserved for model output and system messages.',
  },
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description:
      'Model identifier for accurate token counting (e.g., "gpt-4o", "claude-sonnet-4").',
  },
  {
    name: 'windowSize',
    type: 'number',
    default: '10',
    description:
      'Number of recent messages to keep verbatim (for bufferWindow and summaryBuffer strategies).',
  },
  {
    name: 'summarizer',
    type: '(messages: ChatMessage[]) => Promise<string>',
    description:
      'Custom function to summarize old messages. Defaults to basic concatenation.',
  },
]

const compressionConfigProps: PropDefinition[] = [
  {
    name: 'enableCompression',
    type: 'boolean',
    default: 'false',
    description:
      'Enable message compression before summarization. Can achieve 50-80% token reduction.',
  },
  {
    name: 'compressionOptions.strategy',
    type: "'llmlingua' | 'extractive' | 'adaptive' | 'none'",
    default: "'adaptive'",
    description:
      'Compression algorithm: llmlingua (token-level), extractive (sentence-level), adaptive (auto-select), none (disabled).',
  },
  {
    name: 'compressionOptions.targetRatio',
    type: 'number',
    default: '0.5',
    description:
      'Target compression ratio (0.1-1.0). Lower values = more aggressive. 0.5 means 50% of original size.',
  },
  {
    name: 'compressionOptions.minQuality',
    type: 'number',
    default: '0.7',
    description:
      'Minimum quality threshold (0-1). Prevents over-compression that loses important information.',
  },
  {
    name: 'compressionOptions.llmlinguaOptions',
    type: 'Partial<LLMLinguaOptions>',
    description:
      'Advanced LLMLingua-specific options (compression strength, context budget, etc.).',
  },
  {
    name: 'compressionOptions.extractiveOptions',
    type: 'Partial<ExtractiveOptions>',
    description:
      'Advanced extractive compression options (sentence selection, ranking, etc.).',
  },
  {
    name: 'compressionOptions.adaptiveOptions',
    type: 'Partial<AdaptiveOptions>',
    description:
      'Advanced adaptive compression options (auto-tuning thresholds, etc.).',
  },
]

const stateReturnProps: PropDefinition[] = [
  {
    name: 'state.messages',
    type: 'ChatMessage[]',
    description: 'Current managed messages in the context window.',
  },
  {
    name: 'state.totalTokens',
    type: 'number',
    description: 'Total tokens currently in use.',
  },
  {
    name: 'state.availableTokens',
    type: 'number',
    description: 'Remaining tokens available within the limit.',
  },
  {
    name: 'state.utilizationPercent',
    type: 'number',
    description: 'Percentage of context window used (0-100).',
  },
  {
    name: 'state.summarizedCount',
    type: 'number',
    description:
      'Number of messages that have been summarized (summaryBuffer strategy only).',
  },
  {
    name: 'state.summary',
    type: 'string | null',
    description:
      'Current summary of old messages (summaryBuffer strategy only).',
  },
  {
    name: 'state.isOptimized',
    type: 'boolean',
    description:
      'Whether optimization (compression/summarization) has been applied.',
  },
  {
    name: 'state.compressionRatio',
    type: 'number',
    description:
      'Compression ratio achieved (e.g., 0.5 = 50% size reduction).',
  },
  {
    name: 'state.tokensSaved',
    type: 'number',
    description: 'Total tokens saved through optimization.',
  },
]

const actionMethodsProps: PropDefinition[] = [
  {
    name: 'addMessage',
    type: '(message: ChatMessage) => void',
    description:
      'Add a new message to the context. Automatically manages window limits.',
  },
  {
    name: 'getOptimizedContext',
    type: '() => Promise<{ messages: ChatMessage[]; metadata: ContextMetadata }>',
    description:
      'Get the optimized message list for API calls. Applies compression and summarization.',
  },
  {
    name: 'compressMessages',
    type: '(messages: ChatMessage[], options?: CompressionOptions) => Promise<{ messages: ChatMessage[]; compressionRatio: number; tokensSaved: number }>',
    description:
      'Manually compress a set of messages using the configured strategy.',
  },
  {
    name: 'clearContext',
    type: '() => void',
    description: 'Clear all messages and reset the context window.',
  },
  {
    name: 'updateStrategy',
    type: "(strategy: 'buffer' | 'bufferWindow' | 'summaryBuffer') => void",
    description:
      'Dynamically change the context management strategy at runtime.',
  },
  {
    name: 'getMetrics',
    type: '() => OptimizationMetrics',
    description:
      'Get detailed metrics about optimization performance (tokens saved, compression ratio, etc.).',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  useContextWindow, // Main token optimization hook
  type UseContextWindowConfig,
  type UseContextWindowReturn,
  type ContextWindowState,
  type ChatMessage,
  type CompressionOptions,
  type OptimizationMetrics,
} from '@clarity-chat/react'

// Or use the dedicated token optimization import
import {
  useContextWindow,
} from '@clarity-chat/react/hooks/clarity-tokens'`

const signatureCode = `function useContextWindow(
  config: UseContextWindowConfig
): UseContextWindowReturn & {
  compressMessages: (
    messages: ChatMessage[],
    options?: CompressionOptions
  ) => Promise<{
    messages: ChatMessage[]
    compressionRatio: number
    tokensSaved: number
  }>
}`

const basicUsageCode = `import { useContextWindow } from '@clarity-chat/react'

function ChatWithOptimization() {
  const {
    state,
    addMessage,
    getOptimizedContext,
  } = useContextWindow({
    maxTokens: 128000,
    strategy: 'buffer', // Keep all messages
    reservedTokens: 4000, // Reserve for output
    model: 'gpt-4o',
  })

  const handleSendMessage = async (content: string) => {
    // Add user message
    addMessage({
      id: Date.now().toString(),
      role: 'user',
      content,
    })

    // Get optimized context for API
    const { messages } = await getOptimizedContext()

    // Call your AI API with optimized messages
    const response = await callAI(messages)

    // Add assistant response
    addMessage({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
    })
  }

  return (
    <div>
      <div className="stats">
        <span>Context: {state.utilizationPercent.toFixed(1)}%</span>
        <span>
          {state.totalTokens.toLocaleString()} /
          {(state.totalTokens + state.availableTokens).toLocaleString()} tokens
        </span>
      </div>

      {/* Render messages */}
      {state.messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      <button onClick={() => handleSendMessage('Hello!')}>
        Send Message
      </button>
    </div>
  )
}`

const compressionUsageCode = `import { useContextWindow } from '@clarity-chat/react'

function ChatWithCompression() {
  const {
    state,
    addMessage,
    getOptimizedContext,
    compressMessages,
  } = useContextWindow({
    maxTokens: 128000,
    strategy: 'buffer',
    model: 'gpt-4o',
    enableCompression: true,
    compressionOptions: {
      strategy: 'adaptive', // Auto-select best compression
      targetRatio: 0.5, // Target 50% compression
      minQuality: 0.7, // Maintain 70% quality
    },
  })

  const handleSend = async (content: string) => {
    addMessage({ id: Date.now().toString(), role: 'user', content })

    // Get optimized context with compression applied
    const { messages, metadata } = await getOptimizedContext()

    console.log(\`Compressed to \${(metadata.compressionRatio * 100).toFixed(1)}%\`)
    console.log(\`Saved \${metadata.tokensSaved} tokens\`)

    const response = await callAI(messages)
    addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response })
  }

  // Manually compress specific messages
  const handleManualCompression = async () => {
    const { messages, compressionRatio, tokensSaved } = await compressMessages(
      state.messages,
      {
        strategy: 'llmlingua',
        targetRatio: 0.3, // Aggressive 70% reduction
        minQuality: 0.6,
      }
    )
    console.log(\`Manual compression: saved \${tokensSaved} tokens\`)
  }

  return (
    <div>
      <div className="optimization-stats">
        {state.isOptimized && (
          <div className="badge">
            <Sparkles className="w-4 h-4" />
            Optimized: {state.tokensSaved.toLocaleString()} tokens saved
            ({(state.compressionRatio * 100).toFixed(1)}% size)
          </div>
        )}
      </div>

      {/* Messages */}
      {state.messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}

      <button onClick={() => handleSend('Hello!')}>Send</button>
      <button onClick={handleManualCompression}>Compress History</button>
    </div>
  )
}`

const strategiesUsageCode = `import { useContextWindow } from '@clarity-chat/react'

function ChatWithStrategies() {
  const [strategy, setStrategy] = React.useState<'buffer' | 'bufferWindow' | 'summaryBuffer'>('buffer')

  const {
    state,
    addMessage,
    getOptimizedContext,
    updateStrategy,
  } = useContextWindow({
    maxTokens: 128000,
    strategy: strategy,
    windowSize: 10, // Keep last 10 messages verbatim
    model: 'gpt-4o',
    // Custom summarizer for summaryBuffer strategy
    summarizer: async (messages) => {
      // Call AI to create a summary
      const summary = await callAI([
        {
          role: 'system',
          content: 'Summarize the following conversation concisely.',
        },
        ...messages,
      ])
      return summary
    },
  })

  // Strategy descriptions
  const strategies = {
    buffer: {
      name: 'Buffer',
      desc: 'Keep all messages (no optimization)',
      bestFor: 'Short conversations',
    },
    bufferWindow: {
      name: 'Buffer Window',
      desc: 'Keep only last 10 messages',
      bestFor: 'Medium conversations',
    },
    summaryBuffer: {
      name: 'Summary Buffer',
      desc: 'Summarize old messages, keep recent 10',
      bestFor: 'Long conversations',
    },
  }

  const handleStrategyChange = (newStrategy: typeof strategy) => {
    setStrategy(newStrategy)
    updateStrategy(newStrategy)
  }

  return (
    <div>
      {/* Strategy selector */}
      <div className="strategy-selector">
        {Object.entries(strategies).map(([key, { name, desc, bestFor }]) => (
          <button
            key={key}
            onClick={() => handleStrategyChange(key as typeof strategy)}
            className={cn(
              'strategy-option',
              strategy === key && 'active'
            )}
          >
            <span className="name">{name}</span>
            <span className="desc">{desc}</span>
            <span className="best-for">Best for: {bestFor}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="stats">
        <span>Messages: {state.messages.length}</span>
        {state.summarizedCount > 0 && (
          <span>Summarized: {state.summarizedCount}</span>
        )}
        <span>Tokens: {state.totalTokens.toLocaleString()}</span>
        <span>Utilization: {state.utilizationPercent.toFixed(1)}%</span>
      </div>

      {/* Summary display */}
      {state.summary && (
        <div className="summary-card">
          <h3>Conversation Summary</h3>
          <p>{state.summary}</p>
        </div>
      )}

      {/* Messages */}
      {state.messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}`

const rscUsageCode = `// app/actions.ts (Server)
'use server'

import { useContextWindow } from '@clarity-chat/react'

export async function optimizeContext(messages: ChatMessage[]) {
  const { getOptimizedContext, compressMessages } = useContextWindow({
    maxTokens: 128000,
    strategy: 'summaryBuffer',
    enableCompression: true,
  })

  // Add messages
  messages.forEach((msg) => addMessage(msg))

  // Get optimized context
  const { messages: optimizedMessages, metadata } = await getOptimizedContext()

  return {
    messages: optimizedMessages,
    stats: {
      tokensSaved: metadata.tokensSaved,
      compressionRatio: metadata.compressionRatio,
    },
  }
}

// app/chat/page.tsx (Client)
'use client'

import { optimizeContext } from './actions'

export default function ChatPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([])

  const handleSend = async (content: string) => {
    const newMessages = [
      ...messages,
      { id: Date.now().toString(), role: 'user', content },
    ]
    setMessages(newMessages)

    // Optimize on server
    const { messages: optimizedMessages, stats } = await optimizeContext(newMessages)

    console.log(\`Server optimized: saved \${stats.tokensSaved} tokens\`)

    // Call AI with optimized messages
    const response = await callAI(optimizedMessages)
    setMessages([
      ...newMessages,
      { id: (Date.now() + 1).toString(), role: 'assistant', content: response },
    ])
  }

  return <div>{/* Chat UI */}</div>
}`

const advancedUsageCode = `import { useContextWindow, useCostEstimator } from '@clarity-chat/react'

function AdvancedOptimizedChat() {
  const {
    state,
    addMessage,
    getOptimizedContext,
    getMetrics,
    compressMessages,
  } = useContextWindow({
    maxTokens: 128000,
    strategy: 'summaryBuffer',
    windowSize: 10,
    model: 'gpt-4o',
    enableCompression: true,
    compressionOptions: {
      strategy: 'adaptive',
      targetRatio: 0.5,
      minQuality: 0.7,
    },
  })

  const { estimateCost } = useCostEstimator({ model: 'gpt-4o' })

  const handleSend = async (content: string) => {
    addMessage({ id: Date.now().toString(), role: 'user', content })

    // Get optimized context
    const { messages, metadata } = await getOptimizedContext()

    // Estimate cost
    const { inputCost, totalCost } = estimateCost({
      inputTokens: metadata.totalTokens,
      outputTokens: 1000, // Estimated
    })

    // Get comprehensive metrics
    const metrics = getMetrics()
    console.log('Optimization metrics:', metrics)
    console.log(\`Cost: $\${totalCost.toFixed(4)}\`)

    const response = await callAI(messages)
    addMessage({ id: (Date.now() + 1).toString(), role: 'assistant', content: response })
  }

  // Auto-compress when utilization > 80%
  React.useEffect(() => {
    if (state.utilizationPercent > 80) {
      compressMessages(state.messages, {
        strategy: 'llmlingua',
        targetRatio: 0.4,
      }).then(({ tokensSaved }) => {
        console.log(\`Auto-compressed: saved \${tokensSaved} tokens\`)
      })
    }
  }, [state.utilizationPercent])

  return (
    <div>
      <div className="advanced-stats">
        <div className="stat-card">
          <Gauge className="icon" />
          <span>Utilization</span>
          <span className="value">{state.utilizationPercent.toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <TrendingDown className="icon" />
          <span>Tokens Saved</span>
          <span className="value">{state.tokensSaved.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <Maximize2 className="icon" />
          <span>Compression</span>
          <span className="value">{((1 - state.compressionRatio) * 100).toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <Coins className="icon" />
          <span>Est. Cost</span>
          <span className="value">
            ${estimateCost({ inputTokens: state.totalTokens, outputTokens: 1000 }).totalCost.toFixed(4)}
          </span>
        </div>
      </div>

      {/* Messages with optimization badges */}
      {state.messages.map((msg) => (
        <div key={msg.id} className="message">
          {msg.content}
          {msg.isCompressed && (
            <span className="badge">Compressed</span>
          )}
        </div>
      ))}

      <button onClick={() => handleSend('Hello!')}>Send</button>
    </div>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseTokenOptimizationPage() {
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
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hook
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      50-70% Cost Reduction
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useTokenOptimization
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Comprehensive React hook for token optimization with automatic
                context management, compression, and cost reduction. Achieves
                50-70% cost savings through intelligent message handling and
                adaptive compression strategies.
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
                {
                  icon: TrendingDown,
                  label: 'Cost Reduction',
                  desc: '50-70% savings',
                },
                {
                  icon: Gauge,
                  label: 'Context Management',
                  desc: '3 strategies',
                },
                {
                  icon: Zap,
                  label: 'Compression',
                  desc: 'Up to 80% ratio',
                },
                {
                  icon: Calculator,
                  label: 'Auto-Optimization',
                  desc: 'Real-time',
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
                  <code>useContextWindow</code> (also known as{' '}
                  <code>useTokenOptimization</code>) is the comprehensive
                  solution for managing token usage in React applications. It
                  combines context window management, message compression, and
                  cost optimization into a single, easy-to-use hook.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>50-70% Cost Reduction:</strong> Achieve significant
                    cost savings through intelligent optimization
                  </li>
                  <li>
                    <strong>Multiple Strategies:</strong> Buffer, buffer window,
                    and summary buffer for different use cases
                  </li>
                  <li>
                    <strong>Advanced Compression:</strong> LLMLingua,
                    extractive, and adaptive compression algorithms
                  </li>
                  <li>
                    <strong>Real-Time Optimization:</strong> Automatic context
                    management with live token counting
                  </li>
                  <li>
                    <strong>React Server Components:</strong> Full support for
                    Next.js App Router and RSC
                  </li>
                  <li>
                    <strong>Performance Optimized:</strong> Memoization,
                    debouncing, and minimal re-renders
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border/50 not-prose">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Use Case
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Recommended Strategy
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">
                          Short conversations (&lt;20 messages)
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          buffer
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">
                          Medium conversations (20-100 messages)
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          bufferWindow + compression
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">
                          Long conversations (100+ messages)
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          summaryBuffer + compression
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact: 50-70% Reduction">
              <div className="space-y-6">
                <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3 mb-4">
                    <PiggyBank className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-xl font-semibold text-foreground">
                      Integrate 50-70% Cost Reduction into React Apps
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    By combining context management strategies with compression,
                    this hook enables React applications to achieve 50-70% cost
                    reduction across typical AI chat workloads. The savings come
                    from:
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <strong className="text-foreground">
                          Context Trimming (20-30%)
                        </strong>
                        <p className="text-sm text-muted-foreground">
                          Keep only relevant messages in the window
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <strong className="text-foreground">
                          Message Compression (30-50%)
                        </strong>
                        <p className="text-sm text-muted-foreground">
                          Reduce token count without losing meaning
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <strong className="text-foreground">
                          Smart Summarization (40-60%)
                        </strong>
                        <p className="text-sm text-muted-foreground">
                          Condense old messages into summaries
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                      <div>
                        <strong className="text-foreground">
                          Combined Strategies (50-70%)
                        </strong>
                        <p className="text-sm text-muted-foreground">
                          Apply multiple optimizations together
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Real-World Example:</strong> A customer support
                    chatbot processing 10,000 conversations/day reduced costs
                    from $150/day to $45/day (70% reduction) by using
                    summaryBuffer strategy with adaptive compression.
                  </p>
                </div>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
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
                    <strong>Tip:</strong> The <code>maxTokens</code> option is
                    the only required parameter. All other options have sensible
                    defaults for quick setup.
                  </p>
                </div>
              </div>
            </Section>

            {/* Configuration Section */}
            <Section id="configuration" title="Configuration">
              <p className="text-muted-foreground mb-6">
                The hook accepts a single configuration object with options
                organized by feature area.
              </p>

              <SubSection id="core-config" title="Core Options">
                <PropsTable props={coreConfigProps} />
              </SubSection>

              <SubSection id="compression-config" title="Compression Options">
                <p className="text-sm text-muted-foreground mb-4">
                  Configure message compression to achieve 30-80% token
                  reduction. Compression is applied before summarization for
                  maximum savings.
                </p>
                <PropsTable props={compressionConfigProps} />
              </SubSection>

              <SubSection id="strategy-config" title="Strategy Selection">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p>
                    Choose the right strategy based on your conversation length
                    and requirements:
                  </p>
                </div>

                <div className="grid gap-4 mt-4">
                  <div className="p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500" />
                      Buffer Strategy
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Keeps all messages in the context window without any
                      optimization.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Best for: Short conversations (&lt;20 messages)</li>
                      <li>Pros: Complete context, no information loss</li>
                      <li>Cons: Can hit token limits quickly</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Gauge className="w-4 h-4 text-emerald-500" />
                      Buffer Window Strategy
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Keeps only the most recent k messages, dropping older
                      ones.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>
                        Best for: Medium conversations (20-100 messages)
                      </li>
                      <li>Pros: Fixed memory usage, simple and fast</li>
                      <li>Cons: Loses older context entirely</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50">
                    <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Summary Buffer Strategy (Recommended)
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Summarizes old messages, keeps recent ones verbatim.
                      Best of both worlds.
                    </p>
                    <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                      <li>Best for: Long conversations (100+ messages)</li>
                      <li>
                        Pros: Maintains full context, optimal token usage
                      </li>
                      <li>Cons: Requires summarization API calls</li>
                    </ul>
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* Return Values Section */}
            <Section id="return-values" title="Return Values">
              <p className="text-muted-foreground mb-6">
                The hook returns an object with state properties, action
                methods, and optimization statistics.
              </p>

              <SubSection id="state-properties" title="State Properties">
                <PropsTable props={stateReturnProps} />
              </SubSection>

              <SubSection id="action-methods" title="Action Methods">
                <PropsTable props={actionMethodsProps} />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Simple setup with automatic context management:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-compression" title="With Compression">
                <p className="text-muted-foreground mb-4">
                  Enable compression for 30-80% token reduction:
                </p>
                <CodeBlock
                  code={compressionUsageCode}
                  language="tsx"
                  filename="CompressionOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-strategies" title="Memory Strategies">
                <p className="text-muted-foreground mb-4">
                  Compare and switch between different context management
                  strategies:
                </p>
                <CodeBlock
                  code={strategiesUsageCode}
                  language="tsx"
                  filename="StrategyComparison.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="example-rsc"
                title="React Server Components Integration"
              >
                <p className="text-muted-foreground mb-4">
                  Use with Next.js App Router and Server Actions:
                </p>
                <CodeBlock
                  code={rscUsageCode}
                  language="tsx"
                  filename="ServerComponentOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-advanced" title="Advanced Patterns">
                <p className="text-muted-foreground mb-4">
                  Combine with cost estimation and auto-compression:
                </p>
                <CodeBlock
                  code={advancedUsageCode}
                  language="tsx"
                  filename="AdvancedOptimization.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Performance Considerations Section */}
            <Section id="performance" title="Performance Considerations">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Memoization & Re-Renders
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    The hook is optimized to minimize re-renders:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      State updates are batched using{' '}
                      <code>React.startTransition</code>
                    </li>
                    <li>
                      Action methods are memoized with <code>useCallback</code>
                    </li>
                    <li>
                      Token counting is debounced (300ms default) to reduce
                      computation
                    </li>
                    <li>
                      Compression results are cached to avoid redundant
                      processing
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-emerald-500" />
                    Compression Performance
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Compression strategies have different performance
                    characteristics:
                  </p>
                  <div className="overflow-x-auto rounded-lg border border-border/50 mt-2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border/50 bg-muted/20">
                          <th className="px-4 py-3 text-left font-semibold">
                            Strategy
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Speed
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Compression
                          </th>
                          <th className="px-4 py-3 text-left font-semibold">
                            Quality
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/30">
                          <td className="px-4 py-3 font-mono">llmlingua</td>
                          <td className="px-4 py-3">Slow (~500ms)</td>
                          <td className="px-4 py-3">Excellent (70-80%)</td>
                          <td className="px-4 py-3">High</td>
                        </tr>
                        <tr className="border-b border-border/30 bg-muted/10">
                          <td className="px-4 py-3 font-mono">extractive</td>
                          <td className="px-4 py-3">Fast (~50ms)</td>
                          <td className="px-4 py-3">Good (50-60%)</td>
                          <td className="px-4 py-3">Medium</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-mono">adaptive</td>
                          <td className="px-4 py-3">Variable</td>
                          <td className="px-4 py-3">Excellent (60-75%)</td>
                          <td className="px-4 py-3">High</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Tip:</strong> For real-time chat applications, use{' '}
                    <code>extractive</code> compression for faster processing.
                    For background optimization, use <code>llmlingua</code> or{' '}
                    <code>adaptive</code> for better compression ratios.
                  </p>
                </div>
              </div>
            </Section>

            {/* Best Practices Section */}
            <Section id="best-practices" title="Best Practices">
              <div className="grid gap-4">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    1. Choose the Right Strategy
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Start with <code>buffer</code> for short conversations,
                    upgrade to <code>summaryBuffer</code> as conversations grow.
                    Enable compression when utilization exceeds 60%.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    2. Monitor Utilization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Always display <code>state.utilizationPercent</code> to
                    users. When it exceeds 80%, consider compressing or
                    switching to a more aggressive strategy.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    3. Set Quality Thresholds
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use <code>compressionOptions.minQuality</code> to prevent
                    over-compression. A value of 0.7-0.8 balances savings with
                    quality for most use cases.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    4. Provide Custom Summarizers
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    The default summarizer is basic. For production apps,
                    provide a custom <code>summarizer</code> function that calls
                    your AI model with task-specific prompts.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2">
                    5. Test Compression Quality
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Use <code>getMetrics()</code> to track compression ratios
                    and token savings over time. A/B test different{' '}
                    <code>targetRatio</code> values to find optimal settings.
                  </p>
                </div>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Context window still exceeding limits
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If messages are still hitting token limits after
                    optimization:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Lower <code>compressionOptions.targetRatio</code> to 0.3
                      or 0.4 for more aggressive compression
                    </li>
                    <li>
                      Reduce <code>windowSize</code> to keep fewer recent
                      messages
                    </li>
                    <li>
                      Switch from <code>bufferWindow</code> to{' '}
                      <code>summaryBuffer</code> strategy
                    </li>
                    <li>
                      Increase <code>reservedTokens</code> if output responses
                      are being truncated
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Compression degrading response quality
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If AI responses become less accurate after compression:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Increase <code>compressionOptions.minQuality</code> to 0.8
                      or 0.9
                    </li>
                    <li>
                      Raise <code>compressionOptions.targetRatio</code> to 0.6
                      or 0.7
                    </li>
                    <li>
                      Switch from <code>llmlingua</code> to{' '}
                      <code>adaptive</code> strategy
                    </li>
                    <li>
                      Test with <code>extractive</code> compression for better
                      quality preservation
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Slow compression performance
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If compression is taking too long:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Use <code>extractive</code> strategy instead of{' '}
                      <code>llmlingua</code> (~10x faster)
                    </li>
                    <li>Enable compression caching to avoid reprocessing</li>
                    <li>
                      Compress only when utilization exceeds 70-80%, not on
                      every message
                    </li>
                    <li>
                      Run compression in a Web Worker for non-blocking UI
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Summary buffer losing important context
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If summarization is dropping critical information:
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Increase <code>windowSize</code> to keep more verbatim
                      messages
                    </li>
                    <li>
                      Improve your custom <code>summarizer</code> function with
                      better prompts
                    </li>
                    <li>
                      Mark important messages as system messages to prevent
                      summarization
                    </li>
                    <li>
                      Combine <code>summaryBuffer</code> with{' '}
                      <code>extractive</code> compression
                    </li>
                  </ul>
                </div>
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
                      'Top-level chat hook with built-in token optimization',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'useTokenCounter',
                    type: 'hook',
                    description:
                      'Simple token counting for real-time display',
                    href: '/reference/hooks/use-token-counter',
                  },
                  {
                    name: 'useCostEstimator',
                    type: 'hook',
                    description: 'Estimate API costs based on token usage',
                    href: '/reference/hooks/use-cost-estimator',
                  },
                  {
                    name: 'useSemanticCache',
                    type: 'hook',
                    description:
                      'Semantic caching for response reuse and cost savings',
                    href: '/reference/hooks/use-semantic-cache',
                  },
                  {
                    name: 'Achieving 50-70% Cost Reduction',
                    type: 'cookbook',
                    description:
                      'Complete guide to implementing token optimization',
                    href: '/cookbook/achieving-50-percent-reduction',
                  },
                  {
                    name: 'React Integration',
                    type: 'cookbook',
                    description:
                      'Integrate token optimization into React applications',
                    href: '/cookbook/react-integration',
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
                  href="/reference/hooks/use-streaming"
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
                      Streaming Hooks
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/hooks/use-memory"
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
                      Memory Hooks
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
