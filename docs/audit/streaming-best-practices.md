# Streaming Best Practices

**Last Updated**: 2025-01-20  
**Audit Phase**: Phase 2 - Streaming Documentation

## Overview

This document provides best practices for implementing streaming AI responses in React components and hooks.

## Core Principles

### 1. Use Refs for Accumulation

**Problem**: Direct variable accumulation in callbacks can cause race conditions with rapid chunks.

**Solution**: Use refs for accumulation, then update state from refs.

```typescript
// ❌ Bad - Race condition risk
let accumulated = ''
onChunk: (chunk) => {
  accumulated += chunk
  setContent(accumulated) // May use stale accumulated
}

// ✅ Good - No race condition
const accumulatedRef = useRef('')
onChunk: (chunk) => {
  accumulatedRef.current += chunk
  setContent(accumulatedRef.current) // Always current
}
```

### 2. Batch State Updates

**Problem**: Updating state on every chunk causes excessive re-renders.

**Solution**: Use `React.startTransition` for non-urgent updates.

```typescript
// ❌ Bad - Blocks UI thread
onChunk: (chunk) => {
  setContent(prev => prev + chunk)
}

// ✅ Good - Non-blocking updates
onChunk: (chunk) => {
  React.startTransition(() => {
    setContent(prev => prev + chunk)
  })
}
```

### 3. Preserve Partial Content on Errors

**Problem**: Errors during streaming lose all accumulated content.

**Solution**: Always preserve partial content, even on errors.

```typescript
try {
  await processStream(stream, {
    onChunk: (chunk) => {
      accumulated += chunk
      setContent(accumulated)
    },
    onError: (error) => {
      // Preserve partial content
      setError(error)
      setContent(accumulated) // Keep what we have
    }
  })
} catch (error) {
  // Still preserve partial content
  setError(error)
  setContent(accumulated)
}
```

### 4. Handle Chunk Boundaries Correctly

**Problem**: Chunks may split at arbitrary points (mid-word, mid-tag, etc.).

**Solution**: Buffer incomplete chunks and process complete ones.

```typescript
let buffer = ''
for (const chunk of chunks) {
  buffer += chunk
  const lines = buffer.split('\n')
  buffer = lines.pop() || '' // Keep incomplete line
  
  for (const line of lines) {
    processCompleteLine(line)
  }
}
// Process remaining buffer
if (buffer) processCompleteLine(buffer)
```

### 5. Clean Up on Unmount

**Problem**: Streaming continues after component unmounts, causing memory leaks.

**Solution**: Always clean up streams and abort controllers.

```typescript
useEffect(() => {
  const controller = new AbortController()
  
  processStream(stream, {
    signal: controller.signal,
    // ...
  })
  
  return () => {
    controller.abort()
    // Clean up any other resources
  }
}, [])
```

## Performance Optimization

### Debouncing Rapid Updates

For very rapid streams, consider debouncing updates:

```typescript
const debouncedUpdate = useMemo(
  () => debounce((content: string) => {
    setContent(content)
  }, 50), // Update at most every 50ms
  []
)

onChunk: (chunk) => {
  accumulated += chunk
  debouncedUpdate(accumulated)
}
```

### Virtualization for Long Streams

For very long streams, consider virtualizing:

```typescript
// Only render visible portion
const visibleContent = useMemo(() => {
  return content.slice(0, MAX_VISIBLE_LENGTH)
}, [content])
```

## Error Handling Patterns

### Network Interruption

```typescript
onError: (error) => {
  if (error.message.includes('network')) {
    // Preserve content, show retry option
    setError({
      type: 'network',
      message: 'Connection lost. Retry?',
      retryable: true
    })
  }
}
```

### Stream Cancellation

```typescript
// User cancels stream
const handleCancel = () => {
  abortController.abort()
  // Preserve partial content
  setStatus('cancelled')
  setContent(accumulatedContent)
}
```

## Testing Patterns

### Mock Streaming Responses

```typescript
function createMockStream(chunks: string[]): ReadableStream {
  return new ReadableStream({
    async pull(controller) {
      for (const chunk of chunks) {
        controller.enqueue(new TextEncoder().encode(chunk))
        await delay(10) // Simulate network delay
      }
      controller.close()
    }
  })
}
```

### Test Chunk Boundaries

```typescript
it('handles chunks split at word boundaries', async () => {
  const chunks = ['Hello', ' ', 'world']
  // Test that content is correctly accumulated
})
```

## Accessibility Considerations

### ARIA Live Regions

```typescript
<div aria-live="polite" aria-atomic="false">
  {streamingContent}
</div>
```

### Loading Indicators

```typescript
{isStreaming && (
  <div aria-busy="true" aria-label="AI is generating response">
    <Spinner />
  </div>
)}
```

## Common Pitfalls

1. **Not cleaning up streams** - Always abort on unmount
2. **Race conditions** - Use refs for accumulation
3. **Excessive re-renders** - Batch updates with startTransition
4. **Lost content on errors** - Always preserve partial content
5. **Memory leaks** - Clean up all resources

## Notes

- Streaming is one of the most complex aspects of AI integration
- Proper error handling is critical for user experience
- Performance optimization is essential for smooth UX
- Testing streaming requires careful mocking
- Accessibility is often overlooked but critical
