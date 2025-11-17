# Phase 3: Implementation Blueprint

## Executive Summary

This document provides the complete implementation blueprint for Clarity Memory, including module layout, type definitions, API signatures, storage adapters, and context engine architecture.

---

## 1. Full Module Layout

```
packages/memory/
├── src/
│   ├── index.ts                          # Main export
│   │
│   ├── core/
│   │   ├── memory.ts                     # Core Memory class
│   │   ├── memory-item.ts                # MemoryItem type & utilities
│   │   ├── memory-chunk.ts               # MemoryChunk type & utilities
│   │   ├── context-bundle.ts             # ContextBundle builder
│   │   └── memory-lifecycle.ts           # Lifecycle management
│   │
│   ├── stores/
│   │   ├── base.ts                        # Base store interface
│   │   ├── in-memory.ts                   # In-memory store
│   │   ├── file.ts                        # File system store
│   │   ├── indexeddb.ts                   # IndexedDB store (browser)
│   │   ├── redis.ts                       # Redis store adapter
│   │   ├── postgres.ts                    # PostgreSQL store adapter
│   │   ├── sqlite.ts                      # SQLite store adapter
│   │   ├── chroma.ts                      # ChromaDB adapter
│   │   ├── qdrant.ts                      # Qdrant adapter
│   │   ├── pinecone.ts                   # Pinecone adapter
│   │   └── lancedb.ts                     # LanceDB adapter
│   │
│   ├── embeddings/
│   │   ├── base.ts                        # Base embedder interface
│   │   ├── openai.ts                      # OpenAI embedder
│   │   ├── anthropic.ts                  # Anthropic embedder
│   │   ├── local.ts                       # Local embedder (sentence-transformers)
│   │   └── cache.ts                       # Embedding cache
│   │
│   ├── scoring/
│   │   ├── scorer.ts                      # Base scorer interface
│   │   ├── importance-scorer.ts           # Importance scoring
│   │   ├── recency-scorer.ts              # Recency scoring
│   │   ├── frequency-scorer.ts            # Frequency scoring
│   │   ├── relevance-scorer.ts             # Relevance scoring
│   │   └── composite-scorer.ts            # Composite scorer
│   │
│   ├── summarization/
│   │   ├── summarizer.ts                  # Base summarizer interface
│   │   ├── llm-summarizer.ts              # LLM-powered summarizer
│   │   ├── extractive-summarizer.ts       # Extractive summarizer
│   │   └── pipeline.ts                   # Summarization pipeline
│   │
│   ├── compression/
│   │   ├── compressor.ts                  # Base compressor interface
│   │   ├── summarization-compressor.ts    # Summarization-based compression
│   │   ├── deduplication-compressor.ts    # Deduplication compressor
│   │   ├── pruning-compressor.ts          # Pruning compressor
│   │   └── adaptive-compressor.ts         # Adaptive compressor
│   │
│   ├── pipelines/
│   │   ├── ingestion-pipeline.ts          # Memory ingestion pipeline
│   │   ├── retrieval-pipeline.ts          # Memory retrieval pipeline
│   │   ├── compression-pipeline.ts        # Compression pipeline
│   │   └── extraction-pipeline.ts         # Extraction pipeline
│   │
│   ├── adapters/
│   │   ├── vercel-ai-sdk.ts               # Vercel AI SDK adapter
│   │   ├── langchain.ts                   # LangChain adapter
│   │   ├── openai.ts                      # OpenAI API adapter
│   │   └── anthropic.ts                   # Anthropic API adapter
│   │
│   ├── context/
│   │   ├── context-engine.ts              # Main context engine
│   │   ├── token-budget.ts                 # Token budgeting
│   │   ├── priority-selector.ts           # Priority-based selection
│   │   ├── semantic-grouper.ts            # Semantic grouping
│   │   └── formatter.ts                   # Context formatting
│   │
│   ├── react/
│   │   ├── use-memory.ts                  # React hook
│   │   ├── memory-provider.tsx            # Context provider
│   │   └── memory-inspector.tsx           # DevTools inspector component
│   │
│   ├── utils/
│   │   ├── token-counter.ts               # Token counting utilities
│   │   ├── chunking.ts                     # Text chunking utilities
│   │   ├── similarity.ts                   # Similarity calculation
│   │   ├── time.ts                         # Time utilities
│   │   └── validation.ts                  # Validation utilities
│   │
│   └── types/
│       ├── index.ts                        # All type exports
│       ├── memory.ts                       # Core memory types
│       ├── config.ts                       # Configuration types
│       ├── store.ts                        # Store types
│       ├── embedding.ts                    # Embedding types
│       └── scoring.ts                       # Scoring types
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── examples/
│   ├── basic-usage.ts
│   ├── react-example.tsx
│   ├── serverless-example.ts
│   └── node-script-example.ts
│
├── docs/
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── API_REFERENCE.md
│   ├── MIGRATION_GUIDE.md
│   └── ARCHITECTURE.md
│
├── package.json
├── tsconfig.json
└── README.md
```

