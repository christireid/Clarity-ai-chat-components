'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useRAGPipeline Hook | Clarity Chat',
  description: 'Top-level hook for Retrieval-Augmented Generation with vector stores.',
}

const useRAGPipelineOptions: Prop[] = [
  {
    name: 'vectorStore',
    type: "'pinecone' | 'qdrant' | 'weaviate' | 'chroma'",
    required: true,
    description: 'Vector store provider to use.',
  },
  {
    name: 'embeddingProvider',
    type: "'openai' | 'cohere' | 'custom'",
    required: true,
    description: 'Embedding provider for generating embeddings.',
  },
  {
    name: 'apiKeys',
    type: '{ vectorStore?: string; embeddings?: string }',
    description: 'API keys for vector store and embeddings.',
  },
  {
    name: 'reranker',
    type: "'cohere' | 'jina' | 'voyage'",
    description: 'Reranker provider for result refinement (optional).',
  },
]

const useRAGPipelineReturn: Prop[] = [
  {
    name: 'retrieve',
    type: '(query: string, limit?: number) => Promise<any[]>',
    description: 'Retrieve relevant documents for a query.',
  },
  {
    name: 'rerank',
    type: '(query: string, documents: any[]) => Promise<any[]>',
    description: 'Rerank retrieved documents for better relevance.',
  },
  {
    name: 'context',
    type: '{ documents: any[]; query: string }',
    description: 'Current retrieval context with documents and query.',
  },
]

export default function UseRAGPipelinePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useRAGPipeline</h1>

      <p className="lead">
        Top-level hook for Retrieval-Augmented Generation (RAG) with automatic vector store
        and embedding management. Perfect for building AI applications that need to retrieve
        and use relevant documents from a knowledge base.
      </p>

      <Callout type="info" title="RAG Pipeline">
        <p>
          RAG combines retrieval of relevant documents with generation, allowing AI models
          to answer questions using your own knowledge base. This hook handles the entire
          pipeline automatically.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useRAGPipeline } from '@clarity-chat/react'

