# Memory System - Retrieval & Context Assembly Audit

**Phase:** 5 - Retrieval & Context Assembly Audit
**Date:** 2026-01-22
**Status:** ISSUES IDENTIFIED

---

## EXECUTIVE SUMMARY

The retrieval and context assembly system is **functional but has significant limitations**:

✅ **Good:** Token budget awareness
✅ **Good:** Basic relevance scoring
❌ **Bad:** Simplistic ordering (no secondary sort)
❌ **Bad:** No summarization in context assembly
❌ **Bad:** No trimming/compression during retrieval
❌ **Bad:** Context freshness not guaranteed

**Overall Assessment:** Basic implementation lacks sophistication for production use

---

## RETRIEVAL ORDERING ANALYSIS

### Current Ordering Algorithm

**Location:** `/packages/memory/src/memory-service.ts`

#### Cache Search Ordering (lines 460-503)

```typescript
// Sort by relevance and confidence
results.sort((a, b) => {
  const scoreA = a.relevance * a.memory.confidence
  const scoreB = b.relevance * b.memory.confidence
  return scoreB - scoreA
})
```

**Primary Sort:** `relevance × confidence`
**Secondary Sort:** None (insertion order)
**Tertiary Sort:** None

---

### 🚨 RETRIEVAL ISSUE #1: NO SECONDARY SORT CRITERIA (SEVERITY: MEDIUM)

**Description:**
When two memories have the same relevance × confidence score, ordering is **undefined** (depends on insertion order, which may vary).

**Impact:**
- **Unpredictable Results:** Same query may return different order on different runs
- **Testing Difficulty:** Cannot assert exact ordering in tests
- **Developer Confusion:** Inconsistent behavior
- **No Recency Bias:** Old and new memories with same score treated equally

**Evidence:**
No secondary sort criteria in:
- Cache search (line 496-499)
- Vector search (line 444-448)
- Filter application (no sorting)

**Recommended Fix:**
```typescript
results.sort((a, b) => {
  // Primary: relevance × confidence
  const scoreA = a.relevance * a.memory.confidence
  const scoreB = b.relevance * b.memory.confidence

  if (scoreB !== scoreA) {
    return scoreB - scoreA
  }

  // Secondary: recency (newer first)
  const timeA = a.memory.lastAccessed?.getTime() || a.memory.createdAt.getTime()
  const timeB = b.memory.lastAccessed?.getTime() || b.memory.createdAt.getTime()

  if (timeB !== timeA) {
    return timeB - timeA
  }

  // Tertiary: priority
  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
  const priorityA = priorityOrder[a.memory.priority] || 2
  const priorityB = priorityOrder[b.memory.priority] || 2

  return priorityB - priorityA
})
```

**Priority:** P1 (Predictability + correctness)

---

### ⚠️ RETRIEVAL ISSUE #2: NO CONFIGURABLE SORT ORDER (SEVERITY: MEDIUM)

**Description:**
Sorting is hard-coded. No way to:
- Sort by recency only
- Sort by importance only
- Sort chronologically (oldest first)
- Custom sort functions

**Use Cases Blocked:**
- "Show me oldest memories first"
- "Show me most important memories regardless of relevance"
- "Show me most recently accessed memories"
- "Sort by creation date"

**Recommended Fix:**
```typescript
interface MemoryQuery {
  // ... existing fields
  sortBy?: 'relevance' | 'recency' | 'importance' | 'confidence' | 'createdAt' | 'accessCount'
  sortDirection?: 'asc' | 'desc'
  sortComparator?: (a: MemorySearchResult, b: MemorySearchResult) => number
}
```

**Priority:** P2 (Flexibility)

---

### ⚠️ RETRIEVAL ISSUE #3: RELEVANCE SCORING TOO SIMPLISTIC (SEVERITY: MEDIUM)

**Description:**
Text-based relevance scoring (without embeddings) is extremely basic:

```typescript
// Line 481-490: Cache search relevance
if (query.query) {
  const queryLower = query.toLowerCase()
  const contentLower = memory.content.toLowerCase()
  if (contentLower.includes(queryLower)) {
    relevance = 0.8  // Exact substring match
  } else {
    continue  // No match = excluded
  }
}
```

