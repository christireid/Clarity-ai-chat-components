import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'useEmbeddings Hook | Clarity Chat',
  description:
    'React hook for generating embeddings using OpenAI, Cohere, or local providers with caching support.',
}

export default function UseEmbeddingsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
          <span>RAG & Embeddings</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">useEmbeddings</h1>
        <p className="text-xl text-muted-foreground mb-4">
          React hook for generating text embeddings. Supports multiple providers
          including OpenAI, Cohere, and local embedders with built-in caching
          for cost reduction.
        </p>
        <p className="text-muted-foreground">
          <strong>Architecture Layer:</strong> Mid-Level (Composable) •{' '}
          <strong>Domain:</strong> RAG & Embeddings
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">When to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
          <li>Implementing semantic search across documents or messages</li>
          <li>Building RAG (Retrieval Augmented Generation) pipelines</li>
          <li>
            Creating similarity-based features (related content, deduplication)
          </li>
          <li>When you need client-side embedding generation with caching</li>
        </ul>

        <h2 className="text-3xl font-semibold mb-4">When NOT to Use</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            For complete RAG pipelines - use{' '}
            <code className="bg-muted px-2 py-1 rounded">useRAGPipeline</code>{' '}
            or{' '}
            <code className="bg-muted px-2 py-1 rounded">useVectorStore</code>{' '}
            instead
          </li>
          <li>
            Server-side batch processing - generate embeddings in your API
            routes
          </li>
          <li>
            When you don&apos;t need to expose embedding operations to the
            client
          </li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <CodePlayground
          code={`import { useEmbeddings } from '@clarity-chat/react'

function SemanticSearch() {
  const { embed, embedBatch, isLoading, error } = useEmbeddings({
    provider: 'openai',
    model: 'text-embedding-3-small',
  })

  const handleSearch = async (query: string) => {
    // Generate embedding for search query
    const vector = await embed(query)

    // Use vector for semantic search
    const results = await searchVectorStore(vector)
    return results
  }

  const indexDocuments = async (docs: string[]) => {
    // Batch embed documents
    const vectors = await embedBatch(docs)

    // Store in vector database
    await storeVectors(vectors)
  }

  return (
    <div>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <span>Generating embeddings...</span>}
    </div>
  )
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">With Caching</h2>
        <CodePlayground
          code={`import {
  useEmbeddings,
  createCachedEmbeddingProvider,
  MemoryEmbeddingCache
} from '@clarity-chat/react'

function CachedEmbeddings() {
  const { embed } = useEmbeddings({
    provider: 'openai',
    model: 'text-embedding-3-small',
    cache: new MemoryEmbeddingCache(),
  })

  // Repeated queries hit cache instead of API
  const handleQuery = async (text: string) => {
    const vector = await embed(text) // Cached after first call
    return vector
  }

  return <div>...</div>
}`}
        />
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-semibold mb-3">Options</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">provider</td>
                    <td className="p-3 font-mono text-sm">
                      'openai' | 'cohere' | 'local'
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Embedding provider to use.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">model</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Model name (e.g., 'text-embedding-3-small').
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">apiKey</td>
                    <td className="p-3 font-mono text-sm">string</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      API key for the provider.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">cache</td>
                    <td className="p-3 font-mono text-sm">EmbeddingCache</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Optional cache for reducing API calls.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-3">Return Value</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-semibold">Property</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-sm">embed</td>
                    <td className="p-3 font-mono text-sm">
                      (text: string) =&gt; Promise&lt;number[]&gt;
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Generate embedding for single text.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">embedBatch</td>
                    <td className="p-3 font-mono text-sm">
                      (texts: string[]) =&gt; Promise&lt;number[][]&gt;
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Generate embeddings for multiple texts.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">isLoading</td>
                    <td className="p-3 font-mono text-sm">boolean</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Whether embedding generation is in progress.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-sm">error</td>
                    <td className="p-3 font-mono text-sm">Error | null</td>
                    <td className="p-3 text-sm text-muted-foreground">
                      Error from the last operation.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Supported Providers</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">OpenAI</h3>
            <p className="text-sm text-muted-foreground">
              text-embedding-3-small, text-embedding-3-large,
              text-embedding-ada-002
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Cohere</h3>
            <p className="text-sm text-muted-foreground">
              embed-english-v3.0, embed-multilingual-v3.0
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Local</h3>
            <p className="text-sm text-muted-foreground">
              Run embeddings locally with transformers.js
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Related</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/reference/hooks/use-vector-store"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">useVectorStore</h3>
            <p className="text-sm text-muted-foreground">
              Store and query vectors for semantic search.
            </p>
          </Link>
          <Link
            href="/guides/rag"
            className="border rounded-lg p-4 hover:bg-muted transition-colors"
          >
            <h3 className="font-semibold mb-2">RAG Guide</h3>
            <p className="text-sm text-muted-foreground">
              Build retrieval-augmented generation systems.
            </p>
          </Link>
        </div>
      </section>
    </div>
  )
}
