'use client'

/**
 * TokenOptimizationDashboard Component - API Reference Documentation
 *
 * A comprehensive token optimization dashboard with real-time monitoring,
 * detailed breakdowns, and visual analytics for tracking AI token usage and savings.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Copy,
  Check,
  ChevronRight,
  Zap,
  DollarSign,
  TrendingDown,
  Activity,
  Eye,
  AlertCircle,
  Keyboard,
  Gauge,
  Target,
  PieChart,
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
  const [showBreakdown, setShowBreakdown] = React.useState(true)
  const [realTime, setRealTime] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)

  // Mock metrics
  const mockMetrics = {
    totalTokens: 50000,
    tokensSaved: 15000,
    costSaved: 0.45,
    breakdown: {
      promptCompression: { tokens: 4000, percent: 27 },
      caching: { hits: 120, savings: 5000 },
      modelRouting: { savings: 3000, percent: 40 },
      responseLimiting: { tokens: 2000, percent: 15 },
      batching: { requests: 50, savings: 800 },
      throttling: { callsSaved: 200 },
      referencing: { bytesSaved: 50000, percent: 60 },
    },
    savingsPercent: 30,
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showBreakdown}
            onChange={(e) => setShowBreakdown(e.target.checked)}
            className="rounded"
          />
          Show Breakdown
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={realTime}
            onChange={(e) => setRealTime(e.target.checked)}
            className="rounded"
          />
          Real-time Mode
        </label>
        <button
          onClick={() => {
            setIsLoading(true)
            setTimeout(() => setIsLoading(false), 2000)
          }}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Toggle Loading
        </button>
        <button
          onClick={() => setHasError(!hasError)}
          className="text-sm text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted/50"
        >
          Toggle Error
        </button>
      </div>

      {/* Demo Dashboard */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-6 bg-card" role="status" aria-busy="true">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-36 bg-muted rounded" />
                  <div className="h-4 w-48 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 bg-muted/20 rounded-lg">
                    <div className="h-8 w-20 bg-muted rounded mb-2" />
                    <div className="h-4 w-16 bg-muted/60 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : hasError ? (
          <div className="p-6 bg-card" role="alert">
            <div className="flex flex-col items-center justify-center gap-3 text-center py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Failed to load optimization data
                </p>
                <p className="text-xs text-muted-foreground">
                  Connection timeout. Please try again.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Token Optimization
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Real-time savings and efficiency metrics
                </p>
              </div>
              {realTime && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live
                </div>
              )}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-200/20">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {mockMetrics.tokensSaved.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tokens Saved
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-2">
                  {mockMetrics.savingsPercent}% reduction
                </div>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200/20">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${mockMetrics.costSaved.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Cost Saved
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Per {mockMetrics.totalTokens.toLocaleString()} tokens
                </div>
              </div>

              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-200/20">
                <div className="text-2xl font-bold text-foreground">
                  {mockMetrics.totalTokens.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Total Tokens
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Processed in session
                </div>
              </div>
            </div>

            {/* Breakdown */}
            {showBreakdown && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Optimization Breakdown
                </h4>

                {/* Sample breakdown items */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">✂️</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        Prompt Compression
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        4,000
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Shortened prompts while preserving meaning
                    </div>
                    <div className="mt-2">
                      <div className="h-1.5 bg-muted-foreground/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: '27%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl">💾</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        Smart Caching
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        5,000
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      120 cache hits
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
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
  { id: 'props', title: 'Props Reference' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Usage' },
      { id: 'example-with-hook', title: 'With useTokenBudgetMonitor' },
      { id: 'example-realtime', title: 'Real-time Monitoring' },
      { id: 'example-cost-tracking', title: 'With Cost Tracking' },
      { id: 'example-chat-integration', title: 'Chat Integration' },
    ],
  },
  { id: 'optimization-metrics', title: 'Optimization Metrics' },
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

const mainProps: PropDefinition[] = [
  {
    name: 'metrics',
    type: 'OptimizationMetrics',
    required: true,
    description:
      'Current optimization metrics including total tokens, savings, cost, and detailed breakdown.',
  },
  {
    name: 'showBreakdown',
    type: 'boolean',
    default: 'true',
    description:
      'Show detailed optimization breakdown by technique (compression, caching, routing, etc.).',
  },
  {
    name: 'realTime',
    type: 'boolean',
    default: 'false',
    description:
      'Enable real-time updates. Dashboard will refresh at specified interval.',
  },
  {
    name: 'refreshInterval',
    type: 'number',
    default: '5000',
    description:
      'Refresh interval in milliseconds for real-time updates. Only applies when realTime is true.',
  },
  {
    name: 'costPerToken',
    type: 'number',
    default: '0.000002',
    description:
      'Cost per token for calculations. Used to estimate savings in dollars.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the dashboard container.',
  },
  {
    name: 'onClick',
    type: '() => void',
    description:
      'Callback when dashboard is clicked. Enables hover effect when provided.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description:
      'Whether the dashboard is in a loading state. Shows skeleton placeholder.',
  },
  {
    name: 'error',
    type: 'Error | string | null',
    description:
      'Error to display. When provided, renders error state with message.',
  },
]

const metricsTypeProps: PropDefinition[] = [
  {
    name: 'totalTokens',
    type: 'number',
    required: true,
    description: 'Total tokens processed in the session.',
  },
  {
    name: 'tokensSaved',
    type: 'number',
    required: true,
    description: 'Tokens saved through optimization techniques.',
  },
  {
    name: 'costSaved',
    type: 'number',
    required: true,
    description: 'Cost saved in dollars.',
  },
  {
    name: 'savingsPercent',
    type: 'number',
    required: true,
    description: 'Overall savings percentage (0-100).',
  },
  {
    name: 'breakdown',
    type: 'OptimizationBreakdown',
    required: true,
    description: 'Detailed breakdown by optimization technique.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
import type { OptimizationMetrics } from '@clarity-chat/token-optimization/react'

// Don't forget to import styles
import '@clarity-chat/token-optimization/styles.css'`

const basicUsageCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'

function App() {
  const metrics = {
    totalTokens: 50000,
    tokensSaved: 15000,
    costSaved: 0.45,
    breakdown: {
      promptCompression: { tokens: 4000, percent: 27 },
      caching: { hits: 120, savings: 5000 },
      modelRouting: { savings: 3000, percent: 40 },
      responseLimiting: { tokens: 2000, percent: 15 },
      batching: { requests: 50, savings: 800 },
      throttling: { callsSaved: 200 },
      referencing: { bytesSaved: 50000, percent: 60 },
    },
    savingsPercent: 30,
  }

  return (
    <TokenOptimizationDashboard
      metrics={metrics}
      showBreakdown
    />
  )
}`

const withHookCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'
import { useClarityChat } from '@clarity-chat/react'

function ChatWithOptimization() {
  const { messages } = useClarityChat({ api: '/api/chat' })

  const { usage } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    model: 'gpt-4o',
    reservedForOutput: 4096,
  })

  // Calculate savings from actual usage
  const metrics = {
    totalTokens: usage.current,
    tokensSaved: calculateSavings(messages),
    costSaved: calculateCostSavings(usage),
    breakdown: analyzeOptimizations(messages),
    savingsPercent: (savings / usage.current) * 100,
  }

  return (
    <div className="space-y-4">
      <TokenOptimizationDashboard metrics={metrics} />
      <ChatInterface messages={messages} />
    </div>
  )
}`

const realTimeCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
import { useState, useEffect } from 'react'

function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null)

  // Fetch metrics from your API
  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await fetch('/api/token-metrics').then(r => r.json())
      setMetrics(data)
    }

    fetchMetrics()
  }, [])

  if (!metrics) return <div>Loading...</div>

  return (
    <TokenOptimizationDashboard
      metrics={metrics}
      realTime
      refreshInterval={3000}
      showBreakdown
    />
  )
}`

const costTrackingCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
import { useTokenBudgetMonitor, estimateTokenCost } from '@clarity-chat/token-optimization'

function CostTrackingDashboard() {
  const { usage, updateMessages } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    model: 'gpt-4o',
  })

  // Get cost estimate
  const costInfo = estimateTokenCost(usage, 'gpt-4o')

  const metrics = {
    totalTokens: usage.current,
    tokensSaved: calculateSavings(),
    costSaved: costInfo?.totalCost || 0,
    breakdown: getOptimizationBreakdown(),
    savingsPercent: 30,
  }

  return (
    <div className="space-y-4">
      <TokenOptimizationDashboard
        metrics={metrics}
        costPerToken={0.000005} // GPT-4o pricing
      />

      <div className="text-sm text-muted-foreground">
        <p>Input cost: {costInfo?.formattedCost}</p>
        <p>Estimated output cost: ${costInfo?.estimatedOutputCost.toFixed(4)}</p>
      </div>
    </div>
  )
}`

const chatIntegrationCode = `import { TokenOptimizationDashboard } from '@clarity-chat/token-optimization/react'
import { ChatWindow } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'
import { useTokenBudgetMonitor } from '@clarity-chat/token-optimization'

