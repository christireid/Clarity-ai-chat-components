import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Webhooks - Clarity Chat',
  description: 'Clarity Chat provides a flexible webhook system for event-driven notifications.',
}

export default function WebhooksGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Webhooks</h1>
        <p className="docs-lead">
          Clarity Chat provides a flexible webhook system for event-driven notifications. Perfect for async operations, monitoring, integrations, and real-time updates.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Webhooks allow you to:
        </p>
        <ul>
          <li>Subscribe to events (chat messages, completions, errors, etc.)</li>
          <li>Receive real-time notifications</li>
          <li>Integrate with external systems</li>
          <li>Monitor application activity</li>
          <li>Build event-driven architectures</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { WebhookManager, WebhookEvents } from '@clarity-chat/react'

const webhooks = new WebhookManager({
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 5000,
  verifySignatures: true,
})

// Register webhook endpoint
webhooks.register({
  id: 'analytics-webhook',
  url: 'https://analytics.example.com/webhook',
  events: ['chat.message.sent', 'chat.completion'],
  secret: 'your-secret-key',
  enabled: true,
})

// Emit events
await webhooks.emit({
  id: 'evt-123',
  type: 'chat.completion',
  data: {
    messageId: 'msg-456',
    tokens: 150,
    model: 'gpt-4',
  },
  timestamp: Date.now(),
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Use Secrets</strong>: Always use secrets for webhook signature verification</li>
          <li><strong>Handle Failures</strong>: Implement retry logic and error handling</li>
          <li><strong>Idempotency</strong>: Make webhook endpoints idempotent</li>
          <li><strong>Timeouts</strong>: Set appropriate timeouts for webhook requests</li>
          <li><strong>Rate Limiting</strong>: Implement rate limiting on webhook endpoints</li>
          <li><strong>Logging</strong>: Log all webhook deliveries for debugging</li>
          <li><strong>Monitoring</strong>: Monitor webhook delivery success rates</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Learn about <a href="/guides/observability">Observability</a> for monitoring</li>
          <li>Check out <a href="/guides/audit-logging">Audit Logging</a> for event tracking</li>
          <li>See <a href="/guides/multi-tenancy">Multi-Tenancy</a> for tenant-specific webhooks</li>
        </ul>
      </section>
    </div>
  )
}
