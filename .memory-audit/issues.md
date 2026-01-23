# Memory System - Correctness Issues

**Phase:** 2 - Memory Correctness Audit
**Date:** 2026-01-22
**Status:** CRITICAL ISSUES FOUND

---

## CRITICAL ISSUES

### 🚨 ISSUE #1: SILENT AUTOMATIC MEMORY WRITES (SEVERITY: CRITICAL)

**Location:** `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts:180-229`

**Description:**
The `useClarityChat` hook automatically stores **every chat message** (both user and assistant) to memory via an "enhanced onFinish" callback. This happens silently without explicit user action.

**Code Evidence:**
```typescript
// Line 180-229
const enhancedOnFinish = React.useCallback(
  async (message: CoreMessage) => {
    await originalOnFinish?.(message)

    if (memory?.enabled && memoryContext?.service) {
      // Automatically stores EVERY message to memory
      await memoryContext.addMemory(
        content,
        'episodic',
        'thread',
        { messageId, role, timestamp },
        { priority: message.role === 'assistant' ? 'high' : 'medium' }
      )
    }
  },
  [memory, memoryContext, originalOnFinish]
)
```

**Violation:**
- **HARD CONSTRAINT:** "NO SILENT MEMORY - Nothing is written to memory implicitly"
- Memory writes should be **explicit, inspectable, and reversible**
- Users/developers have no control over this automatic capture

**Impact:**
- **PII Risk:** User messages containing sensitive data are auto-persisted
- **No Opt-Out:** Cannot disable per-message capture
- **Unbounded Growth:** Every message adds to memory, no limits
- **Developer Surprise:** Not obvious from API that this happens
- **Token Cost:** Automatic embeddings generated for every message

**When This Occurs:**
- Every time a message finishes (both user and assistant)
- If `memory.enabled === true`
- Automatically, without developer/user action

**Recommended Fix:**
1. **Remove automatic capture** - Make memory capture **opt-in per message**
2. **Provide explicit API** - `captureMessage(message)` function developers must call
3. **Configuration Option** - Add `autoCapture: boolean` config (default: false)
4. **Warning in Docs** - If autoCapture is allowed, make it extremely clear in docs

**Priority:** P0 (Blocker for enterprise use)

---

### 🚨 ISSUE #2: WRITE SIDE EFFECTS IN READ OPERATIONS (SEVERITY: HIGH)

**Location:** `/packages/memory/src/memory-service.ts:406-419`

**Description:**
The `query()` method (a read operation) has **write side effects**:
1. Updates `accessCount` for retrieved memories
2. Updates `lastAccessed` timestamp
3. Triggers automatic decay (which can DELETE memories)

**Code Evidence:**
```typescript
// Line 406-419 in query() method
// Update access stats (WRITE in READ operation)
for (const result of results) {
  result.memory.accessCount++
  result.memory.lastAccessed = new Date()
}

// Auto-decay on recall if enabled (CAN DELETE MEMORIES)
if (this.config.decay?.autoDecayOnRecall && this.decayManager) {
  this.runDecay().catch((error) => {
    if (this.config.debug) {
      console.error('Auto-decay failed:', error)
    }
  })
}
```

**Violation:**
- Query operations should be **read-only** and **idempotent**
- Deleting memories during a read operation is unexpected
- No way to "just peek" at memories without modifying them

**Impact:**
- **Unpredictable Behavior:** Querying memories can delete other memories
- **Race Conditions:** Concurrent queries can corrupt access counts
- **Testing Difficulty:** Read operations have side effects
- **Caching Problems:** Cannot safely cache query results

**Recommended Fix:**
1. **Separate read from write** - Create `updateAccessStats(memoryId)` method
2. **Make decay explicit** - `runDecay()` should be called explicitly, not during query
3. **Add read-only mode** - `query({ readonly: true })` option to skip updates
4. **Document side effects** - If keeping auto-update, make it very clear in docs

