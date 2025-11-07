# Cookbook

Common recipes and patterns for building with Clarity Chat. For the complete cookbook with all 25 recipes, see [COOKBOOK.md](https://github.com/yourusername/clarity-chat/blob/main/COOKBOOK.md) in the repository.

## Quick Recipes

### 1. Basic Chat Setup

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function BasicChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await response.json()
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
}
```

### 2. Streaming Chat

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async (content: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMsg])

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }
    setMessages(prev => [...prev, assistantMsg])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              setMessages(prev =>
                prev.map(msg =>
                  msg.id === assistantMsg.id
                    ? { ...msg, content: msg.content + parsed.content }
                    : msg
                )
              )
            } catch (e) {}
          }
        }
      }

      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMsg.id ? { ...msg, isStreaming: false } : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
}
```

### 3. Persistent Conversations

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState, useEffect } from 'react'
import type { Message } from '@clarity-chat/types'

export function PersistentChat() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('chat-messages')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages))
  }, [messages])

  const handleSend = async (content: string) => {
    // ... send message logic
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### 4. With Token Tracking

```tsx
import { ChatWindow, TokenCounter } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function ChatWithTokens() {
  const [messages, setMessages] = useState<Message[]>([])

  return (
    <div>
      <TokenCounter 
        messages={messages} 
        model="gpt-4" 
        maxTokens={8000}
        showCost 
      />
      <ChatWindow 
        messages={messages} 
        onSendMessage={handleSend} 
      />
    </div>
  )
}
```

### 5. File Upload Support

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatWithFiles() {
  const [messages, setMessages] = useState<Message[]>([])
  const [files, setFiles] = useState<File[]>([])

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setFiles(uploadedFiles)
    
    // Upload to server
    const formData = new FormData()
    uploadedFiles.forEach(file => formData.append('files', file))
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    const { urls } = await response.json()
    // Use URLs in context...
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
      onFileUpload={handleFileUpload}
      enableFileUpload
    />
  )
}
```

### 6. OpenAI Integration

```tsx
// app/api/chat/route.ts
import { OpenAI } from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
  })
  
  return Response.json({ 
    message: completion.choices[0].message.content 
  })
}
```

### 7. OpenAI Streaming

```tsx
// app/api/chat/stream/route.ts
import { OpenAI } from 'openai'

const openai = new OpenAI()

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const stream = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages,
    stream: true,
  })
  
  const encoder = new TextEncoder()
  
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content
        if (content) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
          )
        }
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  
  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })
}
```

### 8. Error Handling

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatWithErrors() {
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSend = async (content: string) => {
    setError(null)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ content }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const data = await response.json()
      // ... handle response
    } catch (err) {
      setError(err.message)
      // Add error message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        timestamp: Date.now(),
        error: true,
      }])
    }
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

### 9. Multi-user Chat with Socket.io

```tsx
import { ChatWindow } from '@clarity-chat/react'
import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export function MultiUserChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [socket] = useState(() => io())

  useEffect(() => {
    socket.on('new_message', (message: Message) => {
      setMessages(prev => [...prev, message])
    })

    return () => {
      socket.off('new_message')
    }
  }, [])

  const handleSend = (content: string) => {
    socket.emit('send_message', { content })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### 10. With Network Status

```tsx
import { ChatWindow, NetworkStatus } from '@clarity-chat/react'
import { useState } from 'react'

export function ChatWithNetwork() {
  const [messages, setMessages] = useState<Message[]>([])
  
  return (
    <div>
      <NetworkStatus onReconnect={handleReconnect} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

## Advanced Recipes

### 11. RAG Chat with Vector Store

Build a RAG-powered chat that retrieves information from your documents:

```tsx
import { ChatWindow, PineconeVectorStore, PDFLoader, OpenAIEmbeddings } from '@clarity-chat/react'

function RAGChat() {
  const [messages, setMessages] = useState([])
  
  const vectorStore = new PineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'documents',
  })
  
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const handleSend = async (question: string) => {
    // Generate query embedding
    const queryEmbedding = await embeddings.embedQuery(question)
    
    // Retrieve relevant context
    const results = await vectorStore.similaritySearch({
      query: queryEmbedding,
      topK: 5,
    })
    
    const context = results.map(r => r.content).join('\n\n')
    
    // Generate response with context
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Answer using this context: ${context}`,
          },
          { role: 'user', content: question },
        ],
      }),
    })
    
    const data = await response.json()
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### 12. Agent with Tools

Create an AI agent that can call external tools:

```tsx
import { ReactAgent, useAgent, AgentRunFeed } from '@clarity-chat/react'

const agent = new ReactAgent({
  model: 'gpt-4-turbo-preview',
  apiKey: process.env.OPENAI_API_KEY,
  tools: [
    {
      name: 'get_weather',
      description: 'Get current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string' },
        },
        required: ['location'],
      },
      execute: async ({ location }) => {
        const response = await fetch(`/api/weather?location=${location}`)
        return response.json()
      },
    },
  ],
})

