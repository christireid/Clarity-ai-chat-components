import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Callout } from '@/components/MDX/Callout'
import { CodeBlock } from '@/components/MDX/CodeBlock'

export const metadata: Metadata = {
  title: 'Hook Fundamentals',
  description: 'Learn how Clarity Chat hooks orchestrate chat state, streaming, and optimization.',
}

export default function HookConceptsPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Hook Fundamentals</h1>

      <p className="lead">
        Clarity Chat exposes ergonomic React hooks that encapsulate chat workflows, state machines,
        and side effects. Hooks are written in TypeScript, battle-tested in production, and integrate
        with every adapter and component.
      </p>

      <h2 id="use-chat">`useChat`</h2>
      <p>
        Manages end-to-end chat state: optimistic updates, retries, persisted history, attachments,
        and message lifecycle events.
      </p>
      <CodeBlock
        language="tsx"
        title="Support widget"
        code={`import { ChatWindow, useChat } from '@clarity-chat/react'

export function SupportWidget() {
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateLastResponse,
  } = useChat({ chatId: 'support', model: 'gpt-4o-mini' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => sendMessage({ role: 'user', content })}
      onRegenerate={regenerateLastResponse}
    />
  )
}`}
      />

      <h2 id="use-chat-optimized">`useChatOptimized`</h2>
      <p>
        Blueprint v2.1 introduces <code>useChatOptimized</code>, a high-performance variant with
        memoized callbacks, debounced input, and batched updates. Use it for enterprise dashboards or
        conversations with heavy telemetry.
      </p>
      <CodeBlock
        language="tsx"
        code={`import { useChatOptimized } from '@clarity-chat/react'

const { messages, append, debouncedInput, isLoading } = useChatOptimized({
  api: '/api/chat',
  debounceMs: 120,
  memoizeMessages: true,
  batchUpdates: true,
})`}
      />

      <Callout type="tip">
        <p>
          <strong>When to upgrade?</strong> If your chat surface integrates token counters, streaming
          markdown, or analytics dashboards, <code>useChatOptimized</code> prevents unnecessary
          renders and keeps interactions snappy.
        </p>
      </Callout>

      <h2 id="streaming">Streaming Hooks</h2>
      <ul>
        <li>
          <code>useStreamingChat</code> orchestrates Server-Sent Events or WebSockets with automatic
          abort + retry logic.
        </li>
        <li>
          <code>useStreamingSSE</code> / <code>useStreamingWebSocket</code> expose lower-level control
          when you need manual buffering.
        </li>
        <li>
          <code>useStreamableUI</code> renders streaming UI elements in tandem with the Vercel AI SDK.
        </li>
      </ul>

      <h2 id="message-ops">Message Operations</h2>
      <p>
        <code>useMessageOperations</code> powers message editing, retry, undo/redo, branching, and
        tagging. Combine it with <code>ConversationBranchVisualizer</code> to expose speculative
        paths for reviewers.
      </p>

      <h2 id="token-optimization">Token Optimization Suite</h2>
      <p>
        Control spend with a dedicated suite introduced in Phase 4:
      </p>
      <ul>
        <li>
          <code>useTokenTracker</code> – live token + cost tracking for the current conversation.
        </li>
        <li>
          <code>useTokenOptimization</code> – orchestrates smart compression, summarisation, and chunking.
        </li>
        <li>
          <code>usePromptCompression</code>, <code>useSmartCache</code>, <code>useSmartThrottle</code>,
          <code>useRequestBatcher</code>, and <code>useModelRouter</code> – targeted utilities you can
          opt into based on workload.
        </li>
      </ul>

      <Callout type="success">
        <p>
          Pair token optimization hooks with <code>MemoryService</code> from{' '}
          <code>@clarity-chat/memory</code> to cut context costs by 60–90% without losing accuracy.
        </p>
      </Callout>

      <h2 id="device-experience">Device Experience</h2>
      <ul>
        <li>
          <code>useMobileKeyboard</code> smooths viewport height changes on iOS Safari.
        </li>
        <li>
          <code>useVoiceInput</code> captures microphone audio, transcribes, and submits messages.
        </li>
        <li>
          <code>useHaptic</code> and <code>useKeyboardShortcuts</code> layer delight and accessibility.
        </li>
      </ul>

      <h2 id="best-practices">Best Practices</h2>
      <ul>
        <li>Scope hooks per conversation ID to avoid cross-talk in multi-chat dashboards.</li>
        <li>
          Combine <code>useChat</code> with <code>ModelSelector</code> to swap adapters in real-time.
        </li>
        <li>
          Wrap streaming hooks in an <code>ErrorBoundary</code> and <code>RetryButton</code> for resilient UX.
        </li>
      </ul>

      <p>
        Continue with <a href="/reference/hooks">the hook reference</a> for full API details, or jump
        to the <a href="/cookbook/analytics-tracking">cookbook</a> to see hooks orchestrating real
        products.
      </p>
    </>
  )
}
