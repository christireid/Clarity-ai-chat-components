# Phase 2: Clarity Memory Design

## Executive Summary

Clarity Memory is a **drop-in, zero-config memory system** designed to be:
- **Framework-agnostic** - Works in React, Node.js, serverless, browser, anywhere
- **Standalone** - No server required (optional server mode for production)
- **Developer-friendly** - Dead-simple API, excellent TypeScript types, great DX
- **Powerful** - All MemMachine features + new enhancements
- **Cost-optimized** - Built-in token budgeting and adaptive compression

---

## 1. Core Concepts (Redesigned)

### 1.1 Memory
A **Memory** is a piece of information stored in the system. It can be:
- **Episodic**: Conversation events, messages, interactions
- **Semantic**: Facts, preferences, knowledge
- **Profile**: Long-term user characteristics

```typescript
interface Memory {
  id: string
  content: string
  type: 'episodic' | 'semantic' | 'profile'
  timestamp: number
  metadata?: Record<string, any>
  importance?: number // 0-1 score
  tokens?: number
  embedding?: number[]
}
```

### 1.2 Short-term Context
Recent memories kept in-memory for fast access. Automatically managed with:
- **Sliding window**: Most recent N memories
- **Token budget**: Fits within token limit
- **Priority scoring**: Important memories stay longer

### 1.3 Long-term Context
Memories stored persistently and retrieved via semantic search:
- **Vector embeddings**: For semantic similarity
- **Compressed summaries**: For old conversations
- **Indexed storage**: Fast retrieval

### 1.4 Importance Scoring
Automatic scoring based on:
- **Recency**: More recent = higher score
- **User signals**: Explicit importance markers
- **Semantic relevance**: Query-dependent scoring
- **Frequency**: Frequently accessed = higher score

### 1.5 Embeddings
Vector representations for semantic search:
- **Automatic generation**: When adding memories
- **Provider-agnostic**: OpenAI, local models, custom
- **Cached**: Avoid regenerating for same content

### 1.6 Context Bundles
Optimized context packages for LLM calls:
- **Token-aware**: Fits within budget
- **Prioritized**: Most relevant memories first
- **Summarized**: Old context compressed
- **Structured**: Ready for LLM consumption

### 1.7 Compression Strategies
Multiple strategies for reducing token usage:
- **Summarization**: LLM-based compression
- **Truncation**: Token-aware truncation
- **Deduplication**: Remove redundant memories
- **Chunking**: Split large memories

### 1.8 Memory Lifecycle
```
Add → Score → Store → Index → Retrieve → Compress → Archive
```

---

## 2. Clean New API Surface

### 2.1 Core API

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Zero-config usage
const mem = clarityMemory()

// Add a memory
await mem.add("User prefers TypeScript over JavaScript")

// Search memories
const results = await mem.search("What programming languages does the user prefer?")

// Get context for LLM
const context = await mem.context({ maxTokens: 1000 })
```

### 2.2 Configurable Usage

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'

const memory = clarityMemory({
  // Embedding provider
  embeddingProvider: openai('gpt-4o-mini'),
  
  // Storage backend
  vectorStore: 'in-memory', // or 'file', 'redis', 'postgres', 'chroma', etc.
  
  // Summarization
  summarizer: 'auto', // or 'llm', 'none'
  
  // Token budget
  tokenBudget: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.10,
      userPreferences: 0.15,
      recentContext: 0.30,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
  },
  
  // Context
  context: {
    userId: 'user-123',
    sessionId: 'session-456',
    groupId: 'group-789',
  },
})
```

### 2.3 Advanced API

```typescript
// Add with options
await mem.add("Important fact", {
  type: 'semantic',
  importance: 0.9,
  metadata: { category: 'preferences' },
  tags: ['user-prefs', 'important'],
})

// Search with filters
const results = await mem.search("programming preferences", {
  limit: 5,
  minScore: 0.7,
  types: ['semantic', 'profile'],
  filters: { category: 'preferences' },
})

// Get optimized context
const bundle = await mem.context({
  maxTokens: 2000,
  includeSummaries: true,
  prioritizeRecent: true,
})

// Manual operations
await mem.promote(memoryId) // Increase importance
await mem.forget(memoryId)   // Remove memory
await mem.compress()         // Compress old memories
await mem.summarize()        // Create summaries
```

---

## 3. Complete Feature Set

### 3.1 Core Operations

