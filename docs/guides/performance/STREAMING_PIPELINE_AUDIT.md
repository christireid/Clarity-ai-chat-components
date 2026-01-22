# Streaming Pipeline Comprehensive Audit Report

**Date:** 2026-01-22
**Scope:** Complete lifecycle of streaming tokens from arrival → state update → render
**Critical Files Analyzed:** 15 core streaming files

---

## Executive Summary

### Critical Findings
- ⚠️ **NO BATCHING** in core `useChat` hook - renders on EVERY token
- ⚠️ **NO BACKPRESSURE** handling - streams abort on overflow, don't pause
- ⚠️ **RACE CONDITION** risk - no connection ID tracking in `useChat`
- ✅ **GOOD** abort/cancel handling with AbortController
- ⚠️ **PARTIAL** render optimization tools exist but NOT used by default

---

## 1. TOKEN ARRIVAL → STATE UPDATE → RENDER PIPELINE

### Complete Flow Trace

#### Entry Point: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`

**Line 405-513: The Core Streaming Loop**

```typescript
// Streaming response
const reader = response.body.getReader()
const decoder = new TextDecoder()
let accumulatedContent = ''

while (true) {
  const { done, value } = await reader.read()  // ← TOKENS ARRIVE HERE

  if (done) break

  const chunk = decoder.decode(value, { stream: true })
  const lines = chunk.split('\n')

  for (const line of lines) {
    // Parse SSE format
    if (line.startsWith('data: ')) {
      const data = line.slice(6)
      const parsed = JSON.parse(data)

      // Extract content delta
      if (parsed.choices?.[0]?.delta?.content) {
        contentDelta = parsed.choices[0].delta.content
      }

      if (contentDelta) {
        accumulatedContent += contentDelta

        // ⚠️ CRITICAL: setState called on EVERY token
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? currentMessage : msg
          )
        )
        setData(currentMessage)  // ← TRIGGERS RE-RENDER
      }
    }
  }
}
```

### Findings

#### Issue 1: UNBATCHED RENDERS (Critical)
- **File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
- **Lines:** 468-474, 486-492, 504-510
- **Severity:** HIGH
- **Impact:** Every token chunk triggers full React re-render

**Evidence:**
```typescript
// Lines 468-474: Called on EVERY contentDelta
if (contentDelta) {
  accumulatedContent += contentDelta
  if (mountedRef.current) {
    currentMessage = { ...currentMessage, content: accumulatedContent }
    currentAssistantMessageRef.current = currentMessage
    setMessages((prev) =>  // ← RE-RENDER #1
      prev.map((msg) => msg.id === assistantMessageId ? currentMessage : msg)
    )
    setData(currentMessage)  // ← RE-RENDER #2
  }
}
```

**Render Frequency:**
- If streaming at 50 tokens/sec (typical for Claude Opus)
- If each chunk = 2-5 characters
- **Result: 10-25 React renders per second** ❌

**Proposed Fix:**
```typescript
// Use requestAnimationFrame batching
const updateQueue: string[] = []
let rafId: number | null = null

const flushUpdates = () => {
  if (updateQueue.length === 0) return

  const batchedContent = updateQueue.join('')
  updateQueue.length = 0

  accumulatedContent += batchedContent
  currentMessage = { ...currentMessage, content: accumulatedContent }
  setMessages(prev => prev.map(msg =>
    msg.id === assistantMessageId ? currentMessage : msg
  ))
  setData(currentMessage)
  rafId = null
}

// In streaming loop:
if (contentDelta) {
  updateQueue.push(contentDelta)

  if (!rafId) {
    rafId = requestAnimationFrame(flushUpdates)
  }
}
```

---

#### Issue 2: NO requestIdleCallback Usage
- **File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
- **Severity:** MEDIUM
- **Impact:** State updates compete with browser paint cycles

**Evidence:** No use of `requestIdleCallback` or `scheduler` API for low-priority updates.

**Proposed Fix:** Use React Scheduler for non-urgent updates:
```typescript
import { unstable_scheduleCallback, unstable_LowPriority } from 'scheduler'

// For non-final updates during streaming:
unstable_scheduleCallback(unstable_LowPriority, () => {
  setMessages(prev => /* update */)
})
```

