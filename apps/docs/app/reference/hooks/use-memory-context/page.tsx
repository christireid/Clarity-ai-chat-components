'use client'

import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function UseMemoryContextPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
          <span>Memory & Context</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useMemoryContext</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Access the memory context provided by MemoryProvider. Use this hook to add, query,
          update, and manage AI memories in your components.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable) •{' '}
          <strong>Domain:</strong> Memory & Context
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>Building chat applications that need to remember user preferences across sessions</li>
          <li>Implementing personalized AI responses based on conversation history</li>
          <li>Creating context-aware features that retrieve relevant past information</li>
          <li>Managing long-term facts and knowledge within your application</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>For simple chat without memory needs - use <code className="bg-muted px-2 py-1 rounded">useClarityChat</code> directly</li>
          <li>For temporary session-only data - use React state or <code className="bg-muted px-2 py-1 rounded">useLocalStorage</code></li>
          <li>Outside of a <code className="bg-muted px-2 py-1 rounded">MemoryProvider</code> - the hook will return null</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useMemoryContext, MemoryProvider } from '@clarity-chat/react'

function ChatWithMemory() {
  const memory = useMemoryContext()

  const savePreference = async () => {
    await memory?.addMemory(
      'User prefers dark mode',
      'preference',
      'user',
      { category: 'ui' }
    )
  }

  const queryMemories = async () => {
    const results = await memory?.query({
      text: 'user preferences',
      limit: 10,
      types: ['preference'],
    })
    logger.debug('Found memories:', results)
  }

  return (
    <div>
      <p>Memory initialized: {memory?.isInitialized ? 'Yes' : 'No'}</p>
      <button onClick={savePreference}>Save Preference</button>
      <button onClick={queryMemories}>Query Memories</button>
    </div>
  )
}

// Wrap with MemoryProvider
function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-4">
          <CollapsibleSection title="Return Value (MemoryContextValue)" defaultOpen={true}>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">isInitialized</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether the memory service is ready.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">addMemory</td>
                    <td className="p-3 font-mono text-sm">(content, type, scope, metadata?) =&gt; Promise&lt;MemoryItem&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Add a new memory item.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">query</td>
                    <td className="p-3 font-mono text-sm">(query: MemoryQuery) =&gt; Promise&lt;MemorySearchResult[]&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Search for relevant memories.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">updateMemory</td>
                    <td className="p-3 font-mono text-sm">(id, updates) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Update an existing memory.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">deleteMemory</td>
                    <td className="p-3 font-mono text-sm">(id) =&gt; Promise&lt;boolean&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Delete a memory by ID.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Additional Methods" badge="Advanced">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">promoteMemory</td>
                    <td className="p-3 font-mono text-sm">(id, targetScope) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Promote memory to a different scope.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">compressMemory</td>
                    <td className="p-3 font-mono text-sm">(id, ratio?) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Compress a memory to save tokens.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">getStats</td>
                    <td className="p-3 font-mono text-sm">() =&gt; MemoryStats</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Get memory usage statistics.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">getContext</td>
                    <td className="p-3 font-mono text-sm">() =&gt; MemoryContext</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Get current memory context.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">subscribe</td>
                    <td className="p-3 font-mono text-sm">(eventType, listener) =&gt; () =&gt; void</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Subscribe to memory events.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      <section className="mb-12">
        <CollapsibleSection title="Memory Types" defaultOpen={true}>
          <ul className="space-y-2 text-sm">
            <li><code className="bg-muted px-2 py-1 rounded">preference</code> - User preferences</li>
            <li><code className="bg-muted px-2 py-1 rounded">fact</code> - Factual information</li>
            <li><code className="bg-muted px-2 py-1 rounded">context</code> - Contextual information</li>
            <li><code className="bg-muted px-2 py-1 rounded">task</code> - Task-related memories</li>
          </ul>
        </CollapsibleSection>
      </section>

      <section className="mb-12">
        <CollapsibleSection title="Advanced Examples" badge="Pro">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Subscribing to Memory Events</h4>
              <CodePlayground
                code={`const memory = useMemoryContext()

useEffect(() => {
  if (!memory) return

  const unsubscribe = memory.subscribe('memory:added', (event) => {
    logger.debug('New memory added:', event.memory)
  })

  return () => unsubscribe()
}, [memory])`}
              />
            </div>

            <div>
              <h4 className="font-semibold mb-2">Memory Compression</h4>
              <CodePlayground
                code={`// Compress old memories to save token budget
const compressOldMemories = async () => {
  const stats = memory?.getStats()

  if (stats && stats.tokenUsage > 8000) {
    const oldMemories = await memory?.query({
      limit: 10,
      sortBy: 'oldest'
    })

    for (const mem of oldMemories || []) {
      await memory?.compressMemory(mem.id, 0.5) // 50% compression
    }
  }
}`}
              />
            </div>
          </div>
        </CollapsibleSection>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Primary chat hook with memory integration.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Complete guide to using memory in chat applications.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-indexed-db"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useIndexedDB</h3>
            <p className="text-sm text-muted-foreground">
              Client-side storage for large data.
            </p>
          </Link>
          <Link
            href="/reference/hooks/compare"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Compare Hooks</h3>
            <p className="text-sm text-muted-foreground">
              Compare this hook with other memory hooks.
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback Widget */}
      <FeedbackWidget pageId="use-memory-context" className="mt-12" />
    </div>
  )
}
