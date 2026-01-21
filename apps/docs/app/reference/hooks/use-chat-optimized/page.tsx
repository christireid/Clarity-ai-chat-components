import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useChatOptimized Hook | Clarity Chat',
  description:
    'High-performance variant of useChat with memoization, batching, and debounced input state.',
}

export default function UseChatOptimizedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
      <header>
        <h1 className="text-4xl font-bold mb-3">useChatOptimized</h1>
        <p className="text-lg text-muted-foreground">
          Blueprint v2.1 upgrade: a drop-in enhancement to <code>useChat</code>{' '}
          that reduces unnecessary renders and smooths streaming performance for
          enterprise dashboards.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-3">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            Conversation panels with token counters, analytics widgets, or heavy
            memoized subtrees.
          </li>
          <li>
            Large-scale deployments streaming multiple assistants
            simultaneously.
          </li>
          <li>
            UIs that require debounced input for autosave, search, or
            rate-limited endpoints.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto">
            <code>{`import { useChatOptimized } from '@clarity-chat/react'

const {
  messages,
  append,
  setMessages,
  debouncedInput,
  input,
  setInput,
  isLoading,
} = useChatOptimized({
  api: '/api/chat',
  model: 'gpt-4o-mini',
  debounceMs: 120,
  memoizeMessages: true,
  batchUpdates: true,
})`}</code>
          </pre>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Options</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <code>debounceMs</code> – debounce timing for{' '}
            <code>debouncedInput</code>. Defaults to <code>0</code>.
          </li>
          <li>
            <code>memoizeMessages</code> – memoize message array to keep
            referential equality. Defaults to <code>true</code>.
          </li>
          <li>
            <code>batchUpdates</code> – run <code>append</code> and{' '}
            <code>setMessages</code> inside <code>startTransition</code> to
            cooperate with concurrent rendering. Defaults to <code>true</code>.
          </li>
          <li>
            All other <code>useChat</code> options are supported and forwarded.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">Return Values</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <code>debouncedInput</code> – debounced input string for
            analytics/search.
          </li>
          <li>
            All other return values mirror <code>useChat</code>, including{' '}
            <code>messages</code>, <code>append</code>, <code>isLoading</code>,
            etc.
          </li>
        </ul>
      </section>
    </div>
  )
}
