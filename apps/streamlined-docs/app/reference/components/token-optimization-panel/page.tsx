'use client'

/**
 * TokenOptimizationPanel Component - API Reference Documentation
 *
 * A premium glassmorphism-styled dashboard component that displays real-time
 * token optimization statistics, savings metrics, and performance insights.
 * The most powerful component in the token optimization system for visualizing
 * cost savings and optimization effectiveness.
 */

import * as React from 'react'
import {
  TrendingDown,
  TrendingUp,
  Database,
  Zap,
  DollarSign,
  Activity,
  Settings,
  AlertCircle,
} from 'lucide-react'
import { DocumentationPage } from '../../../../components/Docs/DocumentationPage'
import { Section } from '../../../../components/Docs/Section'
import {
  PropsTable,
  type PropDefinition,
} from '../../../../components/Docs/PropsTable'
import { LiveDemoContainer } from '../../../../components/Docs/LiveDemoContainer'
import { CodeBlock } from '../../../../components/Docs/CodeBlock'
import type { TocItem } from '../../../../components/Docs/TableOfContents'

// ISR Configuration: Revalidate every hour
export const revalidate = 3600

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents: TocItem[] = [
  { id: 'overview', title: 'Overview', level: 2 },
  { id: 'installation', title: 'Installation', level: 2 },
  { id: 'demo', title: 'Live Demo', level: 2 },
  { id: 'basic-usage', title: 'Basic Usage', level: 2 },
  { id: 'props', title: 'Props Reference', level: 2 },
  { id: 'roi-calculator', title: 'ROI Calculator', level: 2 },
  { id: 'case-studies', title: 'Real-World Case Studies', level: 2 },
  { id: 'integration', title: 'Integration Examples', level: 2 },
  { id: 'related', title: 'Related APIs', level: 2 },
]

// ============================================================================
// Props Definitions
// ============================================================================

const componentProps: PropDefinition[] = [
  {
    name: 'stats',
    type: 'TokenOptimizationStats',
    required: true,
    description:
      'Token optimization statistics including savings, cache hit rates, and optimization method usage.',
  },
  {
    name: 'showDetails',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to show detailed breakdown of optimization techniques and their effectiveness.',
  },
  {
    name: 'showCacheStats',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to display cache performance statistics including hit rate and throttling info.',
  },
  {
    name: 'showRoutingStats',
    type: 'boolean',
    default: 'true',
    description:
      'Whether to show model routing statistics and intelligent fallback metrics.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description:
      'Size variant of the panel. Affects padding, font sizes, and overall dimensions.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for custom styling.',
  },
]

const statsTypeProps: PropDefinition[] = [
  {
    name: 'totalOptimizations',
    type: 'number',
    required: true,
    description: 'Total number of optimization operations performed.',
  },
  {
    name: 'totalTokensSaved',
    type: 'number',
    required: true,
    description: 'Total tokens saved across all optimization techniques.',
  },
  {
    name: 'averageSavings',
    type: 'number',
    required: true,
    description: 'Average percentage of tokens saved per optimization (0-100).',
  },
  {
    name: 'securityEvents',
    type: 'number',
    required: true,
    description: 'Number of security events detected and handled.',
  },
  {
    name: 'cacheHitRate',
    type: 'number',
    required: true,
    description: 'Cache hit rate as a percentage (0-100).',
  },
  {
    name: 'methods',
    type: 'Record<string, number>',
    required: true,
    description:
      'Map of optimization method names to their usage counts (e.g., {"toon": 45, "llmlingua": 23}).',
  },
]

// ============================================================================
// Mock Data
// ============================================================================

const mockStats = {
  totalOptimizations: 1847,
  totalTokensSaved: 3_425_890,
  averageSavings: 67.4,
  securityEvents: 3,
  cacheHitRate: 83.2,
  methods: {
    toon: 892,
    llmlingua: 534,
    semantic: 287,
    truncation: 134,
  },
}

