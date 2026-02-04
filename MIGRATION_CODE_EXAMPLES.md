# Migration Code Examples

Practical before/after examples for common consolidation migration scenarios.

---

## Table of Contents

1. [Token Counting](#token-counting)
2. [Compression](#compression)
3. [Caching](#caching)
4. [React Hooks](#react-hooks)
5. [Error Handling](#error-handling)
6. [Utility Functions](#utility-functions)
7. [Performance Monitoring](#performance-monitoring)
8. [Complete Component Examples](#complete-component-examples)

---

## Token Counting

### Example 1: Basic Token Counting

**Before:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

function MyComponent({ text }: { text: string }) {
  // Static method call
  const count = AccurateTokenCounter.count(text)

  return <div>Tokens: {count}</div>
}
```

**After:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { useMemo } from 'react'

function MyComponent({ text }: { text: string }) {
  // Create instance once
  const counter = useMemo(
    () => new AccurateTokenCounter({ model: 'gpt-4', cacheResults: true }),
    []
  )

  // Use instance method
  const count = counter.count(text)

  return <div>Tokens: {count}</div>
}
```

### Example 2: Chat Message Counting

**Before:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { Message } from '@clarity-chat/types'

function calculateChatCost(messages: Message[]) {
  const count = AccurateTokenCounter.countChat(messages)
  const cost = (count / 1000) * 0.01
  return cost
}
```

**After:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { Message } from '@clarity-chat/types'

// Create shared instance
const counter = new AccurateTokenCounter({
  model: 'gpt-4',
  cacheResults: true,
})

function calculateChatCost(messages: Message[]) {
  const count = counter.countChat(messages)

  // Or use built-in estimate
  const estimate = counter.estimate(messages.map((m) => m.content).join('\n'), {
    inputCostPer1k: 0.01,
  })

  return estimate.totalCost
}
```

### Example 3: Batch Token Counting

**Before:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

function analyzeDocuments(documents: string[]) {
  const counts = AccurateTokenCounter.countBatch(documents)
  const total = counts.reduce((sum, count) => sum + count, 0)
  return { counts, total }
}
```

**After:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({ cacheResults: true })

function analyzeDocuments(documents: string[]) {
  const counts = counter.countBatch(documents)
  const total = counts.reduce((sum, count) => sum + count, 0)

  // Access performance metrics
  const metrics = counter.getMetrics()
  console.log(`Cache hit rate: ${metrics.cacheHitRate}%`)

  return { counts, total }
}
```

---

## Compression

### Example 1: Simple Text Compression

**Before:**

```typescript
import { compressText } from '@clarity-chat/react/utils/memory'

async function compressPrompt(text: string) {
  const compressed = await compressText(text)
  return compressed
}
```

**After:**

```typescript
import { compressAdaptively } from '@clarity-chat/token-optimization/simple'

async function compressPrompt(text: string) {
  const result = await compressAdaptively(text, {
    targetRatio: 0.5, // Compress to 50%
  })

  console.log(`Reduced from ${result.originalTokens} to ${result.compressedTokens}`)
  console.log(`Method: ${result.method}`)

  return result.compressed
}
```

### Example 2: Advanced Compression with LLMLingua

**Before:**

```typescript
import { LLMLinguaCompressor } from '@clarity-chat/react/utils/optimization'

const compressor = new LLMLinguaCompressor({
  targetRatio: 0.3,
})

const result = await compressor.compress(longText)
```

**After:**

```typescript
import { LLMLinguaCompressor } from '@clarity-chat/token-optimization'

const compressor = new LLMLinguaCompressor({
  targetRatio: 0.3,
  preserveQuestions: true,
  preserveEntities: true,
  preserveKeywords: ['important', 'critical'],
})

const result = await compressor.compress(longText)

console.log(`Compression ratio: ${result.compressionRatio}`)
console.log(`Quality score: ${result.quality}`)
```

### Example 3: Extractive Compression

**Before:**

```typescript
import { advancedCompress } from '@clarity-chat/react/utils/tokenization'

const result = await advancedCompress(text, { method: 'extractive' })
```

**After:**

```typescript
import { ExtractiveCompressor } from '@clarity-chat/token-optimization'

const compressor = new ExtractiveCompressor({
  topK: 5, // Keep top 5 sentences
  minScore: 0.3, // Minimum relevance
  preserveOrder: true, // Keep original order
})

const result = await compressor.compress(text)

// Access extracted sentences with scores
result.sentences.forEach((sentence) => {
  console.log(`Score ${sentence.score}: ${sentence.text}`)
})
```

---

## Caching

### Example 1: LRU Cache

**Before:**

```typescript
import { LRUCache } from '@clarity-chat/memory/utils/cache'

const cache = new LRUCache<string, Data>(100)
cache.set('key', data)
const value = cache.get('key')
```

**After:**

```typescript
import { LRUCache } from '@clarity-chat/utils/cache'

const cache = new LRUCache<string, Data>(100)

// Same API, better implementation
cache.set('key', data)
const value = cache.get('key')

// New: Check cache stats
console.log(`Size: ${cache.size} / ${cache.capacity}`)
console.log(`Has key: ${cache.has('key')}`)
```

### Example 2: TTL Cache with Auto-Prune

**Before:**

```typescript
import { TTLCache } from '@clarity-chat/react/utils'

const cache = new TTLCache<string, Data>(60000) // 60s TTL
```

**After:**

```typescript
import { TTLCache } from '@clarity-chat/utils/cache'

const cache = new TTLCache<string, Data>(
  60000, // 60 second TTL
  {
    autoPrune: 30000, // Auto-prune every 30s
    maxSize: 100, // Optional size limit
  }
)

// Don't forget to clean up
cache.dispose() // Stops auto-prune timer
```

### Example 3: Memoization

**Before:**

```typescript
import { memoize } from '@clarity-chat/react/internal/helpers'

const expensiveFn = memoize((x: number) => {
  // expensive calculation
  return result
})
```

**After:**

```typescript
import { memoize, memoizeAsync } from '@clarity-chat/utils/cache'

// Sync memoization
const expensiveFn = memoize(
  (x: number) => {
    // expensive calculation
    return result
  },
  {
    maxSize: 100,
    ttl: 60000, // 1 minute
    keyGenerator: (x) => `calc_${x}`,
  }
)

// Async memoization
const fetchData = memoizeAsync(
  async (id: string) => {
    const response = await fetch(`/api/data/${id}`)
    return response.json()
  },
  {
    maxSize: 50,
    ttl: 300000, // 5 minutes
  }
)
```

### Example 4: Smart Cache (Semantic)

**Before:**

```typescript
import { SemanticCache } from '@clarity-chat/react/utils/optimization'

const cache = new SemanticCache({ maxSize: 100 })
await cache.set('key', data, embedding)
const similar = await cache.getSimilar('query', 0.8)
```

**After:**

```typescript
import { SmartCache } from '@clarity-chat/token-optimization/cache'

const cache = new SmartCache({
  maxSize: 100,
  similarityThreshold: 0.85,
  ttl: 3600000, // 1 hour
})

// Set with embedding
await cache.set('key', data, {
  embedding: vectorData,
  metadata: { source: 'api' },
})

// Find similar entries
const results = await cache.getSimilar('query', {
  threshold: 0.8,
  limit: 5,
})

results.forEach((result) => {
  console.log(`Similarity: ${result.similarity}`)
  console.log(`Data:`, result.value)
})
```

---

## React Hooks

### Example 1: Custom Token Counter Hook

**Before:**

```typescript
import { useTokenCounter } from '@clarity-chat/react/hooks/token'

function MyComponent({ text }: { text: string }) {
  const counter = useTokenCounter()
  const count = counter.count(text)

  return <div>Tokens: {count}</div>
}
```

**After:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { useMemo } from 'react'

function useTokenCounter(model = 'gpt-4') {
  return useMemo(
    () => new AccurateTokenCounter({ model, cacheResults: true }),
    [model]
  )
}

function MyComponent({ text }: { text: string }) {
  const counter = useTokenCounter('gpt-4')
  const count = counter.count(text)

  return <div>Tokens: {count}</div>
}
```

### Example 2: Debounced Search

**Before:**

```typescript
import { debounce } from '@clarity-chat/react/internal/helpers'
import { useState, useMemo } from 'react'

function SearchBox() {
  const [query, setQuery] = useState('')

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      // Search logic
    }, 300),
    []
  )

  return <input onChange={(e) => handleSearch(e.target.value)} />
}
```

**After:**

```typescript
import { debounce } from '@clarity-chat/utils/async'
import { useState, useMemo } from 'react'

function SearchBox() {
  const [query, setQuery] = useState('')

  const handleSearch = useMemo(
    () => debounce((value: string) => {
      // Search logic
    }, 300),
    []
  )

  // New: Access debounce methods
  const cancelSearch = () => handleSearch.cancel()
  const flushSearch = () => handleSearch.flush()

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      <button onClick={cancelSearch}>Cancel</button>
      <button onClick={flushSearch}>Search Now</button>
    </>
  )
}
```

---

## Error Handling

### Example 1: Error Boundary

**Before:**

```typescript
import { ErrorBoundary } from '@clarity-chat/react/components/feedback'

function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  )
}
```

**After:**

```typescript
import { EnhancedErrorBoundary as ErrorBoundary } from '@clarity-chat/error-handling'

function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div>
          <h1>Something went wrong</h1>
          <pre>{error.message}</pre>
          <button onClick={reset}>Try again</button>
        </div>
      )}
      onError={(error, info) => {
        console.error('Error caught:', error, info)
        // Send to error tracking service
      }}
    >
      <MyComponent />
    </ErrorBoundary>
  )
}
```

### Example 2: Custom Error Classes

**Before:**

```typescript
import { ClarityError, ValidationError } from '@clarity-chat/errors'

