# Memory System

Clarity Chat's memory system allows your AI assistant to remember information across conversations, creating more personalized and context-aware experiences.

## Overview

The memory system provides:
- **Session Memory**: Temporary memory for the current session
- **Thread Memory**: Persistent memory for a conversation thread
- **Global Memory**: Shared memory across all conversations
- **Semantic Search**: Find memories by meaning, not just keywords
- **Automatic Extraction**: Automatically extract and store important facts

## Quick Start

```tsx
import { MemoryService, MemoryProvider } from '@clarity-chat/react'

const memoryService = new MemoryService({
  provider: 'local', // or 'vector-store' for persistent memory
})

function ChatWithMemory() {
  return (
    <MemoryProvider service={memoryService}>
      <ChatWindow messages={messages} onSendMessage={handleSend} />
    </MemoryProvider>
  )
}
```

## Memory Scopes

### Session Memory

Temporary memory cleared when the session ends:

```tsx
await memoryService.store({
  key: 'current_topic',
  value: 'discussing TypeScript',
  scope: 'session',
})
```

### Thread Memory

Persists across sessions for a specific conversation:

```tsx
await memoryService.store({
  key: 'user_preference',
  value: 'prefers dark mode',
  scope: 'thread',
  threadId: 'conversation-123',
})
```

### Global Memory

Shared across all conversations:

```tsx
await memoryService.store({
  key: 'user_name',
  value: 'Alice',
  scope: 'global',
})
```

## Storing Memories

### Manual Storage

```tsx
// Store a simple key-value memory
await memoryService.store({
  key: 'favorite_color',
  value: 'blue',
  scope: 'thread',
})

// Store structured data
await memoryService.store({
  key: 'user_profile',
  value: {
    name: 'Alice',
    age: 30,
    preferences: ['dark mode', 'notifications'],
  },
  scope: 'global',
})
```

### Automatic Extraction

Automatically extract and store important information from conversations:

```tsx
import { MemoryExtractor } from '@clarity-chat/react'

const extractor = new MemoryExtractor({
  enabled: true,
  extractTypes: ['names', 'preferences', 'facts', 'dates'],
})

// Extract memories from a message
const memories = await extractor.extract({
  message: "My name is Alice and I prefer dark mode",
  scope: 'thread',
})

// Memories are automatically stored
```

## Retrieving Memories

### By Key

```tsx
const memory = await memoryService.retrieve({
  key: 'favorite_color',
  scope: 'thread',
})

console.log(memory.value) // 'blue'
```

### Semantic Search

Find memories by meaning:

```tsx
const memories = await memoryService.search({
  query: 'user preferences',
  scope: 'thread',
  limit: 5,
})

// Returns memories semantically related to "user preferences"
```

### All Memories in Scope

```tsx
const allMemories = await memoryService.getAll({
  scope: 'thread',
  threadId: 'conversation-123',
})
```

## Memory Inspector

Inspect stored memories:

```tsx
import { MemoryInspector } from '@clarity-chat/react'

function MemoryPanel() {
  const [memories, setMemories] = useState([])

  useEffect(() => {
    memoryService.getAll({ scope: 'thread' }).then(setMemories)
  }, [])

  return (
    <MemoryInspector
      memories={memories}
      onRemove={(memory) => {
        memoryService.delete(memory.id)
      }}
      onPromote={(memory) => {
        // Promote from thread to global scope
        memoryService.store({
          ...memory,
          scope: 'global',
        })
      }}
    />
  )
}
```

## Using Memory in Chat

### Automatic Memory Injection

Memories are automatically injected into the conversation context:

```tsx
const agent = new ReactAgent({
  model: 'gpt-4-turbo',
  memory: memoryService,
  systemPrompt: `You are a helpful assistant with memory.
    Remember important facts about the user and reference them naturally.`,
})

// When user says "What's my favorite color?"
// The agent automatically has access to stored memories
```

### Manual Memory Retrieval

```tsx
const handleSend = async (message: string) => {
  // Retrieve relevant memories
  const relevantMemories = await memoryService.search({
    query: message,
    scope: 'thread',
    limit: 3,
  })

  // Include in context
  const context = relevantMemories
    .map(m => `${m.key}: ${m.value}`)
    .join('\n')

  const response = await chat({
    messages: [
      {
        role: 'system',
        content: `Context: ${context}`,
      },
      { role: 'user', content: message },
    ],
  })
}
```

## Memory Providers

### Local Storage (Default)

```tsx
const memoryService = new MemoryService({
  provider: 'local',
  // Uses browser localStorage
})
```

### Vector Store (Persistent)

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'memories',
})

const memoryService = new MemoryService({
  provider: 'vector-store',
  vectorStore,
})
```

### Custom Provider

```tsx
import type { MemoryProvider } from '@clarity-chat/react'

const customProvider: MemoryProvider = {
  store: async (memory) => {
    // Store in your database
  },
  retrieve: async (key, scope) => {
    // Retrieve from your database
  },
  search: async (query, scope) => {
    // Semantic search in your database
  },
}

const memoryService = new MemoryService({
  provider: customProvider,
})
```

## Memory Pruning

Automatically remove old or irrelevant memories:

```tsx
const memoryService = new MemoryService({
  provider: 'local',
  pruning: {
    enabled: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxCount: 100, // Max memories per scope
    strategy: 'lru', // Least recently used
  },
})
```

## Best Practices

1. **Scope Appropriately**: Use the right scope for each memory type
2. **Extract Automatically**: Enable automatic extraction for better UX
3. **Privacy**: Don't store sensitive PII without consent
4. **Cleanup**: Regularly prune old or irrelevant memories
5. **Semantic Search**: Use semantic search for better retrieval
6. **User Control**: Allow users to view and delete their memories

## Next Steps

- [Components API](/api/components) - View MemoryInspector component
- [Vector Stores](/guide/rag) - Use vector stores for persistent memory
- [Hooks API](/api/hooks) - Memory-related hooks
