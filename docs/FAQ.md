# Frequently Asked Questions (FAQ)

Common questions about Clarity Chat Components.

## General Questions

### What is Clarity Chat?

Clarity Chat is a React-first AI UI library that provides production-ready components and hooks for building AI chat interfaces. It's API-compatible with Vercel AI SDK UI but adds first-class memory management, agent orchestration, and enterprise features.

### How does Clarity compare to Vercel AI SDK UI?

Clarity maintains API compatibility with Vercel's core hooks (`useChat`, `useCompletion`, `useAssistant`) while adding:
- Built-in memory management with multiple strategies
- Production-ready UI components (`ChatWindow`, etc.)
- Agent orchestration and tool UI registry
- Advanced streaming protocols (SSE, WebSocket)
- Enterprise features (RBAC, quotas, analytics)

See [Clarity vs Vercel AI SDK UI](./clarity-vs-vercel-ai-sdk-ui.md) for detailed comparison.

### Is Clarity compatible with Vercel AI SDK?

Yes! Clarity is API-compatible with Vercel AI SDK UI. You can migrate incrementally - see [Migrating from Vercel AI SDK](./migrating-from-vercel-ai-sdk.md).

### What React version do I need?

Clarity requires React 18+ and works with React 19. TypeScript 5.0+ is recommended.

### Does Clarity work with Next.js?

Yes! Clarity works great with Next.js App Router and Pages Router. See [Getting Started](./getting-started.md) for examples.

## Installation & Setup

### How do I install Clarity?

```bash
npm install @clarity-chat/react
# or
pnpm add @clarity-chat/react
# or
yarn add @clarity-chat/react
```

### Do I need to install additional packages?

For basic chat, no. For advanced features:
- **Memory**: `@clarity-chat/memory` (included in monorepo)
- **Types**: `@clarity-chat/types` (included)
- **Backend**: Use Vercel AI SDK or compatible API

### How do I set up TypeScript?

Clarity includes TypeScript definitions. Ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "jsx": "react-jsx"
  }
}
```

## Usage Questions

### How do I get started quickly?

See [Getting Started Guide](./getting-started.md) for a minimal example:

```tsx
import { useClarityChat, ChatWindow, convertCoreMessagesToMessages } from '@clarity-chat/react'

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
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
      isLoading={isLoading}
    />
  )
}
```

### Why do I need to convert messages?

`useClarityChat` returns `CoreMessage[]` (Vercel-compatible format), while `ChatWindow` expects `Message[]` (Clarity's internal format). Use `convertCoreMessagesToMessages()` to convert.

### Can I use my own UI components?

Yes! Clarity hooks work independently. Use `useClarityChat` for logic and build your own UI:

```tsx
const { messages, append, isLoading } = useClarityChat({ api: '/api/chat' })

// Use your own components
{messages.map(msg => <YourMessageComponent key={msg.id} message={msg} />)}
```

### How do I customize ChatWindow styling?

`ChatWindow` accepts className and style props. For deeper customization, use individual components (`ChatInput`, `VirtualizedMessageList`, etc.).

## Memory & Context

### What are memory strategies?

Clarity offers three memory strategies:

1. **`sliding-window`**: Keeps most recent N tokens (fastest)
2. **`semantic-chunks`**: Uses semantic search (balanced)
3. **`vector-store`**: Full vector database (best for long-term)

See [Getting Started](./getting-started.md#memory-strategies) for details.

### How do I enable memory?

Wrap your app in `MemoryProvider` and enable in `useClarityChat`:

```tsx
<MemoryProvider config={{ maxTokens: 10000 }}>
  <App />
</MemoryProvider>

// In component
useClarityChat({
  memory: { enabled: true, strategy: 'sliding-window' },
})
```

### Does memory work with streaming?

Yes! Memory captures messages during streaming and updates context automatically.

### How much context can I store?

Depends on your strategy:
- **sliding-window**: Limited by `maxTokens` (default 4000)
- **semantic-chunks**: Can search larger context pools
- **vector-store**: Virtually unlimited (depends on your vector DB)

## Streaming & Performance

### How does streaming work?

Clarity handles streaming automatically. Your API route should return a streaming response:

```tsx
// app/api/chat/route.ts
export async function POST(req: Request) {
  const result = streamText({ model, messages })
  return result.toDataStreamResponse() // Streaming response
}
```

### Can I use WebSockets instead of SSE?

Yes! Set `transport: 'websocket'` in `useClarityChat`:

```tsx
useClarityChat({
  api: '/api/chat',
  transport: 'websocket',
})
```

### How do I handle slow responses?

Clarity includes loading states and thinking indicators. For better UX:

```tsx
<ChatWindow
  messages={messages}
  isLoading={isLoading}
  thinkingIndicator={<YourCustomIndicator />}
