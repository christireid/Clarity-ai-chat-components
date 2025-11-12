import React from 'react'
import { Metadata } from 'next'
import { CodeBlock } from '@/components/MDX/CodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Getting Started - Clarity Chat',
  description: 'Welcome to Clarity Chat! This guide will help you get up and running with the library in minutes.',
}

export default function GettingStartedGuidePage() {
  return (
    <div className="docs-content">
      <div className="docs-header">
        <span className="docs-badge">Guide</span>
        <h1>Getting Started</h1>
        <p className="docs-lead">
          Welcome to Clarity Chat! This guide will help you get up and running with the library in minutes.
        </p>
      </div>

      <section className="docs-section">
        <h2>What is Clarity Chat?</h2>
        <p>
          Clarity Chat is an enterprise-grade React component library for building AI chat interfaces. It provides everything you need to create beautiful, production-ready chat applications with minimal effort.
        </p>
      </section>

      <section className="docs-section">
        <h2>Key Features</h2>
        <ul>
          <li><strong>70+ Production-Ready Components</strong>: Complete set of chat UI components</li>
          <li><strong>35+ Custom Hooks</strong>: Powerful hooks for chat functionality</li>
          <li><strong>11 Beautiful Themes</strong>: Stunning themes with 6-level shadow system</li>
          <li><strong>Real-time Streaming</strong>: Built-in SSE and WebSocket support</li>
          <li><strong>Error Handling</strong>: Comprehensive error recovery system</li>
          <li><strong>Token Optimization</strong>: Save 50-80% on AI API costs</li>
          <li><strong>Enterprise AI Infrastructure</strong>: Vector stores, RAG pipeline, agent orchestration</li>
          <li><strong>TypeScript</strong>: Full type safety and IntelliSense</li>
          <li><strong>Accessible</strong>: WCAG 2.1 AAA compliant</li>
          <li><strong>Customizable</strong>: 11 built-in themes with extensive customization options</li>
          <li><strong>Production Ready</strong>: Battle-tested and optimized</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Prerequisites</h2>
        <p>Before you begin, make sure you have:</p>
        <ul>
          <li><strong>Node.js</strong>: Version 18 or higher</li>
          <li><strong>React</strong>: Version 18 or higher</li>
          <li><strong>Package Manager</strong>: npm, yarn, or pnpm</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Installation</h2>
        <p>Choose your package manager:</p>
        <CodeBlock
          language="bash"
          code={`# npm
npm install @clarity-chat/react

# yarn
yarn add @clarity-chat/react

# pnpm
pnpm add @clarity-chat/react`}
        />
      </section>

      <section className="docs-section">
        <h2>Your First Chat</h2>
        <p>Create a simple chat interface in 3 steps:</p>

        <h3>1. Import Components</h3>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'`}
        />

        <h3>2. Set Up State</h3>
        <CodeBlock
          language="tsx"
          code={`function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
}`}
        />

        <h3>3. Handle Messages</h3>
        <CodeBlock
          language="tsx"
          code={`const handleSendMessage = async (content: string) => {
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
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    })
    
    const data = await response.json()
    
    // Add AI response
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: data.message,
      timestamp: Date.now(),
    }])
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    setIsLoading(false)
  }
}`}
        />

        <h3>4. Render Chat</h3>
        <CodeBlock
          language="tsx"
          code={`return (
  <div style={{ width: '800px', height: '600px' }}>
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  </div>
)`}
        />
      </section>

      <section className="docs-section">
        <h2>Complete Example</h2>
        <p>Here&apos;s the full code:</p>
        <CodeBlock
          language="tsx"
          code={`import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! How can I help you today?',
      timestamp: Date.now(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
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
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ width: '800px', height: '600px' }}>
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
        <h2>What&apos;s Next?</h2>
        <p>Now that you have a basic chat working, explore more features:</p>
        <ul>
          <li><a href="/guides/quick-start">Quick Start</a> - Build more advanced features</li>
          <li><a href="/guides/components">Components</a> - Learn about all available components</li>
          <li><a href="/guides/streaming">Streaming</a> - Add real-time streaming</li>
          <li><a href="/guides/error-handling">Error Handling</a> - Handle errors gracefully</li>
          <li><a href="/guides/customization">Customization</a> - Customize the appearance</li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Need Help?</h2>
        <ul>
          <li>Check the <a href="/examples">Examples</a> for working demos</li>
          <li>Read the <a href="/cookbook">Cookbook</a> for common patterns</li>
          <li>Browse the <a href="/reference/components">API Reference</a> for detailed documentation</li>
          <li>Join our <a href="https://github.com/christireid/Clarity-ai-chat-components/discussions" target="_blank" rel="noopener noreferrer">GitHub Discussions</a></li>
        </ul>
      </section>

      <section className="docs-section">
        <h2>Common Issues</h2>

        <h3>TypeScript Errors</h3>
        <p>Make sure you&apos;re using TypeScript 5.0+ and have the correct types imported:</p>
        <CodeBlock
          language="json"
          code={`{
  "compilerOptions": {
    "types": ["@clarity-chat/react"]
  }
}`}
        />

        <h3>Styling Issues</h3>
        <p>Import the default styles if components appear unstyled:</p>
        <CodeBlock
          language="tsx"
          code={`import '@clarity-chat/react/styles.css'`}
        />

        <h3>Performance Issues</h3>
        <p>For large message lists, enable virtualization:</p>
        <CodeBlock
          language="tsx"
          code={`<ChatWindow
  messages={messages}
  virtualizeMessages
  onSendMessage={handleSendMessage}
/>`}
        />
      </section>
    </div>
  )
}
