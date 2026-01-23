# Memory System - Streaming & Tool Interaction Audit

**Phase:** 4 - Streaming, Tool & Memory Interaction Audit
**Date:** 2026-01-22
**Status:** ISSUES IDENTIFIED

---

## EXECUTIVE SUMMARY

The memory system's interaction with streaming and tools is **mostly safe** but has **significant gaps**:

✅ **Good:** No mid-stream memory writes
✅ **Good:** Memory written only after message completion
❌ **Bad:** No handling of aborted streams
❌ **Bad:** Retry/regenerate can create duplicate memories
❌ **Bad:** No tool integration whatsoever

---

## STREAMING BEHAVIOR ANALYSIS

### ✅ POSITIVE FINDING: No Mid-Stream Writes

**Description:**
Memory writes occur **only after message completion** via the `onFinish` callback, not during streaming.

**Evidence:**
```typescript
// Line 180-238 in use-clarity-chat.ts
const enhancedOnFinish = React.useCallback(
  async (message: CoreMessage) => {
    await originalOnFinish?.(message)

    // Memory write happens here, AFTER message is complete
    if (memory?.enabled && memoryContext?.service) {
      await memoryContext.addMemory(content, 'episodic', 'thread', ...)
    }
  },
  [...]
)
```

**Assessment:**
This is **correct behavior**. Messages are only captured after they are fully received and processed.

**No Action Required** ✅

---

### 🚨 STREAMING ISSUE #1: ABORTED STREAMS STILL WRITE TO MEMORY (SEVERITY: HIGH)

**Description:**
When a user aborts a streaming response (via `stop()` function), the partial message may still be written to memory if `onFinish` is called.

**Problem:**
- Incomplete/truncated messages are stored as complete memories
- User intent to abort is ignored
- Memory contains partial, potentially nonsensical content

**Evidence:**
- `onFinish` callback does not check if stream was aborted
- No abort signal passed to memory write logic
- No differentiation between complete vs aborted messages

**Impact:**
- **Data Quality:** Partial responses pollute memory
- **User Confusion:** Aborted messages appear in context
- **Token Waste:** Incomplete messages generate embeddings

**Recommended Fix:**
1. **Add Abort Flag:**
   ```typescript
   interface MemoryMetadata {
     aborted?: boolean
     completionStatus: 'complete' | 'aborted' | 'error'
   }
   ```

2. **Skip Memory on Abort:**
   ```typescript
   const enhancedOnFinish = (message, { aborted }) => {
     if (aborted) {
       return // Don't store aborted messages
     }
     // Store complete messages only
   }
   ```

3. **Configuration Option:**
   ```typescript
   memory: {
     storeAbortedMessages: boolean // Default: false
   }
   ```

**Priority:** P1 (Data quality issue)

---

### 🚨 STREAMING ISSUE #2: RETRY/REGENERATE CREATES DUPLICATE MEMORIES (SEVERITY: HIGH)

**Description:**
If a user retries or regenerates a message (common UX pattern), the system may store multiple memories for the same conceptual message.

**Scenario:**
1. User sends: "What is TypeScript?"
2. Assistant responds: "TypeScript is..." (stored to memory)
3. User clicks "Regenerate"
4. Assistant responds: "TypeScript is a superset..." (stored AGAIN to memory)
5. Result: Two nearly identical memories for one question

**Evidence:**
- No deduplication logic before storing
- No check for existing similar memories
- Each `onFinish` call unconditionally adds memory

**Impact:**
- **Storage Bloat:** Duplicate memories waste space
- **Token Waste:** Duplicate embeddings cost money
- **Query Pollution:** Same content returned multiple times
- **Confusing Stats:** Memory count inflated by duplicates