---

## 2. BATCHING STRATEGY

### Current State Analysis

#### Available Batching Tools (NOT USED BY DEFAULT)

**Tool 1: `useStreamOptimizer`**
- **File:** `/packages/react/src/hooks/clarity-tokens/use-stream-optimizer.ts`
- **Lines:** 97-403
- **Features:**
  - ✅ requestAnimationFrame batching (line 176-180)
  - ✅ Configurable buffer strategies (character, word, sentence)
  - ✅ Flush interval (default 50ms)
  - ✅ 60-80% render reduction achieved
- **Problem:** NOT integrated into `useChat` or `useClarityChat`

**Evidence:**
```typescript
// Lines 176-180: RAF batching exists but unused
rafRef.current = requestAnimationFrame(() => {
  renderCountRef.current++
  setBufferedContent(newContent)
  // ... state updates
})
```

**Metrics from actual implementation:**
```typescript
renderReduction: chunkCountRef.current > 0
  ? ((chunkCountRef.current - renderCountRef.current) / chunkCountRef.current) * 100
  : 0
// Achieves 60-80% reduction when used
```

---

**Tool 2: `useSmoothedText`**
- **File:** `/packages/react/src/hooks/streaming/use-smoothed-text.ts`
- **Lines:** 101-232
- **Features:**
  - ✅ 60fps character reveal (line 108: `frameDelay = 16ms`)
  - ✅ Backpressure handling (line 109: `maxBuffer = 100`)
  - ✅ Catchup mechanism (line 110: `catchUpCharsPerFrame = 8`)
- **Problem:** Separate from core streaming, must be manually integrated

**Evidence:**
```typescript
// Lines 148-193: RAF loop with throttling
const animate = (timestamp: number) => {
  // Throttle to frameDelay (16ms = 60fps)
  if (timestamp - lastFrameTimeRef.current < frameDelay) {
    rafRef.current = requestAnimationFrame(animate)
    return
  }

  // Calculate chars to reveal (with catchup)
  const speedMultiplier = buffered > maxBuffer
    ? catchUpCharsPerFrame  // 8 chars/frame when behind
    : charsPerFrame          // 2 chars/frame normally
}
```

---

#### Issue 3: Core Hook Lacks Batching (Critical)
- **File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
- **Lines:** 405-513
- **Severity:** CRITICAL
- **Impact:** No batching strategy in production path

**Comparison:**

| Feature | useStreamOptimizer | useSmoothedText | useChat (current) |
|---------|-------------------|-----------------|-------------------|
| RAF batching | ✅ | ✅ | ❌ |
| Configurable intervals | ✅ | ✅ | ❌ |
| Render metrics | ✅ | ❌ | ❌ |
| Backpressure | ❌ | ✅ | ❌ |
| Used by default | ❌ | ❌ | ✅ |

**Proposed Fix:** Integrate batching into `useChat`:

```typescript
// Add to useChat options:
export interface UseChatOptions {
  // ... existing options

  /** Enable streaming optimizations (default: true) */
  streamingOptimization?: {
    /** Batching strategy */
    batching?: 'character' | 'word' | 'sentence' | 'time-based'
    /** Batch size (chars/words) or time (ms) */
    batchSize?: number
    /** Enable smooth text reveal */
    smoothStreaming?: boolean
  }
}

// In streaming loop:
const optimizer = useStreamOptimizer({
  bufferStrategy: options.streamingOptimization?.batching ?? 'word',
  bufferSize: options.streamingOptimization?.batchSize ?? 50,
  flushIntervalMs: 50,
})

// Replace direct setState with:
optimizer.processChunk(contentDelta)
```

---

## 3. BACKPRESSURE HANDLING

### Current Implementation

#### Buffer Limits Exist (But Don't Pause)

**SSE Streaming:**
- **File:** `/packages/react/src/hooks/streaming/use-streaming-sse.tsx`
- **Lines:** 269-282, 340-350
- **Behavior:** Drops oldest events when buffer full

