# Getting Started with Clarity Chat

Get from zero to a working AI chat interface in minutes with Clarity's React library.

## Installation

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

## Minimal Example

Here's the simplest possible chat interface using `useClarityChat` and `ChatWindow`:

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

export default function ChatPage() {
  const {
    messages: coreMessages,
    append,
    isLoading,
    error,
  } = useClarityChat({
    api: '/api/chat',
  })

  // Convert CoreMessage[] to Message[] for ChatWindow
  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
        error={error}
      />
    </div>
  )
}
```

That's it! You now have a fully functional chat interface with:
- ✅ Streaming responses
- ✅ Loading states
- ✅ Error handling
- ✅ Production-ready UI
- ✅ Auto-scrolling
- ✅ Keyboard shortcuts (Enter to send, Shift+Enter for new line)

## What You Get Out of the Box

### Streaming Responses
Clarity handles streaming automatically. Your chat responses stream in real-time without any additional configuration.

### Sensible Defaults
- Automatic message formatting
- Optimized re-renders
- Built-in accessibility (WCAG compliant)
- Mobile-responsive design

### Production-Ready UI
- Virtualized message lists (handles 1000+ messages smoothly)
- Thinking indicators during AI processing
- Empty states and loading skeletons
- Error boundaries and retry mechanisms

## Add Memory in One Step

Enable context-aware conversations by wrapping your app in `MemoryProvider` and enabling memory in `useClarityChat`:

```tsx
import { MemoryProvider, useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'
import { useMemo } from 'react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ChatPage />
    </MemoryProvider>
  )
}

function ChatPage() {
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window', // or 'semantic-chunks' or 'vector-store'
      maxTokens: 4000,
    },
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

### Memory Strategies

- **`sliding-window`**: Keeps the most recent N tokens (fastest, best for short conversations)
- **`semantic-chunks`**: Uses semantic search to find relevant context (balanced performance/quality)
- **`vector-store`**: Full vector database integration (best for long-term memory and large contexts)

## Next Steps

- 📖 Read the [API Reference](../packages/react/README.md)
- 🔄 See [Migrating from Vercel AI SDK](./migrating-from-vercel-ai-sdk.md)
- 🆚 Compare [Clarity vs Vercel AI SDK UI](./clarity-vs-vercel-ai-sdk-ui.md)
- 🎨 Explore [Structured Output](./getting-started-clarity-chat.md#structured-output) with `useClarityObject`
- 🛠️ Learn about [Tool UI Registry](./getting-started-clarity-chat.md#tool-ui-registry) for generative UI

## Structured Output

Generate type-safe objects from AI models:

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
    initialInput: { query: 'gaming laptops' },
  })

  return (
    <div>
      <button onClick={() => run({ query: 'gaming laptops' })} disabled={isLoading}>
        Generate Recommendations
      </button>
      {object && (
        <ul>
          {object.map((product, idx) => (
            <li key={idx}>
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <p>{product.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
```

## Tool UI Registry

Automatically render tool results with custom UI components:

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Define your tool UI components
const WeatherResult = ({ data }) => (
  <div>
    <h3>Weather in {data.location}</h3>
    <p>{data.temperature}°F - {data.condition}</p>
  </div>
)

// Create registry
const toolRegistry = createToolUIRegistry({
  get_weather: WeatherResult,
})

// Use in your chat
<ClarityToolResult
  registry={toolRegistry}
  toolCall={{ name: 'get_weather', args: { location: 'San Francisco' } }}
  result={weatherData}
  messages={messages}
/>
```

## API Route Example (Next.js)

Your API route should return streaming responses compatible with Vercel AI SDK format:

```tsx
// app/api/chat/route.ts
import { streamText } from 'ai' // or your AI SDK
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

## TypeScript Support

Clarity is built with TypeScript and provides full type safety:

```tsx
import type { UseClarityChatOptions, UseClarityChatReturn } from '@clarity-chat/react'

const options: UseClarityChatOptions = {
  api: '/api/chat',
  memory: {
    enabled: true,
    strategy: 'sliding-window',
  },
}

const chat: UseClarityChatReturn = useClarityChat(options)
```

## Need Help?

- 📚 Check the [full documentation](../packages/react/README.md)
- 💬 Open an issue on GitHub
- 🐛 Report bugs or request features
