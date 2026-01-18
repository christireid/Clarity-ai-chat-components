// TODO: TokenOptimizationDashboard is planned but not yet implemented in @clarity-chat/react.
// This page documents the intended API and features.

'use client'

import React from 'react'
// TODO: Uncomment when implemented:
// import { TokenOptimizationDashboard } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { Callout } from '@/components/MDX/Callout'

// Placeholder demo component - shows Coming Soon notice
function DashboardDemo() {
  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-background shadow-sm p-8">
      <div className="text-center">
        <p className="font-medium text-muted-foreground mb-2">Coming Soon</p>
        <p className="text-sm text-muted-foreground">TokenOptimizationDashboard is planned but not yet implemented.</p>

        {/* Mock dashboard preview */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg">
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">154K</p>
            <p className="text-sm text-green-600 dark:text-green-300">Tokens Saved</p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">31%</p>
            <p className="text-sm text-blue-600 dark:text-blue-300">Compression</p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-lg">
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-400">$0.45</p>
            <p className="text-sm text-purple-600 dark:text-purple-300">Cost Saved</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const props: Prop[] = [
  {
    name: 'metrics',
    type: 'OptimizationMetrics',
    required: true,
    description: 'Current optimization metrics including tokens saved, cost saved, and breakdown by technique.',
  },
  {
    name: 'showBreakdown',
    type: 'boolean',
    default: 'true',
    description: 'Show detailed breakdown by optimization technique.',
  },
  {
    name: 'realTime',
    type: 'boolean',
    default: 'false',
    description: 'Enable real-time updates.',
  },
  {
    name: 'refreshInterval',
    type: 'number',
    default: '5000',
    description: 'Refresh interval for real-time updates (ms).',
  },
  {
    name: 'costPerToken',
    type: 'number',
    default: '0.000002',
    description: 'Cost per token for calculations.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function TokenOptimizationDashboardPage() {
  return (
    <div className="docs-content">
      <Breadcrumbs />

      <ScrollReveal>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-brand-500 to-brand-600 bg-clip-text text-transparent">
            TokenOptimizationDashboard
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            Visualize your AI token usage, cost savings, and compression
            efficiency. Gain insights into how your optimization strategies are
            performing.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Callout type="warning" className="mb-8">
          <p>
            <strong>Coming Soon:</strong> TokenOptimizationDashboard is planned but not yet
            implemented in @clarity-chat/react. This page documents the intended API.
          </p>
        </Callout>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <ViewInStorybook component="TokenOptimizationDashboard" />
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <h2 id="preview">Dashboard Preview</h2>
        <p className="mb-4">A comprehensive view of your token metrics:</p>
        <ComponentPreview
          title="Token Dashboard"
          description="Monitoring token usage and savings."
          code={`import { TokenOptimizationDashboard } from '@clarity-chat/react'

function AnalyticsView() {
  return (
    <TokenOptimizationDashboard
      period="last-30-days"
      stats={{
        totalSavings: 154200, // Tokens saved
        compressionRatio: 0.65, // 65% reduction
        monthlyBudget: 1000000,
        usedTokens: 450000
      }}
    />
  )
}`}
        >
          <DashboardDemo />
        </ComponentPreview>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <div className="grid md:grid-cols-3 gap-6 my-12">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-lg">
            <h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
              Cost Savings
            </h3>
            <p className="text-sm text-green-600 dark:text-green-300">
              Track exact dollar amounts saved through token reduction.
            </p>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
            <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              Compression Ratio
            </h3>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              Monitor the efficiency of your prompt compression algorithms.
            </p>
          </div>
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/30 rounded-lg">
            <h3 className="font-semibold text-purple-700 dark:text-purple-400 mb-2">
              Budget Alerts
            </h3>
            <p className="text-sm text-purple-600 dark:text-purple-300">
              Get visual warnings when approaching token limits.
            </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="import">Import</h2>
        <EnhancedCodeBlock
          code={`// Coming soon:
import { TokenOptimizationDashboard } from '@clarity-chat/react'`}
          language="tsx"
        />
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <h2 id="props">Props</h2>
        <PropsTable props={props} />
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <h2 id="integration">Integration</h2>
        <p className="mb-4">
          Connect with <code>useTokenTracker</code> for live data:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenTracker, TokenOptimizationDashboard } from '@clarity-chat/react'

function LiveDashboard() {
  const { stats } = useTokenTracker()

  return (
    <TokenOptimizationDashboard
      stats={stats}
      period="last-24h"
    />
  )
}`}
        />
      </ScrollReveal>

      <ScrollReveal delay={0.8}>
        <h2 id="related">Related</h2>
        <div className="flex gap-4">
          <a
            href="/reference/components/token-optimization-panel"
            className="block p-4 border rounded-lg hover:border-brand-500 transition-colors w-full"
          >
            <h3 className="font-semibold mb-1">TokenOptimizationPanel</h3>
            <p className="text-sm text-muted-foreground">
              Inline controls for optimization settings.
            </p>
          </a>
        </div>
      </ScrollReveal>
    </div>
  )
}