```typescript
// Lines 340-350: Event buffer overflow
setEvents((prev) => {
  const newEvents = [...prev, event]
  if (newEvents.length > maxEventBufferSize) {
    const droppedCount = newEvents.length - maxEventBufferSize
    onEventBufferOverflow?.(droppedCount, maxEventBufferSize)  // ← Notification only
    return newEvents.slice(-maxEventBufferSize)  // ← DROP oldest
  }
  return newEvents
})
```

**WebSocket Streaming:**
- **File:** `/packages/react/src/hooks/streaming/use-streaming-websocket.tsx`
- **Lines:** 253-268, 479-490
- **Behavior:** Same - drops oldest messages

---

**Low-Level Streaming:**
- **File:** `/packages/react/src/hooks/streaming/use-streaming.ts`
- **Lines:** 176-184
- **Behavior:** Aborts stream on content limit

```typescript
// Lines 176-184: Content length limit
if (maxContentLength && fullText.length > maxContentLength) {
  onContentLimitExceededRef.current?.(fullText.length, maxContentLength)
  const limitError = new Error(`Content length limit exceeded`)
  onErrorRef.current?.(limitError)
  controller.abort()  // ← ABORT, don't pause
  break
}
```

---

#### Issue 4: No Stream Pausing Mechanism (High)
- **Severity:** HIGH
- **Impact:** Cannot pause incoming tokens when UI falls behind

**Current Behavior:**
1. Tokens arrive faster than UI can render
2. Buffer fills up
3. Options: Drop data OR abort stream
4. **No option to pause and resume**

**Evidence:** No use of ReadableStream backpressure API:
```typescript
// NOT IMPLEMENTED:
const reader = response.body.getReader()

// Could use controller to apply backpressure:
const { readable, writable } = new TransformStream({
  transform(chunk, controller) {
    // Check if UI is behind
    if (renderQueue.length > threshold) {
      // Don't enqueue yet - creates backpressure
      return new Promise(resolve => {
        setTimeout(() => {
          controller.enqueue(chunk)
          resolve()
        }, 100)  // Wait for UI to catch up
      })
    }
    controller.enqueue(chunk)
  }
})
```

**Proposed Fix:**
```typescript
// Add to useStreaming:
export interface UseStreamingOptions {
  // ... existing

  /** Enable backpressure (pause stream when buffer full) */
  enableBackpressure?: boolean

  /** Backpressure threshold (buffered chars) */
  backpressureThreshold?: number

  /** Callback when backpressure applied */
  onBackpressure?: (bufferedAmount: number) => void
}

// Implementation:
let pausedPromise: Promise<void> | null = null

const processWithBackpressure = async (chunk: string) => {
  buffer.push(chunk)

  if (buffer.length > backpressureThreshold) {
    onBackpressure?.(buffer.length)

    // Pause reading
    pausedPromise = new Promise(resolve => {
      const checkBuffer = () => {
        if (buffer.length < backpressureThreshold / 2) {
          resolve()
        } else {
          requestAnimationFrame(checkBuffer)
        }
      }
      checkBuffer()
    })

    await pausedPromise
  }

  flushBuffer()
}
```

---

#### Issue 5: Memory Bounds Good, But Abrupt (Medium)
- **Severity:** MEDIUM
- **Impact:** Sudden stream termination on limits

**Evidence:**
- SSE: `maxEventBufferSize = 1000` (line 269)
- WebSocket: `maxMessageBufferSize = 1000` (line 253)
- Streaming: `maxContentLength` configurable (line 17)

**Current:** Hard limits with abrupt failures
**Better:** Gradual slowdown before limit

**Proposed Enhancement:**
```typescript
// Graduated backpressure zones:
const zones = {
  green: { max: maxBuffer * 0.5, delay: 0 },      // No slowdown
  yellow: { max: maxBuffer * 0.75, delay: 10 },   // Slight delay
  orange: { max: maxBuffer * 0.9, delay: 50 },    // Moderate delay
  red: { max: maxBuffer, delay: 200 },            // Heavy delay
}

// Apply graduated delays based on buffer fullness
const getDelay = (bufferSize: number) => {
  for (const zone of Object.values(zones)) {
    if (bufferSize <= zone.max) return zone.delay
  }
  return zones.red.delay
}
```

