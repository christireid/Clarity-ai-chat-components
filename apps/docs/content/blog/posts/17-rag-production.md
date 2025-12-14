# RAG in Production: What the Tutorials Don't Tell You

Your RAG demo works beautifully. Your production RAG returns garbage.

I've seen this story a dozen times. Developer follows a tutorial, builds a RAG prototype that impresses stakeholders, ships to production, and... users get irrelevant results, hallucinated answers, or worse—confidently wrong information.

The gap between RAG demo and RAG production is enormous. Let's bridge it.

---

## Why RAG Demos Deceive You

Demo conditions are nothing like production:

| Demo | Production |
|------|------------|
| Clean, curated documents | Messy, inconsistent documents |
| Known good queries | Unexpected, misspelled queries |
| No edge cases | Users actively trying to break it |
| Single user, no scale | Thousands of concurrent users |
| "It works!" latency | Sub-second latency required |

**Common demo-to-production failures:**

1. Retrieval returns irrelevant chunks
2. Latency spikes under load
3. Answers mix information from wrong documents
4. No way to debug why answers are wrong
5. Costs explode with scale

That demo query "What is our refund policy?" worked perfectly because you hand-crafted a document with exactly that phrase. Production query "can i get my money back lol" returns three random chunks and a hallucinated answer.

---

## Chunking That Actually Works

The #1 RAG mistake: fixed-size chunking.

```typescript
// DON'T: Arbitrary 500 token chunks
function badChunking(document: string): string[] {
  const tokens = tokenize(document)
  const chunks: string[] = []

  for (let i = 0; i < tokens.length; i += 500) {
    chunks.push(tokens.slice(i, i + 500).join(''))
  }

  return chunks
}
```

This creates chunks that:
- Split mid-sentence
- Separate questions from answers
- Break code blocks
- Lose context entirely

### Better: Semantic Chunking

Split on natural document boundaries:

```typescript
interface ChunkConfig {
  minSize: number       // Minimum tokens per chunk
  maxSize: number       // Maximum tokens per chunk
  overlap: number       // Token overlap between chunks
  splitOn: string[]     // Boundaries to split on
}

function semanticChunk(
  document: string,
  config: ChunkConfig = {
    minSize: 100,
    maxSize: 800,
    overlap: 50,
    splitOn: ['## ', '\n\n', '. '],
  }
): string[] {
  const chunks: string[] = []
  let currentChunk = ''

  // Split on strongest boundary first
  for (const boundary of config.splitOn) {
    const sections = document.split(boundary)

    for (const section of sections) {
      const sectionTokens = countTokens(section)

      if (countTokens(currentChunk) + sectionTokens < config.maxSize) {
        currentChunk += boundary + section
      } else {
        if (countTokens(currentChunk) >= config.minSize) {
          chunks.push(currentChunk.trim())
        }
        currentChunk = section
      }
    }
  }

  // Don't forget the last chunk
  if (countTokens(currentChunk) >= config.minSize) {
    chunks.push(currentChunk.trim())
  }

  // Add overlap
  return addOverlap(chunks, config.overlap)
}

function addOverlap(chunks: string[], overlapTokens: number): string[] {
  return chunks.map((chunk, i) => {
    if (i === 0) return chunk

    const prevChunk = chunks[i - 1]
    const prevTokens = tokenize(prevChunk)
    const overlap = prevTokens.slice(-overlapTokens).join('')

    return overlap + ' ' + chunk
  })
}
```

### Best: Hierarchical Chunking

Create parent-child relationships for better context:

