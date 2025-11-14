# Clarity Memory — Quick Reference
## Design Blueprint Navigation Guide

This document helps you quickly navigate the Clarity Memory design documents.

---

## 📚 Document Structure

### 1. **MEMORY_DESIGN.md** (Main Design Document)
**Location**: `/workspace/packages/memory/MEMORY_DESIGN.md`

**Contents**:
- ✅ Phase 1: Complete MemMachine analysis
- ✅ Phase 2: Clarity Memory design
- ✅ Phase 3: Implementation blueprint
- ✅ Phase 4: Integration patterns
- ✅ Phase 5: Documentation structure

**Use When**: You need complete details on any aspect of the design.

---

### 2. **CLARITY_MEMORY_EXECUTIVE_SUMMARY.md** (High-Level Overview)
**Location**: `/workspace/packages/memory/CLARITY_MEMORY_EXECUTIVE_SUMMARY.md`

**Contents**:
- Mission accomplished summary
- Key innovations
- Comparison matrix
- Implementation roadmap
- Success metrics

**Use When**: You need a quick overview or are presenting to stakeholders.

---

### 3. **DESIGN_QUICK_REFERENCE.md** (This Document)
**Location**: `/workspace/packages/memory/DESIGN_QUICK_REFERENCE.md`

**Contents**:
- Quick navigation
- Key concepts
- API cheat sheet
- Common patterns

**Use When**: You need quick answers or are implementing features.

---

## 🎯 Quick Navigation

### I Want To...

#### Understand MemMachine
→ **MEMORY_DESIGN.md** → **Phase 1: MemMachine Analysis**
- Feature map (Section 1.1)
- Architecture components (Section 1.2)
- DX audit (Section 1.4)
- Strengths & weaknesses (Sections 1.7-1.8)

#### Design the API
→ **MEMORY_DESIGN.md** → **Phase 2: Clarity Memory Design**
- Core concepts (Section 2.2)
- Clean API surface (Section 2.3)
- Complete feature set (Section 2.4)
- New enhancements (Section 2.5)

#### Implement the System
→ **MEMORY_DESIGN.md** → **Phase 3: Implementation Blueprint**
- Module layout (Section 3.1)
- Type system (Section 3.2)
- API signatures (Section 3.3)
- Multi-store adapters (Section 3.4)
- Context engine (Section 3.5)

#### Integrate with Frameworks
→ **MEMORY_DESIGN.md** → **Phase 4: Integration Patterns**
- Clarity Chat (Section 4.1)
- Standalone usage (Section 4.2)
- Serverless (Section 4.3)
- Browser apps (Section 4.4)
- Vercel AI SDK (Section 4.5)

#### Write Documentation
→ **MEMORY_DESIGN.md** → **Phase 5: Documentation & DX**
- README structure (Section 5.1)
- Tutorial structure (Section 5.2)
- Migration guide (Section 5.3)
- Code examples (Section 5.4)

---

## 🔑 Key Concepts

### Memory Types
```typescript
type MemoryType = 
  | 'episodic'    // Conversation events
  | 'semantic'    // Facts, knowledge
  | 'ephemeral'   // Temporary, TTL-based
  | 'persistent'  // Long-term, cross-session
```

### Basic Usage
```typescript
import { clarityMemory } from '@clarity-chat/memory'

const memory = clarityMemory()
await memory.add("User prefers TypeScript")
const context = await memory.recall("What does user prefer?")
```

### Configuration
```typescript
const memory = clarityMemory({
  embeddingProvider: openai('text-embedding-3-small'),
  store: 'indexeddb',
  maxTokens: 8000,
  enableCompression: true
})
```

---

## 📋 API Cheat Sheet

### Core Operations
```typescript
// Add memory
await memory.add(content, options?)

// Search memories
await memory.search(query, options?)

// Recall with context
await memory.recall(query, options?)

// Get context bundle
await memory.context(options?)

// Promote to persistent
await memory.promote(id, 'persistent')

// Forget memory
await memory.forget(id)

// Compress memories
await memory.compress(options?)

// Summarize
await memory.summarize(options?)
```

### Options
```typescript
// Add options
interface AddMemoryOptions {
  type?: MemoryType
  importance?: number // 0-1
  tags?: string[]
  metadata?: Record<string, any>
  ttl?: number
}

// Search options
interface SearchOptions {
  query: string
  types?: MemoryType[]
  tags?: string[]
  minImportance?: number
  limit?: number
  since?: Date
  until?: Date
}

// Context options
interface ContextOptions {
  maxTokens?: number
  includeSummary?: boolean
  prioritizeRecent?: boolean
  types?: MemoryType[]
}
```

---

## 🎨 Common Patterns

### Pattern 1: Basic Chat Memory
```typescript
const memory = clarityMemory()

// Store user message
await memory.add(userMessage, { type: 'episodic' })

// Get context
const context = await memory.recall(userMessage)

// Call LLM
const response = await llm.chat(context.toPrompt() + userMessage)

// Store response
await memory.add(response, { type: 'episodic' })
```

