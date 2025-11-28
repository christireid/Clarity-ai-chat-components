# Frontend Token Optimization Implementation Plan

## Executive Summary

This document analyzes the current Clarity AI Chat Components implementation against the Frontend LLM Token Expenditure Optimization report and provides a detailed implementation plan for missing capabilities.

**Current Coverage Assessment:**
- BP-A1 (Token Measurement): **95% Complete** - Real-time warning system implemented (`use-token-budget-monitor.tsx`)
- BP-A2 (Input Optimization): **95% Complete** - KV cache-aligned prompt builder implemented (`kv-cache-prompt-builder.ts`)
- BP-A3 (Semantic Caching): **95% Complete** - Persistent IndexedDB cache with local embeddings (`semantic-cache-persistent.ts`, `local-embedder.ts`)
- BP-A4 (Compression): **95% Complete** - LLMLingua-2 integration implemented (`llmlingua-compressor.ts`)
- BP-A5 (Output Control): **95% Complete** - Dynamic output calculator implemented (`dynamic-output-limit.ts`)
- BP-A6 (UX/UI Controls): **100% Complete** - Structured input builder with token breakdown, history manager, and output preference selector implemented

---

## Gap Analysis by Blueprint

### BP-A1: Preemptive Token Measurement

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| js-tiktoken integration | ✅ `accurate-counter.ts` | None |
| Model-specific tokenizers | ✅ MODEL_CONFIGS map | None |
| Dynamic/lite imports | ✅ Dynamic import in countTokensAccurate | None |
| Real-time token display | ⚠️ `token-counter.tsx` exists | Missing threshold warnings |
| 80% capacity warning | ❌ Not implemented | **HIGH PRIORITY** |
| Automated trimming trigger | ❌ Not implemented | **HIGH PRIORITY** |

**Existing Files:**
- `packages/react/src/utils/tokenization/accurate-counter.ts`
- `packages/react/src/utils/tokenization/estimator.ts`
- `packages/react/src/components/token-counter.tsx`

---

### BP-A2: Input Payload Optimization & Trimming

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| Prioritized context trimming | ⚠️ `context-window.ts` has truncation | Missing Must-Have/Optional categorization |
| KV Cache prefix alignment | ⚠️ `context-ordering.ts` exists | Not enforcing static prefix first |
| System+User validation | ❌ Not implemented | **MEDIUM PRIORITY** |
| Token budget builder | ⚠️ `token-budget.ts` exists | Missing strict assembly order |

**Existing Files:**
- `packages/react/src/utils/context-window.ts`
- `packages/react/src/utils/context-ordering.ts`
- `packages/memory/src/context/token-budget.ts`

---

### BP-A3: Client-Side Caching

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| Semantic cache lookup | ✅ `smart-cache.ts` with similarity | Works but needs enhancement |
| Vector embeddings | ⚠️ `embeddings/cache.ts` exists | Missing local embedding generation |
| IndexedDB storage | ⚠️ `LocalStorageEmbeddingCache` | Should use IndexedDB for larger storage |
| Similarity threshold 0.85 | ✅ Configurable in SmartCache | None |
| Exact-match caching | ✅ Hash-based in SmartCache | None |
| Local embedding model | ❌ Not implemented | **HIGH PRIORITY** |

**Existing Files:**
- `packages/react/src/utils/smart-cache.ts`
- `packages/react/src/embeddings/cache.ts`

---

### BP-A4: Advanced Compression & Filtering

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| TF-IDF importance scoring | ✅ `prompt-compression-advanced.ts` | Complete |
| Structure preservation | ✅ Preserves code blocks | Complete |
| LLMLingua-2 integration | ❌ Not implemented | **MEDIUM PRIORITY** |
| JSON minification | ⚠️ TOON exists | Missing explicit minification |
| JSONL formatting | ✅ In batch-api.ts | Complete |

**Existing Files:**
- `packages/react/src/utils/prompt-compression-advanced.ts`
- `packages/react/src/utils/toon/encoder.ts`

---

