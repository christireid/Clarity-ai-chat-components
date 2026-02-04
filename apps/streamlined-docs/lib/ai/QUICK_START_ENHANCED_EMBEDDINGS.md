# Quick Start: Enhanced Embeddings

Get started with the enhanced embedding strategy in 5 minutes.

---

## 1. Basic Usage (Replace Old Code)

### Old Way ❌
```typescript
import { chunkText, generateEmbedding } from './embeddings'

const chunks = chunkText(document.content, {
  maxChunkSize: 1000,
  overlap: 200,
})

const embeddings = []
for (const chunk of chunks) {
  const embedding = await generateEmbedding(chunk)
  embeddings.push(embedding)
}
```

### New Way ✅
```typescript
import { SemanticChunker, generateEmbeddingsBatch, EMBEDDING_CONFIGS } from './embeddings-enhanced'

// 1. Create chunker
const chunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

// 2. Chunk with metadata
const chunks = chunker.chunk(document.content, {
  title: document.title,
  url: document.url,
  category: 'guide',
  tags: document.tags,
  headings: extractHeadings(document.content),
  lastUpdated: new Date().toISOString(),
})

// 3. Generate embeddings (batched!)
const embedded = await generateEmbeddingsBatch(chunks, {
  model: 'text-embedding-3-small',
  dimensions: 1536,
})

// 4. Store
await vectorStore.upsertBatch(embedded.map(chunk => ({
  id: chunk.id,
  title: chunk.metadata.title,
  content: chunk.content,
  url: chunk.metadata.url,
  category: chunk.metadata.category,
  embedding: chunk.embedding!,
  metadata: chunk.metadata,
})))
```

**Result:** Better chunking + batch processing + rich metadata

---

## 2. Choose the Right Config

```typescript
import { SemanticChunker, EMBEDDING_CONFIGS } from './embeddings-enhanced'

// For API documentation (high precision)
const apiChunker = new SemanticChunker(EMBEDDING_CONFIGS['api-reference'])

// For code examples (preserve structure)
const codeChunker = new SemanticChunker(EMBEDDING_CONFIGS.code)

// For general docs (cost-effective)
const proseChunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

// For mixed content (balanced)
const mixedChunker = new SemanticChunker(EMBEDDING_CONFIGS.mixed)
```

**Quick Guide:**
- **API docs** → `api-reference` (small chunks, large model, high precision)
- **Code examples** → `code` (large chunks, large model, preserve structure)
- **Tutorials/guides** → `prose` (medium chunks, small model, cost-effective)
- **Mixed docs** → `mixed` (medium chunks, small model, balanced)

---

## 3. Extract Headings Helper

```typescript
function extractHeadings(markdown: string): string[] {
  const headingRegex = /^#{1,6}\s+(.+)$/gm
  const headings: string[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    headings.push(match[1].trim())
  }

  return headings
}
```

---

## 4. Complete Example: Index Component Documentation

```typescript
import {
  SemanticChunker,
  generateEmbeddingsBatch,
  EMBEDDING_CONFIGS,
} from './embeddings-enhanced'
import { getVectorStore } from './vectorStore'

async function indexComponentDoc(document: {
  title: string
  content: string
  url: string
  tags: string[]
}) {
  // 1. Setup
  const chunker = new SemanticChunker(EMBEDDING_CONFIGS.mixed)
  const vectorStore = getVectorStore()
  await vectorStore.initialize()

  // 2. Extract metadata
  const headings = extractHeadings(document.content)

  // 3. Chunk
  const chunks = chunker.chunk(document.content, {
    title: document.title,
    url: document.url,
    category: 'component',
    tags: document.tags,
    headings,
    lastUpdated: new Date().toISOString(),
  })

  console.log(`Generated ${chunks.length} chunks`)

  // 4. Generate embeddings
  const embedded = await generateEmbeddingsBatch(chunks, {
    model: 'text-embedding-3-small',
    dimensions: 1536,
  })

  // 5. Store
  await vectorStore.upsertBatch(
    embedded.map(chunk => ({
      id: chunk.id,
      title: chunk.metadata.title,
      content: chunk.content,
      url: chunk.metadata.url,
      category: chunk.metadata.category,
      embedding: chunk.embedding!,
      metadata: chunk.metadata,
    }))
  )

  console.log(`✓ Indexed ${document.title}`)
}

// Usage
await indexComponentDoc({
  title: 'ChatWindow Component',
  content: '# ChatWindow\n\nThe ChatWindow component...',
  url: '/components/chat-window',
  tags: ['react', 'component', 'chat'],
})
```

---

## 5. Bulk Index Multiple Documents

