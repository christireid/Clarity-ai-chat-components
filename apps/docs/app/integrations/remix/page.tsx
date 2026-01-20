import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Remix Integration - Clarity Chat',
  description: 'Complete guide for integrating Clarity Chat with Remix.',
}

export default function RemixIntegrationPage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Integration</span>
        <h1>Remix Integration</h1>
        <p className="docs-lead">
          Complete guide for integrating Clarity Chat with Remix.
        </p>
      </div>

      <section className="docs-section">
        <h2>Quick Start</h2>
        <p>
          <strong>1. Create Remix app:</strong>
        </p>
        <CodeBlock
          language="bash"
          code={`npx create-remix@latest my-chat-app
cd my-chat-app`}
        />

        <p>
          <strong>2. Install Clarity Chat:</strong>
        </p>
        <CodeBlock language="bash" code={`npm install @clarity-chat/react`} />

        <p>
          <strong>3. Add styles to root</strong> (<code>app/root.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import styles from '@clarity-chat/react/styles.css'

export function links() {
  return [{ rel: 'stylesheet', href: styles }]
}`}
        />

        <p>
          <strong>4. Create chat route</strong> (
          <code>app/routes/_index.tsx</code>):
        </p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([])

  const handleSendMessage = async (content: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }])

    // Call action
    const response = await fetch('/api/chat', {
      method: 'POST',
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
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-4xl h-[600px]">
        <ChatWindow messages={messages} onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>API Routes with Actions</h2>
        <p>
          Create <code>app/routes/api.chat.ts</code>:
        </p>
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

  const { content } = await request.json()
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo',
    messages: [{ role: 'user', content }],
  })
  
  return json({ message: completion.choices[0].message.content })
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Environment Variables</h2>
        <p>
          Create <code>.env</code>:
        </p>
        <CodeBlock language="env" code={`OPENAI_API_KEY=sk-...`} />
      </section>

      <section className="docs-section">
        <h2>Deployment</h2>
        <h3>Fly.io</h3>
        <CodeBlock
          language="bash"
          code={`fly launch
fly deploy`}
        />
      </section>

      <section className="docs-section">
        <h2>Example</h2>
        <p>
          See the complete{' '}
          <a href="https://github.com/christireid/Clarity-ai-chat-components/tree/main/examples/multi-user-chat">
            Multi-User Chat example
          </a>{' '}
          built with Remix and Socket.io.
        </p>
      </section>
    </div>
  )
}
