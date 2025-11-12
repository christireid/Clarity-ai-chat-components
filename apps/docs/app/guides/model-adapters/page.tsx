import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Model Adapters - Clarity Chat',
  description: 'Clarity Chat provides model-agnostic adapters that allow you to switch between different AI providers with a unified interface.',
}

export default function ModelAdaptersGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Model Adapters</h1>
        <p className="docs-lead">
          Clarity Chat provides model-agnostic adapters that allow you to switch between different AI providers (OpenAI, Anthropic, Google) with a unified interface.
        </p>
      </div>

      <section className="docs-section">
        <h2>Overview</h2>
        <p>
          Model adapters abstract away provider-specific differences, giving you a consistent API regardless of which AI model you&apos;re using. This makes it easy to:
        </p>
        <ul>
          <li>Switch between providers without code changes</li>
          <li>Support multiple models simultaneously</li>
          <li>Fallback to alternative models on errors</li>
          <li>Compare model performance</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Supported Providers</h2>

        <h3>OpenAI</h3>
        <CodeBlock
          language="tsx"
          code={`import { openAIAdapter, openAIModels } from '@clarity-chat/react'

const adapter = openAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
})

// Available models
const models = openAIModels
// ['gpt-4-turbo', 'gpt-4o', 'gpt-3.5-turbo', ...]`}
        />

        <h3>Anthropic (Claude)</h3>
        <CodeBlock
          language="tsx"
          code={`import { anthropicAdapter, anthropicModels } from '@clarity-chat/react'

const adapter = anthropicAdapter({
  apiKey: process.env.ANTHROPIC_API_KEY,
  defaultModel: 'claude-3-opus-20240229',
})

const models = anthropicModels
// ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', ...]`}
        />

        <h3>Google AI</h3>
        <CodeBlock
          language="tsx"
          code={`import { googleAdapter, googleModels } from '@clarity-chat/react'

const adapter = googleAdapter({
  apiKey: process.env.GOOGLE_AI_API_KEY,
  defaultModel: 'gemini-pro',
})

const models = googleModels
// ['gemini-pro', 'gemini-pro-vision', ...]`}
        />
      </section>

      <section className="docs-section">
        <h2>Basic Usage</h2>

        <h3>Creating an Adapter</h3>
        <CodeBlock
          language="tsx"
          code={`import { openAIAdapter } from '@clarity-chat/react'

const adapter = openAIAdapter({
  apiKey: process.env.OPENAI_API_KEY,
  defaultModel: 'gpt-4-turbo',
  maxTokens: 2000,
  temperature: 0.7,
})`}
        />

        <h3>Streaming Responses</h3>
        <CodeBlock
          language="tsx"
          code={`import { useStreamingSSE } from '@clarity-chat/react'
import { openAIAdapter } from '@clarity-chat/react'

function ChatComponent() {
  const adapter = openAIAdapter({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const { connect, disconnect, isConnected } = useStreamingSSE({
    url: '/api/chat/stream',
    adapter,
    onMessage: (chunk) => {
      // Handle streaming chunks
      console.log('Received:', chunk)
    },
  })

  const handleSend = async (message: string) => {
    await connect({
      messages: [{ role: 'user', content: message }],
    })
  }

  return (
    <div>
      <button onClick={handleSend}>Send</button>
      <button onClick={disconnect}>Stop</button>
    </div>
  )
}`}
        />

        <h3>Non-Streaming Requests</h3>
        <CodeBlock
          language="tsx"
          code={`const response = await adapter.complete({
  messages: [
    { role: 'user', content: 'Hello!' }
  ],
  model: 'gpt-4-turbo',
})

console.log(response.content)`}
        />
      </section>

      <section className="docs-section">
        <h2>Model Switching</h2>
        <p>
          Use the <code>ModelSelector</code> component to let users switch between models:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ModelSelector, openAIAdapter, anthropicAdapter } from '@clarity-chat/react'

const adapters = {
  'gpt-4': openAIAdapter({ apiKey: process.env.OPENAI_API_KEY }),
  'claude-3': anthropicAdapter({ apiKey: process.env.ANTHROPIC_API_KEY }),
}

function ChatWithModelSelector() {
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const adapter = adapters[selectedModel]

  return (
    <div>
      <ModelSelector
        models={[
          { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
          { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
        ]}
        selectedModel={selectedModel}
        onSelect={setSelectedModel}
      />
      {/* Use adapter for chat */}
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Cost Estimation</h2>
        <p>
          Adapters automatically track token usage and estimate costs:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useTokenTracker } from '@clarity-chat/react'

const { 
  inputTokens, 
  outputTokens, 
  estimatedCost 
} = useTokenTracker({
  messages,
  model: 'gpt-4-turbo',
  adapter: openAIAdapter({ apiKey: '...' }),
})

console.log(\`Cost: $\${estimatedCost.toFixed(4)}\`)`}
        />
      </section>

      <section className="docs-section">
        <h2>Error Handling &amp; Fallback</h2>
        <p>
          Implement automatic fallback to alternative models:
        </p>
        <CodeBlock
          language="tsx"
          code={`import { useModelFallback } from '@clarity-chat/react'

const { executeWithFallback } = useModelFallback({
  primaryAdapter: openAIAdapter({ apiKey: '...' }),
  fallbackAdapters: [
    anthropicAdapter({ apiKey: '...' }),
    googleAdapter({ apiKey: '...' }),
  ],
})

try {
  const response = await executeWithFallback({
    messages: [{ role: 'user', content: 'Hello!' }],
  })
} catch (error) {
  console.error('All models failed:', error)
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Custom Adapter</h2>
        <p>
          Create your own adapter for custom models:
        </p>
        <CodeBlock
          language="tsx"
          code={`import type { ModelAdapter } from '@clarity-chat/react'

const customAdapter: ModelAdapter = {
  name: 'custom-model',
  complete: async (options) => {
    const response = await fetch('https://api.custom-model.com/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: options.messages,
        model: options.model,
      }),
    })
    
    const data = await response.json()
    return {
      content: data.response,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
      },
    }
  },
  stream: async function* (options) {
    // Implement streaming
  },
  estimateCost: (tokens, model) => {
    // Custom cost calculation
    return tokens * 0.0001
  },
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Best Practices</h2>
        <ol>
          <li><strong>Environment Variables</strong>: Always store API keys in environment variables</li>
          <li><strong>Error Handling</strong>: Implement retry logic and fallbacks</li>
          <li><strong>Token Limits</strong>: Respect model-specific context windows</li>
          <li><strong>Cost Monitoring</strong>: Track usage to avoid unexpected bills</li>
          <li><strong>Rate Limiting</strong>: Implement rate limiting for production apps</li>
        </ol>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li><a href="/guides/streaming">Streaming Guide</a> - Learn about streaming responses</li>
          <li><a href="/guides/token-optimization">Token Optimization</a> - Optimize token usage</li>
          <li><a href="/guides/error-handling">Error Handling</a> - Handle errors gracefully</li>
          <li><a href="/reference/model-adapters">API Reference</a> - Complete adapter API</li>
        </ul>
      </section>
    </div>
  )
}