**Problems:**
- **Binary:** Either 0.8 (match) or excluded (no match)
- **No Partial Matching:** "TypeScript" doesn't match "TS"
- **No Synonym Support:** "happy" doesn't match "joyful"
- **No Stemming:** "running" doesn't match "run"
- **No TF-IDF:** Common words weighted same as rare words
- **Position Ignored:** Match at start vs end treated equally

**Impact:**
- **Poor Recall:** Misses relevant memories with different wording
- **No Ranking Granularity:** All matches score 0.8
- **Dependent on Embeddings:** Without embeddings, search quality is very poor

**Recommended Fix:**
1. **Implement BM25 Algorithm:** Industry-standard text ranking
2. **Add Fuzzy Matching:** Levenshtein distance for typos
3. **Add Synonyms:** WordNet or similar
4. **Add Stemming:** Porter stemmer or similar
5. **Gradual Scoring:** Range from 0.0 to 1.0 based on match quality

**Priority:** P2 (Quality improvement)

---

### ⚠️ RETRIEVAL ISSUE #4: IMPORTANCE SCORER NOT USED IN RETRIEVAL (SEVERITY: HIGH)

**Description:**
The system has an `ImportanceScorer` class (in `/packages/memory/src/scoring/importance-scorer.ts`) that calculates sophisticated importance scores with:
- Base importance
- Recency decay
- Access frequency
- Semantic relevance
- Scope boost

**BUT IT'S NOT USED IN THE CORE MEMORY SERVICE!**

**Evidence:**
- ImportanceScorer exists and is exported
- It's never imported or used in memory-service.ts
- Retrieval uses only raw relevance × confidence
- No recency decay applied
- No access frequency considered

**Impact:**
- **Missing Functionality:** Sophisticated scoring exists but unused
- **Wasted Code:** ImportanceScorer is dead code
- **Misleading Documentation:** Docs may reference importance scoring

**Recommended Fix:**
Integrate ImportanceScorer into query():

```typescript
import { ImportanceScorer } from './scoring/importance-scorer'

class MemoryService {
  private importanceScorer: ImportanceScorer

  constructor(...) {
    this.importanceScorer = new ImportanceScorer({
      recencyHalfLife: config.recencyHalfLife || 7 * 24 * 60 * 60 * 1000,
      maxFrequencyAccesses: 100,
      weights: {
        baseImportance: 0.3,
        recency: 0.25,
        frequency: 0.2,
        semanticRelevance: 0.15,
        scopeBoost: 0.1,
      }
    })
  }

  async query(query: MemoryQuery): Promise<MemorySearchResult[]> {
    let results = await this.rawQuery(query)

    // Apply importance scoring
    results = results.map(result => ({
      ...result,
      score: this.importanceScorer.score(result.memory, query),
      relevance: result.relevance, // Keep original relevance
    }))

    // Sort by combined score
    results.sort((a, b) => b.score - a.score)

    return results
  }
}
```

**Priority:** P0 (Critical missing functionality)

---

## CONTEXT ASSEMBLY ANALYSIS

### Current Context Assembly

**Location:** `/packages/memory/src/memory-service.ts:1361-1410`

