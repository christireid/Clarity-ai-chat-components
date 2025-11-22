import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ToolInvocationCard - Clarity Chat Components',
  description: 'Visualize tool calls, inputs, and results inside conversations.',
}

export default function ToolInvocationCardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>ToolInvocationCard</h1>
        <p className="docs-lead">Display a tool execution with status, logs, and output.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  const run = {
    id: 'run_123',
    name: 'web.search',
    status: 'succeeded',
    input: { q: 'weather san francisco' },
    output: { tempF: 64 }
  }
  return (
    <div className="p-4">
      <ToolInvocationCard run={run} />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
