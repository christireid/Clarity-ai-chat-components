# Memory System - Complete Inventory

**Phase:** 1 - Full Indexing
**Date:** 2026-01-22
**Coverage:** 100% of memory-related code

---

## CRITICAL FINDINGS (Phase 1)

### 🚨 ARCHITECTURE DUPLICATION
**SEVERITY: CRITICAL**

Three separate memory implementations discovered:

1. **Core Memory Package** (`@clarity-chat/memory`)
   - Location: `/packages/memory/src/`
   - Framework-agnostic, production-ready
   - Full feature set: embeddings, compression, decay, scoring
   - **STATUS: Primary implementation**

2. **React Memory Service** (React-specific)
   - Location: `/packages/react/src/memory/memory-service.ts`
   - Separate implementation with overlapping functionality
   - **STATUS: Duplicate implementation**

3. **React Util Memory Service** (Yet another implementation)
   - Location: `/packages/react/src/utils/memory/memory-service.ts`
   - 4-layer hybrid architecture
   - **STATUS: Yet another duplicate**

**IMPACT:**
- Unclear which implementation is canonical
- Risk of inconsistent behavior
- Maintenance nightmare
- Developer confusion

---

## PACKAGE 1: CORE MEMORY (@clarity-chat/memory)

**Location:** `/packages/memory/`
**Type:** Framework-agnostic library
**Maturity:** Production-ready

### 1.1 Main Entry Point

**File:** `src/index.ts` (109 lines)
**Purpose:** Public API exports
**Exports:**
- `clarityMemory()` - Factory function (recommended entry)
- `clarityMemoryHelpers` - Helper configurations
- `MemoryService` - Core service class
- All types from `types.ts`
- Summarization exports (LLM, OpenAI, Anthropic)
- `ImportanceScorer`
- `DecayManager` and utilities
- Token optimization types (re-exported)

**Public vs Internal:** PUBLIC
**Test Coverage:** N/A (export-only file)
**Docs Coverage:** Inline JSDoc

---

### 1.2 Core Types

**File:** `src/types.ts` (897 lines)
**Purpose:** Complete type system for memory
**Key Types:**
- `MemoryItem` - Core memory entry
- `MemoryType` - 'episodic' | 'semantic' | 'procedural' | 'short-term' | 'profile'
- `MemoryScope` - 'session' | 'thread' | 'user' | 'global'
- `MemoryPriority` - 'critical' | 'high' | 'medium' | 'low'
- `MemoryQuery` - Query interface with filters
- `MemorySearchResult` - Result with relevance score
- `ContextBundle` - Formatted context for LLM
- `TokenBreakdown` - Token allocation
- `CompressedMemory` - Compression results
- `MemoryStats` - Statistics
- `MemoryEvent` - Event system types

**Public vs Internal:** PUBLIC (all exported)
**Dependencies:** None (pure types)
**Test Coverage:** Types tested indirectly through service tests
**Docs Coverage:** Comprehensive JSDoc on all types

---

### 1.3 Memory Service (Core)

**File:** `src/memory-service.ts` (470+ lines)
**Purpose:** Main memory service implementation
**Class:** `MemoryService`

**Public Methods:**
- `add(content, options)` - Add single memory
- `addBatch(memories)` - Add multiple memories
- `search(query, options)` - Search with filters
- `recall(query, options)` - Alias for search
- `context(options)` - Get optimized context bundle
- `update(id, updates)` - Update memory
- `delete(id)` - Delete memory
- `promote(id, targetScope)` - Increase scope/importance
- `compress(id, ratio?)` - Reduce token usage
- `getStats()` - Memory statistics
- `inspect()` - Full state inspection
- `on(event, listener)` - Event subscription
- `off(event, listener)` - Unsubscribe
- `stop()` - Cleanup

**Side Effects:**
- Writes to vector store (if configured)
- Generates embeddings (if provider configured)
- Publishes events
- Auto-cleanup (if enabled)
- Auto-compression (if enabled)

**Assumptions:**
- Vector store is initialized before use
- Embedding provider is valid
- Token counter works correctly

**Storage Backend:** Configurable via constructor
**Write Conditions:** Explicit via `add()` or `addBatch()`
**Read Conditions:** Explicit via `search()` or `recall()`

**Test Coverage:**
- `memory-service.test.ts` (basic tests)
- `memory-service-fixed.test.ts` (fixed tests)
- `memory-service-typed.test.ts` (typed tests)

