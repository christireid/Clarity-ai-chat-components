# CRITICAL FIXES IMPLEMENTATION GUIDE

This document provides exact code changes for implementing the remaining Sprint 1 critical fixes.

---

## FIX #2: Issue #1 - Race Condition in Message Edit (CRITICAL)

**File**: `packages/react/src/components/chat/clarity-chat.tsx`

### Change 1: Add mutex state (after line 352)

**Location**: Line 352-353
```typescript
const [isRegenerating, setIsRegenerating] = React.useState(false)
// ADD BELOW:
const [isEditOperationInProgress, setIsEditOperationInProgress] = React.useState(false)
```

### Change 2: Update handleSaveEdit function (lines 437-507)

**Replace the entire function** starting at line 437:

```typescript
const handleSaveEdit = React.useCallback(
  async (messageId: string, newContent: string) => {
    // FIX: Issue #1 - Prevent concurrent edits with mutex
    if (isEditOperationInProgress) {
      toast?.warning('Another edit operation is in progress. Please wait.')
      return
    }

    // Prevent saving while a request is in progress (defense in depth)
    if (chat.isLoading || isRegenerating) {
      toast?.info('Please wait for the current request to complete')
      return
    }

    // Validate content - reject empty or whitespace-only
    const trimmedContent = newContent.trim()
    if (!trimmedContent) {
      toast?.error('Message cannot be empty')
      return
    }

    // FIX: Acquire lock BEFORE any state operations
    setIsEditOperationInProgress(true)

    try {
      // Clear editing state first
      setEditingMessageId(null)

      // FIX: Re-capture messages AFTER acquiring lock (most recent state)
      const originalMessages = chat.messages

      // Find the message and determine if we need to regenerate
      const messageIndex = originalMessages.findIndex(
        (m) => m.id === messageId
      )
      if (messageIndex === -1) {
        toast?.error('Message not found')
        return
      }

      const needsRegeneration = messageIndex < originalMessages.length - 1

      if (needsRegeneration) {
        // Truncate to BEFORE the edited message
        const truncated = originalMessages.slice(0, messageIndex)
        chat.setMessages(truncated)

        // Regenerate response
        setIsRegenerating(true)
        toast?.info('Regenerating response...')
        try {
          await chat.append({ role: 'user', content: trimmedContent })
          toast?.success('Response regenerated')
        } catch (error) {
          // CRITICAL: Restore original messages on failure
          chat.setMessages(originalMessages)
          throw error
        } finally {
          setIsRegenerating(false)
        }
      } else {
        // Just update the content (no regeneration needed)
        chat.setMessages((prevMessages: CoreMessage[]) =>
          prevMessages.map((m) =>
            m.id === messageId ? { ...m, content: trimmedContent } : m
          )
        )
        toast?.success('Message updated')
      }
    } catch (error) {
      setIsRegenerating(false)
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Failed to update message:', error)
        toast?.error('Failed to update message. Please try again.')
      }
    } finally {
      // FIX: Always release lock
      setIsEditOperationInProgress(false)
    }
  },
  [chat, isRegenerating, isEditOperationInProgress, toast]
)
```

**Key Changes**:
1. Added mutex check at the beginning
2. Acquire lock before operations
3. Re-capture messages after acquiring lock
4. Always release lock in finally block
5. Added `isEditOperationInProgress` to dependency array

---

## FIX #3: Issue #5 - Streaming Cleanup on Abort (CRITICAL)

**File**: `packages/react/src/hooks/streaming/use-streaming-sse.tsx`

### Change 1: Add reconnecting flag (near other refs, around line 100-150)

```typescript
const reconnectingRef = React.useRef(false)
```

### Change 2: Update timeout handler (around line 412-423)

**Find this section**:
```typescript
const timeoutId = setTimeout(() => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()
    const timeoutError = new Error(...)
    logger.error('[useStreamingSSE] Connection timeout:', timeoutError)
    setError(timeoutError)
    setStatus('error')
    onError?.(timeoutError)
  }
}, connectionTimeout)
```

**Replace with**:
```typescript
const timeoutId = setTimeout(() => {
  if (abortControllerRef.current) {
    abortControllerRef.current.abort()
    const timeoutError = new Error(
      `Connection timeout after ${connectionTimeout}ms`
    )
    logger.error('[useStreamingSSE] Connection timeout:', timeoutError)
    
    // FIX: Issue #5 - Prevent reconnection cascade
    shouldReconnectRef.current = false
    reconnectingRef.current = false
    
    setError(timeoutError)
    setStatus('error')
    onError?.(timeoutError)
  }
}, connectionTimeout)
```

### Change 3: Guard reconnection logic (around line 592-621)

**Find this section**:
```typescript
if (autoReconnect && shouldReconnectRef.current && reconnectAttempt < maxReconnectAttempts) {
  // Reconnection logic
}
```

**Replace with**:
```typescript
if (
  autoReconnect &&
  shouldReconnectRef.current &&
  !reconnectingRef.current &&  // FIX: Check reconnection flag
  reconnectAttempt < maxReconnectAttempts
) {
  reconnectingRef.current = true  // Set flag before reconnecting
  
  // ... existing reconnection logic ...
  
  // After reconnection completes or fails:
  reconnectingRef.current = false  // Clear flag
}
```

---

## FIX #4: TOOL-011 - XSS in Result Rendering (HIGH)

**File**: `packages/react/src/components/message/clarity-tool-result.tsx`

### Step 1: Install DOMPurify (if not already installed)

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

### Step 2: Add import at top of file

```typescript
import DOMPurify from 'dompurify'
```

