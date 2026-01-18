import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'PerformanceDashboard - Clarity Chat Components',
  description:
    'Track latency, throughput, render times, and streaming performance.',
}

export default function PerformanceDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PerformanceDashboard</h1>
        <p className="docs-lead">
          Observability dashboard for live performance metrics across chat
          interactions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          <code>PerformanceDashboard</code> surfaces key metrics like request
          latency, token speed, frame render times, and dropped frame counts for
          diagnosing UX issues.
        </p>
        <Callout type="info" title="Developer Tool">
          This component is designed for development, staging, and internal
          monitoring. Remove it from production builds or gate it behind admin
          permissions.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <PerformanceDashboard />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Compact Mode</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <PerformanceDashboard 
        showCharts={false}
        compact={true}
      />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Thresholds</h2>
        <CodePlayground
          initialCode={`function Example() {
  const thresholds = {
    maxLatencyMs: 2000,
    minTokensPerSecond: 10,
    maxDroppedFrames: 5
  }

  return (
    <div className="p-6">
      <PerformanceDashboard 
        thresholds={thresholds}
        onThresholdExceeded={(metric) => {
          logger.warn('Performance issue:', metric)
        }}
      />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <ApiTable
          title="PerformanceDashboard Props"
          data={performanceDashboardProps}
        />
      </section>

      <section className="docs-section">
        <h2>Metrics Tracked</h2>
        <ul>
          <li>
            <strong>Request Latency:</strong> Time from request to first token
            (P50, P95, P99)
          </li>
          <li>
            <strong>Token Throughput:</strong> Tokens per second during
            streaming
          </li>
          <li>
            <strong>Render Performance:</strong> Frame times and dropped frames
          </li>
          <li>
            <strong>Memory Usage:</strong> Heap size and GC pressure
          </li>
          <li>
            <strong>Network:</strong> Request/response sizes and compression
            ratios
          </li>
          <li>
            <strong>Error Rates:</strong> Failed requests and retry counts
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Integration with Observability</h2>
        <pre>
          <code>{`import { PerformanceDashboard, Tracer } from '@clarity-chat/react'

export default function DevTools() {
  const tracer = new Tracer({
    endpoint: '/api/traces',
    sampleRate: 1.0
  })

  return (
    <div className="dev-panel">
      <PerformanceDashboard 
        tracer={tracer}
        exportFormat="opentelemetry"
        showTraces={true}
      />
    </div>
  )
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <Callout type="tip" title="Performance Debugging">
          Use the performance dashboard alongside browser DevTools to correlate
          metrics with actual user experience. Look for patterns in slow
          interactions.
        </Callout>
        <ul>
          <li>Enable in development and staging environments</li>
          <li>
            Use alongside <code>Tracer</code> for end-to-end request spans
          </li>
          <li>Profile slow renders and large DOM nodes causing reflows</li>
          <li>Set thresholds to catch regressions early</li>
          <li>Export metrics to external monitoring tools</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/usage-dashboard" className="docs-card">
            <h3>UsageDashboard</h3>
            <p>Monitor token usage and costs</p>
          </a>
          <a href="/guides/performance" className="docs-card">
            <h3>Performance Guide</h3>
            <p>Optimization best practices</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const performanceDashboardProps = [
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes',
  },
  {
    name: 'showCharts',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Display performance charts',
  },
  {
    name: 'refreshIntervalMs',
    type: 'number',
    required: false,
    default: '1000',
    description: 'Metrics refresh interval',
  },
  {
    name: 'compact',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show compact view with fewer metrics',
  },
  {
    name: 'thresholds',
    type: 'PerformanceThresholds',
    required: false,
    description: 'Alert thresholds for metrics',
  },
  {
    name: 'onThresholdExceeded',
    type: '(metric: string, value: number) => void',
    required: false,
    description: 'Callback when threshold exceeded',
  },
  {
    name: 'tracer',
    type: 'Tracer',
    required: false,
    description: 'Tracer instance for distributed tracing',
  },
  {
    name: 'showTraces',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show distributed trace timeline',
  },
]
