import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Error Handling - Clarity Chat',
  description: 'Robust error handling keeps conversations resilient even when downstream models or tools fail.',
}

export default function ErrorHandlingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Error Handling</h1>
        <p className="docs-lead">
          Robust error handling keeps conversations resilient even when downstream models or tools fail.
        </p>
      </div>

      <section className="docs-section">
        <h2>Categorising Failures</h2>
        <ul>
          <li><strong>Transport errors</strong>: Network or adapter failures. Surface retries and fallback models.</li>
          <li><strong>Tool invocation errors</strong>: Tool outputs invalid or timed out. Present actionable logs to operators.</li>
          <li><strong>Content policy violations</strong>: Flag messages via moderation adapters and block delivery.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Recommended Patterns</h2>
        <ol>
          <li>Wrap async sends with <code>try/catch</code> and set message <code>status: &apos;error&apos;</code> on failure.</li>
          <li>Render contextual banners via <code>ChatWindow</code>&apos;s <code>onError</code> callback.</li>
          <li>Provide <code>onRetry</code> callbacks on <code>Message</code> to regenerate with new instructions.</li>
        </ol>

        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, useChat } from '@clarity-chat/react'

export function ReliableChat() {
  const { messages, sendMessage } = useChat({ chatId: 'resilient' })

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={async content => {
        try {
          await sendMessage({ role: 'user', content })
        } catch (error) {
          console.error('Failed to send message', error)
        }
      }}
      onError={err => console.error('chat error', err)}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Observability</h2>
        <p>
          Integrate application logs and tracing (e.g., OpenTelemetry) to capture request IDs, tokens used, and tool responses. Pair with <code>SessionSummary</code> to provide support teams with a full incident trail.
        </p>
        <p>
          Review the <a href="/guides/customization">Customization</a> guide to tailor error states to your brand voice.
        </p>
      </section>
    </div>
  )
}
