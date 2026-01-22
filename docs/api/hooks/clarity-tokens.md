# Clarity Tokens - Advanced Token Optimization Hooks

The `@clarity-chat/react/hooks/clarity-tokens` package provides advanced token optimization hooks that build upon the core token tracking capabilities. These hooks offer sophisticated features including semantic caching, intelligent compression, adaptive model routing, budget management, and cost tracking.

## Overview

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| `useTokenOptimization` | All-in-one optimization | Unified API for counting, compression, caching, cost |
| `useSemanticCache` | Similarity-based caching | 40-60% hit rates with embeddings |
| `useExactCache` | Deterministic caching | SHA-256 keyed, TTL-based expiration |
| `useTokenLimitGuard` | Enforce token limits | 4 policies: truncate, summarize, hybrid, refuse |
| `useContextInjector` | RAG context injection | Inject retrieved chunks into prompts |
| `useAdaptiveModel` | Intelligent routing | Route requests to optimal models |
| `useTokenBudget` | Budget management | Session-level enforcement with alerts |
| `useCostTracker` | Cost analytics | Track costs by model/provider/period |
| `useTokenCounter` | Accurate counting | tiktoken-based token counting |
| `useCostEstimator` | Cost prediction | Pre-call cost estimation |
| `useContextWindow` | Window management | Dynamic context window sizing |
| `useEmbeddingCache` | Cache embeddings | Reuse vector embeddings |
| `useLazyTokenCounter` | Deferred counting | Count tokens on-demand |
| `usePromptCompressor` | Prompt compression | LLMLingua/extractive compression |
| `useResponseCache` | Response caching | Cache API responses |
| `useStreamOptimizer` | Stream optimization | Optimize streaming responses |
| `useTokenThrottle` | Rate limiting | Token-based throttling |
| `useTokenOptimizationStats` | Analytics | Track optimization metrics |
| `useVectorSearch` | Similarity search | In-memory vector search |

---

## useTokenOptimization

**All-in-one hook providing token counting, compression, caching, and cost estimation.**

### Signature

```typescript
function useTokenOptimization(options?: UseTokenOptimizationOptions): TokenOptimizationResult

interface UseTokenOptimizationOptions {
  model?: string                    // Default: 'gpt-4o'
  enableCompression?: boolean       // Default: true
  enableCaching?: boolean          // Default: true
  maxTokens?: number               // Model context limit
  cacheTtlMs?: number             // Cache TTL (default: 1 hour)
  maxCacheEntries?: number        // Max cache size (default: 1000)
}

interface TokenOptimizationResult {
  // Token counting
  countTokens: (text: string) => number
  countChatTokens: (messages: ChatMessage[]) => number
  isWithinLimit: (content: string | ChatMessage[], limit: number) => boolean

  // Compression
  compress: (text: string, options?: CompressionOptions) => Promise<CompressionResult>
  compressMessages: (messages: ChatMessage[], options?: CompressionOptions) => Promise<{
    messages: ChatMessage[]
    compressionRatio: number
    tokensSaved: number
  }>

  // Caching
  getCached: (key: string) => Promise<CachedResponse | null>
  setCached: (key: string, value: string, ttlMs?: number) => Promise<void>
  clearCached: (key: string) => Promise<void>
  clearAllCache: () => Promise<void>

  // Cost estimation
  estimateCost: (inputTokens: number, outputTokens?: number) => {
    inputCost: number
    outputCost: number
    totalCost: number
  }

  // Status
  modelInfo: ModelInfo
  isReady: boolean
  compressionEnabled: boolean
  cachingEnabled: boolean
}
```

### Examples

#### Basic Usage

```tsx
import { useTokenOptimization } from '@clarity-chat/react/hooks/clarity-tokens'

function OptimizedChat() {
  const {
    countTokens,
    compress,
    getCached,
    setCached,
    estimateCost,
    isReady,
  } = useTokenOptimization({
    model: 'gpt-4o',
    enableCompression: true,
    enableCaching: true,
  })

  const handleSend = async (message: string) => {
    // Count tokens
    const tokens = countTokens(message)
    console.log(`Message: ${tokens} tokens`)

    // Check cache first
    const cached = await getCached(message)
    if (cached) {
      return cached.data
    }

    // Compress if too long
    if (tokens > 4000) {
      const result = await compress(message, { targetRatio: 0.5 })
      message = result.compressed
      console.log(`Compressed: ${result.originalTokens} → ${result.compressedTokens} tokens`)
    }

    // Estimate cost
    const cost = estimateCost(tokens, 500)
    console.log(`Estimated cost: $${cost.totalCost.toFixed(6)}`)

    // Send to API and cache result
    const response = await callLLM(message)
    await setCached(message, response)
    return response
  }

  if (!isReady) return <div>Loading...</div>

  return <ChatInterface onSend={handleSend} />
}
```

#### Compress Chat History

```tsx
function CompressedChat() {
  const { compressMessages, countChatTokens } = useTokenOptimization()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const sendWithCompression = async (newMessage: string) => {
    const allMessages = [
      ...messages,
      { role: 'user', content: newMessage }
    ]

    // Check if we need compression
    const totalTokens = countChatTokens(allMessages)

    if (totalTokens > 8000) {
      // Compress older messages
      const { messages: compressed, tokensSaved } = await compressMessages(
        allMessages.slice(0, -1), // Don't compress the latest user message
        { targetRatio: 0.6 }
      )

      console.log(`Saved ${tokensSaved} tokens via compression`)

      const response = await callLLM([
        ...compressed,
        { role: 'user', content: newMessage }
      ])

      setMessages(prev => [...prev,
        { role: 'user', content: newMessage },
        { role: 'assistant', content: response }
      ])
    } else {
      const response = await callLLM(allMessages)
      setMessages(prev => [...prev,
        { role: 'user', content: newMessage },
        { role: 'assistant', content: response }
      ])
    }
  }

  return <ChatInterface onSend={sendWithCompression} />
}
```

#### Cost Monitoring Dashboard

```tsx
function CostMonitor() {
  const { estimateCost, modelInfo } = useTokenOptimization({ model: 'gpt-4o' })
  const [sessionCost, setSessionCost] = useState(0)

  const trackUsage = (inputTokens: number, outputTokens: number) => {
    const { totalCost } = estimateCost(inputTokens, outputTokens)
    setSessionCost(prev => prev + totalCost)
  }

  return (
    <div>
      <h3>Cost Monitoring</h3>
      <p>Model: {modelInfo.model}</p>
      <p>Input: ${modelInfo.inputPricePerMillion.toFixed(2)}/1M tokens</p>
      <p>Output: ${modelInfo.outputPricePerMillion.toFixed(2)}/1M tokens</p>
      <p>Session cost: ${sessionCost.toFixed(4)}</p>
    </div>
  )
}
```

### Compression Strategies

```typescript
// LLMLingua: Aggressive token-level compression
const result = await compress(text, {
  strategy: 'llmlingua',
  targetRatio: 0.3,
  llmlinguaOptions: {
    preserveQuestions: true,
    preserveFirstSentence: true,
  }
})

// Extractive: Sentence-level extraction
const result = await compress(text, {
  strategy: 'extractive',
  targetRatio: 0.5,
  extractiveOptions: {
    algorithm: 'textrank',
    preserveStructure: true,
  }
})

// Adaptive: Automatically choose best strategy
const result = await compress(text, {
  strategy: 'adaptive',
  targetRatio: 0.5,
  minQuality: 0.7,
})
```

### When to Use

- **Use for:** Applications needing multiple token optimization features
- **Best when:** You need counting + compression + caching + cost tracking
- **Alternatives:** Individual hooks if you only need specific features