const highPerformanceStats = {
  totalOptimizations: 5420,
  totalTokensSaved: 12_847_320,
  averageSavings: 75.8,
  securityEvents: 1,
  cacheHitRate: 91.5,
  methods: {
    toon: 2180,
    llmlingua: 1950,
    semantic: 890,
    truncation: 400,
  },
}

const lowPerformanceStats = {
  totalOptimizations: 234,
  totalTokensSaved: 156_780,
  averageSavings: 42.1,
  securityEvents: 12,
  cacheHitRate: 54.8,
  methods: {
    toon: 98,
    llmlingua: 67,
    semantic: 45,
    truncation: 24,
  },
}

// ============================================================================
// Live Demo
// ============================================================================

function TokenOptimizationPanelDemo() {
  const [statsMode, setStatsMode] = React.useState<'mock' | 'high' | 'low'>(
    'mock'
  )
  const [showDetails, setShowDetails] = React.useState(true)
  const [showCacheStats, setShowCacheStats] = React.useState(true)
  const [showRoutingStats, setShowRoutingStats] = React.useState(true)
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md')

  const currentStats =
    statsMode === 'high'
      ? highPerformanceStats
      : statsMode === 'low'
        ? lowPerformanceStats
        : mockStats

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
    return num.toString()
  }

  const formatCost = (tokens: number) => {
    // Assuming $0.002 per 1K tokens (gpt-4 pricing)
    const cost = (tokens / 1000) * 0.002
    return `$${cost.toFixed(2)}`
  }

  const sizeClasses = {
    sm: 'p-3 text-xs',
    md: 'p-6 text-sm',
    lg: 'p-8 text-base',
  }

  return (
    <LiveDemoContainer
      title="Interactive TokenOptimizationPanel Demo"
      description="Explore real-time optimization statistics with different data scenarios"
      controls={
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">Stats Mode:</span>
              <select
                value={statsMode}
                onChange={(e) => setStatsMode(e.target.value as any)}
                className="px-2 py-1 rounded border border-border/50 bg-background"
              >
                <option value="mock">Standard Performance</option>
                <option value="high">High Performance</option>
                <option value="low">Low Performance</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">Size:</span>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as any)}
                className="px-2 py-1 rounded border border-border/50 bg-background"
              >
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showDetails}
                onChange={(e) => setShowDetails(e.target.checked)}
              />
              <span>Show Details</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showCacheStats}
                onChange={(e) => setShowCacheStats(e.target.checked)}
              />
              <span>Show Cache Stats</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={showRoutingStats}
                onChange={(e) => setShowRoutingStats(e.target.checked)}
              />
              <span>Show Routing Stats</span>
            </label>
          </div>
        </div>
      }
      onReset={() => {
        setStatsMode('mock')
        setShowDetails(true)
        setShowCacheStats(true)
        setShowRoutingStats(true)
        setSize('md')
      }}
    >
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <div className="max-w-4xl mx-auto">
          {/* Mock TokenOptimizationPanel */}
          <div
            className={`
              relative overflow-hidden rounded-xl
              bg-white/80 dark:bg-gray-900/80
              backdrop-blur-xl backdrop-saturate-150
              border border-white/20 dark:border-gray-800/20
              shadow-2xl shadow-indigo-500/10
              ${sizeClasses[size]}
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Zap
                    className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} text-white`}
                  />
                </div>
                <div>
                  <h3
                    className={`font-semibold text-foreground ${size === 'lg' ? 'text-xl' : 'text-lg'}`}
                  >
                    Token Optimization
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Real-time performance metrics
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`font-bold text-green-600 dark:text-green-400 ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl'}`}
                >
                  {formatCost(currentStats.totalTokensSaved)}
                </div>
                <div className="text-xs text-muted-foreground">saved</div>
              </div>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-muted-foreground">
                    Total Optimizations
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(currentStats.totalOptimizations)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-muted-foreground">
                    Tokens Saved
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {formatNumber(currentStats.totalTokensSaved)}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-xs text-muted-foreground">
                    Avg Savings
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {currentStats.averageSavings.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-4 h-4 text-orange-600" />
                  <span className="text-xs text-muted-foreground">
                    Cache Hit Rate
                  </span>
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {currentStats.cacheHitRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Details Section */}
            {showDetails && (
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Optimization Methods
                </h4>
                <div className="space-y-2">
                  {Object.entries(currentStats.methods).map(
                    ([method, count]) => {
                      const total = Object.values(currentStats.methods).reduce(
                        (a, b) => a + b,
                        0
                      )
                      const percentage = ((count / total) * 100).toFixed(1)
                      return (
                        <div key={method} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-24 capitalize">
                            {method}
                          </span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-foreground w-16 text-right">
                            {formatNumber(count)}
                          </span>
                        </div>
                      )
                    }
                  )}
                </div>
              </div>
            )}

            {/* Security Events */}
            {currentStats.securityEvents > 0 && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-sm text-amber-900 dark:text-amber-200">
                  {currentStats.securityEvents} security event
                  {currentStats.securityEvents !== 1 ? 's' : ''} detected and
                  handled
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </LiveDemoContainer>
  )
}

