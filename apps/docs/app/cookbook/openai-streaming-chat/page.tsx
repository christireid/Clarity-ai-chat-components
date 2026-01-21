import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'
export const metadata: Metadata = {
  title: 'OpenAI Streaming Chat - Cookbook - Clarity Chat',
  description:
    'Complete guide to building a streaming chat app with OpenAI and Clarity Chat Components.',
}

export default function OpenAIStreamingChatPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Cookbook</span>
        <h1>OpenAI Streaming Chat</h1>
        <p className="docs-lead">
          Build a complete chat app with OpenAI's streaming API. Users see
          responses appear word-by-word in real-time, just like ChatGPT.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You'll Build</h2>
        <p>A production-ready chat interface with:</p>
        <ul>
          <li>✅ Real-time streaming responses</li>
          <li>✅ Message history</li>
          <li>✅ Loading states</li>
          <li>✅ Error handling with retry</li>
          <li>✅ Proper TypeScript types</li>
        </ul>

        <Callout type="info" title="Time: ~15 minutes">
          This recipe is copy-paste ready. You'll have a working chat in
          minutes.
        </Callout>
      </section>

      <section className="docs-section">
        <Callout type="warning" className="mb-6">
          <strong>Coming Soon!</strong> The Clarity Chat packages are currently in development and not yet available on npm registries. These installation commands will work once the packages are published.
        </Callout>

        <h2>Prerequisites</h2>
        <CodeBlock
          language="bash"
          code={`# Install dependencies
npm install @clarity-chat/react openai

# Get your API key from https://platform.openai.com/api-keys
# Add to .env.local:
OPENAI_API_KEY=sk-...`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 1: Create API Route (Next.js)</h2>
        <p>First, create a server endpoint that streams from OpenAI:</p>
        <CodeBlock
          language="typescript"
          code={`// app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export const runtime = 'edge' // Use Edge Runtime for streaming

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Call OpenAI with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    })

    // Convert to text stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)

  } catch (error) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      { status: 500 }
    )
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 2: Build Chat Component</h2>
        <CodeBlock
          language="typescript"
          code={`// app/chat/page.tsx
import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! How can I help you today?',
      createdAt: new Date()
    }
  ])
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant' as const,
      content: '',
      createdAt: new Date(),
      status: 'streaming' as const
    }])

    setIsLoading(true)

    try {
      // Call your API route
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      // Read the stream
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('No response body')
      }

      let accumulatedContent = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        accumulatedContent += chunk

        // Update AI message with new content
        setMessages(prev => prev.map(m =>
          m.id === aiMessageId
            ? { ...m, content: accumulatedContent }
            : m
        ))
      }

      // Mark as complete
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? { ...m, status: undefined }
          : m
      ))

    } catch (error) {
      console.error('Chat error:', error)
      
      // Show error state
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId
          ? {
              ...m,
              content: 'Sorry, something went wrong. Please try again.',
              status: 'error' as const
            }
          : m
      ))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 3: Add Styles</h2>
        <CodeBlock
          language="typescript"
          code={`// app/layout.tsx
import '@clarity-chat/react/styles.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Working Example</h2>
        <CodePlayground
          initialCode={`import { useState } from 'react'

function StreamingChatDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! Ask me anything. (This is a demo - not actually calling OpenAI)',
      createdAt: new Date()
    }
  ])

  const [isLoading, setIsLoading] = useState(false)

  const simulateStream = async (userInput: string) => {
    const responses = [
      "That's a great question! ",
      "Let me think about that. ",
      "Based on what I know, ",
      "I'd recommend trying this approach: ",
      "First, make sure you have the prerequisites. ",
      "Then, follow these steps..."
    ]

    const aiMessageId = Date.now().toString()
    setMessages(prev => [...prev, {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      status: 'streaming'
    }])

    let accumulated = ''
    for (const chunk of responses) {
      await new Promise(resolve => setTimeout(resolve, 300))
      accumulated += chunk
      setMessages(prev => prev.map(m =>
        m.id === aiMessageId ? { ...m, content: accumulated } : m
      ))
    }

    setMessages(prev => prev.map(m =>
      m.id === aiMessageId ? { ...m, status: undefined } : m
    ))
  }

  const handleSendMessage = async (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content,
      createdAt: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)
    await simulateStream(content)
    setIsLoading(false)
  }

  return (
    <div className="h-[500px] border rounded-xl overflow-hidden">
      <ChatWindow
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  )
}

render(<StreamingChatDemo />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Improvements You Can Add</h2>

        <h3>1. Add System Prompt</h3>
        <CodeBlock
          language="typescript"
          code={`const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo-preview',
  stream: true,
  messages: [
    {
      role: 'system',
      content: 'You are a helpful assistant. Be concise and friendly.'
    },
    ...messages
  ]
})`}
        />

        <h3>2. Save Conversation History</h3>
        <CodeBlock
          language="typescript"
          code={`// Save to database after each message
import { db } from '@/lib/database'

await db.messages.create({
  data: {
    conversationId: conversationId,
    role: message.role,
    content: message.content,
    createdAt: new Date()
  }
})`}
        />

        <h3>3. Add Token Counting</h3>
        <CodeBlock
          language="typescript"
          code={`import { AccurateTokenCounter } from '@clarity-chat/token-optimization'

const counter = new AccurateTokenCounter({ model: 'gpt-4' })
const tokens = counter.count(content)

// Show to user
<TokenCounter current={tokens} limit={4096} />`}
        />
      </section>

      <section className="docs-section">
        <h2>Common Issues & Solutions</h2>

        <h3>Issue: Stream Not Working</h3>
        <p>Make sure you're using Edge Runtime:</p>
        <CodeBlock
          language="typescript"
          code="export const runtime = 'edge' // At top of route.ts"
        />

        <h3>Issue: CORS Errors</h3>
        <p>Add CORS headers to your API route:</p>
        <CodeBlock
          language="typescript"
          code={`return new Response(stream, {
  headers: {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  }
})`}
        />

        <h3>Issue: Rate Limits</h3>
        <p>Implement retry logic with exponential backoff:</p>
        <CodeBlock
          language="typescript"
          code={`async function chatWithRetry(messages, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await openai.chat.completions.create({ ... })
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        // Wait before retry: 1s, 2s, 4s
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
        continue
      }
      throw error
    }
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Full Production Example</h2>
        <p>Complete implementation with all best practices:</p>
        <CodeBlock
          language="typescript"
          code={`// See the complete working example in:
// examples/streaming-chat/

// Includes:
// - Conversation persistence (Supabase)
// - User authentication (NextAuth)
// - Error boundaries
// - Token counting
// - Rate limiting
// - Analytics tracking
// - Mobile responsive`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/cookbook/rag-document-chat" className="docs-card">
            <h3>Add RAG</h3>
            <p>Let users chat with their documents</p>
          </a>
          <a href="/cookbook/agent-with-tools" className="docs-card">
            <h3>Add Tools</h3>
            <p>Let AI call functions and APIs</p>
          </a>
          <a href="/cookbook/authentication" className="docs-card">
            <h3>Add Auth</h3>
            <p>Secure with user accounts</p>
          </a>
          <a href="/cookbook/analytics-tracking" className="docs-card">
            <h3>Add Analytics</h3>
            <p>Track usage and costs</p>
          </a>
        </div>
      </section>
    </div>
  )
}
