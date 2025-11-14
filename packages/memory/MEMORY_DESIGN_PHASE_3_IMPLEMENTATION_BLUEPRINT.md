# Phase 3: Implementation Blueprint

## Executive Summary

This document provides the complete implementation blueprint for Clarity Memory, including module structure, type definitions, API signatures, storage adapters, and context engine design.

---

## 1. Full Module Layout

```
packages/memory/
├── src/
│   ├── index.ts                    # Main export
│   │
│   ├── core/
│   │   ├── memory.ts               # Core Memory class
│   │   ├── memory-item.ts          # MemoryItem type & utilities
│   │   ├── memory-scorer.ts        # Importance scoring logic
│   │   ├── memory-lifecycle.ts     # Lifecycle management
│   │   └── types.ts                 # Core type definitions
│   │
│   ├── stores/
│   │   ├── base.ts                 # Base store interface
│   │   ├── in-memory.ts            # In-memory store
│   │   ├── file.ts                 # File-based store
│   │   ├── redis.ts                # Redis store adapter
│   │   ├── postgres.ts             # PostgreSQL + pgvector adapter
│   │   ├── sqlite.ts               # SQLite adapter
│   │   ├── indexeddb.ts            # IndexedDB adapter (browser)
│   │   ├── chroma.ts                # ChromaDB adapter
│   │   ├── qdrant.ts                # Qdrant adapter
│   │   ├── pinecone.ts              # Pinecone adapter
│   │   └── lancedb.ts               # LanceDB adapter
│   │
│   ├── embeddings/
│   │   ├── base.ts                 # Base embedding provider interface
│   │   ├── openai.ts               # OpenAI embeddings
│   │   ├── local.ts                # Local model embeddings (sentence-transformers)
│   │   ├── cache.ts                # Embedding cache
│   │   └── utils.ts                # Embedding utilities
│   │
│   ├── scoring/
│   │   ├── scorer.ts               # Main scoring engine
│   │   ├── recency.ts              # Recency-based scoring
│   │   ├── relevance.ts            # Relevance-based scoring
│   │   ├── frequency.ts            # Frequency-based scoring
│   │   ├── importance.ts           # Importance-based scoring
│   │   └── composite.ts            # Composite scoring strategies
│   │
│   ├── summarization/
│   │   ├── summarizer.ts           # Main summarization engine
│   │   ├── llm-summarizer.ts       # LLM-based summarization
│   │   ├── extractive.ts           # Extractive summarization
│   │   ├── prompts.ts              # Summarization prompts
│   │   └── utils.ts                # Summarization utilities
│   │
│   ├── compression/
│   │   ├── compressor.ts           # Main compression engine
│   │   ├── strategies/
│   │   │   ├── summarize.ts        # Summarization strategy
│   │   │   ├── truncate.ts          # Truncation strategy
│   │   │   └── deduplicate.ts      # Deduplication strategy
│   │   └── utils.ts                # Compression utilities
│   │
│   ├── pipelines/
│   │   ├── ingestion.ts            # Memory ingestion pipeline
│   │   ├── retrieval.ts            # Memory retrieval pipeline
│   │   ├── compression.ts         # Compression pipeline
│   │   └── summarization.ts       # Summarization pipeline
│   │
│   ├── adapters/
│   │   ├── vercel-ai-sdk.ts        # Vercel AI SDK adapter
│   │   ├── langchain.ts            # LangChain adapter
│   │   ├── openai.ts               # OpenAI SDK adapter
│   │   └── anthropic.ts            # Anthropic SDK adapter
│   │
│   ├── context/
│   │   ├── engine.ts               # Main context engine
│   │   ├── bundler.ts              # Context bundling logic
│   │   ├── token-estimator.ts      # Token counting/estimation
│   │   ├── priority-selector.ts   # Priority-based selection
│   │   ├── semantic-grouper.ts     # Semantic grouping
│   │   └── formatter.ts            # Context formatting for LLMs
│   │
│   ├── budget/
│   │   ├── manager.ts              # Token budget manager
│   │   ├── allocator.ts            # Allocation strategies
│   │   ├── optimizer.ts            # Memory optimizer
│   │   └── tracker.ts               # Token usage tracker
│   │
│   ├── react/
│   │   ├── hooks/
│   │   │   ├── use-memory.ts       # useMemory hook
│   │   │   ├── use-memory-search.ts # useMemorySearch hook
│   │   │   └── use-memory-context.ts # useMemoryContext hook
│   │   ├── components/
│   │   │   ├── MemoryInspector.tsx # DevTools component
│   │   │   └── MemoryDebugger.tsx  # Debug panel
│   │   └── provider.tsx            # MemoryProvider context
│   │
│   ├── utils/
│   │   ├── token-counter.ts        # Token counting utilities
│   │   ├── chunker.ts               # Text chunking utilities
│   │   ├── id-generator.ts         # ID generation
│   │   ├── validation.ts           # Validation utilities
│   │   └── errors.ts               # Error types
│   │
│   └── types/
│       ├── memory.ts               # Memory type definitions
│       ├── config.ts               # Configuration types
│       ├── store.ts                # Store types
│       ├── embedding.ts            # Embedding types
│       └── context.ts              # Context types
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── examples/
│   ├── basic-usage.ts
│   ├── react-app.tsx
│   ├── node-server.ts
│   ├── serverless.ts
│   └── vercel-ai-sdk.ts
│
├── docs/
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── API.md
│   ├── STORAGE.md
│   ├── EMBEDDINGS.md
│   └── MIGRATION.md
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Type System (Complete)

### 2.1 Core Types

```typescript
// packages/memory/src/types/memory.ts

