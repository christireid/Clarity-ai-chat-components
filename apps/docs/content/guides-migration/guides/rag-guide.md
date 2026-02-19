# RAG (Retrieval-Augmented Generation) Guide

Build powerful, robust RAG applications with Clarity Chat's comprehensive RAG infrastructure including vector stores, document loaders, embeddings, hybrid search, reranking, and evaluation tools.

## Overview

RAG combines retrieval of relevant information with generation, allowing your AI assistant to answer questions using your own data. Clarity Chat provides a complete, enterprise-grade RAG stack:

- **Document Loaders**: PDF, DOCX, Markdown, HTML, Text, JSON, CSV
- **Vector Stores**: Pinecone, Qdrant, Weaviate, Chroma
- **Embeddings**: OpenAI, Cohere, local transformers
- **Hybrid Search**: BM25 + semantic with multiple fusion algorithms
- **Reranking**: Cohere Rerank API, simple rerankers, diversity filtering
- **Evaluation**: Precision, Recall, MAP, MRR, NDCG metrics
- **Optimization**: Multi-layer caching, batching, token management

## Quick Start

### 1. Load Documents

```tsx
import { PDFLoader, DOCXLoader, RecursiveTextSplitter } from '@clarity-chat/react/internal'

// Load PDF documents
const pdfLoader = new PDFLoader()
const pdfDocs = await pdfLoader.load(pdfFile, {
  maxPages: 100,
  preserveFormatting: true,
  pageRange: '1-50'
})

// Load DOCX documents
const docxLoader = new DOCXLoader()
const docxDocs = await docxLoader.load(docxFile, {
  includeTables: true,
  splitBySections: true
})

// Split into chunks
const splitter = new RecursiveTextSplitter()
const chunks = splitter.splitDocuments([...pdfDocs, ...docxDocs], {
  chunkSize: 500,
  chunkOverlap: 50
})
```

### 2. Generate Embeddings

```tsx
import { OpenAIEmbeddingProvider } from '@clarity-chat/react/internal'

const embeddings = new OpenAIEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small', // Cost-effective
  // model: 'text-embedding-3-large', // Higher quality
})

// Embed chunks
const vectors = await embeddings.embedBatch(
  chunks.map(chunk => chunk.content)
)
```

### 3. Store in Vector Database

```tsx
import { createVectorStore } from '@clarity-chat/react/internal'

const vectorStore = createVectorStore({
  provider: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'my-docs',
  environment: 'us-east1-gcp'
})

await vectorStore.initialize()

// Upsert documents
await vectorStore.upsert(
  chunks.map((chunk, i) => ({
    id: chunk.id,
    values: vectors[i],
    metadata: {
      content: chunk.content,
      source: chunk.metadata.source,
      page: chunk.metadata.page
    }
  }))
)
```

### 4. Query with Hybrid Search + Reranking

```tsx
import { HybridSearch, SimpleBM25Searcher, CohereReranker } from '@clarity-chat/react/internal'

// Set up hybrid search
const bm25 = new SimpleBM25Searcher(chunks)
const hybridSearch = new HybridSearch({
  keywordSearcher: bm25,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,
  vectorWeight: 0.7,
  fusionMethod: 'rrf' // Reciprocal Rank Fusion
})

// Set up reranker
const reranker = new CohereReranker({
  apiKey: process.env.COHERE_API_KEY,
  model: 'rerank-english-v3.0'
})

// Query
async function search(query: string) {
  // Get candidates with hybrid search
  const candidates = await hybridSearch.search(query, 20)

  // Rerank for quality
  const reranked = await reranker.rerank({
    query,
    documents: candidates,
    topK: 5
  })

  return reranked.results
}
```

### 5. Evaluate Quality

