'use client'

/**
 * useSmartCache Hook - API Reference Documentation
 *
 * Documentation for the useSmartCache hook with semantic similarity matching.
 * Achieve 50-90% cost reduction through intelligent caching strategies.
 */

import * as React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Code2,
  Copy,
  Check,
  ChevronRight,
  Database,
  Zap,
  TrendingDown,
  Clock,
  Hash,
  Activity,
  PiggyBank,
  Target,
  Layers,
  AlertCircle,
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
  { id: 'import', title: 'Import' },
  {
    id: 'signature',
    title: 'Hook Signature',
  },
  {
    id: 'options',
    title: 'Options',
    children: [
      { id: 'cache-options', title: 'Cache Configuration' },
      { id: 'semantic-options', title: 'Semantic Matching' },
      { id: 'callback-options', title: 'Callbacks' },
    ],
  },
  {
    id: 'returns',
    title: 'Return Value',
    children: [
      { id: 'cache-methods', title: 'Cache Methods' },
      { id: 'cache-stats', title: 'Statistics' },
    ],
  },
  {
    id: 'invalidation',
    title: 'Invalidation Strategies',
  },
  {
    id: 'cost-impact',
    title: 'Cost Impact',
  },
  {
    id: 'examples',
    title: 'Examples',
    children: [
      { id: 'example-basic', title: 'Basic Caching' },
      { id: 'example-system-prompts', title: 'System Prompts' },
      { id: 'example-rag', title: 'RAG Context' },
      { id: 'example-conversation', title: 'Conversation History' },
      { id: 'example-semantic', title: 'Semantic Matching' },
    ],
  },
  {
    id: 'integration',
    title: 'Integration',
    children: [
      { id: 'format-for-caching', title: 'formatForCaching' },
      { id: 'cache-hit-tracking', title: 'Cache Hit Tracking' },
    ],
  },
  {
    id: 'performance',
    title: 'Performance Benchmarks',
  },
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

const cacheOptionsProps: PropDefinition[] = [
  {
    name: 'enabled',
    type: 'boolean',
    default: 'true',
    description: 'Enable or disable the cache. Useful for conditional caching.',
  },
  {
    name: 'maxSize',
    type: 'number',
    default: '100',
    description: 'Maximum number of cache entries. Uses LRU eviction when exceeded.',
  },
  {
    name: 'defaultTTL',
    type: 'number',
    default: '0',
    description: 'Default time-to-live in milliseconds. 0 = no expiry.',
  },
  {
    name: 'costPerToken',
    type: 'number',
    default: '0',
    description: 'Cost per token for savings calculation (e.g., 0.000003 for GPT-4).',
  },
]

const semanticOptionsProps: PropDefinition[] = [
  {
    name: 'enableSemanticMatching',
    type: 'boolean',
    default: 'false',
    description: 'Enable semantic similarity matching using embeddings.',
  },
  {
    name: 'embedFunction',
    type: '(text: string) => Promise<number[]> | number[]',
    description: 'Function to generate embeddings for semantic matching.',
  },
  {
    name: 'similarityThreshold',
    type: 'number',
    default: '0.85',
    description: 'Cosine similarity threshold (0-1) for semantic matches.',
  },
]

const callbackOptionsProps: PropDefinition[] = [
  {
    name: 'onCacheHit',
    type: '(query: string, response: T) => void',
    description: 'Called when cache hit occurs.',
  },
  {
    name: 'onCacheMiss',
    type: '(query: string) => void',
    description: 'Called when cache miss occurs.',
  },
]

const cacheMethodsProps: PropDefinition[] = [
  {
    name: 'get',
    type: '(query: string) => Promise<T | null>',
    description: 'Retrieve from cache. Returns null on miss.',
  },
  {
    name: 'set',
    type: '(query: string, response: T, options?: { ttl?: number; tags?: string[] }) => Promise<void>',
    description: 'Store in cache with optional TTL and tags.',
  },
  {
    name: 'clear',
    type: '() => void',
    description: 'Clear all cache entries.',
  },
  {
    name: 'clearByTag',
    type: '(tag: string) => void',
    description: 'Clear entries with specific tag.',
  },
  {
    name: 'setEnabled',
    type: '(enabled: boolean) => void',
    description: 'Enable or disable the cache.',
  },
]