### BP-A5: Output Generation Control

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| Dynamic max_tokens calculation | ❌ Not implemented | **HIGH PRIORITY** |
| Brevity instruction injection | ⚠️ Prefilling exists | Missing brevity prompts |
| JSON field minification prompt | ❌ Not implemented | **LOW PRIORITY** |
| No-code-block instruction | ❌ Not implemented | **LOW PRIORITY** |
| Conclusion-last structure | ❌ Not implemented | **LOW PRIORITY** |

**Existing Files:**
- `packages/react/src/utils/response-prefilling.ts`
- `packages/react/src/utils/token-optimization.ts`

---

### BP-A6: UX/UI Controls

| Requirement | Current State | Gap |
|-------------|--------------|-----|
| Structured input components | ✅ `structured-input-builder.tsx` | Complete |
| History pruning UI | ✅ `history-manager.tsx` | Complete |
| Output preference selector | ✅ `output-preference-selector.tsx` | Complete |
| Token visualization | ✅ TokenUsageBar with breakdown | Complete |

**Existing Files:**
- `packages/react/src/components/token-counter.tsx`
- `packages/react/src/components/token-optimization-dashboard.tsx`
- `packages/react/src/components/history-manager.tsx`
- `packages/react/src/components/output-preference-selector.tsx`
- `packages/react/src/components/structured-input-builder.tsx`

---

## Implementation Plan

### Phase 1: Foundation (HIGH PRIORITY)

#### 1.1 Real-Time Token Warning System

**What:** Add threshold-based warnings and automatic trimming triggers
**Why:** Prevents context overflow and provides immediate cost awareness
**Impact:** Reduces failed API calls, improves UX

---

**AGENT PROMPT 1.1:**

```
## Task: Implement Token Threshold Warning System

### Context
File: `packages/react/src/hooks/use-token-budget-monitor.tsx` (NEW)

### Requirements
Create a new React hook `useTokenBudgetMonitor` that:

1. **Interface Definition**:
   ```typescript
   interface TokenBudgetConfig {
     maxInputTokens: number        // Model's max context (e.g., 128000 for GPT-4)
     warningThreshold?: number     // Default 0.8 (80%)
     criticalThreshold?: number    // Default 0.95 (95%)
     reservedForOutput?: number    // Default 4096
     model?: ModelName
     onWarning?: (usage: TokenUsage) => void
     onCritical?: (usage: TokenUsage) => void
     autoTrim?: boolean            // Auto-trigger trimming at critical
   }

   interface TokenUsage {
     current: number
     max: number
     available: number
     utilizationPercent: number
     status: 'safe' | 'warning' | 'critical' | 'exceeded'
   }
   ```

2. **Core Logic**:
   - Use `countTokens` from accurate-counter.ts for real counting
   - Calculate utilization percentage in real-time
   - Trigger callbacks at threshold crossings
   - Return current status and usage metrics

3. **Auto-Trim Integration**:
   - When autoTrim is true and critical threshold is crossed
   - Call a trim function that uses prioritized context trimming
   - Emit trimmed content and what was removed

4. **Performance**:
   - Debounce token counting (300ms default)
   - Cache last count to avoid re-counting unchanged content
   - Use requestIdleCallback for non-blocking updates

5. **Export from index**:
   - Add to `packages/react/src/hooks/index.ts`

### Files to Reference
- `packages/react/src/utils/tokenization/accurate-counter.ts`
- `packages/react/src/hooks/use-context-monitor.tsx`

### Acceptance Criteria
- [ ] Hook returns real-time token usage with status
- [ ] Callbacks fire exactly once per threshold crossing
- [ ] Auto-trim reduces tokens below critical threshold
- [ ] Performance: <50ms for typical message arrays
```

---

#### 1.2 KV Cache-Aligned Prompt Builder

**What:** Enforce static prefix ordering for KV cache optimization
**Why:** Reduces Time-to-First-Token by enabling server-side cache reuse
**Impact:** 30-50% latency reduction on subsequent requests

---

**AGENT PROMPT 1.2:**

