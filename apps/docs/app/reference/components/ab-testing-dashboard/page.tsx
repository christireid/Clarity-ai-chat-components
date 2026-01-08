import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'ABTestingDashboard - Clarity Chat Components',
  description:
    'A/B testing dashboard with experiment management, variant comparison, and statistical significance testing.',
}

const props: Prop[] = [
  {
    name: 'experiments',
    type: 'ExperimentResult[]',
    required: true,
    description: 'Experiment results to display',
  },
  {
    name: 'onExperimentClick',
    type: '(experiment: ExperimentResult) => void',
    description: 'Callback when experiment is clicked',
  },
  {
    name: 'onVariantSelect',
    type: '(experimentId: string, variantId: string) => void',
    description: 'Callback when variant is selected',
  },
  {
    name: 'showSignificance',
    type: 'boolean',
    description: 'Show statistical significance tests',
  },
  {
    name: 'showRecommendations',
    type: 'boolean',
    description: 'Show experiment recommendations',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function ABTestingDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ABTestingDashboard</h1>
        <p className="docs-lead">
          A/B testing dashboard with experiment management, variant comparison,
          statistical significance testing, and recommendations.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Display A/B test experiments',
          'Compare variant performance',
          'View statistical significance',
          'Get experiment recommendations',
          'Manage experiment lifecycle',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display A/B testing dashboard:</p>
        <CodePlayground
          initialCode={`import { ABTestingDashboard, useABTesting } from '@clarity-chat/react/internal'

function ABTestingView() {
  const { experiments, getExperiment } = useABTesting()

  return (
    <ABTestingDashboard
      experiments={experiments}
      showSignificance={true}
      showRecommendations={true}
      onExperimentClick={(experiment) => {
        logger.debug('Selected experiment:', experiment.id)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Variant Comparison</h2>
        <p>Compare variant performance:</p>
        <CodePlayground
          initialCode={`import { ABTestingDashboard } from '@clarity-chat/react/internal'

function VariantComparison({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <ABTestingDashboard
      experiments={experiments}
      onVariantSelect={(experimentId, variantId) => {
        logger.debug(\`Selected variant \${variantId} for experiment \${experimentId}\`)
        // Apply variant
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Statistical Significance</h2>
        <p>Display statistical significance tests:</p>
        <CodePlayground
          initialCode={`import { ABTestingDashboard } from '@clarity-chat/react/internal'

function SignificanceView({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <ABTestingDashboard
      experiments={experiments}
      showSignificance={true}
      onExperimentClick={(experiment) => {
        if (experiment.significance?.isSignificant) {
          logger.debug('Experiment is statistically significant!')
          logger.debug('P-value:', experiment.significance.pValue)
          logger.debug('Confidence:', experiment.significance.confidenceLevel)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Experiment Recommendations</h2>
        <p>Show experiment recommendations:</p>
        <CodePlayground
          initialCode={`import { ABTestingDashboard } from '@clarity-chat/react/internal'

function RecommendationsView({ experiments }: { experiments: ExperimentResult[] }) {
  return (
    <ABTestingDashboard
      experiments={experiments}
      showRecommendations={true}
      onExperimentClick={(experiment) => {
        if (experiment.recommendation) {
          logger.debug('Recommendation:', experiment.recommendation)
          // Apply recommendation
        }
      }}
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
        <h2>Experiment Status</h2>
        <ul>
          <li>
            <strong>draft</strong>: Experiment is being prepared
          </li>
          <li>
            <strong>running</strong>: Experiment is active
          </li>
          <li>
            <strong>paused</strong>: Experiment is temporarily paused
          </li>
          <li>
            <strong>completed</strong>: Experiment has finished
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Variant Metrics</h2>
        <p>Each variant tracks:</p>
        <ul>
          <li>
            <code>impressions</code>: Number of times variant was shown
          </li>
          <li>
            <code>conversions</code>: Number of conversions
          </li>
          <li>
            <code>conversionRate</code>: Conversion rate percentage
          </li>
          <li>
            <code>avgEngagementTime</code>: Average engagement time
          </li>
          <li>
            <code>bounceRate</code>: Bounce rate percentage
          </li>
          <li>
            <code>revenue</code>: Revenue generated (if applicable)
          </li>
          <li>
            <code>users</code>: Number of unique users
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>useABTesting</code> hook to manage experiments
          </li>
          <li>
            Enable <code>showSignificance</code> to validate results
          </li>
          <li>
            Follow <code>recommendations</code> for experiment actions
          </li>
          <li>Compare variants before making decisions</li>
          <li>Wait for statistical significance before concluding</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-ab-testing">useABTesting</a> - A/B
            testing hook
          </li>
          <li>
            <a href="/reference/components/user-interaction-analytics">
              UserInteractionAnalytics
            </a>{' '}
            - Interaction analytics
          </li>
        </ul>
      </section>
    </div>
  )
}