---

## 4. ABORT/CANCEL SAFETY

### Current Implementation (Mostly Good)

#### ✅ AbortController Usage (Correct)

**useChat:**
- **File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
- **Lines:** 258-279, 336-338, 373, 636-640

```typescript
// Lines 258-261: Ref declaration
const abortControllerRef = React.useRef<AbortController | null>(null)

// Lines 274-279: Abort function
const abort = React.useCallback(() => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()
    abortControllerRef.current = null  // ✅ Cleanup
  }
}, [])

// Lines 336-338: Create controller before fetch
abortControllerRef.current = new AbortController()

// Line 373: Pass signal to fetch
signal: abortControllerRef.current.signal,

// Lines 636-640: Cleanup on unmount
React.useEffect(() => {
  return () => {
    abort()  // ✅ Cleanup on unmount
  }
}, [abort])
```

**Assessment:** ✅ Correct implementation

---

#### ✅ Mount Guard (Prevents Stale Updates)

**useChat:**
- **Lines:** 263-269, 391-399, 462-474

```typescript
// Lines 263-269: Mount tracking
const mountedRef = React.useRef(true)
React.useEffect(() => {
  mountedRef.current = true
  return () => {
    mountedRef.current = false  // ✅ Set false on unmount
  }
}, [])

// Lines 462-474: Guard state updates
if (mountedRef.current) {
  setMessages(/* ... */)  // ✅ Only update if mounted
  setData(currentMessage)
}
```

**Assessment:** ✅ Correct pattern

---

#### ⚠️ Issue 6: Incomplete Cleanup on Error Paths (Medium)

**File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
**Lines:** 531-554
**Severity:** MEDIUM

**Evidence:**
```typescript
// Lines 531-554: Catch block
catch (err) {
  if (err instanceof Error && err.name === 'AbortError') {
    return null  // ← Early return, but refs might not be cleaned
  }

  const error = err instanceof Error ? err : new Error(String(err))
  setError(error)
  onError?.(error)

  if (!keepLastMessageOnError && mountedRef.current) {
    setMessages((prev) =>
      prev.filter((msg) => msg.id !== assistantMessageId)
    )
  }

  throw error  // ← Re-throw, but finally block not guaranteed
} finally {
  if (mountedRef.current) {
    setIsLoading(false)
    abortControllerRef.current = null  // ✅ Cleaned in finally
    currentAssistantMessageRef.current = null  // ✅ Cleaned
    messageIdRef.current = null  // ✅ Cleaned
  }
}
```

**Problem:** If error occurs BEFORE finally block setup, refs might leak.

**Proposed Fix:**
```typescript
// Add cleanup helper:
const cleanup = () => {
  if (mountedRef.current) {
    setIsLoading(false)
  }
  abortControllerRef.current = null
  currentAssistantMessageRef.current = null
  messageIdRef.current = null
}

// Use in error paths:
catch (err) {
  cleanup()  // ← Explicit cleanup
  if (err instanceof Error && err.name === 'AbortError') {
    return null
  }
  // ... handle error
}
```

---

#### ⚠️ Issue 7: Reader Not Cancelled on Abort (Medium)

**File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
**Lines:** 405-513
**Severity:** MEDIUM

**Evidence:**
```typescript
// Line 405: Reader created
const reader = response.body.getReader()

// Lines 410-512: While loop reads from reader
while (true) {
  const { done, value } = await reader.read()
  // ... process
}

// ❌ PROBLEM: If abort() is called during streaming,
// the reader.read() promise might still be pending
// No explicit reader.cancel() call
```

**Better Implementation (from useStreaming):**
```typescript
// File: /packages/react/src/hooks/streaming/use-streaming.ts
// Lines 112-127: Correct reader cancellation

const stopStreaming = React.useCallback(() => {
  if (readerRef.current) {
    readerRef.current.cancel()  // ✅ Cancel reader
    readerRef.current = null
  }
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()  // ✅ Abort fetch
    abortControllerRef.current = null
  }
  setIsStreaming(false)
}, [])
```