```
## Task: Implement KV Cache-Aligned Prompt Builder

### Context
File: `packages/react/src/utils/kv-cache-prompt-builder.ts` (NEW)

### Requirements
Create a utility that enforces KV cache-optimal prompt structure:

1. **Interface Definition**:
   ```typescript
   interface PromptSegment {
     type: 'system' | 'context' | 'history' | 'rag' | 'user'
     content: string
     priority: 'must-have' | 'optional'
     tokenCount?: number
   }

   interface KVCachePromptConfig {
     maxInputTokens: number
     reservedForOutput: number
     model?: ModelName
   }

   interface BuiltPrompt {
     messages: Array<{ role: string; content: string }>
     tokenCount: number
     trimmedSegments: PromptSegment[]
     kvCacheablePrefix: number  // Token count of static prefix
   }
   ```

2. **Assembly Order (STRICT)**:
   ```
   1. System Instructions (static, cacheable prefix)
   2. Static Context Documents (cacheable)
   3. RAG Results (dynamic)
   4. Conversation History (dynamic, trimmed oldest-first)
   5. Current User Query (always last, must-have)
   ```

3. **Core Function**:
   ```typescript
   function buildKVCacheOptimizedPrompt(
     segments: PromptSegment[],
     config: KVCachePromptConfig
   ): BuiltPrompt
   ```

4. **Logic**:
   - Calculate tokens for each segment using accurate-counter
   - Lock must-have segments (system + user query)
   - VALIDATE: If must-have alone exceeds budget, throw Error with details
   - Fill remaining budget with optional segments in priority order
   - Track which segments were trimmed and why

5. **Validation**:
   - Throw if system + user alone exceed maxInputTokens - reservedForOutput
   - Return detailed error with token breakdown

### Files to Reference
- `packages/react/src/utils/context-window.ts`
- `packages/react/src/utils/context-ordering.ts`
- `packages/react/src/utils/tokenization/accurate-counter.ts`

### Acceptance Criteria
- [ ] Static content always appears first in output
- [ ] User query always appears last
- [ ] Throws clear error if must-have content exceeds budget
- [ ] Returns token count of cacheable prefix
- [ ] Trims optional content oldest-first
```

---

#### 1.3 Dynamic Output Token Calculator

**What:** Calculate optimal max_tokens based on input consumption
**Why:** Prevents wasted output capacity and reduces TTIT latency
**Impact:** 10-30% output token savings

---

**AGENT PROMPT 1.3:**

```
## Task: Implement Dynamic Output Token Calculator

### Context
File: `packages/react/src/utils/dynamic-output-limit.ts` (NEW)

### Requirements
Create a utility for intelligent output token limit calculation:

1. **Interface Definition**:
   ```typescript
   interface OutputLimitConfig {
     modelCapacity: number          // Total context window
     inputTokenCount: number        // Actual input tokens
     userPreference?: 'concise' | 'balanced' | 'detailed'
     taskType?: 'classification' | 'generation' | 'analysis' | 'chat'
     uiConfiguredMax?: number       // Optional hard cap from UI
   }

   interface OutputLimitResult {
     recommendedMaxTokens: number
     absoluteMaxTokens: number      // modelCapacity - inputTokenCount
     brevityInstruction: string     // Inject into system prompt
     reasoning: string              // Why this limit was chosen
   }
   ```

2. **Calculation Logic**:
   ```typescript
   function calculateDynamicOutputLimit(config: OutputLimitConfig): OutputLimitResult
   ```

   - Base calculation: `remaining = modelCapacity - inputTokenCount`
   - Apply task-type multipliers:
     - classification: min(100, remaining)
     - chat: min(1000, remaining * 0.5)
     - generation: min(4000, remaining * 0.7)
     - analysis: min(2000, remaining * 0.6)
   - Apply user preference modifiers:
     - concise: 0.5x
     - balanced: 1.0x
     - detailed: 1.5x (capped at remaining)
   - Final: min(calculated, uiConfiguredMax ?? Infinity, remaining)

3. **Brevity Instructions**:
   Return appropriate instruction based on limit:
   - < 200 tokens: "Respond in 1-2 sentences maximum."
   - < 500 tokens: "Be extremely concise. Use bullet points."
   - < 1000 tokens: "Keep response brief and focused."
   - >= 1000 tokens: "Provide a thorough but efficient response."

4. **Integration Helper**:
   ```typescript
   function injectBrevityInstruction(
     systemPrompt: string,
     instruction: string
   ): string
   ```

### Files to Reference
- `packages/react/src/utils/token-optimization.ts` (enforceOutputLimit)
- `packages/react/src/utils/response-prefilling.ts`

### Acceptance Criteria
- [ ] Never returns more than modelCapacity - inputTokenCount
- [ ] Respects uiConfiguredMax as hard cap
- [ ] Returns appropriate brevity instruction
- [ ] Task type affects calculation appropriately
```

