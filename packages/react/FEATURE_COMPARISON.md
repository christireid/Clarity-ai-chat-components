# Feature Comparison: Clarity vs Vercel AI SDK UI

Comprehensive comparison of Clarity React library features against Vercel AI SDK UI.

## Quick Comparison Table

| Feature | Clarity | Vercel AI SDK UI | Notes |
|---------|---------|------------------|-------|
| **Chat Hook** | ✅ `useClarityChat` | ✅ `useChat` | Full API compatibility |
| **Memory Management** | ✅ 3 strategies | ❌ None | Clarity advantage |
| **Transport Protocols** | ✅ SSE + WebSocket | ✅ SSE only | Clarity advantage |
| **Structured Output** | ✅ `useClarityObject<T>` | ✅ `generateObject` (server) | Clarity has client hook |
| **Tool UI Registry** | ✅ `ClarityToolResult` | ⚠️ Manual | Clarity advantage |
| **UI Components** | ✅ Production-ready | ⚠️ Minimal | Clarity advantage |
| **Error Recovery** | ✅ Built-in | ⚠️ Basic | Clarity advantage |
| **Agent Orchestration** | ✅ ReAct agents | ❌ None | Clarity advantage |
| **Streaming** | ✅ SSE + WebSocket | ✅ SSE | Clarity advantage |
| **TypeScript** | ✅ Full support | ✅ Full support | Equal |
| **React 19** | ✅ Supported | ✅ Supported | Equal |

## Detailed Feature Comparison

### 1. Chat Hooks

#### Vercel AI SDK UI
```tsx
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit } = useChat({
  api: '/api/chat',
})
```

#### Clarity React
```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, input, setInput, append, isLoading } = useClarityChat({
  api: '/api/chat',
  memory: { enabled: true, strategy: 'sliding-window' },
  transport: 'sse',
})
```

**Clarity Advantages:**
- Memory integration
- Transport selection
- Context enrichment
- Auto memory capture
- Context summary generation

### 2. Memory Management

#### Vercel AI SDK UI
❌ No built-in memory management. Developers must implement their own context management.

#### Clarity React
✅ Three memory strategies:

**Sliding Window**
```tsx
memory: {
  strategy: 'sliding-window',
  maxTokens: 2000,
}
```

**Semantic Chunks**
```tsx
memory: {
  strategy: 'semantic-chunks',
  maxTokens: 6000,
}
```

**Vector Store**
```tsx
memory: {
  strategy: 'vector-store',
  maxTokens: 10000,
}
```

**Clarity Advantages:**
- Built-in memory strategies
- Automatic context management
- Token optimization
- Memory visualization

### 3. Structured Output

#### Vercel AI SDK UI
Server-side only:
```tsx
import { generateObject } from 'ai'

const result = await generateObject({
  model: openai('gpt-4'),
  schema: z.object({ ... }),
  prompt: '...',
})
```

#### Clarity React
Client-side hook:
```tsx
import { useClarityObject } from '@clarity-chat/react'

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true,
})
```

**Clarity Advantages:**
- Client-side hook
- Streaming support
- Type-safe generics
- React integration

### 4. Tool UI Registry

#### Vercel AI SDK UI
Manual rendering:
```tsx
{toolInvocations.map(invocation => (
  <div key={invocation.toolCallId}>
    {invocation.toolName === 'weather' && (
      <WeatherDisplay data={invocation.result} />
    )}
  </div>
))}
```

