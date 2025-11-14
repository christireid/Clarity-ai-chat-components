# Clarity Memory Architecture

This document describes the system architecture, design decisions, and implementation details of Clarity Memory.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Core Components](#core-components)
- [Data Flow](#data-flow)
- [Storage Architecture](#storage-architecture)
- [Scoring System](#scoring-system)
- [Context Engine](#context-engine)
- [Compression Pipeline](#compression-pipeline)
- [Design Decisions](#design-decisions)

---

## Overview

Clarity Memory is designed as a modular, extensible memory system with clear separation of concerns. The architecture follows these principles:

1. **Modularity**: Each component has a single responsibility
2. **Extensibility**: Easy to add new stores, embedders, scorers
3. **Type Safety**: Full TypeScript support throughout
4. **Performance**: Optimized for common use cases
5. **Developer Experience**: Simple APIs, good defaults

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
│  (React, Node.js, Serverless, Browser, AI SDKs)            │
└───────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  clarityMemory() → Memory class → Operations                │
└───────────────────────┬─────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   Storage    │ │  Embedding   │ │   Scoring   │
│   Adapters   │ │  Providers   │ │   System    │
└──────────────┘ └──────────────┘ └──────────────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Context Engine                            │
│  Token Budget → Retrieval → Ranking → Selection → Format  │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. Memory Engine

**Location**: `src/core/memory.ts`

**Responsibilities**:
- Memory lifecycle management
- Operation orchestration (add, recall, search)
- Integration with storage, embedding, scoring systems
- Event handling (ingestion, compression, eviction)

**Key Methods**:
- `add()` - Add memory
- `recall()` - Simple search
- `search()` - Advanced search
- `context()` - Get optimized context bundle
- `compress()` - Compress memory
- `stats()` - Get statistics

### 2. Storage Layer

**Location**: `src/stores/`

**Responsibilities**:
- Abstract storage interface
- Multiple storage implementations
- CRUD operations
- Search operations

**Adapters**:
- `in-memory.ts` - In-memory storage (default)
- `file.ts` - File-based JSON storage
- `indexeddb.ts` - Browser IndexedDB storage
- `redis.ts` - Redis storage
- `postgres.ts` - PostgreSQL storage
- `chroma.ts`, `qdrant.ts`, `pinecone.ts`, `lancedb.ts` - Vector DBs

**Interface**:
```typescript
interface MemoryStore {
  init(): Promise<void>
  add(item: MemoryItem): Promise<void>
  get(id: string): Promise<MemoryItem | null>
  search(query: string, options?: SearchOptions): Promise<SearchResult[]>
  update(id: string, updates: Partial<MemoryItem>): Promise<void>
  delete(id: string): Promise<void>
  getAll(): Promise<MemoryItem[]>
  clear(): Promise<void>
  stats(): Promise<StoreStats>
  close(): Promise<void>
}
```

### 3. Embedding Layer

**Location**: `src/embeddings/`

**Responsibilities**:
- Text embedding generation
- Multiple provider support
- Embedding caching
- Vector operations

**Providers**:
- `openai.ts` - OpenAI embeddings
- `anthropic.ts` - Anthropic embeddings
- `local.ts` - Local models (sentence-transformers)

**Interface**:
```typescript
interface Embedder {
  embed(text: string): Promise<number[]>
  embedBatch(texts: string[]): Promise<number[][]>
}
```

### 4. Scoring System

**Location**: `src/scoring/`

**Responsibilities**:
- Calculate memory importance scores
- Multiple scoring components
- Composite scoring
- Time decay

**Components**:
- `importance-scorer.ts` - Base importance scoring
- `recency-scorer.ts` - Recency-based scoring
- `frequency-scorer.ts` - Frequency-based scoring
- `relevance-scorer.ts` - Relevance-based scoring
- `composite-scorer.ts` - Combines all scores

**Scoring Formula**:
```
score = (recencyWeight × recencyScore) +
        (frequencyWeight × frequencyScore) +
        (relevanceWeight × relevanceScore) +
        (importanceWeight × importanceScore)
```

### 5. Context Engine

**Location**: `src/context/`

**Responsibilities**:
- Token budget management
- Memory retrieval and ranking
- Context bundling for LLMs
- Formatting for different LLM providers

**Components**:
- `token-budget.ts` - Token budget calculator
- `priority-selector.ts` - Priority-based selection
- `semantic-grouper.ts` - Semantic grouping
- `formatter.ts` - Context formatting

**Flow**:
```
Query → Token Budget → Retrieval → Scoring → Selection → Grouping → Formatting → Bundle
```

### 6. Compression Pipeline

**Location**: `src/compression/`

**Responsibilities**:
- Memory compression strategies
- Summarization
- Deduplication
- Pruning

**Strategies**:
- `summarization-compressor.ts` - LLM-powered summarization
- `deduplication-compressor.ts` - Remove duplicates
- `pruning-compressor.ts` - Remove low-importance
- `adaptive-compressor.ts` - Adaptive strategy selection

---

## Data Flow

### Adding Memory

```
User → memory.add()
  → Validate input
  → Generate embedding (if needed)
  → Calculate initial score
  → Store in short-term memory
  → Store in long-term memory (if enabled)
  → Trigger ingestion event
  → Return MemoryItem
```

### Recalling Memory

```
User → memory.recall(query)
  → Generate query embedding
  → Search short-term memory
  → Search long-term memory
  → Score and rank results
  → Filter by minScore
  → Limit results
  → Generate summary (if requested)
  → Return results
```

### Context Bundling

```
User → memory.context(options)
  → Calculate token budget
  → Retrieve memories (short + long term)
  → Score and rank memories
  → Select memories within budget
  → Group semantically
  → Summarize low-priority memories
  → Format for target LLM
  → Return ContextBundle
```

### Compression

```
User → memory.compress(options)
  → Select compression strategy
  → Identify memories to compress
  → Apply compression (summarize/deduplicate/prune)
  → Update storage
  → Return CompressionResult
```

---

## Storage Architecture

### Two-Tier Storage

**Short-Term Memory**:
- Fast, in-memory storage
- Recent conversation history
- Automatic eviction when full
- Summarization on eviction

**Long-Term Memory**:
- Persistent storage
- Vector-based semantic search
- Configurable storage backend
- Cross-session search

### Storage Adapter Pattern

All storage adapters implement the `MemoryStore` interface, allowing easy swapping:

```typescript
// In-memory (default)
store: { type: 'in-memory' }

// File-based
store: { type: 'file', path: './memory.json' }

// Database
store: { type: 'postgres', connectionString: '...' }

// Vector DB
store: { type: 'chroma', url: '...' }
```

---

## Scoring System

### Score Components

1. **Recency Score**: Based on time since creation/access
   - Formula: `1 / (1 + daysSinceAccess)`
   - Weight: Configurable (default: 0.4)

2. **Frequency Score**: Based on access count
   - Formula: `log(accessCount + 1) / log(maxAccessCount + 1)`
   - Weight: Configurable (default: 0.3)

3. **Relevance Score**: Based on semantic similarity
   - Formula: `cosineSimilarity(queryEmbedding, memoryEmbedding)`
   - Weight: Configurable (default: 0.3)

4. **Importance Score**: User-defined or inferred
   - Formula: `promoted ? 1.0 : inferredImportance`
   - Weight: Configurable (default: 0.0)

### Time Decay

Optional time decay for automatic importance reduction:

```typescript
scoring: {
  timeDecay: {
    enabled: true,
    halfLife: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
}
```

---

## Context Engine

### Token Budget Management

The context engine ensures context bundles stay within token limits:

```typescript
tokenBudget: {
  maxTokens: 4000,
  reserveTokens: 500,  // For system prompts
  strategy: 'priority', // Selection strategy
}
```

### Selection Strategies

1. **Priority**: Select highest-scoring memories first
2. **Recent**: Select most recent memories first
3. **Balanced**: Balance between priority and recency

### Formatting

Context is formatted for different LLM providers:

- **OpenAI**: Array of message objects
- **Anthropic**: Array of message objects (different format)
- **Claude**: Claude-specific format

---

## Compression Pipeline

### Strategies

1. **Summarization**: LLM-powered summarization of old memories
2. **Deduplication**: Remove duplicate or near-duplicate memories
3. **Pruning**: Remove low-importance memories
4. **Adaptive**: Automatically choose best strategy

### Adaptive Compression

The adaptive compressor analyzes memory characteristics and chooses the best strategy:

- High duplication → Deduplication
- Low importance spread → Pruning
- Semantic clusters → Summarization
- Mixed → Combination

---

## Design Decisions

### 1. Single Context ID

**Decision**: Use single context ID instead of MemMachine's 4 IDs.

**Rationale**: 
- Simpler API
- Easier to understand
- Sufficient for most use cases
- Can encode multiple IDs if needed ("user:session")

**Trade-off**: Less explicit than separate IDs, but simpler.

### 2. Zero-Config Defaults

**Decision**: Work out of the box with no configuration.

**Rationale**:
- Lower barrier to entry
- Faster prototyping
- Better developer experience

**Trade-off**: Less control, but can be configured when needed.

### 3. Standalone Usage

**Decision**: No server required for basic usage.

**Rationale**:
- Works in more environments
- Easier to get started
- Better for simple use cases

**Trade-off**: May need server for production scale, but optional.

### 4. TypeScript-First

**Decision**: Full TypeScript support from the start.

**Rationale**:
- Type safety
- Better IDE support
- Easier to maintain
- Modern development standard

**Trade-off**: Requires TypeScript knowledge, but benefits outweigh.

### 5. Multiple Storage Adapters

**Decision**: Support many storage backends.

**Rationale**:
- Flexibility
- Works in different environments
- Can choose based on needs

**Trade-off**: More code to maintain, but modular design helps.

---

## Performance Considerations

### Embedding Caching

Embeddings are cached to avoid redundant API calls:

```typescript
embedding: {
  cache: true,
  cacheTTL: 24 * 60 * 60 * 1000, // 24 hours
}
```

### Lazy Loading

Long-term memories are loaded on-demand, not all at once.

### Batch Operations

Batch operations are supported for efficiency:

```typescript
await memory.addMany([...])
```

### Indexing

Storage adapters can implement indexing for fast retrieval (e.g., vector indexes for semantic search).

---

## Extension Points

### Custom Storage Adapter

```typescript
class CustomStore implements MemoryStore {
  // Implement interface
}
```

### Custom Embedder

```typescript
class CustomEmbedder implements Embedder {
  // Implement interface
}
```

### Custom Scorer

```typescript
class CustomScorer implements Scorer {
  // Implement interface
}
```

---

## Conclusion

Clarity Memory's architecture is designed for:
- ✅ **Modularity**: Clear separation of concerns
- ✅ **Extensibility**: Easy to add new components
- ✅ **Performance**: Optimized for common cases
- ✅ **Developer Experience**: Simple APIs, good defaults
- ✅ **Type Safety**: Full TypeScript support

The architecture supports the goals of being simpler, more powerful, and more accessible than alternatives while maintaining flexibility for advanced use cases.
