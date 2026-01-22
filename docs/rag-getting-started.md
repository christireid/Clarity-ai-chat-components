# Getting Started with RAG in Clarity Chat Components

## What is RAG?

Retrieval-Augmented Generation (RAG) is a technique that enhances AI responses by retrieving relevant information from a knowledge base and using it to ground the AI's answers. This dramatically improves accuracy, reduces hallucination, and enables AI to answer questions about proprietary or recent information beyond its training data.

## Quick Start (5 minutes)

### 1. Basic RAG Pipeline

The simplest way to get started is using the `useRAGPipeline` hook:

```tsx
import { useRAGPipeline } from '@clarity-chat/react'

function MyRAGComponent() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
    reranker: 'cohere', // Optional: improves quality
  })

  const handleQuery = async (query: string) => {
    // Retrieve relevant documents
    const docs = await rag.retrieve(query, 5)

    // Use docs as context for your LLM prompt
    const context = docs.map(d => d.content).join('\n\n')

    // Send to LLM with context...
  }

  return <YourUI onQuery={handleQuery} />
}
```

### 2. Document Ingestion

Load and chunk your documents:

```tsx
import { RecursiveTextSplitter, LoaderRegistry } from '@clarity-chat/react'

// Load documents
const registry = new LoaderRegistry()
const documents = await registry.load(file) // Supports PDF, DOCX, HTML, Markdown, etc.

// Chunk for optimal retrieval
const splitter = new RecursiveTextSplitter()
const chunks = splitter.splitDocuments(documents, {
  chunkSize: 500,
  chunkOverlap: 50,
})

// Generate embeddings and upload to vector store
for (const chunk of chunks) {
  const embedding = await embeddings.embedText(chunk.content)
  await vectorStore.upsert([{
    id: chunk.id,
    values: embedding,
    metadata: { content: chunk.content, ...chunk.metadata }
  }])
}
```

### 3. Add Citations

Display sources with the SourceCitation component:

```tsx
import { SourceCitation } from '@clarity-chat/react'

function ResponseWithCitations({ sources }) {
  return (
    <div>
      <p>Your AI response here...</p>

      <SourceCitation
        sources={sources}
        variant="card"
        showConfidence
      />
    </div>
  )
}
```

## Installation

```bash
npm install @clarity-chat/react

# Install your chosen providers
npm install @pinecone-database/pinecone  # Vector store
npm install openai                        # OpenAI embeddings
npm install cohere-ai                     # Optional: Cohere reranking

# Document loaders (optional)
npm install pdfjs-dist                    # PDF support
npm install mammoth                       # DOCX support
```

## Architecture Overview

```
┌─────────────┐
│  Documents  │ (PDF, DOCX, HTML, MD, Text)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Loaders    │ Parse and extract text
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Chunking   │ Split into optimal sizes
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Embeddings  │ Convert to vectors (OpenAI, Cohere)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Vector Store │ Store and index (Pinecone, Qdrant, etc.)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Query     │ User question
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Retrieval  │ Vector search + optional BM25
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Reranking  │ Cohere/Jina for better quality (optional)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Context   │ Build prompt with retrieved docs
└──────┬──────┘
       │
       ▼
┌─────────────┐
│     LLM     │ Generate answer with citations
└─────────────┘
```

## Core Concepts

### 1. Document Loaders

Extract text from various file formats:

```tsx
import { PDFLoader, DOCXLoader, TextLoader } from '@clarity-chat/react'

const pdfLoader = new PDFLoader()
const docs = await pdfLoader.load(pdfFile, {
  maxPages: 100,
  preserveFormatting: true
})
```

**Supported formats:**
- PDF (requires `pdfjs-dist`)
- DOCX (requires `mammoth`)
- HTML
- Markdown
- JSON
- CSV
- Plain text

### 2. Text Chunking

Split documents into optimal chunks for retrieval:

```tsx
const splitter = new RecursiveTextSplitter()
const chunks = splitter.split(text, {
  chunkSize: 500,      // Target size in characters
  chunkOverlap: 50,    // Overlap for context continuity
  splitBySentence: true // Respect sentence boundaries
})
```

**Chunking strategies:**
- **Fixed**: Simple character-based splits
- **Sentence**: Respect sentence boundaries
- **Paragraph**: Respect paragraph structure
- **Balanced**: Intelligent merging for optimal size
- **Token-based**: Use with custom tokenizer

### 3. Embeddings

Convert text to vectors for semantic search:

```tsx
import { OpenAIEmbeddingProvider } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddingProvider({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-small' // Cost-effective
  // model: 'text-embedding-3-large' // Higher quality
})

const embedding = await embeddings.embedText('your text')
```

**Embedding caching** (reduce costs):

```tsx
import { useEmbeddingCache } from '@clarity-chat/react'

const { embed, stats } = useEmbeddingCache({
  provider: embeddings,
  maxSize: 1000,
})

// Cached automatically
const vector = await embed('repeated text')
console.log('Cache hit rate:', stats.hitRate)
```

### 4. Vector Stores

Store and query embeddings:

```tsx
import { createVectorStore } from '@clarity-chat/react'

const store = createVectorStore({
  provider: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'my-docs',
  environment: 'us-east1-gcp',
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
  topK: 5,
  filter: { source: 'file.pdf' }
})
```

