# @clarity-chat/memory - API Reference

Complete API documentation for framework-agnostic memory utilities.

## Table of Contents

- [MemoryService](#memoryservice)
- [TokenCounter](#tokencounter)
- [TokenBudgetManager](#tokenbudgetmanager)
- [MemoryCompressor](#memorycompressor)
- [SemanticChunker](#semanticchunker)
- [ContextOptimizer](#contextoptimizer)
- [Types](#types)

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
