# RAG-Enabled Chat

> **Build a document Q&A system with Retrieval-Augmented Generation (RAG)**

This recipe shows how to build a chat interface that can answer questions about your documents using RAG (Retrieval-Augmented Generation).

## Prerequisites

- Vector store setup (Pinecone, Qdrant, Weaviate, or Chroma)
- Document embeddings configured
- RAG pipeline configured

> **Security Note**: API keys for vector stores (Pinecone, etc.) should be kept server-side only. Use API routes to handle vector store operations securely.

## Complete Example

```tsx
import {
  useClarityChat,
  ChatWindow,
  convertCoreMessagesToMessages
} from '@clarity-chat/react'
import { useMemo } from 'react'

function RAGChat() {
  // Chat hook - RAG context is added server-side in the API route
  const { messages: coreMessages, append, isLoading } = useClarityChat({
    api: '/api/rag-chat', // Server-side RAG processing
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

### 1. Create Server-Side API Route

API keys are kept secure on the server. Create an API route that handles RAG:

```tsx
// app/api/rag-chat/route.ts
import { Pinecone } from '@pinecone-database/pinecone'

export async function POST(req: Request) {
  try {
    // Validate API keys exist (never expose to client)
    const pineconeKey = process.env.PINECONE_API_KEY
    const openaiKey = process.env.OPENAI_API_KEY

    if (!pineconeKey || !openaiKey) {
      return new Response(JSON.stringify({ error: 'API keys not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid messages format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Initialize Pinecone with server-side API key
    const pinecone = new Pinecone({ apiKey: pineconeKey })
    const index = pinecone.index('documents')

    // Get the last user message for RAG query
    const lastMessage = messages[messages.length - 1]
    const query = lastMessage.content

    // Generate embedding for query
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    })

    const { data } = await embeddingResponse.json()
    const queryEmbedding = data[0].embedding

    // Search for relevant documents
    const results = await index.query({
      vector: queryEmbedding,
      topK: 5,
      includeMetadata: true,
    })

    // Build context from retrieved documents
    const context = results.matches
      .map((match) => `[Source: ${match.metadata?.source}]: ${match.metadata?.content}`)
      .join('\n\n')

    // Add context to the prompt
    const augmentedMessages = [
      ...messages.slice(0, -1),
      {
        role: 'user',
        content: `Context:\n${context}\n\nQuestion: ${query}`,
      },
    ]

    // Call OpenAI with augmented context
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: augmentedMessages,
        stream: true,
      }),
    })

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'AI provider error' }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(response.body, {
      headers: { 'Content-Type': 'text/event-stream' }
    })
  } catch (error) {
    console.error('RAG Chat error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
```

### 2. Create Client Component

```tsx
import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function RAGChat() {
  const { messages, append, isLoading } = useClarityChat({
    api: '/api/rag-chat',
  })

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={(content) => append({ role: 'user', content })}
    />
  )
}
```

### 3. Set Environment Variables

```bash
# .env.local (never commit this file)
PINECONE_API_KEY=your-pinecone-key      # Server-side only
OPENAI_API_KEY=your-openai-key          # Server-side only

# Do NOT use NEXT_PUBLIC_ prefix for API keys!
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
