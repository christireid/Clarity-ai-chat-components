import type { Metadata } from 'next'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { Pagination } from '@/components/Navigation/Pagination'

export const metadata: Metadata = {
  title: 'createRAGEngine | Clarity Chat',
  description:
    'Factory function for creating RAG (Retrieval Augmented Generation) engines with multiple chunking strategies and built-in TF-IDF similarity matching.',
}

const ragConfigProps: Prop[] = [
  {
    name: 'sources',
    type: 'RAGSource[]',
    description: 'Array of document sources to index (text, URL, file, or pre-chunked).',
  },
  {
    name: 'chunking.strategy',
    type: '"fixed" | "sentence" | "paragraph" | "balanced"',
    default: '"balanced"',
    description: 'Text chunking strategy. Balanced tries to maintain semantic coherence.',
  },
  {
    name: 'chunking.maxTokens',
    type: 'number',
    default: '500',
    description: 'Maximum tokens per chunk.',
  },
  {
    name: 'chunking.overlap',
    type: 'number',
    default: '50',
    description: 'Token overlap between chunks for context continuity.',
  },
  {
    name: 'topK',
    type: 'number',
    default: '3',
    description: 'Number of top chunks to retrieve per query.',
  },
  {
    name: 'similarityThreshold',
    type: 'number',
    default: '0.1',
    description: 'Minimum similarity score (0-1) for chunk retrieval.',
  },
  {
    name: 'showCitations',
    type: 'boolean',
    default: 'true',
    description: 'Include source citations in query results.',
  },
]

const queryResultProps: Prop[] = [
  {
    name: 'chunks',
    type: 'Array<{ chunk: RAGChunk; score: number }>',
    description: 'Retrieved chunks with similarity scores.',
  },
  {
    name: 'context',
    type: 'string',
    description: 'Formatted context string ready for LLM injection.',
  },
  {
    name: 'citations',
    type: 'Array<{ sourceIndex: number; sourceType: string; excerpt: string }>',
    description: 'Source citations for transparency.',
  },
  {
    name: 'queryTimeMs',
    type: 'number',
    description: 'Query execution time in milliseconds.',
  },
]

const statsProps: Prop[] = [
  {
    name: 'sourceCount',
    type: 'number',
    description: 'Total number of indexed sources.',
  },
  {
    name: 'chunkCount',
    type: 'number',
    description: 'Total number of chunks in the engine.',
  },
  {
    name: 'totalTokens',
    type: 'number',
    description: 'Estimated total tokens across all chunks.',
  },
  {
    name: 'vocabularySize',
    type: 'number',
    description: 'Size of the TF-IDF vocabulary.',
  },
  {
    name: 'averageChunkSize',
    type: 'number',
    description: 'Average tokens per chunk.',
  },
]

export default function CreateRAGEnginePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>createRAGEngine</h1>

      <p className="lead">
        Factory function that creates a RAG (Retrieval Augmented Generation) engine
        for document-based chat responses. Features multiple chunking strategies,
        TF-IDF similarity matching, and automatic citation tracking.
      </p>

      <Callout type="info">
        <p>
          For React components, consider using{' '}
          <Link href="/reference/components/clarity-chat-app">
            ClarityChatApp
          </Link>{' '}
          with the <code>preset=&quot;rag&quot;</code> option for automatic RAG integration.
          <code>createRAGEngine</code> is for non-React contexts, server-side usage,
          or custom RAG pipelines.
        </p>
      </Callout>

      <section className="my-12">
        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import {
  createRAGEngine,
  initializeRAG,
  queryRAG,
  addSources,
  clearRAG,
  getRAGStats,
  chunkText,
} from '@clarity-chat/react'

import type { RAGSource, RAGConfig, RAGQueryResult, RAGEngineState } from '@clarity-chat/react'`}
          language="tsx"
        />
      </section>

      <section className="my-12">
        <h2 id="basic-usage">Basic Usage</h2>

        <p>Create a RAG engine, add documents, and query for relevant context:</p>

        <EnhancedCodeBlock
          code={`import { createRAGEngine, initializeRAG, queryRAG } from '@clarity-chat/react'

// 1. Create a new engine
let engine = createRAGEngine()

// 2. Add document sources
const sources = [
  { type: 'text', content: 'React is a JavaScript library for building UIs...' },
  { type: 'text', content: 'Next.js is a React framework for production...' },
]

