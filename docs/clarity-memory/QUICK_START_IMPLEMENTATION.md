# Quick Start Implementation Guide

This guide helps you get started implementing Clarity Memory immediately.

## 🚀 Prerequisites

- Node.js 18+ and npm/pnpm/yarn
- TypeScript knowledge
- Basic understanding of embeddings and vector search

## 📁 Project Structure

The project structure is already set up:

```
packages/memory/
├── src/
│   ├── core/
│   │   └── memory.ts          # Main Memory class (skeleton)
│   ├── types/
│   │   └── index.ts            # All type definitions ✅
│   ├── stores/                 # Storage adapters (to be created)
│   ├── embeddings/             # Embedding providers (to be created)
│   ├── scoring/                # Scoring system (to be created)
│   ├── context/                # Context engine (to be created)
│   ├── compression/            # Compression pipeline (to be created)
│   └── index.ts                # Main entry point ✅
├── package.json                # ✅
├── tsconfig.json               # ✅
└── README.md                   # ✅
```

## 🎯 Step 1: Implement In-Memory Store (Day 1)

Create the first storage adapter:

**File**: `packages/memory/src/stores/in-memory.ts`

```typescript
import type { MemoryItem, MemoryStore, SearchResult, SearchOptions, StoreStats } from '../types'

export class InMemoryStore implements MemoryStore {
  private memories: Map<string, MemoryItem> = new Map()

  async init(): Promise<void> {
    // Nothing to initialize for in-memory store
  }

  async add(item: MemoryItem): Promise<void> {
    this.memories.set(item.id, item)
  }

  async get(id: string): Promise<MemoryItem | null> {
    return this.memories.get(id) || null
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResult[]> {
    // Simple text search for now (will be enhanced with embeddings later)
    const results: SearchResult[] = []
    const queryLower = query.toLowerCase()
    
    for (const memory of this.memories.values()) {
      if (memory.content.toLowerCase().includes(queryLower)) {
        results.push({
          memory,
          score: 1.0, // Placeholder
          scoreBreakdown: {
            score: 1.0,
            recency: 1.0,
            frequency: 1.0,
            relevance: 1.0,
            importance: memory.importance,
            timestamp: new Date(),
          },
        })
      }
    }
    
    // Sort by score
    results.sort((a, b) => b.score - a.score)
    
    // Apply limit
    const limit = options?.limit || 10
    return results.slice(0, limit)
  }

  async update(id: string, updates: Partial<MemoryItem>): Promise<void> {
    const existing = this.memories.get(id)
    if (!existing) {
      throw new Error(`Memory ${id} not found`)
    }
    this.memories.set(id, { ...existing, ...updates })
  }

  async delete(id: string): Promise<void> {
    this.memories.delete(id)
  }

  async getAll(): Promise<MemoryItem[]> {
    return Array.from(this.memories.values())
  }

  async clear(): Promise<void> {
    this.memories.clear()
  }

  async stats(): Promise<StoreStats> {
    const memories = Array.from(this.memories.values())
    return {
      totalMemories: memories.length,
      totalTokens: memories.reduce((sum, m) => sum + (m.tokens || 0), 0),
      oldestMemory: memories.length > 0 
        ? memories.reduce((oldest, m) => m.timestamp < oldest.timestamp ? m : oldest).timestamp
        : undefined,
      newestMemory: memories.length > 0
        ? memories.reduce((newest, m) => m.timestamp > newest.timestamp ? m : newest).timestamp
        : undefined,
      averageImportance: memories.length > 0
        ? memories.reduce((sum, m) => sum + m.importance, 0) / memories.length
        : 0,
    }
  }

  async close(): Promise<void> {
    this.memories.clear()
  }
}
```

## 🎯 Step 2: Implement Basic Memory Class (Day 2-3)

Update `packages/memory/src/core/memory.ts` to use the store:

