# Phase 3: Implementation Blueprint

## Executive Summary

This document provides the complete implementation blueprint for Clarity Memory, including detailed module layouts, exact API signatures, type definitions, storage adapters, and the context engine architecture.

---

## 1. Full Module Layout

### 1.1 Directory Structure

```
packages/memory/
├── src/
│   ├── index.ts                          # Main entry point
│   │
│   ├── core/
│   │   ├── index.ts
│   │   ├── clarity-memory.ts             # Main ClarityMemory class
│   │   ├── memory-manager.ts             # Memory lifecycle & state management
│   │   ├── memory-item.ts                # Memory data structure
│   │   ├── importance-scorer.ts          # Importance scoring engine
│   │   └── memory-lifecycle.ts           # Lifecycle state machine
│   │
│   ├── stores/
│   │   ├── index.ts
│   │   ├── storage-adapter.ts            # Base storage interface
│   │   ├── in-memory-store.ts            # In-memory implementation
│   │   ├── indexeddb-store.ts           # Browser IndexedDB
│   │   ├── redis-store.ts                # Redis adapter
│   │   ├── postgres-store.ts             # Postgres/pgvector adapter
│   │   ├── sqlite-store.ts               # SQLite adapter
│   │   ├── vector-store-adapter.ts       # Vector DB abstraction
│   │   ├── chroma-adapter.ts             # ChromaDB adapter
│   │   ├── qdrant-adapter.ts             # Qdrant adapter
│   │   ├── pinecone-adapter.ts           # Pinecone adapter
│   │   └── lancedb-adapter.ts           # LanceDB adapter
│   │
│   ├── embeddings/
│   │   ├── index.ts
│   │   ├── embedding-provider.ts         # Base embedding interface
│   │   ├── openai-embedder.ts            # OpenAI embeddings
│   │   ├── local-embedder.ts              # Transformers.js (browser)
│   │   ├── anthropic-embedder.ts         # Anthropic embeddings
│   │   ├── custom-embedder.ts             # Custom provider template
│   │   └── embedding-cache.ts             # Embedding cache
│   │
│   ├── scoring/
│   │   ├── index.ts
│   │   ├── relevance-scorer.ts           # Semantic relevance scoring
│   │   ├── importance-scorer.ts          # Importance calculation
│   │   ├── time-decay.ts                  # Time-based decay
│   │   ├── frequency-tracker.ts           # Access frequency tracking
│   │   └── score-combiner.ts             # Combine multiple scores
│   │
│   ├── summarization/
│   │   ├── index.ts
│   │   ├── summarizer.ts                  # Base summarizer interface
│   │   ├── llm-summarizer.ts               # LLM-based summarization
│   │   ├── extract-summarizer.ts          # Key fact extraction
│   │   ├── adaptive-summarizer.ts         # Strategy selection
│   │   └── summary-cache.ts                # Summary caching
│   │
│   ├── compression/
│   │   ├── index.ts
│   │   ├── compressor.ts                  # Compression engine
│   │   ├── strategies.ts                 # Compression strategies
│   │   ├── quality-preserver.ts           # Quality metrics
│   │   └── compression-pipeline.ts       # Background compression
│   │
│   ├── pipelines/
│   │   ├── index.ts
│   │   ├── ingestion-pipeline.ts          # Memory ingestion flow
│   │   ├── retrieval-pipeline.ts         # Memory retrieval flow
│   │   ├── compression-pipeline.ts       # Background compression
│   │   └── cleanup-pipeline.ts            # TTL expiration cleanup
│   │
│   ├── adapters/
│   │   ├── index.ts
│   │   ├── storage-adapter.ts             # Storage interface (re-export)
│   │   ├── embedding-adapter.ts           # Embedding interface (re-export)
│   │   └── llm-adapter.ts                 # LLM interface for summarization
│   │
│   ├── context/
│   │   ├── index.ts
│   │   ├── context-builder.ts             # Assemble context bundle
│   │   ├── token-budget.ts                # Token budget manager
│   │   ├── token-allocator.ts             # Dynamic allocation
│   │   ├── optimizer.ts                   # Context optimization
│   │   └── formatter.ts                   # Format for LLM consumption
│   │
│   ├── react/
│   │   ├── index.ts
│   │   ├── MemoryInspector.tsx            # Debug panel component
│   │   ├── useMemory.ts                   # React hook
│   │   ├── MemoryProvider.tsx             # Context provider
│   │   └── MemoryStats.tsx                # Statistics component
│   │
│   ├── utils/
│   │   ├── index.ts
│   │   ├── token-counter.ts               # Token counting utilities
│   │   ├── chunker.ts                     # Text chunking
│   │   ├── validators.ts                  # Input validation
│   │   ├── id-generator.ts                # ID generation
│   │   └── time-utils.ts                  # Time utilities
│   │
│   └── types/
│       ├── index.ts                       # All type exports
│       ├── memory.ts                      # Memory types
│       ├── config.ts                      # Configuration types
│       ├── storage.ts                     # Storage types
│       ├── embedding.ts                   # Embedding types
│       └── context.ts                     # Context types
│
├── providers/
│   ├── index.ts                           # Provider exports
│   ├── openai.ts                          # OpenAI provider factory
│   ├── local.ts                           # Local provider factory
│   └── custom.ts                          # Custom provider template
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── examples/
│   ├── basic-usage.ts
│   ├── react-example.tsx
│   ├── nodejs-example.ts
│   ├── serverless-example.ts
│   └── browser-example.ts
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

export type MemoryType = 
  | 'episodic'    // Conversation events, messages
  | 'semantic'    // Facts, preferences, knowledge
  | 'profile'     // User profile data

export type MemoryScope = 
  | 'session'     // Current session only
  | 'thread'      // Conversation thread
  | 'user'        // User-specific, persists across sessions
  | 'global'      // Shared across all users

export enum MemoryLifecycle {
  CREATED = 'created',
  ACTIVE = 'active',
  COMPRESSED = 'compressed',
  ARCHIVED = 'archived',
  EXPIRED = 'expired',
  DELETED = 'deleted'
}

export interface MemoryMetadata {
  userId?: string
  sessionId?: string
  threadId?: string
  source?: string
  [key: string]: any
}

export interface Memory {
  id: string
  content: string
  type: MemoryType
  scope: MemoryScope
  metadata: MemoryMetadata
  embedding?: number[]
  importance: number
  timestamp: Date
  ttl?: number                    // Time-to-live in seconds
  tags?: string[]
  compressed?: boolean
  summary?: string
  lifecycle: MemoryLifecycle
  accessCount: number             // How many times accessed
  lastAccessed?: Date
  compressedFrom?: string         // ID of original if compressed
  parentId?: string               // For compressed/archived memories
}

export interface MemoryChunk {
  id: string
  memoryId: string
  content: string
  index: number
  embedding: number[]
  tokens: number
  startChar: number
  endChar: number
}

export interface MemoryScore {
  base: number                    // Base importance (0-1)
  recency: number                  // Time-based score (0-1)
  frequency: number                // Access frequency (0-1)
  userBoost: number                // User-defined boost (0-1)
  semanticRelevance: number        // Query relevance (0-1)
  final: number                    // Computed final score (0-1)
  breakdown: {
    recencyWeight: number
    frequencyWeight: number
    relevanceWeight: number
  }
}

export interface SearchResult {
  memory: Memory
  score: number                    // Final relevance score
  relevance: number                 // Semantic relevance (0-1)
  tokens: number                    // Token count
  matchedTags?: string[]            // Matching tags
}
```