```typescript
async context(options?: ContextOptions): Promise<ContextBundle> {
  // 1. Query memories
  const allMemories = await this.query({
    limit: options?.maxTokens ? Math.floor(options.maxTokens / 100) : 50,
  })

  // 2. Get token allocation
  const allocation = this.optimizer.getBudgetManager().getAllocation()

  // 3. Separate by type
  const semanticMems = allMemories.filter(r => r.memory.type === 'semantic').map(r => r.memory)
  const episodicMems = allMemories.filter(r => r.memory.type === 'episodic').map(r => r.memory)

  // 4. Format as text
  const formatted = [
    options?.includeSummary ? '# Context Summary' : '',
    semanticMems.length > 0
      ? `\n## Semantic Memories\n${semanticMems.map(m => m.content).join('\n')}`
      : '',
    episodicMems.length > 0
      ? `\n## Recent Events\n${episodicMems.map(m => m.content).join('\n')}`
      : '',
  ].filter(Boolean).join('\n')

  // 5. Count tokens
  const totalTokens = TokenCounter.count(formatted)

  // 6. Return bundle
  return {
    memories: allMemories.map(r => r.memory),
    totalTokens,
    tokenBreakdown: allocation,  // ⚠️ Doesn't match actual tokens!
    formatted,
    semanticMemories: semanticMems,
    episodicMemories: episodicMems,
  }
}
```

---

### 🚨 CONTEXT ISSUE #1: TOKEN BUDGET NOT ENFORCED (SEVERITY: CRITICAL)

**Description:**
The `context()` method **does not enforce token budget**. It:
1. Queries memories with arbitrary limit (line 1363-1365)
2. Formats all memories as text
3. Counts tokens AFTER formatting
4. Returns result even if exceeds budget

**Evidence:**
- No token budget check in `context()` method
- `options.maxTokens` only affects query limit heuristic (divide by 100)
- No trimming if result exceeds budget
- No compression applied

**Impact:**
- **Budget Violations:** Context can easily exceed maxTokens
- **API Failures:** Exceeding model context window
- **Cost Overruns:** Unnecessary tokens sent to LLM
- **No Control:** Developers can't rely on budget

**Recommended Fix:**
```typescript
async context(options?: ContextOptions): Promise<ContextBundle> {
  const maxTokens = options?.maxTokens || this.config.maxContextWindow || 4096
  let memories: MemorySearchResult[] = []
  let currentTokens = 0

  // Query in batches until budget reached
  const candidates = await this.query({ limit: 100 })

  for (const candidate of candidates) {
    const memoryTokens = candidate.memory.tokens || TokenCounter.count(candidate.memory.content)

    if (currentTokens + memoryTokens <= maxTokens) {
      memories.push(candidate)
      currentTokens += memoryTokens
    } else if (options?.compress) {
      // Try compressing to fit
      const compressed = await this.compressMemory(candidate.memory.id, 0.5)
      if (compressed && currentTokens + compressed.tokens <= maxTokens) {
        memories.push({ ...candidate, memory: compressed })
        currentTokens += compressed.tokens
      }
    } else {
      break // Budget reached
    }
  }

  // Build formatted context
  const formatted = this.formatMemories(memories, options)
  const actualTokens = TokenCounter.count(formatted)

  // Verify budget
  if (actualTokens > maxTokens) {
    throw new Error(`Context exceeds budget: ${actualTokens} > ${maxTokens}`)
  }

  return {
    memories: memories.map(r => r.memory),
    totalTokens: actualTokens,
    tokenBreakdown: this.calculateActualBreakdown(memories),
    formatted,
  }
}
```

**Priority:** P0 (Correctness blocker)

---

### 🚨 CONTEXT ISSUE #2: TOKEN BREAKDOWN MISMATCH (SEVERITY: HIGH)

**Description:**
The `tokenBreakdown` field in `ContextBundle` contains **allocation targets**, not **actual token usage**.

**Evidence:**
```typescript
// Line 1392-1400
const breakdown: TokenBreakdown = {
  systemPrompt: allocation.systemPrompt,      // ❌ Allocation, not actual
  userPreferences: allocation.userPreferences, // ❌ Allocation, not actual
  recentContext: allocation.recentContext,     // ❌ Allocation, not actual
  semanticMemory: allocation.semanticMemory,   // ❌ Allocation, not actual
  episodicMemory: allocation.episodicMemory,   // ❌ Allocation, not actual
  responseReserve: allocation.responseReserve, // ❌ Allocation, not actual
  total: totalTokens,  // ✅ Actual total
}
```

**Impact:**
- **Misleading Stats:** Developers see allocation targets, not actual usage
- **Debugging Confusion:** Breakdown doesn't explain actual tokens
- **No Accountability:** Can't track where tokens actually went

**Recommended Fix:**
```typescript
const breakdown: TokenBreakdown = {
  systemPrompt: 0, // Calculated from actual system prompt
  userPreferences: 0, // Calculated from actual preferences
  recentContext: episodicTokens, // Actual episodic memory tokens
  semanticMemory: semanticTokens, // Actual semantic memory tokens
  episodicMemory: 0, // If separate from recentContext
  responseReserve: 0, // Not applicable to memory context
  total: totalTokens,
}
```

**Priority:** P1 (Correctness)

---

### 🚨 CONTEXT ISSUE #3: NO SUMMARIZATION IN CONTEXT ASSEMBLY (SEVERITY: MEDIUM)

**Description:**
Despite having comprehensive summarization infrastructure (LLMSummarizer, OpenAISummarizer, AnthropicSummarizer), **summarization is never used during context assembly**.

**Evidence:**
- `context()` method joins memories with `\n` (line 1381, 1384)
- No call to any summarizer
- Full content always included
- No compression applied

**Impact:**
- **Token Waste:** Full memories used when summaries would suffice
- **Context Pollution:** Verbose memories crowd out other content
- **No Adaptive Behavior:** Can't adjust detail level based on budget

**Recommended Fix:**
```typescript
async context(options?: ContextOptions): Promise<ContextBundle> {
  // ...query memories...

  const formatted = await this.formatWithSummarization(memories, {
    maxTokensPerMemory: options?.maxTokensPerMemory || 100,
    summarize: options?.summarize !== false,
    summaryStyle: options?.summaryStyle || 'bullet',
  })

  return { ...bundle, formatted }
}

