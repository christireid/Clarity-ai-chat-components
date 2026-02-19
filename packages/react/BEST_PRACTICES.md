# Best Practices Guide

Comprehensive guide to best practices for using Clarity React library effectively.

## Table of Contents

1. [Hook Usage](#hook-usage)
2. [Memory Management](#memory-management)
3. [Component Patterns](#component-patterns)
4. [Performance Optimization](#performance-optimization)
5. [Error Handling](#error-handling)
6. [TypeScript Patterns](#typescript-patterns)
7. [Testing](#testing)
8. [Accessibility](#accessibility)

## Hook Usage

### useClarityChat

#### ✅ DO: Use Memory for Long Conversations

```tsx
// Good: Memory enabled for context retention
const { messages, append } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  },
})
```

#### ❌ DON'T: Enable Memory Unnecessarily

```tsx
// Bad: Memory not needed for simple, stateless interactions
const { messages, append } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true }, // Unnecessary overhead
})
```

#### ✅ DO: Choose Appropriate Transport

```tsx
// Good: WebSocket for real-time, bidirectional communication
const { messages, append } = useClarityChat({
  api: '/api/chat',
  transport: 'websocket', // For real-time features
})

// Good: SSE for simple streaming
const { messages, append } = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // Default, simpler
})
```

#### ❌ DON'T: Mix Transport Protocols

```tsx
// Bad: Inconsistent transport selection
const chat1 = useClarityChat({ transport: 'sse' })
const chat2 = useClarityChat({ transport: 'websocket' })
// Use consistent transport across your app
```

### useClarityObject

#### ✅ DO: Use TypeScript Generics

```tsx
// Good: Type-safe object generation
interface Product {
  name: string
  price: number
}

const { object } = useClarityObject<Product[]>({
  api: '/api/products',
})
// object is Product[] | null
```

#### ❌ DON'T: Use `any` Types

```tsx
// Bad: Loses type safety
const { object } = useClarityObject<any>({
  api: '/api/products',
})
// object is any - no type checking
```

#### ✅ DO: Handle Loading and Error States

```tsx
// Good: Comprehensive state handling
const { object, isLoading, error, run } = useClarityObject<Product[]>({
  api: '/api/products',
  onError: (err) => {
    console.error('Generation failed:', err)
    // Show user-friendly error message
  },
})

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!object) return <EmptyState />
```

#### ❌ DON'T: Ignore Error States

```tsx
// Bad: No error handling
const { object } = useClarityObject<Product[]>({
  api: '/api/products',
})
// What if the API fails?
```

## Memory Management

### ✅ DO: Choose the Right Strategy

```tsx
// Sliding Window: Fast, recent context (most use cases)
memory: {
  strategy: 'sliding-window',
  maxTokens: 2000,
}

// Semantic Chunks: Context-aware (complex conversations)
memory: {
  strategy: 'semantic-chunks',
  maxTokens: 6000,
}

// Vector Store: Long-term memory (knowledge bases)
memory: {
  strategy: 'vector-store',
  maxTokens: 10000,
}
```

### ❌ DON'T: Use Vector Store for Simple Cases

```tsx
// Bad: Overkill for simple chat
memory: {
  strategy: 'vector-store', // Too complex, slow
  maxTokens: 10000,
}
// Use sliding-window instead
```

### ✅ DO: Monitor Token Usage

```tsx
// Good: Track memory usage
const { messages, contextSummary } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true },
})

// Display token usage
{contextSummary && (
  <div>Context: {contextSummary.tokenCount} tokens</div>
)}
```

### ❌ DON'T: Set Unrealistic Token Limits

```tsx
// Bad: Too high, may cause performance issues
memory: {
  maxTokens: 100000, // Unrealistic
}

// Good: Reasonable limits
memory: {
  maxTokens: 4000, // Typical for most models
}
```

## Component Patterns

### ✅ DO: Use ChatWindow for Production

```tsx
// Good: Well-structured component
import { ChatWindow, useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### ❌ DON'T: Build Custom Chat UI from Scratch

```tsx
// Bad: Reinventing the wheel
function MyChat() {
  const { messages } = useClarityChat({ api: '/api/chat' })
  
  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id}>{msg.content}</div>
      ))}
    </div>
  )
}
// Use ChatWindow instead - it handles accessibility, virtualization, etc.
```

### ✅ DO: Use Tool UI Registry

```tsx
// Good: Type-safe tool rendering
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResult,
})

<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

### ❌ DON'T: Manually Render Tool Results

```tsx
// Bad: Manual, error-prone
{toolInvocations.map(inv => {
  if (inv.toolName === 'get_weather') {
    return <WeatherResult data={inv.result} />
  }
  if (inv.toolName === 'search') {
    return <SearchResult data={inv.result} />
  }
  // Easy to miss cases, no type safety
})}
```

## Performance Optimization

### ✅ DO: Use VirtualizedMessageList for Long Conversations

```tsx
// Good: Virtualized rendering for performance
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
/>
```

### ❌ DON'T: Render All Messages at Once

```tsx
// Bad: Performance issues with many messages
{messages.map(msg => (
  <Message key={msg.id} message={msg} />
))}
// Use VirtualizedMessageList instead
```

### ✅ DO: Memoize Message Conversions

```tsx
// Good: Memoized conversion
import { useMemo } from 'react'
import { convertCoreMessagesToMessages } from '@clarity-chat/react'

const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

### ❌ DON'T: Convert Messages on Every Render

```tsx
// Bad: Unnecessary conversions
const messages = convertCoreMessagesToMessages(coreMessages)
// Runs on every render - use useMemo
```

### ✅ DO: Debounce User Input

```tsx
// Good: Debounced input for auto-save
import { useClarityChatWithDebounce } from '@clarity-chat/react'

const { messages, input, setInput } = useClarityChatWithDebounce({
  api: '/api/chat',
  debounceMs: 500,
})
```

### ❌ DON'T: Save on Every Keystroke

```tsx
// Bad: Too many saves
const { input, setInput } = useClarityChat({
  api: '/api/chat',
  onFinish: () => saveToLocalStorage(), // Called too often
})
```

## Error Handling

### ✅ DO: Use Error Boundaries

```tsx
// Good: Error boundary for graceful failures
import { ErrorBoundary } from '@clarity-chat/react'

<ErrorBoundary fallback={<ErrorFallback />}>
  <ChatWindow />
</ErrorBoundary>
```

### ❌ DON'T: Let Errors Crash the App

```tsx
// Bad: No error boundary
<ChatWindow />
// If ChatWindow throws, entire app crashes
```

### ✅ DO: Provide Retry Mechanisms

```tsx
// Good: Retry on failure
import { RetryButton } from '@clarity-chat/react'

{error && (
  <div>
    <p>Error: {error.message}</p>
    <RetryButton onRetry={() => retry()} />
  </div>
)}
```

### ❌ DON'T: Show Generic Error Messages

```tsx
// Bad: Not helpful
{error && <div>Error occurred</div>}

// Good: Specific, actionable
{error && (
  <div>
    <p>Failed to send message: {error.message}</p>
    <RetryButton onRetry={handleRetry} />
  </div>
)}
```

## TypeScript Patterns

### ✅ DO: Define Message Types

```tsx
// Good: Type-safe messages
import type { CoreMessage } from '@clarity-chat/react'

const messages: CoreMessage[] = [
  { role: 'user', content: 'Hello' },
  { role: 'assistant', content: 'Hi there!' },
]
```

### ❌ DON'T: Use `any` for Messages

```tsx
// Bad: No type safety
const messages: any[] = [
  { role: 'user', content: 'Hello' },
]
```

### ✅ DO: Type Tool Results

```tsx
// Good: Typed tool results
interface WeatherData {
  location: string
  temperature: number
  condition: string
}

function WeatherResult({ data }: { data: WeatherData }) {
  return <div>{data.temperature}°C in {data.location}</div>
}
```

### ❌ DON'T: Use Unchecked Tool Data

```tsx
// Bad: No type checking
function WeatherResult({ data }: { data: any }) {
  return <div>{data.temperature}</div>
  // What if data doesn't have temperature?
}
```

## Testing

### ✅ DO: Test Hook Behavior

```tsx
// Good: Test hook logic
import { renderHook, waitFor } from '@testing-library/react'
import { useClarityChat } from '@clarity-chat/react'

test('appends message correctly', async () => {
  const { result } = renderHook(() => useClarityChat({
    api: '/api/chat',
  }))

  await act(async () => {
    await result.current.append({ role: 'user', content: 'Hello' })
  })

  await waitFor(() => {
    expect(result.current.messages).toHaveLength(1)
  })
})
```

### ❌ DON'T: Test Implementation Details

```tsx
// Bad: Testing internals
test('calls internal function', () => {
  // Don't test private functions
})
```

### ✅ DO: Mock API Calls

```tsx
// Good: Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ messages: [] }),
  })
)
```

### ❌ DON'T: Make Real API Calls in Tests

```tsx
// Bad: Real API calls in tests
test('loads messages', async () => {
  const { result } = renderHook(() => useClarityChat({
    api: 'https://real-api.com/chat', // Don't do this
  }))
})
```

## Accessibility

### ✅ DO: Use Accessible Components

```tsx
// Good: ChatWindow handles accessibility
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  ariaLabel="Chat with AI assistant"
/>
```

### ❌ DON'T: Build Custom Components Without Accessibility

```tsx
// Bad: Missing accessibility
<div>
  {messages.map(msg => <div>{msg.content}</div>)}
  <input />
  <button>Send</button>