**Recommended Fix:**
1. **Similarity Check Before Store:**
   ```typescript
   const storeMemory = async () => {
     // Check for recent similar memories
     const similar = await memoryContext.query({
       query: content,
       limit: 1,
       minConfidence: 0.95,
       timeRange: { start: new Date(Date.now() - 60000) } // Last 1 minute
     })

     if (similar.length > 0) {
       // Update existing instead of creating duplicate
       return memoryContext.updateMemory(similar[0].memory.id, {
         content, // Update with new content
         accessCount: similar[0].memory.accessCount + 1,
         updatedAt: new Date()
       })
     }

     // No similar memory, create new
     return await memoryContext.addMemory(...)
   }
   ```

2. **Add Regeneration Metadata:**
   ```typescript
   metadata: {
     messageId: message.id,
     regenerationOf?: string, // ID of original message
     regenerationCount: number
   }
   ```

3. **Configuration:**
   ```typescript
   memory: {
     deduplicate: boolean // Default: true
     deduplicateThreshold: number // Default: 0.95
     deduplicateWindow: number // Default: 60000 (1 minute)
   }
   ```

**Priority:** P1 (Data quality + cost issue)

---

### ⚠️ STREAMING ISSUE #3: NO ERROR STATE HANDLING (SEVERITY: MEDIUM)

**Description:**
When a stream fails with an error, it's unclear if the partial message is stored to memory.

**Problem:**
- No explicit error handling in memory write
- Partial error messages may be stored
- Error state not captured in metadata

**Recommended Fix:**
1. **Add Error Metadata:**
   ```typescript
   metadata: {
     completionStatus: 'error',
     errorMessage?: string
   }
   ```

2. **Configuration:**
   ```typescript
   memory: {
     storeErrorMessages: boolean // Default: false
   }
   ```

**Priority:** P2 (Edge case handling)

---

### ⚠️ STREAMING ISSUE #4: RETRY LOGIC MAY DUPLICATE WRITES (SEVERITY: LOW)

**Description:**
The memory storage operation has retry logic (line 207-215 in use-clarity-chat.ts):

```typescript
if (memory.retryOnError !== false) {
  await retryOperation(
    storeMemory,
    memory.maxRetryAttempts || 2,
    500
  )
}
```

**Problem:**
If the first attempt **appears to fail** but actually succeeds (network flakiness), retries could create duplicate memories.

**Assessment:**
This is a **minor concern** because:
- Memory IDs are unique (generated client-side)
- Vector store should handle ID conflicts
- But if ID generation is time-based, collisions are possible

**Recommended Fix:**
1. **Idempotent Operations:** Use deterministic IDs based on content hash
2. **Deduplication:** Check before retry if memory was actually stored
3. **Exponential Backoff:** Reduce chance of conflicts

**Priority:** P3 (Low likelihood edge case)

---

## TOOL INTERACTION ANALYSIS

### 🚨 TOOL ISSUE #1: NO TOOL INTEGRATION WHATSOEVER (SEVERITY: HIGH)

**Description:**
The memory system has **zero integration with tool calling**:
- Tool invocations are not captured
- Tool outputs are not stored
- Tool context is not available to LLM
- Tool results don't enrich memory

**Evidence:**
- No `onToolCall` handler in use-clarity-chat.ts
- No tool-related logic in memory service
- Documentation exists (`MEMORY_TOOLS.md`) but not implemented
- Examples in docs show manual tool storage (not automatic)

**Impact:**
- **Lost Context:** Tool results not available in future conversations
- **Incomplete Memory:** User requests satisfied by tools not remembered
- **Manual Burden:** Developers must manually store tool results
- **Inconsistent Experience:** Messages auto-stored, tools not

**Documentation Evidence:**
The file `/packages/react/src/docs/MEMORY_TOOLS.md` contains examples of manual tool memory storage:

```typescript
// 4. Store tool result in memory
await memoryService.addMemory(
  `Tool: ${toolName}\nInput: ${JSON.stringify(params)}\nOutput: ${output}`,
  'episodic',
  'thread',
  {
    toolName,
    toolParams: params,
    toolOutput: output
  }
)
```

This is **manual, not automatic**. Developers must remember to do this.

**Recommended Fix:**

1. **Auto-Capture Tool Calls (Optional):**
   ```typescript
   memory: {
     captureTool Calls: boolean // Default: false
     captureToolOutputs: boolean // Default: false
     toolCaptureFilter?: (toolName: string) => boolean
   }
   ```

