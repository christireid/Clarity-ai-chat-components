# Getting Started with Clarity Chat

Build beautiful AI chat interfaces in React. Fast.

## Installation

```bash
npm install @clarity-chat/react
```

## Quickest Start (One Line)

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return <ClarityChat api="/api/chat" />
}
```

Done. You have a production-ready chat with streaming, error handling, and accessibility.

## More Control? Use the Hook

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function MyChat() {
  const chat = useClarityChat({ api: '/api/chat' })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={(content) => chat.append({ role: 'user', content })}
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
  const { messages, append, memoryEnabled, contextSummary } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 4000,
    },
  })

  return (
    <div>
      {memoryEnabled && <div>Memory Active: {contextSummary}</div>}
      {/* Chat UI */}
    </div>
  )
}
```

## Structured Output

### Generate Structured Objects

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

## Tool UI Registry

### Define Tool UI Components

```tsx
import { createToolUIRegistry, ClarityToolResult } from '@clarity-chat/react'

// Define your tool result component
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

// Use in your chat
function ChatWithTools() {
  const { messages, toolInvocations } = useAssistant({
    api: '/api/assistant',
    tools: [weatherTool],
  })

  return (
    <div>
      {toolInvocations.map(invocation => (
        <ClarityToolResult
          key={invocation.toolCallId}
          registry={toolRegistry}
          toolCall={{
            name: invocation.toolName,
            args: invocation.args,
            id: invocation.toolCallId,
          }}
          result={invocation.result}
          messages={messages}
        />
      ))}
    </div>
  )
}
```

## Memory Integration

### Memory Strategies

```tsx
// Sliding Window - Fast, recent context
useClarityChat({
  memory: {
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 2000,
  },
})

// Semantic Chunks - Context-aware
useClarityChat({
  memory: {
    enabled: true,
    strategy: 'semantic-chunks',
    maxTokens: 6000,
  },
})

// Vector Store - Long-term memory
useClarityChat({
  memory: {
    enabled: true,
    strategy: 'vector-store',
    maxTokens: 10000,
  },
})
```

## Examples

### Available Examples

1. **Basic Chat**
   - `examples/basic-clarity-chat-example.tsx`
   - Simple chat with useClarityChat

2. **Product Recommendations**
   - `examples/product-recommendation-object.tsx`
   - Structured output example

3. **Generative UI Tools**
   - `examples/generative-ui-tools.tsx`
   - Tool registry example

4. **Integrated Example**
   - `examples/generative-ui-integrated.tsx`
   - Full integration with useClarityChat + useAssistant

### Running Examples

```bash
# Navigate to example directory
cd apps/examples/use-clarity-chat-showcase

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## API Endpoints

### Chat Endpoint

```typescript
// app/api/chat/route.ts (Next.js)
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = await streamText({
    model: openai('gpt-4'),
    messages,
  })
  
  return result.toDataStreamResponse()
}
```

### Structured Output Endpoint

```typescript
// app/api/generate-products/route.ts
import { generateObject } from 'ai'

export async function POST(req: Request) {
  const { input } = await req.json()
  
  const result = await generateObject({
    model: openai('gpt-4'),
    schema: z.array(z.object({
      name: z.string(),
      price: z.number(),
      description: z.string(),
    })),
    prompt: `Generate product recommendations for: ${input.query}`,
  })
  
  return Response.json({ object: result.object })
}
```

## Common Patterns

### Error Handling

```tsx
const { error, append } = useClarityChat({
  api: '/api/chat',
  onError: (err) => {
    console.error('Chat error:', err)
    // Custom error handling
  },
})

{error && (
  <div className="error">
    Error: {error.message}
  </div>
)}
```

### Loading States

```tsx
const { isLoading, messages } = useClarityChat({
  api: '/api/chat',
})

{isLoading && <LoadingIndicator />}
```

### Form Handling

```tsx
const { input, setInput, handleSubmit } = useClarityChat({
  api: '/api/chat',
})

<form onSubmit={handleSubmit}>
  <input
    value={input}
    onChange={(e) => setInput(e.target.value)}
  />
  <button type="submit">Send</button>
</form>
```

## Next Steps

### Learn More

1. **API Reference** - See `API_REFERENCE.md`
2. **TypeScript Guide** - See `TYPESCRIPT_GUIDE.md`
3. **Performance Guide** - See `PERFORMANCE_GUIDE.md`
4. **Migration Guide** - See `MIGRATION_GUIDE.md` (Vercel AI SDK)

### Explore Examples

- Check `examples/` directory for complete examples
- See `PHASE_3_EXAMPLES.md` for tool UI patterns
- Review Storybook stories in `apps/storybook/`

### Advanced Features

- **Memory Management** - See memory documentation
- **Agent Orchestration** - See agent system docs
- **Error Recovery** - See error handling docs
- **Streaming** - See streaming hooks docs

## Support

- **Documentation:** See `DOCUMENTATION_INDEX.md`
- **Examples:** See `examples/` directory
- **Issues:** Check repository issues
- **Questions:** Review documentation files

## Quick Links

- [Phase 3 README](./README_PHASE_3.md)
- [All Phases Summary](./ALL_PHASES_SUMMARY.md)
- [Phase 3 Examples](./PHASE_3_EXAMPLES.md)
- [API Reference](./API_REFERENCE.md)

---

**Ready to build?** Start with the basic chat example and expand from there!
