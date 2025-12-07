import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodePlayground } from '@/components/Playground/CodePlayground';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'Conversation Branching Example - Clarity Chat Components',
    description: 'Implement Claude-style speculative branches with ConversationBranchVisualizer and useBranchManagement.',
};
export default function ConversationBranchingExamplePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Example" }), _jsx("span", { className: "docs-badge", children: "Blueprint v2.1" }), _jsx("h1", { children: "Conversation Branching" }), _jsx("p", { className: "docs-lead", children: "Give reviewers and power users the ability to explore alternative responses, compare iterations, and merge winning paths back into the main conversation." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Overview" }), _jsxs("p", { children: ["This example pairs ", _jsx("code", { children: "ConversationBranchVisualizer" }), " with ", _jsx("code", { children: "useBranchManagement" }), " and the standard ", _jsx("code", { children: "ChatWindow" }), ". Users can fork from any message, rename branches, and jump between paths without losing context."] }), _jsxs("ul", { children: [_jsx("li", { children: "Create, rename, and delete branches inline." }), _jsx("li", { children: "Highlight the active branch path so users never lose track." }), _jsx("li", { children: "Persist branch metadata for analytics (message counts, last message preview, token usage)." })] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Live Demo" }), _jsx(CodePlayground, { initialCode: `import { useState } from 'react'
import {
  ChatWindow,
  ConversationBranchVisualizer,
  useBranchManagement,
  Message,
} from '@clarity-chat/react'

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

render(<ConversationBranchingDemo />)` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Tips" }), _jsx(Callout, { type: "info", children: _jsxs("p", { children: ["Store branches in your database (e.g., Postgres, Supabase, Firestore) and hydrate", ' ', _jsx("code", { children: "useBranchManagement" }), " on mount. Branch metadata can power reports for red teaming and QA."] }) })] })] }));
}
//# sourceMappingURL=page.js.map