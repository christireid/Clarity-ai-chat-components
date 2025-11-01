import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useStreamingWebSocket | Clarity Chat',
  description: 'WebSocket streaming with automatic reconnection and message queuing.'
}

export default function UseStreamingWebSocketPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useStreamingWebSocket</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Bidirectional WebSocket streaming with automatic reconnection, message queuing, and heartbeat monitoring.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { useStreamingWebSocket } from '@clarity-chat/react'

const { 
  connect, 
  disconnect, 
  send, 
  status, 
  messages 
} = useStreamingWebSocket({
  url: 'wss://api.example.com/ws',
  onMessage: (data) => {
    console.log('Received:', data)
  },
  autoReconnect: true
})

// Send message
const handleSend = () => {
  send({ type: 'chat', content: 'Hello' })
}`}</code>
        </pre>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Automatic reconnection</li>
          <li>Message queue when disconnected</li>
          <li>Heartbeat/ping-pong</li>
          <li>Binary and text messages</li>
          <li>Connection state tracking</li>
        </ul>
      </section>
    </div>
  )
}
