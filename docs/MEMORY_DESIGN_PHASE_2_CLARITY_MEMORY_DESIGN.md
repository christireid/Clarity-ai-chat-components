# Phase 2: Clarity Memory Design

## Executive Summary

Clarity Memory is a **drop-in, zero-config memory system** designed to be superior to MemMachine in every way: simpler API, better DX, more powerful features, and usable everywhere (browser, serverless, Node.js, React, etc.).

**Core Principles:**
1. **Zero-config by default** - Works out of the box
2. **Framework-agnostic** - Use anywhere (browser, Node, serverless)
3. **TypeScript-first** - Full type safety, excellent DX
4. **Unified API** - One simple interface for all memory types
5. **Token-aware** - Built-in budgeting and optimization
6. **Developer-friendly** - Great docs, examples, tooling

---

## 1. Core Concepts (Redesigned)

### 1.1 Memory

A **Memory** is a single piece of information stored in the system. It's the atomic unit of storage.

```typescript
interface Memory {
  id: string                    // Unique identifier
  content: string               // The actual memory content
  type: MemoryType              // 'episodic' | 'semantic' | 'profile'
  scope: MemoryScope            // 'session' | 'thread' | 'user' | 'global'
  metadata: MemoryMetadata      // User-defined metadata
  embedding?: number[]         // Vector embedding (if applicable)
  importance: number            // 0-1 importance score
  timestamp: Date               // When it was created
  ttl?: number                  // Time-to-live in seconds
  tags?: string[]               // Semantic tags for grouping
}
```

**Key Differences from MemMachine:**
- ✅ Unified structure (no separate Episode vs Profile)
- ✅ Built-in importance scoring
- ✅ Optional TTL for automatic cleanup
- ✅ Tags for semantic grouping

### 1.2 Short-Term Context

**Short-term context** is the immediate conversation history - the last N messages or tokens. It's kept in memory for fast access and automatically managed.

```typescript
interface ShortTermContext {
  messages: Message[]           // Recent messages
  summary?: string              // Compressed summary of older messages
  tokenCount: number           // Current token usage
  maxTokens: number             // Token budget
}
```

**Features:**
- Automatic sliding window
- Token-aware eviction
- Automatic summarization when full
- Fast in-memory access

### 1.3 Long-Term Context

**Long-term context** is persistent memory stored in a vector store or database. It survives across sessions and is retrieved via semantic search.

```typescript
interface LongTermContext {
  memories: Memory[]            // Retrieved memories
  relevanceScores: number[]    // Similarity scores
  totalTokens: number           // Token count
}
```

**Features:**
- Vector search for semantic retrieval
- Cross-session access
- Automatic deduplication
- Configurable storage backends

### 1.4 Importance Scoring

Every memory gets an **importance score** (0-1) that determines:
- How long it's kept
- Priority in retrieval
- Whether it's compressed/summarized

```typescript
interface ImportanceScore {
  base: number                  // Base score (0-1)
  recency: number               // Time-based decay
  frequency: number             // How often accessed
  userBoost: number             // User-defined boost
  semanticRelevance: number     // Query relevance
  final: number                 // Computed final score
}
```

**Scoring Factors:**
- Recency (newer = higher)
- Frequency (accessed often = higher)
- User-defined priority
- Semantic relevance to queries
- Explicit user promotion

### 1.5 Embeddings

**Embeddings** are vector representations of memories for semantic search. Clarity Memory supports multiple providers.

```typescript
interface Embedding {
  vector: number[]              // The embedding vector
  provider: string              // 'openai' | 'local' | 'custom'
  model: string                 // Model identifier
  dimensions: number            // Vector dimensions
}
```

**Supported Providers:**
- OpenAI (`text-embedding-3-small`, etc.)
- Local models (via Transformers.js)
- Custom providers (pluggable)

### 1.6 Context Bundles

A **Context Bundle** is the optimized, token-budgeted context ready to send to an LLM.

```typescript
interface ContextBundle {
  systemPrompt: string          // System instructions
  userPreferences: string       // User profile/preferences
  recentContext: string         // Recent messages (compressed)
  semanticMemories: Memory[]    // Retrieved semantic memories
  episodicMemories: Memory[]    // Retrieved episodic memories
  summary: string               // Compressed older context
  tokenBreakdown: {
    systemPrompt: number
    userPreferences: number
    recentContext: number
    semanticMemories: number
    episodicMemories: number
    summary: number
    total: number
  }
  metadata: {
    compressionRatio: number
    memoriesRetrieved: number
    memoriesFiltered: number
  }
}
```