---

## 2. Type System

### 2.1 Core Types

```typescript
// types/memory.ts

/**
 * A single memory item stored in the system
 */
export interface MemoryItem {
  /** Unique identifier for this memory */
  id: string
  
  /** The actual content/text of the memory */
  content: string
  
  /** When this memory was created */
  timestamp: Date
  
  /** When this memory was last accessed */
  lastAccessed?: Date
  
  /** How many times this memory has been accessed */
  accessCount: number
  
  /** Importance score (0-1) */
  importance: number
  
  /** User-defined metadata */
  metadata?: Record<string, unknown>
  
  /** Embedding vector (if available) */
  embedding?: number[]
  
  /** Topic/cluster this memory belongs to */
  topic?: string
  
  /** TTL in milliseconds (optional) */
  ttl?: number
}

/**
 * A chunk of memory (for large memories that are chunked)
 */
export interface MemoryChunk {
  /** Unique identifier */
  id: string
  
  /** Parent memory ID */
  memoryId: string
  
  /** Chunk index */
  index: number
  
  /** Chunk content */
  content: string
  
  /** Embedding vector */
  embedding: number[]
  
  /** Metadata */
  metadata?: Record<string, unknown>
}

/**
 * Embedding vector with metadata
 */
export interface Embedding {
  /** The embedding vector */
  vector: number[]
  
  /** Model used to generate this embedding */
  model: string
  
  /** Dimensions of the vector */
  dimensions: number
  
  /** When this embedding was created */
  timestamp: Date
}

/**
 * Memory score with breakdown
 */
export interface MemoryScore {
  /** Overall score (0-1) */
  score: number
  
  /** Recency score component */
  recency: number
  
  /** Frequency score component */
  frequency: number
  
  /** Relevance score component */
  relevance: number
  
  /** Importance score component */
  importance: number
  
  /** When this score was calculated */
  timestamp: Date
}

/**
 * Search result with metadata
 */
export interface SearchResult {
  /** The memory item */
  memory: MemoryItem
  
  /** Relevance score (0-1) */
  score: number
  
  /** Score breakdown */
  scoreBreakdown: MemoryScore
  
  /** Why this result was selected */
  reason?: string
}

/**
 * Context bundle prepared for LLM
 */
export interface ContextBundle {
  /** Formatted messages for LLM */
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
  
  /** Actual token count */
  tokens: number
  
  /** Summary of older/compressed memories */
  summary?: string
  
  /** Memories included in this bundle */
  memories: MemoryItem[]
  
  /** Format used (openai, anthropic, etc.) */
  format: string
}

/**
 * Summarization result
 */
export interface SummarizationResult {
  /** The summary text */
  summary: string
  
  /** Memories that were summarized */
  sourceMemories: MemoryItem[]
  
  /** Token count of summary */
  tokens: number
  
  /** When this summary was created */
  timestamp: Date
}

/**
 * Compression result
 */
export interface CompressionResult {
  /** Number of memories before compression */
  before: number
  
  /** Number of memories after compression */
  after: number
  
  /** Compression ratio */
  ratio: number
  
  /** Strategy used */
  strategy: string
  
  /** Summary created (if applicable) */
  summary?: SummarizationResult
}
```

### 2.2 Configuration Types

