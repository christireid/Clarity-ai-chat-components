import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: 'createMemoryStore | Clarity Chat',
  description:
    'Factory function for creating memory store instances. Use for non-React contexts or imperative memory configuration.',
}

const optionsProps: Prop[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable memory functionality.',
  },
  {
    name: 'strategy',
    type: '"sliding-window" | "semantic-chunks" | "vector-store"',
    default: '"sliding-window"',
    description: 'Memory management strategy to use.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    default: '8000',
    description: 'Maximum tokens to store in memory context.',
  },
  {
    name: 'scope',
    type: '"session" | "thread" | "global"',
    default: '"session"',
    description: 'Memory scope for retention and isolation.',
  },
  {
    name: 'service',
    type: 'MemoryService',
    description:
      'Custom MemoryService instance to use instead of creating one.',
  },
]

const returnProps: Prop[] = [
  {
    name: 'enabled',
    type: 'boolean',
    description: 'Whether memory is enabled.',
  },
  {
    name: 'service',
    type: 'MemoryService',
    description: 'The underlying memory service instance.',
  },
  {
    name: 'config',
    type: 'object',
    description: 'The resolved configuration object.',
  },
  {
    name: 'addMemory',
    type: '(content: string, type?: MemoryType, metadata?: Record<string, any>) => Promise<void>',
    description: 'Add a memory to the store.',
  },
  {
    name: 'query',
    type: '(query: string, limit?: number) => Promise<any[]>',
    description: 'Query memories by semantic similarity.',
  },
  {
    name: 'clear',
    type: '() => Promise<void>',
    description: 'Clear all memories in the current scope.',
  },
]

export default function CreateMemoryStorePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>createMemoryStore</h1>

      <p className="lead">
        Factory function that creates a memory store instance with sensible
        defaults. Use this when you need memory management outside of React
        components or want to configure it imperatively.
      </p>

      <Callout type="info">
        <p>
          For React components, use{' '}
          <Link href="/reference/components/memory-provider">
            MemoryProvider
          </Link>{' '}
          and{' '}
          <Link href="/reference/hooks/use-memory-context">
            useMemoryContext
          </Link>{' '}
          instead. <code>createMemoryStore</code> is for non-React contexts,
          server-side usage, or when you need to share a memory store across
          providers.
        </p>
      </Callout>

      <section className="my-12">
        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { createMemoryStore } from '@clarity-chat/react'
import type { CreateMemoryStoreOptions, MemoryStore } from '@clarity-chat/react'`}
          language="tsx"
        />
      </section>

      <section className="my-12">
        <h2 id="basic-usage">Basic Usage</h2>

        <p>Create a memory store and use it to store and query memories:</p>

        <EnhancedCodeBlock
          code={`import { createMemoryStore } from '@clarity-chat/react'

// Create a memory store with defaults
const memoryStore = createMemoryStore()

// Add memories
await memoryStore.addMemory('User prefers dark mode', 'episodic')
await memoryStore.addMemory('User is working on a React project', 'semantic')

// Query memories
const results = await memoryStore.query('What are user preferences?')
console.log(results)
// => [{ content: 'User prefers dark mode', type: 'episodic', ... }]

// Clear memories
await memoryStore.clear()`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="with-config">With Configuration</h2>

        <p>Configure memory strategy and token limits:</p>

        <EnhancedCodeBlock
          code={`import { createMemoryStore } from '@clarity-chat/react'

// Vector store for semantic search
const vectorMemory = createMemoryStore({
  strategy: 'vector-store',
  maxTokens: 16000,
  scope: 'global',
})

// Sliding window for recent context
const recentMemory = createMemoryStore({
  strategy: 'sliding-window',
  maxTokens: 4000,
  scope: 'session',
})

// Semantic chunks for topic-based grouping
const topicMemory = createMemoryStore({
  strategy: 'semantic-chunks',
  maxTokens: 8000,
})`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="with-provider">With React Provider</h2>

        <p>
          Share a memory store across components using{' '}
          <code>MemoryProvider</code>:
        </p>

        <EnhancedCodeBlock
          code={`import { createMemoryStore, MemoryProvider } from '@clarity-chat/react'

// Create shared memory store
const sharedMemory = createMemoryStore({
  strategy: 'vector-store',
  maxTokens: 10000,
})

