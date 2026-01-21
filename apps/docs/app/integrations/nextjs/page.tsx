import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Next.js Integration - Clarity Chat',
  description:
    'Complete guide for integrating Clarity Chat with Next.js 15 App Router and Pages Router.',
}

export default function NextJSIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Integration</span>
        <h1>Next.js Integration</h1>
        <p className="docs-lead">
          Complete guide for integrating Clarity Chat with Next.js 15 App Router
          and Pages Router.
        </p>
      </div>

      <section className="docs-section">
        <Callout type="warning" className="mb-6">
          <strong>Coming Soon!</strong> The Clarity Chat packages are currently in development and not yet available on npm registries. These installation commands will work once the packages are published.
        </Callout>

        <h2>Quick Start</h2>
        <h3>App Router (Recommended)</h3>
        <p>
          <strong>1. Install package:</strong>
        </p>
        <CodeBlock language="bash" code={`npm install @clarity-chat/react`} />

        <p>
          <strong>2. Create client component</strong> (
          <code>app/components/Chat.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`'use client'

import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])
    setIsLoading(true)

    // Call API route
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    const data = await response.json()
    
    // Add AI response
    setMessages(prev => [...prev, {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
    setIsLoading(false)
  }

  return <ChatWindow messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />
}`}
        />

        <p>
          <strong>3. Create API route</strong> (
          <code>app/api/chat/route.ts</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import { OpenAI } from 'openai'
import { NextRequest } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content }],
  })
  
  return Response.json({ message: completion.choices[0].message.content })
}`}
        />

        <p>
          <strong>4. Use in page</strong> (<code>app/page.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import { Chat } from './components/Chat'
import '@clarity-chat/react/styles.css'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl h-[600px]">
        <Chat />
      </div>
    </main>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Streaming with SSE</h2>
        <p>
          For real-time streaming responses, see the{' '}
          <a href="/examples/streaming">Streaming Chat Demo</a> for complete
          implementation details.
        </p>
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>
          Create <code>.env.local</code>:
        </p>
        <CodeBlock language="env" code={`OPENAI_API_KEY=sk-...`} />
      </section>

      <section className="docs-section">
        <h2>Deployment</h2>
        <h3>Vercel</h3>
        <CodeBlock language="bash" code={`vercel`} />
      </section>

      <section className="docs-section">
        <h2>Examples</h2>
        <ul>
          <li>
            <a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/basic-chat">
              Basic Chat
            </a>
          </li>
          <li>
            <a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/streaming-chat">
              Streaming Chat
            </a>
          </li>
          <li>
            <a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/customer-support">
              Customer Support
            </a>
          </li>
        </ul>
      </section>
    </div>
  )
}