---

### Phase 2: Cost Avoidance (HIGH PRIORITY)

#### 2.1 Persistent Semantic Cache with IndexedDB

**What:** Upgrade semantic cache to use IndexedDB with vector storage
**Why:** Enables zero-token responses for semantically similar queries
**Impact:** 40-70% cost reduction on repeated/similar queries

---

**AGENT PROMPT 2.1:**

```
## Task: Implement IndexedDB Semantic Cache

### Context
File: `packages/react/src/utils/semantic-cache-persistent.ts` (NEW)

### Requirements
Upgrade the existing SmartCache to use IndexedDB for persistence:

1. **Interface Definition**:
   ```typescript
   interface SemanticCacheConfig {
     dbName?: string               // Default: 'clarity-semantic-cache'
     storeName?: string            // Default: 'responses'
     maxEntries?: number           // Default: 1000
     ttlMs?: number                // Default: 24 hours
     similarityThreshold?: number  // Default: 0.85
     embedFunction: (text: string) => Promise<number[]>
   }

   interface CachedResponse {
     id: string
     query: string
     queryEmbedding: number[]
     response: string
     timestamp: number
     hits: number
     metadata?: Record<string, unknown>
   }
   ```

2. **Core Class**:
   ```typescript
   class PersistentSemanticCache {
     constructor(config: SemanticCacheConfig)

     // Check cache before API call
     async checkCache(query: string): Promise<CachedResponse | null>

     // Store after successful API call
     async storeResponse(query: string, response: string): Promise<void>

     // Similarity search using embeddings
     async findSimilar(embedding: number[], threshold: number): Promise<CachedResponse[]>

     // Maintenance
     async prune(): Promise<number>  // Remove expired entries
     async clear(): Promise<void>
     async getStats(): Promise<CacheStats>
   }
   ```

3. **IndexedDB Schema**:
   - Database: 'clarity-semantic-cache'
   - Object Store: 'responses'
   - Indexes: 'timestamp' (for expiry), 'query' (exact match)
   - Store embedding as Float32Array for efficiency

4. **Similarity Search**:
   - On cache check, generate embedding for query
   - Scan stored embeddings, calculate cosine similarity
   - Return highest match above threshold
   - Update hit count on cache hit

5. **Performance Optimizations**:
   - Lazy-load IndexedDB connection
   - Batch embedding comparisons
   - Use Web Workers for similarity calculation if available
   - LRU eviction when maxEntries exceeded

### Files to Reference
- `packages/react/src/utils/smart-cache.ts`
- `packages/react/src/embeddings/cache.ts`

### Acceptance Criteria
- [ ] Persists across browser sessions
- [ ] Finds semantically similar queries (not just exact)
- [ ] Handles 1000+ entries without performance issues
- [ ] Auto-prunes expired entries
- [ ] Provides accurate cache statistics
```

---

#### 2.2 Local Embedding Generation

**What:** Generate embeddings locally using TensorFlow.js
**Why:** Enables semantic caching without API calls for embedding
**Impact:** Zero-cost embedding generation, faster cache lookups

---

**AGENT PROMPT 2.2:**

