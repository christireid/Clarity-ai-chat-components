'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const metadata: Metadata = {
  title: 'useVectorStore Hook | Clarity Chat',
  description: 'React hook for working with vector stores in UI components.',
}

const useVectorStoreOptions: Prop[] = [
  {
    name: 'provider',
    type: "'pinecone' | 'qdrant' | 'weaviate' | 'chroma'",
    required: true,
    description: 'Vector store provider.',
  },
  {
    name: 'config',
    type: 'Omit<VectorStoreConfig, "provider">',
    required: true,
    description: 'Vector store configuration (apiKey, indexName, etc.).',
  },
  {
    name: 'autoInitialize',
    type: 'boolean',
    default: 'true',
    description: 'Whether to automatically initialize the store.',
  },
]

const useVectorStoreReturn: Prop[] = [
  {
    name: 'store',
    type: 'VectorStore | null',
    description: 'Vector store instance (null until initialized).',
  },
  {
    name: 'status',
    type: "'idle' | 'initializing' | 'ready' | 'error'",
    description: 'Current initialization status.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error if initialization or operation failed.',
  },
  {
    name: 'initialize',
    type: '() => Promise<void>',
    description: 'Manually initialize the vector store.',
  },
  {
    name: 'search',
    type: '(input: number[] | string | VectorQuery, options?: Omit<VectorQuery, "vector" | "text">) => Promise<VectorMatch[]>',
    description:
      'Search the vector store. Accepts vector, text, or query object.',
  },
  {
    name: 'addDocuments',
    type: '(documents: VectorDocument[], options?: VectorUpsertOptions) => Promise<void>',
    description: 'Add documents with embeddings to the store.',
  },
  {
    name: 'upsert',
    type: 'VectorStore["upsert"]',
    description: 'Upsert vectors directly to the store.',
  },
  {
    name: 'delete',
    type: 'VectorStore["delete"]',
    description: 'Delete vectors by IDs.',
  },
  {
    name: 'getStats',
    type: 'VectorStore["getStats"]',
    description: 'Get statistics about the vector store.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset the store instance.',
  },
]

export default function UseVectorStorePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useVectorStore</h1>

      <p className="lead">
        React hook for working with vector stores in UI components. Provides a
        simple interface for searching, adding documents, and managing vector
        data with automatic initialization and error handling.
      </p>

      <Callout type="info" title="Vector Stores">
        <p>
          Vector stores enable semantic search by storing documents as vectors
          (embeddings). This hook provides a React-friendly interface for all
          vector store operations.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'

function VectorSearch() {
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      indexName: 'my-index',
    },
  })

  const handleSearch = async (query: string) => {
    if (vectorStore.status !== 'ready') {
      await vectorStore.initialize()
    }
    
    const results = await vectorStore.search(query, { topK: 5 })
    return results
  }

  return (
    <div>
      {vectorStore.status === 'initializing' && <div>Initializing...</div>}
      {vectorStore.status === 'ready' && <div>Ready to search</div>}
      {vectorStore.error && <div>Error: {vectorStore.error.message}</div>}
      <SearchInput onSearch={handleSearch} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useVectorStore:
        </p>
        <CodePlayground
          initialCode={`import { useVectorStore } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: 'your-api-key',
      indexName: 'test-index',
    },
    autoInitialize: false,
  })
  const [results, setResults] = useState([])

  const handleSearch = async (query: string) => {
    if (vectorStore.status !== 'ready') {
      await vectorStore.initialize()
    }
    const matches = await vectorStore.search(query, { topK: 3 })
    setResults(matches)
  }

  return (
    <div>
      <button onClick={() => vectorStore.initialize()}>
        Initialize
      </button>
      <div>Status: {vectorStore.status}</div>
      <input
        placeholder="Search..."
        onKeyPress={(e) => {
          if (e.key === 'Enter') handleSearch(e.target.value)
        }}
      />
      {results.map((match, i) => (
        <div key={i}>{match.metadata?.content}</div>
      ))}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Adding Documents</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'
import { useEmbeddings } from '@clarity-chat/react'

function DocumentManager() {
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.PINECONE_API_KEY,
      indexName: 'documents',
    },
  })

  const embeddings = useEmbeddings({
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
  })

  const handleAddDocument = async (content: string) => {
    // Generate embedding
    const embedding = await embeddings.generate(content)
    
    // Add to vector store
    await vectorStore.addDocuments([
      {
        id: \`doc_\${Date.now()}\`,
        content,
        embedding,
        metadata: {
          timestamp: Date.now(),
          source: 'user',
        },
      },
    ])
  }

  return (
    <div>
      <button onClick={() => handleAddDocument('New document content')}>
        Add Document
      </button>
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Searching with Vectors
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'

function VectorSearch() {
  const vectorStore = useVectorStore({
    provider: 'qdrant',
    config: {
      apiKey: process.env.QDRANT_API_KEY,
      url: 'https://your-cluster.qdrant.io',
      collectionName: 'my-collection',
    },
  })

  const handleVectorSearch = async (queryVector: number[]) => {
    // Search with pre-computed vector
    const results = await vectorStore.search(queryVector, {
      topK: 10,
      filter: {
        category: 'documentation',
      },
    })
    
    return results
  }

  return <SearchInput onVectorSearch={handleVectorSearch} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">
          With Different Providers
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'

// Pinecone
const pineconeStore = useVectorStore({
  provider: 'pinecone',
  config: {
    apiKey: process.env.PINECONE_API_KEY,
    indexName: 'my-index',
    environment: 'us-east-1',
  },
})

// Qdrant
const qdrantStore = useVectorStore({
  provider: 'qdrant',
  config: {
    apiKey: process.env.QDRANT_API_KEY,
    url: 'https://your-cluster.qdrant.io',
    collectionName: 'my-collection',
  },
})

// Weaviate
const weaviateStore = useVectorStore({
  provider: 'weaviate',
  config: {
    apiKey: process.env.WEAVIATE_API_KEY,
    url: 'https://your-cluster.weaviate.network',
    className: 'Document',
  },
})

// Chroma
const chromaStore = useVectorStore({
  provider: 'chroma',
  config: {
    url: 'http://localhost:8000',
    collectionName: 'my-collection',
  },
})`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'

function RobustVectorStore() {
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.PINECONE_API_KEY,
      indexName: 'my-index',
    },
  })

  const handleSearch = async (query: string) => {
    try {
      if (vectorStore.status === 'error') {
        // Reset and retry
        vectorStore.reset()
        await vectorStore.initialize()
      }
      
      if (vectorStore.status !== 'ready') {
        await vectorStore.initialize()
      }
      
      const results = await vectorStore.search(query)
      return results
    } catch (error) {
      console.error('Search failed:', error)
      return []
    }
  }

  return (
    <div>
      {vectorStore.error && (
        <div className="error">
          Error: {vectorStore.error.message}
          <button onClick={() => vectorStore.reset()}>Retry</button>
        </div>
      )}
      <SearchInput onSearch={handleSearch} />
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Getting Statistics</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useVectorStore } from '@clarity-chat/react'
import { useEffect, useState } from 'react'