```tsx
import { RAGEvaluator, TestSetBuilder } from '@clarity-chat/react/internal'

// Build test set
const testSet = new TestSetBuilder()
  .addTestCase('What is machine learning?', ['doc1', 'doc3', 'doc5'])
  .addTestCase('How does deep learning work?', ['doc2', 'doc4'])
  .build()

// Evaluate
const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])
const results = await evaluator.evaluate(search)

console.log(`MAP: ${results.map.toFixed(3)}`)
console.log(`MRR: ${results.mrr.toFixed(3)}`)
console.log(`Precision@5: ${results.precision[5].toFixed(3)}`)
console.log(`Recall@5: ${results.recall[5].toFixed(3)}`)
```

## Document Loaders

### PDF Loader (NEW)

Load and parse PDF files with full metadata support:

```tsx
import { PDFLoader } from '@clarity-chat/react/internal'

const loader = new PDFLoader()
const docs = await loader.load(pdfFile, {
  maxPages: 100,              // Limit pages
  preserveFormatting: true,   // Keep structure
  pageRange: '1-10,15,20-25', // Specific pages
  password: 'optional-pwd'    // For encrypted PDFs
})

// Each doc has:
// - content: extracted text
// - metadata: { source, page, totalPages, ... }
```

**Setup Required:**
```bash
npm install pdfjs-dist
```

### DOCX Loader (NEW)

Load Microsoft Word documents:

```tsx
import { DOCXLoader } from '@clarity-chat/react/internal'

const loader = new DOCXLoader()
const docs = await loader.load(docxFile, {
  preserveFormatting: true,  // Keep structure
  includeTables: true,       // Extract tables
  includeHeaders: true,      // Headers/footers
  splitBySections: true,     // Split by headings
  outputMarkdown: true       // Convert to Markdown
})
```

**Setup Required:**
```bash
npm install mammoth
```

### Other Loaders

```tsx
import {
  TextLoader,
  HTMLLoader,
  MarkdownLoader,
  JSONLoader,
  CSVLoader,
  LoaderRegistry
} from '@clarity-chat/react/internal'

// Auto-detect format
const registry = new LoaderRegistry()
const docs = await registry.load(anyFile)
```

## Text Splitting

### Recursive Text Splitter

```tsx
import { RecursiveTextSplitter } from '@clarity-chat/react/internal'

const splitter = new RecursiveTextSplitter()
const chunks = splitter.split(text, {
  chunkSize: 500,      // Target size
  chunkOverlap: 50,    // Overlap for context
  separators: ['\n\n', '\n', ' ', '']
})

// Or split documents
const docChunks = splitter.splitDocuments(documents, {
  chunkSize: 500,
  chunkOverlap: 50
})
```

**Chunking Strategies:**
- `fixed`: Simple character-based
- `sentence`: Respect sentence boundaries
- `paragraph`: Respect paragraph structure
- `balanced`: Intelligent merging (default)

## Vector Stores

### Unified Interface

```tsx
import { createVectorStore } from '@clarity-chat/react/internal'

const store = createVectorStore({
  provider: 'pinecone', // or 'qdrant', 'weaviate', 'chroma'
  apiKey: process.env.API_KEY,
  indexName: 'my-index',
  // Provider-specific config...
})

await store.initialize()

// Upsert vectors
await store.upsert([{
  id: 'doc-1',
  values: embedding,
  metadata: { text: 'content', source: 'file.pdf' }
}])

// Query
const results = await store.query({
  vector: queryEmbedding,
  topK: 10,
  filter: { source: 'file.pdf' },
  minScore: 0.7
})
```

### Provider Comparison

| Provider | Hosting | Scale | Best For |
|----------|---------|-------|----------|
| **Pinecone** | Managed | Excellent | Production, no-ops |
| **Qdrant** | Both | Excellent | Flexibility, self-hosted |
| **Weaviate** | Both | Good | GraphQL, objects |
| **Chroma** | Self | Basic | Prototyping, local dev |

## Embeddings

### OpenAI Embeddings

```tsx
import { OpenAIEmbeddingProvider } from '@clarity-chat/react/internal'

const embeddings = new OpenAIEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small' // $0.02/1M tokens
  // model: 'text-embedding-3-large' // $0.13/1M, higher quality
})

// Single embedding
const vector = await embeddings.embedText('text')

// Batch (more efficient)
const vectors = await embeddings.embedBatch(['text1', 'text2', 'text3'])
```