```
## Task: Implement Local Embedding Generator

### Context
File: `packages/react/src/embeddings/local-embedder.ts` (NEW)

### Requirements
Create a local embedding generator using TensorFlow.js:

1. **Interface Definition**:
   ```typescript
   interface LocalEmbedderConfig {
     modelUrl?: string           // Default: Universal Sentence Encoder lite
     dimensions?: number         // Default: 512
     batchSize?: number          // Default: 32
     cacheEmbeddings?: boolean   // Default: true
     warmupOnLoad?: boolean      // Default: true
   }

   interface EmbeddingResult {
     embedding: number[]
     text: string
     dimensions: number
     generationTimeMs: number
     cached: boolean
   }
   ```

2. **Core Class**:
   ```typescript
   class LocalEmbedder {
     private model: tf.GraphModel | null = null
     private cache: Map<string, number[]>

     constructor(config?: LocalEmbedderConfig)

     // Lazy load model
     async initialize(): Promise<void>

     // Generate single embedding
     async embed(text: string): Promise<EmbeddingResult>

     // Batch embed for efficiency
     async embedBatch(texts: string[]): Promise<EmbeddingResult[]>

     // Check if ready
     isReady(): boolean

     // Dispose resources
     dispose(): void
   }
   ```

3. **Model Options**:
   - Primary: Universal Sentence Encoder Lite (TensorFlow.js compatible)
   - Fallback: Simple word averaging with pre-trained word vectors
   - Config to specify custom model URL

4. **Performance Considerations**:
   - Lazy-load model only when first embedding requested
   - Cache embeddings by text hash
   - Use Web Workers for embedding calculation
   - Provide warmup method for pre-loading

5. **Bundle Size**:
   - Use dynamic imports for TensorFlow.js
   - Tree-shake unused operations
   - Provide fallback for SSR (no-op or API fallback)

6. **Integration**:
   - Export function `createLocalEmbedder(config)`
   - Use as `embedFunction` for SemanticCache

### Dependencies to Add
```json
{
  "@tensorflow/tfjs": "^4.x",
  "@tensorflow-models/universal-sentence-encoder": "^1.x"
}
```

### Files to Reference
- `packages/react/src/embeddings/cache.ts`
- `packages/react/src/utils/smart-cache.ts`

### Acceptance Criteria
- [ ] Generates 512-dim embeddings locally
- [ ] Model loads lazily, doesn't block initial render
- [ ] Caches generated embeddings
- [ ] Works without network after model cached
- [ ] Falls back gracefully in SSR
```

---

### Phase 3: Advanced Optimization (MEDIUM PRIORITY)

#### 3.1 LLMLingua-2 Integration

**What:** Integrate browser-based ML compression for RAG context
**Why:** 4-8x compression ratio with semantic preservation
**Impact:** Significant input token reduction for RAG-heavy applications

---

**AGENT PROMPT 3.1:**

```
## Task: Integrate LLMLingua-2 for Browser-Side Compression

### Context
File: `packages/react/src/utils/llmlingua-compressor.ts` (NEW)

### Requirements
Integrate llmlingua-2-js for advanced prompt compression:

1. **Interface Definition**:
   ```typescript
   interface LLMLinguaConfig {
     targetRatio?: number        // Default: 0.25 (4x compression)
     preserveFirst?: number      // Preserve first N tokens (instructions)
     preserveLast?: number       // Preserve last N tokens (query)
     useGPU?: boolean            // Use WebGL acceleration
   }

   interface CompressionResult {
     original: string
     compressed: string
     originalTokens: number
     compressedTokens: number
     compressionRatio: number
     preservedSegments: string[]
     processingTimeMs: number
   }
   ```

2. **Core Class**:
   ```typescript
   class LLMLinguaCompressor {
     private model: LLMLingua2 | null = null

     constructor(config?: LLMLinguaConfig)

     // Lazy initialize model
     async initialize(): Promise<void>

     // Compress text
     async compress(text: string, options?: Partial<LLMLinguaConfig>): Promise<CompressionResult>

     // Compress with segment preservation
     async compressWithSegments(
       text: string,
       segments: { start: number; end: number; preserve: boolean }[]
     ): Promise<CompressionResult>

     // Check readiness
     isReady(): boolean

     // Dispose
     dispose(): void
   }
   ```

3. **Integration with Existing Compression**:
   - Use as enhancement to `prompt-compression-advanced.ts`
   - Chain: LLMLingua compression -> TF-IDF refinement -> Output
   - Fall back to TF-IDF only if LLMLingua unavailable

4. **RAG Pipeline Integration**:
   ```typescript
   async function compressRAGContext(
     ragResults: string[],
     config: LLMLinguaConfig
   ): Promise<string[]>
   ```
   - Compress each RAG result individually
   - Preserve key entities and facts
   - Return compressed array

5. **Performance**:
   - Lazy-load model (~10MB)
   - Use WebGL when available
   - Provide progress callback for long compressions
   - Cache compressed results by hash

### Dependencies to Add
```json
{
  "@anthropic-ai/llmlingua-2": "^0.x"  // or appropriate package
}
```

### Note
If @anthropic-ai/llmlingua-2 is not available as npm package, implement
using @huggingface/transformers with the LLMLingua-2 model weights.

### Files to Reference
- `packages/react/src/utils/prompt-compression-advanced.ts`

### Acceptance Criteria
- [ ] Achieves 3-5x compression on typical RAG context
- [ ] Preserves semantic meaning (validated by similarity)
- [ ] Model loads lazily, doesn't block UI
- [ ] Falls back gracefully if WebGL unavailable
- [ ] Integrates with existing compression pipeline
```