### Step 3: Create escapeHtml utility function (add near top of file)

```typescript
/**
 * Escape HTML special characters to prevent XSS
 * FIX: TOOL-011
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}
```

### Step 4: Update DefaultToolResult component (around line 85-104)

**Find**:
```typescript
function DefaultToolResult({ toolCall, result }) {
  return (
    <Card className="mt-2">
      <CardHeader>
        <h4 className="text-sm font-semibold">Tool: {toolCall.name}</h4>
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto max-h-64 bg-muted p-2 rounded">
          {JSON.stringify(result, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
```

**Replace with**:
```typescript
function DefaultToolResult({ toolCall, result }) {
  // FIX: TOOL-011 - Escape tool name to prevent XSS
  const escapedName = escapeHtml(toolCall.name)
  
  // FIX: TOOL-011 - Sanitize result if it's a string
  const sanitizedResult = typeof result === 'string'
    ? DOMPurify.sanitize(result)
    : JSON.stringify(result, null, 2)
  
  return (
    <Card className="mt-2">
      <CardHeader>
        <h4 
          className="text-sm font-semibold"
          dangerouslySetInnerHTML={{ __html: `Tool: ${escapedName}` }}
        />
      </CardHeader>
      <CardContent>
        <pre className="text-xs overflow-auto max-h-64 bg-muted p-2 rounded">
          {sanitizedResult}
        </pre>
      </CardContent>
    </Card>
  )
}
```

### Step 5: Update error component (around line 152-168)

**Find**:
```typescript
<p className="text-xs text-muted-foreground">{error.message}</p>
```

**Replace with**:
```typescript
<p className="text-xs text-muted-foreground">
  {escapeHtml(error.message)}
</p>
```

---

## FIX #5: TOOL-018 - Approval Race Condition (HIGH)

**File**: `packages/react/src/core/tool-orchestrator.ts`

### Change: Add re-validation before execution (around line 233-257)

**Find this section** (after approval logic, before execution):
```typescript
this.lifecycle.markExecuting(call.id)

// Execute the tool
const result = await this.executor.execute(...)
```

**Replace with**:
```typescript
this.lifecycle.markExecuting(call.id)

// FIX: TOOL-018 - Re-validate approval status atomically
const currentCall = this.lifecycle.getCall(call.id)
if (currentCall.status !== 'approved' && currentCall.status !== 'executing') {
  throw new Error(
    `Tool execution rejected: status changed to ${currentCall.status} during approval validation`
  )
}

// Now safe to execute
const result = await this.executor.execute(...)
```

---

## FIX #6: Issue #4 - Buffer Overflow in SSE (HIGH)

**File**: `packages/react/src/hooks/streaming/use-streaming-sse.tsx`

### Change: Add size limit to data accumulation (around line 340-360)

**Find this section**:
```typescript
setData((prev) => prev + eventData)
```

**Replace with**:
```typescript
// FIX: Issue #4 - Apply size limit to prevent buffer overflow
const MAX_DATA_SIZE = 10 * 1024 * 1024  // 10MB limit

setData((prev) => {
  const newData = prev + eventData
  if (newData.length > MAX_DATA_SIZE) {
    console.warn(
      `[useStreamingSSE] Data buffer size limit (${MAX_DATA_SIZE} bytes) reached. Truncating to last 10MB.`
    )
    onEventBufferOverflow?.(newData.length, MAX_DATA_SIZE)
    return newData.slice(-MAX_DATA_SIZE)  // Keep last 10MB
  }
  return newData
})
```

---

## TESTING CHECKLIST

After implementing these fixes, verify:

### FIX #2 (Edit Race Condition)
- [ ] Rapid double-clicks on edit/save don't corrupt messages
- [ ] Warning toast appears for concurrent edits
- [ ] Lock is released even on errors
- [ ] Messages restore correctly on failure

### FIX #3 (Streaming Cleanup)
- [ ] Timeout doesn't trigger reconnection cascade
- [ ] Reconnection flag prevents multiple simultaneous reconnects
- [ ] AbortController properly cleaned up
- [ ] No resource leaks in DevTools

### FIX #4 (XSS)
- [ ] `<script>alert('xss')</script>` in tool name is escaped
- [ ] `<img src=x onerror=alert('xss')>` in result is sanitized
- [ ] Error messages with special chars are escaped
- [ ] DOMPurify properly loaded and working

### FIX #5 (Approval Race)
- [ ] Rejecting tool after approval check blocks execution
- [ ] Error thrown with descriptive message
- [ ] Status changes detected atomically
- [ ] No tools execute after rejection

### FIX #6 (Buffer Overflow)
- [ ] Data accumulation stops at 10MB
- [ ] Warning logged when limit reached
- [ ] Old data truncated, new data preserved
- [ ] Memory usage stable in long sessions

---

## IMPLEMENTATION ORDER

1. **FIX #4** (XSS) - Easiest, install DOMPurify first
2. **FIX #6** (Buffer) - Simple constant + check
3. **FIX #5** (Approval) - Small atomic check
4. **FIX #2** (Edit Race) - Medium complexity, mutex pattern
5. **FIX #3** (Streaming) - Complex, multiple touchpoints

---

## ESTIMATED TIME

- FIX #4: 30 minutes
- FIX #6: 15 minutes
- FIX #5: 30 minutes
- FIX #2: 1-2 hours (test thoroughly)
- FIX #3: 1-2 hours (test thoroughly)

**Total**: 4-6 hours for all fixes + testing

---

**Status**: All fixes documented and ready for implementation
**Next**: Implement fixes in order, test each one, then commit
