# Getting Started with @clarity-chat/memory

A quick guide to get you up and running with Clarity Memory in minutes.

## Installation

```bash
npm install @clarity-chat/memory
```

## Your First Memory

Create a new file `example.ts`:

```typescript
import { clarityMemory } from '@clarity-chat/memory'

async function main() {
  // Create memory instance (zero config!)
  const mem = clarityMemory()
  
  // Add a memory
  await mem.add("User prefers TypeScript over JavaScript")
  
  // Search for it
  const results = await mem.search("programming language")
  
  console.log('Found:', results[0]?.memory.content)
  // Output: Found: User prefers TypeScript over JavaScript
}

main()
```

Run it:

```bash
npx tsx example.ts
```

That's it! You're using Clarity Memory. 🎉

## Next Steps

### 1. Add More Memories

```typescript
// Add different types of memories
await mem.add("User asked about React hooks", {
  type: 'episodic'  // Short-term conversation
})

await mem.add("User prefers dark mode", {
  type: 'semantic',  // Long-term preference
  importance: 0.9    // High importance
})

await mem.add("User is a frontend developer", {
  type: 'profile'    // User characteristic
})
```

### 2. Search Memories

```typescript
// Simple search
const results = await mem.search("user preferences")

// Filter by type
const preferences = await mem.search("preferences", {
  types: ['semantic']
})

// Filter by tags
const uiPrefs = await mem.search("UI", {
  tags: ['preferences', 'ui']
})
```

### 3. Get Context for LLM

```typescript
// Get optimized context bundle
const context = await mem.context({
  maxTokens: 1000,
  query: "user preferences"
})

// Use in your LLM call
console.log(context.text)  // Formatted context string
console.log(context.tokens) // Token count
console.log(context.memories) // Selected memories
```

### 4. Use File Storage (Node.js)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory({
  vectorStore: {
    type: 'file',
    path: './my-memories.json'
  }
})

// Memories are automatically persisted
await mem.add("This will be saved to file")
```

### 5. Use IndexedDB (Browser)

```typescript
import { clarityMemory } from '@clarity-chat/memory'

const mem = clarityMemory({
  vectorStore: {
    type: 'indexeddb',
    dbName: 'my-app-memory'
  }
})

// Memories persist in browser
await mem.add("This stays in the browser")
```

## Common Patterns

### Chatbot with Memory

```typescript
import { clarityMemory } from '@clarity-chat/memory'
import OpenAI from 'openai'

const mem = clarityMemory()
const openai = new OpenAI()

async function chat(userId: string, message: string) {
  // Get relevant context
  const context = await mem.context({
    maxTokens: 1000,
    query: message,
    filters: { userId }
  })
  
  // Call LLM
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: `Context: ${context.text}` },
      { role: 'user', content: message }
    ]
  })
  
  // Store conversation
  await mem.add(message, {
    type: 'episodic',
    metadata: { userId }
  })
  
  return response.choices[0].message.content
}
```

### User Preferences

```typescript
// Store preference
await mem.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preferences', 'ui']
})

// Later, retrieve preferences
const prefs = await mem.search("preferences", {
  types: ['semantic'],
  tags: ['preferences']
})

// Use in your app
const prefersDark = prefs.some(p => 
  p.memory.content.includes('dark mode')
)
```

### Knowledge Base

```typescript
// Store knowledge
await mem.add("API: POST /api/users creates a new user", {
  type: 'semantic',
  importance: 1.0,
  tags: ['api', 'docs']
})

// Query knowledge
const docs = await mem.search("how to create user", {
  types: ['semantic'],
  tags: ['api']
})
```

## Memory Types Explained

- **Episodic**: Recent conversations, short-term context
  - Use for: Chat history, recent interactions
  - Example: "User asked about React hooks"

- **Semantic**: Long-term facts and knowledge
  - Use for: Preferences, facts, knowledge base
  - Example: "User prefers TypeScript"

- **Profile**: User characteristics
  - Use for: User traits, demographics, roles
  - Example: "User is a frontend developer"

## Storage Options

### In-Memory (Default)
- ✅ Zero config
- ✅ Fastest
- ❌ No persistence
- Use for: Testing, development, single-session apps

### File Storage
- ✅ Simple persistence
- ✅ Works in Node.js
- ❌ Not for multi-instance
- Use for: Single-server apps, scripts

### IndexedDB
- ✅ Browser-native
- ✅ Persistent
- ❌ Browser only
- Use for: Client-side apps, PWAs

## Tips

1. **Set importance** for important memories (0.7-1.0)
2. **Use tags** for easy filtering
3. **Use metadata** for custom filtering
4. **Choose the right type** (episodic vs semantic)
5. **Set maxTokens** in context() to control LLM costs

## Troubleshooting

### "Store not initialized"
Stores initialize automatically on first use. If you see this, ensure you're awaiting async operations.

### "Memory not found"
Check that you're using the same memory instance or storage backend.

### "Token count mismatch"
Token counting is approximate. For exact counts, use your LLM's tokenizer.

## Next Steps

- Read the [full README](./README.md)
- Check out [examples](./examples/)
- See [API Reference](./API.md)

## Need Help?

- [GitHub Issues](https://github.com/christireid/Clarity-ai-chat-components/issues)
- [Documentation](../../apps/docs/)
