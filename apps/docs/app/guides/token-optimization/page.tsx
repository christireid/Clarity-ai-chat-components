import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Token Optimization Guide',
  description: 'Reduce tokens with compression, chunking, reranking, and memory policies.',
}

export default function TokenOptimizationGuide() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Token Optimization</h1>
        <p className="docs-lead">Cut costs and latency without losing quality.</p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Use prompt compression, semantic chunking, hybrid search, reranking, and sliding
          context windows to keep context inside model limits and reduce spend.
        </p>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodePlayground
          initialCode={`function App({ children }) {
  return (
    <TokenOptimizerProvider
      compression={{ algorithm: 'llmlingua', targetRatio: 0.6 }}
      chunking={{ size: 800, overlap: 120 }}
      reranking={{ k: 12, topK: 6 }}
      slidingContext={{ maxTokens: 12000 }}
    >
      {children}
    </TokenOptimizerProvider>
  )
}

render(<App />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Techniques</h2>
        <ul>
          <li>Prompt compression with LLM-Lingua style summarization</li>
          <li>Semantic chunking and vector retrieval with hybrid search</li>
          <li>Reranking to select highest-signal chunks</li>
          <li>Sliding window to trim oldest low-signal messages</li>
        </ul>
        <p>See also: <a href="/reference/components/token-optimization-panel">Optimization Panel</a></p>
      </section>

      <section className="docs-section">
        <h2>Monitoring</h2>
        <ul>
          <li><a href="/reference/components/token-optimization-dashboard">Optimization Dashboard</a></li>
          <li><a href="/reference/components/token-optimization-badge">Savings Badge</a></li>
          <li><a href="/reference/components/usage-dashboard">Usage Dashboard</a></li>
        </ul>
      </section>
    </div>
  )
}
