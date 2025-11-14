# Clarity Chat Quick Reference

Quick reference guide for common Clarity Chat patterns and APIs.

## Installation

```bash
npm install @clarity-chat/react
pnpm add @clarity-chat/react
yarn add @clarity-chat/react
```

## Basic Chat Setup

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function Page() {
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
      onSendMessage={(content) => append({ role: 'user', content })}
      isLoading={isLoading}
    />
  )
}
```

## With Memory

```tsx
import { MemoryProvider } from '@clarity-chat/react'

// Wrap app
<MemoryProvider config={{ maxTokens: 10000 }}>
  <App />
</MemoryProvider>

// In component
const { messages, append } = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window', // or 'semantic-chunks', 'vector-store'
    maxTokens: 4000,
  },
})
```

## Structured Output

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true,
})

await run({ query: 'laptops' })
// object is now Product[] | null
```

## Tool UI Registry

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Define tool components
const WeatherResult = ({ data }) => (
  <Card>
    <CardHeader>Weather in {data.location}</CardHeader>
    <CardContent>{data.temperature}°C</CardContent>
  </Card>
)

// Create registry
const registry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Render
<ClarityToolResult
  registry={registry}
  toolCall={toolCall}
  result={result}
  messages={messages}
/>
```

## API Route (Next.js)

```tsx
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  })
  
  return result.toDataStreamResponse()
}
```

## Common Patterns

### Error Handling

```tsx
const { error, append } = useClarityChat({
  api: '/api/chat',
  onError: (err) => {
    console.error('Chat error:', err)
  },
})

{error && <div>Error: {error.message}</div>}
```

### Loading States

```tsx
const { isLoading, messages } = useClarityChat({
  api: '/api/chat',
})

{isLoading && <LoadingIndicator />}
```

### Custom ChatWindow Props

```tsx
<ChatWindow
  messages={messages}
  onSendMessage={handleSend}
  isLoading={isLoading}
  showHeader
  sessionTitle="My Chat"
  sessionSubtitle="Powered by Clarity"
  showMessageCount
  onExport={() => exportConversation()}
  onClear={() => clearChat()}
/>
```

## Memory Strategies

| Strategy | Use Case | Max Tokens | Speed |
|----------|----------|------------|-------|
| `sliding-window` | Most cases | 2000-4000 | Fast |
| `semantic-chunks` | Complex conversations | 4000-8000 | Medium |
| `vector-store` | Long-term memory | 8000-16000 | Slower |

## Transport Protocols

```tsx
// SSE (default)
useClarityChat({
  api: '/api/chat',
  transport: 'sse',
})

// WebSocket
useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

## Type Conversions

```tsx
// CoreMessage[] → Message[]
import { convertCoreMessagesToMessages } from '@clarity-chat/react'

const messages = convertCoreMessagesToMessages(coreMessages)

// Message[] → CoreMessage[]
import { convertMessagesToCoreMessages } from '@clarity-chat/react'

const coreMessages = convertMessagesToCoreMessages(messages)
```

## Common Hooks

```tsx
// Chat
useClarityChat(options)
useChat(options)
useChatEnhanced(options)

// Completion
useCompletion(options)

// Assistant
useAssistant(options)

// Structured Output
useClarityObject<T>(options)

// Streaming
useStreamingSSE(options)
useStreamingWebSocket(options)
```

## Common Components

```tsx
// Chat UI
<ChatWindow />
<ChatInput />
<VirtualizedMessageList />
<MessageList />

// Tools
<ClarityToolResult />
<ToolInvocationCard />
<AgentRunFeed />

// Utilities
<ThinkingIndicator />
<ErrorBoundary />
<RetryButton />
```

## Quick Links

- [Getting Started](./getting-started-clarity-chat.md)
- [Feature Comparison](./clarity-vs-vercel-ai-sdk-ui.md)
- [Migration Guide](./migrating-from-vercel-ai-sdk.md)
- [API Reference](../packages/react/API_REFERENCE.md)
- [Best Practices](../packages/react/BEST_PRACTICES.md)
