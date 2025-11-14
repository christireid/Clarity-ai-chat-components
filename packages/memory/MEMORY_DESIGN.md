# Clarity Memory — Design Blueprint
## A Superior Memory System for AI Applications

> **Executive Summary**: This document provides a complete analysis of MemMachine and designs Clarity Memory—a TypeScript-first, framework-agnostic memory system that matches MemMachine's capabilities while dramatically improving developer experience, reducing complexity, and enabling seamless integration with any AI SDK.

---

## Table of Contents

1. [Phase 1: MemMachine Analysis](#phase-1-memmachine-analysis)
2. [Phase 2: Clarity Memory Design](#phase-2-clarity-memory-design)
3. [Phase 3: Implementation Blueprint](#phase-3-implementation-blueprint)
4. [Phase 4: Integration Patterns](#phase-4-integration-patterns)
5. [Phase 5: Documentation & Developer Experience](#phase-5-documentation--developer-experience)

---

## Phase 1: MemMachine Analysis

### 1.1 Feature Map

#### Core Memory Types

**1. Episodic Memory (Conversational Context)**
- **Short-Term Memory (Session Memory)**
  - In-memory buffer for current conversation
  - Token-aware sliding window
  - Automatic summarization when capacity exceeded
  - Message capacity: configurable (default 1000)
  - Max message length: 128KB
  - Max tokens: 65,536
  - Uses LLM for summarization

- **Long-Term Memory (Declarative Memory)**
  - Vector graph store (Neo4j + pgvector)
  - Semantic search across all sessions
  - Cross-session memory retrieval
  - Episode deduplication
  - Graph relationships between episodes
  - Related episode postulation
  - Derivative derivation (summaries, metadata extraction)

**2. Profile Memory (User Profiles)**
- Structured user profiles (feature-value-tag model)
- Automatic extraction from conversations
- Semantic search on profiles
- Consolidation and deduplication
- Background ingestion task
- LRU caching
- Multi-isolation support (multi-tenancy)

**3. Memory Context**
- Group ID (organization/workspace)
- Agent ID(s) (multiple agents per context)
- User ID(s) (multiple users per context)
- Session ID (conversation session)

### 1.2 Architecture Components

**Storage Layer:**
- **Neo4j**: Graph database for episodic memory relationships
- **PostgreSQL + pgvector**: Vector storage for embeddings
- **In-Memory**: Session buffer

**Processing Layer:**
- **Embedders**: OpenAI, Amazon Bedrock, Sentence Transformers
- **Rerankers**: BM25, Cross-encoder, Embedder-based, RRF Hybrid
- **Language Models**: OpenAI, Amazon Bedrock (for summarization/extraction)
- **Vector Graph Store**: Neo4j integration

**API Layer:**
- **REST API**: FastAPI-based HTTP endpoints
- **Python SDK**: Direct Python integration
- **MCP Server**: Model Context Protocol (stdio & HTTP)

### 1.3 Key Features

**Memory Operations:**
- `add_memory_episode()`: Add conversation episodes
- `query_memory()`: Semantic search with filters
- `formalize_query_with_context()`: Build enriched queries
- `delete_data()`: Clear session data
- Reference counting for lifecycle management

**Profile Operations:**
- `add_persona_message()`: Ingest conversation for profile extraction
- `semantic_search()`: Search user profiles
- `get_user_profile()`: Retrieve full profile
- `add_new_profile()`: Manual profile updates
- `delete_user_profile_feature()`: Remove profile entries
- Automatic consolidation (deduplication)

**Advanced Features:**
- Multi-session memory retrieval
- Cross-group memory search
- Property filtering
- Episode type classification
- Metadata support
- Citation tracking
- Isolation/tenant support

### 1.4 DX Audit — Pain Points & Friction

#### ❌ **Critical Issues**

1. **Python-Only Implementation**
   - No TypeScript/JavaScript support
   - Forces Node.js developers to use REST API or build wrappers
   - No native browser support

2. **Complex Configuration**
   - Requires YAML config file (`cfg.yml`)
   - Multiple service dependencies (Neo4j, PostgreSQL)
   - Docker Compose setup required for most users
   - Complex resource initialization

3. **Heavy Dependencies**
   - Requires full Python runtime
   - Multiple database systems (Neo4j + PostgreSQL)
   - Docker containers for production
   - Not suitable for serverless/edge deployments

4. **API Complexity**
   - REST API requires complex session objects
   - Multiple IDs (group, agent, user, session) for every operation
   - Verbose request/response formats
   - No simple "add memory" → "recall memory" flow

5. **Documentation Gaps**
   - Examples scattered across multiple formats
   - No unified getting started guide
   - Complex setup process
   - Limited TypeScript/JavaScript examples

6. **No Built-in Token Management**
   - Token counting not integrated
   - No automatic context window management
   - Manual token budgeting required

7. **Limited Framework Integration**
   - No React hooks
   - No Vue/Svelte adapters
   - No Next.js/Remix helpers
   - No Vercel AI SDK integration

#### ⚠️ **Moderate Issues**

8. **Memory Lifecycle Complexity**
   - Reference counting required
   - Manual cleanup needed
   - Context manager pattern (Python-specific)

9. **Profile Extraction Overhead**
   - Background task adds latency
   - LLM calls for every profile update
   - No synchronous profile updates

10. **Limited Embedding Providers**
    - Only OpenAI, Bedrock, Sentence Transformers
    - No Cohere, Voyage, Jina support
    - No easy provider switching

11. **No Built-in Compression**
    - No automatic memory compression
    - No token-aware summarization
    - Manual summarization only

12. **Complex Query Construction**
    - `formalize_query_with_context()` returns XML-like strings
    - Not LLM-agnostic
    - Hard to customize

### 1.5 Code Architecture Map

```
MemMachine/
├── episodic_memory/
│   ├── episodic_memory.py          # Main orchestrator
│   ├── episodic_memory_manager.py   # Context management
│   ├── short_term_memory/           # Session buffer
│   ├── long_term_memory/            # Vector graph store
│   ├── declarative_memory/          # Graph relationships
│   └── session_manager/              # Session lifecycle
├── profile_memory/
│   ├── profile_memory.py            # Profile engine
│   ├── storage/                     # Database layer
│   └── util/                        # LRU cache
├── common/
│   ├── embedder/                    # Embedding providers
│   ├── language_model/              # LLM providers
│   ├── reranker/                    # Reranking strategies
│   └── vector_graph_store/          # Neo4j integration
├── server/
│   ├── app.py                       # FastAPI REST API
│   ├── mcp_stdio.py                 # MCP stdio server
│   └── mcp_http.py                  # MCP HTTP server
└── rest_client/
    ├── client.py                    # Python REST client
    └── memory.py                    # Memory operations
```

### 1.6 Usage Pattern Summary

**Python SDK Pattern:**
```python
# Complex initialization
manager = EpisodicMemoryManager.create_episodic_memory_manager("cfg.yml")
inst = await manager.get_episodic_memory_instance(
    group_id="group",
    agent_id=["agent"],
    user_id=["user"],
    session_id="session"
)

# Context manager required
async with AsyncEpisodicMemory(inst) as inst:
    await inst.add_memory_episode(...)
    results = await inst.query_memory("query")
```

**REST API Pattern:**
```bash
# Verbose session object required
curl -X POST /v1/memories \
  -d '{
    "session": {
      "group_id": "...",
      "agent_id": ["..."],
      "user_id": ["..."],
      "session_id": "..."
    },
    "producer": "...",
    "produced_for": "...",
    "episode_content": "...",
    "episode_type": "..."
  }'
```

### 1.7 Strengths

✅ **Robust Architecture**
- Well-separated concerns
- Graph relationships for memory
- Multi-tenant support
- Background processing

✅ **Powerful Features**
- Cross-session memory
- Profile extraction
- Semantic search
- Multiple embedding providers

✅ **Production Ready**
- Metrics (Prometheus)
- Error handling
- Connection pooling
- Caching

### 1.8 Weaknesses

❌ **Developer Experience**
- Complex setup
- Python-only
- Heavy dependencies
- Verbose APIs

❌ **Flexibility**
- Hard to use standalone
- Requires infrastructure
- Not serverless-friendly
- Limited framework support

❌ **Simplicity**
- Too many concepts
- Complex configuration
- Steep learning curve
- Over-engineered for simple use cases

---

## Phase 2: Clarity Memory Design

### 2.1 Core Philosophy

**Clarity Memory** is designed with these principles:

1. **Zero-Config by Default**: Works out of the box with sensible defaults
2. **Framework Agnostic**: Works in React, Vue, Node.js, serverless, anywhere
3. **TypeScript First**: Full type safety, excellent DX
4. **Progressive Enhancement**: Start simple, add complexity as needed
5. **Drop-in Ready**: Copy/paste a few lines → done
6. **Token-Aware**: Built-in token management and optimization
7. **LLM Agnostic**: Works with any AI SDK/provider

### 2.2 Core Concepts (Redesigned)

#### **Memory**
A single piece of information stored in the system. Can be:
- **Episodic**: Conversation events, messages, interactions
- **Semantic**: Facts, preferences, knowledge
- **Ephemeral**: Temporary, short-lived data
- **Persistent**: Long-term, cross-session data

#### **Memory Item**
```typescript
interface MemoryItem {
  id: string
  content: string
  type: 'episodic' | 'semantic' | 'ephemeral' | 'persistent'
  importance: number // 0-1, auto-calculated or manual
  timestamp: Date
  metadata?: Record<string, any>
  tags?: string[]
  embedding?: number[]
}
```

#### **Context Bundle**
A prepared context ready for LLM consumption:
```typescript
interface ContextBundle {
  memories: MemoryItem[]
  summary?: string
  tokens: number
  metadata: {
    totalMemories: number
    compressed: boolean
    compressionRatio?: number
  }
}
```

#### **Memory Store**
Abstraction over storage backends:
- In-memory (default)
- IndexedDB (browser)
- LocalStorage (browser, limited)
- File system (Node.js)
- Redis (server)
- PostgreSQL (server)
- Vector DBs (Pinecone, Qdrant, Weaviate, Chroma)

### 2.3 Clean New API Surface

#### **Basic Usage (Zero Config)**

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Create memory instance
const mem = clarityMemory()

// Add memory
await mem.add("User prefers TypeScript over JavaScript")

// Recall memories
const context = await mem.recall("What programming languages does the user prefer?")
// Returns: ContextBundle with relevant memories

// Use in LLM call
const response = await llm.chat({
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: context.toString() }, // Auto-formats memories
    { role: 'user', content: 'Tell me about TypeScript' }
  ]
})
```

#### **Configurable Usage**

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'

const memory = clarityMemory({
  // Embedding provider (optional, uses OpenAI by default)
  embeddingProvider: openai('text-embedding-3-small'),
  
  // Storage backend (optional, in-memory by default)
  store: 'indexeddb', // or 'localstorage', 'redis', 'postgres', etc.
  
  // Token management
  maxTokens: 8000,
  tokenBudget: {
    systemPrompt: 0.10,
    memories: 0.60,
    recentContext: 0.25,
    responseReserve: 0.05
  },
  
  // Compression
  enableCompression: true,
  compressionThreshold: 0.8, // Compress when >80% of budget
  
  // Summarization
  enableSummarization: true,
  summarizationInterval: 10, // Summarize every 10 messages
  
  // Importance scoring
  importanceScoring: 'auto', // or 'manual', 'hybrid'
  
  // Session management
  sessionId: 'session-123',
  userId: 'user-456'
})
```

#### **Advanced Usage**

```typescript
const memory = clarityMemory({
  embeddingProvider: openai('text-embedding-3-small'),
  store: {
    type: 'vector',
    provider: 'pinecone',
    apiKey: process.env.PINECONE_API_KEY,
    index: 'memories'
  },
  
  // Custom importance scorer
  importanceScoring: {
    type: 'custom',
    scorer: async (memory, context) => {
      // Custom logic
      return 0.85
    }
  },
  
  // Custom compression strategy
  compression: {
    strategy: 'adaptive',
    minCompressionRatio: 0.5,
    maxCompressionRatio: 0.8
  }
})

// Add with options
await memory.add("Important fact", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preference', 'user'],
  metadata: { source: 'explicit' }
})

// Search with filters
const results = await memory.search({
  query: "user preferences",
  types: ['semantic'],
  tags: ['preference'],
  minImportance: 0.7,
  limit: 10
})

// Get context bundle
const bundle = await memory.context({
  maxTokens: 4000,
  includeSummary: true,
  prioritizeRecent: true
})

// Promote memory to persistent
await memory.promote(memoryId, 'persistent')

// Forget memory
await memory.forget(memoryId)

// Compress memories
await memory.compress({ targetTokens: 2000 })

// Summarize recent memories
const summary = await memory.summarize({
  since: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
})
```

### 2.4 Complete Feature Set

#### **Core Operations**

```typescript
interface ClarityMemory {
  // CRUD
  add(content: string, options?: AddMemoryOptions): Promise<MemoryItem>
  search(query: string, options?: SearchOptions): Promise<MemoryItem[]>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem>
  delete(id: string): Promise<void>
  
  // Context Management
  recall(query: string, options?: RecallOptions): Promise<ContextBundle>
  context(options?: ContextOptions): Promise<ContextBundle>
  
  // Memory Lifecycle
  promote(id: string, to: MemoryType): Promise<void>
  forget(id: string): Promise<void>
  compress(options?: CompressOptions): Promise<CompressionResult>
  summarize(options?: SummarizeOptions): Promise<string>
  
  // Batch Operations
  addBatch(items: string[], options?: AddMemoryOptions): Promise<MemoryItem[]>
  searchBatch(queries: string[]): Promise<MemoryItem[][]>
  
  // Utilities
  embed(text: string): Promise<number[]>
  rank(memories: MemoryItem[], query: string): Promise<RankedMemory[]>
  estimateTokens(content: string): number
  
  // Inspection
  inspect(): MemoryStats
  list(options?: ListOptions): Promise<MemoryItem[]>
  stats(): MemoryStatistics
  
  // Lifecycle
  flush(): Promise<void>
  clear(): Promise<void>
  close(): Promise<void>
}
```

#### **Memory Types**

```typescript
type MemoryType = 
  | 'episodic'    // Conversation events
  | 'semantic'    // Facts, knowledge
  | 'ephemeral'   // Temporary, TTL-based
  | 'persistent'  // Long-term, cross-session

type ImportanceScore = number // 0-1

interface MemoryItem {
  id: string
  content: string
  type: MemoryType
  importance: ImportanceScore
  timestamp: Date
  embedding?: number[]
  metadata?: Record<string, any>
  tags?: string[]
  ttl?: number // Time to live in seconds
  sessionId?: string
  userId?: string
}
```

#### **Context Bundling**

```typescript
interface ContextBundle {
  memories: MemoryItem[]
  summary?: string
  tokens: number
  metadata: {
    totalMemories: number
    compressed: boolean
    compressionRatio?: number
    includedTypes: MemoryType[]
    timeRange: { from: Date; to: Date }
  }
  
  // Helper methods
  toString(): string
  toMessages(): Array<{ role: string; content: string }>
  toPrompt(): string
}
```

#### **Search & Ranking**

```typescript
interface SearchOptions {
  query: string
  types?: MemoryType[]
  tags?: string[]
  minImportance?: number
  limit?: number
  since?: Date
  until?: Date
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
}

interface RankedMemory extends MemoryItem {
  score: number
  reasons: string[] // Why this memory is relevant
}
```

#### **Compression & Summarization**

```typescript
interface CompressOptions {
  targetTokens?: number
  strategy?: 'importance' | 'recency' | 'relevance' | 'adaptive'
  preserveImportant?: boolean
  minImportance?: number
}

interface CompressionResult {
  before: { count: number; tokens: number }
  after: { count: number; tokens: number }
  compressed: MemoryItem[]
  removed: string[] // IDs of removed memories
  summary?: string
}

interface SummarizeOptions {
  since?: Date
  until?: Date
  types?: MemoryType[]
  maxLength?: number
}
```

### 2.5 New Enhancements (Beyond MemMachine)

#### **1. Built-in Token Budgeting**

```typescript
const memory = clarityMemory({
  tokenBudget: {
    systemPrompt: 0.10,    // 10% for system prompt
    memories: 0.60,        // 60% for retrieved memories
    recentContext: 0.25,   // 25% for recent messages
    responseReserve: 0.05   // 5% reserve
  },
  
  // Automatic budget adjustment
  adaptiveBudget: true
})

// Automatically respects budget when building context
const context = await memory.context({ maxTokens: 8000 })
// Returns context that fits within budget
```

#### **2. Adaptive Memory Compression**

```typescript
const memory = clarityMemory({
  compression: {
    strategy: 'adaptive',
    // Automatically compresses when approaching token limit
    threshold: 0.8, // Compress when >80% of budget used
    
    // Preserves important memories
    preserveImportant: true,
    minImportance: 0.7,
    
    // Compression ratios
    minRatio: 0.5,  // Compress to at least 50%
    maxRatio: 0.8   // Compress to at most 80%
  }
})
```

#### **3. Time-Weighted Scoring**

```typescript
const memory = clarityMemory({
  importanceScoring: {
    type: 'time-weighted',
    // Recent memories get boost
    recencyWeight: 0.3,
    // Important memories stay important
    importanceWeight: 0.5,
    // Relevance to query
    relevanceWeight: 0.2,
    
    // Decay function
    decayFunction: 'exponential', // or 'linear', 'custom'
    halfLife: 7 * 24 * 60 * 60 * 1000 // 7 days
  }
})
```

#### **4. Automatic Extraction from Chat Messages**

```typescript
const memory = clarityMemory({
  // Automatically extract memories from messages
  autoExtract: {
    enabled: true,
    types: ['preference', 'fact', 'event'],
    minConfidence: 0.7,
    extractor: 'llm' // or 'rule-based', 'hybrid'
  }
})

// Automatically extracts memories from conversation
await memory.ingestConversation([
  { role: 'user', content: 'I prefer dark mode' },
  { role: 'assistant', content: 'Noted! I'll remember that.' }
])
// Automatically creates: "User prefers dark mode" (semantic, importance: 0.8)
```

#### **5. Memory Topics & Semantic Grouping**

```typescript
// Automatically groups related memories
const topics = await memory.getTopics()
// Returns: [{ name: 'preferences', memories: [...], count: 5 }, ...]

// Search by topic
const prefs = await memory.search({
  query: 'user preferences',
  topic: 'preferences'
})

// Manual topic assignment
await memory.add("I like pizza", {
  topic: 'food-preferences'
})
```

#### **6. Model-Aware Memory Optimization**

```typescript
const memory = clarityMemory({
  // Optimizes for specific model
  model: {
    name: 'gpt-4',
    contextWindow: 8192,
    tokenizer: 'cl100k_base'
  },
  
  // Automatically adjusts for model capabilities
  optimization: {
    enableChunking: true,
    chunkSize: 2000,
    chunkOverlap: 200
  }
})
```

#### **7. Drop-in Debug Panel (React)**

```tsx
import { MemoryInspector } from '@clarity-chat/memory/react'

function App() {
  const memory = clarityMemory()
  
  return (
    <>
      <YourChatApp memory={memory} />
      <MemoryInspector memory={memory} />
    </>
  )
}
```

### 2.6 Comparison: MemMachine vs Clarity Memory

| Feature | MemMachine | Clarity Memory |
|---------|-----------|----------------|
| **Language** | Python only | TypeScript/JavaScript |
| **Setup** | Docker Compose + config files | Zero config, works immediately |
| **Dependencies** | Neo4j + PostgreSQL + Python | Optional, progressive |
| **API Complexity** | Verbose session objects | Simple, intuitive |
| **Framework Support** | None | React, Vue, Svelte, Next.js |
| **Token Management** | Manual | Built-in, automatic |
| **Browser Support** | None | Full IndexedDB support |
| **Serverless** | Not suitable | Optimized for serverless |
| **Type Safety** | Python types | Full TypeScript |
| **Documentation** | Scattered | Unified, comprehensive |
| **Learning Curve** | Steep | Gentle, progressive |

---

## Phase 3: Implementation Blueprint

### 3.1 Module Layout

```
packages/memory/
├── src/
│   ├── index.ts                    # Main export
│   │
│   ├── core/
│   │   ├── memory.ts               # Core Memory class
│   │   ├── memory-item.ts          # MemoryItem interface & impl
│   │   ├── context-bundle.ts       # ContextBundle class
│   │   └── types.ts                # Core types
│   │
│   ├── stores/
│   │   ├── base.ts                 # Base store interface
│   │   ├── in-memory.ts            # In-memory store
│   │   ├── indexeddb.ts            # IndexedDB store (browser)
│   │   ├── localstorage.ts         # LocalStorage store (browser)
│   │   ├── filesystem.ts           # File system store (Node.js)
│   │   ├── redis.ts                # Redis store
│   │   ├── postgres.ts             # PostgreSQL store
│   │   └── vector/
│   │       ├── base.ts             # Vector store interface
│   │       ├── pinecone.ts         # Pinecone adapter
│   │       ├── qdrant.ts           # Qdrant adapter
│   │       ├── weaviate.ts         # Weaviate adapter
│   │       ├── chroma.ts            # Chroma adapter
│   │       └── lancedb.ts          # LanceDB adapter
│   │
│   ├── embeddings/
│   │   ├── base.ts                 # Embedder interface
│   │   ├── openai.ts              # OpenAI embedder
│   │   ├── cohere.ts              # Cohere embedder
│   │   ├── voyage.ts              # Voyage embedder
│   │   ├── jina.ts                # Jina embedder
│   │   └── local.ts                # Local embedder (transformers.js)
│   │
│   ├── scoring/
│   │   ├── base.ts                 # Importance scorer interface
│   │   ├── auto.ts                 # Automatic scoring
│   │   ├── manual.ts               # Manual scoring
│   │   ├── hybrid.ts               # Hybrid scoring
│   │   ├── time-weighted.ts        # Time-weighted scoring
│   │   └── relevance.ts           # Relevance-based scoring
│   │
│   ├── summarization/
│   │   ├── base.ts                 # Summarizer interface
│   │   ├── llm.ts                  # LLM-based summarization
│   │   ├── extractive.ts           # Extractive summarization
│   │   └── adaptive.ts             # Adaptive summarization
│   │
│   ├── compression/
│   │   ├── base.ts                 # Compressor interface
│   │   ├── importance.ts           # Importance-based compression
│   │   ├── recency.ts              # Recency-based compression
│   │   ├── relevance.ts            # Relevance-based compression
│   │   └── adaptive.ts             # Adaptive compression
│   │
│   ├── pipelines/
│   │   ├── ingestion.ts            # Memory ingestion pipeline
│   │   ├── extraction.ts           # Automatic extraction pipeline
│   │   ├── compression.ts          # Compression pipeline
│   │   └── summarization.ts        # Summarization pipeline
│   │
│   ├── adapters/
│   │   ├── vercel-ai-sdk.ts        # Vercel AI SDK adapter
│   │   ├── openai-sdk.ts           # OpenAI SDK adapter
│   │   ├── anthropic-sdk.ts        # Anthropic SDK adapter
│   │   └── langchain.ts            # LangChain adapter
│   │
│   ├── context/
│   │   ├── builder.ts              # Context builder
│   │   ├── optimizer.ts            # Context optimizer
│   │   ├── token-manager.ts        # Token budget manager
│   │   └── formatter.ts            # Context formatter
│   │
│   ├── react/
│   │   ├── use-memory.ts           # React hook
│   │   ├── memory-provider.tsx     # Context provider
│   │   ├── memory-inspector.tsx    # Debug component
│   │   └── memory-stats.tsx        # Stats component
│   │
│   └── utils/
│       ├── token-counter.ts        # Token counting
│       ├── chunker.ts              # Text chunking
│       ├── similarity.ts           # Similarity calculation
│       ├── topics.ts               # Topic extraction
│       └── validation.ts           # Validation helpers
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── examples/
│   ├── basic-usage.ts
│   ├── react-example.tsx
│   ├── nextjs-example.ts
│   └── serverless-example.ts
│
├── README.md
├── API.md
└── package.json
```

### 3.2 Type System

```typescript
// Core Types
export type MemoryType = 
  | 'episodic' 
  | 'semantic' 
  | 'ephemeral' 
  | 'persistent'

export type ImportanceScore = number // 0-1

export interface MemoryItem {
  id: string
  content: string
  type: MemoryType
  importance: ImportanceScore
  timestamp: Date
  embedding?: number[]
  metadata?: Record<string, any>
  tags?: string[]
  ttl?: number
  sessionId?: string
  userId?: string
  topic?: string
}

export interface ContextBundle {
  memories: MemoryItem[]
  summary?: string
  tokens: number
  metadata: ContextMetadata
  
  toString(): string
  toMessages(): Array<{ role: string; content: string }>
  toPrompt(): string
}

export interface ContextMetadata {
  totalMemories: number
  compressed: boolean
  compressionRatio?: number
  includedTypes: MemoryType[]
  timeRange: { from: Date; to: Date }
}

// Configuration Types
export interface MemoryConfig {
  embeddingProvider?: Embedder
  store?: StoreConfig
  maxTokens?: number
  tokenBudget?: TokenBudget
  enableCompression?: boolean
  compressionThreshold?: number
  enableSummarization?: boolean
  summarizationInterval?: number
  importanceScoring?: ImportanceScoringConfig
  sessionId?: string
  userId?: string
  model?: ModelConfig
  autoExtract?: AutoExtractConfig
}

export type StoreConfig = 
  | 'memory'
  | 'indexeddb'
  | 'localstorage'
  | 'filesystem'
  | 'redis'
  | 'postgres'
  | VectorStoreConfig

export interface VectorStoreConfig {
  type: 'vector'
  provider: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma' | 'lancedb'
  apiKey?: string
  endpoint?: string
  index?: string
  [key: string]: any
}

export interface TokenBudget {
  systemPrompt: number
  memories: number
  recentContext: number
  responseReserve: number
}

export interface ImportanceScoringConfig {
  type: 'auto' | 'manual' | 'hybrid' | 'time-weighted'
  scorer?: ImportanceScorer
  recencyWeight?: number
  importanceWeight?: number
  relevanceWeight?: number
  decayFunction?: 'exponential' | 'linear' | 'custom'
  halfLife?: number
}

export interface ModelConfig {
  name: string
  contextWindow: number
  tokenizer: 'cl100k_base' | 'p50k_base' | 'r50k_base' | string
}

export interface AutoExtractConfig {
  enabled: boolean
  types: string[]
  minConfidence: number
  extractor: 'llm' | 'rule-based' | 'hybrid'
}

// Search & Ranking Types
export interface SearchOptions {
  query: string
  types?: MemoryType[]
  tags?: string[]
  minImportance?: number
  limit?: number
  since?: Date
  until?: Date
  userId?: string
  sessionId?: string
  metadata?: Record<string, any>
  topic?: string
}

export interface RankedMemory extends MemoryItem {
  score: number
  reasons: string[]
}

// Compression Types
export interface CompressOptions {
  targetTokens?: number
  strategy?: 'importance' | 'recency' | 'relevance' | 'adaptive'
  preserveImportant?: boolean
  minImportance?: number
}

export interface CompressionResult {
  before: { count: number; tokens: number }
  after: { count: number; tokens: number }
  compressed: MemoryItem[]
  removed: string[]
  summary?: string
}

// Store Interface
export interface MemoryStore {
  add(item: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  delete(id: string): Promise<void>
  search(query: string, options: SearchOptions): Promise<MemoryItem[]>
  list(options?: ListOptions): Promise<MemoryItem[]>
  clear(): Promise<void>
  close(): Promise<void>
}

// Embedder Interface
export interface Embedder {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}

// Importance Scorer Interface
export interface ImportanceScorer {
  score(memory: MemoryItem, context?: any): Promise<ImportanceScore>
}
```

### 3.3 API Signatures

```typescript
// Main Function
export function clarityMemory(config?: MemoryConfig): ClarityMemory

// Core Interface
export interface ClarityMemory {
  // CRUD Operations
  add(content: string, options?: AddMemoryOptions): Promise<MemoryItem>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem>
  delete(id: string): Promise<void>
  
  // Search & Recall
  search(query: string, options?: SearchOptions): Promise<MemoryItem[]>
  recall(query: string, options?: RecallOptions): Promise<ContextBundle>
  context(options?: ContextOptions): Promise<ContextBundle>
  
  // Memory Lifecycle
  promote(id: string, to: MemoryType): Promise<void>
  forget(id: string): Promise<void>
  compress(options?: CompressOptions): Promise<CompressionResult>
  summarize(options?: SummarizeOptions): Promise<string>
  
  // Batch Operations
  addBatch(items: string[], options?: AddMemoryOptions): Promise<MemoryItem[]>
  searchBatch(queries: string[]): Promise<MemoryItem[][]>
  
  // Utilities
  embed(text: string): Promise<number[]>
  rank(memories: MemoryItem[], query: string): Promise<RankedMemory[]>
  estimateTokens(content: string): number
  
  // Inspection
  inspect(): MemoryStats
  list(options?: ListOptions): Promise<MemoryItem[]>
  stats(): MemoryStatistics
  
  // Lifecycle
  flush(): Promise<void>
  clear(): Promise<void>
  close(): Promise<void>
}

// Options Interfaces
export interface AddMemoryOptions {
  type?: MemoryType
  importance?: ImportanceScore
  tags?: string[]
  metadata?: Record<string, any>
  ttl?: number
  sessionId?: string
  userId?: string
  topic?: string
}

export interface RecallOptions extends SearchOptions {
  maxTokens?: number
  includeSummary?: boolean
  prioritizeRecent?: boolean
  format?: 'string' | 'messages' | 'prompt'
}

export interface ContextOptions {
  maxTokens?: number
  includeSummary?: boolean
  prioritizeRecent?: boolean
  types?: MemoryType[]
  since?: Date
  until?: Date
}

export interface ListOptions {
  types?: MemoryType[]
  tags?: string[]
  limit?: number
  offset?: number
  sortBy?: 'timestamp' | 'importance' | 'relevance'
  order?: 'asc' | 'desc'
}

export interface MemoryStats {
  total: number
  byType: Record<MemoryType, number>
  byTag: Record<string, number>
  totalTokens: number
  averageImportance: number
}

export interface MemoryStatistics extends MemoryStats {
  store: string
  compressionRatio: number
  lastCompressed?: Date
  lastSummarized?: Date
}
```

### 3.4 Multi-Store Adapters

```typescript
// Base Store Interface
export interface MemoryStore {
  add(item: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  delete(id: string): Promise<void>
  search(query: string, options: SearchOptions): Promise<MemoryItem[]>
  list(options?: ListOptions): Promise<MemoryItem[]>
  clear(): Promise<void>
  close(): Promise<void>
}

// In-Memory Store (Default)
export class InMemoryStore implements MemoryStore {
  constructor(private data: Map<string, MemoryItem> = new Map()) {}
  // Implementation...
}

// IndexedDB Store (Browser)
export class IndexedDBStore implements MemoryStore {
  constructor(private dbName: string, private version?: number) {}
  // Implementation...
}

// LocalStorage Store (Browser, Limited)
export class LocalStorageStore implements MemoryStore {
  constructor(private key: string = 'clarity-memory') {}
  // Implementation...
}

// File System Store (Node.js)
export class FileSystemStore implements MemoryStore {
  constructor(private path: string) {}
  // Implementation...
}

// Redis Store
export class RedisStore implements MemoryStore {
  constructor(private client: RedisClient) {}
  // Implementation...
}

// PostgreSQL Store
export class PostgresStore implements MemoryStore {
  constructor(private pool: Pool) {}
  // Implementation...
}

// Vector Store Base
export interface VectorStore extends MemoryStore {
  upsert(items: MemoryItem[]): Promise<void>
  query(vector: number[], options: VectorSearchOptions): Promise<MemoryItem[]>
}

// Pinecone Adapter
export class PineconeStore implements VectorStore {
  constructor(private client: PineconeClient, private index: string) {}
  // Implementation...
}

// Qdrant Adapter
export class QdrantStore implements VectorStore {
  constructor(private client: QdrantClient, private collection: string) {}
  // Implementation...
}

// Weaviate Adapter
export class WeaviateStore implements VectorStore {
  constructor(private client: WeaviateClient, private className: string) {}
  // Implementation...
}

// Chroma Adapter
export class ChromaStore implements VectorStore {
  constructor(private client: ChromaClient, private collection: string) {}
  // Implementation...
}

// LanceDB Adapter
export class LanceDBStore implements VectorStore {
  constructor(private db: LanceDB, private table: string) {}
  // Implementation...
}
```

### 3.5 Context Engine

```typescript
// Context Builder
export class ContextBuilder {
  constructor(
    private store: MemoryStore,
    private tokenManager: TokenManager,
    private compressor?: Compressor,
    private summarizer?: Summarizer
  ) {}
  
  async build(options: ContextOptions): Promise<ContextBundle> {
    // 1. Retrieve memories
    const memories = await this.retrieveMemories(options)
    
    // 2. Rank by relevance/importance
    const ranked = await this.rank(memories, options)
    
    // 3. Check token budget
    const tokens = this.tokenManager.estimate(ranked)
    
    // 4. Compress if needed
    if (tokens > options.maxTokens && this.compressor) {
      return await this.compress(ranked, options)
    }
    
    // 5. Build summary if requested
    const summary = options.includeSummary && this.summarizer
      ? await this.summarizer.summarize(ranked)
      : undefined
    
    // 6. Create bundle
    return new ContextBundle({
      memories: ranked,
      summary,
      tokens,
      metadata: this.buildMetadata(ranked, options)
    })
  }
  
  private async retrieveMemories(options: ContextOptions): Promise<MemoryItem[]> {
    // Retrieve from store based on options
  }
  
  private async rank(memories: MemoryItem[], options: ContextOptions): Promise<MemoryItem[]> {
    // Rank by importance, recency, relevance
  }
  
  private async compress(memories: MemoryItem[], options: ContextOptions): Promise<ContextBundle> {
    // Compress memories to fit token budget
  }
}

// Token Manager
export class TokenManager {
  constructor(private tokenizer: Tokenizer) {}
  
  estimate(content: string | MemoryItem[]): number {
    // Estimate tokens
  }
  
  truncate(content: string, maxTokens: number): string {
    // Truncate to fit token budget
  }
  
  allocate(budget: TokenBudget, used: number): TokenAllocation {
    // Allocate remaining tokens
  }
}

// Context Optimizer
export class ContextOptimizer {
  optimize(bundle: ContextBundle, targetTokens: number): ContextBundle {
    // Optimize context bundle to fit target tokens
  }
  
  prioritize(memories: MemoryItem[], query?: string): MemoryItem[] {
    // Prioritize memories by importance/relevance
  }
}
```

---

## Phase 4: Integration Patterns

### 4.1 Clarity Chat Integration

```typescript
import { useClarityChat } from '@clarity-chat/react'
import { clarityMemory } from '@clarity-chat/memory'

function ChatApp() {
  const memory = clarityMemory({
    userId: 'user-123',
    sessionId: 'session-456'
  })
  
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    onMessage: async (message) => {
      // Automatically store user messages
      await memory.add(message.content, {
        type: 'episodic',
        metadata: { role: message.role }
      })
    }
  })
  
  const handleSend = async (content: string) => {
    // Get relevant context
    const context = await memory.recall(content, {
      maxTokens: 2000,
      includeSummary: true
    })
    
    // Append with context
    await append({
      role: 'user',
      content: context.toPrompt() + '\n\n' + content
    })
  }
  
  return <ChatWindow onSendMessage={handleSend} />
}
```

### 4.2 Standalone Usage (Any LLM)

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'

const memory = clarityMemory()
const model = openai('gpt-4')

async function chat(userMessage: string) {
  // 1. Store user message
  await memory.add(userMessage, { type: 'episodic' })
  
  // 2. Retrieve relevant context
  const context = await memory.recall(userMessage, {
    maxTokens: 3000,
    includeSummary: true
  })
  
  // 3. Call LLM with context
  const response = await model.generateText({
    prompt: context.toPrompt() + '\n\nUser: ' + userMessage
  })
  
  // 4. Store assistant response
  await memory.add(response.text, {
    type: 'episodic',
    metadata: { role: 'assistant' }
  })
  
  return response.text
}
```

### 4.3 Serverless Functions (Vercel/Netlify)

```typescript
// api/chat.ts (Vercel)
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'

// Use IndexedDB-compatible store or Redis for serverless
const memory = clarityMemory({
  store: process.env.REDIS_URL 
    ? { type: 'redis', url: process.env.REDIS_URL }
    : 'memory' // Fallback to in-memory
})

export default async function handler(req: Request) {
  const { message, userId, sessionId } = await req.json()
  
  // Get context
  const context = await memory.recall(message, {
    userId,
    sessionId,
    maxTokens: 2000
  })
  
  // Generate response
  const response = await openai('gpt-4').generateText({
    prompt: context.toPrompt() + '\n\n' + message
  })
  
  // Store interaction
  await memory.add(message, { userId, sessionId })
  await memory.add(response.text, { userId, sessionId })
  
  return Response.json({ response: response.text })
}
```

### 4.4 Browser Apps

```typescript
// browser-app.ts
import { clarityMemory } from '@clarity-chat/memory'

// Automatically uses IndexedDB in browser
const memory = clarityMemory({
  store: 'indexeddb',
  userId: getUserId(),
  sessionId: getSessionId()
})

// Works offline, persists across sessions
await memory.add("User preference stored locally")
```

### 4.5 Vercel AI SDK Integration

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

const memory = clarityMemory()

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Get context from memory
  const lastMessage = messages[messages.length - 1].content
  const context = await memory.recall(lastMessage)
  
  // Stream with context
  const result = await streamText({
    model: openai('gpt-4'),
    messages: [
      { role: 'system', content: context.toPrompt() },
      ...messages
    ]
  })
  
  // Store conversation
  for (const msg of messages) {
    await memory.add(msg.content, {
      type: 'episodic',
      metadata: { role: msg.role }
    })
  }
  
  return result.toDataStreamResponse()
}
```

### 4.6 LangChain Integration

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import { ChatOpenAI } from '@langchain/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'

const memory = clarityMemory()

// Convert Clarity Memory to LangChain format
const vectorStore = new MemoryVectorStore(
  memory.store.getEmbeddings()
)

const chain = ChatOpenAI.fromLLMAndRetrievers({
  llm: new ChatOpenAI(),
  retriever: vectorStore.asRetriever()
})
```

---

## Phase 5: Documentation & Developer Experience

### 5.1 README Structure

```markdown
# @clarity-chat/memory

> Zero-config, framework-agnostic memory system for AI applications

## Features

- 🚀 **Zero Config** - Works out of the box
- 🎯 **Framework Agnostic** - React, Vue, Node.js, serverless
- 💰 **Token Aware** - Built-in token management
- 🧠 **Smart Compression** - Automatic memory optimization
- 📦 **Multiple Stores** - In-memory, IndexedDB, Redis, PostgreSQL, Vector DBs
- 🔍 **Semantic Search** - Vector-based memory retrieval
- 📊 **TypeScript First** - Full type safety

## Installation

\`\`\`bash
npm install @clarity-chat/memory
\`\`\`

## Quick Start

\`\`\`typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Add memory
await memory.add("User prefers TypeScript")

// Recall memories
const context = await memory.recall("What does the user prefer?")
console.log(context.toString())
\`\`\`

## Documentation

- [Getting Started](./docs/getting-started.md)
- [Memory Fundamentals](./docs/fundamentals.md)
- [Embeddings Guide](./docs/embeddings.md)
- [Context Bundling](./docs/context.md)
- [Compression Strategies](./docs/compression.md)
- [Scaling Memory](./docs/scaling.md)
- [Migration from MemMachine](./docs/migration.md)
- [API Reference](./docs/api.md)

## Examples

- [Basic Usage](./examples/basic.ts)
- [React Integration](./examples/react.tsx)
- [Next.js API Route](./examples/nextjs.ts)
- [Serverless Function](./examples/serverless.ts)
- [Vercel AI SDK](./examples/vercel-ai-sdk.ts)
```

### 5.2 Tutorial Structure

**Getting Started:**
1. Installation
2. Basic usage (add/recall)
3. Configuration options
4. First integration

**Memory Fundamentals:**
1. Memory types
2. Importance scoring
3. Tags and metadata
4. Session management

**Embeddings 101:**
1. What are embeddings?
2. Choosing an embedder
3. Vector stores
4. Semantic search

**Context Bundling:**
1. Building context
2. Token budgeting
3. Formatting for LLMs
4. Optimization strategies

**Compression Strategies:**
1. When to compress
2. Compression strategies
3. Preserving important memories
4. Adaptive compression

**Scaling Memory:**
1. Choosing a store
2. Vector databases
3. Multi-tenant support
4. Performance optimization

### 5.3 Migration Guide

```markdown
# Migrating from MemMachine to Clarity Memory

## Key Differences

### 1. Language
- **MemMachine**: Python only
- **Clarity Memory**: TypeScript/JavaScript

### 2. Setup
- **MemMachine**: Docker Compose + config files
- **Clarity Memory**: Zero config, npm install

### 3. API
- **MemMachine**: Complex session objects
- **Clarity Memory**: Simple, intuitive API

## Migration Steps

### Step 1: Install Clarity Memory
\`\`\`bash
npm install @clarity-chat/memory
\`\`\`

### Step 2: Replace MemMachine Client
\`\`\`typescript
// Before (MemMachine Python)
from memmachine import MemMachineClient
client = MemMachineClient(base_url="...")
memory = client.memory(group_id="...", ...)

// After (Clarity Memory)
import { clarityMemory } from '@clarity-chat/memory'
const memory = clarityMemory({ groupId: '...' })
\`\`\`

### Step 3: Update Memory Operations
\`\`\`typescript
// Before
await memory.add_memory_episode(
  producer="user",
  produced_for="agent",
  episode_content="...",
  episode_type="message"
)

// After
await memory.add("...", {
  type: 'episodic',
  metadata: { producer: 'user', producedFor: 'agent' }
})
\`\`\`

### Step 4: Update Queries
\`\`\`typescript
// Before
results = await memory.query_memory("query", limit=10)

// After
const results = await memory.search("query", { limit: 10 })
\`\`\`

## Feature Mapping

| MemMachine | Clarity Memory |
|-----------|---------------|
| `add_memory_episode()` | `add()` |
| `query_memory()` | `search()` / `recall()` |
| `formalize_query_with_context()` | `context().toPrompt()` |
| Profile Memory | `add()` with `type: 'semantic'` |
| Session Memory | Automatic with `sessionId` |
| Long-term Memory | Vector store backend |
```

### 5.4 Code Examples

**Basic Example:**
```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

// Add memories
await memory.add("User loves pizza", { type: 'semantic', importance: 0.8 })
await memory.add("User mentioned deadline is Friday", { type: 'episodic' })

// Search
const results = await memory.search("What does the user like?")
// Returns memories about pizza

// Get context for LLM
const context = await memory.recall("Tell me about the user", {
  maxTokens: 2000,
  includeSummary: true
})

console.log(context.toString())
// Output: Summary + relevant memories formatted for LLM
```

**React Example:**
```tsx
import { useMemory } from '@clarity-chat/memory/react'

function ChatApp() {
  const memory = useMemory({
    userId: 'user-123',
    sessionId: 'session-456'
  })
  
  const handleSend = async (message: string) => {
    // Store message
    await memory.add(message)
    
    // Get context
    const context = await memory.recall(message)
    
    // Call LLM with context
    const response = await callLLM(context.toPrompt() + message)
    
    // Store response
    await memory.add(response)
  }
  
  return <ChatInput onSend={handleSend} />
}
```

**Next.js API Route:**
```typescript
// app/api/chat/route.ts
import { clarityMemory } from '@clarity-chat/memory'
import { openai } from '@ai-sdk/openai'

const memory = clarityMemory({
  store: process.env.REDIS_URL ? 'redis' : 'memory'
})

export async function POST(req: Request) {
  const { message, userId } = await req.json()
  
  const context = await memory.recall(message, { userId })
  const response = await openai('gpt-4').generateText({
    prompt: context.toPrompt() + '\n\n' + message
  })
  
  await memory.add(message, { userId })
  await memory.add(response.text, { userId })
  
  return Response.json({ response: response.text })
}
```

---

## Executive Summary

### What We Built

**Clarity Memory** is a TypeScript-first, framework-agnostic memory system that:

1. **Matches MemMachine's Core Features**
   - Episodic and semantic memory
   - Vector-based semantic search
   - Profile extraction
   - Cross-session memory
   - Multi-tenant support

2. **Eliminates MemMachine's DX Pain Points**
   - Zero-config setup
   - Simple, intuitive API
   - TypeScript-first
   - Framework-agnostic
   - Browser and serverless support

3. **Adds Advanced Features**
   - Built-in token management
   - Automatic compression
   - Time-weighted scoring
   - Memory topics
   - Model-aware optimization
   - React integration

4. **Superior Developer Experience**
   - Copy/paste ready examples
   - Comprehensive documentation
   - Migration guide from MemMachine
   - Progressive enhancement
   - Excellent TypeScript support

### Key Advantages

✅ **Simpler**: 3 lines of code vs 20+ lines  
✅ **Faster**: Zero setup vs Docker Compose  
✅ **Better DX**: TypeScript vs Python for JS/TS developers  
✅ **More Flexible**: Works anywhere vs server-only  
✅ **More Powerful**: Built-in token management vs manual  
✅ **Better Docs**: Unified, comprehensive vs scattered  

### Implementation Status

This blueprint provides:
- ✅ Complete feature analysis
- ✅ Full API design
- ✅ Type system definition
- ✅ Architecture blueprint
- ✅ Integration patterns
- ✅ Documentation structure
- ✅ Migration guide
- ✅ Code examples

**Ready for implementation!** 🚀

---

## Next Steps

1. **Phase 1**: Implement core `Memory` class and in-memory store
2. **Phase 2**: Add embedding providers and vector stores
3. **Phase 3**: Implement compression and summarization
4. **Phase 4**: Add React hooks and components
5. **Phase 5**: Write comprehensive documentation
6. **Phase 6**: Create examples and migration guide

---

*This document represents a complete design blueprint for Clarity Memory—a superior alternative to MemMachine with unmatched developer experience and flexibility.*
