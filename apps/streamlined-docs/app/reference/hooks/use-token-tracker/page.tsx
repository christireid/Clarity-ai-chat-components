'use client'

/**
 * useTokenTracker Hook - API Reference Documentation
 *
 * Documentation for the useTokenTracker hook - a production-ready hook for
 * tracking token usage, monitoring costs, and managing context window limits.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Activity,
  DollarSign,
  TrendingDown,
  Database,
  AlertTriangle,
  Download,
  BarChart3,
  PiggyBank,
  Zap,
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
    id: 'signature',
    title: 'Signature',
  },
  {
    id: 'options',
    title: 'Options',
  },
  {
    id: 'return',
    title: 'Return Values',
  },
  {
    id: 'tracking-methods',
    title: 'Tracking Methods',
    children: [
      { id: 'record', title: 'record()' },
      { id: 'retrieve', title: 'retrieve()' },
      { id: 'aggregate', title: 'aggregate()' },
    ],
  },
  {
    id: 'cost-impact',
    title: 'Cost Impact' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-chat', title: 'Chat Integration' },
      { id: 'example-dashboard', title: 'Dashboard Integration' },
      { id: 'example-export', title: 'Export Functionality' },
    ],
  },
  { id: 'persistence', title: 'Data Persistence' },
  { id: 'performance', title: 'Performance Optimization' },
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

const optionsProps: PropDefinition[] = [
  {
    name: 'modelName',
    type: 'string',
    required: true,
    description:
      'Model name for token limit and pricing lookup (e.g., "gpt-4", "claude-3-opus"). Auto-detects limits and costs.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description:
      'Override maximum tokens for model. If not specified, auto-detected from modelName.',
  },
  {
    name: 'inputCostPerToken',
    type: 'number',
    description:
      'Override input token cost in dollars. If not specified, auto-detected from modelName.',
  },
  {
    name: 'outputCostPerToken',
    type: 'number',
    description:
      'Override output token cost in dollars. If not specified, auto-detected from modelName.',
  },
  {
    name: 'warningThreshold',
    type: 'number',
    default: '0.8',
    description:
      'Warning threshold as decimal (0.8 = 80%). Triggers onWarning callback and isNearLimit flag.',
  },
  {
    name: 'criticalThreshold',
    type: 'number',
    default: '0.95',
    description:
      'Critical threshold as decimal (0.95 = 95%). Triggers onCritical callback and isCritical flag.',
  },
  {
    name: 'onWarning',
    type: '() => void',
    description:
      'Callback when warning threshold exceeded. Called once per threshold crossing.',
  },
  {
    name: 'onCritical',
    type: '() => void',
    description:
      'Callback when critical threshold exceeded. Called once per threshold crossing.',
  },
]

const returnProps: PropDefinition[] = [
  {
    name: 'tokens',
    type: 'number',
    description: 'Total tokens in conversation (input + output).',
  },
  {
    name: 'inputTokens',
    type: 'number',
    description: 'Total input tokens (user and system messages).',
  },
  {
    name: 'outputTokens',
    type: 'number',
    description: 'Total output tokens (assistant messages).',
  },
  {
    name: 'estimatedCost',
    type: 'number',
    description:
      'Estimated total cost in dollars based on input/output token counts.',
  },
  {
    name: 'isNearLimit',
    type: 'boolean',
    description:
      'Whether token usage is at or above warningThreshold (default: 80%).',
  },
  {
    name: 'isCritical',
    type: 'boolean',
    description:
      'Whether token usage is at or above criticalThreshold (default: 95%).',
  },
  {
    name: 'percentage',
    type: 'number',
    description: 'Percentage of token limit used (0-100).',
  },
  {
    name: 'canSend',
    type: '(estimatedTokens: number) => boolean',
    description:
      'Check if sending a message with estimated tokens would stay within limit.',
  },
  {
    name: 'suggestPruning',
    type: 'boolean',
    description:
      'Whether to suggest pruning old messages (true when isCritical is true).',
  },
  {
    name: 'addMessage',
    type: '(message: MessageWithTokens) => void',
    description:
      'Add message to tracker. Updates token counts and cost estimates.',
  },
  {
    name: 'removeMessage',
    type: '(index: number) => void',
    description:
      'Remove message from tracker by index. Updates token counts and cost estimates.',
  },
  {
    name: 'clear',
    type: '() => void',
    description:
      'Clear all messages and reset tracking state (including warning flags).',
  },
  {
    name: 'estimateTokens',
    type: '(text: string) => number',
    description:
      'Estimate tokens for text using character-based approximation plus formatting overhead.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  useTokenTracker,
  type UseTokenTrackerOptions,
  type UseTokenTrackerReturn,
  type MessageWithTokens,
} from '@clarity-chat/react'`

const signatureCode = `function useTokenTracker(
  options: UseTokenTrackerOptions
): UseTokenTrackerReturn`

const basicUsageCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useState } from 'react'

function ChatWithTracking() {
  const [messages, setMessages] = useState([])

  const {
    tokens,
    estimatedCost,
    isNearLimit,
    percentage,
    addMessage,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.8,
    onWarning: () => {
      console.log('Warning: Approaching token limit')
    },
  })

  const handleSendMessage = (content: string) => {
    const newMessage = { role: 'user', content }
    addMessage(newMessage)
    setMessages([...messages, newMessage])
  }

  return (
    <div>
      <div className="token-display">
        <p>Tokens: {tokens} ({percentage.toFixed(1)}%)</p>
        <p>Cost: \${estimatedCost.toFixed(4)}</p>
        {isNearLimit && <p>⚠️ Warning: Near limit</p>}
      </div>
      <ChatInput onSend={handleSendMessage} />
    </div>
  )
}`

const chatIntegrationCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function ChatWithRealTimeTracking() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')

  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    isNearLimit,
    isCritical,
    percentage,
    canSend,
    addMessage,
    removeMessage,
    clear,
    estimateTokens,
  } = useTokenTracker({
    modelName: 'gpt-4',
    warningThreshold: 0.75,
    criticalThreshold: 0.9,
    onWarning: () => {
      toast.warning('Context usage at 75% - consider pruning history')
    },
    onCritical: () => {
      toast.error('Context usage at 90% - pruning recommended')
    },
  })

  const handleSend = useCallback(() => {
    const estimated = estimateTokens(input)

    if (!canSend(estimated)) {
      toast.error('Message would exceed token limit!')
      return
    }

    const newMessage = { role: 'user', content: input }
    addMessage(newMessage)
    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }, [input, canSend, estimateTokens, addMessage])

  const handleRemoveMessage = useCallback((index: number) => {
    removeMessage(index)
    setMessages((prev) => prev.filter((_, i) => i !== index))
  }, [removeMessage])

  const handleClearHistory = useCallback(() => {
    clear()
    setMessages([])
  }, [clear])

  return (
    <div className="flex flex-col h-screen">
      {/* Token Usage Header */}
      <div className="p-4 border-b bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold">Token Usage</span>
          <span
            className={cn(
              'font-bold',
              isCritical
                ? 'text-red-600'
                : isNearLimit
                  ? 'text-yellow-600'
                  : 'text-green-600'
            )}
          >
            {percentage.toFixed(1)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all',
              isCritical
                ? 'bg-red-600'
                : isNearLimit
                  ? 'bg-yellow-600'
                  : 'bg-green-600'
            )}
            style={{ width: \`\${Math.min(percentage, 100)}%\` }}
          />
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
          <div>
            <p>Total: {tokens}</p>
          </div>
          <div>
            <p>Input: {inputTokens}</p>
          </div>
          <div>
            <p>Output: {outputTokens}</p>
          </div>
        </div>

        <div className="mt-2 text-sm">
          <p className="font-semibold text-foreground">
            Estimated Cost: \${estimatedCost.toFixed(4)}
          </p>
        </div>

        {/* Actions */}
        {isNearLimit && (
          <button
            onClick={handleClearHistory}
            className="mt-3 w-full px-3 py-1.5 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 rounded text-sm hover:bg-yellow-500/20"
          >
            Clear History to Free Space
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className="flex items-start justify-between gap-3">
            <div className="flex-1 p-3 bg-muted rounded">
              <p className="text-xs font-semibold mb-1">{msg.role}</p>
              <p className="text-sm">{msg.content}</p>
            </div>
            <button
              onClick={() => handleRemoveMessage(i)}
              className="text-xs text-muted-foreground hover:text-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded"
            disabled={isCritical}
          />
          <button
            onClick={handleSend}
            disabled={isCritical || !input.trim()}
            className="px-4 py-2 bg-brand-500 text-white rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {isCritical && (
          <p className="text-sm text-red-600 mt-2">
            Token limit reached - please clear history to continue
          </p>
        )}
      </div>
    </div>
  )
}`

const dashboardIntegrationCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function TokenAnalyticsDashboard() {
  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    percentage,
  } = useTokenTracker({
    modelName: 'gpt-4',
  })

  // Calculate metrics for 50-70% cost reduction monitoring
  const metrics = useMemo(() => {
    const baseline = estimatedCost / 0.3 // Assuming 70% reduction
    const savings = baseline - estimatedCost
    const savingsPercent = (savings / baseline) * 100

    return {
      baseline: baseline.toFixed(4),
      current: estimatedCost.toFixed(4),
      savings: savings.toFixed(4),
      savingsPercent: savingsPercent.toFixed(1),
    }
  }, [estimatedCost])

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Tokens Card */}
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Total Tokens</p>
          <Activity className="w-4 h-4 text-blue-500" />
        </div>
        <p className="text-3xl font-bold">{tokens.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {percentage.toFixed(1)}% of limit
        </p>
      </div>

      {/* Current Cost Card */}
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Current Cost</p>
          <DollarSign className="w-4 h-4 text-green-500" />
        </div>
        <p className="text-3xl font-bold">\${metrics.current}</p>
        <p className="text-xs text-muted-foreground mt-1">
          vs \${metrics.baseline} baseline
        </p>
      </div>

      {/* Savings Card */}
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">Cost Savings</p>
          <TrendingDown className="w-4 h-4 text-emerald-500" />
        </div>
        <p className="text-3xl font-bold text-emerald-600">
          {metrics.savingsPercent}%
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          \${metrics.savings} saved
        </p>
      </div>

      {/* Input/Output Ratio Card */}
      <div className="p-6 bg-card border rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-muted-foreground">I/O Ratio</p>
          <BarChart3 className="w-4 h-4 text-purple-500" />
        </div>
        <p className="text-3xl font-bold">
          {inputTokens > 0
            ? (outputTokens / inputTokens).toFixed(2)
            : '0.00'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {inputTokens}i / {outputTokens}o
        </p>
      </div>

      {/* Cost Reduction Badge */}
      <div className="md:col-span-2 lg:col-span-4 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
            <PiggyBank className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-lg">
              Monitor your 50-70% cost reduction in real-time
            </p>
            <p className="text-sm text-muted-foreground">
              Current savings: {metrics.savingsPercent}% -
              {parseFloat(metrics.savingsPercent) >= 50
                ? parseFloat(metrics.savingsPercent) >= 70
                  ? ' Exceeding target!'
                  : ' On target!'
                : ' Below target - review optimization strategies'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}`

const exportFunctionalityCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useCallback } from 'react'

function TokenTrackerWithExport() {
  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    percentage,
  } = useTokenTracker({
    modelName: 'gpt-4',
  })

  const exportToJSON = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      model: 'gpt-4',
      metrics: {
        totalTokens: tokens,
        inputTokens,
        outputTokens,
        estimatedCost,
        utilizationPercent: percentage,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`token-usage-\${Date.now()}.json\`
    a.click()
    URL.revokeObjectURL(url)
  }, [tokens, inputTokens, outputTokens, estimatedCost, percentage])

  const exportToCSV = useCallback(() => {
    const headers = ['Timestamp', 'Total Tokens', 'Input Tokens', 'Output Tokens', 'Estimated Cost', 'Utilization %']
    const row = [
      new Date().toISOString(),
      tokens,
      inputTokens,
      outputTokens,
      estimatedCost.toFixed(4),
      percentage.toFixed(2),
    ]

    const csv = [headers.join(','), row.join(',')].join('\\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`token-usage-\${Date.now()}.csv\`
    a.click()
    URL.revokeObjectURL(url)
  }, [tokens, inputTokens, outputTokens, estimatedCost, percentage])

  return (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded">
        <p className="text-sm text-muted-foreground">
          Export token usage data for analysis and record-keeping
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={exportToJSON}
          className="flex items-center gap-2 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>
    </div>
  )
}`

const persistenceCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useEffect } from 'react'

function TokenTrackerWithPersistence() {
  const {
    tokens,
    inputTokens,
    outputTokens,
    estimatedCost,
    addMessage,
    clear,
  } = useTokenTracker({
    modelName: 'gpt-4',
  })

  // Save to localStorage whenever metrics change
  useEffect(() => {
    const data = {
      tokens,
      inputTokens,
      outputTokens,
      estimatedCost,
      lastUpdated: Date.now(),
    }
    localStorage.setItem('token-tracker-data', JSON.stringify(data))
  }, [tokens, inputTokens, outputTokens, estimatedCost])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('token-tracker-data')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        console.log('Loaded token data:', data)
        // Note: Cannot restore messages directly, only metrics
        // Consider storing messages separately if needed
      } catch (error) {
        console.error('Failed to load token data:', error)
      }
    }
  }, [])

  // Save to backend API
  const saveToBackend = async () => {
    const data = {
      tokens,
      inputTokens,
      outputTokens,
      estimatedCost,
      timestamp: new Date().toISOString(),
    }

    try {
      await fetch('/api/token-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      console.log('Saved to backend')
    } catch (error) {
      console.error('Failed to save to backend:', error)
    }
  }

  return (
    <div>
      <p>Token tracking data is auto-saved to localStorage</p>
      <button onClick={saveToBackend}>Save to Backend</button>
    </div>
  )
}`

const performanceOptimizationCode = `import { useTokenTracker } from '@clarity-chat/react'
import { useMemo, useCallback } from 'react'

