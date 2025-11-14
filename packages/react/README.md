# @clarity-chat/react

> Enterprise-grade React components and hooks for building AI chat applications with Clarity.

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

- 🚀 **Flagship Chat Hook** - `useClarityChat` with full Vercel AI SDK compatibility
- 💾 **Memory Management** - Three strategies: sliding-window, semantic-chunks, vector-store
- 🎯 **Structured Output** - Type-safe object generation with `useClarityObject<T>`
- 🛠️ **Tool UI Registry** - Automatic rendering of tool results with custom components
- 📡 **Dual Transport** - SSE and WebSocket streaming support
- 🎨 **Production UI Components** - ChatWindow, ChatInput, VirtualizedMessageList, and more
- 🤖 **Agent Orchestration** - ReAct agent integration with tool support
- 🔄 **Error Recovery** - Built-in error handling and retry mechanisms
- ♿ **Accessible** - WCAG compliant components
- 📱 **Responsive** - Mobile-first design

## 📦 Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## 🚀 Quick Start

> 📖 **New to Clarity?** Start with the [Quick Start Guide](./QUICKSTART.md) or check the [Quick Reference](../../docs/QUICK_REFERENCE.md) for copy-paste snippets.

### Option 1: ClarityChat Component (Recommended) ⭐

**The simplest way to get started** - one line, zero boilerplate:

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it!** ✨ Automatic message conversion, built-in features, production-ready.

### Option 2: useChat Hook (Simplified)

For more control with a simpler API:

```tsx
import { useChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
  
  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={sendMessage}
    />
  )
}
```

### Option 3: useClarityChat Hook (Full Control)

For maximum control and advanced features:

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function MyChat() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### With Memory

```tsx
import { useClarityChat, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MyChat />
    </MemoryProvider>
  )
}

function MyChat() {
  const { messages, append, memoryEnabled } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return <ChatWindow messages={messages} onSendMessage={append} />
}
```

### Structured Output

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
}