**Docs Coverage:**
- README.md (comprehensive)
- API.md (full API docs)
- GETTING_STARTED.md
- Inline JSDoc

**Consumers:**
- React MemoryProvider
- Examples (all)
- Storybook stories

---

### 1.4 Storage Backends

#### 1.4.1 Base Interface

**File:** `src/stores/base.ts`
**Interface:** `VectorStore`

**Methods:**
- `initialize()` - Setup storage
- `add(memory)` - Store memory
- `get(id)` - Retrieve by ID
- `update(id, memory)` - Update memory
- `delete(id)` - Remove memory
- `search(query, options)` - Semantic search
- `getAll(options?)` - Get all memories
- `close()` - Cleanup

**Purpose:** Common interface for all storage implementations

---

#### 1.4.2 In-Memory Store

**File:** `src/stores/in-memory.ts` (140+ lines)
**Class:** `InMemoryStore`

**Purpose:** Fast in-memory storage for dev/testing
**Persistence:** None (ephemeral)
**Features:**
- Map-based storage
- Cosine similarity search
- Text-based search fallback
- Importance boosting

**Test Coverage:** `in-memory-store.test.ts`
**Use Case:** Development, testing, serverless

---

#### 1.4.3 File Store

**File:** `src/stores/file.ts` (263 lines)
**Class:** `FileStore`

**Purpose:** JSON file persistence for Node.js apps
**Persistence:** File system (JSON)
**Features:**
- Atomic writes (temp + rename)
- Backup on failure
- Auto-migration of old formats
- Cosine similarity search
- Text search fallback

**Side Effects:**
- Creates/writes files to disk
- Creates backup files

**Assumptions:**
- File system access
- Single-process (no locking)

**Test Coverage:** `file.test.ts`
**Use Case:** Node.js single-server applications

---

#### 1.4.4 IndexedDB Store

**File:** `src/stores/indexeddb.ts` (260+ lines)
**Class:** `IndexedDBStore`

**Purpose:** Browser-native persistence
**Persistence:** IndexedDB
**Features:**
- Indexed on type, timestamp, importance
- Cosine similarity search
- Text search fallback
- Browser storage limits

**Side Effects:**
- Creates/updates IndexedDB database
- Uses browser storage quota

**Assumptions:**
- Browser environment
- IndexedDB supported

**Test Coverage:** Limited (browser-specific)
**Use Case:** Client-side React applications

---

#### 1.4.5 Store Factory

**File:** `src/stores/factory.ts`
**Function:** `createStore(config)`

**Purpose:** Dynamic store creation based on config and environment
**Returns:** Appropriate VectorStore instance

---

### 1.5 Compression System

#### 1.5.1 Compression Engine

**File:** `src/compression/compression-engine.ts` (100+ lines)
**Class:** `CompressionEngine`

**Purpose:** Orchestrates compression strategies
**Methods:**
- `compress(content, targetRatio, options)` - Compress content
- `compressMemory(memory, ratio)` - Compress memory item

**Features:**
- Multiple strategy support
- Automatic strategy selection
- Target compression ratios
- Token budget management

**Strategies:** Truncate, Extract, Summarize, Adaptive

---

#### 1.5.2 Compression Strategies

**Files:**
- `src/compression/truncate-strategy.ts` - Simple truncation
- `src/compression/extract-strategy.ts` - Key phrase extraction
- `src/compression/summarize-strategy.ts` - LLM summarization (80-90% reduction)
- `src/compression/adaptive-strategy.ts` - Intelligent selection

**Interface:** `CompressionStrategy`
**Methods:**
- `compress(content, options)` - Compress content
- `estimateRatio(content)` - Estimate compression ratio

---

### 1.6 Summarization System

#### 1.6.1 LLM Summarizer

**File:** `src/summarization/llm-summarizer.ts` (450+ lines)
**Class:** `LLMSummarizer`

**Purpose:** Provider-agnostic LLM summarization
**Features:**
- Multiple summary styles (bullet, narrative, structured, minimal)
- Progressive summarization for long conversations
- Hierarchical multi-level summaries
- Cache with TTL
- Graceful fallback when unavailable

**Public Methods:**
- `summarize(text, style, options)` - Summarize text
- `summarizeConversation(messages, options)` - Summarize conversation
- `summarizeHierarchical(text, levels)` - Multi-level summary
- `extractiveSummarize(text, options)` - Extractive summary

