# Performance Guide

Optimize your Clarity Chat application for the best performance and user experience.

## Overview

Performance optimization strategies:
- Virtual scrolling for large message lists
- Message memoization
- Lazy loading components
- Code splitting
- Debouncing and throttling
- Token optimization

## Virtual Scrolling

For chat applications with 100+ messages, use virtual scrolling:

```tsx
import { ChatWindow } from '@clarity-chat/react'

function OptimizedChat() {
  return (
    <ChatWindow
      messages={messages}
      virtualizeMessages
      virtualScrollOptions={{
        itemHeight: 100,
        overscan: 5,
      }}
      onSendMessage={handleSend}
    />
  )
}
```

### Custom Virtual Scrolling

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

function CustomVirtualChat() {
  return (
    <VirtualizedMessageList
      messages={messages}
      height={600}
      itemHeight={100}
      renderMessage={(message) => <Message message={message} />}
    />
  )
}
```

## Message Memoization

Prevent unnecessary re-renders:

```tsx
import { memo } from 'react'
import { Message } from '@clarity-chat/react'

const MemoizedMessage = memo(Message, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.content === next.message.content &&
    prev.message.isStreaming === next.message.isStreaming
  )
})

function OptimizedMessageList({ messages }) {
  return (
    <div>
      {messages.map(msg => (
        <MemoizedMessage key={msg.id} message={msg} />
      ))}
    </div>
  )
}
```

## Lazy Loading

Lazy load heavy components:

```tsx
import { lazy, Suspense } from 'react'
import { ChatWindow } from '@clarity-chat/react'

const AdvancedChatInput = lazy(() => import('./AdvancedChatInput'))

function LazyLoadedChat() {
  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      inputComponent={
        <Suspense fallback={<div>Loading...</div>}>
          <AdvancedChatInput />
        </Suspense>
      }
    />
  )
}
```

## Code Splitting

Split your application code:

```tsx
import { lazy } from 'react'

const ChatWindow = lazy(() => import('@clarity-chat/react').then(m => ({ default: m.ChatWindow })))

function App() {
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </Suspense>
  )
}
```

## Debouncing and Throttling

Debounce expensive operations:

```tsx
import { useDebounce } from '@clarity-chat/react'

function SearchableChat() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search messages..."
    />
  )
}
```

Throttle frequent updates:

```tsx
import { useThrottle } from '@clarity-chat/react'

function ThrottledUpdates() {
  const [position, setPosition] = useState(0)
  const throttledPosition = useThrottle(position, 100)

  useEffect(() => {
    updateScrollPosition(throttledPosition)
  }, [throttledPosition])

  return <div onScroll={(e) => setPosition(e.target.scrollTop)} />
}
```

## Token Optimization

Optimize token usage to reduce costs and improve performance:

```tsx
import { usePromptCompression, useTokenTracker } from '@clarity-chat/react'

function TokenOptimizedChat() {
  const { compress } = usePromptCompression({ enabled: true })
  const { tokenCount, isNearLimit } = useTokenTracker({ messages })

  const handleSend = async (content: string) => {
    const messagesToSend = isNearLimit
      ? await compress(messages)
      : messages
    
    await sendMessage(messagesToSend)
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Message List Optimization

Limit visible messages:

```tsx
import { useMemo } from 'react'

function OptimizedChat() {
  const visibleMessages = useMemo(() => {
    // Only show last 50 messages
    return messages.slice(-50)
  }, [messages])

  return <ChatWindow messages={visibleMessages} onSendMessage={handleSend} />
}
```

## Streaming Optimization

Optimize streaming performance:

```tsx
import { useStreamingSSE } from '@clarity-chat/react'

function OptimizedStreaming() {
  const { connect, disconnect } = useStreamingSSE({
    url: '/api/chat/stream',
    bufferSize: 10, // Buffer chunks before updating UI
    throttleMs: 50, // Throttle UI updates
    onMessage: (chunk) => {
      // Batch updates
      requestAnimationFrame(() => {
        updateMessages(chunk)
      })
    },
  })

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Performance Monitoring

Monitor performance metrics:

```tsx
import { usePerformance, PerformanceDashboard } from '@clarity-chat/react'

function MonitoredChat() {
  const { measure, getMetrics } = usePerformance()

  const handleSend = async (content: string) => {
    const endMeasure = measure('chat.send')
    
    try {
      await sendMessage(content)
      endMeasure({ status: 'success' })
    } catch (error) {
      endMeasure({ status: 'error' })
    }
  }

  const metrics = getMetrics()

  return (
    <div>
      <PerformanceDashboard metrics={metrics} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

## Best Practices

1. **Virtual Scrolling**: Use for 100+ messages
2. **Memoization**: Memoize expensive components
3. **Lazy Loading**: Lazy load heavy features
4. **Code Splitting**: Split large bundles
5. **Debouncing**: Debounce search and input
6. **Throttling**: Throttle scroll and resize handlers
7. **Token Optimization**: Compress when near limits
8. **Limit Messages**: Only render visible messages
9. **Batch Updates**: Batch DOM updates
10. **Monitor Performance**: Track metrics in production

## Performance Checklist

- [ ] Virtual scrolling enabled for large lists
- [ ] Messages are memoized
- [ ] Heavy components are lazy loaded
- [ ] Code is split appropriately
- [ ] Expensive operations are debounced/throttled
- [ ] Token usage is optimized
- [ ] Only visible messages are rendered
- [ ] Performance metrics are monitored
- [ ] Bundle size is optimized
- [ ] Images are optimized

## Next Steps

- [Performance API Reference](/api/performance) - Performance utilities
- [Token Optimization](/guide/token-optimization) - Optimize token usage
- [Virtual Scrolling](/api/components/virtualized-message-list) - Virtual scrolling API