---

## useSemanticCache

**Semantic similarity-based response caching using embeddings and cosine similarity.**

Achieves 40-60% cache hit rates for applications with repetitive query patterns.

### Signature

```typescript
function useSemanticCache<T = string>(config?: UseSemanticCacheConfig): UseSemanticCacheReturn<T>

interface UseSemanticCacheConfig {
  similarityThreshold?: number       // Default: 0.85 (0-1)
  ttlMs?: number                     // Default: 1 hour
  maxCacheSize?: number              // Default: 1000
  embeddingModel?: string            // Default: 'text-embedding-3-small'
}

interface UseSemanticCacheReturn<T> {
  search: (prompt: string) => Promise<{
    entry: { prompt: string; response: T } | null
    similarity: number
    isHit: boolean
    searchTimeMs: number
  }>
  set: (prompt: string, response: T, metadata?: {
    model?: string
    tokensSaved?: number
  }) => Promise<string>

  invalidate: (id: string) => Promise<void>
  invalidateByPrompt: (prompt: string, threshold?: number) => Promise<number>
  warmCache: (entries: Array<{ prompt: string; response: T }>) => Promise<void>
  exportCache: () => Promise<Array<{ prompt: string; response: T }>>
  importCache: (entries: Array<{
    prompt: string
    response: T
    embedding?: Float32Array
  }>) => Promise<void>

  isReady: boolean
  isSearching: boolean
  stats: CacheStats
  updateThreshold: (threshold: number) => void
  clearCache: () => Promise<void>
}
```

### Examples

#### Basic Semantic Caching

```tsx
import { useSemanticCache } from '@clarity-chat/react/hooks/clarity-tokens'

function SemanticCachedChat() {
  const cache = useSemanticCache<string>({
    similarityThreshold: 0.92,
    ttlMs: 3600000, // 1 hour
  })

  const handleQuery = async (query: string) => {
    if (!cache.isReady) {
      return 'Cache initializing...'
    }

    // Check semantic cache first
    const cached = await cache.search(query)

    if (cached.isHit && cached.entry) {
      console.log(`Cache hit! Similarity: ${cached.similarity.toFixed(2)}`)
      console.log(`Search time: ${cached.searchTimeMs}ms`)
      return cached.entry.response
    }

    // Cache miss - call API
    console.log('Cache miss - calling LLM')
    const response = await callLLM(query)

    // Store in cache
    await cache.set(query, response, {
      model: 'gpt-4o',
      tokensSaved: estimateTokens(response),
    })

    return response
  }

  return (
    <div>
      <ChatInterface onSend={handleQuery} />
      <CacheStats>
        Hit rate: {(cache.stats.hitRate * 100).toFixed(1)}%
        Total entries: {cache.stats.totalEntries}
        Tokens saved: {cache.stats.totalTokensSaved.toLocaleString()}
      </CacheStats>
    </div>
  )
}
```

#### Pre-warm Cache with Common Queries

```tsx
function WarmSemanticCache() {
  const cache = useSemanticCache()

  useEffect(() => {
    if (cache.isReady) {
      cache.warmCache([
        {
          prompt: 'What are your business hours?',
          response: 'We are open Monday-Friday, 9 AM - 5 PM EST.'
        },
        {
          prompt: 'How do I reset my password?',
          response: 'Click "Forgot Password" on the login page and follow the email instructions.'
        },
        {
          prompt: 'What payment methods do you accept?',
          response: 'We accept Visa, Mastercard, American Express, and PayPal.'
        },
      ])
      console.log('Cache pre-warmed with common queries')
    }
  }, [cache.isReady])

  return <ChatInterface />
}
```

#### Export/Import Cache for Persistence

```tsx
function PersistentSemanticCache() {
  const cache = useSemanticCache()

  // Export cache before unmount
  useEffect(() => {
    return () => {
      if (cache.isReady) {
        cache.exportCache().then(entries => {
          localStorage.setItem('semantic-cache', JSON.stringify(entries))
        })
      }
    }
  }, [cache.isReady])

  // Import cache on mount
  useEffect(() => {
    if (cache.isReady) {
      const stored = localStorage.getItem('semantic-cache')
      if (stored) {
        const entries = JSON.parse(stored)
        cache.importCache(entries)
        console.log(`Restored ${entries.length} cache entries`)
      }
    }
  }, [cache.isReady])

  return <ChatInterface />
}
```

#### Adjust Similarity Threshold Dynamically

```tsx
function AdaptiveThresholdCache() {
  const cache = useSemanticCache({ similarityThreshold: 0.85 })
  const [hitRate, setHitRate] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setHitRate(cache.stats.hitRate)

      // Adjust threshold based on hit rate
      if (cache.stats.hitRate < 0.3) {
        // Too strict - lower threshold
        cache.updateThreshold(0.82)
        console.log('Lowering similarity threshold to increase hit rate')
      } else if (cache.stats.hitRate > 0.7) {
        // Too loose - raise threshold
        cache.updateThreshold(0.90)
        console.log('Raising similarity threshold for better quality')
      }
    }, 30000) // Check every 30s

    return () => clearInterval(interval)
  }, [cache])

  return (
    <div>
      <p>Hit rate: {(hitRate * 100).toFixed(1)}%</p>
      <ChatInterface />
    </div>
  )
}
```

### How It Works

1. **Query embedding**: User prompt is converted to vector embedding
2. **Similarity search**: Cosine similarity computed against cached embeddings
3. **Threshold check**: If similarity ≥ threshold, cache hit
4. **Response return**: Cached response returned with similarity score

### Similarity Threshold Guidelines

- **0.95-1.0**: Near-exact matches only (very strict)
- **0.90-0.94**: High similarity required (recommended for production)
- **0.85-0.89**: Moderate similarity (default, good balance)
- **0.80-0.84**: More lenient (higher hit rate, lower quality)
- **Below 0.80**: Too loose (risk of incorrect responses)

### When to Use

- **Use for:** FAQ bots, customer support, repetitive queries
- **Best when:** Users ask semantically similar questions differently
- **Avoid when:** Responses must be deterministic or user-specific

---

## useExactCache

**Deterministic exact-match caching for LLM responses.**

Uses SHA-256 hashing for stable cache keys and supports multiple storage backends.

### Signature

```typescript
function useExactCache(config: UseExactCacheConfig): UseExactCacheReturn

interface UseExactCacheConfig {
  store: CacheStore                    // Storage backend
  ttlMs?: number                       // Default: 7 days
  includeMetadataInKey?: boolean       // Default: false
  excludeFieldsFromKey?: string[]      // Default: ['id', 'createdAt']
}

interface CacheStore {
  get: (key: string) => Promise<string | null>
  set: (key: string, value: string, ttlMs?: number) => Promise<void>
  del?: (key: string) => Promise<void>
  clear?: () => Promise<void>
  keys?: () => Promise<string[]>
}

interface UseExactCacheReturn {
  get: (key: string) => Promise<LLMResponse | null>
  set: (key: string, value: LLMResponse, ttlMs?: number) => Promise<void>
  del: (key: string) => Promise<void>

  makeKey: (req: LLMRequest) => string
  getForRequest: (req: LLMRequest) => Promise<LLMResponse | null>
  setForRequest: (req: LLMRequest, res: LLMResponse, ttlMs?: number) => Promise<void>

  clear: () => Promise<void>
  stats: CacheStats
  invalidateByPattern: (pattern: RegExp) => Promise<number>
  prefetch: (requests: LLMRequest[]) => Promise<void>
}
```

