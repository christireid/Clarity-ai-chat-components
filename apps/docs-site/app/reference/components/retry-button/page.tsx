import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Retry Button | Clarity Chat',
  description: 'Smart retry button with exponential backoff, type-specific error messages, and attempt tracking.'
}

export default function RetryButtonPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Retry Button</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Production-ready retry button with exponential backoff, error type detection, and visual feedback.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Exponential backoff with configurable delays [1s, 3s, 10s]</li>
          <li>Error type detection: network, ratelimit, server, auth, unknown</li>
          <li>Visual countdown timer during backoff period</li>
          <li>Maximum attempts enforcement (default: 3)</li>
          <li>Success/failure callbacks for analytics</li>
          <li>Loading states during retry operation</li>
          <li>Size variants: sm, md, lg</li>
          <li>Style variants: default, ghost, outline</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { RetryButton } from '@clarity-chat/react'

<RetryButton
  onRetry={async () => await sendMessage()}
  errorType="network"
  maxAttempts={3}
  backoffMs={[1000, 3000, 10000]}
  onRetrySuccess={(attempt) => console.log('Success on attempt', attempt)}
  onMaxAttemptsReached={() => alert('Max retries reached')}
/>`}</code></pre>
        </div>
      </section>
    </div>
  )
}