### 2.2 Configuration Types

```typescript
// packages/memory/src/types/config.ts

export interface EmbeddingProviderConfig {
  provider: 'openai' | 'local' | 'anthropic' | 'custom'
  apiKey?: string
  model?: string
  dimensions?: number
  cache?: boolean
  cacheTTL?: number
  [key: string]: any
}

export interface StorageConfig {
  type: 'in-memory' | 'indexeddb' | 'redis' | 'postgres' | 'sqlite' | 'vector-db'
  url?: string
  namespace?: string
  options?: Record<string, any>
}

export interface VectorStoreConfig {
  provider: 'chroma' | 'qdrant' | 'pinecone' | 'lancedb' | 'custom'
  url?: string
  apiKey?: string
  collection?: string
  options?: Record<string, any>
}

export interface TokenBudgetConfig {
  maxTokens: number
  allocation: {
    systemPrompt: number           // Fraction (0-1)
    userPreferences: number
    recentContext: number
    semanticMemory: number
    episodicMemory: number
    responseReserve: number
  }
  dynamicAllocation: boolean
  strictMode: boolean              // Throw if budget exceeded
}

export interface CompressionConfig {
  enabled: boolean
  strategy: 'none' | 'summarize' | 'extract' | 'truncate' | 'adaptive'
  threshold: number               // Compress when this fraction of budget used
  minQuality: number               // Minimum quality to preserve (0-1)
  provider?: EmbeddingProviderConfig
}

export interface SummarizationConfig {
  enabled: boolean
  provider: 'openai' | 'anthropic' | 'local' | 'custom'
  model?: string
  interval: number                 // Summarize every N messages
  maxTokens?: number
  preserveFacts: boolean
}

export interface RetentionConfig {
  shortTerm: number                // Seconds (0 = never expire)
  session: number
  thread: number
  user: number
  global: number
}

export interface MemoryConfig {
  embeddingProvider?: EmbeddingProviderConfig
  storage?: StorageConfig
  vectorStore?: VectorStoreConfig
  tokenBudget?: TokenBudgetConfig
  compression?: CompressionConfig
  summarization?: SummarizationConfig
  retention?: RetentionConfig
  userId?: string
  sessionId?: string
  threadId?: string
  debug?: boolean
  logLevel?: 'silent' | 'error' | 'warn' | 'info' | 'debug'
}
```

