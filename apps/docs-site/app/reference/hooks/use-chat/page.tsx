import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'useChat Hook | Clarity Chat',
  description: 'Main hook for chat functionality with message management, streaming, and AI interactions.'
}

export default function UseChatPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">useChat Hook</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Core React hook for building chat interfaces with message management, streaming responses, and AI model integration.
      </p>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Key Features</h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>Message state management with optimistic updates</li>
          <li>Streaming response handling with SSE/WebSocket support</li>
          <li>Multi-model support (OpenAI, Anthropic, Google)</li>
          <li>Automatic token counting and context management</li>
          <li>Error handling and retry logic</li>
          <li>File upload and attachment handling</li>
          <li>Message editing and deletion</li>
          <li>Conversation history persistence</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Basic Usage</h2>
        <div className="bg-muted p-6 rounded-lg">
          <pre className="text-sm overflow-x-auto"><code>{`import { useChat } from '@clarity-chat/react'

function ChatComponent() {
  const {
    messages,
    input,
    setInput,
    sendMessage,
    isLoading,
    error
  } = useChat({
    apiEndpoint: '/api/chat',
    model: 'gpt-4',
    onError: (error) => console.error(error)
  })

  return (
    <div>
      <MessageList messages={messages} />
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}`}</code></pre>
        </div>
      </section>
    </div>
  )
}
