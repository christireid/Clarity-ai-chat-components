'use client'

import { CodeBlock } from '@clarity-chat/react'
import { FeedbackWidget } from '@/components/FeedbackWidget'
import { CollapsibleSection } from '@/components/CollapsibleSection'

export default function AdaptersPage() {
  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <div className="space-y-2 mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-4xl font-bold tracking-tight">Model Adapters</h1>
          <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">Adapters</span>
        </div>
        <p className="text-xl text-muted-foreground">
          Unified interface for AI providers (OpenAI, Anthropic, Google). Hot-swap providers at runtime without code changes.
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Quick Start</h2>
        <p className="text-muted-foreground mb-4">
          Get started with model adapters in under 2 minutes
        </p>
        <CodeBlock
          code={`import {
  openAIAdapter,
  anthropicAdapter,
  googleAdapter,
  getAdapter,
  allModels,
} from '@clarity-chat/react/adapters'

// Use a specific adapter
const response = await openAIAdapter.chat(
  [{ role: 'user', content: 'Hello!' }],
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    apiKey: 'sk-...',
    temperature: 0.7,
  }
)

// Get adapter dynamically
const adapter = getAdapter('anthropic')
const stream = adapter.stream(messages, config)

// Stream responses
for await (const chunk of stream) {
  if (chunk.type === 'token') {
    console.log(chunk.content)
  }
}`}
          language="tsx"
        />
      </section>

      {/* Why Adapters */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-4">Why Model Adapters?</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-semibold">Provider-Agnostic Code</h4>
            <p className="text-sm text-muted-foreground">
              Write once, deploy anywhere. Same API for OpenAI, Anthropic, and Google.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Runtime Hot-Swapping</h4>
            <p className="text-sm text-muted-foreground">
              Switch providers at runtime based on user preference, cost, or availability.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Built-in Cost Estimation</h4>
            <p className="text-sm text-muted-foreground">
              Each adapter calculates estimated costs based on 2025 pricing.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Security First</h4>
            <p className="text-sm text-muted-foreground">
              API keys must be explicitly provided. No process.env fallback prevents frontend exposure.
            </p>
          </div>
        </div>
      </section>

      {/* Provider-Specific Adapters */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Provider Adapters</h2>
        <p className="text-muted-foreground mb-4">
          Pre-configured adapters for major AI providers
        </p>

        <div className="space-y-4">
          <CollapsibleSection title="OpenAI Adapter" defaultOpen>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                OpenAI adapter supports GPT-4o, GPT-4, GPT-3.5, and o1 reasoning models.
              </p>
              <CodeBlock
                code={`import { openAIAdapter, openAIModels } from '@clarity-chat/react/adapters'

// Non-streaming chat
const response = await openAIAdapter.chat(
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Explain quantum computing.' }
  ],
  {
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY!, // Server-side only
    temperature: 0.7,
    maxTokens: 2048,
  }
)

// Streaming with callbacks
const stream = openAIAdapter.stream(messages, {
  ...config,
  streamOptions: {
    onToken: (token) => process.stdout.write(token),
    onToolCall: (tool) => console.log('Tool called:', tool.function.name),
  },
})

for await (const chunk of stream) {
  if (chunk.type === 'done' && chunk.usage) {
    console.log('Cost:', chunk.usage.estimatedCost)
  }
}

// Available models
console.log(openAIModels.map(m => m.id))
// ['gpt-4o', 'gpt-4o-mini', 'o1', 'o1-mini', 'gpt-4-turbo', 'gpt-3.5-turbo']`}
                language="tsx"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Anthropic Adapter">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Anthropic adapter supports Claude 3.5 Sonnet, Claude 3.5 Haiku, and Claude 3 Opus.
              </p>
              <CodeBlock
                code={`import { anthropicAdapter, anthropicModels } from '@clarity-chat/react/adapters'

// Non-streaming chat
const response = await anthropicAdapter.chat(
  [
    { role: 'system', content: 'You are Claude, a helpful assistant.' },
    { role: 'user', content: 'Write a haiku about programming.' }
  ],
  {
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-latest',
    apiKey: process.env.ANTHROPIC_API_KEY!,
    maxTokens: 4096,
  }
)

// Streaming
const stream = anthropicAdapter.stream(messages, {
  provider: 'anthropic',
  model: 'claude-3-5-haiku-latest',
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

for await (const chunk of stream) {
  if (chunk.type === 'token') {
    process.stdout.write(chunk.content!)
  }
}

// Available models
console.log(anthropicModels.map(m => m.id))
// ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest', ...]`}
                language="tsx"
              />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Google Adapter">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Google adapter supports Gemini 2.0 and Gemini 1.5 models with up to 2M token context.
              </p>
              <CodeBlock
                code={`import { googleAdapter, googleModels } from '@clarity-chat/react/adapters'

// Non-streaming chat
const response = await googleAdapter.chat(
  [{ role: 'user', content: 'Summarize this document...' }],
  {
    provider: 'google',
    model: 'gemini-1.5-pro-latest',
    apiKey: process.env.GOOGLE_API_KEY!,
    temperature: 0.5,
  }
)

// Streaming
const stream = googleAdapter.stream(messages, {
  provider: 'google',
  model: 'gemini-2.0-flash-exp', // Free during preview!
  apiKey: process.env.GOOGLE_API_KEY!,
})

// Available models
console.log(googleModels.map(m => m.id))
// ['gemini-2.0-flash-exp', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-8b']

// Gemini 1.5 Pro has 2M token context window - largest available
const geminiPro = googleModels.find(m => m.id === 'gemini-1.5-pro-latest')
console.log(geminiPro?.contextWindow) // 2000000`}
                language="tsx"
              />
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* Dynamic Provider Selection */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Dynamic Provider Selection</h2>
        <p className="text-muted-foreground mb-4">
          Switch providers at runtime based on user preference or conditions
        </p>
        <CodeBlock
          code={`import {
  getAdapter,
  allModels,
  createAdapterRegistry,
} from '@clarity-chat/react/adapters'

// Get adapter by provider name
function handleChat(provider: 'openai' | 'anthropic' | 'google') {
  const adapter = getAdapter(provider)

  return adapter.chat(messages, {
    provider,
    model: getBestModel(provider),
    apiKey: getApiKey(provider),
  })
}

// All models from all providers
const models = allModels
// [
//   { id: 'gpt-4o', provider: 'openai', ... },
//   { id: 'claude-3-5-sonnet-latest', provider: 'anthropic', ... },
//   { id: 'gemini-2.0-flash-exp', provider: 'google', ... },
//   ...
// ]

// Filter by capability
const visionModels = allModels.filter(m => m.vision)
const cheapModels = allModels.filter(m => m.cost === 'low')
const fastModels = allModels.filter(m => m.speed === 'fast')

// Create custom registry for hot-swapping
const registry = createAdapterRegistry()
registry.register('openai', openAIFormalizedAdapter)
registry.register('anthropic', anthropicFormalizedAdapter)

// Check what's registered
console.log(registry.providers()) // ['openai', 'anthropic']
console.log(registry.has('google')) // false`}
          language="tsx"
        />
      </section>

      {/* Model Information */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Available Models</h2>
        <p className="text-muted-foreground mb-4">
          Complete list of supported models with capabilities
        </p>

        <div className="space-y-4">
          <CollapsibleSection title="OpenAI Models" defaultOpen>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-left p-3 font-medium">Context</th>
                    <th className="text-left p-3 font-medium">Speed</th>
                    <th className="text-left p-3 font-medium">Cost</th>
                    <th className="text-left p-3 font-medium">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">gpt-4o</td>
                    <td className="p-3">128K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">gpt-4o-mini</td>
                    <td className="p-3">128K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Low</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">o1</td>
                    <td className="p-3">200K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-800 rounded">Slow</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">High</span></td>
                    <td className="p-3">Streaming, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">o1-mini</td>
                    <td className="p-3">128K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3">Streaming</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Anthropic Models">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-left p-3 font-medium">Context</th>
                    <th className="text-left p-3 font-medium">Speed</th>
                    <th className="text-left p-3 font-medium">Cost</th>
                    <th className="text-left p-3 font-medium">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">claude-3-5-sonnet-latest</td>
                    <td className="p-3">200K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">claude-3-5-haiku-latest</td>
                    <td className="p-3">200K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Low</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">claude-3-opus-latest</td>
                    <td className="p-3">200K</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded">High</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Google Models">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Model</th>
                    <th className="text-left p-3 font-medium">Context</th>
                    <th className="text-left p-3 font-medium">Speed</th>
                    <th className="text-left p-3 font-medium">Cost</th>
                    <th className="text-left p-3 font-medium">Features</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">gemini-2.0-flash-exp</td>
                    <td className="p-3">1M</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Free*</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">gemini-1.5-pro-latest</td>
                    <td className="p-3">2M</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-800 rounded">Medium</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">gemini-1.5-flash-latest</td>
                    <td className="p-3">1M</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Low</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">gemini-1.5-flash-8b</td>
                    <td className="p-3">1M</td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded">Fast</span></td>
                    <td className="p-3"><span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">Low</span></td>
                    <td className="p-3">Streaming, Tools, Vision</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">* Free during experimental preview</p>
          </CollapsibleSection>
        </div>
      </section>

      {/* Streaming */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Streaming Responses</h2>
        <p className="text-muted-foreground mb-4">
          Handle streaming with typed chunks and callbacks
        </p>
        <CodeBlock
          code={`import {
  openAIAdapter,
  isTextDelta,
  isToolCallDelta,
  isToolCallComplete,
  isFinishChunk,
  isErrorChunk,
  collectStreamText,
} from '@clarity-chat/react/adapters'

// Basic streaming
async function streamResponse(messages: ChatMessage[]) {
  const stream = openAIAdapter.stream(messages, config)

  for await (const chunk of stream) {
    switch (chunk.type) {
      case 'token':
        process.stdout.write(chunk.content!)
        break
      case 'tool_call':
        console.log('Tool call:', chunk.toolCall)
        break
      case 'done':
        if (chunk.usage) {
          console.log('\\nTotal tokens:', chunk.usage.totalTokens)
          console.log('Estimated cost: $', chunk.usage.estimatedCost?.toFixed(4))
        }
        break
      case 'error':
        console.error('Error:', chunk.error)
        break
    }
  }
}

// With callbacks (alternative pattern)
const stream = openAIAdapter.stream(messages, {
  ...config,
  streamOptions: {
    onToken: (token) => updateUI(token),
    onToolCall: (tool) => executeTool(tool),
    onThinking: (step) => showThinking(step), // For o1 models
    onCitation: (cite) => addCitation(cite),
  },
})

// Type guards for formalized adapters
async function handleTypedStream(stream: AsyncIterable<TypedStreamChunk>) {
  for await (const chunk of stream) {
    if (isTextDelta(chunk)) {
      console.log(chunk.text)
    } else if (isToolCallComplete(chunk)) {
      const result = await executeFunction(chunk.toolName, chunk.args)
      // Return result to model...
    } else if (isFinishChunk(chunk)) {
      console.log('Finished:', chunk.finishReason)
    } else if (isErrorChunk(chunk)) {
      throw chunk.error
    }
  }
}

// Collect all text (utility)
const fullText = await collectStreamText(stream)`}
          language="tsx"
        />
      </section>

      {/* Cost Estimation */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-2">Cost Estimation</h2>
        <p className="text-muted-foreground mb-4">
          Each adapter includes built-in 2025 pricing
        </p>
        <CodeBlock
          code={`import { openAIAdapter, anthropicAdapter, googleAdapter } from '@clarity-chat/react/adapters'

// Estimate cost from token usage
const usage = {
  promptTokens: 1000,
  completionTokens: 500,
  totalTokens: 1500,
}

// OpenAI pricing (per 1K tokens)
const openAICost = openAIAdapter.estimateCost(usage, 'gpt-4o')
console.log('GPT-4o cost:', openAICost) // ~$0.0075

const openAIMiniCost = openAIAdapter.estimateCost(usage, 'gpt-4o-mini')
console.log('GPT-4o-mini cost:', openAIMiniCost) // ~$0.00045

// Anthropic pricing (per 1M tokens)
const claudeCost = anthropicAdapter.estimateCost(usage, 'claude-3-5-sonnet-latest')
console.log('Claude 3.5 Sonnet cost:', claudeCost) // ~$0.0105

const haikuCost = anthropicAdapter.estimateCost(usage, 'claude-3-5-haiku-latest')
console.log('Claude 3.5 Haiku cost:', haikuCost) // ~$0.0028

// Google pricing (per 1M tokens)
const geminiCost = googleAdapter.estimateCost(usage, 'gemini-1.5-flash-latest')
console.log('Gemini 1.5 Flash cost:', geminiCost) // ~$0.000225

// Cost is also included in stream 'done' chunks
for await (const chunk of stream) {
  if (chunk.type === 'done' && chunk.usage) {
    console.log('Request cost: $' + chunk.usage.estimatedCost?.toFixed(4))
  }
}`}
          language="tsx"
        />
      </section>

      {/* API Reference */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-4">API Reference</h2>

        <div className="space-y-4">
          <CollapsibleSection title="ModelAdapter Interface" defaultOpen>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Method</th>
                    <th className="text-left p-3 font-medium">Signature</th>
                    <th className="text-left p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">name</td>
                    <td className="p-3 font-mono text-xs">string</td>
                    <td className="p-3">Adapter identifier (&apos;openai&apos;, &apos;anthropic&apos;, &apos;google&apos;)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">chat</td>
                    <td className="p-3 font-mono text-xs">(messages, config) =&gt; Promise&lt;ChatMessage&gt;</td>
                    <td className="p-3">Send non-streaming chat request</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">stream</td>
                    <td className="p-3 font-mono text-xs">(messages, config) =&gt; AsyncGenerator&lt;StreamChunk&gt;</td>
                    <td className="p-3">Stream chat response</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">estimateCost</td>
                    <td className="p-3 font-mono text-xs">(usage, model) =&gt; number</td>
                    <td className="p-3">Estimate cost in USD from token usage</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="ModelConfig Options">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Property</th>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">provider</td>
                    <td className="p-3 font-mono text-xs">&apos;openai&apos; | &apos;anthropic&apos; | &apos;google&apos;</td>
                    <td className="p-3">Provider name</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">model</td>
                    <td className="p-3 font-mono text-xs">string</td>
                    <td className="p-3">Model identifier (e.g., &apos;gpt-4o&apos;)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">apiKey</td>
                    <td className="p-3 font-mono text-xs">string</td>
                    <td className="p-3">API key (required, no env fallback)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">baseURL</td>
                    <td className="p-3 font-mono text-xs">string?</td>
                    <td className="p-3">Custom API endpoint URL</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">temperature</td>
                    <td className="p-3 font-mono text-xs">number?</td>
                    <td className="p-3">Randomness (0-2)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">maxTokens</td>
                    <td className="p-3 font-mono text-xs">number?</td>
                    <td className="p-3">Maximum tokens to generate</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">topP</td>
                    <td className="p-3 font-mono text-xs">number?</td>
                    <td className="p-3">Nucleus sampling threshold</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">timeout</td>
                    <td className="p-3 font-mono text-xs">number?</td>
                    <td className="p-3">Request timeout (ms). Default: 30000 chat, 60000 stream</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">signal</td>
                    <td className="p-3 font-mono text-xs">AbortSignal?</td>
                    <td className="p-3">AbortSignal for cancellation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">streamOptions</td>
                    <td className="p-3 font-mono text-xs">object?</td>
                    <td className="p-3">Callbacks: onToken, onToolCall, onThinking, onCitation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="StreamChunk Types">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 font-medium">Type</th>
                    <th className="text-left p-3 font-medium">Properties</th>
                    <th className="text-left p-3 font-medium">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;token&apos;</td>
                    <td className="p-3 font-mono text-xs">content: string</td>
                    <td className="p-3">Text content chunk</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;tool_call&apos;</td>
                    <td className="p-3 font-mono text-xs">toolCall: ToolCall</td>
                    <td className="p-3">Function/tool call request</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;thinking&apos;</td>
                    <td className="p-3 font-mono text-xs">thinkingStep: string</td>
                    <td className="p-3">Reasoning step (o1 models)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;citation&apos;</td>
                    <td className="p-3 font-mono text-xs">citation: Citation</td>
                    <td className="p-3">Source citation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;done&apos;</td>
                    <td className="p-3 font-mono text-xs">usage?: TokenUsage</td>
                    <td className="p-3">Stream complete, includes usage stats</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-xs">&apos;error&apos;</td>
                    <td className="p-3 font-mono text-xs">error: string, rateLimitInfo?</td>
                    <td className="p-3">Error occurred, may include rate limit info</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CollapsibleSection>
        </div>
      </section>

      {/* Type Definitions */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-4">Type Definitions</h2>
        <CodeBlock
          code={`interface ModelAdapter {
  name: string
  chat(messages: ChatMessage[], config: ModelConfig): Promise<ChatMessage>
  stream(messages: ChatMessage[], config: ModelConfig): AsyncGenerator<StreamChunk>
  estimateCost(usage: TokenUsage, model: string): number
}

interface ModelConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'custom'
  model: string
  apiKey?: string
  baseURL?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  timeout?: number
  signal?: AbortSignal
  streamOptions?: {
    onToken?: (token: string) => void
    onToolCall?: (tool: ToolCall) => void
    onThinking?: (step: string) => void
    onCitation?: (citation: Citation) => void
  }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string | ContentPart[]
  toolCalls?: ToolCall[]
  citations?: Citation[]
}

interface StreamChunk {
  type: 'token' | 'tool_call' | 'thinking' | 'citation' | 'done' | 'error'
  content?: string
  toolCall?: ToolCall
  thinkingStep?: string
  citation?: Citation
  usage?: TokenUsage
  error?: string
  rateLimitInfo?: RateLimitInfo
}

interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimatedCost?: number
}

interface ModelInfo {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'google'
  speed: 'fast' | 'medium' | 'slow'
  cost: 'low' | 'medium' | 'high'
  quality: 'good' | 'excellent' | 'best'
  contextWindow: number
  streaming?: boolean
  toolCalling?: boolean
  vision?: boolean
}`}
          language="typescript"
        />
      </section>

      {/* Security Note */}
      <section className="mb-8 border border-yellow-500/50 rounded-lg p-6 bg-card">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-2xl font-semibold">Security Note</h2>
          <span className="px-2 py-0.5 text-xs border border-yellow-500 text-yellow-700 rounded">Important</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Model adapters require explicit API key configuration. They intentionally do NOT fall back to <code className="bg-muted px-1 rounded">process.env</code> to prevent accidental exposure in frontend bundles.
        </p>
        <CodeBlock
          code={`// Server-side only - use environment variables safely
const response = await openAIAdapter.chat(messages, {
  provider: 'openai',
  model: 'gpt-4o',
  apiKey: process.env.OPENAI_API_KEY!, // Only works server-side
})

// For client-side, use an API route
// /app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  const response = await openAIAdapter.chat(messages, {
    provider: 'openai',
    model: 'gpt-4o',
    apiKey: process.env.OPENAI_API_KEY!, // Safe - server only
  })

  return Response.json(response)
}`}
          language="tsx"
        />
      </section>

      {/* Exports */}
      <section className="mb-8 border rounded-lg p-6 bg-card">
        <h2 className="text-2xl font-semibold mb-4">Exports Summary</h2>
        <CodeBlock
          code={`// Adapters
export { openAIAdapter } from '@clarity-chat/react/adapters'
export { anthropicAdapter } from '@clarity-chat/react/adapters'
export { googleAdapter } from '@clarity-chat/react/adapters'

// Model lists
export { openAIModels } from '@clarity-chat/react/adapters'
export { anthropicModels } from '@clarity-chat/react/adapters'
export { googleModels } from '@clarity-chat/react/adapters'
export { allModels } from '@clarity-chat/react/adapters'

// Helper functions
export { getAdapter } from '@clarity-chat/react/adapters'
export { createAdapterRegistry } from '@clarity-chat/react/adapters'
export { collectStreamText } from '@clarity-chat/react/adapters'

// Type guards
export { isTextDelta } from '@clarity-chat/react/adapters'
export { isToolCallDelta } from '@clarity-chat/react/adapters'
export { isToolCallComplete } from '@clarity-chat/react/adapters'
export { isFinishChunk } from '@clarity-chat/react/adapters'
export { isErrorChunk } from '@clarity-chat/react/adapters'

// Types
export type {
  ModelAdapter,
  ModelConfig,
  ChatMessage,
  ContentPart,
  ToolCall,
  Citation,
  StreamChunk,
  TokenUsage,
  ModelInfo,
  FormalizedModelAdapter,
  AdapterCapabilities,
  AdapterRegistry,
} from '@clarity-chat/react/adapters'`}
          language="tsx"
        />
      </section>

      <FeedbackWidget pageId="adapters" />
    </div>
  )
}