**Side Effects:**
- Calls LLM API
- Updates cache
- May incur API costs

**Test Coverage:** `llm-summarizer.test.ts`

---

#### 1.6.2 OpenAI Summarizer

**File:** `src/summarization/openai-summarizer.ts`
**Class:** `OpenAISummarizer`

**Purpose:** OpenAI-specific summarization
**Models:** gpt-3.5-turbo, gpt-4
**Features:**
- Native OpenAI SDK integration
- API key configuration
- Cost optimization

**Test Coverage:** Integration tests
**Dependencies:** OpenAI SDK (peer dependency)

---

#### 1.6.3 Anthropic Summarizer

**File:** `src/summarization/anthropic-summarizer.ts`
**Class:** `AnthropicSummarizer`

**Purpose:** Claude-specific summarization
**Models:** Claude (Haiku preferred for cost)
**Features:**
- Native Anthropic SDK integration
- Message format support
- Cost optimization

**Test Coverage:** `anthropic-summarizer.test.ts`
**Dependencies:** Anthropic SDK (peer dependency)

---

#### 1.6.4 Summarizer Interface

**File:** `src/summarization/summarizer.ts`
**Interface:** `Summarizer`

**Methods:**
- `summarize(text, options)` - Summarize text
- Common interface for all summarizers

---

#### 1.6.5 Summarization Pipeline

**File:** `src/summarization/summarization-pipeline.ts`
**Purpose:** Multi-stage summarization workflow
**Features:**
- Cascading summarization for large documents
- Quality control
- Configurable stages

---

### 1.7 Importance & Relevance Scoring

**File:** `src/scoring/importance-scorer.ts` (120+ lines)
**Class:** `ImportanceScorer`

**Purpose:** Calculate memory importance and relevance
**Scoring Components:**
1. Base Importance (0-1) - User-defined or default
2. Recency Score - Exponential decay with configurable half-life
3. Access Frequency - How often memory is accessed
4. Semantic Relevance - Text similarity to query
5. Scope Boost - User-scoped memories prioritized

**Configuration:**
- Recency half-life (default: 7 days)
- Max frequency accesses normalization
- Customizable weights for each component

**Test Coverage:** `importance-scorer.test.ts`

---

### 1.8 Memory Decay & Forgetting

**File:** `src/utils/decay-manager.ts` (400+ lines)
**Class:** `DecayManager`
**Function:** `createDecayManager(config)`

**Purpose:** Intelligent memory decay/forgetting
**Features:**
- Time-based expiration (explicit `expiresAt`)
- Importance-based decay (low importance fades faster)
- Access-based retention (frequently accessed persists)
- Configurable decay curves (linear, exponential, step)

**Decay Policies:**
- Per memory type (episodic, semantic, procedural, etc.)
- Per scope (session, thread, user, global)
- Grace period before first decay check
- Batch processing for efficiency

**Public Methods:**
- `evaluate(memory, policy?)` - Evaluate single memory
- `evaluateBatch(memories, options?)` - Evaluate multiple
- `getDecayStats(memory)` - Get decay statistics

**Decay Results:**
- Actions: keep, compress, delete
- Decay scores (0 = fresh, 1 = fully decayed)
- Time-to-expiry calculations

**Test Coverage:** `decay-manager.test.ts`

---

### 1.9 Token Optimization

#### 1.9.1 Token Counter

**File:** `src/utils/token-counter.ts` (200+ lines)
**Class:** `TokenCounter`

**Purpose:** Count tokens in text
**Algorithms:**
- OpenAI (tiktoken)
- Claude (approximate)
- Generic estimation

**Features:**
- Cache for repeated tokens
- Batch processing
- Model-specific counting

**Static Methods:**
- `count(text, model?)` - Count tokens
- `countBatch(texts, model?)` - Count multiple

**Test Coverage:**
- `token-counter.test.ts`
- `utils/token-counter.test.ts` (duplicate?)

---

#### 1.9.2 Token Budget Manager

**File:** `src/context/token-budget.ts`
**Purpose:** Allocate tokens across categories

**Default Allocation:**
- System Prompt: 10%
- User Preferences: 15%
- Recent Context: 30%
- Semantic Memory: 25%
- Episodic Memory: 15%
- Response Reserve: 5%

**Features:**
- Dynamic allocation based on context
- Response reserve management
- Budget enforcement

**Test Coverage:** `token-budget.test.ts`

