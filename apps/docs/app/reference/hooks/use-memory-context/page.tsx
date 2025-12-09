import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useMemoryContext Hook | Clarity Chat',
  description:
    'Access the memory context for AI memory operations including add, query, and manage memories.',
}

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
    console.log('Found memories:', results)
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

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value (MemoryContextValue)</h3>
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
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Memory Types</h2>
        <div className="border rounded-lg p-4">
          <ul className="space-y-2 text-sm">
            <li><code className="bg-muted px-2 py-1 rounded">preference</code> - User preferences</li>
            <li><code className="bg-muted px-2 py-1 rounded">fact</code> - Factual information</li>
            <li><code className="bg-muted px-2 py-1 rounded">context</code> - Contextual information</li>
            <li><code className="bg-muted px-2 py-1 rounded">task</code> - Task-related memories</li>
          </ul>
        </div>
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
        </div>
      </section>
    </div>
  )
}
