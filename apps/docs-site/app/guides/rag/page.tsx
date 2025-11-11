import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'RAG (Retrieval-Augmented Generation) Guide - Clarity Chat',
  description: 'Build powerful RAG applications with Clarity Chat\'s vector store integrations, document loaders, and embedding providers.',
}

export default function RAGGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>RAG (Retrieval-Augmented Generation) Guide</h1>
        <p className="docs-lead">
          Build powerful RAG applications with Clarity Chat's vector store integrations, document loaders, and embedding providers.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          RAG combines retrieval of relevant information with generation, allowing your AI assistant to answer questions using your own data. Clarity Chat provides:
        </p>
        <ul>
          <li><strong>Vector Stores:</strong> Pinecone, Qdrant, Weaviate, Chroma</li>
          <li><strong>Document Loaders:</strong> PDF, Markdown, HTML, and more</li>
          <li><strong>Embeddings:</strong> Multi-provider support (OpenAI, Cohere, etc.)</li>
          <li><strong>Reranking:</strong> Improve retrieval quality</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <h3>1. Set Up Vector Store</h3>
        <CodeBlock
          language="tsx"
          code={`import { PineconeVectorStore } from '@clarity-chat/react'

const vectorStore = new PineconeVectorStore({
  apiKey: process.env.PINECONE_API_KEY,
  indexName: 'documents',
  environment: 'us-east-1',
})`}
        />

        <h3>2. Load Documents</h3>
        <CodeBlock
          language="tsx"
          code={`import { PDFLoader } from '@clarity-chat/react'

const loader = new PDFLoader()
const documents = await loader.load('/path/to/document.pdf')

// Split into chunks
const chunks = await loader.splitDocuments(documents, {
  chunkSize: 1000,
  chunkOverlap: 200,
})`}
        />

        <h3>3. Generate Embeddings</h3>
        <CodeBlock
          language="tsx"
          code={`import { OpenAIEmbeddings } from '@clarity-chat/react'

const embeddings = new OpenAIEmbeddings({
  apiKey: process.env.OPENAI_API_KEY,
})

// Generate embeddings for chunks
const vectors = await embeddings.embedDocuments(
  chunks.map(chunk => chunk.content)
)`}
        />

        <h3>4. Store in Vector Database</h3>
        <CodeBlock
          language="tsx"
          code={`// Store documents with embeddings
await vectorStore.addDocuments(
  chunks.map((chunk, index) => ({
    id: \`chunk-\${index}\`,
    content: chunk.content,
    embedding: vectors[index],
    metadata: {
      source: 'document.pdf',
      page: chunk.metadata.page,
    },
  }))
)`}
        />

        <h3>5. Query and Retrieve</h3>
        <CodeBlock
          language="tsx"
          code={`// Generate query embedding
const queryEmbedding = await embeddings.embedQuery(userQuestion)

// Search for similar documents
const results = await vectorStore.similaritySearch({
  query: queryEmbedding,
  topK: 5,
  filter: { source: 'document.pdf' },
})

// Use retrieved context in chat
const context = results.map(r => r.content).join('\\n\\n')
const response = await chat({
  messages: [
    {
      role: 'system',
      content: \`Use the following context to answer: \${context}\`,
    },
    { role: 'user', content: userQuestion },
  ],
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/model-adapters">Model Adapters Guide</a> - Learn about AI providers</li>
          <li><a href="/guides/reranking">Reranking Guide</a> - Improve retrieval quality</li>
          <li><a href="/examples">Examples</a> - See RAG in action</li>
        </ul>
      </section>
    </div>
  )
}
