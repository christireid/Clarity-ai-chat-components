import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useABTesting - Clarity Chat Components',
  description:
    'Hook for managing A/B tests with variant assignment, experiment tracking, and statistical analysis.',
}

const optionsProps: Prop[] = [
  {
    name: 'experiments',
    type: 'ExperimentConfig[]',
    description: 'Experiment configurations',
  },
  {
    name: 'userId',
    type: 'string',
    description: 'User ID for consistent variant assignment',
  },
  {
    name: 'onVariantAssigned',
    type: '(experimentId: string, variantId: string) => void',
    description: 'Callback when variant is assigned',
  },
]

export default function UseABTestingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useABTesting</h1>
        <p className="docs-lead">
          Hook for managing A/B tests with variant assignment, experiment
          tracking, conversion tracking, and statistical analysis.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Assign users to experiment variants',
          'Track experiment conversions',
          'Get experiment results',
          'Check statistical significance',
          'Get experiment recommendations',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Assign users to experiment variants:</p>
        <CodePlayground
          initialCode={`import { useABTesting } from '@clarity-chat/react/internal'

function ExperimentComponent() {
  const { getVariant, trackConversion, experiments } = useABTesting({
    userId: 'user-123',
  })

  const variant = getVariant('button-color-experiment')

  return (
    <div>
      <button
        className={variant === 'red' ? 'bg-red-500' : 'bg-blue-500'}
        onClick={() => {
          // Track conversion when user clicks
          trackConversion('button-color-experiment', 'click')
        }}
      >
        Click Me
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Experiment Results</h2>
        <p>Get experiment results and metrics:</p>
        <CodePlayground
          initialCode={`import { useABTesting } from '@clarity-chat/react/internal'

function ResultsView() {
  const { experiments, getExperiment } = useABTesting()

  const experiment = getExperiment('button-color-experiment')

  return (
    <div>
      <div>Status: {experiment.status}</div>
      <div>Variants: {experiment.variants.length}</div>
      {experiment.winner && (
        <div>Winner: {experiment.winner}</div>
      )}
      {experiment.significance?.isSignificant && (
        <div>Statistically significant!</div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Conversion Tracking</h2>
        <p>Track conversions for experiments:</p>
        <CodePlayground
          initialCode={`import { useABTesting } from '@clarity-chat/react/internal'

function ConversionTracking() {
  const { trackConversion, getVariant } = useABTesting()

  const handlePurchase = () => {
    // Track conversion
    trackConversion('checkout-flow-experiment', 'purchase', {
      revenue: 99.99,
    })
  }

  const variant = getVariant('checkout-flow-experiment')

  return (
    <div>
      {variant === 'simplified' ? (
        <SimplifiedCheckout onPurchase={handlePurchase} />
      ) : (
        <StandardCheckout onPurchase={handlePurchase} />
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Statistical Significance</h2>
        <p>Check statistical significance:</p>
        <CodePlayground
          initialCode={`import { useABTesting } from '@clarity-chat/react/internal'

function SignificanceCheck() {
  const { getExperiment } = useABTesting()

  const experiment = getExperiment('button-color-experiment')

  if (experiment.significance?.isSignificant) {
    return (
      <div>
        <div>Experiment is significant!</div>
        <div>P-value: {experiment.significance.pValue}</div>
        <div>Confidence: {experiment.significance.confidenceLevel}%</div>
        <div>Effect size: {experiment.significance.effectSize}</div>
      </div>
    )
  }

  return <div>Waiting for statistical significance...</div>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Experiment Recommendations</h2>
        <p>Get experiment recommendations:</p>
        <CodePlayground
          initialCode={`import { useABTesting } from '@clarity-chat/react/internal'

function Recommendations() {
  const { getExperiment } = useABTesting()

  const experiment = getExperiment('button-color-experiment')

  if (experiment.recommendation) {
    return (
      <div>
        <div>Recommendation: {experiment.recommendation}</div>
        {experiment.recommendation === 'implement-winner' && (
          <button onClick={() => implementVariant(experiment.winner)}>
            Implement Winner
          </button>
        )}
      </div>
    )
  }

  return null
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="docs-section">
        <h2>Return Values</h2>
        <ul>
          <li>
            <code>getVariant</code>: Function to get assigned variant for
            experiment
          </li>
          <li>
            <code>trackConversion</code>: Function to track conversions
          </li>
          <li>
            <code>experiments</code>: Array of all experiments
          </li>
          <li>
            <code>getExperiment</code>: Function to get experiment by ID
          </li>
          <li>
            <code>isInExperiment</code>: Function to check if user is in
            experiment
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use consistent <code>userId</code> for consistent variant assignment
          </li>
          <li>Track conversions for all significant actions</li>
          <li>Wait for statistical significance before concluding</li>
          <li>Follow experiment recommendations</li>
          <li>Monitor experiment metrics regularly</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/ab-testing-dashboard">
              ABTestingDashboard
            </a>{' '}
            - A/B testing dashboard
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