#### Clarity React
Automatic registry:
```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

const registry = createToolUIRegistry({
  get_weather: WeatherResult,
  search: SearchResult,
})

<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

**Clarity Advantages:**
- Type-safe registry
- Automatic rendering
- Fallback handling
- Message context integration

### 5. UI Components

#### Vercel AI SDK UI
Minimal components:
- Basic message rendering
- No production-ready components

#### Clarity React
Production-ready components:
- `ChatWindow` - Complete chat interface
- `ChatInput` - Message input with attachments
- `VirtualizedMessageList` - Optimized message list
- `StreamingMessage` - Real-time streaming display
- `ToolInvocationCard` - Tool invocation display
- `AgentRunFeed` - Agent execution feed
- `ThinkingIndicator` - Loading states
- `ErrorBoundary` - Error handling
- And 50+ more components

**Clarity Advantages:**
- Production-ready UI
- Accessibility (WCAG compliant)
- Responsive design
- Customizable themes

### 6. Transport Protocols

#### Vercel AI SDK UI
- ✅ Server-Sent Events (SSE)
- ❌ WebSocket (not supported)

#### Clarity React
- ✅ Server-Sent Events (SSE) - Default
- ✅ WebSocket - Real-time bidirectional

**Clarity Advantages:**
- WebSocket support for real-time apps
- Protocol selection
- Automatic fallback

### 7. Error Handling

#### Vercel AI SDK UI
Basic error handling:
```tsx
const { error } = useChat()
{error && <div>Error: {error.message}</div>}
```

#### Clarity React
Built-in error recovery:
```tsx
import { ErrorBoundary, RetryButton } from '@clarity-chat/react'

<ErrorBoundary fallback={<RetryButton />}>
  <ChatWindow />
</ErrorBoundary>
```

**Clarity Advantages:**
- Error boundaries
- Retry mechanisms
- Network status tracking
- Error classification

### 8. Agent Orchestration

#### Vercel AI SDK UI
❌ No built-in agent system

#### Clarity React
✅ ReAct agent integration:
```tsx
import { ReactAgent } from '@clarity-chat/react'

const agent = new ReactAgent({
  tools: [weatherTool, searchTool],
  model: 'gpt-4',
})
```

**Clarity Advantages:**
- ReAct agent pattern
- Tool integration
- Agent execution tracking
- Agent run visualization

## Migration Path

### From Vercel AI SDK UI to Clarity

1. **Replace `useChat` with `useClarityChat`**
   ```tsx
   // Before
   import { useChat } from 'ai/react'
   
   // After
   import { useClarityChat } from '@clarity-chat/react'
   ```

2. **Add Memory (Optional)**
   ```tsx
   useClarityChat({
     api: '/api/chat',
     memory: { enabled: true },
   })
   ```

3. **Use Production Components**
   ```tsx
   import { ChatWindow } from '@clarity-chat/react'
   ```

4. **Add Tool UI Registry (Optional)**
   ```tsx
   import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'
   ```

See [Migration Guide](./MIGRATION_GUIDE.md) for detailed instructions.

## When to Choose Clarity

Choose Clarity when you need:
- ✅ Memory management for long conversations
- ✅ Production-ready UI components
- ✅ Tool UI registry for generative UI
- ✅ WebSocket support for real-time apps
- ✅ Agent orchestration
- ✅ Enterprise features (RBAC, quotas, audit)
- ✅ Advanced error recovery
- ✅ Full TypeScript support

## When to Choose Vercel AI SDK UI

Choose Vercel AI SDK UI when you need:
- ✅ Minimal dependencies
- ✅ Simple chat without memory
- ✅ Server-side structured output only
- ✅ Basic UI (build your own)
- ✅ SSE-only streaming

## Feature Parity Status

| Category | Status | Notes |
|----------|--------|-------|
| Core Chat | ✅ Complete | Full API compatibility |
| Streaming | ✅ Complete | Plus WebSocket support |
| Structured Output | ✅ Complete | Plus client hook |
| Tool Usage | ✅ Complete | Plus UI registry |
| Error Handling | ✅ Complete | Plus recovery mechanisms |
| Memory | ✅ Clarity Advantage | Not in Vercel |
| UI Components | ✅ Clarity Advantage | Not in Vercel |
| Agents | ✅ Clarity Advantage | Not in Vercel |
| Transport | ✅ Clarity Advantage | WebSocket support |

## Summary

Clarity React library provides **full compatibility** with Vercel AI SDK UI while adding:
- Memory management
- Production UI components
- Tool UI registry
- WebSocket support
- Agent orchestration
- Enterprise features

**Migration is straightforward** - see [Migration Guide](./MIGRATION_GUIDE.md).

---

**Ready to migrate?** Start with the [Getting Started Guide](./GETTING_STARTED.md)!
