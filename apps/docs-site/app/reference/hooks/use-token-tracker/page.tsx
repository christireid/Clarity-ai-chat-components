import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useTokenTracker Hook | Clarity Chat',
  description: 'Hook for tracking token usage, costs, and context limits in AI conversations.'
}

export default function UseTokenTrackerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useTokenTracker Hook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        React hook for tracking token usage, estimating costs, and managing context window limits.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Real-time token counting for messages</li>
          <li>Cost estimation by model and provider</li>
          <li>Context window limit tracking</li>
          <li>Warning at configurable thresholds (80%, 95%)</li>
          <li>Automatic context pruning suggestions</li>
          <li>History tracking for token usage over time</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { useTokenTracker } from '@clarity-chat/react'

function TokenDisplay() {
  const {
    totalTokens,
    estimatedCost,
    percentageUsed,
    isNearLimit,
    pruneMessages
  } = useTokenTracker({
    messages,
    model: 'gpt-4-turbo',
    contextLimit: 128000
  })

  return (
    <div>
      <span>{totalTokens} tokens</span>
      <span>\${estimatedCost.toFixed(4)}</span>
      {isNearLimit && (
        <button onClick={pruneMessages}>Optimize Context</button>
      )}
    </div>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
