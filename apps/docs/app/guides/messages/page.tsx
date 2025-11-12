import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Message Handling - Clarity Chat',
  description: 'Messages in Clarity Chat follow a consistent schema across adapters, enabling deterministic rendering and downstream analytics.',
}

export default function MessagesGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Message Handling</h1>
        <p className="docs-lead">
          Messages in Clarity Chat follow a consistent schema across adapters, enabling deterministic rendering and downstream analytics.
        </p>
      </div>

      <section className="docs-section">
        <h2>Message Shape</h2>
        <CodeBlock
          language="ts"
          code={`interface ChatMessage {
  id: string
  chatId: string
  role: 'user' | 'assistant' | 'system' | 'tool'
  content: string
  createdAt: Date
  updatedAt?: Date
  status: 'draft' | 'sent' | 'error' | 'streaming'
  metadata?: Record<string, unknown>
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Rendering Pipeline</h2>
        <ol>
          <li><strong>Normalization</strong> – Adapter responses are normalized into the message schema.</li>
          <li><strong>Enrichment</strong> – Hooks append cost, latency, and moderation metadata.</li>
          <li><strong>Presentation</strong> – UI components render rich markdown, code blocks, and citations.</li>
          <li><strong>Actions</strong> – Copy, retry, regenerate, and feedback bindings mutate message state.</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Streaming Updates</h2>
        <p>
          Use <code>useStreamingChat</code> to patch the active assistant message as tokens arrive. <code>StreamingMessage</code> handles granular diffing and cursor animations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Error States</h2>
        <p>
          Set <code>status: &apos;error&apos;</code> and populate <code>metadata.error</code> for surfaced failures. Components automatically render retry affordances and tooltips.
        </p>
      </section>

      <section className="docs-section">
        <h2>Attachments</h2>
        <p>
          Messages support <code>metadata.attachments</code> for images, files, and references. The <code>AttachmentGallery</code> component renders previews with download links.
        </p>
        <p>
          Continue with the <a href="/guides/error-handling">Error Handling</a> guide to learn about retries, fallbacks, and guard rails.
        </p>
      </section>
    </div>
  )
}
