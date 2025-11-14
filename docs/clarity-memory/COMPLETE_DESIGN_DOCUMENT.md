# Clarity Memory: Complete Design Document

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [MemMachine Analysis](#memmachine-analysis)
3. [Clarity Memory Design](#clarity-memory-design)
4. [Implementation Blueprint](#implementation-blueprint)
5. [Integration Patterns](#integration-patterns)
6. [Documentation](#documentation)
7. [Migration Guide](#migration-guide)
8. [Examples](#examples)

---

## Executive Summary

Clarity Memory is a superior, developer-friendly memory system for AI applications that matches MemMachine's powerful features while dramatically improving developer experience. It's designed to be:

- **Zero-config**: Works out of the box with sensible defaults
- **Standalone**: No server required - works in scripts, serverless, and browsers
- **Universal**: Works with React, Node.js, serverless functions, and any AI SDK
- **Type-Safe**: Full TypeScript support with excellent type inference
- **Smart**: Automatic token budgeting, adaptive compression, and importance scoring

### Key Improvements Over MemMachine

| Aspect | MemMachine | Clarity Memory |
|--------|-----------|----------------|
| Setup | Server + Docker + Config | Zero-config |
| Context IDs | 4 IDs | 1 ID |
| Standalone | ❌ | ✅ |
| TypeScript | ❌ Python only | ✅ Full support |
| Storage | Neo4j only | 10+ adapters |
| Token Budgeting | ❌ Manual | ✅ Automatic |
| React Support | ❌ | ✅ Hooks + Components |

---

## MemMachine Analysis

### Core Features Identified

1. **Episodic Memory**
   - Short-term (session memory) with automatic summarization
   - Long-term (declarative memory) with vector search
   - Multi-session support

2. **Profile Memory**
   - LLM-powered extraction from conversations
   - Feature-value-tag structure
   - Automatic consolidation/deduplication

3. **Storage & Infrastructure**
   - Neo4j vector graph store
   - PostgreSQL for profiles
   - Multiple embedders and rerankers

### DX Pain Points Identified

1. **Complex Configuration**: Extensive YAML config files
2. **Server Dependency**: Cannot use without running server
3. **Python-Only SDK**: No TypeScript/JavaScript support
4. **Verbose APIs**: Too many parameters for common use cases
5. **Limited Documentation**: Scattered docs
6. **No Web Integration**: No React hooks or web-friendly APIs

### Architecture Insights

- Two-tier memory system (short-term + long-term)
- Graph database for episodic memory
- LLM-powered profile extraction
- Complex context model (4 IDs)

---

## Clarity Memory Design

### Core Concepts

1. **Memory**: Single, isolated memory instance for a context
2. **Short-Term Context**: Recent conversation history with auto-eviction
3. **Long-Term Context**: Persistent, searchable memory with vector search
4. **Importance Scoring**: Automatic scoring based on recency, frequency, relevance
5. **Context Bundles**: Optimized collections for LLM context windows
6. **Compression Strategies**: Summarization, deduplication, pruning, adaptive

### API Design

#### Basic Usage
```typescript
const memory = clarityMemory()
await memory.add("User likes pizza")
const results = await memory.recall("What does the user like?")
```

#### With Configuration
```typescript
const memory = clarityMemory({
  context: "user123",
  embedding: { provider: "openai", model: "text-embedding-3-small" },
  store: { type: "file", path: "./memory.json" },
  tokenBudget: { maxTokens: 4000, reserveTokens: 500 },
})
```

### Feature Set

**Core Features** (Matching MemMachine):
- ✅ Add memory
- ✅ Search/recall memory
- ✅ Embeddings (automatic)
- ✅ Ranking (built-in scoring)
- ✅ Summarization (automatic)
- ✅ Compression (advanced strategies)
- ✅ Multi-session support
- ✅ Multi-store support

**New Enhancements**:
- 🚀 Built-in token budgeting
- 🚀 Adaptive memory compression
- 🚀 Time-weighted scoring
- 🚀 Automatic extraction from chat messages
- 🚀 Memory topics and semantic grouping
- 🚀 React DevTools integration

---

## Implementation Blueprint

### Module Layout

```
packages/memory/
├── src/
│   ├── core/              # Core memory engine
│   ├── stores/            # Storage adapters
│   ├── embeddings/        # Embedding providers
│   ├── scoring/           # Scoring system
│   ├── summarization/     # Summarization pipeline
│   ├── compression/       # Compression strategies
│   ├── pipelines/         # Processing pipelines
│   ├── adapters/          # AI SDK adapters
│   ├── context/           # Context engine
│   ├── react/             # React integration
│   └── utils/             # Utilities
```

### Type System

- `MemoryItem`: Single memory with metadata
- `MemoryChunk`: Chunked memory for large content
- `Embedding`: Vector representation
- `MemoryScore`: Scoring breakdown
- `SearchResult`: Search result with metadata
- `ContextBundle`: Optimized context for LLMs

### Storage Adapters

- In-memory (default)
- File (JSON persistence)
- IndexedDB (browser)
- Redis
- PostgreSQL
- SQLite
- Vector DBs (Chroma, Qdrant, Pinecone, LanceDB)

### Context Engine

1. Token Budget Calculator
2. Memory Retrieval
3. Scoring & Ranking
4. Token-Aware Selection
5. Semantic Grouping
6. Formatting

---

## Integration Patterns

### React Integration
```typescript
const { memory, add, recall } = useMemory({ context: "user123" })
```

### Serverless Functions
```typescript
const memory = clarityMemory({
  context: userId,
  store: { type: 'file', path: '/tmp/memory.json' },
})
```

### Browser Applications
```typescript
const memory = clarityMemory({
  context: "user123",
  store: { type: 'indexeddb' },
})
```

### AI SDK Integration
- Vercel AI SDK adapter
- LangChain adapter
- OpenAI API direct
- Anthropic API direct

---

## Documentation

### Getting Started
- Installation
- Basic usage
- Configuration
- Examples

### API Reference
- Core API
- React API
- Adapter APIs
- Type definitions

### Migration Guide
- Step-by-step migration from MemMachine
- Feature mapping
- Common issues and solutions

---

## Migration Guide

### Key Changes

1. **Context Simplification**: 4 IDs → 1 ID
2. **No Server Required**: Standalone usage
3. **Simplified API**: Fewer parameters
4. **TypeScript Support**: Full type safety
5. **Multiple Storage Options**: Choose appropriate adapter

### Migration Steps

1. Install Clarity Memory
2. Replace client initialization
3. Update memory operations
4. Configure storage
5. Update context formatting

---

## Examples

### Basic Demo
```typescript
const memory = clarityMemory()
await memory.add("User likes pizza")
const results = await memory.recall("What does the user like?")
```

### React Demo
```tsx
const { memory, add, recall } = useMemory({ context: "user123" })
```

### Serverless Demo
```typescript
const memory = clarityMemory({
  context: userId,
  store: { type: 'file', path: '/tmp/memory.json' },
})
```

---

## Conclusion

Clarity Memory is designed to be:
- ✅ **Simpler** than MemMachine (zero-config, fewer parameters)
- ✅ **More Powerful** (enhanced features, multiple storage options)
- ✅ **More Accessible** (works everywhere, TypeScript support)
- ✅ **Better DX** (excellent docs, React integration, DevTools)

The design is complete, the architecture is sound, and the implementation path is clear. Clarity Memory is ready to be built.

---

**Status**: ✅ Design Complete - Ready for Implementation

**Next Steps**:
1. Implement core memory engine
2. Build storage adapters (in-memory, file, IndexedDB)
3. Implement embedding providers (OpenAI first)
4. Build React integration
5. Create comprehensive test suite
6. Release initial version