export type MemoryType = 'episodic' | 'semantic' | 'profile'

export interface MemoryItem {
  id: string
  content: string
  type: MemoryType
  timestamp: number
  importance: number // 0-1
  tokens: number
  embedding?: number[]
  metadata?: Record<string, any>
  tags?: string[]
  sessionId?: string
  userId?: string
  groupId?: string
  agentId?: string
}

export interface MemoryChunk {
  id: string
  memoryId: string
  content: string
  index: number
  tokens: number
  embedding: number[]
}

export interface Embedding {
  vector: number[]
  model: string
  tokens: number
  cached: boolean
}

export interface MemoryScore {
  memoryId: string
  score: number // 0-1
  factors: {
    recency: number
    importance: number
    relevance: number
    frequency: number
  }
  timestamp: number
}

export interface SearchResult {
  memory: MemoryItem
  score: number
  reasons: string[]
  matchType: 'semantic' | 'exact' | 'metadata' | 'tag'
}

export interface ContextBundle {
  memories: MemoryItem[]
  summaries: string[]
  totalTokens: number
  allocation: TokenAllocation
  metadata: {
    query?: string
    timestamp: number
    compressionRatio?: number
    strategy: string
  }
}

export interface SummarizationResult {
  summary: string
  originalTokens: number
  summaryTokens: number
  compressionRatio: number
  preservedMemories: string[]
  model: string
}

export interface CompressionStats {
  compressed: number
  removed: number
  savedTokens: number
  strategy: string
  duration: number
}

export interface MemoryState {
  totalMemories: number
  totalTokens: number
  byType: Record<MemoryType, number>
  storage: {
    type: string
    size: string
    [key: string]: any
  }
  recentActivity: {
    added: number
    searched: number
    compressed: number
  }
}

export interface MemoryStats {
  total: number
  byType: Record<MemoryType, number>
  averageImportance: number
  averageTokens: number
  oldestMemory: number
  newestMemory: number
}
```

### 2.2 Configuration Types

```typescript
// packages/memory/src/types/config.ts

export interface MemoryConfig {
  embeddingProvider?: EmbeddingProvider | EmbeddingProviderConfig
  vectorStore?: VectorStoreConfig
  summarizer?: SummarizerConfig
  tokenBudget?: TokenBudgetConfig
  context?: ContextConfig
  compression?: CompressionConfig
  scoring?: ScoringConfig
  debug?: boolean
}

export interface EmbeddingProviderConfig {
  type: 'openai' | 'local' | 'custom'
  model?: string
  apiKey?: string
  cache?: boolean
  [key: string]: any
}

export interface VectorStoreConfig {
  type: VectorStoreType
  [key: string]: any
}

