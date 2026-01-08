import { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Interactive Examples - Clarity Chat',
  description:
    'Interactive examples and playgrounds for Clarity Chat components',
}

export default function InteractiveGuidePage() {
  return (
    <>
      <Breadcrumbs />

      <div className="docs-content">
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h1>Interactive Examples</h1>
          <p className="lead">
            Try out Clarity Chat components directly in your browser! Edit the
            code and see changes in real-time.
          </p>

          <h2>Basic Chat Window</h2>
          <p>A minimal chat window with message sending capability:</p>
          <CodePlayground
            code={`function BasicChat() {
  const [messages, setMessages] = React.useState([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ])
  const [input, setInput] = React.useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="space-y-2 mb-4">
        {messages.map((msg, i) => (
          <div key={i} className={\`p-2 rounded \${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}\`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>
    </div>
  )
}

render(<BasicChat />)`}
          />

          <h2>Streaming Messages</h2>
          <p>Simulate streaming responses with typing animation:</p>
          <CodePlayground
            code={`function StreamingDemo() {
  const [message, setMessage] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(false)
  const fullMessage = 'This is a simulated streaming response that appears letter by letter...'

  const startStreaming = () => {
    setIsStreaming(true)
    setMessage('')
    let i = 0
    const interval = setInterval(() => {
      if (i < fullMessage.length) {
        setMessage(prev => prev + fullMessage[i])
        i++
      } else {
        clearInterval(interval)
        setIsStreaming(false)
      }
    }, 50)
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="min-h-[100px] p-4 bg-gray-100 rounded mb-4">
        {message || 'Click stream to start...'}
        {isStreaming && <span className="animate-pulse">▌</span>}
      </div>
      <button
        onClick={startStreaming}
        disabled={isStreaming}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isStreaming ? 'Streaming...' : 'Start Stream'}
      </button>
    </div>
  )
}

render(<StreamingDemo />)`}
          />

          <h2>More Examples</h2>
          <p>
            Explore our full examples collection for more interactive
            demonstrations:
          </p>
          <ul>
            <li>
              <Link href="/examples">Examples Gallery</Link>
            </li>
            <li>
              <Link href="/learn/quick-start">Quick Start Tutorial</Link>
            </li>
            <li>
              <Link href="/reference/components">Component Reference</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}
