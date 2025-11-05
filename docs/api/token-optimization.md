# Token Optimization API Reference

Complete API documentation for token optimization features.

## Utilities

### `compressPrompt(text, options)`

Compress a prompt to reduce token usage.

**Parameters:**
- `text` (string): Text to compress
- `options` (CompressionOptions): Compression configuration
  - `trimWhitespace` (boolean): Remove extra whitespace (default: true)
  - `removeFillers` (boolean): Remove filler words (default: false)
  - `useAbbreviations` (boolean): Apply abbreviations (default: false)
  - `reducePunctuation` (boolean): Reduce excessive punctuation (default: false)
  - `maxLength` (number): Maximum length in characters (default: 0)
  - `preserveCode` (boolean): Preserve code blocks (default: true)
  - `preserveMarkdown` (boolean): Preserve markdown (default: true)

**Returns:** `CompressionResult`
- `compressed` (string): Compressed text
- `original` (string): Original text
- `originalLength` (number): Original length
- `compressedLength` (number): Compressed length
- `savingsPercent` (number): Savings percentage
- `originalTokens` (number): Estimated original tokens
- `compressedTokens` (number): Estimated compressed tokens
- `tokenSavings` (number): Token savings

**Example:**
```tsx
import { compressPrompt } from '@clarity-chat/react'

const result = compressPrompt(
  "Please help me understand this concept very clearly",
  { removeFillers: true }
)

console.log(result.compressed) // "Pls help me understand this concept clearly"
console.log(result.savingsPercent) // 15
```

### Preset Functions

#### `aggressiveCompress(text, maxLength?)`

Maximum compression for cost savings.

#### `balancedCompress(text)`

Recommended balanced compression.

#### `conservativeCompress(text)`

Safe compression with minimal changes.

---

## Classes

### `SmartCache<T>`

Intelligent caching with semantic similarity.

**Constructor:**
```tsx
new SmartCache<T>(options?: CacheOptions)
```

**Options:**
- `maxSize` (number): Maximum cache entries (default: 100)
- `defaultTTL` (number): Default TTL in ms (default: 0)
- `similarityThreshold` (number): Similarity threshold 0-1 (default: 0.85)
- `enableSemanticMatching` (boolean): Enable similarity matching (default: false)
- `embedFunction` (function): Embedding function for semantic matching

**Methods:**

#### `async get(query: string): Promise<T | null>`

Get cached value for query.

#### `async set(query: string, response: T, options?): Promise<void>`

Cache a response.

Options:
- `ttl` (number): TTL in milliseconds
- `tags` (string[]): Tags for cache management

#### `clear(): void`

Clear all entries.

#### `clearByTag(tag: string): void`

Clear entries by tag.

#### `getStats(): CacheStats`

Get cache statistics.

**Example:**
```tsx
import { SmartCache } from '@clarity-chat/react'

const cache = new SmartCache({
  maxSize: 100,
  defaultTTL: 3600000, // 1 hour
  similarityThreshold: 0.85,
})

// Cache response
await cache.set('What is React?', 'React is...', {
  ttl: 7200000,
  tags: ['react', 'frontend'],
})

// Get from cache
const result = await cache.get('What is React?')

// Clear by tag
cache.clearByTag('react')

// Get stats
const stats = cache.getStats()
console.log(`Hit rate: ${stats.hitRate}%`)
```

---

### `ModelRouter`

Route queries to cost-optimal models.

**Constructor:**
```tsx
new ModelRouter(availableModels?: ModelConfig[], options?)
```

**Options:**
- `preferProvider` (string): Preferred provider (e.g., 'openai')
- `maxCost` (number): Maximum cost per query
- `learningEnabled` (boolean): Enable learning from feedback

**Methods:**

#### `route(query: string, context?: string[]): RoutingDecision`

Route a query to the best model.

#### `recordFeedback(index: number, actualCost: number, satisfaction: number): void`

Record feedback for learning.

#### `getStats()`

Get routing statistics.

#### `clearHistory(): void`

Clear routing history.

**Example:**
```tsx
import { ModelRouter, COMMON_MODELS } from '@clarity-chat/react'

const router = new ModelRouter(COMMON_MODELS, {
  preferProvider: 'anthropic',
  maxCost: 0.01,
})

const decision = router.route('Explain quantum computing')

console.log(decision.model.name) // "Claude 3 Opus"
console.log(decision.savingsPercent) // 45

// Record feedback
router.recordFeedback(0, 0.005, 0.9)
```

---

### `ResponseLimiter`

Limit response length and format.

**Constructor:**
```tsx
new ResponseLimiter(config?: ResponseLimitConfig)
```