### 2.3 Context Types

```typescript
// packages/memory/src/types/context.ts

export interface TokenBreakdown {
  systemPrompt: number
  userPreferences: number
  recentContext: number
  semanticMemories: number
  episodicMemories: number
  summary: number
  total: number
}

export interface ContextMetadata {
  compressionRatio: number
  memoriesRetrieved: number
  memoriesFiltered: number
  memoriesCompressed: number
  strategiesUsed: string[]
}

export interface ContextBundle {
  systemPrompt: string
  userPreferences: string
  recentContext: string
  semanticMemories: Memory[]
  episodicMemories: Memory[]
  summary: string
  tokenBreakdown: TokenBreakdown
  metadata: ContextMetadata
  formatted?: string                // Pre-formatted for LLM
}

export interface ContextOptions {
  maxTokens?: number
  includeSummary?: boolean
  includePreferences?: boolean
  includeRecent?: boolean
  minRelevance?: number
  model?: string                    // For model-specific optimization
}
```

### 2.4 Storage Types

```typescript
// packages/memory/src/types/storage.ts

export interface SearchOptions {
  limit?: number
  minScore?: number
  types?: MemoryType[]
  scopes?: MemoryScope[]
  tags?: string[]
  userId?: string
  sessionId?: string
  threadId?: string
  timeDecay?: number                // Time decay factor
}

export interface StorageAdapter {
  // CRUD
  save(memory: Memory): Promise<void>
  load(id: string): Promise<Memory | null>
  loadBatch(ids: string[]): Promise<Memory[]>
  update(id: string, updates: Partial<Memory>): Promise<void>
  delete(id: string): Promise<void>
  deleteBatch(ids: string[]): Promise<void>
  
  // Search
  search(query: string, options: SearchOptions): Promise<SearchResult[]>
  searchByEmbedding(embedding: number[], options: SearchOptions): Promise<SearchResult[]>
  
  // Query
  query(filter: MemoryFilter): Promise<Memory[]>
  count(filter?: MemoryFilter): Promise<number>
  
  // Scope operations
  clear(scope?: MemoryScope, type?: MemoryType): Promise<void>
  listScopes(): Promise<MemoryScope[]>
  
  // Lifecycle
  initialize(): Promise<void>
  close(): Promise<void>
}

export interface MemoryFilter {
  types?: MemoryType[]
  scopes?: MemoryScope[]
  tags?: string[]
  userId?: string
  sessionId?: string
  threadId?: string
  minImportance?: number
  lifecycle?: MemoryLifecycle[]
  dateRange?: {
    from?: Date
    to?: Date
  }
}
```

