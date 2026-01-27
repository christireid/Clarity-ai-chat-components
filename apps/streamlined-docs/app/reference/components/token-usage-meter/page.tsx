'use client'

import Link from 'next/link'
import { ArrowLeft, Zap } from 'lucide-react'

export default function TokenUsageMeterAPIPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-docs py-8">
        <Link
          href="/guides/token-optimization"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Token Optimization Guide
        </Link>

        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">TokenUsageMeter</h1>
              <p className="text-muted-foreground">Visual meter showing current token usage with cost estimates</p>
            </div>
          </div>

          {/* Component Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground mb-4">
              The TokenUsageMeter component displays current token usage as a visual meter with percentage,
              cost estimates, and animated progress indicators. Perfect for showing users their current
              consumption at a glance.
            </p>
          </section>

          {/* Props */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Props</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Prop</th>
                    <th className="text-left p-3 font-semibold">Type</th>
                    <th className="text-left p-3 font-semibold">Default</th>
                    <th className="text-left p-3 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3"><code className="text-xs bg-accent px-2 py-1 rounded">currentTokens</code></td>
                    <td className="p-3"><code className="text-xs">number</code></td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Current number of tokens used</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs bg-accent px-2 py-1 rounded">maxTokens</code></td>
                    <td className="p-3"><code className="text-xs">number</code></td>
                    <td className="p-3 text-muted-foreground">-</td>
                    <td className="p-3">Maximum token limit</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs bg-accent px-2 py-1 rounded">showCost</code></td>
                    <td className="p-3"><code className="text-xs">boolean</code></td>
                    <td className="p-3"><code className="text-xs">false</code></td>
                    <td className="p-3">Show estimated cost</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs bg-accent px-2 py-1 rounded">showPercentage</code></td>
                    <td className="p-3"><code className="text-xs">boolean</code></td>
                    <td className="p-3"><code className="text-xs">true</code></td>
                    <td className="p-3">Show usage percentage</td>
                  </tr>
                  <tr>
                    <td className="p-3"><code className="text-xs bg-accent px-2 py-1 rounded">animate</code></td>
                    <td className="p-3"><code className="text-xs">boolean</code></td>
                    <td className="p-3"><code className="text-xs">true</code></td>
                    <td className="p-3">Enable animations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Basic Usage */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm"><code>{`import { TokenUsageMeter } from '@clarity-chat/react'

function MyComponent() {
  return (
    <TokenUsageMeter
      currentTokens={1500}
      maxTokens={4000}
      showCost
      showPercentage
      animate
    />
  )
}`}</code></pre>
            </div>
          </section>

          {/* With Streaming */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">With Streaming</h2>
            <p className="text-muted-foreground mb-4">
              TokenUsageMeter updates in real-time as streaming responses arrive:
            </p>
            <div className="p-6 rounded-xl bg-neutral-900 text-neutral-100 overflow-x-auto">
              <pre className="text-sm"><code>{`import { TokenUsageMeter } from '@clarity-chat/react'
import { useClarityChat } from '@clarity-chat/react'

function StreamingChat() {
  const { tokenTracker } = useClarityChat({ 
    api: '/api/chat',
    streaming: true 
  })

  return (
    <TokenUsageMeter
      currentTokens={tokenTracker.tokenCount}
      maxTokens={8000}
      showCost
      animate
    />
  )
}`}</code></pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
