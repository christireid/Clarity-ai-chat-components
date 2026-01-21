# Troubleshooting Guide

Common issues and solutions for Clarity Chat.

---

## 🚨 Common Issues

### Streaming Not Working

**Symptoms:**
- Messages don't appear incrementally
- Full response appears all at once
- No streaming animation

**Solutions:**

1. **Check API response type**
```typescript
// ❌ Wrong - returns JSON
export async function POST(req: Request) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })
  return Response.json({ message: response }) // Wrong!
}

// ✅ Correct - returns streaming response
import { StreamingTextResponse, OpenAIStream } from '@clarity-chat/react/adapters'

export async function POST(req: Request) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })
  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream) // Correct!
}
```

2. **Check transport configuration**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // or 'websocket'
})
```

3. **Check CORS headers** (if API is on different domain)
```typescript
export async function POST(req: Request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  // ... streaming response with headers
}
```

---

### Token Budget Exceeded

**Symptoms:**
- Error: "Token budget exceeded"
- Requests fail silently
- Budget warnings appear

**Solutions:**

1. **Increase budget**
```typescript
const budget = useTokenBudget({
  sessionBudgetTokens: 200000, // Increase from default
})
```

2. **Enable compression**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // Auto-compresses prompts
})
```

3. **Clear old conversation history**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  memory: true,
  memoryOptions: {
    maxMemories: 50, // Limit history
    enableDecay: true, // Auto-forget old messages
  },
})
```

---

### Memory Not Persisting

**Symptoms:**
- Conversations lost on page refresh
- History doesn't load
- Memory appears empty

**Solutions:**

1. **Enable persistent storage**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  memory: true,
  memoryOptions: {
    storageBackend: 'indexeddb', // Use IndexedDB, not 'memory'
    persistenceKey: 'my-chat-v1',
  },
})
```

2. **Check storage permissions**
```typescript
// Test if IndexedDB is available
const testStorage = async () => {
  try {
    const db = window.indexedDB.open('test')
    console.log('IndexedDB available')
  } catch (e) {
    console.error('IndexedDB not available:', e)
  }
}
```

3. **Check browser private mode**
- IndexedDB is disabled in private/incognito mode
- Use in-memory storage or localStorage instead

---

### Rate Limiting Errors

**Symptoms:**
- Error: "Too many requests"
- 429 status code
- Requests timing out

**Solutions:**

1. **Add retry with backoff**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  retryOptions: {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
  },
})
```

2. **Enable request throttling**
```typescript
import { useTokenThrottle } from '@clarity-chat/react'

const throttle = useTokenThrottle({
  maxRequestsPerMinute: 10,
  burstSize: 3,
})
```

3. **Check API quota**
- Verify OpenAI/Anthropic API limits
- Upgrade plan if needed
- Implement request queuing

---

### Memory Leaks

**Symptoms:**
- Browser slows down over time
- High memory usage
- Tab crashes

**Solutions:**

1. **Limit message history**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  maxMessages: 100, // Limit stored messages
})
```

2. **Use virtualization for long lists**
```tsx
import { VirtualizedMessageList } from '@clarity-chat/react/components'

<VirtualizedMessageList
  messages={messages}
  height={600}
  itemSize={100}
/>
```

3. **Clean up on unmount**
```typescript
useEffect(() => {
  const chat = useClarityChat({ ... })

  return () => {
    // Cleanup happens automatically
    // But you can force cleanup:
    chat.clear()
  }
}, [])
```

---

### Accessibility Issues

**Symptoms:**
- Screen reader doesn't announce messages
- Keyboard navigation doesn't work
- Focus lost when streaming

**Solutions:**

1. **Use accessible components**
```tsx
import { ChatWindow } from '@clarity-chat/react/components'

// ChatWindow is WCAG 2.1 AA compliant by default
<ChatWindow messages={messages} onSend={append} />
```

2. **Add ARIA labels**
```tsx
<div
  role="log"
  aria-live="polite"
  aria-label="Chat messages"
>
  {messages.map(msg => <Message key={msg.id} {...msg} />)}
</div>
```

3. **Enable keyboard navigation**
```typescript
import { useKeyboardShortcuts } from '@clarity-chat/react'

useKeyboardShortcuts({
  'Enter': sendMessage,
  'Escape': clearInput,
  'ArrowUp': editLastMessage,
})
```

---

### Performance Issues

**Symptoms:**
- Slow rendering
- Laggy scrolling
- Stuttering animations

**Solutions:**

1. **Enable virtualization**
```tsx
import { VirtualizedMessageList } from '@clarity-chat/react/components'

<VirtualizedMessageList
  messages={messages}
  height={600}
/>
```

2. **Reduce re-renders**
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  optimizeRenders: true, // Memoize expensive computations
})
```

3. **Disable animations on slow devices**
```typescript
import { useReducedMotion } from '@clarity-chat/react'

const prefersReducedMotion = useReducedMotion()
const animationDuration = prefersReducedMotion ? 0 : 300
```

---

## 🔍 Debugging Tips

### Enable Debug Mode
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  debug: true, // Logs all events to console
})
```

### Inspect Network Requests
```typescript
// Check streaming chunks in Network tab
// Filter by: fetch/XHR
// Look for: EventStream or WebSocket
```

### Check Console Errors
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  onError: (error) => {
    console.error('Chat error:', error)
    // Send to error tracking service
  },
})
```

### Test with Mock Data
```typescript
const chat = useClarityChat({
  api: '/api/chat',
  initialMessages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
  ],
})
```

---

## 🆘 Still Stuck?

If none of these solutions work:

1. **Check existing issues**: [GitHub Issues](https://github.com/clarity-chat/clarity/issues)
2. **Ask in Discord**: [Join our community](https://discord.gg/clarity-chat)
3. **Open an issue**: [Report a bug](https://github.com/clarity-chat/clarity/issues/new)

**When reporting issues, include:**
- Clarity Chat version
- React version
- Browser/environment
- Minimal reproduction code
- Error messages/screenshots

---

## 📚 Related Guides

- [Quick Start](./quick-start.md)
- [Choosing the Right Hook](./guides/choosing-hooks.md)
- [API Reference](./api/hooks/README.md)
- [FAQ](./faq.md)