```typescript
// types/config.ts

/**
 * Embedding provider configuration
 */
export interface EmbeddingConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'local'
  
  /** Model name */
  model?: string
  
  /** API key (if required) */
  apiKey?: string
  
  /** Additional provider-specific config */
  config?: Record<string, unknown>
  
  /** Cache embeddings */
  cache?: boolean
  
  /** Cache TTL in milliseconds */
  cacheTTL?: number
}

/**
 * Storage configuration
 */
export interface StoreConfig {
  /** Store type */
  type: 'in-memory' | 'file' | 'indexeddb' | 'redis' | 'postgres' | 'sqlite' | 'chroma' | 'qdrant' | 'pinecone' | 'lancedb'
  
  /** Store-specific configuration */
  config?: Record<string, unknown>
  
  /** Path (for file-based stores) */
  path?: string
  
  /** Connection string (for database stores) */
  connectionString?: string
}

/**
 * Short-term memory configuration
 */
export interface ShortTermConfig {
  /** Maximum number of messages */
  maxMessages?: number
  
  /** Maximum tokens */
  maxTokens?: number
  
  /** Maximum message length in characters */
  maxMessageLength?: number
  
  /** Auto-summarize when evicting */
  autoSummarize?: boolean
}

/**
 * Long-term memory configuration
 */
export interface LongTermConfig {
  /** Enable long-term memory */
  enabled: boolean
  
  /** Storage configuration */
  store: StoreConfig
  
  /** Minimum importance score to store long-term */
  minImportance?: number
}

/**
 * Scoring configuration
 */
export interface ScoringConfig {
  /** Weight for recency (0-1) */
  recencyWeight?: number
  
  /** Weight for frequency (0-1) */
  frequencyWeight?: number
  
  /** Weight for relevance (0-1) */
  relevanceWeight?: number
  
  /** Weight for importance (0-1) */
  importanceWeight?: number
  
  /** Time decay configuration */
  timeDecay?: {
    enabled: boolean
    halfLife: number  // milliseconds
  }
}

/**
 * Summarization configuration
 */
export interface SummarizationConfig {
  /** Provider */
  provider?: 'openai' | 'anthropic' | 'local'
  
  /** Model */
  model?: string
  
  /** API key */
  apiKey?: string
  
  /** Auto-summarize */
  auto?: boolean
  
  /** Summarization prompt template */
  promptTemplate?: string
}

/**
 * Token budget configuration
 */
export interface TokenBudgetConfig {
  /** Maximum tokens */
  maxTokens: number
  
  /** Reserve tokens for system prompts */
  reserveTokens?: number
  
  /** Selection strategy */
  strategy?: 'priority' | 'recent' | 'balanced'
}

/**
 * Main configuration
 */
export interface MemoryConfig {
  /** Context identifier (user, session, etc.) */
  context?: string
  
  /** Embedding configuration */
  embedding?: EmbeddingConfig
  
  /** Storage configuration */
  store?: StoreConfig
  
  /** Short-term memory configuration */
  shortTerm?: ShortTermConfig
  
  /** Long-term memory configuration */
  longTerm?: LongTermConfig
  
  /** Scoring configuration */
  scoring?: ScoringConfig
  
  /** Summarization configuration */
  summarizer?: SummarizationConfig
  
  /** Token budget configuration */
  tokenBudget?: TokenBudgetConfig
  
  /** Target model for optimization */
  targetModel?: string
  
  /** Context format */
  contextFormat?: 'openai' | 'anthropic' | 'claude'
}
```

### 2.3 Store Types

```typescript
// types/store.ts

/**
 * Base store interface
 */
export interface MemoryStore {
  /** Initialize the store */
  init(): Promise<void>
  
  /** Add a memory item */
  add(item: MemoryItem): Promise<void>
  
  /** Get a memory item by ID */
  get(id: string): Promise<MemoryItem | null>
  
  /** Search memories */
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  
  /** Update a memory item */
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  
  /** Delete a memory item */
  delete(id: string): Promise<void>
  
  /** Get all memories */
  getAll(): Promise<MemoryItem[]>
  
  /** Clear all memories */
  clear(): Promise<void>
  
  /** Get statistics */
  stats(): Promise<StoreStats>
  
  /** Close the store */
  close(): Promise<void>
}

/**
 * Search options
 */
export interface SearchOptions {
  /** Maximum number of results */
  limit?: number
  
  /** Minimum score threshold */
  minScore?: number
  
  /** Filters */
  filters?: Record<string, unknown>
  
  /** Sort by */
  sortBy?: 'relevance' | 'recency' | 'importance'
}

/**
 * Store statistics
 */
export interface StoreStats {
  /** Total number of memories */
  totalMemories: number
  
  /** Total tokens */
  totalTokens: number
  
  /** Oldest memory timestamp */
  oldestMemory?: Date
  
  /** Newest memory timestamp */
  newestMemory?: Date
  
  /** Average importance score */
  averageImportance: number
}
```

