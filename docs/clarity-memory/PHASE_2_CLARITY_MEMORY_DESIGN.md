# Phase 2: Clarity Memory Design

## Executive Summary

Clarity Memory is a superior, developer-friendly memory system that matches MemMachine's capabilities while dramatically improving developer experience. It's designed to be:
- **Zero-config** by default (works out of the box)
- **Standalone** (no server required for basic usage)
- **Universal** (works in React, Node.js, serverless, browser)
- **TypeScript-first** (full type safety)
- **Simple** (reduced cognitive overhead)

---

## 1. Core Concepts (Redesigned)

### 1.1 Memory

**Definition**: A single, isolated memory instance for a specific context (user, session, or conversation).

**Key Insight**: Unlike MemMachine's four-ID system (group, agent, user, session), Clarity Memory uses a **single context identifier**. The context can be:
- A user ID (for user-specific memory)
- A session ID (for conversation-specific memory)
- A combination (user + session for multi-session user memory)

**Simplification**: One context ID instead of four.

```typescript
// MemMachine (complex)
memory = client.memory(
    group_id="group",
    agent_id=["agent"],
    user_id=["user"],
    session_id="session"
)

// Clarity Memory (simple)
memory = clarityMemory({ context: "user123" })
// or
memory = clarityMemory({ context: "user123:session456" })
```

### 1.2 Short-Term Context

**Definition**: Recent conversation history kept in memory for fast access.

**Features**:
- Automatic token-aware eviction
- Sliding window of recent messages
- Automatic summarization when evicted
- Configurable capacity (default: 50 messages or 32K tokens)

**Key Difference from MemMachine**: Simpler configuration. Just specify max tokens or max messages, not both.

```typescript
const memory = clarityMemory({
  context: "user123",
  shortTerm: {
    maxTokens: 32000,  // or maxMessages: 50
  }
})
```

### 1.3 Long-Term Context

**Definition**: Persistent, searchable memory stored in a vector database.

**Features**:
- Semantic search via embeddings
- Automatic chunking and embedding
- Configurable storage backend (in-memory, file, IndexedDB, Redis, Postgres, vector DBs)
- Cross-session search within context scope

**Key Difference from MemMachine**: Multiple storage adapters, not just Neo4j. Default to in-memory for zero-config.

```typescript
const memory = clarityMemory({
  context: "user123",
  longTerm: {
    store: "in-memory",  // or "file", "indexeddb", "redis", "postgres", "chroma", etc.
  }
})
```

### 1.4 Importance Scoring

**Definition**: Automatic scoring of memories based on:
- Recency (time decay)
- Frequency (how often referenced)
- Semantic relevance (embedding similarity)
- User signals (explicit promotes/forgets)

**Features**:
- Time-weighted scoring (recent = higher score)
- Frequency boosting (frequently accessed = higher score)
- Adaptive scoring (learns from usage patterns)

**Key Enhancement**: MemMachine doesn't have automatic importance scoring. Clarity Memory adds this.

```typescript
const memory = clarityMemory({
  context: "user123",
  scoring: {
    recencyWeight: 0.4,      // How much recency matters
    frequencyWeight: 0.3,     // How much frequency matters
    relevanceWeight: 0.3,     // How much semantic relevance matters
  }
})
```

### 1.5 Embeddings

**Definition**: Vector representations of text for semantic search.

**Features**:
- Multiple provider support (OpenAI, Anthropic, local models)
- Automatic embedding generation
- Configurable embedding model
- Caching for performance

**Key Difference**: Simpler API. Embeddings are handled automatically.

```typescript
const memory = clarityMemory({
  context: "user123",
  embedding: {
    provider: "openai",  // or "anthropic", "local"
    model: "text-embedding-3-small",
  }
})
```

### 1.6 Context Bundles

**Definition**: Optimized collections of memories prepared for LLM context windows.

**Features**:
- Token-aware selection
- Priority-based ranking
- Automatic summarization of low-priority memories
- Formatting for different LLM providers

**Key Enhancement**: MemMachine has `formalize_query_with_context()`, but Clarity Memory's context bundling is more sophisticated with token budgeting.