function App() {
  return (
    <MemoryProvider service={sharedMemory.service}>
      <ChatInterface />
      <MemoryDebugPanel />
    </MemoryProvider>
  )
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="server-side">Server-Side Usage</h2>

        <p>Use memory store in API routes or server actions:</p>

        <EnhancedCodeBlock
          code={`// app/api/chat/route.ts
import { createMemoryStore } from '@clarity-chat/react'

// Create per-request memory store
export async function POST(request: Request) {
  const { messages, userId } = await request.json()

  // Create memory store for this conversation
  const memory = createMemoryStore({
    strategy: 'vector-store',
    maxTokens: 8000,
    scope: 'thread',
  })

  // Load previous context
  const context = await memory.query('conversation history', 5)

  // Process chat with memory context
  const response = await processChat(messages, context)

  // Store new memories
  await memory.addMemory(
    \`User: \${messages.at(-1)?.content}\`,
    'episodic',
    { userId }
  )

  return Response.json({ response })
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="memory-types">Memory Types</h2>

        <p>Different memory types for different use cases:</p>

        <EnhancedCodeBlock
          code={`const memory = createMemoryStore({ strategy: 'vector-store' })

// Episodic: Specific events or interactions
await memory.addMemory(
  'User asked about pricing on Dec 15, 2024',
  'episodic',
  { timestamp: Date.now(), category: 'pricing' }
)

// Semantic: General knowledge or facts
await memory.addMemory(
  'User is building a SaaS application',
  'semantic',
  { category: 'project' }
)

// Procedural: How-to knowledge
await memory.addMemory(
  'User prefers code examples in TypeScript',
  'procedural',
  { category: 'preferences' }
)`}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">episodic</h3>
            <p className="text-muted-foreground text-sm">
              Specific events, interactions, or moments in time. Best for
              conversation history.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">semantic</h3>
            <p className="text-muted-foreground text-sm">
              General knowledge, facts, and concepts. Best for user preferences
              and context.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">procedural</h3>
            <p className="text-muted-foreground text-sm">
              How-to knowledge and learned behaviors. Best for personalization.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="scopes">Memory Scopes</h2>

        <p>Control memory isolation and retention:</p>

        <EnhancedCodeBlock
          code={`// Session scope: Cleared when browser closes (default)
const sessionMemory = createMemoryStore({ scope: 'session' })

// Thread scope: Persists across sessions for specific conversation
const threadMemory = createMemoryStore({ scope: 'thread' })

// Global scope: Persists indefinitely across all conversations
const globalMemory = createMemoryStore({ scope: 'global' })`}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Default Retention Policies</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>session</strong>: 24 hours (86,400 seconds)
            </li>
            <li>
              <strong>thread</strong>: 7 days (604,800 seconds)
            </li>
            <li>
              <strong>global</strong>: Indefinite (0 = no expiration)
            </li>
          </ul>
        </div>
      </section>

      <section className="my-12">
        <h2 id="options">Options</h2>
        <PropsTable props={optionsProps} />
      </section>

      <section className="my-12">
        <h2 id="return-value">Return Value</h2>
        <PropsTable props={returnProps} />
      </section>

      <section className="my-12">
        <h2 id="type-definitions">Type Definitions</h2>

        <EnhancedCodeBlock
          code={`interface CreateMemoryStoreOptions {
  enabled?: boolean
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  maxTokens?: number
  scope?: 'session' | 'thread' | 'global'
  service?: MemoryService
}

interface MemoryStore {
  enabled: boolean
  service: MemoryService
  config: {
    enabled: boolean
    strategy?: CreateMemoryStoreOptions['strategy']
    maxTokens?: number
    scope?: MemoryScope
  }
  addMemory: (
    content: string,
    type?: MemoryType,
    metadata?: Record<string, any>
  ) => Promise<void>
  query: (query: string, limit?: number) => Promise<any[]>
  clear: () => Promise<void>
}

type MemoryType = 'episodic' | 'semantic' | 'procedural'
type MemoryScope = 'session' | 'thread' | 'global'`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="best-practices">Best Practices</h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Use appropriate scopes</strong>: Use session for temporary
              context, thread for conversation persistence, global for user
              preferences.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Add metadata</strong>: Include timestamps, categories, and
              user IDs for better organization and filtering.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Set reasonable token limits</strong>: Balance context
              richness with API costs. 8000-16000 tokens is typical.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong>Don't store sensitive data</strong>: Avoid storing PII or
              credentials in memory. Use secure storage for sensitive
              information.
            </div>
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 id="related">Related</h2>

        <ul>
          <li>
            <Link href="/reference/components/memory-provider">
              MemoryProvider
            </Link>{' '}
            - React context provider for memory
          </li>
          <li>
            <Link href="/reference/hooks/use-memory-context">
              useMemoryContext
            </Link>{' '}
            - React hook for memory access
          </li>
          <li>
            <Link href="/reference/components/clarity-chat-presets">
              ClarityChatPresets
            </Link>{' '}
            - Pre-configured chat with memory
          </li>
          <li>
            <Link href="/guides/memory">Memory Guide</Link> - Understanding
            memory strategies
          </li>
        </ul>
      </section>

      <Pagination
        previous={{
          title: 'Utilities',
          href: '/reference/utilities',
        }}
        next={{
          title: 'Types',
          href: '/reference/api/types',
        }}
      />
    </>
  )
}
