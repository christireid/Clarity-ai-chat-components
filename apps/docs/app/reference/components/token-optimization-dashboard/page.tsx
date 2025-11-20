import React from 'react'
import { Metadata } from 'next'
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
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationDashboard />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