**Supported vector stores:**
- **Pinecone**: Managed, scalable, production-ready
- **Qdrant**: Open-source, self-hosted
- **Weaviate**: GraphQL, object-based
- **Chroma**: Lightweight, prototyping

### 5. Hybrid Search

Combine keyword (BM25) and semantic search:

```tsx
import { HybridSearch, SimpleBM25Searcher } from '@clarity-chat/react'

const bm25 = new SimpleBM25Searcher(documents)
const hybrid = new HybridSearch({
  keywordSearcher: bm25,
  vectorSearcher: vectorStore,
  keywordWeight: 0.3,  // 30% keyword
  vectorWeight: 0.7,    // 70% semantic
  fusionMethod: 'rrf',  // Reciprocal Rank Fusion
})

const results = await hybrid.search('query', 10)
```

### 6. Reranking

Improve result quality with cross-encoder models:

```tsx
import { CohereReranker } from '@clarity-chat/react'

const reranker = new CohereReranker({
  apiKey: process.env.COHERE_API_KEY,
  model: 'rerank-english-v3.0'
})

const reranked = await reranker.rerank({
  query: 'user query',
  documents: searchResults,
  topK: 5
})
```

## Best Practices

### 1. Chunking

✅ **Do:**
- Use 300-800 character chunks for most content
- Add 50-100 character overlap for context continuity
- Respect sentence/paragraph boundaries
- Keep metadata with each chunk

❌ **Don't:**
- Make chunks too small (<200 chars) - loses context
- Make chunks too large (>1000 chars) - less precise retrieval
- Split mid-sentence
- Forget to track source documents

### 2. Embeddings

✅ **Do:**
- Use `text-embedding-3-small` for cost-effectiveness
- Cache embeddings to reduce API calls
- Batch embed multiple texts together
- Use same model for indexing and querying

❌ **Don't:**
- Mix embedding models (dimensions must match)
- Forget to normalize vectors (if required by your metric)
- Skip caching for repeated texts
- Embed extremely long texts (respect token limits)

### 3. Retrieval

✅ **Do:**
- Start with top 20-50 candidates
- Use hybrid search for better coverage
- Rerank final top 5-10 results
- Filter by metadata when possible
- Set minimum score thresholds

❌ **Don't:**
- Retrieve too few candidates (miss relevant docs)
- Retrieve too many (slow, noisy)
- Skip reranking for production
- Ignore result diversity (MMR)

### 4. Prompt Construction

✅ **Do:**
- Include source metadata in context
- Stay within model token limits
- Use structured format (XML/JSON)
- Truncate smartly at sentence boundaries

❌ **Don't:**
- Exceed context window
- Forget to include source references
- Mix unrelated documents
- Use vague source labels

### 5. Citations

✅ **Do:**
- Link claims to specific sources
- Show confidence scores
- Enable click-through to sources
- Display meaningful excerpts

❌ **Don't:**
- Cite entire documents (be specific)
- Hallucinate citations
- Hide sources from users
- Skip citation verification

## Common Patterns

### Pattern 1: Question Answering

```tsx
async function answerQuestion(question: string) {
  // 1. Retrieve relevant docs
  const docs = await rag.retrieve(question, 10)

  // 2. Rerank for quality
  const reranked = await reranker.rerank({
    query: question,
    documents: docs,
    topK: 5
  })

  // 3. Build context
  const context = reranked.results
    .map((r, i) => `[${i+1}] ${r.content}`)
    .join('\n\n')

  // 4. Generate answer with LLM
  const prompt = `Answer based on these sources:\n\n${context}\n\nQuestion: ${question}`
  const answer = await llm.generate(prompt)

  // 5. Return with citations
  return {
    answer,
    sources: reranked.results
  }
}
```

### Pattern 2: Document Chat

```tsx
function useDocumentChat(documentId: string) {
  const [messages, setMessages] = useState([])

  const sendMessage = async (message: string) => {
    // Filter to specific document
    const docs = await vectorStore.query({
      vector: await embed(message),
      topK: 5,
      filter: { documentId }
    })

    const context = buildContext(docs, messages) // Include chat history
    const response = await llm.generate(context + message)

    setMessages(prev => [...prev, { role: 'user', content: message }, { role: 'assistant', content: response, sources: docs }])
  }

  return { messages, sendMessage }
}
```

### Pattern 3: Semantic Search

```tsx
function SemanticSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  const search = async () => {
    const queryEmbedding = await embeddings.embedText(query)

    const results = await hybrid.search(query, 20)

    setResults(results)
  }

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={search}>Search</button>

      {results.map(result => (
        <ResultCard
          key={result.id}
          title={result.metadata.title}
          snippet={result.content}
          score={result.score}
          matchType={result.matchType} // keyword, semantic, hybrid
        />
      ))}
    </>
  )
}
```

## Next Steps

- [RAG Architecture Deep Dive](./rag-architecture.md)
- [Configuration Guide](./rag-configuration.md)
- [Evaluation & Quality](./rag-evaluation.md)
- [Production Deployment](./rag-production.md)
- [Troubleshooting](./rag-troubleshooting.md)

## Resources

- [Example: Enterprise RAG](../apps/examples/enterprise-rag)
- [Example: RAG Workbench](../apps/examples/rag-workbench-demo)
- [API Reference](./api-reference.md)
- [Performance Benchmarks](./rag-benchmarks.md)