### Examples

#### IndexedDB Storage

```tsx
import {
  useExactCache,
  createIndexedDBStore
} from '@clarity-chat/react/hooks/clarity-tokens'

function PersistentCache() {
  const store = React.useMemo(() =>
    createIndexedDBStore('clarity-cache', 'responses'),
    []
  )

  const cache = useExactCache({
    store,
    ttlMs: 7 * 24 * 3600 * 1000, // 7 days
  })

  const handleSend = async (request: LLMRequest) => {
    // Check cache using automatic key generation
    const cached = await cache.getForRequest(request)
    if (cached) {
      console.log('Cache hit from IndexedDB')
      return cached
    }

    // Call API
    const response = await callLLM(request)

    // Cache with automatic key generation
    await cache.setForRequest(request, response)

    return response
  }

  return (
    <div>
      <p>Cache size: {cache.stats.size} entries</p>
      <p>Hit rate: {(cache.stats.hitRate * 100).toFixed(1)}%</p>
    </div>
  )
}
```

#### In-Memory Storage

```tsx
import {
  useExactCache,
  createInMemoryStore
} from '@clarity-chat/react/hooks/clarity-tokens'

function MemoryCache() {
  const store = React.useMemo(() =>
    createInMemoryStore(1000), // Max 1000 entries (LRU)
    []
  )

  const cache = useExactCache({
    store,
    ttlMs: 3600000, // 1 hour
  })

  return <ChatInterface cache={cache} />
}
```

#### Manual Key Management

```tsx
function ManualKeyCache() {
  const cache = useExactCache({
    store: createIndexedDBStore(),
  })

  const handleSend = async (request: LLMRequest) => {
    // Generate key manually
    const key = cache.makeKey(request)
    console.log('Cache key:', key)

    // Check cache
    const cached = await cache.get(key)
    if (cached) return cached

    // Call API and cache
    const response = await callLLM(request)
    await cache.set(key, response)

    return response
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Pattern-based Invalidation

```tsx
function CacheInvalidation() {
  const cache = useExactCache({
    store: createIndexedDBStore(),
  })

  const invalidateModel = async (modelName: string) => {
    // Invalidate all entries for a specific model
    const pattern = new RegExp(`"model":"${modelName}"`)
    const count = await cache.invalidateByPattern(pattern)
    console.log(`Invalidated ${count} entries for model ${modelName}`)
  }

  const invalidateProvider = async (provider: string) => {
    // Invalidate all entries for a provider
    const pattern = new RegExp(`"provider":"${provider}"`)
    const count = await cache.invalidateByPattern(pattern)
    console.log(`Invalidated ${count} entries for provider ${provider}`)
  }

  return (
    <div>
      <button onClick={() => invalidateModel('gpt-4o')}>
        Clear GPT-4o Cache
      </button>
      <button onClick={() => cache.clear()}>
        Clear All Cache
      </button>
    </div>
  )
}
```

#### Custom Storage Backend

```tsx
// Redis-backed storage
function createRedisStore(redisClient): CacheStore {
  return {
    async get(key: string): Promise<string | null> {
      return await redisClient.get(key)
    },

    async set(key: string, value: string, ttlMs?: number): Promise<void> {
      if (ttlMs) {
        await redisClient.setex(key, Math.ceil(ttlMs / 1000), value)
      } else {
        await redisClient.set(key, value)
      }
    },

    async del(key: string): Promise<void> {
      await redisClient.del(key)
    },

    async clear(): Promise<void> {
      await redisClient.flushdb()
    },

    async keys(): Promise<string[]> {
      return await redisClient.keys('*')
    },
  }
}

function RedisCache({ redisClient }) {
  const store = React.useMemo(() => createRedisStore(redisClient), [redisClient])
  const cache = useExactCache({ store })

  return <ChatInterface cache={cache} />
}
```

### Cache Key Generation

The hook generates stable cache keys using:

1. **Canonical JSON**: Sorts object keys for stability
2. **SHA-256 hash**: Produces deterministic 256-bit hash
3. **Excluded fields**: Ignores `id`, `createdAt` by default
4. **Metadata option**: Include/exclude metadata from key

```typescript
// These produce the SAME cache key:
const req1 = {
  model: 'gpt-4o',
  provider: 'openai',
  messages: [{ role: 'user', content: 'Hello' }],
  temperature: 0.7,
  id: 'abc123', // Excluded
}

const req2 = {
  temperature: 0.7,
  messages: [{ role: 'user', content: 'Hello' }],
  provider: 'openai',
  model: 'gpt-4o',
  id: 'xyz789', // Excluded
}

cache.makeKey(req1) === cache.makeKey(req2) // true
```

### When to Use

- **Use for:** Deterministic caching where exact input = exact output
- **Best when:** Temperature = 0, identical requests, production APIs
- **Avoid when:** Temperature > 0 or responses vary for same input

---

## useTokenLimitGuard

**Enforces token limits with configurable policies to handle over-budget prompts.**

### Signature

```typescript
function useTokenLimitGuard(config: UseTokenLimitGuardConfig): UseTokenLimitGuardReturn

interface UseTokenLimitGuardConfig {
  maxInputTokens: number              // Hard limit
  policy: GuardPolicy                 // 'truncate' | 'summarize' | 'hybrid' | 'refuse'
  summarizeFn?: (text: string, targetTokens: number) => Promise<string>
  model?: string                      // For token counting
  preserveSystemMessages?: boolean    // Keep system messages intact
  minMessagesToKeep?: number         // Minimum messages to preserve
}

interface UseTokenLimitGuardReturn {
  guardMessages: (messages: ChatMessage[]) => Promise<GuardResult>
  isWithinLimit: (messages: ChatMessage[]) => boolean
  countTokens: (messages: ChatMessage[]) => number
  config: UseTokenLimitGuardConfig
  updateConfig: (config: Partial<UseTokenLimitGuardConfig>) => void
}

interface GuardResult {
  messages: ChatMessage[]
  removedTokens: number
  policyApplied: GuardPolicy | 'none'
  originalTokens: number
  finalTokens: number
  summary?: string                   // If summarization was applied
}
```

### Examples

#### Truncate Policy

```tsx
import { useTokenLimitGuard } from '@clarity-chat/react/hooks/clarity-tokens'

