# Clarity Chat - Architecture

## System Overview

Clarity Chat uses a **monorepo architecture** with independent packages and examples, all sharing common utilities and patterns.

```
┌─────────────────────────────────────────────────────────────┐
│                     Clarity Chat Monorepo                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   CLI Tool   │  │  Core Chat   │  │  Streaming   │      │
│  │              │  │              │  │              │      │
│  │  - Commands  │  │  - Providers │  │  - SSE       │      │
│  │  - Ink UI    │  │  - Types     │  │  - Hooks     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Analytics   │  │     RAG      │  │   Examples   │      │
│  │              │  │              │  │              │      │
│  │  - Tracking  │  │  - Chunking  │  │  - Demos     │      │
│  │  - Costs     │  │  - Search    │  │  - Showcase  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Package Architecture

### CLI Package (`packages/cli/`)

**Purpose**: Beautiful command-line interface for project management

```
cli/
├── src/
│   ├── index.ts           # Entry point with commander
│   ├── commands/
│   │   ├── init.tsx       # Project initialization (Ink UI)
│   │   ├── add.tsx        # Add components
│   │   ├── dev.tsx        # Development server
│   │   ├── build.tsx      # Build project
│   │   ├── deploy.tsx     # Deployment
│   │   ├── test.tsx       # Run tests
│   │   └── config.tsx     # Configuration
│   └── components/        # Reusable Ink components
└── package.json
```

**Key Tech**:
- **Commander**: Argument parsing
- **Ink**: React for terminal UIs
- **Chalk**: Colored output
- **Ora**: Spinners

### Core Package (`packages/core/`)

**Purpose**: Shared utilities and provider abstractions

```typescript
// Provider abstraction
interface ChatProvider {
  name: string
  models: string[]
  chat(options: ChatOptions): Promise<ChatResponse>
  stream(options: ChatOptions): AsyncIterator<ChatChunk>
}

// Unified API across providers
const providers = {
  openai: new OpenAIProvider(),
  anthropic: new AnthropicProvider(),
  google: new GoogleProvider()
}
```

### Streaming Package (`packages/stream/`)

**Purpose**: Server-sent events (SSE) for real-time responses

```typescript
// Server-side streaming
export async function* streamChat(prompt: string) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    stream: true
  })

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content
    if (content) yield content
  }
}

// Client-side React hook
export function useStreamingChat() {
  const [response, setResponse] = useState('')
  
  const sendMessage = async (prompt: string) => {
    const eventSource = new EventSource(`/api/chat?prompt=${prompt}`)
    eventSource.onmessage = (event) => {
      setResponse(prev => prev + event.data)
    }
  }
  
  return { response, sendMessage }
}
```

### Analytics Package (`packages/analytics/`)

**Purpose**: Token tracking and cost calculation

```typescript
// Cost calculation
const PRICING = {
  'gpt-4-turbo': { input: 0.01, output: 0.03 },      // per 1K tokens
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'gemini-pro': { input: 0.00025, output: 0.0005 }
}

export function calculateCost(
  promptTokens: number,
  completionTokens: number,
  model: string
): number {
  const pricing = PRICING[model]
  return (promptTokens * pricing.input / 1000) + 
         (completionTokens * pricing.output / 1000)
}

// Usage tracking
export interface AnalyticsEntry {
  id: string
  timestamp: Date
  provider: 'openai' | 'anthropic' | 'google'
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  responseTime: number
}
```

### RAG Package (`packages/rag/`)

**Purpose**: Document processing and semantic search

```typescript
// Chunking algorithm
export function chunkDocument(
  content: string, 
  options = { chunkSize: 500, overlap: 50 }
): Chunk[] {
  const words = content.split(/\s+/)
  const chunks: Chunk[] = []
  
  const wordsPerChunk = Math.floor(options.chunkSize / 1.3) // ~1.3 tokens/word
  const overlapWords = Math.floor(options.overlap / 1.3)
  
  let index = 0
  while (index < words.length) {
    const end = Math.min(index + wordsPerChunk, words.length)
    const chunkText = words.slice(index, end).join(' ')
    
    chunks.push({
      id: `chunk-${chunks.length}`,
      text: chunkText,
      tokens: approximateTokenCount(chunkText),
      startIndex: index,
      endIndex: end
    })
    
    index = end - overlapWords
    if (index >= words.length - overlapWords) break
  }
  
  return chunks
}

// Semantic search (simplified)
export function searchChunks(
  query: string,
  chunks: Chunk[],
  topK: number = 3
): Chunk[] {
  // In production, use vector embeddings
  // For demo, use simple keyword matching
  const scores = chunks.map(chunk => ({
    chunk,
    score: calculateSimilarity(query, chunk.text)
  }))
  
  return scores
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.chunk)
}
```

## Example Architecture

### Model Comparison Demo

```
model-comparison-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main UI
│   │   └── api/
│   │       └── compare/route.ts        # API endpoint
│   └── lib/
│       ├── providers.ts                # Provider implementations
│       ├── scoring.ts                  # Quality scoring
│       └── cost-calc.ts                # Cost calculation
```

**Data Flow**:
```
User Input → API Route → Parallel API Calls → Aggregate Results → UI Update
                ↓
         [OpenAI, Anthropic, Google]
                ↓
         Calculate: tokens, cost, time, quality
                ↓
         Return: unified response format
```

### RAG Workbench Demo

```
rag-workbench-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Main UI
│   │   └── api/
│   │       ├── documents/route.ts      # Upload documents
│   │       ├── search/route.ts         # Search chunks
│   │       └── chat/route.ts           # RAG chat
│   └── lib/
│       ├── rag.ts                      # Chunking & search
│       └── storage.ts                  # Document storage
```

**Data Flow**:
```
Document Upload → Parse → Chunk → Store
                             ↓