class MyCustomError extends ClarityError {
  constructor(message: string) {
    super(message, { code: 'MY_ERROR' })
  }
}
```

**After:**

```typescript
import { ClarityError, ValidationError } from '@clarity-chat/utils/errors'

class MyCustomError extends ClarityError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, {
      code: 'MY_ERROR',
      statusCode: 400,
      solution: 'Check your input and try again',
      context: details,
    })
  }
}

// Use it
try {
  throw new MyCustomError('Invalid input', { field: 'email' })
} catch (error) {
  if (error instanceof MyCustomError) {
    console.log(error.code) // 'MY_ERROR'
    console.log(error.solution) // 'Check your input...'
    console.log(error.context) // { field: 'email' }
  }
}
```

---

## Utility Functions

### Example 1: Class Names

**Before:**

```typescript
import { cn } from '@clarity-chat/react/utils/cn'

const className = cn('base-class', isActive && 'active', { 'has-error': hasError })
```

**After:**

```typescript
import { cn } from '@clarity-chat/primitives'

// Same API, canonical source
const className = cn('base-class', isActive && 'active', { 'has-error': hasError })
```

### Example 2: Async Utilities

**Before:**

```typescript
import { debounce } from '@clarity-chat/react/internal'
import { throttle } from '@clarity-chat/primitives/lib/utils'
import { retry } from '@clarity-chat/memory/utils'

