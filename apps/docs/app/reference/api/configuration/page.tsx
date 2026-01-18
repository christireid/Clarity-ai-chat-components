import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Configuration - Clarity Chat',
  description:
    'Configure Clarity Chat components and hooks with TypeScript-first options.',
}

export default function ConfigurationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Configuration</h1>
        <p className="docs-lead">
          Configure Clarity Chat components and hooks with TypeScript-first
          options for optimal performance and customization.
        </p>
      </div>

      <section className="docs-section">
        <h2>Global Configuration</h2>
        <p>
          Set default options for all Clarity Chat components using the
          provider:
        </p>

        <CodeBlock
          language="tsx"
          code={`import { ClarityChatProvider } from '@clarity-chat/react'

function App({ children }) {
  return (
    <ClarityChatProvider
      config={{
        // API endpoint for chat requests
        apiEndpoint: '/api/chat',

        // Default model settings
        model: {
          provider: 'openai',
          name: 'gpt-4-turbo',
          temperature: 0.7,
          maxTokens: 4096,
        },

        // Streaming options
        streaming: {
          enabled: true,
          throttleMs: 50,
        },

        // UI defaults
        theme: 'system',
        locale: 'en-US',
      }}
    >
      {children}
    </ClarityChatProvider>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>Configure sensitive values using environment variables:</p>

        <CodeBlock
          language="bash"
          code={`# Required
OPENAI_API_KEY=sk-...

# Optional: Model configuration
OPENAI_MODEL=gpt-4-turbo
OPENAI_MAX_TOKENS=4096

# Optional: Vector database for RAG
PINECONE_API_KEY=...
PINECONE_ENVIRONMENT=us-west1-gcp
PINECONE_INDEX=clarity-chat

# Optional: Redis for caching
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=...`}
        />

        <Callout type="warning" title="Security">
          Never expose API keys in client-side code. Use server-side API routes
          to proxy requests to LLM providers.
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Component Configuration</h2>

        <h3>ClarityChat</h3>
        <CodeBlock
          language="tsx"
          code={`<ClarityChat
  // API configuration
  api="/api/chat"
  headers={{ 'X-Custom-Header': 'value' }}

  // Model settings
  model="gpt-4-turbo"
  temperature={0.7}
  maxTokens={4096}

  // Features
  enableStreaming={true}
  enableMemory={true}
  enableFileUpload={true}

  // UI customization
  theme={customTheme}
  className="my-chat"
  placeholder="Ask me anything..."

  // Callbacks
  onMessage={(msg) => logger.debug('New message:', msg)}
  onError={(err) => console.error('Error:', err)}
  onStreamStart={() => logger.debug('Stream started')}
  onStreamEnd={() => logger.debug('Stream ended')}
/>`}
        />

        <h3>Hook Configuration</h3>
        <CodeBlock
          language="tsx"
          code={`const { messages, sendMessage, isLoading } = useClarityChat({
  // API endpoint
  api: '/api/chat',

  // Initial messages
  initialMessages: [],

  // Request options
  body: { customField: 'value' },
  headers: { 'Authorization': 'Bearer token' },

  // Streaming
  streamProtocol: 'sse', // or 'websocket'

  // Memory
  memoryKey: 'user-123',
  maxHistoryLength: 50,

  // Callbacks
  onResponse: (response) => {},
  onFinish: (message) => {},
  onError: (error) => {},
})`}
        />
      </section>

      <section className="docs-section">
        <h2>TypeScript Configuration</h2>
        <p>Extend types for your specific use case:</p>

        <CodeBlock
          language="tsx"
          code={`// types/clarity-chat.d.ts
import '@clarity-chat/types'

declare module '@clarity-chat/types' {
  interface MessageMetadata {
    // Add custom metadata fields
    ticketId?: string
    priority?: 'low' | 'medium' | 'high'
    department?: string
  }

  interface ChatConfig {
    // Add custom config fields
    tenantId: string
    features: string[]
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Performance Tuning</h2>

        <CodeBlock
          language="tsx"
          code={`<ClarityChatProvider
  config={{
    performance: {
      // Message virtualization threshold
      virtualizeAfter: 100,

      // Debounce input (ms)
      inputDebounce: 150,

      // Stream chunk batching
      streamBatchSize: 5,
      streamBatchDelayMs: 16,

      // Memory limits
      maxCachedConversations: 10,
      maxMessagesPerConversation: 500,
    },
  }}
>
  {children}
</ClarityChatProvider>`}
        />
      </section>

      <section className="docs-section">
        <h2>Related Resources</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <a href="/guides/theming" className="docs-card">
            <strong>Theming Guide</strong>
            <span>Customize appearance and colors</span>
          </a>
          <a href="/guides/performance" className="docs-card">
            <strong>Performance Guide</strong>
            <span>Optimize for production</span>
          </a>
          <a href="/reference/api/types" className="docs-card">
            <strong>Type Definitions</strong>
            <span>Full TypeScript reference</span>
          </a>
          <a href="/cookbook/custom-theming" className="docs-card">
            <strong>Custom Theming Recipe</strong>
            <span>Build custom themes</span>
          </a>
        </div>
      </section>
    </div>
  )
}