User Query → Search Chunks → Get Top-K → Build Context → AI Chat
```

### Analytics Console Demo

```
analytics-console-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Dashboard UI
│   │   └── api/
│   │       └── analytics/
│   │           ├── log/route.ts        # Log entries
│   │           ├── summary/route.ts    # Summary stats
│   │           ├── daily/route.ts      # Daily breakdown
│   │           └── recent/route.ts     # Recent activity
│   ├── lib/
│   │   ├── pricing.ts                  # Cost calculation
│   │   └── storage.ts                  # Analytics storage
│   └── types/
│       └── analytics.ts                # Type definitions
```

**Data Flow**:
```
AI API Call → Log Analytics Entry → Store
                                     ↓
Dashboard → Fetch Summary → Aggregate → Display
                ↓
    Calculate: total cost, avg tokens, by provider, by model
```

## Design Patterns

### 1. Provider Pattern
Abstract AI provider differences behind unified interface:

```typescript
interface ChatProvider {
  chat(options: ChatOptions): Promise<ChatResponse>
}

// Implementation
class OpenAIProvider implements ChatProvider {
  async chat(options: ChatOptions): Promise<ChatResponse> {
    const response = await openai.chat.completions.create({...})
    return normalizeResponse(response)
  }
}
```

### 2. Streaming Pattern
Server-sent events for real-time responses:

```typescript
// Server
export async function GET(request: Request) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of generateResponse()) {
        controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
      }
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream' }
  })
}
```

### 3. Storage Abstraction
Swap storage backends easily:

```typescript
interface Storage<T> {
  get(id: string): Promise<T>
  set(id: string, value: T): Promise<void>
  list(): Promise<T[]>
  delete(id: string): Promise<void>
}

// Implementations
class MemoryStorage<T> implements Storage<T> { /*...*/ }
class PostgresStorage<T> implements Storage<T> { /*...*/ }
class RedisStorage<T> implements Storage<T> { /*...*/ }
```

## Data Models

### Chat Message
```typescript
interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
  tokens?: number
  cost?: number
}
```

### Analytics Entry
```typescript
interface AnalyticsEntry {
  id: string
  timestamp: Date
  provider: 'openai' | 'anthropic' | 'google'
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  responseTime: number
  userId?: string
  metadata?: Record<string, any>
}
```

### Document Chunk
```typescript
interface Chunk {
  id: string
  documentId: string
  text: string
  tokens: number
  startIndex: number
  endIndex: number
  embedding?: number[]  // For semantic search
}
```

## API Design

### REST Conventions
```
GET    /api/resources       # List all
GET    /api/resources/:id   # Get one
POST   /api/resources       # Create
PUT    /api/resources/:id   # Update
DELETE /api/resources/:id   # Delete
```

### Response Format
```typescript
// Success
{
  success: true,
  data: { /* resource */ },
  meta?: { /* pagination, etc */ }
}

// Error
{
  success: false,
  error: string,
  code?: string
}
```

## Next.js 15 Specifics

### Route Isolation
**Important**: Next.js 15 API routes run in isolated contexts.

```typescript
// ❌ This won't work across routes
const data = []  // In-memory storage
export async function POST(req: Request) {
  data.push(await req.json())  // Only visible to this route
}

// ✅ Use external storage instead
import { db } from './storage'
export async function POST(req: Request) {
  await db.insert(await req.json())  // Persists across routes
}
```

### Dynamic Routes
```typescript
// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Disable static optimization
export const revalidate = 0
```

## Security Considerations

### API Keys
- Store in `.env.local` (never commit)
- Access via `process.env.OPENAI_API_KEY`
- Validate on server-side only

### Input Validation
```typescript
import { z } from 'zod'

const schema = z.object({
  prompt: z.string().min(1).max(10000),
  model: z.enum(['gpt-4', 'claude-3-opus', 'gemini-pro'])
})

export async function POST(req: Request) {
  const body = await req.json()
  const validated = schema.parse(body)  // Throws if invalid
  // ... process validated data
}
```

### Rate Limiting
```typescript
// Simple in-memory rate limiter
const requests = new Map<string, number[]>()

function rateLimit(ip: string, limit: number = 10): boolean {
  const now = Date.now()
  const userRequests = requests.get(ip) || []
  const recentRequests = userRequests.filter(t => now - t < 60000) // 1 min
  
  if (recentRequests.length >= limit) return false
  
  recentRequests.push(now)
  requests.set(ip, recentRequests)
  return true
}
```

## Performance Optimization

### Parallel API Calls
```typescript
// ✅ Parallel execution
const [openaiRes, anthropicRes, googleRes] = await Promise.all([
  callOpenAI(prompt),
  callAnthropic(prompt),
  callGoogle(prompt)
])

// ❌ Sequential execution (slow)
const openaiRes = await callOpenAI(prompt)
const anthropicRes = await callAnthropic(prompt)
const googleRes = await callGoogle(prompt)
```

### Streaming for Better UX
```typescript
// Start showing results immediately
for await (const chunk of stream) {
  // Update UI incrementally
  updateUI(chunk)
}
```

### Caching
```typescript
// Cache expensive operations
const cache = new Map<string, any>()

async function getCachedResult(key: string, fn: () => Promise<any>) {
  if (cache.has(key)) return cache.get(key)
  
  const result = await fn()
  cache.set(key, result)
  return result
}
```

## Related Documents

- [Common Tasks](./common-tasks.md) - Development workflows
- [API Reference](./api-reference.md) - Complete API docs
- [Troubleshooting](./troubleshooting.md) - Common issues
- [Testing Guide](./testing-guide.md) - Testing patterns

---

**Version**: 1.0  
**Last Updated**: 2025-10-27  
**Status**: Phase 2 Complete