#### `add(content, options?)`
Add a memory to the system.

```typescript
await mem.add("User loves dark mode", {
  type: 'semantic',
  importance: 0.8,
  metadata: { category: 'ui-preferences' },
  tags: ['preferences', 'ui'],
})
```

**Features:**
- Automatic embedding generation
- Importance scoring
- Token counting
- Metadata storage
- Tag support

#### `search(query, options?)`
Search memories semantically.

```typescript
const results = await mem.search("What are the user's UI preferences?", {
  limit: 10,
  minScore: 0.6,
  types: ['semantic', 'profile'],
})
```

**Features:**
- Vector similarity search
- Score-based ranking
- Type filtering
- Metadata filtering
- Tag filtering

#### `context(options?)`
Get optimized context bundle for LLM.

```typescript
const bundle = await mem.context({
  maxTokens: 1500,
  includeSummaries: true,
  prioritizeRecent: true,
  includeMetadata: false,
})
```

**Features:**
- Token budget management
- Priority-based selection
- Automatic summarization
- Structured formatting
- Token counting

#### `embed(text)`
Generate embedding for text.

```typescript
const embedding = await mem.embed("User prefers TypeScript")
```

#### `rank(memories, query)`
Rank memories by relevance to query.

```typescript
const ranked = await mem.rank(memories, "programming preferences")
```

#### `summarize(memories, options?)`
Summarize a collection of memories.

```typescript
const summary = await mem.summarize(oldMemories, {
  maxTokens: 200,
  preserveImportant: true,
})
```

#### `compress(options?)`
Compress old memories to save space.

```typescript
await mem.compress({
  strategy: 'summarize', // or 'truncate', 'deduplicate'
  ageThreshold: 7 * 24 * 60 * 60 * 1000, // 7 days
})
```

#### `promote(id)`
Increase importance of a memory.

```typescript
await mem.promote(memoryId)
```

#### `forget(id)`
Remove a memory.

```typescript
await mem.forget(memoryId)
```

#### `flush()`
Clear all memories (use with caution).

```typescript
await mem.flush()
```

#### `inspect()`
Get system state for debugging.

```typescript
const state = await mem.inspect()
console.log(state)
// {
//   totalMemories: 150,
//   totalTokens: 45000,
//   byType: { episodic: 100, semantic: 40, profile: 10 },
//   storage: { type: 'in-memory', size: '2.5MB' },
//   ...
// }
```

### 3.2 Memory Types

#### Episodic Memory
Conversation events, messages, interactions.

```typescript
await mem.add("User asked about TypeScript", {
  type: 'episodic',
  metadata: {
    role: 'user',
    timestamp: Date.now(),
  },
})
```

#### Semantic Memory
Facts, knowledge, preferences.

```typescript
await mem.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preferences', 'ui'],
})
```

#### Profile Memory
Long-term user characteristics.

```typescript
await mem.add("User is a senior developer", {
  type: 'profile',
  importance: 1.0,
  tags: ['profile', 'role'],
})
```

### 3.3 Token Budget Management

```typescript
const budget = mem.getBudgetManager()

// Get current allocation
const allocation = budget.getAllocation()

// Adjust dynamically
budget.adjustAllocation({
  recentContext: 0.40, // Increase recent context
  semanticMemory: 0.20, // Decrease semantic memory
})

// Optimize memories for budget
const optimized = budget.optimizeMemories(memories, {
  maxTokens: 1000,
  strategy: 'priority',
})
```

### 3.4 Compression Strategies

#### Summarization
LLM-based compression of old memories.

```typescript
await mem.compress({
  strategy: 'summarize',
  model: openai('gpt-4o-mini'),
  compressionRatio: 0.5, // Reduce to 50% of original size
})
```

#### Truncation
Token-aware truncation.

```typescript
await mem.compress({
  strategy: 'truncate',
  maxTokens: 100,
})
```

#### Deduplication
Remove redundant memories.

```typescript
await mem.compress({
  strategy: 'deduplicate',
  similarityThreshold: 0.95,
})
```

### 3.5 Multi-Session Support

```typescript
// Create session-scoped memory
const sessionMem = mem.session({
  sessionId: 'chat-123',
  userId: 'user-456',
})

// Add to session
await sessionMem.add("User started conversation")

// Search within session
const sessionContext = await sessionMem.context()
```

### 3.6 Multi-Store Support

