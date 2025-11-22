import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Callout } from '@/components/MDX/Callout'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Quick Start - Clarity Chat',
  description: 'Build a fully functional AI chat application in under 10 minutes.',
}

export default function QuickStartGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Quick Start</h1>
        <p className="docs-lead">
          Build a fully functional AI chat application in under 10 minutes.
        </p>
      </div>

      <section className="docs-section">
        <h2>Prerequisites</h2>
        <ul>
          <li>Node.js 18+ installed</li>
          <li>Basic knowledge of React</li>
          <li>An OpenAI API key (or another AI provider)</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Step 1: Create a New Project</h2>
        <CodeBlock
          language="bash"
          code={`# Next.js
npx create-next-app@latest my-chat-app --typescript
cd my-chat-app

# Vite
npm create vite@latest my-chat-app -- --template react-ts
cd my-chat-app

# Remix
npx create-remix@latest my-chat-app
cd my-chat-app`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 2: Install Clarity Chat</h2>
        <CodeBlock language="bash" code="npm install @clarity-chat/react" />
      </section>

      <section className="docs-section">
        <h2>Step 3: Create Chat Component</h2>
        <p>Create <code>components/Chat.tsx</code>:</p>
        <CodeBlock
          language="tsx"
          code={`'use client' // Next.js App Router only

import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    timestamp: Date.now(),
  }])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: [...messages, userMessage] 
        }),
      })
      
      const data = await response.json()
      
      // Add AI response
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
        error: true,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '800px', height: '600px' }}>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 4: Create API Route</h2>

        <h3>Next.js App Router</h3>
        <p>Create <code>app/api/chat/route.ts</code>:</p>
        <CodeBlock
          language="typescript"
          code={`import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
    })
    
    return Response.json({ 
      message: completion.choices[0].message.content 
    })
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}`}
        />

        <h3>Next.js Pages Router</h3>
        <p>Create <code>pages/api/chat.ts</code>:</p>
        <CodeBlock
          language="typescript"
          code={`import { OpenAI } from 'openai'
import type { NextApiRequest, NextApiResponse } from 'next'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages } = req.body
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
    })
    
    res.json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Failed to process request' })
  }
}`}
        />

        <h3>Remix</h3>
        <p>Create <code>app/routes/api.chat.ts</code>:</p>
        <CodeBlock
          language="typescript"
          code={`import { OpenAI } from 'openai'
import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  try {
    const { messages } = await request.json()
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
    })
    
    return json({ message: completion.choices[0].message.content })
  } catch (error) {
    console.error('Error:', error)
    return json({ error: 'Failed to process request' }, { status: 500 })
  }
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 5: Add Environment Variables</h2>
        <p>Create <code>.env.local</code>:</p>
        <CodeBlock language="env" code="OPENAI_API_KEY=sk-...your-api-key-here" />
        <Callout type="warning" title="Important">
          Add <code>.env.local</code> to your <code>.gitignore</code>:
          <CodeBlock language="gitignore" code=".env*.local" />
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Step 6: Use the Chat Component</h2>

        <h3>Next.js App Router</h3>
        <p>Update <code>app/page.tsx</code>:</p>
        <CodeBlock
          language="tsx"
          code={`import { Chat } from '@/components/Chat'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <Chat />
    </main>
  )
}`}
        />

        <h3>Vite</h3>
        <p>Update <code>src/App.tsx</code>:</p>
        <CodeBlock
          language="tsx"
          code={`import { Chat } from './components/Chat'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      minHeight: '100vh',
      padding: '2rem',
    }}>
      <Chat />
    </div>
  )
}

export default App`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 7: Run Your App</h2>
        <CodeBlock language="bash" code="npm run dev" />
        <p>Visit <code>http://localhost:3000</code> and start chatting!</p>
      </section>

      <section className="docs-section">
        <h2>What You Built</h2>
        <p>Congratulations! You now have a working AI chat application with:</p>
        <ul>
          <li>✅ Beautiful UI from Clarity Chat</li>
          <li>✅ OpenAI integration</li>
          <li>✅ Real-time message handling</li>
          <li>✅ Error handling</li>
          <li>✅ Loading states</li>
          <li>✅ TypeScript support</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>

        <h3>Add Streaming</h3>
        <p>Enable real-time streaming for better UX:</p>
        <CodeBlock
          language="tsx"
          code={`// See the Streaming guide
import { useStreamingChat } from '@clarity-chat/react'`}
        />
        <p><a href="/guides/streaming">Learn about streaming →</a></p>

        <h3>Add File Upload</h3>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onFileUpload={handleFileUpload}
  enableFileUpload
/>`}
        />
        <p><a href="/guides/file-upload">Learn about file uploads →</a></p>

        <h3>Add Message Operations</h3>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  onEditMessage={handleEdit}
  onRegenerateMessage={handleRegenerate}
  enableMessageOperations
/>`}
        />
        <p><a href="/guides/message-operations">Learn about message operations →</a></p>

        <h3>Customize Styling</h3>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  onSendMessage={handleSendMessage}
  theme={{
    primaryColor: '#6366f1',
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif',
  }}
/>`}
        />
        <p><a href="/guides/theming">Learn about theming →</a></p>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>API Key Errors</h3>
        <p>Make sure your <code>.env.local</code> file is in the project root and contains:</p>
        <CodeBlock language="env" code="OPENAI_API_KEY=sk-..." />
        <p>Restart your dev server after adding environment variables.</p>

        <h3>CORS Errors</h3>
        <p>If you&apos;re calling an external API, you may need to configure CORS:</p>
        <CodeBlock
          language="typescript"
          code={`// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}`}
        />

        <h3>Type Errors</h3>
        <p>Make sure you&apos;re importing types correctly:</p>
        <CodeBlock language="tsx" code={`import type { Message } from '@clarity-chat/types'`} />
      </section>

      <section className="docs-section">
        <h2>Full Example Code</h2>
        <p>Check out the complete working examples in our repository:</p>
        <ul>
          <li><a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat" target="_blank" rel="noopener noreferrer">Basic Chat (Vite)</a></li>
          <li><a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/streaming-chat" target="_blank" rel="noopener noreferrer">Streaming Chat (Next.js)</a></li>
          <li><a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/customer-support" target="_blank" rel="noopener noreferrer">Customer Support (Next.js + Supabase)</a></li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Learn More</h2>
        <ul>
          <li><a href="/guides/components">Components Guide</a> - Explore all components</li>
          <li><a href="/guides/hooks">Hooks Guide</a> - Learn about available hooks</li>
          <li><a href="/reference/components">API Reference</a> - Detailed API documentation</li>
          <li><a href="/cookbook">Cookbook</a> - Recipes for common patterns</li>
        </ul>
      </section>
    </div>
  )
}
