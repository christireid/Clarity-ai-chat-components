import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Callout } from '@/components/MDX/Callout';
import { CodeBlock } from '@/components/MDX/CodeBlock';
export const dynamic = 'force-dynamic';
export const metadata = {
    title: 'State Management Guide - Clarity Chat',
    description: 'Structure chat state, branching conversations, optimistic updates, and persistence with the Clarity Chat React hooks.',
};
export default function StateManagementGuidePage() {
    return (_jsxs("div", { className: "docs-content", children: [_jsxs("div", { className: "docs-header", children: [_jsx("span", { className: "docs-badge", children: "Guide" }), _jsx("h1", { children: "State Management" }), _jsx("p", { className: "docs-lead", children: "Learn how the Clarity Chat state model works, how to wire the provided hooks together, and how to persist, branch, and optimize complex conversations." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "How Chat State Is Structured" }), _jsxs("p", { children: ["Every conversation is described by a ", _jsx("code", { children: "Message[]" }), " plus rich metadata (attachments, tool calls, tokens, safety verdicts). Hooks in", _jsx("code", { children: "@clarity-chat/react" }), " take care of the boilerplate:"] }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "State container" }), ": ", _jsx("code", { children: "useChat" }), " or", ' ', _jsx("code", { children: "useChatEnhanced" }), " manages messages, input state, and API calls."] }), _jsxs("li", { children: [_jsx("strong", { children: "Streaming" }), ": ", _jsx("code", { children: "useStreamingSSE" }), " /", _jsx("code", { children: "useStreamingWebSocket" }), " streams tokens into the message in real time."] }), _jsxs("li", { children: [_jsx("strong", { children: "Operations" }), ": ", _jsx("code", { children: "useMessageOperations" }), " adds undo/redo, branching, regenerate, and reactions."] }), _jsxs("li", { children: [_jsx("strong", { children: "Persistence" }), ": ", _jsx("code", { children: "useLocalStorage" }), ",", _jsx("code", { children: "useIndexedDb" }), ", and the ", _jsx("code", { children: "ConversationList" }), ' ', "component sync multiple sessions."] })] }), _jsx(Callout, { type: "info", children: "All primitives use plain arrays/objects. You can drop them into Redux, Zustand, Recoil, or server-side stores if you need additional orchestration." })] }), _jsxs("section", { className: "docs-section", children: [_jsxs("h2", { children: ["Quick Start with ", _jsx("code", { children: "useChat" })] }), _jsx(CodeBlock, { language: "tsx", code: `import { useChat, ChatWindow } from '@clarity-chat/react'

export function SupportAssistant() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stopStreaming,
  } = useChat({
    api: '/api/chat/support',
    id: 'support-thread',
    initialMessages: [
      { id: 'system', role: 'system', content: 'You are a helpful support agent.' },
    ],
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSubmit}
      inputValue={input}
      onInputChange={handleInputChange}
      onStop={stopStreaming}
    />
  )
}` }), _jsx("p", { children: "The hook handles optimistic updates, loading states, streaming responses, and abort controllers for you. It also emits analytics events (messages sent, errors, retry attempts) that feed the usage dashboards." })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Branching, Undo, and Advanced Operations" }), _jsx("p", { children: "Layer in the operations helper to enable regenerate, edit, and branch flows without manually copying message arrays." }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useChat,
  useMessageOperations,
  ConversationBranchVisualizer,
} from '@clarity-chat/react'

export function ResearchWorkspace() {
  const chat = useChat({ api: '/api/chat/research', id: 'workspace' })
  const {
    branches,
    currentBranchId,
    switchBranch,
    regenerateMessage,
    undo,
    redo,
  } = useMessageOperations({
    messages: chat.messages,
    onMessagesChange: chat.setMessages,
  })

  return (
    <div className="grid grid-cols-[320px,1fr] gap-6">
      <ConversationBranchVisualizer
        branches={branches}
        activeBranchId={currentBranchId}
        onSelectBranch={switchBranch}
      />

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
        onRegenerateMessage={regenerateMessage}
        onUndo={undo}
        onRedo={redo}
      />
    </div>
  )
}` }), _jsxs(Callout, { type: "tip", children: ["Branches are tracked purely in memory. Persist them by storing the output of ", _jsx("code", { children: "branches" }), " in your database alongside the base conversation ID."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Persisting Conversations" }), _jsx("p", { children: "You can keep history in memory, localStorage, IndexedDB, or your own backend. The persistence helpers keep per-tenant isolation while working with the quota and audit systems." }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useChat,
  useLocalStorage,
  ConversationList,
  MemoryQuotaStorage,
  QuotaManager,
} from '@clarity-chat/react'

const quotas = new QuotaManager({
  storage: new MemoryQuotaStorage(),
  limits: { tokens: 100_000, requests: 1_000 },
})

export function Dashboard() {
  const [conversations, setConversations] = useLocalStorage('clarity-chat-convos', [])

  const chat = useChat({
    id: 'active',
    onMessagesChange: (messages) => {
      setConversations((prev) => prev.map((c) => c.id === 'active' ? { ...c, messages } : c))
    },
  })

  return (
    <div className="grid grid-cols-[280px,1fr] gap-4">
      <ConversationList
        conversations={conversations}
        activeConversationId={chat.id}
        onSelectConversation={(id) => chat.setConversationId(id)}
        onCreateConversation={async () => {
          await quotas.recordUsage('tenant-1', 'requests', 1)
          const id = crypto.randomUUID()
          setConversations((prev) => [...prev, { id, title: 'New Chat', messages: [] }])
          chat.setConversationId(id)
        }}
      />

      <ChatWindow
        messages={chat.messages}
        onSendMessage={chat.handleSubmit}
      />
    </div>
  )
}` }), _jsxs("p", { children: ["For multi-tenant SaaS apps, combine this approach with the", ' ', _jsx("code", { children: "TenantManager" }), " to automatically namespace storage, analytics, quotas, and vector stores per customer."] })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Streaming State Patterns" }), _jsxs("p", { children: ["When you need full control over token-level updates, compose the streaming hooks directly. They share the same message format as", _jsx("code", { children: "useChat" }), ", so you can swap implementations later."] }), _jsx(CodeBlock, { language: "tsx", code: `import {
  useStreamingSSE,
  StreamingMessage,
  useOptimisticMessage,
} from '@clarity-chat/react'

