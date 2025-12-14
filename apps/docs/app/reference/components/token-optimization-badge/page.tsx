import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'TokenOptimizationBadge - Clarity Chat Components',
  description: 'Compact indicator for token optimization status and savings.',
}

export default function TokenOptimizationBadgePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>TokenOptimizationBadge</h1>
        <p className="docs-lead">
          Small badge showing token savings and optimization status in context.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationBadge savingsPercent={37} />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <pre>
          <code>{`interface TokenOptimizationBadgeProps {
  className?: string
  savingsPercent?: number // 0-100
  status?: 'idle' | 'optimizing' | 'optimized' | 'error'
}`}</code>
        </pre>
      </section>
    </div>
  )
}
