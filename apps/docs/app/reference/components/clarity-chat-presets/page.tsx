'use client'

import type { Metadata } from 'next'
import Link from 'next/link'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
import { ScrollReveal, ScrollRevealItem } from '@/components/UI/ScrollReveal'

export default function ClarityChatPresetsPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <ScrollReveal>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-full text-sm font-medium mb-4">
            <span>⚡</span>
            <span>Fastest way to get started</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">ClarityChatPresets</h1>
          <p className="text-xl text-muted-foreground mb-4">
            Pre-configured chat components for common use cases. These presets
            wrap{' '}
            <Link
              href="/reference/components/clarity-chat"
              className="text-brand-600 hover:underline"
            >
              ClarityChat
            </Link>{' '}
            with sensible defaults for specific scenarios.
          </p>
          <p className="text-muted-foreground">
            <strong>Architecture Layer:</strong> Top-Level (Drop-in Ready) •{' '}
            <strong>Domain:</strong> Developer Experience
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Callout type="info" title="When to Use Presets">
          <p className="mb-2">
            Presets are perfect when you want to get started quickly with a
            common use case. They provide sensible defaults while still allowing
            you to customize all{' '}
            <Link
              href="/reference/components/clarity-chat"
              className="text-brand-600 hover:underline"
            >
              ClarityChat
            </Link>{' '}
            props.
          </p>
          <p>
            For more control, use{' '}
            <code className="bg-muted px-1 rounded">ClarityChat</code> directly
            or compose with mid-level APIs.
          </p>
        </Callout>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Simple Preset</h2>
          <p className="text-muted-foreground mb-4">
            Minimal configuration - perfect for getting started quickly.
          </p>
          <CodePlayground
            code={`import { ClarityChatPresets } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function SimpleChat() {
  return <ClarityChatPresets.Simple api="/api/chat" />
}`}
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Configuration:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>No memory integration</li>
              <li>No prompt optimization</li>
              <li>SSE transport (default)</li>
              <li>All ClarityChat props can be customized</li>
            </ul>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.3}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">WithMemory Preset</h2>
          <p className="text-muted-foreground mb-4">
            Context-aware conversations with memory management. Perfect for long
            conversations that need to remember context.
          </p>
          <CodePlayground
            code={`import { ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'

function MemoryChat() {
  return (
    <ClarityChatPresets.WithMemory
      api="/api/chat"
      memoryStrategy="vector-store" // or 'sliding-window', 'semantic-chunks'
    />
  )
}

// Wrap with MemoryProvider for vector-store strategy
function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <MemoryChat />
    </MemoryProvider>
  )
}`}
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Configuration:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Memory enabled with configurable strategy</li>
              <li>Default maxTokens: 4000</li>
              <li>Default strategy: 'sliding-window'</li>
              <li>All ClarityChat props can be customized</li>
            </ul>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Memory Strategies:</h4>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <h5 className="font-semibold text-sm mb-1">sliding-window</h5>
                <p className="text-xs text-muted-foreground">
                  Fixed-size buffer with most recent messages. Fast and simple.
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-semibold text-sm mb-1">semantic-chunks</h5>
                <p className="text-xs text-muted-foreground">
                  Semantic chunking for better context retrieval.
                </p>
              </div>
              <div className="border rounded-lg p-3">
                <h5 className="font-semibold text-sm mb-1">vector-store</h5>
                <p className="text-xs text-muted-foreground">
                  Vector-based semantic search. Best for long conversations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Enterprise Preset</h2>
          <p className="text-muted-foreground mb-4">
            Full-featured configuration optimized for production enterprise use
            cases. Includes memory, prompt optimization, and all enterprise
            features.
          </p>
          <CodePlayground
            code={`import { ClarityChatPresets, MemoryProvider } from '@clarity-chat/react'

function EnterpriseChat() {
  return (
    <ClarityChatPresets.Enterprise
      api="/api/chat"
      sessionTitle="Enterprise Assistant"
      showHeader
      showMessageCount
    />
  )
}

// Wrap with MemoryProvider for vector-store strategy
function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <EnterpriseChat />
    </MemoryProvider>
  )
}`}
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Configuration:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Memory enabled with 'vector-store' strategy</li>
              <li>Max tokens: 10000</li>
              <li>Prompt optimization enabled with 'hybrid' strategy</li>
              <li>Header and message count enabled by default</li>
              <li>All ClarityChat props can be customized</li>
            </ul>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.5}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Streaming Preset</h2>
          <p className="text-muted-foreground mb-4">
            Optimized for real-time streaming updates. Supports both SSE
            (default) and WebSocket.
          </p>
          <CodePlayground
            code={`import { ClarityChatPresets } from '@clarity-chat/react'

function StreamingChat() {
  // SSE (default)
  return <ClarityChatPresets.Streaming api="/api/chat" />
}

function WebSocketChat() {
  // WebSocket
  return (
    <ClarityChatPresets.Streaming
      api="/api/chat"
      useWebSocket
    />
  )
}`}
          />
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Configuration:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>SSE transport by default</li>
              <li>WebSocket support via useWebSocket prop</li>
              <li>Optimized for real-time updates</li>
              <li>All ClarityChat props can be customized</li>
            </ul>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.6}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Customizing Presets</h2>
          <p className="text-muted-foreground mb-4">
            All presets accept all{' '}
            <Link
              href="/reference/components/clarity-chat"
              className="text-brand-600 hover:underline"
            >
              ClarityChat
            </Link>{' '}
            props, so you can customize them to your needs.
          </p>
          <CodePlayground
            code={`import { ClarityChatPresets } from '@clarity-chat/react'

function CustomizedChat() {
  return (
    <ClarityChatPresets.Simple
      api="/api/chat"
      // Customize any ClarityChat prop
      showHeader
      sessionTitle="My Custom Chat"
      showTokenCounter
      enableMessageOperations
      onMessageCopy={(id, content) => {
        console.log('Copied:', id)
      }}
      className="h-screen"
    />
  )
}`}
          />
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.7}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Preset Comparison</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 font-semibold">Preset</th>
                  <th className="text-left p-3 font-semibold">Memory</th>
                  <th className="text-left p-3 font-semibold">Optimization</th>
                  <th className="text-left p-3 font-semibold">Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-3 font-mono text-sm">Simple</td>
                  <td className="p-3 text-sm text-muted-foreground">❌</td>
                  <td className="p-3 text-sm text-muted-foreground">❌</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Quick prototypes, simple chats
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-sm">WithMemory</td>
                  <td className="p-3 text-sm text-muted-foreground">✅</td>
                  <td className="p-3 text-sm text-muted-foreground">❌</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Long conversations, context-aware
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-sm">Enterprise</td>
                  <td className="p-3 text-sm text-muted-foreground">✅</td>
                  <td className="p-3 text-sm text-muted-foreground">✅</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Production, cost optimization
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-sm">Streaming</td>
                  <td className="p-3 text-sm text-muted-foreground">❌</td>
                  <td className="p-3 text-sm text-muted-foreground">❌</td>
                  <td className="p-3 text-sm text-muted-foreground">
                    Real-time updates, WebSocket
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.8}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Best Practices</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold mb-2">Start with Simple</h3>
              <p className="text-sm text-muted-foreground">
                Begin with <code className="bg-muted px-1 rounded">Simple</code>{' '}
                preset and add features as needed. You can always customize any
                prop.
              </p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold mb-2">
                Use Enterprise for Production
              </h3>
              <p className="text-sm text-muted-foreground">
                For production applications, use{' '}
                <code className="bg-muted px-1 rounded">Enterprise</code> preset
                for cost optimization and best performance.
              </p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold mb-2">Wrap with MemoryProvider</h3>
              <p className="text-sm text-muted-foreground">
                When using{' '}
                <code className="bg-muted px-1 rounded">WithMemory</code> or{' '}
                <code className="bg-muted px-1 rounded">Enterprise</code> with
                vector-store strategy, wrap your app with{' '}
                <code className="bg-muted px-1 rounded">MemoryProvider</code>.
                <strong className="block mt-1">Note:</strong> MemoryProvider
                requires a <code className="bg-muted px-1 rounded">config</code>{' '}
                prop with at least{' '}
                <code className="bg-muted px-1 rounded">maxTokens</code>.
              </p>
            </div>
            <div className="border-l-4 border-brand-500 pl-4">
              <h3 className="font-semibold mb-2">Customize as Needed</h3>
              <p className="text-sm text-muted-foreground">
                All presets accept all ClarityChat props, so you can customize
                them to match your exact requirements.
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <ScrollReveal delay={0.9}>
        <section className="mb-12">
          <h2 className="text-3xl font-semibold mb-4">Related Documentation</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/reference/components/clarity-chat"
              className="border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">ClarityChat Component</h3>
              <p className="text-sm text-muted-foreground">
                The component that presets are based on. Use this for more
                control.
              </p>
            </Link>
            <Link
              href="/reference/hooks/use-clarity-chat"
              className="border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">useClarityChat Hook</h3>
              <p className="text-sm text-muted-foreground">
                The hook that powers ClarityChat. Use this for maximum control.
              </p>
            </Link>
            <Link
              href="/guides/memory"
              className="border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Memory Guide</h3>
              <p className="text-sm text-muted-foreground">
                Learn about memory strategies and when to use each one.
              </p>
            </Link>
            <Link
              href="/learn/quick-start"
              className="border rounded-lg p-4 hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-2">Quick Start Guide</h3>
              <p className="text-sm text-muted-foreground">
                Get started with Clarity Chat in 5 minutes.
              </p>
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </div>
  )
}