export type VectorStoreType =
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

export interface SummarizerConfig {
  enabled: boolean
  provider?: 'llm' | 'extractive' | 'none'
  model?: string
  interval?: number // ms
  threshold?: number // memories before summarizing
}

export interface TokenBudgetConfig {
  maxContextWindow: number
  allocation: TokenAllocation
  dynamicAllocation?: boolean
  model?: string // For model-aware optimization
}

export interface TokenAllocation {
  systemPrompt: number // 0-1
  userPreferences: number
  recentContext: number
  semanticMemory: number
  episodicMemory: number
  responseReserve: number
}

export interface ContextConfig {
  userId?: string
  sessionId?: string
  groupId?: string
  agentId?: string
}

export interface CompressionConfig {
  enabled: boolean
  strategy?: 'summarize' | 'truncate' | 'deduplicate' | 'auto'
  ageThreshold?: number // ms
  compressionRatio?: number // 0-1
  preserveImportant?: boolean
}

export interface ScoringConfig {
  recencyWeight: number
  importanceWeight: number
  relevanceWeight: number
  frequencyWeight: number
  decayRate?: number
}
```

### 2.3 Store Types

```typescript
// packages/memory/src/types/store.ts

export interface VectorStore {
  // Initialize store
  initialize(): Promise<void>
  
  // CRUD operations
  add(memory: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  delete(id: string): Promise<void>
  
  // Batch operations
  addBatch(memories: MemoryItem[]): Promise<void>
  deleteBatch(ids: string[]): Promise<void>
  
  // Search
  search(query: string, options: SearchOptions): Promise<SearchResult[]>
  searchByVector(vector: number[], options: SearchOptions): Promise<SearchResult[]>
  
  // Metadata queries
  findByMetadata(filters: Record<string, any>): Promise<MemoryItem[]>
  findByTags(tags: string[]): Promise<MemoryItem[]>
  
  // Statistics
  count(): Promise<number>
  stats(): Promise<StoreStats>
  
  // Lifecycle
  close(): Promise<void>
}

export interface StoreStats {
  total: number
  byType: Record<MemoryType, number>
  size: number
  [key: string]: any
}
```

---

## 3. API Signatures (Complete)

### 3.1 Main API

```typescript
// packages/memory/src/core/memory.ts

export function clarityMemory(config?: MemoryConfig): MemoryInstance

export interface MemoryInstance {
  // === Core Operations ===
  
  add(content: string, options?: AddOptions): Promise<string>
  
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  
  context(options?: ContextOptions): Promise<ContextBundle>
  
  // === Embeddings ===
  
  embed(text: string): Promise<number[]>
  
  embedBatch(texts: string[]): Promise<number[][]>
  
  // === Ranking & Scoring ===
  
  rank(memories: MemoryItem[], query: string): Promise<MemoryScore[]>
  
  score(memoryId: string): Promise<number>
  
  // === Summarization ===
  
  summarize(memories: MemoryItem[], options?: SummarizeOptions): Promise<SummarizationResult>
  
  // === Compression ===
  
  compress(options?: CompressOptions): Promise<CompressionStats>
  
  // === Memory Management ===
  
  promote(memoryId: string): Promise<void>
  
  forget(memoryId: string): Promise<void>
  
  update(memoryId: string, updates: Partial<MemoryItem>): Promise<void>
  
  get(memoryId: string): Promise<MemoryItem | null>
  
  // === Batch Operations ===
  
  addBatch(memories: Array<{ content: string; options?: AddOptions }>): Promise<string[]>
  
  forgetBatch(memoryIds: string[]): Promise<void>
  
  // === Utilities ===
  
  flush(): Promise<void>
  
  inspect(): Promise<MemoryState>
  
  getStats(): Promise<MemoryStats>
  
  // === Session Management ===
  
  session(options: SessionOptions): MemoryInstance
  
  // === Budget Management ===
  
  getBudgetManager(): TokenBudgetManager
  
  // === Events ===
  
  on(event: string, handler: Function): void
  
  off(event: string, handler: Function): void
  
  emit(event: string, data: any): void
  
  // === Tool Integration ===
  
  extractFromTool(tool: ToolResult): MemoryItem[]
  