---

#### 3.2 History Pruning UI Component

**What:** UI for users to manage conversation history
**Why:** Empowers users to control token usage, removes irrelevant context
**Impact:** 20-40% reduction in history tokens for long conversations

---

**AGENT PROMPT 3.2:**

```
## Task: Create Conversation History Pruning UI

### Context
File: `packages/react/src/components/history-manager.tsx` (NEW)

### Requirements
Create a React component for managing conversation history:

1. **Interface Definition**:
   ```typescript
   interface HistoryManagerProps {
     messages: Array<{ role: string; content: string; id: string }>
     onMessagesChange: (messages: Array<...>) => void
     maxTokens?: number
     currentTokens?: number
     showTokenCounts?: boolean
     allowBulkDelete?: boolean
     className?: string
   }
   ```

2. **Component Features**:
   - Display each message with:
     - Role badge (user/assistant/system)
     - Content preview (truncated)
     - Token count
     - Checkbox for selection
     - Delete button
   - Token usage bar showing current/max
   - Bulk actions:
     - "Delete selected"
     - "Keep only last N messages"
     - "Clear all history"
   - Confirmation dialogs for destructive actions

3. **Subcomponents**:
   ```typescript
   // Individual message row
   function HistoryMessageRow({ message, onDelete, onSelect, selected, tokenCount })

   // Token usage indicator
   function TokenUsageBar({ current, max, warning, critical })

   // Bulk action toolbar
   function HistoryToolbar({ selectedCount, onDeleteSelected, onKeepLast, onClear })
   ```

4. **Styling**:
   - Use existing design tokens from theme
   - Responsive layout (stack on mobile)
   - Visual distinction for different roles
   - Warning colors when approaching limits

5. **Accessibility**:
   - Keyboard navigation
   - ARIA labels for actions
   - Focus management after deletions

### Files to Reference
- `packages/react/src/components/token-counter.tsx`
- `packages/react/src/theme/design-tokens.ts`

### Acceptance Criteria
- [ ] Displays all messages with token counts
- [ ] Allows individual and bulk deletion
- [ ] Shows real-time token usage bar
- [ ] Confirms before bulk deletions
- [ ] Accessible via keyboard
- [ ] Responsive design
```

---

#### 3.3 Output Preference Selector

**What:** UI component for users to select response verbosity
**Why:** Maps user preference to technical constraints (max_tokens, brevity prompts)
**Impact:** 20-50% output token reduction when concise mode selected

---

**AGENT PROMPT 3.3:**

