import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ApiTokenManager - Clarity Chat Components',
  description: 'Enterprise: manage API tokens, rotation, and access policies.',
}

export default function ApiTokenManagerPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Enterprise</span>
        <h1>ApiTokenManager</h1>
        <p className="docs-lead">CRUD and rotation flows for API tokens with audit trails.</p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  return (
    <div className="p-4">
      <ApiTokenManager />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