```typescript
interface HierarchicalChunk {
  id: string
  content: string
  level: 'document' | 'section' | 'paragraph'
  parentId?: string
  summary?: string
  embedding: number[]
}

async function hierarchicalChunk(
  document: Document
): Promise<HierarchicalChunk[]> {
  const chunks: HierarchicalChunk[] = []

  // Document level (store summary)
  const docSummary = await summarize(document.content)
  const docChunk: HierarchicalChunk = {
    id: document.id,
    content: docSummary,
    level: 'document',
    summary: docSummary,
    embedding: await embed(docSummary),
  }
  chunks.push(docChunk)

  // Section level
  const sections = splitBySections(document.content)
  for (const section of sections) {
    const sectionId = `${document.id}-${section.index}`
    const sectionSummary = await summarize(section.content)

    chunks.push({
      id: sectionId,
      content: section.content,
      level: 'section',
      parentId: document.id,
      summary: sectionSummary,
      embedding: await embed(section.heading + ' ' + sectionSummary),
    })

    // Paragraph level
    const paragraphs = splitByParagraphs(section.content)
    for (const para of paragraphs) {
      chunks.push({
        id: `${sectionId}-${para.index}`,
        content: para.content,
        level: 'paragraph',
        parentId: sectionId,
        embedding: await embed(para.content),
      })
    }
  }

  return chunks
}
```

Now retrieval can return context: "This paragraph is from Section 2.1 of Document X, which covers [section summary]."

---

## Retrieval That Doesn't Suck

Pure vector search fails more often than you'd expect. "What's the cancellation policy?" might not match "Refunds are available within 30 days" semantically—different words, same concept.

### Hybrid Search

Combine vector similarity with keyword matching:

```typescript
interface RetrievalConfig {
  vectorWeight: number    // Weight for semantic similarity
  keywordWeight: number   // Weight for BM25/keyword match
  initialK: number        // How many to retrieve initially
  finalK: number          // How many to return after reranking
  minScore: number        // Minimum relevance score
}

async function hybridRetrieve(
  query: string,
  config: RetrievalConfig = {
    vectorWeight: 0.7,
    keywordWeight: 0.3,
    initialK: 20,
    finalK: 5,
    minScore: 0.6,
  }
): Promise<RetrievalResult[]> {
  // Vector search
  const queryEmbedding = await embed(query)
  const vectorResults = await vectorStore.search(queryEmbedding, config.initialK)

  // Keyword search (BM25)
  const keywordResults = await keywordIndex.search(query, config.initialK)

  // Combine scores
  const combined = new Map<string, { chunk: Chunk; score: number }>()

  for (const result of vectorResults) {
    combined.set(result.id, {
      chunk: result.chunk,
      score: result.score * config.vectorWeight,
    })
  }

  for (const result of keywordResults) {
    const existing = combined.get(result.id)
    if (existing) {
      existing.score += result.score * config.keywordWeight
    } else {
      combined.set(result.id, {
        chunk: result.chunk,
        score: result.score * config.keywordWeight,
      })
    }
  }

  // Sort by combined score
  const sorted = Array.from(combined.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, config.initialK)

  // Rerank for final selection
  const reranked = await rerank(query, sorted.map(s => s.chunk))

  // Filter by minimum score
  return reranked
    .filter(r => r.score >= config.minScore)
    .slice(0, config.finalK)
}
```

### The Reranking Secret

Initial retrieval is cheap and fast but imprecise. Reranking is expensive but accurate. Do both:

```typescript
async function rerank(
  query: string,
  chunks: Chunk[]
): Promise<RerankResult[]> {
  // Use a cross-encoder model for precise ranking
  // Options: Cohere Rerank, BGE Reranker, custom model

  const response = await cohereClient.rerank({
    model: 'rerank-english-v3.0',
    query: query,
    documents: chunks.map(c => c.content),
    top_n: chunks.length,
  })

  return response.results.map((result, i) => ({
    chunk: chunks[result.index],
    score: result.relevance_score,
  }))
}
```

### Know When to Say "I Don't Know"

The most important RAG feature: admitting ignorance.

```typescript
async function queryWithConfidence(
  query: string
): Promise<{ answer: string; confidence: 'high' | 'medium' | 'low' | 'none' }> {
  const results = await hybridRetrieve(query)

  // No relevant results
  if (results.length === 0) {
    return {
      answer: "I don't have information about that in my knowledge base.",
      confidence: 'none',
    }
  }

  // Low relevance scores
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length
  if (avgScore < 0.5) {
    return {
      answer: "I found some potentially relevant information, but I'm not confident it answers your question. Here's what I found: ...",
      confidence: 'low',
    }
  }

  // Good results - generate answer
  const context = results.map(r => r.chunk.content).join('\n\n')
  const answer = await generateAnswer(query, context)

  return {
    answer,
    confidence: avgScore > 0.8 ? 'high' : 'medium',
  }
}
```