```
## Task: Create Output Preference Selector Component

### Context
File: `packages/react/src/components/output-preference-selector.tsx` (NEW)

### Requirements
Create a React component for selecting output verbosity:

1. **Interface Definition**:
   ```typescript
   interface OutputPreference {
     mode: 'concise' | 'balanced' | 'detailed'
     maxTokens: number
     brevityInstruction: string
   }

   interface OutputPreferenceSelectorProps {
     value: OutputPreference['mode']
     onChange: (preference: OutputPreference) => void
     modelCapacity?: number    // For dynamic calculation
     inputTokens?: number      // Current input size
     showTokenEstimate?: boolean
     disabled?: boolean
     className?: string
   }
   ```

2. **Component Design**:
   - Three-option toggle/radio group:
     - Concise: "Brief, to-the-point responses"
     - Balanced: "Standard response length" (default)
     - Detailed: "Comprehensive explanations"
   - Token estimate display for each option
   - Visual indicator of current selection

3. **Token Mapping**:
   ```typescript
   const PREFERENCE_CONFIG = {
     concise: {
       multiplier: 0.3,
       maxDefault: 500,
       instruction: "Be extremely concise. Use bullet points where possible."
     },
     balanced: {
       multiplier: 0.6,
       maxDefault: 2000,
       instruction: "Provide a clear, focused response."
     },
     detailed: {
       multiplier: 0.9,
       maxDefault: 4000,
       instruction: "Provide a thorough, comprehensive response."
     }
   }
   ```

4. **Integration**:
   - Export as controlled component
   - Provide uncontrolled variant with internal state
   - Include hook `useOutputPreference()` for convenience

5. **Styling**:
   - Compact inline mode for toolbars
   - Expanded mode with descriptions
   - Theme-aware colors

### Files to Reference
- `packages/react/src/utils/dynamic-output-limit.ts` (from Phase 1)
- `packages/react/src/theme/design-tokens.ts`

### Acceptance Criteria
- [ ] Three clear preference options
- [ ] Shows estimated token counts when enabled
- [ ] Emits complete OutputPreference object
- [ ] Compact and expanded display modes
- [ ] Keyboard accessible
```

---

## Implementation Order Summary

### Phase 1 (Foundation) - Week 1
1. **1.1** Token Threshold Warning System - Essential for cost control
2. **1.2** KV Cache-Aligned Prompt Builder - Essential for latency
3. **1.3** Dynamic Output Token Calculator - Essential for output control

### Phase 2 (Cost Avoidance) - Week 2
1. **2.1** Persistent Semantic Cache with IndexedDB - Major cost savings
2. **2.2** Local Embedding Generator - Enables semantic cache

### Phase 3 (Advanced) - Week 3
1. **3.1** LLMLingua-2 Integration - Advanced compression
2. **3.2** History Pruning UI - User control
3. **3.3** Output Preference Selector - User control

---

## Dependencies to Add

```json
{
  "dependencies": {
    "@tensorflow/tfjs": "^4.17.0",
    "@tensorflow-models/universal-sentence-encoder": "^1.3.3"
  },
  "optionalDependencies": {
    "@anthropic-ai/llmlingua-2": "^0.1.0"
  }
}
```

---

## Testing Requirements

Each implementation should include:

1. **Unit Tests**: Core logic, edge cases, error handling
2. **Integration Tests**: Component interaction, hook usage
3. **Performance Tests**:
   - Token counting: <10ms for typical messages
   - Cache lookup: <50ms including similarity search
   - Compression: <500ms for RAG context
4. **Bundle Size Verification**: Ensure lazy loading works

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Token counting accuracy | >98% vs tiktoken | Unit test comparison |
| Cache hit rate | >30% on similar queries | Analytics tracking |
| Compression ratio | 3-5x on RAG context | Integration test |
| Output token reduction | 20-40% with concise mode | A/B testing |
| TTFT improvement | 30% with KV caching | Latency monitoring |

---

## Notes for Implementing Agents

1. **Always use existing utilities** - Check `packages/react/src/utils/tokenization/` first
2. **Follow existing patterns** - Match code style in `use-token-optimization-enhanced.tsx`
3. **Add exports** - Update relevant `index.ts` files
4. **Write tests** - Follow patterns in `__tests__/` directories
5. **Document** - Add JSDoc comments with examples
