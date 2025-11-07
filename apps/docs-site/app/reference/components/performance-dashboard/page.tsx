import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'PerformanceDashboard - Clarity Chat Components',
  description: 'Track latency, throughput, render times, and streaming performance.',
}

export default function PerformanceDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PerformanceDashboard</h1>
        <p className="docs-lead">
          Observability dashboard for live performance metrics across chat interactions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          <code>PerformanceDashboard</code> surfaces key metrics like request latency, token speed,
          frame render times, and dropped frame counts for diagnosing UX issues.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Simple Example"
          code={`import { PerformanceDashboard } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-6">
      <PerformanceDashboard />
    </div>
  )
}`} 
          height="220px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <pre><code>{`interface PerformanceDashboardProps {
  className?: string
  showCharts?: boolean // default true
  refreshIntervalMs?: number // default 1000
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <ul>
          <li>Enable in development and staging environments</li>
          <li>Use alongside <code>Tracer</code> for end-to-end request spans</li>
          <li>Profile slow renders and large DOM nodes causing reflows</li>
        </ul>
      </section>
    </div>
  )
}
