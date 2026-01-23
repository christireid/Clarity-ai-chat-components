'use client'

import * as React from 'react'
import { Callout } from '@/components/Callout'
import { CodeBlock } from '@/components/CodeBlock'
import { ComponentPreview } from '@/components/ComponentPreview'

export function QuickStartHelpersPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quick Start Helpers</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ultra-simple APIs that return JSX elements directly, making it incredibly easy to get started.
        </p>
      </div>

      <Callout type="info">
        <strong>🚀 New in v1.0:</strong> These ultra-simple APIs are designed for rapid prototyping and
        production use. They handle all the complexity internally while giving you sensible defaults.
      </Callout>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Ultra-Simple APIs</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">chat()</h3>
            <p className="text-muted-foreground mt-1">
              The simplest possible chat API - just provide an API endpoint.
            </p>
            <CodeBlock
              code={`import { chat } from '@clarity-chat/react'

export function App() {
  return chat('/api/chat')
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">chatWithMemory()</h3>
            <p className="text-muted-foreground mt-1">
              Chat with memory enabled for context-aware conversations.
            </p>
            <CodeBlock
              code={`import { chatWithMemory } from '@clarity-chat/react'

export function App() {
  return chatWithMemory('/api/chat', 'vector-store')
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">enterpriseChat()</h3>
            <p className="text-muted-foreground mt-1">
              Enterprise-ready chat with all features enabled.
            </p>
            <CodeBlock
              code={`import { enterpriseChat } from '@clarity-chat/react'

export function App() {
  return enterpriseChat('/api/chat', 'My Enterprise Assistant')
}`}
              language="tsx"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">streamingChat()</h3>
            <p className="text-muted-foreground mt-1">
              Streaming chat optimized for real-time updates.
            </p>
            <CodeBlock
              code={`import { streamingChat } from '@clarity-chat/react'

export function App() {
  return streamingChat('/api/chat', true) // true for WebSocket
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Named Presets</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ChatPresets</h3>
            <p className="text-muted-foreground mt-1">
              Pre-configured chat components for common use cases.
            </p>
            <CodeBlock
              code={`import { ChatPresets } from '@clarity-chat/react'

export function App() {
  return (
    <div>
      {/* Minimal setup */}
      {ChatPresets.Minimal('/api/chat')}

      {/* With memory */}
      {ChatPresets.WithMemory('/api/chat')}

      {/* Enterprise features */}
      {ChatPresets.Enterprise('/api/chat')}

      {/* Customer support */}
      {ChatPresets.Support('/api/chat')}

      {/* Technical assistance */}
      {ChatPresets.Technical('/api/chat')}
    </div>
  )
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Fluent Builder API</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">ChatBuilder</h3>
            <p className="text-muted-foreground mt-1">
              Chain configuration options with a fluent API for custom setups.
            </p>
            <CodeBlock
              code={`import { ChatBuilder } from '@clarity-chat/react'

export function App() {
  return ChatBuilder.create('/api/chat')
    .withMemory('vector-store')
    .withHeader('My Custom Chat', 'AI Assistant')
    .withStreaming()
    .withRateLimiting(true)
    .withPrompts([
      { text: 'Hello!', category: 'greeting' },
      { text: 'How can I help?', category: 'support' }
    ])
    .build()
}`}
              language="tsx"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">API Reference</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">chat(api, options?)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Returns a JSX.Element for basic chat functionality.
            </p>
            <CodeBlock
              code={`chat(api: string, options?: {
  memory?: boolean
  streaming?: boolean
  enterprise?: boolean
}): JSX.Element`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">chatWithMemory(api, strategy?)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Returns a JSX.Element with memory enabled.
            </p>
            <CodeBlock
              code={`chatWithMemory(
  api: string,
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
): JSX.Element`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">enterpriseChat(api, title?)</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Returns a JSX.Element with enterprise features.
            </p>
            <CodeBlock
              code={`enterpriseChat(api: string, title?: string): JSX.Element`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">ChatPresets</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Named preset configurations.
            </p>
            <CodeBlock
              code={`ChatPresets: {
  Minimal: (api: string) => JSX.Element
  WithMemory: (api: string) => JSX.Element
  Enterprise: (api: string) => JSX.Element
  Support: (api: string) => JSX.Element
  Technical: (api: string) => JSX.Element
}`}
              language="typescript"
            />
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">ChatBuilder</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Fluent API for building custom chat configurations.
            </p>
            <CodeBlock
              code={`ChatBuilder: {
  create(api: string): ChatBuilder
  withMemory(strategy): this
  withHeader(title, subtitle?): this
  withStreaming(useWebSocket?): this
  withRateLimiting(enabled): this
  withPrompts(prompts): this
  build(): JSX.Element
}`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">Migration from Legacy APIs</h2>

        <div className="space-y-4">
          <Callout type="info">
            <strong>Easy Migration:</strong> All existing code continues to work. These new APIs are additive
            and provide additional convenience methods.
          </Callout>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-600">Before (Verbose)</h4>
              <CodeBlock
                code={`import { ClarityChat } from '@clarity-chat/react'

export function App() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{ enabled: true }}
      header={{ show: true }}
      // ... many more props
    />
  )
}`}
                language="tsx"
              />
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-600">After (Simple)</h4>
              <CodeBlock
                code={`import { chat } from '@clarity-chat/react'

export function App() {
  return chat('/api/chat', { memory: true })
}`}
                language="tsx"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}