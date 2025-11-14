import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useErrorRecovery | Clarity Chat',
  description: 'Automatic error recovery with retry logic and exponential backoff.'
}

export default function UseErrorRecoveryPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useErrorRecovery</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Automatic error recovery with configurable retry logic, exponential backoff, and error classification.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useErrorRecovery } from '@clarity-chat/react'

const { 
  execute, 
  retry, 
  error, 
  isLoading, 
  canRetry 
} = useErrorRecovery({
  operation: async (id) => fetchData(id),
  maxAttempts: 3,
  backoffMs: [1000, 3000, 10000],
  shouldRetry: (error) => error.message !== 'Unauthorized'
})

// Execute with retry
const loadData = async () => {
  const result = await execute(userId)
  if (result) setData(result)
}

// Manual retry
<button onClick={retry} disabled={!canRetry}>
  Retry ({attemptNumber}/{maxAttempts})
</button>`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Error Types</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>network:</strong> Connection errors</li>
          <li><strong>ratelimit:</strong> Rate limit errors</li>
          <li><strong>server:</strong> 5xx errors</li>
          <li><strong>auth:</strong> Authentication errors</li>
          <li><strong>unknown:</strong> Other errors</li>
        </ul>
      </section>
    </div>
  )
}