---

## 3. API Signatures (Exact Definitions)

### 3.1 Main ClarityMemory Class

```typescript
// packages/memory/src/core/clarity-memory.ts

export class ClarityMemory {
  constructor(config?: MemoryConfig)
  
  // Core operations
  add(
    content: string,
    options?: {
      type?: MemoryType
      scope?: MemoryScope
      importance?: number
      tags?: string[]
      metadata?: MemoryMetadata
      ttl?: number
    }
  ): Promise<Memory>
  
  batchAdd(
    memories: Array<{
      content: string
      options?: {
        type?: MemoryType
        scope?: MemoryScope
        importance?: number
        tags?: string[]
        metadata?: MemoryMetadata
        ttl?: number
      }
    }>
  ): Promise<Memory[]>
  
  recall(
    query: string,
    options?: {
      limit?: number
      minScore?: number
      types?: MemoryType[]
      scopes?: MemoryScope[]
      tags?: string[]
      timeDecay?: number
      userId?: string
      sessionId?: string
    }
  ): Promise<SearchResult[]>
  
  context(options?: ContextOptions): Promise<ContextBundle>
  
  // Memory management
  get(id: string): Promise<Memory | null>
  update(id: string, updates: Partial<Memory>): Promise<Memory>
  promote(id: string, scope: MemoryScope): Promise<Memory>
  compress(id: string, ratio?: number): Promise<Memory>
  forget(id: string, soft?: boolean): Promise<void>
  flush(options?: {
    scope?: MemoryScope
    type?: MemoryType
  }): Promise<void>
  
  // Advanced operations
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  
  summarize(memories: Memory[]): Promise<string>
  
  extractFromMessages(
    messages: Array<{ role: string; content: string }>,
    options?: {
      extractPreferences?: boolean
      extractFacts?: boolean
      extractTopics?: boolean
    }
  ): Promise<Memory[]>
  
  groupByTopic(memories: Memory[]): Promise<Map<string, Memory[]>>
  
  // Analytics
  getStats(): Promise<{
    totalMemories: number
    byType: Record<MemoryType, number>
    byScope: Record<MemoryScope, number>
    tokenUsage: number
    compressionRatio: number
    averageImportance: number
  }>
  
  inspect(): Promise<{
    memories: Memory[]
    stats: Awaited<ReturnType<ClarityMemory['getStats']>>
    tokenBudget: TokenBreakdown
    storage: {
      type: string
      size: number
      available: number
    }
  }>
  
  // Lifecycle
  initialize(): Promise<void>
  close(): Promise<void>
}
```

### 3.2 Factory Function

```typescript
// packages/memory/src/index.ts

export function clarityMemory(config?: MemoryConfig): ClarityMemory {
  return new ClarityMemory(config)
}

// Default export
export default clarityMemory
```

### 3.3 Provider Factories

```typescript
// packages/memory/providers/openai.ts

export function openai(config: {
  apiKey: string
  model?: string
  dimensions?: number
  cache?: boolean
}): EmbeddingProviderConfig

// packages/memory/providers/local.ts

export function local(config: {
  model: string
  cache?: boolean
}): EmbeddingProviderConfig
```

---

## 4. Multi-Store Adapters

### 4.1 Storage Adapter Interface

```typescript
// packages/memory/src/stores/storage-adapter.ts

export abstract class StorageAdapter implements StorageAdapter {
  abstract initialize(): Promise<void>
  abstract close(): Promise<void>
  
  abstract save(memory: Memory): Promise<void>
  abstract load(id: string): Promise<Memory | null>
  abstract loadBatch(ids: string[]): Promise<Memory[]>
  abstract update(id: string, updates: Partial<Memory>): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract deleteBatch(ids: string[]): Promise<void>
  
  abstract search(
    query: string,
    options: SearchOptions
  ): Promise<SearchResult[]>
  
  abstract searchByEmbedding(
    embedding: number[],
    options: SearchOptions
  ): Promise<SearchResult[]>
  
  abstract query(filter: MemoryFilter): Promise<Memory[]>
  abstract count(filter?: MemoryFilter): Promise<number>
  
  abstract clear(scope?: MemoryScope, type?: MemoryType): Promise<void>
  abstract listScopes(): Promise<MemoryScope[]>
}
```

