import { logger } from '@clarity-chat/utils/logger';
import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'PromptLibrary - Clarity Chat Components',
  description: 'Manage reusable prompts and insert them into chats.',
}

export default function PromptLibraryPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>PromptLibrary</h1>
        <p className="docs-lead">
          Organize and apply prompt templates with variables.
        </p>
      </div>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <CodePlayground
          initialCode={`function Example() {
  const items = [
    { id: 'summarize', label: 'Summarize Selection' },
    { id: 'rewrite', label: 'Rewrite for Tone' },
  ]
  return (
    <div className="p-4">
      <PromptLibrary items={items} onApply={(id) => logger.debug(id)} />
    </div>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
