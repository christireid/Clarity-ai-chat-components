import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'SemanticMessageSearch - Clarity Chat Components',
  description: 'Semantic search for messages using vector embeddings and similarity matching.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to search',
  },
  {
    name: 'onSelect',
    type: '(message: Message) => void',
    description: 'Callback when a message is selected',
  },
  {
    name: 'config',
    type: 'Partial<SemanticSearchConfig>',
    description: 'Semantic search configuration',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes',
  },
]

export default function SemanticMessageSearchPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Component</span>
        <h1>SemanticMessageSearch</h1>
        <p className="docs-lead">
          Semantic search for messages using vector embeddings and similarity matching for more accurate results.
        </p>
      </div>

      <YouWillLearn
        items={[
          'Search messages using semantic similarity',
          'Configure embedding providers',
          'Set similarity thresholds',
          'Handle search results',
          'Optimize search performance',
        ]}
      />

      <Callout type="info" className="my-6">
        <p>
          <strong>New in 2025:</strong> This component provides semantic search capabilities using vector
          embeddings, enabling more accurate and context-aware message search compared to keyword-based search.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>
          Search messages semantically with default configuration:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function ChatWithSemanticSearch() {
  const [messages, setMessages] = React.useState([])

  return (
    <div className="p-4">
      <SemanticMessageSearch
        messages={messages}
        config={{
          provider: { type: 'openai', model: 'text-embedding-3-small' },
          similarityThreshold: 0.7,
          maxResults: 10,
        }}
        onSelect={(message) => {
          console.log('Selected message:', message)
        }}
      />
    </div>
  )
}

render(<ChatWithSemanticSearch />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Embedding Providers</h2>
        <p>
          Configure different embedding providers:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function WithOpenAI() {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        provider: {
          type: 'openai',
          model: 'text-embedding-3-small',
          apiKey: process.env.OPENAI_API_KEY,
        },
      }}
    />
  )
}

function WithCohere() {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        provider: {
          type: 'cohere',
          model: 'embed-english-v3.0',
          apiKey: process.env.COHERE_API_KEY,
        },
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Similarity Threshold</h2>
        <p>
          Configure similarity threshold for results:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function ThresholdSearch() {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        similarityThreshold: 0.8,  // Higher = more strict matching
        maxResults: 5,
      }}
      onSelect={(message) => {
        // Only highly similar messages will appear
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Caching</h2>
        <p>
          Enable caching for better performance:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function CachedSearch() {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        provider: { type: 'openai', model: 'text-embedding-3-small' },
        enableCaching: true,
        cacheTTL: 3600000,  // 1 hour
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Embeddings</h2>
        <p>
          Provide custom embeddings function:
        </p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'

function CustomEmbeddings() {
  const customEmbed = async (text: string) => {
    // Your custom embedding logic
    const response = await fetch('/api/embed', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    return response.json()
  }

  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        customEmbeddingFn: customEmbed,
        similarityThreshold: 0.7,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Props</h2>
        <PropsTable props={props} />
      </section>

      <section className="docs-section">
        <h2>Configuration Options</h2>
        <ul>
          <li><strong>provider</strong>: <code>{'{ type, model, apiKey? }'}</code> - Embedding provider configuration</li>
          <li><strong>similarityThreshold</strong>: <code>number</code> - Minimum similarity score (0-1)</li>
          <li><strong>maxResults</strong>: <code>number</code> - Maximum number of results to return</li>
          <li><strong>enableCaching</strong>: <code>boolean</code> - Enable embedding caching</li>
          <li><strong>cacheTTL</strong>: <code>number</code> - Cache time-to-live in milliseconds</li>
          <li><strong>customEmbeddingFn</strong>: <code>{'(text: string) => Promise<number[]>'}</code> - Custom embedding function</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>Use <code>similarityThreshold</code> of 0.7-0.8 for balanced results</li>
          <li>Enable caching for frequently searched messages</li>
          <li>Use appropriate embedding models for your use case</li>
          <li>Limit <code>maxResults</code> for better performance</li>
          <li>Consider using semantic search for long conversations</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li><a href="/reference/components/message-search">MessageSearch</a> - Basic keyword search</li>
          <li><a href="/reference/components/advanced-message-search">AdvancedMessageSearch</a> - Advanced search features</li>
          <li><a href="/guides/rag">RAG Guide</a> - Retrieval-augmented generation</li>
          <li><a href="/reference/utilities/embeddings">Embeddings Utilities</a> - Embedding utilities</li>
        </ul>
      </section>
    </div>
  )
}
