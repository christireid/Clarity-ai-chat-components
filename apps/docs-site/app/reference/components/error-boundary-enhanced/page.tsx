import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Error Boundary Enhanced | Clarity Chat',
  description: 'Enhanced error boundary with error tracking, user feedback, and automatic reporting.'
}

export default function ErrorBoundaryEnhancedPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Error Boundary Enhanced</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Production-ready error boundary with automatic error reporting, user feedback collection, and customizable fallback UI.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Automatic error reporting to configured providers</li>
          <li>User feedback collection with modal interface</li>
          <li>Customizable fallback UI with error context</li>
          <li>Severity levels: fatal, error, warning</li>
          <li>Development mode detailed error display</li>
          <li>Reset functionality to recover from errors</li>
          <li>Integration with useErrorReporter hook</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { ErrorBoundaryEnhanced } from '@clarity-chat/react'

<ErrorBoundaryEnhanced
  enableFeedback
  severity="error"
  errorContext={{ userId: '123', page: 'chat' }}
  onError={(error, errorInfo) => {
    console.error('Error caught:', error)
  }}
>
  <YourApp />
</ErrorBoundaryEnhanced>`}</code></pre>
        </div>
      </section>
    </div>
  )
}