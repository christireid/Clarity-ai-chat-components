import { Metadata } from 'next'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

import { CodePlayground } from '@/components/Playground/CodePlayground'
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Streaming Message - Clarity Chat',
  description: 'Display AI responses with token-by-token streaming, tool calls, thinking steps, citations, and error handling.',
}

export default function StreamingMessageClarityChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>Streaming Message - Clarity Chat</h1>
        <p className="docs-lead">
          Display AI responses with token-by-token streaming, tool calls, thinking steps, citations, and error handling.
        </p>
      </div>

      <ViewInStorybook component="StreamingMessage" />

      <section className="docs-section">
        <p className="text-sm text-muted-foreground">
          Note: Full documentation for this component is being migrated. Please refer to the storybook for interactive examples.
        </p>
      </section>
    </div>
  )
}
