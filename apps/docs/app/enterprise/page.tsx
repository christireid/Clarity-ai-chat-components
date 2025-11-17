import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Enterprise Features - Clarity Chat',
  description: 'Enterprise-grade AI features for production applications.',
}

export default function EnterprisePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>Enterprise Features</h1>
        <p className="docs-lead">
          Enterprise-grade AI features for production applications.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Clarity Chat Enterprise includes advanced features for production AI applications:
        </p>
        <ul>
          <li>Vector Stores (Pinecone, Qdrant, Weaviate, Chroma)</li>
          <li>Embeddings with automatic caching</li>
          <li>Agent Orchestration</li>
          <li>Prompt Templates</li>
          <li>Document Loaders</li>
          <li>Model Fallback</li>
          <li>Context Window Management</li>
          <li>Rate Limiting</li>
          <li>Hybrid Search</li>
          <li>AI Safety</li>
          <li>Observability</li>
          <li>Reranking</li>
          <li>Webhooks</li>
          <li>Plugins</li>
          <li>Audit Logging</li>
          <li>Usage Quotas</li>
          <li>Multi-Tenancy</li>
          <li>RBAC</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Resources</h2>
        <ul>
          <li><Link href="/guides/rag">RAG Guide</Link> - Build retrieval-augmented generation applications</li>
          <li><Link href="/guides/multi-tenancy">Multi-Tenancy</Link> - Multi-tenant architecture</li>
          <li><Link href="/guides/rbac">RBAC</Link> - Role-based access control</li>
          <li><Link href="/guides/audit-logging">Audit Logging</Link> - Compliance and security</li>
          <li><Link href="/enterprise/pricing">Pricing</Link> - Enterprise pricing information</li>
          <li><Link href="/enterprise/case-studies">Case Studies</Link> - Real-world implementations</li>
        </ul>
      </section>
    </div>
  )
}
