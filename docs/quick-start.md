# Quick Start Guide

Get up and running with Clarity Chat in 5 minutes.

---

## Installation

```bash
npm install @clarity-chat/react @clarity-chat/memory @clarity-chat/token-optimization
# or
yarn add @clarity-chat/react @clarity-chat/memory @clarity-chat/token-optimization
# or
pnpm add @clarity-chat/react @clarity-chat/memory @clarity-chat/token-optimization
```

---

## Basic Chat in 3 Steps

### Step 1: Create API Route

Create `/app/api/chat/route.ts`:

```typescript
import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from '@clarity-chat/react/adapters'

export const runtime = 'edge'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
```

### Step 2: Build Chat UI

Create `app/page.tsx`:

```typescript
'use client'

import { useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react/components'

export default function ChatPage() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    tokenOptimization: 'smart', // ← Saves 50-70% on costs!
  })

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={(content) => append({ role: 'user', content })}
      />
    </div>
  )
}
```

### Step 3: Done!

You now have a production-ready chat with:
- ✅ Real-time streaming
- ✅ Automatic token optimization (50-70% cost savings)
- ✅ Error handling with auto-retry
- ✅ Accessible UI (WCAG 2.1 AA)
- ✅ Mobile-responsive

---

## Add Advanced Features

### Add Conversation Memory

```tsx
const { messages, append, isLoading } = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart',
  memory: true, // ← Add this line
  memoryOptions: {
    maxMemories: 100,
    enableDecay: true,
  },
})
```

Now your chat remembers past conversations!

### Add Error Boundaries

```tsx
import { ErrorBoundary } from '@clarity-chat/react/components'

export default function ChatPage() {
  return (
    <ErrorBoundary fallback={<ErrorUI />}>
      <ChatWindow {...props} />
    </ErrorBoundary>
  )
}
```

### Add Token Tracking

```tsx
import { useTokenBudget } from '@clarity-chat/react'

function ChatWithBudget() {
  const budget = useTokenBudget({
    sessionBudgetTokens: 100000,
    onWarning: () => toast.warning('80% budget used'),
  })

  const chat = useClarityChat({
    api: '/api/chat',
    tokenOptimization: 'smart',
  })

  return (
    <div>
      <BudgetIndicator used={budget.used} total={budget.total} />
      <ChatWindow {...chat} />
    </div>
  )
}
```

---

## Configuration Options

### useClarityChat Options

```tsx
const chat = useClarityChat({
  // Required
  api: '/api/chat',

  // Token Optimization (recommended!)
  tokenOptimization: 'smart', // 'smart' | 'aggressive' | 'conservative' | 'off'

  // Memory
  memory: true,
  memoryOptions: {
    storageBackend: 'indexeddb', // 'memory' | 'indexeddb' | 'file'
    maxMemories: 100,
    enableDecay: true,
  },

  // Streaming
  transport: 'sse', // 'sse' | 'websocket'
  streamProtocol: 'text', // 'text' | 'data'

  // Initial State
  initialMessages: [],
  id: 'conversation-123',

  // Callbacks
  onFinish: (message) => console.log('Done:', message),
  onError: (error) => console.error('Error:', error),
  onResponse: (response) => console.log('Response:', response),

  // Headers
  headers: {
    'Authorization': 'Bearer token',
  },

  // Advanced
  maxTokens: 4096,
  temperature: 0.7,
  topP: 1,
})
```

---

## Component Library

Clarity Chat includes 180+ pre-built components:

### Chat Components
```tsx
import {
  ChatWindow,      // Complete chat interface
  ChatInput,       // Message input
  MessageList,     // Message list
  Message,         // Single message
  StreamingMessage, // Streaming message with animations
} from '@clarity-chat/react/components'
```

### Input Components
```tsx
import {
  AdvancedChatInput,  // Input with formatting
  VoiceInput,         // Voice-to-text
  FileUpload,         // File uploads
  MentionSystem,      // @mentions
} from '@clarity-chat/react/components'
```

### Display Components
```tsx
import {
  MarkdownRenderer,     // Markdown rendering
  CodeBlock,           // Code with syntax highlighting
  Citation,            // Source citations
  ToolInvocationCard,  // Tool/function calls
} from '@clarity-chat/react/components'
```

### Dashboard Components
```tsx
import {
  TokenOptimizationDashboard, // Token optimization metrics
  SessionSummaryCard,         // Session summary
  UsageMetrics,              // Usage analytics
} from '@clarity-chat/react/components'
```

[See all 180+ components →](./api/components/README.md)

---

## Examples

### Basic Chat
```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function BasicChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  return <ChatWindow {...chat} />
}
```