### 4.2 In-Memory Store

```typescript
// packages/memory/src/stores/in-memory-store.ts

export class InMemoryStore extends StorageAdapter {
  private memories: Map<string, Memory> = new Map()
  private embeddings: Map<string, number[]> = new Map()
  
  constructor() {
    super()
  }
  
  // Implementation...
}
```

### 4.3 IndexedDB Store (Browser)

```typescript
// packages/memory/src/stores/indexeddb-store.ts

export class IndexedDBStore extends StorageAdapter {
  private db: IDBDatabase | null = null
  private dbName: string
  private version: number = 1
  
  constructor(config: { dbName?: string }) {
    super()
    this.dbName = config.dbName || 'clarity-memory'
  }
  
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores
        if (!db.objectStoreNames.contains('memories')) {
          const memoryStore = db.createObjectStore('memories', { keyPath: 'id' })
          memoryStore.createIndex('type', 'type', { unique: false })
          memoryStore.createIndex('scope', 'scope', { unique: false })
          memoryStore.createIndex('timestamp', 'timestamp', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('embeddings')) {
          db.createObjectStore('embeddings', { keyPath: 'memoryId' })
        }
      }
    })
  }
  
  // Implementation...
}
```

### 4.4 Redis Store

```typescript
// packages/memory/src/stores/redis-store.ts

export class RedisStore extends StorageAdapter {
  private client: RedisClient
  
  constructor(config: { url: string; namespace?: string }) {
    super()
    this.client = createClient({ url: config.url })
    // ... setup
  }
  
  // Implementation using Redis JSON, Search, etc.
}
```

### 4.5 Postgres Store (with pgvector)

```typescript
// packages/memory/src/stores/postgres-store.ts

export class PostgresStore extends StorageAdapter {
  private pool: Pool
  
  constructor(config: {
    connectionString: string
    tableName?: string
  }) {
    super()
    this.pool = new Pool({ connectionString: config.connectionString })
  }
  
  async initialize(): Promise<void> {
    // Create tables, indexes, pgvector extension
    await this.pool.query(`
      CREATE EXTENSION IF NOT EXISTS vector;
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        type TEXT NOT NULL,
        scope TEXT NOT NULL,
        metadata JSONB,
        embedding vector(1536),
        importance FLOAT,
        timestamp TIMESTAMP,
        ttl INTEGER,
        tags TEXT[],
        lifecycle TEXT,
        access_count INTEGER DEFAULT 0,
        last_accessed TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS memories_embedding_idx 
        ON memories USING ivfflat (embedding vector_cosine_ops);
      CREATE INDEX IF NOT EXISTS memories_type_scope_idx 
        ON memories(type, scope);
    `)
  }
  
  // Implementation...
}
```

### 4.6 Vector Store Adapters

```typescript
// packages/memory/src/stores/vector-store-adapter.ts

export abstract class VectorStoreAdapter {
  abstract upsert(vectors: Array<{ id: string; vector: number[]; metadata: any }>): Promise<void>
  abstract query(vector: number[], options: { limit: number; filter?: any }): Promise<Array<{ id: string; score: number; metadata: any }>>
  abstract delete(ids: string[]): Promise<void>
}

// ChromaDB
export class ChromaAdapter extends VectorStoreAdapter { /* ... */ }

// Qdrant
export class QdrantAdapter extends VectorStoreAdapter { /* ... */ }

// Pinecone
export class PineconeAdapter extends VectorStoreAdapter { /* ... */ }

// LanceDB
export class LanceDBAdapter extends VectorStoreAdapter { /* ... */ }
```

---

## 5. Context Engine Blueprint

### 5.1 Token Budget Manager

