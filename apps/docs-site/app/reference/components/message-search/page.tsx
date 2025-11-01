import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Message Search | Clarity Chat',
  description: 'Search messages with React Concurrent features for responsive UI.'
}

export default function MessageSearchPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Message Search</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Search through messages with deferred filtering for responsive input even with large message lists.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { MessageSearch } from '@clarity-chat/react'

<MessageSearch
  messages={messages}
  onResultsChange={(filtered) => setFiltered(filtered)}
  placeholder="Search messages..."
/>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>React Concurrent useDeferredValue</li>
          <li>Responsive input with large lists</li>
          <li>Loading indicator</li>
          <li>Real-time filtering</li>
          <li>Search icon</li>
        </ul>
      </section>
    </div>
  )
}
