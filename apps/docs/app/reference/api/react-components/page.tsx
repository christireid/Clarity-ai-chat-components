import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'React Components API Reference - Clarity Chat',
  description: 'Comprehensive API documentation for all React components in the Clarity Chat component library.',
}

export default function ReactComponentsAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>React Components API Documentation</h1>
        <p className="docs-lead">
          Comprehensive API documentation for all React components in the Clarity Chat component library.
        </p>
      </div>

      <section className="docs-section">
        <h2>ChatInput</h2>
        <p>
          Enhanced chat input component with smooth animations, character counting, and comprehensive state management.
        </p>

        <h3>Import</h3>
        <CodeBlock
          language="tsx"
          code={`import { ChatInput } from '@clarity-chat/react'`}
        />

        <h3>Features</h3>
        <ul>
          <li>Smooth expand/contract animation as user types</li>
          <li>Character counter with color-coded feedback</li>
          <li>Progress bar showing character limit</li>
          <li>Glowing focus ring with pulse animation</li>
          <li>Send button state transitions (idle → loading → success → error)</li>
          <li>Auto-resize textarea up to 6 lines</li>
          <li>Error shake animation when over limit</li>
          <li>Keyboard shortcuts (Enter to send, Shift+Enter for new line)</li>
        </ul>

        <h3>Example</h3>
        <CodeBlock
          language="tsx"
          code={`<ChatInput
  value={message}
  onChange={setMessage}
  onSubmit={handleSubmit}
  maxLength={500}
  showCharCounter
/>`}
        />
      </section>

      <section className="docs-section">
        <h2>Message</h2>
        <p>
          Enhanced message component for displaying chat messages with animations, feedback, and interactive features.
        </p>

        <h3>Import</h3>
        <CodeBlock
          language="tsx"
          code={`import { Message } from '@clarity-chat/react'`}
        />

        <h3>Message Type</h3>
        <CodeBlock
          language="tsx"
          code={`interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  status?: 'streaming' | 'complete' | 'error'
  timestamp?: Date
  feedback?: {
    type: 'up' | 'down'
  }
}`}
        />

        <h3>Features</h3>
        <ul>
          <li>Slide-in animations</li>
          <li>Hover actions</li>
          <li>Feedback buttons with confetti</li>
          <li>Copy to clipboard</li>
          <li>Edit and regenerate</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/reference/api/primitives">Primitives API</a> - Basic components</li>
          <li><a href="/reference/components">Components Overview</a> - Browse all components</li>
          <li><a href="/guides/components">Components Guide</a> - Usage guide</li>
        </ul>
      </section>
    </div>
  )
}
