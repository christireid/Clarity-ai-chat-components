'use client'

/**
 * SavingsDashboard Component - API Reference Documentation
 *
 * A comprehensive savings tracking dashboard with multiple metric cards,
 * trend charts, strategy breakdown, and export functionality.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  Copy,
  Check,
  ChevronRight,
  DollarSign,
  BarChart3,
  Download,
  Activity,
  Database,
  AlertCircle,
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
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
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
}

function PropsTable({ props, title }: { props: PropDefinition[]; title?: string }) {
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
            <th className="px-4 py-3 text-left font-semibold text-foreground">Name</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Type</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Default</th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">Description</th>
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
                <span className="text-brand-600 dark:text-brand-400">{prop.name}</span>
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
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
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
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
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
        <a href={`#${id}`} className="hover:text-brand-500 transition-colors group">
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
  const [selectedPeriod, setSelectedPeriod] = React.useState<'daily' | 'weekly' | 'monthly'>(
    'daily'
  )

  // Mock metrics
  const mockMetrics = {
    totalTokens: 150000,
    tokensSaved: 45000,
    costSaved: 1.35,
    requestCount: 500,
    costPerRequest: 0.0027,
    cacheHitRate: 87.5,
    savingsPercent: 30,
  }

  return (
    <div className="space-y-4">
      {/* Period Selector */}
      <div className="flex items-center gap-2 p-1 bg-muted rounded-lg border border-border/50 w-fit">
        {(['daily', 'weekly', 'monthly'] as const).map((period) => (
          <button
            key={period}
            onClick={() => setSelectedPeriod(period)}
            className={cn(
              'px-3 py-1.5 text-sm font-medium rounded-md transition-colors capitalize',
              selectedPeriod === period
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Demo Dashboard */}
      <div className="rounded-xl border border-border/50 overflow-hidden shadow-lg bg-card">
        <div className="px-6 py-4 border-b border-border/50 bg-muted/30">
          <h3 className="text-lg font-semibold text-foreground">Cost Savings Dashboard</h3>
          <p className="text-sm text-muted-foreground">
            Track optimization performance and ROI
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Cost Saved',
                value: `$${mockMetrics.costSaved.toFixed(2)}`,
                subtext: `${mockMetrics.savingsPercent}% reduction`,
                icon: DollarSign,
              },
              {
                label: 'Tokens Optimized',
                value: mockMetrics.tokensSaved.toLocaleString(),
                subtext: `Out of ${mockMetrics.totalTokens.toLocaleString()}`,
                icon: TrendingDown,
              },
              {
                label: 'Avg Cost/Request',
                value: `$${mockMetrics.costPerRequest.toFixed(4)}`,
                subtext: `${mockMetrics.requestCount} requests`,
                icon: Activity,
              },
              {
                label: 'Cache Hit Rate',
                value: `${mockMetrics.cacheHitRate}%`,
                subtext: 'Provider caching',
                icon: Database,
              },
            ].map((card) => (
              <div key={card.label} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-start justify-between mb-3">
                  <card.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                  <span className="text-xs font-medium text-success">+12%</span>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">{card.value}</div>
                  <div className="text-xs text-muted-foreground">{card.label}</div>
                  <div className="text-xs text-muted-foreground/80">{card.subtext}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Cache Performance */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">Cache Performance</span>
              </div>
              <span className="text-lg font-bold text-primary">
                {mockMetrics.cacheHitRate}%
              </span>
            </div>

            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${mockMetrics.cacheHitRate}%` }}
              />
            </div>

            <div className="mt-3 text-xs text-muted-foreground">
              Excellent cache performance - above 90% target
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import { SavingsDashboard } from '@clarity-chat/react/dashboards'
import type { SavingsMetrics, TimePeriodMetrics } from '@clarity-chat/react/dashboards'`

const basicUsageCode = `import { SavingsDashboard } from '@clarity-chat/react/dashboards'

function App() {
  const metrics = {
    daily: {
      totalTokens: 50000,
      tokensSaved: 15000,
      costSaved: 0.45,
      requestCount: 200,
      costPerRequest: 0.00225,
      cacheHitRate: 85.5,
      savingsPercent: 30,
      strategyBreakdown: {
        providerCaching: { savings: 0.27, percent: 60 },
        compression: { savings: 0.09, percent: 20 },
        smartRouting: { savings: 0.05, percent: 11 },
        responseLimiting: { savings: 0.02, percent: 4 },
        batching: { savings: 0.01, percent: 2 },
        throttling: { savings: 0.01, percent: 3 },
      },
    },
    weekly: { /* weekly metrics */ },
    monthly: { /* monthly metrics */ },
    allTime: { /* all-time metrics */ },
  }

  return (
    <SavingsDashboard
      metrics={metrics}
      showCharts
      showBreakdown
    />
  )
}`

const withExportCode = `import { SavingsDashboard } from '@clarity-chat/react/dashboards'

function Dashboard() {
  const handleExport = (format: 'csv' | 'json') => {
    // Custom export logic
    console.log(\`Exporting as \${format}\`)
  }

  return (
    <SavingsDashboard
      metrics={metrics}
      onExport={handleExport}
      showCharts
      showBreakdown
    />
  )
}`

const realTimeCode = `import { SavingsDashboard } from '@clarity-chat/react/dashboards'
import { useState, useEffect } from 'react'

function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<TimePeriodMetrics>(initialMetrics)

  // Fetch metrics from API
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await fetch('/api/savings-metrics').then(r => r.json())
      setMetrics(data)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <SavingsDashboard
      metrics={metrics}
      realTime
      refreshInterval={5000}
      showCharts
      showBreakdown
    />
  )
}`

const withTrendsCode = `import { SavingsDashboard } from '@clarity-chat/react/dashboards'

function TrendsDashboard() {
  const historicalData = [
    {
      timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000,
      tokensSaved: 10000,
      costSaved: 0.30,
      savingsPercent: 25,
      cacheHitRate: 80,
      requestCount: 150,
    },
    {
      timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
      tokensSaved: 12000,
      costSaved: 0.36,
      savingsPercent: 27,
      cacheHitRate: 82,
      requestCount: 180,
    },
    // ... more data points
  ]

  return (
    <SavingsDashboard
      metrics={metrics}
      historicalData={historicalData}
      showCharts
      showBreakdown
    />
  )
}`

const typescriptCode = `// Main component props
interface SavingsDashboardProps {
  /** Current metrics by time period */
  metrics: TimePeriodMetrics
  /** Historical trend data for charts */
  historicalData?: TrendDataPoint[]
  /** Show trend charts */
  showCharts?: boolean
  /** Show strategy breakdown */
  showBreakdown?: boolean
  /** Enable real-time updates */
  realTime?: boolean
  /** Refresh interval for real-time (ms) */
  refreshInterval?: number
  /** Export handler */
  onExport?: (format: ExportFormat) => void
  /** Time period change handler */
  onTimePeriodChange?: (period: TimePeriod) => void
  /** Initial time period */
  defaultPeriod?: TimePeriod
  /** Custom CSS class */
  className?: string
  /** Loading state */
  isLoading?: boolean
  /** Error state */
  error?: Error | string | null
}

// Savings metrics structure
interface SavingsMetrics {
  totalTokens: number
  tokensSaved: number
  costSaved: number
  requestCount: number
  costPerRequest: number
  cacheHitRate: number
  savingsPercent: number
  strategyBreakdown: {
    providerCaching: { savings: number; percent: number }
    compression: { savings: number; percent: number }
    smartRouting: { savings: number; percent: number }
    responseLimiting: { savings: number; percent: number }
    batching: { savings: number; percent: number }
    throttling: { savings: number; percent: number }
  }
}

// Time period metrics
interface TimePeriodMetrics {
  daily: SavingsMetrics
  weekly: SavingsMetrics
  monthly: SavingsMetrics
  allTime: SavingsMetrics
}

// Trend data point
interface TrendDataPoint {
  timestamp: number
  tokensSaved: number
  costSaved: number
  savingsPercent: number
  cacheHitRate: number
  requestCount: number
}

// Export format and time period types
type ExportFormat = 'csv' | 'json'
type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'allTime'`

// ============================================================================
// Props Data
// ============================================================================

const mainProps: PropDefinition[] = [
  {
    name: 'metrics',
    type: 'TimePeriodMetrics',
    required: true,
    description: 'Current metrics organized by time period (daily, weekly, monthly, all-time).',
  },
  {
    name: 'historicalData',
    type: 'TrendDataPoint[]',
    description: 'Historical trend data points for rendering charts.',
  },
  {
    name: 'showCharts',
    type: 'boolean',
    default: 'true',
    description: 'Display trend charts showing savings over time.',
  },
  {
    name: 'showBreakdown',
    type: 'boolean',
    default: 'true',
    description: 'Display detailed optimization strategy breakdown.',
  },
  {
    name: 'realTime',
    type: 'boolean',
    default: 'false',
    description: 'Enable real-time updates at specified interval.',
  },
  {
    name: 'refreshInterval',
    type: 'number',
    default: '5000',
    description: 'Refresh interval in milliseconds for real-time updates.',
  },
  {
    name: 'onExport',
    type: '(format: ExportFormat) => void',
    description: 'Callback when user exports data. Handles CSV and JSON formats.',
  },
  {
    name: 'onTimePeriodChange',
    type: '(period: TimePeriod) => void',
    description: 'Callback when time period selection changes.',
  },
  {
    name: 'defaultPeriod',
    type: 'TimePeriod',
    default: 'daily',
    description: 'Initial time period to display.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the dashboard container.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Whether the dashboard is in a loading state.',
  },
  {
    name: 'error',
    type: 'Error | string | null',
    description: 'Error to display. Renders error state when provided.',
  },
]

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
      { id: 'example-export', title: 'With Export' },
      { id: 'example-realtime', title: 'Real-time Updates' },
      { id: 'example-trends', title: 'With Trend Charts' },
    ],
  },
  { id: 'features', title: 'Features' },
  { id: 'typescript', title: 'TypeScript' },
  { id: 'accessibility', title: 'Accessibility' },
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
    <nav className="sticky top-24 space-y-1 text-sm" aria-label="Table of contents">
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
// Main Page Component
// ============================================================================

export default function SavingsDashboardPage() {
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
              transition={{ duration: durations.moderate, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-success/10 text-success border border-success/20">
                  <TrendingDown className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Stable
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">SavingsDashboard</h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                A comprehensive dashboard for tracking optimization metrics with multiple
                metric cards, trend charts, strategy breakdown, cache hit rate monitoring,
                and CSV/JSON export functionality. Robust with real-time updates
                and responsive mobile design.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durations.slow, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { icon: DollarSign, label: 'Cost Tracking', desc: 'Multi-period savings' },
                { icon: BarChart3, label: 'Trend Charts', desc: 'Visual analytics' },
                { icon: Database, label: 'Cache Monitoring', desc: 'Hit rate tracking' },
                { icon: Download, label: 'Export Data', desc: 'CSV & JSON' },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon className="w-5 h-5 text-brand-500 mb-2" aria-hidden="true" />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  <code>SavingsDashboard</code> provides comprehensive visibility into cost
                  savings across multiple time periods with detailed analytics, trend
                  visualization, and export capabilities. Perfect for production monitoring
                  and executive reporting.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Multi-period Metrics:</strong> Daily, weekly, monthly, and
                    all-time views
                  </li>
                  <li>
                    <strong>Trend Charts:</strong> Visualize savings over time with SVG
                    sparklines
                  </li>
                  <li>
                    <strong>Strategy Breakdown:</strong> See which optimizations save the
                    most
                  </li>
                  <li>
                    <strong>Cache Monitoring:</strong> Track cache hit rates and performance
                  </li>
                  <li>
                    <strong>Cost Per Request:</strong> Monitor average cost efficiency
                  </li>
                  <li>
                    <strong>Export Functionality:</strong> Download data as CSV or JSON
                  </li>
                  <li>
                    <strong>Real-time Updates:</strong> Live data refresh at custom intervals
                  </li>
                  <li>
                    <strong>Responsive Design:</strong> Works on mobile, tablet, and desktop
                  </li>
                </ul>
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

                <p className="text-muted-foreground">Import the component and types:</p>

                <CodeBlock code={importCode} language="tsx" filename="App.tsx" showDownloadButton={false} />
              </div>
            </Section>

            {/* Live Demo Section */}
            <Section id="demo" title="Live Demo">
              <p className="text-muted-foreground mb-6">
                Interact with the SavingsDashboard. Switch between time periods to see
                different metrics.
              </p>

              <LiveDemo />
            </Section>

            {/* Props Reference Section */}
            <Section id="props" title="Props Reference">
              <p className="text-muted-foreground mb-6">
                Complete API reference for SavingsDashboard props.
              </p>

              <PropsTable props={mainProps} title="Component Props" />
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Usage">
                <p className="text-muted-foreground mb-4">
                  Minimal setup with time-period metrics:
                </p>
                <CodeBlock code={basicUsageCode} language="tsx" filename="BasicDashboard.tsx" />
              </SubSection>

              <SubSection id="example-export" title="With Export Functionality">
                <p className="text-muted-foreground mb-4">
                  Add custom export handler:
                </p>
                <CodeBlock code={withExportCode} language="tsx" filename="ExportDashboard.tsx" />
              </SubSection>

              <SubSection id="example-realtime" title="Real-time Updates">
                <p className="text-muted-foreground mb-4">Enable live data refresh:</p>
                <CodeBlock code={realTimeCode} language="tsx" filename="RealTimeDashboard.tsx" />
              </SubSection>

              <SubSection id="example-trends" title="With Trend Charts">
                <p className="text-muted-foreground mb-4">
                  Display historical trends with sparklines:
                </p>
                <CodeBlock code={withTrendsCode} language="tsx" filename="TrendsDashboard.tsx" />
              </SubSection>
            </Section>

            {/* Features Section */}
            <Section id="features" title="Features">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" aria-hidden="true" />
                    Multi-Period Cost Tracking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Track savings across daily, weekly, monthly, and all-time periods. Switch
                    between views to analyze trends and performance over different timeframes.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" aria-hidden="true" />
                    Trend Visualization
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    SVG sparkline charts show savings trends over time. Visualize cost and
                    token savings with interactive data points and smooth animations.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5" aria-hidden="true" />
                    Cache Hit Rate Monitoring
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Track provider cache performance with visual progress bars and target
                    indicators. Get alerts when cache hit rate falls below 90%.
                  </p>
                </div>

                <div className="p-4 rounded-lg border border-border/50 bg-card">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Download className="w-5 h-5" aria-hidden="true" />
                    Export Functionality
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Export complete metrics and historical data as CSV or JSON. Perfect for
                    reporting, analysis in Excel, or integration with business intelligence
                    tools.
                  </p>
                </div>
              </div>
            </Section>

            {/* TypeScript Section */}
            <Section id="typescript" title="TypeScript">
              <p className="text-muted-foreground mb-4">
                Full type definitions for the dashboard and metrics:
              </p>
              <CodeBlock code={typescriptCode} language="tsx" filename="types.ts" showLineNumbers />
            </Section>

            {/* Accessibility Section */}
            <Section id="accessibility" title="Accessibility">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  SavingsDashboard is built with comprehensive accessibility support:
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">ARIA Support</h4>
                <ul className="space-y-2">
                  <li>
                    All metrics have <code>aria-label</code> for screen readers
                  </li>
                  <li>
                    Progress bars include <code>aria-valuenow</code>,{' '}
                    <code>aria-valuemin</code>, and <code>aria-valuemax</code>
                  </li>
                  <li>
                    Loading states use <code>role="status"</code> and{' '}
                    <code>aria-busy</code>
                  </li>
                  <li>
                    Error states use <code>role="alert"</code> and{' '}
                    <code>aria-live="assertive"</code>
                  </li>
                  <li>
                    Real-time indicator uses <code>aria-live="polite"</code>
                  </li>
                </ul>

                <h4 className="text-lg font-semibold mt-6 mb-3">Keyboard Navigation</h4>
                <p>
                  All interactive elements (period selector, export menu) are fully keyboard
                  accessible with proper focus management and <code>aria-pressed</code>{' '}
                  states.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">Color Contrast</h4>
                <p>
                  Meets WCAG 2.1 AA standards with 4.5:1 minimum contrast for text. Charts
                  use colorblind-friendly palettes.
                </p>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'TokenOptimizationDashboard',
                    type: 'component',
                    description: 'Basic token optimization metrics dashboard',
                    href: '/reference/components/token-optimization-dashboard',
                  },
                  {
                    name: 'TokenROICalculator',
                    type: 'component',
                    description: 'Calculate ROI from token optimizations',
                    href: '/reference/components/token-roi-calculator',
                  },
                  {
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description: 'Real-time token budget monitoring',
                    href: '/reference/hooks/use-token-budget-monitor',
                  },
                  {
                    name: 'AnalyticsDashboard',
                    type: 'component',
                    description: 'General analytics dashboard',
                    href: '/reference/components/analytics-dashboard',
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
                    <p className="text-sm text-muted-foreground">{api.description}</p>
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
                    <div className="text-xs text-muted-foreground mb-1">Previous</div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      TokenOptimizationDashboard
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components/analytics-dashboard"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">Next</div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      AnalyticsDashboard
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
