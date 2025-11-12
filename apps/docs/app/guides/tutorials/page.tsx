import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Tutorials - Clarity Chat',
  description: 'Step-by-step tutorials for building common chat applications with Clarity Chat.',
}

export default function TutorialsGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Tutorials</h1>
        <p className="docs-lead">
          Step-by-step tutorials for building common chat applications with Clarity Chat.
        </p>
      </div>

      <section className="docs-section">
        <h2>Table of Contents</h2>
        <ol>
          <li><a href="#building-your-first-chat-app">Building Your First Chat App</a></li>
          <li><a href="#adding-streaming-responses">Adding Streaming Responses</a></li>
          <li><a href="#implementing-rag">Implementing RAG</a></li>
          <li><a href="#building-a-multi-tenant-saas">Building a Multi-Tenant SaaS</a></li>
          <li><a href="#creating-an-ai-agent">Creating an AI Agent</a></li>
        </ol>
      </section>

      <section className="docs-section">
        <h2 id="building-your-first-chat-app">Building Your First Chat App</h2>
        <p>
          In this tutorial, you&apos;ll build a complete chat application from scratch.
        </p>

        <h3>Step 1: Setup</h3>
        <CodeBlock
          language="bash"
          code={`npx create-next-app@latest my-chat-app
cd my-chat-app
npm install @clarity-chat/react`}
        />

        <h3>Step 2: Create the Chat Component</h3>
        <p>
          Create <code>app/components/Chat.tsx</code>:
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

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      const data = await response.json()
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Chat error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSend}
    />
  )
}`}
        />
      </section>

      <section className="docs-section">
        <h2>Next Steps</h2>
        <ul>
          <li>Explore the <a href="/cookbook">Cookbook</a> for more patterns</li>
          <li>Check out <a href="/reference/components">API Reference</a> for detailed documentation</li>
          <li>Read <a href="/guides/agents">Advanced Guides</a> for more complex features</li>
        </ul>
      </section>
    </div>
  )
}
