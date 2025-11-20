import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Model Switching Demo - Clarity Chat',
  description: 'Showcase app highlighting how to toggle between providers and models on the fly.',
}

export default function ModelSwitchingPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <h1>Model Switching Demo</h1>
        <p className="docs-lead">
          Showcase app highlighting how to toggle between providers and models on the fly.
        </p>
      </div>

      <section className="docs-section">
        <h2>Features</h2>
        <ul>
          <li>Unified adapter interface for OpenAI, Anthropic, and Google AI.</li>
          <li>Real-time cost and latency comparison per model.</li>
          <li>Persisted operator preferences across sessions.</li>
          <li>Safety guardrails with automatic fallback.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Running Locally</h2>
        <CodeBlock
          language="bash"
          code={`cd examples/model-comparison-demo
npm install
npm run dev`}
        />
        <p>
          The demo exposes a control panel with temperature, max tokens, and provider toggles. All state changes flow through the <code>useChat</code> hook, so switching models mid-conversation retains context.
        </p>
      </section>

      <section className="docs-section">
        <h2>Key Components</h2>
        <ul>
          <li><code>ModelSelector</code> – surfaces provider and model dropdowns with cost hints.</li>
          <li><code>ChatWindow</code> – displays the current transcript with streaming updates.</li>
          <li><code>ModelStatsPanel</code> – visualises response time, token usage, and spend.</li>
        </ul>
        <p>
          Review the source in <code>examples/model-comparison-demo</code> for implementation details and API integration patterns.
        </p>
      </section>
    </div>
  )
}