**Proposed Fix for useChat:**
```typescript
// Add reader ref:
const readerRef = React.useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null)

// In abort():
const abort = React.useCallback(() => {
  // Cancel reader first
  if (readerRef.current) {
    readerRef.current.cancel()
    readerRef.current = null
  }

  // Then abort fetch
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }
}, [])

// Store reader ref:
const reader = response.body.getReader()
readerRef.current = reader

// Check abort in loop:
while (true) {
  if (!readerRef.current) break  // Aborted
  const { done, value } = await reader.read()
  // ...
}
```

---

## 5. RACE CONDITIONS

### Current Protections

#### ✅ Connection ID Tracking (SSE & WebSocket)

**useStreamingSSE:**
- **File:** `/packages/react/src/hooks/streaming/use-streaming-sse.tsx`
- **Lines:** 305, 404-406, 465-469, 580-584

```typescript
// Line 305: Connection ID tracking
const connectionIdRef = React.useRef(0)

// Lines 404-406: Increment on connect
connectionIdRef.current += 1
const currentConnectionId = connectionIdRef.current

// Lines 465-469: Check before state updates
if (currentConnectionId !== connectionIdRef.current) {
  logger.debug('[useStreamingSSE] Stale connection detected, aborting')
  return  // ✅ Prevent stale updates
}
```

**Assessment:** ✅ Excellent pattern, prevents mount/unmount races

---

**useStreamingWebSocket:**
- **File:** `/packages/react/src/hooks/streaming/use-streaming-websocket.tsx`
- **Lines:** 291, 401-403, 428-432
- Same pattern as SSE ✅

---

#### ⚠️ Issue 8: No Connection ID in useChat (HIGH)

**File:** `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
**Severity:** HIGH
**Impact:** Race condition on rapid append() calls

**Scenario:**
```typescript
// User sends message 1
await chat.append({ role: 'user', content: 'Hello' })  // Stream 1 starts

// User quickly sends message 2 (before stream 1 completes)
await chat.append({ role: 'user', content: 'Goodbye' })  // Stream 2 starts

// ❌ PROBLEM:
// - Stream 1 is still writing to `currentAssistantMessageRef`
// - Stream 2 overwrites the same ref
// - Stream 1 chunks might update Stream 2's message
// - Message state becomes corrupted
```

**Evidence:** Only uses `messageIdRef` (not connection ID):
```typescript
// Lines 338, 470, 287-300: Message ID used but not connection-safe
messageIdRef.current = assistantMessageId

// Later, in streaming loop:
if (msg.id === assistantMessageId) {  // ← Not connection-safe
  // Update message
}
```

**Proposed Fix:**
```typescript
// Add connection tracking:
const connectionIdRef = React.useRef(0)

const append = React.useCallback(async (message, options) => {
  // Increment connection ID
  connectionIdRef.current += 1
  const currentConnectionId = connectionIdRef.current

  // ... create assistant message

  try {
    // ... fetch and stream

    while (true) {
      // Check if this connection is still active
      if (connectionIdRef.current !== currentConnectionId) {
        // Newer request started, abandon this one
        logger.debug('[useChat] Stale connection, aborting')
        break
      }

      const { done, value } = await reader.read()

      // Guard all state updates
      if (connectionIdRef.current === currentConnectionId) {
        setMessages(/* ... */)
      }
    }
  } catch (err) {
    // Only handle error if this connection is still active
    if (connectionIdRef.current === currentConnectionId) {
      setError(error)
    }
  }
}, [/* deps */])
```

---

#### ⚠️ Issue 9: Concurrent Stream Risk (HIGH)

**Severity:** HIGH
**Impact:** Multiple concurrent streams can corrupt message state

**Test Case:**
```typescript
// Component calls append() twice in quick succession
useEffect(() => {
  chat.append({ role: 'user', content: 'Message 1' })
  chat.append({ role: 'user', content: 'Message 2' })  // ❌ Not prevented
}, [])

