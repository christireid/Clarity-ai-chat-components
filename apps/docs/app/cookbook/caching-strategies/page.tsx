'use client'

import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export default function CachingStrategiesPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Caching Strategies Recipe</h1>

      <p className="lead">
        Implement intelligent caching to reduce API costs, improve response
        times, and provide offline support for your AI chat application.
      </p>

      <Callout type="info" title="Cost Savings">
        <p>
          Effective caching can reduce LLM API costs by 40-60% by avoiding
          redundant requests for similar queries.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          Quick Start with useSmartCache
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The easiest way to add caching is with our built-in hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache, useClarityChat } from '@clarity-chat/react'

function CachedChat() {
  const cache = useSmartCache({
    // Cache similar queries (semantic matching)
    similarityThreshold: 0.85,

    // Cache duration
    ttl: 1000 * 60 * 60, // 1 hour

    // Maximum cache entries
    maxEntries: 1000,
  })

  const { messages, sendMessage } = useClarityChat({
    api: '/api/chat',

    // Enable caching
    cache,

    // Callback when cache is hit
    onCacheHit: (cached) => {
      console.log('Cache hit! Saved API call.')
    },
  })

  return <ChatUI messages={messages} onSend={sendMessage} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Multi-Layer Caching</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          For production apps, implement multiple cache layers:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { createCacheProvider } from '@clarity-chat/react'

// Layer 1: In-memory cache (fastest, limited size)
const memoryCache = createCacheProvider({
  type: 'memory',
  maxSize: 100,
  ttl: 1000 * 60 * 5, // 5 minutes
})

// Layer 2: IndexedDB cache (larger, persistent)
const indexedDBCache = createCacheProvider({
  type: 'indexeddb',
  dbName: 'clarity-chat-cache',
  maxSize: 10000,
  ttl: 1000 * 60 * 60 * 24, // 24 hours
})

// Layer 3: Redis cache (shared across users)
const redisCache = createCacheProvider({
  type: 'redis',
  url: process.env.REDIS_URL,
  ttl: 1000 * 60 * 60 * 24 * 7, // 7 days
})

// Combine layers
const cache = createCacheProvider({
  type: 'multi',
  layers: [memoryCache, indexedDBCache, redisCache],
  // Check layers in order, write to all
  writeThrough: true,
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Semantic Caching</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Cache based on meaning, not exact matches:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache } from '@clarity-chat/react'

const cache = useSmartCache({
  // Use embeddings for similarity matching
  similarity: {
    enabled: true,
    model: 'text-embedding-3-small',
    threshold: 0.9, // 90% similarity = cache hit
  },

  // Normalize queries before caching
  normalize: (query) => {
    return query
      .toLowerCase()
      .trim()
      .replace(/\\s+/g, ' ')
  },

  // Custom cache key generation
  keyGenerator: (messages) => {
    // Only use last N messages for cache key
    const recent = messages.slice(-3)
    return JSON.stringify(recent.map(m => m.content))
  },
})

// Example: These queries would share a cache entry
// "What's the weather?"
// "what is the weather"
// "Tell me the weather please"`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">
          Response Streaming with Cache
        </h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Cache streaming responses for instant replay:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache, useClarityChat } from '@clarity-chat/react'

function StreamingCachedChat() {
  const cache = useSmartCache({
    // Store complete streamed responses
    cacheStreamedResponses: true,

    // Replay cached streams with typing effect
    replayWithAnimation: true,
    replaySpeed: 2, // 2x faster than original
  })

  const { messages, sendMessage, isStreaming } = useClarityChat({
    api: '/api/chat',
    cache,

    onCacheHit: (cached) => {
      // Cached response will stream with animation
      console.log('Replaying cached response')
    },
  })

  return (
    <div>
      <MessageList messages={messages} />
      {isStreaming && <StreamingIndicator />}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Cache Invalidation</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Control when cached data should be refreshed:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`const cache = useSmartCache({
  // Time-based invalidation
  ttl: 1000 * 60 * 60, // 1 hour

  // Invalidate based on conditions
  invalidateWhen: {
    // New deployment
    appVersion: process.env.NEXT_PUBLIC_APP_VERSION,

    // User preference change
    userPreferences: ['language', 'timezone'],

    // Custom condition
    custom: (entry) => {
      // Invalidate if data source was updated
      return entry.createdAt < dataSourceLastUpdated
    },
  },

  // Manual invalidation
  onInvalidate: (key) => {
    console.log(\`Cache invalidated: \${key}\`)
  },
})

// Manual invalidation examples
cache.invalidate('specific-key')
cache.invalidateAll() // Clear entire cache
cache.invalidatePattern(/^user-.*/) // Regex pattern`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Cache Analytics</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Monitor cache performance:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`const cache = useSmartCache({
  analytics: {
    enabled: true,
    onMetric: (metric) => {
      // Send to your analytics service
      analytics.track('cache_metric', metric)
    },
  },
})

// Access cache stats
const stats = cache.getStats()
console.log({
  hitRate: stats.hitRate,      // 0.65 = 65% hit rate
  missRate: stats.missRate,    // 0.35
  totalHits: stats.hits,       // 1234
  totalMisses: stats.misses,   // 678
  avgLatencySaved: stats.avgLatencySaved, // 1.2s
  estimatedCostSaved: stats.costSaved,    // $45.67
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-smart-cache" className="docs-card">
            <strong>useSmartCache Hook</strong>
            <span>Full API reference</span>
          </a>
          <a
            href="/reference/hooks/use-token-optimization"
            className="docs-card"
          >
            <strong>useTokenOptimization</strong>
            <span>Reduce token usage</span>
          </a>
          <a href="/guides/performance" className="docs-card">
            <strong>Performance Guide</strong>
            <span>Optimization strategies</span>
          </a>
          <a href="/cookbook/offline-first" className="docs-card">
            <strong>Offline-First Recipe</strong>
            <span>Work without internet</span>
          </a>
        </div>
      </section>
    </>
  )
}
