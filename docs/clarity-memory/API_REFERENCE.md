# Clarity Memory API Reference

Complete API documentation for Clarity Memory.

## Table of Contents

- [Core API](#core-api)
- [Configuration](#configuration)
- [React API](#react-api)
- [Types](#types)
- [Storage Adapters](#storage-adapters)
- [Embedding Providers](#embedding-providers)

---

## Core API

### `clarityMemory(config?)`

Creates a new memory instance.

```typescript
function clarityMemory(config?: MemoryConfig): Memory
```

**Parameters:**
- `config` (optional): Configuration object (see [Configuration](#configuration))

**Returns:** `Memory` instance

**Example:**
```typescript
// Zero-config
const memory = clarityMemory()

// With config
const memory = clarityMemory({
  context: "user123",
  store: { type: "file", path: "./memory.json" },
})
```

---

## Memory Class

### `memory.add(content, metadata?)`

Adds a memory to the store.

```typescript
add(content: string, metadata?: Record<string, unknown>): Promise<MemoryItem>
```

**Parameters:**
- `content`: The memory content (string)
- `metadata` (optional): Additional metadata

**Returns:** Promise resolving to the created `MemoryItem`

**Example:**
```typescript
const item = await memory.add("User likes pizza", {
  type: "preference",
  category: "food",
})
```

### `memory.addMany(contents)`

Adds multiple memories in batch.

```typescript
addMany(
  contents: Array<string | { content: string; metadata?: Record<string, unknown> }>
): Promise<MemoryItem[]>
```

**Example:**
```typescript
const items = await memory.addMany([
  "User likes pizza",
  { content: "User likes pasta", metadata: { type: "preference" } },
])
```

### `memory.recall(query, options?)`

Recalls relevant memories for a query (simple search).

```typescript
recall(
  query: string,
  options?: {
    limit?: number
    minScore?: number
    includeSummary?: boolean
  }
): Promise<{
  memories: MemoryItem[]
  tokens: number
  summary?: string
}>
```

**Parameters:**
- `query`: Search query string
- `options` (optional):
  - `limit`: Maximum number of results (default: 10)
  - `minScore`: Minimum relevance score (0-1, default: 0)
  - `includeSummary`: Include summary of older memories (default: false)

**Returns:** Promise resolving to recall results

**Example:**
```typescript
const results = await memory.recall("What does the user like?", {
  limit: 5,
  minScore: 0.7,
  includeSummary: true,
})
```

### `memory.search(options)`

Advanced search with filters and sorting.

```typescript
search(options: {
  query: string
  limit?: number
  minScore?: number
  filters?: Record<string, unknown>
  sortBy?: 'relevance' | 'recency' | 'importance'
  topic?: string
}): Promise<SearchResult[]>
```

**Example:**
```typescript
const results = await memory.search({
  query: "What does the user like?",
  limit: 10,
  minScore: 0.7,
  filters: { type: "preference" },
  sortBy: "relevance",
})
```

### `memory.context(options)`

Gets optimized context bundle for LLM.

```typescript
context(options: {
  query: string
  maxTokens: number
  format?: 'openai' | 'anthropic' | 'claude'
  includeSummary?: boolean
}): Promise<ContextBundle>
```

**Example:**
```typescript
const bundle = await memory.context({
  query: "Tell me about the user",
  maxTokens: 4000,
  format: "openai",
  includeSummary: true,
})
```

### `memory.promote(memoryId)`

Promotes a memory (increases importance).

```typescript
promote(memoryId: string): Promise<void>
```

**Example:**
```typescript
await memory.promote("memory-id-123")
```

### `memory.forget(memoryId, soft?)`

Forgets a memory (decreases importance or deletes).

```typescript
forget(memoryId: string, soft?: boolean): Promise<void>
```

**Parameters:**
- `memoryId`: ID of memory to forget
- `soft` (optional): If true, decrease importance; if false, delete (default: false)

**Example:**
```typescript
// Soft forget (decrease importance)
await memory.forget("memory-id-123", true)

// Hard forget (delete)
await memory.forget("memory-id-123", false)
```

### `memory.forgetByQuery(query)`

Forgets memories matching a query.

```typescript
forgetByQuery(query: string): Promise<number>
```

**Returns:** Number of memories forgotten

**Example:**
```typescript
const count = await memory.forgetByQuery("old information")
```

### `memory.compress(options)`

Compresses memory using specified strategy.

```typescript
compress(options: {
  strategy?: 'adaptive' | 'summarize' | 'deduplicate' | 'prune'
  targetSize?: string | number
  minScore?: number
}): Promise<CompressionResult>
```

**Example:**
```typescript
const result = await memory.compress({
  strategy: "adaptive",
  targetSize: "50%",
})
```

### `memory.flush()`

Flushes all memories.

```typescript
flush(): Promise<void>
```

**Example:**
```typescript
await memory.flush()
```

### `memory.stats()`

Gets memory statistics.

```typescript
stats(): Promise<{
  totalMemories: number
  tokens: number
  oldestMemory?: Date
  newestMemory?: Date
  averageImportance: number
}>
```

**Example:**
```typescript
const stats = await memory.stats()
console.log(`Total: ${stats.totalMemories}, Tokens: ${stats.tokens}`)
```

### `memory.extractFromMessages(messages, options?)`

Extracts memories from chat messages.

```typescript
extractFromMessages(
  messages: Array<{ role: string; content: string }>,
  options?: {
    extractPreferences?: boolean
    extractFacts?: boolean
    extractEvents?: boolean
  }
): Promise<MemoryItem[]>
```

**Example:**
```typescript
const items = await memory.extractFromMessages([
  { role: "user", content: "I like pizza" },
  { role: "assistant", content: "Got it!" },
], {
  extractPreferences: true,
})
```

### `memory.topics()`

Gets memory topics (semantic groups).

```typescript
topics(): Promise<Array<{
  topic: string
  memories: MemoryItem[]
  score: number
}>>
```

**Example:**
```typescript
const topics = await memory.topics()
```

### `memory.getTopic(topic)`

Gets memories for a specific topic.

```typescript
getTopic(topic: string): Promise<MemoryItem[]>
```

**Example:**
```typescript
const foodMemories = await memory.getTopic("food preferences")
```

### `memory.embed(text)`

Embeds text into a vector.

```typescript
embed(text: string): Promise<number[]>
```

**Example:**
```typescript
const embedding = await memory.embed("User likes pizza")
```

### `memory.summarize(memories)`

Summarizes a list of memories.

```typescript
summarize(memories: MemoryItem[]): Promise<SummarizationResult>
```

**Example:**
```typescript
const summary = await memory.summarize(memories)
```

### `memory.inspect()`

Inspects memory state (for debugging).

```typescript
inspect(): {
  memories: MemoryItem[]
  stats: StoreStats
  config: MemoryConfig
}
```

**Example:**
```typescript
const state = memory.inspect()
```

### `memory.on(event, handler)`

Registers a lifecycle event handler.

```typescript
on(event: 'ingestion' | 'compression' | 'eviction', handler: Function): void
```

**Example:**
```typescript
memory.on('ingestion', (memories) => {
  console.log(`Added ${memories.length} memories`)
})
```

### `memory.off(event, handler)`

Unregisters a lifecycle event handler.

```typescript
off(event: string, handler: Function): void
```

### `memory.close()`

Closes and cleans up the memory instance.

```typescript
close(): Promise<void>
```

**Example:**
```typescript
await memory.close()
```

---

## Configuration

### `MemoryConfig`

```typescript
interface MemoryConfig {
  context?: string
  embedding?: EmbeddingConfig
  store?: StoreConfig
  shortTerm?: ShortTermConfig
  longTerm?: LongTermConfig
  scoring?: ScoringConfig
  summarizer?: SummarizationConfig
  tokenBudget?: TokenBudgetConfig
  targetModel?: string
  contextFormat?: 'openai' | 'anthropic' | 'claude'
}
```

### `EmbeddingConfig`

```typescript
interface EmbeddingConfig {
  provider: 'openai' | 'anthropic' | 'local'
  model?: string
  apiKey?: string
  config?: Record<string, unknown>
  cache?: boolean
  cacheTTL?: number
}
```

### `StoreConfig`

```typescript
interface StoreConfig {
  type: 'in-memory' | 'file' | 'indexeddb' | 'redis' | 'postgres' | 'sqlite' | 'chroma' | 'qdrant' | 'pinecone' | 'lancedb'
  config?: Record<string, unknown>
  path?: string
  connectionString?: string
}
```

### `ShortTermConfig`

```typescript
interface ShortTermConfig {
  maxMessages?: number
  maxTokens?: number
  maxMessageLength?: number
  autoSummarize?: boolean
}
```

### `LongTermConfig`

```typescript
interface LongTermConfig {
  enabled: boolean
  store: StoreConfig
  minImportance?: number
}
```

### `ScoringConfig`

```typescript
interface ScoringConfig {
  recencyWeight?: number
  frequencyWeight?: number
  relevanceWeight?: number
  importanceWeight?: number
  timeDecay?: {
    enabled: boolean
    halfLife: number
  }
}
```

### `TokenBudgetConfig`

```typescript
interface TokenBudgetConfig {
  maxTokens: number
  reserveTokens?: number
  strategy?: 'priority' | 'recent' | 'balanced'
}
```

---

## React API

### `useMemory(config?)`

React hook for memory operations.

```typescript
function useMemory(config?: MemoryConfig): {
  memory: Memory
  add: (content: string, metadata?: Record<string, unknown>) => Promise<MemoryItem>
  recall: (query: string, options?: RecallOptions) => Promise<RecallResult>
  search: (options: SearchOptions) => Promise<SearchResult[]>
  stats: StoreStats
  loading: boolean
  error: Error | null
}
```

### `MemoryProvider`

React context provider for memory.

```typescript
function MemoryProvider({
  config,
  children
}: {
  config?: MemoryConfig
  children: React.ReactNode
}): JSX.Element
```

### `MemoryInspector`

DevTools component for inspecting memory.

```typescript
function MemoryInspector({
  memory
}: {
  memory: Memory
}): JSX.Element
```

---

## Types

### `MemoryItem`

```typescript
interface MemoryItem {
  id: string
  content: string
  timestamp: Date
  lastAccessed?: Date
  accessCount: number
  importance: number
  metadata?: Record<string, unknown>
  embedding?: number[]
  topic?: string
  ttl?: number
}
```

### `SearchResult`

```typescript
interface SearchResult {
  memory: MemoryItem
  score: number
  scoreBreakdown: MemoryScore
  reason?: string
}
```

### `ContextBundle`

```typescript
interface ContextBundle {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  tokens: number
  summary?: string
  memories: MemoryItem[]
  format: string
}
```

### `CompressionResult`

```typescript
interface CompressionResult {
  before: number
  after: number
  ratio: number
  strategy: string
  summary?: SummarizationResult
}
```

---

## Storage Adapters

### In-Memory

```typescript
store: { type: 'in-memory' }
```

### File

```typescript
store: {
  type: 'file',
  path: './memory.json'
}
```

### IndexedDB

```typescript
store: { type: 'indexeddb' }
```

### PostgreSQL

```typescript
store: {
  type: 'postgres',
  connectionString: process.env.DATABASE_URL
}
```

### Redis

```typescript
store: {
  type: 'redis',
  url: process.env.REDIS_URL
}
```

---

## Embedding Providers

### OpenAI

```typescript
embedding: {
  provider: 'openai',
  model: 'text-embedding-3-small',
  apiKey: process.env.OPENAI_API_KEY
}
```

### Anthropic

```typescript
embedding: {
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY
}
```

### Local

```typescript
embedding: {
  provider: 'local',
  model: 'sentence-transformers/all-MiniLM-L6-v2'
}
```

---

For more details, see the [Complete Design Document](./COMPLETE_DESIGN_DOCUMENT.md).