```typescript
// In-memory (default, for development)
const mem1 = clarityMemory({ vectorStore: 'in-memory' })

// File-based (for simple persistence)
const mem2 = clarityMemory({ vectorStore: 'file', path: './memories.json' })

// Redis (for distributed systems)
const mem3 = clarityMemory({
  vectorStore: 'redis',
  url: 'redis://localhost:6379',
})

// PostgreSQL + pgvector (for production)
const mem4 = clarityMemory({
  vectorStore: 'postgres',
  connectionString: 'postgresql://...',
})

// Vector databases
const mem5 = clarityMemory({
  vectorStore: 'chroma',
  path: './chroma-db',
})

const mem6 = clarityMemory({
  vectorStore: 'qdrant',
  url: 'http://localhost:6333',
})
```

### 3.7 Tool Integration

```typescript
// Extract memories from tool results
const memories = mem.extractFromTool({
  tool: 'search_web',
  result: { content: '...', url: '...' },
  metadata: { query: 'TypeScript best practices' },
})

// Add extracted memories
for (const memory of memories) {
  await mem.add(memory.content, memory.options)
}
```

### 3.8 DevTools Integration

```typescript
// React DevTools component
import { MemoryInspector } from '@clarity-chat/memory/react'

function App() {
  return (
    <div>
      <YourApp />
      <MemoryInspector memory={mem} />
    </div>
  )
}
```

---

## 4. New Enhancements

### 4.1 Built-in Token Budgeting
- Automatic allocation strategies
- Dynamic adjustment based on context
- Model-aware optimization
- Cost tracking

### 4.2 Adaptive Memory Compression
- Automatically compresses old memories
- Model-aware compression (knows which model is being used)
- Preserves important information
- Configurable compression ratios

### 4.3 Time-Weighted Scoring
- Recent memories score higher
- Decay function for older memories
- Configurable decay rates

### 4.4 Automatic Extraction from Chat Messages
- Extracts memories from conversation
- Identifies important information
- Categorizes automatically
- Reduces manual work

### 4.5 Memory Topics & Semantic Grouping
- Groups related memories
- Topic-based retrieval
- Automatic topic detection
- Topic-based summarization

### 4.6 Model-Aware Memory Optimization
- Optimizes for specific models
- Knows token limits
- Adjusts compression strategies
- Maximizes context efficiency

### 4.7 Drop-in Debug Panel for React
- Visual memory inspector
- Search interface
- Statistics dashboard
- Real-time updates

### 4.8 Event System
```typescript
mem.on('memory:added', (memory) => {
  console.log('New memory:', memory)
})

mem.on('memory:compressed', (stats) => {
  console.log('Compression stats:', stats)
})

mem.on('memory:searched', (query, results) => {
  console.log('Search:', query, results.length, 'results')
})
```

---

## 5. Type System

### 5.1 Core Types

```typescript
// Memory item
interface MemoryItem {
  id: string
  content: string
  type: MemoryType
  timestamp: number
  importance: number
  tokens: number
  embedding?: number[]
  metadata?: Record<string, any>
  tags?: string[]
}

type MemoryType = 'episodic' | 'semantic' | 'profile'

// Memory chunk (for chunking large memories)
interface MemoryChunk {
  id: string
  memoryId: string
  content: string
  index: number
  tokens: number
  embedding: number[]
}

// Embedding
interface Embedding {
  vector: number[]
  model: string
  tokens: number
}

// Memory score
interface MemoryScore {
  memoryId: string
  score: number
  factors: {
    recency: number
    importance: number
    relevance: number
    frequency: number
  }
}

// Search result
interface SearchResult {
  memory: MemoryItem
  score: number
  reasons: string[]
}

// Context bundle
interface ContextBundle {
  memories: MemoryItem[]
  summaries: string[]
  totalTokens: number
  allocation: TokenAllocation
  metadata: {
    query?: string
    timestamp: number
    compressionRatio?: number
  }
}

// Summarization result
interface SummarizationResult {
  summary: string
  originalTokens: number
  summaryTokens: number
  compressionRatio: number
  preservedMemories: string[] // IDs of important memories preserved
}

// Memory config
interface MemoryConfig {
  embeddingProvider?: EmbeddingProvider
  vectorStore?: VectorStoreConfig
  summarizer?: SummarizerConfig
  tokenBudget?: TokenBudgetConfig
  context?: ContextConfig
  compression?: CompressionConfig
  scoring?: ScoringConfig
  debug?: boolean
}
```

