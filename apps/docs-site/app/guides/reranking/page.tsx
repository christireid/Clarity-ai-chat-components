import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Reranking - Clarity Chat',
  description: 'Reranking improves search result relevance by reordering documents based on their semantic similarity to the query.',
}

export default function RerankingGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Reranking</h1>
        <p className="docs-lead">
          Reranking improves search result relevance by reordering documents based on their semantic similarity to the query. Clarity Chat provides built-in rerankers and support for integrating with production reranking services.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Reranking helps you:
        </p>
        <ul>
          <li>Improve search result quality</li>
          <li>Reduce irrelevant results</li>
          <li>Increase diversity in results</li>
          <li>Optimize for specific use cases</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <CodeBlock
          language="tsx"
          code={`import { SimpleReranker } from '@clarity-chat/react'

const reranker = new SimpleReranker()

// Initial search results
const searchResults = [
  { id: '1', content: 'Machine learning basics', score: 0.8 },
  { id: '2', content: 'Deep learning tutorial', score: 0.7 },
  { id: '3', content: 'Python programming guide', score: 0.6 },
]

// Rerank for better relevance
const reranked = await reranker.rerank({
  query: 'machine learning',
  documents: searchResults,
  topK: 2,
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Retrieve More</strong>: Retrieve 2-3x more results than needed before reranking</li>
          <li><strong>Always Rerank</strong>: Reranking significantly improves result quality</li>
          <li><strong>Use Diversity</strong>: Use diversity reranker when you need varied results</li>
          <li><strong>Production Services</strong>: Use Cohere or Voyage for production applications</li>
          <li><strong>Cache Results</strong>: Cache reranked results for repeated queries</li>
          <li><strong>Monitor Performance</strong>: Track reranking latency and quality metrics</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Learn about <a href="/guides/rag">RAG System</a> for complete retrieval setup</li>
          <li>Check out <a href="/guides/token-optimization">Token Optimization</a> for cost reduction</li>
          <li>See <a href="/guides/performance">Performance Guide</a> for optimization tips</li>
        </ul>
      </section>
    </div>
  )
}