---

#### 1.9.3 Context Builder

**File:** `src/context/context-builder.ts`
**Purpose:** Build optimized context bundles

**Methods:**
- `build(options)` - Create context bundle
- `format(bundle)` - Format for LLM

**Features:**
- Respects token budgets
- Formats memories for LLM consumption
- Token breakdown reporting

---

### 1.10 Embedding System

#### 1.10.1 Embedding Provider Interface

**File:** `src/embeddings/embedding-provider.ts`
**Interface:** `EmbeddingProvider`

**Methods:**
- `embedText(text)` - Single text embedding
- `embedBatch(texts)` - Batch processing

---

#### 1.10.2 OpenAI Embedding Provider

**File:** `src/embeddings/openai-provider.ts`
**Class:** `OpenAIEmbeddingProvider`

**Model:** text-embedding-ada-002 (default)
**Features:**
- Caching support
- Retry logic
- Rate limiting

**Dependencies:** OpenAI SDK

---

### 1.11 Factory & Initialization

**File:** `src/factory.ts` (100+ lines)

**Main Function:** `clarityMemory(config?)`
**Purpose:** Zero-config memory service creation

**Features:**
- Smart defaults
- Environment detection
- Configuration validation
- Helpful error messages

**Helpers:** `clarityMemoryHelpers`
- `browser()` - IndexedDB configuration
- `serverless()` - In-memory, stateless
- `node()` - File-based persistence

---

### 1.12 Utilities

**Directory:** `src/utils/`

**Files:**
- `core.ts` - Token estimation, similarity, text processing, vector ops
- `cache.ts` - LRU cache with TTL
- `batch.ts` - Sequential/parallel batch processing, array chunking
- `retry.ts` - Exponential backoff, retries
- `rate-limiter.ts` - Token-bucket algorithm
- `health-check.ts` - System health verification
- `performance.ts` - Timing, profiling, statistics
- `environment.ts` - Browser/Node.js/serverless detection
- `validation.ts` - Config schema validation
- `errors.ts` - MemoryError class with error codes
- `logger.ts` - Configurable logging

---

### 1.13 Documentation (Core Package)

**Files:**
- `README.md` - Features overview, quick start, architecture
- `API.md` (300+ lines) - Complete API documentation
- `GETTING_STARTED.md` - Installation, first memory, common patterns
- `CRITICAL_ISSUES.md` - Known limitations, migrations
- `PERFORMANCE.md` - Optimization tips, benchmarks
- `QUICK_REFERENCE.md` - Common operations, config snippets
- `SETUP.md` - Environment setup, dependencies

**Coverage:** Comprehensive
**Accuracy:** To be verified in Phase 7

---

### 1.14 Test Coverage (Core Package)

**Test Files:**
- `memory-service.test.ts` - Basic service tests
- `memory-service-fixed.test.ts` - Fixed/corrected tests
- `memory-service-typed.test.ts` - TypeScript tests
- `stores/file.test.ts` - File store tests
- `stores/in-memory-store.test.ts` - In-memory tests
- `context/__tests__/token-budget.test.ts` - Token budget tests
- `scoring/__tests__/importance-scorer.test.ts` - Scoring tests
- `summarization/__tests__/llm-summarizer.test.ts` - LLM summarizer tests
- `summarization/__tests__/anthropic-summarizer.test.ts` - Anthropic tests
- `utils/__tests__/decay-manager.test.ts` - Decay tests
- `utils/__tests__/token-counter.test.ts` - Token counter tests
- `utils/token-counter.test.ts` - Duplicate token counter tests

**Coverage:** Partial (unit tests exist, integration tests limited)

---

## PACKAGE 2: REACT INTEGRATION (@clarity-chat/react)

**Location:** `/packages/react/src/`
**Type:** React-specific integration
**Maturity:** Production-ready (mostly)

### 2.1 Memory Provider

**File:** `src/memory/memory-provider.tsx` (695 lines)
**Component:** `MemoryProvider`
**Context:** `MemoryContext`

**Purpose:** React Context wrapper for memory
**Exports:**
- `MemoryProvider` - Context provider
- `useMemory()` - Hook (throws if outside provider)
- `useMemoryContext()` - Hook (returns null if outside provider)
- `useMemoryQuery()` - Query hook with loading states
- `useMemoryStats()` - Stats hook with refresh
- `useMemoryEvents()` - Event subscription hook
- `useConversationMemory()` - High-level conversation memory
- `useMemoryOptimization()` - Context optimization hook