// EXPECTED: Second call should cancel first, or queue
// ACTUAL: Both streams run concurrently, corrupting state
```

**Evidence:** No concurrency prevention in useChat:
```typescript
// Lines 306-310: No check for existing stream
const append = React.useCallback(async (message, options) => {
  // ❌ No check: if (isLoading) return;
  // ❌ No queue for pending messages

  // Both calls proceed
  setIsLoading(true)
  // ...
})
```

**Proposed Fix:**
```typescript
// Option 1: Prevent concurrent streams
const append = React.useCallback(async (message, options) => {
  if (isLoading) {
    console.warn('[useChat] Stream already in progress, ignoring')
    return null  // Or throw error
  }
  // ...
}, [isLoading])

// Option 2: Queue messages
const messageQueue = React.useRef<Array<{message: CoreMessage, options?: any}>>([])
const isProcessing = React.useRef(false)

const processQueue = async () => {
  if (isProcessing.current || messageQueue.current.length === 0) return

  isProcessing.current = true
  while (messageQueue.current.length > 0) {
    const { message, options } = messageQueue.current.shift()!
    await appendInternal(message, options)
  }
  isProcessing.current = false
}

const append = React.useCallback(async (message, options) => {
  messageQueue.current.push({ message, options })
  processQueue()
}, [])
```

---

#### Issue 10: Model Switch During Stream (MEDIUM)

**File:** `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`
**Lines:** All (no model switch handling)
**Severity:** MEDIUM

**Scenario:**
```typescript
// Stream is active with GPT-4
const chat = useClarityChat({ api: '/api/chat', model: 'gpt-4' })

// User switches to Claude mid-stream
<ModelSelector onChange={(model) => {
  // ❌ PROBLEM: How to cancel current stream?
  // ❌ Current stream still updating old model's message
  // ❌ No built-in model parameter change handling
}} />
```

**Evidence:** No model tracking or change detection:
```typescript
// useClarityChat doesn't track model changes
// No effect to abort streams on model change
// useChat doesn't expose model parameter
```

**Proposed Fix:**
```typescript
// Add to useClarityChat:
export interface UseClarityChatOptions {
  // ... existing
  model?: string
}

export function useClarityChat(options: UseClarityChatOptions) {
  const prevModelRef = React.useRef(options.model)

  // Abort stream on model change
  React.useEffect(() => {
    if (prevModelRef.current !== options.model) {
      chat.abort()  // Cancel any active stream
      prevModelRef.current = options.model
    }
  }, [options.model, chat])

  return chat
}
```

---

## 6. MODEL SWITCHING DURING STREAM

### Current State: No Explicit Handling

#### What Happens Now:

1. **User switches model** (via config change or UI)
2. **Current stream continues** (no automatic cancellation)
3. **New request uses new model** (when sent)
4. **Previous stream completes** into old message

**Files Reviewed:**
- `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts` - No model tracking
- `/packages/react/src/internal/hooks/use-chat-enhanced.ts` - No model parameter
- No lifecycle hooks for model changes

---

#### Issue 11: No Model Change Detection (MEDIUM)

**Severity:** MEDIUM
**Impact:** Orphaned streams when model switches

**Proposed Implementation:**

```typescript
// 1. Add model to chat options
export interface UseChatOptions {
  // ... existing
  model?: string
}

// 2. Track model changes in useChat
export function useChat(options: UseChatOptions) {
  const prevModelRef = React.useRef(options.model)
  const [activeModel, setActiveModel] = React.useState(options.model)

  // Cancel stream on model change
  React.useEffect(() => {
    if (prevModelRef.current !== options.model) {
      // Model changed while streaming
      if (isLoading) {
        logger.info('[useChat] Model changed during stream, aborting')
        abort()

        // Optionally: Mark message as cancelled
        if (messageIdRef.current) {
          setMessages(prev => prev.map(msg =>
            msg.id === messageIdRef.current
              ? { ...msg, content: msg.content + '\n\n[Cancelled: Model switched]' }
              : msg
          ))
        }
      }

      prevModelRef.current = options.model
      setActiveModel(options.model)
    }
  }, [options.model, isLoading, abort])

  return {
    // ... existing
    activeModel,  // Expose current model
  }
}