// Different sources, inconsistent APIs
```

**After:**

```typescript
import { debounce, throttle, retry, sleep, timeout } from '@clarity-chat/utils/async'

// Unified source, consistent API

const debouncedFn = debounce(() => {}, 300)
const throttledFn = throttle(() => {}, 100)

await retry(() => fetchData(), { retries: 3, delay: 1000 })
await sleep(1000)

try {
  await timeout(fetchData(), 5000) // 5 second timeout
} catch (error) {
  console.error('Timed out')
}
```

### Example 3: Environment Detection

**Before:**

```typescript
import { isBrowser } from '@clarity-chat/react/internal/helpers'

if (isBrowser()) {
  window.localStorage.setItem('key', 'value')
}
```

**After:**

```typescript
import { isBrowser, isNode, isDev, isProd, getEnv } from '@clarity-chat/utils/env'

if (isBrowser()) {
  window.localStorage.setItem('key', 'value')
}

if (isNode()) {
  const fs = require('fs')
}

if (isDev()) {
  console.log('Development mode')
}

// Type-safe env access
const apiKey = getEnv('API_KEY') // throws if missing
const optional = getEnv('OPTIONAL', 'default')
```

### Example 4: ID Generation

**Before:**

```typescript
import { generateId } from '@clarity-chat/react/utils/id-generator'
import { nanoid } from 'nanoid'

const id = generateId()
const customId = `msg_${nanoid()}`
```

**After:**

```typescript
import {
  generateId,
  generateMessageId,
  generateSessionId,
  generateBatchId,
} from '@clarity-chat/utils/id'

const id = generateId() // Random ID
const messageId = generateMessageId() // msg_xxxxx
const sessionId = generateSessionId() // session_xxxxx
const batchId = generateBatchId() // batch_xxxxx
```

---

## Performance Monitoring

### Example 1: Basic Performance Tracking

**Before:**

```typescript
import { PerformanceMonitor } from '@clarity-chat/react/utils/optimization'

const monitor = new PerformanceMonitor()
monitor.start('operation')
// ... do work ...
monitor.end('operation')
const metrics = monitor.getMetrics()
```

**After:**

```typescript
import { UnifiedPerformanceMonitor, measurePerformance } from '@clarity-chat/utils'

// Object-oriented approach
const monitor = new UnifiedPerformanceMonitor()
monitor.startTimer('operation')
// ... do work ...
monitor.endTimer('operation')

const metrics = monitor.getMetrics()
console.log(monitor.getSummary())

