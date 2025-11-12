# RAG (Retrieval-Augmented Generation) Guide

Build powerful RAG applications with Clarity Chat's vector store integrations, document loaders, and embedding providers.

## Overview

RAG combines retrieval of relevant information with generation, allowing your AI assistant to answer questions using your own data. Clarity Chat provides:

- **Vector Stores**: Pinecone, Qdrant, Weaviate, Chroma
- **Document Loaders**: PDF, Markdown, HTML, and more
- **Embeddings**: Multi-provider support (OpenAI, Cohere, etc.)
- **Reranking**: Improve retrieval quality

## Quick Start

### 1. Set Up Vector Store

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'documents',
  environment: 'us-east-1',
})
```

### 2. Load Documents

```tsx
import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const documents = await loader.load('/path/to/document.pdf')

// Split into chunks
const chunks = await loader.splitDocuments(documents, {
  chunkSize: 1000,
  chunkOverlap: 200,
})
```

### 3. Generate Embeddings

```tsx
import { OpenAIEmbeddings } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate embeddings for chunks
const vectors = await embeddings.embedDocuments(
  chunks.map(chunk => chunk.content)
)
```

### 4. Store in Vector Database

```tsx
// Store documents with embeddings
await vectorStore.addDocuments(
  chunks.map((chunk, index) => ({
    id: `chunk-${index}`,
    content: chunk.content,
    embedding: vectors[index],
    metadata: {
      source: 'document.pdf',
      page: chunk.metadata.page,
    },
  }))
)
```

### 5. Query and Retrieve

```tsx
// Generate query embedding
const queryEmbedding = await embeddings.embedQuery(userQuestion)

// Search for similar documents
const results = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 5,
  filter: { source: 'document.pdf' },
})

// Use retrieved context in chat
const context = results.map(r => r.content).join('\n\n')
const response = await chat({
  messages: [
    {
      role: 'system',
      content: `Use the following context to answer: ${context}`,
    },
    { role: 'user', content: userQuestion },
  ],
})
```

## Vector Store Providers

### Pinecone

```tsx
import { PineconeVectorStore } from '@clarity-chat/react'

const store = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'my-index',
  environment: 'us-east-1',
})
```

### Qdrant

```tsx
import { QdrantVectorStore } from '@clarity-chat/react'

const store = new QdrantVectorStore({
  url: 'https://your-cluster.qdrant.io',
  apiKey: process.env.QDRANT_API_KEY,
  collectionName: 'documents',
})
```

### Weaviate

```tsx
import { WeaviateVectorStore } from '@clarity-chat/react'

const store = new WeaviateVectorStore({
  url: 'https://your-cluster.weaviate.network',
  apiKey: process.env.WEAVIATE_API_KEY,
  className: 'Document',
})
```

### Chroma

```tsx
import { ChromaVectorStore } from '@clarity-chat/react'

const store = new ChromaVectorStore({
  url: 'http://localhost:8000',
  collectionName: 'documents',
})
```

## Document Loaders

### PDF Loader

```tsx
import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const documents = await loader.load('/path/to/file.pdf', {
  splitPages: true,
  extractImages: false,
})
```

### Markdown Loader

```tsx
import { MarkdownLoader } from '@clarity-chat/react'

const loader = new MarkdownLoader()
const documents = await loader.load('/path/to/file.md')
```

### HTML Loader

```tsx
import { HTMLLoader } from '@clarity-chat/react'

const loader = new HTMLLoader()
const documents = await loader.load('https://example.com/page', {
  extractText: true,
  removeScripts: true,
})
```

### Directory Loader

```tsx
import { DirectoryLoader } from '@clarity-chat/react'

const loader = new DirectoryLoader('/path/to/documents', {
  recursive: true,
  fileExtensions: ['.pdf', '.md', '.txt'],
})
const documents = await loader.load()
```

## Text Splitting

Split documents into chunks for better retrieval:

```tsx
import { RecursiveCharacterTextSplitter } from '@clarity-chat/react'

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
  separators: ['\n\n', '\n', ' ', ''],
})

