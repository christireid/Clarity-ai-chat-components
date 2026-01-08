import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Conversation Branching Example - Clarity Chat Components',
  description:
    'Implement Claude-style speculative branches with ConversationBranchVisualizer and useBranchManagement.',
}

export default function ConversationBranchingExamplePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <span className="docs-badge">Blueprint v2.1</span>
        <h1>Conversation Branching</h1>
        <p className="docs-lead">
          Give reviewers and power users the ability to explore alternative
          responses, compare iterations, and merge winning paths back into the
          main conversation.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This example pairs <code>ConversationBranchVisualizer</code> with{' '}
          <code>useBranchManagement</code> and the standard{' '}
          <code>ChatWindow</code>. Users can fork from any message, rename
          branches, and jump between paths without losing context.
        </p>
        <ul>
          <li>Create, rename, and delete branches inline.</li>
          <li>Highlight the active branch path so users never lose track.</li>
          <li>
            Persist branch metadata for analytics (message counts, last message
            preview, token usage).
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <CodePlayground
          code={`import { useState } from 'react'
import {
  ChatWindow,
  ConversationBranchVisualizer,
  useBranchManagement,
  Message,
} from '@clarity-chat/react/internal'

const starterMessages: Message[] = [
  { id: 'm1', role: 'user', content: 'Draft a press release about our new AI feature.' },
  { id: 'm2', role: 'assistant', content: 'Sure! Here is a first pass...' },
]

export default function ConversationBranchingDemo() {
  const [messages, setMessages] = useState(starterMessages)
  const {
    branches,
    currentBranchId,
    createBranch,
    switchBranch,
    deleteBranch,
    renameBranch,
  } = useBranchManagement({ conversationId: 'demo' })

  const handleSendMessage = (content: string) => {
    setMessages((prev) => [
      ...prev,
      { id: \`m-\${Date.now()}\`, role: 'assistant', content },
    ])
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[520px]">
      <div className="md:w-72 border border-border rounded-lg p-3 bg-bg-secondary/40">
        <ConversationBranchVisualizer
          branches={branches}
          currentBranchId={currentBranchId}
          onBranchSwitch={switchBranch}
          onBranchCreate={createBranch}
          onBranchDelete={deleteBranch}
          onBranchRename={renameBranch}
        />
      </div>
      <div className="flex-1 border border-border rounded-lg">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          height="100%"
          enableMarkdown
        />
      </div>
    </div>
  )
}

render(<ConversationBranchingDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Tips</h2>
        <Callout type="info">
          <p>
            Store branches in your database (e.g., Postgres, Supabase,
            Firestore) and hydrate <code>useBranchManagement</code> on mount.
            Branch metadata can power reports for red teaming and QA.
          </p>
        </Callout>
      </section>
    </div>
  )
}
