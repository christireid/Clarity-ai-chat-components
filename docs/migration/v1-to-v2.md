# Migration Guide: v1 to v2

This guide helps you migrate from Clarity Chat v1 to v2.

---

## Overview

Clarity Chat v2 introduces:
- New flagship hook: `useClarityChat`
- Improved memory system
- Better TypeScript types
- Enhanced component APIs
- Performance improvements

**Migration effort:** Low to Medium (depending on usage)

---

## Quick Migration

### Step 1: Update Package

```bash
npm install @clarity-chat/react@latest
```

### Step 2: Update Imports

```tsx
// v1
import { useChat, ChatWindow } from '@clarity-chat/react'

// v2 (Recommended)
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
```

### Step 3: Update Hook Usage

```tsx
// v1
const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})

// v2
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

**That's it for basic usage!** The API is largely compatible.

---

## Detailed Changes

### Hook Changes

#### useChat → useClarityChat

**v1:**
```tsx
import { useChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useChat({
  api: '/api/chat',
})
```

**v2:**
```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
})
```

**Breaking Changes:**
- Hook name changed (but `useChat` still works as alias)
- Some internal APIs changed (not affecting most users)

**Migration:**
- Replace `useChat` with `useClarityChat`
- Or use `useChat` alias (still supported)

---

### Message Type Changes

#### Message Format

**v1:**
```tsx
type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}
```

**v2:**
```tsx
type Message = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number  // Required, renamed from timestamp
  status: 'sending' | 'sent' | 'streaming' | 'error'  // New
  metadata?: {
    tokens?: number
    processingTime?: number
    model?: string
  }
}
```

**Breaking Changes:**
- `timestamp` → `createdAt` (required)
- Added `status` field (required)
- Added `metadata` field (optional)

**Migration:**
```tsx
// v1
const message = {
  id: '1',
  role: 'user',
  content: 'Hello',
  timestamp: Date.now(),
}

// v2
const message = {
  id: '1',
  role: 'user',
  content: 'Hello',
  createdAt: Date.now(),  // Renamed
  status: 'sent',  // New, required
}
```

---

### Component API Changes

#### ChatWindow Props

**v1:**
```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  isLoading={isLoading}
/>
```

**v2:**
```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  isLoading={isLoading}
  // New optional props:
  // theme, className, showTokenCounter, etc.
/>
```

**Breaking Changes:** None (backward compatible)

**New Features:**
- `theme` prop for custom themes
- `showTokenCounter` prop
- `className` prop for styling
- More customization options

---

### Memory System Changes

#### Memory Configuration

**v1:**
```tsx
// Memory was less configurable
const { messages } = useChat({
  api: '/api/chat',
  memory: true,  // Simple boolean
})
```

**v2:**
```tsx
// Memory is more configurable
const { messages } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',  // New: choose strategy
    maxTokens: 4000,  // New: configurable
    autoCapture: true,  // New: auto memory capture
  },
})
```

**Breaking Changes:**
- `memory: true` → `memory: { enabled: true }`

**Migration:**
```tsx
// v1
memory: true

// v2
memory: {
  enabled: true,
  strategy: 'sliding-window',  // Default
  maxTokens: 4000,  // Default
}
```

---

## Common Migration Patterns

### Pattern 1: Basic Chat

**v1:**
```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**v2:**
```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function App() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

**Changes:** Just rename `useChat` → `useClarityChat`

---

### Pattern 2: With Memory

**v1:**
```tsx
const { messages, append } = useChat({
  api: '/api/chat',
  memory: true,
})
```

**v2:**
```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 4000,
  },
})
```

**Changes:** Update memory configuration format

---

### Pattern 3: Custom Message Format

**v1:**
```tsx
const messages = [
  {
    id: '1',
    role: 'user',
    content: 'Hello',
    timestamp: Date.now(),
  },
]
```

**v2:**
```tsx
const messages = [
  {
    id: '1',
    role: 'user',
    content: 'Hello',
    createdAt: Date.now(),  // Renamed
    status: 'sent',  // Required
  },
]
```

**Changes:** Update message format

---

## Migration Checklist

### Before Migration

- [ ] Review your current usage
- [ ] Check for deprecated APIs
- [ ] Backup your code
- [ ] Read this guide

### During Migration

- [ ] Update package version
- [ ] Update imports (`useChat` → `useClarityChat`)
- [ ] Update message formats (`timestamp` → `createdAt`, add `status`)
- [ ] Update memory configuration (if using)
- [ ] Test your application

### After Migration

- [ ] Test all features
- [ ] Check for console warnings
- [ ] Update tests
- [ ] Review new features

---

## Breaking Changes Summary

### High Impact

1. **Message Format**
   - `timestamp` → `createdAt` (required)
   - Added `status` field (required)

2. **Memory Configuration**
   - `memory: true` → `memory: { enabled: true }`

### Low Impact

1. **Hook Name**
   - `useChat` → `useClarityChat` (but alias still works)

2. **Type Exports**
   - Some internal types changed (rarely affects users)

---

## New Features in v2

### 1. Enhanced Memory System

```tsx
memory: {
  enabled: true,
  strategy: 'sliding-window' | 'semantic-chunks' | 'vector-store',
  maxTokens: 4000,
  autoCapture: true,
}
```

### 2. Better TypeScript Support

```tsx
// Improved type inference
const { messages } = useClarityChat({ api: '/api/chat' })
// messages is properly typed
```

### 3. Performance Improvements

- Faster rendering
- Better memory management
- Optimized streaming

### 4. New Components

- `TokenCounter` - Real-time token tracking
- `MemoryInspector` - Debug memory system
- `PerformanceDashboard` - Monitor performance

---

## Troubleshooting

### Issue: TypeScript errors after migration

**Solution:**
```bash
# Update TypeScript types
npm install @clarity-chat/types@latest
```

### Issue: Messages not displaying

**Solution:**
- Check message format (ensure `createdAt` and `status` are present)
- Verify message conversion if using custom format

### Issue: Memory not working

**Solution:**
- Update memory configuration format
- Ensure MemoryProvider is wrapping your app

---

## Need Help?

- [Documentation](./README.md)
- [Troubleshooting](./troubleshooting.md)
- [Discord](https://discord.gg/clarity-chat)
- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)

---

**Last Updated:** [Date]  
**Version:** v2.0
