import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Type Definitions - Clarity Chat',
  description: 'All packages expose strict TypeScript definitions for safer integrations.',
}

export default function TypesAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Type Definitions</h1>
        <p className="docs-lead">
          All packages expose strict TypeScript definitions for safer integrations.
        </p>
      </div>

      <section className="docs-section">
        <h2>Core Types</h2>
        <ul>
          <li><code>Message</code> – canonical chat message shape used across hooks and components.</li>
          <li><code>ChatParticipant</code> – describes system, user, assistant, or tool identities.</li>
          <li><code>Attachment</code> – metadata for uploaded files, including name, size, type, and URL.</li>
          <li><code>ToolInvocation</code> – captures tool call requests and responses.</li>
        </ul>

        <CodeBlock
          language="ts"
          code={`import type { Message, Attachment } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  chatId: 'demo',
  role: 'assistant',
  content: 'Your order ships tomorrow!',
  createdAt: new Date(),
  status: 'sent',
  attachments: [
    {
      id: 'invoice',
      name: 'invoice.pdf',
      url: 'https://cdn.example.com/invoice.pdf',
      type: 'application/pdf',
      size: 1024,
    } satisfies Attachment,
  ],
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Utility Types</h2>
        <ul>
          <li><code>ModelConfig</code> – unify provider-specific options (temperature, top_p, maxTokens).</li>
          <li><code>StreamingAdapter</code> – interface for SSE/WebSocket streaming implementations.</li>
          <li><code>CostBreakdown</code> – track prompt/output tokens and currency-converted totals.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Type Augmentation</h2>
        <p>
          Extend types to include domain-specific metadata:
        </p>
        <CodeBlock
          language="ts"
          code={`declare module '@clarity-chat/types' {
  interface MessageMetadata {
    ticketId?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Continue to the <a href="/reference/api/utilities">Utilities</a> reference for helper functions and adapters</li>
        </ul>
      </section>
    </div>
  )
}
