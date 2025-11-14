import React from 'react'
import { Metadata } from 'next'
import { LiveDemo } from '@/components/Demo/LiveDemo'

export const metadata: Metadata = {
  title: 'AdvancedMessageSearch - Clarity Chat Components',
  description: 'Full-text and semantic search UI for conversations.',
}

export default function AdvancedMessageSearchPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>AdvancedMessageSearch</h1>
        <p className="docs-lead">
          Search messages by keyword, filters, and semantic similarity with instant results.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <LiveDemo
          title="Example"
          code={`import { AdvancedMessageSearch } from '@clarity-chat/react'

export default function Example() {
  return (
    <div className="p-4">
      <AdvancedMessageSearch />
    </div>
  )
}`} 
          height="220px"
        />
      </section>
    </div>
  )
}