// Or functional approach
const result = measurePerformance('operation', () => {
  // ... expensive operation ...
  return result
})
console.log(`Took ${result.duration}ms`)
```

### Example 2: Async Performance Tracking

**Before:**

```typescript
const start = Date.now()
const result = await fetchData()
const duration = Date.now() - start
console.log(`Took ${duration}ms`)
```

**After:**

```typescript
import { measurePerformanceAsync } from '@clarity-chat/utils'

const { result, duration, memory } = await measurePerformanceAsync('fetchData', async () => {
  return await fetchData()
})

console.log(`Took ${duration}ms`)
console.log(`Memory delta: ${memory.delta} bytes`)
```

---

## Complete Component Examples

### Example 1: Chat Message Component

**Before:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { cn } from '@clarity-chat/react/utils/cn'
import { formatBytes } from '@clarity-chat/react/utils'

function ChatMessage({ content }: { content: string }) {
  const tokens = AccurateTokenCounter.count(content)
  const size = formatBytes(content.length)

  return (
    <div className={cn('message', tokens > 1000 && 'long')}>
      <p>{content}</p>
      <span>{tokens} tokens · {size}</span>
    </div>
  )
}
```

**After:**

```typescript
import { AccurateTokenCounter } from '@clarity-chat/token-optimization'
import { cn } from '@clarity-chat/primitives'
import { formatBytes } from '@clarity-chat/utils/format'
import { useMemo } from 'react'

function ChatMessage({ content }: { content: string }) {
  const counter = useMemo(
    () => new AccurateTokenCounter({ cacheResults: true }),
    []
  )

  const tokens = counter.count(content)
  const size = formatBytes(content.length)

  return (
    <div className={cn('message', tokens > 1000 && 'long')}>
      <p>{content}</p>
      <span>{tokens} tokens · {size}</span>
    </div>
  )
}
```

### Example 2: Search with Debounce

**Before:**

```typescript
import { debounce } from '@clarity-chat/react/internal'
import { useState, useMemo } from 'react'

function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const search = useMemo(
    () => debounce(async (q: string) => {
      const data = await fetchResults(q)
      setResults(data)
    }, 300),
    []
  )

  return (
    <input
      value={query}
      onChange={(e) => {
        setQuery(e.target.value)
        search(e.target.value)
      }}
    />
  )
}
```

**After:**

```typescript
import { debounce } from '@clarity-chat/utils/async'
import { useState, useMemo, useEffect } from 'react'

function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const search = useMemo(
    () => debounce(async (q: string) => {
      if (!q) {
        setResults([])
        return
      }
      const data = await fetchResults(q)
      setResults(data)
    }, 300),
    []
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => search.cancel()
  }, [search])

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          search(e.target.value)
        }}
      />
      <button onClick={() => search.flush()}>Search Now</button>
      <button onClick={() => { setQuery(''); search.cancel() }}>Clear</button>
      <div>{results.map(r => <div key={r.id}>{r.title}</div>)}</div>
    </div>
  )
}
```

### Example 3: Data Fetching with Retry

**Before:**

```typescript
import { retry } from '@clarity-chat/memory/utils/retry'
import { useState, useEffect } from 'react'

function DataDisplay() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    retry(() => fetchData(), { retries: 3 })
      .then(setData)
      .catch(setError)
  }, [])

  if (error) return <div>Error: {error.message}</div>
  if (!data) return <div>Loading...</div>
  return <div>{data.content}</div>
}
```

**After:**

```typescript
import { retry } from '@clarity-chat/utils/async'
import { getErrorMessage } from '@clarity-chat/utils/errors'
import { useState, useEffect } from 'react'

function DataDisplay() {
  const [data, setData] = useState(null)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    retry(
      () => fetchData(),
      {
        retries: 3,
        delay: 1000,
        backoffFactor: 2,
        shouldRetry: (err) => {
          // Only retry on network errors
          return err.code === 'NETWORK_ERROR'
        },
        onRetry: (attempt, err) => {
          console.log(`Retry ${attempt}/3: ${err.message}`)
          setRetryCount(attempt)
        },
      }
    )
      .then(setData)
      .catch((err) => setError(getErrorMessage(err)))
  }, [])

  if (error) {
    return (
      <div>
        Error after {retryCount} retries: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  if (!data) return <div>Loading... {retryCount > 0 && `(attempt ${retryCount})`}</div>
  return <div>{data.content}</div>
}
```

---

## See Also

- [CONSOLIDATION_MIGRATION_GUIDE.md](./CONSOLIDATION_MIGRATION_GUIDE.md) - Full migration guide
- [QUICK_MIGRATION_REFERENCE.md](./QUICK_MIGRATION_REFERENCE.md) - Quick lookup table
- [BREAKING_CHANGES.md](./BREAKING_CHANGES.md) - Detailed breaking changes

---

**Last Updated:** January 23, 2026