---

## 3. API Signatures

### 3.1 Core API

```typescript
// core/memory.ts

/**
 * Create a new memory instance
 */
export function clarityMemory(config?: MemoryConfig): Memory

/**
 * Main Memory class
 */
export class Memory {
  /**
   * Add a memory
   */
  add(
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<MemoryItem>
  
  /**
   * Add multiple memories
   */
  addMany(
    contents: Array<string | { content: string; metadata?: Record<string, unknown> }>
  ): Promise<MemoryItem[]>
  
  /**
   * Recall memories (simple search)
   */
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
  
  /**
   * Search memories (advanced)
   */
  search(options: {
    query: string
    limit?: number
    minScore?: number
    filters?: Record<string, unknown>
    sortBy?: 'relevance' | 'recency' | 'importance'
    topic?: string
  }): Promise<SearchResult[]>
  
  /**
   * Get optimized context bundle for LLM
   */
  context(options: {
    query: string
    maxTokens: number
    format?: 'openai' | 'anthropic' | 'claude'
    includeSummary?: boolean
  }): Promise<ContextBundle>
  
  /**
   * Promote a memory (increase importance)
   */
  promote(memoryId: string): Promise<void>
  
  /**
   * Forget a memory (decrease importance or delete)
   */
  forget(memoryId: string, soft?: boolean): Promise<void>
  
  /**
   * Forget memories by query
   */
  forgetByQuery(query: string): Promise<number>
  
  /**
   * Compress memory
   */
  compress(options: {
    strategy?: 'adaptive' | 'summarize' | 'deduplicate' | 'prune'
    targetSize?: string | number  // "50%" or absolute number
    minScore?: number
  }): Promise<CompressionResult>
  
  /**
   * Flush all memory
   */
  flush(): Promise<void>
  
  /**
   * Get memory statistics
   */
  stats(): Promise<{
    totalMemories: number
    tokens: number
    oldestMemory?: Date
    newestMemory?: Date
    averageImportance: number
  }>
  
  /**
   * Extract memories from chat messages
   */
  extractFromMessages(
    messages: Array<{ role: string; content: string }>,
    options?: {
      extractPreferences?: boolean
      extractFacts?: boolean
      extractEvents?: boolean
    }
  ): Promise<MemoryItem[]>
  
  /**
   * Get memory topics
   */
  topics(): Promise<Array<{
    topic: string
    memories: MemoryItem[]
    score: number
  }>>
  
  /**
   * Get memories for a topic
   */
  getTopic(topic: string): Promise<MemoryItem[]>
  
  /**
   * Embed text
   */
  embed(text: string): Promise<number[]>
  
  /**
   * Summarize memories
   */
  summarize(memories: MemoryItem[]): Promise<SummarizationResult>
  
  /**
   * Inspect memory (for debugging)
   */
  inspect(): {
    memories: MemoryItem[]
    stats: StoreStats
    config: MemoryConfig
  }
  
  /**
   * Lifecycle hooks
   */
  on(event: 'ingestion' | 'compression' | 'eviction', handler: Function): void
  off(event: string, handler: Function): void
  
  /**
   * Close and cleanup
   */
  close(): Promise<void>
}
```

### 3.2 React API

```typescript
// react/use-memory.ts

/**
 * React hook for memory
 */
export function useMemory(config?: MemoryConfig): {
  memory: Memory
  add: (content: string, metadata?: Record<string, unknown>) => Promise<MemoryItem>
  recall: (query: string, options?: RecallOptions) => Promise<RecallResult>
  search: (options: SearchOptions) => Promise<SearchResult[]>
  stats: StoreStats
  loading: boolean
  error: Error | null
}

/**
 * Memory provider component
 */
export function MemoryProvider({
  config,
  children
}: {
  config?: MemoryConfig
  children: React.ReactNode
}): JSX.Element

/**
 * Memory inspector component (DevTools)
 */
export function MemoryInspector({
  memory
}: {
  memory: Memory
}): JSX.Element
```

