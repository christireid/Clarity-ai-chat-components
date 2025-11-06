# AI Memory & Context - Quick Start Guide

Get started with production-ready AI memory in 5 minutes.

## Prerequisites

- Node.js 18+
- Docker (optional, for infrastructure)
- OpenAI API key (for embeddings)

## Step 1: Install

```bash
npm install @clarity-chat/react
```

## Step 2: Set Up Infrastructure (Optional)

For full functionality with vector search:

```bash
# Copy environment file
cp .env.memory.example .env.memory

# Edit with your keys
OPENAI_API_KEY=sk-...
QDRANT_API_KEY=...

# Start services
docker-compose -f docker-compose.memory.yml up -d
```

Or use without infrastructure (cache-only mode):

```typescript
const config = {
  persistence: {
    useVectorStore: false,  // Disable vector store
    useCache: true,         // Use in-memory cache
    useDatabase: false,     // Disable database
  },
  // ... rest of config
}
```

## Step 3: Basic Implementation

```tsx
import React from 'react'
import {
  MemoryProvider,
  useConversationMemory,
  type MemoryServiceConfig,
} from '@clarity-chat/react/memory'

// Configure memory system
const memoryConfig: MemoryServiceConfig = {
  tokenOptimization: {
    maxContextWindow: 4096,
    allocation: {
      systemPrompt: 0.10,
      userPreferences: 0.15,
      recentContext: 0.30,
      semanticMemory: 0.25,
      episodic Memory: 0.15,
      responseReserve: 0.05,
    },
    dynamicAllocation: true,
    enableCompression: true,
    enableChunking: true,
  },
  persistence: {
    useVectorStore: false,  // Start simple
    useCache: true,
    useDatabase: false,
  },
  enableAutoSummarization: false,
  enableAutoCleanup: true,
  retentionPolicy: {
    shortTerm: 3600,
    session: 86400,
    thread: 604800,
    global: 0,
  },
}

function ChatComponent() {
  const [messages, setMessages] = React.useState([])
  const [input, setInput] = React.useState('')
  
  // Use conversation memory
  const { 
    captureMessage, 
    getRelevantMemories 
  } = useConversationMemory({
    userId: 'user-123',
    threadId: 'thread-456',
  })

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    const userMsg = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])

    // Capture in memory
    await captureMessage(input, 'user')

    // Get relevant context
    const memories = await getRelevantMemories(input, 5)
    const context = memories.map(m => m.memory.content).join('\n')

    // Call your LLM with context
    const response = await callYourLLM(input, context)
    
    // Add assistant response
    const assistantMsg = { role: 'assistant', content: response }
    setMessages(prev => [...prev, assistantMsg])

    // Capture assistant response
    await captureMessage(response, 'assistant')

    setInput('')
  }

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyPress={e => e.key === 'Enter' && handleSend()}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  )
}

// Wrap your app
export default function App() {
  return (
    <MemoryProvider config={memoryConfig}>
      <ChatComponent />
    </MemoryProvider>
  )
}
```

## Step 4: Integrate with Your LLM

### OpenAI Example

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