```typescript
const bundle = await memory.context({
  query: "What do I like?",
  maxTokens: 4000,
  includeSummary: true,
  format: "openai",  // or "anthropic", "claude", etc.
})
// Returns: { messages: [...], tokens: 3850, summary: "..." }
```

### 1.7 Compression Strategies

**Definition**: Methods for reducing memory size while preserving important information.

**Strategies**:
1. **Summarization**: LLM-powered summarization of old memories
2. **Deduplication**: Remove duplicate or near-duplicate memories
3. **Pruning**: Remove low-importance memories
4. **Chunking**: Split large memories into smaller chunks

**Key Enhancement**: More sophisticated than MemMachine's simple summarization.

```typescript
await memory.compress({
  strategy: "adaptive",  // or "summarize", "deduplicate", "prune"
  targetSize: "50%",      // Reduce to 50% of current size
})
```

### 1.8 Memory Lifecycle

**Definition**: The stages a memory goes through from creation to deletion.

**Stages**:
1. **Creation**: Memory instance created
2. **Ingestion**: New memories added
3. **Retrieval**: Memories searched and retrieved
4. **Compression**: Old memories compressed/summarized
5. **Eviction**: Low-importance memories removed
6. **Deletion**: Memory instance destroyed

**Key Difference**: More explicit lifecycle management than MemMachine.

```typescript
const memory = clarityMemory({ context: "user123" })

// Lifecycle hooks
memory.on("ingestion", (memories) => { ... })
memory.on("compression", (summary) => { ... })
memory.on("eviction", (memories) => { ... })
```

---

## 2. Clean New API Surface

### 2.1 Core API

#### Basic Usage (Zero Config)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// Simplest possible usage - zero config
const memory = clarityMemory()

// Add a memory
await memory.add("User prefers sarcastic humor.")

// Recall memories
const context = await memory.recall("Tell me your favorite jokes.")
// Returns: { memories: [...], tokens: 1234, summary: "..." }
```

#### Context-Specific Usage

```typescript
// With context (user-specific memory)
const memory = clarityMemory({ context: "user123" })

await memory.add("I like pizza")
const results = await memory.recall("What do I like?")
```

#### Configurable Usage

```typescript
const memory = clarityMemory({
  context: "user123",
  
  // Embedding provider
  embedding: {
    provider: "openai",
    model: "text-embedding-3-small",
    apiKey: process.env.OPENAI_API_KEY,
  },
  
  // Storage backend
  store: "in-memory",  // or "file", "indexeddb", "redis", "postgres", "chroma"
  
  // Short-term memory
  shortTerm: {
    maxTokens: 32000,
    maxMessages: 50,
  },
  
  // Long-term memory
  longTerm: {
    enabled: true,
    store: "file",  // Different store for long-term
    path: "./memory.db",
  },
  
  // Summarization
  summarizer: {
    provider: "openai",
    model: "gpt-4o-mini",
    auto: true,  // Auto-summarize when evicting
  },
  
  // Scoring
  scoring: {
    recencyWeight: 0.4,
    frequencyWeight: 0.3,
    relevanceWeight: 0.3,
  },
})
```

### 2.2 Memory Operations

#### Add Memory

```typescript
// Simple
await memory.add("I like pizza")

// With metadata
await memory.add("I like pizza", {
  type: "preference",
  category: "food",
  importance: "high",
})

// With explicit timestamp
await memory.add("I like pizza", {
  timestamp: new Date("2024-01-01"),
})

// Batch add
await memory.addMany([
  "I like pizza",
  "I work as a software engineer",
  "I live in San Francisco",
])
```

#### Search/Recall

```typescript
// Simple recall
const results = await memory.recall("What do I like?")

// With options
const results = await memory.recall("What do I like?", {
  limit: 10,
  minScore: 0.7,
  includeSummary: true,
})

