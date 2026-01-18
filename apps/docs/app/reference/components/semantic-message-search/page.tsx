import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { Callout } from '@/components/MDX/Callout'
import { YouWillLearn } from '@/components/Enhanced/YouWillLearn'

export const metadata: Metadata = {
  title: 'SemanticMessageSearch - Clarity Chat Components',
  description:
    'Semantic search for messages using vector embeddings and similarity matching.',
}

const props: Prop[] = [
  {
    name: 'messages',
    type: 'Message[]',
    required: true,
    description: 'Array of messages to search through',
  },
  {
    name: 'config',
    type: 'Partial<SemanticSearchConfig>',
    description: 'Semantic search configuration',
  },
  {
    name: 'onResultsFound',
    type: '(results: SemanticSearchResult[]) => void',
    description: 'Callback when search results are found',
  },
  {
    name: 'onGenerateEmbedding',
    type: '(text: string) => Promise<number[]>',
    description: 'Custom embedding generation function',
  },
  {
    name: 'onRerank',
    type: '(query: string, results: SemanticSearchResult[]) => Promise<SemanticSearchResult[]>',
    description: 'Custom reranking function',
  },
  {
    name: 'showHistory',
    type: 'boolean',
    description: 'Show search history',
  },
  {
    name: 'placeholder',
    type: 'string',
    description: 'Placeholder text for search input',
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
          Semantic search for messages using vector embeddings and similarity
          matching for more accurate results.
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
          <strong>New in 2025:</strong> This component provides semantic search
          capabilities using vector embeddings, enabling more accurate and
          context-aware message search compared to keyword-based search.
        </p>
      </Callout>

      <section className="docs-section">
        <h2>Basic Usage</h2>
        <p>Search messages semantically with default configuration:</p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function ChatWithSemanticSearch({ messages }: { messages: Message[] }) {
  return (
    <div className="p-4">
      <SemanticMessageSearch
        messages={messages}
        config={{
          embeddings: {
            type: 'openai',
            model: 'text-embedding-3-small',
          },
          similarityThreshold: 0.7,
          maxResults: 10,
        }}
        onResultsFound={(results) => {
          logger.debug('Found', results.length, 'results')
          results.forEach((result) => {
            logger.debug('Message:', result.message.content, 'Score:', result.score)
          })
        }}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Embedding Providers</h2>
        <p>Configure different embedding providers:</p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function WithOpenAI({ messages }: { messages: Message[] }) {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        embeddings: {
          type: 'openai',
          model: 'text-embedding-3-small',
          // Note: apiKey should be configured server-side
        },
      }}
    />
  )
}

function WithCohere({ messages }: { messages: Message[] }) {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        embeddings: {
          type: 'cohere',
          model: 'embed-english-v3.0',
          // Note: apiKey should be configured server-side
        },
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Similarity Threshold</h2>
        <p>Configure similarity threshold for results:</p>
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
        <p>Enable caching for better performance:</p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CachedSearch({ messages }: { messages: Message[] }) {
  return (
    <SemanticMessageSearch
      messages={messages}
      config={{
        embeddings: {
          type: 'openai',
          model: 'text-embedding-3-small',
        },
        // Embeddings are automatically cached by the component
        similarityThreshold: 0.7,
        maxResults: 10,
      }}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Embeddings</h2>
        <p>Provide custom embeddings function:</p>
        <CodePlayground
          initialCode={`import { SemanticMessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

function CustomEmbeddings({ messages }: { messages: Message[] }) {
  const customEmbed = async (text: string): Promise<number[]> => {
    // Your custom embedding logic
    const response = await fetch('/api/embed', {
      method: 'POST',
      body: JSON.stringify({ text }),
    })
    if (!response.ok) {
      throw new Error('Failed to generate embedding')
    }
    return response.json()
  }

  return (
    <SemanticMessageSearch
      messages={messages}
      onGenerateEmbedding={customEmbed}
      config={{
        similarityThreshold: 0.7,
        maxResults: 10,
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
          <li>
            <strong>embeddings</strong>:{' '}
            <code>{'{ type, model, apiKey?, endpoint? }'}</code> - Embedding
            provider configuration
          </li>
          <li>
            <strong>hybrid</strong>:{' '}
            <code>{'{ enabled, semanticWeight }'}</code> - Hybrid search
            configuration (semantic + keyword)
          </li>
          <li>
            <strong>reranking</strong>:{' '}
            <code>{'{ enabled, provider, apiKey?, endpoint? }'}</code> -
            Optional reranking configuration
          </li>
          <li>
            <strong>similarityThreshold</strong>: <code>number</code> - Minimum
            similarity score (0-1)
          </li>
          <li>
            <strong>maxResults</strong>: <code>number</code> - Maximum number of
            results to return
          </li>
          <li>
            <strong>multiLanguage</strong>: <code>boolean</code> - Enable
            multi-language support
          </li>
          <li>
            <strong>queryExpansion</strong>: <code>boolean</code> - Enable query
            expansion with synonyms
          </li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ul>
          <li>
            Use <code>similarityThreshold</code> of 0.7-0.8 for balanced results
          </li>
          <li>Enable caching for frequently searched messages</li>
          <li>Use appropriate embedding models for your use case</li>
          <li>
            Limit <code>maxResults</code> for better performance
          </li>
          <li>Consider using semantic search for long conversations</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Related</h2>
        <ul>
          <li>
            <a href="/reference/components/message-search">MessageSearch</a> -
            Basic keyword search
          </li>
          <li>
            <a href="/reference/components/advanced-message-search">
              AdvancedMessageSearch
            </a>{' '}
            - Advanced search features
          </li>
          <li>
            <a href="/guides/rag">RAG Guide</a> - Retrieval-augmented generation
          </li>
          <li>
            <a href="/reference/utilities/embeddings">Embeddings Utilities</a> -
            Embedding utilities
          </li>
        </ul>
      </section>
    </div>
  )
}