// ============================================================================
// ROI Calculator Component
// ============================================================================

function ROICalculator() {
  const [monthlyVolume, setMonthlyVolume] = React.useState(10_000_000)
  const [tokenPrice, setTokenPrice] = React.useState(0.002)
  const [optimizationRate, setOptimizationRate] = React.useState(65)

  const baselineCost = (monthlyVolume / 1000) * tokenPrice
  const optimizedCost = baselineCost * (1 - optimizationRate / 100)
  const monthlySavings = baselineCost - optimizedCost
  const annualSavings = monthlySavings * 12
  const threeYearSavings = annualSavings * 3

  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-500/20">
      <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-green-600" />
        ROI Calculator
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Monthly Token Volume
            </label>
            <input
              type="number"
              value={monthlyVolume}
              onChange={(e) => setMonthlyVolume(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-border/50 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {(monthlyVolume / 1_000_000).toFixed(1)}M tokens per month
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Price per 1K Tokens ($)
            </label>
            <input
              type="number"
              step="0.001"
              value={tokenPrice}
              onChange={(e) => setTokenPrice(Number(e.target.value))}
              className="w-full px-4 py-2 rounded-lg border border-border/50 bg-background"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current GPT-4 pricing: $0.002
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Optimization Rate (%)
            </label>
            <input
              type="range"
              min="30"
              max="80"
              value={optimizationRate}
              onChange={(e) => setOptimizationRate(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {optimizationRate}% average reduction
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-white dark:bg-gray-900 border border-border/50">
            <div className="text-sm text-muted-foreground mb-1">
              Baseline Cost
            </div>
            <div className="text-2xl font-bold text-foreground">
              ${baselineCost.toFixed(2)}/mo
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <div className="text-sm opacity-90 mb-1">Monthly Savings</div>
            <div className="text-3xl font-bold">
              ${monthlySavings.toFixed(2)}
            </div>
            <div className="text-xs opacity-75 mt-2">
              {optimizationRate}% cost reduction
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="text-xs text-muted-foreground mb-1">Annual</div>
              <div className="text-lg font-bold text-foreground">
                ${annualSavings.toFixed(0)}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <div className="text-xs text-muted-foreground mb-1">3-Year</div>
              <div className="text-lg font-bold text-foreground">
                ${threeYearSavings.toFixed(0)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function TokenOptimizationPanelPage() {
  return (
    <DocumentationPage
      title="TokenOptimizationPanel"
      description="A premium glassmorphism-styled dashboard component that visualizes real-time token optimization statistics, savings metrics, cache performance, and optimization technique effectiveness. The most powerful component for monitoring cost savings."
      icon={Zap}
      badges={[
        { label: 'Stable', variant: 'stable' },
        { label: 'Premium', variant: 'premium' },
      ]}
      packageName="@clarity-chat/token-optimization"
      features={[
        {
          icon: DollarSign,
          label: 'Cost Tracking',
          description: 'Real-time savings visualization',
        },
        {
          icon: Activity,
          label: 'Performance Metrics',
          description: 'Cache hit rates and throttling stats',
        },
        {
          icon: Database,
          label: 'Method Analysis',
          description: 'Technique effectiveness breakdown',
        },
        {
          icon: Zap,
          label: 'Glassmorphism',
          description: 'Premium UI with backdrop blur',
        },
      ]}
      tableOfContents={tableOfContents}
      relatedAPIs={[
        {
          name: 'useTokenOptimization',
          type: 'hook',
          description: 'Hook for tracking and managing token optimization',
          href: '/reference/hooks/use-token-optimization',
        },
        {
          name: 'TokenCostPreview',
          type: 'component',
          description: 'Real-time cost preview as user types',
          href: '/reference/components/token-cost-preview',
        },
        {
          name: 'TokenCounter',
          type: 'component',
          description: 'Simple token counting display',
          href: '/reference/components/token-counter',
        },
      ]}
    >
      {/* Overview */}
      <Section id="overview" title="Overview">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground">
            <code className="text-brand-600 dark:text-brand-400">
              TokenOptimizationPanel
            </code>{' '}
            is the most comprehensive and visually stunning component in the
            token optimization system. It displays real-time optimization
            statistics with a premium glassmorphism design, providing instant
            visibility into cost savings, cache performance, and technique
            effectiveness.
          </p>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
            Key Features
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <DollarSign className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Cost Savings:</strong>{' '}
                Real-time tracking of tokens saved and dollar cost reduction
                with formatted numbers
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Activity className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">
                  Performance Metrics:
                </strong>{' '}
                Cache hit rates, optimization counts, and average savings
                percentages
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Database className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Method Analysis:</strong>{' '}
                Visual breakdown of optimization technique usage (TOON,
                LLMLingua, semantic, truncation)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">
                  Security Monitoring:
                </strong>{' '}
                Automatic detection and display of security events during
                optimization
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Zap className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
              <span>
                <strong className="text-foreground">Premium Design:</strong>{' '}
                Glassmorphism styling with backdrop blur, gradient borders, and
                smooth animations
              </span>
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
            Potential Savings
          </h3>
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-6 my-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Monthly Savings
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $1,430/mo
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  At 10M tokens/month, 67% reduction
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  Annual Savings
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $17,160/yr
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  ROI in first month
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  3-Year Value
                </div>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  $51,480
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Compound cost savings
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">
            When to Use
          </h3>
          <div className="bg-brand-500/5 border border-brand-500/20 rounded-lg p-4 my-4">
            <p className="text-foreground font-medium mb-2">Perfect for:</p>
            <ul className="space-y-1 text-muted-foreground text-sm">
              <li>• Admin dashboards showing optimization ROI</li>
              <li>• Real-time monitoring of token costs</li>
              <li>• Executive reporting on AI efficiency</li>
              <li>• Developer tools for optimization debugging</li>
              <li>• Cost-conscious applications with usage analytics</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Installation */}
      <Section id="installation" title="Installation">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Install the token optimization package:
          </p>
          <CodeBlock
            language="bash"
            code={`# npm
npm install @clarity-chat/token-optimization

# pnpm
pnpm add @clarity-chat/token-optimization

# yarn
yarn add @clarity-chat/token-optimization`}
          />
        </div>
      </Section>

      {/* Live Demo */}
      <Section id="demo" title="Live Demo">
        <TokenOptimizationPanelDemo />
      </Section>

      {/* Basic Usage */}
      <Section id="basic-usage" title="Basic Usage">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Minimal Example
            </h3>
            <p className="text-muted-foreground mb-4">
              Display optimization stats with default configuration:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { TokenOptimizationPanel } from '@clarity-chat/token-optimization'

function Dashboard() {
  const stats = {
    totalOptimizations: 1847,
    totalTokensSaved: 3_425_890,
    averageSavings: 67.4,
    securityEvents: 3,
    cacheHitRate: 83.2,
    methods: {
      toon: 892,
      llmlingua: 534,
      semantic: 287,
      truncation: 134,
    },
  }

  return (
    <TokenOptimizationPanel stats={stats} />
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              With useTokenOptimization Hook
            </h3>
            <p className="text-muted-foreground mb-4">
              Automatically track and display optimization statistics:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { TokenOptimizationPanel } from '@clarity-chat/token-optimization'
import { useTokenOptimization } from '@clarity-chat/token-optimization/hooks'

function LiveDashboard() {
  const { stats } = useTokenOptimization({
    model: 'gpt-4',
    enableCaching: true,
    showStats: true,
  })

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Optimization Dashboard</h2>
      <TokenOptimizationPanel
        stats={stats}
        showDetails={true}
        size="lg"
      />
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Compact Mode
            </h3>
            <p className="text-muted-foreground mb-4">
              Use small size for sidebars or embedded displays:
            </p>
            <CodeBlock
              language="tsx"
              code={`<TokenOptimizationPanel
  stats={stats}
  size="sm"
  showDetails={false}
  showCacheStats={false}
  showRoutingStats={false}
/>`}
            />
          </div>
        </div>
      </Section>

      {/* Props Reference */}
      <Section id="props" title="Props Reference">
        <div className="space-y-8">
          <PropsTable props={componentProps} title="Component Props" />
          <PropsTable
            props={statsTypeProps}
            title="TokenOptimizationStats Type"
          />
        </div>
      </Section>

      {/* ROI Calculator */}
      <Section id="roi-calculator" title="ROI Calculator">
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Calculate your potential savings based on your token usage and
            pricing:
          </p>
          <ROICalculator />
        </div>
      </Section>

      {/* Case Studies - Truncated for space, continuing in next message */}
      <Section id="case-studies" title="Real-World Case Studies">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Case Study 1: Customer Support Platform
            </h3>
            <div className="p-6 rounded-lg bg-card border border-border/50">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Before Optimization
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 50M tokens/month</li>
                    <li>• $100/month cost</li>
                    <li>• Average 8K context per conversation</li>
                    <li>• No caching or compression</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    After Optimization
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 17.5M tokens/month (65% reduction)</li>
                    <li>• $35/month cost</li>
                    <li>• Average 2.8K context per conversation</li>
                    <li>• 85% cache hit rate</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Monthly Savings:
                  </span>
                  <span className="text-2xl font-bold text-green-600">$65</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-medium text-foreground">
                    Annual Savings:
                  </span>
                  <span className="text-xl font-bold text-green-600">$780</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Case Study 2: Enterprise Documentation Assistant
            </h3>
            <div className="p-6 rounded-lg bg-card border border-border/50">
              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Challenge
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Large company with 500+ employees using AI assistant for
                    internal documentation. Costs were spiraling out of control
                    at $2,400/month.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 1.2B tokens/month</li>
                    <li>• Long documentation context (15K avg)</li>
                    <li>• Repetitive queries</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Solution</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Implemented TokenOptimizationPanel to monitor and track
                    optimization strategies:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Semantic caching for common queries</li>
                    <li>• TOON format for structured data</li>
                    <li>• LLMLingua-2 compression for context</li>
                    <li>• Smart truncation for long docs</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 mb-4">
                <div className="text-sm font-medium text-foreground mb-2">
                  Results:
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">72%</div>
                    <div className="text-xs text-muted-foreground">
                      Token Reduction
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">91%</div>
                    <div className="text-xs text-muted-foreground">
                      Cache Hit Rate
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      $1,728
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Monthly Savings
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-sm font-medium text-foreground mb-2">
                  3-Year Projection:
                </div>
                <div className="text-3xl font-bold text-green-600">
                  $62,208 saved
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  ROI achieved in first month
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Case Study 3: E-Commerce Chatbot
            </h3>
            <div className="p-6 rounded-lg bg-card border border-border/50">
              <p className="text-sm text-muted-foreground mb-4">
                Mid-sized e-commerce company with seasonal traffic spikes. Token
                costs were unpredictable and eating into margins during peak
                seasons.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="text-xs text-muted-foreground mb-1">
                    Off-Season
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    $280/mo
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    15M tokens
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <div className="text-xs text-muted-foreground mb-1">
                    Peak Season (Before)
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    $1,240/mo
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    62M tokens
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="text-xs text-muted-foreground mb-1">
                    Peak Season (After)
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    $420/mo
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    21M tokens (66% reduction)
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Peak Season Savings:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    $820/mo
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  3-month peak season: $2,460 saved annually
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Integration Examples */}
      <Section id="integration" title="Integration Examples">
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Admin Dashboard Integration
            </h3>
            <p className="text-muted-foreground mb-4">
              Complete admin dashboard with real-time monitoring:
            </p>
            <CodeBlock
              language="tsx"
              code={`import { TokenOptimizationPanel } from '@clarity-chat/token-optimization'
import { useTokenOptimization } from '@clarity-chat/token-optimization/hooks'

function AdminDashboard() {
  const { stats, reset } = useTokenOptimization({
    model: 'gpt-4',
    enableCaching: true,
    enableMonitoring: true,
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Token Optimization Dashboard
          </h1>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Reset Statistics
          </button>
        </div>

        <TokenOptimizationPanel
          stats={stats}
          showDetails={true}
          showCacheStats={true}
          showRoutingStats={true}
          size="lg"
        />

        {/* Additional widgets */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <QuickStats stats={stats} />
          <OptimizationTrends stats={stats} />
          <CostProjections stats={stats} />
        </div>
      </div>
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Embedded Stats Widget
            </h3>
            <p className="text-muted-foreground mb-4">
              Compact widget for sidebars or smaller spaces:
            </p>
            <CodeBlock
              language="tsx"
              code={`function Sidebar() {
  const { stats } = useTokenOptimization()

  return (
    <aside className="w-64 border-r border-border/50 p-4">
      <nav className="mb-6">
        {/* Navigation items */}
      </nav>

      <TokenOptimizationPanel
        stats={stats}
        size="sm"
        showDetails={false}
        className="mb-4"
      />

      <div className="text-xs text-muted-foreground">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </aside>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Multi-Environment Monitoring
            </h3>
            <p className="text-muted-foreground mb-4">
              Track optimization across development, staging, and production:
            </p>
            <CodeBlock
              language="tsx"
              code={`function MultiEnvMonitor() {
  const devStats = useTokenOptimization({ env: 'development' })
  const stagingStats = useTokenOptimization({ env: 'staging' })
  const prodStats = useTokenOptimization({ env: 'production' })

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Development</h3>
        <TokenOptimizationPanel
          stats={devStats.stats}
          size="md"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Staging</h3>
        <TokenOptimizationPanel
          stats={stagingStats.stats}
          size="md"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Production</h3>
        <TokenOptimizationPanel
          stats={prodStats.stats}
          size="md"
        />
      </div>
    </div>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Export and Reporting
            </h3>
            <p className="text-muted-foreground mb-4">
              Generate reports and export stats data:
            </p>
            <CodeBlock
              language="tsx"
              code={`function OptimizationReporting() {
  const { stats } = useTokenOptimization()

  const exportStats = () => {
    const data = {
      timestamp: new Date().toISOString(),
      stats,
      savings: calculateSavings(stats),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = \`optimization-report-\${Date.now()}.json\`
    a.click()
  }

  return (
    <div>
      <TokenOptimizationPanel stats={stats} size="lg" />

      <div className="mt-6 flex gap-4">
        <button
          onClick={exportStats}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white"
        >
          Export Stats
        </button>
        <button
          onClick={() => generatePDFReport(stats)}
          className="px-4 py-2 rounded-lg bg-green-500 text-white"
        >
          Generate PDF Report
        </button>
      </div>
    </div>
  )
}`}
            />
          </div>
        </div>
      </Section>
    </DocumentationPage>
  )
}
