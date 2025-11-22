import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'NetworkStatus - Clarity Chat Components',
  description: 'Indicator for online/offline status and connectivity changes.',
}

export default function NetworkStatusPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>NetworkStatus</h1>
        <p className="docs-lead">Shows connection status and reconnection attempts.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <NetworkStatus />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
