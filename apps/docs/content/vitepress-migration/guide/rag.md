# RAG (Retrieval-Augmented Generation)

Clarity Chat provides comprehensive RAG capabilities for building AI applications that can retrieve and use information from your documents and knowledge bases.

## Overview

RAG allows you to:
- Store documents in vector databases
- Retrieve relevant context for AI responses
- Improve answer accuracy with domain-specific knowledge
- Support multiple vector stores (Pinecone, Qdrant, Weaviate, Chroma)
- Use various embedding providers (OpenAI, Cohere)
- Rerank results for better relevance

## Installation

RAG utilities are included in `@clarity-chat/react`:

```tsx
import {
  PineconeVectorStore,
  OpenAIEmbeddings,
  PDFLoader,
  SimpleReranker,
} from '@clarity-chat/react'
```

## Quick Start

### 1. Set Up Vector Store

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY!,
  indexName: 'documents',
})
```

### 2. Set Up Embeddings

```tsx
import { OpenAIEmbeddings } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
})
```

### 3. Load Documents

```tsx
import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const documents = await loader.load(file)

// Generate embeddings
const vectors = await Promise.all(
  documents.map(async (doc) => ({
    id: doc.id,
    values: await embeddings.embedText(doc.content),
    metadata: {
      content: doc.content,
      source: doc.metadata.source,
    },
  }))
)

// Store in vector database
await vectorStore.upsert(vectors)
```

### 4. Query and Retrieve

```tsx
// Generate query embedding
const queryEmbedding = await embeddings.embedQuery('What is machine learning?')

// Retrieve relevant documents
const results = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 5,
})

// Use in AI prompt
const context = results.map(r => r.content).join('\n\n')
```

## Vector Stores

### Pinecone

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY!,
  indexName: 'documents',
  namespace: 'optional-namespace',
})
```

### Qdrant

```tsx
import { QdrantVectorStore } from '@clarity-chat/react'

const vectorStore = new QdrantVectorStore({
  url: process.env.QDRANT_URL!,
  apiKey: process.env.QDRANT_API_KEY,
  collectionName: 'documents',
})
```

### Weaviate

```tsx
import { WeaviateVectorStore } from '@clarity-chat/react'

const vectorStore = new WeaviateVectorStore({
  url: process.env.WEAVIATE_URL!,
  apiKey: process.env.WEAVIATE_API_KEY,
  className: 'Document',
})
```

### Chroma

```tsx
import { ChromaVectorStore } from '@clarity-chat/react'

const vectorStore = new ChromaVectorStore({
  url: process.env.CHROMA_URL!,
  collectionName: 'documents',
})
```

## Document Loaders

### PDF Loader

```tsx
import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const documents = await loader.load(file, {
  splitPages: true,
  extractMetadata: true,
})
```

### Markdown Loader

```tsx
import { MarkdownLoader } from '@clarity-chat/react'

const loader = new MarkdownLoader()
const documents = await loader.load(file)
```

### HTML Loader

```tsx
import { HTMLLoader } from '@clarity-chat/react'

const loader = new HTMLLoader()
const documents = await loader.load(file, {
  extractLinks: true,
  extractImages: true,
})
```

### Text Loader

```tsx
import { TextLoader } from '@clarity-chat/react'

const loader = new TextLoader()
const documents = await loader.load(file)
```

## Embeddings

### OpenAI Embeddings

```tsx
import { OpenAIEmbeddings } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
  model: 'text-embedding-3-small',
})

// Embed text
const vector = await embeddings.embedText('Hello world')

// Embed query
const queryVector = await embeddings.embedQuery('search query')

// Embed multiple texts
const vectors = await embeddings.embedTexts(['text1', 'text2'])
```

### Cohere Embeddings

```tsx
import { CohereEmbeddings } from '@clarity-chat/react'

const embeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY!,
  model: 'embed-english-v3.0',
})
```

## Text Splitting

Split long documents into chunks:

```tsx
import { RecursiveCharacterTextSplitter } from '@clarity-chat/react'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', ' ', ''],
})

const chunks = await splitter.splitText(document.content)
```

## Reranking

Improve search result relevance with reranking:

```tsx
import { SimpleReranker } from '@clarity-chat/react'

const reranker = new SimpleReranker()

// Initial search
const searchResults = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 20,
})

// Rerank for better relevance
const reranked = await reranker.rerank({
  query: 'machine learning',
  documents: searchResults,
  topK: 5,
})

console.log(reranked.results) // Top 5 most relevant
```

### Diversity Reranking

Avoid redundant results:

```tsx
import { DiversityReranker } from '@clarity-chat/react'

const reranker = new DiversityReranker(0.8) // Similarity threshold

const reranked = await reranker.rerank({
  query: 'python programming',
  documents: searchResults,
  topK: 10,
})
```

## Complete RAG Example

```tsx
import {
  ChatWindow,
  PineconeVectorStore,
  OpenAIEmbeddings,
  PDFLoader,
  SimpleReranker,
  RecursiveCharacterTextSplitter,
} from '@clarity-chat/react'
import { OpenAIAdapter } from '@clarity-chat/react'

function RAGChat() {
  const [messages, setMessages] = useState([])
  
  const vectorStore = new PineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY!,
    indexName: 'documents',
  })
  
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY!,
  })
  
  const reranker = new SimpleReranker()
  const adapter = new OpenAIAdapter({
    apiKey: process.env.OPENAI_API_KEY!,
    model: 'gpt-4',
  })

  const handleSend = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    // Generate query embedding
    const queryEmbedding = await embeddings.embedQuery(content)

    // Retrieve relevant documents
    const searchResults = await vectorStore.similaritySearch({
      query: queryEmbedding,
      topK: 20,
    })

    // Rerank for better relevance
    const reranked = await reranker.rerank({
      query: content,
      documents: searchResults,
      topK: 5,
    })

    // Build context
    const context = reranked.results
      .map(r => r.content)
      .join('\n\n')

    // Generate response with context
    const response = await adapter.complete({
      messages: [
        {
          role: 'system',
          content: `Answer questions using the following context:\n\n${context}\n\nIf the context doesn't contain the answer, say so.`,
        },
        {
          role: 'user',
          content,
        },
      ],
    })

    // Add assistant message
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response.content,
      metadata: {
        sources: reranked.results.map(r => r.metadata?.source),
      },
      timestamp: Date.now(),
    }])
  }

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={handleSend}
    />
  )
}
```

## Hybrid Search

Combine vector search with keyword search:

```tsx
// Vector search
const vectorResults = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 10,
})

// Keyword search (using your search backend)
const keywordResults = await keywordSearch(query)

// Combine and rerank
const combined = [...vectorResults, ...keywordResults]
const reranked = await reranker.rerank({
  query,
  documents: combined,
  topK: 5,
})
```

## Best Practices

1. **Chunk Size**: Use 500-1000 tokens per chunk with 10-20% overlap
2. **Top-K**: Retrieve 2-3x more results than needed, then rerank
3. **Reranking**: Always rerank for production applications
4. **Metadata**: Store source, author, date, and other metadata
5. **Namespaces**: Use namespaces for multi-tenant isolation
6. **Indexing**: Regularly update your vector index as documents change
7. **Testing**: Test with diverse queries to validate retrieval quality

## Next Steps

- Learn about [Reranking](/guide/reranking) for better search results
- Check out [Memory System](/guide/memory) for conversation context
- See [Multi-Tenancy](/guide/multi-tenancy) for tenant isolation
