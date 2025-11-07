import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Hooks Overview - Learn Clarity Chat',
  description:
    'Map the Clarity Chat hook ecosystem—from chat state containers to streaming, analytics, and enterprise utilities.',
}

export default function HooksConceptPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Concept</span>
        <h1>Hook Ecosystem</h1>
        <p className="docs-lead">
          Clarity Chat provides more than 40 hooks. Grouped together, they cover
          state management, streaming, storage, analytics, safety, and enterprise
          operations.
        </p>
      </div>

      <section className="docs-section">
        <h2>Hook Categories</h2>
        <ul>
          <li>
            <strong>Chat State:</strong> <code>useChat</code>,{' '}
            <code>useChatEnhanced</code>, <code>useChatOptimized</code>
          </li>
          <li>
            <strong>Streaming &amp; Transport:</strong> <code>useStreamingSSE</code>,{' '}
            <code>useStreamingWebSocket</code>, <code>useStreamableUI</code>
          </li>
          <li>
            <strong>Operations &amp; History:</strong> <code>useMessageOperations</code>,{' '}
            <code>useUndoRedo</code>, <code>useMessageHistory</code>
          </li>
          <li>
            <strong>Persistence:</strong> <code>useLocalStorage</code>,{' '}
            <code>useIndexedDb</code>, <code>useSmartCache</code>
          </li>
          <li>
            <strong>Analytics &amp; Observability:</strong>{' '}
            <code>useAnalytics</code>, <code>usePerformance</code>,{' '}
            <code>useRenderPerformance</code>
          </li>
          <li>
            <strong>UX &amp; Device:</strong> <code>useAutoScroll</code>,{' '}
            <code>useMobileKeyboard</code>, <code>useTyping</code>,{' '}
            <code>useHaptic</code>
          </li>
          <li>
            <strong>Enterprise:</strong> <code>useTokenTracker</code>,{' '}
            <code>useTokenOptimization</code>, <code>useQuota</code> (via manager)
          </li>
        </ul>
        <Callout type="tip">
          Hooks follow React naming conventions and are safe in server components
          unless explicitly documented as client-only (e.g. streaming hooks).
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Combining Hooks</h2>
        <p>
          Hooks are composable. Start with <code>useChat</code> and layer streaming
          or operations only when required.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  useChat,
  useStreamingSSE,
  useMessageOperations,
  useTokenTracker,
} from '@clarity-chat/react'

export function AdvancedChat() {
  const chat = useChat({ id: 'advanced', api: '/api/chat/advanced' })
  const streamer = useStreamingSSE({
    onToken: chat.appendStreamingChunk,
    onFinish: chat.finishStreamingMessage,
    onError: chat.failStreamingMessage,
  })
  const operations = useMessageOperations({
    messages: chat.messages,
    onMessagesChange: chat.setMessages,
  })
  const tokenStats = useTokenTracker({
    messages: chat.messages,
    model: 'gpt-4o',
    onChange: (stats) => console.log('Usage', stats),
  })

  return (
    <ChatWindow
      messages={chat.messages}
      onSendMessage={async (value) => {
        const controller = new AbortController()
        chat.startStreamingMessage(controller)
        await streamer.startStream({
          url: '/api/chat/advanced',
          body: { messages: chat.messages.concat({ role: 'user', content: value }) },
          signal: controller.signal,
        })
      }}
      onStop={streamer.cancelStream}
      onRegenerateMessage={operations.regenerateMessage}
      onUndo={operations.undo}
      onRedo={operations.redo}
      footer={
        <div className="text-xs text-muted-foreground flex justify-between">
          <span>{tokenStats.totalTokens} tokens</span>
          <span>${tokenStats.estimatedCost.toFixed(4)}</span>
        </div>
      }
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Storage &amp; Sync Hooks</h2>
        <p>
          Persist conversation state locally or remotely with drop-in hooks.
        </p>
        <CodeBlock
          language="tsx"
          code={`import {
  useChat,
  useLocalStorage,
  useIndexedDb,
} from '@clarity-chat/react'

export function OfflineReadyChat() {
  const [drafts, setDrafts] = useLocalStorage<Record<string, string>>('drafts', {})
  const history = useIndexedDb('clarity-chat')

  const chat = useChat({
    id: 'offline',
    initialInput: drafts['offline'] ?? '',
    onInputChange: (value) => setDrafts((prev) => ({ ...prev, offline: value })),
    onMessagesChange: async (messages) => {
      await history.store('conversations', { id: 'offline', messages })
    },
  })

  return <ChatWindow {...chat} />
}
`}
        />
        <Callout type="info">
          The storage hooks are optional. If you have your own data layer (Redux,
          tRPC, GraphQL), simply pass new message arrays to <code>useChat</code>.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Observability Hooks</h2>
        <p>
          Track runtime metrics, analytics, and user behaviour without sprinkling
          analytics calls everywhere.
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useAnalytics, useRenderPerformance } from '@clarity-chat/react'

function SuggestionButton({ suggestion }: { suggestion: string }) {
  const { track } = useAnalytics()
  const perf = useRenderPerformance('SuggestionButton')

  return (
    <button
      onClick={() => {
        track('suggestion_clicked', { suggestion, renderTime: perf.lastRenderTime })
        insertSuggestion(suggestion)
      }}
    >
      {suggestion}
    </button>
  )
}
`}
        />
      </section>

      <section className="docs-section">
        <h2>Key Takeaways</h2>
        <ul>
          <li>Start with <code>useChat</code>; scale up with additional hooks as requirements grow.</li>
          <li>Use streaming hooks when you need bespoke streaming UX (multi-model, diffing, etc.).</li>
          <li>Persistence hooks are optional—compatible with any backend or state library.</li>
          <li>Instrument with analytics and performance hooks to monitor real-world usage.</li>
        </ul>
      </section>
    </div>
  )
}

