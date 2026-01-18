import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'useInteractionTracking - Clarity Chat Components',
  description:
    'Hook for tracking user interactions, feature discovery, and engagement metrics.',
}

const optionsProps: Prop[] = [
  {
    name: 'enabled',
    type: 'boolean',
    description: 'Enable interaction tracking (default: true)',
  },
  {
    name: 'sessionId',
    type: 'string',
    description: 'Session ID for grouping events',
  },
  {
    name: 'userId',
    type: 'string',
    description: 'User ID for user-specific tracking',
  },
  {
    name: 'onEvent',
    type: '(event: InteractionEvent) => void',
    description: 'Callback when event is tracked',
  },
]

export default function UseInteractionTrackingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Hook</span>
        <h1>useInteractionTracking</h1>
        <p className="docs-lead">
          Hook for tracking user interactions, feature discovery, engagement
          metrics, and user journeys.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Track user interactions',
          'Monitor feature discovery',
          'Collect engagement metrics',
          'Track user journeys',
          'Analyze interaction patterns',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Track user interactions:</p>
        <CodePlayground
          initialCode={`import { useInteractionTracking } from '@clarity-chat/react'

function TrackedComponent() {
  const { trackEvent, events, sessions, features } = useInteractionTracking({
    sessionId: 'session-123',
    userId: 'user-456',
  })

  const handleClick = () => {
    trackEvent({
      type: 'click',
      target: 'button-submit',
      element: 'button',
    })
  }

  return (
    <div>
      <button onClick={handleClick}>Submit</button>
      <div>Total events: {events.length}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Feature Discovery</h2>
        <p>Track feature discovery:</p>
        <CodePlayground
          initialCode={`import { useInteractionTracking } from '@clarity-chat/react'

function FeatureTracking() {
  const { trackFeatureDiscovery, features } = useInteractionTracking()

  React.useEffect(() => {
    // Track when feature is discovered
    trackFeatureDiscovery('advanced-search', 'Advanced Search Feature')
  }, [])

  return (
    <div>
      {features.map(feature => (
        <div key={feature.featureId}>
          {feature.featureName}: {feature.interactionCount} interactions
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>User Journey</h2>
        <p>Track user journey through the application:</p>
        <CodePlayground
          initialCode={`import { useInteractionTracking } from '@clarity-chat/react'

function JourneyTracking() {
  const { trackJourneyStep, sessions } = useInteractionTracking()

  const handleNavigation = (page: string) => {
    trackJourneyStep({
      action: 'navigate',
      target: page,
    })
  }

  return (
    <div>
      {sessions.map(session => (
        <div key={session.sessionId}>
          <div>Duration: {session.duration}ms</div>
          <div>Interactions: {session.interactions}</div>
          <div>Journey steps: {session.journey.length}</div>
        </div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Engagement Metrics</h2>
        <p>Get engagement metrics:</p>
        <CodePlayground
          initialCode={`import { useInteractionTracking } from '@clarity-chat/react'

function EngagementMetrics() {
  const { getEngagementMetrics } = useInteractionTracking()

  const metrics = getEngagementMetrics()

  return (
    <div>
      <div>Average session duration: {metrics.avgSessionDuration}ms</div>
      <div>Total interactions: {metrics.totalInteractions}</div>
      <div>Active users: {metrics.activeUsers}</div>
      <div>Bounce rate: {metrics.bounceRate}%</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Event Callbacks</h2>
        <p>Handle events with callbacks:</p>
        <CodePlayground
          initialCode={`import { useInteractionTracking } from '@clarity-chat/react'

function WithCallbacks() {
  const { trackEvent } = useInteractionTracking({
    onEvent: (event) => {
      logger.debug('Event tracked:', event)
      // Send to analytics service
      sendToAnalytics(event)
    },
  })

  return <button onClick={() => trackEvent({ type: 'click', target: 'button' })}>Click</button>
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
            <code>trackEvent</code>: Function to track interaction events
          </li>
          <li>
            <code>trackFeatureDiscovery</code>: Function to track feature
            discovery
          </li>
          <li>
            <code>trackJourneyStep</code>: Function to track journey steps
          </li>
          <li>
            <code>events</code>: Array of all tracked events
          </li>
          <li>
            <code>sessions</code>: Array of session analytics
          </li>
          <li>
            <code>features</code>: Array of feature interaction data
          </li>
          <li>
            <code>getEngagementMetrics</code>: Function to get engagement
            metrics
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Track all significant user interactions</li>
          <li>Use consistent event types and targets</li>
          <li>Include metadata for context</li>
          <li>Track feature discovery to identify unused features</li>
          <li>Monitor engagement metrics to improve UX</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/user-interaction-analytics">
              UserInteractionAnalytics
            </a>{' '}
            - Analytics dashboard
          </li>
          <li>
            <a href="/reference/components/ab-testing-dashboard">
              ABTestingDashboard
            </a>{' '}
            - A/B testing dashboard
          </li>
        </ul>
      </section>
    </div>
  )
}