  // === Lifecycle ===
  
  close(): Promise<void>
}

// === Options Types ===

export interface AddOptions {
  type?: MemoryType
  importance?: number
  metadata?: Record<string, any>
  tags?: string[]
  embedding?: number[]
  timestamp?: number
}

export interface SearchOptions {
  limit?: number
  minScore?: number
  types?: MemoryType[]
  filters?: Record<string, any>
  tags?: string[]
  includeEmbeddings?: boolean
}

export interface ContextOptions {
  maxTokens: number
  includeSummaries?: boolean
  prioritizeRecent?: boolean
  includeMetadata?: boolean
  query?: string
  types?: MemoryType[]
}

export interface SummarizeOptions {
  maxTokens?: number
  preserveImportant?: boolean
  model?: string
}

export interface CompressOptions {
  strategy?: 'summarize' | 'truncate' | 'deduplicate'
  ageThreshold?: number
  maxTokens?: number
  compressionRatio?: number
}

export interface SessionOptions {
  sessionId: string
  userId?: string
  groupId?: string
  agentId?: string
}

export interface ToolResult {
  tool: string
  result: any
  metadata?: Record<string, any>
}
```

### 3.2 Budget Manager API

```typescript
// packages/memory/src/budget/manager.ts

export interface TokenBudgetManager {
  getAllocation(): TokenAllocation
  
  adjustAllocation(allocation: Partial<TokenAllocation>): void
  
  optimizeMemories(memories: MemoryItem[], budget: number): MemoryItem[]
  
  isBudgetExceeded(usedTokens: number): boolean
  
  getRemainingBudget(usedTokens: number): number
  
  estimateTokens(memories: MemoryItem[]): number
}
```

---

## 4. Multi-Store Adapters

### 4.1 Base Store Interface

```typescript
// packages/memory/src/stores/base.ts

export abstract class BaseVectorStore implements VectorStore {
  abstract initialize(): Promise<void>
  abstract add(memory: MemoryItem): Promise<void>
  abstract get(id: string): Promise<MemoryItem | null>
  abstract update(id: string, updates: Partial<MemoryItem>): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract addBatch(memories: MemoryItem[]): Promise<void>
  abstract deleteBatch(ids: string[]): Promise<void>
  abstract search(query: string, options: SearchOptions): Promise<SearchResult[]>
  abstract searchByVector(vector: number[], options: SearchOptions): Promise<SearchResult[]>
  abstract findByMetadata(filters: Record<string, any>): Promise<MemoryItem[]>
  abstract findByTags(tags: string[]): Promise<MemoryItem[]>
  abstract count(): Promise<number>
  abstract stats(): Promise<StoreStats>
  abstract close(): Promise<void>
}
```

### 4.2 In-Memory Store

```typescript
// packages/memory/src/stores/in-memory.ts

export class InMemoryStore extends BaseVectorStore {
  private memories: Map<string, MemoryItem> = new Map()
  private embeddings: Map<string, number[]> = new Map()
  
  // Simple cosine similarity for search
  // Fast for development, not scalable
}
```

### 4.3 File Store

```typescript
// packages/memory/src/stores/file.ts

export class FileStore extends BaseVectorStore {
  constructor(private path: string) {
    super()
  }
  
  // JSON file-based storage
  // Good for simple persistence
  // Not suitable for large datasets
}
```

### 4.4 Redis Store

```typescript
// packages/memory/src/stores/redis.ts

export class RedisStore extends BaseVectorStore {
  constructor(private client: RedisClient) {
    super()
  }
  
  // Use Redis for metadata
  // Use RedisJSON for structured data
  // Use external vector DB or Redis Vector Search
}
```

### 4.5 PostgreSQL Store

```typescript
// packages/memory/src/stores/postgres.ts

export class PostgresStore extends BaseVectorStore {
  constructor(private pool: Pool) {
    super()
  }
  
  // Use pgvector for embeddings
  // Use JSONB for metadata
  // Full-text search for content
}
```

### 4.6 IndexedDB Store (Browser)

```typescript
// packages/memory/src/stores/indexeddb.ts

export class IndexedDBStore extends BaseVectorStore {
  constructor(private dbName: string) {
    super()
  }
  