```typescript
import { deduplicateChunks } from './embeddings-enhanced'

async function bulkIndex(documents: Array<{
  title: string
  content: string
  url: string
  category: 'component' | 'hook' | 'guide'
  tags: string[]
}>) {
  const allChunks = []

  // Step 1: Chunk all documents
  for (const doc of documents) {
    const config = selectConfig(doc.category)
    const chunker = new SemanticChunker(config)

    const chunks = chunker.chunk(doc.content, {
      title: doc.title,
      url: doc.url,
      category: doc.category,
      tags: doc.tags,
      headings: extractHeadings(doc.content),
      lastUpdated: new Date().toISOString(),
    })

    allChunks.push(...chunks)
  }

  console.log(`Generated ${allChunks.length} total chunks`)

  // Step 2: Deduplicate
  const unique = deduplicateChunks(allChunks)
  console.log(`Deduplicated to ${unique.length} unique chunks`)

  // Step 3: Generate embeddings in batches
  const batchSize = 100
  for (let i = 0; i < unique.length; i += batchSize) {
    const batch = unique.slice(i, i + batchSize)
    const embedded = await generateEmbeddingsBatch(batch)

    await vectorStore.upsertBatch(
      embedded.map(chunk => ({
        id: chunk.id,
        title: chunk.metadata.title,
        content: chunk.content,
        url: chunk.metadata.url,
        category: chunk.metadata.category,
        embedding: chunk.embedding!,
        metadata: chunk.metadata,
      }))
    )

    console.log(`Progress: ${Math.min(i + batchSize, unique.length)}/${unique.length}`)
  }

  console.log('✓ Bulk indexing complete')
}

function selectConfig(category: string) {
  switch (category) {
    case 'component':
    case 'hook':
      return EMBEDDING_CONFIGS['api-reference']
    case 'guide':
      return EMBEDDING_CONFIGS.prose
    default:
      return EMBEDDING_CONFIGS.mixed
  }
}
```

---

## 6. Query with Metadata Filtering

```typescript
import { generateEmbedding } from './embeddings'
import { getVectorStore } from './vectorStore'

async function smartSearch(query: string, options?: {
  maxComplexity?: number
  categories?: string[]
  requireSymbol?: string
}) {
  // Generate query embedding
  const queryEmbedding = await generateEmbedding(query)

  // Search
  const vectorStore = getVectorStore()
  await vectorStore.initialize()
  const results = await vectorStore.search(queryEmbedding, 20)

  // Filter by metadata
  let filtered = results

  if (options?.maxComplexity) {
    filtered = filtered.filter(
      r => !r.metadata.complexity || r.metadata.complexity <= options.maxComplexity
    )
  }

  if (options?.categories) {
    filtered = filtered.filter(r => options.categories!.includes(r.category))
  }

  if (options?.requireSymbol) {
    filtered = filtered.filter(r =>
      r.metadata.symbols?.some(s =>
        s.toLowerCase().includes(options.requireSymbol!.toLowerCase())
      )
    )
  }

  // Boost recent content
  filtered = filtered.map(r => ({
    ...r,
    score: r.score * getRecencyBoost(r.metadata.lastUpdated),
  }))

  // Re-sort and take top 5
  return filtered.sort((a, b) => b.score - a.score).slice(0, 5)
}

function getRecencyBoost(lastUpdated: string): number {
  const days = (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24)
  if (days < 7) return 1.1
  if (days < 30) return 1.05
  return 1.0
}

// Usage examples
// Find beginner-friendly component docs
await smartSearch('how to use ChatWindow', {
  maxComplexity: 2,
  categories: ['component'],
})

// Find specific hook
await smartSearch('state management', {
  requireSymbol: 'useChat',
  categories: ['hook'],
})
```

---

## 7. Testing Your Implementation

```typescript
import { describe, it, expect } from 'vitest'

describe('Enhanced Embeddings', () => {
  it('chunks semantically', async () => {
    const chunker = new SemanticChunker(EMBEDDING_CONFIGS.code)

    const chunks = chunker.chunk(testDocument.content, {
      title: 'Test',
      url: '/test',
      category: 'example',
      tags: [],
      headings: [],
      lastUpdated: new Date().toISOString(),
    })

    // Should preserve code blocks
    expect(chunks.some(c => c.content.includes('```'))).toBe(true)

    // Should extract symbols
    expect(chunks.some(c => c.metadata.symbols?.length > 0)).toBe(true)

    // Should be within token limits
    chunks.forEach(chunk => {
      expect(chunk.tokenCount).toBeLessThanOrEqual(1024)
    })
  })

  it('deduplicates correctly', () => {
    const duplicates = [
      createChunk('Same content'),
      createChunk('Same content'),
      createChunk('Different'),
    ]

    const unique = deduplicateChunks(duplicates)
    expect(unique).toHaveLength(2)
  })
})
```

---

## 8. Cost Estimation

```typescript
import { estimateEmbeddingCost } from './embeddings-enhanced'

