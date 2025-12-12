# Troubleshooting Guide

Common issues and solutions when working with Clarity Chat.

---

## Quick Diagnosis

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| Messages not displaying | Missing conversion | Use `convertCoreMessagesToMessages()` |
| Streaming not working | SSE format issue | Check API returns `text/event-stream` |
| Memory not persisting | Provider missing | Wrap app in `MemoryProvider` |
| TypeScript errors | Version mismatch | Ensure TypeScript 5.0+ |
| Styles not loading | CSS not imported | Add `import '@clarity-chat/react/styles.css'` |

---

## Common Issues

### Messages Not Displaying

**Symptom:** Chat appears empty despite API returning data.

**Solution:** Ensure you're converting messages correctly:

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function App() {
  const { messages: coreMessages } = useClarityChat({ api: '/api/chat' })

  // Convert CoreMessage[] to Message[]
  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return <ChatWindow messages={messages} />
}
```

---

### Streaming Not Working

**Symptom:** Messages appear all at once instead of streaming.

**Causes & Solutions:**

1. **API not returning stream format:**
```tsx
// ✅ Correct: Return streaming response
export async function POST(req: Request) {
  const result = streamText({ model, messages })
  return result.toDataStreamResponse()
}

// ❌ Wrong: Returning JSON
export async function POST(req: Request) {
  const result = await generateText({ model, messages })
  return Response.json(result) // Not streaming!
}
```

2. **Missing Content-Type header:**
```tsx
return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
})
```

---

### Memory Not Working

**Symptom:** Conversation context is lost between messages.

**Solution:** Ensure proper setup:

```tsx
// 1. Wrap app in MemoryProvider
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatApp />
    </MemoryProvider>
  )
}

// 2. Enable memory in hook
function ChatApp() {
  const { messages } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,  // Must be true!
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })
}
```

---

### TypeScript Errors

**Symptom:** Type errors with Clarity Chat imports.

**Solutions:**

1. **Check TypeScript version:**
```bash
npx tsc --version  # Should be 5.0+
```

2. **Update tsconfig.json:**
```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "strict": true
  }
}
```

3. **Reinstall dependencies:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### Styles Not Loading

**Symptom:** Components appear unstyled.

**Solution:** Import the CSS file:

```tsx
// In your app entry point (e.g., layout.tsx, _app.tsx)
import '@clarity-chat/react/styles.css'
```

For Tailwind CSS projects, also ensure your `tailwind.config.js` includes Clarity Chat:

```js
module.exports = {
  content: [
    './node_modules/@clarity-chat/react/**/*.{js,ts,jsx,tsx}',
    // ... your other paths
  ],
}
```

---

### Next.js Route Isolation

**Symptom:** Data stored in one API route isn't accessible from another.

**Cause:** Next.js 15 API routes run in isolated contexts.

**Solutions:**

1. **Use external storage for production:**
```tsx
// Use database, Redis, or file storage
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
```

2. **Use a singleton pattern for development:**
```tsx
// lib/storage.ts
const globalForStorage = globalThis as unknown as { storage: Map<string, any> }
export const storage = globalForStorage.storage || new Map()
if (process.env.NODE_ENV !== 'production') globalForStorage.storage = storage
```

---

### Performance Issues

**Symptom:** Chat becomes slow with many messages.

**Solutions:**

1. **Use virtualized list:**
```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
/>
```

2. **Memoize expensive computations:**
```tsx
const messages = useMemo(
  () => convertCoreMessagesToMessages(coreMessages),
  [coreMessages]
)
```

3. **Enable sliding window memory:**
```tsx
memory: {
  strategy: 'sliding-window',
  maxTokens: 4000,  // Limits context size
}
```

---

### Build Errors

**Symptom:** Build fails with module resolution errors.

**Solutions:**

1. **Clear caches:**
```bash
rm -rf .next node_modules/.cache
npm run build
```

2. **Check peer dependencies:**
```bash
npm ls react  # Should show single React version
```

3. **Update to latest versions:**
```bash
npm update @clarity-chat/react
```

---

## Getting Help

If you're still stuck:

1. **Check the [FAQ](./FAQ.md)** for common questions
2. **Search [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)**
3. **Ask in [Discord](https://discord.gg/clarity-chat)**
4. **Open a new issue** with:
   - Error message
   - Code snippet
   - Environment (Node, React, Next.js versions)

---

## Related Resources

- [Getting Started](./getting-started.md) - Initial setup guide
- [Best Practices](./best-practices.md) - Production patterns
- [API Reference](./api-reference.md) - Complete API docs
- [Architecture](./architecture.md) - System overview

---

**Last Updated:** December 2025