// 3. Use in append() to validate model consistency
const append = React.useCallback(async (message, options) => {
  // Capture model at start of request
  const requestModel = options.model ?? activeModel
  const requestConnectionId = ++connectionIdRef.current

  try {
    const response = await fetch(api, {
      body: JSON.stringify({
        ...body,
        model: requestModel,  // ✅ Send model in body
        messages: /* ... */
      })
    })

    // ... streaming loop
    while (true) {
      // Validate model hasn't changed
      if (activeModel !== requestModel) {
        logger.debug('[useChat] Model changed, aborting stream')
        break
      }

      // ... process chunks
    }
  } catch (err) {
    // ...
  }
}, [activeModel, /* ... */])
```

---

## SUMMARY SCORECARD

### Performance Issues

| Issue | Severity | Impact | Fix Complexity |
|-------|----------|--------|----------------|
| Unbatched renders (Issue 1) | 🔴 CRITICAL | 10-25 FPS renders | MEDIUM |
| No RAF usage (Issue 2) | 🟡 MEDIUM | Paint cycle conflicts | LOW |
| Core lacks batching (Issue 3) | 🔴 CRITICAL | Poor UX at scale | HIGH |
| No stream pausing (Issue 4) | 🟠 HIGH | Data loss on overflow | HIGH |
| Abrupt limits (Issue 5) | 🟡 MEDIUM | Unexpected failures | MEDIUM |

### Correctness Issues

| Issue | Severity | Impact | Fix Complexity |
|-------|----------|--------|----------------|
| Incomplete cleanup (Issue 6) | 🟡 MEDIUM | Ref leaks | LOW |
| Reader not cancelled (Issue 7) | 🟡 MEDIUM | Dangling promises | LOW |
| No connection ID (Issue 8) | 🟠 HIGH | State corruption | MEDIUM |
| Concurrent streams (Issue 9) | 🟠 HIGH | Message corruption | MEDIUM |
| No model tracking (Issue 10) | 🟡 MEDIUM | Orphaned streams | LOW |
| No model validation (Issue 11) | 🟡 MEDIUM | Wrong model responses | LOW |

---

## CRITICAL PATH RECOMMENDATIONS

### Priority 1 (Ship-Blocking)

1. **Add RAF Batching to useChat** (Issue 1 + 3)
   - Estimated effort: 2-3 days
   - Impact: 80% render reduction
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`

2. **Add Connection ID Tracking** (Issue 8 + 9)
   - Estimated effort: 1 day
   - Impact: Prevents corruption
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`

### Priority 2 (Next Sprint)

3. **Implement Backpressure** (Issue 4 + 5)
   - Estimated effort: 3-4 days
   - Impact: Prevents data loss
   - Files: `/packages/react/src/hooks/streaming/use-streaming.ts`

4. **Add Model Change Handling** (Issue 10 + 11)
   - Estimated effort: 1-2 days
   - Impact: Better UX
   - Files: `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`

### Priority 3 (Quality Improvements)

5. **Fix Cleanup Paths** (Issue 6 + 7)
   - Estimated effort: 1 day
   - Impact: Prevents leaks
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`

