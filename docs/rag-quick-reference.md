# RAG Quick Reference

Fast lookup for all RAG components, APIs, and common patterns.

## Table of Contents

- [Document Loaders](#document-loaders)
- [Embeddings](#embeddings)
- [Vector Stores](#vector-stores)
- [Retrieval & Search](#retrieval--search)
- [Reranking](#reranking)
- [Evaluation](#evaluation)
- [Common Patterns](#common-patterns)

---

## Document Loaders

### Import
```typescript
import {
  PDFLoader,
  DOCXLoader,
  TextLoader,
  HTMLLoader,
  MarkdownLoader,
  LoaderRegistry,
  RecursiveTextSplitter
} from '@clarity-chat/react/internal'
```

### PDF Loader
```typescript
const loader = new PDFLoader()
const docs = await loader.load(pdfFile, {
  maxPages: 100,
  preserveFormatting: true,
  pageRange: '1-10,15,20-25',
  password: 'optional-password'
})
```

**Setup Required:**
```bash
npm install pdfjs-dist
```
```typescript
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = '...'
(window as any).pdfjsLib = pdfjsLib
```

### DOCX Loader
```typescript
const loader = new DOCXLoader()
const docs = await loader.load(docxFile, {
  preserveFormatting: true,
  includeTables: true,
  splitBySections: true,
  outputMarkdown: true
})
```

**Setup Required:**
```bash
npm install mammoth
```

### Text Splitter
```typescript
const splitter = new RecursiveTextSplitter()
const chunks = splitter.split(text, {
  chunkSize: 500,
  chunkOverlap: 50,
  splitBySentence: true
})
```

**Chunking Strategies:**
- `fixed`: Simple character-based
- `sentence`: Respect sentence boundaries
- `paragraph`: Respect paragraph structure
- `balanced`: Intelligent merging

### Loader Registry
```typescript
const registry = new LoaderRegistry()
const docs = await registry.load(anyFile) // Auto-detects format
```

---

## Embeddings

### Import
```typescript
import {
  OpenAIEmbeddingProvider,
  CohereEmbeddingProvider,
  useEmbeddingCache
} from '@clarity-chat/react/internal'
```

### OpenAI Embeddings
```typescript
const provider = new OpenAIEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small', // or 'text-embedding-3-large'
  batchSize: 100
})

// Single embedding
const vector = await provider.embedText('text')

// Batch
const vectors = await provider.embedBatch(['text1', 'text2', 'text3'])
```

**Models:**
| Model | Dimensions | Cost/1M | Use Case |
|-------|-----------|---------|----------|
| text-embedding-3-small | 1536 | $0.02 | General, cost-effective |
| text-embedding-3-large | 3072 | $0.13 | Maximum quality |
| text-embedding-ada-002 | 1536 | $0.10 | Legacy |

### Embedding Cache
```typescript
const { embed, stats } = useEmbeddingCache({
  provider,
  maxSize: 1000
})

const vector = await embed('text') // Cached automatically
console.log('Hit rate:', stats.hitRate)
```

---

## Vector Stores

### Import
```typescript
import { createVectorStore } from '@clarity-chat/react/internal'
```

### Create Store
```typescript
const store = createVectorStore({
  provider: 'pinecone', // or 'qdrant', 'weaviate', 'chroma'
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'my-docs',
  environment: 'us-east1-gcp'
})

await store.initialize()
```

### Upsert Vectors
```typescript
await store.upsert([
  {
    id: 'doc-1',
    values: embedding,
    metadata: { text: 'content', source: 'file.pdf', page: 1 }
  }
])
```

### Query
```typescript
const results = await store.query({
  vector: queryEmbedding,
  topK: 10,
  filter: { source: 'file.pdf' },
  minScore: 0.7
})
```

**Metadata Filters:**
```typescript
filter: {
  page: { $gt: 5 },              // Greater than
  source: { $in: ['a.pdf', 'b.pdf'] }, // In list
  category: { $eq: 'technical' }  // Equals
}
```

---

## Retrieval & Search

### Import
```typescript
import {
  useVectorSearch,
  HybridSearch,
  SimpleBM25Searcher
} from '@clarity-chat/react/internal'
```

### Vector Search Hook
```typescript
const { search, stats } = useVectorSearch({
  embed: embeddings.embedText,
  retriever: vectorStore,
  k: 5,
  minScore: 0.7,
  enableDiversity: true
})

const results = await search('user query')
```

### Hybrid Search
```typescript
const bm25 = new SimpleBM25Searcher(documents)
const hybrid = new HybridSearch({
  keywordSearcher: bm25,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
  fusionMethod: 'rrf' // or 'weighted', 'linear', 'dbsf'
})

const results = await hybrid.search('query', 10)
```

**Fusion Methods:**
- `rrf`: Reciprocal Rank Fusion (robust, rank-based)
- `weighted`: Direct score combination
- `linear`: Simple averaging
- `dbsf`: Distribution-Based Score Fusion (z-score)

---

## Reranking

### Import
```typescript
import {
  CohereReranker,
  SimpleReranker,
  DiversityReranker
} from '@clarity-chat/react/internal'
```

### Cohere Rerank (Production)
```typescript
const reranker = new CohereReranker({
  apiKey: process.env.COHERE_API_KEY,
  model: 'rerank-english-v3.0', // or 'rerank-multilingual-v3.0'
  maxRetries: 3,
  timeout: 30000
})

const reranked = await reranker.rerank({
  query: 'user query',
  documents: searchResults,
  topK: 5
})
```

**Cost:** $2 per 1,000 requests
**Impact:** +10-30% accuracy improvement

**Models:**
- `rerank-english-v3.0`: Best for English
- `rerank-multilingual-v3.0`: 100+ languages
- `rerank-english-v2.0`: Legacy

### Simple Reranker (Free)
```typescript
const reranker = new SimpleReranker()
const reranked = await reranker.rerank({
  query: 'query',
  documents: results,
  topK: 5
})
```

### Diversity Reranker
```typescript
const reranker = new DiversityReranker(0.8) // similarity threshold
const reranked = await reranker.rerank({
  query: 'query',
  documents: results,
  topK: 10
})
```

---

## Evaluation

### Import
```typescript
import {
  RAGEvaluator,
  TestSetBuilder
} from '@clarity-chat/react/internal'
```

### Quick Start
```typescript
// 1. Build test set
const testSet = new TestSetBuilder()
  .addTestCase('What is ML?', ['doc1', 'doc3'])
  .addTestCase('How does DL work?', ['doc2', 'doc5'])
  .build()

// 2. Evaluate
const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])
const results = await evaluator.evaluate(retrievalFn)

// 3. View metrics
console.log(`MAP: ${results.map}`)
console.log(`MRR: ${results.mrr}`)
console.log(`P@5: ${results.precision[5]}`)
console.log(`R@5: ${results.recall[5]}`)
console.log(`NDCG@10: ${results.ndcg[10]}`)
```

### Metrics Reference
| Metric | Range | Meaning |
|--------|-------|---------|
| Precision@K | 0-1 | Quality of top K results |
| Recall@K | 0-1 | Coverage of relevant docs in top K |
| F1@K | 0-1 | Balanced P & R |
| MAP | 0-1 | Mean Average Precision (overall quality) |
| MRR | 0-1 | Mean Reciprocal Rank (first relevant) |
| NDCG@K | 0-1 | Ranking quality with graded relevance |

---

## Common Patterns

### Pattern 1: Basic RAG Pipeline
```typescript
// 1. Load & chunk document
const loader = new PDFLoader()
const docs = await loader.load(pdfFile)

const splitter = new RecursiveTextSplitter()
const chunks = splitter.splitDocuments(docs, {
  chunkSize: 500,
  chunkOverlap: 50
})

// 2. Generate embeddings
const embeddings = new OpenAIEmbeddingProvider({ apiKey })
for (const chunk of chunks) {
  const vector = await embeddings.embedText(chunk.content)
  await vectorStore.upsert([{
    id: chunk.id,
    values: vector,
    metadata: { content: chunk.content, ...chunk.metadata }
  }])
}

// 3. Query
const queryVector = await embeddings.embedText('user query')
const results = await vectorStore.query({
  vector: queryVector,
  topK: 5
})

// 4. Build context for LLM
const context = results.map(r => r.metadata.content).join('\n\n')
```

### Pattern 2: Hybrid Search with Reranking
```typescript
// 1. Hybrid search for candidates
const candidates = await hybridSearch.search('query', 20)

// 2. Rerank top 20 → top 5
const reranked = await cohereReranker.rerank({
  query: 'query',
  documents: candidates,
  topK: 5
})

// 3. Use top 5 for context
const context = reranked.results
  .map(r => r.content)
  .join('\n\n')
```

### Pattern 3: Document Chat
```typescript
async function chatWithDocument(documentId: string, userMessage: string) {
  // 1. Retrieve relevant chunks from this document
  const chunks = await vectorStore.query({
    vector: await embeddings.embedText(userMessage),
    topK: 5,
    filter: { documentId }
  })

  // 2. Build context
  const context = chunks
    .map((c, i) => `[${i+1}] ${c.metadata.content}`)
    .join('\n\n')

  // 3. Prompt with context
  const prompt = `Answer based on these excerpts:\n\n${context}\n\nQuestion: ${userMessage}`

  // 4. Generate response
  const response = await llm.generate(prompt)

  return {
    response,
    sources: chunks.map(c => ({
      url: c.metadata.source,
      page: c.metadata.page,
      excerpt: c.metadata.content.slice(0, 200)
    }))
  }
}
```

### Pattern 4: Evaluation-Driven Optimization
```typescript
// Build test set once
const testSet = new TestSetBuilder()
  .addTestCase('query 1', ['doc1', 'doc2'])
  .addTestCase('query 2', ['doc3'])
  .build()

const evaluator = new RAGEvaluator(testSet)

// Test different configurations
const configs = [
  { name: 'Baseline', chunkSize: 500, overlap: 50, k: 5 },
  { name: 'Larger Chunks', chunkSize: 1000, overlap: 100, k: 5 },
  { name: 'More Results', chunkSize: 500, overlap: 50, k: 10 },
]

for (const config of configs) {
  // Re-index with new config
  await reindexWithConfig(config)

  // Evaluate
  const results = await evaluator.evaluate(retrievalFn)

  console.log(`${config.name}: MAP=${results.map.toFixed(3)}`)
}
```

### Pattern 5: Multi-Document RAG
```typescript
async function queryMultipleDocuments(query: string, documentIds: string[]) {
  // Search across multiple documents
  const allResults = await Promise.all(
    documentIds.map(async (docId) => {
      const results = await vectorStore.query({
        vector: await embeddings.embedText(query),
        topK: 3,
        filter: { documentId: docId }
      })
      return results.map(r => ({ ...r, documentId: docId }))
    })
  )

  // Flatten and rerank
  const flat = allResults.flat()
  const reranked = await reranker.rerank({
    query,
    documents: flat,
    topK: 5
  })

  // Group by document for citations
  const byDoc = groupBy(reranked.results, r => r.metadata.documentId)

  return {
    results: reranked.results,
    documentSources: byDoc
  }
}
```

---

## Configuration Presets

### Development (Fast, Cheap)
```typescript
{
  embeddings: 'text-embedding-3-small',
  vectorStore: 'chroma', // local
  chunkSize: 500,
  chunkOverlap: 50,
  retrievalK: 5,
  reranking: false, // skip for speed
  caching: true
}
```

### Production (Quality)
```typescript
{
  embeddings: 'text-embedding-3-large',
  vectorStore: 'pinecone', // managed, scalable
  chunkSize: 500,
  chunkOverlap: 50,
  retrievalK: 20,
  reranking: 'cohere', // +15-25% quality
  rerankTopK: 5,
  caching: true,
  monitoring: true
}
```

### Enterprise (Scale + Quality)
```typescript
{
  embeddings: 'text-embedding-3-large',
  vectorStore: 'pinecone', // multi-region
  chunkSize: 500,
  chunkOverlap: 50,
  hybridSearch: true, // keyword + semantic
  retrievalK: 50,
  reranking: 'cohere-multilingual', // 100+ languages
  rerankTopK: 10,
  diversityFiltering: true, // MMR
  caching: true,
  monitoring: true,
  evaluation: true // continuous quality measurement
}
```

---

## Troubleshooting

### Low Retrieval Quality
1. Check embedding model (use 3-large for better quality)
2. Tune chunk size (try 300-800 range)
3. Add overlap (50-100 characters)
4. Use hybrid search (keyword + semantic)
5. Enable reranking (Cohere)
6. Measure with evaluation framework

### Slow Performance
1. Cache embeddings aggressively
2. Use smaller embedding model (3-small)
3. Reduce retrieval K (5-10 instead of 20+)
4. Batch operations
5. Index pre-warming
6. Check vector store latency

### High Costs
1. Cache embeddings (avoid regeneration)
2. Use text-embedding-3-small ($0.02/1M vs $0.13/1M)
3. Batch embed operations
4. Only rerank final top-K (not all candidates)
5. Cache reranking results
6. Monitor token usage

### Missing Relevant Documents
1. Increase retrieval K
2. Lower minScore threshold
3. Add query expansion
4. Use hybrid search (capture keyword matches)
5. Check document chunking (may be too large/small)
6. Verify embeddings are normalized

---

## See Also

- [Getting Started Guide](./rag-getting-started.md)
- [Architecture Deep Dive](./rag-architecture.md)
- [Audit Report](./rag-audit-report.md)
- [Remediation Summary](./rag-remediation-summary.md)
- [Evaluation README](../packages/react/src/evaluation/README.md)