### 5.2 Storage Types

```typescript
type VectorStoreType =
  | 'in-memory'
  | 'file'
  | 'redis'
  | 'postgres'
  | 'sqlite'
  | 'indexeddb'
  | 'chroma'
  | 'qdrant'
  | 'pinecone'
  | 'lancedb'

interface VectorStoreConfig {
  type: VectorStoreType
  [key: string]: any // Store-specific options
}
```

### 5.3 Provider Types

```typescript
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  model: string
  dimensions: number
}

interface SummarizerProvider {
  summarize(text: string, options?: SummarizeOptions): Promise<string>
  model: string
}
```

---

## 6. API Signatures (Complete)

### 6.1 Main API

```typescript
function clarityMemory(config?: MemoryConfig): MemoryInstance

interface MemoryInstance {
  // Core operations
  add(content: string, options?: AddOptions): Promise<string>
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  context(options?: ContextOptions): Promise<ContextBundle>
  
  // Embeddings
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  
  // Ranking & scoring
  rank(memories: MemoryItem[], query: string): Promise<MemoryScore[]>
  score(memoryId: string): Promise<number>
  
  // Summarization
  summarize(memories: MemoryItem[], options?: SummarizeOptions): Promise<SummarizationResult>
  
  // Compression
  compress(options?: CompressOptions): Promise<CompressionStats>
  
  // Memory management
  promote(memoryId: string): Promise<void>
  forget(memoryId: string): Promise<void>
  update(memoryId: string, updates: Partial<MemoryItem>): Promise<void>
  get(memoryId: string): Promise<MemoryItem | null>
  
  // Batch operations
  addBatch(memories: Array<{ content: string; options?: AddOptions }>): Promise<string[]>
  forgetBatch(memoryIds: string[]): Promise<void>
  
  // Utilities
  flush(): Promise<void>
  inspect(): Promise<MemoryState>
  getStats(): Promise<MemoryStats>
  
  // Session management
  session(options: SessionOptions): MemoryInstance
  
  // Budget management
  getBudgetManager(): TokenBudgetManager
  
  // Events
  on(event: string, handler: Function): void
  off(event: string, handler: Function): void
  emit(event: string, data: any): void
  
  // Tool integration
  extractFromTool(tool: ToolResult): MemoryItem[]
  
  // Lifecycle
  close(): Promise<void>
}
```

### 6.2 Options Types

```typescript
interface AddOptions {
  type?: MemoryType
  importance?: number
  metadata?: Record<string, any>
  tags?: string[]
  embedding?: number[] // Pre-computed embedding
  timestamp?: number
}

interface SearchOptions {
  limit?: number
  minScore?: number
  types?: MemoryType[]
  filters?: Record<string, any>
  tags?: string[]
  includeEmbeddings?: boolean
}

interface ContextOptions {
  maxTokens: number
  includeSummaries?: boolean
  prioritizeRecent?: boolean
  includeMetadata?: boolean
  query?: string
  types?: MemoryType[]
}

interface SummarizeOptions {
  maxTokens?: number
  preserveImportant?: boolean
  model?: string
}

interface CompressOptions {
  strategy?: 'summarize' | 'truncate' | 'deduplicate'
  ageThreshold?: number
  maxTokens?: number
  compressionRatio?: number
}

interface SessionOptions {
  sessionId: string
  userId?: string
  groupId?: string
  agentId?: string
}
```

---

## 7. Design Principles

### 7.1 Zero-Config Defaults
- Works out of the box with sensible defaults
- No setup required for basic usage
- Progressive enhancement for advanced features

### 7.2 Framework Agnostic
- Pure TypeScript core
- Framework adapters (React, Vue, etc.)
- Works in any JavaScript environment

### 7.3 Type Safety
- Full TypeScript support
- Exhaustive type definitions
- IntelliSense support

### 7.4 Performance First
- Efficient storage backends
- Caching strategies
- Batch operations
- Lazy loading

### 7.5 Developer Experience
- Simple API
- Great error messages
- DevTools integration
- Comprehensive documentation

### 7.6 Extensibility
- Plugin system for custom stores
- Custom embedding providers
- Custom scoring functions
- Event system for hooks

---

## Next Steps

Proceed to **Phase 3: Implementation Blueprint** to define the module structure and implementation details.