```typescript
// packages/memory/src/context/token-budget.ts

export class TokenBudgetManager {
  private config: TokenBudgetConfig
  private tokenCounter: TokenCounter
  
  constructor(config: TokenBudgetConfig) {
    this.config = config
    this.tokenCounter = new TokenCounter()
  }
  
  getAllocation(context: {
    systemPrompt?: string
    userPreferences?: string
    recentMessages?: string[]
    semanticMemories?: Memory[]
    episodicMemories?: Memory[]
  }): TokenBreakdown {
    const maxTokens = this.config.maxTokens
    const allocation = this.config.allocation
    
    // Calculate base allocation
    const breakdown: TokenBreakdown = {
      systemPrompt: Math.floor(maxTokens * allocation.systemPrompt),
      userPreferences: Math.floor(maxTokens * allocation.userPreferences),
      recentContext: Math.floor(maxTokens * allocation.recentContext),
      semanticMemories: Math.floor(maxTokens * allocation.semanticMemory),
      episodicMemories: Math.floor(maxTokens * allocation.episodicMemory),
      summary: 0,
      total: 0
    }
    
    // Dynamic adjustment if enabled
    if (this.config.dynamicAllocation) {
      return this.adjustAllocation(breakdown, context)
    }
    
    breakdown.total = Object.values(breakdown).reduce((a, b) => a + b, 0)
    return breakdown
  }
  
  private adjustAllocation(
    breakdown: TokenBreakdown,
    context: any
  ): TokenBreakdown {
    // Adjust based on actual content sizes
    // Prioritize important components
    // ... implementation
    return breakdown
  }
  
  isWithinBudget(breakdown: TokenBreakdown): boolean {
    return breakdown.total <= this.config.maxTokens
  }
  
  optimizeToFit(
    memories: Memory[],
    budget: number,
    minRelevance: number = 0.5
  ): Memory[] {
    // Sort by importance + relevance
    // Select top memories that fit budget
    // ... implementation
    return selectedMemories
  }
}
```

### 5.2 Context Builder

```typescript
// packages/memory/src/context/context-builder.ts

export class ContextBuilder {
  private budgetManager: TokenBudgetManager
  private compressor: Compressor
  private formatter: ContextFormatter
  
  constructor(
    budgetManager: TokenBudgetManager,
    compressor: Compressor,
    formatter: ContextFormatter
  ) {
    this.budgetManager = budgetManager
    this.compressor = compressor
    this.formatter = formatter
  }
  
  async build(options: ContextOptions): Promise<ContextBundle> {
    // 1. Get allocation
    const allocation = this.budgetManager.getAllocation({})
    
    // 2. Retrieve memories
    const semanticMemories = await this.retrieveSemantic(options)
    const episodicMemories = await this.retrieveEpisodic(options)
    
    // 3. Optimize to fit budget
    const optimizedSemantic = this.budgetManager.optimizeToFit(
      semanticMemories.map(r => r.memory),
      allocation.semanticMemories
    )
    const optimizedEpisodic = this.budgetManager.optimizeToFit(
      episodicMemories.map(r => r.memory),
      allocation.episodicMemories
    )
    
    // 4. Compress if needed
    const compressed = await this.compressIfNeeded(
      optimizedSemantic,
      optimizedEpisodic,
      allocation
    )
    
    // 5. Build bundle
    const bundle: ContextBundle = {
      systemPrompt: options.systemPrompt || '',
      userPreferences: await this.getUserPreferences(allocation.userPreferences),
      recentContext: await this.getRecentContext(allocation.recentContext),
      semanticMemories: compressed.semantic,
      episodicMemories: compressed.episodic,
      summary: await this.getSummary(allocation.summary),
      tokenBreakdown: this.calculateTokens(bundle),
      metadata: {
        compressionRatio: compressed.ratio,
        memoriesRetrieved: semanticMemories.length + episodicMemories.length,
        memoriesFiltered: 0,
        memoriesCompressed: compressed.count,
        strategiesUsed: compressed.strategies
      }
    }
    
    // 6. Format for LLM
    bundle.formatted = this.formatter.format(bundle)
    
    return bundle
  }
  
  // Helper methods...
}
```

### 5.3 Context Optimizer

