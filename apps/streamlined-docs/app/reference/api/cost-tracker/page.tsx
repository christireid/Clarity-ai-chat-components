'use client'

/**
 * CostTracker API - Complete Reference Documentation
 *
 * A comprehensive cost tracking and analysis system for monitoring AI model usage,
 * validating cost reductions, and optimizing spending across projects.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Copy,
  Check,
  ChevronRight,
  TrendingDown,
  Activity,
  BarChart3,
  Download,
  Calendar,
  Zap,
  Target,
  AlertCircle,
  Database,
  Clock,
  FileText,
  Filter,
  Sparkles,
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
  const [selectedModel, setSelectedModel] = React.useState('gpt-4o')
  const [view, setView] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )

  // Mock cost data
  const totalCost = 45.32
  const dailyCost = 12.45
  const weeklyCost = 87.15
  const monthlyCost = 342.89
  const reduction = 62.5

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/50">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Model:</span>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-2 py-1 rounded border border-border/50 bg-background text-foreground text-sm"
          >
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o Mini</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            <option value="claude-3-5-haiku">Claude 3.5 Haiku</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">View:</span>
          <select
            value={view}
            onChange={(e) =>
              setView(e.target.value as 'daily' | 'weekly' | 'monthly')
            }
            className="px-2 py-1 rounded border border-border/50 bg-background text-foreground text-sm"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>
      </div>

      {/* Demo Component */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg">
        {/* Cost Overview */}
        <div className="p-6 bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${totalCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Total Cost
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${dailyCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Daily Avg
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {reduction.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Reduction
              </div>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/50">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                ${monthlyCost.toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Projected
              </div>
            </div>
          </div>

          {/* Cost Impact Badge */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-200/20">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">
                  Cost Reduction Validated
                </h4>
                <p className="text-sm text-muted-foreground">
                  You've achieved a <strong>62.5% cost reduction</strong> through
                  optimization strategies. This translates to{' '}
                  <strong>${(342.89 * 0.625).toFixed(2)}</strong> saved per month.
                </p>
              </div>
            </div>
          </div>

          {/* Cost Breakdown Chart */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-foreground mb-3">
              {view === 'daily'
                ? 'Daily'
                : view === 'weekly'
                  ? 'Weekly'
                  : 'Monthly'}{' '}
              Cost Breakdown
            </h4>
            <div className="space-y-2">
              {[
                { label: 'Input Tokens', value: 45, cost: 5.6 },
                { label: 'Output Tokens', value: 30, cost: 3.75 },
                { label: 'Cache Hits', value: 15, cost: 1.87 },
                { label: 'API Calls', value: 10, cost: 1.23 },
              ].map(({ label, value, cost }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold text-foreground">
                      ${cost.toFixed(2)} ({value}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
  { id: 'constructor', title: 'Constructor' },
  { id: 'methods', title: 'Methods' },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Tracking' },
      { id: 'example-aggregation', title: 'Aggregation' },
      { id: 'example-export', title: 'Data Export' },
      { id: 'example-dashboard', title: 'Dashboard Integration' },
      { id: 'example-real-time', title: 'Real-time vs Batch' },
      { id: 'example-persistence', title: 'Data Persistence' },
    ],
  },
  { id: 'cost-impact', title: 'Cost Impact' },
  { id: 'optimization', title: 'Optimization Integration' },
  { id: 'typescript', title: 'TypeScript' },
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

const constructorProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable cost tracking globally.',
  },
  {
    name: 'maxEvents',
    type: 'number',
    default: '10000',
    description:
      'Maximum number of events to store in memory. Older events are automatically pruned.',
  },
  {
    name: 'retentionDays',
    type: 'number',
    default: '30',
    description:
      'Number of days to retain cost data before automatic cleanup.',
  },
  {
    name: 'enableCostTracking',
    type: 'boolean',
    default: 'true',
    description: 'Enable detailed cost tracking with pricing calculations.',
  },
  {
    name: 'modelPricing',
    type: 'Record<string, { input: number; output: number }>',
    description:
      'Model-specific pricing configuration (per 1K tokens). Defaults to current market rates.',
  },
  {
    name: 'enableRealTimeAlerts',
    type: 'boolean',
    default: 'true',
    description: 'Enable real-time alerts for cost thresholds.',
  },
  {
    name: 'alertThresholds',
    type: '{ hourly: number; daily: number; perRequest: number }',
    description: 'Cost thresholds that trigger alerts when exceeded.',
  },
]

const recordingMethods: PropDefinition[] = [
  {
    name: 'recordUsage',
    type: '(event: TokenUsageEvent) => void',
    description: 'Record a single token usage event with cost tracking.',
  },
  {
    name: 'recordUsages',
    type: '(events: TokenUsageEvent[]) => void',
    description: 'Batch record multiple usage events for efficiency.',
  },
]

const retrievalMethods: PropDefinition[] = [
  {
    name: 'getAnalytics',
    type: '() => TokenAnalytics',
    description: 'Get current analytics for the last 24 hours.',
  },
  {
    name: 'getMetrics',
    type: '() => TokenMetrics',
    description:
      'Get comprehensive metrics including hourly, daily, and model-specific data.',
  },
  {
    name: 'getCostAnalysis',
    type: '() => CostAnalysis',
    description:
      'Get detailed cost analysis with breakdowns and projections.',
  },
  {
    name: 'getUsageStats',
    type: '() => UsageStats',
    description: 'Get usage statistics including trends and peak periods.',
  },
  {
    name: 'getAlerts',
    type: '() => TokenAlert[]',
    description: 'Get all active cost alerts.',
  },
]

const aggregationMethods: PropDefinition[] = [
  {
    name: 'getHourlyAnalytics',
    type: '() => Record<string, TokenAnalytics>',
    description: 'Get analytics aggregated by hour with cost breakdowns.',
  },
  {
    name: 'getDailyAnalytics',
    type: '() => Record<string, TokenAnalytics>',
    description: 'Get analytics aggregated by day for trend analysis.',
  },
  {
    name: 'getModelAnalytics',
    type: '() => Record<string, TokenAnalytics>',
    description:
      'Get analytics grouped by model for cost comparison across providers.',
  },
]

const exportMethods: PropDefinition[] = [
  {
    name: 'exportToCSV',
    type: '() => string',
    description:
      'Export all cost data to CSV format for spreadsheet analysis.',
  },
  {
    name: 'exportToJSON',
    type: '() => string',
    description:
      'Export all cost data to JSON format for programmatic processing.',
  },
  {
    name: 'exportCostReport',
    type: '(options?: ReportOptions) => CostReport',
    description:
      'Generate comprehensive cost report with analysis and recommendations.',
  },
]

const utilityMethods: PropDefinition[] = [
  {
    name: 'addEventListener',
    type: '(listener: (event: TokenUsageEvent) => void) => void',
    description: 'Add listener for token usage events.',
  },
  {
    name: 'removeEventListener',
    type: '(listener: (event: TokenUsageEvent) => void) => void',
    description: 'Remove previously added event listener.',
  },
  {
    name: 'addAlertListener',
    type: '(listener: (alert: TokenAlert) => void) => void',
    description: 'Add listener for cost alerts.',
  },
  {
    name: 'clearAlerts',
    type: '() => void',
    description: 'Clear all active alerts.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'
import type { TokenUsageEvent, CostAnalysis } from '@clarity-chat/token-optimization'

// Or use convenience functions
import {
  recordTokenUsage,
  getTokenAnalytics,
  getTokenMetrics,
} from '@clarity-chat/token-optimization'`

const basicTrackingCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'

// Create tracker instance with configuration
const costTracker = new TokenAnalyticsMonitor({
  enabled: true,
  maxEvents: 10000,
  retentionDays: 30,
  enableCostTracking: true,
  modelPricing: {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
    'claude-3-5-haiku-20241022': { input: 0.0008, output: 0.004 },
  },
})

// Record token usage
costTracker.recordUsage({
  tokens: 1500,
  model: 'gpt-4o',
  type: 'input',
  context: 'chat-completion',
  sessionId: 'user-123',
})

// Get current analytics
const analytics = costTracker.getAnalytics()
console.log(\`Total cost: $\${analytics.totalTokens * 0.0025 / 1000}\`)`

const aggregationCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'

const costTracker = new TokenAnalyticsMonitor()

// Get daily aggregation
const dailyAnalytics = costTracker.getDailyAnalytics()
Object.entries(dailyAnalytics).forEach(([date, data]) => {
  console.log(\`\${date}: \${data.totalTokens} tokens, $\${calculateCost(data)}\`)
})

// Get weekly aggregation (custom)
const weeklyData = getWeeklyData(dailyAnalytics)

// Get monthly aggregation (custom)
const monthlyData = getMonthlyData(dailyAnalytics)

// Helper functions
function calculateCost(data: TokenAnalytics): number {
  // Calculate based on your pricing model
  return (data.totalTokens / 1000) * 0.0025
}

function getWeeklyData(daily: Record<string, TokenAnalytics>) {
  // Group daily data into weeks
  const weeks: Record<string, TokenAnalytics> = {}
  // Implementation...
  return weeks
}

function getMonthlyData(daily: Record<string, TokenAnalytics>) {
  // Group daily data into months
  const months: Record<string, TokenAnalytics> = {}
  // Implementation...
  return months
}`

const exportCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'

const costTracker = new TokenAnalyticsMonitor()

// Export to CSV
function exportToCSV() {
  const csvData = costTracker.exportToCSV()
  const blob = new Blob([csvData], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = \`cost-report-\${new Date().toISOString().split('T')[0]}.csv\`
  a.click()
}

// Export to JSON
function exportToJSON() {
  const jsonData = costTracker.exportToJSON()
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = \`cost-data-\${new Date().toISOString().split('T')[0]}.json\`
  a.click()
}

// Generate comprehensive report
function generateCostReport() {
  const report = costTracker.exportCostReport({
    includeCharts: true,
    includeRecommendations: true,
    timeRange: 'last-30-days',
  })

  return {
    summary: report.summary,
    breakdown: report.breakdown,
    trends: report.trends,
    recommendations: report.recommendations,
  }
}`

const dashboardCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'
import { useState, useEffect } from 'react'

function CostDashboard() {
  const [costTracker] = useState(() => new TokenAnalyticsMonitor())
  const [metrics, setMetrics] = useState(null)
  const [costAnalysis, setCostAnalysis] = useState(null)

  useEffect(() => {
    // Subscribe to real-time updates
    const handleUsageEvent = (event) => {
      setMetrics(costTracker.getMetrics())
      setCostAnalysis(costTracker.getCostAnalysis())
    }

    costTracker.addEventListener(handleUsageEvent)

    // Initial load
    setMetrics(costTracker.getMetrics())
    setCostAnalysis(costTracker.getCostAnalysis())

    return () => {
      costTracker.removeEventListener(handleUsageEvent)
    }
  }, [costTracker])

  if (!metrics || !costAnalysis) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Cost Overview */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Total Cost"
          value={\`$\${costAnalysis.totalCost.toFixed(2)}\`}
          trend={-12.5}
        />
        <MetricCard
          title="Daily Cost"
          value={\`$\${costAnalysis.dailyCost.toFixed(2)}\`}
          trend={-8.3}
        />
        <MetricCard
          title="Token Count"
          value={metrics.current.totalTokens.toLocaleString()}
          trend={5.2}
        />
        <MetricCard
          title="Requests"
          value={metrics.current.totalRequests.toLocaleString()}
          trend={-3.1}
        />
      </div>

      {/* Cost Reduction Badge */}
      <CostReductionBadge reduction={62.5} savings={214.56} />

      {/* Cost Charts */}
      <div className="grid grid-cols-2 gap-4">
        <CostTrendChart data={metrics.daily} />
        <ModelComparisonChart data={metrics.model} />
      </div>

      {/* Export Actions */}
      <div className="flex gap-2">
        <button onClick={() => downloadCSV(costTracker)}>
          Export CSV
        </button>
        <button onClick={() => downloadJSON(costTracker)}>
          Export JSON
        </button>
      </div>
    </div>
  )
}`

const realTimeBatchCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'

const costTracker = new TokenAnalyticsMonitor({
  enableRealTimeAlerts: true,
  alertThresholds: {
    hourly: 100000,  // Alert if >100K tokens/hour
    daily: 1000000,  // Alert if >1M tokens/day
    perRequest: 50000, // Alert if single request >50K tokens
  },
})

// Real-time tracking (immediate recording)
function handleChatCompletion(response) {
  costTracker.recordUsage({
    tokens: response.usage.total_tokens,
    model: response.model,
    type: 'total',
    context: 'chat',
  })

  // Metrics updated immediately
  const currentCost = costTracker.getCostAnalysis().totalCost
  console.log(\`Current cost: $\${currentCost}\`)
}

// Batch tracking (delayed recording for efficiency)
class BatchTracker {
  private queue: TokenUsageEvent[] = []
  private flushInterval = 5000 // 5 seconds

  constructor(private tracker: TokenAnalyticsMonitor) {
    this.startFlushing()
  }

  track(event: Omit<TokenUsageEvent, 'timestamp'>) {
    this.queue.push({ ...event, timestamp: Date.now() })
  }

  private startFlushing() {
    setInterval(() => {
      if (this.queue.length > 0) {
        this.tracker.recordUsages(this.queue)
        this.queue = []
      }
    }, this.flushInterval)
  }
}

// Usage
const batchTracker = new BatchTracker(costTracker)

// Record many events efficiently
for (let i = 0; i < 1000; i++) {
  batchTracker.track({
    tokens: 100,
    model: 'gpt-4o-mini',
    type: 'input',
  })
}`

const persistenceCode = `import { TokenAnalyticsMonitor } from '@clarity-chat/token-optimization'

// In-memory storage (default)
const memoryTracker = new TokenAnalyticsMonitor()

// LocalStorage persistence
class PersistentCostTracker extends TokenAnalyticsMonitor {
  private storageKey = 'cost-tracker-data'

  constructor(config) {
    super(config)
    this.loadFromStorage()
  }

  recordUsage(event) {
    super.recordUsage(event)
    this.saveToStorage()
  }

  private loadFromStorage() {
    const data = localStorage.getItem(this.storageKey)
    if (data) {
      const { events } = JSON.parse(data)
      this.recordUsages(events)
    }
  }

  private saveToStorage() {
    const data = {
      events: this.getEvents(),
      timestamp: Date.now(),
    }
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }
}

// Database persistence (example with API)
class DatabaseCostTracker extends TokenAnalyticsMonitor {
  constructor(config) {
    super(config)
    this.syncWithDatabase()
  }

  async recordUsage(event) {
    super.recordUsage(event)

    // Persist to database
    await fetch('/api/cost-tracking', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })
  }

  private async syncWithDatabase() {
    const response = await fetch('/api/cost-tracking')
    const events = await response.json()
    this.recordUsages(events)
  }
}

// Usage
const persistentTracker = new PersistentCostTracker({
  enabled: true,
  maxEvents: 50000,
  retentionDays: 90,
})`

const typescriptCode = `// Core interfaces
interface TokenUsageEvent {
  timestamp: number
  tokens: number
  model?: string
  type: 'input' | 'output' | 'total'
  context?: string
  sessionId?: string
}

interface TokenAnalytics {
  totalTokens: number
  totalRequests: number
  averageTokens: number
  medianTokens: number
  minTokens: number
  maxTokens: number
  standardDeviation: number
  tokenCounts: number[]
  timestamps: number[]
}

interface TokenMetrics {
  current: TokenAnalytics
  hourly: Record<string, TokenAnalytics>
  daily: Record<string, TokenAnalytics>
  model: Record<string, TokenAnalytics>
}

interface CostAnalysis {
  totalCost: number
  dailyCost: number
  hourlyCost: number
  modelCosts: Record<string, number>
  projections: {
    daily: number
    weekly: number
    monthly: number
  }
}

interface UsageStats {
  totalEvents: number
  averageTokensPerEvent: number
  peakUsageHour: string
  peakUsageDay: string
  mostUsedModel: string
  usageTrend: 'increasing' | 'decreasing' | 'stable'
}

interface TokenAlert {
  id: string
  type: 'threshold_exceeded' | 'rate_limit' | 'unusual_usage'
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  timestamp: number
  value: number
  threshold: number
  context?: any
}

interface TokenMonitoringConfig {
  enabled: boolean
  maxEvents: number
  retentionDays: number
  alertThresholds: {
    hourly: number
    daily: number
    perRequest: number
  }
  enableRealTimeAlerts: boolean
  enableCostTracking: boolean
  modelPricing?: Record<string, { input: number; output: number }>
}

// Main class
class TokenAnalyticsMonitor {
  constructor(config?: Partial<TokenMonitoringConfig>)

  // Recording methods
  recordUsage(event: Omit<TokenUsageEvent, 'timestamp'>): void
  recordUsages(events: Omit<TokenUsageEvent, 'timestamp'>[]): void

  // Retrieval methods
  getAnalytics(): TokenAnalytics
  getMetrics(): TokenMetrics
  getCostAnalysis(): CostAnalysis
  getUsageStats(): UsageStats
  getAlerts(): TokenAlert[]

  // Aggregation methods
  getHourlyAnalytics(): Record<string, TokenAnalytics>
  getDailyAnalytics(): Record<string, TokenAnalytics>
  getModelAnalytics(): Record<string, TokenAnalytics>

  // Utility methods
  addEventListener(listener: (event: TokenUsageEvent) => void): void
  removeEventListener(listener: (event: TokenUsageEvent) => void): void
  addAlertListener(listener: (alert: TokenAlert) => void): void
  clearAlerts(): void
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function CostTrackerPage() {
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
                <div className="p-2.5 rounded-lg bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <DollarSign className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800">
                      Core API
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Priority 1
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/token-optimization
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                CostTracker API
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Comprehensive cost tracking and analysis system for monitoring
                AI model usage, validating cost reductions, and optimizing
                spending. Track, analyze, and reduce costs by 50-70% with
                real-time monitoring and automated insights.
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
                  desc: 'Monitor costs live',
                },
                {
                  icon: BarChart3,
                  label: 'Aggregation',
                  desc: 'Daily/Weekly/Monthly',
                },
                {
                  icon: Download,
                  label: 'Export Data',
                  desc: 'CSV & JSON formats',
                },
                {
                  icon: TrendingDown,
                  label: '50-70% Reduction',
                  desc: 'Validated savings',
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
                  The <code>CostTracker</code> API (implemented as{' '}
                  <code>TokenAnalyticsMonitor</code>) provides a complete
                  solution for tracking, analyzing, and optimizing AI model
                  costs. It records token usage, calculates costs, aggregates
                  data, and provides actionable insights for cost reduction.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Why Track Costs?
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Visibility:</strong> Understand exactly where your
                    AI budget is going
                  </li>
                  <li>
                    <strong>Validation:</strong> Prove cost reductions from
                    optimization strategies
                  </li>
                  <li>
                    <strong>Forecasting:</strong> Project future costs based on
                    usage trends
                  </li>
                  <li>
                    <strong>Optimization:</strong> Identify high-cost areas for
                    targeted improvements
                  </li>
                  <li>
                    <strong>Compliance:</strong> Maintain audit trails for
                    billing and reporting
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Capabilities
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Real-time Tracking:</strong> Record costs as they
                    happen
                  </li>
                  <li>
                    <strong>Aggregation:</strong> Daily, weekly, and monthly
                    summaries
                  </li>
                  <li>
                    <strong>Multi-Model Support:</strong> Track costs across
                    20+ AI models
                  </li>
                  <li>
                    <strong>Export Functions:</strong> CSV and JSON export for
                    analysis
                  </li>
                  <li>
                    <strong>Alert System:</strong> Get notified of unusual
                    spending patterns
                  </li>
                  <li>
                    <strong>Cost Projections:</strong> Forecast daily, weekly,
                    and monthly costs
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
                  Import the CostTracker class and types:
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
                Explore the CostTracker with live cost tracking. Switch models
                and time periods to see real-time cost analysis and reduction
                metrics.
              </p>

              <LiveDemo />
            </Section>

            {/* Constructor Section */}
            <Section id="constructor" title="Constructor">
              <p className="text-muted-foreground mb-6">
                Create a new CostTracker instance with optional configuration:
              </p>

              <CodeBlock
                code={`const costTracker = new TokenAnalyticsMonitor({
  enabled: true,
  maxEvents: 10000,
  retentionDays: 30,
  enableCostTracking: true,
  modelPricing: {
    'gpt-4o': { input: 0.0025, output: 0.01 },
    'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  },
  enableRealTimeAlerts: true,
  alertThresholds: {
    hourly: 100000,
    daily: 1000000,
    perRequest: 50000,
  },
})`}
                language="tsx"
                filename="Initialize CostTracker"
              />

              <div className="mt-6">
                <PropsTable props={constructorProps} title="Configuration" />
              </div>
            </Section>

            {/* Methods Section */}
            <Section id="methods" title="Methods">
              <p className="text-muted-foreground mb-6">
                Complete API reference for all CostTracker methods:
              </p>

              <div className="space-y-8">
                <PropsTable
                  props={recordingMethods}
                  title="Cost Recording Methods"
                />
                <PropsTable
                  props={retrievalMethods}
                  title="Data Retrieval Methods"
                />
                <PropsTable
                  props={aggregationMethods}
                  title="Aggregation Functions"
                />
                <PropsTable props={exportMethods} title="Export Functions" />
                <PropsTable props={utilityMethods} title="Utility Methods" />
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Cost Tracking">
                <p className="text-muted-foreground mb-4">
                  Set up basic cost tracking for your AI application:
                </p>
                <CodeBlock
                  code={basicTrackingCode}
                  language="tsx"
                  filename="BasicTracking.tsx"
                />
              </SubSection>

              <SubSection id="example-aggregation" title="Cost Aggregation">
                <p className="text-muted-foreground mb-4">
                  Aggregate costs by day, week, and month:
                </p>
                <CodeBlock
                  code={aggregationCode}
                  language="tsx"
                  filename="CostAggregation.tsx"
                />
              </SubSection>

              <SubSection id="example-export" title="Data Export">
                <p className="text-muted-foreground mb-4">
                  Export cost data to CSV and JSON formats:
                </p>
                <CodeBlock
                  code={exportCode}
                  language="tsx"
                  filename="DataExport.tsx"
                />
              </SubSection>

              <SubSection
                id="example-dashboard"
                title="Dashboard Integration"
              >
                <p className="text-muted-foreground mb-4">
                  Integrate CostTracker into a React dashboard:
                </p>
                <CodeBlock
                  code={dashboardCode}
                  language="tsx"
                  filename="CostDashboard.tsx"
                />
              </SubSection>

              <SubSection
                id="example-real-time"
                title="Real-time vs Batch Tracking"
              >
                <p className="text-muted-foreground mb-4">
                  Choose between real-time and batch tracking strategies:
                </p>
                <CodeBlock
                  code={realTimeBatchCode}
                  language="tsx"
                  filename="TrackingStrategies.tsx"
                />
              </SubSection>

              <SubSection id="example-persistence" title="Data Persistence">
                <p className="text-muted-foreground mb-4">
                  Persist cost data to LocalStorage or a database:
                </p>
                <CodeBlock
                  code={persistenceCode}
                  language="tsx"
                  filename="DataPersistence.tsx"
                />
              </SubSection>
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <div className="p-6 rounded-xl bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border border-green-200/20 dark:border-green-800/20">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-green-500/20">
                      <TrendingDown className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        Monitor and Validate Your 50-70% Cost Reduction
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        CostTracker helps you achieve and validate significant
                        cost savings through comprehensive tracking and
                        analysis:
                      </p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-green-500" />
                            <h4 className="font-semibold text-foreground">
                              Baseline Measurement
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Track costs before optimization to establish a
                            baseline. Compare against optimized costs to
                            calculate exact reduction percentage.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <BarChart3 className="w-5 h-5 text-blue-500" />
                            <h4 className="font-semibold text-foreground">
                              Trend Analysis
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Monitor cost trends over time to verify sustained
                            savings. Identify regression and optimize
                            continuously.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-purple-500" />
                            <h4 className="font-semibold text-foreground">
                              Strategy Impact
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Measure the impact of specific optimization
                            strategies like caching, compression, and model
                            selection.
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-card border border-border/50">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            <h4 className="font-semibold text-foreground">
                              Reporting
                            </h4>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Generate detailed reports showing cost reduction
                            achievements for stakeholders and audits.
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-200/20">
                        <h4 className="font-semibold text-foreground mb-2">
                          Typical Cost Reduction Results
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>
                            • <strong>50-70% reduction</strong> with prompt
                            optimization and caching
                          </li>
                          <li>
                            • <strong>40-60% reduction</strong> with smart
                            model selection
                          </li>
                          <li>
                            • <strong>30-50% reduction</strong> with token
                            compression strategies
                          </li>
                          <li>
                            • <strong>20-40% reduction</strong> with context
                            management
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Optimization Integration Section */}
            <Section id="optimization" title="Optimization Integration">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  CostTracker integrates seamlessly with optimization
                  strategies to maximize savings:
                </p>

                <div className="grid gap-4 mt-6">
                  {[
                    {
                      title: 'Token Optimization',
                      icon: Zap,
                      desc: 'Track token usage before and after optimization. Validate compression ratios and measure cost impact.',
                      strategies: [
                        'Prompt compression',
                        'Smart truncation',
                        'Context optimization',
                      ],
                    },
                    {
                      title: 'Caching Strategies',
                      icon: Database,
                      desc: 'Monitor cache hit rates and calculate cost savings from reduced API calls.',
                      strategies: [
                        'Semantic caching',
                        'Response caching',
                        'Embedding caching',
                      ],
                    },
                    {
                      title: 'Model Selection',
                      icon: Target,
                      desc: 'Compare costs across models to choose the most cost-effective option for each task.',
                      strategies: [
                        'GPT-4o vs GPT-4o-mini',
                        'Claude Sonnet vs Haiku',
                        'Quality-cost tradeoffs',
                      ],
                    },
                    {
                      title: 'Batch Processing',
                      icon: Clock,
                      desc: 'Track batch vs real-time costs to optimize processing strategies.',
                      strategies: [
                        'Batch embeddings',
                        'Queue management',
                        'Off-peak processing',
                      ],
                    },
                  ].map(({ title, icon: Icon, desc, strategies }) => (
                    <div
                      key={title}
                      className="p-4 rounded-lg border border-border/50 bg-card"
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-brand-500 mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">
                            {title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {desc}
                          </p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {strategies.map((strategy) => (
                              <li key={strategy}>• {strategy}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">
                        Best Practices
                      </h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                          • Track baseline costs before implementing
                          optimizations
                        </li>
                        <li>
                          • Use aggregation to identify high-cost periods and
                          patterns
                        </li>
                        <li>
                          • Set up alerts for unusual spending spikes
                        </li>
                        <li>
                          • Export data regularly for long-term trend analysis
                        </li>
                        <li>
                          • Validate cost reductions with A/B testing
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Complete type definitions for CostTracker with detailed
                interfaces:
              </p>
              <CodeBlock
                code={typescriptCode}
                language="tsx"
                filename="types.ts"
                showLineNumbers
              />
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        Cost calculations don't match API billing
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Tracked costs differ from actual API bills.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Verify <code>modelPricing</code> matches current
                          provider rates
                        </li>
                        <li>
                          Check if provider adds fees (API calls, rate limits)
                        </li>
                        <li>
                          Ensure all token usage is being recorded (input +
                          output)
                        </li>
                        <li>
                          Consider cached tokens (some providers charge
                          differently)
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
                        Memory usage increasing over time
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        CostTracker consuming too much memory.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Reduce <code>maxEvents</code> to limit stored events
                        </li>
                        <li>
                          Decrease <code>retentionDays</code> to prune data
                          more frequently
                        </li>
                        <li>
                          Export and clear old data periodically
                        </li>
                        <li>
                          Use database persistence instead of in-memory storage
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
                        Alerts not triggering
                      </h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Cost threshold alerts are not firing.
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>
                          Ensure <code>enableRealTimeAlerts</code> is{' '}
                          <code>true</code>
                        </li>
                        <li>
                          Verify <code>alertThresholds</code> are set
                          appropriately
                        </li>
                        <li>
                          Check that alert listeners are properly registered
                        </li>
                        <li>
                          Clear old alerts with <code>clearAlerts()</code>
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
                    name: 'TokenAnalyzer',
                    type: 'component',
                    description:
                      'Analyze token usage with encoding breakdown and optimization tips',
                    href: '/reference/components/token-analyzer',
                  },
                  {
                    name: 'TokenOptimizationDashboard',
                    type: 'component',
                    description:
                      'Comprehensive dashboard integrating CostTracker data',
                    href: '/reference/components/token-optimization-dashboard',
                  },
                  {
                    name: 'useTokenAnalysis',
                    type: 'hook',
                    description:
                      'React hook for programmatic cost tracking',
                    href: '/reference/hooks/use-token-analysis',
                  },
                  {
                    name: 'TokenOptimizationBadge',
                    type: 'component',
                    description:
                      'Display cost reduction achievements with badge',
                    href: '/reference/components/token-optimization-badge',
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
                  href="/reference/components/token-optimization-dashboard"
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
                      TokenOptimizationDashboard
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/token-analyzer"
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
                      TokenAnalyzer
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