### Pattern 2: User Preferences
```typescript
const memory = clarityMemory()

// Store preference
await memory.add("User prefers dark mode", {
  type: 'semantic',
  importance: 0.9,
  tags: ['preference', 'ui']
})

// Retrieve preferences
const prefs = await memory.search("user preferences", {
  types: ['semantic'],
  tags: ['preference']
})
```

### Pattern 3: React Integration
```typescript
import { useMemory } from '@clarity-chat/memory/react'

function ChatApp() {
  const memory = useMemory({ userId: 'user-123' })
  
  const handleSend = async (message: string) => {
    const context = await memory.recall(message)
    const response = await callLLM(context.toPrompt() + message)
    await memory.add(message)
    await memory.add(response)
  }
  
  return <ChatInput onSend={handleSend} />
}
```

### Pattern 4: Serverless Function
```typescript
const memory = clarityMemory({
  store: process.env.REDIS_URL ? 'redis' : 'memory'
})

export default async function handler(req: Request) {
  const { message, userId } = await req.json()
  const context = await memory.recall(message, { userId })
  const response = await llm.generate(context.toPrompt() + message)
  await memory.add(message, { userId })
  return Response.json({ response })
}
```

---

## 🔍 Feature Comparison

### MemMachine → Clarity Memory

| MemMachine | Clarity Memory |
|-----------|----------------|
| `add_memory_episode()` | `add()` |
| `query_memory()` | `search()` / `recall()` |
| `formalize_query_with_context()` | `context().toPrompt()` |
| Profile Memory | `add()` with `type: 'semantic'` |
| Session Memory | Automatic with `sessionId` |
| Long-term Memory | Vector store backend |

---

## 📦 Store Options

### Browser
- `'memory'` - In-memory (default)
- `'indexeddb'` - IndexedDB (persistent)
- `'localstorage'` - LocalStorage (limited)

### Node.js
- `'memory'` - In-memory
- `'filesystem'` - File system
- `'redis'` - Redis
- `'postgres'` - PostgreSQL

### Vector Stores
```typescript
{
  type: 'vector',
  provider: 'pinecone' | 'qdrant' | 'weaviate' | 'chroma' | 'lancedb',
  apiKey: '...',
  index: '...'
}
```

---

## 🚀 Implementation Checklist

### Phase 1: Core
- [ ] `Memory` class
- [ ] `MemoryItem` interface
- [ ] In-memory store
- [ ] Basic CRUD operations
- [ ] Token counting

### Phase 2: Search
- [ ] Embedder interface
- [ ] OpenAI embedder
- [ ] Vector search
- [ ] Similarity calculation
- [ ] Ranking

### Phase 3: Stores
- [ ] IndexedDB store
- [ ] LocalStorage store
- [ ] File system store
- [ ] Redis store
- [ ] PostgreSQL store

### Phase 4: Advanced
- [ ] Compression strategies
- [ ] Summarization
- [ ] Importance scoring
- [ ] Context bundling
- [ ] Token budgeting

### Phase 5: Vector Stores
- [ ] Pinecone adapter
- [ ] Qdrant adapter
- [ ] Weaviate adapter
- [ ] Chroma adapter

### Phase 6: React
- [ ] `useMemory` hook
- [ ] Memory provider
- [ ] Memory inspector
- [ ] TypeScript types

### Phase 7: Docs
- [ ] README
- [ ] API docs
- [ ] Tutorials
- [ ] Migration guide
- [ ] Examples

---

## 📖 Reading Order

### For Implementers
1. **MEMORY_DESIGN.md** → Phase 3 (Implementation Blueprint)
2. **MEMORY_DESIGN.md** → Phase 2 (API Design)
3. **DESIGN_QUICK_REFERENCE.md** (This doc) → API Cheat Sheet

### For Designers
1. **CLARITY_MEMORY_EXECUTIVE_SUMMARY.md** (Overview)
2. **MEMORY_DESIGN.md** → Phase 2 (Design)
3. **MEMORY_DESIGN.md** → Phase 1 (MemMachine Analysis)

### For Documentation Writers
1. **MEMORY_DESIGN.md** → Phase 5 (Documentation)
2. **MEMORY_DESIGN.md** → Phase 4 (Integration Patterns)
3. **DESIGN_QUICK_REFERENCE.md** → Common Patterns

---

## 🎯 Key Design Decisions

### 1. Zero-Config by Default
- Works immediately with `clarityMemory()`
- No setup required
- Progressive enhancement

### 2. TypeScript First
- Full type safety
- Excellent IDE support
- Self-documenting APIs

### 3. Framework Agnostic
- Works in React, Vue, Node.js, browser, serverless
- No framework dependencies
- Adapter pattern for integrations

### 4. Token-Aware
- Built-in token management
- Automatic budget allocation
- Smart compression

### 5. Progressive Enhancement
- Start simple (in-memory)
- Add complexity as needed (vector stores)
- Never forced into complex setup

---

## 📞 Quick Links

- **Main Design**: `MEMORY_DESIGN.md`
- **Executive Summary**: `CLARITY_MEMORY_EXECUTIVE_SUMMARY.md`
- **This Reference**: `DESIGN_QUICK_REFERENCE.md`

---

*Use this document as a quick reference while implementing or reviewing the Clarity Memory design.*
