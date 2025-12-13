'use client'

import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { Pagination } from '@/components/Navigation/Pagination'

export default function RAGGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
        <header>
          <h1 className="text-4xl font-bold mb-3">RAG Pipeline Guide</h1>
          <p className="text-lg text-muted-foreground">
            Complete guide to Retrieval-Augmented Generation (RAG) for answering
            questions about your documents using vector stores, embeddings, and
            semantic search.
          </p>
        </header>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Overview</h2>
          <p className="mb-4">
            RAG (Retrieval-Augmented Generation) allows AI to answer questions
            using your documents, not just its training data. It combines
            semantic search with LLM generation to provide accurate, grounded
            responses.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 border-2 border-muted rounded-xl">
              <div className="font-semibold mb-2">❌ Without RAG</div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div>User: "What were our Q3 sales?"</div>
                <div>AI: "I don't have access to that information."</div>
                <div className="mt-4 text-xs text-destructive">
                  ❌ Can only use training data
                </div>
              </div>
            </div>

            <div className="p-4 border-2 border-primary/20 bg-primary/5 rounded-xl">
              <div className="font-semibold mb-2 text-primary">✅ With RAG</div>
              <div className="text-sm space-y-2 text-muted-foreground">
                <div>User: "What were our Q3 sales?"</div>
                <div className="italic">*searches your documents*</div>
                <div>AI: "Q3 sales were $2.5M, up 15% from Q2."</div>
                <div className="mt-4 text-xs text-green-600 dark:text-green-400">
                  ✅ Uses your documents
                </div>
              </div>
            </div>
          </div>

          <Callout type="info">
            <p>
              <strong>How RAG Works:</strong> Documents are split into chunks,
              converted to embeddings (vectors), and stored in a vector
              database. When a question is asked, the query is embedded, similar
              chunks are retrieved, and the LLM generates an answer using that
              context.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">
            RAG Pipeline Architecture
          </h2>
          <p className="mb-4">The RAG pipeline consists of several stages:</p>

          <EnhancedCodeBlock
            code={`1. DOCUMENT INGESTION
   - Load documents (PDF, Word, Markdown, etc.)
   - Extract text content
   - Split into chunks

2. EMBEDDING GENERATION
   - Convert text chunks to embeddings (vectors)
   - Use embedding model (OpenAI, Cohere, etc.)

3. VECTOR STORAGE
   - Store embeddings in vector database
   - Include metadata (source, date, etc.)

4. QUERY PROCESSING
   - Convert user question to embedding
   - Search for similar chunks
   - Retrieve top-K results

5. CONTEXT AUGMENTATION
   - Combine retrieved chunks into context
   - Pass to LLM with question

6. GENERATION
   - LLM generates answer using context
   - Include citations to sources`}
            language="text"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Using useRAGPipeline</h2>
          <p className="mb-4">
            The <code>useRAGPipeline</code> hook provides a simple API for RAG
            with automatic vector store and embedding management:
          </p>

          <EnhancedCodeBlock
            code={`import { useRAGPipeline } from '@clarity-chat/react'

function RAGExample() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      embeddings: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    },
    reranker: 'cohere', // Optional: rerank results
  })

  const handleQuery = async () => {
    // Retrieve relevant documents
    const results = await rag.retrieve('What is React?', 5)
    console.log('Retrieved documents:', results)
  }

  return (
    <div>
      <button onClick={handleQuery}>Search Documents</button>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Vector Stores</h2>
          <p className="mb-4">
            Clarity Chat supports multiple vector store providers. Choose based
            on your needs:
          </p>

          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border p-2 text-left">
                    Provider
                  </th>
                  <th className="border border-border p-2 text-left">Pros</th>
                  <th className="border border-border p-2 text-left">Cons</th>
                  <th className="border border-border p-2 text-left">
                    Best For
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Pinecone</strong>
                  </td>
                  <td className="border border-border p-2">
                    Easiest setup, fully managed, great performance
                  </td>
                  <td className="border border-border p-2">
                    Can be expensive at scale
                  </td>
                  <td className="border border-border p-2">
                    Production apps, quick setup
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Qdrant</strong>
                  </td>
                  <td className="border border-border p-2">
                    Open source, self-hostable, good performance
                  </td>
                  <td className="border border-border p-2">
                    Requires self-hosting
                  </td>
                  <td className="border border-border p-2">
                    Self-hosted deployments
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Weaviate</strong>
                  </td>
                  <td className="border border-border p-2">
                    Open source, graph-like queries, good features
                  </td>
                  <td className="border border-border p-2">
                    More complex setup
                  </td>
                  <td className="border border-border p-2">
                    Complex queries, graph data
                  </td>
                </tr>
                <tr>
                  <td className="border border-border p-2">
                    <strong>Chroma</strong>
                  </td>
                  <td className="border border-border p-2">
                    Simple, lightweight, good for development
                  </td>
                  <td className="border border-border p-2">
                    Less scalable, fewer features
                  </td>
                  <td className="border border-border p-2">
                    Development, small projects
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-2xl font-semibold mb-3">Using Vector Stores</h3>
          <EnhancedCodeBlock
            code={`import { useVectorStore } from '@clarity-chat/react'

function VectorStoreExample() {
  const {
    store,
    status,
    search,
    addDocuments,
  } = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      indexName: 'my-index',
      dimension: 1536, // OpenAI embedding dimension
    },
  })

  const handleAddDocuments = async () => {
    const documents = [
      {
        id: 'doc-1',
        content: 'React is a JavaScript library for building user interfaces.',
        embedding: await generateEmbedding('React is a JavaScript library...'),
        metadata: { source: 'docs.md', page: 1 },
      },
    ]

    await addDocuments(documents)
  }

  const handleSearch = async () => {
    const results = await search('What is React?', { topK: 5 })
    console.log('Search results:', results)
  }

  return (
    <div>
      <button onClick={handleAddDocuments}>Add Documents</button>
      <button onClick={handleSearch}>Search</button>
      <p>Status: {status}</p>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Embeddings</h2>
          <p className="mb-4">
            Embeddings convert text into numerical vectors that capture semantic
            meaning. Clarity Chat supports multiple embedding providers:
          </p>

          <h3 className="text-2xl font-semibold mb-3">Embedding Providers</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>
              <strong>OpenAI:</strong> text-embedding-3-small,
              text-embedding-3-large, text-embedding-ada-002
            </li>
            <li>
              <strong>Cohere:</strong> embed-english-v3.0,
              embed-multilingual-v3.0
            </li>
            <li>
              <strong>Custom:</strong> Self-hosted or custom embedding models
            </li>
          </ul>

          <EnhancedCodeBlock
            code={`import { useEmbeddings } from '@clarity-chat/react'

function EmbeddingsExample() {
  const { generate, provider } = useEmbeddings({
    provider: 'openai',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    model: 'text-embedding-3-small',
  })

  const handleEmbed = async () => {
    // Single text
    const embedding = await generate('What is React?')
    console.log('Embedding:', embedding)

    // Multiple texts (batch)
    const embeddings = await generate([
      'What is React?',
      'What is Vue?',
      'What is Angular?',
    ])
    console.log('Embeddings:', embeddings)
  }

  return (
    <div>
      <button onClick={handleEmbed}>Generate Embeddings</button>
      {provider && <p>Model: {provider.defaultModel}</p>}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Document Chunking</h2>
          <p className="mb-4">
            Documents must be split into chunks before embedding. The chunking
            strategy affects retrieval quality:
          </p>

          <h3 className="text-2xl font-semibold mb-3">Chunking Strategies</h3>

          <h4 className="text-xl font-semibold mb-2">1. Fixed Size</h4>
          <p className="mb-4">
            Simple chunking by character count. Fast but may split sentences:
          </p>

          <EnhancedCodeBlock
            code={`function chunkBySize(text: string, size: number, overlap: number = 0): string[] {
  const chunks: string[] = []
  for (let i = 0; i < text.length; i += size - overlap) {
    chunks.push(text.slice(i, i + size))
  }
  return chunks
}

// Usage
const chunks = chunkBySize(documentText, 1000, 200) // 1000 chars, 200 overlap`}
            language="tsx"
            showLineNumbers
          />

          <h4 className="text-xl font-semibold mb-2 mt-8">
            2. Semantic Chunking
          </h4>
          <p className="mb-4">
            Split by paragraphs, sentences, or semantic boundaries. Better
            quality:
          </p>

          <EnhancedCodeBlock
            code={`function chunkSemantic(text: string, maxSize: number): string[] {
  // Split by paragraphs first
  const paragraphs = text.split('\\n\\n')
  const chunks: string[] = []
  let currentChunk = ''

  for (const para of paragraphs) {
    if (currentChunk.length + para.length > maxSize) {
      if (currentChunk) chunks.push(currentChunk.trim())
      currentChunk = para
    } else {
      currentChunk += (currentChunk ? '\\n\\n' : '') + para
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}

// Usage
const chunks = chunkSemantic(documentText, 1000)`}
            language="tsx"
            showLineNumbers
          />

          <Callout type="tip">
            <p>
              <strong>Best Practices:</strong> Use 500-1500 character chunks
              with 10-20% overlap. Semantic chunking preserves context better
              than fixed-size chunking.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Indexing Documents</h2>
          <p className="mb-4">
            Index documents by chunking, embedding, and storing in a vector
            database:
          </p>

          <EnhancedCodeBlock
            code={`import { useVectorStore, useEmbeddings } from '@clarity-chat/react'

async function indexDocument(documentText: string, metadata: Record<string, any>) {
  // 1. Chunk the document
  const chunks = chunkSemantic(documentText, 1000)

  // 2. Generate embeddings
  const embeddings = useEmbeddings({
    provider: 'openai',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  const chunkEmbeddings = await Promise.all(
    chunks.map(chunk => embeddings.generate(chunk))
  )

  // 3. Store in vector database
  const vectorStore = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      indexName: 'documents',
    },
  })

  const vectors = chunks.map((chunk, i) => ({
    id: \`doc-\${Date.now()}-\${i}\`,
    content: chunk,
    embedding: chunkEmbeddings[i],
    metadata: {
      ...metadata,
      chunkIndex: i,
      totalChunks: chunks.length,
    },
  }))

  await vectorStore.addDocuments(vectors)

  return vectors.length
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Retrieval & Reranking</h2>
          <p className="mb-4">
            Retrieve relevant documents and optionally rerank them for better
            quality:
          </p>

          <h3 className="text-2xl font-semibold mb-3">Basic Retrieval</h3>
          <EnhancedCodeBlock
            code={`import { useRAGPipeline } from '@clarity-chat/react'

function RetrievalExample() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
  })

  const handleRetrieve = async (query: string) => {
    // Retrieve top 5 most similar documents
    const results = await rag.retrieve(query, 5)

    // Results include:
    // - id: Vector ID
    // - score: Similarity score (0-1)
    // - metadata: Document metadata
    // - content: Document text

    return results
  }

  return <button onClick={() => handleRetrieve('What is React?')}>Search</button>
}`}
            language="tsx"
            showLineNumbers
          />

          <h3 className="text-2xl font-semibold mb-3 mt-8">With Reranking</h3>
          <p className="mb-4">
            Reranking improves result quality by reordering based on relevance:
          </p>

          <EnhancedCodeBlock
            code={`import { useRAGPipeline } from '@clarity-chat/react'

