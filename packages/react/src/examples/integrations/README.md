# Integration Examples

Complete, copy-pasteable examples showing how to integrate Clarity Chat components with popular AI frameworks and full-stack platforms.

Each example is production-ready and includes:
- Complete setup and configuration
- Error handling
- Loading states
- TypeScript types
- Comments explaining key sections
- Optional advanced features

## Quick Start

### 1. Vercel AI SDK

The simplest integration - use Vercel AI's `useChat` hook with Clarity Chat components.

```tsx
import { VercelAIIntegrationExample } from '@clarity-chat/react/examples/integrations'

export default function App() {
  return <VercelAIIntegrationExample />
}
```

**Features:**
- Works with `useChat` from `ai/react`
- Automatic message streaming
- Tool/function calling support
- Message attachments (images, files)
- Custom endpoints and headers

**Files:**
- `vercel-ai-example.tsx` - 4 examples (basic, minimal, advanced, custom)

**When to use:** You're using the Vercel AI SDK in your project

---

### 2. LangChain.js

Advanced AI workflows with LangChain - RAG, agents, memory, and custom chains.

```tsx
import { LangChainIntegrationExample } from '@clarity-chat/react/examples/integrations'

export default function App() {
  return <LangChainIntegrationExample />
}
```

**Features:**
- Streaming responses with callbacks
- RAG (Retrieval Augmented Generation)
- AI agents with tool calling
- Custom prompt templates
- Memory management

**Files:**
- `langchain-example.tsx` - 3 examples (basic, RAG, agent)

**When to use:** You need advanced AI workflows like agents or RAG

---

### 3. Anthropic Direct

Direct integration with the Anthropic/Claude API - no framework overhead.

```tsx
import { AnthropicDirectExample } from '@clarity-chat/react/examples/integrations'

export default function App() {
  return <AnthropicDirectExample />
}
```

**Features:**
- Direct Claude API calls
- Server-side streaming (SSE)
- Tool/function calling
- Vision/image analysis
- Error handling with retry logic
- Rate limit awareness

**Files:**
- `anthropic-direct-example.tsx` - 3 examples (basic, tool calling, vision)

**When to use:** You want direct control over API calls with Claude models

---

### 4. Next.js App Router

Full-stack chat application using Next.js 13+ App Router.

```tsx
import { NextJSAppRouterExample } from '@clarity-chat/react/examples/integrations'

export default function ChatPage() {
  return <NextJSAppRouterExample />
}
```

**Features:**
- Server components and client components
- Route handlers (API routes)
- Server-side streaming
- Database persistence
- Authentication integration (NextAuth)
- Error boundaries
- Request cancellation

**File Examples:**
- `nextjs-app-router-example.tsx` - 5 examples
  - Basic integration
  - Client component (chat UI)
  - Layout with navigation
  - With database persistence
  - With authentication

**API Route Handler:**
```typescript
// app/api/chat/route.ts
import { StreamingTextResponse } from 'ai'
import { anthropicAdapter } from '@clarity-chat/react/adapters'

export async function POST(request: Request) {
  const { messages } = await request.json()

  const response = await anthropicAdapter.chat(messages, {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    apiKey: process.env.ANTHROPIC_API_KEY,
  })

  return new StreamingTextResponse(response.stream())
}
```

**When to use:** You're building a modern Next.js application

---

### 5. Remix

Full-stack chat with Remix's loader/action pattern.

```tsx
import { RemixIntegrationExample } from '@clarity-chat/react/examples/integrations'

export default RemixIntegrationExample
```

**Features:**
- Server-side loader functions
- Form actions for submissions
- Server-side streaming
- Error boundaries
- Optimistic UI updates
- Data synchronization
- Session persistence

**File Examples:**
- `remix-example.tsx` - 4 examples
  - Basic integration
  - With streaming
  - With optimistic updates
  - With persistence

**Loader Example:**
```typescript
// routes/chat.tsx
import { json } from '@remix-run/node'
import type { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ request, params }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  if (!session) throw redirect('/login')

  const conversationId = params.id || generateId()
  const messages = await db.getMessages(conversationId, session.userId)

  return json({
    conversationId,
    initialMessages: messages,
  })
}
```

**When to use:** You're building with Remix and want full-stack integration

---

## Comparison Table

| Feature | Vercel AI | LangChain | Anthropic Direct | Next.js | Remix |
|---------|-----------|-----------|------------------|---------|-------|
| Streaming | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tool Calling | ✅ | ✅ | ✅ | ✅ | ✅ |
| RAG | ⚠️ Custom | ✅ Built-in | ❌ Manual | ⚠️ Custom | ⚠️ Custom |
| Agents | ⚠️ Custom | ✅ Built-in | ❌ Manual | ⚠️ Custom | ⚠️ Custom |
| Vision | ✅ | ✅ | ✅ | ✅ | ✅ |
| Error Handling | ✅ | ✅ | ✅ | ✅ | ✅ |
| Type Safe | ✅ | ✅ | ✅ | ✅ | ✅ |
| Database Ready | ❌ | ❌ | ❌ | ✅ | ✅ |
| Auth Integration | ❌ | ❌ | ❌ | ✅ | ✅ |
| Setup Complexity | Low | Medium | Low | Medium | Medium |

---

## Core Concepts

### ClarityChatAdapter

All examples use the `ClarityChatAdapter` interface to connect different systems:

```tsx
interface ClarityChatAdapter {
  // Main method: process messages and return a streamable response
  chat(messages: ClarityChatMessage[], options?: any): Promise<ClarityChatStreamableResponse>

  // Listen for adapter events
  on(eventType: string, callback: Function): () => void
}
```

The adapter is what bridges your chosen AI framework with Clarity Chat components.

### ClarityChatProvider

