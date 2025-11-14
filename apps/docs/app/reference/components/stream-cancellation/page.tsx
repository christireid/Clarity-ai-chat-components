import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'StreamCancellation - Clarity Chat Components',
  description: 'Provide stop/cancel controls for active streams.',
}

export default function StreamCancellationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>StreamCancellation</h1>
        <p className="docs-lead">Allows users to cancel active generations and recover gracefully.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { StreamCancellation } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <StreamCancellation />
    </div>
  )
}`} 
          height="160px"
        />
      </section>
    </div>
  )
}
