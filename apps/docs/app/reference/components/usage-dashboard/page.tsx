import React from 'react'
import { Metadata } from 'next'
import { ApiTable } from '@/components/Demo/ApiTable'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'


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
        <Callout type="info" title="Use Case">
          Perfect for admin panels, billing dashboards, and monitoring tools where you need
          to track token consumption and costs across users or tenants.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <UsageDashboard />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Custom Refresh Rate</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <UsageDashboard refreshIntervalMs={5000} />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>With Quota Limits</h2>
        <CodePlayground
          initialCode={`function Example() {
  const quotas = {
    tokensPerDay: 100000,
    requestsPerMinute: 50,
    costPerMonth: 1000
  }

  return (
    <div className="p-6">
      <UsageDashboard 
        quotas={quotas}
        showWarnings={true}
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
          title="UsageDashboard Props"
          data={usageDashboardProps}
        />
      </section>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>Real-time token counting per model and session</li>
          <li>Request rate tracking with per-minute/hour/day breakdowns</li>
          <li>Cost estimation based on model pricing</li>
          <li>Quota warnings when approaching limits</li>
          <li>Historical trends and charts</li>
          <li>Export data as CSV or JSON</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Integration Example</h2>
        <pre><code>{`import { UsageDashboard } from '@clarity-chat/react'
import { QuotaManager } from '@clarity-chat/react/utils'

export default function AdminPanel() {
  const quotaManager = new QuotaManager({
    tokensPerDay: 100000,
    requestsPerMinute: 50
  })

  return (
    <div className="admin-layout">
      <h1>Usage & Billing</h1>
      <UsageDashboard 
        quotaManager={quotaManager}
        showBilling={true}
        showExport={true}
      />
    </div>
  )
}`}</code></pre>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <Callout type="warning" title="Performance">
          Set <code>refreshIntervalMs</code> ≥ 1000ms to avoid excessive re-renders
          and API calls. For high-traffic systems, consider 5000ms or higher.
        </Callout>
        <ul>
          <li>Place in admin or developer views, not end-user chat UIs</li>
          <li>Use <code>refreshIntervalMs</code> ≥ 1000 to avoid unnecessary updates</li>
          <li>Pair with <code>QuotaManager</code> and <code>RateLimiter</code> utilities</li>
          <li>Enable <code>showWarnings</code> to alert users approaching quotas</li>
          <li>Export data regularly for historical analysis</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/performance-dashboard" className="docs-card">
            <h3>PerformanceDashboard</h3>
            <p>Monitor latency and throughput</p>
          </a>
          <a href="/reference/components/token-optimization-dashboard" className="docs-card">
            <h3>TokenOptimizationDashboard</h3>
            <p>Track optimization savings</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization Guide</h3>
            <p>Reduce costs and usage</p>
          </a>
        </div>
      </section>
    </div>
  )
}

const usageDashboardProps = [
  {
    name: 'className',
    type: 'string',
    required: false,
    description: 'Additional CSS classes'
  },
  {
    name: 'refreshIntervalMs',
    type: 'number',
    required: false,
    default: '3000',
    description: 'Update interval in milliseconds'
  },
  {
    name: 'quotas',
    type: 'QuotaConfig',
    required: false,
    description: 'Quota limits for warnings'
  },
  {
    name: 'showWarnings',
    type: 'boolean',
    required: false,
    default: 'true',
    description: 'Display warnings when approaching quotas'
  },
  {
    name: 'showBilling',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Show cost estimates and billing info'
  },
  {
    name: 'showExport',
    type: 'boolean',
    required: false,
    default: 'false',
    description: 'Enable data export functionality'
  },
  {
    name: 'onQuotaExceeded',
    type: '(quota: string) => void',
    required: false,
    description: 'Callback when a quota is exceeded'
  }
]
