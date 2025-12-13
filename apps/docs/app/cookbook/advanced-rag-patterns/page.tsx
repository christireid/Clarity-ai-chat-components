import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'


export const metadata: Metadata = {
  title: 'Advanced RAG Patterns Recipe - Clarity Chat Components',
  description: 'Implement advanced RAG (Retrieval-Augmented Generation) patterns with document integration, semantic search, and context management.',
}

export default function AdvancedRAGPatternsRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Advanced RAG Patterns</h1>
        <p className="docs-lead">
          Implement advanced RAG patterns with document integration, semantic search, vector stores, and intelligent context retrieval.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Integrate documents for RAG',
          'Set up semantic search',
          'Build vector stores',
          'Retrieve relevant context',
          'Manage RAG context in chat',
        ]}
      />

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          This recipe shows how to implement advanced RAG patterns using document integration, semantic search, and intelligent context retrieval.
        </p>
      </section>

      <section className="docs-section">
        <h2>Document Integration for RAG</h2>
        <p>
          Extract and chunk documents for RAG:
        </p>
        <CodePlayground
          initialCode={`import { DocumentIntegration, useDocumentIntegration } from '@clarity-chat/react'

function RAGDocumentSetup() {
  const { extractContent, fetchDocument } = useDocumentIntegration()

  const processDocument = async (documentId: string) => {
    // Fetch document
    const document = await fetchDocument(documentId, 'google-docs')
    
    // Extract chunks
    const chunks = await extractContent(document, 1000, 200)
    
    // Generate embeddings and store in vector DB
    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk.content)
      await vectorStore.add({
        id: chunk.id,
        content: chunk.content,
        embedding,
        metadata: {
          documentId: document.id,
          documentTitle: document.metadata.title,
          startIndex: chunk.startIndex,
          endIndex: chunk.endIndex,
        },
      })
    }
  }

  return (
    <DocumentIntegration
      platforms={['google-docs', 'notion']}
      onDocumentSelect={async (document) => {
        await processDocument(document.id)
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Semantic Search</h2>
        <p>
          Use semantic search to find relevant context:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function RAGSearch() {
  const [query, setQuery] = React.useState('')

  const handleSearch = async (searchQuery: string) => {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(searchQuery)
    
    // Search vector store
    const results = await vectorStore.search(queryEmbedding, {
      topK: 5,
      minSimilarity: 0.7,
    })
    
    return results.map(r => ({
      content: r.content,
      metadata: r.metadata,
      similarity: r.similarity,
    }))
  }

  return (
    <SemanticMessageSearch
      messages={messages}
      onResultsFound={(results) => {
        // Use results as context for RAG
        useAsContext(results)
      }}
      config={{
        embeddings: {
          provider: 'openai',
          model: 'text-embedding-3-small',
        },
        similarityThreshold: 0.7,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>RAG Context in Chat</h2>
        <p>
          Use retrieved context in chat:
        </p>
        <CodePlayground
          initialCode={`import { ClarityChat } from '@clarity-chat/react'

function RAGChat() {
  const [context, setContext] = React.useState<string[]>([])

  const retrieveContext = async (query: string) => {
    // Generate embedding
    const embedding = await generateEmbedding(query)
    
    // Search vector store
    const results = await vectorStore.search(embedding, { topK: 3 })
    
    // Extract content
    const contextTexts = results.map(r => r.content)
    setContext(contextTexts)
    
    return contextTexts
  }

  return (
    <ClarityChat
      api="/api/chat/rag"
      onMessage={async (message) => {
        // Retrieve relevant context
        const context = await retrieveContext(message.content)
        
        // Send with context
        return {
          ...message,
          context,
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Hybrid Search</h2>
        <p>
          Combine semantic and keyword search:
        </p>
        <CodePlayground
          initialCode={`async function hybridSearch(query: string) {
  // Semantic search
  const semanticResults = await semanticSearch(query)
  
  // Keyword search
  const keywordResults = await keywordSearch(query)
  
  // Combine and rerank
  const combined = [...semanticResults, ...keywordResults]
  const reranked = await rerankResults(combined, query)
  
  return reranked.slice(0, 5)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Context Management</h2>
        <p>
          Manage RAG context efficiently:
        </p>
        <CodePlayground
          initialCode={`import { useContextMonitor } from '@clarity-chat/react'

function RAGContextManager({ messages }: { messages: Message[] }) {
  const { utilization, recommendations } = useContextMonitor(messages, {
    maxTokens: 128000,
    enableRecommendations: true,
  })

  // Use recommendations to optimize context
  React.useEffect(() => {
    recommendations.forEach(rec => {
      if (rec.action === 'prune') {
        // Prune less relevant context
        pruneContext(rec.metadata?.contextIds)
      }
    })
  }, [recommendations])

  return (
    <div>
      <div>Context tokens: {utilization.breakdown.retrievedContext}</div>
      <div>Total tokens: {utilization.totalTokens}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete RAG Implementation</h2>
        <p>
          Complete RAG implementation:
        </p>
        <CodePlayground
          initialCode={`import { DocumentIntegration, SemanticMessageSearch, ClarityChat } from '@clarity-chat/react'
import { useDocumentIntegration } from '@clarity-chat/react'

function CompleteRAG() {
  const { extractContent } = useDocumentIntegration()
  const [vectorStore, setVectorStore] = React.useState(null)

  // Process documents
  const processDocument = async (document) => {
    const chunks = await extractContent(document)
    // Add to vector store
    await addToVectorStore(chunks)
  }

  // Retrieve context
  const retrieveContext = async (query: string) => {
    const embedding = await generateEmbedding(query)
    const results = await vectorStore.search(embedding, { topK: 5 })
    return results.map(r => r.content)
  }

  return (
    <div>
      <DocumentIntegration
        platforms={['google-docs', 'notion']}
        onDocumentSelect={processDocument}
      />
      <ClarityChat
        api="/api/chat/rag"
        onMessage={async (message) => {
          const context = await retrieveContext(message.content)
          return { ...message, context }
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Chunk documents appropriately (1000-2000 tokens)</li>
          <li>Use overlap between chunks (10-20%)</li>
          <li>Generate high-quality embeddings</li>
          <li>Set appropriate similarity thresholds</li>
          <li>Limit retrieved context to stay within token limits</li>
          <li>Use hybrid search for better results</li>
          <li>Monitor context utilization</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/document-integration">DocumentIntegration</a> - Document integration component</li>
          <li><a href="/reference/components/semantic-message-search">SemanticMessageSearch</a> - Semantic search component</li>
          <li><a href="/reference/hooks/use-context-monitor">useContextMonitor</a> - Context monitoring hook</li>
        </ul>
      </section>
    </div>
  )
}