</div>
// Missing ARIA labels, keyboard navigation, focus management
```

### ✅ DO: Provide Keyboard Shortcuts

```tsx
// Good: Keyboard support
<ChatInput
  onSend={handleSend}
  keyboardShortcuts={{
    send: 'Enter',
    newLine: 'Shift+Enter',
  }}
/>
```

### ❌ DON'T: Ignore Keyboard Users

```tsx
// Bad: Mouse-only interaction
<button onClick={handleSend}>Send</button>
// No keyboard support, no focus management
```

## Summary

### Key Takeaways

1. **Use Memory Strategically** - Enable only when needed, choose the right strategy
2. **Leverage Production Components** - Use ChatWindow, VirtualizedMessageList, etc.
3. **Handle Errors Gracefully** - Use ErrorBoundary and retry mechanisms
4. **Optimize Performance** - Memoize conversions, use virtualization
5. **Type Everything** - Use TypeScript generics and proper types
6. **Test Behavior** - Test what users see, not implementation details
7. **Prioritize Accessibility** - Use accessible components and patterns

### Quick Reference

- **Memory**: Use `sliding-window` for most cases
- **Transport**: Use `sse` unless you need bidirectional communication
- **Components**: Use `ChatWindow` for production apps
- **Performance**: Use `VirtualizedMessageList` for long conversations
- **Errors**: Always use `ErrorBoundary`
- **Types**: Always use TypeScript generics

---

**Need more help?** See [Getting Started Guide](./GETTING_STARTED.md) or [API Reference](./API_REFERENCE.md)!
