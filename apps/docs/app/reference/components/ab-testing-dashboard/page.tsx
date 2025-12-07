'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ABTestingDashboard | Clarity Chat',
  description: 'A/B test results dashboard with statistical significance testing and winner recommendations.',
}

const abTestingDashboardProps: Prop[] = [
  {
    name: 'experiments',
    type: 'ExperimentResult[]',
    required: true,
    description: 'List of A/B test experiments with results.',
  },
  {
    name: 'config',
    type: 'Partial<ExperimentConfig>',
    description: 'Configuration for significance testing (minSampleSize, confidenceLevel, etc.).',
  },
  {
    name: 'onSelectExperiment',
    type: '(experiment: ExperimentResult) => void',
    description: 'Callback when an experiment is selected.',
  },
  {
    name: 'onDeclareWinner',
    type: '(experimentId: string, winnerId: string) => void',
    description: 'Callback when a winner is declared.',
  },
  {
    name: 'showStatistics',
    type: 'boolean',
    default: 'true',
    description: 'Show detailed statistical significance information.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Custom className.',
  },
]

export default function ABTestingDashboardPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ABTestingDashboard</h1>

      <p className="lead">
        Comprehensive A/B testing dashboard that displays experiment results with variant performance
        comparison, statistical significance testing, winner recommendations, and conversion funnel
        visualization. Perfect for optimizing chat experiences through data-driven decisions.
      </p>

      <Callout type="info" title="A/B Testing">
        <p>
          This dashboard helps you run and analyze A/B tests to optimize your chat interface.
          It automatically calculates statistical significance and recommends winners based on
          conversion rates and engagement metrics.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ABTestingDashboard } from '@clarity-chat/react'
import type { ExperimentResult } from '@clarity-chat/types'

function ABTestView({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <ABTestingDashboard
      experiments={experiments}
      showStatistics
      onSelectExperiment={(experiment) => {
        console.log('Selected:', experiment.experimentName)
      }}
      onDeclareWinner={(experimentId, winnerId) => {
        console.log('Winner declared:', winnerId)
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with ABTestingDashboard:
        </p>
        <CodePlayground
          initialCode={`import { ABTestingDashboard } from '@clarity-chat/react'

function Example() {
  const experiments = [
    {
      experimentId: 'exp1',
      experimentName: 'Chat Input Design',
      status: 'running',
      startDate: Date.now() - 86400000,
      variants: [
        { id: 'control', name: 'Control', isControl: true },
        { id: 'variant1', name: 'Variant A', isControl: false },
      ],
      metrics: new Map([
        ['control', {
          variantId: 'control',
          impressions: 1000,
          conversions: 50,
          conversionRate: 0.05,
          avgEngagementTime: 120,
          bounceRate: 0.3,
          users: 1000,
        }],
        ['variant1', {
          variantId: 'variant1',
          impressions: 1000,
          conversions: 60,
          conversionRate: 0.06,
          avgEngagementTime: 150,
          bounceRate: 0.25,
          users: 1000,
        }],
      ]),
    },
  ]

  return (
    <ABTestingDashboard
      experiments={experiments}
      showStatistics
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Configuration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ABTestingDashboard } from '@clarity-chat/react'

function CustomABTest() {
  const experiments = [/* your experiments */]

  return (
    <ABTestingDashboard
      experiments={experiments}
      config={{
        minSampleSize: 500, // Require 500 samples per variant
        confidenceLevel: 0.99, // 99% confidence level
        minEffect: 10, // Minimum 10% improvement
        allocation: 'equal', // Equal traffic split
      }}
      showStatistics
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Winner Declaration</h3>
        <EnhancedCodeBlock
          code={`import { ABTestingDashboard } from '@clarity-chat/react'

function ABTestWithWinner() {
  const handleDeclareWinner = async (experimentId: string, winnerId: string) => {
    // Update experiment status
    await fetch(\`/api/experiments/\${experimentId}/winner\`, {
      method: 'POST',
      body: JSON.stringify({ winnerId }),
    })
    
    // Notify team
    notifyTeam(\`Winner declared for experiment \${experimentId}: \${winnerId}\`)
  }

  return (
    <ABTestingDashboard
      experiments={experiments}
      onDeclareWinner={handleDeclareWinner}
      showStatistics
    />
  )
}`}
          language="tsx"
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Multiple Experiments</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ABTestingDashboard } from '@clarity-chat/react'
import { useState } from 'react'

function MultiExperimentView() {
  const [selectedExperiment, setSelectedExperiment] = useState(null)

  return (
    <ABTestingDashboard
      experiments={allExperiments}
      onSelectExperiment={(experiment) => {
        setSelectedExperiment(experiment)
        // Show detailed view
      }}
      showStatistics
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={abTestingDashboardProps} title="Component Props" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Statistical Significance</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          The dashboard automatically calculates statistical significance using z-tests for proportions:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>P-value</strong> - Probability that results occurred by chance</li>
          <li><strong>Confidence Level</strong> - Statistical confidence (default: 95%)</li>
          <li><strong>Effect Size</strong> - Relative improvement percentage</li>
          <li><strong>Sample Size</strong> - Total number of participants</li>
          <li><strong>Winner Recommendation</strong> - Automatically determined based on significance</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Metrics Tracked</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Impressions</strong> - Number of times variant was shown</li>
          <li><strong>Conversions</strong> - Number of successful conversions</li>
          <li><strong>Conversion Rate</strong> - Percentage of impressions that converted</li>
          <li><strong>Average Engagement Time</strong> - Average time users spent</li>
          <li><strong>Bounce Rate</strong> - Percentage of users who left immediately</li>
          <li><strong>Revenue</strong> - Total revenue (if applicable)</li>
          <li><strong>Users</strong> - Number of unique users</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Set minimum sample size</strong> - Ensure statistical validity before declaring winners</li>
          <li><strong>Use appropriate confidence levels</strong> - 95% for most cases, 99% for critical decisions</li>
          <li><strong>Monitor effect size</strong> - Ensure improvements are meaningful, not just statistically significant</li>
          <li><strong>Run tests long enough</strong> - Account for day-of-week and seasonal effects</li>
          <li><strong>Test one variable at a time</strong> - Isolate changes to understand impact</li>
          <li><strong>Document learnings</strong> - Track what works and what doesn't</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/performance-analytics-dashboard" className="docs-card">
            <h3>PerformanceAnalyticsDashboard</h3>
            <p>Performance monitoring</p>
          </a>
          <a href="/reference/components/conversation-analytics-dashboard" className="docs-card">
            <h3>ConversationAnalyticsDashboard</h3>
            <p>Conversation analytics</p>
          </a>
          <a href="/reference/hooks/use-ab-testing" className="docs-card">
            <h3>useABTesting Hook</h3>
            <p>A/B testing hook</p>
          </a>
          <a href="/guides/ab-testing" className="docs-card">
            <h3>A/B Testing Guide</h3>
            <p>A/B testing implementation guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'ConversationAnalyticsDashboard', href: '/reference/components/conversation-analytics-dashboard' }}
        next={{ title: 'UsageDashboard', href: '/reference/components/usage-dashboard' }}
      />
    </>
  )
}
