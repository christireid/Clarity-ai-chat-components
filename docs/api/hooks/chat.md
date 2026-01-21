# Chat & Conversation Hooks

Hooks for building chat interfaces and managing conversations.

---

## Overview

These are the core hooks for building AI chat applications. For 90% of projects, you only need `useClarityChat`.

| Hook | Purpose | When to Use |
|------|---------|-------------|
| [`useClarityChat`](#useclaritychat) | Main chat hook ⭐ | **Use this for everything** |
| [`useClarityChatWithTools`](#useclaritychatwithtools) | Chat with tools | Function calling |
| [`useClarityObject`](#useclarityobject) | Structured output | Generate typed JSON |
| [`useChatHistory`](#usechathistory) | History management | Browse past conversations |
| [`useRAGPipeline`](#useragpipeline) | RAG integration | Document Q&A |
| [`useAgent`](#useagent) | Agent orchestration | Complex multi-step tasks |
| [`useAssistant`](#useassistant) | Assistant features | Persistent assistants |
| [`useChat` (legacy)](#usechat-legacy) | Old API | **Deprecated** - use `useClarityChat` |

---

## useClarityChat

**The main hook for building chat interfaces.** Handles streaming, memory, token optimization, and error handling automatically.

### Signature

```typescript
function useClarityChat(options?: UseClarityChatOptions): UseClarityChatReturn

interface UseClarityChatOptions {
  // Required
  api: string

  // Token Optimization (recommended!)
  tokenOptimization?: 'smart' | 'aggressive' | 'balanced' | 'conservative' | 'off'
  tokenOptimizationConfig?: TokenOptimizationConfig

  // Memory
  memory?: boolean | ClarityMemoryOptions
  memoryOptions?: {
    storageBackend?: 'memory' | 'indexeddb' | 'file'
    maxMemories?: number
    enableDecay?: boolean
    persistenceKey?: string
  }

  // Streaming
  transport?: 'sse' | 'websocket'
  streamProtocol?: 'text' | 'data'

  // Initial State
  initialMessages?: Message[]
  id?: string

  // Callbacks
  onFinish?: (message: Message) => void | Promise<void>
  onError?: (error: Error) => void
  onResponse?: (response: Response) => void

  // Advanced
  headers?: Record<string, string>
  body?: Record<string, any>
  maxTokens?: number
  temperature?: number
  topP?: number
}

interface UseClarityChatReturn {
  // State
  messages: Message[]
  isLoading: boolean
  error: Error | null

  // Actions
  append: (message: Message | { role: 'user' | 'assistant', content: string }) => Promise<void>
  reload: () => Promise<void>
  stop: () => void
  setMessages: (messages: Message[]) => void

  // Info
  memoryInfo?: MemoryInfo
  tokenStats?: TokenStats
}
```

### Examples

#### Basic Chat

```typescript
import { useClarityChat } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react/components'

function BasicChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

#### With Token Optimization (Saves 50-70%!)

```typescript
const chat = useClarityChat({
  api: '/api/chat',
  tokenOptimization: 'smart', // ← Automatic cost savings!
})
```

**Modes:**
- `'smart'` / `'balanced'` - Recommended (good cost/quality balance)
- `'aggressive'` - Maximum savings (may sacrifice some quality)
- `'conservative'` - Minimal optimization (preserve full quality)
- `'off'` - No optimization

#### With Memory

```typescript
const chat = useClarityChat({
  api: '/api/chat',
  memory: true,
  memoryOptions: {
    storageBackend: 'indexeddb', // Persists across page refreshes
    maxMemories: 100,
    enableDecay: true, // Auto-forget old conversations
    persistenceKey: 'my-app-chat-v1',
  },
})
```

#### With Error Handling

```typescript
const { messages, append, error, reload } = useClarityChat({
  api: '/api/chat',
  onError: (err) => {
    console.error('Chat error:', err)
    // Send to error tracking service
  },
})

return (
  <div>
    {error && (
      <ErrorMessage error={error} onRetry={reload} />
    )}
    <ChatWindow messages={messages} onSend={append} />
  </div>
)
```

#### With Custom Headers (Authentication)

```typescript
const chat = useClarityChat({
  api: '/api/chat',
  headers: {
    'Authorization': `Bearer ${userToken}`,
    'X-User-ID': userId,
  },
})
```

#### WebSocket Streaming

```typescript
const chat = useClarityChat({
  api: 'ws://localhost:3000/chat',
  transport: 'websocket', // Use WebSocket instead of SSE
})
```

### When to Use

✅ **Use `useClarityChat` for:**
- Any chat interface
- Streaming AI responses
- Conversation memory
- Cost optimization
- Error handling
- Token tracking

❌ **Don't use for:**
- Non-chat interfaces (use `useCompletion` or `useClarityObject`)
- Custom streaming logic (use `useStreaming`)

### Related Hooks

- [`useClarityChatWithTools`](#useclaritychatwithtools) - Add function calling
- [`useClarityObject`](#useclarityobject) - Generate structured output
- [`useChatHistory`](#usechathistory) - Manage conversation history

---

## useClarityChatWithTools

**Chat with function calling / tool use.** AI can call functions you define.

### Signature

```typescript
function useClarityChatWithTools(options: UseClarityChatWithToolsOptions): UseClarityChatWithToolsReturn

interface UseClarityChatWithToolsOptions extends UseClarityChatOptions {
  tools: Tool[]
  toolChoice?: 'auto' | 'none' | { name: string }
  onToolCall?: (toolCall: ToolCall) => void | Promise<void>
  requireApproval?: boolean
}

interface Tool {
  name: string
  description: string
  parameters: JSONSchema
  execute: (params: any) => Promise<any> | any
}
```

### Examples

#### Basic Tool Usage

```typescript
import { useClarityChatWithTools } from '@clarity-chat/react'

const tools = [
  {
    name: 'getCurrentWeather',
    description: 'Get the current weather in a location',
    parameters: {
      type: 'object',
      properties: {
        location: {
          type: 'string',
          description: 'City name, e.g. "San Francisco"'
        },
        unit: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature unit'
        }
      },
      required: ['location']
    },
    execute: async ({ location, unit = 'fahrenheit' }) => {
      const weather = await fetchWeather(location)
      return `It's ${weather.temp}°${unit === 'celsius' ? 'C' : 'F'} in ${location}`
    }
  },
  {
    name: 'searchDatabase',
    description: 'Search the knowledge base',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query' }
      },
      required: ['query']
    },
    execute: async ({ query }) => {
      const results = await searchKB(query)
      return results.map(r => r.content).join('\\n')
    }
  }
]

function ChatWithTools() {
  const { messages, append, isLoading } = useClarityChatWithTools({
    api: '/api/chat',
    tools,
    onToolCall: (toolCall) => {
      console.log('AI called tool:', toolCall.function.name)
    }
  })

  return <ChatWindow messages={messages} onSend={append} isLoading={isLoading} />
}
```

#### With Tool Approval (User Confirmation)

```typescript
const chat = useClarityChatWithTools({
  api: '/api/chat',
  tools,
  requireApproval: true, // User must approve each tool call
  onToolCall: async (toolCall) => {
    const approved = await confirm(`Allow AI to call ${toolCall.function.name}?`)
    if (!approved) {
      throw new Error('Tool call rejected by user')
    }
  }
})
```

#### Force Specific Tool

```typescript
const chat = useClarityChatWithTools({
  api: '/api/chat',
  tools,
  toolChoice: { name: 'searchDatabase' }, // Always use this tool
})
```

### When to Use

✅ **Use `useClarityChatWithTools` for:**
- AI needs to call APIs / fetch data
- AI needs to perform actions (send email, create tasks, etc.)
- AI needs to access external systems
- Interactive workflows

❌ **Don't use for:**
- Simple chat (use `useClarityChat`)
- No function calling needed

### Related Hooks

- [`useClarityChat`](#useclaritychat) - Chat without tools
- [`useAgent`](#useagent) - Complex multi-tool agents

---

## useClarityObject

**Generate structured, typed JSON output.** Perfect for forms, data extraction, and structured generation.

### Signature

```typescript
function useClarityObject<T = any>(options: UseClarityObjectOptions): UseClarityObjectReturn<T>

interface UseClarityObjectOptions {
  api: string
  schema: JSONSchema
  onFinish?: (object: T) => void
}

interface UseClarityObjectReturn<T> {
  object: Partial<T> | undefined
  isLoading: boolean
  error: Error | null
  submit: (prompt: string) => Promise<void>
}
```

### Examples

#### Generate Structured Data

```typescript
import { useClarityObject } from '@clarity-chat/react'

interface Person {
  name: string
  age: number
  email: string
  interests: string[]
}

function ExtractPersonInfo() {
  const { object, submit, isLoading } = useClarityObject<Person>({
    api: '/api/generate',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        age: { type: 'number' },
        email: { type: 'string', format: 'email' },
        interests: {
          type: 'array',
          items: { type: 'string' }
        }
      },
      required: ['name', 'age']
    },
    onFinish: (person) => {
      console.log('Extracted:', person)
      saveToDB(person)
    }
  })

  return (
    <div>
      <button onClick={() => submit('Extract info from: John Doe, 30 years old, loves coding and coffee')}>
        Extract Info
      </button>
      {isLoading && <Spinner />}
      {object && (
        <div>
          <p>Name: {object.name}</p>
          <p>Age: {object.age}</p>
          <p>Email: {object.email}</p>
          <p>Interests: {object.interests?.join(', ')}</p>
        </div>
      )}
    </div>
  )
}
```

#### Form Generation

```typescript
interface FormData {
  title: string
  description: string
  category: 'bug' | 'feature' | 'question'
  priority: 1 | 2 | 3
}

const { object, submit } = useClarityObject<FormData>({
  api: '/api/generate',
  schema: {
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 100 },
      description: { type: 'string' },
      category: { type: 'string', enum: ['bug', 'feature', 'question'] },
      priority: { type: 'number', enum: [1, 2, 3] }
    },
    required: ['title', 'category']
  }
})

// AI generates form data from natural language
submit('Create a high-priority bug report about login not working')
```

### When to Use

✅ **Use `useClarityObject` for:**
- Data extraction
- Form generation
- Structured outputs
- Typed responses
- Classification tasks

❌ **Don't use for:**
- Conversational chat (use `useClarityChat`)
- Free-form text generation

### Related Hooks

- [`useClarityChat`](#useclaritychat) - Conversational chat
- [`useClarityChatWithTools`](#useclaritychatwithtools) - Tools + structured output

---

## useChatHistory

**Manage conversation history.** Browse, search, and manage past conversations.

### Signature

```typescript
function useChatHistory(options?: UseChatHistoryOptions): UseChatHistoryReturn

interface UseChatHistoryOptions {
  storageBackend?: 'memory' | 'indexeddb' | 'localStorage'
  maxHistorySize?: number
  autoSave?: boolean
}

interface UseChatHistoryReturn {
  conversations: Conversation[]
  currentConversation: Conversation | null

  loadConversation: (id: string) => Promise<void>
  saveConversation: (conversation: Conversation) => Promise<void>
  deleteConversation: (id: string) => Promise<void>
  clearHistory: () => Promise<void>

  searchConversations: (query: string) => Conversation[]
}
```

### Examples

#### Basic History

```typescript
const history = useChatHistory({
  storageBackend: 'indexeddb',
  maxHistorySize: 100,
  autoSave: true,
})

// Load previous conversation
await history.loadConversation('conversation-123')

// Save current conversation
await history.saveConversation({
  id: 'conversation-456',
  title: 'Project discussion',
  messages: chat.messages,
  createdAt: new Date(),
})

// Search conversations
const results = history.searchConversations('project')
```

#### With UI

```tsx
function ChatWithHistory() {
  const chat = useClarityChat({ api: '/api/chat' })
  const history = useChatHistory({ storageBackend: 'indexeddb' })

  return (
    <div className="flex">
      <Sidebar>
        <h2>Conversations</h2>
        {history.conversations.map(conv => (
          <button key={conv.id} onClick={() => history.loadConversation(conv.id)}>
            {conv.title}
          </button>
        ))}
      </Sidebar>
      <ChatWindow {...chat} />
    </div>
  )
}
```

---

## useRAGPipeline

**RAG (Retrieval-Augmented Generation) pipeline.** Add knowledge base to your chat.

### Signature

```typescript
function useRAGPipeline(options: UseRAGPipelineOptions): UseRAGPipelineReturn

interface UseRAGPipelineOptions {
  vectorStore: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma'
  embeddingModel?: string
  chunkSize?: number
  topK?: number
}

interface UseRAGPipelineReturn {
  retrieve: (query: string) => Promise<Document[]>
  addDocuments: (documents: Document[]) => Promise<void>
  search: (query: string, options?: SearchOptions) => Promise<SearchResult[]>
}
```

### Examples

#### Basic RAG

```typescript
const rag = useRAGPipeline({
  vectorStore: 'pinecone',
  embeddingModel: 'text-embedding-3-small',
  topK: 5,
})

const chat = useClarityChat({
  api: '/api/chat',
  onBeforeSend: async (message) => {
    // Retrieve relevant context
    const context = await rag.retrieve(message.content)

    return {
      ...message,
      context: context.map(doc => doc.content).join('\\n\\n')
    }
  }
})
```

---

## useAgent

**Agent orchestration.** Multi-step reasoning and tool use.

### Signature

```typescript
function useAgent(options: UseAgentOptions): UseAgentReturn

interface UseAgentOptions {
  tools: Tool[]
  maxIterations?: number
  strategy?: 'chain-of-thought' | 'react' | 'custom'
}
```

### Examples

```typescript
const agent = useAgent({
  tools: [searchTool, calculatorTool, emailTool],
  maxIterations: 10,
  strategy: 'react', // Reasoning + Acting
})

await agent.run('Book a flight to NYC and email me the confirmation')
```

---

## Common Patterns

### Combining Hooks

```typescript
// Chat + History + Token Tracking
function AdvancedChat() {
  const chat = useClarityChat({
    api: '/api/chat',
    tokenOptimization: 'smart',
  })

  const history = useChatHistory({ storageBackend: 'indexeddb' })
  const budget = useTokenBudget({ sessionBudgetTokens: 100000 })

  useEffect(() => {
    if (chat.messages.length > 0) {
      history.saveConversation({
        id: chat.id,
        messages: chat.messages,
        createdAt: new Date(),
      })
    }
  }, [chat.messages])

  return (
    <div>
      <BudgetIndicator budget={budget} />
      <ConversationList history={history} />
      <ChatWindow {...chat} />
    </div>
  )
}
```

---

## Troubleshooting

**Messages not streaming?**
- Check API returns `StreamingTextResponse`
- Verify `transport: 'sse'` is set

**Memory not persisting?**
- Use `storageBackend: 'indexeddb'`
- Check browser storage permissions

**Token budget exceeded?**
- Increase `sessionBudgetTokens`
- Enable `tokenOptimization: 'smart'`

[See full troubleshooting guide →](../../troubleshooting.md)

---

**Next:** [Token Optimization Hooks →](./token.md)