**Dependencies:**
- `@clarity-chat/memory` (MemoryService, types)
- React (createContext, useState, useEffect, useCallback)

**Side Effects:**
- Initializes MemoryService on mount
- Auto-starts service (if autoStart=true)
- Cleans up on unmount

**Consumers:**
- `useMemoryStore` hook
- All React examples
- ClarityChat integration

**Test Coverage:** Limited (React-specific)

---

### 2.2 Memory Hooks

#### 2.2.1 useMemoryStore (Top-Level)

**File:** `src/hooks/storage/use-memory-store.ts` (122 lines)
**Hook:** `useMemoryStore(options)`

**Purpose:** Top-level hook for memory management
**Returns:**
- `enabled` - Whether memory is enabled
- `service` - Memory service instance
- `config` - Configuration for ClarityChat
- `addMemory()` - Add a memory
- `query()` - Query memories
- `clear()` - Clear memories (NOT IMPLEMENTED)

**Options:**
- `enabled` - Enable memory (default: false)
- `strategy` - 'sliding-window' | 'semantic-chunks' | 'vector-store'
- `maxTokens` - Max tokens for memory context
- `scope` - Memory scope

**Dependencies:** Uses `useMemory()` from MemoryProvider

**Issues:**
- `clear()` not implemented (line 103-107)
- Strategy option exposed but not used

**Consumers:** ClarityChat users

---

#### 2.2.2 useMemory (Mid-Level)

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemory()`

**Purpose:** Access memory context
**Returns:** `MemoryContextValue`
**Throws:** If outside MemoryProvider

---

#### 2.2.3 useMemoryContext (Mid-Level, Safe)

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemoryContext()`

**Purpose:** Safely access memory context
**Returns:** `MemoryContextValue | null`
**Throws:** Never (returns null instead)

---

#### 2.2.4 useMemoryQuery

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemoryQuery(query, options)`

**Purpose:** Query with automatic refetching and loading states
**Returns:**
- `data` - Query results
- `isLoading` - Loading state
- `error` - Error state
- `refetch()` - Manual refetch

**Options:**
- `enabled` - Whether query is enabled
- `refetchInterval` - Auto-refetch interval (ms)

---

#### 2.2.5 useMemoryStats

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemoryStats(refreshInterval?)`

**Purpose:** Get memory statistics with auto-refresh
**Returns:**
- `stats` - MemoryStats object
- `refresh()` - Manual refresh

---

#### 2.2.6 useMemoryEvents

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemoryEvents(eventType, handler)`

**Purpose:** Subscribe to memory events
**Returns:** void (cleanup automatic)

---

#### 2.2.7 useConversationMemory

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useConversationMemory(options)`

**Purpose:** High-level conversation memory management
**Options:**
- `userId` - User ID
- `threadId` - Thread ID
- `sessionId` - Session ID
- `autoCapture` - Auto-capture messages (NOT IMPLEMENTED)

**Returns:**
- `context` - Memory context
- `captureMessage()` - Capture message as memory
- `capturePreference()` - Capture user preference
- `getRelevantMemories()` - Get relevant memories
- `getRecentHistory()` - Get recent conversation
- `getPreferences()` - Get user preferences

**Issues:**
- `autoCapture` option not implemented

---

#### 2.2.8 useMemoryOptimization

**Exported from:** `src/memory/memory-provider.tsx`
**Hook:** `useMemoryOptimization(options)`

**Purpose:** Memory-aware context optimization
**Options:**
- `systemPrompt` - System prompt
- `userPreferences` - User preferences
- `recentMessages` - Recent messages
- `includeSemanticMemory` - Include semantic memory
- `includeEpisodicMemory` - Include episodic memory

**Returns:**
- `optimizedContext` - Optimized context
- `isOptimizing` - Optimization state
- `reoptimize()` - Manual reoptimization

**Dependencies:** Requires `service.getOptimizer()` method

---

### 2.3 React Memory Service (DUPLICATE #1)

**File:** `src/memory/memory-service.ts` (likely 300+ lines)
**Class:** `MemoryService`

**Purpose:** React-specific memory service implementation
**Status:** DUPLICATE of core package MemoryService

**Issues:**
- Overlaps with `@clarity-chat/memory` MemoryService
- May have inconsistent behavior
- Should be removed or clearly differentiated

