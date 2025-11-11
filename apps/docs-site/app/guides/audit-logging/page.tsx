import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Audit Logging - Clarity Chat',
  description: 'Track all actions in your chat application for compliance, security, and debugging purposes.',
}

export default function AuditLoggingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Audit Logging</h1>
        <p className="docs-lead">
          Track all actions in your chat application for compliance, security, and debugging purposes.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Audit logging helps you:
        </p>
        <ul>
          <li>Track user actions for compliance</li>
          <li>Debug issues with detailed logs</li>
          <li>Monitor security events</li>
          <li>Generate audit reports</li>
          <li>Meet regulatory requirements</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { AuditLogger, MemoryAuditStorage } from '@clarity-chat/react'

const audit = new AuditLogger({
  storage: new MemoryAuditStorage(),
  retentionDays: 90,
  redactFields: ['password', 'apiKey'],
})

// Log an action
await audit.log('chat.message.sent', {
  messageId: '123',
  content: 'Hello',
}, {
  userId: 'user-456',
  sessionId: 'session-789',
  result: 'success',
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Log Everything</strong>: Log all important actions</li>
          <li><strong>Include Context</strong>: Add user, session, and request context</li>
          <li><strong>Redact Sensitive Data</strong>: Never log passwords or tokens</li>
          <li><strong>Set Retention</strong>: Configure appropriate retention periods</li>
          <li><strong>Monitor Logs</strong>: Set up alerts for suspicious activity</li>
          <li><strong>Performance</strong>: Use async logging to avoid blocking</li>
          <li><strong>Compliance</strong>: Ensure logs meet regulatory requirements</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/audit">Audit API Reference</a> - Complete audit API</li>
          <li><a href="/guides/compliance">Compliance Guide</a> - Regulatory compliance</li>
        </ul>
      </section>
    </div>
  )
}