### Chat with Custom UI
```tsx
function CustomChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <div>
      {messages.map(msg => (
        <div key={msg.id} className={msg.role === 'user' ? 'user' : 'ai'}>
          {msg.content}
        </div>
      ))}
      <input
        onSubmit={e => append({ role: 'user', content: e.target.value })}
        disabled={isLoading}
      />
    </div>
  )
}
```

### Chat with Tools
```tsx
import { useClarityChatWithTools } from '@clarity-chat/react'

const tools = [{
  name: 'getCurrentWeather',
  description: 'Get current weather',
  parameters: {
    location: { type: 'string', description: 'City name' }
  },
  execute: async ({ location }) => {
    const weather = await fetchWeather(location)
    return `It's ${weather.temp}°F in ${location}`
  }
}]

function ChatWithTools() {
  const chat = useClarityChatWithTools({
    api: '/api/chat',
    tools,
  })
  return <ChatWindow {...chat} />
}
```

### RAG Chat (Retrieval-Augmented Generation)
```tsx
import { useClarityChat, useRAGPipeline } from '@clarity-chat/react'

function RAGChat() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingModel: 'text-embedding-3-small',
    chunkSize: 500,
  })

  const chat = useClarityChat({
    api: '/api/chat',
    onBeforeSend: async (message) => {
      // Retrieve relevant context
      const context = await rag.retrieve(message.content)
      return {
        ...message,
        context,
      }
    },
  })

  return <ChatWindow {...chat} />
}
```

---

## Next Steps

**Choose your path:**

1. **New to AI chat?**
   - Read [Choosing the Right Hook](./guides/choosing-hooks.md)
   - Try the [examples](./examples/README.md)

2. **Want to save costs?**
   - Enable [Token Optimization](./guides/token-optimization.md)
   - 50-70% cost reduction automatically!

3. **Building production app?**
   - Add [Error Handling](./guides/error-handling.md)
   - Configure [Memory](./guides/memory.md)
   - Setup [Accessibility](./integration/accessibility.md)

4. **Need custom features?**
   - Browse [all hooks](./api/hooks/README.md) (95+ hooks)
   - Browse [all components](./api/components/README.md) (180+ components)
   - Read [Advanced Guides](./advanced/README.md)

---

## Common Recipes

### Add Loading State
```tsx
const { isLoading } = useClarityChat({ api: '/api/chat' })

{isLoading && <LoadingSpinner />}
```

### Add Error Handling
```tsx
const { error, retry } = useClarityChat({ api: '/api/chat' })

{error && <ErrorMessage error={error} onRetry={retry} />}
```

### Persist Conversations
```tsx
const chat = useClarityChat({
  api: '/api/chat',
  memory: true,
  memoryOptions: {
    storageBackend: 'indexeddb',
    persistenceKey: 'my-chat-history',
  },
})
```

### Add Keyboard Shortcuts
```tsx
import { useKeyboardShortcuts } from '@clarity-chat/react'

useKeyboardShortcuts({
  'Ctrl+Enter': () => chat.append({ role: 'user', content: input }),
  'Escape': () => clearInput(),
})
```

### Stream Progress Updates
```tsx
const { streamingProgress } = useClarityChat({ api: '/api/chat' })

<ProgressBar
  current={streamingProgress.tokens}
  total={streamingProgress.estimatedTotal}
/>
```

---

## Troubleshooting

### "Streaming not working"
```tsx
// Make sure your API route returns a StreamingTextResponse
import { StreamingTextResponse } from '@clarity-chat/react/adapters'

export async function POST(req: Request) {
  const stream = await generateStream()
  return new StreamingTextResponse(stream) // ← This is required
}
```

### "Too expensive"
```tsx
// Enable token optimization (saves 50-70%)
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // ← Add this
})
```

### "Memory leaking"
```tsx
// Set memory limits
const chat = useClarityChat({
  api: '/api/chat',
  memory: true,
  memoryOptions: {
    maxMemories: 100, // ← Limit memories
    enableDecay: true, // ← Auto-forget old memories
  },
})
```

### "Not accessible"
```tsx
// Use built-in accessible components
import { ChatWindow } from '@clarity-chat/react/components'
// ChatWindow is WCAG 2.1 AA compliant by default
```

[More troubleshooting →](./troubleshooting.md)

---

## Getting Help

- **Documentation:** [Browse all guides](./README.md)
- **Examples:** [See working examples](./examples/README.md)
- **API Reference:** [All hooks](./api/hooks/README.md) | [All components](./api/components/README.md)
- **Discord:** [Join the community](https://discord.gg/clarity-chat)
- **GitHub:** [Issues](https://github.com/clarity-chat/clarity/issues) | [Discussions](https://github.com/clarity-chat/clarity/discussions)

---

**Ready to build?** Start with the [Choosing the Right Hook guide](./guides/choosing-hooks.md).
