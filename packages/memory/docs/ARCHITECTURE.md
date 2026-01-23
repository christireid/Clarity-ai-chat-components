# Memory System Architecture

Comprehensive guide to the Clarity Memory system architecture, design patterns, and internal workings.

---

## Table of Contents

- [System Overview](#system-overview)
- [Architecture Layers](#architecture-layers)
- [Core Components](#core-components)
- [Memory Flow](#memory-flow)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Integration Points](#integration-points)
- [Design Patterns](#design-patterns)
- [Performance Characteristics](#performance-characteristics)

---

## System Overview

The Clarity Memory system is a **hybrid memory architecture** combining multiple storage layers, search strategies, and intelligence systems to provide context-aware AI chat experiences.

### Key Design Principles

1. **Hybrid Storage**: Combines in-memory cache with persistent vector store
2. **Multi-Type Support**: Episodic, semantic, procedural, and working memory
3. **Hierarchical Scoping**: Global, user, thread, and session boundaries
4. **Privacy-First**: GDPR/CCPA compliance built-in from ground up
5. **Token-Aware**: Strict budget enforcement prevents context overflow
6. **Intelligent Retrieval**: Importance scoring with recency, frequency, relevance

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Layer                            │
│  (React Components, Chat UI, User Interactions)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                   Memory Service API                             │
│  • addMemory()  • query()  • updateMemory()  • deleteMemory()    │
│  • captureToolCall()  • getToolHistory()  • recall()             │
└─────┬────────────────┬────────────────┬─────────────────────────┘
      │                │                │
      ▼                ▼                ▼
┌───────────┐  ┌─────────────┐  ┌──────────────────┐
│  Privacy  │  │ Intelligence │  │ Token Management │
│  Layer    │  │ Layer        │  │ Layer            │
│           │  │              │  │                  │
│ • Consent │  │ • Importance │  │ • Budget         │
│ • Audit   │  │   Scorer     │  │   Enforcement    │
│ • Export  │  │ • Decay      │  │ • Compression    │
└─────┬─────┘  └──────┬───────┘  └────────┬─────────┘
      │                │                    │
      └────────────────┴────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────────┐
│                   Storage Layer                                  │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │ Memory Cache │  │ Vector Store │  │ Embedding Provider   │   │
│  │ (In-Memory)  │  │ (Persistent) │  │ (External API)       │   │
│  └──────────────┘  └─────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Architecture Layers

### 1. Application Layer

**Responsibility**: User-facing components and interactions

**Components**:

- React hooks (`useMemories`, `useMemoryQuery`, etc.)
- Chat UI components
- Tool integrations
- Event handlers

**Example**:

```typescript
function ChatComponent() {
  const { add, query } = useMemories({ userId })

  const handleMessage = async (msg: string) => {
    await add(msg, { type: 'episodic', scope: 'thread' })
  }

  return <ChatInterface onSend={handleMessage} />
}
```

---

### 2. Service Layer

**Responsibility**: Core memory operations and orchestration

**Components**:

- `MemoryService` - Main service class
- Public API methods
- Configuration management
- Event emission

**Key Methods**:

- `addMemory()` - Store new memory
- `query()` - Search and retrieve
- `updateMemory()` - Modify existing
- `deleteMemory()` - Remove memory
- `captureToolCall()` - Tool integration

**Example**:

```typescript
const service = new MemoryService({
  limits: { maxMemories: 1000 },
  consent: { enabled: true },
  importanceScoring: { enabled: true },
})

await service.addMemory('content', 'episodic', 'thread', metadata)
```

---

### 3. Privacy Layer

**Responsibility**: GDPR/CCPA compliance and data protection

**Components**:

#### ConsentManager

- Tracks user consent per purpose
- Enforces consent requirements
- Records consent history
- Supports consent withdrawal

```typescript
await consentManager.grantConsent(userId, ['message_storage'])
await consentManager.requireConsent(userId, 'personalization') // Throws if not granted
```

#### AuditLogger

- Logs all data operations (GDPR Article 30)
- Records access, modifications, deletions
- Supports audit queries and reports
- Configurable retention policies

```typescript
auditLogger.log({
  eventType: 'memory_access',
  userId: 'user_123',
  action: 'query',
  details: { memoryCount: 10 },
})
```

#### Data Rights Implementation

- Right to Access: `exportUserData()`
- Right to Erasure: `deleteAllUserData()`
- Right to Portability: JSON export format
- Verification: `verifyDeletion()`

---

### 4. Intelligence Layer

**Responsibility**: Smart memory ranking and lifecycle management

**Components**:

#### ImportanceScorer

Multi-factor scoring for memory retrieval:

- **Recency**: Exponential decay (configurable half-life)
- **Frequency**: Access count normalization
- **Relevance**: Semantic similarity to query
- **Base Importance**: User-defined priority

**Formula**:

```
importance = (base × w₁) + (recency × w₂) + (frequency × w₃) + (relevance × w₄)

where:
  recency = e^(-λt)  [exponential decay]
  frequency = log(1 + accessCount)  [logarithmic scaling]
  relevance = cosineSimilarity(query, memory)
  weights sum to 1.0
```

**Example**:

```typescript
const scorer = new ImportanceScorer({
  recencyHalfLife: 7 * 24 * 60 * 60 * 1000, // 7 days
  weights: {
    base: 0.3,
    recency: 0.3,
    frequency: 0.2,
    relevance: 0.2,
  },
})

const scored = scorer.scoreBatch(memories, 'query text')
// Returns memories sorted by importance score
```

#### DecayManager

Memory forgetting and cleanup:

- Exponential decay over time
- Access-based retention boost
- Importance threshold filtering
- Automatic cleanup scheduling

---

### 5. Token Management Layer

**Responsibility**: Context window budget enforcement

**Components**:

#### Token Budget System

- Global max context window limit
- Per-query token budget
- Per-tool memory budget
- Automatic optimization and truncation

**Budget Allocation**:

```typescript
{
  maxContextWindow: 16000,
  allocation: {
    semantic: 30%,    // 4800 tokens
    episodic: 50%,    // 8000 tokens
    working: 20%,     // 3200 tokens
  }
}
```

#### Compression

- LLM-based summarization (80-90% reduction)
- Progressive summarization for old memories
- Extractive summarization fallback
- Quality gate thresholds

---

### 6. Storage Layer

**Responsibility**: Persistent and in-memory data storage

**Components**:

#### Memory Cache (In-Memory)

- Fast access to recent memories
- LRU eviction when limits exceeded
- Map-based indexing by ID
- Synchronous operations

```typescript
// Internal cache structure
private cache: Map<string, MemoryItem> = new Map()

// LRU eviction
if (cache.size >= maxMemories) {
  const oldest = findOldestByLastAccessed()
  cache.delete(oldest.id)
}
```

#### Vector Store (Persistent)

- Semantic search via embeddings
- Persistent storage across sessions
- Pluggable interface (Pinecone, Weaviate, etc.)
- Async operations

```typescript
interface VectorStore {
  upsert(vectors: VectorStoreVector[]): Promise<void>
  query(query: VectorStoreQuery): Promise<VectorStoreMatch[]>
  delete(ids: string[]): Promise<void>
}
```

#### Embedding Provider (External)

- Converts text to vector embeddings
- Pluggable interface (OpenAI, Cohere, local models)
- Cached to reduce API calls
- Batch processing support

```typescript
interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}
```

---

## Core Components

### MemoryItem Structure

```typescript
interface MemoryItem {
  // Identity
  id: string // Unique identifier

  // Classification
  type: MemoryType // episodic | semantic | procedural | working
  scope: MemoryScope // global | user | thread | session

  // Content
  content: string // Memory text
  embedding: number[] // Vector representation
  tokens: number // Token count

  // Metadata
  metadata: {
    userId?: string
    threadId?: string
    sessionId?: string
    messageId?: string
    role?: 'user' | 'assistant' | 'system' | 'tool'
    completionStatus?: 'complete' | 'aborted' | 'error'
    errorMessage?: string
    toolName?: string
    toolParams?: any
    toolResult?: any
    [key: string]: any
  }

  // Scoring
  confidence: number // 0-1
  importance: number // Calculated by ImportanceScorer
  priority: MemoryPriority // low | medium | high | critical

  // Temporal
  createdAt: Date
  updatedAt: Date
  lastAccessed: Date
  accessCount: number
}
```

### Memory Flow Lifecycle

```
1. INPUT
   ↓
2. VALIDATION
   • Consent check
   • Size limit check
   • Schema validation
   ↓
3. DEDUPLICATION (if enabled)
   • Similarity check
   • Time window filtering
   • Update vs. create decision
   ↓
4. ENRICHMENT
   • Generate embedding (if configured)
   • Calculate tokens
   • Set timestamps
   ↓
5. LIMIT ENFORCEMENT
   • Check memory count limit
   • Check token budget limit
   • LRU eviction if needed
   ↓
6. STORAGE
   • Write to cache
   • Write to vector store (async)
   • Log audit event
   ↓
7. NOTIFICATION
   • Emit 'memory:added' event
   • Update statistics
```

---

## Memory Flow

### Write Flow (addMemory)

```
┌────────────┐
│  addMemory │
└──────┬─────┘
       │
       ▼
┌──────────────────┐     NO     ┌────────────────┐
│ Consent Check?   ├───────────►│ Throw Error    │
└────────┬─────────┘             └────────────────┘
         │ YES
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Deduplication?   ├───────────►│ Find Similar   │
└────────┬─────────┘             └───────┬────────┘
         │ NO                            │ Found
         │                               ▼
         │                    ┌──────────────────┐
         │                    │ Update Existing  │
         │                    └──────────────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Size > Limit?    ├───────────►│ Throw Error    │
└────────┬─────────┘             └────────────────┘
         │ NO
         ▼
┌──────────────────┐
│ Generate         │
│ Embedding        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Count >= Max?    ├───────────►│ Evict Oldest   │
└────────┬─────────┘             └────────┬───────┘
         │ NO                             │
         └────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│ Write to Cache   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Write to Vector  │
│ Store (async)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Log Audit Event  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Emit Event       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return Memory    │
└──────────────────┘
```

### Read Flow (query)

```
┌────────────┐
│   query    │
└──────┬─────┘
       │
       ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Has Embedding?   ├───────────►│ Vector Search  │
└────────┬─────────┘             └───────┬────────┘
         │ NO                            │
         ▼                               │
┌──────────────────┐     YES    ┌───────▼────────┐
│ Has Query Text?  ├───────────►│ Generate       │
└────────┬─────────┘             │ Embedding &    │
         │ NO                    │ Vector Search  │
         │                       └───────┬────────┘
         │                               │
         ▼                               │
┌──────────────────┐                    │
│ Cache Search     │────────────────────┘
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply Filters    │
│ (type, scope,    │
│ metadata, etc.)  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Importance       ├───────────►│ Re-rank by     │
│ Scoring Enabled? │             │ Importance     │
└────────┬─────────┘             └───────┬────────┘
         │ NO                            │
         └───────────────────────────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Token Budget?    ├───────────►│ Optimize for   │
└────────┬─────────┘             │ Budget         │
         │ NO                    └───────┬────────┘
         └───────────────────────────────┘
         │
         ▼
┌──────────────────┐
│ Deterministic    │
│ Sort             │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ trackAccess=true?├───────────►│ Update Access  │
└────────┬─────────┘             │ Count & Time   │
         │ NO                    └────────────────┘
         │
         ▼
┌──────────────────┐
│ Return Results   │
└──────────────────┘
```

---

## Data Flow Diagrams

### Tool Integration Flow

```
┌─────────────┐
│ Tool Called │
└──────┬──────┘
       │
       ▼
┌──────────────────┐     NO     ┌────────────────┐
│ Auto-capture     ├───────────►│ Manual Capture │
│ Enabled?         │             │ (dev choice)   │
└────────┬─────────┘             └────────────────┘
         │ YES
         ▼
┌──────────────────┐     NO     ┌────────────────┐
│ Pass Filter?     ├───────────►│ Skip Capture   │
└────────┬─────────┘             └────────────────┘
         │ YES
         ▼
┌──────────────────┐
│ Format Content   │
│ (tool + params   │
│ + result)        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Tokens > Limit?  ├───────────►│ Summarize or   │
└────────┬─────────┘             │ Truncate       │
         │ NO                    └───────┬────────┘
         └───────────────────────────────┘
         │
         ▼
┌──────────────────┐     YES    ┌────────────────┐
│ Total Budget     ├───────────►│ Evict Oldest   │
│ Exceeded?        │             │ Tool Memories  │
└────────┬─────────┘             └───────┬────────┘
         │ NO                            │
         └───────────────────────────────┘
         │
         ▼
┌──────────────────┐
│ Store as         │
│ Episodic Memory  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Return Memory    │
└──────────────────┘
```

### GDPR Data Deletion Flow

```
┌────────────────────┐
│ deleteAllUserData  │
└──────────┬─────────┘
           │
           ▼
┌──────────────────────┐
│ Find All User        │
│ Memories (all scopes)│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Delete from Cache    │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Delete from Vector   │
│ Store (async)        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Delete Audit Logs    │
│ (if configured)      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Delete Consent       │
│ Records              │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Verify Deletion      │
│ (check all sources)  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Return Deletion      │
│ Result with Stats    │
└────────────────────────┘
```

---

## Integration Points

### React Integration

```typescript
// packages/react/src/utils/memory/hooks.ts
export function useMemories(config) {
  const service = useMemo(() => new MemoryService(config), [config])

  // Exposes service methods as React hooks
  return {
    add: useCallback(
      (content, options) => service.addMemory(content, ...options),
      [service]
    ),
    query: useCallback(
      (query, options) => service.query({ query, ...options }),
      [service]
    ),
    // ...
  }
}
```

### Vector Store Integration

```typescript
// Pluggable interface
interface VectorStore {
  upsert(vectors: VectorStoreVector[]): Promise<void>
  query(query: VectorStoreQuery): Promise<VectorStoreMatch[]>
  delete(ids: string[]): Promise<void>
}

// Example: Pinecone implementation
class PineconeVectorStore implements VectorStore {
  async upsert(vectors) {
    await this.index.upsert({ vectors })
  }

  async query(query) {
    const result = await this.index.query({
      vector: query.vector,
      topK: query.topK,
      // ...
    })
    return result.matches
  }
}
```

### Embedding Provider Integration

```typescript
// Pluggable interface
interface EmbeddingProvider {
  embedText(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}

// Example: OpenAI implementation
class OpenAIEmbeddings implements EmbeddingProvider {
  async embedText(text) {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })
    return response.data[0].embedding
  }
}
```

---

## Design Patterns

### 1. Strategy Pattern (Pluggable Providers)

```typescript
class MemoryService {
  constructor(
    private vectorStore?: VectorStore,      // Strategy
    private embeddings?: EmbeddingProvider  // Strategy
  ) {}

  // Uses strategies based on configuration
  async query(query) {
    if (this.vectorStore && query.embedding) {
      return this.vectorStore.query(...)
    }
    return this.cacheSearch(...)
  }
}
```

### 2. Observer Pattern (Event System)

```typescript
class MemoryService {
  private listeners: Map<string, MemoryEventListener[]>

  on(event: string, listener: MemoryEventListener) {
    this.listeners.get(event)?.push(listener)
  }

  private emitEvent(event: MemoryEvent) {
    this.listeners.get(event.type)?.forEach((l) => l(event))
  }
}

// Usage
service.on('memory:added', (event) => {
  console.log('Memory added:', event.memory.id)
})
```

### 3. Facade Pattern (Simplified API)

```typescript
// Complex subsystems hidden behind simple API
class MemoryService {
  async addMemory(content, type, scope, metadata, options) {
    // Orchestrates:
    // - ConsentManager
    // - ImportanceScorer
    // - VectorStore
    // - EmbeddingProvider
    // - AuditLogger
    // But exposes single, simple method
  }
}
```

### 4. Factory Pattern (Configuration Presets)

```typescript
export function createConfig(preset, profile, overrides) {
  const envPreset = ENVIRONMENT_PRESETS[preset]
  const appProfile = APPLICATION_PROFILES[profile]
  return deepMerge({}, envPreset, appProfile, overrides)
}

// Usage
const config = createConfig('production', 'chatbot')
const service = new MemoryService(config)
```

---

## Performance Characteristics

### Time Complexity

| Operation      | Cache Only | With Vector Store   | Notes                            |
| -------------- | ---------- | ------------------- | -------------------------------- |
| addMemory      | O(1)       | O(1) + async write  | Async vector write doesn't block |
| query (cache)  | O(n)       | -                   | Linear scan with filters         |
| query (vector) | -          | O(log n)            | ANN search (approximate)         |
| updateMemory   | O(1)       | O(1) + async update |                                  |
| deleteMemory   | O(1)       | O(1) + async delete |                                  |
| LRU eviction   | O(n)       | -                   | Finds oldest, rare operation     |

### Space Complexity

| Component         | Space    | Notes                                     |
| ----------------- | -------- | ----------------------------------------- |
| Memory Cache      | O(n × m) | n = count, m = avg tokens per memory      |
| Vector Store      | O(n × d) | d = embedding dimensions (typically 1536) |
| Embeddings        | O(n × d) | Stored per memory                         |
| Importance Scores | O(n)     | Recalculated on query                     |

### Optimization Strategies

1. **LRU Eviction**: Removes least recently accessed when limits exceeded
2. **Lazy Loading**: Vector store queries only when needed
3. **Batch Operations**: Embedding and vector writes batched when possible
4. **Caching**: Embeddings cached to avoid redundant API calls
5. **Token Budgets**: Strict limits prevent unbounded growth
6. **Deterministic Sorting**: Multi-level tiebreakers ensure reproducibility

---

## See Also

- [Memory Types Guide](./MEMORY_TYPES.md) - Understanding memory types
- [Scopes Guide](./SCOPES.md) - Understanding memory scopes
- [API Reference](./API.md) - Complete API documentation
- [Best Practices](./BEST_PRACTICES.md) - Memory system best practices