function RerankingExample() {
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    reranker: 'cohere', // Optional: rerank results
  })

  const handleRetrieve = async (query: string) => {
    // Retrieve and rerank
    const results = await rag.retrieve(query, 10) // Get more initially
    const reranked = await rag.rerank(query, results) // Rerank to top 5

    return reranked
  }

  return <button onClick={() => handleRetrieve('What is React?')}>Search</button>
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Integrating with Chat</h2>
          <p className="mb-4">
            Use RAG with <code>useClarityChat</code> to provide document-based
            answers:
          </p>

          <EnhancedCodeBlock
            code={`import { useClarityChat, useRAGPipeline } from '@clarity-chat/react'
import { useState, useCallback } from 'react'

function ChatWithRAG() {
  const [context, setContext] = useState('')

  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
  })

  const {
    messages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    onRequest: async (messages) => {
      // Retrieve relevant documents before sending to API
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        const results = await rag.retrieve(lastMessage.content, 5)
        const contextText = results
          .map(r => r.metadata?.content || r.content)
          .join('\\n\\n')
        setContext(contextText)

        // Add context to system message
        return [
          {
            role: 'system',
            content: \`Use the following context to answer questions:\\n\\n\${contextText}\`,
          },
          ...messages,
        ]
      }
      return messages
    },
  })

  const handleSend = useCallback(async (message: string) => {
    await append({ role: 'user', content: message })
  }, [append])

  return (
    <div>
      {/* Chat UI */}
      <div>
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
      </div>
      {/* Show sources */}
      {context && (
        <div className="text-sm text-muted-foreground">
          Sources: {context.slice(0, 100)}...
        </div>
      )}
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Metadata Filtering</h2>
          <p className="mb-4">
            Use metadata filters to search specific documents or categories:
          </p>

          <EnhancedCodeBlock
            code={`import { useVectorStore } from '@clarity-chat/react'

function MetadataFilterExample() {
  const { search } = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      indexName: 'documents',
    },
  })

  const handleSearch = async (query: string, department: string) => {
    // Search only engineering documents
    const results = await search(query, {
      topK: 5,
      filter: {
        department: 'engineering',
        year: { $gte: 2024 }, // Only recent documents
      },
    })

    return results
  }

  return <button onClick={() => handleSearch('API changes', 'engineering')}>Search</button>
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Complete Example</h2>
          <p className="mb-4">
            Here's a complete RAG implementation with document indexing and chat
            integration:
          </p>

          <EnhancedCodeBlock
            code={`import { useState, useCallback } from 'react'
import { useClarityChat, useRAGPipeline, useVectorStore, useEmbeddings } from '@clarity-chat/react'

function CompleteRAGExample() {
  const [documents, setDocuments] = useState([])

  // Initialize RAG pipeline
  const rag = useRAGPipeline({
    vectorStore: 'pinecone',
    embeddingProvider: 'openai',
    apiKeys: {
      vectorStore: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      embeddings: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    },
    reranker: 'cohere',
  })

  // Vector store for indexing
  const { addDocuments } = useVectorStore({
    provider: 'pinecone',
    config: {
      apiKey: process.env.NEXT_PUBLIC_PINECONE_API_KEY,
      indexName: 'documents',
    },
  })

  // Embeddings for indexing
  const { generate } = useEmbeddings({
    provider: 'openai',
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  // Chat with RAG
  const {
    messages,
    append,
    isLoading,
  } = useClarityChat({
    api: '/api/chat',
    onRequest: async (messages) => {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === 'user') {
        // Retrieve relevant documents
        const results = await rag.retrieve(lastMessage.content, 5)
        const context = results
          .map(r => \`[Source: \${r.metadata?.source || 'unknown'}]\${r.metadata?.content || r.content}\`)
          .join('\\n\\n')

        return [
          {
            role: 'system',
            content: \`Answer questions using the following context. Cite sources when possible.\\n\\nContext:\\n\${context}\`,
          },
          ...messages,
        ]
      }
      return messages
    },
  })

  // Index a document
  const handleIndexDocument = useCallback(async (text: string, metadata: Record<string, any>) => {
    // Chunk
    const chunks = chunkSemantic(text, 1000)

    // Embed
    const embeddings = await Promise.all(
      chunks.map(chunk => generate(chunk))
    )

    // Store
    const vectors = chunks.map((chunk, i) => ({
      id: \`doc-\${Date.now()}-\${i}\`,
      content: chunk,
      embedding: embeddings[i],
      metadata: {
        ...metadata,
        chunkIndex: i,
        totalChunks: chunks.length,
      },
    }))

    await addDocuments(vectors)
    setDocuments(prev => [...prev, { id: metadata.id, chunks: vectors.length }])
  }, [generate, addDocuments])

  return (
    <div className="space-y-4">
      {/* Document indexing */}
      <div>
        <button onClick={() => handleIndexDocument('Document text...', { source: 'doc1.pdf' })}>
          Index Document
        </button>
        <p>Indexed: {documents.length} documents</p>
      </div>

      {/* Chat with RAG */}
      <div>
        {messages.map(msg => (
          <div key={msg.id}>{msg.content}</div>
        ))}
        <button onClick={() => append({ role: 'user', content: 'What is in the documents?' })}>
          Ask Question
        </button>
      </div>
    </div>
  )
}`}
            language="tsx"
            showLineNumbers
          />
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>

          <h3 className="text-2xl font-semibold mb-3">1. Chunk Size Matters</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Too small (100 chars): Loses context, poor results</li>
            <li>Too large (5000 chars): Wastes tokens, slow</li>
            <li>Sweet spot: 500-1500 characters</li>
            <li>Use 10-20% overlap between chunks</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            2. Use Semantic Chunking
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Split by paragraphs, sentences, or semantic boundaries</li>
            <li>Preserves context better than fixed-size chunking</li>
            <li>Better retrieval quality</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            3. Include Rich Metadata
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Store source, date, author, category in metadata</li>
            <li>Use metadata for filtering and citations</li>
            <li>Enables better document management</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">4. Use Reranking</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Retrieve more results (10-20), then rerank to top 3-5</li>
            <li>Improves relevance significantly</li>
            <li>Worth the extra API call for production</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            5. Update Embeddings
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Re-embed documents when content changes</li>
            <li>Delete old embeddings before adding new ones</li>
            <li>Track document versions in metadata</li>
          </ul>

          <h3 className="text-2xl font-semibold mb-3 mt-8">
            6. Monitor Quality
          </h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
            <li>Track retrieval relevance scores</li>
            <li>Monitor answer quality with user feedback</li>
            <li>Adjust chunk size and retrieval parameters based on results</li>
          </ul>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Common Pitfalls</h2>

          <Callout type="warning">
            <p>
              <strong>Chunk Size:</strong> Too small chunks lose context, too
              large chunks waste tokens. Find the right balance for your
              documents (typically 500-1500 characters).
            </p>
          </Callout>

          <Callout type="warning">
            <p>
              <strong>Overlap:</strong> Use 10-20% overlap between chunks.
              Otherwise information at chunk boundaries gets lost.
            </p>
          </Callout>

          <Callout type="warning">
            <p>
              <strong>Stale Embeddings:</strong> If you update a document,
              re-embed it! Old embeddings point to old content and won't reflect
              changes.
            </p>
          </Callout>

          <Callout type="warning">
            <p>
              <strong>Metadata:</strong> Always include source information in
              metadata for citations and document management.
            </p>
          </Callout>
        </section>

        <section>
          <h2 className="text-3xl font-semibold mb-4">Related</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>
              <a
                href="/reference/hooks/use-rag-pipeline"
                className="text-primary underline"
              >
                useRAGPipeline Hook
              </a>{' '}
              – RAG pipeline hook documentation
            </li>
            <li>
              <a
                href="/reference/hooks/use-vector-store"
                className="text-primary underline"
              >
                useVectorStore Hook
              </a>{' '}
              – Vector store hook documentation
            </li>
            <li>
              <a
                href="/reference/hooks/use-embeddings"
                className="text-primary underline"
              >
                useEmbeddings Hook
              </a>{' '}
              – Embeddings hook documentation
            </li>
            <li>
              <a
                href="/reference/components/citation-card"
                className="text-primary underline"
              >
                CitationCard Component
              </a>{' '}
              – Display document sources
            </li>
            <li>
              <a href="/guides/memory" className="text-primary underline">
                Memory System Guide
              </a>{' '}
              – Memory strategies for context management
            </li>
          </ul>
        </section>

        <Pagination
          previous={{
            title: 'Agent System Guide',
            href: '/guides/agents',
          }}
          next={{
            title: 'Getting Started',
            href: '/guides/getting-started',
          }}
        />
      </div>
    </>
  )
}