function estimateIndexingCost(documents: Array<{ content: string }>) {
  let totalTokens = 0

  for (const doc of documents) {
    // Rough estimation: 4 chars per token
    totalTokens += Math.ceil(doc.content.length / 4)
  }

  const smallModelCost = estimateEmbeddingCost(totalTokens * 0.7, 'text-embedding-3-small')
  const largeModelCost = estimateEmbeddingCost(totalTokens * 0.3, 'text-embedding-3-large')

  console.log(`Estimated cost:`)
  console.log(`  Small model (70%): $${smallModelCost.toFixed(4)}`)
  console.log(`  Large model (30%): $${largeModelCost.toFixed(4)}`)
  console.log(`  Total: $${(smallModelCost + largeModelCost).toFixed(4)}`)
}
```

---

## 9. Migration Checklist

### Week 1: Testing
- [ ] Run test suite: `npm test embeddings-enhanced.test.ts`
- [ ] Index 10 sample documents with new strategy
- [ ] Compare retrieval quality with old approach
- [ ] Validate cost reduction

### Week 2: Gradual Rollout
- [ ] Index new documentation with enhanced strategy
- [ ] Keep old embeddings as fallback
- [ ] Monitor retrieval metrics
- [ ] Collect user feedback

### Week 3: Full Migration
- [ ] Re-index all documentation
- [ ] Update all import statements
- [ ] Remove legacy embeddings
- [ ] Deploy to production

### Week 4: Optimization
- [ ] Fine-tune chunk sizes based on metrics
- [ ] Adjust model selection if needed
- [ ] Implement caching for unchanged content
- [ ] Document learnings

---

## 10. Troubleshooting

### Issue: Chunks too large
```typescript
// Reduce maxChunkTokens
const config = {
  ...EMBEDDING_CONFIGS.prose,
  maxChunkTokens: 512,  // Default: 768
}
```

### Issue: Poor code retrieval
```typescript
// Use large model for code
const embedded = await generateEmbeddingsBatch(codeChunks, {
  model: 'text-embedding-3-large',
  dimensions: 1536,
})
```

### Issue: High costs
```typescript
// Deduplicate more aggressively
const unique = deduplicateChunks(allChunks)

// Use small model for more content
const proseChunker = new SemanticChunker(EMBEDDING_CONFIGS.prose)

// Cache embeddings for unchanged docs
const cacheKey = `embedding-${doc.id}-${doc.lastUpdated}`
const cached = await cache.get(cacheKey)
if (cached) return cached
```

### Issue: Missing metadata
```typescript
// Ensure all fields are provided
const chunks = chunker.chunk(content, {
  title: doc.title,                        // ✅ Required
  url: doc.url,                            // ✅ Required
  category: doc.category,                  // ✅ Required
  tags: doc.tags || [],                    // ✅ Always provide
  headings: extractHeadings(content),      // ✅ Extract from content
  lastUpdated: doc.lastUpdated || new Date().toISOString(),
})
```

---

## Resources

- **Full Documentation:** [EMBEDDING_STRATEGY.md](./EMBEDDING_STRATEGY.md)
- **Examples:** [examples/enhanced-embedding-example.ts](./examples/enhanced-embedding-example.ts)
- **Tests:** [__tests__/embeddings-enhanced.test.ts](../__tests__/embeddings-enhanced.test.ts)
- **Comparison:** [BEFORE_AFTER_COMPARISON.md](./BEFORE_AFTER_COMPARISON.md)
- **Summary:** [EMBEDDING_IMPROVEMENTS_SUMMARY.md](./EMBEDDING_IMPROVEMENTS_SUMMARY.md)

---

## Quick Command Reference

```bash
# Run tests
npm test embeddings-enhanced.test.ts

# Run examples
npx tsx lib/ai/examples/enhanced-embedding-example.ts

# Estimate costs
# (Add your documents to the script)
npx tsx lib/ai/estimate-embedding-cost.ts

# Validate implementation
npm run typecheck
npm run lint
```

---

## Need Help?

1. Check [EMBEDDING_STRATEGY.md](./EMBEDDING_STRATEGY.md) for detailed docs
2. Review [enhanced-embedding-example.ts](./examples/enhanced-embedding-example.ts) for patterns
3. Run the test suite for validation
4. Open an issue if stuck

---

**You're ready to go!** Start with the basic example above and iterate from there. The enhanced strategy is backward-compatible, so you can migrate gradually.