**Priority:** P0 (Correctness violation)

---

### 🚨 ISSUE #3: ARCHITECTURAL DUPLICATION - THREE MEMORY SERVICES (SEVERITY: CRITICAL)

**Locations:**
1. `/packages/memory/src/memory-service.ts` - Core implementation
2. `/packages/react/src/memory/memory-service.ts` - React duplicate
3. `/packages/react/src/utils/memory/memory-service.ts` - Yet another duplicate

**Description:**
Three separate `MemoryService` implementations exist in the codebase, each with overlapping functionality but potentially different behavior.

**Evidence:**
- All three define `MemoryService` class
- All three implement add/query/update/delete operations
- React MemoryProvider imports from core package, but React-specific services exist
- Unclear which is canonical

**Impact:**
- **Inconsistent Behavior:** Different implementations may behave differently
- **Maintenance Nightmare:** Bug fixes must be applied to all three
- **Developer Confusion:** Which service should be used?
- **Testing Gaps:** Are all three tested equally?
- **Documentation Mismatch:** Docs may reference wrong implementation

**Recommended Fix:**
1. **Designate Core as Canonical:** `/packages/memory/src/memory-service.ts` is the source of truth
2. **Remove React Duplicates:** Delete `/packages/react/src/memory/memory-service.ts`
3. **Extract React-Specific Logic:** Move truly React-specific logic to utilities/hooks
4. **Consolidate Utils:** Merge `/packages/react/src/utils/memory/memory-service.ts` features into core

**Priority:** P0 (Architecture blocker)

---

### ⚠️ ISSUE #4: INCOMPLETE IMPLEMENTATION - clear() METHOD (SEVERITY: MEDIUM)

**Location:** `/packages/react/src/hooks/storage/use-memory-store.ts:103-107`

**Description:**
The `clear()` method in `useMemoryStore` hook is **not implemented**.

**Code Evidence:**
```typescript
// Line 103-107
const clear = React.useCallback(async () => {
  if (!enabled || !memoryContext) return
  // Clear memories for current scope
  // Implementation depends on memory service API
}, [enabled, memoryContext])
```

**Impact:**
- **API Surface Lie:** Method exists but does nothing
- **Developer Surprise:** Calling `clear()` has no effect
- **No Way to Clear:** Users cannot clear their memory data

**Recommended Fix:**
1. **Implement clear()** - Call `memoryContext.deleteMemoriesByScope(scope)`
2. **Or Remove Method** - If not ready, remove from public API
3. **Add Tests** - Verify clear() actually clears memories

**Priority:** P1 (Broken API contract)

---

### ⚠️ ISSUE #5: INCOMPLETE IMPLEMENTATION - autoCapture OPTION (SEVERITY: MEDIUM)

**Location:** `/packages/react/src/memory/memory-provider.tsx:505`

**Description:**
The `useConversationMemory` hook accepts an `autoCapture` option that is **never used**.

**Code Evidence:**
```typescript
// Line 500-506
export function useConversationMemory(
  options: {
    userId?: string
    threadId?: string
    sessionId?: string
    autoCapture?: boolean  // ❌ Not used anywhere
  } = {}
)
```

**Impact:**
- **API Surface Lie:** Option exists but does nothing
- **Developer Confusion:** Developers may think it works
- **Misleading Documentation:** If documented, it's incorrect

**Recommended Fix:**
1. **Implement autoCapture** - Wire it to automatic message capture (carefully!)
2. **Or Remove Option** - If not ready, remove from interface
3. **Document Clearly** - If keeping as placeholder, mark as "not yet implemented"

**Priority:** P2 (Misleading API)

---

### ⚠️ ISSUE #6: UNBOUNDED MEMORY GROWTH (SEVERITY: HIGH)

