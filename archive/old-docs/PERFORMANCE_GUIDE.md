# Performance Optimization Guide

## Overview

This guide covers performance optimizations available in Clarity Chat's Vercel AI SDK compatible hooks.

## Optimized Hooks

### useChatOptimized

Enhanced version of `useChat` with performance optimizations:

```tsx
import { useChatOptimized } from '@clarity-chat/react'

const { messages, append, debouncedInput } = useChatOptimized({
  api: '/api/chat',
  debounceMs: 300,        // Debounce input updates
  memoizeMessages: true,   // Memoize messages to prevent re-renders
  batchUpdates: true,      // Batch React updates
})
```

**Features:**
- ✅ Debounced input updates
- ✅ Memoized messages
- ✅ Batched React updates
- ✅ Optimized re-renders

## Performance Utilities

### Throttle

Limit function call frequency:

```tsx
import { throttle } from '@clarity-chat/react'

const throttledAppend = throttle((message) => {
  append(message)
}, 1000) // Max once per second
```

### Debounce

Delay function calls:

```tsx
import { debounce } from '@clarity-chat/react'

const debouncedSave = debounce(() => {
  saveMessages(messages)
}, 500) // Wait 500ms after last call
```

### Batcher

Batch items for processing:

```tsx
import { Batcher } from '@clarity-chat/react'

const messageBatcher = new Batcher(
  (messages) => {
    // Process batch
    processMessages(messages)
  },
  10,   // Batch size
  100   // Batch timeout (ms)
)

// Add items
messages.forEach(msg => messageBatcher.add(msg))
```

### Performance Monitor

Track performance metrics:

```tsx
import { PerformanceMonitor } from '@clarity-chat/react'

const monitor = new PerformanceMonitor()

// Start tracking
const stopTimer = monitor.start('message-send')

// ... do work ...

stopTimer()

// Get metrics
const metrics = monitor.getMetrics('message-send')
console.log(`Average: ${metrics.avg}ms`)
console.log(`Min: ${metrics.min}ms`)
console.log(`Max: ${metrics.max}ms`)

// Get full report
const report = monitor.getReport()
```

## Best Practices

### 1. Use Memoization

```tsx
const memoizedMessages = React.useMemo(() => {
  return messages.map(msg => ({
    ...msg,
    // Stable references
  }))
}, [messages])
```

### 2. Batch Updates

```tsx
// Bad: Multiple updates cause multiple re-renders
setMessages([...messages, msg1])
setMessages([...messages, msg2])

// Good: Batch updates
React.startTransition(() => {
  setMessages([...messages, msg1, msg2])
})
```

### 3. Debounce Input

```tsx
const debouncedInput = useDebounce(input, 300)

// Use debounced value for expensive operations
React.useEffect(() => {
  // Only runs after 300ms of no input changes
  searchMessages(debouncedInput)
}, [debouncedInput])
```

### 4. Limit Message History

```tsx
import { truncateMessagesToTokenLimit } from '@clarity-chat/react'

const limitedMessages = truncateMessagesToTokenLimit(messages, 4000)
```

### 5. Optimize Large Arrays

```tsx
import { optimizeArray } from '@clarity-chat/react'

const optimized = optimizeArray(messages, 1000) // Keep max 1000 items
```

## Performance Monitoring

Enable performance logging:

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  (window as any).__PERF_LOGGING__ = true
}
```

## Benchmarking

Measure hook performance:

```tsx
import { measurePerformance } from '@clarity-chat/react'

const result = measurePerformance('append-message', async () => {
  await append({ role: 'user', content: 'Test' })
})
```

## Memory Management

### Cleanup on Unmount

```tsx
React.useEffect(() => {
  return () => {
    // Cleanup resources
    abort()
  }
}, [])
```

### Optimize Message Storage

```tsx
// Store only essential data
const optimizedMessages = messages.map(msg => ({
  id: msg.id,
  role: msg.role,
  content: typeof msg.content === 'string' 
    ? msg.content 
    : messageToText(msg),
}))
```

## Performance Checklist

- [ ] Use `useChatOptimized` for better performance
- [ ] Debounce input updates
- [ ] Memoize expensive computations
- [ ] Batch React updates
- [ ] Limit message history size
- [ ] Monitor performance metrics
- [ ] Clean up resources on unmount
- [ ] Optimize large arrays
- [ ] Use type guards for better inference
- [ ] Validate messages before processing

## Examples

See `examples/vercel-ai-sdk-compatible/src/PerformanceExample.tsx` for a complete example.