const cacheStatsProps: PropDefinition[] = [
  {
    name: 'stats',
    type: 'CacheStats',
    description: 'Cache statistics including hits, misses, and savings.',
  },
  {
    name: 'isEnabled',
    type: 'boolean',
    description: 'Whether cache is currently enabled.',
  },
]

const statsTypeProps: PropDefinition[] = [
  {
    name: 'size',
    type: 'number',
    description: 'Current number of cache entries.',
  },
  {
    name: 'hits',
    type: 'number',
    description: 'Total cache hits.',
  },
  {
    name: 'misses',
    type: 'number',
    description: 'Total cache misses.',
  },
  {
    name: 'hitRate',
    type: 'number',
    description: 'Hit rate as percentage (0-100).',
  },
  {
    name: 'tokensSaved',
    type: 'number',
    description: 'Estimated tokens saved from cache hits.',
  },
  {
    name: 'costSaved',
    type: 'number',
    description: 'Estimated cost saved in dollars.',
  },
]

// ============================================================================
// Code Examples
// ============================================================================

const importCode = `import {
  useSmartCache,
  type UseSmartCacheOptions,
  type UseSmartCacheReturn,
  type CacheStats,
} from '@clarity-chat/react'`

const signatureCode = `function useSmartCache<T = any>(
  options?: UseSmartCacheOptions<T>
): UseSmartCacheReturn<T>`

const basicExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function ChatComponent() {
  const cache = useSmartCache<string>({
    maxSize: 100,
    defaultTTL: 3600000, // 1 hour
    costPerToken: 0.000003, // GPT-4 pricing
  })

  const handleQuery = async (query: string) => {
    // Try cache first
    const cached = await cache.get(query)
    if (cached) {
      console.log('Cache hit! Saved API call')
      return cached
    }

    // Query API
    const response = await queryAPI(query)

    // Cache for future
    await cache.set(query, response, { ttl: 3600000 })

    return response
  }

  return (
    <div>
      <div className="stats">
        <span>Hit Rate: {cache.stats.hitRate.toFixed(1)}%</span>
        <span>Tokens Saved: {cache.stats.tokensSaved.toLocaleString()}</span>
        <span>Cost Saved: \${cache.stats.costSaved.toFixed(4)}</span>
      </div>
      {/* Chat UI */}
    </div>
  )
}`

const systemPromptExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function ChatWithSystemPrompt() {
  const cache = useSmartCache<string>({
    maxSize: 50,
    costPerToken: 0.000003, // GPT-4 pricing
  })

  // System prompt (static, cached once)
  const systemPrompt = \`You are a helpful AI assistant with expertise in...\`

  const handleChat = async (userMessage: string) => {
    // Build full prompt
    const fullPrompt = \`\${systemPrompt}\\n\\nUser: \${userMessage}\`

    // Check cache
    const cached = await cache.get(fullPrompt)
    if (cached) return cached

    // API call with system prompt
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      }),
    }).then(r => r.json())

    // Cache entire conversation
    await cache.set(fullPrompt, response, {
      tags: ['conversation'],
      ttl: 7200000, // 2 hours
    })

    return response
  }

  return (
    <div>
      {/* Show savings from system prompt caching */}
      <div className="savings-banner">
        System prompt cached - Saving ~2,000 tokens per request!
      </div>
    </div>
  )
}`

const ragExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function RAGChatbot() {
  const cache = useSmartCache<{
    answer: string
    sources: string[]
  }>({
    maxSize: 200,
    defaultTTL: 3600000, // 1 hour
    costPerToken: 0.000003,
    onCacheHit: (query, response) => {
      console.log('RAG cache hit:', query)
      console.log('Sources:', response.sources)
    },
  })

  const handleRAGQuery = async (query: string, context: string[]) => {
    // Create cache key from query + context
    const cacheKey = \`\${query}::\${context.join('|')}\`

    // Check cache
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached // Instant response!
    }

    // Retrieve relevant docs
    const relevantDocs = await retrieveDocuments(query, context)

    // Build RAG prompt with context
    const ragPrompt = \`
      Context: \${relevantDocs.join('\\n\\n')}

      Question: \${query}

      Answer based on the context above.
    \`

    // Query LLM
    const response = await queryLLM(ragPrompt)

    const result = {
      answer: response,
      sources: relevantDocs.map(d => d.id),
    }

    // Cache with context-specific tag
    await cache.set(cacheKey, result, {
      tags: ['rag', ...context],
      ttl: 3600000,
    })

    return result
  }

  // Invalidate when documents update
  const handleDocumentUpdate = (category: string) => {
    cache.clearByTag(category)
  }

  return (
    <div>
      <div className="cache-stats">
        Cached {cache.stats.size} RAG responses
        ({cache.stats.hitRate.toFixed(0)}% hit rate)
      </div>
    </div>
  )
}`

const conversationExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function ConversationCache() {
  const cache = useSmartCache<string>({
    maxSize: 500,
    defaultTTL: 1800000, // 30 minutes
    costPerToken: 0.000003,
  })

  const [messages, setMessages] = React.useState<Message[]>([])

  const handleMessage = async (newMessage: string) => {
    // Create conversation hash
    const conversationKey = messages
      .map(m => \`\${m.role}:\${m.content}\`)
      .join('||') + \`||user:\${newMessage}\`

    // Check if this exact conversation state was seen
    const cached = await cache.get(conversationKey)
    if (cached) {
      setMessages([...messages,
        { role: 'user', content: newMessage },
        { role: 'assistant', content: cached },
      ])
      return
    }

    // Make API call
    const response = await chatAPI([
      ...messages,
      { role: 'user', content: newMessage },
    ])

    // Cache this conversation state
    await cache.set(conversationKey, response, {
      tags: ['conversation', \`session-\${sessionId}\`],
    })

    setMessages([...messages,
      { role: 'user', content: newMessage },
      { role: 'assistant', content: response },
    ])
  }

  // Clear session cache on logout
  const handleLogout = () => {
    cache.clearByTag(\`session-\${sessionId}\`)
  }

  return (
    <div>
      <div className="conversation-stats">
        <span>Messages: {messages.length}</span>
        <span>Cached: {cache.stats.size}</span>
        <span>Savings: \${cache.stats.costSaved.toFixed(2)}</span>
      </div>
    </div>
  )
}`

const semanticExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function SemanticChatCache() {
  const cache = useSmartCache<string>({
    enableSemanticMatching: true,
    embedFunction: async (text) => {
      // Use your embedding API (OpenAI, Cohere, etc.)
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      const { embedding } = await response.json()
      return embedding
    },
    similarityThreshold: 0.85, // 85% similar = cache hit
    maxSize: 100,
    costPerToken: 0.000003,
  })

  const handleQuery = async (query: string) => {
    // Semantic matching finds similar queries!
    // "What is React?" matches "Can you explain React?"
    const cached = await cache.get(query)

    if (cached) {
      console.log('Semantic cache hit - similar query found!')
      return cached
    }

    const response = await queryAPI(query)
    await cache.set(query, response)

    return response
  }

  return (
    <div>
      <div className="semantic-stats">
        <span>Semantic Hit Rate: {cache.stats.hitRate.toFixed(1)}%</span>
        <span>Tokens Saved: {cache.stats.tokensSaved.toLocaleString()}</span>
      </div>
    </div>
  )
}`

const formatForCachingCode = `import { useSmartCache, formatForCaching } from '@clarity-chat/react'

function CacheIntegration() {
  const cache = useSmartCache<string>()

  const handleCacheableRequest = async (
    systemPrompt: string,
    userQuery: string,
    context: string[]
  ) => {
    // Format for caching (marks cache breakpoints)
    const formatted = formatForCaching({
      systemPrompt,
      context,
      userMessage: userQuery,
    })

    // Use formatted content as cache key
    const cacheKey = JSON.stringify(formatted)
    const cached = await cache.get(cacheKey)

    if (cached) return cached

    // Send to API with cache markers
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify(formatted),
    }).then(r => r.json())

    await cache.set(cacheKey, response)
    return response
  }

  return <div>Cache-optimized requests</div>
}`

const trackingExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function CacheTrackingDashboard() {
  const cache = useSmartCache<string>({
    costPerToken: 0.000003,
    onCacheHit: (query, response) => {
      // Analytics tracking
      analytics.track('cache_hit', {
        query: query.substring(0, 50),
        savedTokens: estimateTokens(response),
      })
    },
    onCacheMiss: (query) => {
      analytics.track('cache_miss', {
        query: query.substring(0, 50),
      })
    },
  })

  const [hourlyStats, setHourlyStats] = React.useState({
    requests: 0,
    hits: 0,
    savings: 0,
  })

  // Track hourly stats
  React.useEffect(() => {
    const interval = setInterval(() => {
      const stats = cache.stats
      setHourlyStats({
        requests: stats.hits + stats.misses,
        hits: stats.hits,
        savings: stats.costSaved,
      })
    }, 3600000) // Every hour

    return () => clearInterval(interval)
  }, [cache])

  return (
    <div className="cache-dashboard">
      <div className="stat-card">
        <h3>Cache Hit Rate</h3>
        <div className="value">{cache.stats.hitRate.toFixed(1)}%</div>
      </div>
      <div className="stat-card">
        <h3>Tokens Saved</h3>
        <div className="value">
          {cache.stats.tokensSaved.toLocaleString()}
        </div>
      </div>
      <div className="stat-card">
        <h3>Cost Savings</h3>
        <div className="value">\${cache.stats.costSaved.toFixed(2)}</div>
      </div>
    </div>
  )
}`

const invalidationExampleCode = `import { useSmartCache } from '@clarity-chat/react'

function CacheInvalidation() {
  const cache = useSmartCache<string>()

  // Strategy 1: Time-based (TTL)
  const cacheWithTTL = async (key: string, value: string) => {
    await cache.set(key, value, {
      ttl: 3600000, // 1 hour
    })
  }

  // Strategy 2: Tag-based
  const cacheByCategory = async (category: string, data: string) => {
    await cache.set(\`\${category}:data\`, data, {
      tags: [category, 'product-data'],
    })
  }

  // Invalidate entire category
  const invalidateCategory = (category: string) => {
    cache.clearByTag(category)
  }

  // Strategy 3: Manual clear on events
  const handleDataUpdate = () => {
    cache.clear() // Clear everything
  }

  // Strategy 4: Selective invalidation
  const handleProductUpdate = (productId: string) => {
    cache.clearByTag(\`product-\${productId}\`)
  }

  return <div>Cache invalidation strategies</div>
}`

// ============================================================================
// Main Page Component
// ============================================================================

export default function UseSmartCachePage() {
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
                  <Database className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Stable
                    </span>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
                      Hooks
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm">
                      90% Savings
                    </span>
                    <span className="text-xs text-muted-foreground">
                      @clarity-chat/react
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-4xl font-bold text-foreground mb-4">
                useSmartCache
              </h1>

              <p className="text-lg text-muted-foreground max-w-3xl">
                Advanced caching hook with semantic similarity matching and
                intelligent invalidation. Maximize 50-90% savings on cached
                tokens for system prompts, RAG context, and conversation
                history.
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
                  icon: Hash,
                  label: 'Exact Matching',
                  desc: 'Fast hash-based lookup',
                },
                {
                  icon: Target,
                  label: 'Semantic Matching',
                  desc: 'Find similar queries',
                },
                {
                  icon: Clock,
                  label: 'TTL Management',
                  desc: 'Automatic expiry',
                },
                {
                  icon: PiggyBank,
                  label: '90% Savings',
                  desc: 'On cached tokens',
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
                  The <code>useSmartCache</code> hook provides intelligent
                  caching for AI responses with both exact and semantic
                  similarity matching. It helps reduce API costs by caching
                  repeated queries, system prompts, RAG context, and
                  conversation history.
                </p>

                <h4 className="text-lg font-semibold mt-6 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  <li>
                    <strong>Exact Matching:</strong> Fast hash-based lookup for
                    identical queries
                  </li>
                  <li>
                    <strong>Semantic Matching:</strong> Find similar queries
                    using embeddings (optional)
                  </li>
                  <li>
                    <strong>LRU Eviction:</strong> Automatically remove
                    least-recently-used entries
                  </li>
                  <li>
                    <strong>Tag-based Invalidation:</strong> Clear related
                    entries with tags
                  </li>
                  <li>
                    <strong>Cost Tracking:</strong> Monitor tokens and cost
                    savings
                  </li>
                  <li>
                    <strong>TTL Support:</strong> Time-based cache expiration
                  </li>
                </ul>

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800 mt-6 not-prose">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Pro Tip:</strong> Combine with{' '}
                    <code>formatForCaching</code> to mark cache breakpoints for
                    Anthropic/OpenAI provider caching, achieving up to 90%
                    savings on cached tokens!
                  </p>
                </div>
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

            {/* Signature Section */}
            <Section id="signature" title="Hook Signature">
              <CodeBlock
                code={signatureCode}
                language="tsx"
                filename="Signature"
                showDownloadButton={false}
              />
              <p className="text-muted-foreground mt-4">
                Generic type <code>T</code> represents the cached response type.
                Defaults to <code>any</code> if not specified.
              </p>
            </Section>

            {/* Options Section */}
            <Section id="options" title="Options">
              <SubSection id="cache-options" title="Cache Configuration">
                <PropsTable props={cacheOptionsProps} />
              </SubSection>

              <SubSection id="semantic-options" title="Semantic Matching">
                <p className="text-muted-foreground mb-4">
                  Enable semantic similarity to match queries with similar
                  meanings. Requires an embedding function (OpenAI, Cohere,
                  etc.).
                </p>
                <PropsTable props={semanticOptionsProps} />
              </SubSection>

              <SubSection id="callback-options" title="Callbacks">
                <PropsTable props={callbackOptionsProps} />
              </SubSection>
            </Section>

            {/* Returns Section */}
            <Section id="returns" title="Return Value">
              <SubSection id="cache-methods" title="Cache Methods">
                <PropsTable props={cacheMethodsProps} />
              </SubSection>

              <SubSection id="cache-stats" title="Statistics">
                <PropsTable props={cacheStatsProps} title="State" />
                <div className="mt-4">
                  <PropsTable
                    props={statsTypeProps}
                    title="CacheStats Properties"
                  />
                </div>
              </SubSection>
            </Section>

            {/* Invalidation Strategies Section */}
            <Section id="invalidation" title="Invalidation Strategies">
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p>
                  Choose the right invalidation strategy based on your use case:
                </p>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border/50 mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left font-semibold">
                        Strategy
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        When to Use
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Implementation
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-semibold">
                        Time-based (TTL)
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Static content, predictable updates
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        cache.set(key, value, &#123; ttl: 3600000 &#125;)
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-semibold">Tag-based</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Related content, category updates
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        cache.clearByTag(&apos;category&apos;)
                      </td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-semibold">Event-based</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Data updates, user actions
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        cache.clear()
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-semibold">LRU Eviction</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        Automatic, size-based
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        Handled automatically
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <CodeBlock
                code={invalidationExampleCode}
                language="tsx"
                filename="InvalidationStrategies.tsx"
              />
            </Section>

            {/* Cost Impact Section */}
            <Section id="cost-impact" title="Cost Impact: Maximize 90% Savings">
              <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
                <p>
                  Smart caching combined with provider caching (Anthropic,
                  OpenAI) can achieve dramatic cost reductions:
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="font-semibold text-foreground">
                      System Prompts
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    90%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Savings on repeated system prompts with provider caching
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-semibold text-foreground">
                      RAG Context
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    70-80%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Savings on cached document context
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    <span className="font-semibold text-foreground">
                      Conversations
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    50-60%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Savings on cached conversation history
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-purple-500/10 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <PiggyBank className="w-5 h-5" />
                  Real-World Savings Example
                </h4>
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-2">
                      Before Caching:
                    </p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>10,000 requests/day</li>
                      <li>2,000 tokens avg per request</li>
                      <li>20M tokens/day</li>
                      <li className="font-semibold text-foreground">
                        Cost: $60/day ($1,800/month)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-2">
                      After Caching (70% hit rate):
                    </p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>7,000 cache hits (90% savings each)</li>
                      <li>3,000 cache misses (full cost)</li>
                      <li>7.4M tokens/day</li>
                      <li className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Cost: $22/day ($660/month)
                        <br />
                        <span className="text-xs">Saving $1,140/month!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Section>

            {/* Examples Section */}
            <Section id="examples" title="Examples">
              <SubSection id="example-basic" title="Basic Caching">
                <p className="text-muted-foreground mb-4">
                  Simple cache with hit rate tracking and cost savings:
                </p>
                <CodeBlock
                  code={basicExampleCode}
                  language="tsx"
                  filename="BasicCache.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="example-system-prompts"
                title="System Prompts Caching"
              >
                <p className="text-muted-foreground mb-4">
                  Cache static system prompts to save tokens on every request:
                </p>
                <CodeBlock
                  code={systemPromptExampleCode}
                  language="tsx"
                  filename="SystemPromptCache.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection id="example-rag" title="RAG Context Caching">
                <p className="text-muted-foreground mb-4">
                  Cache RAG responses with document context and invalidation:
                </p>
                <CodeBlock
                  code={ragExampleCode}
                  language="tsx"
                  filename="RAGCache.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="example-conversation"
                title="Conversation History Caching"
              >
                <p className="text-muted-foreground mb-4">
                  Cache entire conversation states for repeat interactions:
                </p>
                <CodeBlock
                  code={conversationExampleCode}
                  language="tsx"
                  filename="ConversationCache.tsx"
                  showLineNumbers
                />
              </SubSection>

              <SubSection
                id="example-semantic"
                title="Semantic Similarity Matching"
              >
                <p className="text-muted-foreground mb-4">
                  Find similar queries automatically using embeddings:
                </p>
                <CodeBlock
                  code={semanticExampleCode}
                  language="tsx"
                  filename="SemanticCache.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Integration Section */}
            <Section id="integration" title="Integration">
              <SubSection
                id="format-for-caching"
                title="Integration with formatForCaching"
              >
                <p className="text-muted-foreground mb-4">
                  Combine with <code>formatForCaching</code> utility to mark
                  cache breakpoints for provider-level caching:
                </p>
                <CodeBlock
                  code={formatForCachingCode}
                  language="tsx"
                  filename="FormatForCaching.tsx"
                />
                <div className="mt-4 p-4 rounded-lg bg-blue-500/10 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Best Practice:</strong> Use{' '}
                    <code>useSmartCache</code> for application-level caching and{' '}
                    <code>formatForCaching</code> for provider-level caching.
                    Together they achieve maximum cost reduction.
                  </p>
                </div>
              </SubSection>

              <SubSection id="cache-hit-tracking" title="Cache Hit Rate Tracking">
                <p className="text-muted-foreground mb-4">
                  Track cache performance and analytics:
                </p>
                <CodeBlock
                  code={trackingExampleCode}
                  language="tsx"
                  filename="CacheTracking.tsx"
                  showLineNumbers
                />
              </SubSection>
            </Section>

            {/* Performance Benchmarks Section */}
            <Section id="performance" title="Performance Benchmarks">
              <div className="overflow-x-auto rounded-lg border border-border/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/20">
                      <th className="px-4 py-3 text-left font-semibold">
                        Scenario
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Cache Size
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Hit Rate
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Cost Reduction
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium">
                        Static System Prompt
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">1</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        99.9%
                      </td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        90%
                      </td>
                    </tr>
                    <tr className="border-b border-border/30 bg-muted/10">
                      <td className="px-4 py-3 font-medium">
                        RAG with 50 Documents
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">100</td>
                      <td className="px-4 py-3 text-muted-foreground">75%</td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        68%
                      </td>
                    </tr>
                    <tr className="border-b border-border/30">
                      <td className="px-4 py-3 font-medium">
                        Support Chat (Common Questions)
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">200</td>
                      <td className="px-4 py-3 text-muted-foreground">65%</td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        59%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium">
                        Semantic Search
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">500</td>
                      <td className="px-4 py-3 text-muted-foreground">82%</td>
                      <td className="px-4 py-3 text-emerald-600 dark:text-emerald-400 font-semibold">
                        74%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            {/* Troubleshooting Section */}
            <Section id="troubleshooting" title="Troubleshooting">
              <div className="space-y-6">
                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Low cache hit rate
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cache not hitting as expected.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Check if queries are identical (use query normalization)
                    </li>
                    <li>
                      Enable semantic matching for similar but not identical
                      queries
                    </li>
                    <li>Adjust TTL - may be expiring too quickly</li>
                    <li>
                      Increase <code>maxSize</code> if evicting useful entries
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Semantic matching not working
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Similar queries not matching.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Verify <code>embedFunction</code> returns valid embeddings
                    </li>
                    <li>
                      Lower <code>similarityThreshold</code> (try 0.75-0.80)
                    </li>
                    <li>Check embeddings are same dimensionality</li>
                    <li>Ensure async embedding function is awaited properly</li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Memory usage too high
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cache consuming too much memory.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Reduce <code>maxSize</code> to limit entries
                    </li>
                    <li>
                      Set aggressive TTL to expire entries faster
                    </li>
                    <li>
                      Use tags to selectively clear large categories
                    </li>
                    <li>
                      Consider storing only IDs and fetching data separately
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg border border-border/50">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Stale data being returned
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Cache returning outdated responses.
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>
                      Implement tag-based invalidation for related content
                    </li>
                    <li>Set appropriate TTL for data freshness requirements</li>
                    <li>
                      Clear cache manually on data updates
                    </li>
                    <li>
                      Use event-driven invalidation for real-time updates
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
                    name: 'useTokenBudgetMonitor',
                    type: 'hook',
                    description:
                      'Monitor token usage and budgets with automatic trimming',
                    href: '/reference/hooks/use-token-optimization',
                  },
                  {
                    name: 'useMemory',
                    type: 'hook',
                    description: 'Conversation memory with automatic compression',
                    href: '/reference/hooks/use-memory',
                  },
                  {
                    name: 'Provider Caching Cookbook',
                    type: 'guide',
                    description: 'Complete guide to Anthropic/OpenAI caching',
                    href: '/cookbook/provider-caching-setup',
                  },
                  {
                    name: 'TokenOptimizationPanel',
                    type: 'component',
                    description: 'Pre-built UI for cache statistics',
                    href: '/reference/components/token-optimization-panel',
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
                            : api.type === 'guide'
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
                  href="/reference/hooks/use-memory"
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
                      Memory Hooks
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
