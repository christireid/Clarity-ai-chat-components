import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useStreamingSSE | Clarity Chat',
  description: 'Server-Sent Events streaming with automatic reconnection.'
}

export default function UseStreamingSSEPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useStreamingSSE</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Handle Server-Sent Events (SSE) streams with automatic reconnection, error recovery, and event parsing.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useStreamingSSE } from '@clarity-chat/react'

const { connect, disconnect, status, events } = useStreamingSSE({
  url: '/api/stream',
  method: 'POST',
  body: { query: 'Hello' },
  onMessage: (event) => {
    console.log('Received:', event.data)
  },
  autoReconnect: true,
  maxReconnectAttempts: 5
})

// Connect to stream
useEffect(() => {
  connect()
  return () => disconnect()
}, [])`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Automatic reconnection with exponential backoff</li>
          <li>Event ID tracking for resume</li>
          <li>Heartbeat monitoring</li>
          <li>JSON parsing</li>
          <li>POST request support</li>
        </ul>
      </section>
    </div>
  )
}
