import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'UserInteractionAnalytics - Clarity Chat Components',
  description:
    'Track and analyze user interactions, feature discovery, engagement metrics, and user journeys.',
}

const props: Prop[] = [
  {
    name: 'events',
    type: 'InteractionEvent[]',
    required: true,
    description: 'Interaction events to analyze',
  },
  {
    name: 'sessions',
    type: 'SessionAnalytics[]',
    description: 'Session analytics data',
  },
  {
    name: 'features',
    type: 'FeatureInteraction[]',
    description: 'Feature interaction data',
  },
  {
    name: 'showHeatmap',
    type: 'boolean',
    description: 'Show click heatmap',
  },
  {
    name: 'showJourney',
    type: 'boolean',
    description: 'Show user journey visualization',
  },
  {
    name: 'showEngagement',
    type: 'boolean',
    description: 'Show engagement metrics',
  },
  {
    name: 'onEventClick',
    type: '(event: InteractionEvent) => void',
    description: 'Callback when event is clicked',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function UserInteractionAnalyticsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>UserInteractionAnalytics</h1>
        <p className="docs-lead">
          Track and analyze user interactions, feature discovery, engagement
          metrics, click heatmaps, and user journeys.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Track user interactions',
          'Analyze feature discovery',
          'Visualize click heatmaps',
          'Track user journeys',
          'Measure engagement metrics',
        ]}
      />

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Display interaction analytics:</p>
        <CodePlayground
          initialCode={`import { UserInteractionAnalytics, useInteractionTracking } from '@clarity-chat/react/internal'

function AnalyticsDashboard() {
  const { events, sessions, features } = useInteractionTracking()

  return (
    <UserInteractionAnalytics
      events={events}
      sessions={sessions}
      features={features}
      showHeatmap={true}
      showJourney={true}
      showEngagement={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Click Heatmap</h2>
        <p>Visualize click patterns:</p>
        <CodePlayground
          initialCode={`import { UserInteractionAnalytics } from '@clarity-chat/react/internal'

function HeatmapView({ events }: { events: InteractionEvent[] }) {
  return (
    <UserInteractionAnalytics
      events={events}
      showHeatmap={true}
      onEventClick={(event) => {
        logger.debug('Clicked event:', event)
        // Show event details
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>User Journey</h2>
        <p>Track user journey through the application:</p>
        <CodePlayground
          initialCode={`import { UserInteractionAnalytics } from '@clarity-chat/react/internal'

function JourneyView({ sessions }: { sessions: SessionAnalytics[] }) {
  return (
    <UserInteractionAnalytics
      sessions={sessions}
      showJourney={true}
      onEventClick={(event) => {
        // Navigate to event location
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Engagement Metrics</h2>
        <p>Display engagement metrics:</p>
        <CodePlayground
          initialCode={`import { UserInteractionAnalytics } from '@clarity-chat/react/internal'

function EngagementView({ events, sessions }: { events: InteractionEvent[], sessions: SessionAnalytics[] }) {
  return (
    <UserInteractionAnalytics
      events={events}
      sessions={sessions}
      showEngagement={true}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Feature Discovery</h2>
        <p>Track feature discovery and usage:</p>
        <CodePlayground
          initialCode={`import { UserInteractionAnalytics } from '@clarity-chat/react/internal'

function FeatureDiscovery({ features }: { features: FeatureInteraction[] }) {
  return (
    <UserInteractionAnalytics
      features={features}
      showEngagement={true}
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
        <h2>Interaction Event Types</h2>
        <ul>
          <li>
            <code>click</code>: Click interactions
          </li>
          <li>
            <code>hover</code>: Hover interactions
          </li>
          <li>
            <code>scroll</code>: Scroll events
          </li>
          <li>
            <code>input</code>: Input field interactions
          </li>
          <li>
            <code>submit</code>: Form submissions
          </li>
          <li>
            <code>copy</code>: Copy actions
          </li>
          <li>
            <code>select</code>: Selection events
          </li>
          <li>
            <code>feature_discovery</code>: Feature discovery events
          </li>
          <li>
            <code>navigation</code>: Navigation events
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>useInteractionTracking</code> hook to collect events
          </li>
          <li>Enable heatmap for visual click pattern analysis</li>
          <li>Track user journeys to understand user flow</li>
          <li>Monitor feature discovery to identify unused features</li>
          <li>Analyze engagement metrics to improve UX</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/hooks/use-interaction-tracking">
              useInteractionTracking
            </a>{' '}
            - Interaction tracking hook
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