function TruncateGuard() {
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'truncate',
    preserveSystemMessages: true,
    minMessagesToKeep: 2,
  })

  const handleSend = async (messages: ChatMessage[]) => {
    const { messages: safeMessages, removedTokens } = await guard.guardMessages(messages)

    if (removedTokens > 0) {
      console.log(`Truncated ${removedTokens} tokens from conversation history`)
    }

    return await sendToLLM(safeMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Summarize Policy

```tsx
function SummarizeGuard() {
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'summarize',
    summarizeFn: async (text, targetTokens) => {
      // Call LLM to summarize
      const response = await callLLM([
        {
          role: 'system',
          content: `Summarize the following conversation in approximately ${targetTokens} tokens. Preserve key information and context.`
        },
        {
          role: 'user',
          content: text
        }
      ])
      return response
    },
  })

  const handleSend = async (messages: ChatMessage[]) => {
    const {
      messages: safeMessages,
      summary,
      removedTokens
    } = await guard.guardMessages(messages)

    if (summary) {
      console.log('Created summary:', summary)
      console.log(`Reduced tokens by ${removedTokens}`)
    }

    return await sendToLLM(safeMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Hybrid Policy (Recommended)

```tsx
function HybridGuard() {
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'hybrid',
    summarizeFn: async (text, targetTokens) => {
      // Use cheaper model for summarization
      return await callLLM([
        { role: 'system', content: `Summarize in ${targetTokens} tokens.` },
        { role: 'user', content: text }
      ], { model: 'gpt-4o-mini' })
    },
  })

  const handleSend = async (messages: ChatMessage[]) => {
    // Hybrid policy:
    // 1. First truncates to ~120% of limit
    // 2. Then summarizes if still over
    const { messages: safeMessages, policyApplied } = await guard.guardMessages(messages)

    console.log(`Policy applied: ${policyApplied}`)

    return await sendToLLM(safeMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Refuse Policy with Error Handling

```tsx
function RefuseGuard() {
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'refuse',
  })

  const handleSend = async (messages: ChatMessage[]) => {
    try {
      const { messages: safeMessages } = await guard.guardMessages(messages)
      return await sendToLLM(safeMessages)
    } catch (error) {
      if (error instanceof BudgetExceededError) {
        alert(`Cannot send: ${error.currentTokens} tokens exceeds limit of ${error.maxTokens}`)
        return null
      }
      throw error
    }
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Pre-flight Check

```tsx
function PreflightCheck() {
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'hybrid',
    summarizeFn: summarize,
  })

  const [canSend, setCanSend] = useState(true)

  const handleInputChange = (messages: ChatMessage[]) => {
    const tokens = guard.countTokens(messages)
    const withinLimit = guard.isWithinLimit(messages)

    setCanSend(withinLimit)

    console.log(`Tokens: ${tokens} / ${guard.config.maxInputTokens}`)
  }

  return (
    <div>
      <ChatInterface
        onInputChange={handleInputChange}
        disabled={!canSend}
      />
      {!canSend && (
        <Alert>
          Message too long. Will be automatically compressed before sending.
        </Alert>
      )}
    </div>
  )
}
```

### Policy Comparison

| Policy | Pros | Cons | Best For |
|--------|------|------|----------|
| **truncate** | Fast, deterministic | Loses context | Simple chats, non-critical context |
| **summarize** | Preserves context | Costs tokens, slower | Long conversations, important context |
| **hybrid** | Balanced | More complex | Production apps (recommended) |
| **refuse** | Explicit control | Disrupts UX | Strict compliance requirements |

### Policy Behavior

```typescript
// truncate: Removes oldest non-system messages first
truncateMessages([msg1, msg2, msg3, msg4, system])
// → [msg3, msg4, system] (dropped msg1, msg2)

// summarize: Creates synthetic summary message
summarizeMessages([msg1, msg2, msg3, msg4])
// → [{ role: 'system', content: '[Previous conversation summary]\n...' }, msg3, msg4]

// hybrid: Truncate first, then summarize if needed
hybridGuard([many messages])
// 1. Truncate to 120% of limit
// 2. If still over, summarize the truncated history

// refuse: Throws BudgetExceededError
refuseGuard([too many messages])
// → throw new BudgetExceededError(currentTokens, maxTokens)
```

### When to Use

- **Use for:** Ensuring prompts fit within model context windows
- **Best when:** Long conversations, context accumulation, production apps
- **Policy choice:** Hybrid for most apps, truncate for speed, summarize for quality

---

## useContextInjector

**Injects retrieved context chunks into chat messages for RAG (Retrieval-Augmented Generation).**

### Signature

```typescript
function useContextInjector(config?: UseContextInjectorConfig): UseContextInjectorReturn

interface UseContextInjectorConfig {
  template?: (chunks: RetrievedChunk[]) => string
  placement?: ContextPlacement            // 'system' | 'beforeLastUser' | 'afterSystem' | 'custom'
  maxContextTokens?: number
  countTokens?: (text: string) => number
  contextHeader?: string
  contextFooter?: string
  customInject?: (messages: ChatMessage[], context: string) => ChatMessage[]
  includeSourceReferences?: boolean       // Default: true
  maxChunks?: number                      // Default: 5
}

interface UseContextInjectorReturn {
  inject: (messages: ChatMessage[], chunks: RetrievedChunk[]) => ChatMessage[]
  injectWithMetadata: (messages: ChatMessage[], chunks: RetrievedChunk[]) => InjectionResult
  formatChunks: (chunks: RetrievedChunk[]) => string
  config: UseContextInjectorConfig
  updateConfig: (config: Partial<UseContextInjectorConfig>) => void
}

interface RetrievedChunk {
  text: string
  score: number                          // Relevance score (0-1)
  source?: string                        // Source document/URL
  metadata?: Record<string, unknown>
}
```

### Examples

#### Basic RAG Implementation

```tsx
import { useContextInjector } from '@clarity-chat/react/hooks/clarity-tokens'
import { useVectorSearch } from '@clarity-chat/react/hooks/clarity-tokens'

function RAGChat() {
  const vectorSearch = useVectorSearch({ maxResults: 5 })
  const injector = useContextInjector({
    placement: 'system',
    maxContextTokens: 2000,
    includeSourceReferences: true,
  })

  const handleSend = async (userMessage: string, messages: ChatMessage[]) => {
    // 1. Retrieve relevant context
    const chunks = await vectorSearch.search(userMessage)
    console.log(`Found ${chunks.length} relevant chunks`)

    // 2. Inject context into messages
    const augmentedMessages = injector.inject(
      [...messages, { role: 'user', content: userMessage }],
      chunks
    )

    // 3. Send to LLM
    return await sendToLLM(augmentedMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Custom Formatting Template

```tsx
function CustomTemplateRAG() {
  const injector = useContextInjector({
    placement: 'system',
    template: (chunks) => {
      // Custom markdown formatting
      const formattedChunks = chunks.map((chunk, i) => {
        return `
**Context ${i + 1}** (Relevance: ${(chunk.score * 100).toFixed(1)}%)
${chunk.source ? `_Source: ${chunk.source}_\n` : ''}
${chunk.text}
`
      }).join('\n---\n')

      return `
# Retrieved Context

The following context was retrieved from our knowledge base to help answer the user's question:

${formattedChunks}

Please use this context to provide an accurate, well-sourced response.
`
    },
  })

  return <ChatInterface injector={injector} />
}
```

#### Injection Placement Options

```tsx
function PlacementDemo() {
  // Option 1: Inject as system message (prepend)
  const systemInjector = useContextInjector({
    placement: 'system',
  })

  // Option 2: Inject after existing system messages
  const afterSystemInjector = useContextInjector({
    placement: 'afterSystem',
  })

  // Option 3: Inject before last user message (most recent context)
  const beforeUserInjector = useContextInjector({
    placement: 'beforeLastUser',
  })

  // Option 4: Custom injection logic
  const customInjector = useContextInjector({
    placement: 'custom',
    customInject: (messages, contextText) => {
      // Insert context in the middle of conversation
      const midpoint = Math.floor(messages.length / 2)
      return [
        ...messages.slice(0, midpoint),
        { role: 'system', content: contextText },
        ...messages.slice(midpoint),
      ]
    },
  })

  return <div>...</div>
}
```

#### Token-Limited Context Injection

```tsx
function TokenLimitedRAG() {
  const injector = useContextInjector({
    placement: 'system',
    maxContextTokens: 1500,
    countTokens: (text) => Math.ceil(text.length / 4),
  })

  const handleSend = async (userMessage: string, messages: ChatMessage[]) => {
    const chunks = await retrieveChunks(userMessage)

    // Inject with metadata to see truncation info
    const {
      messages: augmentedMessages,
      injectedTokens,
      chunksUsed,
      truncated
    } = injector.injectWithMetadata(
      [...messages, { role: 'user', content: userMessage }],
      chunks
    )

    if (truncated) {
      console.warn(`Context truncated to fit ${injectedTokens} tokens`)
    }
    console.log(`Used ${chunksUsed} chunks, ${injectedTokens} tokens`)

    return await sendToLLM(augmentedMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Multi-Source RAG

```tsx
function MultiSourceRAG() {
  const injector = useContextInjector({
    placement: 'system',
    includeSourceReferences: true,
    contextHeader: 'Relevant information from multiple sources:',
    contextFooter: 'Use the above context to provide a well-sourced answer. Cite sources when appropriate.',
  })

  const handleSend = async (query: string, messages: ChatMessage[]) => {
    // Retrieve from multiple sources
    const [docs, faqs, support] = await Promise.all([
      searchDocumentation(query),
      searchFAQs(query),
      searchSupportTickets(query),
    ])

    // Combine and rank
    const allChunks: RetrievedChunk[] = [
      ...docs.map(d => ({ ...d, source: 'Documentation' })),
      ...faqs.map(f => ({ ...f, source: 'FAQ' })),
      ...support.map(s => ({ ...s, source: 'Support Tickets' })),
    ].sort((a, b) => b.score - a.score).slice(0, 5)

    const augmentedMessages = injector.inject(
      [...messages, { role: 'user', content: query }],
      allChunks
    )

    return await sendToLLM(augmentedMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Dynamic Context Adjustment

```tsx
function AdaptiveContextRAG() {
  const [maxTokens, setMaxTokens] = useState(2000)
  const injector = useContextInjector({
    placement: 'system',
    maxContextTokens: maxTokens,
  })

  const handleSend = async (query: string, messages: ChatMessage[]) => {
    const chunks = await retrieveChunks(query)

    // Adjust context size based on conversation length
    const conversationTokens = estimateTokens(messages)
    if (conversationTokens > 6000) {
      // Long conversation - reduce context to fit
      injector.updateConfig({ maxContextTokens: 1000 })
    } else {
      // Short conversation - can include more context
      injector.updateConfig({ maxContextTokens: 3000 })
    }

    const augmentedMessages = injector.inject(
      [...messages, { role: 'user', content: query }],
      chunks
    )

    return await sendToLLM(augmentedMessages)
  }

  return <ChatInterface onSend={handleSend} />
}
```

### Placement Comparison

| Placement | Position | Best For |
|-----------|----------|----------|
| `system` | Prepend as system message | Most use cases |
| `afterSystem` | After existing system messages | Preserving instruction order |
| `beforeLastUser` | Before latest user message | Emphasizing recency |
| `custom` | Custom logic | Complex requirements |

### When to Use

- **Use for:** RAG systems, knowledge base integration, document Q&A
- **Best when:** You need to inject external context into prompts
- **Combine with:** `useVectorSearch` or external vector databases

---

## useAdaptiveModel

**Intelligently routes requests to optimal models/providers based on configurable rules.**

### Signature

```typescript
function useAdaptiveModel(config: UseAdaptiveModelConfig): UseAdaptiveModelReturn

interface UseAdaptiveModelConfig {
  rules: RoutingRule[]                   // Array of rules (first match wins)
  defaultRoute: RouteResult              // Fallback route
  countTokens?: (messages: Array<{ content: string }>) => number
  enableLogging?: boolean                // Log routing decisions
}

type RoutingRule = (req: LLMRequest) => Partial<RouteResult> | null

interface UseAdaptiveModelReturn {
  route: (req: LLMRequest) => LLMRequest
  routeWithDecision: (req: LLMRequest) => {
    request: LLMRequest
    decision: RoutingDecision
  }
  history: RoutingDecision[]
  addRule: (rule: RoutingRule, position?: number) => void
  removeRule: (index: number) => void
  clearHistory: () => void
  config: UseAdaptiveModelConfig
}
```

### Examples

#### Size-Based Routing

```tsx
import {
  useAdaptiveModel,
  createSizeBasedRule
} from '@clarity-chat/react/hooks/clarity-tokens'

function SizeOptimizedChat() {
  const router = useAdaptiveModel({
    rules: [
      // Short requests → fast, cheap model
      createSizeBasedRule(
        [
          { maxTokens: 500, route: { model: 'gpt-4o-mini' } },
          { maxTokens: 2000, route: { model: 'gpt-4o' } },
        ],
        countTokens
      ),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
  })

  const handleSend = async (request: LLMRequest) => {
    const routedRequest = router.route(request)
    console.log(`Routed to: ${routedRequest.model}`)
    return await sendToLLM(routedRequest)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Content-Based Routing

```tsx
function ContentAwareRouting() {
  const router = useAdaptiveModel({
    rules: [
      // Code-related queries → Claude
      createContentBasedRule([
        {
          pattern: /code|function|class|implement|debug|fix/i,
          route: { provider: 'anthropic', model: 'claude-sonnet-4-20250514' }
        },
      ]),

      // Creative writing → GPT-4o
      createContentBasedRule([
        {
          pattern: /write|story|poem|creative|imagine/i,
          route: { provider: 'openai', model: 'gpt-4o' }
        },
      ]),

      // Analysis/reasoning → o1
      createContentBasedRule([
        {
          pattern: /analyze|reason|prove|solve|calculate/i,
          route: { provider: 'openai', model: 'o1' }
        },
      ]),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
    enableLogging: true,
  })

  return <ChatInterface router={router} />
}
```

#### Tier-Based Routing

```tsx
function UserTierRouting({ user }) {
  const router = useAdaptiveModel({
    rules: [
      createTierBasedRule({
        free: { model: 'gpt-4o-mini' },
        pro: { model: 'gpt-4o' },
        enterprise: { model: 'gpt-4.1' },
      }),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o-mini' },
  })

  const handleSend = async (message: string) => {
    const request: LLMRequest = {
      id: generateId(),
      provider: 'openai',
      model: 'gpt-4o',
      messages: [{ role: 'user', content: message }],
      metadata: { userTier: user.tier },
    }

    const routedRequest = router.route(request)
    return await sendToLLM(routedRequest)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Cost-Optimized Routing

```tsx
function CostOptimizedRouting() {
  const router = useAdaptiveModel({
    rules: [
      createCostOptimizedRule(
        { provider: 'openai', model: 'gpt-4o-mini' },  // Cheap
        { provider: 'openai', model: 'gpt-4o' },       // Expensive
        {
          maxTokensForCheap: 1000,
          simplePatterns: [
            /^(yes|no|maybe)$/i,
            /^thanks|thank you$/i,
            /what time|what day/i,
          ],
          countTokens,
        }
      ),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
  })

  return <ChatInterface router={router} />
}
```

#### Latency-Based Routing

```tsx
function LatencyOptimizedRouting() {
  const router = useAdaptiveModel({
    rules: [
      createLatencyBasedRule(
        { provider: 'openai', model: 'gpt-4o-mini' },  // Fast
        { provider: 'openai', model: 'o1' }            // Slow but smart
      ),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
  })

  const handleSend = async (message: string, urgent: boolean) => {
    const request: LLMRequest = {
      id: generateId(),
      provider: 'openai',
      model: 'gpt-4o',
      messages: [{ role: 'user', content: message }],
      metadata: { lowLatency: urgent },
    }

    const routedRequest = router.route(request)
    return await sendToLLM(routedRequest)
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Multi-Rule Routing

```tsx
function ComprehensiveRouting({ user }) {
  const router = useAdaptiveModel({
    rules: [
      // Rule 1: User tier (highest priority)
      createTierBasedRule({
        enterprise: { model: 'gpt-4.1' },
      }),

      // Rule 2: Content type
      createContentBasedRule([
        { pattern: /code/i, route: { model: 'claude-sonnet-4-20250514' } },
      ]),

      // Rule 3: Size optimization
      createSizeBasedRule(
        [{ maxTokens: 500, route: { model: 'gpt-4o-mini' } }],
        countTokens
      ),

      // Rule 4: Cost optimization (lowest priority)
      createCostOptimizedRule(
        { model: 'gpt-4o-mini' },
        { model: 'gpt-4o' },
        { maxTokensForCheap: 1000, countTokens }
      ),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
    enableLogging: true,
  })

  // View routing decisions
  useEffect(() => {
    const interval = setInterval(() => {
      const recentDecisions = router.history.slice(-10)
      console.log('Recent routing decisions:', recentDecisions)
    }, 30000)
    return () => clearInterval(interval)
  }, [router])

  return <ChatInterface router={router} />
}
```

#### Dynamic Rule Management

```tsx
function DynamicRules() {
  const router = useAdaptiveModel({
    rules: [],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
  })

  // Add rule during A/B test
  useEffect(() => {
    if (isABTestActive) {
      const rule: RoutingRule = (req) => {
        if (Math.random() < 0.5) {
          return { model: 'gpt-4o' }
        } else {
          return { model: 'claude-sonnet-4-20250514' }
        }
      }
      router.addRule(rule, 0) // Add at beginning (highest priority)

      return () => {
        router.removeRule(0)
      }
    }
  }, [isABTestActive])

  return <ChatInterface router={router} />
}
```

### Pre-built Rules

| Rule | Purpose | Parameters |
|------|---------|------------|
| `createSizeBasedRule` | Route by token count | `thresholds`, `countTokens` |
| `createContentBasedRule` | Route by content patterns | `patterns` (regex) |
| `createTierBasedRule` | Route by user tier | `tiers` (tier → route) |
| `createIntentBasedRule` | Route by request intent | `intents` (intent → route) |
| `createCostOptimizedRule` | Optimize for cost | `cheapModel`, `expensiveModel`, `options` |
| `createLatencyBasedRule` | Optimize for latency | `fastModel`, `standardModel` |

### When to Use

- **Use for:** Cost optimization, latency requirements, user tiers
- **Best when:** Multiple models available, diverse request patterns
- **Combine with:** `useCostTracker` to measure routing effectiveness

---

## useTokenBudget

**Session-level token budget management with enforcement and alerts.**

### Signature

```typescript
function useTokenBudget(config: UseTokenBudgetConfig): UseTokenBudgetReturn

interface UseTokenBudgetConfig {
  sessionBudgetTokens: number            // Total session budget
  persist?: boolean                      // Save to localStorage
  storageKey?: string                    // Storage key
  period?: 'session' | 'daily' | 'weekly' | 'monthly'
  alertThresholds?: {
    warning?: number                     // 0-1 (e.g., 0.8 = 80%)
    critical?: number                    // 0-1 (e.g., 0.95 = 95%)
  }
  onThresholdExceeded?: (level: 'warning' | 'critical', remaining: number) => void
}

interface UseTokenBudgetReturn {
  remainingTokens: number
  usedTokens: number
  status: BudgetStatus
  registerUsage: (usage: {
    inputTokens: number
    outputTokens: number
    model?: string
    requestId?: string
  }) => void
  assertCanSpend: (plannedInputTokens: number) => void  // Throws if exceeds
  canSpend: (plannedInputTokens: number) => boolean     // Returns boolean
  reserve: (tokens: number) => { reserved: number; remaining: number }
  release: (tokens: number) => void
  getHistory: () => TokenUsageRecord[]
  reset: () => void
  config: UseTokenBudgetConfig
}
```

### Examples

#### Basic Budget Tracking

```tsx
import { useTokenBudget } from '@clarity-chat/react/hooks/clarity-tokens'

function BudgetTrackedChat() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 200000,
    alertThresholds: {
      warning: 0.8,    // 80%
      critical: 0.95,  // 95%
    },
    onThresholdExceeded: (level, remaining) => {
      if (level === 'critical') {
        toast.warning(`Only ${remaining} tokens remaining!`)
      }
    },
  })

  const handleSend = async (input: string) => {
    const estimatedTokens = estimateTokens(input)

    // Throw error if budget would be exceeded
    budget.assertCanSpend(estimatedTokens)

    const response = await sendToLLM(input)

    // Register actual usage
    budget.registerUsage({
      inputTokens: response.usage.input,
      outputTokens: response.usage.output,
    })

    return response
  }

  return (
    <div>
      <BudgetIndicator
        used={budget.usedTokens}
        total={budget.config.sessionBudgetTokens}
        alertLevel={budget.status.alertLevel}
      />
      <ChatInterface onSend={handleSend} />
    </div>
  )
}
```

#### Pre-flight Budget Check

```tsx
function PreflightBudgetCheck() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 100000,
  })

  const [inputValue, setInputValue] = useState('')
  const [canSend, setCanSend] = useState(true)

  useEffect(() => {
    const estimatedTokens = estimateTokens(inputValue)
    setCanSend(budget.canSpend(estimatedTokens))
  }, [inputValue, budget])

  return (
    <div>
      <textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button disabled={!canSend}>
        Send ({estimateTokens(inputValue)} tokens)
      </button>
      {!canSend && (
        <Alert severity="error">
          Insufficient budget. Remaining: {budget.remainingTokens} tokens
        </Alert>
      )}
    </div>
  )
}
```

#### Token Reservation

```tsx
function ReservationPattern() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 200000,
  })

  const handleStreamingRequest = async (input: string) => {
    const estimatedTokens = estimateTokens(input) + 2000 // Reserve for output

    // Reserve tokens upfront
    const { reserved, remaining } = budget.reserve(estimatedTokens)
    console.log(`Reserved ${reserved} tokens, ${remaining} remaining`)

    try {
      let actualInputTokens = 0
      let actualOutputTokens = 0

      // Stream response
      for await (const chunk of streamLLM(input)) {
        actualOutputTokens += chunk.tokens
      }

      actualInputTokens = estimateTokens(input)

      // Register actual usage
      budget.registerUsage({
        inputTokens: actualInputTokens,
        outputTokens: actualOutputTokens,
      })

      // Release unused reservation
      const actualUsed = actualInputTokens + actualOutputTokens
      const unused = estimatedTokens - actualUsed
      if (unused > 0) {
        budget.release(unused)
        console.log(`Released ${unused} unused tokens`)
      }
    } catch (error) {
      // Release full reservation on error
      budget.release(reserved)
      throw error
    }
  }

  return <ChatInterface onSend={handleStreamingRequest} />
}
```

#### Persistent Budget

```tsx
function PersistentBudget() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 500000,
    persist: true,
    storageKey: 'my-app-token-budget',
    period: 'daily',
  })

  // Reset budget daily
  useEffect(() => {
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const msUntilMidnight = midnight.getTime() - Date.now()

    const timer = setTimeout(() => {
      budget.reset()
      console.log('Daily budget reset')
    }, msUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  return <ChatInterface budget={budget} />
}
```

#### Budget Analytics

```tsx
function BudgetAnalytics() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 200000,
  })

  const history = budget.getHistory()

  const stats = useMemo(() => {
    const totalInput = history.reduce((sum, r) => sum + r.inputTokens, 0)
    const totalOutput = history.reduce((sum, r) => sum + r.outputTokens, 0)
    const avgInputPerRequest = totalInput / history.length || 0
    const avgOutputPerRequest = totalOutput / history.length || 0

    return {
      totalInput,
      totalOutput,
      avgInputPerRequest,
      avgOutputPerRequest,
      requestCount: history.length,
    }
  }, [history])

  return (
    <div>
      <h3>Budget Analytics</h3>
      <p>Requests: {stats.requestCount}</p>
      <p>Total Input: {stats.totalInput.toLocaleString()} tokens</p>
      <p>Total Output: {stats.totalOutput.toLocaleString()} tokens</p>
      <p>Avg Input: {stats.avgInputPerRequest.toFixed(0)} tokens/request</p>
      <p>Avg Output: {stats.avgOutputPerRequest.toFixed(0)} tokens/request</p>
      <p>Remaining: {budget.remainingTokens.toLocaleString()} / {budget.config.sessionBudgetTokens.toLocaleString()}</p>
      <ProgressBar
        value={budget.status.percentUsed}
        color={
          budget.status.alertLevel === 'critical' ? 'error' :
          budget.status.alertLevel === 'warning' ? 'warning' :
          'primary'
        }
      />
    </div>
  )
}
```

### Budget Status

```typescript
interface BudgetStatus {
  remainingTokens: number      // Tokens remaining
  usedTokens: number          // Tokens used so far
  percentUsed: number         // Percentage (0-100)
  isOverBudget: boolean       // true if budget exceeded
  alertLevel: 'none' | 'warning' | 'critical'
}
```

### When to Use

- **Use for:** Session limits, cost control, preventing runaway usage
- **Best when:** Multi-turn conversations, user quotas, production apps
- **Combine with:** `useCostTracker` for cost-based limits

---

## useCostTracker

**Accumulates token usage and estimated costs with analytics.**

### Signature

```typescript
function useCostTracker(config?: UseCostTrackerConfig): UseCostTrackerReturn