### Cohere Embeddings

```tsx
import { CohereEmbeddingProvider } from '@clarity-chat/react/internal'

const embeddings = new CohereEmbeddingProvider({
  apiKey: process.env.COHERE_API_KEY,
  model: 'embed-english-v3.0'
})
```

### Embedding Cache

Reduce costs with caching:

```tsx
import { useEmbeddingCache } from '@clarity-chat/react/internal'

const { embed, stats } = useEmbeddingCache({
  provider: embeddings,
  maxSize: 1000
})

const vector = await embed('text') // Cached automatically
console.log('Hit rate:', stats.hitRate)
```

## Hybrid Search

Combine keyword (BM25) and semantic search:

```tsx
import { HybridSearch, SimpleBM25Searcher } from '@clarity-chat/react/internal'

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
- **RRF**: Reciprocal Rank Fusion (robust, rank-based)
- **Weighted**: Direct score combination
- **Linear**: Simple averaging
- **DBSF**: Distribution-Based Score Fusion (z-score)

## Reranking

### Cohere Rerank (Production)

Improve retrieval quality with cross-encoder models:

```tsx
import { CohereReranker } from '@clarity-chat/react/internal'

const reranker = new CohereReranker({
  apiKey: process.env.COHERE_API_KEY,
  model: 'rerank-english-v3.0', // or 'rerank-multilingual-v3.0'
  maxRetries: 3
})

const reranked = await reranker.rerank({
  query: 'user query',
  documents: searchResults,
  topK: 5
})

// Typical improvement: +10-30% accuracy
// Cost: $2 per 1,000 requests
```

### Simple Reranker (Free)

Basic TF-IDF reranking:

```tsx
import { SimpleReranker } from '@clarity-chat/react/internal'

const reranker = new SimpleReranker()
const reranked = await reranker.rerank({
  query: 'query',
  documents: results,
  topK: 5
})
```

### Diversity Reranker

Maximize result diversity:

```tsx
import { DiversityReranker } from '@clarity-chat/react/internal'

const reranker = new DiversityReranker(0.8) // similarity threshold
const reranked = await reranker.rerank({
  query: 'query',
  documents: results,
  topK: 10
})
```

## Evaluation

### Measure Quality

```tsx
import { RAGEvaluator, TestSetBuilder } from '@clarity-chat/react/internal'

// 1. Build test set
const testSet = new TestSetBuilder()
  .addTestCase('query 1', ['relevant_doc_1', 'relevant_doc_2'])
  .addTestCase('query 2', ['relevant_doc_3'])
  .build()

// 2. Evaluate
const evaluator = new RAGEvaluator(testSet, [1, 3, 5, 10])
const results = await evaluator.evaluate(retrievalFunction)

// 3. View metrics
console.log(`MAP: ${results.map}`) // Mean Average Precision
console.log(`MRR: ${results.mrr}`) // Mean Reciprocal Rank
console.log(`Precision@5: ${results.precision[5]}`)
console.log(`Recall@5: ${results.recall[5]}`)
console.log(`NDCG@10: ${results.ndcg[10]}`)

// 4. Print report
console.log(RAGEvaluator.formatReport(results))
```

### Metrics Reference

| Metric | Range | Meaning |
|--------|-------|---------|
| **Precision@K** | 0-1 | Quality of top K results |
| **Recall@K** | 0-1 | Coverage of relevant docs in top K |
| **F1@K** | 0-1 | Balanced precision & recall |
| **MAP** | 0-1 | Mean Average Precision (overall quality) |
| **MRR** | 0-1 | Mean Reciprocal Rank (first relevant) |
| **NDCG@K** | 0-1 | Ranking quality with graded relevance |

## Complete RAG Example

```tsx
import {
  PDFLoader,
  RecursiveTextSplitter,
  OpenAIEmbeddingProvider,
  createVectorStore,
  HybridSearch,
  SimpleBM25Searcher,
  CohereReranker
} from '@clarity-chat/react/internal'

