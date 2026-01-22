'use client'

import Link from 'next/link'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function MemoryProviderPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
          <span>Top-Level Provider</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">MemoryProvider</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Context provider that enables AI memory capabilities across your application.
          Wrap your app or chat component with this provider to enable persistent context,
          conversation history, and intelligent memory retrieval.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
          <strong>Domain:</strong> Memory & Context
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12 p-6 bg-muted rounded-xl">
        <h2 className="text-xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm mb-4">
          <code>{`import { MemoryProvider, ClarityChat, createDefaultMemoryConfig } from '@clarity-chat/react'

// Use the helper to create a default config
const memoryConfig = createDefaultMemoryConfig({
  maxContextWindow: 128000,  // Adjust based on your model
  storage: 'indexeddb'       // Persist across sessions
})

function App() {
  return (
    <MemoryProvider config={memoryConfig}>
      <ClarityChat
        api="/api/chat"
        memory={{ enabled: true }}
      />
    </MemoryProvider>
  )
}`}</code>
        </pre>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
            Persistent Memory
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
            Vector Search
          </span>
          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded">
            Multi-Scope
          </span>
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 rounded">
            IndexedDB Storage
          </span>
        </div>
      </section>

      {/* Why MemoryProvider */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Why MemoryProvider?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-700 dark:text-green-300 mb-3">
              What It Solves
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Context loss between sessions and page refreshes
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Token limits causing important context to be dropped
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                User preferences forgotten across conversations
              </li>
              <li className="flex gap-2">
                <span className="text-green-500">&#10003;</span>
                Expensive repeated explanations to the AI
              </li>
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
              Key Benefits
            </h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Automatic importance scoring prioritizes key information
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Multiple storage backends (memory, IndexedDB)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Scoped memory (global, user, thread, session)
              </li>
              <li className="flex gap-2">
                <span className="text-blue-500">&#9733;</span>
                Semantic search with embeddings
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Basic Usage Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Basic Usage</h2>

        <CollapsibleSection title="Minimal Setup" defaultOpen={true}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, ClarityChat, createDefaultMemoryConfig } from '@clarity-chat/react'

const memoryConfig = createDefaultMemoryConfig({
  maxContextWindow: 128000
})

