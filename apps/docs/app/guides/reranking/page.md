# Reranking

Reranking improves search result relevance by reordering documents based on their semantic similarity to the query. Clarity Chat provides built-in rerankers and support for integrating with production reranking services.

## Overview

Reranking helps you:
- Improve search result quality
- Reduce irrelevant results
- Increase diversity in results
- Optimize for specific use cases

## Installation

Reranking utilities are included in `@clarity-chat/react`:

```tsx
import { SimpleReranker, DiversityReranker } from '@clarity-chat/react'
```

## Quick Start

### Basic Reranking

```tsx
import { SimpleReranker } from '@clarity-chat/react'

const reranker = new SimpleReranker()

// Initial search results
const searchResults = [
  { id: '1', content: 'Machine learning basics', score: 0.8 },
  { id: '2', content: 'Deep learning tutorial', score: 0.7 },
  { id: '3', content: 'Python programming guide', score: 0.6 },
]

// Rerank for better relevance
const reranked = await reranker.rerank({
  query: 'machine learning',
  documents: searchResults,
  topK: 2,
})

console.log(reranked.results)
// [
//   { id: '1', content: 'Machine learning basics', rerankScore: 0.95, rank: 0 },
//   { id: '2', content: 'Deep learning tutorial', rerankScore: 0.75, rank: 1 },
// ]
```

## Simple Reranker

The `SimpleReranker` uses term overlap and positional scoring:

```tsx
import { SimpleReranker } from '@clarity-chat/react'

const reranker = new SimpleReranker()

const reranked = await reranker.rerank({
  query: 'What is machine learning?',
  documents: searchResults,
  topK: 5,
})
```

### How It Works

1. **Term Overlap**: Calculates how many query terms appear in each document
2. **Positional Scoring**: Rewards documents where query appears early
3. **Combined Score**: Weighted combination of overlap (60%) and position (40%)

## Diversity Reranker

Avoid redundant results with diversity reranking:

```tsx
import { DiversityReranker } from '@clarity-chat/react'

const reranker = new DiversityReranker(0.8) // Similarity threshold

const reranked = await reranker.rerank({
  query: 'python programming',
  documents: searchResults,
  topK: 10,
})
```

### Similarity Threshold

The threshold (0-1) controls how similar documents can be:
- **0.9**: Very similar documents allowed (less diversity)
- **0.7**: Moderate diversity
- **0.5**: High diversity (very different documents)

## Integration with RAG

Use reranking in your RAG pipeline:

```tsx
import {
  PineconeVectorStore,
  OpenAIEmbeddings,
  SimpleReranker,
} from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY!,
  indexName: 'documents',
})

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY!,
})

const reranker = new SimpleReranker()

async function searchWithReranking(query: string) {
  // 1. Generate query embedding
  const queryEmbedding = await embeddings.embedQuery(query)

  // 2. Initial vector search (retrieve more than needed)
  const searchResults = await vectorStore.similaritySearch({
    query: queryEmbedding,
    topK: 20, // Retrieve more than needed
  })

  // 3. Rerank for better relevance
  const reranked = await reranker.rerank({
    query,
    documents: searchResults,
    topK: 5, // Return top 5 after reranking
  })

  return reranked.results
}
```

## Custom Reranker

Implement your own reranker:

```tsx
import type { Reranker, RerankRequest, RerankResponse } from '@clarity-chat/react'

class CustomReranker implements Reranker {
  readonly name = 'custom'

  async rerank(request: RerankRequest): Promise<RerankResponse> {
    // Your reranking logic
    const scored = request.documents.map((doc, index) => {
      // Calculate custom score
      const score = this.calculateScore(request.query, doc.content)

      return {
        id: doc.id,
        originalScore: doc.score || 0,
        rerankScore: score,
        content: doc.content,
        metadata: doc.metadata,
        rank: index,
      }
    })

    // Sort and return top K
    const results = scored
      .sort((a, b) => b.rerankScore - a.rerankScore)
      .slice(0, request.topK || scored.length)
      .map((item, index) => ({
        ...item,
        rank: index,
      }))

    return { results }
  }

  private calculateScore(query: string, content: string): number {
    // Your scoring algorithm
    return 0.5 // Example
  }
}
```

## Production Reranking Services

For production, integrate with specialized reranking services:

### Cohere Rerank

```tsx
class CohereReranker implements Reranker {
  readonly name = 'cohere'

  async rerank(request: RerankRequest): Promise<RerankResponse> {
    const response = await fetch('https://api.cohere.ai/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'rerank-english-v3.0',
        query: request.query,
        documents: request.documents.map(d => d.content),
        top_n: request.topK || 10,
      }),
    })

    const data = await response.json()

    return {
      results: data.results.map((r: any, index: number) => ({
        id: request.documents[r.index].id,
        originalScore: request.documents[r.index].score || 0,
        rerankScore: r.relevance_score,
        content: request.documents[r.index].content,
        metadata: request.documents[r.index].metadata,
        rank: index,
      })),
      model: 'cohere-rerank-english-v3.0',
    }
  }
}
```

### Voyage Rerank

```tsx
class VoyageReranker implements Reranker {
  readonly name = 'voyage'

  async rerank(request: RerankRequest): Promise<RerankResponse> {
    const response = await fetch('https://api.voyageai.com/v1/rerank', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VOYAGE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: request.query,
        documents: request.documents.map(d => d.content),
        top_k: request.topK || 10,
      }),
    })

    const data = await response.json()

    return {
      results: data.results.map((r: any, index: number) => ({
        id: request.documents[r.index].id,
        originalScore: request.documents[r.index].score || 0,
        rerankScore: r.score,
        content: request.documents[r.index].content,
        metadata: request.documents[r.index].metadata,
        rank: index,
      })),
      model: 'voyage-rerank',
    }
  }
}
```

## Complete Example

```tsx
import {
  ChatWindow,
  PineconeVectorStore,
  OpenAIEmbeddings,
  SimpleReranker,
} from '@clarity-chat/react'

function RerankedRAGChat() {
  const [messages, setMessages] = useState([])
  
  const vectorStore = new PineconeVectorStore({
    apiKey: process.env.PINECONE_API_KEY!,
    indexName: 'documents',
  })
  
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPENAI_API_KEY!,
  })
  
  const reranker = new SimpleReranker()

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

    // Initial search (retrieve more than needed)
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

    // Build context from reranked results
    const context = reranked.results
      .map(r => r.content)
      .join('\n\n')

    // Generate response
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content: `Answer using this context:\n\n${context}`,
          },
          { role: 'user', content },
        ],
      }),
    })

    const data = await response.json()
    
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.message,
      metadata: {
        sources: reranked.results.map(r => r.metadata?.source),
        rerankScores: reranked.results.map(r => r.rerankScore),
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

## Best Practices

1. **Retrieve More**: Retrieve 2-3x more results than needed before reranking
2. **Always Rerank**: Reranking significantly improves result quality
3. **Use Diversity**: Use diversity reranker when you need varied results
4. **Production Services**: Use Cohere or Voyage for production applications
5. **Cache Results**: Cache reranked results for repeated queries
6. **Monitor Performance**: Track reranking latency and quality metrics

## Performance Considerations

- **Latency**: Reranking adds 50-200ms depending on document count
- **Cost**: Production reranking services charge per request
- **Caching**: Cache reranked results for common queries
- **Batch Processing**: Rerank multiple queries in parallel when possible

## Next Steps

- Learn about [RAG System](/guide/rag) for complete retrieval setup
- Check out [Token Optimization](/guide/token-optimization) for cost reduction
- See [Performance Guide](/guide/performance) for optimization tips