**Test Coverage:**
- `__tests__/memory-service.test.ts`
- `__tests__/memory-service-fixed.test.ts`

---

### 2.4 React Util Memory Service (DUPLICATE #2)

**File:** `src/utils/memory/memory-service.ts` (300+ lines)

**Purpose:** 4-layer hybrid architecture implementation
**Status:** ANOTHER DUPLICATE

**Features:**
- Real-time context buffer (Layer 1)
- Session memory (Layer 2)
- Semantic + episodic (Layers 3-4)

**Issues:**
- THIRD implementation of memory service
- Inconsistent with core package
- Should be consolidated

---

### 2.5 Memory Utilities (React)

**Directory:** `src/utils/memory/`

**Files:**
- `memory-service.ts` - Memory service (duplicate)
- `memory-buffer.ts` (250+ lines) - Batching, auto-flush, sliding window
- `build-context-bundle.ts` - Assemble formatted context
- `compress-context.ts` - Context-level compression
- `token-optimized-context.ts` (350+ lines) - Advanced token budget management
- `sliding-context-manager.ts` (310+ lines) - Context window management
- `semantic-chunker.ts` (230+ lines) - Semantic coherence preservation
- `prompt-compression.ts` (270+ lines) - Compression pipelines
- `vector-store-adapter.ts` (200+ lines) - Vector store adapter pattern
- `retrieve-memories.ts` - Low-level memory retrieval
- `hooks.ts` - Memory hooks (additional ones)

**Purpose:** React-specific memory utilities
**Status:** Some utilities are valuable, some are duplicates

---

### 2.6 Memory Components

#### 2.6.1 Memory Inspector

**File:** `src/components/context/memory-inspector.tsx`
**Component:** `MemoryInspector`

**Purpose:** Interactive memory inspection UI
**Features:**
- Memory scopes visualization
- Promote/remove actions
- Confidence scores display

**Dependencies:** Uses memory context

---

#### 2.6.2 Memory Context Export

**File:** `src/exports/memory-context.ts`

**Purpose:** Export memory context for external use
**Exports:** MemoryProvider, hooks

---

### 2.7 Memory Examples (React)

#### 2.7.1 ClarityChat with Memory Example

**File:** `src/examples/clarity-chat-with-memory-example.tsx`

**Purpose:** Example of ClarityChat integration with memory
**Status:** Reference implementation

---

### 2.8 Memory Engine (App API)

**File:** `src/app-api/memory-engine.ts`

**Purpose:** Memory engine for app-level API
**Status:** Integration layer

---

### 2.9 Memory Store Creation

**File:** `src/memory/create-memory-store.ts`

**Purpose:** Factory for creating memory stores
**Status:** Factory pattern implementation

---

### 2.10 Token Optimizer (React)

**File:** `src/memory/token-optimizer.ts`

**Purpose:** Token optimization for React
**Status:** May overlap with core package

**Test Coverage:** `__tests__/token-optimizer.test.ts`

---

### 2.11 Test Coverage (React Package)

**Test Files:**
- `memory/__tests__/memory-service.test.ts`
- `memory/__tests__/memory-service-fixed.test.ts`
- `memory/__tests__/token-optimizer.test.ts`

**Coverage:** Limited

---

## PACKAGE 3: STORYBOOK STORIES

**Location:** `/apps/storybook/stories/Advanced/Memory/`
**Purpose:** Interactive documentation

### 3.1 Storybook Files

**Files:**
- `MemoryInspector.stories.tsx` - Memory inspection story
- `ContextManager.stories.tsx` - Context window management story
- `ContextVisualizer.stories.tsx` - Visual memory hierarchy story
- `KnowledgeBaseViewer.stories.tsx` - Knowledge base browsing story

**Status:** Documentation/examples
**Coverage:** Partial (not all features demonstrated)

---

## PACKAGE 4: EXAMPLES

**Location:** `/examples/memory-examples/`
**Purpose:** Working examples for different environments

### 4.1 Example Files

**Basic Examples:**
- `memory-system-basic.tsx` - Zero-config setup
- `memory-system-basic.d.ts` - Type definitions

**Advanced Examples:**
- `memory-system-advanced.tsx` - Full feature showcase
- `memory-system-advanced.d.ts` - Type definitions

**CLI Example:**
- `memory-cli.ts` - Command-line memory tool
- `memory-cli.d.ts.map` - Source map