function RAGChat() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      embeddings: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    },
  })

  const handleQuery = async (query: string) => {
    // Retrieve relevant documents
    const documents = await rag.retrieve(query, 5)
    
    // Use documents as context for chat
    return documents
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useRAGPipeline:
        </p>
        <CodePlayground
          initialCode={`import { useRAGPipeline } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
  })
  const [results, setResults] = useState([])

  const handleSearch = async (query: string) => {
    const docs = await rag.retrieve(query, 3)
    setResults(docs)
  }

  return (
    <div>
      <input
        placeholder="Search..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch(e.target.value)
        }}
      />
      <div>
        {results.map((doc, i) => (
          <div key={i}>{doc.content}</div>
        ))}
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Reranking</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useRAGPipeline } from '@clarity-chat/react'

function RerankedRAG() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    reranker: 'cohere', // Enable reranking
    apiKeys: {
      vectorStore: process.env.PINECONE_API_KEY,
      embeddings: process.env.OPENAI_API_KEY,
    },
  })

  const handleQuery = async (query: string) => {
    // Retrieve documents
    const documents = await rag.retrieve(query, 10)
    
    // Rerank for better relevance
    const reranked = await rag.rerank(query, documents)
    
    // Use top 5 reranked results
    return reranked.slice(0, 5)
  }

  return <ChatWindow onSendMessage={handleQuery} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Chat Integration</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useRAGPipeline, useClarityChat } from '@clarity-chat/react'

function RAGChat() {
  const rag = useRAGPipeline({
    vectorStore: 'qdrant',
    embeddingProvider: 'openai',
  })

  const chat = useClarityChat({
    api: '/api/chat',
    onBeforeSend: async (messages) => {
      // Retrieve relevant context
      const lastMessage = messages[messages.length - 1]
      const context = await rag.retrieve(lastMessage.content, 5)
      
      // Add context to system prompt
      const contextText = context
        .map(doc => doc.content)
        .join('\\n\\n')
      
      return [
        {
          role: 'system',
          content: \`Use the following context to answer:\\n\\n\${contextText}\`,
        },
        ...messages,
      ]
    },
  })

  return <ChatWindow messages={chat.messages} onSendMessage={chat.sendMessage} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Different Vector Stores</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useRAGPipeline } from '@clarity-chat/react'

// Pinecone
const pineconeRAG = useRAGPipeline({
  vectorStore: 'pinecone',
  embeddingProvider: 'openai',
  apiKeys: {
    vectorStore: process.env.PINECONE_API_KEY,
  },
})

// Qdrant
const qdrantRAG = useRAGPipeline({
  vectorStore: 'qdrant',
  embeddingProvider: 'openai',
  apiKeys: {
    vectorStore: process.env.QDRANT_API_KEY,
  },
})

// Weaviate
const weaviateRAG = useRAGPipeline({
  vectorStore: 'weaviate',
  embeddingProvider: 'cohere',
  apiKeys: {
    vectorStore: process.env.WEAVIATE_API_KEY,
    embeddings: process.env.COHERE_API_KEY,
  },
})

// Chroma
const chromaRAG = useRAGPipeline({
  vectorStore: 'chroma',
  embeddingProvider: 'openai',
})`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useRAGPipelineOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useRAGPipelineReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Query Embedding</strong> - Converts your query into a vector embedding</li>
          <li><strong>Vector Search</strong> - Searches the vector store for similar documents</li>
          <li><strong>Reranking (Optional)</strong> - Refines results for better relevance</li>
          <li><strong>Context Building</strong> - Returns documents ready to use as context</li>
        </ol>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Supported Providers</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Vector Stores</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li><strong>Pinecone</strong> - Managed vector database</li>
              <li><strong>Qdrant</strong> - Open-source vector search engine</li>
              <li><strong>Weaviate</strong> - Vector database with GraphQL</li>
              <li><strong>Chroma</strong> - Embeddings database</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Embedding Providers</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li><strong>OpenAI</strong> - text-embedding-ada-002, text-embedding-3-small/large</li>
              <li><strong>Cohere</strong> - embed-english-v3.0, embed-multilingual-v3.0</li>
              <li><strong>Custom</strong> - Use your own embedding service</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Rerankers</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li><strong>Cohere</strong> - rerank-english-v3.0, rerank-multilingual-v3.0</li>
              <li><strong>Jina</strong> - jina-reranker-v1-base-en</li>
              <li><strong>Voyage</strong> - voyage-rerank-lite</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Use reranking</strong> - Improves relevance, especially for top-k retrieval</li>
          <li><strong>Limit results</strong> - Start with 5-10 documents, expand if needed</li>
          <li><strong>Filter by metadata</strong> - Use vector store metadata for filtering</li>
          <li><strong>Cache embeddings</strong> - Cache query embeddings for repeated queries</li>
          <li><strong>Monitor costs</strong> - Track embedding and vector store API usage</li>
          <li><strong>Handle errors</strong> - The hook returns empty array on error, handle gracefully</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-vector-store" className="docs-card">
            <h3>useVectorStore Hook</h3>
            <p>Direct vector store operations</p>
          </a>
          <a href="/reference/hooks/use-agent" className="docs-card">
            <h3>useAgent Hook</h3>
            <p>AI agent orchestration</p>
          </a>
          <a href="/guides/rag-setup" className="docs-card">
            <h3>RAG Setup Guide</h3>
            <p>Complete RAG implementation guide</p>
          </a>
          <a href="/cookbook/rag-integration" className="docs-card">
            <h3>RAG Integration Recipe</h3>
            <p>RAG patterns and examples</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useMessageOperations', href: '/reference/hooks/use-message-operations' }}
        next={{ title: 'useAgent', href: '/reference/hooks/use-agent' }}
      />
    </>
  )
}
