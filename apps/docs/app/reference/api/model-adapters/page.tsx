import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Model Adapters API Reference - Clarity Chat',
  description: 'Complete API reference for the model adapter system.',
}

export default function ModelAdaptersAPIPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">API Reference</span>
        <h1>Model Adapters API</h1>
        <p className="docs-lead">
          Complete API reference for the model adapter system.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Model adapters provide a unified interface for multiple AI providers, enabling easy switching between OpenAI, Anthropic, Google AI, and custom implementations.
        </p>
      </section>

      <section className="docs-section">
        <h2>Core Interfaces</h2>

        <h3>ModelAdapter</h3>
        <p>
          The base interface that all adapters implement:
        </p>
        <CodeBlock
          language="typescript"
          code={`interface ModelAdapter {
  /** Adapter name */
  name: string
  
  /** Send a chat completion request */
  chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
  
  /** Stream chat completion tokens */
  stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
  
  /** Estimate cost based on token usage */
  estimateCost(usage: TokenUsage, model: string): number
}`}
        />

        <h3>ModelConfig</h3>
        <CodeBlock
          language="typescript"
          code={`interface ModelConfig {
  /** Provider name */
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  
  /** Model ID */
  model: string
  
  /** API key (optional, can use env vars) */
  apiKey?: string
  
  /** Custom API base URL */
  baseURL?: string
  
  /** Sampling temperature (0-2) */
  temperature?: number
  
  /** Maximum tokens to generate */
  maxTokens?: number
  
  /** Top-p sampling parameter */
  topP?: number
  
  /** Frequency penalty (-2 to 2) */
  frequencyPenalty?: number
  
  /** Presence penalty (-2 to 2) */
  presencePenalty?: number
  
  /** Stop sequences */
  stop?: string[]
  
  /** Streaming callbacks */
  streamOptions?: StreamOptions
  
  /** AbortSignal for cancellation */
  signal?: AbortSignal
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Adapters</h2>

        <h3>openAIAdapter</h3>
        <p>
          OpenAI GPT models adapter:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { openAIAdapter } from '@clarity-chat/react'

const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 1000
})`}
        />

        <h3>anthropicAdapter</h3>
        <CodeBlock
          language="typescript"
          code={`import { anthropicAdapter } from '@clarity-chat/react'

const response = await anthropicAdapter.chat(messages, {
  provider: 'anthropic',
  model: 'claude-3-opus',
  apiKey: process.env.ANTHROPIC_API_KEY
})`}
        />

        <h3>googleAdapter</h3>
        <CodeBlock
          language="typescript"
          code={`import { googleAdapter } from '@clarity-chat/react'

const response = await googleAdapter.chat(messages, {
  provider: 'google',
  model: 'gemini-pro',
  apiKey: process.env.GOOGLE_API_KEY
})`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/model-adapters">Model Adapters Guide</a> - Learn about adapters</li>
          <li><a href="/guides/streaming">Streaming Guide</a> - Learn about streaming</li>
          <li><a href="/reference/api/streaming-components">Streaming Components API</a> - Streaming components</li>
        </ul>
      </section>
    </div>
  )
}