interface UseCostTrackerConfig {
  pricing?: Record<string, ModelPricing>  // Custom pricing overrides
  persist?: boolean                       // Save to localStorage
  storageKey?: string
  maxHistoryEntries?: number             // Default: 1000
}

interface UseCostTrackerReturn {
  add: (res: LLMResponse, options?: { cached?: boolean; cachedTokens?: number }) => void
  totals: () => CostTotals
  history: () => CostEntry[]
  byModel: () => Record<string, CostTotals>
  byProvider: () => Record<string, CostTotals>
  forPeriod: (since: Date) => CostTotals
  reset: () => void
  exportJson: () => string
  exportCsv: () => string
  estimate: (model: string, inputTokens: number, outputTokens: number) => number
}
```

### Examples

#### Basic Cost Tracking

```tsx
import { useCostTracker } from '@clarity-chat/react/hooks/clarity-tokens'

function CostTrackedChat() {
  const cost = useCostTracker({
    persist: true,
  })

  const handleSend = async (input: string) => {
    const response = await callLLM(input)

    // Track cost
    cost.add(response)

    return response
  }

  const { costUsd, inputTokens, outputTokens, requestCount } = cost.totals()

  return (
    <div>
      <ChatInterface onSend={handleSend} />
      <CostDisplay>
        <p>Total cost: ${costUsd.toFixed(4)}</p>
        <p>Requests: {requestCount}</p>
        <p>Input tokens: {inputTokens.toLocaleString()}</p>
        <p>Output tokens: {outputTokens.toLocaleString()}</p>
      </CostDisplay>
    </div>
  )
}
```

#### Cost by Model

```tsx
function ModelCostBreakdown() {
  const cost = useCostTracker()

  const modelCosts = cost.byModel()

  return (
    <table>
      <thead>
        <tr>
          <th>Model</th>
          <th>Requests</th>
          <th>Tokens</th>
          <th>Cost</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(modelCosts).map(([model, data]) => (
          <tr key={model}>
            <td>{model}</td>
            <td>{data.requestCount}</td>
            <td>{(data.inputTokens + data.outputTokens).toLocaleString()}</td>
            <td>${data.costUsd.toFixed(4)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

#### Daily Cost Report

```tsx
function DailyCostReport() {
  const cost = useCostTracker()

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayCosts = cost.forPeriod(today)

  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayCosts = cost.forPeriod(yesterday)

  return (
    <div>
      <h3>Cost Report</h3>
      <div>
        <h4>Today</h4>
        <p>Cost: ${todayCosts.costUsd.toFixed(4)}</p>
        <p>Requests: {todayCosts.requestCount}</p>
      </div>
      <div>
        <h4>Yesterday</h4>
        <p>Cost: ${yesterdayCosts.costUsd.toFixed(4)}</p>
        <p>Requests: {yesterdayCosts.requestCount}</p>
      </div>
    </div>
  )
}
```

#### Export Analytics

```tsx
function CostExport() {
  const cost = useCostTracker()

  const exportJsonData = () => {
    const json = cost.exportJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cost-analytics-${new Date().toISOString()}.json`
    a.click()
  }

  const exportCsvData = () => {
    const csv = cost.exportCsv()
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cost-analytics-${new Date().toISOString()}.csv`
    a.click()
  }

  return (
    <div>
      <button onClick={exportJsonData}>Export JSON</button>
      <button onClick={exportCsvData}>Export CSV</button>
    </div>
  )
}
```

#### Pre-call Cost Estimation

```tsx
function CostEstimation() {
  const cost = useCostTracker()

  const handleSend = async (input: string) => {
    const inputTokens = estimateTokens(input)
    const estimatedOutputTokens = 500

    // Estimate cost before calling
    const estimatedCost = cost.estimate('gpt-4o', inputTokens, estimatedOutputTokens)
    console.log(`Estimated cost: $${estimatedCost.toFixed(6)}`)

    // Show confirmation for expensive requests
    if (estimatedCost > 0.05) {
      const confirmed = window.confirm(
        `This request will cost approximately $${estimatedCost.toFixed(4)}. Continue?`
      )
      if (!confirmed) return null
    }

    const response = await callLLM(input)
    cost.add(response)

    return response
  }

  return <ChatInterface onSend={handleSend} />
}
```

#### Track Cached Responses

```tsx
function CachedCostTracking() {
  const cost = useCostTracker()
  const cache = useExactCache({ store: createIndexedDBStore() })

  const handleSend = async (request: LLMRequest) => {
    const cached = await cache.getForRequest(request)

    if (cached) {
      // Track as cached (reduced cost)
      cost.add(cached, {
        cached: true,
        cachedTokens: cached.usage?.inputTokens || 0,
      })
      return cached
    }

    const response = await callLLM(request)
    await cache.setForRequest(request, response)
    cost.add(response)

    return response
  }

  const totals = cost.totals()
  const cacheSavings = totals.cachedTokens * 0.5 // Estimate 50% savings

  return (
    <div>
      <p>Total cost: ${totals.costUsd.toFixed(4)}</p>
      <p>Cache savings: ${cacheSavings.toFixed(4)}</p>
    </div>
  )
}
```

### Cost Analytics

```typescript
interface CostTotals {
  inputTokens: number
  outputTokens: number
  cachedTokens: number       // Tokens served from cache
  costUsd: number
  requestCount: number
}

interface CostEntry {
  timestamp: Date
  model: string
  provider: string
  inputTokens: number
  outputTokens: number
  cachedTokens: number
  costUsd: number
  requestId?: string
}
```

### When to Use

- **Use for:** Cost monitoring, budget enforcement, usage analytics
- **Best when:** Production apps, multi-tenant systems, cost accountability
- **Combine with:** `useTokenBudget` for combined token + cost limits

---

## Common Patterns

### Complete RAG Pipeline with Optimization

```tsx
function OptimizedRAGPipeline() {
  const optimization = useTokenOptimization({ model: 'gpt-4o' })
  const cache = useSemanticCache()
  const guard = useTokenLimitGuard({
    maxInputTokens: 8000,
    policy: 'hybrid',
    summarizeFn: async (text, targetTokens) => {
      const result = await optimization.compress(text, { targetRatio: 0.5 })
      return result.compressed
    },
  })
  const injector = useContextInjector({
    placement: 'system',
    maxContextTokens: 2000,
  })
  const budget = useTokenBudget({ sessionBudgetTokens: 500000 })
  const cost = useCostTracker()

  const handleQuery = async (query: string, messages: ChatMessage[]) => {
    // 1. Check semantic cache
    const cached = await cache.search(query)
    if (cached.isHit && cached.entry) {
      console.log('Cache hit!')
      return cached.entry.response
    }

    // 2. Retrieve context
    const chunks = await vectorSearch(query)

    // 3. Inject context
    const augmentedMessages = injector.inject(
      [...messages, { role: 'user', content: query }],
      chunks
    )

    // 4. Apply token limit guard
    const { messages: safeMessages } = await guard.guardMessages(augmentedMessages)

    // 5. Check budget
    const estimatedTokens = optimization.countChatTokens(safeMessages)
    budget.assertCanSpend(estimatedTokens)

    // 6. Send to LLM
    const response = await callLLM(safeMessages)

    // 7. Track usage
    budget.registerUsage({
      inputTokens: response.usage.input,
      outputTokens: response.usage.output,
    })
    cost.add(response)

    // 8. Cache response
    await cache.set(query, response.text)

    return response.text
  }

  return <ChatInterface onQuery={handleQuery} />
}
```

### Model Routing with Cost Tracking

```tsx
function CostOptimizedRouting() {
  const router = useAdaptiveModel({
    rules: [
      createSizeBasedRule(
        [{ maxTokens: 500, route: { model: 'gpt-4o-mini' } }],
        countTokens
      ),
    ],
    defaultRoute: { provider: 'openai', model: 'gpt-4o' },
  })
  const cost = useCostTracker()

  const handleSend = async (request: LLMRequest) => {
    const { request: routedRequest, decision } = router.routeWithDecision(request)

    console.log(`Routed to ${decision.routedModel} (${decision.reason})`)

    const response = await callLLM(routedRequest)
    cost.add(response)

    return response
  }

  // Monitor routing effectiveness
  useEffect(() => {
    const modelCosts = cost.byModel()
    console.log('Cost by model:', modelCosts)
  }, [cost])

  return <ChatInterface onSend={handleSend} />
}
```

---

## Troubleshooting

### Semantic Cache Not Hitting

**Problem:** Low cache hit rate despite similar queries.

**Solutions:**

1. Lower similarity threshold: `{ similarityThreshold: 0.82 }`
2. Pre-warm cache with common queries
3. Check embedding model consistency
4. Verify queries are actually similar

```tsx
// Debug similarity scores
const result = await cache.search(query)
console.log(`Similarity: ${result.similarity.toFixed(3)}`)
```

### Token Limit Guard Truncating Too Much

**Problem:** Guard removes important context.

**Solutions:**

1. Increase `maxInputTokens`
2. Use `preserveSystemMessages: true`
3. Switch from truncate to hybrid policy
4. Increase `minMessagesToKeep`

```tsx
guard.updateConfig({
  policy: 'hybrid',
  preserveSystemMessages: true,
  minMessagesToKeep: 4,
})
```

### Budget Exceeded Unexpectedly

**Problem:** `assertCanSpend` throws before actual usage.

**Solutions:**

1. Use token reservation for streaming
2. Increase buffer in estimates
3. Reset budget periodically
4. Use `canSpend` for soft checks

```tsx
// Use soft check for warnings
if (!budget.canSpend(estimatedTokens)) {
  console.warn('Approaching budget limit')
}
```

### Cache Growing Too Large

**Problem:** Memory or storage exhausted.

**Solutions:**

1. Set `maxCacheEntries`
2. Reduce `ttlMs` for faster expiration
3. Use LRU eviction (in-memory store)
4. Periodically call `clearCache()`

```tsx
const cache = useExactCache({
  store: createInMemoryStore(500), // Limit to 500 entries
  ttlMs: 1800000, // 30 minutes
})
```

### Compression Quality Too Low

**Problem:** Compressed text loses important information.

**Solutions:**

1. Increase `targetRatio` (e.g., 0.7 instead of 0.3)
2. Set `minQuality` threshold
3. Use extractive instead of llmlingua
4. Don't compress short messages

```tsx
const result = await compress(text, {
  targetRatio: 0.6,
  minQuality: 0.75,
  strategy: 'extractive',
})

if (result.quality < 0.7) {
  console.warn('Compression quality too low, using original')
  text = result.original
}
```

---

## Related Hooks

- **[Token Tracking](/docs/api/hooks/token.md)**: Basic token counting and tracking
- **[Performance](/docs/api/hooks/performance.md)**: Performance monitoring hooks
- **[Memory](/docs/api/hooks/memory.md)**: Context and memory management

---

## Migration from Basic Token Tracking

If you're currently using `useTokenTracker`, upgrade to Clarity Tokens for advanced features:

```tsx
// Before: Basic token tracking
import { useTokenTracker } from '@clarity-chat/react/hooks/token'

function OldChat() {
  const { totalTokens, addMessage } = useTokenTracker({
    modelName: 'gpt-4o',
  })

  // Limited to basic counting
}

// After: Advanced optimization
import { useTokenOptimization } from '@clarity-chat/react/hooks/clarity-tokens'

function NewChat() {
  const {
    countTokens,
    compress,
    getCached,
    estimateCost,
  } = useTokenOptimization({
    model: 'gpt-4o',
    enableCompression: true,
    enableCaching: true,
  })

  // Now with compression, caching, cost estimation
}
```

---

## Best Practices

### 1. Use useTokenOptimization for New Projects

Start with the all-in-one hook and enable features as needed:

```tsx
const optimization = useTokenOptimization({
  model: 'gpt-4o',
  enableCompression: true,
  enableCaching: true,
})
```

### 2. Combine Semantic and Exact Caching

Use semantic cache for similar queries, exact cache for deterministic responses:

```tsx
const semanticCache = useSemanticCache({ similarityThreshold: 0.90 })
const exactCache = useExactCache({ store: createIndexedDBStore() })

// Check semantic first (high recall), then exact (high precision)
```

### 3. Implement Hybrid Token Limit Guard

Best balance between context preservation and token limits:

```tsx
const guard = useTokenLimitGuard({
  maxInputTokens: 8000,
  policy: 'hybrid', // Truncate + summarize
  summarizeFn: async (text, targetTokens) => {
    return await summarizeWithLLM(text, targetTokens)
  },
})
```

### 4. Track Both Tokens and Cost

Combine budget and cost tracking for complete visibility:

```tsx
const budget = useTokenBudget({ sessionBudgetTokens: 200000 })
const cost = useCostTracker({ persist: true })

// Track both metrics after each request
budget.registerUsage({ inputTokens, outputTokens })
cost.add(response)
```

### 5. Use Adaptive Routing in Production

Optimize costs and latency with intelligent routing:

```tsx
const router = useAdaptiveModel({
  rules: [
    createTierBasedRule(tierRoutes),
    createSizeBasedRule(sizeRoutes, countTokens),
    createCostOptimizedRule(cheapModel, expensiveModel, options),
  ],
  defaultRoute: { provider: 'openai', model: 'gpt-4o' },
})
```
