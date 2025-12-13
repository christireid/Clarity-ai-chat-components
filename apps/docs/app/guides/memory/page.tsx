'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Pagination } from '@/components/Navigation/Pagination'


export default function MemoryGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">Memory System Deep Dive</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive guide to Clarity Chat's memory system, including strategies, providers, types, scopes, and best practices.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            Clarity Chat's memory system enables your AI assistant to remember information across conversations,
            maintain context, and provide personalized responses. The system supports multiple memory strategies,
            scopes, and types to fit different use cases.
          </p>
          <p className="mb-4">
            The memory system is built on a hybrid architecture with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li><strong>Episodic Memory:</strong> Stores specific events with temporal context</li>
            <li><strong>Semantic Memory:</strong> Stores compressed, generalized knowledge</li>
            <li><strong>Short-term Memory:</strong> Recent conversation context</li>
            <li><strong>Long-term Memory:</strong> Persistent user preferences and facts</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Memory Strategies</h2>
          <p className="mb-4">
            Clarity Chat supports three memory strategies, each optimized for different use cases:
          </p>

          <h3 className="text-2xl font-semibold mb-3">1. Sliding Window</h3>
          <p className="mb-4">
            The simplest strategy that keeps only the most recent messages within a token budget.
            Best for short conversations and when you need predictable token usage.
          </p>
          <EnhancedCodeBlock
            code={`import { ClarityChat } from '@clarity-chat/react'

function SlidingWindowChat() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'sliding-window',
        maxTokens: 4000,
      }}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />
          <Callout type="info">
            <p>
              <strong>Use when:</strong> You need simple, predictable memory management with low overhead.
              Best for short conversations and when token budget is tight.
            </p>
          </Callout>

          <h3 className="text-2xl font-semibold mb-3 mt-8">2. Semantic Chunks</h3>
          <p className="mb-4">
            Groups related messages into semantic chunks and keeps the most relevant chunks.
            Better context retention than sliding window while staying within token limits.
          </p>
          <EnhancedCodeBlock
            code={`import { ClarityChat } from '@clarity-chat/react'

function SemanticChunksChat() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'semantic-chunks',
        maxTokens: 8000,
      }}
    />
  )
}`}
            language="tsx"
            showLineNumbers
          />
          <Callout type="info">
            <p>
              <strong>Use when:</strong> You need better context retention than sliding window but don't want
              the complexity of a vector store. Good balance between simplicity and effectiveness.
            </p>
          </Callout>

          <h3 className="text-2xl font-semibold mb-3 mt-8">3. Vector Store</h3>
          <p className="mb-4">
            Uses semantic search to retrieve the most relevant memories based on query similarity.
            Best for long conversations and when you need to recall information from earlier in the conversation.
          </p>
          <EnhancedCodeBlock
            code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

function VectorStoreChat() {
  return (
    <MemoryProvider
      config={{ maxTokens: 10000 }}
      vectorStore={myVectorStore} // Your vector store instance
    >
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 8000,
        }}
      />
    </MemoryProvider>
  )
}`}
            language="tsx"
            showLineNumbers
          />
          <Callout type="info">
            <p>
              <strong>Use when:</strong> You need the best context retention for long conversations.
              Requires a vector store but provides the most intelligent memory retrieval.
            </p>
          </Callout>

          <h3 className="text-2xl font-semibold mb-3 mt-8">Strategy Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">Strategy</th>
                  <th className="border border-border p-2 text-left">Complexity</th>
                  <th className="border border-border p-2 text-left">Context Retention</th>
                  <th className="border border-border p-2 text-left">Token Efficiency</th>
                  <th className="border border-border p-2 text-left">Best For</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2"><code>sliding-window</code></td>
                  <td className="border border-border p-2">Low</td>
                  <td className="border border-border p-2">Recent only</td>
                  <td className="border border-border p-2">High</td>
                  <td className="border border-border p-2">Short conversations</td>
                </tr>
                <tr>
                  <td className="border border-border p-2"><code>semantic-chunks</code></td>
                  <td className="border border-border p-2">Medium</td>
                  <td className="border border-border p-2">Good</td>
                  <td className="border border-border p-2">Medium</td>
                  <td className="border border-border p-2">Medium conversations</td>
                </tr>
                <tr>
                  <td className="border border-border p-2"><code>vector-store</code></td>
                  <td className="border border-border p-2">High</td>
                  <td className="border border-border p-2">Excellent</td>
                  <td className="border border-border p-2">High</td>
                  <td className="border border-border p-2">Long conversations</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">MemoryProvider</h2>
          <p className="mb-4">
            The <code>MemoryProvider</code> component provides memory context to all child components.
            Wrap your app or chat component with this provider to enable memory functionality.
          </p>

          <h3 className="text-2xl font-semibold mb-3">Basic Usage</h3>
          <EnhancedCodeBlock
            code={`import { MemoryProvider, ClarityChat } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider
      config={{
        maxTokens: 10000,
      }}
    >
      <ClarityChat
        api="/api/chat"
        memory={{ enabled: true, strategy: 'vector-store' }}
      />
    </MemoryProvider>
  )
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">With Vector Store</h3>
          <EnhancedCodeBlock
            code={`import { MemoryProvider, ClarityChat } from '@clarity-chat/react'
import { createVectorStore } from '@clarity-chat/react'

function App() {
  const vectorStore = createVectorStore({
    provider: 'pinecone', // or 'weaviate', 'qdrant', etc.
    apiKey: process.env.VECTOR_STORE_API_KEY,
  })

  return (
    <MemoryProvider
      config={{ maxTokens: 10000 }}
      vectorStore={vectorStore}
    >
      <ClarityChat
        api="/api/chat"
        memory={{ enabled: true, strategy: 'vector-store' }}
      />
    </MemoryProvider>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Memory Types</h2>
          <p className="mb-4">
            Memory items are categorized by type, which determines how they're processed and retrieved:
          </p>

          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              <strong>episodic:</strong> Specific events with temporal context (e.g., "User asked about weather on Monday")
            </li>
            <li>
              <strong>semantic:</strong> Compressed, generalized knowledge (e.g., "User prefers dark mode")
            </li>
            <li>
              <strong>preference:</strong> User preferences and settings
            </li>
            <li>
              <strong>fact:</strong> Factual information about the user or domain
            </li>
            <li>
              <strong>behavior:</strong> User behavior patterns and habits
            </li>
          </ul>

          <EnhancedCodeBlock
            code={`import { useMemoryContext } from '@clarity-chat/react'

function MemoryExample() {
  const memory = useMemoryContext()

  const addPreference = async () => {
    await memory?.addMemory(
      'User prefers dark mode',
      'preference',
      'global',
      { category: 'ui' }
    )
  }

  const addFact = async () => {
    await memory?.addMemory(
      'User lives in San Francisco',
      'fact',
      'global',
      { location: 'San Francisco' }
    )
  }

  return (
    <div>
      <button onClick={addPreference}>Save Preference</button>
      <button onClick={addFact}>Save Fact</button>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Memory Scopes</h2>
          <p className="mb-4">
            Memory scopes define the lifetime and visibility of memory items:
          </p>

          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              <strong>session:</strong> Lives only for the current session (cleared on page refresh)
            </li>
            <li>
              <strong>thread:</strong> Persists for a specific conversation thread
            </li>
            <li>
              <strong>global:</strong> Persists across all conversations for the user
            </li>
            <li>
              <strong>user:</strong> User-specific memories (requires user authentication)
            </li>
          </ul>

          <EnhancedCodeBlock
            code={`import { useMemoryContext } from '@clarity-chat/react'

function ScopeExample() {
  const memory = useMemoryContext()

  // Session-scoped: cleared on refresh
  const addSessionMemory = async () => {
    await memory?.addMemory(
      'Current conversation topic',
      'episodic',
      'session'
    )
  }

  // Thread-scoped: persists for this conversation
  const addThreadMemory = async () => {
    await memory?.addMemory(
      'Conversation context',
      'episodic',
      'thread',
      { threadId: 'conv-123' }
    )
  }

  // Global: persists across all conversations
  const addGlobalMemory = async () => {
    await memory?.addMemory(
      'User preference',
      'preference',
      'global'
    )
  }

  return (
    <div>
      <button onClick={addSessionMemory}>Add Session Memory</button>
      <button onClick={addThreadMemory}>Add Thread Memory</button>
      <button onClick={addGlobalMemory}>Add Global Memory</button>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Using Memory with useClarityChat</h2>
          <p className="mb-4">
            The <code>useClarityChat</code> hook automatically integrates with the memory system when enabled:
          </p>

          <EnhancedCodeBlock
            code={`import { useClarityChat, MemoryProvider } from '@clarity-chat/react'

function ChatWithMemory() {
  const {
    messages,
    append,
    isLoading,
    memoryInfo,
  } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
      maxTokens: 8000,
    },
  })

  return (
    <div>
      <div>
        {messages.map((msg) => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
      <div>
        <p>Memory: {memoryInfo?.enabled ? 'Enabled' : 'Disabled'}</p>
        <p>Strategy: {memoryInfo?.strategy}</p>
        <p>Memories: {memoryInfo?.memoryCount}</p>
      </div>
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
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Querying Memories</h2>
          <p className="mb-4">
            Use <code>useMemoryContext</code> to query memories by relevance, type, scope, or metadata:
          </p>

          <EnhancedCodeBlock
            code={`import { useMemoryContext } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function MemoryQueryExample() {
  const memory = useMemoryContext()
  const [results, setResults] = useState([])

  const searchMemories = async (query: string) => {
    if (!memory) return

    const results = await memory.query({
      query,
      types: ['preference', 'fact'],
      scopes: ['global'],
      limit: 5,
      minConfidence: 0.7,
    })

    setResults(results)
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search memories..."
        onChange={(e) => searchMemories(e.target.value)}
      />
      <div>
        {results.map((result) => (
          <div key={result.memory.id}>
            <p>{result.memory.content}</p>
            <p>Relevance: {(result.relevance * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Memory Operations</h2>
          <p className="mb-4">
            The memory context provides several operations for managing memories:
          </p>

          <h3 className="text-2xl font-semibold mb-3">Adding Memories</h3>
          <EnhancedCodeBlock
            code={`const memory = useMemoryContext()

// Add a memory with options
const memoryItem = await memory?.addMemory(
  'User prefers dark mode',
  'preference',
  'global',
  { category: 'ui' },
  {
    priority: 'high',
    confidence: 0.9,
  }
)`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Updating Memories</h3>
          <EnhancedCodeBlock
            code={`const memory = useMemoryContext()

// Update an existing memory
const updated = await memory?.updateMemory(memoryId, {
  content: 'User prefers dark mode and large fonts',
  confidence: 0.95,
})`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Deleting Memories</h3>
          <EnhancedCodeBlock
            code={`const memory = useMemoryContext()

// Delete a memory
const deleted = await memory?.deleteMemory(memoryId)
if (deleted) {
  console.log('Memory deleted')
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Promoting Memories</h3>
          <EnhancedCodeBlock
            code={`const memory = useMemoryContext()

// Promote a session memory to global
const promoted = await memory?.promoteMemory(memoryId, 'global')
if (promoted) {
  console.log('Memory promoted to global scope')
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">Compressing Memories</h3>
          <EnhancedCodeBlock
            code={`const memory = useMemoryContext()

// Compress a memory to save tokens
const compressed = await memory?.compressMemory(memoryId, 0.5) // 50% compression
if (compressed) {
  console.log('Memory compressed')
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Memory Statistics</h2>
          <p className="mb-4">
            Get statistics about memory usage:
          </p>

          <EnhancedCodeBlock
            code={`import { useMemoryContext } from '@clarity-chat/react'

function MemoryStats() {
  const memory = useMemoryContext()
  const stats = memory?.getStats()

  return (
    <div>
      <p>Total Memories: {stats?.totalMemories}</p>
      <p>By Scope:</p>
      <ul>
        <li>Session: {stats?.byScope?.session}</li>
        <li>Thread: {stats?.byScope?.thread}</li>
        <li>Global: {stats?.byScope?.global}</li>
      </ul>
      <p>By Type:</p>
      <ul>
        <li>Episodic: {stats?.byType?.episodic}</li>
        <li>Semantic: {stats?.byType?.semantic}</li>
        <li>Preference: {stats?.byType?.preference}</li>
      </ul>
      <p>Total Tokens: {stats?.totalTokens}</p>
      <p>Average Confidence: {(stats?.averageConfidence * 100).toFixed(1)}%</p>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Choose the Right Strategy</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use <code>sliding-window</code> for short conversations and tight token budgets</li>
            <li>Use <code>semantic-chunks</code> for medium conversations needing better context</li>
            <li>Use <code>vector-store</code> for long conversations and best context retention</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">2. Set Appropriate Token Limits</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Reserve tokens for the AI response (typically 20-30% of context window)</li>
            <li>Set <code>maxTokens</code> based on your model's context window</li>
            <li>Monitor token usage with <code>memoryInfo</code> from <code>useClarityChat</code></li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">3. Use Appropriate Scopes</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use <code>session</code> for temporary, conversation-specific information</li>
            <li>Use <code>thread</code> for conversation-specific context</li>
            <li>Use <code>global</code> for user preferences and persistent facts</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Set Confidence Scores</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Set high confidence (0.8+) for verified facts and preferences</li>
            <li>Set medium confidence (0.5-0.8) for inferred information</li>
            <li>Set low confidence (&lt;0.5) for uncertain information</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">5. Compress Old Memories</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Compress episodic memories that are no longer actively used</li>
            <li>Use <code>compressMemory</code> to reduce token usage</li>
            <li>Keep original content if you need to decompress later</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">6. Query Efficiently</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Use specific queries rather than broad searches</li>
            <li>Filter by type, scope, and metadata to narrow results</li>
            <li>Set <code>minConfidence</code> to filter low-quality memories</li>
            <li>Use <code>limit</code> to control result count</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Troubleshooting</h2>

          <h3 className="text-2xl font-semibold mb-3">Memory Not Working</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Ensure <code>MemoryProvider</code> wraps your chat component</li>
            <li>Check that <code>memory.enabled</code> is <code>true</code></li>
            <li>Verify <code>memoryInfo</code> shows memory is enabled</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">Vector Store Not Working</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Ensure vector store is provided to <code>MemoryProvider</code></li>
            <li>Check vector store API key and configuration</li>
            <li>Verify vector store connection with health check</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">Token Budget Exceeded</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Reduce <code>maxTokens</code> in memory configuration</li>
            <li>Compress old memories to free up tokens</li>
            <li>Use a more efficient memory strategy</li>
            <li>Delete low-priority memories</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a href="/reference/components/clarity-chat" className="text-primary underline">
                ClarityChat Component
              </a> – Component with memory support
            </li>
            <li>
              <a href="/reference/hooks/use-clarity-chat" className="text-primary underline">
                useClarityChat Hook
              </a> – Hook with memory integration
            </li>
            <li>
              <a href="/reference/hooks/use-memory-context" className="text-primary underline">
                useMemoryContext Hook
              </a> – Direct memory operations
            </li>
            <li>
              <a href="/guides/token-optimization" className="text-primary underline">
                Token Optimization Guide
              </a> – Optimize memory token usage
            </li>
          </ul>
        </section>

        <Pagination
          previous={{
            title: 'Streaming Guide',
            href: '/guides/streaming',
          }}
          next={{
            title: 'Token Optimization Guide',
            href: '/guides/token-optimization',
          }}
        />
      </div>
    </>
  )
}
