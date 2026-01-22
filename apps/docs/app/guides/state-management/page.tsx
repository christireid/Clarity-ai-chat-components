import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'State Management Guide - Clarity Chat',
  description:
    'Structure chat state, branching conversations, optimistic updates, and persistence with the Clarity Chat React hooks.',
}

export default function StateManagementGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>State Management</h1>
        <p className="docs-lead">
          Learn how the Clarity Chat state model works, how to wire the provided
          hooks together, and how to persist, branch, and optimize complex
          conversations.
        </p>
      </div>

      <section className="docs-section">
        <h2>How Chat State Is Structured</h2>
        <p>
          Every conversation is described by a <code>Message[]</code> plus rich
          metadata (attachments, tool calls, tokens, safety verdicts). Hooks in
          <code>@clarity-chat/react</code> take care of the boilerplate:
        </p>
        <ul>
          <li>
            <strong>State container</strong>: <code>useClarityChat</code>{' '}
            (recommended) or <code>useChat</code> manages messages, input state,
            and API calls.
          </li>
          <li>
            <strong>Streaming</strong>: <code>useStreamingSSE</code> /
            <code>useStreamingWebSocket</code> streams tokens into the message
            in real time.
          </li>
          <li>
            <strong>Operations</strong>: <code>useMessageOperations</code> adds
            undo/redo, branching, regenerate, and reactions.
          </li>
          <li>
            <strong>Persistence</strong>: <code>useLocalStorage</code>,
            <code>useIndexedDb</code>, and the <code>ConversationList</code>{' '}
            component sync multiple sessions.
          </li>
        </ul>
        <Callout type="info">
          All primitives use plain arrays/objects. You can drop them into Redux,
          Zustand, Recoil, or server-side stores if you need additional
          orchestration.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>
          Quick Start with <code>useClarityChat</code>
        </h2>
        <Callout type="info">
          <code>useClarityChat</code> is the recommended hook for new projects.
          It includes memory integration, token optimization, and enhanced
          features. For legacy compatibility, <code>useChat</code> is still
          available.
        </Callout>
        <CodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

export function SupportAssistant() {
  const {
    messages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat/support',
    memory: { enabled: true },
    tokenOptimization: { enabled: true },
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}`}
        />
        <p>
          The hook handles optimistic updates, loading states, streaming
          responses, and abort controllers for you. It also emits analytics
          events (messages sent, errors, retry attempts) that feed the usage
          dashboards.
        </p>
      </section>

      <section className="docs-section">
        <h2>Branching, Undo, and Advanced Operations</h2>
        <p>
          Layer in the operations helper to enable regenerate, edit, and branch
          flows without manually copying message arrays.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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
}`}
        />
        <Callout type="tip">
          Branches are tracked purely in memory. Persist them by storing the
          output of <code>branches</code> in your database alongside the base
          conversation ID.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Persisting Conversations</h2>
        <p>
          You can keep history in memory, localStorage, IndexedDB, or your own
          backend. The persistence helpers keep per-tenant isolation while
          working with the quota and audit systems.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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
}`}
        />
        <p>
          For multi-tenant SaaS apps, combine this approach with the{' '}
          <code>TenantManager</code> to automatically namespace storage,
          analytics, quotas, and vector stores per customer.
        </p>
      </section>

      <section className="docs-section">
        <h2>Streaming State Patterns</h2>
        <p>
          When you need full control over token-level updates, compose the
          streaming hooks directly. They share the same message format as
          <code>useChat</code>, so you can swap implementations later.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
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
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            <strong>Immutable updates</strong>: rely on the helpers to avoid
            accidental mutation. This keeps React DevTools and time-traveling
            debug tools accurate.
          </li>
          <li>
            <strong>Virtualize large transcripts</strong> with{' '}
            <code>VirtualizedMessageList</code> when a thread exceeds ~400
            messages or you store knowledge base snippets inline.
          </li>
          <li>
            <strong>Track cost &amp; tokens</strong> using{' '}
            <code>useTokenTracker</code> and <code>TokenCounter</code> so
            product managers can enforce budgets without backend changes.
          </li>
          <li>
            <strong>Instrument state changes</strong> using{' '}
            <code>useAnalytics()</code>, <code>getTracer()</code>, and the
            provided Redux-style dev tools in{' '}
            <code>@clarity-chat/dev-tools</code>.
          </li>
          <li>
            <strong>Guard against data loss</strong> with{' '}
            <code>useBeforeUnload</code> (included in{' '}
            <code>useChatEnhanced</code>) when the user is drafting a message.
          </li>
        </ul>
        <Callout type="success">
          Need to plug this into an existing architecture? Everything returned
          by the hooks is serialisable. Persist it in Prisma, Supabase,
          DynamoDB, or any datastore you prefer.
        </Callout>
      </section>
    </div>
  )
}