**Description:**
When automatic memory capture is enabled (Issue #1), **every message** is stored with **no limits** on:
- Total memory count
- Total token usage
- Storage size
- Time-based expiration (unless explicitly configured)

**Impact:**
- **Memory Bloat:** Long conversations = thousands of memories
- **Performance Degradation:** Querying large memory sets slows down
- **Storage Costs:** Unbounded IndexedDB/file/database growth
- **Token Costs:** Unbounded embedding generation costs
- **No Automatic Cleanup:** Old memories persist forever (unless decay configured)

**Recommended Fix:**
1. **Add Hard Limits:** `maxMemories` config (default: 1000)
2. **Add Token Limits:** `maxTotalTokens` config (default: 100k)
3. **Add Auto-Eviction:** LRU or FIFO when limits reached
4. **Enable Decay by Default:** With reasonable TTL for episodic memories
5. **Warning on Approach:** Warn when approaching limits

**Priority:** P0 (Production safety)

---

### ⚠️ ISSUE #7: MISSING SCOPE VALIDATION (SEVERITY: MEDIUM)

**Description:**
No validation ensures that scope transitions are valid. For example:
- Can a 'session' memory be promoted to 'global'?
- Can a 'thread' memory be demoted to 'session'?
- What happens if scope is invalid?

**Code Evidence:**
Memory service accepts any `MemoryScope` without validation of transitions.

**Impact:**
- **Scope Leakage:** Session data could leak to global scope
- **Privacy Risk:** User-scoped data could become globally visible
- **Undefined Behavior:** What does promoting 'global' memory mean?

**Recommended Fix:**
1. **Define Scope Hierarchy:** session < thread < user < global
2. **Validate Transitions:** Only allow upward promotion (narrower → broader)
3. **Block Invalid Transitions:** Throw error or warn on invalid scope changes
4. **Document Scope Semantics:** Clear documentation of what each scope means

**Priority:** P1 (Privacy/security concern)

---

### ⚠️ ISSUE #8: AUTO-FLUSH BUFFER SIDE EFFECT (SEVERITY: LOW)

**Location:** `/packages/memory/src/memory-service.ts:329-335`

**Description:**
When adding a memory, if the buffer reaches `flushThreshold` (50 items), it **automatically flushes to vector store**. This is a side effect of `addMemory()`.

**Code Evidence:**
```typescript
// Line 329-335
// Auto-flush if threshold reached
if (
  this.buffer.autoFlush &&
  this.buffer.items.length >= this.buffer.flushThreshold
) {
  await this.flushBuffer()
}
```

**Impact:**
- **Async Side Effect:** Adding memory #50 is much slower than #49
- **Unpredictable Timing:** Flush timing depends on buffer state
- **Potential Failure:** Network error during flush fails the addMemory call

**Assessment:**
This is a **reasonable design decision** for performance, but should be:
- Clearly documented
- Configurable (allow disabling auto-flush)
- Handled gracefully on error

**Recommended Fix:**
1. **Document Behavior:** Clearly state auto-flush in API docs
2. **Make Configurable:** Allow `autoFlush: false` in config
3. **Error Handling:** Don't fail addMemory on flush error (queue retry instead)
4. **Add Manual Flush:** Provide `flushBuffer()` public method

**Priority:** P2 (Documentation + configuration)

---

### ⚠️ ISSUE #9: RACE CONDITIONS IN CONCURRENT ADD/QUERY (SEVERITY: MEDIUM)

**Description:**
The memory service uses in-memory cache (`this.cache`) and buffer (`this.buffer`) that can be accessed concurrently without locking.

**Potential Race Conditions:**
1. **Add during flush:** Adding memory while flushing buffer
2. **Query during decay:** Querying while decay manager deletes memories
3. **Concurrent adds:** Multiple `addMemory()` calls updating buffer simultaneously
4. **Cache invalidation:** Vector store update vs cache read timing

**Impact:**
- **Data Inconsistency:** Cache and vector store out of sync
- **Lost Writes:** Concurrent adds may overwrite each other
- **Stale Reads:** Query returns deleted/outdated memories
- **Incorrect Counts:** Access count updates may be lost

**Recommended Fix:**
1. **Add Mutex/Lock:** Use async mutex for critical sections (add, flush, decay)
2. **Make Operations Atomic:** Batch updates to vector store
3. **Add Transaction Support:** Wrap operations in transactions (if supported by store)
4. **Document Concurrency Model:** Clarify if service is thread-safe

**Priority:** P1 (Data integrity)

---

### ⚠️ ISSUE #10: MISSING DELETION SEMANTICS (SEVERITY: HIGH)

**Description:**
Memory deletion is incomplete and lacks clear semantics:
- No bulk delete by scope
- No bulk delete by type
- No "delete all" operation
- No soft-delete option
- No delete verification
- No cascade delete (what about embeddings in vector store?)

**Impact:**
- **Privacy Risk:** Cannot fully delete user data
- **GDPR Compliance:** Right to erasure not fully implemented
- **Data Leakage:** Deleted memory may persist in vector store
- **No Clear Lifecycle:** When is memory truly gone?

**Recommended Fix:**
1. **Add Bulk Delete:** `deleteByScope(scope)`, `deleteByType(type)`, `deleteAll()`
2. **Add Soft Delete:** Optional `softDelete` flag with retention period
3. **Verify Deletion:** Confirm deletion from cache, buffer, and vector store
4. **Cascade Delete:** Ensure embeddings are also deleted from vector store
5. **Add Delete Events:** Emit events for audit trail
6. **Document Semantics:** Clear documentation of deletion behavior

**Priority:** P0 (Privacy/compliance requirement)

---

### ⚠️ ISSUE #11: INCONSISTENT DEFAULT SCOPES (SEVERITY: LOW)

**Description:**
Different parts of the system use different default memory scopes:

- `useMemoryStore`: defaults to `'session'` (line 78)
- `useConversationMemory.captureMessage`: uses `'session'` (line 543)
- `useConversationMemory.capturePreference`: uses `'global'` (line 559)
- No documented default in `MemoryService`

**Impact:**
- **Developer Confusion:** Unclear which scope to use
- **Inconsistent Behavior:** Different features use different defaults
- **Documentation Mismatch:** Docs may not match implementation

**Recommended Fix:**
1. **Define Default Scope:** Document canonical default (recommend: 'thread')
2. **Standardize Defaults:** Use same default across all APIs
3. **Make Explicit:** Require scope parameter (no defaults) for clarity
4. **Document Scope Meanings:** Clear explanation of when to use each scope

**Priority:** P2 (Developer experience)

---

### ⚠️ ISSUE #12: NO MEMORY SIZE/TOKEN LIMITS PER ITEM (SEVERITY: MEDIUM)

**Description:**
Individual memory items can be arbitrarily large:
- No max content length
- No max token count
- No max embedding dimension validation
- No max metadata size

**Impact:**
- **Storage Bloat:** Single memory could be megabytes
- **Query Performance:** Large memories slow down retrieval
- **Vector Store Issues:** Embedding dimensions may mismatch
- **API Failures:** Exceeding vector store size limits

**Recommended Fix:**
1. **Add Item Limits:** `maxContentLength` (default: 10k chars), `maxTokens` (default: 2k)
2. **Validate on Add:** Reject or auto-truncate oversized memories
3. **Warn on Large Items:** Log warning for memories > 1k tokens
4. **Provide Chunking:** Helper to split large content into multiple memories

**Priority:** P1 (Data quality)

---

### ⚠️ ISSUE #13: STALE CACHE PROBLEM (SEVERITY: MEDIUM)

**Description:**
The in-memory cache (`this.cache`) can become stale if:
- Vector store is modified externally
- Multiple MemoryService instances exist
- Browser storage (IndexedDB) is modified directly
- Decay manager deletes from vector store but not cache

**Impact:**
- **Stale Reads:** Query returns outdated data
- **Ghost Memories:** Cache contains memories deleted from vector store
- **Memory Leaks:** Cache grows indefinitely without bounds

**Recommended Fix:**
1. **Add Cache TTL:** Expire cache entries after N minutes
2. **Add Cache Invalidation:** Invalidate on delete/update operations
3. **Add Cache Size Limit:** LRU eviction when cache grows too large
4. **Sync on Query:** Option to bypass cache and read from vector store
5. **Add Cache Stats:** Monitor cache hit rate and staleness

**Priority:** P1 (Data consistency)

---

### ⚠️ ISSUE #14: RETRIEVAL ORDERING AMBIGUITY (SEVERITY: LOW)

**Description:**
Memory retrieval ordering is not fully specified:
- Vector search returns by similarity score
- Cache search sorts by `relevance * confidence`
- No secondary sort criteria
- Tie-breaking behavior unclear
- No option for chronological or reverse-chronological order

**Impact:**
- **Unpredictable Results:** Same query may return different order
- **Testing Difficulty:** Cannot assert exact order
- **Developer Surprise:** Order may not match expectations

**Recommended Fix:**
1. **Define Default Order:** Primary: relevance, Secondary: timestamp (desc)
2. **Add Sort Options:** Allow `sortBy: 'relevance' | 'recency' | 'importance' | 'confidence'`
3. **Add Sort Direction:** Allow `sortDirection: 'asc' | 'desc'`
4. **Document Ordering:** Clear documentation of sort behavior
5. **Stable Sort:** Ensure consistent tie-breaking

**Priority:** P2 (Predictability)

---

### ⚠️ ISSUE #15: NO MEMORY DEDUPLICATION (SEVERITY: MEDIUM)

**Description:**
The system has no deduplication mechanism:
- Same content can be added multiple times
- No similarity check before adding
- No merge operation for similar memories
- Duplicate memories waste storage and tokens

**Impact:**
- **Storage Waste:** Duplicate memories consume space
- **Token Waste:** Duplicate embeddings cost money
- **Query Pollution:** Same result returned multiple times
- **Confusing Stats:** Memory count inflated by duplicates

**Recommended Fix:**
1. **Add Similarity Check:** Before adding, check if similar memory exists (embedding distance < threshold)
2. **Add Merge Option:** When duplicate detected, merge metadata or update confidence
3. **Add Dedup Config:** `deduplication: { enabled: boolean, threshold: number }`
4. **Provide Manual Dedup:** `deduplicate()` method to clean existing memories

**Priority:** P2 (Optimization)

---

## SUMMARY OF CRITICAL ISSUES

**Total Issues:** 15
- **P0 (Critical/Blocker):** 5 issues
- **P1 (High):** 5 issues
- **P2 (Medium):** 5 issues

### P0 Issues (Must Fix):
1. Silent automatic memory writes (privacy/security)
2. Write side effects in read operations (correctness)
3. Three duplicate MemoryService implementations (architecture)
4. Unbounded memory growth (production safety)
5. Missing deletion semantics (privacy/compliance)

### P1 Issues (Should Fix):
6. Incomplete clear() implementation (broken API)
7. Missing scope validation (privacy/security)
8. Race conditions in concurrent operations (data integrity)
9. No memory size/token limits per item (data quality)
10. Stale cache problem (data consistency)

### P2 Issues (Nice to Fix):
11. Incomplete autoCapture option (misleading API)
12. Auto-flush buffer side effect (documentation)
13. Inconsistent default scopes (developer experience)
14. Retrieval ordering ambiguity (predictability)
15. No memory deduplication (optimization)

---

## PHASE 2 STATUS: COMPLETE

**Coverage:** All correctness issues documented
**Critical Findings:** 5 P0 blockers identified
**Next Phase:** Phase 3 - Privacy & Data Safety Review