private async formatWithSummarization(
  memories: MemorySearchResult[],
  options: { maxTokensPerMemory: number; summarize: boolean; summaryStyle: string }
): Promise<string> {
  const sections: string[] = []

  for (const result of memories) {
    let content = result.memory.content

    // Summarize if too long
    if (options.summarize && result.memory.tokens > options.maxTokensPerMemory) {
      if (this.summarizer) {
        const summary = await this.summarizer.summarize(content, options.summaryStyle)
        content = summary.summary
      } else {
        // Fallback: truncate
        content = content.slice(0, options.maxTokensPerMemory * 4) + '...'
      }
    }

    sections.push(`[${result.memory.type}] ${content}`)
  }

  return sections.join('\n\n')
}
```

**Priority:** P1 (Missing core feature)

---

### ⚠️ CONTEXT ISSUE #4: CONTEXT FRESHNESS NOT GUARANTEED (SEVERITY: MEDIUM)

**Description:**
Context may be stale:
- No timestamp tracking
- No automatic refresh
- No invalidation on new memories
- Cache may return old context

**In useClarityChat (line 289-299):**
```typescript
const contextString = memoryResults.length > 0
  ? memoryResults
      .map((result) => result.memory.content)
      .join('\n\n')
  : ''

memoryContextRef.current = contextString
setCurrentMemoryContext(contextString)
```

**Problem:**
- Context fetched once per message append
- Not refreshed if memories change
- No invalidation mechanism

**Recommended Fix:**
1. **Add Context TTL:**
   ```typescript
   contextCache: {
     ttl: 60000, // 1 minute
     invalidateOnWrite: true
   }
   ```

2. **Automatic Refresh:**
   - Refresh context before each LLM call
   - Invalidate on memory add/update/delete
   - Add version/generation counter

**Priority:** P2 (Quality of service)

---

### ⚠️ CONTEXT ISSUE #5: NO TRIMMING/COMPRESSION DURING RETRIEVAL (SEVERITY: MEDIUM)

**Description:**
Individual memories are never trimmed or compressed during retrieval, only during explicit `compress()` calls.

**Impact:**
- Long memories consume excessive tokens
- No automatic optimization
- Manual compression required

**Recommended Fix:**
```typescript
interface ContextOptions {
  autoCompress?: boolean // Default: true
  compressionRatio?: number // Default: 0.7
  maxTokensPerMemory?: number // Default: 200
}

async context(options?: ContextOptions): Promise<ContextBundle> {
  // ... query memories ...

  // Auto-compress if enabled
  if (options?.autoCompress !== false) {
    for (const result of memories) {
      if (result.memory.tokens > (options?.maxTokensPerMemory || 200)) {
        result.memory = await this.compressMemory(
          result.memory.id,
          options?.compressionRatio || 0.7
        )
      }
    }
  }

  // ... format and return ...
}
```

**Priority:** P2 (Optimization)

---

## REACT INTEGRATION CONTEXT ASSEMBLY

### useClarityChat Context Flow

**Location:** `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts:265-327`

```typescript
// On message append, fetch memory context
const memoryResults = await memoryContext.query({
  query: userMessage,
  limit: memory.contextSize || 5,
})

