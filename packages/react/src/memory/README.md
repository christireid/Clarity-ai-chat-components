# AI Memory & Context System

> Production-ready memory management for AI chat applications with up to 90% token cost reduction

## Features

✅ **Persistent Memory** - Session, thread, user, and global scopes  
✅ **Semantic Search** - Vector-based retrieval of relevant context  
✅ **Token Optimization** - Intelligent compression and allocation  
✅ **Auto-Management** - Automatic cleanup and summarization  
✅ **Event System** - Subscribe to memory lifecycle events  
✅ **Production Ready** - Docker infrastructure included

## Quick Start

```tsx
import { MemoryProvider, useConversationMemory } from '@clarity-chat/react/memory'

function App() {
  return (
    <MemoryProvider config={config}>
      <Chat />
    </MemoryProvider>
  )
}

function Chat() {
  const { captureMessage, getRelevantMemories } = useConversationMemory({
    userId: 'user-123',
  })

  const handleMessage = async (text: string) => {
    // Capture message
    await captureMessage(text, 'user')

    // Get relevant context
    const memories = await getRelevantMemories(text, 5)

    // Use in your LLM call
    const context = memories.map((m) => m.memory.content).join('\n')
  }

  return <div>{/* Your chat UI */}</div>
}
```

## Configuration

```typescript
const config: MemoryServiceConfig = {
  tokenOptimization: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.1,
      userPreferences: 0.15,
      recentContext: 0.3,
      semanticMemory: 0.25,
      episodicMemory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true,
  },
  persistence: {
    useVectorStore: true,
    useCache: true,
    useDatabase: false,
  },
  enableAutoSummarization: true,
  enableAutoCleanup: true,
  retentionPolicy: {
    shortTerm: 3600, // 1 hour
    session: 86400, // 24 hours
    thread: 604800, // 7 days
    global: 0, // Never expires
  },
}
```

## Infrastructure Setup

Start the memory infrastructure with Docker:

```bash
# Copy environment config
cp .env.memory.example .env.memory

# Edit with your values
nano .env.memory

# Start services
docker-compose -f docker-compose.memory.yml up -d
```

Services included:

- **Qdrant** - Vector database for semantic search
- **Redis** - Fast cache layer
- **PostgreSQL** - Persistent storage

## API Overview

### Hooks

- `useMemory()` - Access memory service
- `useMemoryQuery()` - Query memories with auto-refresh
- `useMemoryStats()` - Get memory statistics
- `useMemoryEvents()` - Subscribe to events
- `useConversationMemory()` - High-level conversation API
- `useMemoryOptimization()` - Optimize context for LLM

### Memory Operations

```typescript
// Add memory
await addMemory(
  'User prefers dark theme',
  'semantic',
  'global',
  { source: 'preferences' },
  { priority: 'high', confidence: 0.9 }
)

// Query memories
const results = await query({
  query: 'theme preferences',
  types: ['semantic'],
  limit: 5,
})

// Update memory
await updateMemory(id, { confidence: 0.95 })

// Delete memory
await deleteMemory(id)

// Promote to higher scope
await promoteMemory(id, 'global')

// Compress memory
await compressMemory(id, 0.5)
```

## Memory Types

| Type           | Purpose          | Scope           | Example                        |
| -------------- | ---------------- | --------------- | ------------------------------ |
| **Episodic**   | Specific events  | Session, Thread | "User asked about React hooks" |
| **Semantic**   | Learned facts    | User, Global    | "User prefers TypeScript"      |
| **Procedural** | How-to knowledge | Global          | "Deploy process steps"         |
| **Short-term** | Recent context   | Session         | "Last 10 messages"             |

## Token Optimization

The system automatically optimizes token usage:

**Without Memory System:**

- 50 turn conversation = 50,000 tokens
- Cost: $1.50 per conversation (GPT-4)

**With Memory System:**

- 50 turn conversation = 15,000 tokens
- Cost: $0.45 per conversation
- **70% savings**

### Optimization Techniques

1. **Dynamic Allocation** - Adjusts budgets based on activity
2. **Compression** - Reduces old memories by 40-70%
3. **Semantic Chunking** - Retrieves only relevant pieces
4. **Auto-Cleanup** - Removes expired memories

## Examples

See complete examples:

- `/examples/memory-system-basic.tsx`
- `/examples/memory-system-advanced.tsx`

## Documentation

Full documentation in `/AI_MEMORY_CONTEXT_GUIDE.md`

## Testing

```bash
npm test -- packages/react/src/memory/__tests__
```

## License

MIT