**Features:**
- Token-aware allocation
- Automatic compression
- Priority-based selection
- Ready for LLM consumption

### 1.7 Compression Strategies

**Compression** reduces token usage while preserving important information.

```typescript
type CompressionStrategy = 
  | 'none'                      // No compression
  | 'summarize'                 // LLM summarization
  | 'extract'                   // Extract key facts
  | 'truncate'                  // Simple truncation
  | 'adaptive'                  // Choose best strategy
```

**When Compression Happens:**
- Short-term memory exceeds token budget
- Long-term memory retrieval exceeds budget
- User explicitly requests compression
- Automatic background compression

### 1.8 Memory Lifecycle

```typescript
enum MemoryLifecycle {
  CREATED = 'created',          // Just added
  ACTIVE = 'active',            // In use
  COMPRESSED = 'compressed',    // Compressed but kept
  ARCHIVED = 'archived',        // Moved to long-term
  EXPIRED = 'expired',          // TTL expired
  DELETED = 'deleted'           // Explicitly deleted
}
```

**Transitions:**
- `CREATED` → `ACTIVE` (immediately)
- `ACTIVE` → `COMPRESSED` (when budget exceeded)
- `ACTIVE` → `ARCHIVED` (moved to long-term)
- `ACTIVE` → `EXPIRED` (TTL reached)
- Any → `DELETED` (user action)

---

## 2. Clean New API Surface

### 2.1 Core API

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Zero-config usage
const mem = clarityMemory()

// Add a memory (automatic type inference)
await mem.add("User prefers dark mode")
await mem.add("User mentioned deadline is Friday", {
  type: 'episodic',
  scope: 'session',
  importance: 0.8,
  tags: ['deadline', 'work']
})

// Recall/search memories
const results = await mem.recall("What are the user's preferences?")
const context = await mem.context({ maxTokens: 2000 })

// Advanced operations
await mem.promote(memoryId, 'global')  // Promote to global scope
await mem.compress(memoryId)           // Compress a memory
await mem.forget(memoryId)             // Delete a memory
await mem.flush()                      // Clear session memory
```

### 2.2 Configurable API

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@clarity-chat/memory/providers'

const memory = clarityMemory({
  // Embedding provider
  embeddingProvider: openai({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small'
  }),
  
  // Storage backend
  storage: {
    type: 'in-memory',              // 'in-memory' | 'indexeddb' | 'redis' | 'postgres' | 'vector-db'
    // ... provider-specific config
  },
  
  // Token budgeting
  tokenBudget: {
    maxTokens: 4096,
    allocation: {
      systemPrompt: 0.10,
      userPreferences: 0.15,
      recentContext: 0.30,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05
    },
    dynamicAllocation: true
  },
  
  // Compression
  compression: {
    enabled: true,
    strategy: 'adaptive',
    threshold: 0.8  // Compress when 80% of budget used
  },
  
  // Summarization
  summarization: {
    enabled: true,
    provider: 'openai',
    model: 'gpt-4o-mini',
    interval: 10  // Summarize every 10 messages
  },
  
  // Retention
  retention: {
    shortTerm: 3600,      // 1 hour
    session: 86400,       // 1 day
    thread: 604800,       // 1 week
    global: 0             // Never expire
  }
})
```

### 2.3 Method Signatures

#### Core Methods

```typescript
// Add memory
add(
  content: string,
  options?: {
    type?: MemoryType
    scope?: MemoryScope
    importance?: number
    tags?: string[]
    metadata?: Record<string, any>
    ttl?: number
  }
): Promise<Memory>

// Recall/search memories
recall(
  query: string,
  options?: {
    limit?: number
    minScore?: number
    types?: MemoryType[]
    scopes?: MemoryScope[]
    tags?: string[]
  }
): Promise<Memory[]>

// Get optimized context bundle
context(options?: {
  maxTokens?: number
  includeSummary?: boolean
  includePreferences?: boolean
}): Promise<ContextBundle>

// Embed text
embed(text: string): Promise<number[]>

// Summarize memories
summarize(memories: Memory[]): Promise<string>

// Compress memory
compress(memoryId: string, ratio?: number): Promise<Memory>

// Promote memory to higher scope
promote(memoryId: string, scope: MemoryScope): Promise<Memory>

// Delete/forget memory
forget(memoryId: string): Promise<void>

// Clear memory
flush(options?: {
  scope?: MemoryScope
  type?: MemoryType
}): Promise<void>

// Inspect memory state
inspect(): Promise<MemoryState>
```