const contextString = memoryResults.length > 0
  ? memoryResults
      .map((result) => result.memory.content)
      .join('\n\n')
  : ''

// Inject into system message
if (memory?.enabled && currentMemoryContext) {
  enrichedMessages = [
    {
      role: 'system',
      content: `Relevant context from memory:\n${currentMemoryContext}`,
    },
    ...enrichedMessages,
  ]
}
```

---

### 🚨 REACT CONTEXT ISSUE #1: NO DEDUPLICATION WITH RECENT MESSAGES (SEVERITY: MEDIUM)

**Description:**
Memory context may duplicate recent messages already in conversation history.

**Scenario:**
1. User: "What is TypeScript?"
2. Assistant: "TypeScript is..."
3. Both stored to memory
4. User: "Tell me more"
5. Memory retrieves: "What is TypeScript?" and "TypeScript is..."
6. These are ALSO in the message history (messages array)
7. Result: Duplication

**Impact:**
- **Token Waste:** Same content sent twice
- **Context Pollution:** Redundant information
- **No Value Added:** Memory doesn't add new information

**Recommended Fix:**
```typescript
const recentMessageContent = messages
  .slice(-5) // Last 5 messages
  .map(m => extractTextContent(m.content))

const memoryResults = await memoryContext.query({
  query: userMessage,
  limit: memory.contextSize || 5,
  excludeContent: recentMessageContent, // Filter out recent messages
})
```

**Priority:** P1 (Token waste)

---

### ⚠️ REACT CONTEXT ISSUE #2: FIXED CONTEXT SIZE (SEVERITY: LOW)

**Description:**
Context size is fixed (`memory.contextSize || 5`), not adaptive based on:
- Message complexity
- Available token budget
- Conversation length

**Recommended Fix:**
```typescript
// Adaptive context size
const calculateContextSize = (messages, budget) => {
  const conversationTokens = messages.reduce((sum, m) => sum + countTokens(m), 0)
  const availableTokens = budget - conversationTokens
  const avgMemoryTokens = 100
  return Math.floor(availableTokens / avgMemoryTokens)
}

const contextSize = memory.adaptive
  ? calculateContextSize(messages, tokenBudget)
  : (memory.contextSize || 5)
```

**Priority:** P2 (Optimization)

---

## TOKEN OPTIMIZATION ANALYSIS

### Budget Manager

**Location:** `/packages/memory/src/memory-service.ts:118-199`

The default optimizer provides static token allocations:

```typescript
const defaultAllocation: TokenAllocation = {
  semantic: 2000,
  episodic: 1500,
  working: 500,
  systemPrompt: 500,
  userPreferences: 300,
  recentContext: 800,
  semanticMemory: 2000,
  episodicMemory: 1500,
  responseReserve: 400,
}
```

**Issues:**
- Static allocations (not dynamic based on actual usage)
- Doesn't adapt to model context window size
- Doesn't account for actual message lengths

---

### ⚠️ OPTIMIZATION ISSUE #1: NO DYNAMIC TOKEN ALLOCATION (SEVERITY: MEDIUM)

**Description:**
Token allocations are hard-coded, not adapted to:
- Model context window (GPT-3.5: 4k, GPT-4: 8k/32k/128k, Claude: 200k)
- Actual message lengths
- Memory availability
- Conversation stage

**Recommended Fix:**
```typescript
interface DynamicTokenAllocation {
  modelContextWindow: number // e.g., 4096, 8192, 200000
  adaptiveAllocation: boolean
  prioritize: 'recent' | 'semantic' | 'balanced'
}