async function buildRAGSystem() {
  // 1. Load documents
  const loader = new PDFLoader()
  const docs = await loader.load(pdfFile)

  // 2. Chunk
  const splitter = new RecursiveTextSplitter()
  const chunks = splitter.splitDocuments(docs, {
    chunkSize: 500,
    chunkOverlap: 50
  })

  // 3. Embed
  const embeddings = new OpenAIEmbeddingProvider({
    apiKey: process.env.OPENAI_API_KEY,
    model: 'text-embedding-3-small'
  })

  const vectors = await embeddings.embedBatch(
    chunks.map(c => c.content)
  )

  // 4. Index
  const vectorStore = createVectorStore({
    provider: 'pinecone',
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'docs'
  })

  await vectorStore.initialize()
  await vectorStore.upsert(
    chunks.map((chunk, i) => ({
      id: chunk.id,
      values: vectors[i],
      metadata: { content: chunk.content, ...chunk.metadata }
    }))
  )

  // 5. Set up hybrid search
  const bm25 = new SimpleBM25Searcher(chunks)
  const hybrid = new HybridSearch({
    keywordSearcher: bm25,
    vectorSearcher: vectorStore,
    fusionMethod: 'rrf'
  })

  // 6. Set up reranker
  const reranker = new CohereReranker({
    apiKey: process.env.COHERE_API_KEY
  })

  return { hybrid, reranker, embeddings }
}

async function query(userQuery: string, { hybrid, reranker, embeddings }) {
  // 1. Get candidates
  const candidates = await hybrid.search(userQuery, 20)

  // 2. Rerank
  const reranked = await reranker.rerank({
    query: userQuery,
    documents: candidates,
    topK: 5
  })

  // 3. Build context
  const context = reranked.results
    .map((r, i) => `[${i+1}] ${r.content}`)
    .join('\n\n')

  // 4. Generate response (with your LLM)
  const response = await generateWithLLM({
    prompt: `Answer based on context:\n\n${context}\n\nQuestion: ${userQuery}`
  })

  return {
    response,
    sources: reranked.results.map(r => ({
      content: r.content,
      score: r.rerankScore,
      metadata: r.metadata
    }))
  }
}
```

## Best Practices

### Chunking
- **Size**: 300-800 characters for most content
- **Overlap**: 50-100 characters for context continuity
- **Boundaries**: Respect sentence/paragraph structure
- **Metadata**: Track source, page, section

### Retrieval
- **Candidates**: Retrieve 20-50 initially
- **Rerank**: Narrow to top 5-10 with reranking
- **Hybrid**: Combine keyword + semantic for better coverage
- **Filtering**: Use metadata filters when possible

### Performance
- **Cache Embeddings**: Avoid regenerating
- **Batch Operations**: Process in batches
- **Right-size Model**: Use text-embedding-3-small for cost
- **Rerank Wisely**: Only rerank final candidates

### Quality
- **Evaluate Regularly**: Use evaluation framework
- **Track Metrics**: Monitor MAP, MRR, Precision
- **A/B Test**: Compare strategies
- **Iterate**: Continuous improvement

## Configuration Presets

### Development (Fast, Cheap)
```typescript
{
  embeddings: 'text-embedding-3-small',
  vectorStore: 'chroma', // local
  chunkSize: 500,
  retrievalK: 5,
  reranking: false,
  caching: true
}
```

### Production (Quality)
```typescript
{
  embeddings: 'text-embedding-3-large',
  vectorStore: 'pinecone',
  chunkSize: 500,
  retrievalK: 20,
  reranking: 'cohere',
  rerankTopK: 5,
  hybridSearch: true,
  caching: true
}
```

## Additional Resources

- [RAG Quick Reference](/docs/rag-quick-reference) - Fast API lookup
- [RAG Architecture](/docs/rag-architecture) - Deep dive
- [RAG Evaluation Guide](/docs/evaluation-readme) - Quality measurement
- [Vector Stores API](/api/vector-stores) - Complete reference
- [Document Loaders API](/api/document-loaders) - All loaders
