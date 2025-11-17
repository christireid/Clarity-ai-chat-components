import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Error Reporter | Clarity Chat',
  description: 'Error tracking and reporting utilities with provider integrations.'
}

export default function ErrorReporterPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Error Reporter</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Comprehensive error tracking system with integrations for Sentry, LogRocket, and custom providers.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Multiple provider support (Sentry, LogRocket, custom)</li>
          <li>Automatic error capture and reporting</li>
          <li>User feedback collection</li>
          <li>Error severity classification</li>
          <li>Context enrichment with user data</li>
          <li>Performance impact monitoring</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { ErrorReporter } from '@clarity-chat/react/error'

ErrorReporter.init({
  provider: 'sentry',
  dsn: 'your-sentry-dsn',
  environment: 'production'
})

ErrorReporter.captureError(error, {
  severity: 'error',
  context: { userId: '123' }
})`}</code></pre>
        </div>
      </section>
    </div>
  )
}