**Config:**
- `maxTokens` (number): Maximum tokens
- `maxCharacters` (number): Maximum characters
- `enforceFormat` (string): Format type ('json' | 'bullet-points' | 'numbered-list' | 'concise')
- `stopSequences` (string[]): Stop sequences
- `temperature` (number): Temperature setting
- `brevityLevel` (number): Brevity level 0-1

**Methods:**

#### `createPrompt(userPrompt: string): FormattedPrompt`

Create prompt with constraints.

#### `enforce(response: string)`

Enforce limits on response.

#### `getStats()`

Get limiter statistics.

**Example:**
```tsx
import { ResponseLimiter, RESPONSE_PRESETS } from '@clarity-chat/react'

const limiter = new ResponseLimiter(RESPONSE_PRESETS.brief)

// Create limited prompt
const { prompt, constraints } = limiter.createPrompt(
  'Explain React hooks'
)

// Enforce on response
const { response, truncated, tokensSaved } = limiter.enforce(
  longResponse
)
```

---

### `RequestBatcher<T, R>`

Batch multiple requests for efficiency.

**Constructor:**
```tsx
new RequestBatcher<T, R>(options: BatcherOptions)
```

**Options:**
- `maxBatchSize` (number): Maximum batch size (default: 10)
- `maxWaitTime` (number): Max wait time in ms (default: 1000)
- `processor` (function): Batch processor function
- `enablePriority` (boolean): Enable priority processing
- `onBatchProcessed` (function): Callback when batch processed

**Methods:**

#### `async add(data: T, options?): Promise<R>`

Add request to batch.

Options:
- `priority` (number): Request priority
- `tags` (string[]): Request tags

#### `async flush(): Promise<void>`

Flush pending requests immediately.

#### `clear(): void`

Clear queue.

#### `getStats()`

Get batching statistics.

**Example:**
```tsx
import { RequestBatcher } from '@clarity-chat/react'

const batcher = new RequestBatcher({
  maxBatchSize: 5,
  maxWaitTime: 1000,
  processor: async (requests) => {
    return await api.batchQuery(requests.map(r => r.data))
  },
})

// Add to batch (auto-processes when conditions met)
const result = await batcher.add({ query: 'Hello' })

// Force immediate processing
await batcher.flush()
```

---

### `ReferenceHandler`

Manage data references for payload reduction.

**Constructor:**
```tsx
new ReferenceHandler(options?)
```

**Options:**
- `maxSize` (number): Maximum references (default: 100)
- `defaultTTL` (number): Default TTL in ms (default: 0)
- `onEvict` (function): Callback when reference evicted

**Methods:**

#### `create<T>(type, data, options?): Reference`

Create reference for data.

Types: 'document' | 'image' | 'file' | 'conversation' | 'custom'

#### `resolve<T>(refId: string): T | null`

Resolve reference to get data.

#### `delete(refId: string): boolean`

Delete reference.

#### `getStats(): ReferenceStats`

Get statistics.

**Example:**
```tsx
import { ReferenceHandler } from '@clarity-chat/react'

const handler = new ReferenceHandler({ maxSize: 100 })

// Create reference
const ref = handler.create('document', largeDocument, {
  ttl: 3600000,
  metadata: { title: 'Report' },
})

// Send only reference
await api.query({
  message: 'Summarize this',
  documentRef: ref.id, // ~20 bytes
})

// Retrieve data
const doc = handler.resolve(ref.id)

// Get stats
const stats = handler.getStats()
console.log(`Saved ${stats.payloadSaved} bytes`)
```

---

## React Hooks

### `usePromptCompression(options)`

Hook for prompt compression with tracking.

**Options:** Same as `compressPrompt` plus:
- `enabled` (boolean): Enable compression (default: true)
- `minLength` (number): Min length to compress (default: 50)
- `onCompress` (function): Callback when compressed

**Returns:**
- `compress` (function): Compress a prompt
- `compressedText` (string | null): Last compressed text
- `lastResult` (CompressionResult | null): Last result
- `totalTokensSaved` (number): Total tokens saved
- `averageSavingsPercent` (number): Average savings
- `compressionCount` (number): Number of compressions
- `resetStats` (function): Reset statistics

**Example:**
```tsx
import { usePromptCompression } from '@clarity-chat/react'

function ChatInput() {
  const { compress, totalTokensSaved } = usePromptCompression({
    removeFillers: true,
    onCompress: (result) => {
      console.log(`Saved ${result.tokenSavings} tokens`)
    },
  })

  const handleSend = () => {
    const result = compress(input)
    sendMessage(result.compressed)
  }

  return <div>Tokens saved: {totalTokensSaved}</div>
}
```

