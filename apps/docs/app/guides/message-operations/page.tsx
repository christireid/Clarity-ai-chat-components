import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Message Operations - Clarity Chat',
  description: 'Empower users and operators with advanced controls for message lifecycle management.',
}

export default function MessageOperationsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Message Operations</h1>
        <p className="docs-lead">
          Empower users and operators with advanced controls for message lifecycle management.
        </p>
      </div>

      <section className="docs-section">
        <h2>Editing</h2>
        <p>
          Use the <code>MessageActions</code> component or <code>useMessageOperations</code> hook to enable post-send edits.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { Message, useMessageOperations } from '@clarity-chat/react'

export function EditableMessage(props) {
  const { editMessage } = useMessageOperations({ chatId: props.message.chatId })

  return (
    <Message
      {...props}
      onEdit={async content => {
        await editMessage(props.message.id, content)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Branching &amp; Rewrites</h2>
        <ul>
          <li><code>createBranch</code> helps spawn alternative responses without losing original context.</li>
          <li>Use <code>regenerateMessage</code> to request a new assistant answer with updated instructions.</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Feedback Signals</h2>
        <p>
          Capture explicit thumbs up/down via <code>onFeedback</code> and persist results to your analytics warehouse.
        </p>
      </section>

      <section className="docs-section">
        <h2>Audit Trail</h2>
        <p>
          Leverage <code>ConversationTimeline</code> to visualise when messages were edited, branched, or deleted. Pair with <code>SessionSummary</code> for exportable reports.
        </p>
        <p>
          Return to the <a href="/guides/hooks">Hooks</a> overview for more automation patterns.
        </p>
      </section>
    </div>
  )
}
