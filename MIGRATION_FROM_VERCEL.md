# Migration Guide: From Vercel AI SDK to Clarity Chat

This guide helps you migrate from Vercel AI SDK to Clarity Chat while maintaining full API compatibility.

## Quick Migration

### Step 1: Install Clarity Chat

```bash
npm uninstall ai
npm install @clarity-chat/react
```

### Step 2: Update Imports

**Before (Vercel AI SDK):**
```tsx
import { useChat, useCompletion, useAssistant } from 'ai/react'
```

**After (Clarity Chat):**
```tsx
import { useChat, useCompletion, useAssistant } from '@clarity-chat/react'
```

**That's it!** The API is fully compatible - no code changes needed.

## Detailed Migration Examples

### useChat Hook

**Before:**
```tsx
import { useChat } from 'ai/react'

function Chat() {
  const { messages, append, isLoading, handleSubmit, input, setInput } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Finished:', message)
    },
  })

  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>{m.role}: {m.content}</div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

**After (Same Code):**
```tsx
import { useChat } from '@clarity-chat/react'

// ... exact same code works!
```

### useCompletion Hook

**Before:**
```tsx
import { useCompletion } from 'ai/react'

function Completion() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
  })

  return (
    <div>
      <button onClick={() => complete('Hello')}>Complete</button>
      <div>{completion}</div>
    </div>
  )
}
```

**After (Same Code):**
```tsx
import { useCompletion } from '@clarity-chat/react'

// ... exact same code works!
```

### useAssistant Hook

**Before:**
```tsx
import { useAssistant } from 'ai/react'

function Assistant() {
  const { status, messages, submitMessage } = useAssistant({
    api: '/api/assistant',
    assistantId: 'my-assistant',
  })

  return (
    <div>
      <div>Status: {status}</div>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
    </div>
  )
}
```

**After (Same Code):**
```tsx
import { useAssistant } from '@clarity-chat/react'

// ... exact same code works!
```

## Additional Features Available

After migrating, you gain access to:

### 1. Complete Component Library

```tsx
import { ChatWindow, MessageList, ChatInput } from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### 2. Theming System

```tsx
import { ThemeProvider, themes } from '@clarity-chat/react'

function App() {
  return (
    <ThemeProvider theme={themes.ocean}>
      <Chat />
    </ThemeProvider>
  )
}
```

### 3. Enterprise Features

```tsx
import { useChat } from '@clarity-chat/react'
import { AnalyticsProvider } from '@clarity-chat/react'
import { ErrorBoundary } from '@clarity-chat/react'

function EnterpriseChat() {
  const chat = useChat({ api: '/api/chat' })

  return (
    <ErrorBoundary>
      <AnalyticsProvider>
        <ChatWindow {...chat} />
      </AnalyticsProvider>
    </ErrorBoundary>
  )
}
```

## API Compatibility Matrix

| Feature | Vercel AI SDK | Clarity Chat | Compatible |
|---------|--------------|--------------|------------|
| `useChat` API | ✅ | ✅ | ✅ 100% |
| `useCompletion` API | ✅ | ✅ | ✅ 100% |
| `useAssistant` API | ✅ | ✅ | ✅ 100% |
| Streaming (SSE) | ✅ | ✅ | ✅ 100% |
| Callbacks (`onFinish`, `onError`) | ✅ | ✅ | ✅ 100% |
| Abort/Stop | ✅ | ✅ | ✅ 100% |
| Message Types | ✅ | ✅ | ✅ 100% |

## What's Different?

### Advantages

1. **Components**: 70+ production-ready components
2. **Theming**: 11 built-in themes + custom themes
3. **Enterprise**: Multi-tenancy, RBAC, audit logging
4. **Accessibility**: WCAG 2.1 AAA compliant
5. **Analytics**: Built-in analytics integration
6. **Error Handling**: Enhanced error recovery
7. **TypeScript**: Better type definitions

### Backward Compatibility

- ✅ All Vercel AI SDK APIs work identically
- ✅ No breaking changes
- ✅ Drop-in replacement
- ✅ Same streaming formats supported

## Troubleshooting

### Issue: Streaming not working

**Solution:** Ensure your API endpoint returns SSE format:
```
data: {"content":"chunk1"}

data: {"content":"chunk2"}

data: [DONE]
```

### Issue: Types not matching

**Solution:** Update TypeScript imports:
```tsx
import type { CoreMessage } from '@clarity-chat/react'
```

### Issue: Need more features

**Solution:** Explore Clarity Chat's additional features:
- Vector stores & RAG
- Agent orchestration
- Voice input
- Command palette
- And more!

## Need Help?

- 📖 [Full Documentation](./docs/README.md)
- 💬 [Discord Community](https://discord.gg/clarity-chat)
- 🐛 [Report Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

## Summary

Migrating from Vercel AI SDK to Clarity Chat is **simple**:

1. Change the import: `'ai/react'` → `'@clarity-chat/react'`
2. Keep all your existing code
3. Gain access to 70+ components and enterprise features

**Zero code changes required!** 🎉
