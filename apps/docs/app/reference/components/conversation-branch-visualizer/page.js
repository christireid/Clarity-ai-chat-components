import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs';
import { Pagination } from '@/components/Navigation/Pagination';
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
import { ApiTable } from '@/components/Demo/ApiTable';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'ConversationBranchVisualizer',
    description: 'Visualise speculative conversation branches with Claude-style tree navigation.',
};
const props = [
    {
        name: 'branches',
        type: 'ConversationBranch[]',
        required: true,
        description: 'Flat list of branches with ids, parent references, and metadata.',
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
        description: 'Triggered when the user deletes a branch (only leaf nodes can be removed).',
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
];
const hookReturn = [
    { name: 'branches', type: 'ConversationBranch[]', description: 'Managed branch list.' },
    { name: 'currentBranchId', type: 'string', description: 'Currently active branch id.' },
    { name: 'createBranch', type: '(parentId: string, messageId?: string) => void', description: 'Create a new child branch.' },
    { name: 'switchBranch', type: '(branchId: string) => void', description: 'Activate a branch.' },
    { name: 'deleteBranch', type: '(branchId: string) => void', description: 'Remove a branch and fallback to parent/main.' },
    { name: 'renameBranch', type: '(branchId: string, title: string) => void', description: 'Update branch title.' },
];
export default function ConversationBranchVisualizerPage() {
    return (_jsxs(_Fragment, { children: [_jsx(Breadcrumbs, {}), _jsx("h1", { children: "ConversationBranchVisualizer" }), _jsx("p", { className: "lead", children: "Offer Claude-style speculative conversations with a tree view of branches. Ideal for reviewer workflows, red-teaming, and creative ideation." }), _jsx(Callout, { type: "success", children: _jsxs("p", { children: ["Pair with ", _jsx("code", { children: "useBranchManagement" }), " for state management, and feed branch metadata (message counts, token usage, etc.) to the UI for richer context."] }) }), _jsx("h2", { id: "import", children: "Import" }), _jsx(CodeBlock, { language: "tsx", code: `import {
  ConversationBranchVisualizer,
  useBranchManagement,
  type ConversationBranch,
} from '@clarity-chat/react'` }), _jsx("h2", { id: "usage", children: "Usage" }), _jsx(CodeBlock, { language: "tsx", title: "Branch sidebar", code: `const {
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
)` }), _jsx("h2", { id: "branch-structure", children: "Branch Structure" }), _jsx(CodeBlock, { language: "ts", code: `interface ConversationBranch {
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
}` }), _jsx("h2", { id: "ux-patterns", children: "UX Patterns" }), _jsxs("ul", { children: [_jsxs("li", { children: ["Show branch metadata (message counts, preview snippets) using the ", _jsx("code", { children: "metadata" }), " field for quick scanning."] }), _jsx("li", { children: "Highlight the active path\u2014users can understand branching context instantly." }), _jsx("li", { children: "Disable delete actions for branches with children to avoid orphaned nodes (handled by default component logic)." }), _jsxs("li", { children: ["Combine with ", _jsx("code", { children: "ExportDialog" }), " to share specific branch transcripts with stakeholders."] })] }), _jsx("h2", { id: "props", children: "Props" }), _jsx(ApiTable, { data: props }), _jsx("h2", { id: "use-branch-management", children: "`useBranchManagement`" }), _jsx("p", { children: "Lightweight hook for managing an in-memory branch tree. Provide your own persistence layer to sync with databases or collaboration services." }), _jsx(ApiTable, { data: hookReturn }), _jsx(Pagination, { prev: { href: '/reference/components/message-timeline', title: 'MessageTimeline' }, next: { href: '/reference/components/markdown-renderer-enhanced', title: 'MarkdownRendererEnhanced' } })] }));
}
//# sourceMappingURL=page.js.map