const config = {
  chunking: { strategy: 'balanced', maxTokens: 500, overlap: 50 },
  topK: 3,
}

// 3. Initialize with sources (async)
engine = await initializeRAG(engine, sources, config)

// 4. Query for relevant context
const result = queryRAG(engine, 'How do I build a React app?')

console.log(result.context)
// => "[Source 1]: React is a JavaScript library..."

console.log(result.citations)
// => [{ sourceIndex: 0, sourceType: 'text', excerpt: 'React is...' }]`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="source-types">Source Types</h2>

        <p>RAG supports four source types for maximum flexibility:</p>

        <EnhancedCodeBlock
          code={`import { initializeRAG, createRAGEngine } from '@clarity-chat/react'

let engine = createRAGEngine()

// Text source (most common)
const textSource = {
  type: 'text',
  content: 'Your documentation content here...',
  metadata: { title: 'API Docs', category: 'reference' }
}

// URL source (fetches and processes content)
const urlSource = {
  type: 'url',
  url: 'https://docs.example.com/guide',
  metadata: { source: 'official-docs' }
}

// File source (reads File object)
const fileSource = {
  type: 'file',
  file: document.querySelector('input[type=file]').files[0],
  metadata: { filename: 'user-upload.txt' }
}

// Pre-chunked source (when you've already chunked)
const chunkedSource = {
  type: 'chunks',
  chunks: [
    { content: 'First chunk...', metadata: { page: 1 } },
    { content: 'Second chunk...', metadata: { page: 2 } },
  ]
}

engine = await initializeRAG(engine, [
  textSource,
  urlSource,
  fileSource,
  chunkedSource
], {})`}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">text</h3>
            <p className="text-muted-foreground text-sm">
              Raw text content. Best for documentation, knowledge bases, and
              preprocessed content.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">url</h3>
            <p className="text-muted-foreground text-sm">
              Fetches content from URL. Requires server-side processing for
              full functionality.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">file</h3>
            <p className="text-muted-foreground text-sm">
              Browser File object. Perfect for user uploads and local documents.
            </p>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold text-lg">chunks</h3>
            <p className="text-muted-foreground text-sm">
              Pre-chunked content. Use when you have custom chunking logic or
              pre-processed data.
            </p>
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 id="chunking-strategies">Chunking Strategies</h2>

        <p>Choose the right chunking strategy for your content:</p>

        <EnhancedCodeBlock
          code={`import { chunkText } from '@clarity-chat/react'

const longDocument = \`
  React is a JavaScript library for building user interfaces.
  It was developed by Facebook and is now maintained by Meta.

  Components are the building blocks of React applications.
  They let you split the UI into independent, reusable pieces.

  ...more content...
\`

// Fixed: Simple character-based chunking
const fixedChunks = chunkText(longDocument, 'fixed', 500, 50)

// Sentence: Respects sentence boundaries
const sentenceChunks = chunkText(longDocument, 'sentence', 500, 50)

// Paragraph: Respects paragraph boundaries
const paragraphChunks = chunkText(longDocument, 'paragraph', 500, 50)

// Balanced: Intelligent chunking that maintains semantic coherence (default)
const balancedChunks = chunkText(longDocument, 'balanced', 500, 50)`}
          language="tsx"
          showLineNumbers
        />

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Strategy Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Strategy</th>
                <th className="text-left p-2">Best For</th>
                <th className="text-left p-2">Trade-offs</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-mono">fixed</td>
                <td className="p-2">Uniform chunk sizes, predictable token counts</td>
                <td className="p-2">May split mid-sentence</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono">sentence</td>
                <td className="p-2">Conversational content, FAQs</td>
                <td className="p-2">Variable chunk sizes</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-mono">paragraph</td>
                <td className="p-2">Structured documents, articles</td>
                <td className="p-2">Large paragraphs may be split</td>
              </tr>
              <tr>
                <td className="p-2 font-mono">balanced</td>
                <td className="p-2">General purpose (recommended)</td>
                <td className="p-2">Slightly more processing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="my-12">
        <h2 id="incremental-updates">Incremental Updates</h2>

        <p>Add sources to an existing engine without rebuilding:</p>

        <EnhancedCodeBlock
          code={`import { createRAGEngine, initializeRAG, addSources, clearRAG } from '@clarity-chat/react'

// Initial setup
let engine = createRAGEngine()
engine = await initializeRAG(engine, [
  { type: 'text', content: 'Initial documentation...' }
], {})

// Later: Add more sources
engine = await addSources(engine, [
  { type: 'text', content: 'New content to add...' },
  { type: 'text', content: 'More new content...' }
], {})

// Note: Adding sources rebuilds the TF-IDF vocabulary
// for accurate similarity matching across all content

// Clear all sources when needed
engine = clearRAG() // Returns fresh engine state`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="query-results">Working with Query Results</h2>

        <p>Query results include context, chunks, and citations:</p>

        <EnhancedCodeBlock
          code={`import { queryRAG } from '@clarity-chat/react'

const result = queryRAG(
  engine,
  'How do I handle state in React?',
  5,    // topK: retrieve top 5 chunks
  0.2   // similarityThreshold: minimum 0.2 similarity
)

// Pre-formatted context for LLM injection
console.log(result.context)
// "[Source 1]: React state is managed using hooks like useState...
//  [Source 2]: For complex state, consider useReducer..."

// Individual chunks with scores
result.chunks.forEach(({ chunk, score }) => {
  console.log(\`Score: \${score.toFixed(3)}\`)
  console.log(\`Content: \${chunk.content}\`)
  console.log(\`Tokens: \${chunk.tokens}\`)
  console.log(\`Source: \${chunk.sourceType} #\${chunk.sourceIndex}\`)
})

// Citations for transparency
result.citations.forEach((citation, i) => {
  console.log(\`[\${i + 1}] \${citation.sourceType}: \${citation.excerpt}\`)
})

// Performance metrics
console.log(\`Query completed in \${result.queryTimeMs}ms\`)`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="with-llm">Integrating with LLM Chat</h2>

        <p>Inject RAG context into your LLM prompts:</p>

        <EnhancedCodeBlock
          code={`import { createRAGEngine, initializeRAG, queryRAG } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

// Setup RAG engine
let engine = createRAGEngine()
engine = await initializeRAG(engine, [
  { type: 'text', content: 'Your knowledge base content...' }
], { chunking: { strategy: 'balanced' } })

function ChatWithRAG() {
  const chat = useClarityChat({
    api: '/api/chat',
    onBeforeSend: async (messages) => {
      // Get relevant context for the user's question
      const lastMessage = messages[messages.length - 1]
      const ragResult = queryRAG(engine, lastMessage.content)

      // Inject context into system prompt
      return {
        ...messages,
        systemPrompt: \`You are a helpful assistant. Use the following context to answer:

\${ragResult.context}

If the context doesn't contain relevant information, say so.\`
      }
    }
  })

  return <ChatWindow messages={chat.messages} isLoading={chat.isLoading} onSendMessage={chat.append} />
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="statistics">Engine Statistics</h2>

        <p>Monitor your RAG engine performance:</p>

        <EnhancedCodeBlock
          code={`import { getRAGStats } from '@clarity-chat/react'

const stats = getRAGStats(engine)

console.log(\`Sources: \${stats.sourceCount}\`)
console.log(\`Chunks: \${stats.chunkCount}\`)
console.log(\`Total tokens: \${stats.totalTokens}\`)
console.log(\`Vocabulary size: \${stats.vocabularySize}\`)
console.log(\`Avg chunk size: \${stats.averageChunkSize} tokens\`)`}
          language="tsx"
          showLineNumbers
        />

        <PropsTable props={statsProps} />
      </section>

      <section className="my-12">
        <h2 id="config">RAGConfig Options</h2>
        <PropsTable props={ragConfigProps} />
      </section>

      <section className="my-12">
        <h2 id="query-result">RAGQueryResult</h2>
        <PropsTable props={queryResultProps} />
      </section>

      <section className="my-12">
        <h2 id="type-definitions">Type Definitions</h2>

        <EnhancedCodeBlock
          code={`// Source types for RAG
type RAGSource =
  | { type: 'text'; content: string; metadata?: Record<string, unknown> }
  | { type: 'url'; url: string; metadata?: Record<string, unknown> }
  | { type: 'file'; file: File; metadata?: Record<string, unknown> }
  | { type: 'chunks'; chunks: Array<{ content: string; metadata?: Record<string, unknown> }> }

// Configuration
interface RAGConfig {
  sources?: RAGSource[]
  chunking?: {
    strategy?: 'fixed' | 'sentence' | 'paragraph' | 'balanced'
    maxTokens?: number
    overlap?: number
  }
  topK?: number
  similarityThreshold?: number
  showCitations?: boolean
}

// Engine state (internal)
interface RAGEngineState {
  chunks: RAGChunk[]
  vocabulary: Map<string, number>
  idfScores: Map<string, number>
  initialized: boolean
  sourceCount: number
}

// Individual chunk
interface RAGChunk {
  id: string
  content: string
  sourceIndex: number
  sourceType: RAGSource['type']
  metadata?: Record<string, unknown>
  tokens: number
  embedding: number[]
}

// Query result
interface RAGQueryResult {
  chunks: Array<{ chunk: RAGChunk; score: number }>
  context: string
  citations: Array<{
    sourceIndex: number
    sourceType: string
    excerpt: string
  }>
  queryTimeMs: number
}`}
          language="tsx"
          showLineNumbers
        />
      </section>

      <section className="my-12">
        <h2 id="how-it-works">How It Works</h2>

        <div className="p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-4">TF-IDF Similarity Matching</h3>
          <p className="text-muted-foreground mb-4">
            createRAGEngine uses a TF-IDF (Term Frequency-Inverse Document Frequency)
            approach for similarity matching. This is a proven, efficient technique that
            works well for most use cases without requiring external embedding APIs.
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-sm">
            <li>
              <strong>Tokenization:</strong> Text is split into words, normalized to lowercase,
              and filtered (words {'>'} 2 characters).
            </li>
            <li>
              <strong>Vocabulary Building:</strong> A vocabulary index is created from all chunks.
            </li>
            <li>
              <strong>IDF Calculation:</strong> Inverse document frequency scores weight
              rare terms higher than common ones.
            </li>
            <li>
              <strong>TF-IDF Embeddings:</strong> Each chunk gets a normalized TF-IDF vector.
            </li>
            <li>
              <strong>Cosine Similarity:</strong> Query vectors are compared to chunk vectors
              using cosine similarity for ranking.
            </li>
          </ol>
        </div>

        <Callout type="tip">
          <p>
            For production applications with large document sets or semantic understanding
            requirements, consider using{' '}
            <Link href="/reference/hooks/use-rag-pipeline">useRAGPipeline</Link>{' '}
            which supports external vector stores (Pinecone, Qdrant, Weaviate) and
            embedding providers (OpenAI, Cohere).
          </p>
        </Callout>
      </section>

      <section className="my-12">
        <h2 id="best-practices">Best Practices</h2>

        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Use balanced chunking</strong>: The balanced strategy maintains
              semantic coherence while respecting token limits - best for most use cases.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Set appropriate overlap</strong>: 10-20% overlap (50-100 tokens for
              500 token chunks) helps maintain context across chunk boundaries.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Include metadata</strong>: Add source names, categories, and timestamps
              to chunks for better citation and filtering.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-green-500">✓</span>
            <div>
              <strong>Tune similarityThreshold</strong>: Start with 0.1-0.2 and adjust based
              on result quality. Higher values mean stricter matching.
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-amber-500">⚠</span>
            <div>
              <strong>Watch vocabulary size</strong>: Very large document sets may benefit
              from external vector stores for better performance.
            </div>
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 id="related">Related</h2>

        <ul>
          <li>
            <Link href="/reference/components/clarity-chat-app">
              ClarityChatApp
            </Link>{' '}
            - Full chat component with RAG preset
          </li>
          <li>
            <Link href="/reference/hooks/use-rag-pipeline">
              useRAGPipeline
            </Link>{' '}
            - React hook for vector store RAG
          </li>
          <li>
            <Link href="/reference/utilities/create-tools-engine">
              createToolsEngine
            </Link>{' '}
            - Tool calling engine
          </li>
          <li>
            <Link href="/guides/rag">RAG Guide</Link> - Understanding RAG patterns
          </li>
        </ul>
      </section>

      <Pagination
        previous={{
          title: 'createMemoryStore',
          href: '/reference/utilities/create-memory-store',
        }}
        next={{
          title: 'createToolsEngine',
          href: '/reference/utilities/create-tools-engine',
        }}
      />
    </>
  )
}