---

### `useSmartCache<T>(options)`

Hook for smart caching.

**Options:** Same as `SmartCache` constructor plus:
- `enabled` (boolean): Enable cache (default: true)
- `costPerToken` (number): Cost per token for savings
- `onCacheHit` (function): Callback on cache hit
- `onCacheMiss` (function): Callback on cache miss

**Returns:**
- `get` (function): Get from cache
- `set` (function): Set in cache
- `clear` (function): Clear cache
- `clearByTag` (function): Clear by tag
- `stats` (CacheStats): Cache statistics
- `isEnabled` (boolean): Whether enabled
- `setEnabled` (function): Toggle cache

**Example:**
```tsx
import { useSmartCache } from '@clarity-chat/react'

function Chat() {
  const cache = useSmartCache({
    enableSemanticMatching: true,
    embedFunction: getEmbedding,
    onCacheHit: (query, response) => {
      console.log('Cache hit!')
    },
  })

  const handleQuery = async (query) => {
    const cached = await cache.get(query)
    if (cached) return cached

    const response = await api.query(query)
    await cache.set(query, response)
    return response
  }

  return <div>Hit rate: {cache.stats.hitRate}%</div>
}
```

---

### `useModelRouter(options)`

Hook for model routing.

**Options:** Same as `ModelRouter` constructor plus:
- `onRoute` (function): Callback when routed

**Returns:**
- `route` (function): Route a query
- `recordFeedback` (function): Record feedback
- `stats` (object): Routing statistics
- `history` (array): Routing history
- `clearHistory` (function): Clear history
- `lastDecision` (RoutingDecision | null): Last decision

**Example:**
```tsx
import { useModelRouter } from '@clarity-chat/react'

function Chat() {
  const router = useModelRouter({
    onRoute: (decision) => {
      console.log(`Using ${decision.model.name}`)
    },
  })

  const handleQuery = async (query) => {
    const decision = router.route(query)
    return await api.query(query, {
      model: decision.model.id,
    })
  }

  return (
    <div>
      Queries: {router.stats.totalQueries}
      <br />
      Savings: {router.stats.averageSavings}%
    </div>
  )
}
```

---

### `useResponseLimiter(options)`

Hook for response limiting.

**Options:** Same as `ResponseLimiter` constructor plus:
- `enabled` (boolean): Enable limiter (default: true)
- `preset` (string): Preset name from RESPONSE_PRESETS
- `onTruncate` (function): Callback when truncated

**Returns:**
- `createPrompt` (function): Create limited prompt
- `enforce` (function): Enforce limits
- `stats` (object): Limiter statistics
- `updateConfig` (function): Update configuration
- `resetStats` (function): Reset statistics
- `config` (ResponseLimitConfig): Current config

**Example:**
```tsx
import { useResponseLimiter } from '@clarity-chat/react'

function Chat() {
  const limiter = useResponseLimiter({
    preset: 'brief',
    onTruncate: (original, truncated) => {
      console.log('Response truncated')
    },
  })

  const handleQuery = async (query) => {
    const { prompt } = limiter.createPrompt(query)
    const response = await api.query(prompt)
    const { response: limited } = limiter.enforce(response)
    return limited
  }

  return <div>Tokens saved: {limiter.stats.tokensSaved}</div>
}
```

---

### `useRequestBatcher<T, R>(options)`

Hook for request batching.

**Options:** Same as `RequestBatcher` constructor plus:
- `enabled` (boolean): Enable batching (default: true)

**Returns:**
- `add` (function): Add to batch
- `flush` (function): Flush batch
- `clear` (function): Clear queue
- `stats` (object): Batching statistics
- `isEnabled` (boolean): Whether enabled
- `setEnabled` (function): Toggle batching

**Example:**
```tsx
import { useRequestBatcher } from '@clarity-chat/react'

function Chat() {
  const batcher = useRequestBatcher({
    maxBatchSize: 5,
    processor: async (queries) => {
      return await api.batchQuery(queries)
    },
  })

  const handleQuery = async (query) => {
    return await batcher.add(query)
  }

  return (
    <div>
      Batches: {batcher.stats.totalBatches}
      <button onClick={() => batcher.flush()}>
        Flush Now
      </button>
    </div>
  )
}
```

---

### `useSmartThrottle<T>(options)`

Hook for smart throttling.

