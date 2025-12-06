'use client'

import { useState } from 'react'
import { ToastProvider, ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Simple preset demo
function SimplePresetDemo() {
  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ClarityChatPresets.Simple
        api="/api/chat"
        className="border border-border rounded-lg"
      />
    </div>
  )
}

// With memory preset demo
function MemoryPresetDemo() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="w-full max-w-2xl" style={{ height: '400px' }}>
        <ClarityChatPresets.WithMemory
          api="/api/chat"
          memoryStrategy="sliding-window"
          className="border border-border rounded-lg"
        />
      </div>
    </MemoryProvider>
  )
}

// Enterprise preset demo
function EnterprisePresetDemo() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="w-full max-w-2xl" style={{ height: '400px' }}>
        <ClarityChatPresets.Enterprise
          api="/api/chat"
          sessionTitle="Enterprise Assistant"
          className="border border-border rounded-lg"
        />
      </div>
    </MemoryProvider>
  )
}

// Streaming preset demo
function StreamingPresetDemo() {
  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ClarityChatPresets.Streaming
        api="/api/chat"
        className="border border-border rounded-lg"
      />
    </div>
  )
}

export const dynamic = 'force-dynamic'

export default function ClarityChatPresetsPage() {
  const [selectedPreset, setSelectedPreset] = useState<'simple' | 'memory' | 'enterprise' | 'streaming'>('simple')

  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>ClarityChatPresets</h1>

        <p className="lead">
          Pre-configured chat components for common use cases. These presets wrap{' '}
          <code>ClarityChat</code> with sensible defaults, making it even easier to get started.
        </p>

        <Callout type="info">
          <p>
            <strong>Quick Start:</strong> If you're new to Clarity Chat, start with{' '}
            <code>ClarityChatPresets.Simple</code>. For more control, use <code>ClarityChat</code>{' '}
            directly or compose with mid-level APIs.
          </p>
        </Callout>

        <ViewInStorybook component="ClarityChatPresets" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Preset Comparison</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Compare different presets to find the right one for your use case:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={() => setSelectedPreset('simple')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPreset === 'simple'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold mb-2">Simple</h3>
              <p className="text-sm text-muted-foreground">
                Minimal configuration, perfect for getting started
              </p>
            </button>
            <button
              onClick={() => setSelectedPreset('memory')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPreset === 'memory'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold mb-2">WithMemory</h3>
              <p className="text-sm text-muted-foreground">
                Context-aware conversations with memory enabled
              </p>
            </button>
            <button
              onClick={() => setSelectedPreset('enterprise')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPreset === 'enterprise'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold mb-2">Enterprise</h3>
              <p className="text-sm text-muted-foreground">
                Full-featured with all options for production use
              </p>
            </button>
            <button
              onClick={() => setSelectedPreset('streaming')}
              className={`p-4 border rounded-lg text-left transition-colors ${
                selectedPreset === 'streaming'
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <h3 className="font-semibold mb-2">Streaming</h3>
              <p className="text-sm text-muted-foreground">
                Optimized for real-time streaming updates
              </p>
            </button>
          </div>

          <div className="border rounded-lg p-6">
            {selectedPreset === 'simple' && <SimplePresetDemo />}
            {selectedPreset === 'memory' && <MemoryPresetDemo />}
            {selectedPreset === 'enterprise' && <EnterprisePresetDemo />}
            {selectedPreset === 'streaming' && <StreamingPresetDemo />}
          </div>
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { ClarityChatPresets } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="simple-preset">Simple Preset</h2>

        <p>
          The simplest preset with minimal configuration. Perfect for getting started or when you
          need a basic chat interface.
        </p>

        <ComponentPreview
          title="Simple Chat"
          description="Minimal configuration, maximum simplicity"
          code={`import { ClarityChatPresets } from '@clarity-chat/react'

function App() {
  return <ClarityChatPresets.Simple api="/api/chat" />
}`}
        >
          <SimplePresetDemo />
        </ComponentPreview>

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The demo above uses a placeholder API endpoint. In a real
            application, you'll need to implement the <code>/api/chat</code> route. See the{' '}
            <a href="#examples">Next.js API Route Example</a> below for a complete implementation.
          </p>
        </Callout>

        <Callout type="tip">
          <p>
            The Simple preset is equivalent to using <code>ClarityChat</code> directly with default
            options. All <code>ClarityChat</code> props are supported.
          </p>
        </Callout>

        <h2 id="with-memory-preset">WithMemory Preset</h2>

        <p>
          Pre-configured with memory enabled. Perfect for context-aware conversations that need to
          remember previous messages.
        </p>

        <ComponentPreview
          title="Chat with Memory"
          description="Context-aware conversations with memory enabled"
          code={`import { ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChatPresets.WithMemory
        api="/api/chat"
        memoryStrategy="sliding-window"
      />
    </MemoryProvider>
  )
}`}
        >
          <MemoryPresetDemo />
        </ComponentPreview>

        <h3>Memory Strategy Options</h3>

        <p>You can choose from three memory strategies:</p>

        <EnhancedCodeBlock
          code={`// Sliding window (default) - Fast, recent context
<ClarityChatPresets.WithMemory
  api="/api/chat"
  memoryStrategy="sliding-window"
/>

// Semantic chunks - Context-aware selection
<ClarityChatPresets.WithMemory
  api="/api/chat"
  memoryStrategy="semantic-chunks"
/>

// Vector store - Long-term memory with embeddings
<ClarityChatPresets.WithMemory
  api="/api/chat"
  memoryStrategy="vector-store"
/>`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="info">
          <p>
            Learn more about memory strategies in the{' '}
            <a href="/guides/memory">Memory System Guide</a>.
          </p>
        </Callout>

        <h2 id="enterprise-preset">Enterprise Preset</h2>

        <p>
          Full-featured preset optimized for production enterprise use cases. Includes memory,
          prompt optimization, header, and message count.
        </p>

        <ComponentPreview
          title="Enterprise Chat"
          description="Production-ready with all features enabled"
          code={`import { ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChatPresets.Enterprise
        api="/api/chat"
        sessionTitle="Enterprise Assistant"
      />
    </MemoryProvider>
  )
}`}
        >
          <EnterprisePresetDemo />
        </ComponentPreview>

        <h3>Enterprise Features</h3>

        <p>The Enterprise preset includes:</p>

        <ul>
          <li>✅ Memory enabled with vector-store strategy</li>
          <li>✅ Prompt optimization enabled</li>
          <li>✅ Header with session information</li>
          <li>✅ Message count badge</li>
          <li>✅ Optimized for large conversations (10,000 token budget)</li>
        </ul>

        <h2 id="streaming-preset">Streaming Preset</h2>

        <p>
          Optimized for real-time streaming updates. Configured for optimal streaming performance
          with SSE (default) or WebSocket.
        </p>

        <ComponentPreview
          title="Streaming Chat"
          description="Real-time streaming with optimal performance"
          code={`import { ClarityChatPresets } from '@clarity-chat/react'

function App() {
  // SSE (default)
  return <ClarityChatPresets.Streaming api="/api/chat" />
  
  // Or WebSocket
  // return <ClarityChatPresets.Streaming api="/api/chat" useWebSocket />
}`}
        >
          <StreamingPresetDemo />
        </ComponentPreview>

        <h3>SSE vs WebSocket</h3>

        <EnhancedCodeBlock
          code={`// SSE (default) - Server-Sent Events
// Best for: Most use cases, simple setup, HTTP-based
<ClarityChatPresets.Streaming api="/api/chat" />

// WebSocket - Bidirectional communication
// Best for: Real-time collaboration, lower latency, bidirectional
<ClarityChatPresets.Streaming api="/api/chat" useWebSocket />`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="tip">
          <p>
            SSE is the default and works with most backends. WebSocket is better for bidirectional
            communication or when you need lower latency. See the{' '}
            <a href="/guides/streaming">Streaming Guide</a> for more details.
          </p>
        </Callout>

        <h2 id="customization">Customization</h2>

        <p>
          All presets accept the same props as <code>ClarityChat</code>, so you can customize them
          as needed:
        </p>

        <EnhancedCodeBlock
          code={`<ClarityChatPresets.Simple
  api="/api/chat"
  className="h-screen"
  showHeader
  sessionTitle="Custom Chat"
  showTokenCounter
  onMessageCopy={(id, content) => {
    navigator.clipboard.writeText(content)
  }}
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="when-to-use">When to Use Each Preset</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Simple</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use when you need a basic chat interface with minimal configuration.
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Quick prototypes</li>
              <li>Simple chat interfaces</li>
              <li>Learning the library</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">WithMemory</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use when you need context-aware conversations that remember previous messages.
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Multi-turn conversations</li>
              <li>Context-aware assistants</li>
              <li>Conversational AI applications</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Enterprise</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use for production applications that need all features and optimizations.
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Production applications</li>
              <li>Enterprise deployments</li>
              <li>Large-scale conversations</li>
              <li>Cost optimization needed</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Streaming</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Use when you need optimal real-time streaming performance.
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside">
              <li>Real-time applications</li>
              <li>Low-latency requirements</li>
              <li>Bidirectional communication</li>
            </ul>
          </div>
        </div>

        <h2 id="examples">Complete Examples</h2>

        <h3>Next.js App Router Example</h3>

        <EnhancedCodeBlock
          code={`// app/page.tsx
import { ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

export default function HomePage() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">AI Assistant</h1>
        <ClarityChatPresets.Enterprise
          api="/api/chat"
          sessionTitle="AI Assistant"
          showTokenCounter
        />
      </div>
    </MemoryProvider>
  )
}

// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true,
    }),
  })

  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="success">
          <p>
            <strong>Great job!</strong> You now know how to use ClarityChatPresets. For more
            control, check out <a href="/reference/components/clarity-chat">ClarityChat</a> or{' '}
            <a href="/reference/components/chat-window">ChatWindow</a>.
          </p>
        </Callout>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/clarity-chat">ClarityChat</a> - Main component
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Composable component
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat state hook
          </li>
          <li>
            <a href="/guides/memory">Memory System Guide</a> - Memory strategies
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - Transport protocols
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'ClarityChat',
            href: '/reference/components/clarity-chat',
          }}
          next={{
            title: 'ChatWindow',
            href: '/reference/components/chat-window',
          }}
        />
      </>
    </ToastProvider>
  )
}