/>
```

### What about performance with many messages?

Use `VirtualizedMessageList` for 100+ messages:

```tsx
import { VirtualizedMessageList } from '@clarity-chat/react'

<VirtualizedMessageList
  messages={messages}
  height={600}
/>
```

## Structured Output

### How do I generate structured objects?

Use `useClarityObject`:

```tsx
import { useClarityObject } from '@clarity-chat/react'

interface Product {
  name: string
  price: number
}

const { object, run, isLoading } = useClarityObject<Product[]>({
  api: '/api/generate-products',
})
```

### Does structured output support streaming?

Yes! `useClarityObject` supports streaming JSON chunks.

### Can I validate the object shape?

TypeScript provides compile-time validation. For runtime validation, add your own schema validation (Zod, Yup, etc.).

## Tools & Generative UI

### What is the tool UI registry?

A pattern for automatically rendering tool results with custom UI components:

```tsx
const registry = createToolUIRegistry({
  get_weather: WeatherComponent,
  search: SearchResultsComponent,
})

<ClarityToolResult registry={registry} toolCall={call} result={result} />
```

### How do I add custom tools?

Define tools using Clarity's agent system or Vercel AI SDK's tool format. Then register UI components in the registry.

### Can I use tools without agents?

Yes! Tools work independently. Use `useClarityChat` with tool calls from your API.

## Error Handling

### How do I handle errors?

Clarity provides error states:

```tsx
const { error, isLoading } = useClarityChat({ api: '/api/chat' })

{error && (
  <div>Error: {error.message}</div>
)}
```

### Can I retry failed requests?

Use `useErrorRecovery` hook:

```tsx
import { useErrorRecovery } from '@clarity-chat/react'

const { retry, canRetry } = useErrorRecovery({
  onRetry: () => append(message),
})
```

### What about network errors?

Clarity includes automatic retry logic for network failures. Customize via `onError` callback.

## Migration Questions

### Can I migrate incrementally?

Yes! Clarity is API-compatible. Start by replacing `useChat` with `useClarityChat`, then add features gradually.

### What breaks when migrating?

Very little! The main change is converting messages:

```tsx
// Old
const { messages } = useChat()

// New
const { messages: coreMessages } = useClarityChat()
const messages = convertCoreMessagesToMessages(coreMessages)
```

### Do I need to change my API routes?

No! Clarity works with existing Vercel AI SDK API routes.

## Troubleshooting

### Messages not displaying?

1. Check message conversion: `convertCoreMessagesToMessages(coreMessages)`
2. Verify API returns correct format
3. Check console for errors

See [Troubleshooting Guide](./TROUBLESHOOTING.md) for more.

### Streaming not working?

1. Verify API route returns streaming response
2. Check transport protocol (`sse` or `websocket`)
3. Inspect Network tab for streaming indicators

### Memory not working?

1. Ensure `MemoryProvider` wraps your app
2. Enable memory in `useClarityChat`: `memory: { enabled: true }`
3. Check memory context with `useMemory()` hook

### TypeScript errors?

1. Ensure TypeScript 5.0+
2. Check imports are correct
3. Verify `tsconfig.json` configuration

## Advanced Topics

### Can I use Clarity with other AI providers?

Yes! Clarity works with any API that returns Vercel AI SDK-compatible responses. Use your own backend or adapters.

### How do I add authentication?

Pass headers to `useClarityChat`:

```tsx
useClarityChat({
  api: '/api/chat',
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
```

### Can I use Clarity in a monorepo?

Yes! Clarity is designed for monorepos. See the repo structure for examples.

### How do I contribute?

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. We welcome PRs!

## Still Have Questions?

- 📚 Check [Full Documentation](../packages/react/README.md)
- 🐛 [Open an Issue](https://github.com/christireid/Clarity-ai-chat-components/issues)
- 💬 [Join GitHub Discussions](https://github.com/christireid/Clarity-ai-chat-components/discussions)
- 📖 Read [Troubleshooting Guide](./TROUBLESHOOTING.md)
