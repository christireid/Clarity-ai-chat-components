import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'UsageDashboard - Clarity Chat Components',
  description: 'Monitor usage, quotas, and rate limits in real time.',
}

export default function UsageDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>UsageDashboard</h1>
        <p className="docs-lead">
          Visual dashboard for tracking token usage, requests, cost estimates, and limits.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          The <code>UsageDashboard</code> component provides real-time visibility into model usage
          across sessions. It is useful for audits, cost awareness, and operational dashboards.
        </p>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Simple Example"
          code={`import { UsageDashboard } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-6">
      <UsageDashboard />
    </div>
  )
}`} 
          height="220px"
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <pre><code>{`interface UsageDashboardProps {
  className?: string
  refreshIntervalMs?: number // default 3000
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Place in admin or developer views, not end-user chat UIs</li>
          <li>Use <code>refreshIntervalMs</code> ≥ 1000 to avoid unnecessary updates</li>
          <li>Pair with <code>QuotaManager</code> and <code>RateLimiter</code> utilities</li>
        </ul>
      </section>
    </div>
  )
}