// Search (more advanced)
const results = await memory.search({
  query: "What do I like?",
  filters: {
    type: "preference",
    category: "food",
  },
  limit: 10,
  sortBy: "relevance",  // or "recency", "importance"
})
```

#### Context Bundling

```typescript
// Get optimized context for LLM
const bundle = await memory.context({
  query: "What do I like?",
  maxTokens: 4000,
  format: "openai",  // or "anthropic", "claude"
  includeSummary: true,
})

// bundle.messages - formatted for LLM
// bundle.tokens - actual token count
// bundle.summary - summary of older memories
```

#### Memory Management

```typescript
// Promote memory (increase importance)
await memory.promote(memoryId)

// Forget memory (decrease importance or delete)
await memory.forget(memoryId)

// Forget by query
await memory.forgetByQuery("old information")

// Compress memory
await memory.compress({
  strategy: "adaptive",
  targetSize: "50%",
})

// Flush all memory
await memory.flush()

// Get memory stats
const stats = await memory.stats()
// { totalMemories: 123, tokens: 45678, oldestMemory: Date, ... }
```

### 2.3 Advanced Features

#### Automatic Extraction

```typescript
// Extract memories from chat messages automatically
await memory.extractFromMessages([
  { role: "user", content: "I like pizza" },
  { role: "assistant", content: "Got it!" },
  { role: "user", content: "I also like pasta" },
])

// With extraction options
await memory.extractFromMessages(messages, {
  extractPreferences: true,
  extractFacts: true,
  extractEvents: false,
})
```

#### Memory Topics

```typescript
// Group memories by topic
const topics = await memory.topics()
// [{ topic: "food preferences", memories: [...], score: 0.9 }, ...]

// Get memories for a specific topic
const foodMemories = await memory.getTopic("food preferences")
```

#### Time-Weighted Scoring

```typescript
// Memories decay over time
const memory = clarityMemory({
  context: "user123",
  scoring: {
    timeDecay: {
      enabled: true,
      halfLife: 30 * 24 * 60 * 60 * 1000,  // 30 days in ms
    },
  },
})
```

#### Token Budgeting

```typescript
// Automatic token budgeting
const memory = clarityMemory({
  context: "user123",
  tokenBudget: {
    maxTokens: 4000,
    reserveTokens: 500,  // Reserve for system prompts
    strategy: "priority",  // or "recent", "balanced"
  },
})

// When recalling, automatically stays within budget
const context = await memory.recall("query")
// Automatically selects memories to fit within budget
```

---

## 3. Complete Feature Set

### 3.1 Core Features (Matching MemMachine)

| Feature | MemMachine | Clarity Memory | Status |
|---------|-----------|----------------|--------|
| Add memory | ✅ `add_memory_episode()` | ✅ `add()` | Match |
| Search memory | ✅ `query_memory()` | ✅ `recall()`, `search()` | Enhanced |
| Embeddings | ✅ Manual | ✅ Automatic | Improved |
| Ranking | ✅ Rerankers | ✅ Built-in scoring | Improved |
| Summarization | ✅ Manual | ✅ Automatic | Improved |
| Compression | ✅ Basic | ✅ Advanced strategies | Enhanced |
| Promote | ❌ | ✅ `promote()` | New |
| Forget | ✅ `delete_data()` | ✅ `forget()` | Improved |
| TTL | ❌ | ✅ Configurable | New |
| Multi-session | ✅ | ✅ Simplified | Improved |
| Multi-store | ❌ (Neo4j only) | ✅ Multiple adapters | Enhanced |
| Tool extraction | ❌ | ✅ `extractFromMessages()` | New |
| Token-aware trimming | ✅ Manual | ✅ Automatic | Improved |
| Automatic summarization | ✅ | ✅ Enhanced | Improved |
| Sliding window | ✅ | ✅ Simplified | Improved |
| DevTools | ❌ | ✅ React inspector | New |

### 3.2 New Enhancements

1. **Built-in Token Budgeting**: Automatic token management
2. **Adaptive Memory Compression**: Smart compression strategies
3. **Time-Weighted Scoring**: Automatic importance decay
4. **Automatic Extraction**: Extract memories from chat messages
5. **Memory Topics**: Semantic grouping of memories
6. **Model-Aware Optimization**: Optimize for specific LLM providers
7. **Drop-in Debug Panel**: React component for inspecting memory
8. **Standalone Usage**: No server required
9. **Multiple Storage Adapters**: In-memory, file, IndexedDB, Redis, Postgres, vector DBs
10. **TypeScript-First**: Full type safety

---

## 4. New Enhancements (Detailed)

### 4.1 Built-in Token Budgeting

**Problem**: MemMachine requires manual token counting. Clarity Memory handles this automatically.

**Solution**:
```typescript
const memory = clarityMemory({
  tokenBudget: {
    maxTokens: 4000,
    reserveTokens: 500,
    strategy: "priority",  // Select highest-priority memories first
  },
})