```typescript
// packages/memory/src/context/optimizer.ts

export class ContextOptimizer {
  private budgetManager: TokenBudgetManager
  private compressor: Compressor
  private scorer: RelevanceScorer
  
  optimizeContext(
    context: {
      systemPrompt: string
      userPreferences: Record<string, any>
      recentMessages: string[]
      semanticMemories: Memory[]
      episodicMemories: Memory[]
    },
    budget: number
  ): ContextBundle {
    // 1. Count current tokens
    const currentTokens = this.countTokens(context)
    
    // 2. If within budget, return as-is
    if (currentTokens <= budget) {
      return this.buildBundle(context)
    }
    
    // 3. Optimize each component
    const optimized = {
      systemPrompt: this.optimizeSystemPrompt(context.systemPrompt, budget * 0.1),
      userPreferences: this.optimizePreferences(context.userPreferences, budget * 0.15),
      recentMessages: this.optimizeRecentMessages(context.recentMessages, budget * 0.3),
      semanticMemories: this.optimizeMemories(context.semanticMemories, budget * 0.25),
      episodicMemories: this.optimizeMemories(context.episodicMemories, budget * 0.15)
    }
    
    // 4. Build optimized bundle
    return this.buildBundle(optimized)
  }
  
  private optimizeMemories(
    memories: Memory[],
    budget: number
  ): Memory[] {
    // Score memories
    const scored = memories.map(m => ({
      memory: m,
      score: this.scorer.score(m)
    }))
    
    // Sort by score
    scored.sort((a, b) => b.score - a.score)
    
    // Select top memories that fit budget
    const selected: Memory[] = []
    let tokens = 0
    
    for (const { memory } of scored) {
      const memoryTokens = this.countTokens(memory.content)
      if (tokens + memoryTokens <= budget) {
        selected.push(memory)
        tokens += memoryTokens
      } else {
        break
      }
    }
    
    return selected
  }
  
  // More optimization methods...
}
```

### 5.4 Priority Scoring

```typescript
// packages/memory/src/scoring/importance-scorer.ts

export class ImportanceScorer {
  private config: {
    recencyWeight: number
    frequencyWeight: number
    userBoostWeight: number
    relevanceWeight: number
  }
  
  score(memory: Memory, query?: string): MemoryScore {
    const base = memory.importance
    
    // Recency score (exponential decay)
    const ageDays = (Date.now() - memory.timestamp.getTime()) / (1000 * 60 * 60 * 24)
    const recency = Math.exp(-ageDays / 7) // 7-day half-life
    
    // Frequency score (log scale)
    const frequency = Math.min(1, Math.log10(memory.accessCount + 1) / 3)
    
    // User boost (from metadata)
    const userBoost = memory.metadata.boost || 0
    
    // Semantic relevance (if query provided)
    const semanticRelevance = query 
      ? this.calculateRelevance(memory, query)
      : 0.5
    
    // Combine scores
    const final = (
      base * 0.3 +
      recency * this.config.recencyWeight +
      frequency * this.config.frequencyWeight +
      userBoost * this.config.userBoostWeight +
      semanticRelevance * this.config.relevanceWeight
    )
    
    return {
      base,
      recency,
      frequency,
      userBoost,
      semanticRelevance,
      final: Math.min(1, Math.max(0, final)),
      breakdown: {
        recencyWeight: this.config.recencyWeight,
        frequencyWeight: this.config.frequencyWeight,
        relevanceWeight: this.config.relevanceWeight
      }
    }
  }
  
  private calculateRelevance(memory: Memory, query: string): number {
    // Use embedding similarity if available
    // Otherwise use keyword matching
    // ... implementation
    return 0.5
  }
}
```

### 5.5 Semantic Grouping