export function CustomStreaming({ api }: { api: string }) {
  const [messages, setMessages] = useOptimisticMessage([])
  const { startStream, cancelStream, status } = useStreamingSSE({
    onToken(chunk) {
      setMessages('assistant', (current) => ({
        ...current,
        content: (current.content ?? '') + chunk,
      }))
    },
    onFinish() {
      setMessages('assistant', (current) => ({ ...current, status: 'complete' }))
    },
    onError(error) {
      setMessages('assistant', (current) => ({ ...current, status: 'error', error }))
    },
  })

  const handleSubmit = async (content: string) => {
    setMessages.add({
      role: 'user',
      content,
    })

    const controller = new AbortController()
    setMessages.startAssistantResponse(controller)

    await startStream({
      url: api,
      body: { messages: [...messages, { role: 'user', content }] },
      signal: controller.signal,
    })
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSubmit}
      onStop={cancelStream}
      footer={<StreamingMessage status={status} />}
    />
  )
}` })] }), _jsxs("section", { className: "docs-section", children: [_jsx("h2", { children: "Best Practices" }), _jsxs("ul", { children: [_jsxs("li", { children: [_jsx("strong", { children: "Immutable updates" }), ": rely on the helpers to avoid accidental mutation. This keeps React DevTools and time-traveling debug tools accurate."] }), _jsxs("li", { children: [_jsx("strong", { children: "Virtualize large transcripts" }), " with", ' ', _jsx("code", { children: "VirtualizedMessageList" }), " when a thread exceeds ~400 messages or you store knowledge base snippets inline."] }), _jsxs("li", { children: [_jsx("strong", { children: "Track cost & tokens" }), " using", ' ', _jsx("code", { children: "useTokenTracker" }), " and ", _jsx("code", { children: "TokenCounter" }), " so product managers can enforce budgets without backend changes."] }), _jsxs("li", { children: [_jsx("strong", { children: "Instrument state changes" }), " using", ' ', _jsx("code", { children: "useAnalytics()" }), ", ", _jsx("code", { children: "getTracer()" }), ", and the provided Redux-style dev tools in ", _jsx("code", { children: "@clarity-chat/dev-tools" }), "."] }), _jsxs("li", { children: [_jsx("strong", { children: "Guard against data loss" }), " with", ' ', _jsx("code", { children: "useBeforeUnload" }), " (included in ", _jsx("code", { children: "useChatEnhanced" }), ") when the user is drafting a message."] })] }), _jsx(Callout, { type: "success", children: "Need to plug this into an existing architecture? Everything returned by the hooks is serialisable. Persist it in Prisma, Supabase, DynamoDB, or any datastore you prefer." })] })] }));
}
//# sourceMappingURL=page.js.map