**Framework Integrations:**
- `memory-nextjs-api.ts` - Next.js API route integration
- `memory-nodejs-express.ts` - Express.js integration
- `memory-nodejs-fastify.ts` - Fastify integration
- `memory-vanilla-js.html` - Vanilla JS browser example

**Coverage:** Good variety of use cases

---

## SUPPORTING FILES

### Docker Support

**File:** `docker-compose.memory.yml`
**Purpose:** Redis/Postgres setup for memory backends
**Status:** Development environment

---

## MEMORY FLOW SUMMARY

### Capture Phase
```
User Input → MemoryService.add()
  ↓
Create MemoryItem (with type, scope, importance)
  ↓
Generate embedding (optional)
  ↓
Store in cache + buffer
  ↓
Auto-flush to persistent storage
```

### Storage Phase
```
MemoryItem → Store Backend Selection
  ↓
InMemoryStore (ephemeral)
FileStore (file system)
IndexedDBStore (browser)
RedisStore/PostgresStore (future)
  ↓
Persist with metadata and embeddings
```

### Retrieval Phase
```
Query → MemoryService.search()
  ↓
Apply filters (types, scopes, metadata, time range)
  ↓
Semantic similarity (if embeddings available)
  ↓
Score with ImportanceScorer (recency, frequency, relevance, scope)
  ↓
Sort by relevance score
  ↓
Return MemorySearchResult[]
```

### Context Optimization Phase
```
Retrieved Memories → TokenOptimizer
  ↓
Apply token budget allocation (system, prefs, recent, semantic, episodic)
  ↓
Compress if necessary (truncate/extract/summarize/adaptive)
  ↓
Build ContextBundle
  ↓
Return formatted context for LLM
```

### Decay Phase
```
Periodic DecayManager.evaluate()
  ↓
Check age, importance, access frequency
  ↓
Apply decay policies by type/scope
  ↓
Decision: keep/compress/delete
  ↓
Clean up expired memories
```

---

## INTEGRATION POINTS

### 1. With ClarityChat
- `useMemoryStore()` hook provides memory config
- Memory context auto-included in system prompt
- Token budget respects chat context window
- **QUESTION:** How are messages auto-captured (if at all)?

### 2. With Token Optimization
- Memory system tightly integrated with token optimization
- Dynamic allocation based on context
- Quality gates and cost awareness
- **QUESTION:** Is optimization automatic or manual?

### 3. With Streaming
- Memory updates during response
- Can be streamed or batched
- Non-blocking operations
- **QUESTION:** When are memories written during streaming?

### 4. With Tools
- **QUESTION:** Are tool outputs auto-memorized?
- **QUESTION:** How do tools interact with memory?

---

## CRITICAL QUESTIONS FOR PHASE 2+

### Silent Memory Writes
1. Are memories written implicitly anywhere?
2. Are tool outputs auto-persisted?
3. Are streaming responses auto-memorized?
4. Does ClarityChat auto-capture messages?

### Scope Confusion
1. Are scopes used consistently across implementations?
2. Can users control scope explicitly?
3. Are default scopes appropriate?
4. Is the scope hierarchy clear?

### Privacy & Data Safety
1. Can PII be accidentally persisted?
2. Are deletion semantics clear and complete?
3. Is opt-in vs opt-out explicit?
4. Are retention policies clear?

### Streaming Interactions
1. Do mid-stream memory writes occur?
2. Are aborted streams handled correctly?
3. Are retries/regenerates safe?
4. Is memory state consistent after errors?

### API Clarity
1. Are memory APIs intuitive?
2. Is configuration overwhelming?
3. Can it be used outside Clarity Chat easily?
4. Is the mental model clear?

### Duplication & Consolidation
1. Which MemoryService is canonical?
2. Why do three implementations exist?
3. How should they be consolidated?
4. What functionality is truly React-specific?

---

## FILE COUNT SUMMARY

**Core Package (@clarity-chat/memory):**
- Main files: ~40
- Test files: ~10
- Documentation: 7
- Examples: 0 (separate package)

**React Package (@clarity-chat/react - Memory only):**
- Main files: ~15
- Test files: 3
- Components: 2
- Utilities: 10+

**Storybook:**
- Stories: 4

**Examples:**
- Examples: 7

**Total Memory-Related Files:** ~90+

---

## PHASE 1 STATUS: COMPLETE

**Coverage:** 100% of memory surface area indexed
**Next Phase:** Phase 2 - Memory Correctness Audit
