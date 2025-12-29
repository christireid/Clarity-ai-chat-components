import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'MemoryProvider Component | Clarity Chat',
  description:
    'React context provider for AI memory integration. Enables memory features in chat applications.',
}

export default function MemoryProviderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium mb-4">
          <span>Memory & Context</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">MemoryProvider</h1>
        <p className="text-xl text-muted-foreground mb-4">
          React context provider that enables AI memory integration throughout
          your application. Wraps components that need access to memory
          features.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Memory & Context
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>
            Applications requiring AI memory that persists across sessions
          </li>
          <li>Chat apps that need to remember user preferences and context</li>
          <li>When multiple components need access to shared memory state</li>
          <li>Building personalized AI experiences with long-term memory</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            For simple chat without memory - use{' '}
            <code className="bg-muted px-2 py-1 rounded">ClarityChat</code> or{' '}
            <code className="bg-muted px-2 py-1 rounded">useClarityChat</code>{' '}
            directly
          </li>
          <li>
            For session-only context - use{' '}
            <code className="bg-muted px-2 py-1 rounded">useClarityChat</code>{' '}
            with sliding-window memory
          </li>
          <li>When memory is handled entirely on the server side</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { MemoryProvider, useClarityChat, ChatWindow } from '@clarity-chat/react/internal'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}

function ChatWithMemory() {
  const chat = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
    />
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Vector Store</h2>
        <CodePlayground
          code={`import {
  MemoryProvider,
  createVectorStore,
  createEmbeddingProvider
} from '@clarity-chat/react/internal'

const vectorStore = createVectorStore({
  provider: 'qdrant',
  url: 'https://your-cluster.qdrant.io',
  apiKey: process.env.QDRANT_API_KEY,
})

const embeddings = createEmbeddingProvider({
  provider: 'openai',
  model: 'text-embedding-3-small',
})

function App() {
  return (
    <MemoryProvider
      config={{ maxTokens: 10000 }}
      vectorStore={vectorStore}
      embeddings={embeddings}
    >
      <YourApp />
    </MemoryProvider>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Props</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">config</td>
                    <td className="p-3 font-mono text-sm">
                      MemoryServiceConfig
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      <strong>Required.</strong> Memory service configuration
                      including maxTokens.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">config.maxTokens</td>
                    <td className="p-3 font-mono text-sm">number</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Maximum tokens for memory context.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">vectorStore</td>
                    <td className="p-3 font-mono text-sm">VectorStore</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Optional vector store for semantic search.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">embeddings</td>
                    <td className="p-3 font-mono text-sm">EmbeddingProvider</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Optional embedding provider for vector generation.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">autoStart</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether to auto-start the memory service. Default: true.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">children</td>
                    <td className="p-3 font-mono text-sm">React.ReactNode</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Child components to wrap.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Context Value</h2>
        <p className="text-muted-foreground mb-4">
          Use the{' '}
          <code className="bg-muted px-2 py-1 rounded">useMemoryContext</code>{' '}
          hook to access the memory context provided by MemoryProvider.
        </p>
        <div className="border rounded-lg p-4">
          <pre className="text-sm">
            <code>{`const memory = useMemoryContext()

// Core operations
await memory.addMemory(content, type, scope, metadata)
const results = await memory.query({ text: 'query', limit: 10 })
await memory.updateMemory(id, updates)
await memory.deleteMemory(id)

// Stats and context
const stats = memory.getStats()
const context = memory.getContext()`}</code>
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-memory-context"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useMemoryContext</h3>
            <p className="text-sm text-muted-foreground">
              Hook to access memory context.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-clarity-chat"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useClarityChat</h3>
            <p className="text-sm text-muted-foreground">
              Chat hook with built-in memory support.
            </p>
          </Link>
          <Link
            href="/guides/memory"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">Memory Guide</h3>
            <p className="text-sm text-muted-foreground">
              Complete guide to using memory features.
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-vector-store"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useVectorStore</h3>
            <p className="text-sm text-muted-foreground">
              Vector store integration hook.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
