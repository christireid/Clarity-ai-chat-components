import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const metadata: Metadata = {
  title: 'TokenOptimizationPanel - Clarity Chat Components',
  description:
    'Interactive panel to configure and visualize token optimization.',
}

export default function TokenOptimizationPanelPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>TokenOptimizationPanel</h1>
        <p className="docs-lead">
          Configure compression, chunking, reranking, and memory trimming
          strategies.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`import { TokenOptimizationPanel } from '@clarity-chat/react'

function Example() {
  return (
    <div className="p-6">
      <TokenOptimizationPanel />
    </div>
  )
}

render(<Example />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/guides/token-optimization">Token Optimization Guide</a>
          </li>
          <li>
            <a href="/reference/components/token-optimization-dashboard">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/reference/components/token-optimization-badge">Badge</a>
          </li>
        </ul>
      </section>
    </div>
  )
}
