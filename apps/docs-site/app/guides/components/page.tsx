import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Components Overview - Clarity Chat',
  description: 'Clarity Chat ships a comprehensive suite of UI primitives for building production-grade chat experiences.',
}

export default function ComponentsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Components Overview</h1>
        <p className="docs-lead">
          Clarity Chat ships a comprehensive suite of UI primitives for building production-grade chat experiences. Components are designed to be composable, themeable, and accessible by default.
        </p>
      </div>

      <section className="docs-section">
        <h2>Core Layout</h2>
        <ul>
          <li><code>ChatWindow</code> orchestrates the full messaging surface, including header, conversation timeline, and composer.</li>
          <li><code>ConversationPane</code> renders chronological message threads with virtualization support for long histories.</li>
          <li><code>Composer</code> provides multiline authoring with attachments, slash commands, and keyboard shortcuts.</li>
        </ul>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const messages: Message[] = [
  {
    id: '1',
    chatId: 'demo',
    role: 'assistant',
    content: 'How can I help you today?',
    createdAt: new Date(),
    status: 'sent',
  },
]

export function BasicChat() {
  return <ChatWindow messages={messages} onSendMessage={() => {}} />
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Message Presentation</h2>
        <ul>
          <li><code>Message</code> supports markdown, citations, inline code, and nested tool traces.</li>
          <li><code>StreamingMessage</code> shows token-by-token output with typing indicators.</li>
          <li><code>MessageActions</code> surfaces reactions, copy, and retry affordances.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>System Controls</h2>
        <ul>
          <li><code>ModelSelector</code> lets operators toggle between foundation models or fine-tunes.</li>
          <li><code>TemperatureSlider</code> exposes tuning for creativity versus determinism.</li>
          <li><code>SafetyPanel</code> aggregates moderation and policy outcomes before publishing a reply.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Operational Widgets</h2>
        <ul>
          <li><code>ConversationTimeline</code> visualises turns, tool calls, and agent state.</li>
          <li><code>FollowUpSuggestions</code> seeds the user with context-aware prompts.</li>
          <li><code>SessionSummary</code> packages transcripts for downstream analytics.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Explore the Storybook catalog locally (<code>npm run storybook</code>, then visit <code>http://localhost:6006</code>) for live component examples.</li>
          <li>Review the <a href="/guides/messages">Message Handling</a> guide for data modeling best practices.</li>
          <li>Consult the <a href="/guides/customization">Customization</a> guide to align components with your brand.</li>
        </ul>
      </section>
    </div>
  )
}