function ProductRecommendations() {
  const { object, run, isLoading } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div>
      <button onClick={() => run({ query: 'gaming laptops' })}>
        Generate Products
      </button>
      {isLoading && <div>Generating...</div>}
      {object && (
        <div>
          {object.map(product => (
            <div key={product.name}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Tool UI Registry

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Define tool result component
function WeatherResult({ data }) {
  return (
    <Card>
      <CardHeader>Weather in {data.location}</CardHeader>
      <CardContent>
        <div>{data.temperature}°C</div>
        <div>{data.condition}</div>
      </CardContent>
    </Card>
  )
}

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Use in chat
<ClarityToolResult
  registry={toolRegistry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

## 📚 Documentation

### Quick Start & Migration
- **[Getting Started with Clarity Chat](../../docs/getting-started-clarity-chat.md)** ⭐ - Quick start guide
- **[Clarity vs Vercel AI SDK UI](../../docs/clarity-vs-vercel-ai-sdk-ui.md)** - Feature comparison
- **[Migrating from Vercel](../../docs/migrating-from-vercel.md)** - Migration guide

### Getting Started
- **[Getting Started Guide](./GETTING_STARTED.md)** ⭐ - Complete guide covering all features
- **[Quick Start](./QUICK_START.md)** - Get up and running in 5 minutes
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Migrate from Vercel AI SDK

### API Reference
- **[API Reference](./API_REFERENCE.md)** - Complete API documentation
- **[TypeScript Guide](./TYPESCRIPT_GUIDE.md)** - Type definitions and patterns
- **[Performance Guide](./PERFORMANCE_GUIDE.md)** - Optimization strategies

### Feature Guides
- **[Phase 3 README](./README_PHASE_3.md)** - Structured output & tool UI registry
- **[Phase 3 Examples](./PHASE_3_EXAMPLES.md)** - Usage patterns and examples
- **[All Phases Summary](./ALL_PHASES_SUMMARY.md)** - Complete overview

### Documentation Index
- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Complete documentation navigation

## 🎯 Core APIs

### Top-Level: Drop-In Components

#### `ClarityChat`
**The simplest way to add AI chat** - zero config, automatic everything.

```tsx
<ClarityChat api="/api/chat" />
```

#### `ChatWithMemory`
Chat component with memory pre-configured.

```tsx
<ChatWithMemory api="/api/chat" strategy="vector-store" />
```

#### `ChatComplete`
Full-featured chat with memory, analytics, and error handling.

```tsx
<ChatComplete api="/api/chat" memoryStrategy="vector-store" />
```

### Mid-Level: Composable Hooks

#### `useChat`
Simplified chat hook with automatic message conversion.

```tsx
const { messages, sendMessage, isLoading } = useChat({ api: '/api/chat' })
```

#### `useClarityChat`
Flagship chat hook with memory integration and transport selection.

```tsx
const {
  messages,
  append,
  isLoading,
  error,
  memoryEnabled,
  contextSummary,
} = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
  },
  transport: 'sse',
})
```

### `useClarityObject<T>`
Type-safe structured object generation.

```tsx
const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true,
})
```

### `useChatEnhanced`
Advanced chat hook with enhanced features.

```tsx
const { messages, append, isLoading } = useChatEnhanced({
  api: '/api/chat',
  experimental: {
    generateMetadata: true,
  },
})
```

### `useAssistant`
Assistant hook with tool support.

```tsx
const { messages, toolInvocations, append } = useAssistant({
  api: '/api/assistant',
  tools: [weatherTool, searchTool],
})
```

## 🧩 Components

### Chat Components
- `ChatWindow` - Complete chat interface
- `ChatInput` - Message input component
- `AdvancedChatInput` - Enhanced input with attachments
- `VirtualizedMessageList` - Optimized message list
- `StreamingMessage` - Real-time streaming display

### Tool Components
- `ClarityToolResult` - Tool result renderer
- `ToolInvocationCard` - Tool invocation display
- `AgentRunFeed` - Agent execution feed

### Utility Components
- `ThinkingIndicator` - Loading indicator
- `ErrorBoundary` - Error boundary wrapper
- `RetryButton` - Retry action button
- `NetworkStatus` - Connection status

## 🔧 Memory Strategies

### Sliding Window
Fast, recent context management.

```tsx
memory: {
  strategy: 'sliding-window',
  maxTokens: 2000,
}
```

### Semantic Chunks
Context-aware memory selection.

```tsx
memory: {
  strategy: 'semantic-chunks',
  maxTokens: 6000,
}
```

### Vector Store
Long-term memory with embeddings.

```tsx
memory: {
  strategy: 'vector-store',
  maxTokens: 10000,
}
```

## 🌐 Transport Protocols

### Server-Sent Events (SSE)
Default, HTTP-based streaming.

```tsx
transport: 'sse'
```

### WebSocket
Real-time bidirectional communication.

```tsx
transport: 'websocket'
```

## 📖 Examples

### Example Apps
- **[Basic Chat Example](../../apps/examples/use-clarity-chat-showcase/)** - Complete showcase
- **[Vercel-Compatible Example](../../apps/examples/vercel-ai-sdk-compatible/)** - Migration example

### Code Examples
- `examples/basic-clarity-chat-example.tsx` - Basic usage
- `examples/advanced-clarity-chat-example.tsx` - Advanced features
- `examples/product-recommendation-object.tsx` - Structured output
- `examples/generative-ui-tools.tsx` - Tool UI registry
- `examples/generative-ui-integrated.tsx` - Full integration

### Storybook
- **[Storybook Stories](../../apps/storybook/)** - Interactive component examples

## 🧪 Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

## 🏗️ Building

```bash
# Build package
pnpm build

# Development mode
pnpm dev

# Type checking
pnpm typecheck

# Linting
pnpm lint
```

## 🔗 Related Packages

- `@clarity-chat/memory` - Memory management system
- `@clarity-chat/types` - Shared type definitions
- `@clarity-chat/primitives` - Primitive components

## 🤝 Compatibility

### Vercel AI SDK
Full API compatibility with Vercel AI SDK UI. See [Migration Guide](./MIGRATION_GUIDE.md).

### React Version
Requires React 19.0.0 or higher.

## 📝 License

See [LICENSE](../../LICENSE) file.

## 🙏 Acknowledgments

Built with inspiration from Vercel AI SDK and the React community.

---

**Ready to build?** Start with the [Getting Started Guide](./GETTING_STARTED.md)!
