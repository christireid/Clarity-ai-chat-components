import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'Advanced RAG Patterns Recipe - Clarity Chat Components',
  description:
    'Implement advanced RAG (Retrieval-Augmented Generation) patterns with document integration, semantic search, and context management.',
}

export default function AdvancedRAGPatternsRecipePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Recipe</span>
        <h1>Advanced RAG Patterns</h1>
        <p className="docs-lead">
          Implement advanced RAG patterns with document integration, semantic
          search, vector stores, and intelligent context retrieval.
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
          This recipe shows how to implement advanced RAG patterns using
          document integration, semantic search, and intelligent context
          retrieval.
        </p>
      </section>

      <section className="docs-section">
        <h2>Document Integration for RAG</h2>
        <p>Extract and chunk documents for RAG:</p>
        <CodePlayground
          initialCode={`import { RAGProvider, useRAG } from '@clarity-chat/react'

function RAGDocumentSetup() {
  const { addDocument, searchDocuments } = useRAG()

  const processDocument = async (documentId: string, content: string) => {
    // Add document to RAG context with chunking
    await addDocument({
      id: documentId,
      content,
      metadata: {
        source: 'google-docs',
        chunkSize: 1000,
        chunkOverlap: 200,
      },
    })
  }

  return (
    <RAGProvider
      config={{
        chunkSize: 1000,
        chunkOverlap: 200,
        embeddingModel: 'text-embedding-3-small',
      }}
    >
      <div>
        <button onClick={() => processDocument('doc-1', 'Document content...')}>
          Add Document
        </button>
      </div>
    </RAGProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Semantic Search</h2>
        <p>Use semantic search to find relevant context:</p>
        <CodePlayground
          initialCode={`import { RAGProvider, useRAG } from '@clarity-chat/react'

function RAGSearch() {
  const { searchDocuments } = useRAG()
  const [results, setResults] = React.useState([])

  const handleSearch = async (searchQuery: string) => {
    // Search documents using RAG provider
    const searchResults = await searchDocuments(searchQuery, {
      topK: 5,
      minSimilarity: 0.7,
    })

    setResults(searchResults)
    return searchResults
  }

  return (
    <RAGProvider
      config={{
        embeddingModel: 'text-embedding-3-small',
        similarityThreshold: 0.7,
      }}
    >
      <div>
        <input
          type="text"
          placeholder="Search documents..."
          onChange={(e) => handleSearch(e.target.value)}
        />
        <ul>
          {results.map((result, i) => (
            <li key={i}>{result.content} (Score: {result.similarity})</li>
          ))}
        </ul>
      </div>
    </RAGProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>RAG Context in Chat</h2>
        <p>Use retrieved context in chat:</p>
        <CodePlayground
          initialCode={`import { ClarityChat, RAGProvider, useRAG } from '@clarity-chat/react'

function RAGChat() {
  const { searchDocuments } = useRAG()

  const retrieveContext = async (query: string) => {
    // Search for relevant documents
    const results = await searchDocuments(query, { topK: 3 })
    return results.map(r => r.content)
  }

  return (
    <RAGProvider config={{ embeddingModel: 'text-embedding-3-small' }}>
      <ClarityChat
        api="/api/chat/rag"
        onBeforeSend={async (message) => {
          // Retrieve relevant context before sending
          const context = await retrieveContext(message.content)
          return {
            ...message,
            context,
          }
        }}
      />
    </RAGProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Hybrid Search</h2>
        <p>Combine semantic and keyword search:</p>
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
        <p>Manage RAG context efficiently:</p>
        <CodePlayground
          initialCode={`import { TokenCounter, TokenBudgetProvider, Message } from '@clarity-chat/react'

function RAGContextManager({ messages }: { messages: Message[] }) {
  return (
    <TokenBudgetProvider maxTokens={128000}>
      <div>
        <TokenCounter
          messages={messages}
          showBreakdown
          onBudgetExceeded={(info) => {
            console.log('Token budget exceeded:', info)
            // Implement context pruning logic
          }}
        />
      </div>
    </TokenBudgetProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete RAG Implementation</h2>
        <p>Complete RAG implementation:</p>
        <CodePlayground
          initialCode={`import { RAGProvider, useRAG, ClarityChat, TokenBudgetProvider, TokenCounter } from '@clarity-chat/react'

function CompleteRAG() {
  const { addDocument, searchDocuments } = useRAG()

  // Process documents
  const processDocument = async (content: string, metadata: object) => {
    await addDocument({
      id: crypto.randomUUID(),
      content,
      metadata,
    })
  }

  // Retrieve context
  const retrieveContext = async (query: string) => {
    const results = await searchDocuments(query, { topK: 5 })
    return results.map(r => r.content)
  }

  return (
    <RAGProvider
      config={{
        chunkSize: 1000,
        chunkOverlap: 200,
        embeddingModel: 'text-embedding-3-small',
      }}
    >
      <TokenBudgetProvider maxTokens={128000}>
        <div>
          <TokenCounter showBreakdown />
          <ClarityChat
            api="/api/chat/rag"
            onBeforeSend={async (message) => {
              const context = await retrieveContext(message.content)
              return { ...message, context }
            }}
          />
        </div>
      </TokenBudgetProvider>
    </RAGProvider>
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
          <li>
            <a href="/reference/components/rag-provider">RAGProvider</a> - RAG
            context provider component
          </li>
          <li>
            <a href="/reference/hooks/use-rag">useRAG</a> - RAG hook for
            document management and search
          </li>
          <li>
            <a href="/reference/components/token-counter">TokenCounter</a> -
            Token usage monitoring component
          </li>
          <li>
            <a href="/reference/components/token-budget-provider">
              TokenBudgetProvider
            </a>{' '}
            - Token budget management provider
          </li>
        </ul>
      </section>
    </div>
  )
}
