# RAG-Enabled Chat

> **Build a document Q&A system with Retrieval-Augmented Generation (RAG)**

This recipe shows how to build a chat interface that can answer questions about your documents using RAG (Retrieval-Augmented Generation).

## Prerequisites

- Vector store setup (Pinecone, Qdrant, Weaviate, or Chroma)
- Document embeddings configured
- RAG pipeline configured

## Complete Example

```tsx
import { 
  useClarityChat,
  useRAGPipeline,
  useVectorStore,
  ChatWindow,
  convertCoreMessagesToMessages 
} from '@clarity-chat/react'
import { useMemo } from 'react'

function RAGChat() {
  // Initialize vector store
  const vectorStore = useVectorStore('pinecone', {
    apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
    environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!,
    indexName: 'documents',
  })

  // Initialize RAG pipeline
  const ragPipeline = useRAGPipeline({
    vectorStore,
    embeddingProvider: 'openai',
    embeddingModel: 'text-embedding-3-small',
    reranker: 'cohere',
    topK: 5,
  })

  // Chat hook
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/chat',
    onBeforeSend: async (messages) => {
      // Retrieve relevant documents before sending to AI
      const lastMessage = messages[messages.length - 1]
      const query = lastMessage.content

      // Retrieve relevant documents
      const docs = await ragPipeline.retrieve(query)
      
      // Rerank for relevance
      const ranked = await ragPipeline.rerank(query, docs)

      // Add context to messages
      const context = ranked
        .map((doc) => `[Document ${doc.metadata.source}]: ${doc.content}`)
        .join('\n\n')

      return [
        ...messages.slice(0, -1),
        {
          ...lastMessage,
          content: `Context:\n${context}\n\nQuestion: ${query}`,
        },
      ]
    },
  })

  const messages = useMemo(
    () => convertCoreMessagesToMessages(coreMessages),
    [coreMessages]
  )

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b bg-blue-50">
        <p className="text-sm text-blue-700">
          📚 RAG-enabled: This chat can answer questions about your documents
        </p>
      </div>
      
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={async (content) => {
          await append({ role: 'user', content })
        }}
      />
    </div>
  )
}
```

## Step-by-Step Setup

### 1. Set Up Vector Store

```tsx
import { useVectorStore } from '@clarity-chat/react'

const vectorStore = useVectorStore('pinecone', {
  apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY!,
  environment: process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT!,
  indexName: 'documents',
})
```

### 2. Configure RAG Pipeline

```tsx
import { useRAGPipeline } from '@clarity-chat/react'

const ragPipeline = useRAGPipeline({
  vectorStore,
  embeddingProvider: 'openai',
  embeddingModel: 'text-embedding-3-small',
  reranker: 'cohere', // Optional but recommended
  topK: 5, // Number of documents to retrieve
})
```

### 3. Integrate with Chat

```tsx
const { messages, append } = useClarityChat({
  api: '/api/chat',
  onBeforeSend: async (messages) => {
    // Retrieve and add context
    const query = messages[messages.length - 1].content
    const docs = await ragPipeline.retrieve(query)
    const ranked = await ragPipeline.rerank(query, docs)
    
    // Add context to message
    const context = ranked.map(doc => doc.content).join('\n\n')
    return [
      ...messages.slice(0, -1),
      {
        ...messages[messages.length - 1],
        content: `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ]
  },
})
```

## Key Points

- **Vector Store**: Choose based on your needs (Pinecone for scale, Qdrant for open-source)
- **Embeddings**: Use OpenAI, Cohere, or other providers
- **Reranking**: Optional but improves relevance (Cohere, Jina, Voyage)
- **Context Injection**: Add retrieved documents to prompt before sending to AI

## Advanced: Hybrid Search

```tsx
const ragPipeline = useRAGPipeline({
  vectorStore,
  embeddingProvider: 'openai',
  searchType: 'hybrid', // Combines semantic + keyword search
  reranker: 'cohere',
})
```

## Related

- [Memory Documentation](../clarity-memory/README.md)
- [Architecture Overview](../architecture.md)
- [Example: RAG Workbench](../../apps/examples/rag-workbench-demo/)