const chunks = await splitter.splitDocuments(documents)
```

### Semantic Chunking

Use semantic chunking for better context preservation:

```tsx
import { SemanticChunker } from '@clarity-chat/react'

const chunker = new SemanticChunker({
  embeddings: new OpenAIEmbeddings({ apiKey: '...' }),
  similarityThreshold: 0.7,
})

const chunks = await chunker.chunk(documents)
```

## Embedding Providers

### OpenAI

```tsx
import { OpenAIEmbeddings } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
  model: 'text-embedding-3-large',
})
```

### Cohere

```tsx
import { CohereEmbeddings } from '@clarity-chat/react'

const embeddings = new CohereEmbeddings({
  apiKey: process.env.COHERE_API_KEY,
  model: 'embed-english-v3.0',
})
```

### Custom Provider

```tsx
import type { EmbeddingProvider } from '@clarity-chat/react'

const customEmbeddings: EmbeddingProvider = {
  embedQuery: async (text: string) => {
    const response = await fetch('/api/embeddings', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return response.json().embedding
  },
  embedDocuments: async (texts: string[]) => {
    // Batch embedding
  },
}
```

## Reranking

Improve retrieval quality with reranking:

```tsx
import { CohereReranker } from '@clarity-chat/react'

const reranker = new CohereReranker({
  apiKey: process.env.COHERE_API_KEY,
})

// Retrieve initial results
const results = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 20, // Retrieve more than needed
})

// Rerank for better relevance
const reranked = await reranker.rerank({
  query: userQuestion,
  documents: results,
  topN: 5, // Return top 5 after reranking
})
```

## Complete RAG Example

```tsx
import {
  ChatWindow,
  PineconeVectorStore,
  PDFLoader,
  OpenAIEmbeddings,
  RecursiveCharacterTextSplitter,
} from '@clarity-chat/react'

function RAGChat() {
  const [messages, setMessages] = useState([])
  
  const vectorStore = new PineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'documents',
  })
  
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const handleSend = async (question: string) => {
    // Generate query embedding
    const queryEmbedding = await embeddings.embedQuery(question)
    
    // Retrieve relevant context
    const results = await vectorStore.similaritySearch({
      query: queryEmbedding,
      topK: 5,
    })
    
    const context = results.map(r => r.content).join('\n\n')
    
    // Generate response with context
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Answer using this context: ${context}`,
          },
          { role: 'user', content: question },
        ],
      }),
    })
    
    const data = await response.json()
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  }

  return <ChatWindow messages={messages} onSendMessage={handleSend} />
}
```

## Hybrid Search

Combine keyword and semantic search:

```tsx
import { HybridSearch } from '@clarity-chat/react'

const hybridSearch = new HybridSearch({
  vectorStore,
  keywordIndex: keywordIndex, // Your keyword search index
  alpha: 0.7, // Weight for semantic vs keyword (0-1)
})

const results = await hybridSearch.search({
  query: userQuestion,
  topK: 10,
})
```

## Best Practices

1. **Chunk Size**: Use 500-1000 tokens per chunk
2. **Overlap**: 10-20% overlap between chunks
3. **Metadata**: Store source, page, timestamp in metadata
4. **Filtering**: Use metadata filters for better retrieval
5. **Reranking**: Use reranking for critical queries
6. **Hybrid Search**: Combine semantic and keyword search
7. **Context Window**: Respect model context limits
8. **Freshness**: Update vector store when documents change

## Next Steps

- [Vector Stores API](/api/vector-stores) - Complete vector store reference
- [Document Loaders API](/api/document-loaders) - All available loaders
- [Embeddings API](/api/embeddings) - Embedding providers
- [Reranking API](/api/reranking) - Reranking strategies