### 2.4 Advanced Methods

```typescript
// Batch operations
batchAdd(memories: Array<{ content: string, options?: ... }>): Promise<Memory[]>

// Semantic grouping
groupByTopic(memories: Memory[]): Promise<Map<string, Memory[]>>

// Time-weighted search
recallWithTimeWeight(
  query: string,
  timeDecay: number
): Promise<Memory[]>

// Extract from conversation
extractFromMessages(
  messages: Message[],
  options?: {
    extractPreferences?: boolean
    extractFacts?: boolean
    extractTopics?: boolean
  }
): Promise<Memory[]>

// Memory analytics
getStats(): Promise<{
  totalMemories: number
  byType: Record<MemoryType, number>
  byScope: Record<MemoryScope, number>
  tokenUsage: number
  compressionRatio: number
}>
```

---

## 3. Complete Feature Set

### 3.1 Core Features (MemMachine Parity)

#### ✅ addMemory / add
```typescript
await mem.add("User prefers TypeScript over JavaScript")
```

**Improvements:**
- Simpler API (no producer/produced_for)
- Automatic type inference
- Built-in importance scoring
- Tag support

#### ✅ recall / search
```typescript
const results = await mem.recall("programming preferences")
```

**Improvements:**
- Unified interface (no separate episodic/profile)
- Better scoring (importance + relevance)
- Tag filtering
- Time-weighted results

#### ✅ embed
```typescript
const embedding = await mem.embed("Some text")
```

**Improvements:**
- Pluggable providers
- Browser support (Transformers.js)
- Automatic caching

#### ✅ rank
```typescript
// Automatic ranking in recall()
// Or manual:
const ranked = await mem.rank(memories, query)
```

**Improvements:**
- Multiple ranking strategies
- Configurable weights
- Time decay support

#### ✅ summarize
```typescript
const summary = await mem.summarize(memories)
```

**Improvements:**
- Automatic summarization
- Multiple strategies
- Token-aware

#### ✅ compress
```typescript
await mem.compress(memoryId, 0.5)  // Compress to 50%
```

**Improvements:**
- Automatic compression
- Multiple strategies
- Quality preservation

#### ✅ promote
```typescript
await mem.promote(memoryId, 'global')
```

**Improvements:**
- Scope promotion
- Importance boosting
- Automatic migration

#### ✅ forget
```typescript
await mem.forget(memoryId)
```

**Improvements:**
- Soft delete option
- Batch delete
- Scope-based deletion

#### ✅ TTL
```typescript
await mem.add("Temporary note", { ttl: 3600 })  // Expires in 1 hour
```

**Improvements:**
- Automatic expiration
- Background cleanup
- Scope-based TTL

#### ✅ multi-session
```typescript
// Automatic - memories persist across sessions
const mem = clarityMemory({ userId: 'user-123' })
```

**Improvements:**
- Automatic session management
- Cross-session search
- Session isolation

#### ✅ multi-store
```typescript
const mem = clarityMemory({
  storage: {
    type: 'redis',
    url: 'redis://localhost:6379'
  }
})
```

**Improvements:**
- Pluggable stores
- Browser support (IndexedDB)
- Serverless support

### 3.2 New Advanced Features

#### ✅ Built-in Token Budgeting
```typescript
const context = await mem.context({ maxTokens: 2000 })
// Automatically optimizes to fit budget
```

**Features:**
- Automatic allocation
- Dynamic adjustment
- Budget tracking
- Overflow handling

#### ✅ Adaptive Memory Compression
```typescript
// Automatic - compresses when budget exceeded
const mem = clarityMemory({
  compression: {
    enabled: true,
    strategy: 'adaptive'  // Chooses best strategy
  }
})
```

**Features:**
- Multiple strategies
- Quality-aware
- Automatic triggering

#### ✅ Time-Weighted Scoring
```typescript
const results = await mem.recall("query", {
  timeDecay: 0.1  // 10% decay per day
})
```

**Features:**
- Configurable decay
- Recency boost
- Temporal relevance

