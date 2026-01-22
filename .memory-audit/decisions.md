# Memory System Architecture Decisions

**Date:** 2026-01-22
**Phase:** 0 - Orientation & Memory Boundaries

---

## Memory Definition

**What IS Memory:**
- Persistent or ephemeral storage of conversation context, user facts, and learned knowledge
- Structured data with embeddings, importance scores, and metadata
- Scoped storage (session, thread, user, global) with defined lifecycles
- Token-optimized context retrieval for LLM consumption

**What is NOT Memory:**
- UI state (component visibility, modal state, etc.)
- Real-time chat messages (those are inputs to memory, not memory itself)
- Temporary rendering state
- Non-persistent application state

---

## Memory Scopes (4 Levels)

1. **Session** - Current session, cleared on logout
2. **Thread** - Specific conversation thread, persists across sessions
3. **User** - User-level persistent memory, cross-thread
4. **Global** - System-wide shared memory, cross-user

---

## Memory Types (5 Categories)

1. **Episodic** - Short-term conversation history (recent messages)
2. **Semantic** - Long-term facts and knowledge
3. **Procedural** - How-to information, processes
4. **Short-term** - Temporary working memory
5. **Profile** - User characteristics and traits

---

## Storage Architecture (4-Layer Hybrid)

### Layer 1: Real-Time Context Buffer
- **Implementation:** `InMemoryStore`
- **Location:** `/packages/memory/src/stores/in-memory.ts`
- **Purpose:** Fast, in-memory vector store for current session
- **Persistence:** None
- **Use Case:** Development, testing, serverless

### Layer 2: Session Memory
- **Implementation:** `FileStore`
- **Location:** `/packages/memory/src/stores/file.ts`
- **Purpose:** JSON file persistence for single-server apps
- **Persistence:** File system
- **Use Case:** Node.js applications

### Layer 3: Persistent Storage (Browser)
- **Implementation:** `IndexedDBStore`
- **Location:** `/packages/memory/src/stores/indexeddb.ts`
- **Purpose:** Browser-native persistence
- **Persistence:** IndexedDB
- **Use Case:** Client-side React applications

### Layer 4: Distributed Storage
- **Implementations:** Redis, Postgres (planned/external)
- **Purpose:** Distributed, scalable memory
- **Persistence:** Database
- **Use Case:** Production, multi-server

---

## Core Memory Service

**Main Service:** `/packages/memory/src/memory-service.ts`

**Key Operations:**
- `add()` / `addBatch()` - Create memories
- `search()` / `recall()` - Retrieve with filters
- `context()` - Get optimized context bundle
- `update()` / `delete()` - Modify/remove
- `promote()` - Increase scope/importance
- `compress()` - Reduce token usage
- `getStats()` - Statistics
- `inspect()` - Full state inspection

---

## Summarization System

**Location:** `/packages/memory/src/summarization/`

**Providers:**
- LLM Summarizer (provider-agnostic)
- OpenAI Summarizer (GPT-3.5/4)
- Anthropic Summarizer (Claude)

**Styles:**
- Bullet points
- Narrative
- Structured
- Minimal

**Features:**
- Progressive summarization for long conversations
- Hierarchical multi-level summaries
- Cache with TTL
- Graceful fallback

---

## Compression Strategies

**Location:** `/packages/memory/src/compression/`

1. **Truncate** - Simple content truncation (fast, minimal quality loss)
2. **Extract** - Key phrase extraction (maintains important info)
3. **Summarize** - LLM-based summarization (80-90% token reduction)
4. **Adaptive** - Intelligent strategy selection (best quality/compression ratio)

**Orchestration:** `CompressionEngine` manages strategies and target ratios

---

## Token Optimization

### Token Counter
- **Location:** `/packages/memory/src/utils/token-counter.ts`
- **Algorithms:** OpenAI, Claude, generic estimation
- **Features:** Cache, batch processing

### Token Budget Manager
- **Location:** `/packages/memory/src/context/token-budget.ts`
- **Allocation Breakdown:**
  - System Prompt: 10%
  - User Preferences: 15%
  - Recent Context: 30%
  - Semantic Memory: 25%
  - Episodic Memory: 15%
  - Response Reserve: 5%
- **Features:** Dynamic allocation, response reserve management

### Context Builder
- **Location:** `/packages/memory/src/context/context-builder.ts`
- **Purpose:** Build optimized context bundles respecting token budgets

---

## Importance & Relevance Scoring

**Location:** `/packages/memory/src/scoring/importance-scorer.ts`

**Scoring Components:**
1. Base Importance (0-1, user-defined or default)
2. Recency Score (exponential decay, configurable half-life)
3. Access Frequency (how often accessed)
4. Semantic Relevance (text similarity to query)
5. Scope Boost (user-scoped prioritized)

**Configuration:**
- Recency half-life: 7 days (default)
- Customizable weights per component

---

## Memory Decay & Forgetting

**Location:** `/packages/memory/src/utils/decay-manager.ts`

**Decay Mechanisms:**
- Time-based expiration (`expiresAt`)
- Importance-based decay (low importance fades faster)
- Access-based retention (frequently accessed persists)
- Configurable decay curves (linear, exponential, step)

**Decay Policies:**
- Per memory type (episodic, semantic, procedural, etc.)
- Per scope (session, thread, user, global)
- Grace period before first decay check
- Batch processing for efficiency

**Decay Results:**
- Actions: keep, compress, delete
- Decay scores (0 = fresh, 1 = fully decayed)
- Time-to-expiry calculations

---