2. **Tool Memory Middleware:**
   ```typescript
   const enhancedTools = {
     ...tools,
     [toolName]: async (params) => {
       const result = await tools[toolName](params)

       if (memory?.captureToolOutputs) {
         await memoryContext.addMemory(
           `Tool: ${toolName}\nResult: ${JSON.stringify(result)}`,
           'episodic',
           'thread',
           {
             toolName,
             toolParams: params,
             toolResult: result,
             timestamp: new Date().toISOString()
           },
           {
             priority: 'medium'
           }
         )
       }

       return result
     }
   }
   ```

3. **Selective Capture:**
   - Allow per-tool configuration
   - Capture only important tools (database queries, API calls)
   - Skip utility tools (formatDate, etc.)

4. **Token Budget Awareness:**
   - Tool outputs can be large
   - Apply token limits per tool memory
   - Auto-summarize large outputs

**Priority:** P1 (Feature gap)

---

### ⚠️ TOOL ISSUE #2: NO TOOL CONTEXT RETRIEVAL (SEVERITY: MEDIUM)

**Description:**
Even if tools are manually stored to memory, there's no way to retrieve tool-specific context efficiently.

**Problem:**
- No `getToolHistory(toolName)` method
- No tool-specific querying
- Tool memories mixed with message memories
- No tool call replay capability

**Recommended Fix:**
1. **Tool-Specific Queries:**
   ```typescript
   interface MemoryQuery {
     toolName?: string
     toolType?: 'api' | 'database' | 'computation' | 'external'
     includeToolParams?: boolean
     includeToolOutputs?: boolean
   }
   ```

2. **Tool Memory Type:**
   ```typescript
   type MemoryType =
     | 'episodic'
     | 'semantic'
     | 'procedural'
     | 'short-term'
     | 'profile'
     | 'tool' // ✨ New type for tool calls
   ```

3. **Tool History API:**
   ```typescript
   const toolHistory = await memory.getToolHistory({
     toolName: 'fetchUserData',
     limit: 10,
     includeOutputs: true
   })
   ```

**Priority:** P2 (Enhancement)

---

### ⚠️ TOOL ISSUE #3: NO TOOL MEMORY BUDGET (SEVERITY: LOW)

**Description:**
Tools can generate very large outputs that would consume entire memory budget if stored.

**Example:**
- Tool returns 100KB JSON response
- Entire response stored to memory
- Exceeds token budget
- Crowds out other important memories

**Recommended Fix:**
1. **Tool Memory Limits:**
   ```typescript
   memory: {
     toolMemoryLimits: {
       maxTokensPerTool: 500, // Max tokens for single tool memory
       maxTotalToolTokens: 5000, // Max total tokens for all tool memories
       autoSummarize: true, // Auto-summarize large outputs
     }
   }
   ```

2. **Smart Tool Storage:**
   - Store only tool name, params, and summary of output
   - Store full output only for small results
   - Compress large JSON/XML outputs

**Priority:** P2 (Optimization)

---

## STREAMING EDGE CASES

### Edge Case #1: Concurrent Streams

**Scenario:** Multiple messages streaming simultaneously (rare but possible)

**Current Behavior:** Each message's `onFinish` called independently

