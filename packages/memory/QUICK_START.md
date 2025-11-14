# Clarity Memory - Quick Start Guide

Get up and running with Clarity Memory in under 2 minutes.

## Installation

```bash
npm install @clarity-chat/memory
# or
pnpm add @clarity-chat/memory
# or
yarn add @clarity-chat/memory
```

## 30-Second Setup

```typescript
import { clarityMemory } from '@clarity-chat/memory'

// That's it! Zero config required
const memory = clarityMemory()

// Add a memory
await memory.add("User prefers TypeScript over JavaScript")

// Recall memories
const context = await memory.recall("What does user prefer?")
console.log(context.memories) // Array of relevant memories
```

## Common Use Cases

### 1. Basic Chatbot Memory

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()

async function chat(userMessage: string) {
  // Store user message
  await memory.add(userMessage)
  
  // Get relevant context
  const context = await memory.recall(userMessage, {
    maxTokens: 2000,
  })
  
  // Use context with your LLM
  const response = await callLLM(userMessage, context.toPrompt())
  
  // Store response
  await memory.add(response)
  
  return response
}
```

### 2. User Preferences

```typescript
const memory = clarityMemory({ userId: 'user-123' })

// Store preferences
await memory.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preferences', 'ui'],
})

// Retrieve preferences
const prefs = await memory.search("user preferences", {
  types: ['semantic'],
  tags: ['preferences'],
})
```

### 3. React Integration

```typescript
import { useMemory, useMemoryRecall } from '@clarity-chat/memory'

function ChatComponent() {
  const memory = useMemory({ userId: 'user-123' })
  const { context, loading } = useMemoryRecall("user preferences", {}, memory)
  
  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      <h2>Context</h2>
      <pre>{context?.toPrompt()}</pre>
    </div>
  )
}
```

### 4. Browser Persistence (IndexedDB)

```typescript
const memory = clarityMemory({
  store: 'indexeddb', // Automatically persists in browser
  userId: 'user-123',
})
```

### 5. Node.js Persistence (File System)

```typescript
const memory = clarityMemory({
  store: 'filesystem', // Saves to .clarity-memory/memories.json
  userId: 'user-123',
})
```

### 6. With OpenAI Embeddings

```typescript
import { clarityMemory, OpenAIEmbedder } from '@clarity-chat/memory'

const memory = clarityMemory({
  embeddingProvider: new OpenAIEmbedder(process.env.OPENAI_API_KEY!),
})

// Now search uses semantic similarity!
const results = await memory.search("programming language preferences")
```

## Smart Defaults

Clarity Memory automatically detects your environment and uses the best defaults:

- **Browser**: Uses IndexedDB for persistence
- **Node.js**: Uses file system for persistence
- **Serverless**: Uses in-memory (fast, no persistence)

You can override any default:

```typescript
const memory = clarityMemory({
  store: 'memory', // Force in-memory
  maxTokens: 4000, // Smaller context window
  enableCompression: true, // Enable compression
})
```

## Helper Functions

```typescript
import {
  createSemanticMemory,
  extractTags,
  estimateImportance,
  quickSetup,
} from '@clarity-chat/memory'

// Quick setup with smart defaults
const memory = quickSetup({ userId: 'user-123' })

// Create memory with helper
const mem = createSemanticMemory("User likes TypeScript", 0.9)
await memory.add(mem.content, mem)

// Extract tags automatically
const tags = extractTags("User prefers TypeScript and React")
// ['typescript', 'react']

// Estimate importance
const importance = estimateImportance("I really love TypeScript!")
// ~0.8 (higher because of preference language)
```

## Validation & Error Handling

Clarity Memory validates inputs and provides helpful error messages:

```typescript
try {
  await memory.add("") // Empty content
} catch (error) {
  console.error(error.message)
  // "Memory content cannot be empty"
}

try {
  await memory.add("content", { importance: 2.0 }) // Invalid importance
} catch (error) {
  console.error(error.message)
  // "Importance must be between 0 and 1"
}
```

## Next Steps

- Read the [full README](./README.md) for complete API reference
- Check out [examples](./examples/) for more use cases
- See [MEMORY_DESIGN.md](./MEMORY_DESIGN.md) for architecture details

## Troubleshooting

### "IndexedDB is not available"
→ You're in Node.js. Use `store: 'filesystem'` or `store: 'memory'`

### "File system is not available"
→ You're in a browser. Use `store: 'indexeddb'` or `store: 'memory'`

### "No embedding provider configured"
→ Embeddings are optional. Only needed for semantic search. Use `MockEmbedder` for testing.

### Need Help?

- Check [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for feature status
- See [README.md](./README.md) for full documentation
- Open an issue on GitHub
