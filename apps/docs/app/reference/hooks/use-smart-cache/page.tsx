import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useSmartCache Hook | Clarity Chat',
  description:
    'Cache LLM responses and embeddings to avoid duplicate calls and reduce costs.',
}

const useSmartCacheOptions: Prop[] = [
  {
    name: 'cacheType',
    type: '"memory" | "localStorage" | "indexedDB"',
    default: '"memory"',
    description: 'Storage type for cache.',
  },
  {
    name: 'ttl',
    type: 'number',
    default: '3600000',
    description: 'Time to live in milliseconds (1 hour default).',
  },
  {
    name: 'maxSize',
    type: 'number',
    default: '100',
    description: 'Maximum number of cached entries.',
  },
  {
    name: 'keyGenerator',
    type: '(input: any) => string',
    description: 'Custom function to generate cache keys.',
  },
  {
    name: 'onCacheHit',
    type: '(key: string) => void',
    description: 'Callback when cache hit occurs.',
  },
  {
    name: 'onCacheMiss',
    type: '(key: string) => void',
    description: 'Callback when cache miss occurs.',
  },
]

const useSmartCacheReturn: Prop[] = [
  {
    name: 'get',
    type: '<T>(key: string) => Promise<T | null>',
    description: 'Get cached value by key.',
  },
  {
    name: 'set',
    type: '<T>(key: string, value: T) => Promise<void>',
    description: 'Set cached value.',
  },
  {
    name: 'has',
    type: '(key: string) => Promise<boolean>',
    description: 'Check if key exists in cache.',
  },
  {
    name: 'delete',
    type: '(key: string) => Promise<void>',
    description: 'Delete cached entry.',
  },
  {
    name: 'clear',
    type: '() => Promise<void>',
    description: 'Clear all cached entries.',
  },
  {
    name: 'stats',
    type: '{ hits: number; misses: number; size: number; hitRate: number }',
    description: 'Cache statistics.',
  },
]

export default function UseSmartCachePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useSmartCache</h1>

      <p className="lead">
        Cache LLM responses and embeddings to avoid duplicate calls and reduce
        costs. Supports memory, localStorage, and IndexedDB storage with
        automatic expiration.
      </p>

      <Callout type="info" title="Cost Savings">
        <p>
          Smart caching can reduce API costs by 30-50% by reusing responses for
          similar queries and avoiding redundant LLM calls.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache } from '@clarity-chat/react/internal'