**Issue:** Race conditions in memory writes (see Correctness Issue #9)

**Recommended:** Implement mutex/queue for memory writes

---

### Edge Case #2: Very Long Streams

**Scenario:** Streaming response with 10,000+ tokens

**Current Behavior:** Entire response stored to memory

**Issue:** Single memory exceeds reasonable size (see Correctness Issue #12)

**Recommended:**
- Chunk very long responses
- Auto-summarize before storing
- Warn on large memories

---

### Edge Case #3: Binary/Non-Text Streams

**Scenario:** Streaming images, audio, or binary data

**Current Behavior:** `extractTextContent()` may fail or return garbage

**Issue:** Non-text content stored as text

**Recommended:**
- Skip memory for non-text messages
- Support metadata-only memories
- Add MIME type filtering

---

## MEMORY WRITE TIMING ANALYSIS

### Current Flow

```
User sends message
  ↓
Request sent to API
  ↓
Response starts streaming
  ↓
Tokens arrive chunk by chunk
  ↓
Stream completes
  ↓
onFinish() called
  ↓
Memory write initiated ← Only writes here
  ↓
Memory stored to vector store
```

**Assessment:** ✅ Correct - no mid-stream writes

---

### Abort Flow (PROBLEMATIC)

```
User sends message
  ↓
Response starts streaming
  ↓
User clicks "Stop"
  ↓
Stream aborted
  ↓
onFinish() called (?)  ← Still called on abort?
  ↓
Partial memory written ← Problem!
```

**Assessment:** ❌ Needs investigation - does `onFinish` fire on abort?

---

### Error Flow (UNCLEAR)

```
User sends message
  ↓
Response starts streaming
  ↓
Error occurs (network, server, etc.)
  ↓
Stream fails
  ↓
onFinish() called (?)  ← Still called on error?
  ↓
Partial memory written (?)
```

**Assessment:** ⚠️ Needs clarification

---

## RECOMMENDATIONS SUMMARY

### Immediate (P0-P1)

1. **Add Abort Handling** - Don't store aborted messages
2. **Add Deduplication** - Prevent duplicate memories on retry/regenerate
3. **Add Tool Integration** - Auto-capture tool calls (configurable)
4. **Handle Errors** - Don't store error/partial messages

### Short-term (P2)

5. **Add Tool Queries** - Tool-specific memory retrieval
6. **Add Tool Limits** - Token budget for tool memories
7. **Add Error Metadata** - Capture completion status

### Long-term (P3)

8. **Idempotent Retries** - Use content hashes for IDs
9. **Chunking** - Handle very long responses
10. **Binary Support** - Handle non-text content

---

## TESTING CHECKLIST

### Streaming Tests Needed

- [ ] Test memory write on normal stream completion
- [ ] Test memory write on stream abort (stop button)
- [ ] Test memory write on stream error
- [ ] Test retry behavior (ensure no duplicates)
- [ ] Test regenerate behavior (ensure no duplicates)
- [ ] Test concurrent streams (race conditions)
- [ ] Test very long streams (>10k tokens)
- [ ] Test empty streams (no content)

### Tool Tests Needed

- [ ] Test manual tool memory storage
- [ ] Test tool memory retrieval
- [ ] Test tool memory deduplication
- [ ] Test large tool outputs
- [ ] Test tool error handling
- [ ] Test tool memory budget limits

---

## CONFIGURATION RECOMMENDATIONS

### Streaming-Aware Memory Config

```typescript
interface StreamingMemoryConfig {
  // Abort handling
  storeAbortedMessages: boolean // Default: false
  abortGracePeriod: number // ms to wait before considering aborted

  // Deduplication
  deduplicate: boolean // Default: true
  deduplicateThreshold: number // Similarity threshold (0-1)
  deduplicateWindow: number // Time window in ms

  // Error handling
  storeErrorMessages: boolean // Default: false
  storePartialMessages: boolean // Default: false

  // Tool integration
  captureToolCalls: boolean // Default: false
  captureToolOutputs: boolean // Default: false
  toolCaptureFilter?: (toolName: string) => boolean
  toolMemoryLimits: {
    maxTokensPerTool: number
    maxTotalToolTokens: number
    autoSummarize: boolean
  }

  // Quality gates
  minMessageLength: number // Don't store very short messages
  maxMessageLength: number // Auto-chunk very long messages
  filterEmptyMessages: boolean // Skip messages with no content
}
```

---

## PHASE 4 STATUS: COMPLETE

**Streaming Safety:** ✅ Mostly safe (writes after completion only)
**Critical Issues:** 2 (aborted streams, duplicates)
**Tool Integration:** ❌ Not implemented
**Recommended Actions:** 10 fixes/enhancements identified

**Next Phase:** Phase 5 - Retrieval & Context Assembly Audit
