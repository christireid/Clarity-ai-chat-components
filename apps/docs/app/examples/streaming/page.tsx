import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Streaming Chat Demo - Clarity Chat',
  description: 'Advanced streaming experience that renders tokens as soon as they arrive from the server.',
}

export default function StreamingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <h1>Streaming Chat Demo</h1>
        <p className="docs-lead">
          Advanced streaming experience that renders tokens as soon as they arrive from the server.
        </p>
      </div>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>Server-Sent Events (SSE) based streaming endpoint.</li>
          <li>Typing indicator and retry controls during long responses.</li>
          <li>Graceful cancellation and abort handling.</li>
          <li>Transcript persistence for refreshing or sharing links.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Running Locally</h2>
        <CodeBlock
          language="bash"
          code={`cd examples/streaming-chat
npm install
npm run dev`}
        />
        <p>
          Ensure the <code>.env.local</code> file contains your API key and SSE endpoint configuration.
        </p>
      </section>

      <section className="docs-section">
        <h2>Architecture</h2>
        <ul>
          <li><strong>API Route</strong> – Next.js route streams data using <code>TextEncoderStream</code>.</li>
          <li><strong>Client Hook</strong> – <code>useStreamingChat</code> collects partial deltas and updates messages.</li>
          <li><strong>UI</strong> – <code>StreamingMessage</code> animates text reveal and caret.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Implementation Snippet</h2>
        <CodeBlock
          language="tsx"
          code={`import { useStreamingChat } from '@clarity-chat/react'

const { messages, streamMessage } = useStreamingChat({ chatId: 'streaming-demo' })

await streamMessage({
  role: 'user',
  content: 'Outline a migration plan from REST to GraphQL',
})`}
        />
        <p>
          Inspect <code>examples/streaming-chat</code> for environment setup, API handlers, and UI integration tips.
        </p>
      </section>
    </div>
  )
}