function IntegratedChat() {
  const { messages, sendMessage, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const { usage, updateMessages } = useTokenBudgetMonitor({
    maxInputTokens: 128000,
    model: 'gpt-4o',
  })

  // Update token monitor when messages change
  React.useEffect(() => {
    const budgetMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      trimmable: msg.role !== 'system',
    }))
    updateMessages(budgetMessages)
  }, [messages, updateMessages])

  const metrics = buildMetricsFromUsage(usage)

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <ChatWindow
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </div>

      <aside className="w-96 space-y-4">
        <TokenOptimizationDashboard
          metrics={metrics}
          realTime
          showBreakdown
        />
      </aside>
    </div>
  )
}`

const typescriptCode = `// Main component props
interface TokenOptimizationDashboardProps {
  /** Current optimization metrics */
  metrics: OptimizationMetrics
  /** Show detailed breakdown */
  showBreakdown?: boolean
  /** Enable real-time updates */
  realTime?: boolean
  /** Refresh interval for real-time (ms) */
  refreshInterval?: number
  /** Cost per token for calculations */
  costPerToken?: number
  /** Custom CSS class */
  className?: string
  /** Callback when dashboard is clicked */
  onClick?: () => void
  /** Whether the dashboard is in a loading state */
  isLoading?: boolean
  /** Error to display (renders error state when provided) */
  error?: Error | string | null
}