// Automatically selects memories to fit within budget
const context = await memory.recall("query")
// context.tokens <= 4000
```

### 4.2 Adaptive Memory Compression

**Problem**: MemMachine has basic summarization. Clarity Memory has multiple compression strategies.

**Solution**:
```typescript
// Adaptive compression (chooses best strategy)
await memory.compress({ strategy: "adaptive" })

// Summarization (LLM-powered)
await memory.compress({ strategy: "summarize" })

// Deduplication (remove duplicates)
await memory.compress({ strategy: "deduplicate" })

// Pruning (remove low-importance)
await memory.compress({ strategy: "prune", minScore: 0.5 })
```

### 4.3 Time-Weighted Scoring

**Problem**: MemMachine doesn't automatically decay memory importance over time.

**Solution**:
```typescript
const memory = clarityMemory({
  scoring: {
    timeDecay: {
      enabled: true,
      halfLife: 30 * 24 * 60 * 60 * 1000,  // 30 days
    },
  },
})

// Older memories automatically score lower
// Recent memories score higher
```

### 4.4 Automatic Extraction from Chat Messages

**Problem**: MemMachine requires manual profile extraction. Clarity Memory can extract automatically.

**Solution**:
```typescript
// Extract memories from chat messages
await memory.extractFromMessages([
  { role: "user", content: "I like pizza and pasta" },
  { role: "assistant", content: "Noted!" },
])

// Automatically extracts:
// - Preferences: "pizza", "pasta"
// - Facts: (if any)
// - Events: (if any)
```

### 4.5 Memory Topics

**Problem**: MemMachine doesn't group memories by topic.

**Solution**:
```typescript
// Get topics
const topics = await memory.topics()
// [{ topic: "food preferences", memories: [...], score: 0.9 }, ...]

// Get memories for a topic
const foodMemories = await memory.getTopic("food preferences")

// Search within a topic
const results = await memory.search({
  query: "pizza",
  topic: "food preferences",
})
```

### 4.6 Model-Aware Optimization

**Problem**: MemMachine doesn't optimize for specific LLM providers.

**Solution**:
```typescript
const memory = clarityMemory({
  targetModel: "gpt-4o",  // Optimize for this model
  contextFormat: "openai",  // Format context for OpenAI API
})

// Context is automatically formatted for the target model
const bundle = await memory.context({ query: "..." })
// bundle.messages formatted for OpenAI Chat API
```

### 4.7 Drop-in Debug Panel

**Problem**: MemMachine has no visual debugging tools.

**Solution**:
```tsx
import { MemoryInspector } from '@clarity-chat/memory/react'

function App() {
  const memory = clarityMemory({ context: "user123" })
  
  return (
    <div>
      <YourApp />
      <MemoryInspector memory={memory} />
    </div>
  )
}
```

### 4.8 Standalone Usage

**Problem**: MemMachine requires a server. Clarity Memory works standalone.

**Solution**:
```typescript
// Works without any server
const memory = clarityMemory({
  store: "in-memory",  // or "file", "indexeddb"
})

