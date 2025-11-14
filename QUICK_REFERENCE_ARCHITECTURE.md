# Clarity Chat - Quick Reference: Architecture & APIs

## 🎯 Quick Start (3 Lines)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

<ClarityChat api="/api/chat" />
```

## 📚 Architecture Layers

### Top-Level (Drop-in Ready)
**Use when**: You want something working in minutes with minimal config

```tsx
// Components
import { ClarityChat, ClarityChatPresets } from '@clarity-chat/react'

// Hooks
import { useClarityChat, useClarityObject } from '@clarity-chat/react'

// Providers
import { MemoryProvider } from '@clarity-chat/react'
```

### Mid-Level (Composable)
**Use when**: You need more control but want sensible defaults

```tsx
// Components
import { ChatWindow, ChatInput, MessageList } from '@clarity-chat/react'

// Hooks
import { useChatEnhanced, useChatHandlers, useMemoryContext } from '@clarity-chat/react'
```

### Low-Level (Primitives)
**Use when**: You're building something custom or extending the platform

```tsx
// Utilities
import { normalizeMessages, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { createStreamReader, parseStreamChunk } from '@clarity-chat/react'
```

## 🏗️ Core Domains

### 1. Chat UI
**Top-Level**: `ClarityChat`, `ClarityChatPresets`  
**Mid-Level**: `ChatWindow`, `ChatInput`, `MessageList`  
**Low-Level**: `Message`, `MessageContent`

### 2. Chat State
**Top-Level**: `useClarityChat`  
**Mid-Level**: `useChatEnhanced`, `useChatHandlers`  
**Low-Level**: `useChat`, `normalizeMessages`

### 3. Memory & Context
**Top-Level**: `MemoryProvider`  
**Mid-Level**: `useMemoryContext`  
**Low-Level**: `MemoryService`, `createVectorStore`

### 4. Streaming & Transport
**Top-Level**: `useClarityChat` (transport option)  
**Mid-Level**: `useStreamingSSE`, `useStreamingWebSocket`  
**Low-Level**: `createStreamReader`, `parseStreamChunk`

### 5. Tools & Agents
**Top-Level**: `useClarityObject<T>`, `createAgent`  
**Mid-Level**: `useClarityChatWithTools`, `ToolUIRegistry`  
**Low-Level**: `Tool`, `ToolResult`, `parseToolArguments`

### 6. Enterprise Infrastructure
**Top-Level**: `AnalyticsProvider`, `QuotaProvider`, `RBACProvider`  
**Mid-Level**: `useAnalytics`, `useQuota`  
**Low-Level**: `AnalyticsService`, `QuotaService`

### 7. Developer Experience
**Top-Level**: `ClarityChatPresets`, `createMemoryChatConfig`  
**Mid-Level**: `useChatHandlers`, `createChatConfig`  
**Low-Level**: `isValidApiEndpoint`, `getApiEndpoint`

## 🎨 Common Patterns

### Pattern 1: Simple Chat
```tsx
<ClarityChat api="/api/chat" />
```

### Pattern 2: Chat with Memory
```tsx
<ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="vector-store" />
```

### Pattern 3: Custom Chat with Handlers
```tsx
const chat = useClarityChat({ api: '/api/chat' })
const handlers = useChatHandlers({ chat })

<ChatWindow
  messages={chat.messages}
  onSendMessage={handlers.onSendMessage}
  onClear={handlers.onClear}
/>
```

### Pattern 4: Enterprise Setup
```tsx
<AnalyticsProvider config={analyticsConfig}>
  <QuotaProvider config={quotaConfig}>
    <RBACProvider config={rbacConfig}>
      <ClarityChatPresets.Enterprise api="/api/chat" />
    </RBACProvider>
  </QuotaProvider>
</AnalyticsProvider>
```

## 📖 API Naming Conventions

### Components
- **Top-level**: `ClarityX`, `XPresets` (e.g., `ClarityChat`, `ClarityChatPresets`)
- **Mid-level**: `XWindow`, `XInput`, `XList` (e.g., `ChatWindow`, `ChatInput`)
- **Low-level**: Generic names (e.g., `Message`, `Button`)

### Hooks
- **Top-level**: `useClarityX` (e.g., `useClarityChat`, `useClarityObject`)
- **Mid-level**: `useXCore`, `useXContext`, `useXWithY` (e.g., `useChatCore`, `useMemoryContext`)
- **Low-level**: `useX`, utility hooks (e.g., `useChat`, `useDebounce`)

### Utilities
- **Top-level**: `createXConfig`, `createXPreset` (e.g., `createMemoryChatConfig`)
- **Mid-level**: `createX`, `buildX` (e.g., `createUserMessage`, `buildContextBundle`)
- **Low-level**: `normalizeX`, `parseX`, `validateX` (e.g., `normalizeMessages`)

## 🔍 Finding the Right API

1. **Start with Top-Level**: Try `ClarityChat` or `useClarityChat` first
2. **Need More Control?**: Use Mid-Level APIs like `ChatWindow` + `useChatHandlers`
3. **Building Custom?**: Use Low-Level primitives like `normalizeMessages`

## 📚 Documentation

- **Architecture**: See `DESIGN.md` for complete architecture documentation
- **Examples**: See `packages/react/src/examples/happy-path-workflows.tsx`
- **Structured Exports**: See `packages/react/src/exports.ts`

## 🚀 Next Steps

1. Read `DESIGN.md` for architecture details
2. Check examples in `packages/react/src/examples/`
3. Explore domain-specific APIs as needed
4. Use TypeScript types for autocomplete and type safety