```typescript
// packages/memory/src/core/memory-manager.ts (excerpt)

async groupByTopic(memories: Memory[]): Promise<Map<string, Memory[]>> {
  if (memories.length === 0) return new Map()
  
  // Use embeddings to cluster
  const embeddings = await Promise.all(
    memories.map(m => 
      m.embedding || this.embeddingProvider.embed(m.content)
    )
  )
  
  // Simple k-means clustering (or use a library)
  const clusters = this.cluster(embeddings, Math.min(10, Math.ceil(memories.length / 5)))
  
  // Group memories by cluster
  const groups = new Map<string, Memory[]>()
  
  clusters.forEach((cluster, index) => {
    const topic = `topic-${index}`
    const clusterMemories = cluster.indices.map(i => memories[i])
    groups.set(topic, clusterMemories)
  })
  
  return groups
}
```

### 5.6 Summarization Pipeline

```typescript
// packages/memory/src/pipelines/compression-pipeline.ts

export class CompressionPipeline {
  private summarizer: Summarizer
  private compressor: Compressor
  
  async compress(
    memories: Memory[],
    budget: number
  ): Promise<{
    compressed: Memory[]
    ratio: number
    strategies: string[]
  }> {
    const strategies: string[] = []
    let compressed: Memory[] = []
    let totalOriginalTokens = 0
    let totalCompressedTokens = 0
    
    for (const memory of memories) {
      const originalTokens = this.countTokens(memory.content)
      totalOriginalTokens += originalTokens
      
      // Choose compression strategy
      const strategy = this.chooseStrategy(memory, budget)
      strategies.push(strategy)
      
      let compressedMemory: Memory
      
      switch (strategy) {
        case 'summarize':
          compressedMemory = await this.summarizeMemory(memory)
          break
        case 'extract':
          compressedMemory = await this.extractFacts(memory)
          break
        case 'truncate':
          compressedMemory = this.truncateMemory(memory, budget)
          break
        default:
          compressedMemory = memory
      }
      
      const compressedTokens = this.countTokens(compressedMemory.content)
      totalCompressedTokens += compressedTokens
      
      compressed.push(compressedMemory)
    }
    
    return {
      compressed,
      ratio: totalCompressedTokens / totalOriginalTokens,
      strategies: [...new Set(strategies)]
    }
  }
  
  private chooseStrategy(memory: Memory, budget: number): CompressionStrategy {
    // Adaptive strategy selection
    // ... implementation
    return 'adaptive'
  }
}
```

---

## 6. Integration Points

### 6.1 React Integration

```typescript
// packages/memory/src/react/useMemory.ts

export function useMemory(config?: MemoryConfig) {
  const [memory] = useState(() => clarityMemory(config))
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(false)
  
  const add = useCallback(async (content: string, options?: any) => {
    setLoading(true)
    try {
      const mem = await memory.add(content, options)
      setMemories(prev => [...prev, mem])
      return mem
    } finally {
      setLoading(false)
    }
  }, [memory])
  
  const recall = useCallback(async (query: string, options?: any) => {
    setLoading(true)
    try {
      return await memory.recall(query, options)
    } finally {
      setLoading(false)
    }
  }, [memory])
  
  return {
    memory,
    memories,
    add,
    recall,
    loading,
    stats: memory.getStats()
  }
}
```

### 6.2 Node.js Integration

```typescript
// Example: Express.js middleware

import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory({
  storage: { type: 'redis', url: process.env.REDIS_URL },
  embeddingProvider: { provider: 'openai', apiKey: process.env.OPENAI_API_KEY }
})

app.post('/chat', async (req, res) => {
  const { userId, message } = req.body
  
  // Get context
  const context = await memory.context({
    maxTokens: 2000,
    userId
  })
  
  // Call LLM
  const response = await callLLM(message, context.formatted)
  
  // Store interaction
  await memory.add(message, { userId, type: 'episodic' })
  
  res.json({ response })
})
```

### 6.3 Serverless Integration

```typescript
// Example: Vercel/Netlify function

import { clarityMemory } from '@clarity-chat/memory'

export default async function handler(req, res) {
  // Use in-memory or IndexedDB (browser) storage
  const memory = clarityMemory({
    storage: { type: 'in-memory' },
    embeddingProvider: { provider: 'local', model: 'Xenova/all-MiniLM-L6-v2' }
  })
  
  // ... use memory
}
```

---

## 7. Next Steps

Proceed to Phase 4: Integration patterns and Phase 5: Documentation.