function OptimizedTokenTracker() {
  const {
    tokens,
    estimatedCost,
    addMessage,
  } = useTokenTracker({
    modelName: 'gpt-4',
  })

  // Memoize expensive calculations
  const formattedCost = useMemo(
    () => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4,
    }).format(estimatedCost),
    [estimatedCost]
  )

  const formattedTokens = useMemo(
    () => tokens.toLocaleString(),
    [tokens]
  )

  // Memoize callbacks to prevent re-renders
  const handleAddMessage = useCallback((content: string) => {
    addMessage({ role: 'user', content })
  }, [addMessage])

  // Batch message additions for better performance
  const handleBatchAdd = useCallback((messages: Array<{ role: string; content: string }>) => {
    messages.forEach(msg => addMessage(msg as any))
  }, [addMessage])

  return (
    <div>
      <p>Tokens: {formattedTokens}</p>
      <p>Cost: {formattedCost}</p>
    </div>
  )
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseTokenTrackerPage() {
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
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Activity className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                      50-90% Savings
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useTokenTracker
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Production-ready hook for tracking token usage, monitoring
                costs, and managing context window limits in AI conversations.
                Essential for building cost-transparent applications.
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
                  icon: Activity,
                  label: 'Real-Time Tracking',
                  desc: 'Live token counts',
                },
                {
                  icon: DollarSign,
                  label: 'Cost Estimation',
                  desc: 'Accurate pricing',
                },
                {
                  icon: TrendingDown,
                  label: 'Cost Reduction',
                  desc: 'Monitor 50-70% savings',
                },
                {
                  icon: Database,
                  label: 'Data Export',
                  desc: 'JSON/CSV support',
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
                  The <code>useTokenTracker</code> hook provides comprehensive
                  token tracking for AI conversations. It automatically counts
                  tokens, estimates costs, monitors context limits, and provides
                  real-time metrics for building cost-transparent applications.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time token counting:</strong> Track
                    input/output tokens across conversation
                  </li>
                  <li>
                    <strong>Automatic cost estimation:</strong> Built-in pricing
                    for popular models (GPT-4, Claude, etc.)
                  </li>
                  <li>
                    <strong>Context limit monitoring:</strong> Warning and
                    critical thresholds prevent overflow
                  </li>
                  <li>
                    <strong>Cost reduction tracking:</strong> Monitor your
                    50-70% cost reduction in real-time
                  </li>
                  <li>
                    <strong>Pre-send validation:</strong> Check if messages
                    would exceed limits
                  </li>
                  <li>
                    <strong>Data export:</strong> Export metrics to JSON/CSV for
                    analysis
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800 mt-6 not-prose">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Cost Reduction:</strong> Use this hook to monitor
                    the 50-70% cost reduction achieved through provider caching,
                    compression, and smart routing. The{' '}
                    <code>estimatedCost</code> reflects optimized costs.
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
              <CodeBlock
                code={signatureCode}
                language="tsx"
                filename="Signature"
                showDownloadButton={false}
              />
              <p className="text-muted-foreground mt-4">
                Takes a configuration object and returns tracking methods and
                real-time metrics.
              </p>
            </Section>

            {/* Options Section */}
            <Section id="options" title="Options">
              <PropsTable props={optionsProps} />
            </Section>

            {/* Return Values Section */}
            <Section id="return" title="Return Values">
              <PropsTable props={returnProps} />
            </Section>

            {/* Tracking Methods Section */}
            <Section id="tracking-methods" title="Tracking Methods">
              <p className="text-muted-foreground mb-6">
                The hook provides three primary methods for managing token
                tracking:
              </p>

              <SubSection id="record" title="record()">
                <p className="text-muted-foreground mb-4">
                  Use <code>addMessage()</code> to record new messages and
                  update token counts:
                </p>
                <CodeBlock
                  code={`const { addMessage } = useTokenTracker({ modelName: 'gpt-4' })

// Record a user message
addMessage({ role: 'user', content: 'Hello!', tokens: 5 })

// Record an assistant message
addMessage({ role: 'assistant', content: 'Hi there!', tokens: 7 })

// Auto-estimate tokens if not provided
addMessage({ role: 'user', content: 'How are you?' })`}
                  language="tsx"
                  filename="Record Messages"
                />
              </SubSection>

              <SubSection id="retrieve" title="retrieve()">
                <p className="text-muted-foreground mb-4">
                  Access current metrics from the returned object:
                </p>
                <CodeBlock
                  code={`const {
  tokens,           // Total tokens
  inputTokens,      // Input tokens only
  outputTokens,     // Output tokens only
  estimatedCost,    // Cost in dollars
  percentage,       // % of limit used
  isNearLimit,      // Warning threshold
  isCritical,       // Critical threshold
} = useTokenTracker({ modelName: 'gpt-4' })

console.log(\`Using \${tokens} tokens (\${percentage.toFixed(1)}%)\`)
console.log(\`Estimated cost: $\${estimatedCost.toFixed(4)}\`)`}
                  language="tsx"
                  filename="Retrieve Metrics"
                />
              </SubSection>

              <SubSection id="aggregate" title="aggregate()">
                <p className="text-muted-foreground mb-4">
                  Aggregate metrics for custom reporting:
                </p>
                <CodeBlock
                  code={`const { tokens, inputTokens, outputTokens, estimatedCost } = useTokenTracker({
  modelName: 'gpt-4',
})

// Calculate average tokens per message
const avgTokensPerMessage = messages.length > 0
  ? tokens / messages.length
  : 0

// Calculate input/output ratio
const ioRatio = inputTokens > 0
  ? outputTokens / inputTokens
  : 0

// Calculate cost per message
const costPerMessage = messages.length > 0
  ? estimatedCost / messages.length
  : 0

const aggregateMetrics = {
  totalTokens: tokens,
  avgTokensPerMessage,
  ioRatio,
  costPerMessage,
  totalCost: estimatedCost,
}`}
                  language="tsx"
                  filename="Aggregate Metrics"
                />
              </SubSection>
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact">
              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <PiggyBank className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">
                    Monitor your 50-70% cost reduction in real-time
                  </h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  The <code>useTokenTracker</code> hook shows the impact of your
                  optimization strategies by tracking the actual costs after
                  provider caching, compression, and smart routing are applied.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Provider Caching:</strong> Costs reflect 90%
                      discount on cached tokens (Anthropic), 50% (OpenAI), or 75%
                      (Google)
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Compression:</strong> Token counts reflect
                      compressed content, reducing both tokens and cost by 15-25%
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong>Smart Routing:</strong> Costs reflect routing to
                      cheaper models for simple queries (10-15% additional
                      savings)
                    </p>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold mb-3">Real-World Cost Example</h4>
              <div className="overflow-x-auto rounded-lg border border-border/50 not-prose">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left">Scenario</th>
                      <th className="px-4 py-3 text-left">Baseline Cost</th>
                      <th className="px-4 py-3 text-left">Optimized Cost</th>
                      <th className="px-4 py-3 text-left">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3">Support Chatbot</td>
                      <td className="px-4 py-3">$0.15/conversation</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        $0.04/conversation
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        73% reduction
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3">Document Analysis</td>
                      <td className="px-4 py-3">$2.40/document</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        $0.72/document
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        70% reduction
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Code Review</td>
                      <td className="px-4 py-3">$1.20/review</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        $0.36/review
                      </td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">
                        70% reduction
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-chat" title="Chat Integration">
                <p className="text-muted-foreground mb-4">
                  Complete chat interface with real-time token tracking and cost
                  monitoring:
                </p>
                <CodeBlock
                  code={chatIntegrationCode}
                  language="tsx"
                  filename="ChatWithRealTimeTracking.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-dashboard" title="Dashboard Integration">
                <p className="text-muted-foreground mb-4">
                  Analytics dashboard showing token metrics and cost reduction
                  monitoring:
                </p>
                <CodeBlock
                  code={dashboardIntegrationCode}
                  language="tsx"
                  filename="TokenAnalyticsDashboard.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-export" title="Export Functionality">
                <p className="text-muted-foreground mb-4">
                  Export token usage data to JSON or CSV for analysis:
                </p>
                <CodeBlock
                  code={exportFunctionalityCode}
                  language="tsx"
                  filename="TokenTrackerWithExport.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Data Persistence Section */}
            <Section id="persistence" title="Data Persistence">
              <p className="text-muted-foreground mb-4">
                Save token tracking data to localStorage or backend APIs for
                historical analysis:
              </p>
              <CodeBlock
                code={persistenceCode}
                language="tsx"
                filename="TokenTrackerWithPersistence.tsx"
                showLineNumbers
              />
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-200 dark:border-amber-800 mt-4">
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  <strong>Note:</strong> The hook does not persist messages
                  internally. To restore full state, save and restore messages
                  separately using your own state management.
                </p>
              </div>
            </Section>

            {/* Performance Optimization Section */}
            <Section id="performance" title="Performance Optimization">
              <p className="text-muted-foreground mb-4">
                Optimize performance with memoization and batching:
              </p>
              <CodeBlock
                code={performanceOptimizationCode}
                language="tsx"
                filename="OptimizedTokenTracker.tsx"
                showLineNumbers
              />
              <div className="space-y-3 mt-6">
                <h4 className="font-semibold">Performance Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                  <li>
                    Memoize expensive calculations (formatting, aggregations)
                  </li>
                  <li>Use <code>useCallback</code> for event handlers</li>
                  <li>
                    Provide pre-computed <code>tokens</code> in messages when
                    available
                  </li>
                  <li>Batch message additions instead of adding one-by-one</li>
                  <li>
                    Debounce UI updates if tracking very frequent changes
                  </li>
                </ul>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Token counts seem inaccurate
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Estimated counts are approximations based on character count.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Provide pre-computed <code>tokens</code> in messages for
                      accuracy
                    </li>
                    <li>
                      Use accurate tokenization libraries (e.g., tiktoken) before
                      adding messages
                    </li>
                    <li>
                      Estimation includes +4 token overhead for role/formatting
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Callbacks not firing
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Callbacks only fire once per threshold crossing.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      <code>onWarning</code> fires when crossing warningThreshold
                      (default 80%)
                    </li>
                    <li>
                      <code>onCritical</code> fires when crossing
                      criticalThreshold (default 95%)
                    </li>
                    <li>Callbacks reset when usage drops below threshold</li>
                    <li>Check threshold values are decimals (0.8, not 80)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Cost estimates differ from actual API costs
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Estimates use current pricing which may change.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Pricing is accurate as of package build date</li>
                    <li>
                      Override costs with <code>inputCostPerToken</code> and{' '}
                      <code>outputCostPerToken</code>
                    </li>
                    <li>
                      Actual costs include provider caching discounts (90%/50%/75%)
                    </li>
                    <li>Check provider documentation for latest pricing</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Model not recognized
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Provide custom limits and pricing for unsupported models.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Set <code>maxTokens</code>, <code>inputCostPerToken</code>,
                      and <code>outputCostPerToken</code>
                    </li>
                    <li>Check spelling of <code>modelName</code></li>
                    <li>See supported models in MODEL_REGISTRY</li>
                    <li>
                      Falls back to 4096 tokens and $0 cost if model unknown
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
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description:
                      'Advanced budget monitoring with auto-trimming and quality gates',
                    href: '/reference/hooks/use-token-budget-monitor',
                  },
                  {
                    name: 'useTokenCount',
                    type: 'hook',
                    description:
                      'Simple token counting for single text inputs with debouncing',
                    href: '/reference/hooks/use-token-count',
                  },
                  {
                    name: 'React Integration',
                    type: 'cookbook',
                    description:
                      'Complete guide to integrating token optimization in React apps',
                    href: '/cookbook/react-integration',
                  },
                  {
                    name: 'TokenUsageMeter',
                    type: 'component',
                    description:
                      'Pre-built UI component for displaying token usage',
                    href: '/reference/components/token-usage-meter',
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
                            : api.type === 'cookbook'
                              ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400'
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
                  href="/reference/hooks/use-token-count"
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
                      useTokenCount
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
