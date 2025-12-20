'use client'

import React from 'react'
import { TokenOptimizationDashboard } from '@clarity-chat/react/internal'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'
import { Callout } from '@/components/MDX/Callout'

function DashboardDemo() {
  // Mock data for the dashboard
  const mockStats = {
    totalSavings: 154200,
    compressionRatio: 0.65,
    monthlyBudget: 1000000,
    usedTokens: 450000,
  }

  return (
    <div className="w-full border border-border rounded-xl overflow-hidden bg-background shadow-sm">
      <TokenOptimizationDashboard
        stats={mockStats}
        period="last-30-days"
        showCharts={true}
      />
    </div>
  )
}

const props: Prop[] = [
  {
    name: 'stats',
    type: 'TokenStats',
    description: 'Statistical data to display (savings, usage, etc.).',
  },
  {
    name: 'period',
    type: '"last-24h" | "last-7-days" | "last-30-days"',
    default: '"last-30-days"',
    description: 'Time period for the data.',
  },
  {
    name: 'showCharts',
    type: 'boolean',
    default: 'true',
    description: 'Whether to render visual charts.',
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
        <ViewInStorybook component="TokenOptimizationDashboard" />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <h2 id="preview">Dashboard Preview</h2>
        <p className="mb-4">A comprehensive view of your token metrics:</p>
        <ComponentPreview
          title="Token Dashboard"
          description="Monitoring token usage and savings."
          code={`import { TokenOptimizationDashboard } from '@clarity-chat/react/internal'

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

      <ScrollReveal delay={0.3}>
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

      <ScrollReveal delay={0.4}>
        <h2 id="props">Props</h2>
        <PropsTable props={props} />
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <h2 id="integration">Integration</h2>
        <p className="mb-4">
          Connect with <code>useTokenTracker</code> for live data:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useTokenTracker, TokenOptimizationDashboard } from '@clarity-chat/react/internal'

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

      <ScrollReveal delay={0.6}>
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
