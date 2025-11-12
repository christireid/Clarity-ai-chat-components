import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'RetryButton - Clarity Chat Components',
  description: 'Button to retry failed AI operations with built-in states.',
}

export default function RetryButtonPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>RetryButton</h1>
        <p className="docs-lead">Provides retry semantics and feedback for transient failures.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { RetryButton } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <RetryButton onRetry={() => fetch('/api/retry')} />
    </div>
  )
}`} 
          height="160px"
        />
      </section>
    </div>
  )
}
