import React from 'react'
import { Metadata } from 'next'
import { CodePlayground } from '@/components/Playground/CodePlayground'
export const metadata: Metadata = {
  title: 'Example: Token Optimization',
  description:
    'End-to-end example combining retrieval, compression, and reranking.',
}

export default function TokenOptimizationExample() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Example</span>
        <h1>Token Optimization</h1>
        <p className="docs-lead">
          Token budget management with live metrics.
        </p>
      </div>

      <section className="docs-section">
        <h2>Live Demo</h2>
        <CodePlayground
          initialCode={`function Example() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hello! I can help you understand token optimization.',
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ])

  const handleSendMessage = (content) => {
    const newMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      status: 'sent',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setMessages([...messages, newMessage])
  }

  return (
    <TokenBudgetProvider maxTokens={4096}>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 border rounded h-96">
          <ChatWindow
            messages={messages}
            onSendMessage={handleSendMessage}
          />
        </div>
        <div className="space-y-3 p-4 border rounded">
          <h3 className="font-semibold">Token Usage</h3>
          <TokenCounter showUsage showRemaining />
        </div>
      </div>
    </TokenBudgetProvider>
  )
}

render(<Example />)`}
        />
      </section>
    </div>
  )
}
