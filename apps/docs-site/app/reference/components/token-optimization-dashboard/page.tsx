import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'TokenOptimizationDashboard - Clarity Chat Components',
  description: 'Dashboard view of token optimization strategies and results.',
}

export default function TokenOptimizationDashboardPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>TokenOptimizationDashboard</h1>
        <p className="docs-lead">
          High-level view of compression, reranking, and memory policies across sessions.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { TokenOptimizationDashboard } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationDashboard />
    </div>
  )
}`} 
          height="240px"
        />
      </section>
    </div>
  )
}
