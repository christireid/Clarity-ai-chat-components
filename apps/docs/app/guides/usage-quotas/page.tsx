import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Usage Quotas - Clarity Chat',
  description: 'Track and enforce usage limits to control costs, manage resources, and implement billing.',
}

export default function UsageQuotasGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Usage Quotas</h1>
        <p className="docs-lead">
          Track and enforce usage limits to control costs, manage resources, and implement billing.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Usage quotas help you:
        </p>
        <ul>
          <li>Control API costs</li>
          <li>Enforce rate limits</li>
          <li>Implement tiered pricing</li>
          <li>Monitor usage</li>
          <li>Prevent abuse</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { QuotaManager, MemoryQuotaStorage } from '@clarity-chat/react'

const quotas = new QuotaManager({
  limits: {
    tokens: 100000,  // 100k tokens per month
    requests: 1000,  // 1k requests per month
  },
  resetPeriod: 'monthly',
  storage: new MemoryQuotaStorage(),
})

// Check quota before operation
const check = await quotas.checkQuota('user-123', 'tokens', 500)

if (check.allowed) {
  // Perform operation
} else {
  // Quota exceeded
  console.log(\`Limit: \${check.limit}, Used: \${check.used}, Remaining: \${check.remaining}\`)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Check Before Operations</strong>: Always check quotas before expensive operations</li>
          <li><strong>Consume Actual Usage</strong>: Consume actual amounts, not estimates</li>
          <li><strong>Handle Gracefully</strong>: Provide clear error messages when quotas are exceeded</li>
          <li><strong>Monitor Usage</strong>: Track usage patterns and adjust limits</li>
          <li><strong>Set Warnings</strong>: Configure warnings before limits are reached</li>
          <li><strong>Use Atomic Operations</strong>: Use reservations for critical operations</li>
          <li><strong>Cache Quota Checks</strong>: Cache quota checks for performance</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/quotas">Quota API Reference</a> - Complete quota API</li>
          <li><a href="/guides/billing">Billing Integration</a> - Integrate with billing systems</li>
        </ul>
      </section>
    </div>
  )
}