function CachedChat() {
  const cache = useSmartCache({
    cacheType: 'memory',
    ttl: 3600000, // 1 hour
  })

  const handleQuery = async (query: string) => {
    const cacheKey = \`query:\${query}\`
    
    // Check cache first
    const cached = await cache.get(cacheKey)
    if (cached) {
      return cached // Return cached response
    }

    // Cache miss - fetch from API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ query }),
    }).then(r => r.json())

    // Cache the response
    await cache.set(cacheKey, response)

    return response
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useSmartCache:
        </p>
        <CodePlayground
          code={`import { useSmartCache } from '@clarity-chat/react/internal'
import { useState } from 'react'

function Example() {
  const cache = useSmartCache({ cacheType: 'memory' })
  const [result, setResult] = useState(null)

  const handleQuery = async (query: string) => {
    const cached = await cache.get(query)
    if (cached) {
      setResult({ ...cached, fromCache: true })
    } else {
      const response = { answer: 'Response for: ' + query }
      await cache.set(query, response)
      setResult({ ...response, fromCache: false })
    }
  }

  return (
    <div>
      <button onClick={() => handleQuery('test')}>Query "test"</button>
      {result && (
        <div>
          <p>Result: {result.answer}</p>
          <p>From cache: {result.fromCache ? 'Yes' : 'No'}</p>
        </div>
      )}
      <p>Hit rate: {cache.stats.hitRate.toFixed(2)}%</p>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With IndexedDB</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache } from '@clarity-chat/react/internal'

function PersistentCache() {
  const cache = useSmartCache({
    cacheType: 'indexedDB',
    ttl: 86400000, // 24 hours
    maxSize: 1000,
  })

  // Cache persists across page reloads
  const handleQuery = async (query: string) => {
    const cached = await cache.get(query)
    if (cached) return cached

    const response = await fetchResponse(query)
    await cache.set(query, response)
    return response
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Custom Key Generator
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache } from '@clarity-chat/react/internal'

function SemanticCache() {
  const cache = useSmartCache({
    cacheType: 'memory',
    keyGenerator: (input) => {
      // Generate semantic key from message content
      const normalized = input.content.toLowerCase().trim()
      return \`semantic:\${normalized}\`
    },
  })

  // Similar queries will hit the same cache entry
  const handleQuery = async (message: string) => {
    const key = cache.keyGenerator({ content: message })
    const cached = await cache.get(key)
    // ...
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Cache Statistics
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useSmartCache } from '@clarity-chat/react/internal'

function CachedChat() {
  const cache = useSmartCache({
    cacheType: 'memory',
    onCacheHit: (key) => {
      logger.debug('Cache hit:', key)
    },
    onCacheMiss: (key) => {
      logger.debug('Cache miss:', key)
    },
  })

  return (
    <div>
      <div className="cache-stats">
        <p>Hits: {cache.stats.hits}</p>
        <p>Misses: {cache.stats.misses}</p>
        <p>Hit Rate: {(cache.stats.hitRate * 100).toFixed(1)}%</p>
        <p>Size: {cache.stats.size} entries</p>
      </div>
      <ChatWindow onSendMessage={handleQuery} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useSmartCacheOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useSmartCacheReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Cache Types</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Memory Cache</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Fast in-memory cache. Cleared on page reload.
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`const cache = useSmartCache({
  cacheType: 'memory',
  maxSize: 100,
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">LocalStorage Cache</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Persistent cache in browser localStorage. Limited to ~5-10MB.
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`const cache = useSmartCache({
  cacheType: 'localStorage',
  maxSize: 50, // Smaller due to storage limits
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">IndexedDB Cache</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Persistent cache in IndexedDB. Supports large amounts of data.
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`const cache = useSmartCache({
  cacheType: 'indexedDB',
  maxSize: 1000, // Can store more
})`}
            />
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Use semantic keys</strong> - Normalize queries to cache
            similar requests
          </li>
          <li>
            <strong>Set appropriate TTL</strong> - Balance freshness vs. cache
            hits
          </li>
          <li>
            <strong>Monitor hit rate</strong> - Aim for 40-60% hit rate for good
            savings
          </li>
          <li>
            <strong>Clear stale entries</strong> - Periodically clear expired
            cache
          </li>
          <li>
            <strong>Use IndexedDB for large data</strong> - Better for
            embeddings and large responses
          </li>
          <li>
            <strong>Invalidate on updates</strong> - Clear cache when data
            changes
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/reference/hooks/use-token-optimization"
            className="docs-card"
          >
            <h3>useTokenOptimization Hook</h3>
            <p>Token optimization coordinator</p>
          </a>
          <a href="/reference/hooks/use-model-router" className="docs-card">
            <h3>useModelRouter Hook</h3>
            <p>Model routing for cost optimization</p>
          </a>
          <a href="/guides/token-optimization" className="docs-card">
            <h3>Token Optimization Guide</h3>
            <p>Complete optimization guide</p>
          </a>
          <a href="/cookbook/caching-strategies" className="docs-card">
            <h3>Caching Strategies Recipe</h3>
            <p>Advanced caching patterns</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: 'useTokenOptimization',
          href: '/reference/hooks/use-token-optimization',
        }}
        next={{
          title: 'useMessageOperations',
          href: '/reference/hooks/use-message-operations',
        }}
      />
    </>
  )
}