#### ✅ Automatic Extraction from Messages
```typescript
const memories = await mem.extractFromMessages(messages, {
  extractPreferences: true,
  extractFacts: true,
  extractTopics: true
})
```

**Features:**
- LLM-powered extraction
- Multiple extraction types
- Automatic tagging

#### ✅ Memory Topics and Semantic Grouping
```typescript
const groups = await mem.groupByTopic(memories)
// Returns: Map<topic, Memory[]>
```

**Features:**
- Automatic topic detection
- Semantic clustering
- Tag-based grouping

#### ✅ Model-Aware Memory Optimization
```typescript
const context = await mem.context({
  model: 'gpt-4o',
  maxTokens: 8000
})
// Optimizes for specific model's context window
```

**Features:**
- Model-specific optimization
- Context window awareness
- Token counting per model

#### ✅ Drop-in Debug Panel (React)
```typescript
import { MemoryInspector } from '@clarity-chat/memory/react'

<MemoryInspector memory={mem} />
```

**Features:**
- Visual memory browser
- Search interface
- Statistics dashboard
- Real-time updates

---

## 4. Type System

### 4.1 Core Types

```typescript
// Memory types
type MemoryType = 
  | 'episodic'    // Conversation events
  | 'semantic'    // Facts, preferences
  | 'profile'     // User profile data

// Memory scopes
type MemoryScope = 
  | 'session'     // Current session only
  | 'thread'      // Conversation thread
  | 'user'        // User-specific
  | 'global'      // Shared across all users

// Memory metadata
interface MemoryMetadata {
  userId?: string
  sessionId?: string
  threadId?: string
  source?: string
  [key: string]: any
}

// Memory item
interface Memory {
  id: string
  content: string
  type: MemoryType
  scope: MemoryScope
  metadata: MemoryMetadata
  embedding?: number[]
  importance: number
  timestamp: Date
  ttl?: number
  tags?: string[]
  compressed?: boolean
  summary?: string
  lifecycle: MemoryLifecycle
}

// Memory chunk (for chunking)
interface MemoryChunk {
  id: string
  memoryId: string
  content: string
  index: number
  embedding: number[]
  tokens: number
}

// Embedding
interface Embedding {
  vector: number[]
  provider: string
  model: string
  dimensions: number
  cached: boolean
}

// Memory score
interface MemoryScore {
  base: number
  recency: number
  frequency: number
  userBoost: number
  semanticRelevance: number
  final: number
}

// Search result
interface SearchResult {
  memory: Memory
  score: number
  relevance: number
  tokens: number
}

// Context bundle
interface ContextBundle {
  systemPrompt: string
  userPreferences: string
  recentContext: string
  semanticMemories: Memory[]
  episodicMemories: Memory[]
  summary: string
  tokenBreakdown: TokenBreakdown
  metadata: ContextMetadata
}

// Token breakdown
interface TokenBreakdown {
  systemPrompt: number
  userPreferences: number
  recentContext: number
  semanticMemories: number
  episodicMemories: number
  summary: number
  total: number
}

// Context metadata
interface ContextMetadata {
  compressionRatio: number
  memoriesRetrieved: number
  memoriesFiltered: number
  memoriesCompressed: number
}

// Summarization result
interface SummarizationResult {
  summary: string
  originalTokens: number
  summaryTokens: number
  compressionRatio: number
  strategy: CompressionStrategy
}

// Memory config
interface MemoryConfig {
  embeddingProvider?: EmbeddingProvider
  storage?: StorageConfig
  tokenBudget?: TokenBudgetConfig
  compression?: CompressionConfig
  summarization?: SummarizationConfig
  retention?: RetentionConfig
  userId?: string
  sessionId?: string
  debug?: boolean
}
```

### 4.2 Provider Types

```typescript
// Embedding provider interface
interface EmbeddingProvider {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
  dimensions: number
  model: string
}

// Storage adapter interface
interface StorageAdapter {
  save(memory: Memory): Promise<void>
  load(id: string): Promise<Memory | null>
  search(query: string, options: SearchOptions): Promise<Memory[]>
  delete(id: string): Promise<void>
  clear(scope?: MemoryScope): Promise<void>
}
```

---

## 5. Architecture Overview

### 5.1 Module Structure

