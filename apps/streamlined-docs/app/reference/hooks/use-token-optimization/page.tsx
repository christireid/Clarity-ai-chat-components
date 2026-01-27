'use client'

/**
 * Token Optimization Hooks - API Reference Documentation
 *
 * Documentation for useTokenBudgetMonitor, useTokenCount, and useTokenOptimization hooks.
 * Hooks for managing token usage, cost tracking, and optimization in AI applications.
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
  { id: 'import', title: 'Import' },
  {
    id: 'use-token-count',
    title: 'useTokenCount',
    children: [
      { id: 'token-count-signature', title: 'Signature' },
      { id: 'token-count-options', title: 'Options' },
      { id: 'token-count-returns', title: 'Returns' },
    ],
  },
  {
    id: 'use-token-budget-monitor',
    title: 'useTokenBudgetMonitor',
    children: [
      { id: 'budget-signature', title: 'Signature' },
      { id: 'budget-config', title: 'Configuration' },
      { id: 'budget-returns', title: 'Returns' },
    ],
  },
  {
    id: 'utilities',
    title: 'Utility Functions',
    children: [
      { id: 'create-model-budget', title: 'createModelBudgetMonitor' },
      { id: 'estimate-token-cost', title: 'estimateTokenCost' },
      { id: 'format-token-usage', title: 'formatTokenUsage' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Token Counter' },
      { id: 'example-budget', title: 'Budget Monitoring' },
      { id: 'example-auto-trim', title: 'Auto-Trim on Critical' },
      { id: 'example-cost', title: 'Cost Estimation' },
    ],
  },
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

const tokenCountOptionsProps: PropDefinition[] = [
  {
    name: 'model',
    type: 'string',
    default: "'gpt-4o'",
    description:
      'Model to use for tokenization. Different models have different tokenizers.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '150',
    description: 'Debounce delay in milliseconds. Set to 0 to disable.',
  },
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable the hook. Useful for conditional counting.',
  },
]

const tokenCountReturnProps: PropDefinition[] = [
  {
    name: 'count',
    type: 'number',
    description: 'The token count for the input text. Returns 0 while loading.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether the count is currently being calculated.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Error if counting failed.',
  },
  {
    name: 'info',
    type: '{ characters: number; words: number; ratio: number }',
    description:
      'Additional info: character count, word count, chars per token.',
  },
  {
    name: 'recount',
    type: '() => void',
    description: 'Force immediate recount, bypassing debounce.',
  },
  {
    name: 'isStale',
    type: 'boolean',
    description: 'React 19: Whether displayed count is for previous text.',
  },
]

const budgetConfigProps: PropDefinition[] = [
  {
    name: 'maxInputTokens',
    type: 'number',
    required: true,
    description: 'Maximum input tokens for the model (e.g., 128000 for GPT-4).',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description: 'Warning threshold as decimal (80%).',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    default: '0.95',
    description: 'Critical threshold as decimal (95%).',
  },
  {
    name: 'reservedForOutput',
    type: 'number',
    default: '4096',
    description: 'Tokens reserved for output response.',
  },
  {
    name: 'model',
    type: 'ModelName',
    description: 'Model name for accurate token counting.',
  },
  {
    name: 'autoTrim',
    type: 'boolean',
    default: 'false',
    description: 'Auto-trigger trimming at critical threshold.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    default: '300',
    description: 'Debounce delay for token counting.',
  },
  {
    name: 'useAccurateTokenization',
    type: 'boolean',
    default: 'false',
    description: 'Use accurate tokenization (slower but precise).',
  },
]

const budgetCallbackProps: PropDefinition[] = [
  {
    name: 'onWarning',
    type: '(usage: TokenBudgetUsage) => void',
    description: 'Called when warning threshold is crossed.',
  },
  {
    name: 'onCritical',
    type: '(usage: TokenBudgetUsage) => void',
    description: 'Called when critical threshold is crossed.',
  },
  {
    name: 'onExceeded',
    type: '(usage: TokenBudgetUsage) => void',
    description: 'Called when budget is exceeded (over 100%).',
  },
  {
    name: 'onAutoTrim',
    type: '(result: TrimResult) => void',
    description: 'Called after auto-trim occurs.',
  },
]

const budgetReturnProps: PropDefinition[] = [
  {
    name: 'usage',
    type: 'TokenBudgetUsage',
    description: 'Current token usage metrics.',
  },
  {
    name: 'isWarning',
    type: 'boolean',
    description: 'Whether currently in warning state.',
  },
  {
    name: 'isCritical',
    type: 'boolean',
    description: 'Whether currently in critical state.',
  },
  {
    name: 'isExceeded',
    type: 'boolean',
    description: 'Whether budget is exceeded.',
  },
  {
    name: 'wouldExceed',
    type: '(additionalTokens: number) => boolean',
    description: 'Check if adding tokens would exceed budget.',
  },
  {
    name: 'calculateTokens',
    type: '(text: string) => Promise<number>',
    description: 'Calculate tokens for text.',
  },
  {
    name: 'updateMessages',
    type: '(messages: BudgetMessage[]) => void',
    description: 'Update messages and recalculate usage.',
  },
  {
    name: 'trimToCritical',
    type: '() => TrimResult | null',
    description: 'Manually trigger trim to get below critical.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset the monitor state.',
  },
  {
    name: 'lastTrimResult',
    type: 'TrimResult | null',
    description: 'Last trim result if any.',
  },
  {
    name: 'isCalculating',
    type: 'boolean',
    description: 'Whether currently calculating tokens.',
  },
]

const usageTypeProps: PropDefinition[] = [
  {
    name: 'current',
    type: 'number',
    description: 'Current tokens used.',
  },
  {
    name: 'max',
    type: 'number',
    description: 'Maximum tokens allowed.',
  },
  {
    name: 'available',
    type: 'number',
    description: 'Available tokens remaining.',
  },
  {
    name: 'utilizationPercent',
    type: 'number',
    description: 'Utilization as percentage (0-100).',
  },
  {
    name: 'exceededPercent',
    type: 'number',
    description: 'Percentage by which budget is exceeded (0 if not exceeded).',
  },
  {
    name: 'status',
    type: 'TokenUsageStatus',
    description:
      "Current status: 'safe' | 'warning' | 'critical' | 'exceeded'.",
  },
  {
    name: 'reservedForOutput',
    type: 'number',
    description: 'Tokens reserved for output.',
  },
  {
    name: 'effectiveMax',
    type: 'number',
    description: 'Effective max for input (max - reserved).',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  // Simple token counting
  useTokenCount,
  type UseTokenCountOptions,
  type UseTokenCountReturn,

  // Budget monitoring
  useTokenBudgetMonitor,
  useTokenBudgetTracking, // New canonical name
  type TokenBudgetConfig,
  type TokenBudgetMonitorReturn,
  type TokenBudgetUsage,
  type TokenUsageStatus,
  type TrimResult,
  type BudgetMessage,

  // Utilities
  createModelBudgetMonitor,
  estimateTokenCost,
  formatTokenUsage,
  getStatusColor,
  isValidBudgetMonitorModel,
  type TokenCostEstimate,
  type BudgetMonitorModel,
} from '@clarity-chat/token-optimization'`

const tokenCountSignatureCode = `function useTokenCount(
  text: string,
  options?: UseTokenCountOptions
): UseTokenCountReturn`

const budgetSignatureCode = `function useTokenBudgetMonitor(
  config: TokenBudgetConfig
): TokenBudgetMonitorReturn`

const basicTokenCountCode = `import { useTokenCount } from '@clarity-chat/token-optimization'

function TokenCounter({ text }) {
  const { count, isLoading, info } = useTokenCount(text)

  return (
    <div>
      {isLoading ? (
        <span>Counting...</span>
      ) : (
        <span>{count} tokens</span>
      )}
      <div className="text-sm text-muted">
        {info.characters} chars, {info.words} words
        ({info.ratio.toFixed(1)} chars/token)
      </div>
    </div>
  )
}`

const budgetMonitorCode = `import {
  useTokenBudgetMonitor,
  createModelBudgetMonitor,
  getStatusColor,
} from '@clarity-chat/token-optimization'

function ChatWithBudget() {
  const config = createModelBudgetMonitor('gpt-4o', {
    warningThreshold: 0.75,
    criticalThreshold: 0.9,
    onWarning: (usage) => {
      console.log('Warning: Context at', usage.utilizationPercent, '%')
    },
    onCritical: (usage) => {
      console.log('Critical: Consider summarizing history')
    },
  })

  const {
    usage,
    isWarning,
    isCritical,
    updateMessages,
    wouldExceed,
  } = useTokenBudgetMonitor(config)

  // Update usage when messages change
  React.useEffect(() => {
    updateMessages(
      messages.map(m => ({
        role: m.role,
        content: m.content,
      }))
    )
  }, [messages, updateMessages])

  const statusColor = getStatusColor(usage.status)

  return (
    <div>
      {/* Token Budget Bar */}
      <div className="budget-bar">
        <div
          className="budget-fill"
          style={{
            width: \`\${Math.min(usage.utilizationPercent, 100)}%\`,
            backgroundColor: statusColor,
          }}
        />
        <span className="budget-text">
          {usage.current.toLocaleString()} / {usage.effectiveMax.toLocaleString()} tokens
        </span>
      </div>

      {/* Warnings */}
      {isWarning && (
        <div className="warning">
          Context at {usage.utilizationPercent.toFixed(0)}% - Consider summarizing
        </div>
      )}
      {isCritical && (
        <div className="critical">
          Critical! Context nearly full - will auto-trim soon
        </div>
      )}

      {/* Chat interface */}
      <ChatInput
        onSubmit={handleSubmit}
        disabled={wouldExceed(estimatedInputTokens)}
      />
    </div>
  )
}`

const autoTrimCode = `import {
  useTokenBudgetMonitor,
  createModelBudgetMonitor,
} from '@clarity-chat/token-optimization'

function ChatWithAutoTrim() {
  const [messages, setMessages] = React.useState<Message[]>([])

  const {
    usage,
    lastTrimResult,
    updateMessages,
  } = useTokenBudgetMonitor(
    createModelBudgetMonitor('claude-sonnet-4', {
      autoTrim: true, // Enable auto-trimming
      criticalThreshold: 0.9,
      onAutoTrim: (result) => {
        console.log(\`Trimmed \${result.tokensRemoved} tokens\`)
        console.log('Removed messages:', result.removedItems)

        // Update UI to reflect trimming
        const trimmedMessages = messages.filter(
          (_, i) => !result.removedItems.some(item => item.index === i)
        )
        setMessages(trimmedMessages)
      },
    })
  )

  React.useEffect(() => {
    updateMessages(
      messages.map(m => ({
        role: m.role,
        content: m.content,
        trimmable: m.role !== 'system', // System messages not trimmable
        priority: m.isImportant ? 1 : 0, // Higher priority = trim later
      }))
    )
  }, [messages, updateMessages])

  return (
    <div>
      {lastTrimResult && (
        <div className="trim-notification">
          Trimmed {lastTrimResult.tokensRemoved} tokens from context
        </div>
      )}
      <MessageList messages={messages} />
    </div>
  )
}`

const costEstimationCode = `import {
  useTokenBudgetMonitor,
  createModelBudgetMonitor,
  estimateTokenCost,
} from '@clarity-chat/token-optimization'

function ChatWithCostTracking() {
  const model = 'gpt-4o'
  const { usage, updateMessages } = useTokenBudgetMonitor(
    createModelBudgetMonitor(model)
  )

  // Calculate cost estimate
  const cost = estimateTokenCost(usage, model)

  return (
    <div>
      <div className="cost-display">
        <span>Estimated cost: {cost?.formattedCost || '$0.00'}</span>
        <div className="cost-breakdown text-sm text-muted">
          Input: \${cost?.inputCost.toFixed(4) || '0.0000'}
          {' | '}
          Output (est): \${cost?.estimatedOutputCost.toFixed(4) || '0.0000'}
        </div>
      </div>

      <div className="token-info">
        <span>{usage.current.toLocaleString()} input tokens</span>
        <span>{usage.reservedForOutput.toLocaleString()} output reserved</span>
      </div>
    </div>
  )
}

// Supported models for cost estimation:
// OpenAI: gpt-4o, gpt-4-turbo, gpt-4o-mini, gpt-4.1, o1, o3-mini
// Anthropic: claude-3-opus, claude-3-sonnet, claude-sonnet-4, claude-opus-4
// Google: gemini-1.5-pro, gemini-2.0-flash
// DeepSeek: deepseek-chat, deepseek-r1
// Mistral: mistral-large, mistral-small`

const createModelBudgetCode = `import { createModelBudgetMonitor } from '@clarity-chat/token-optimization'

// Pre-configured for common models
const gpt4Config = createModelBudgetMonitor('gpt-4o')
// { maxInputTokens: 128000, reservedForOutput: 4096, model: 'gpt-4o' }

const claudeConfig = createModelBudgetMonitor('claude-sonnet-4', {
  warningThreshold: 0.7, // Override defaults
  autoTrim: true,
})

// Supported models:
// OpenAI: gpt-4o, gpt-4-turbo, gpt-4o-mini, gpt-4.1, gpt-4.1-mini, gpt-4.1-nano, o1, o1-mini, o3-mini
// Anthropic: claude-3-opus, claude-3-sonnet, claude-3-haiku, claude-3-5-sonnet, claude-3-5-haiku, claude-sonnet-4, claude-opus-4
// Google: gemini-1.5-pro, gemini-1.5-flash, gemini-2.0-flash, gemini-2.0-pro
// DeepSeek: deepseek-chat, deepseek-r1
// Mistral: mistral-large, mistral-small`

const typesCode = `// Token usage status
type TokenUsageStatus = 'safe' | 'warning' | 'critical' | 'exceeded'

// Budget usage metrics
interface TokenBudgetUsage {
  current: number
  max: number
  available: number
  utilizationPercent: number
  exceededPercent: number
  status: TokenUsageStatus
  reservedForOutput: number
  effectiveMax: number
}

// Message format for budget monitoring
interface BudgetMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens?: number      // Pre-computed tokens (optional)
  trimmable?: boolean  // Can be trimmed (default: true)
  priority?: number    // Lower = trim first (default: 0)
}

// Trim result
interface TrimResult {
  originalContent: string[]
  trimmedContent: string[]
  tokensRemoved: number
  removedItems: Array<{
    index: number
    preview: string
    tokens: number
  }>
  reason: 'critical' | 'exceeded' | 'manual'
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
                  <Gauge className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Hooks
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                Token Optimization Hooks
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Hooks for managing token usage, budget monitoring, cost
                tracking, and automatic context trimming. Essential for building
                cost-effective AI applications.
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
                  icon: Calculator,
                  label: 'Token Counting',
                  desc: 'Accurate & debounced',
                },
                {
                  icon: Gauge,
                  label: 'Budget Monitoring',
                  desc: 'Real-time tracking',
                },
                {
                  icon: TrendingDown,
                  label: 'Auto-Trim',
                  desc: 'Prevent overflow',
                },
                {
                  icon: Coins,
                  label: 'Cost Estimation',
                  desc: '30+ model support',
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
                  The token optimization hooks help you manage token budgets,
                  track costs, and prevent context overflow in AI applications.
                  They work with all major model providers and include accurate
                  tokenization for precise counting.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Hook Selection Guide
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border/50 not-prose">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/20">
                        <th className="px-4 py-3 text-left font-semibold">
                          Use Case
                        </th>
                        <th className="px-4 py-3 text-left font-semibold">
                          Recommended Hook
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">Simple token counting</td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenCount
                        </td>
                      </tr>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <td className="px-4 py-3">
                          Budget monitoring with thresholds
                        </td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenBudgetMonitor
                        </td>
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="px-4 py-3">Auto-trimming context</td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenBudgetMonitor + autoTrim
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3">Cost tracking</td>
                        <td className="px-4 py-3 font-mono text-brand-600 dark:text-brand-400">
                          useTokenBudgetMonitor + estimateTokenCost
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800 mt-6 not-prose">
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    <strong>Note:</strong> <code>useTokenBudgetMonitor</code> is
                    being renamed to <code>useTokenBudgetTracking</code> in
                    v3.0. Both names work currently, but prefer the new name for
                    new code.
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

            {/* useTokenCount Section */}
            <Section id="use-token-count" title="useTokenCount">
              <p className="text-muted-foreground mb-6">
                The simplest way to count tokens in React. Pass text, get a
                count with automatic debouncing and caching.
              </p>

              <SubSection id="token-count-signature" title="Signature">
                <CodeBlock
                  code={tokenCountSignatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="token-count-options" title="Options">
                <PropsTable props={tokenCountOptionsProps} />
              </SubSection>

              <SubSection id="token-count-returns" title="Returns">
                <PropsTable props={tokenCountReturnProps} />
              </SubSection>
            </Section>

            {/* useTokenBudgetMonitor Section */}
            <Section
              id="use-token-budget-monitor"
              title="useTokenBudgetMonitor"
            >
              <p className="text-muted-foreground mb-6">
                Advanced hook for real-time budget monitoring with
                threshold-based warnings, automatic trimming, and cost
                estimation.
              </p>

              <SubSection id="budget-signature" title="Signature">
                <CodeBlock
                  code={budgetSignatureCode}
                  language="tsx"
                  filename="Signature"
                  showDownloadButton={false}
                />
              </SubSection>

              <SubSection id="budget-config" title="Configuration">
                <PropsTable
                  props={budgetConfigProps}
                  title="Core Configuration"
                />
                <div className="mt-4">
                  <PropsTable props={budgetCallbackProps} title="Callbacks" />
                </div>
              </SubSection>

              <SubSection id="budget-returns" title="Returns">
                <PropsTable props={budgetReturnProps} title="Return Values" />
                <div className="mt-4">
                  <PropsTable
                    props={usageTypeProps}
                    title="TokenBudgetUsage Properties"
                  />
                </div>
              </SubSection>
            </Section>

            {/* Utility Functions Section */}
            <Section id="utilities" title="Utility Functions">
              <SubSection
                id="create-model-budget"
                title="createModelBudgetMonitor"
              >
                <p className="text-muted-foreground mb-4">
                  Create pre-configured budget monitors for common models:
                </p>
                <CodeBlock
                  code={createModelBudgetCode}
                  language="tsx"
                  filename="createModelBudgetMonitor"
                />
              </SubSection>

              <SubSection id="estimate-token-cost" title="estimateTokenCost">
                <p className="text-muted-foreground mb-4">
                  Estimate API costs based on current token usage:
                </p>
                <CodeBlock
                  code={`const cost = estimateTokenCost(usage, 'gpt-4o')
// Returns:
// {
//   inputCost: 0.00125,
//   estimatedOutputCost: 0.0205,
//   totalCost: 0.02175,
//   formattedCost: '$0.022',
//   model: 'gpt-4o'
// }`}
                  language="tsx"
                  filename="estimateTokenCost"
                />
              </SubSection>

              <SubSection
                id="format-token-usage"
                title="formatTokenUsage & getStatusColor"
              >
                <p className="text-muted-foreground mb-4">
                  Helper functions for displaying token usage:
                </p>
                <CodeBlock
                  code={`import { formatTokenUsage, getStatusColor } from '@clarity-chat/token-optimization'

// Format usage for display
const display = formatTokenUsage(usage)
// "5,000 / 10,000 tokens (50.0%)"
// or "15,000 / 10,000 tokens (100% + 50% over)"

// Get color for status
const color = getStatusColor(usage.status)
// Returns: 'green' | 'yellow' | 'orange' | 'red'`}
                  language="tsx"
                  filename="Helpers"
                />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Token Counter">
                <p className="text-muted-foreground mb-4">
                  Simple token counting with loading state:
                </p>
                <CodeBlock
                  code={basicTokenCountCode}
                  language="tsx"
                  filename="TokenCounter.tsx"
                />
              </SubSection>

              <SubSection id="example-budget" title="Budget Monitoring">
                <p className="text-muted-foreground mb-4">
                  Real-time budget tracking with visual indicators:
                </p>
                <CodeBlock
                  code={budgetMonitorCode}
                  language="tsx"
                  filename="ChatWithBudget.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-auto-trim" title="Auto-Trim on Critical">
                <p className="text-muted-foreground mb-4">
                  Automatically trim conversation history when approaching
                  limits:
                </p>
                <CodeBlock
                  code={autoTrimCode}
                  language="tsx"
                  filename="ChatWithAutoTrim.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-cost" title="Cost Estimation">
                <p className="text-muted-foreground mb-4">
                  Track and display estimated API costs:
                </p>
                <CodeBlock
                  code={costEstimationCode}
                  language="tsx"
                  filename="ChatWithCostTracking.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Token counts differ from API
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Estimated counts may differ slightly from actual API usage.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Enable <code>useAccurateTokenization: true</code> for
                      precise counting
                    </li>
                    <li>
                      Message formatting overhead adds ~4 tokens per message
                    </li>
                    <li>
                      System prompts may have additional encoding overhead
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Budget callbacks not firing
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Callbacks only fire when crossing thresholds.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Callbacks fire once per threshold crossing</li>
                    <li>
                      Ensure <code>updateMessages</code> is called when messages
                      change
                    </li>
                    <li>
                      Check threshold values (should be decimals: 0.8, not 80)
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Auto-trim not working
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Auto-trim requires specific configuration.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Set <code>autoTrim: true</code> in config
                    </li>
                    <li>
                      Only messages with <code>trimmable: true</code> (default)
                      are trimmed
                    </li>
                    <li>
                      System messages (<code>role: &apos;system&apos;</code>)
                      are never trimmed
                    </li>
                    <li>
                      Higher <code>priority</code> messages are trimmed later
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Model not supported
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Use <code>isValidBudgetMonitorModel()</code> to check
                    support.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Check the supported models list in documentation</li>
                    <li>
                      For unsupported models, manually configure{' '}
                      <code>maxInputTokens</code>
                    </li>
                    <li>
                      Token estimation falls back to GPT-4 tokenizer for unknown
                      models
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
                      'Top-level chat hook with built-in token tracking',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'MemoryProvider',
                    type: 'component',
                    description: 'Memory context for token-aware chat history',
                    href: '/reference/hooks/use-memory',
                  },
                  {
                    name: 'TokenBudgetBar',
                    type: 'component',
                    description: 'Pre-built UI component for token display',
                    href: '/reference/components/token-budget-bar',
                  },
                  {
                    name: 'useCompression',
                    type: 'hook',
                    description: 'Compress context to fit within budget',
                    href: '/reference/hooks/use-compression',
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