function ChatApp() {
  return (
    <MemoryProvider config={memoryConfig}>
      <ClarityChat
        api="/api/chat"
        memory={{ enabled: true }}
      />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="With IndexedDB Persistence" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, ClarityChat } from '@clarity-chat/react'

// Full config for persistent memory across sessions
const memoryConfig = {
  tokenOptimization: {
    maxContextWindow: 128000,
    allocation: {
      systemPrompt: 0.15,
      userPreferences: 0.10,
      recentContext: 0.30,
      semanticMemory: 0.20,
      episodicMemory: 0.15,
      responseReserve: 0.10
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true
  },
  persistence: {
    useVectorStore: false,
    useCache: true,
    cacheTTL: 3600,
    useDatabase: false,
    batchSize: 100
  },
  enableAutoSummarization: true,
  enableAutoCleanup: true,
  retentionPolicy: {
    shortTerm: 300,
    session: 86400,
    thread: 604800,
    global: 0,
    user: 0
  },
  storage: {
    type: 'indexeddb',
    options: { dbName: 'clarity-chat-memory' }
  }
}

function PersistentChatApp() {
  return (
    <MemoryProvider config={memoryConfig}>
      <ClarityChat api="/api/chat" memory={{ enabled: true }} />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="With Vector Store (Semantic Search)" defaultOpen={false}>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, ClarityChat, createDefaultMemoryConfig } from '@clarity-chat/react'
import { createPineconeStore } from '@clarity-chat/react/vector-stores'

const vectorStore = createPineconeStore({
  apiKey: process.env.PINECONE_API_KEY,
  index: 'chat-memory'
})

const memoryConfig = createDefaultMemoryConfig({
  maxContextWindow: 128000,
  useVectorStore: true,
  vectorStoreNamespace: 'chat-embeddings'
})

function SemanticMemoryApp() {
  return (
    <MemoryProvider config={memoryConfig} vectorStore={vectorStore}>
      <ClarityChat api="/api/chat" memory={{ enabled: true }} />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* Advanced Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Advanced Examples</h2>

        <CollapsibleSection title="Custom Memory Operations" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Access memory operations directly with the useMemory hook.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, useMemory } from '@clarity-chat/react'

function ChatWithMemory() {
  const {
    addMemory,
    query,
    getStats,
    deleteMemory,
    promoteMemory
  } = useMemory()

  // Store user preferences persistently
  const savePreference = async (key: string, value: string) => {
    await addMemory(
      \`User preference: \${key} = \${value}\`,
      'semantic',    // Memory type
      'user',        // Scope (persists for this user)
      { preferenceKey: key, preferenceValue: value },
      { priority: 'high', confidence: 0.95 }
    )
  }

  // Search memory semantically
  const findRelated = async (topic: string) => {
    const results = await query({
      query: topic,
      limit: 5,
      minConfidence: 0.6
    })
    return results.map(r => r.memory.content)
  }

  // Promote important memory to permanent storage
  const makePermament = async (memoryId: string) => {
    await promoteMemory(memoryId, 'global')
  }

  // View memory statistics
  const stats = getStats()
  console.log(\`Total memories: \${stats.total}, Tokens: \${stats.totalTokens}\`)

  return (
    <div>
      <button onClick={() => savePreference('theme', 'dark')}>
        Remember Dark Mode
      </button>
      <p>Memory entries: {stats.total}</p>
    </div>
  )
}

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatWithMemory />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Conversation Memory with User Context" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use useConversationMemory for high-level conversation tracking.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, useConversationMemory } from '@clarity-chat/react'

function ConversationChat({ userId, threadId }) {
  const {
    captureMessage,
    capturePreference,
    getRelevantMemories,
    getRecentHistory,
    context
  } = useConversationMemory({
    userId,
    threadId,
    sessionId: crypto.randomUUID()
  })

  // Auto-capture messages for context
  const handleUserMessage = async (content: string) => {
    await captureMessage(content, 'user', {
      timestamp: Date.now(),
      sentiment: analyzeSentiment(content)
    })
  }

  // Get relevant context before sending to AI
  const getAIContext = async (userQuery: string) => {
    const relevant = await getRelevantMemories(userQuery, 10)
    const history = await getRecentHistory(5)

    return {
      relevantContext: relevant.map(r => r.content),
      recentMessages: history.map(r => r.memory.content)
    }
  }

  return (
    <ChatUI
      onMessage={handleUserMessage}
      getContext={getAIContext}
    />
  )
}

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 15000, storage: 'indexeddb' }}>
      <ConversationChat userId="user_123" threadId="thread_abc" />
    </MemoryProvider>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Memory Events and Real-time Updates" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Subscribe to memory events for real-time UI updates.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import {
  MemoryProvider,
  useMemoryEvents,
  useMemoryStats
} from '@clarity-chat/react'

function MemoryMonitor() {
  const { stats, refresh } = useMemoryStats(5000) // Refresh every 5s

  // Subscribe to memory add events
  useMemoryEvents('memory:add', (event) => {
    console.log('New memory added:', event.memory.content)
    toast.success('Memory captured!')
  })

  // Subscribe to memory delete events
  useMemoryEvents('memory:delete', (event) => {
    console.log('Memory removed:', event.memoryId)
  })

  return (
    <div className="p-4 bg-muted rounded-lg">
      <h3 className="font-semibold mb-2">Memory Stats</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-muted-foreground">Total Memories:</span>
          <span className="ml-2 font-mono">{stats.total}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Total Tokens:</span>
          <span className="ml-2 font-mono">{stats.totalTokens}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Avg Confidence:</span>
          <span className="ml-2 font-mono">
            {(stats.averageConfidence * 100).toFixed(1)}%
          </span>
        </div>
        <div>
          <button
            onClick={refresh}
            className="text-brand-500 hover:underline"
          >
            Refresh Stats
          </button>
        </div>
      </div>
    </div>
  )
}`}</code>
          </pre>
        </CollapsibleSection>

        <CollapsibleSection title="Memory Query with Loading States" defaultOpen={false}>
          <p className="text-muted-foreground mb-4">
            Use useMemoryQuery for automatic loading and error states.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`import { MemoryProvider, useMemoryQuery } from '@clarity-chat/react'

function MemorySearch({ searchTerm }) {
  const { data, isLoading, error, refetch } = useMemoryQuery(
    {
      query: searchTerm,
      limit: 10,
      types: ['semantic', 'episodic'],
      minConfidence: 0.5
    },
    {
      enabled: searchTerm.length > 2,  // Only search if 3+ chars
      refetchInterval: 30000           // Auto-refresh every 30s
    }
  )

  if (isLoading) {
    return <div className="animate-pulse">Searching memories...</div>
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error.message}
        <button onClick={refetch}>Retry</button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Found {data.length} relevant memories
      </p>
      {data.map((result) => (
        <div
          key={result.memory.id}
          className="p-3 bg-muted rounded-lg"
        >
          <p className="text-sm">{result.memory.content}</p>
          <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
            <span>Score: {(result.score * 100).toFixed(0)}%</span>
            <span>Type: {result.memory.type}</span>
          </div>
        </div>
      ))}
    </div>
  )
}`}</code>
          </pre>
        </CollapsibleSection>
      </section>

      {/* API Reference */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">API Reference</h2>

        {/* Props */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Props</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Prop</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Default</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">config</td>
                  <td className="p-3 font-mono text-sm">MemoryServiceConfig</td>
                  <td className="p-3 text-muted-foreground">Required</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Memory service configuration object
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">vectorStore</td>
                  <td className="p-3 font-mono text-sm">VectorStore</td>
                  <td className="p-3 text-muted-foreground">undefined</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Optional vector store for semantic search (Pinecone, Weaviate, etc.)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">embeddings</td>
                  <td className="p-3 font-mono text-sm">EmbeddingProvider</td>
                  <td className="p-3 text-muted-foreground">undefined</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Optional embedding provider (OpenAI, Cohere, etc.)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">autoStart</td>
                  <td className="p-3 font-mono text-sm">boolean</td>
                  <td className="p-3 text-muted-foreground">true</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Whether to auto-initialize the memory service on mount
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">children</td>
                  <td className="p-3 font-mono text-sm">React.ReactNode</td>
                  <td className="p-3 text-muted-foreground">Required</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Child components that will have access to memory context
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Config Options */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">MemoryServiceConfig</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Full configuration structure for MemoryProvider.
          </p>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{`const memoryConfig: MemoryServiceConfig = {
  // Token optimization settings
  tokenOptimization: {
    maxContextWindow: 128000,      // Max tokens in context
    allocation: {
      systemPrompt: 0.15,          // 15% for system prompt
      userPreferences: 0.10,       // 10% for preferences
      recentContext: 0.30,         // 30% for recent messages
      semanticMemory: 0.20,        // 20% for semantic search results
      episodicMemory: 0.15,        // 15% for conversation events
      responseReserve: 0.10        // 10% reserved for AI response
    },
    dynamicAllocation: true,       // Adjust allocations based on context
    enableCompression: true,       // Compress old memories
    compressionRatio: 0.5,         // Target 50% compression
    enableChunking: true,          // Enable semantic chunking
    chunkSize: 512,                // Tokens per chunk
    chunkOverlap: 50               // Overlap between chunks
  },

  // Storage persistence settings
  persistence: {
    useVectorStore: false,         // Use vector store for semantic search
    vectorStoreNamespace: 'chat',  // Namespace for vectors
    useCache: true,                // Enable cache layer
    cacheTTL: 3600,                // Cache TTL in seconds (1 hour)
    useDatabase: false,            // Use database persistence
    batchSize: 100                 // Batch size for operations
  },

  // Auto-summarization
  enableAutoSummarization: true,
  summarizationInterval: 300000,   // Every 5 minutes

  // Auto-cleanup of expired memories
  enableAutoCleanup: true,
  cleanupInterval: 600000,         // Every 10 minutes

  // Memory retention policy (TTL in seconds)
  retentionPolicy: {
    shortTerm: 300,                // 5 minutes
    session: 86400,                // 24 hours
    thread: 604800,                // 7 days
    global: 0,                     // Never expires
    user: 0                        // Never expires
  },

  // Optional: storage adapter
  storage: {
    type: 'indexeddb',             // 'memory' | 'file' | 'indexeddb'
    options: { dbName: 'clarity-memory' }
  },

  // Optional: debug settings
  debug: false,
  logLevel: 'warn'
}`}</code>
          </pre>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Option</th>
                  <th className="text-left p-3 font-semibold">Type</th>
                  <th className="text-left p-3 font-semibold">Required</th>
                  <th className="text-left p-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">tokenOptimization</td>
                  <td className="p-3 font-mono text-sm">TokenOptimizationConfig</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Token budget and allocation settings
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">persistence</td>
                  <td className="p-3 font-mono text-sm">MemoryPersistenceOptions</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Storage and caching configuration
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">enableAutoSummarization</td>
                  <td className="p-3 font-mono text-sm">boolean</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Enable automatic memory summarization
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">enableAutoCleanup</td>
                  <td className="p-3 font-mono text-sm">boolean</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Enable automatic cleanup of expired memories
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">retentionPolicy</td>
                  <td className="p-3 font-mono text-sm">RetentionPolicy</td>
                  <td className="p-3 text-muted-foreground">Yes</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    TTL settings for each memory scope (in seconds)
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">storage</td>
                  <td className="p-3 font-mono text-sm">StorageConfig</td>
                  <td className="p-3 text-muted-foreground">No</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Storage adapter: &apos;memory&apos;, &apos;file&apos;, or &apos;indexeddb&apos;
                  </td>
                </tr>
                <tr className="border-b border-border">
                  <td className="p-3 font-mono text-sm text-brand-600">decay</td>
                  <td className="p-3 font-mono text-sm">DecayConfig</td>
                  <td className="p-3 text-muted-foreground">No</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Intelligent memory decay/forgetting settings
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Memory Types & Scopes */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Memory Types and Scopes</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Memory Types</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="text-brand-600">semantic</code> - Facts, preferences, knowledge
                </li>
                <li>
                  <code className="text-brand-600">episodic</code> - Conversation events, messages
                </li>
                <li>
                  <code className="text-brand-600">procedural</code> - Learned patterns, behaviors
                </li>
                <li>
                  <code className="text-brand-600">short-term</code> - Temporary, current context
                </li>
                <li>
                  <code className="text-brand-600">profile</code> - User profile information
                </li>
              </ul>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-3">Memory Scopes</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <code className="text-brand-600">global</code> - Shared across all users
                </li>
                <li>
                  <code className="text-brand-600">user</code> - Per-user preferences
                </li>
                <li>
                  <code className="text-brand-600">thread</code> - Per-conversation
                </li>
                <li>
                  <code className="text-brand-600">session</code> - Current session only
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Hooks */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Related Hooks</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-memory"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">useMemory</h3>
            <p className="text-sm text-muted-foreground">
              Core hook for all memory operations
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-memory-query"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">useMemoryQuery</h3>
            <p className="text-sm text-muted-foreground">
              Query memories with loading states
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-conversation-memory"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">useConversationMemory</h3>
            <p className="text-sm text-muted-foreground">
              High-level conversation context
            </p>
          </Link>
          <Link
            href="/reference/hooks/use-memory-stats"
            className="block p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <h3 className="font-semibold mb-1">useMemoryStats</h3>
            <p className="text-sm text-muted-foreground">
              Memory statistics with auto-refresh
            </p>
          </Link>
        </div>
      </section>

      {/* Feedback */}
      <section className="border-t pt-8">
        <FeedbackWidget pageId="memory-provider" />
      </section>
    </div>
  )
}
