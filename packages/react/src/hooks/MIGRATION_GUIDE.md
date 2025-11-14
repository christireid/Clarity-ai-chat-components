# Migration Guide: Vercel AI SDK → Clarity useClarityChat

This guide helps you migrate from Vercel AI SDK's `useChat` to Clarity's `useClarityChat` hook.

## Quick Migration (Drop-in Replacement)

`useClarityChat` is designed as a **drop-in replacement** for Vercel's `useChat`. In most cases, you only need to change the import:

### Before (Vercel AI SDK)

```tsx
import { useChat } from 'ai/react'

function MyChat() {
  const { messages, input, setInput, append, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Finished:', message)
    },
  })

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.role}: {msg.content}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => append({ role: 'user', content: input })}>
        Send
      </button>
    </div>
  )
}
```

### After (Clarity)

```tsx
import { useClarityChat } from '@clarity-chat/react'

function MyChat() {
  const { messages, input, setInput, append, isLoading, error } = useClarityChat({
    api: '/api/chat',
    initialMessages: [],
    onFinish: (message) => {
      console.log('Finished:', message)
    },
  })

  // Same code - no changes needed!
  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.role}: {msg.content}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={() => append({ role: 'user', content: input })}>
        Send
      </button>
    </div>
  )
}
```

**That's it!** The API is identical, so your existing code works without changes.

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
# Remove Vercel AI SDK (if you're fully migrating)
npm uninstall ai

# Install Clarity (if not already installed)
npm install @clarity-chat/react
```

### Step 2: Update Imports

```tsx
// Before
import { useChat } from 'ai/react'
import type { Message } from 'ai'

// After
import { useClarityChat } from '@clarity-chat/react'
import type { CoreMessage } from '@clarity-chat/react'
```

### Step 3: Replace Hook Calls

```tsx
// Before
const chat = useChat({ ... })

// After
const chat = useClarityChat({ ... })
```

### Step 4: Update Types (if needed)

If you're using TypeScript and have custom types:

```tsx
// Before
import type { UseChatOptions, UseChatReturn } from 'ai/react'

// After
import type { 
  UseClarityChatOptions, 
  UseClarityChatReturn 
} from '@clarity-chat/react'
```

### Step 5: Use Clarity Components (Optional)

If you want to use Clarity's pre-built components:

```tsx
import { ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

function MyChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={convertCoreMessagesToMessages(messages)}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

## API Compatibility

### ✅ Fully Compatible

These APIs work exactly the same:

- `messages` - Array of messages
- `input` / `setInput` - Input state
- `append` - Append a message
- `reload` - Reload last message
- `stop` - Stop streaming
- `handleSubmit` - Form submission handler
- `isLoading` - Loading state
- `error` - Error state
- `data` - Current streaming data

### ✅ Enhanced Features

Clarity adds these features without breaking compatibility:

- `memoryInfo` - Memory statistics
- `memoryErrorInfo` - Memory error information

### ⚠️ Type Differences

- Vercel uses `Message` type
- Clarity uses `CoreMessage` type (compatible, but different name)
- Use `convertCoreMessagesToMessages()` when using `ChatWindow`

## Feature Comparison

| Feature | Vercel AI SDK | Clarity useClarityChat |
|---------|---------------|------------------------|
| **Basic Chat** | ✅ | ✅ (100% compatible) |
| **Streaming** | ✅ SSE | ✅ SSE + WebSocket |
| **Memory** | ❌ | ✅ Built-in |
| **Error Recovery** | Basic | ✅ Advanced with retry |
| **UI Components** | ❌ | ✅ Complete set |
| **TypeScript** | ✅ | ✅ Enhanced types |
| **Error Handling** | Basic | ✅ Comprehensive |

## Migration Scenarios

### Scenario 1: Simple Chat (No Changes Needed)

If you're using basic chat functionality, just change the import:

```tsx
// Change this:
import { useChat } from 'ai/react'

// To this:
import { useClarityChat } from '@clarity-chat/react'
```

### Scenario 2: Using with ChatWindow Component

```tsx
// Before (custom UI)
import { useChat } from 'ai/react'

function Chat() {
  const { messages, append } = useChat({ api: '/api/chat' })
  // ... custom UI code
}

// After (using Clarity components)
import { 
  useClarityChat, 
  ChatWindow, 
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'

function Chat() {
  const { messages, append, isLoading } = useClarityChat({ 
    api: '/api/chat' 
  })
  
  return (
    <ChatWindow
      messages={convertCoreMessagesToMessages(messages)}
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

### Scenario 3: Adding Memory (New Feature)

```tsx
import { 
  useClarityChat, 
  MemoryProvider 
} from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxMemories: 1000 }}>
      <Chat />
    </MemoryProvider>
  )
}

