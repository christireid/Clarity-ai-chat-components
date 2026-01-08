import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

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
        <p className="docs-lead">
          Allows users to cancel active generations and recover gracefully.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <StreamCancellation />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
