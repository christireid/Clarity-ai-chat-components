# @clarity-chat/react

**Build beautiful AI chat interfaces in one line of code.**

[![npm version](https://img.shields.io/npm/v/@clarity-chat/react)](https://www.npmjs.com/package/@clarity-chat/react)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Installation

```bash
npm install @clarity-chat/react
```

## Quick Start

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

**That's it.** You now have a production-ready chat with streaming, error handling, and accessibility.

---

## Why Clarity Chat?

| Feature | Clarity Chat | DIY Solution |
|---------|-------------|--------------|
| Setup time | 1 line | Days |
| Streaming | Built-in | Manual |
| Memory management | 3 strategies | Build from scratch |
| Accessibility | WCAG AAA | DIY |
| Token optimization | Automatic | Manual |
| Error recovery | Auto-retry | Custom logic |

---

## Core Features

- **One-line setup** - `<ClarityChat api="/api/chat" />` and you're done
- **Layered architecture** - Start simple, scale to enterprise
- **Beautiful UI** - 70+ production-ready components
- **Built-in memory** - Three strategies for context retention
- **Streaming** - SSE and WebSocket support
- **Enterprise-ready** - RBAC, audit logging, multi-tenancy

### Basic Chat (With Hook - Mid-Level API)

```tsx
import { useClarityChat, ChatWindow, useChatHandlers } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function MyChat() {
  const chat = useClarityChat({
    api: '/api/chat',
  })

  // Pre-configured handlers - no boilerplate! ✨
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages} // No conversion needed! ✨
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
      onClear={handlers.onClear}
    />
  )
}
```

**Architecture**: This uses **Mid-Level APIs** for more control while maintaining ergonomics.

**What Changed:**

- ✅ `ChatWindow` now accepts `CoreMessage[]` directly - no conversion needed
- ✅ `useChatHandlers` provides pre-configured handlers - less boilerplate
- ✅ Simpler API - same power, easier to use

**When to Use**: Use this pattern when you need custom UI or more control than `ClarityChat`
provides.

### Using Presets (Top-Level APIs - Even Easier!)

```tsx
import { ClarityChatPresets } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

// Simple chat
function SimpleChat() {
  return <ClarityChatPresets.Simple api="/api/chat" />
}

// Chat with memory
function MemoryChat() {
  return <ClarityChatPresets.WithMemory api="/api/chat" memoryStrategy="sliding-window" />
}

// Enterprise chat with all features
function EnterpriseChat() {
  return <ClarityChatPresets.Enterprise api="/api/chat" />
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
      <button onClick={() => run({ query: 'gaming laptops' })}>Generate Products</button>
      {isLoading && <div>Generating...</div>}
      {object && (
        <div>
          {object.map((product) => (
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

## 📚 Examples

### Minimal Examples (10-20 lines)

See `packages/react/src/examples/minimal-examples.tsx` for:

- Basic chat with `ClarityChat`
- Chat with memory
- Structured output generation
- Tool-powered chat
- Custom streaming

### Mid-Level Examples (40-60 lines)

See `packages/react/src/examples/mid-level-examples.tsx` for:

- Composable chat with custom UI
- Memory integration patterns
- Tool registry setup
- Advanced streaming configuration

### Complex Examples (80-150 lines)

See `packages/react/src/examples/complex-examples.tsx` for:

- Enterprise chat with memory and advanced features
- Agent-powered chat with tools
- Multi-chat dashboard
- Custom streaming implementation

## 📚 Documentation

### Quick Start & Migration

- **[Getting Started with Clarity Chat](../../docs/getting-started-clarity-chat.md)** ⭐ - Quick
  start guide
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
const { messages, append, isLoading, error, memoryEnabled, contextSummary } = useClarityChat({
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

## 📊 Feature Comparison

### vs Vercel AI SDK UI

| Feature                 | Clarity Chat                                    | Vercel AI SDK UI                      |
| ----------------------- | ----------------------------------------------- | ------------------------------------- |
| **Drop-in Component**   | `<ClarityChat />` - one line                    | Requires hook + component composition |
| **Built-in Memory**     | 3 strategies (sliding-window, semantic, vector) | Manual implementation                 |
| **Tool UI Registry**    | `createToolUIRegistry()` - type-safe            | `experimental_toolRenderFunction`     |
| **Structured Output**   | `useClarityObject<T>` with streaming            | `useObject` (partial streaming)       |
| **Transport Options**   | SSE + WebSocket built-in                        | SSE only                              |
| **Enterprise Features** | RBAC, audit, multi-tenancy                      | Not included                          |
| **Token Optimization**  | Built-in budgeting, compression, caching        | Manual implementation                 |
| **UI Components**       | 70+ ready-to-use components                     | Minimal UI                            |
| **Presets**             | `ClarityChatPresets.Enterprise` etc.            | None                                  |
| **TypeScript**          | Full coverage with DTS                          | Full coverage                         |
| **Accessibility**       | WCAG 2.1 AA compliant                           | Basic                                 |

### Migration

Migrating from Vercel AI SDK? See our [Migration Guide](./MIGRATION_GUIDE.md) for a step-by-step
walkthrough.

## 🤝 Compatibility

### Vercel AI SDK

Full API compatibility with Vercel AI SDK UI hooks. Drop-in replacement for `useChat`,
`useCompletion`, and `useAssistant`.

### React Version

- React 18.0.0+ (recommended)
- React 19.0.0+ (full feature support)

### Bundle Size

- Full bundle: ~350KB gzipped
- Tree-shakeable: Import only what you need

## 📝 License

MIT License - See [LICENSE](../../LICENSE) file.

## 🙏 Acknowledgments

Built with inspiration from Vercel AI SDK and the React community.

---

**Ready to build?** Start with the [Getting Started Guide](./GETTING_STARTED.md)!