```
packages/memory/
├── src/
│   ├── core/
│   │   ├── memory.ts              # Core Memory class
│   │   ├── memory-manager.ts      # Memory lifecycle manager
│   │   └── importance-scorer.ts   # Importance scoring
│   ├── stores/
│   │   ├── in-memory-store.ts     # In-memory storage
│   │   ├── indexeddb-store.ts     # Browser storage
│   │   ├── redis-store.ts        # Redis adapter
│   │   ├── postgres-store.ts     # Postgres adapter
│   │   └── vector-store.ts       # Vector DB adapter
│   ├── embeddings/
│   │   ├── openai-embedder.ts    # OpenAI provider
│   │   ├── local-embedder.ts     # Transformers.js
│   │   └── custom-embedder.ts   # Custom provider
│   ├── scoring/
│   │   ├── relevance-scorer.ts   # Semantic relevance
│   │   ├── importance-scorer.ts  # Importance scoring
│   │   └── time-decay.ts         # Time-based decay
│   ├── summarization/
│   │   ├── llm-summarizer.ts     # LLM summarization
│   │   ├── extract-summarizer.ts # Key extraction
│   │   └── adaptive-summarizer.ts # Strategy selection
│   ├── compression/
│   │   ├── compressor.ts         # Compression engine
│   │   ├── strategies.ts         # Compression strategies
│   │   └── quality-preserver.ts  # Quality metrics
│   ├── pipelines/
│   │   ├── ingestion-pipeline.ts # Memory ingestion
│   │   ├── retrieval-pipeline.ts # Memory retrieval
│   │   └── compression-pipeline.ts # Background compression
│   ├── adapters/
│   │   ├── storage-adapter.ts    # Storage interface
│   │   ├── embedding-adapter.ts # Embedding interface
│   │   └── llm-adapter.ts       # LLM interface
│   ├── context/
│   │   ├── context-builder.ts   # Context assembly
│   │   ├── token-budget.ts      # Token budgeting
│   │   └── optimizer.ts         # Context optimization
│   ├── react/
│   │   ├── MemoryInspector.tsx  # Debug panel
│   │   ├── useMemory.ts         # React hook
│   │   └── MemoryProvider.tsx   # Context provider
│   └── utils/
│       ├── token-counter.ts     # Token counting
│       ├── chunker.ts           # Text chunking
│       └── validators.ts        # Validation
├── index.ts                     # Main export
└── providers/
    ├── openai.ts                # OpenAI provider
    ├── local.ts                 # Local providers
    └── custom.ts                # Custom provider template
```

### 5.2 Data Flow

#### Adding Memory
```
User → clarityMemory.add()
  ├→ Importance Scorer (compute importance)
  ├→ Embedder (generate embedding)
  ├→ Storage Adapter (save)
  └→ Pipeline (trigger compression if needed)
```

#### Recalling Memory
```
User → clarityMemory.recall()
  ├→ Embedder (embed query)
  ├→ Storage Adapter (vector search)
  ├→ Relevance Scorer (score results)
  ├→ Time Decay (apply recency)
  └→ Return ranked results
```

#### Building Context
```
User → clarityMemory.context()
  ├→ Token Budget Manager (allocate budget)
  ├→ Retrieval Pipeline (get memories)
  ├→ Compression Pipeline (compress if needed)
  ├→ Context Builder (assemble bundle)
  └→ Return optimized context
```

---

## 6. Comparison: MemMachine vs Clarity Memory

| Feature | MemMachine | Clarity Memory |
|---------|-----------|----------------|
| **Setup** | Server + YAML config | Zero-config, import & use |
| **Language** | Python only | TypeScript/JavaScript |
| **Deployment** | Server required | Library (browser/serverless/Node) |
| **API Surface** | Verbose, complex | Simple, intuitive |
| **Type Safety** | Runtime only | Compile-time + runtime |
| **Token Budgeting** | Manual | Built-in, automatic |
| **Compression** | Manual | Automatic, adaptive |
| **Session Management** | Explicit, verbose | Automatic, inferred |
| **Memory Types** | Separate APIs | Unified API |
| **Browser Support** | ❌ | ✅ |
| **Serverless Support** | ❌ | ✅ |
| **DevTools** | ❌ | ✅ React Inspector |
| **Documentation** | Good | Excellent (with examples) |

---

## 7. Next Steps

Proceed to Phase 3: Implementation Blueprint with detailed module layouts, API signatures, and integration patterns.
