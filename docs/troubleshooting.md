# Troubleshooting Guide

Common issues and solutions when using Clarity Chat.

---

## Quick Diagnosis

### Issue: Component not rendering

**Check:**
1. ✅ Imports are correct
2. ✅ CSS is imported (`import '@clarity-chat/react/styles.css'`)
3. ✅ No console errors
4. ✅ React version is compatible (React 18+)

**Solution:**
```tsx
// ✅ Correct imports
import { ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// ❌ Missing CSS import
import { ChatWindow } from '@clarity-chat/react'
```

---

### Issue: Messages not appearing

**Check:**
1. ✅ Messages array is not empty
2. ✅ Message format is correct
3. ✅ Component is receiving messages prop

**Solution:**
```tsx
// ✅ Correct message format
const messages = [
  {
    id: '1',
    role: 'user',
    content: 'Hello!',
    createdAt: Date.now(),
    status: 'sent',
  }
]

// ❌ Missing required fields
const messages = [
  { content: 'Hello!' } // Missing id, role, createdAt, status
]
```

---

### Issue: Streaming not working

**Check:**
1. ✅ API endpoint returns SSE stream
2. ✅ Content-Type header is correct
3. ✅ Stream format matches expected format

**Solution:**
```tsx
// ✅ Correct SSE format
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messages }),
})

// Response should be ReadableStream with SSE format:
// data: {"content": "chunk"}\n\n
```

---

### Issue: Memory not working

**Check:**
1. ✅ MemoryProvider is wrapping your app
2. ✅ Memory config is correct
3. ✅ Vector store is configured (if using vector-store strategy)

**Solution:**
```tsx
// ✅ Correct setup
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <YourChatComponent />
    </MemoryProvider>
  )
}
```

---

### Issue: TypeScript errors

**Check:**
1. ✅ TypeScript version is 5.0+
2. ✅ Types are imported correctly
3. ✅ Strict mode is enabled

**Solution:**
```tsx
// ✅ Correct type imports
import type { Message } from '@clarity-chat/types'

const message: Message = {
  id: '1',
  role: 'user',
  content: 'Hello!',
  createdAt: Date.now(),
  status: 'sent',
}
```

---

## Common Errors

### Error: "Cannot read property 'map' of undefined"

**Cause:** Messages array is undefined

**Solution:**
```tsx
// ✅ Provide default empty array
const messages = useClarityChat({ api: '/api/chat' })
const safeMessages = messages.messages || []

// Or use optional chaining
{messages?.map(msg => ...)}
```

---

### Error: "useClarityChat must be used within MemoryProvider"

**Cause:** Using memory features without MemoryProvider

**Solution:**
```tsx
// ✅ Wrap with MemoryProvider
<MemoryProvider config={{ maxTokens: 10000 }}>
  <YourComponent />
</MemoryProvider>
```

---

### Error: "Stream parsing failed"

**Cause:** API response format doesn't match expected SSE format

**Solution:**
```tsx
// ✅ Ensure correct SSE format
// Each chunk should be: data: {"content": "text"}\n\n

// Server-side example:
res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`)
```

---

## Performance Issues

### Issue: Slow rendering with many messages

**Solution:**
```tsx
// ✅ Use virtualized MessageList
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  // Only renders visible messages
/>
```

---

### Issue: High memory usage

**Solution:**
```tsx
// ✅ Enable memory optimization
const { messages } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window', // Limits context window
    maxTokens: 4000,
  },
})
```

---

## Integration Issues

### Issue: Next.js App Router

**Solution:**
```tsx
// ✅ Use 'use client' directive
'use client'

import { ChatWindow } from '@clarity-chat/react'

export default function Page() {
  return <ChatWindow {...props} />
}
```

---

### Issue: SSR hydration mismatch

**Solution:**
```tsx
// ✅ Use client-side only rendering
import { useEffect, useState } from 'react'

function ClientOnlyChat() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) return null
  
  return <ChatWindow {...props} />
}
```

---

## Getting Help

### Still stuck?

1. **Check Documentation**
   - [API Reference](./apps/docs/app/api/)
   - [Guides](./apps/docs/app/guides/)
   - [Examples](./apps/examples/)

2. **Search Issues**
   - [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

3. **Ask Community**
   - [Discord](https://discord.gg/clarity-chat)

4. **Report Bug**
   - [Create Issue](https://github.com/christireid/Clarity-ai-chat-components/issues/new)

---

## Debugging Tips

### Enable Debug Logging

```tsx
// Enable debug mode
const { messages } = useClarityChat({
  api: '/api/chat',
  debug: true, // Logs all operations
})
```

### Check Network Tab

- Verify API requests are being made
- Check response format
- Look for CORS errors

### Use React DevTools

- Inspect component props
- Check state updates
- Profile performance

---

**Last Updated:** [Date]