function calculateAllocation(config: DynamicTokenAllocation): TokenAllocation {
  const { modelContextWindow, prioritize } = config

  // Reserve for response (typically 20-30%)
  const responseReserve = Math.floor(modelContextWindow * 0.25)
  const available = modelContextWindow - responseReserve

  // Allocate based on priority
  switch (prioritize) {
    case 'recent':
      return {
        recentContext: Math.floor(available * 0.5),
        semanticMemory: Math.floor(available * 0.3),
        episodicMemory: Math.floor(available * 0.1),
        systemPrompt: Math.floor(available * 0.05),
        userPreferences: Math.floor(available * 0.05),
        responseReserve,
      }
    // ... other strategies
  }
}
```

**Priority:** P2 (Optimization)

---

## RETRIEVAL PERFORMANCE ANALYSIS

### Cache Search Performance

**Complexity:** O(n) where n = number of cached memories

**Operations:**
- Iterate all memories
- Apply filters
- Calculate relevance
- Sort results

**Scalability Issues:**
- No indexing
- No early termination
- Linear scan on every query

### Vector Search Performance

**Complexity:** Depends on vector store backend

**Better Performance:**
- Indexed by embeddings
- Approximate nearest neighbor (ANN) search
- Can handle millions of vectors

**Recommendation:** Always use vector search in production

---

## RECOMMENDATIONS SUMMARY

### Critical (P0) - Fix Immediately

1. **Integrate ImportanceScorer** - Use existing sophisticated scoring system
2. **Enforce Token Budget** - Prevent context() from exceeding limits
3. **Fix Token Breakdown** - Report actual usage, not allocations

### High Priority (P1) - Fix Soon

4. **Add Secondary Sort** - Predictable tie-breaking
5. **Use Summarization** - Compress memories in context assembly
6. **Deduplicate with Messages** - Don't repeat recent conversation
7. **Fix Context Staleness** - Invalidate on writes, add TTL

### Medium Priority (P2) - Improvements

8. **Add Sort Options** - Configurable sort order
9. **Improve Text Relevance** - BM25, fuzzy matching, synonyms
10. **Auto-Compression** - Compress long memories during retrieval
11. **Dynamic Allocation** - Adapt token budget to model/usage
12. **Adaptive Context Size** - Adjust based on budget/conversation

---

## TESTING RECOMMENDATIONS

### Retrieval Tests Needed

- [ ] Test sort order with identical scores (deterministic?)
- [ ] Test token budget enforcement (must not exceed)
- [ ] Test token breakdown accuracy (matches actual usage?)
- [ ] Test context freshness (invalidates on write?)
- [ ] Test summarization integration (reduces tokens?)
- [ ] Test deduplication with messages (no overlap?)
- [ ] Test importance scoring (uses ImportanceScorer?)
- [ ] Test large context assembly (performance acceptable?)

### Performance Tests Needed

- [ ] Benchmark cache search with 1k, 10k, 100k memories
- [ ] Benchmark vector search with 1k, 10k, 100k memories
- [ ] Benchmark context assembly with various budgets
- [ ] Benchmark summarization latency
- [ ] Memory leak tests (long-running contexts)

---

## CONFIGURATION RECOMMENDATIONS

### Production-Ready Retrieval Config

```typescript
interface ProductionRetrievalConfig {
  // Scoring
  useImportanceScorer: true
  importanceWeights: {
    baseImportance: 0.3
    recency: 0.25
    frequency: 0.2
    semanticRelevance: 0.15
    scopeBoost: 0.1
  }
  recencyHalfLife: 7 * 24 * 60 * 60 * 1000 // 7 days

  // Sorting
  primarySort: 'importance' // Use combined importance score
  secondarySort: 'recency'
  tertiarySort: 'priority'

  // Context assembly
  tokenBudget: {
    enforce: true // Strictly enforce budget
    adaptive: true // Adapt to model context window
    reserve: 0.25 // Reserve 25% for response
  }

  // Summarization
  autoSummarize: true
  maxTokensPerMemory: 200
  summaryStyle: 'bullet'

  // Optimization
  autoCompress: true
  compressionRatio: 0.7

  // Freshness
  contextTTL: 60000 // 1 minute
  invalidateOnWrite: true

  // Deduplication
  deduplicateWithMessages: true
  deduplicateWindow: 5 // Last 5 messages
}
```

---

## PHASE 5 STATUS: COMPLETE

**Retrieval Quality:** ⚠️ Basic but functional
**Context Assembly:** ⚠️ Works but lacks sophistication
**Token Budget:** ❌ Not enforced
**Critical Issues:** 3 P0 issues identified
**Total Issues:** 12 retrieval/context issues

**Next Phase:** Phase 6 - API Design & DX Review
