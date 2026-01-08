import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'EvaluationDashboard - Clarity Chat Components',
  description:
    'AIOps evaluation dashboard for tracking prompt performance, quality metrics, and cost trends.',
}

const props: Prop[] = [
  {
    name: 'metrics',
    type: 'EvaluationMetricItem[]',
    required: true,
    description: 'Evaluation metrics to display',
  },
  {
    name: 'sparklines',
    type: 'EvaluationSparkline[]',
    description: 'Sparkline data for trends',
  },
  {
    name: 'quality',
    type: 'ResponseQualityMeterProps',
    description: 'Response quality meter configuration',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function EvaluationDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>EvaluationDashboard</h1>
        <p className="docs-lead">
          AIOps evaluation dashboard for tracking prompt performance, quality
          metrics, cost trends, and latency trends.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Display evaluation metrics',
          'Track quality trends',
          'Monitor cost and latency',
          'Compare prompt performance',
          'Identify regressions',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display evaluation dashboard:</p>
        <CodePlayground
          code={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function EvaluationView() {
  const metrics = [
    {
      id: 'accuracy',
      label: 'Accuracy',
      value: '94.2%',
      trend: 'up' as const,
      change: '+2.1%',
    },
    {
      id: 'latency',
      label: 'Avg Latency',
      value: '1.2s',
      trend: 'down' as const,
      change: '-0.3s',
    },
    {
      id: 'cost',
      label: 'Cost per 1K',
      value: '$0.12',
      trend: 'flat' as const,
    },
  ]

  return (
    <EvaluationDashboard
      metrics={metrics}
      sparklines={[
        {
          id: 'cost',
          label: 'Cost Efficiency',
          percentage: 85,
          objective: 90,
        },
        {
          id: 'latency',
          label: 'Latency Target',
          percentage: 92,
          objective: 95,
        },
      ]}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>With Quality Meter</h2>
        <p>Include response quality meter:</p>
        <CodePlayground
          code={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function WithQualityMeter() {
  return (
    <EvaluationDashboard
      metrics={metrics}
      quality={{
        score: 0.87,
        dimensions: {
          accuracy: 0.92,
          relevance: 0.85,
          completeness: 0.88,
        },
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Trend Tracking</h2>
        <p>Track trends with sparklines:</p>
        <CodePlayground
          code={`import { EvaluationDashboard } from '@clarity-chat/react/internal'

function TrendTracking() {
  return (
    <EvaluationDashboard
      metrics={metrics}
      sparklines={[
        {
          id: 'accuracy',
          label: 'Accuracy Trend',
          percentage: 94,
          objective: 95,
        },
        {
          id: 'cost',
          label: 'Cost Efficiency',
          percentage: 88,
          objective: 90,
        },
      ]}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Metric Trends</h2>
        <ul>
          <li>
            <strong>up</strong>: Metric is improving (green badge)
          </li>
          <li>
            <strong>down</strong>: Metric is regressing (red badge)
          </li>
          <li>
            <strong>flat</strong>: Metric is stable (blue badge)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Track key metrics (accuracy, latency, cost)</li>
          <li>Set objectives for sparklines</li>
          <li>Monitor trends to identify regressions</li>
          <li>Use quality meter for overall assessment</li>
          <li>Update metrics regularly</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/prompt-test-harness">
              PromptTestHarness
            </a>{' '}
            - Prompt testing component
          </li>
          <li>
            <a href="/reference/components/safety-review-console">
              SafetyReviewConsole
            </a>{' '}
            - Safety review component
          </li>
        </ul>
      </section>
    </div>
  )
}