// No server needed!
await memory.add("Hello")
await memory.recall("Hello")
```

---

## 5. API Comparison

### 5.1 Adding Memory

**MemMachine**:
```python
await inst.add_memory_episode(
    producer="test_user1",
    produced_for="test_user2",
    episode_content="test_content",
    episode_type="test_type",
    content_type=ContentType.STRING,
    timestamp=datetime.now(),
    metadata={}
)
```

**Clarity Memory**:
```typescript
await memory.add("test_content", {
  type: "test_type",
  timestamp: new Date(),
})
```

**Improvement**: 7 parameters → 2 parameters (with optional metadata)

### 5.2 Searching Memory

**MemMachine**:
```python
short_episode, long_episode, summary = await inst.query_memory(
    query="test_query",
    limit=20,
    property_filter={"category": "food"}
)
```

**Clarity Memory**:
```typescript
const results = await memory.recall("test_query", {
  limit: 20,
  filters: { category: "food" },
})
// Returns: { memories: [...], tokens: 1234, summary: "..." }
```

**Improvement**: Tuple return → Structured object return

### 5.3 Context Formatting

**MemMachine**:
```python
finalized_query = await inst.formalize_query_with_context(
    query="test_query",
    limit=20,
    property_filter={}
)
# Returns XML-formatted string
```

**Clarity Memory**:
```typescript
const bundle = await memory.context({
  query: "test_query",
  maxTokens: 4000,
  format: "openai",
})
// Returns: { messages: [...], tokens: 3850, summary: "..." }
```

**Improvement**: XML string → Structured messages array

---

## 6. Design Principles

### 6.1 Zero-Config Defaults

**Principle**: Clarity Memory should work out of the box with zero configuration.

**Implementation**:
- Default to in-memory storage
- Default to OpenAI embeddings (if API key available)
- Default to reasonable limits (50 messages, 32K tokens)
- Auto-detect environment (browser vs Node.js)

### 6.2 Progressive Enhancement

**Principle**: Start simple, add complexity only when needed.

**Implementation**:
- Basic usage: `clarityMemory()` → works immediately
- Add context: `clarityMemory({ context: "user123" })` → user-specific
- Add config: `clarityMemory({ ...config })` → full control

### 6.3 Type Safety

**Principle**: Full TypeScript support with excellent type inference.

**Implementation**:
- All APIs fully typed
- Generic types for custom metadata
- Type-safe storage adapters
- Type-safe embedding providers

### 6.4 Platform Agnostic

**Principle**: Works everywhere (React, Node.js, serverless, browser).

**Implementation**:
- Multiple storage adapters (in-memory, file, IndexedDB, etc.)
- Environment detection
- No server dependency for basic usage
- Universal API surface

### 6.5 Developer Experience First

**Principle**: Optimize for developer happiness and productivity.

**Implementation**:
- Simple APIs (fewer parameters)
- Clear error messages
- Excellent documentation
- React DevTools integration
- Migration guides from MemMachine

---

## 7. Migration Path from MemMachine

### 7.1 Simple Migration

**MemMachine**:
```python
client = MemMachineClient(base_url="http://localhost:8080")
memory = client.memory(
    group_id="group",
    agent_id=["agent"],
    user_id=["user"],
    session_id="session"
)
memory.add("Hello")
```

**Clarity Memory**:
```typescript
const memory = clarityMemory({ context: "user:session" })
await memory.add("Hello")
```

### 7.2 Advanced Migration

**MemMachine**:
```python
manager = EpisodicMemoryManager.create_episodic_memory_manager("cfg.yml")
inst = await manager.get_episodic_memory_instance(...)
async with AsyncEpisodicMemory(inst) as mem:
    await mem.add_memory_episode(...)
```

**Clarity Memory**:
```typescript
const memory = clarityMemory({
  context: "user:session",
  embedding: { provider: "openai", ... },
  store: "postgres",
  // ... config
})
await memory.add("...")
```

---

## Conclusion

Clarity Memory preserves MemMachine's powerful features while dramatically improving developer experience through:
1. **Simplified API**: Fewer parameters, clearer semantics
2. **Zero Config**: Works out of the box
3. **Standalone**: No server required
4. **TypeScript-First**: Full type safety
5. **Universal**: Works everywhere
6. **Enhanced Features**: Token budgeting, adaptive compression, topics, etc.

Next: Phase 3 will define the implementation blueprint with exact types, APIs, and architecture.
