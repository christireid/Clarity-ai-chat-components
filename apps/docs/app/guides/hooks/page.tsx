import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Hooks Overview - Clarity Chat',
  description: 'Clarity Chat exposes ergonomic React hooks that encapsulate common chat workflows, state machines, and side effects.',
}

export default function HooksGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Hooks Overview</h1>
        <p className="docs-lead">
          Clarity Chat exposes ergonomic React hooks that encapsulate common chat workflows, state machines, and side effects. Hooks are type-safe and integrate seamlessly with streaming model adapters.
        </p>
      </div>

      <section className="docs-section">
        <h2><code>useChat</code></h2>
        <p>
          Manages end-to-end chat state, including optimistic updates, retries, and persisted history.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow, useChat } from '@clarity-chat/react'

export function SupportWidget() {
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastResponse,
  } = useChat({ chatId: 'support', model: 'gpt-4o-mini' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={content => sendMessage({ role: 'user', content })}
      onRegenerate={regenerateLastResponse}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2><code>useStreamingChat</code></h2>
        <p>
          Helps orchestrate live token streaming via Server-Sent Events or WebSockets with built-in abort and timeout management.
        </p>
      </section>

      <section className="docs-section">
        <h2><code>useMessageOperations</code></h2>
        <p>
          Provides helpers for branching, editing, retrying, and tagging messages. Ideal for human-in-the-loop review flows.
        </p>
      </section>

      <section className="docs-section">
        <h2><code>useComposer</code></h2>
        <p>
          Drives the chat composer UI, exposing rich event callbacks for mention suggestions, file uploads, and slash commands.
        </p>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Scope hooks per conversation to avoid cross-talk between concurrent chats.</li>
          <li>Combine <code>useChat</code> with <code>ModelSelector</code> to dynamically switch adapters based on operator input.</li>
          <li>Pair <code>useStreamingChat</code> with <code>StreamingMessage</code> to reflect gradual completions without blocking UI.</li>
        </ul>
        <p>
          Continue with the <a href="/guides/messages">Message Handling</a> topic to learn how to model roles, attachments, and metadata.
        </p>
      </section>
    </div>
  )
}
