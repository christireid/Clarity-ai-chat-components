import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Conversation Branching - Cookbook - Clarity Chat',
  description:
    'Implement speculative conversation branches with ConversationBranchVisualizer and useBranchManagement.',
}

export default function ConversationBranchingCookbook() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <span className="docs-badge">Blueprint v2.1</span>
        <h1>Conversation Branching</h1>
        <p className="docs-lead">
          Let users explore alternative replies like Claude. Branch from any
          message, review iterations, and merge the winning branch back into the
          main conversation.
        </p>
      </div>

      <section className="docs-section">
        <h2>Prerequisites</h2>
        <ul>
          <li>Clarity Chat v2.1+</li>
          <li>React 18+</li>
          <li>
            Optional: persistence layer (Postgres, Supabase, Firestore, etc.)
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>1. Manage Branch State</h2>
        <CodeBlock
          language="tsx"
          code={`import {
  useBranchManagement,
  type ConversationBranch,
} from '@clarity-chat/react'

const branchState = useBranchManagement({
  conversationId: 'ticket-123',
  onBranchChange: (branchId) => {
    analytics.track('branch_switched', { branchId })
  },
})`}
        />
      </section>

      <section className="docs-section">
        <h2>2. Show Branch Explorer</h2>
        <CodeBlock
          language="tsx"
          code={`<aside className="w-72 border-r border-border bg-bg-secondary/40">
  <ConversationBranchVisualizer
    branches={branchState.branches}
    currentBranchId={branchState.currentBranchId}
    onBranchSwitch={branchState.switchBranch}
    onBranchCreate={branchState.createBranch}
    onBranchDelete={branchState.deleteBranch}
    onBranchRename={branchState.renameBranch}
  />
</aside>`}
        />
      </section>

      <section className="docs-section">
        <h2>3. Fork from Messages</h2>
        <p>
          Expose a “Branch from here” action in your message menu and pass the
          message id to <code>createBranch</code>.
        </p>
        <CodeBlock
          language="tsx"
          code={`const handleBranchFromMessage = (messageId: string) => {
  branchState.createBranch(branchState.currentBranchId, messageId)
}

<Message
  {...message}
  actions={[
    {
      label: 'Branch from here',
      onClick: () => handleBranchFromMessage(message.id),
    },
  ]} />`}
        />
      </section>

      <section className="docs-section">
        <h2>4. Persist Branches (Optional)</h2>
        <CodeBlock
          language="ts"
          code={`useEffect(() => {
  persistBranchesToSupabase(branchState.branches)
}, [branchState.branches])`}
        />
        <Callout type="info">
          <p>
            Each <code>ConversationBranch</code> contains metadata hooks
            (message counts, previews, tokens). Store them for analytics
            dashboards or QA workflows.
          </p>
        </Callout>
      </section>
    </div>
  )
}