// Optimization metrics structure
interface OptimizationMetrics {
  /** Total tokens processed */
  totalTokens: number
  /** Tokens saved through optimization */
  tokensSaved: number
  /** Cost saved in dollars */
  costSaved: number
  /** Overall savings percentage */
  savingsPercent: number
  /** Optimization breakdown by technique */
  breakdown: {
    promptCompression: { tokens: number; percent: number }
    caching: { hits: number; savings: number }
    modelRouting: { savings: number; percent: number }
    responseLimiting: { tokens: number; percent: number }
    batching: { requests: number; savings: number }
    throttling: { callsSaved: number }
    referencing: { bytesSaved: number; percent: number }
  }
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function TokenOptimizationDashboardPage() {
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
                  <BarChart3 className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Showcase
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                TokenOptimizationDashboard
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A comprehensive dashboard for visualizing token optimization
                metrics and savings. Features real-time tracking, detailed
                breakdowns, cost estimation, and visual analytics with a premium
                glassmorphism design.
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
                  icon: Activity,
                  label: 'Real-time Tracking',
                  desc: 'Live token usage',
                },
                {
                  icon: DollarSign,
                  label: 'Cost Estimation',
                  desc: 'Accurate pricing',
                },
                {
                  icon: Target,
                  label: 'Budget Alerts',
                  desc: 'Threshold warnings',
                },
                {
                  icon: PieChart,
                  label: 'Visual Analytics',
                  desc: 'Detailed breakdowns',
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
                  <code>TokenOptimizationDashboard</code> provides comprehensive
                  visibility into your AI token usage and optimization
                  strategies. It visualizes savings from multiple optimization
                  techniques including prompt compression, caching, model
                  routing, and more.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time Monitoring:</strong> Track token usage and
                    savings as they happen
                  </li>
                  <li>
                    <strong>Cost Estimation:</strong> See immediate cost impact
                    of optimizations
                  </li>
                  <li>
                    <strong>Detailed Breakdowns:</strong> Understand which
                    techniques save the most tokens
                  </li>
                  <li>
                    <strong>Visual Analytics:</strong> Progress bars and metrics
                    for easy understanding
                  </li>
                  <li>
                    <strong>Loading & Error States:</strong> Graceful handling of
                    async data
                  </li>
                  <li>
                    <strong>Premium Design:</strong> Glassmorphism UI with
                    gradient animations
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  When to Use
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Production Monitoring:</strong> Track optimization
                    performance in live apps
                  </li>
                  <li>
                    <strong>Development:</strong> Validate optimization strategies
                    during testing
                  </li>
                  <li>
                    <strong>Cost Analysis:</strong> Understand and reduce AI
                    operation costs
                  </li>
                  <li>
                    <strong>User Transparency:</strong> Show users how you're
                    optimizing their experience
                  </li>
                </ul>
              </div>
            </Section>

            {/* Installation Section */}
            <Section id="installation" title="Installation">
              <div className="space-y-4">
                <CodeBlock
                  code="npm install @clarity-chat/token-optimization"
                  language="bash"
                  filename="Terminal"
                  showDownloadButton={false}
                />

                <p className="text-muted-foreground">
                  Import the component and types:
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
                Interact with the TokenOptimizationDashboard. Toggle breakdown
                visibility, real-time mode, and test loading/error states.
              </p>

              <LiveDemo />
            </Section>

            {/* Props Reference Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                Complete API reference for TokenOptimizationDashboard props.
              </p>

              <PropsTable props={mainProps} title="Component Props" />

              <div className="mt-8">
                <PropsTable
                  props={metricsTypeProps}
                  title="OptimizationMetrics Type"
                />
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Minimal setup with static metrics:
                </p>
                <CodeBlock
                  code={basicUsageCode}
                  language="tsx"
                  filename="BasicDashboard.tsx"
                />
              </SubSection>

              <SubSection
                id="example-with-hook"
                title="With useTokenBudgetMonitor Hook"
              >
                <p className="text-muted-foreground mb-4">
                  Integrate with useTokenBudgetMonitor for automatic tracking:
                </p>
                <CodeBlock
                  code={withHookCode}
                  language="tsx"
                  filename="ChatWithOptimization.tsx"
                />
              </SubSection>

              <SubSection id="example-realtime" title="Real-time Monitoring">
                <p className="text-muted-foreground mb-4">
                  Enable live updates with API polling:
                </p>
                <CodeBlock
                  code={realTimeCode}
                  language="tsx"
                  filename="RealTimeDashboard.tsx"
                />
              </SubSection>

              <SubSection id="example-cost-tracking" title="With Cost Tracking">
                <p className="text-muted-foreground mb-4">
                  Track costs with estimateTokenCost utility:
                </p>
                <CodeBlock
                  code={costTrackingCode}
                  language="tsx"
                  filename="CostTrackingDashboard.tsx"
                />
              </SubSection>

              <SubSection
                id="example-chat-integration"
                title="Chat Integration"
              >
                <p className="text-muted-foreground mb-4">
                  Integrate with ChatWindow for live optimization display:
                </p>
                <CodeBlock
                  code={chatIntegrationCode}
                  language="tsx"
                  filename="IntegratedChat.tsx"
                />
              </SubSection>
            </Section>

            {/* Optimization Metrics Section */}
            <Section id="optimization-metrics" title="Optimization Metrics">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The dashboard tracks seven optimization techniques. Each
                  contributes to overall token savings:
                </p>

                <div className="space-y-4 mt-6">
                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">✂️</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Prompt Compression
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Shortens prompts while preserving semantic meaning.
                          Tracks tokens saved and percentage reduction.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">💾</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Smart Caching
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Reuses cached responses for identical queries. Shows
                          cache hits and tokens saved.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Model Routing
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Routes simple queries to cheaper models. Tracks savings
                          and routing percentage.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">✨</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Response Limiting
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Enforces concise responses with token limits. Shows
                          tokens saved through limiting.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">📦</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Request Batching
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Combines multiple requests to reduce overhead. Tracks
                          requests batched and savings.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">⏱️</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Smart Throttling
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Prevents unnecessary duplicate API calls. Shows calls
                          saved through throttling.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg border border-border/50 bg-card">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔗</div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">
                          Reference Handling
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Uses references instead of full data duplication. Shows
                          bytes saved and percentage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for the dashboard and metrics:
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
                <p>
                  TokenOptimizationDashboard is built with comprehensive
                  accessibility support:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5" aria-hidden="true" />
                  Screen Reader Support
                </h4>
                <ul className="space-y-2">
                  <li>
                    All metrics announced with semantic labels via{' '}
                    <code>aria-label</code>
                  </li>
                  <li>
                    Loading states use <code>role="status"</code> and{' '}
                    <code>aria-busy="true"</code>
                  </li>
                  <li>
                    Error states use <code>role="alert"</code> and{' '}
                    <code>aria-live="assertive"</code>
                  </li>
                  <li>
                    Progress bars include <code>aria-valuenow</code>,{' '}
                    <code>aria-valuemin</code>, <code>aria-valuemax</code>
                  </li>
                  <li>
                    Real-time indicator announces "Real-time updates active"
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Semantic Structure
                </h4>
                <p>
                  Dashboard uses <code>role="region"</code> with descriptive{' '}
                  <code>aria-label</code> for screen reader navigation. All
                  content is keyboard accessible.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Color Contrast
                </h4>
                <p>
                  Meets WCAG 2.1 AA standards with 4.5:1 minimum contrast for
                  text. Success/warning colors have sufficient contrast in both
                  light and dark modes.
                </p>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Metrics not updating
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Dashboard shows stale data even with realTime enabled.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Verify <code>metrics</code> prop is being updated
                        </li>
                        <li>
                          Check <code>refreshInterval</code> is reasonable
                          (1000-30000ms)
                        </li>
                        <li>
                          Ensure parent component re-renders when metrics change
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Breakdown items not showing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Optimization breakdown is empty or incomplete.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Items only show when their values are greater than 0
                        </li>
                        <li>
                          Verify <code>breakdown</code> object has correct
                          structure
                        </li>
                        <li>
                          Check that <code>showBreakdown</code> is true
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Cost calculations incorrect
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Displayed costs don't match expected values.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Set correct <code>costPerToken</code> for your model
                        </li>
                        <li>
                          Use <code>estimateTokenCost</code> utility for accurate
                          pricing
                        </li>
                        <li>
                          Check that <code>costSaved</code> is in dollars, not
                          cents
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
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description:
                      'Real-time token budget monitoring with thresholds',
                    href: '/reference/hooks/use-token-budget-monitor',
                  },
                  {
                    name: 'TokenBudgetBar',
                    type: 'component',
                    description:
                      'Visual progress bar for token budget with warnings',
                    href: '/reference/components/token-budget-bar',
                  },
                  {
                    name: 'TokenOptimizationPanel',
                    type: 'component',
                    description:
                      'Compact token optimization summary panel',
                    href: '/reference/components/token-optimization-panel',
                  },
                  {
                    name: 'TokenUsageMeter',
                    type: 'component',
                    description: 'Simple token usage meter with percentage',
                    href: '/reference/components/token-usage-meter',
                  },
                  {
                    name: 'AccurateTokenCounter',
                    type: 'utility',
                    description: 'Precise token counting for all models',
                    href: '/reference/utilities/accurate-token-counter',
                  },
                  {
                    name: 'estimateTokenCost',
                    type: 'utility',
                    description: 'Cost estimation from token usage',
                    href: '/reference/utilities/estimate-token-cost',
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
                            : api.type === 'component'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
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
                  href="/reference/components/token-optimization-panel"
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
                      TokenOptimizationPanel
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/token-usage-meter"
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
                      TokenUsageMeter
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
