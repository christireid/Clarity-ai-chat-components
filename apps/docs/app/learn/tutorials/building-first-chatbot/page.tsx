import React from 'react'
import { Metadata } from 'next'
import { Callout } from '@/components/MDX/Callout'

import { CodePlayground } from '@/components/Playground/CodePlayground'

export const metadata: Metadata = {
  title: 'Tutorial: Building Your First Chatbot',
  description:
    'Step-by-step guide to building a production-ready chatbot in 30 minutes.',
}

export default function BuildingFirstChatbotTutorial() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Tutorial</span>
        <h1>Building Your First Chatbot</h1>
        <p className="docs-lead">
          Create a fully-functional AI chatbot with streaming, memory, and
          beautiful UI in 30 minutes.
        </p>
      </div>

      <section className="docs-section">
        <h2>What You'll Build</h2>
        <p>
          By the end of this tutorial, you'll have a production-ready chatbot
          with:
        </p>
        <ul>
          <li>Real-time streaming responses</li>
          <li>Conversation memory and context</li>
          <li>Beautiful, accessible UI</li>
          <li>Error handling and loading states</li>
          <li>Mobile-responsive design</li>
        </ul>
        <Callout type="info" title="Prerequisites">
          • Node.js 18+ installed
          <br />
          • Basic React/Next.js knowledge
          <br />• OpenAI API key (
          <a href="https://platform.openai.com">get one here</a>)
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Step 1: Setup Project</h2>
        <p>Create a new Next.js project and install dependencies:</p>
        <pre>
          <code>{`npx create-next-app@latest my-chatbot
cd my-chatbot
npm install @clarity-chat/react ai openai`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Step 2: Configure Environment</h2>
        <p>
          Create a <code>.env.local</code> file with your API key:
        </p>
        <pre>
          <code>{`OPENAI_API_KEY=sk-...`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Step 3: Create Chat API Route</h2>
        <p>
          Create <code>app/api/chat/route.ts</code>:
        </p>
        <pre>
          <code>{`import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful AI assistant.'
      },
      ...messages
    ]
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Step 4: Create Chat Component</h2>
        <p>
          Update <code>app/page.tsx</code>:
        </p>
        <CodePlayground
          initialCode={`'use client'
import { useState } from 'react'
import { ChatWindow } from '@clarity-chat/react/internal'

export default function Home() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      chatId: 'demo',
      role: 'assistant',
      content: 'Hello! I am your AI assistant. How can I help you today?',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent'
    }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      chatId: 'demo',
      role: 'user',
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'sent'
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Call your API here
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, userMessage] })
      })

      const data = await response.json()

      // Add AI response
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        chatId: 'demo',
        role: 'assistant',
        content: data.response,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'sent'
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px]">
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          showHeader
          sessionTitle="AI Assistant"
        />
      </div>
    </main>
  )
}

render(<Home />)`}
        />
      </section>

      <section className="docs-section">
        <h2>Step 5: Add Styling</h2>
        <p>
          Import Clarity Chat styles in <code>app/layout.tsx</code>:
        </p>
        <pre>
          <code>{`import '@clarity-chat/react/styles.css'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Step 6: Run Your Chatbot</h2>
        <pre>
          <code>{`npm run dev`}</code>
        </pre>
        <p>
          Open <a href="http://localhost:3000">http://localhost:3000</a> and
          start chatting!
        </p>
        <Callout type="success" title="Congratulations!">
          You've built your first AI chatbot! 🎉
        </Callout>
      </section>

      <section className="docs-section">
        <h2>Next Steps: Add Features</h2>

        <h3>Add Conversation Memory</h3>
        <pre>
          <code>{`// app/api/chat/route.ts
import { MemoryService } from '@clarity-chat/react/server'

const memory = new MemoryService({
  vectorStore: 'pinecone',
  apiKey: process.env.PINECONE_API_KEY
})

export async function POST(req: Request) {
  const { messages, userId } = await req.json()
  
  // Retrieve relevant context
  const context = await memory.retrieveContext({
    query: messages[messages.length - 1].content,
    userId,
    k: 5
  })
  
  // Include context in prompt
  const systemMessage = {
    role: 'system',
    content: \`You are a helpful assistant. Here's relevant context from previous conversations: \${context.join('\\n')}\`
  }
  
  // ... rest of the code
}`}</code>
        </pre>

        <h3>Add File Upload</h3>
        <pre>
          <code>{`import { ChatWindow } from '@clarity-chat/react/internal'

<ChatWindow
  // ... existing props
  enableFileUpload={true}
  acceptedFileTypes={['.pdf', '.txt', '.md']}
  maxFileSize={10 * 1024 * 1024} // 10MB
  onFileUpload={async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
  }}
/>`}</code>
        </pre>

        <h3>Add Custom Theming</h3>
        <pre>
          <code>{`import { ThemeProvider } from '@clarity-chat/react/internal'

<ThemeProvider
  theme={{
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
      surface: '#f9fafb',
      text: '#111827'
    },
    borderRadius: '12px',
    fontFamily: 'Inter, sans-serif'
  }}
>
  <ChatWindow {...props} />
</ThemeProvider>`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>Troubleshooting</h2>

        <h3>API Key Issues</h3>
        <p>If you see authentication errors, make sure:</p>
        <ul>
          <li>
            Your <code>.env.local</code> file is in the project root
          </li>
          <li>
            You've restarted the dev server after adding environment variables
          </li>
          <li>Your API key is valid and has credits</li>
        </ul>

        <h3>Streaming Not Working</h3>
        <p>Ensure your deployment platform supports streaming responses:</p>
        <ul>
          <li>Vercel: Works out of the box</li>
          <li>AWS: Requires response streaming configuration</li>
          <li>Other platforms: Check their streaming documentation</li>
        </ul>

        <h3>Styles Not Applying</h3>
        <p>Make sure you've imported the CSS:</p>
        <pre>
          <code>{`import '@clarity-chat/react/styles.css'`}</code>
        </pre>
      </section>

      <section className="docs-section">
        <h2>What's Next?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/learn/tutorials/adding-rag" className="docs-card">
            <h3>Adding RAG</h3>
            <p>Build a knowledge-based chatbot</p>
          </a>
          <a href="/learn/tutorials/agent-with-tools" className="docs-card">
            <h3>Agent with Tools</h3>
            <p>Let your bot take actions</p>
          </a>
          <a href="/cookbook" className="docs-card">
            <h3>Explore Cookbook</h3>
            <p>More advanced recipes</p>
          </a>
          <a href="/examples" className="docs-card">
            <h3>View Examples</h3>
            <p>Complete example applications</p>
          </a>
        </div>
      </section>
    </div>
  )
}