## Embedding & Vector Storage

### Embedding Provider Interface
- **Location:** `/packages/memory/src/embeddings/embedding-provider.ts`
- **Methods:** `embedText()`, `embedBatch()`

### OpenAI Provider
- **Location:** `/packages/memory/src/embeddings/openai-provider.ts`
- **Model:** text-embedding-ada-002 (default)
- **Features:** Caching, retry logic, rate limiting

### Vector Search
- Namespace/collection support
- Metadata filtering
- Similarity scores

---

## React Integration

### Core Hooks

1. **useMemory**
   - **Location:** `/packages/memory/src/react/use-memory.ts`
   - **Returns:** Initialized memory service
   - **Operations:** Add, recall, context, stats

2. **useMemoryStore**
   - **Location:** `/packages/react/src/hooks/storage/use-memory-store.ts`
   - **Purpose:** High-level memory hook for ClarityChat
   - **Strategies:** sliding-window, semantic-chunks, vector-store
   - **API:** Simple add/query/clear

3. **useMemoryService**
   - **Location:** `/packages/react/src/utils/memory/hooks.ts`
   - **Purpose:** Service instance management

4. **useMemories**
   - **Location:** `/packages/react/src/utils/memory/hooks.ts`
   - **Purpose:** Memory retrieval with loading states

### Memory Provider
- **Location:** `/packages/react/src/memory/memory-provider.tsx`
- **Purpose:** React Context wrapper for MemoryService

---

## React Utilities

**Location:** `/packages/react/src/utils/memory/`

**Key Utilities:**
- `memory-service.ts` - 4-layer hybrid implementation
- `memory-buffer.ts` - Batching and auto-flush
- `build-context-bundle.ts` - Context assembly
- `compress-context.ts` - Context compression
- `token-optimized-context.ts` - Advanced token budget management
- `sliding-context-manager.ts` - Context window management
- `semantic-chunker.ts` - Semantic coherence preservation
- `prompt-compression.ts` - Compression pipelines
- `vector-store-adapter.ts` - Vector store adapter pattern
- `retrieve-memories.ts` - Low-level memory retrieval

---

## Documentation Locations

### Package Documentation
- **README:** `/packages/memory/README.md`
- **Getting Started:** `/packages/memory/GETTING_STARTED.md`
- **API Reference:** `/packages/memory/API.md`
- **Performance Guide:** `/packages/memory/PERFORMANCE.md`
- **Quick Reference:** `/packages/memory/QUICK_REFERENCE.md`
- **Setup Guide:** `/packages/memory/SETUP.md`
- **Critical Issues:** `/packages/memory/CRITICAL_ISSUES.md`

### Storybook Documentation
- **Location:** `/apps/storybook/stories/Advanced/Memory/`
- **Stories:**
  - MemoryInspector.stories.tsx
  - ContextManager.stories.tsx
  - ContextVisualizer.stories.tsx
  - KnowledgeBaseViewer.stories.tsx

### Examples
- **Location:** `/examples/memory-examples/`
- **Examples:**
  - Basic System (React)
  - Advanced System (Full features)
  - CLI Example
  - Next.js API Integration
  - Express.js Integration
  - Fastify Integration
  - Vanilla JavaScript (browser)

---

## Memory Flow Architecture

### 1. CAPTURE PHASE
```
User Input → MemoryService.add()
  ↓
Create MemoryItem
  ↓
Set type (episodic/semantic/procedural)
Set scope (session/thread/user/global)
  ↓
Calculate importance (base + recency + frequency)
  ↓
Generate embedding (if provider configured)
```

### 2. STORAGE PHASE
```
MemoryItem → Store Backend Selection
  ↓
Persist with metadata and embeddings
```

### 3. RETRIEVAL PHASE
```
Query → MemoryService.search()
  ↓
Apply filters → Semantic similarity → Score → Sort
  ↓
Return MemorySearchResult[]
```

### 4. CONTEXT OPTIMIZATION PHASE
```
Retrieved Memories → TokenOptimizer
  ↓
Apply budget → Compress → Build ContextBundle
```

### 5. DECAY PHASE
```
Periodic DecayManager.evaluate()
  ↓
Check age, importance, access frequency
  ↓
Decision: keep/compress/delete
```

---

## Key Integration Points

### With Chat Components
- `useMemoryStore()` provides memory config to ClarityChat
- Memory context automatically included in system prompt
- Token budget respects chat context window

### With Token Optimization
- Tightly integrated with token optimization
- Dynamic allocation based on context
- Quality gates and cost awareness

### With Streaming
- Memory updates during response
- Can be streamed or batched
- Non-blocking operations

---

## Critical Boundaries

### What Needs Investigation (Phase 1+):

1. **Silent Memory Writes**
   - Are memories written implicitly anywhere?
   - Are tool outputs auto-persisted?
   - Are streaming responses auto-memorized?

2. **Scope Confusion**
   - Are scopes used consistently?
   - Can users control scope explicitly?
   - Are default scopes appropriate?

3. **Privacy & Data Safety**
   - Can PII be accidentally persisted?
   - Are deletion semantics clear?
   - Is opt-in vs opt-out explicit?

4. **Streaming Interactions**
   - Do mid-stream memory writes occur?
   - Are aborted streams handled correctly?
   - Are retries/regenerates safe?

5. **API Clarity**
   - Are memory APIs intuitive?
   - Is configuration overwhelming?
   - Can it be used outside Clarity Chat easily?

---

**Phase 0 Status:** COMPLETE
**Next Phase:** Phase 1 - Full Indexing