function Chat() {
  const { messages, append, memoryInfo } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'vector-store',
    },
  })
  
  // Memory is automatically:
  // - Queried before sending messages
  // - Stored after receiving responses
  // - Available via memoryInfo.memoryCount
}
```

### Scenario 4: Using WebSocket Transport

```tsx
// Vercel only supports SSE
const chat = useChat({ api: '/api/chat' })

// Clarity supports both SSE and WebSocket
const chat = useClarityChat({
  api: '/api/chat/ws',
  transport: 'websocket',
  websocket: {
    autoReconnect: true,
    enableHeartbeat: true,
  },
})
```

### Scenario 5: Error Handling

```tsx
// Before (basic error handling)
const { error } = useChat({ api: '/api/chat' })
if (error) {
  console.error(error)
}

// After (comprehensive error handling)
const { error, memoryErrorInfo } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    retryOnError: true,
    maxRetryAttempts: 3,
    onMemoryError: (err, operation) => {
      // Custom error handling
      trackError('memory_error', { operation, error: err.message })
    },
  },
})

// Check both chat and memory errors
if (error) {
  console.error('Chat error:', error)
}
if (memoryErrorInfo.memoryError) {
  console.error('Memory error:', memoryErrorInfo.memoryError)
  console.log('Error type:', memoryErrorInfo.memoryErrorType)
}
```

## Common Issues & Solutions

### Issue 1: Type Errors with ChatWindow

**Problem:**
```tsx
<ChatWindow messages={messages} /> // Type error!
```

**Solution:**
```tsx
import { convertCoreMessagesToMessages } from '@clarity-chat/react'

<ChatWindow messages={convertCoreMessagesToMessages(messages)} />
```

### Issue 2: Memory Not Working

**Problem:** Memory features don't work

**Solution:**
```tsx
// Wrap with MemoryProvider
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxMemories: 1000 }}>
      <YourChatComponent />
    </MemoryProvider>
  )
}
```

### Issue 3: WebSocket Connection Fails

**Problem:** WebSocket transport doesn't connect

**Solution:**
```tsx
// Check endpoint URL (must be ws:// or wss://)
const chat = useClarityChat({
  api: 'wss://api.example.com/chat', // Use WebSocket URL
  transport: 'websocket',
})
```

### Issue 4: Import Errors

**Problem:** Cannot find module '@clarity-chat/react'

**Solution:**
```bash
# Make sure package is installed
npm install @clarity-chat/react

# Or if using pnpm
pnpm add @clarity-chat/react
```

## Benefits of Migrating

### 1. **Memory Integration**
- Automatic conversation context
- Vector search for relevant memories
- Persistent conversation history

### 2. **Better Error Handling**
- Automatic retry with exponential backoff
- Error classification
- Custom error callbacks

### 3. **Production-Ready Components**
- Pre-built `ChatWindow` component
- Virtualized message lists
- Thinking indicators
- Tool invocation cards

### 4. **Multiple Transport Options**
- SSE (Vercel-compatible)
- WebSocket (real-time, bidirectional)

### 5. **Enhanced TypeScript Support**
- Better type inference
- Comprehensive type utilities
- Message conversion helpers

## Migration Checklist

- [ ] Update imports from `ai/react` to `@clarity-chat/react`
- [ ] Replace `useChat` with `useClarityChat`
- [ ] Update TypeScript types (if using custom types)
- [ ] Test basic chat functionality
- [ ] (Optional) Add `MemoryProvider` for memory features
- [ ] (Optional) Use `ChatWindow` component
- [ ] (Optional) Enable memory integration
- [ ] (Optional) Configure error handling
- [ ] (Optional) Switch to WebSocket transport

## Need Help?

- Check [USE_CLARITY_CHAT.md](./USE_CLARITY_CHAT.md) for detailed API documentation
- See [examples](../examples/) for complete working examples
- Review error handling in [error handling example](../examples/clarity-chat-error-handling-example.tsx)

## Rollback Plan

If you need to rollback:

1. Change imports back to `ai/react`
2. Replace `useClarityChat` with `useChat`
3. Remove Clarity-specific features (memory, WebSocket, etc.)

Your code will work exactly as before since Clarity maintains API compatibility.