Wrap your chat components with the provider:

```tsx
<ClarityChatProvider adapter={adapter}>
  <ChatWindow messages={messages} onSendMessage={handleSend} />
</ClarityChatProvider>
```

### Message Types

Standard message format used across all examples:

```tsx
interface ClarityChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string | ContentPart[]
  createdAt?: Date
}
```

---

## Error Handling Patterns

All examples include error handling:

```tsx
const [error, setError] = useState<Error | null>(null)

const handleSendMessage = useCallback(async (content: string) => {
  try {
    // Send message
    const response = await fetch('/api/chat', { /* ... */ })
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }
    // Process response
  } catch (err) {
    setError(err instanceof Error ? err : new Error(String(err)))
  }
}, [])
```

Display errors:

```tsx
{error && (
  <div className="rounded border border-red-200 bg-red-50 p-4">
    <p className="text-sm font-medium text-red-900">Error</p>
    <p className="mt-1 text-sm text-red-800">{error.message}</p>
    <button onClick={() => setError(null)} className="mt-3 text-red-600">
      Dismiss
    </button>
  </div>
)}
```

---

## Streaming Patterns

Common pattern for streaming responses:

```tsx
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({ messages }),
})

let responseText = ''
if (response.body) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    responseText += decoder.decode(value)
    // Update UI with partial response
  }
}
```

---

## Loading States

Show loading indicators while waiting for response:

```tsx
{isLoading && (
  <div className="flex items-center gap-2 px-4 py-3">
    <div className="h-2 w-2 animate-pulse rounded-full bg-blue-600"></div>
    <span className="text-sm text-gray-600">Generating response...</span>
  </div>
)}
```

With cancellation:

```tsx
const abortControllerRef = useRef<AbortController | null>(null)

const handleSend = async (content: string) => {
  abortControllerRef.current = new AbortController()
  await fetch('/api/chat', {
    // ...
    signal: abortControllerRef.current.signal,
  })
}

const handleStop = () => {
  abortControllerRef.current?.abort()
}
```

---

## Environment Variables

Common environment variables needed:

```bash
# Anthropic / Claude
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI
OPENAI_API_KEY=sk-...

# Custom API
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_KEY=your-key

# Next.js
NEXT_PUBLIC_API_URL=https://api.example.com
```

**Security Note:** Never expose API keys in client-side code. Always proxy through your server:

```tsx
// ✅ Good: Call your own server
const response = await fetch('/api/chat', { /* ... */ })

// ❌ Bad: Expose API key in browser
const response = await fetch('https://api.anthropic.com/...', {
  headers: { 'Authorization': `Bearer ${process.env.REACT_APP_KEY}` }
})
```

---

## Type Safety

All examples include full TypeScript types:

```tsx
import type {
  ClarityChatMessage,
  ClarityChatAdapter,
  ModelConfig,
} from '@clarity-chat/react/adapters'

const messages: ClarityChatMessage[] = []
const config: ModelConfig = { /* ... */ }
```

---

## Testing

Example test pattern:

```tsx
describe('VercelAIIntegration', () => {
  it('should send message and receive response', async () => {
    render(<VercelAIIntegrationExample />)

    const input = screen.getByPlaceholderText('Message...')
    await userEvent.type(input, 'Hello')

    const button = screen.getByRole('button', { name: /send/i })
    await userEvent.click(button)

    await waitFor(() => {
      expect(screen.getByText(/Assistant response/)).toBeInTheDocument()
    })
  })
})
```

---

## Common Patterns

### Optimistic Updates

Show message immediately, update when server confirms:

```tsx
// Optimistic: show right away
setMessages(prev => [...prev, userMessage])

// Fetch from server
const response = await fetch(...)

// Confirm with server response
setMessages(prev => [...prev, assistantMessage])
```

### Auto-save to Database

Save conversation after each exchange:

```tsx
const assistantMessage = { /* ... */ }
const allMessages = [...messages, assistantMessage]

setMessages(allMessages)

// Auto-save
await fetch('/api/save-conversation', {
  method: 'POST',
  body: JSON.stringify({ conversationId, messages: allMessages })
})
```

### Regenerate Response

Allow user to regenerate the last response:

```tsx
const handleRegenerate = async () => {
  const userMessages = messages.filter(m => m.role !== 'assistant')
  const response = await fetch('/api/chat', {
    body: JSON.stringify({ messages: userMessages })
  })
  // Update with new response
}
```

---

## Integrating Your Own AI Provider

To use a different AI provider, create your own adapter:

```tsx
const myAdapter: ClarityChatAdapter = {
  async chat(messages, options) {
    return {
      async *stream() {
        try {
          const response = await fetch('https://api.my-provider.com/chat', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ messages }),
          })

          const reader = response.body?.getReader()
          while (reader) {
            const { done, value } = await reader.read()
            if (done) break

            yield {
              type: 'text-delta',
              content: new TextDecoder().decode(value)
            }
          }
        } catch (error) {
          yield {
            type: 'error',
            error: error instanceof Error ? error : new Error(String(error))
          }
        }
      },
      messages,
    }
  },
  on: () => () => {}
}
```

---

## Production Considerations

When deploying to production:

1. **API Keys**: Use environment variables, never hardcode
2. **Rate Limiting**: Implement rate limiting on your backend
3. **Error Handling**: Log errors for monitoring
4. **User Persistence**: Save conversations to database
5. **Authentication**: Verify user identity before processing
6. **Content Filtering**: Implement safety checks
7. **Monitoring**: Track latency, errors, and usage
8. **Cost Management**: Monitor AI API spending

---

## Support

For issues or questions:
- Check the main documentation
- Review example code comments
- Open an issue on GitHub
- Check existing issues for similar problems

---

## License

These examples are provided as-is for reference and learning purposes.
