'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function UseMemoryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Mid-Level Hook</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useMemory</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Core React hook for AI memory operations. Add, query, update, delete, and
          manage memories with semantic search, scoped storage, and real-time events.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable Building Blocks) •{' '}
          <strong>Domain:</strong> Memory & Context
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { MemoryProvider, useMemory } from '@clarity-chat/react'

function ChatWithMemory() {
  const { addMemory, query, getStats } = useMemory()

  // Store a user preference
  const savePreference = async () => {
    await addMemory(
      'User prefers dark mode',
      'semantic',  // type
      'user'       // scope
    )
  }

  // Search memories
  const findRelevant = async (topic: string) => {
    const results = await query({ query: topic, limit: 5 })
    return results.map(r => r.memory.content)
  }

  return <button onClick={savePreference}>Remember Dark Mode</button>
}

// Must be wrapped in MemoryProvider
function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            CRUD Operations
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Semantic Search
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Event Subscription
          </span>
        </div>
      </section>

      {/* When to Use */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">
              Use useMemory When:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>You need direct control over memory operations</li>
              <li>Building custom memory UI (search, display, manage)</li>
              <li>Storing user preferences, facts, or conversation context</li>
              <li>You want to integrate memory with your own chat logic</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-amber-600 dark:text-amber-400 mb-2">
              Consider Alternatives:
            </h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                For declarative queries with loading states →{' '}
                <Link href="/reference/hooks/use-memory-query" className="text-brand-600 hover:underline">
                  useMemoryQuery
                </Link>
              </li>
              <li>
                For conversation-specific memory →{' '}
                <Link href="/reference/hooks/use-conversation-memory" className="text-brand-600 hover:underline">
                  useConversationMemory
                </Link>
              </li>
              <li>
                For memory stats with auto-refresh →{' '}
                <Link href="/reference/hooks/use-memory-stats" className="text-brand-600 hover:underline">
                  useMemoryStats
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Usage Examples</h2>

        <CollapsibleSection title="Add Memory with Metadata" defaultOpen={true}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const { addMemory } = useMemory()

// Basic memory
await addMemory('User likes TypeScript', 'semantic', 'user')

// With metadata and options
await addMemory(
  'User asked about React hooks implementation',
  'episodic',     // Memory type
  'session',      // Scope
  {               // Metadata (optional)
    topic: 'react-hooks',
    sentiment: 'curious',
    tags: ['react', 'hooks', 'tutorial']
  },
  {               // Options (optional)
    priority: 'high',     // 'low' | 'medium' | 'high' | 'critical'
    confidence: 0.95      // 0-1, how confident in this memory
  }
)`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Query Memories" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const { query } = useMemory()

// Semantic search
const results = await query({
  query: 'What does the user prefer?',
  limit: 10
})

// Filter by type and scope
const preferences = await query({
  types: ['semantic'],
  scopes: ['user', 'global'],
  limit: 5
})

// Filter by user/thread/session
const userMemories = await query({
  userId: 'user_123',
  threadId: 'thread_abc',
  minConfidence: 0.7
})

// Results structure
results.forEach(result => {
  console.log(result.memory.content)  // The memory content
  console.log(result.score)           // Relevance score (0-1)
  console.log(result.memory.type)     // 'semantic' | 'episodic' | etc.
  console.log(result.memory.scope)    // 'global' | 'user' | etc.
})`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Update and Delete Memories" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const { updateMemory, deleteMemory, promoteMemory, compressMemory } = useMemory()

// Update memory content or metadata
await updateMemory('memory_id_123', {
  content: 'Updated: User now prefers light mode',
  metadata: { updatedAt: Date.now() }
})

// Delete a specific memory
await deleteMemory('memory_id_123')

// Promote memory to a higher scope (more persistent)
// e.g., from 'session' to 'user' scope
await promoteMemory('memory_id_456', 'user')

// Compress a memory to save tokens (summarize)
// ratio: 0.5 means compress to 50% of original size
await compressMemory('memory_id_789', 0.5)`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Get Memory Statistics" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const { getStats, getContext } = useMemory()

// Get overall statistics
const stats = getStats()
console.log({
  total: stats.total,              // Total memory count
  totalTokens: stats.totalTokens,  // Total tokens used
  byType: stats.byType,            // Count by type
  byScope: stats.byScope,          // Count by scope
  byPriority: stats.byPriority,    // Count by priority
  averageConfidence: stats.averageConfidence
})

// Get current memory context (for sending to AI)
const context = getContext()
console.log({
  messages: context.messages,
  summary: context.summary,
  totalTokens: context.totalTokens
})`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Subscribe to Memory Events" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`const { subscribe } = useMemory()

// Subscribe to memory events
useEffect(() => {
  const unsubscribe = subscribe('memory:add', (event) => {
    console.log('New memory:', event.memory)
    toast.success('Memory saved!')
  })

  return unsubscribe
}, [subscribe])

// Available events:
// - 'memory:add'     - When a new memory is added
// - 'memory:update'  - When a memory is updated
// - 'memory:delete'  - When a memory is deleted
// - 'memory:promote' - When a memory is promoted to higher scope
// - 'memory:compress' - When a memory is compressed`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Complete Example: Memory-Aware Chat" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { useState } from 'react'
import { MemoryProvider, useMemory, useClarityChat } from '@clarity-chat/react'

function MemoryAwareChat() {
  const { addMemory, query, getContext } = useMemory()
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat'
  })
  const [input, setInput] = useState('')

  const handleSend = async () => {
    if (!input.trim()) return

    // 1. Capture user message to memory
    await addMemory(input, 'episodic', 'session', {
      role: 'user',
      timestamp: Date.now()
    })

    // 2. Get relevant context for the AI
    const relevantMemories = await query({
      query: input,
      limit: 5,
      minConfidence: 0.6
    })

    // 3. Build enhanced system message with memory context
    const memoryContext = relevantMemories
      .map(r => r.memory.content)
      .join('\\n')

    // 4. Send to AI with context
    await append({
      role: 'user',
      content: input
    }, {
      options: {
        body: {
          memoryContext: memoryContext
        }
      }
    })

    setInput('')
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={\`p-3 rounded-lg \${
              msg.role === 'user'
                ? 'bg-brand-100 ml-auto max-w-[80%]'
                : 'bg-muted max-w-[80%]'
            }\`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="px-4 py-2 bg-brand-500 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000, storage: 'indexeddb' }}>
      <MemoryAwareChat />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        {/* Return Value */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Return Value</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Property</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">service</td>
                  <td className="p-3 font-mono text-sm">MemoryService | null</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Raw memory service instance (for advanced use)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">isInitialized</td>
                  <td className="p-3 font-mono text-sm">boolean</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Whether the memory service is ready to use
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">addMemory</td>
                  <td className="p-3 font-mono text-sm">(content, type, scope, metadata?, options?) =&gt; Promise&lt;MemoryItem&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Add a new memory entry
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">query</td>
                  <td className="p-3 font-mono text-sm">(query: MemoryQuery) =&gt; Promise&lt;MemorySearchResult[]&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Search and filter memories
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">updateMemory</td>
                  <td className="p-3 font-mono text-sm">(id, updates) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Update an existing memory
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">deleteMemory</td>
                  <td className="p-3 font-mono text-sm">(id) =&gt; Promise&lt;boolean&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Delete a memory by ID
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">promoteMemory</td>
                  <td className="p-3 font-mono text-sm">(id, targetScope) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Move memory to a higher scope
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">compressMemory</td>
                  <td className="p-3 font-mono text-sm">(id, ratio?) =&gt; Promise&lt;MemoryItem | null&gt;</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Compress/summarize a memory to save tokens
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">getStats</td>
                  <td className="p-3 font-mono text-sm">() =&gt; MemoryStats</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Get memory usage statistics
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">getContext</td>
                  <td className="p-3 font-mono text-sm">() =&gt; MemoryContext</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Get formatted context for AI consumption
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">subscribe</td>
                  <td className="p-3 font-mono text-sm">(event, handler) =&gt; () =&gt; void</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Subscribe to memory events, returns unsubscribe function
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* MemoryQuery Interface */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">MemoryQuery Interface</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Property</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">query</td>
                  <td className="p-3 font-mono text-sm">string</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Text query for semantic search
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">types</td>
                  <td className="p-3 font-mono text-sm">MemoryType[]</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Filter by memory types
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">scopes</td>
                  <td className="p-3 font-mono text-sm">MemoryScope[]</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Filter by memory scopes
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">limit</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Maximum results to return
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">minConfidence</td>
                  <td className="p-3 font-mono text-sm">number</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Minimum confidence threshold (0-1)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">userId</td>
                  <td className="p-3 font-mono text-sm">string</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Filter by user ID
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">threadId</td>
                  <td className="p-3 font-mono text-sm">string</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Filter by thread/conversation ID
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">sessionId</td>
                  <td className="p-3 font-mono text-sm">string</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Filter by session ID
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Related Hooks Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Related Memory Hooks</h2>
        <div className="grid gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useMemoryContext</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Safe version that returns null if no MemoryProvider is found (no error thrown).
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const memory = useMemoryContext()
if (memory) {
  await memory.addMemory('...', 'semantic', 'user')
}`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useMemoryQuery</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Declarative query with loading states and auto-refetch.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const { data, isLoading, error, refetch } = useMemoryQuery(
  { query: 'user preferences', limit: 5 },
  { refetchInterval: 30000 }
)`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useMemoryStats</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Memory statistics with optional auto-refresh interval.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const { stats, refresh } = useMemoryStats(5000) // Refresh every 5s
console.log(stats.total, stats.totalTokens)`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useMemoryEvents</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Subscribe to memory events with automatic cleanup.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`useMemoryEvents('memory:add', (event) => {
  console.log('New memory:', event.memory.content)
})`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useConversationMemory</h3>
            <p className="text-sm text-muted-foreground mb-2">
              High-level hook for conversation-specific memory operations.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const {
  captureMessage,
  capturePreference,
  getRelevantMemories,
  getRecentHistory
} = useConversationMemory({ userId, threadId })`}</code>
            </pre>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold text-brand-600 mb-2">useMemoryOptimization</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Memory-aware context optimization for efficient AI prompts.
            </p>
            <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
              <code>{`const { optimizedContext, isOptimizing } = useMemoryOptimization({
  systemPrompt: 'You are a helpful assistant...',
  includeSemanticMemory: true,
  includeEpisodicMemory: true
})`}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="border-t pt-8">
        <FeedbackWidget pageId="use-memory" />
      </section>
    </div>
  )
}