---

## Debugging RAG

When users report "the chatbot gave me wrong information," you need to understand *why*.

Essential observability:

```typescript
interface RAGTrace {
  query: string
  queryEmbedding: number[]
  retrievedChunks: {
    id: string
    content: string
    score: number
    source: string
  }[]
  contextSentToLLM: string
  llmResponse: string
  totalLatency: number
  retrievalLatency: number
  generationLatency: number
  timestamp: Date
}

async function queryWithTracing(query: string): Promise<{
  answer: string
  trace: RAGTrace
}> {
  const startTime = Date.now()
  const trace: Partial<RAGTrace> = {
    query,
    timestamp: new Date(),
  }

  // Retrieval
  const retrievalStart = Date.now()
  const queryEmbedding = await embed(query)
  const results = await hybridRetrieve(query)
  trace.retrievalLatency = Date.now() - retrievalStart
  trace.queryEmbedding = queryEmbedding
  trace.retrievedChunks = results.map(r => ({
    id: r.chunk.id,
    content: r.chunk.content,
    score: r.score,
    source: r.chunk.sourceDocument,
  }))

  // Generation
  const context = formatContext(results)
  trace.contextSentToLLM = context

  const generationStart = Date.now()
  const answer = await generateAnswer(query, context)
  trace.generationLatency = Date.now() - generationStart
  trace.llmResponse = answer

  trace.totalLatency = Date.now() - startTime

  // Store trace for debugging
  await traceStore.save(trace as RAGTrace)

  return { answer, trace: trace as RAGTrace }
}
```

Build a debug UI for your team:

```tsx
function RAGDebugPanel({ trace }: { trace: RAGTrace }) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <h3 className="font-medium">Query</h3>
        <p className="text-sm">{trace.query}</p>
      </div>

      <div>
        <h3 className="font-medium">Retrieved Chunks ({trace.retrievedChunks.length})</h3>
        {trace.retrievedChunks.map((chunk, i) => (
          <div key={chunk.id} className="border-l-2 pl-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Score: {chunk.score.toFixed(3)}</span>
              <span>Source: {chunk.source}</span>
            </div>
            <p className="text-sm">{chunk.content.slice(0, 200)}...</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="font-medium">Timing</h3>
        <p className="text-sm">
          Retrieval: {trace.retrievalLatency}ms |
          Generation: {trace.generationLatency}ms |
          Total: {trace.totalLatency}ms
        </p>
      </div>
    </div>
  )
}
```

Now when a user reports a bad answer, you can trace exactly what happened: what was retrieved, what scores they had, what context was sent to the LLM, and where it went wrong.

---

## Scaling Considerations

RAG at scale brings new challenges:

### Vector Database Selection

| Database | Best For | Latency | Cost |
|----------|----------|---------|------|
| Pinecone | Managed, production | <50ms | $$ |
| Qdrant | Self-hosted, flexible | <20ms | $ |
| Weaviate | Hybrid search native | <30ms | $$ |
| Chroma | Development, prototyping | <10ms | Free |
| pgvector | PostgreSQL native | <100ms | $ |

### Production Checklist

- [ ] Index updates don't block queries
- [ ] Graceful degradation if vector DB is down
- [ ] Caching for repeated queries
- [ ] Rate limiting per user
- [ ] Monitoring for retrieval quality
- [ ] Automatic reindexing when documents update
- [ ] Backup and disaster recovery

---

## The Takeaway

RAG in production is nothing like RAG in tutorials. The difference:

1. **Chunking matters enormously** — Semantic or hierarchical beats fixed-size
2. **Hybrid search beats pure vector** — Combine semantic + keyword
3. **Reranking improves quality** — Two-stage retrieval
4. **Know when to say "I don't know"** — Filter by confidence
5. **Observability is non-negotiable** — You need to debug bad answers

Don't ship a demo as production. The failure modes will embarrass you.

---

*Clarity Chat's RAG components include intelligent chunking, hybrid search, reranking, confidence scoring, and the VectorStoreViewer for debugging. Skip the months of production hardening. [See the RAG docs →](/docs/rag)*
