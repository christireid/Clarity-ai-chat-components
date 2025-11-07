import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Performance Guide',
  description: 'Deliver fast, efficient chat experiences with virtualization and optimization hooks.',
}

export default function PerformanceGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Performance Guide</h1>

      <p className="lead">
        Clarity Chat is engineered for large enterprises handling thousands of messages per session.
        Combine virtualization, streaming optimizations, and token management to keep UI latency low.
      </p>

      <h2 id="virtualized-timelines">Virtualized Timelines</h2>
      <p>
        Use <code>VirtualizedMessageList</code> or the higher-level <code>MessageList</code> to window
        large histories. Provide stable <code>message.id</code> values and avoid recreating render
        functions each render.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { ChatWindow, MessageList, Message } from '@clarity-chat/react'

function Transcript({ messages }: { messages: Message[] }) {
  return (
    <ChatWindow
      messages={messages}
      messageListRenderer={(props) => (
        <MessageList
          messages={props.messages}
          renderMessage={props.renderMessage}
          virtualizationThreshold={120}
        />
      )}
    />
  )
}`}
      />

      <h2 id="streaming-efficiency">Streaming Efficiency</h2>
      <ul>
        <li>Batch token payloads on the server to reduce render thrash.</li>
        <li>
          <code>StreamingMessage</code> only re-renders diffed spans, minimising DOM churn.
        </li>
        <li>
          Debounce analytics updates with <code>useDebounce</code> (e.g., once per second during streams).
        </li>
      </ul>

      <h2 id="memoization">Memoization Checklist</h2>
      <CodeBlock
        language="tsx"
        code={`import { memo, useMemo } from 'react'
import { ChatWindow } from '@clarity-chat/react'

const MemoChatWindow = memo(ChatWindow)

export function FastChat({ initialMessages }) {
  const messages = useMemo(() => initialMessages, [initialMessages])
  return <MemoChatWindow messages={messages} />
}`}
      />

      <h2 id="optimized-hooks">Optimized Hooks</h2>
      <ul>
        <li>
          <code>useChatOptimized</code> memoizes messages, debounces input, and batches updates.
        </li>
        <li>
          <code>useTokenTracker</code> and <code>useTokenOptimization</code> manage context budgets so you
          send fewer tokens without manual pruning.
        </li>
        <li>
          <code>useMessageListPerformance</code> records render metrics via <code>requestIdleCallback</code>.
        </li>
      </ul>

      <h2 id="asset-optimisation">Asset Optimisation</h2>
      <ul>
        <li>Lazy load heavy adapters (embeddings, summarisation) with dynamic imports.</li>
        <li>Tree-shake unused components via ESM deep imports, e.g. <code>@clarity-chat/react/message</code>.</li>
        <li>Run <code>npm run analyze</code> and <code>npm run size</code> to monitor bundle size.</li>
      </ul>

      <Callout type="info">
        <p>
          Combine this guide with the <a href="/cookbook/analytics-tracking">analytics tracking recipe</a>{' '}
          to monitor latency, throughput, and cost per conversation.
        </p>
      </Callout>

      <p>
        Continue with the <a href="/learn/guides/accessibility">Accessibility Guide</a> to ensure
        optimized experiences remain inclusive.
      </p>
    </>
  )
}
