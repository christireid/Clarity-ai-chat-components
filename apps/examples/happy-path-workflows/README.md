# Happy Path Workflows

Examples showing the primary workflows that real users care about, implemented with top-level and mid-level APIs.

---

## Workflow 1: Full Chat UI with Memory

**Goal**: Spin up a complete chat interface with conversation memory

**APIs**: `ClarityChat` (top-level) + `enableMemory` prop

**Lines of Code**: 5-10

**Why Enterprise-Grade**: Includes error handling, network status, token tracking, memory integration, all with zero configuration.

### Minimal Version

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      enableMemory
      memoryStrategy="vector-store"
    />
  )
}
```

### Customized Version

```tsx
import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function App() {
  return (
    <ClarityChat
      api="/api/chat"
      enableMemory
      memoryStrategy="vector-store"
      theme="dark"
      showTokenCounter
      showHeader
      sessionTitle="AI Assistant"
      onMessageSent={(msg) => console.log('Sent:', msg)}
      onMessageReceived={(msg) => console.log('Received:', msg)}
    />
  )
}
```

---

## Workflow 2: Custom Chat Layout with RAG

**Goal**: Build a custom chat layout with RAG pipeline

**APIs**: `useChatCore` (mid-level) + `useRAGPipeline` (top-level) + `ChatLayout` (mid-level)

**Lines of Code**: 20-30

**Why Enterprise-Grade**: Composable building blocks allow custom layouts while maintaining enterprise features like RAG, error handling, and observability.

### Implementation

```tsx
import { useChatSimple, ChatWindow } from '@clarity-chat/react'
import { useRAGPipeline } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  const chat = useChatSimple({ api: '/api/chat' })
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
  })

  const handleSend = async (content: string) => {
    // Retrieve relevant context
    const context = await rag.retrieve(content)
    
    // Send with context
    await chat.sendMessage(content)
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside style={{ width: '300px', borderRight: '1px solid #e5e7eb' }}>
        <h3>RAG Context</h3>
        {rag.context.documents.map((doc, i) => (
          <div key={i} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
            <p>{doc.content.substring(0, 100)}...</p>
          </div>
        ))}
      </aside>
      <main style={{ flex: 1 }}>
        <ChatWindow
          messages={chat.messages}
          isLoading={chat.isLoading}
          onSendMessage={handleSend}
        />
      </main>
    </div>
  )
}
```

---

## Workflow 3: Enterprise Multi-Tenant Chat

**Goal**: Set up multi-tenant chat with RBAC and audit logging

**APIs**: `createEnterpriseShell` (top-level)

**Lines of Code**: 15-25

**Why Enterprise-Grade**: Single API sets up complete enterprise infrastructure with multi-tenancy, RBAC, audit logging, and quotas.

### Implementation

```tsx
import { createEnterpriseShell } from '@clarity-chat/react'
import { ClarityChat } from '@clarity-chat/react'

const shell = createEnterpriseShell({
  auth: {
    provider: 'okta',
    apiKey: process.env.OKTA_API_KEY,
  },
  multiTenancy: {
    enabled: true,
    tenantId: 'tenant-123',
  },
  rbac: {
    enabled: true,
    roles: ['admin', 'user', 'viewer'],
  },
  audit: {
    enabled: true,
    logLevel: 'info',
  },
})

function App() {
  return (
    <shell.Provider>
      <shell.ChatApp api="/api/chat" />
    </shell.Provider>
  )
}
```

---

## Workflow 4: AI Agent with Tools

**Goal**: Create an AI agent with tool calling capabilities

**APIs**: `useAgent` (top-level) + `useTools` (mid-level)

**Lines of Code**: 20-30

**Why Enterprise-Grade**: High-level agent API with automatic tool management, error handling, and observability built-in.

### Implementation

```tsx
import { useAgent } from '@clarity-chat/react'
import { ChatWindow } from '@clarity-chat/react'

// Define tools
const webSearchTool = {
  name: 'web_search',
  description: 'Search the web',
  execute: async (query: string) => {
    // Tool implementation
    return `Search results for: ${query}`
  },
}

const calculatorTool = {
  name: 'calculator',
  description: 'Perform calculations',
  execute: async (expression: string) => {
    // Tool implementation
    return eval(expression).toString()
  },
}

function App() {
  const agent = useAgent({
    model: 'gpt-4',
    tools: [webSearchTool, calculatorTool],
    api: '/api/agent',
  })

  const handleQuery = async (query: string) => {
    const response = await agent.run({ query })
    return response
  }

  return (
    <ChatWindow
      messages={[]}
      isLoading={agent.isLoading}
      onSendMessage={handleQuery}
    />
  )
}
```

---

## Summary

All workflows demonstrate:

1. **Minimal Configuration**: Top-level APIs handle complexity
2. **Composability**: Mid-level APIs allow customization
3. **Enterprise Features**: Built-in error handling, observability, security
4. **Type Safety**: Full TypeScript support
5. **Progressive Disclosure**: Start simple, add complexity when needed