6. **Add React Scheduler** (Issue 2)
   - Estimated effort: 1 day
   - Impact: Smoother rendering
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`

---

## ARCHITECTURAL INSIGHTS

### What's Working Well ✅

1. **Layered Architecture:**
   - Low-level: `useStreaming` (generic)
   - Mid-level: `useStreamingSSE`, `useStreamingWebSocket`
   - High-level: `useClarityChat`
   - Clear separation of concerns

2. **Optimization Tools Exist:**
   - `useStreamOptimizer` is production-ready
   - `useSmoothedText` is well-designed
   - Just need integration

3. **Error Handling:**
   - AbortController used correctly
   - Mount guards prevent stale updates
   - Cleanup on unmount

4. **Reconnection Logic:**
   - Exponential backoff with jitter (SSE lines 599-608)
   - Connection ID prevents races
   - Heartbeat monitoring

### What Needs Work ⚠️

1. **Integration Gap:**
   - Optimization tools exist but not used by default
   - Core hooks ignore best practices
   - No bridge between layers

2. **Render Performance:**
   - Every token = React render
   - No batching in critical path
   - Missing RAF/scheduler integration

3. **Flow Control:**
   - No backpressure mechanism
   - Abrupt failures on limits
   - Can't pause/resume streams

4. **Concurrency:**
   - Multiple streams can collide
   - No connection tracking in useChat
   - No model change detection

---

## TESTING RECOMMENDATIONS

### Performance Tests Needed

```typescript
describe('Streaming Performance', () => {
  it('should batch renders during high-frequency streaming', async () => {
    const renderSpy = jest.fn()
    const { result } = renderHook(() => {
      const chat = useChat({ api: '/api/chat' })
      renderSpy()
      return chat
    })

    // Simulate 100 tokens arriving in 1 second
    await simulateStream(100, 10) // 100 tokens, 10ms apart

    // Should render ~16 times (60fps for 1 sec), not 100 times
    expect(renderSpy).toHaveBeenCalledTimes(lessThan(20))
  })

  it('should not drop frames during backpressure', async () => {
    const chat = useChat({
      api: '/api/chat',
      streamingOptimization: { enableBackpressure: true }
    })

    // Simulate very fast stream (1000 tokens/sec)
    await simulateFastStream(1000)

    // All tokens should eventually be rendered
    expect(chat.messages[0].content.length).toBeGreaterThan(900)
  })
})
```

### Race Condition Tests

```typescript
describe('Streaming Race Conditions', () => {
  it('should cancel first stream when second starts', async () => {
    const chat = useChat({ api: '/api/chat' })

    // Start stream 1
    const promise1 = chat.append({ role: 'user', content: 'First' })

    // Immediately start stream 2
    const promise2 = chat.append({ role: 'user', content: 'Second' })

    await Promise.allSettled([promise1, promise2])

    // Only second message should be complete
    expect(chat.messages).toHaveLength(3) // user1, user2, assistant
    expect(chat.messages[2].content).toContain('response to: Second')
  })

  it('should handle model switch during stream', async () => {
    const { rerender } = renderHook(
      ({ model }) => useChat({ api: '/api/chat', model }),
      { initialProps: { model: 'gpt-4' } }
    )

    // Start stream with GPT-4
    result.current.append({ role: 'user', content: 'Hello' })

    // Switch to Claude mid-stream
    rerender({ model: 'claude-3' })

    // Stream should abort
    expect(result.current.isLoading).toBe(false)
  })
})
```

---

## FINAL RECOMMENDATIONS

### Immediate Actions (This Sprint)

1. **Enable `useStreamOptimizer` by default in `useChat`**
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
   - Lines: Add after line 258 (state declarations)
   - Impact: Instant 60-80% render reduction

2. **Add connection ID tracking to prevent races**
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
   - Lines: Add after line 261 (refs)
   - Impact: Prevents state corruption

3. **Fix reader cancellation in abort()**
   - Files: `/packages/react/src/internal/hooks/use-chat-enhanced.ts`
   - Lines: Update lines 274-279 (abort function)
   - Impact: Prevents dangling promises

### Short-Term (Next Sprint)

4. **Implement backpressure mechanism**
   - Files: `/packages/react/src/hooks/streaming/use-streaming.ts`
   - Lines: Add to lines 129-217 (startStreaming)
   - Impact: Prevents data loss

5. **Add model change detection**
   - Files: `/packages/react/src/hooks/use-clarity-chat/use-clarity-chat.ts`
   - Lines: Add effect after line 437
   - Impact: Cleaner model switches

### Long-Term (Future)

6. **Implement React Scheduler integration**
   - Use `unstable_scheduleCallback` for non-urgent updates
   - Impact: Smoother rendering

7. **Add comprehensive streaming metrics**
   - Expose render counts, token rates, buffer sizes
   - Impact: Better observability

8. **Create streaming performance documentation**
   - Document batching strategies
   - Provide optimization guide
   - Impact: Better developer experience

---

**End of Report**