async function callYourLLM(userInput: string, memoryContext: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant.
        
Context from memory:
${memoryContext}`,
      },
      {
        role: 'user',
        content: userInput,
      },
    ],
  })

  return response.choices[0].message.content
}
```

### Anthropic Example

```typescript
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function callYourLLM(userInput: string, memoryContext: string) {
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    system: `You are a helpful assistant.
    
Context from memory:
${memoryContext}`,
    messages: [
      {
        role: 'user',
        content: userInput,
      },
    ],
  })

  return response.content[0].text
}
```

## Step 5: Add User Preferences

```typescript
const { capturePreference, getPreferences } = useConversationMemory()

// Capture preferences
await capturePreference('theme', 'dark')
await capturePreference('language', 'TypeScript')
await capturePreference('codeStyle', 'functional')

// Retrieve preferences
const prefs = await getPreferences()

// Use in system prompt
const systemPrompt = `You are a helpful assistant.

User Preferences:
${Object.entries(prefs)
  .map(([k, v]) => `- ${k}: ${v.memory.content}`)
  .join('\n')}
`
```

## Step 6: Enable Vector Search (Optional)

For better semantic search:

```typescript
import { QdrantVectorStore } from '@clarity-chat/react/vector-stores'
import { OpenAIEmbeddings } from '@clarity-chat/react/embeddings'

const vectorStore = new QdrantVectorStore({
  provider: 'qdrant',
  endpoint: process.env.QDRANT_URL || 'http://localhost:6333',
  indexName: 'chat-memories',
  dimension: 1536,
})

const embeddings = new OpenAIEmbeddings({
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small',
})

<MemoryProvider
  config={memoryConfig}
  vectorStore={vectorStore}
  embeddings={embeddings}
>
  <App />
</MemoryProvider>
```

## Common Use Cases

### 1. Maintain Conversation Context

```typescript
// Automatically captures all messages
await captureMessage(userInput, 'user')
await captureMessage(aiResponse, 'assistant')

// Retrieves relevant history
const history = await getRelevantMemories(currentInput, 5)
```

### 2. Store User Preferences

```typescript
// Extract and store from conversation
await capturePreference('preferredLanguage', 'Python')
await capturePreference('experienceLevel', 'intermediate')

// Use in future conversations
const prefs = await getPreferences()
```

### 3. Remember Important Facts

```typescript
// Store semantic knowledge
await addMemory(
  'User works on React applications',
  'semantic',
  'user',
  { category: 'work' },
  { priority: 'high', confidence: 0.9 }
)
```

### 4. Optimize Token Usage

```typescript
const { optimizedContext } = useTokenOptimization({
  systemPrompt: 'You are a helpful assistant.',
  userPreferences: { theme: 'dark' },
  recentMessages: messages,
  includeSemanticMemory: true,
  includeEpisodicMemory: true,
})

// Use optimized context in LLM call
// Typical savings: 60-85% token reduction
```

## Monitoring

### View Statistics

```typescript
const { stats } = useMemoryStats(5000) // Refresh every 5s

console.log({
  total: stats.total,
  tokens: stats.totalTokens,
  confidence: stats.averageConfidence,
})
```

### Listen to Events

```typescript
useMemoryEvents('memory:created', (event) => {
  console.log('New memory:', event.memory)
})

useMemoryEvents('memory:compressed', (event) => {
  console.log('Compression ratio:', event.data.compressionRatio)
})
```

## Production Checklist

- [ ] Configure retention policies for your use case
- [ ] Set up vector store for semantic search (optional)
- [ ] Enable compression for long conversations
- [ ] Implement error handling
- [ ] Add monitoring and logging
- [ ] Test with production data volumes
- [ ] Configure backup strategy
- [ ] Review security and PII handling

## Cost Savings

Expected token cost reduction:

| Scenario | Without Memory | With Memory | Savings |
|----------|---------------|-------------|---------|
| 10-turn conversation | 5,000 tokens | 2,000 tokens | 60% |
| 30-turn conversation | 20,000 tokens | 4,000 tokens | 80% |
| 50-turn conversation | 50,000 tokens | 6,000 tokens | 88% |

## Next Steps

- Read the [Full Documentation](./AI_MEMORY_CONTEXT_GUIDE.md)
- Explore [Advanced Examples](./examples/memory-system-advanced.tsx)
- Check out [Token Optimization](./packages/react/src/memory/token-optimizer.ts)
- Review [Best Practices](./AI_MEMORY_CONTEXT_GUIDE.md#best-practices)

## Troubleshooting

**Q: Memories not persisting?**  
A: Enable auto-flush or manually call `service.flushBuffer()`

**Q: High token costs?**  
A: Enable compression and reduce allocation percentages

**Q: Slow queries?**  
A: Enable caching and add database indexes

**Q: Embeddings failing?**  
A: Check API keys and rate limits, use cache

## Support

- GitHub Issues: [Report bugs](https://github.com/your-repo/issues)
- Documentation: [Full guide](./AI_MEMORY_CONTEXT_GUIDE.md)
- Examples: [Code samples](./examples/)

---

**Ready to build memory-enabled AI applications!** 🚀
