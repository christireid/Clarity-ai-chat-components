# @clarity-chat/memory - API Reference

Complete API documentation for framework-agnostic memory utilities.

## Table of Contents

- [Quick Start](#quick-start)
- [Factory Functions](#factory-functions)
- [MemoryService](#memoryservice)
- [ImportanceScorer](#importancescorer)
- [DecayManager](#decaymanager)
- [Summarization](#summarization)
- [TokenCounter](#tokencounter)
- [TokenBudgetManager](#tokenbudgetmanager)
- [MemoryCompressor](#memorycompressor)
- [SemanticChunker](#semanticchunker)
- [ContextOptimizer](#contextoptimizer)
- [Types](#types)

---

## Quick Start

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Zero-config usage
const memory = clarityMemory()
await memory.initialize()

// Add memories
await memory.add('User prefers TypeScript', {
  type: 'semantic',
  importance: 0.9,
})

// Recall relevant memories
const results = await memory.recall('programming preferences')
```

---

## Factory Functions

### `clarityMemory(config?)`

Creates a configured ClarityMemory instance with smart defaults.

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  storage: { type: 'indexeddb' },
  embeddingProvider: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    cache: true,
    cacheSize: 1000,
  },
  tokenBudget: {
    maxTokens: 4096,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.15,
      recentContext: 0.3,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
  },
})
```

### `clarityMemoryHelpers`

Pre-configured helpers for common environments:

```typescript
import { clarityMemoryHelpers } from '@clarity-chat/memory'

// Browser with IndexedDB
const browserMemory = clarityMemoryHelpers.browser({
  embeddingProvider: { provider: 'openai', apiKey: '...' },
})

// Serverless (in-memory, stateless)
const serverlessMemory = clarityMemoryHelpers.serverless({
  embeddingProvider: { provider: 'openai', apiKey: '...' },
})

// Node.js
const nodeMemory = clarityMemoryHelpers.node({
  embeddingProvider: { provider: 'openai', apiKey: '...' },
})
```

---

## MemoryService

Main service for managing AI conversation memory.

### Constructor

```typescript
new MemoryService(
  config: MemoryServiceConfig,
  vectorStore?: VectorStore,
  embeddings?: EmbeddingProvider
)
```

### Methods

#### `addMemory()`

Add a new memory item.

```typescript
async addMemory(
  content: string,
  type: MemoryType,
  scope: MemoryScope,
  metadata?: Record<string, any>,
  options?: {
    priority?: MemoryPriority
    confidence?: number
    embedding?: number[]
  }
): Promise<MemoryItem>
```

**Parameters:**

- `content` - Memory content text
- `type` - `'episodic' | 'semantic' | 'procedural' | 'short-term'`
- `scope` - `'session' | 'thread' | 'user' | 'global'`
- `metadata` - Optional metadata object
- `options` - Optional configuration

**Returns:** Created `MemoryItem`

**Example:**

```typescript
const memory = await service.addMemory(
  'User prefers dark theme',
  'semantic',
  'user',
  { userId: 'user-123', category: 'preferences' },
  { priority: 'high', confidence: 0.9 }
)
```

#### `query()`

Query memories with filters.

```typescript
async query(query: MemoryQuery): Promise<MemorySearchResult[]>
```

**Parameters:**

- `query` - Query configuration object

**Returns:** Array of `MemorySearchResult`

**Example:**

```typescript
const results = await service.query({
  query: 'user preferences',
  types: ['semantic'],
  scopes: ['user', 'global'],
  limit: 5,
  minConfidence: 0.7,
  tokenBudget: 1000,
})
```

#### `updateMemory()`

Update an existing memory.

```typescript
async updateMemory(
  id: string,
  updates: Partial<MemoryItem>
): Promise<MemoryItem | null>
```

**Parameters:**

- `id` - Memory ID
- `updates` - Partial memory object with updates

**Returns:** Updated `MemoryItem` or `null` if not found

#### `deleteMemory()`

Delete a memory by ID.

```typescript
async deleteMemory(id: string): Promise<boolean>
```

**Parameters:**

- `id` - Memory ID

**Returns:** `true` if deleted, `false` if not found

#### `promoteMemory()`

Promote memory to a higher scope.

```typescript
async promoteMemory(
  id: string,
  targetScope: MemoryScope
): Promise<MemoryItem | null>
```

**Parameters:**

- `id` - Memory ID
- `targetScope` - Target scope level

**Returns:** Updated `MemoryItem` or `null`

**Example:**

```typescript
// Promote from session to global
await service.promoteMemory('mem-123', 'global')
```

#### `compressMemory()`

Compress a memory item.

```typescript
async compressMemory(
  id: string,
  ratio?: number
): Promise<MemoryItem | null>
```

**Parameters:**

- `id` - Memory ID
- `ratio` - Compression ratio (0-1, default 0.5)

**Returns:** Compressed `MemoryItem` or `null`

#### `flushBuffer()`

Flush buffered memories to persistent storage.

```typescript
async flushBuffer(): Promise<void>
```

#### `cleanup()`

Clean up expired memories based on retention policy.

```typescript
async cleanup(): Promise<number>
```

**Returns:** Number of memories cleaned up

#### `getStats()`

Get memory statistics.

```typescript
getStats(): MemoryStats
```

**Returns:** `MemoryStats` object

#### `getMemoryContext()`

Get current memory context for optimization.

```typescript
getMemoryContext(): MemoryContext
```

**Returns:** `MemoryContext` object

#### `getOptimizer()`

Get context optimizer instance.

```typescript
getOptimizer(): ContextOptimizer
```

**Returns:** `ContextOptimizer` instance

#### Event Methods

```typescript
on(eventType: string, listener: MemoryEventListener): void
off(eventType: string, listener: MemoryEventListener): void
```

**Event Types:**

- `'memory:created'`
- `'memory:updated'`
- `'memory:deleted'`
- `'memory:promoted'`
- `'memory:compressed'`
- `'memory:expired'`
- `'buffer:flushed'`
- `'context:optimized'`

---

## ImportanceScorer

Calculate memory importance scores based on multiple factors.

```typescript
import { ImportanceScorer } from '@clarity-chat/memory'

const scorer = new ImportanceScorer({
  recencyHalfLife: 7, // days
  maxFrequencyAccesses: 10,
  weights: {
    base: 0.2,
    recency: 0.3,
    frequency: 0.2,
    relevance: 0.3,
  },
})

// Score a single memory
const score = scorer.score(memory)
console.log(score.final) // 0.0 - 1.0
console.log(score.breakdown) // { recencyWeight, frequencyWeight, relevanceWeight }

// Score with query for semantic relevance
const scoreWithQuery = scorer.score(memory, 'user preferences')
console.log(scoreWithQuery.semanticRelevance) // Higher if content matches query

// Batch scoring with automatic sorting
const scored = scorer.scoreBatch(memories, 'search query')
// Returns: [{ memory, score }] sorted by score.final descending
```

**Score Components:**

- `base`: User-defined importance (0-1)
- `recency`: Exponential decay based on age
- `frequency`: Based on access count
- `semanticRelevance`: Text similarity to query
- `userBoost`: +0.1 for user-scoped memories

---

## DecayManager

Intelligent memory forgetting/decay management inspired by Mem0's dynamic forgetting.

```typescript
import {
  DecayManager,
  createDecayManager,
  DEFAULT_DECAY_CONFIG,
} from '@clarity-chat/memory'

const decayManager = new DecayManager({
  enabled: true,
  defaultPolicy: {
    enabled: true,
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
    curve: 'exponential', // 'linear', 'exponential', 'step'
    minImportance: 0.7, // Don't decay important memories
    minAccessCount: 5, // Don't decay frequently accessed
    halfLife: 3 * 24 * 60 * 60 * 1000, // 3 days
  },
  byType: {
    semantic: { ttl: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    profile: { enabled: false }, // Never decay
    episodic: { ttl: 24 * 60 * 60 * 1000, curve: 'linear' },
    'short-term': { ttl: 60 * 60 * 1000, curve: 'step' },
  },
  byScope: {
    session: { ttl: 60 * 60 * 1000 }, // 1 hour
    user: { ttl: 90 * 24 * 60 * 60 * 1000 }, // 90 days
    global: { enabled: false }, // Never decay
  },
  gracePeriod: 60 * 60 * 1000, // 1 hour before decay starts
})

// Evaluate a single memory
const result = decayManager.evaluate(memory)
// {
//   id: 'memory-123',
//   shouldDecay: true,
//   action: 'compress', // or 'keep', 'delete'
//   reason: 'High decay score (0.75)',
//   decayScore: 0.75, // 0 = fresh, 1 = fully decayed
//   timeToExpiry: 86400000, // ms until expiration
// }

// Find decay candidates
const candidates = decayManager.findDecayCandidates(memories, { limit: 100 })

// Set explicit expiration
const expiringMemory = decayManager.setExpiration(
  memory,
  new Date('2025-01-01')
)
// Or with milliseconds from now:
const expiringMemory2 = decayManager.setExpiration(memory, 86400000) // 24 hours

// Get decay statistics
const stats = decayManager.getStats(memories)
// {
//   total: 1000,
//   healthy: 800,
//   atRisk: 150,
//   expiring: 30,
//   expired: 20,
//   byAction: { keep: 800, compress: 150, delete: 50 },
//   averageDecayScore: 0.25,
// }
```

**Decay Curves:**

- `linear`: Constant decay rate over TTL
- `exponential`: Fast initial decay, slower over time
- `step`: No decay until 80% of TTL, then instant

---

## Summarization

### LLMSummarizer

LLM-based summarization with 80-90% token reduction.

```typescript
import {
  LLMSummarizer,
  createSummarizerWithFallback,
} from '@clarity-chat/memory'

const summarizer = new LLMSummarizer({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  style: 'concise', // 'concise', 'detailed', 'bullet-points'
})

// Summarize text
const summary = await summarizer.summarize(longText, {
  maxTokens: 200,
  preserveEntities: true,
})

// Summarize conversation
const conversationSummary = await summarizer.summarizeConversation(messages)

// Hierarchical summarization for very long content
const hierarchical = await summarizer.summarizeHierarchical(veryLongText)
```

### OpenAISummarizer

```typescript
import { OpenAISummarizer } from '@clarity-chat/memory'

const summarizer = new OpenAISummarizer({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'gpt-4o-mini',
  temperature: 0.3,
  maxRetries: 3,
})

const summary = await summarizer.summarize(text, 200)
const batchSummaries = await summarizer.summarizeBatch(texts, 200)
```

### AnthropicSummarizer

```typescript
import { AnthropicSummarizer } from '@clarity-chat/memory'

const summarizer = new AnthropicSummarizer({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-haiku-20240307',
  temperature: 0.3,
  maxRetries: 3,
})

const summary = await summarizer.summarize(text, 200)
const batchSummaries = await summarizer.summarizeBatch(texts, 200)
```

### extractiveSummarize

Fast extractive summarization (no LLM required).

```typescript
import { extractiveSummarize } from '@clarity-chat/memory'

const summary = extractiveSummarize(text, {
  sentences: 3,
  method: 'textrank', // or 'frequency', 'position'
})
```

---

## TokenCounter

Utility for token counting and text manipulation.

### Static Methods

#### `count()`

Count tokens in text.

```typescript
static count(text: string): number
```

#### `countBatch()`

Count tokens in multiple texts.

```typescript
static countBatch(texts: string[]): number
```

#### `truncate()`

Truncate text to fit token budget.

```typescript
static truncate(text: string, maxTokens: number): string
```

#### `splitSentences()`

Split text into sentences.

```typescript
static splitSentences(text: string): string[]
```

---

## TokenBudgetManager

Manage token allocation and budgets.

### Constructor

```typescript
new TokenBudgetManager(config: TokenOptimizationConfig)
```

### Methods

#### `getAllocation()`

Get current token allocation.

```typescript
getAllocation(): TokenAllocation
```

#### `adjustAllocation()`

Dynamically adjust allocation based on context.

```typescript
adjustAllocation(context: MemoryContext): TokenAllocation
```

#### `optimizeMemories()`

Optimize memories to fit budget.

```typescript
optimizeMemories(
  memories: MemoryItem[],
  budget: number,
  priorities?: Record<string, number>
): MemoryItem[]
```

#### `isBudgetExceeded()`

Check if budget is exceeded.

```typescript
isBudgetExceeded(used: number): boolean
```

#### `getRemainingBudget()`

Get remaining token budget.

```typescript
getRemainingBudget(used: number): number
```

---

## MemoryCompressor

Compress conversations and memories.

### Methods

#### `compressConversation()`

Compress conversation history.

```typescript
compressConversation(
  messages: string[],
  budget: number
): CompressedMemory
```

#### `compressMemory()`

Compress single memory item.

```typescript
compressMemory(
  memory: MemoryItem,
  targetRatio: number
): CompressedMemory
```

---

## SemanticChunker

Chunk text for semantic retrieval.

### Constructor

```typescript
new SemanticChunker(
  chunkSize: number = 200,
  overlap: number = 50
)
```

### Methods

#### `chunkConversation()`

Chunk conversation into semantic pieces.

```typescript
chunkConversation(conversation: string): MemoryChunk[]
```

#### `retrieveOptimalChunks()`

Retrieve chunks within budget.

```typescript
retrieveOptimalChunks(
  chunks: MemoryChunk[],
  budget: number,
  relevanceScores?: Map<string, number>
): MemoryChunk[]
```

#### `extractTopic()`

Extract topic from chunk.

```typescript
extractTopic(chunk: MemoryChunk): string
```

---

## ContextOptimizer

Complete context optimization.

### Constructor

```typescript
new ContextOptimizer(config: TokenOptimizationConfig)
```

### Methods

#### `optimizeContext()`

Optimize entire context for LLM.

```typescript
optimizeContext(options: {
  systemPrompt: string
  userPreferences: Record<string, any>
  recentMessages: string[]
  semanticMemories: MemoryItem[]
  episodicMemories: MemoryItem[]
  context?: MemoryContext
}): {
  optimized: {
    systemPrompt: string
    userPreferences: string
    recentContext: string
    semanticMemory: string
    episodicMemory: string
  }
  stats: {
    totalTokens: number
    allocation: TokenAllocation
    compressionRatio: number
  }
}
```

#### Component Access

```typescript
getBudgetManager(): TokenBudgetManager
getCompressor(): MemoryCompressor
getChunker(): SemanticChunker
```

---

## Types

### MemoryServiceConfig

```typescript
interface MemoryServiceConfig {
  tokenOptimization: TokenOptimizationConfig
  persistence: MemoryPersistenceOptions
  enableAutoSummarization: boolean
  summarizationInterval?: number
  enableAutoCleanup: boolean
  cleanupInterval?: number
  retentionPolicy: {
    shortTerm: number
    session: number
    thread: number
    global: number
  }
  debug?: boolean
}
```

### MemoryItem

```typescript
interface MemoryItem {
  id: string
  type: MemoryType
  scope: MemoryScope
  content: string
  metadata: Record<string, any>
  embedding?: number[]
  confidence: number
  priority: MemoryPriority
  tokens: number
  accessCount: number
  lastAccessed: Date
  createdAt: Date
  updatedAt: Date
  expiresAt?: Date
  compressed?: string
  original?: string
}
```

### MemoryQuery

```typescript
interface MemoryQuery {
  query?: string
  embedding?: number[]
  types?: MemoryType[]
  scopes?: MemoryScope[]
  priorities?: MemoryPriority[]
  minConfidence?: number
  limit?: number
  tokenBudget?: number
  metadata?: Record<string, any>
  timeRange?: { start?: Date; end?: Date }
  userId?: string
  threadId?: string
  sessionId?: string
  includeEmbeddings?: boolean
}
```

### MemorySearchResult

```typescript
interface MemorySearchResult {
  memory: MemoryItem
  relevance: number
  distance?: number
  highlights?: string[]
}
```

### MemoryStats

```typescript
interface MemoryStats {
  total: number
  byType: Record<MemoryType, number>
  byScope: Record<MemoryScope, number>
  byPriority: Record<MemoryPriority, number>
  totalTokens: number
  averageConfidence: number
  cache?: {
    hits: number
    misses: number
    hitRate: number
    size: number
  }
  vectorStore?: {
    totalVectors: number
    dimension: number
    namespaces: string[]
  }
}
```

For complete type definitions, see [types.ts](./src/types.ts).
