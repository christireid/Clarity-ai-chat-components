import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeBlock } from '@/components/MDX/CodeBlock';
import { Callout } from '@/components/MDX/Callout';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Conversation Branching - Cookbook - Clarity Chat',
    description: 'Implement speculative conversation branches with ConversationBranchVisualizer and useBranchManagement.',
};
export default function ConversationBranchingCookbook() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Cookbook" }), _jsx("span", { className: "docs-badge", children: "Blueprint v2.1" }), _jsx("h1", { children: "Conversation Branching" }), _jsx("p", { className: "docs-lead", children: "Let users explore alternative replies like Claude. Branch from any message, review iterations, and merge the winning branch back into the main conversation." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Prerequisites" }), _jsxs("ul", { children: [_jsx("li", { children: "Clarity Chat v2.1+" }), _jsx("li", { children: "React 18+" }), _jsx("li", { children: "Optional: persistence layer (Postgres, Supabase, Firestore, etc.)" })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "1. Manage Branch State" }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useBranchManagement,
  type ConversationBranch,
} from '@clarity-chat/react'

const branchState = useBranchManagement({
  conversationId: 'ticket-123',
  onBranchChange: (branchId) => {
    analytics.track('branch_switched', { branchId })
  },
})` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "2. Show Branch Explorer" }), _jsx(CodeBlock, { language: "tsx", code: `<aside className="w-72 border-r border-border bg-bg-secondary/40">
  <ConversationBranchVisualizer
    branches={branchState.branches}
    currentBranchId={branchState.currentBranchId}
    onBranchSwitch={branchState.switchBranch}
    onBranchCreate={branchState.createBranch}
    onBranchDelete={branchState.deleteBranch}
    onBranchRename={branchState.renameBranch}
  />
</aside>` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "3. Fork from Messages" }), _jsxs("p", { children: ["Expose a \u201CBranch from here\u201D action in your message menu and pass the message id to ", _jsx("code", { children: "createBranch" }), "."] }), _jsx(CodeBlock, { language: "tsx", code: `const handleBranchFromMessage = (messageId: string) => {
  branchState.createBranch(branchState.currentBranchId, messageId)
}

<Message
  {...message}
  actions={[
    {
      label: 'Branch from here',
      onClick: () => handleBranchFromMessage(message.id),
    },
  ]} />` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "4. Persist Branches (Optional)" }), _jsx(CodeBlock, { language: "ts", code: `useEffect(() => {
  persistBranchesToSupabase(branchState.branches)
}, [branchState.branches])` }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: ["Each ", _jsx("code", { children: "ConversationBranch" }), " contains metadata hooks (message counts, previews, tokens). Store them for analytics dashboards or QA workflows."] }) })] })] }));
}
//# sourceMappingURL=page.js.map