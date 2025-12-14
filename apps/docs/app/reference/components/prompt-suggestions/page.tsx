import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'PromptSuggestions - Clarity Chat Components',
  description: 'Suggest follow-up prompts to keep conversations moving.',
}

export default function PromptSuggestionsPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PromptSuggestions</h1>
        <p className="docs-lead">
          Inline suggestions that users can click to continue.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  const suggestions = ['Summarize that', 'Give me 3 options', 'Explain like I\'m 5']
  return (
    <div className="p-4">
      <PromptSuggestions suggestions={suggestions} />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
