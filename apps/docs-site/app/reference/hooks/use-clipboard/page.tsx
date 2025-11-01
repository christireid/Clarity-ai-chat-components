import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useClipboard Hook | Clarity Chat',
  description: 'Hook for clipboard operations with copy/paste functionality and user feedback.'
}

export default function UseClipboardPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useClipboard Hook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        React hook for clipboard operations with copy/paste functionality, success feedback, and error handling.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Copy text to clipboard with one function call</li>
          <li>Success state tracking with auto-reset</li>
          <li>Error handling for failed operations</li>
          <li>Browser API compatibility detection</li>
          <li>Fallback for older browsers</li>
          <li>TypeScript support with proper typing</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { useClipboard } from '@clarity-chat/react'

function CopyButton({ text }) {
  const { copy, copied, error } = useClipboard({
    successDuration: 2000
  })

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied!' : 'Copy'}
      {error && <span>Failed to copy</span>}
    </button>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