function AgentChat() {
  const { messages, sendMessage, isRunning, steps } = useAgent({ agent })

  return (
    <div>
      <AgentRunFeed steps={steps} />
      <ChatWindow
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isRunning}
      />
    </div>
  )
}
```

### 13. Chat with Memory

Enable your assistant to remember information across conversations:

```tsx
import { ChatWindow, MemoryService, MemoryProvider, MemoryInspector } from '@clarity-chat/react'

const memoryService = new MemoryService({
  provider: 'local',
})

function ChatWithMemory() {
  const [messages, setMessages] = useState([])
  const [memories, setMemories] = useState([])

  useEffect(() => {
    memoryService.getAll({ scope: 'thread' }).then(setMemories)
  }, [messages])

  const handleSend = async (content: string) => {
    // Store important information automatically
    await memoryService.extractAndStore(content, 'thread')
    
    // Send message
    // ...
  }

  return (
    <MemoryProvider service={memoryService}>
      <MemoryInspector memories={memories} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </MemoryProvider>
  )
}
```

### 14. Safety-First Chat

Add content moderation and PII detection:

```tsx
import { ChatWindow, PIIDetector, ContentFilter, SafetyStatusCard } from '@clarity-chat/react'

function SafeChat() {
  const [messages, setMessages] = useState([])
  const [safetyChecks, setSafetyChecks] = useState([])
  
  const piiDetector = new PIIDetector({ redact: true })
  const contentFilter = new ContentFilter({ enabled: true })

  const handleSend = async (content: string) => {
    // Run safety checks
    const [piiResult, contentResult] = await Promise.all([
      piiDetector.detect(content),
      contentFilter.check(content),
    ])

    setSafetyChecks([
      {
        id: 'pii',
        label: 'PII Detection',
        status: piiResult.hasPII ? 'warn' : 'pass',
      },
      {
        id: 'content',
        label: 'Content Filter',
        status: contentResult.flagged ? 'fail' : 'pass',
      },
    ])

    if (!piiResult.hasPII && !contentResult.flagged) {
      const safeContent = piiResult.redactedText || content
      // Send safe content
    }
  }

  return (
    <div>
      <SafetyStatusCard checks={safetyChecks} />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

### 15. Multi-Model Chat

Let users switch between different AI models:

```tsx
import { ChatWindow, ModelSelector, openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const adapters = {
  'gpt-4': openAIAdapter({ apiKey: process.env.OPENAI_API_KEY }),
  'claude-3': anthropicAdapter({ apiKey: process.env.ANTHROPIC_API_KEY }),
}

function MultiModelChat() {
  const [messages, setMessages] = useState([])
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const adapter = adapters[selectedModel]

  const handleSend = async (content: string) => {
    const response = await adapter.complete({
      messages: [{ role: 'user', content }],
    })
    // Add response to messages
  }

  return (
    <div>
      <ModelSelector
        models={[
          { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
          { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
        ]}
        selectedModel={selectedModel}
        onSelect={setSelectedModel}
      />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

### 16. Token-Optimized Chat

Optimize token usage with compression and smart caching:

```tsx
import { ChatWindow, useTokenTracker, usePromptCompression, TokenCounter } from '@clarity-chat/react'

function OptimizedChat() {
  const [messages, setMessages] = useState([])
  
  const { compress } = usePromptCompression({
    enabled: true,
    targetReduction: 0.3, // Reduce by 30%
  })
  
  const { tokenCount, estimatedCost, isNearLimit } = useTokenTracker({
    messages,
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    // Compress messages if near limit
    const messagesToSend = isNearLimit
      ? await compress(messages)
      : messages
    
    // Send compressed messages
    // ...
  }

  return (
    <div>
      <TokenCounter
        tokens={tokenCount}
        maxTokens={8000}
        showCost
      />
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </div>
  )
}
```

### 17. Observability-Enabled Chat

Monitor your chat with comprehensive observability:

```tsx
import { ChatWindow, ObservabilityProvider, Tracer, MetricsCollector } from '@clarity-chat/react'

const tracer = new Tracer({ enabled: true })
const metrics = new MetricsCollector({ enabled: true })

function MonitoredChat() {
  return (
    <ObservabilityProvider
      tracer={tracer}
      metrics={metrics}
      autoTrace={true}
    >
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </ObservabilityProvider>
  )
}
```

### 18. Enterprise Chat with RBAC

Add role-based access control:

```tsx
import { ChatWindow, RBACProvider, useRBAC } from '@clarity-chat/react'

const rbacConfig = {
  roles: {
    admin: ['read', 'write', 'delete', 'manage'],
    user: ['read', 'write'],
    viewer: ['read'],
  },
}

function EnterpriseChat() {
  return (
    <RBACProvider config={rbacConfig}>
      <ChatWithRBAC />
    </RBACProvider>
  )
}

function ChatWithRBAC() {
  const { can } = useRBAC()
  
  const handleSend = async (content: string) => {
    if (!can('write')) {
      return // User doesn't have permission
    }
    // Send message
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### 19. Multi-Tenant Chat

Support multiple organizations:

```tsx
import { ChatWindow, MultiTenancyProvider, useTenant } from '@clarity-chat/react'

function MultiTenantApp() {
  return (
    <MultiTenancyProvider>
      <ChatWithTenancy />
    </MultiTenancyProvider>
  )
}

function ChatWithTenancy() {
  const { tenantId, switchTenant } = useTenant()
  
  // Messages are automatically scoped to current tenant
  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

### 20. Chat with Webhooks

Receive webhooks for chat events:

```tsx
import { ChatWindow, WebhookManager } from '@clarity-chat/react'

const webhookManager = new WebhookManager({
  endpoints: [
    {
      url: 'https://your-app.com/webhooks/chat',
      events: ['message.sent', 'message.received'],
    },
  ],
})

function ChatWithWebhooks() {
  const handleSend = async (content: string) => {
    // Send message
    await sendMessage(content)
    
    // Trigger webhook
    await webhookManager.trigger('message.sent', {
      content,
      timestamp: Date.now(),
    })
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## More Recipes

For additional recipes covering:

- Getting started patterns
- Advanced features (branching, regeneration, undo/redo)
- Framework integrations (Next.js, Remix, Vite)
- Backend integrations (OpenAI, Anthropic, Supabase)
- Production patterns (rate limiting, authentication, analytics)
- Performance optimization
- Testing strategies

Visit the [full COOKBOOK.md](https://github.com/yourusername/clarity-chat/blob/main/COOKBOOK.md) in the repository.

## Troubleshooting

### Messages not appearing

Make sure you're updating state correctly:

```tsx
// ❌ Wrong - mutates state
messages.push(newMessage)

// ✅ Correct - creates new array
setMessages(prev => [...prev, newMessage])
```

### Streaming not working

Check your API route returns proper SSE format:

```typescript
controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
```

### Performance issues with large message lists

Enable virtualization:

```tsx
<ChatWindow virtualizeMessages />
```

## Next Steps

- [API Reference](/api/components) - Detailed API documentation
- [Examples](/examples/) - Complete working examples
- [Integration Guides](/integrations/nextjs) - Framework-specific guides
