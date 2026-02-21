'use client'

/**
 * Memory Hooks - API Reference Documentation
 *
 * Documentation for useMemoryStore, useMemoryContext, and related memory hooks.
 * Hooks for conversation memory, context management, and persistence.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Brain,
  Database,
  History,
  Shield,
  Search,
  Layers,
  AlertTriangle,
  Settings,
  Save,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { durations } from '@/lib/animations'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodeBlock } from '@/components/Docs/CodeBlock'

// ISR Configuration
export const revalidate = 3600

// ============================================================================
// Copy Button Component
// ============================================================================

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'p-2 rounded-md hover:bg-muted/50 transition-colors',
        'text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="w-4 h-4 text-green-500" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  )
}

// ============================================================================
// Props/Return Table Components
// ============================================================================

interface PropDefinition {
  name: string
  type: string
  default?: string
  required?: boolean
  description: string
  deprecated?: boolean
  deprecatedMessage?: string
}

function PropsTable({
  props,
  title,
}: {
  props: PropDefinition[]
  title?: string
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      {title && (
        <div className="px-4 py-3 bg-muted/30 border-b border-border/50">
          <h4 className="font-semibold text-foreground">{title}</h4>
        </div>
      )}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/50 bg-muted/20">
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Name
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Type
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Default
            </th>
            <th className="px-4 py-3 text-left font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, index) => (
            <tr
              key={prop.name}
              className={cn(
                'border-b border-border/30 last:border-b-0',
                index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10',
                prop.deprecated && 'opacity-60'
              )}
            >
              <td className="px-4 py-3 font-mono text-sm">
                <span
                  className={cn(
                    'text-brand-600 dark:text-brand-400',
                    prop.deprecated && 'line-through'
                  )}
                >
                  {prop.name}
                </span>
                {prop.required && (
                  <span className="ml-1 text-red-500" title="Required">
                    *
                  </span>
                )}
                {prop.deprecated && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded">
                    deprecated
                  </span>
                )}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground max-w-[200px] break-words">
                {prop.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                {prop.default || '-'}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {prop.description}
                {prop.deprecatedMessage && (
                  <span className="block mt-1 text-xs text-amber-600 dark:text-amber-400">
                    {prop.deprecatedMessage}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ============================================================================
// Section Components
// ============================================================================

function Section({
  id,
  title,
  children,
  className,
}: {
  id: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-24', className)}>
      <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
            #
          </span>
        </a>
      </h2>
      {children}
    </section>
  )
}

function SubSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <div id={id} className="scroll-mt-24 mt-8">
      <h3 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
        <a
          href={`#${id}`}
          className="hover:text-brand-500 transition-colors group"
        >
          {title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-base">
            #
          </span>
        </a>
      </h3>
      {children}
    </div>
  )
}

// ============================================================================
// Table of Contents
// ============================================================================

const tableOfContents = [
  { id: 'overview', title: 'Overview' },
  { id: 'architecture', title: 'Architecture' },
  { id: 'import', title: 'Import' },
  {
    id: 'memory-provider',
    title: 'MemoryProvider',
    children: [{ id: 'provider-props', title: 'Props' }],
  },
  {
    id: 'use-memory-store',
    title: 'useMemoryStore',
    children: [
      { id: 'store-options', title: 'Options' },
      { id: 'store-returns', title: 'Returns' },
    ],
  },
  {
    id: 'use-memory-context',
    title: 'useMemoryContext',
    children: [{ id: 'context-returns', title: 'Returns' }],
  },
  {
    id: 'supporting-hooks',
    title: 'Supporting Hooks',
    children: [
      { id: 'use-memory-query', title: 'useMemoryQuery' },
      { id: 'use-conversation-memory', title: 'useConversationMemory' },
      { id: 'use-memory-stats', title: 'useMemoryStats' },
    ],
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Setup' },
      { id: 'example-chat', title: 'Chat Integration' },
      { id: 'example-preferences', title: 'User Preferences' },
      { id: 'example-advanced', title: 'Advanced Memory' },
    ],
  },
  { id: 'memory-types', title: 'Memory Types & Scopes' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
  { id: 'related', title: 'Related APIs' },
]

function TableOfContents() {
  const [activeId, setActiveId] = React.useState('')

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-100px 0px -66%' }
    )

    const headings = document.querySelectorAll('section[id], div[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [])

  return (
    <nav
      className="sticky top-24 space-y-1 text-sm"
      aria-label="Table of contents"
    >
      <p className="font-semibold text-foreground mb-3">On this page</p>
      {tableOfContents.map((item) => (
        <div key={item.id}>
          <a
            href={`#${item.id}`}
            className={cn(
              'block py-1 px-2 rounded transition-colors',
              activeId === item.id
                ? 'text-brand-600 dark:text-brand-400 bg-brand-500/10'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {item.title}
          </a>
          {item.children && (
            <div className="ml-3 mt-1 space-y-1 border-l border-border/50 pl-2">
              {item.children.map((child) => (
                <a
                  key={child.id}
                  href={`#${child.id}`}
                  className={cn(
                    'block py-0.5 text-xs transition-colors',
                    activeId === child.id
                      ? 'text-brand-600 dark:text-brand-400'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {child.title}
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}

// ============================================================================
// Props Data
// ============================================================================

const providerProps: PropDefinition[] = [
  {
    name: 'config',
    type: 'MemoryServiceConfig',
    required: true,
    description:
      'Memory service configuration including maxTokens and strategies.',
  },
  {
    name: 'vectorStore',
    type: 'VectorStore',
    description: 'Optional vector store for semantic search capabilities.',
  },
  {
    name: 'embeddings',
    type: 'EmbeddingProvider',
    description: 'Optional embedding provider for vector operations.',
  },
  {
    name: 'autoStart',
    type: 'boolean',
    default: 'true',
    description: 'Whether to auto-start the memory service.',
  },
  {
    name: 'children',
    type: 'React.ReactNode',
    required: true,
    description: 'React children to wrap with memory context.',
  },
]

const storeOptionsProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'false',
    description: 'Enable memory functionality.',
  },
  {
    name: 'strategy',
    type: "'sliding-window' | 'semantic-chunks' | 'vector-store'",
    default: "'sliding-window'",
    description: 'Memory management strategy.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for memory context.',
  },
  {
    name: 'scope',
    type: 'MemoryScope',
    default: "'session'",
    description: "Memory scope: 'session' | 'user' | 'global'.",
  },
]

const storeReturnProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    description: 'Whether memory is enabled.',
  },
  {
    name: 'service',
    type: 'MemoryContextValue | null',
    description: 'Memory service instance.',
  },
  {
    name: 'config',
    type: '{ enabled, strategy, maxTokens }',
    description: 'Configuration object for useClarityChat integration.',
  },
  {
    name: 'addMemory',
    type: '(content, type?, metadata?) => Promise<void>',
    description: 'Add a memory item.',
  },
  {
    name: 'query',
    type: '(query: string) => Promise<any[]>',
    description: 'Query memories by text.',
  },
  {
    name: 'clear',
    type: '() => Promise<void>',
    description: 'Clear memories for current scope.',
  },
]

const contextReturnProps: PropDefinition[] = [
  {
    name: 'service',
    type: 'MemoryService | null',
    description: 'Memory service instance.',
  },
  {
    name: 'isInitialized',
    type: 'boolean',
    description: 'Whether service is initialized.',
  },
  {
    name: 'addMemory',
    type: '(content, type, scope, metadata?, options?) => Promise<MemoryItem>',
    description: 'Add a memory with full options.',
  },
  {
    name: 'query',
    type: '(query: MemoryQuery) => Promise<MemorySearchResult[]>',
    description: 'Query memories with full query options.',
  },
  {
    name: 'updateMemory',
    type: '(id: string, updates) => Promise<MemoryItem | null>',
    description: 'Update an existing memory.',
  },
  {
    name: 'deleteMemory',
    type: '(id: string) => Promise<boolean>',
    description: 'Delete a memory by ID.',
  },
  {
    name: 'promoteMemory',
    type: '(id, targetScope) => Promise<MemoryItem | null>',
    description: 'Promote memory to a higher scope.',
  },
  {
    name: 'compressMemory',
    type: '(id, ratio?) => Promise<MemoryItem | null>',
    description: 'Compress a memory to reduce tokens.',
  },
  {
    name: 'getStats',
    type: '() => MemoryStats',
    description: 'Get memory statistics.',
  },
  {
    name: 'getContext',
    type: '() => MemoryContext',
    description: 'Get current memory context.',
  },
  {
    name: 'subscribe',
    type: '(eventType, listener) => () => void',
    description: 'Subscribe to memory events.',
  },
]

const queryReturnProps: PropDefinition[] = [
  {
    name: 'data',
    type: 'MemorySearchResult[]',
    description: 'Query results.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Loading state.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error state.',
  },
  {
    name: 'refetch',
    type: '() => Promise<void>',
    description: 'Refetch function.',
  },
]

const conversationMemoryReturnProps: PropDefinition[] = [
  {
    name: 'context',
    type: 'MemoryContext | null',
    description: 'Current memory context.',
  },
  {
    name: 'captureMessage',
    type: '(content, role, metadata?) => Promise<MemoryItem>',
    description: 'Capture a message as memory.',
  },
  {
    name: 'capturePreference',
    type: '(key, value, metadata?) => Promise<MemoryItem>',
    description: 'Capture a user preference.',
  },
  {
    name: 'getRelevantMemories',
    type: '(query, limit?) => Promise<MemorySearchResult[]>',
    description: 'Get memories relevant to query.',
  },
  {
    name: 'getRecentHistory',
    type: '(limit?) => Promise<MemorySearchResult[]>',
    description: 'Get recent conversation history.',
  },
  {
    name: 'getPreferences',
    type: '() => Promise<MemorySearchResult[]>',
    description: 'Get user preferences.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  // Provider
  MemoryProvider,
  type MemoryProviderProps,

  // Top-level hooks
  useMemoryStore,
  type UseMemoryStoreOptions,
  type UseMemoryStoreReturn,

  // Mid-level hooks
  useMemory,
  useMemoryContext,
  useMemoryQuery,
  useMemoryStats,
  useConversationMemory,
  type MemoryContextValue,

  // Types from @clarity-chat/memory
  type MemoryItem,
  type MemoryType,
  type MemoryScope,
  type MemoryQuery,
  type MemorySearchResult,
  type MemoryStats,
} from '@clarity-chat/react'`

const basicSetupCode = `import { MemoryProvider, useMemoryStore } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <Chat />
    </MemoryProvider>
  )
}

function Chat() {
  const memory = useMemoryStore({ enabled: true })

  return (
    <ClarityChat
      api="/api/chat"
      memory={memory.config}
    />
  )
}`

const chatIntegrationCode = `import {
  MemoryProvider,
  useConversationMemory,
  ClarityChat,
} from '@clarity-chat/react'

function ChatWithMemory() {
  const {
    captureMessage,
    capturePreference,
    getRelevantMemories,
    getRecentHistory,
  } = useConversationMemory({
    userId: user.id,
    threadId: thread.id,
    sessionId: session.id,
    autoCapture: true,
  })

  // Capture messages automatically in onMessage callback
  const handleMessage = async (message) => {
    await captureMessage(message.content, message.role, {
      timestamp: Date.now(),
      toolsUsed: message.toolCalls?.map(t => t.name),
    })
  }

  // Get relevant memories before sending a message
  const handleBeforeSend = async (input) => {
    const memories = await getRelevantMemories(input, 5)
    // Include relevant memories in system prompt or context
    return {
      additionalContext: memories.map(m => m.memory.content).join('\\n'),
    }
  }

  return (
    <ClarityChat
      api="/api/chat"
      onMessage={handleMessage}
      onBeforeSend={handleBeforeSend}
      memory={{ enabled: true }}
    />
  )
}`

const preferencesCode = `import { useConversationMemory } from '@clarity-chat/react'

function UserPreferences() {
  const { capturePreference, getPreferences } = useConversationMemory({
    userId: user.id,
  })

  const [preferences, setPreferences] = React.useState<MemorySearchResult[]>([])

  React.useEffect(() => {
    getPreferences().then(setPreferences)
  }, [getPreferences])

  const handleThemeChange = async (theme: 'light' | 'dark') => {
    await capturePreference('theme', theme, {
      category: 'ui',
      timestamp: Date.now(),
    })
    // Preference is now stored and will persist across sessions
  }

  const handleLanguageChange = async (language: string) => {
    await capturePreference('language', language, {
      category: 'localization',
    })
  }

  return (
    <div>
      <h3>Your Preferences</h3>
      {preferences.map((pref) => (
        <div key={pref.memory.id}>
          {pref.memory.metadata?.preferenceKey}: {pref.memory.metadata?.preferenceValue}
        </div>
      ))}

      <select onChange={(e) => handleThemeChange(e.target.value as any)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  )
}`

const advancedMemoryCode = `import {
  MemoryProvider,
  useMemory,
  useMemoryQuery,
  useMemoryStats,
} from '@clarity-chat/react'

function AdvancedMemoryChat() {
  const {
    addMemory,
    updateMemory,
    promoteMemory,
    compressMemory,
    subscribe,
  } = useMemory()

  // Query with full options
  const { data: recentMemories, isLoading, refetch } = useMemoryQuery(
    {
      types: ['episodic', 'semantic'],
      scopes: ['session', 'user'],
      limit: 20,
      minConfidence: 0.7,
    },
    { refetchInterval: 10000 }
  )

  // Monitor memory stats
  const { stats, refresh } = useMemoryStats(5000) // Refresh every 5s

  // Subscribe to memory events
  React.useEffect(() => {
    const unsubscribe = subscribe('memory_added', (event) => {
      console.log('New memory added:', event)
      refetch()
    })
    return unsubscribe
  }, [subscribe, refetch])

  // Add memory with full options
  const saveImportantMemory = async (content: string) => {
    const memory = await addMemory(
      content,
      'semantic',    // Type: episodic | semantic | procedural
      'user',        // Scope: session | user | global
      { category: 'important', tags: ['key-info'] },
      { priority: 'high', confidence: 0.95 }
    )

    // Later, promote to global if still relevant
    // await promoteMemory(memory.id, 'global')

    // Or compress if too large
    // await compressMemory(memory.id, 0.5)
  }

  return (
    <div>
      <div className="stats">
        <span>Total: {stats.total} memories</span>
        <span>Tokens: {stats.totalTokens.toLocaleString()}</span>
        <span>Avg Confidence: {(stats.averageConfidence * 100).toFixed(0)}%</span>
      </div>

      <div className="memories">
        {isLoading ? (
          <span>Loading...</span>
        ) : (
          recentMemories.map((result) => (
            <div key={result.memory.id} className="memory-item">
              <span className="content">{result.memory.content}</span>
              <span className="score">Score: {result.score.toFixed(2)}</span>
              <span className="type">{result.memory.type}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}`

const memoryTypesCode = `// Memory Types
type MemoryType =
  | 'episodic'    // Conversation history, events
  | 'semantic'    // Facts, preferences, knowledge
  | 'procedural'  // How-to, workflows, instructions

// Memory Scopes (in order of persistence)
type MemoryScope =
  | 'session'  // Current browser session only
  | 'user'     // Persists for this user across sessions
  | 'global'   // Shared across all users (careful with PII!)

// Memory Priority
type MemoryPriority =
  | 'low'      // Can be trimmed first
  | 'medium'   // Default priority
  | 'high'     // Preserved longer
  | 'critical' // Never auto-trimmed

// Memory Item
interface MemoryItem {
  id: string
  content: string
  type: MemoryType
  scope: MemoryScope
  priority: MemoryPriority
  confidence: number      // 0-1 relevance score
  tokens: number          // Token count
  createdAt: Date
  updatedAt: Date
  accessedAt: Date
  accessCount: number
  metadata?: Record<string, any>
}`

const vectorStoreCode = `import { MemoryProvider, useMemory } from '@clarity-chat/react'
import { PineconeVectorStore } from '@clarity-chat/vector-stores'
import { OpenAIEmbeddings } from '@clarity-chat/embeddings'

// Configure vector store for semantic search
const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'chat-memories',
})

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small',
})

function App() {
  return (
    <MemoryProvider
      config={{ maxTokens: 50000 }}
      vectorStore={vectorStore}
      embeddings={embeddings}
    >
      <SemanticChat />
    </MemoryProvider>
  )
}

function SemanticChat() {
  const { query } = useMemory()

  // Semantic search across all memories
  const searchMemories = async (userMessage: string) => {
    const results = await query({
      query: userMessage,     // Semantic search
      limit: 10,
      minConfidence: 0.6,
      types: ['semantic'],    // Only search semantic memories
    })

    return results.map(r => ({
      content: r.memory.content,
      relevance: r.score,
    }))
  }

  // ...
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseMemoryPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumbs />

      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8 py-8">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-12">
            {/* Page Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.moderate,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                  <Brain className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                      Hooks
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                Memory Hooks
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Hooks for conversation memory, context management, and user
                preference persistence. Enable your AI to remember
                conversations, learn user preferences, and maintain context
                across sessions.
              </p>
            </motion.header>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: durations.slow,
                delay: 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                {
                  icon: History,
                  label: 'Session Memory',
                  desc: 'Conversation history',
                },
                {
                  icon: Database,
                  label: 'Persistence',
                  desc: 'Cross-session storage',
                },
                {
                  icon: Search,
                  label: 'Semantic Search',
                  desc: 'Vector-based retrieval',
                },
                {
                  icon: Shield,
                  label: 'Privacy Scopes',
                  desc: 'Controlled sharing',
                },
              ].map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <Icon
                    className="w-5 h-5 text-brand-500 mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-medium text-foreground text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              ))}
            </motion.div>

            {/* Overview Section */}
            <Section id="overview" title="Overview">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  The memory hooks provide a comprehensive system for AI
                  conversation memory. They enable your application to remember
                  past interactions, learn user preferences, and maintain
                  context across sessions.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Capabilities
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Conversation History:</strong> Store and retrieve
                    past messages with episodic memory
                  </li>
                  <li>
                    <strong>User Preferences:</strong> Learn and remember user
                    preferences with semantic memory
                  </li>
                  <li>
                    <strong>Semantic Search:</strong> Find relevant memories
                    using vector similarity
                  </li>
                  <li>
                    <strong>Privacy Scopes:</strong> Control memory sharing with
                    session, user, and global scopes
                  </li>
                  <li>
                    <strong>Auto-Trimming:</strong> Automatic context management
                    to stay within token limits
                  </li>
                </ul>
              </div>
            </Section>

            {/* Architecture Section */}
            <Section id="architecture" title="Architecture">
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left font-semibold">
                        Layer
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Hook
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Use Case
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium text-purple-600 dark:text-purple-400">
                        Top-Level
                      </td>
                      <td className="px-4 py-3 font-mono">useMemoryStore</td>
                      <td className="px-4 py-3">
                        Simple integration with ClarityChat
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                        Mid-Level
                      </td>
                      <td className="px-4 py-3 font-mono">useMemoryContext</td>
                      <td className="px-4 py-3">
                        Safe access (returns null if no provider)
                      </td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                        Mid-Level
                      </td>
                      <td className="px-4 py-3 font-mono">useMemory</td>
                      <td className="px-4 py-3">
                        Full memory operations (throws if no provider)
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                        Mid-Level
                      </td>
                      <td className="px-4 py-3 font-mono">
                        useConversationMemory
                      </td>
                      <td className="px-4 py-3">
                        High-level conversation tracking
                      </td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                        Mid-Level
                      </td>
                      <td className="px-4 py-3 font-mono">useMemoryQuery</td>
                      <td className="px-4 py-3">Query with loading states</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400">
                        Mid-Level
                      </td>
                      <td className="px-4 py-3 font-mono">useMemoryStats</td>
                      <td className="px-4 py-3">
                        Memory statistics monitoring
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Import Section */}
            <Section id="import" title="Import">
              <CodeBlock
                code={importCode}
                language="tsx"
                filename="Import"
                showDownloadButton={false}
              />
            </Section>

            {/* MemoryProvider Section */}
            <Section id="memory-provider" title="MemoryProvider">
              <p className="text-muted-foreground mb-6">
                Context provider that enables memory functionality for all child
                components. Required for all memory hooks.
              </p>

              <SubSection id="provider-props" title="Props">
                <PropsTable props={providerProps} />
              </SubSection>
            </Section>

            {/* useMemoryStore Section */}
            <Section id="use-memory-store" title="useMemoryStore">
              <p className="text-muted-foreground mb-6">
                Top-level hook for simple memory integration. Returns a config
                object that can be passed directly to ClarityChat.
              </p>

              <SubSection id="store-options" title="Options">
                <PropsTable props={storeOptionsProps} />
              </SubSection>

              <SubSection id="store-returns" title="Returns">
                <PropsTable props={storeReturnProps} />
              </SubSection>
            </Section>

            {/* useMemoryContext Section */}
            <Section id="use-memory-context" title="useMemoryContext">
              <p className="text-muted-foreground mb-6">
                Mid-level hook that safely accesses memory context. Returns null
                if MemoryProvider is not available (unlike useMemory which
                throws).
              </p>

              <SubSection id="context-returns" title="Returns">
                <PropsTable
                  props={contextReturnProps}
                  title="MemoryContextValue (or null)"
                />
              </SubSection>
            </Section>

            {/* Supporting Hooks Section */}
            <Section id="supporting-hooks" title="Supporting Hooks">
              <SubSection id="use-memory-query" title="useMemoryQuery">
                <p className="text-muted-foreground mb-4">
                  Query memories with automatic loading states and refetching:
                </p>
                <PropsTable props={queryReturnProps} />
                <CodeBlock
                  code={`const { data, isLoading, refetch } = useMemoryQuery(
  { text: 'user preferences', types: ['semantic'] },
  { refetchInterval: 5000 }
)`}
                  language="tsx"
                  filename="useMemoryQuery"
                />
              </SubSection>

              <SubSection
                id="use-conversation-memory"
                title="useConversationMemory"
              >
                <p className="text-muted-foreground mb-4">
                  High-level hook for managing conversation-specific memory:
                </p>
                <PropsTable props={conversationMemoryReturnProps} />
              </SubSection>

              <SubSection id="use-memory-stats" title="useMemoryStats">
                <p className="text-muted-foreground mb-4">
                  Monitor memory statistics with optional auto-refresh:
                </p>
                <CodeBlock
                  code={`const { stats, refresh } = useMemoryStats(5000) // Refresh every 5s

// stats: {
//   total: number,
//   byType: Record<MemoryType, number>,
//   byScope: Record<MemoryScope, number>,
//   byPriority: Record<MemoryPriority, number>,
//   totalTokens: number,
//   averageConfidence: number,
// }`}
                  language="tsx"
                  filename="useMemoryStats"
                />
              </SubSection>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Setup">
                <p className="text-muted-foreground mb-4">
                  Minimal setup with MemoryProvider and ClarityChat:
                </p>
                <CodeBlock
                  code={basicSetupCode}
                  language="tsx"
                  filename="BasicSetup.tsx"
                />
              </SubSection>

              <SubSection id="example-chat" title="Chat Integration">
                <p className="text-muted-foreground mb-4">
                  Full integration with conversation memory capture:
                </p>
                <CodeBlock
                  code={chatIntegrationCode}
                  language="tsx"
                  filename="ChatWithMemory.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-preferences" title="User Preferences">
                <p className="text-muted-foreground mb-4">
                  Store and retrieve user preferences:
                </p>
                <CodeBlock
                  code={preferencesCode}
                  language="tsx"
                  filename="UserPreferences.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="example-advanced"
                title="Advanced Memory Management"
              >
                <p className="text-muted-foreground mb-4">
                  Full control with queries, stats, and event subscriptions:
                </p>
                <CodeBlock
                  code={advancedMemoryCode}
                  language="tsx"
                  filename="AdvancedMemory.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Memory Types Section */}
            <Section id="memory-types" title="Memory Types & Scopes">
              <p className="text-muted-foreground mb-4">
                Understanding memory types and scopes is essential for effective
                memory management:
              </p>
              <CodeBlock
                code={memoryTypesCode}
                language="tsx"
                filename="MemoryTypes.ts"
                showLineNumbers
              />

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Vector Store Integration:</strong> For semantic search
                  capabilities, configure a vector store and embeddings
                  provider:
                </p>
              </div>

              <div className="mt-4">
                <CodeBlock
                  code={vectorStoreCode}
                  language="tsx"
                  filename="VectorStoreSetup.tsx"
                  showLineNumbers
                />
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    &quot;useMemory must be used within a MemoryProvider&quot;
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    This error means you&apos;re using useMemory without a
                    provider.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Wrap your component tree with{' '}
                      <code>&lt;MemoryProvider&gt;</code>
                    </li>
                    <li>
                      Or use <code>useMemoryContext</code> which returns null
                      safely
                    </li>
                    <li>
                      Check that the provider is a parent of your component
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Memories not persisting across sessions
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Default scope is &apos;session&apos; which clears on browser
                    close.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Use <code>scope: &apos;user&apos;</code> for cross-session
                      persistence
                    </li>
                    <li>
                      Ensure a vector store or persistent storage is configured
                    </li>
                    <li>Check that userId is consistent across sessions</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Semantic search returning poor results
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Without a vector store, search uses basic text matching.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Configure a vector store (Pinecone, Supabase, etc.)</li>
                    <li>Add an embedding provider (OpenAI, Cohere, etc.)</li>
                    <li>
                      Increase <code>minConfidence</code> threshold in queries
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Memory consuming too many tokens
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Long conversations can exceed context limits.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Set <code>maxTokens</code> in MemoryProvider config
                    </li>
                    <li>
                      Use <code>compressMemory</code> for large memories
                    </li>
                    <li>
                      Set lower <code>priority</code> for less important
                      memories
                    </li>
                    <li>
                      Integrate with token optimization hooks for auto-trimming
                    </li>
                  </ul>
                </div>
              </div>
            </Section>

            {/* Related APIs Section */}
            <Section id="related" title="Related APIs">
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  {
                    name: 'useClarityChat',
                    type: 'hook',
                    description: 'Top-level chat hook with memory integration',
                    href: '/reference/hooks/use-clarity-chat',
                  },
                  {
                    name: 'Token Optimization Hooks',
                    type: 'hook',
                    description: 'Manage token budgets with memory',
                    href: '/reference/hooks/use-token-optimization',
                  },
                  {
                    name: '@clarity-chat/memory',
                    type: 'package',
                    description: 'Core memory service (framework-agnostic)',
                    href: '/reference/packages/memory',
                  },
                  {
                    name: 'Vector Stores',
                    type: 'guide',
                    description: 'Configure vector stores for semantic search',
                    href: '/guides/vector-stores',
                  },
                ].map((api) => (
                  <Link
                    key={api.name}
                    href={api.href}
                    className={cn(
                      'group p-4 rounded-lg border border-border/50',
                      'hover:border-brand-500/30 hover:shadow-sm transition-all',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {api.name}
                      </span>
                      <span
                        className={cn(
                          'text-xs px-2 py-0.5 rounded-full',
                          api.type === 'hook'
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                            : api.type === 'package'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        )}
                      >
                        {api.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {api.description}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>

            {/* Footer Navigation */}
            <div className="border-t border-border/50 pt-8 mt-12">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link
                  href="/reference/hooks/use-token-optimization"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                  )}
                >
                  <ChevronRight className="w-5 h-5 text-muted-foreground rotate-180 group-hover:text-brand-500 transition-colors" />
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">
                      Previous
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Token Optimization Hooks
                    </div>
                  </div>
                </Link>
                <Link
                  href="/reference/components"
                  className={cn(
                    'group flex items-center gap-3 p-4 rounded-lg border border-border/50',
                    'hover:border-brand-500/30 hover:shadow-sm transition-all',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    'text-right'
                  )}
                >
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">
                      Next
                    </div>
                    <div className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      Components Reference
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-500 transition-colors" />
                </Link>
              </div>
            </div>
          </main>

          {/* Table of Contents Sidebar */}
          <aside className="hidden xl:block w-64 shrink-0">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  )
}
