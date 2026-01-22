# TODO-003 Implementation Notes: Disconnect Race Condition Fix

## Problem

Race condition existed where `reader.read()` could return data AFTER `disconnect()` had cleared all refs, causing:
- Orphaned heartbeat timeouts being created
- State updates after disconnection
- Processing of stale data

## Solution

Added `isDisconnectingRef` flag that:
1. Gets set to `true` at the START of `disconnect()` (before any cleanup)
2. Is checked immediately after `reader.read()` returns
3. Prevents processing any data if disconnect was called
4. Prevents new timeout creation in `resetHeartbeat()`
5. Gets reset to `false` in `connect()` for new connections

## Implementation Changes

### 1. Added `isDisconnectingRef`
```typescript
const isDisconnectingRef = React.useRef(false)
```

### 2. Updated `disconnect()` function
Set flag FIRST before any cleanup:
```typescript
const disconnect = React.useCallback(() => {
  // Set flag FIRST to prevent race with in-flight reader.read()
  isDisconnectingRef.current = true
  shouldReconnectRef.current = false

  // ... rest of cleanup
}, [onClose])
```

### 3. Updated reading loop
Check flag immediately after `reader.read()`:
```typescript
while (true) {
  const { done, value } = await reader.read()

  // Check if disconnect was called while waiting for read()
  if (isDisconnectingRef.current) {
    break // Exit immediately without processing
  }

  // ... rest of processing
}
```

### 4. Updated `resetHeartbeat()`
Prevent new timeout creation during disconnect:
```typescript
const resetHeartbeat = React.useCallback(() => {
  // Don't create new timeouts if disconnecting
  if (isDisconnectingRef.current) {
    return
  }
  // ... rest of heartbeat logic
}, [heartbeatInterval, autoReconnect])
```

### 5. Reset flag in `connect()`
```typescript
const connect = React.useCallback(async () => {
  // ...
  isDisconnectingRef.current = false // Reset for new connection
  // ...
}, [/* deps */])
```

## Why This Works

The key insight is that the race window exists between:
1. Starting the async `reader.read()` operation
2. The operation completing with data

By checking the `isDisconnectingRef` flag IMMEDIATELY after the promise resolves, we can safely ignore any data that arrived after disconnect was called. The flag acts as a synchronous guard that prevents processing of asynchronous results.

## Test Validation

The fix prevents:
- ✅ Orphaned heartbeat timeouts after disconnect
- ✅ State updates after disconnect is called
- ✅ Processing chunks that arrive post-disconnect
- ✅ Resource cleanup issues
- ✅ Problems with rapid connect/disconnect cycles

## Production Impact

This fix ensures that:
- No memory leaks from orphaned timeouts
- Clean disconnections in all scenarios
- Safe rapid connect/disconnect patterns
- No state corruption from late-arriving data

## Files Modified

- `/packages/react/src/hooks/streaming/use-streaming-sse.tsx`
  - Added `isDisconnectingRef`
  - Updated `disconnect()`, reading loop, `resetHeartbeat()`, `connect()`

## Acceptance Criteria

✅ Disconnect during active streaming completes cleanly
✅ No orphaned timeouts created
✅ No state updates after disconnect
✅ Data arriving after disconnect is ignored
✅ Reconnection works correctly after disconnect