```typescript
import { InMemoryStore } from '../stores/in-memory'
import type { MemoryItem, MemoryConfig, SearchResult, ContextBundle, CompressionResult, SummarizationResult, StoreStats } from '../types'
import { MemoryError, MemoryErrorCodes } from '../types'
import { v4 as uuidv4 } from 'uuid'

export class Memory {
  private config: MemoryConfig
  private store: InMemoryStore
  
  constructor(config: MemoryConfig = {}) {
    this.config = this.normalizeConfig(config)
    this.store = new InMemoryStore()
  }
  
  private normalizeConfig(config: MemoryConfig): MemoryConfig {
    return {
      context: config.context || 'default',
      embedding: {
        provider: 'openai',
        model: 'text-embedding-3-small',
        cache: true,
        ...config.embedding,
      },
      store: {
        type: 'in-memory',
        ...config.store,
      },
      // ... rest of defaults
    }
  }
  
  async init(): Promise<void> {
    await this.store.init()
  }
  
  async add(
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<MemoryItem> {
    if (!content || typeof content !== 'string') {
      throw new MemoryError('Content must be a non-empty string', MemoryErrorCodes.INVALID_CONFIG)
    }
    
    const item: MemoryItem = {
      id: uuidv4(),
      content,
      timestamp: new Date(),
      lastAccessed: new Date(),
      accessCount: 0,
      importance: 0.5, // Default importance
      metadata,
    }
    
    await this.store.add(item)
    return item
  }
  
  async recall(
    query: string,
    options?: {
      limit?: number
      minScore?: number
      includeSummary?: boolean
    }
  ): Promise<{
    memories: MemoryItem[]
    tokens: number
    summary?: string
  }> {
    if (!query || typeof query !== 'string') {
      throw new MemoryError('Query must be a non-empty string', MemoryErrorCodes.INVALID_CONFIG)
    }
    
    const results = await this.store.search(query, {
      limit: options?.limit || 10,
      minScore: options?.minScore,
    })
    
    const memories = results.map(r => r.memory)
    
    // Update access counts
    for (const memory of memories) {
      await this.store.update(memory.id, {
        lastAccessed: new Date(),
        accessCount: memory.accessCount + 1,
      })
    }
    
    // Simple token estimation (rough: 1 token ≈ 4 characters)
    const tokens = memories.reduce((sum, m) => sum + Math.ceil(m.content.length / 4), 0)
    
    return {
      memories,
      tokens,
    }
  }
  
  // ... rest of methods
}
```

## 🎯 Step 3: Add UUID Dependency (Day 3)

```bash
cd packages/memory
npm install uuid
npm install --save-dev @types/uuid
```

## 🎯 Step 4: Write First Test (Day 4)

Create `packages/memory/src/core/memory.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { clarityMemory } from './memory'

describe('Memory', () => {
  let memory: ReturnType<typeof clarityMemory>

  beforeEach(async () => {
    memory = clarityMemory()
    await memory.init()
  })

  it('should add a memory', async () => {
    const item = await memory.add('User likes pizza')
    expect(item.content).toBe('User likes pizza')
    expect(item.id).toBeDefined()
  })

  it('should recall memories', async () => {
    await memory.add('User likes pizza')
    await memory.add('User works as a software engineer')
    
    const result = await memory.recall('pizza')
    expect(result.memories.length).toBeGreaterThan(0)
    expect(result.memories[0].content).toContain('pizza')
  })

  it('should update access count on recall', async () => {
    const item = await memory.add('Test memory')
    const initialCount = item.accessCount
    
    await memory.recall('test')
    const updated = await memory.recall('test')
    
    // Access count should have increased
    expect(updated.memories[0].accessCount).toBeGreaterThan(initialCount)
  })
})
```

## 🎯 Step 5: Run Tests (Day 4)

```bash
npm test
```

## 📋 Next Steps

Once you have basic add/recall working:

1. **Add Embeddings** (Week 2)
   - Implement OpenAI embedder
   - Update search to use vector similarity

2. **Add Scoring** (Week 3)
   - Implement recency/frequency/relevance scorers
   - Update search results with proper scoring

3. **Add Context Engine** (Week 4)
   - Implement token counting
   - Implement context bundling

4. **Add More Storage Adapters** (Week 5)
   - File storage
   - IndexedDB (browser)

See [IMPLEMENTATION_ROADMAP.md](./IMPLEMENTATION_ROADMAP.md) for the full plan.

## 🐛 Common Issues

### Issue: TypeScript errors
**Solution**: Make sure `tsconfig.json` is properly configured and all types are imported correctly.

### Issue: Tests not running
**Solution**: Ensure `vitest` is installed and `package.json` has the test script configured.

### Issue: UUID not found
**Solution**: Run `npm install uuid @types/uuid`.

## 📚 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [OpenAI Embeddings Guide](https://platform.openai.com/docs/guides/embeddings)

## ✅ Checklist

- [ ] In-memory store implemented
- [ ] Basic Memory class implemented
- [ ] `add()` method working
- [ ] `recall()` method working
- [ ] Tests passing
- [ ] TypeScript compiling without errors

---

**Ready to code!** Start with Step 1 and work through each step sequentially. 🚀
