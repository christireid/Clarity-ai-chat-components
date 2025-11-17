# Phase 2 Quick Reference

## Domain Architecture at a Glance

```
Chat UI          → ClarityChat, useChat, ChatWindow
Memory & Context → useMemory, MemoryProvider, MemoryService
AI Infrastructure → createAgent, useStreaming, ReactAgent
Enterprise       → useRBAC, useAudit, TenantProvider
Analytics        → useAnalytics, AnalyticsProvider
DX               → chatPresets, useChatComposable
```

## Top-Level APIs (Drop-in Ready)

### Chat UI
```tsx
<ClarityChat api="/api/chat" />
<ChatWithMemory api="/api/chat" strategy="vector-store" />
<ChatComplete api="/api/chat" />
```

### Memory & Context
```tsx
const { query, store } = useMemory()
<MemoryProvider config={{ ... }}>...</MemoryProvider>
```

### AI Infrastructure
```tsx
const agent = createAgent({ tools: [...] })
const { stream } = useStreaming({ endpoint: '/api/stream' })
```

### Analytics
```tsx
const { track } = useAnalytics()
<AnalyticsProvider config={{ ... }}>...</AnalyticsProvider>
```

## Mid-Level APIs (Composable)

### Chat UI
```tsx
const { messages, sendMessage } = useChat({ api: '/api/chat' })
const chat = useClarityChat({ api: '/api/chat', memory: { enabled: true } })
<ChatWindow messages={messages} onSendMessage={sendMessage} />
```

### Memory
```tsx
const { query } = useMemoryQuery()
const { optimize } = useMemoryOptimization()
```

### AI Infrastructure
```tsx
const agent = new ReactAgent({ tools: [...] })
const { stream } = useStreamingSSE({ endpoint: '/api/stream' })
```

## Low-Level APIs (Primitives)

### Chat UI
```tsx
const messages = convertCoreMessagesToMessages(coreMessages)
<Message message={msg} onCopy={handleCopy} />
```

### Memory
```tsx
const service = new MemoryService(config)
const optimizer = new ContextOptimizer()
```

### AI Infrastructure
```tsx
const parser = new StreamParser()
const adapter = new OpenAIAdapter(apiKey)
```

## Happy Path Workflows

### 1. Chat with Memory (1 line)
```tsx
<ChatWithMemory api="/api/chat" strategy="vector-store" />
```

### 2. Custom Dashboard (~15 lines)
```tsx
const chat = useChat({ api: '/api/chat' })
const { track } = useAnalytics()
return <ChatWindow messages={chat.messages} onSendMessage={...} />
```

### 3. Memory + Chat (~20 lines)
```tsx
<MemoryProvider config={{ ... }}>
  <ChatApp /> {/* uses useClarityChat with memory */}
</MemoryProvider>
```

### 4. Enterprise Chat (~10 lines)
```tsx
<AnalyticsProvider config={{ ... }}>
  <ChatComplete api="/api/chat" memoryStrategy="vector-store" />
</AnalyticsProvider>
```

## Import Patterns

### Standard (Recommended)
```tsx
import { ClarityChat, useChat, useMemory } from '@clarity-chat/react'
```

### Domain-Organized (Optional)
```tsx
import { ClarityChat } from '@clarity-chat/react/exports/chat-ui'
import { useMemory } from '@clarity-chat/react/exports/memory-context'
```

## API Naming Conventions

- **Hooks**: `use*` prefix
- **Components**: PascalCase
- **Configs**: Grouped with `advanced` options
- **Callbacks**: `on*` prefix (onChange, onSubmit, etc.)

## See Also

- `DESIGN.md` - Full architecture documentation
- `PHASE_2_FINAL_OUTPUT.md` - Complete summary
- `MIGRATION_GUIDE_PHASE_2.md` - Migration details
- `happy-path-workflows.tsx` - Copy-pasteable examples
