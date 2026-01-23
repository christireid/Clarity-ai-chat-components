import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ApiTable } from '@/components/Demo/ApiTable'

export const metadata: Metadata = {
  title: 'ConversationBranchVisualizer',
  description:
    'Visualise speculative conversation branches with Claude-style tree navigation.',
}

const props = [
  {
    name: 'branches',
    type: 'ConversationBranch[]',
    required: true,
    description:
      'Flat list of branches with ids, parent references, and metadata.',
  },
  {
    name: 'currentBranchId',
    type: 'string',
    required: true,
    description: 'Branch currently active in the conversation view.',
  },
  {
    name: 'onBranchSwitch',
    type: '(branchId: string) => void',
    required: true,
    description: 'Invoked when the user selects a different branch.',
  },
  {
    name: 'onBranchCreate',
    type: '(parentBranchId: string) => void',
    description: 'Triggered when the user adds a child branch.',
  },
  {
    name: 'onBranchDelete',
    type: '(branchId: string) => void',
    description:
      'Triggered when the user deletes a branch (only leaf nodes can be removed).',
  },
  {
    name: 'onBranchRename',
    type: '(branchId: string, newTitle: string) => void',
    description: 'Invoked after inline rename is confirmed.',
  },
  {
    name: 'maxDepth',
    type: 'number',
    description: 'Maximum depth to render (useful for constrained layouts).',
  },
  {
    name: 'compact',
    type: 'boolean',
    default: 'false',
    description: 'Display condensed UI for narrow sidebars.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes for the outer wrapper.',
  },
]

const hookReturn = [
  {
    name: 'branches',
    type: 'ConversationBranch[]',
    description: 'Managed branch list.',
  },
  {
    name: 'currentBranchId',
    type: 'string',
    description: 'Currently active branch id.',
  },
  {
    name: 'createBranch',
    type: '(parentId: string, messageId?: string) => void',
    description: 'Create a new child branch.',
  },
  {
    name: 'switchBranch',
    type: '(branchId: string) => void',
    description: 'Activate a branch.',
  },
  {
    name: 'deleteBranch',
    type: '(branchId: string) => void',
    description: 'Remove a branch and fallback to parent/main.',
  },
  {
    name: 'renameBranch',
    type: '(branchId: string, title: string) => void',
    description: 'Update branch title.',
  },
]

export default function ConversationBranchVisualizerPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ConversationBranchVisualizer</h1>
      <p className="lead">
        Offer Claude-style speculative conversations with a tree view of
        branches. Ideal for reviewer workflows, red-teaming, and creative
        ideation.
      </p>

      <Callout type="success">
        <p>
          Pair with <code>useBranchManagement</code> for state management, and
          feed branch metadata (message counts, token usage, etc.) to the UI for
          richer context.
        </p>
      </Callout>

      <h2 id="import">Import</h2>
      <CodeBlock
        language="tsx"
        code={`import {
  ConversationBranchVisualizer,
  useBranchManagement,
  type ConversationBranch,
} from '@clarity-chat/react'`}
      />

      <h2 id="usage">Usage</h2>
      <CodeBlock
        language="tsx"
        title="Branch sidebar"
        code={`const {
  branches,
  currentBranchId,
  createBranch,
  switchBranch,
  deleteBranch,
  renameBranch,
} = useBranchManagement({ conversationId: 'ticket-123' })

return (
  <ConversationBranchVisualizer
    branches={branches}
    currentBranchId={currentBranchId}
    onBranchSwitch={switchBranch}
    onBranchCreate={createBranch}
    onBranchDelete={deleteBranch}
    onBranchRename={renameBranch}
  />
)`}
      />

      <h2 id="branch-structure">Branch Structure</h2>
      <CodeBlock
        language="ts"
        code={`interface ConversationBranch {
  id: string
  parentId: string | null
  messageIds: string[]
  title?: string
  createdAt: Date
  updatedAt: Date
  metadata?: {
    messageCount: number
    lastMessagePreview?: string
    tokens?: number
  }
}`}
      />

      <h2 id="ux-patterns">UX Patterns</h2>
      <ul>
        <li>
          Show branch metadata (message counts, preview snippets) using the{' '}
          <code>metadata</code> field for quick scanning.
        </li>
        <li>
          Highlight the active path—users can understand branching context
          instantly.
        </li>
        <li>
          Disable delete actions for branches with children to avoid orphaned
          nodes (handled by default component logic).
        </li>
        <li>
          Combine with <code>ExportDialog</code> to share specific branch
          transcripts with stakeholders.
        </li>
      </ul>

      <h2 id="props">Props</h2>
      <ApiTable data={props} />

      <h2 id="use-branch-management">`useBranchManagement`</h2>
      <p>
        Lightweight hook for managing an in-memory branch tree. Provide your own
        persistence layer to sync with databases or collaboration services.
      </p>
      <ApiTable data={hookReturn} />

      <Pagination
        prev={{
          href: '/reference/components/message-timeline',
          title: 'MessageTimeline',
        }}
        next={{
          href: '/reference/components/markdown-renderer-enhanced',
          title: 'EnhancedMarkdownRenderer',
        }}
      />
    </>
  )
}
