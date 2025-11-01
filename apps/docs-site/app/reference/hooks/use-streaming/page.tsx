import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useStreaming Hook | Clarity Chat',
  description: 'Hook for handling streaming AI responses with SSE and WebSocket support.'
}

export default function UseStreamingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useStreaming Hook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        React hook for managing streaming AI responses with support for Server-Sent Events (SSE) and WebSocket protocols.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>SSE and WebSocket protocol support</li>
          <li>Automatic reconnection on connection loss</li>
          <li>Buffered streaming with smooth text rendering</li>
          <li>Progress tracking and completion detection</li>
          <li>Error handling and recovery</li>
          <li>Abort/cancel streaming capability</li>
          <li>Token usage tracking during streaming</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { useStreaming } from '@clarity-chat/react'

function StreamingChat() {
  const {
    streamedText,
    isStreaming,
    error,
    startStreaming,
    stopStreaming
  } = useStreaming({
    endpoint: '/api/stream',
    protocol: 'sse',
    onComplete: (fullText) => console.log('Done:', fullText)
  })

  return (
    <div>
      <p>{streamedText}</p>
      {isStreaming && <LoadingDots />}
      <button onClick={stopStreaming}>Stop</button>
    </div>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
