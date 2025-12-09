import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useIndexedDB Hook | Clarity Chat',
  description:
    'IndexedDB hook for large data persistence with automatic fallback to localStorage.',
}

export default function UseIndexedDBPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium mb-4">
          <span>Persistence</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useIndexedDB</h1>
        <p className="text-xl text-muted-foreground mb-4">
          IndexedDB hook for large data persistence. Use for storing large conversations (&gt;5MB)
          or when you need structured queries. Falls back to localStorage when IndexedDB is unavailable.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Low-Level (Utilities) •{' '}
          <strong>Domain:</strong> Persistence
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>Persisting large conversation histories that exceed localStorage limits (&gt;5MB)</li>
          <li>Offline-first chat applications requiring reliable local storage</li>
          <li>When you need indexed queries on stored data (e.g., search by date)</li>
          <li>Applications storing media or large attachments locally</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Small amounts of data (&lt;5MB) - use <code className="bg-muted px-2 py-1 rounded">useLocalStorage</code> instead</li>
          <li>Server-side rendering - IndexedDB is browser-only</li>
          <li>Data that needs to sync across devices - use a backend database</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Automatic database initialization</li>
              <li>Type-safe operations</li>
              <li>Error handling with fallback</li>
            </ul>
          </div>
          <div className="border rounded-lg p-4">
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Loading states</li>
              <li>LocalStorage fallback</li>
              <li>Index support for queries</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useIndexedDB } from '@clarity-chat/react'

function ConversationStorage() {
  const { data, save, load, isLoading, error } = useIndexedDB<Message[]>({
    dbName: 'clarity-chat',
    version: 1,
    stores: [{
      name: 'conversations',
      keyPath: 'id',
      indexes: [{ name: 'createdAt', keyPath: 'createdAt' }]
    }]
  }, 'conversations', 'conversation-123')

  const handleSave = async (messages: Message[]) => {
    await save(messages)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <p>Stored messages: {data?.length ?? 0}</p>
      <button onClick={() => handleSave([...data, newMessage])}>
        Add Message
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Parameters</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Parameter</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">config</td>
                    <td className="p-3 font-mono text-sm">IndexedDBConfig</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Database configuration including name, version, and stores.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">storeName</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Name of the object store to use.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">key</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Optional key for the data item.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
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
                    <td className="p-3 font-mono text-sm">data</td>
                    <td className="p-3 font-mono text-sm">T | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Current data.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isLoading</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">Loading state.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">error</td>
                    <td className="p-3 font-mono text-sm">Error | null</td>
                    <td className="p-3 text-sm text-muted-foreground">Error state.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">save</td>
                    <td className="p-3 font-mono text-sm">(value: T) =&gt; Promise&lt;void&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">Save data to IndexedDB.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">load</td>
                    <td className="p-3 font-mono text-sm">() =&gt; Promise&lt;T | null&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">Load data from IndexedDB.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">remove</td>
                    <td className="p-3 font-mono text-sm">() =&gt; Promise&lt;void&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">Delete data from IndexedDB.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">clear</td>
                    <td className="p-3 font-mono text-sm">() =&gt; Promise&lt;void&gt;</td>
                    <td className="p-3 text-sm text-muted-foreground">Clear all data in store.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isAvailable</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">Whether IndexedDB is available.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-local-storage"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useLocalStorage</h3>
            <p className="text-sm text-muted-foreground">
              Simple localStorage hook for smaller data.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Learn about data persistence strategies.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