### 3.3 Adapter APIs

```typescript
// adapters/vercel-ai-sdk.ts

/**
 * Vercel AI SDK adapter
 */
export function createMemoryAdapter(memory: Memory): {
  getContext: (query: string, maxTokens: number) => Promise<ContextBundle>
  addMessage: (message: { role: string; content: string }) => Promise<void>
}

// adapters/openai.ts

/**
 * OpenAI API adapter
 */
export function createOpenAIAdapter(memory: Memory): {
  getMessages: (query: string, maxTokens: number) => Promise<Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>>
}
```

---

## 4. Multi-Store Adapters

### 4.1 In-Memory Store

```typescript
// stores/in-memory.ts

export class InMemoryStore implements MemoryStore {
  private memories: Map<string, MemoryItem> = new Map()
  
  async init(): Promise<void> {
    // No initialization needed
  }
  
  async add(item: MemoryItem): Promise<void> {
    this.memories.set(item.id, item)
  }
  
  async get(id: string): Promise<MemoryItem | null> {
    return this.memories.get(id) || null
  }
  
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    // Simple text search (for in-memory, embeddings handled separately)
    // ...
  }
  
  // ... other methods
}
```

### 4.2 File Store

```typescript
// stores/file.ts

export class FileStore implements MemoryStore {
  private path: string
  
  constructor(config: { path: string }) {
    this.path = config.path
  }
  
  async init(): Promise<void> {
    // Ensure directory exists
    await fs.mkdir(path.dirname(this.path), { recursive: true })
  }
  
  async add(item: MemoryItem): Promise<void> {
    const data = await this.load()
    data.memories.push(item)
    await this.save(data)
  }
  
  private async load(): Promise<{ memories: MemoryItem[] }> {
    // Load from JSON file
  }
  
  private async save(data: { memories: MemoryItem[] }): Promise<void> {
    // Save to JSON file
  }
  
  // ... other methods
}
```

### 4.3 IndexedDB Store (Browser)

```typescript
// stores/indexeddb.ts

export class IndexedDBStore implements MemoryStore {
  private db: IDBDatabase | null = null
  
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('clarity-memory', 1)
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains('memories')) {
          db.createObjectStore('memories', { keyPath: 'id' })
        }
      }
    })
  }
  
  async add(item: MemoryItem): Promise<void> {
    // Add to IndexedDB
  }
  
  // ... other methods
}
```

### 4.4 Vector DB Adapters

```typescript
// stores/chroma.ts

export class ChromaStore implements MemoryStore {
  private client: ChromaClient
  
  async init(): Promise<void> {
    // Initialize ChromaDB client
  }
  
  async add(item: MemoryItem): Promise<void> {
    // Add to ChromaDB with embedding
  }
  
  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    // Semantic search via ChromaDB
  }
  
  // ... other methods
}
```

---

## 5. Context Engine Architecture

### 5.1 Context Engine Flow

```
User Query
    ↓
Context Engine
    ↓
┌─────────────────────────────────────┐
│ 1. Token Budget Calculator          │
│    - Calculate available tokens      │
│    - Reserve tokens for prompts     │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 2. Memory Retrieval                 │
│    - Search short-term memory        │
│    - Search long-term memory         │
│    - Get summaries                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 3. Scoring & Ranking                │
│    - Calculate scores                │
│    - Rank by priority                │
│    - Apply filters                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 4. Token-Aware Selection            │
│    - Select memories within budget  │
│    - Prioritize high-score items    │
│    - Summarize low-priority items    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 5. Semantic Grouping                 │
│    - Group related memories          │
│    - Create topic clusters           │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ 6. Formatting                       │
│    - Format for target LLM           │
│    - Create message array            │
│    - Add system prompts              │
└─────────────────────────────────────┘
    ↓
Context Bundle (ready for LLM)
```

### 5.2 Token Budget Calculator

