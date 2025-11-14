import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'StreamBlock - Clarity Chat Components',
  description: 'Render a block of streaming content with partial updates.',
}

export default function StreamBlockPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>StreamBlock</h1>
        <p className="docs-lead">Controlled unit for chunked updates in a message.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { StreamBlock } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <StreamBlock content="Streaming..." />
    </div>
  )
}`} 
          height="160px"
        />
      </section>
    </div>
  )
}
