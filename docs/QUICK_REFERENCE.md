# Clarity Chat Quick Reference

Quick copy-paste code snippets for common Clarity Chat patterns.

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
```

## Basic Chat Setup

### Minimal Example

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatPage() {
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
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

### With Input Control

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatPage() {
  const { 
    messages: coreMessages, 
    input, 
    setInput, 
    append, 
    isLoading,
    error 
  } = useClarityChat({
    api: '/api/chat',
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <ChatWindow
      messages={messages}
      inputValue={input}
      onInputChange={setInput}
      isLoading={isLoading}
      error={error}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}
```

## With Memory

### Setup MemoryProvider

```tsx
import { MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatPage />
    </MemoryProvider>
  )
}
```

### Enable Memory in Hook

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window', // or 'semantic-chunks' or 'vector-store'
    maxTokens: 4000,
  },
})
```

### Memory Strategies

```tsx
// Fast, recent context only
memory: { strategy: 'sliding-window', maxTokens: 2000 }

// Balanced, semantic search
memory: { strategy: 'semantic-chunks', maxTokens: 4000 }

// Full vector database
memory: { strategy: 'vector-store', maxTokens: 8000 }
```

## Structured Output

### Basic Usage

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
  description: string
}

function ProductGenerator() {
  const { object, run, isLoading, error } = useClarityObject<Product[]>({
    api: '/api/generate-products',
    initialInput: { query: 'laptops' },
  })

  return (
    <div>
      <button onClick={() => run({ query: 'gaming laptops' })} disabled={isLoading}>
        Generate
      </button>
      {error && <div>Error: {error.message}</div>}
      {object && (
        <ul>
          {object.map((p, i) => (
            <li key={i}>{p.name} - ${p.price}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

### With Streaming

```tsx
const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
  stream: true,
  onProgress: (partialObject) => {
    console.log('Partial:', partialObject)
  },
})
```

## Tool UI Registry

### Define Tool Components

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Weather tool component
const WeatherResult = ({ data }) => (
  <div>
    <h3>Weather in {data.location}</h3>
    <p>{data.temperature}°F - {data.condition}</p>
  </div>
)

// FAQ search component
const FAQResults = ({ data }) => (
  <div>
    <h3>FAQ Results</h3>
    {data.results.map((faq, i) => (
      <div key={i}>
        <strong>{faq.question}</strong>
        <p>{faq.answer}</p>
      </div>
    ))}
  </div>
)
```

### Create Registry

```tsx
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
  search_faq: FAQResults,
})
```

### Use in Chat

```tsx
import { extractToolResults } from '@clarity-chat/react'

function ChatWithTools() {
  const { messages: coreMessages } = useClarityChat({ api: '/api/chat' })
  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div>
      {messages.map((msg) => {
        const toolResults = extractToolResults(msg)
        if (toolResults.length > 0) {
          return toolResults.map((result) => (
            <ClarityToolResult
              key={result.toolCall.id}
              registry={toolRegistry}
              toolCall={result.toolCall}
              result={result.result}
              messages={messages}
            />
          ))
        }
        return <div>{msg.content}</div>
      })}
    </div>
  )
}
```

## Transport Options

### SSE (Default)

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'sse', // default
})
```

### WebSocket

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
  websocket: {
    url: 'ws://localhost:3000/api/chat',
    reconnect: true,
    heartbeatInterval: 30000,
  },
})
```

## Error Handling

### Basic Error Display

```tsx
const { error } = useClarityChat({ api: '/api/chat' })

{error && (
  <div className="error">
    Error: {error.message}
  </div>
)}
```

### With Retry

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

const { retry, canRetry, errorType } = useErrorRecovery({
  operation: async () => {
    // Your API call
  },
  maxRetries: 3,
})
```

## API Route (Next.js)

### Basic Route

```tsx
// app/api/chat/route.ts
import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = streamText({
    model: openai('gpt-4'),
    messages,
  })

  return result.toDataStreamResponse()
}
```

### With Memory Context

```tsx
export async function POST(req: Request) {
  const { messages, memoryContext } = await req.json()

  const result = streamText({
    model: openai('gpt-4'),
    messages: [
      ...(memoryContext ? [{ role: 'system', content: memoryContext }] : []),
      ...messages,
    ],
  })

  return result.toDataStreamResponse()
}
```

## TypeScript Types

### Hook Types

```tsx
import type { 
  UseClarityChatOptions, 
  UseClarityChatReturn,
  UseClarityObjectOptions,
  UseClarityObjectReturn 
} from '@clarity-chat/react'

const options: UseClarityChatOptions = {
  api: '/api/chat',
  memory: { enabled: true },
}

const chat: UseClarityChatReturn = useClarityChat(options)
```

### Message Types

```tsx
import type { CoreMessage, Message } from '@clarity-chat/react'

// CoreMessage (from hook)
const coreMessages: CoreMessage[] = chat.messages

// Message (for ChatWindow)
const messages: Message[] = convertCoreMessagesToMessages(coreMessages)
```

## Common Patterns

### Clear Messages

```tsx
const { setMessages } = useClarityChat({ api: '/api/chat' })

<button onClick={() => setMessages([])}>Clear Chat</button>
```

### Reset Chat

```tsx
const { reset } = useClarityChat({ api: '/api/chat' })

<button onClick={reset}>Reset</button>
```

### Stop Streaming

```tsx
const { stop } = useClarityChat({ api: '/api/chat' })

<button onClick={stop}>Stop</button>
```

### Custom Headers

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  headers: {
    'Authorization': 'Bearer token',
    'X-Custom-Header': 'value',
  },
})
```

### Custom Body

```tsx
const chat = useClarityChat({
  api: '/api/chat',
  body: {
    model: 'gpt-4',
    temperature: 0.7,
  },
})
```

## Migration from Vercel

### Before (Vercel)

```tsx
import { useChat } from 'ai/react'

const { messages, append } = useChat({ api: '/api/chat' })
```

### After (Clarity)

```tsx
import { useClarityChat } from '@clarity-chat/react'

const { messages, append } = useClarityChat({ api: '/api/chat' })
// Same API! Just change the import.
```

## Next Steps

- 📖 Read [Getting Started Guide](./getting-started-clarity-chat.md) for detailed explanations
- 🆚 See [Clarity vs Vercel](./clarity-vs-vercel-ai-sdk-ui.md) for feature comparison
- 🔄 Check [Migration Guide](./migrating-from-vercel-ai-sdk.md) for step-by-step migration
- 📚 View [Full API Reference](../packages/react/README.md) for complete documentation