```typescript
// context/token-budget.ts

export class TokenBudget {
  constructor(
    private maxTokens: number,
    private reserveTokens: number = 0
  ) {}
  
  /**
   * Calculate available tokens for memories
   */
  available(): number {
    return this.maxTokens - this.reserveTokens
  }
  
  /**
   * Check if a memory fits within budget
   */
  fits(memory: MemoryItem, currentTokens: number): boolean {
    const memoryTokens = estimateTokens(memory.content)
    return currentTokens + memoryTokens <= this.available()
  }
  
  /**
   * Select memories within budget
   */
  selectWithinBudget(
    memories: MemoryItem[],
    strategy: 'priority' | 'recent' | 'balanced'
  ): MemoryItem[] {
    // Implementation
  }
}
```

### 5.3 Priority Selector

```typescript
// context/priority-selector.ts

export class PrioritySelector {
  constructor(private scorer: CompositeScorer) {}
  
  /**
   * Select top memories by priority
   */
  select(
    memories: MemoryItem[],
    limit: number,
    minScore: number = 0
  ): MemoryItem[] {
    // Score all memories
    const scored = memories.map(m => ({
      memory: m,
      score: this.scorer.score(m)
    }))
    
    // Filter by min score
    const filtered = scored.filter(s => s.score >= minScore)
    
    // Sort by score (descending)
    const sorted = filtered.sort((a, b) => b.score - a.score)
    
    // Return top N
    return sorted.slice(0, limit).map(s => s.memory)
  }
}
```

### 5.4 Semantic Grouper

```typescript
// context/semantic-grouper.ts

export class SemanticGrouper {
  constructor(private embedder: Embedder) {}
  
  /**
   * Group memories by semantic similarity
   */
  async group(memories: MemoryItem[]): Promise<Array<{
    topic: string
    memories: MemoryItem[]
    score: number
  }>> {
    // Cluster memories by embedding similarity
    // Return topic groups
  }
}
```

### 5.5 Formatter

```typescript
// context/formatter.ts

export class ContextFormatter {
  /**
   * Format context for OpenAI
   */
  formatOpenAI(bundle: ContextBundle): Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }> {
    // Format for OpenAI Chat API
  }
  
  /**
   * Format context for Anthropic
   */
  formatAnthropic(bundle: ContextBundle): Array<{
    role: 'user' | 'assistant'
    content: string
  }> {
    // Format for Anthropic Messages API
  }
}
```

---

## 6. Implementation Notes

### 6.1 Default Configuration

```typescript
const DEFAULT_CONFIG: MemoryConfig = {
  context: 'default',
  embedding: {
    provider: 'openai',
    model: 'text-embedding-3-small',
    cache: true,
  },
  store: {
    type: 'in-memory',
  },
  shortTerm: {
    maxMessages: 50,
    maxTokens: 32000,
    autoSummarize: true,
  },
  longTerm: {
    enabled: true,
    store: {
      type: 'in-memory',
    },
  },
  scoring: {
    recencyWeight: 0.4,
    frequencyWeight: 0.3,
    relevanceWeight: 0.3,
  },
  summarizer: {
    provider: 'openai',
    model: 'gpt-4o-mini',
    auto: true,
  },
  tokenBudget: {
    maxTokens: 4000,
    reserveTokens: 500,
    strategy: 'priority',
  },
}
```

### 6.2 Error Handling

```typescript
export class MemoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public cause?: Error
  ) {
    super(message)
    this.name = 'MemoryError'
  }
}

export const MemoryErrorCodes = {
  STORE_ERROR: 'STORE_ERROR',
  EMBEDDING_ERROR: 'EMBEDDING_ERROR',
  TOKEN_BUDGET_EXCEEDED: 'TOKEN_BUDGET_EXCEEDED',
  INVALID_CONFIG: 'INVALID_CONFIG',
} as const
```

### 6.3 Performance Considerations

1. **Embedding Caching**: Cache embeddings to avoid redundant API calls
2. **Lazy Loading**: Load long-term memories on-demand
3. **Batch Operations**: Support batch adds/searches
4. **Indexing**: Index memories for fast retrieval
5. **Compression**: Compress old memories to reduce storage

---

## Conclusion

This blueprint provides the complete foundation for implementing Clarity Memory. The architecture is:
- **Modular**: Clear separation of concerns
- **Extensible**: Easy to add new stores, embedders, scorers
- **Type-Safe**: Full TypeScript support
- **Performant**: Optimized for common use cases
- **Developer-Friendly**: Simple APIs, good defaults

Next: Phase 4 will cover integration patterns and examples.