**Options:**
- `delay` (number): Throttle delay in ms (default: 500)
- `adaptive` (boolean): Enable adaptive throttling (default: true)
- `minLength` (number): Minimum input length (default: 0)
- `cancelOnNew` (boolean): Cancel on new input (default: false)
- `trackSavings` (boolean): Track savings (default: true)
- `onThrottle` (function): Callback when throttled
- `onExecute` (function): Callback when executed

**Returns:**
- `throttledValue` (T | undefined): Throttled value
- `isThrottled` (boolean): Whether throttled
- `setValue` (function): Set new value
- `executeNow` (function): Execute immediately
- `cancel` (function): Cancel pending
- `throttleCount` (number): Throttle count
- `callsSaved` (number): API calls saved
- `resetStats` (function): Reset statistics

**Example:**
```tsx
import { useSmartThrottle } from '@clarity-chat/react'

function SearchInput() {
  const { throttledValue, callsSaved, setValue } = useSmartThrottle({
    delay: 500,
    adaptive: true,
  })

  React.useEffect(() => {
    if (throttledValue) {
      performSearch(throttledValue)
    }
  }, [throttledValue])

  return (
    <div>
      <input onChange={(e) => setValue(e.target.value)} />
      <div>API calls saved: {callsSaved}</div>
    </div>
  )
}
```

---

## Components

### `<TokenOptimizationDashboard />`

Display optimization metrics and savings.

**Props:**
- `metrics` (OptimizationMetrics): Current metrics
- `showBreakdown` (boolean): Show technique breakdown (default: true)
- `realTime` (boolean): Enable real-time updates (default: false)
- `refreshInterval` (number): Refresh interval in ms (default: 5000)
- `costPerToken` (number): Cost per token (default: 0.000002)
- `className` (string): Custom CSS class
- `onClick` (function): Click callback

**Example:**
```tsx
import { TokenOptimizationDashboard } from '@clarity-chat/react'

<TokenOptimizationDashboard
  metrics={{
    totalTokens: 50000,
    tokensSaved: 15000,
    costSaved: 0.45,
    breakdown: {
      promptCompression: { tokens: 4000, percent: 27 },
      caching: { hits: 120, savings: 5000 },
      modelRouting: { savings: 3000, percent: 40 },
      // ...
    },
    savingsPercent: 30,
  }}
  showBreakdown={true}
  realTime={true}
/>
```

---

### `<TokenOptimizationBadge />`

Compact savings display.

**Props:**
- `tokensSaved` (number): Tokens saved
- `savingsPercent` (number): Savings percentage
- `className` (string): Custom CSS class

**Example:**
```tsx
import { TokenOptimizationBadge } from '@clarity-chat/react'

<TokenOptimizationBadge
  tokensSaved={5000}
  savingsPercent={35}
/>
```

---

## Types

### `CompressionOptions`

```typescript
interface CompressionOptions {
  trimWhitespace?: boolean
  removeFillers?: boolean
  useAbbreviations?: boolean
  reducePunctuation?: boolean
  maxLength?: number
  preserveCode?: boolean
  preserveMarkdown?: boolean
}
```

### `CompressionResult`

```typescript
interface CompressionResult {
  compressed: string
  original: string
  originalLength: number
  compressedLength: number
  savingsPercent: number
  originalTokens: number
  compressedTokens: number
  tokenSavings: number
}
```

### `CacheOptions`

```typescript
interface CacheOptions {
  maxSize?: number
  defaultTTL?: number
  similarityThreshold?: number
  enableSemanticMatching?: boolean
  embedFunction?: (text: string) => Promise<number[]> | number[]
}
```

### `ModelConfig`

```typescript
interface ModelConfig {
  id: string
  name: string
  inputCost: number
  outputCost: number
  contextWindow: number
  tier: 'simple' | 'standard' | 'advanced'
  provider: string
}
```

### `RoutingDecision`

```typescript
interface RoutingDecision {
  model: ModelConfig
  complexity: QueryComplexity
  estimatedCost: number
  savingsPercent: number
  reasoning: string
}
```

---

## Constants

### `COMMON_MODELS`

Array of common model configurations:
- GPT-3.5 Turbo
- GPT-4
- GPT-4 Turbo
- Claude 3 Haiku
- Claude 3 Sonnet
- Claude 3 Opus

### `RESPONSE_PRESETS`

Pre-configured response limiter presets:
- `ultraBrief`: Maximum brevity
- `brief`: Concise responses
- `standard`: Balanced approach
- `code`: For code responses
- `data`: For data/JSON responses

---

## See Also

- [Token Optimization Guide](../guides/token-optimization.md)
- [Example Application](../../examples/token-optimization-demo/)
- [Best Practices](../guides/token-optimization-best-practices.md)
