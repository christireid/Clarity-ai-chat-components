import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Observability & Monitoring - Clarity Chat',
  description: 'Monitor your AI chat application with comprehensive observability tools including tracing, metrics, and evaluation.',
}

export default function ObservabilityGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Observability &amp; Monitoring</h1>
        <p className="docs-lead">
          Monitor your AI chat application with comprehensive observability tools including tracing, metrics, and evaluation.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Observability features help you:
        </p>
        <ul>
          <li>Track request latency and performance</li>
          <li>Monitor token usage and costs</li>
          <li>Evaluate response quality</li>
          <li>Debug issues with detailed traces</li>
          <li>Analyze user behavior</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Tracing</h2>
        <p>
          Track AI operations with detailed traces:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { Tracer } from '@clarity-chat/react'

const tracer = new Tracer({
  enabled: true,
  provider: 'console', // or 'opentelemetry', 'datadog', etc.
})

// Wrap operations in traces
const trace = tracer.startTrace('chat.completion')

try {
  const response = await chat({
    messages: [{ role: 'user', content: 'Hello!' }],
  })
  
  trace.setAttribute('tokens', response.usage.totalTokens)
  trace.setAttribute('model', 'gpt-4')
  trace.end({ status: 'success' })
} catch (error) {
  trace.end({ status: 'error', error: error.message })
}`}
        />

        <h3>Automatic Tracing</h3>
        <p>
          Enable automatic tracing for all operations:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ObservabilityProvider } from '@clarity-chat/react'

function App() {
  return (
    <ObservabilityProvider
      tracer={tracer}
      autoTrace={true}
      traceOperations={['chat', 'embedding', 'tool_call']}
    >
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ObservabilityProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Metrics</h2>
        <p>
          Track key metrics:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { MetricsCollector } from '@clarity-chat/react'

const metrics = new MetricsCollector({
  provider: 'console', // or 'prometheus', 'datadog', etc.
})

// Track custom metrics
metrics.increment('chat.messages.sent')
metrics.histogram('chat.response.time', responseTime)
metrics.gauge('chat.active.users', activeUsers)`}
        />

        <h3>Built-in Metrics</h3>
        <p>
          Clarity Chat automatically tracks:
        </p>
        <ul>
          <li><code>chat.messages.sent</code> - Total messages sent</li>
          <li><code>chat.messages.received</code> - Total messages received</li>
          <li><code>chat.tokens.input</code> - Input tokens used</li>
          <li><code>chat.tokens.output</code> - Output tokens used</li>
          <li><code>chat.cost.estimated</code> - Estimated cost</li>
          <li><code>chat.errors</code> - Error count</li>
          <li><code>chat.latency</code> - Response latency</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Enable in Production</strong>: Always enable observability in production</li>
          <li><strong>Sample Traces</strong>: Sample traces to avoid performance impact</li>
          <li><strong>Monitor Costs</strong>: Track token usage and costs</li>
          <li><strong>Set Alerts</strong>: Set up alerts for errors and latency</li>
          <li><strong>Privacy</strong>: Don&apos;t log sensitive user data</li>
          <li><strong>Performance</strong>: Use async logging to avoid blocking</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/observability">Observability API Reference</a> - Complete observability API</li>
          <li><a href="/reference/components/evaluation-dashboard">Evaluation Dashboard</a> - Quality metrics</li>
          <li><a href="/reference/components/performance-dashboard">Performance Dashboard</a> - Performance metrics</li>
        </ul>
      </section>
    </div>
  )
}