function VectorStoreStats() {
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.PINECONE_API_KEY,
      indexName: 'my-index',
    },
  })

  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (vectorStore.status === 'ready') {
      vectorStore.getStats().then(setStats)
    }
  }, [vectorStore.status])

  return (
    <div>
      {stats && (
        <div>
          <p>Total vectors: {stats.totalVectors}</p>
          <p>Index dimension: {stats.dimension}</p>
          <p>Index fullness: {stats.fullness}</p>
        </div>
      )}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useVectorStoreOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useVectorStoreReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Supported Providers</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Pinecone</h3>
            <EnhancedCodeBlock
              language="tsx"
              code={`const store = useVectorStore({
  provider: 'pinecone',
  config: {
    apiKey: 'your-api-key',
    indexName: 'my-index',
    environment: 'us-east-1', // Optional
  },
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Qdrant</h3>
            <EnhancedCodeBlock
              language="tsx"
              code={`const store = useVectorStore({
  provider: 'qdrant',
  config: {
    apiKey: 'your-api-key',
    url: 'https://your-cluster.qdrant.io',
    collectionName: 'my-collection',
  },
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Weaviate</h3>
            <EnhancedCodeBlock
              language="tsx"
              code={`const store = useVectorStore({
  provider: 'weaviate',
  config: {
    apiKey: 'your-api-key',
    url: 'https://your-cluster.weaviate.network',
    className: 'Document',
  },
})`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Chroma</h3>
            <EnhancedCodeBlock
              language="tsx"
              code={`const store = useVectorStore({
  provider: 'chroma',
  config: {
    url: 'http://localhost:8000',
    collectionName: 'my-collection',
  },
})`}
            />
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Check status</strong> - Always check status before
            operations
          </li>
          <li>
            <strong>Handle initialization</strong> - Initialize manually if
            autoInitialize is false
          </li>
          <li>
            <strong>Error handling</strong> - Handle errors gracefully and
            provide retry options
          </li>
          <li>
            <strong>Use metadata</strong> - Store useful metadata with documents
            for filtering
          </li>
          <li>
            <strong>Batch operations</strong> - Batch document additions for
            better performance
          </li>
          <li>
            <strong>Monitor stats</strong> - Use getStats to monitor store
            health
          </li>
          <li>
            <strong>Reset on errors</strong> - Use reset() to recover from
            errors
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-rag-pipeline" className="docs-card">
            <h3>useRAGPipeline Hook</h3>
            <p>Complete RAG pipeline</p>
          </a>
          <a href="/reference/hooks/use-agent" className="docs-card">
            <h3>useAgent Hook</h3>
            <p>AI agent orchestration</p>
          </a>
          <a href="/guides/vector-stores" className="docs-card">
            <h3>Vector Stores Guide</h3>
            <p>Vector store setup and usage</p>
          </a>
          <a href="/cookbook/rag-integration" className="docs-card">
            <h3>RAG Integration Recipe</h3>
            <p>RAG patterns and examples</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useAgent', href: '/reference/hooks/use-agent' }}
        next={{
          title: 'useClarityChat',
          href: '/reference/hooks/use-clarity-chat',
        }}
      />
    </>
  )
}