  // Browser-native storage
  // Good for client-side persistence
  // Limited by browser storage quotas
}
```

### 4.7 Vector Database Adapters

```typescript
// packages/memory/src/stores/chroma.ts
// packages/memory/src/stores/qdrant.ts
// packages/memory/src/stores/pinecone.ts
// packages/memory/src/stores/lancedb.ts

// Each implements BaseVectorStore
// Uses respective SDKs for vector operations
```

---

## 5. Context Engine Blueprint

### 5.1 Token Estimation

```typescript
// packages/memory/src/context/token-estimator.ts

export class TokenEstimator {
  // Accurate token counting for common models
  count(text: string, model?: string): number
  
  // Batch counting
  countBatch(texts: string[], model?: string): number
  
  // Estimate for unknown models (fallback)
  estimate(text: string): number
}
```

### 5.2 Priority Scoring

```typescript
// packages/memory/src/context/priority-selector.ts

export class PrioritySelector {
  // Select memories based on priority scores
  select(memories: MemoryItem[], budget: number): MemoryItem[]
  
  // Multi-factor scoring
  score(memory: MemoryItem, query?: string): number
}
```

### 5.3 Semantic Grouping

```typescript
// packages/memory/src/context/semantic-grouper.ts

export class SemanticGrouper {
  // Group related memories
  group(memories: MemoryItem[]): MemoryGroup[]
  
  // Extract topics
  extractTopics(memories: MemoryItem[]): string[]
}
```

### 5.4 Summarization Pipeline

```typescript
// packages/memory/src/pipelines/summarization.ts

export class SummarizationPipeline {
  // Automatic summarization of old memories
  async summarize(memories: MemoryItem[]): Promise<SummarizationResult>
  
  // Rolling summaries
  async createRollingSummary(existingSummary: string, newMemories: MemoryItem[]): Promise<string>
}
```

### 5.5 Adaptive Compression

```typescript
// packages/memory/src/compression/compressor.ts

export class AdaptiveCompressor {
  // Model-aware compression
  compress(memories: MemoryItem[], model: string, budget: number): MemoryItem[]
  
  // Strategy selection
  selectStrategy(memories: MemoryItem[], budget: number): CompressionStrategy
}
```

### 5.6 Context Bundling

```typescript
// packages/memory/src/context/bundler.ts

export class ContextBundler {
  // Create optimized context bundle
  async bundle(options: ContextOptions): Promise<ContextBundle>
  
  // Format for LLM consumption
  format(bundle: ContextBundle, format: 'json' | 'text' | 'messages'): string | any[]
}
```

---

## 6. Implementation Phases

### Phase 1: Core (Week 1-2)
- [ ] Core Memory class
- [ ] In-memory store
- [ ] Basic add/search
- [ ] Token counting
- [ ] Type definitions

### Phase 2: Storage (Week 3-4)
- [ ] File store
- [ ] IndexedDB store
- [ ] Redis store adapter
- [ ] PostgreSQL store adapter

### Phase 3: Embeddings (Week 5)
- [ ] OpenAI embeddings
- [ ] Local embeddings
- [ ] Embedding cache
- [ ] Batch operations

### Phase 4: Context Engine (Week 6-7)
- [ ] Token budget manager
- [ ] Priority selector
- [ ] Context bundler
- [ ] Semantic grouper

### Phase 5: Advanced Features (Week 8-9)
- [ ] Summarization
- [ ] Compression
- [ ] Scoring system
- [ ] Event system

### Phase 6: Framework Integration (Week 10)
- [ ] React hooks
- [ ] React components
- [ ] Vercel AI SDK adapter
- [ ] Other adapters

### Phase 7: Vector DBs (Week 11)
- [ ] Chroma adapter
- [ ] Qdrant adapter
- [ ] Pinecone adapter
- [ ] LanceDB adapter

### Phase 8: Polish (Week 12)
- [ ] Documentation
- [ ] Examples
- [ ] Tests
- [ ] Migration guide

---

## Next Steps

Proceed to **Phase 4: Integration Patterns** to define how Clarity Memory integrates with various frameworks and use cases.
