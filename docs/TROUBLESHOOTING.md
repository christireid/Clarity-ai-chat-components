# Troubleshooting Guide

Quick solutions to common issues when using Clarity Chat.

---

## Installation Issues

### `pnpm: command not found`

**Solution:** Install pnpm globally:

```bash
npm install -g pnpm
```

### `ERESOLVE: unable to resolve dependency tree`

**Solution:** Clear npm cache and reinstall:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Build fails with TypeScript errors

**Solution:** Ensure you have TypeScript 5.0+:

```bash
npm install typescript@latest --save-dev
```

---

## Runtime Issues

### "Failed to fetch" error

**Cause:** Your API route is not running or CORS is misconfigured.

**Solutions:**

1. Check your API is running:
   ```bash
   curl -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{"messages":[]}'
   ```

2. Add CORS headers (Next.js):
   ```tsx
   // app/api/chat/route.ts
   export async function POST(req: Request) {
     // ... your code
     return new Response(body, {
       headers: {
         'Content-Type': 'text/event-stream',
         'Access-Control-Allow-Origin': '*',
       },
     })
   }
   ```

### Streaming not working

**Cause:** Your API isn't returning the correct content type.

**Solution:** Ensure your API returns `text/event-stream`:

```tsx
return new Response(response.body, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  },
})
```

### Styles not loading

**Cause:** Missing CSS import.

**Solution:** Add the import to your root component:

```tsx
import '@clarity-chat/react/styles.css'
```

For Next.js, add to `app/layout.tsx` or `_app.tsx`.

### Messages not appearing

**Cause:** State not updating correctly.

**Solution:** Ensure you're using the hook correctly:

```tsx
const { messages, append } = useClarityChat({ api: '/api/chat' })

// Correct way to send a message
const handleSend = async (content: string) => {
  await append({ role: 'user', content })
}

// Make sure to pass messages to ChatWindow
<ChatWindow messages={messages} onSendMessage={handleSend} />
```

---

## TypeScript Issues

### Type errors with message format

**Solution:** Use the correct type imports:

```tsx
import type { Message, CoreMessage } from '@clarity-chat/types'
```

### `Cannot find module '@clarity-chat/react'`

**Solution:** Check your `tsconfig.json` includes the node_modules:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "resolveJsonModule": true
  }
}
```

---

## Development Issues

### Hot reload not working

**Solution:** Restart your dev server:

```bash
# Kill existing processes
pkill -f "next dev"

# Restart
npm run dev
```

### Port already in use

**Solution:** Find and kill the process:

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use a different port
npm run dev -- --port 3001
```

### Storybook not loading components

**Solution:** Rebuild packages first:

```bash
pnpm build:packages
pnpm storybook
```

---

## Performance Issues

### Chat is slow with many messages

**Solution:** Enable virtualization:

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  itemSize={100}
  overscanCount={5}
/>
```

### High memory usage

**Solution:** Use memory strategies to limit context:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    strategy: 'sliding-window',
    maxTokens: 4000,  // Limit context size
  },
})
```

---

## API Provider Issues

### OpenAI: Rate limit exceeded

**Solution:** Add retry logic:

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  retry: {
    maxRetries: 3,
    delayMs: 1000,
  },
})
```

### Anthropic: Invalid API key

**Solution:** Verify your key format (should start with `sk-ant-`):

```bash
# Check your .env.local
ANTHROPIC_API_KEY=sk-ant-...
```

### Google: Model not found

**Solution:** Use the correct model name:

```tsx
// Correct
model: 'gemini-1.5-pro'

// Incorrect
model: 'gemini-pro'  // Deprecated
```

---

## Common Mistakes

### Forgetting `'use client'` in Next.js

```tsx
// Add this at the top of your component file
'use client'

import { ClarityChat } from '@clarity-chat/react'
```

### Not awaiting `append()`

```tsx
// Wrong - may cause race conditions
const handleSend = (content: string) => {
  append({ role: 'user', content })
}

// Correct
const handleSend = async (content: string) => {
  await append({ role: 'user', content })
}
```

### Modifying messages directly

```tsx
// Wrong - mutating state
messages.push(newMessage)

// Correct - use the provided methods
append(newMessage)
```

---

## Getting More Help

If your issue isn't listed here:

1. **Search existing issues:** [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
2. **Ask the community:** [Discord](https://discord.gg/clarity-chat)
3. **Check the docs:** [Documentation](./getting-started.md)
4. **Open a new issue:** Include:
   - Your Clarity Chat version
   - Your React version
   - Steps to reproduce
   - Error messages (full stack trace)
   - Code sample (minimal reproduction)

---

## Quick Reference

| Problem | First Thing to Try |
|---------|-------------------|
| Won't install | `rm -rf node_modules && npm install` |
| Won't build | `npm run typecheck` to see errors |
| Styles broken | Check CSS import |
| API errors | Check browser Network tab |
| TypeScript errors | Restart your IDE |
| Performance slow | Enable virtualization |
