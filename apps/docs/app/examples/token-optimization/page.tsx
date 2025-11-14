import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'Example: Token Optimization',
  description: 'End-to-end example combining retrieval, compression, and reranking.',
}

export default function TokenOptimizationExample() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <h1>Token Optimization</h1>
        <p className="docs-lead">RAG + compression + reranking with live metrics.</p>
      </div>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <LiveDemo
          title="RAG with Optimization"
          code={`import { ChatWindow, TokenOptimizationPanel, TokenOptimizationBadge } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 border rounded">
        <ChatWindow />
      </div>
      <div className="space-y-3">
        <TokenOptimizationPanel />
        <div className="p-2 border rounded">
          <TokenOptimizationBadge savingsPercent={32} />
        </div>
      </div>
    </div>
  )
}`} 
          height="520px"
        />
      </section>
    </div>
  )
}
