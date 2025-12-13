'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'

export const metadata: Metadata = {
  title: 'Memory Integration Recipe | Clarity Chat Cookbook',
  description:
    'Learn how to add conversation memory to your chat application for context-aware conversations.',
}

export default function MemoryIntegrationPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>Memory Integration Recipe</h1>

      <p className="lead">
        Add conversation memory to your chat application so the AI remembers
        context across messages. Perfect for multi-turn conversations and
        context-aware applications.
      </p>

      <Callout type="info" title="What is Memory?">
        <p>
          Memory allows the AI to remember previous messages in a conversation,
          enabling natural multi-turn dialogues where the AI can reference
          earlier context.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Enable memory with just a few lines:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Chat() {
  return (
    <ClarityChat
      api="/api/chat"
      memory={{
        enabled: true,
        strategy: 'sliding-window',
        maxTokens: 8000,
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Memory Strategies</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Choose the right memory strategy for your use case:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          Sliding Window (Recommended)
        </h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Keeps the most recent messages within a token budget. Automatically
          trims older messages when the budget is exceeded.
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<ClarityChat
  api="/api/chat"
  memory={{
    enabled: true,
    strategy: 'sliding-window',
    maxTokens: 8000, // Keep last 8000 tokens
  }}
/>`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Summary</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Summarizes older messages to save tokens while preserving context.
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<ClarityChat
  api="/api/chat"
  memory={{
    enabled: true,
    strategy: 'summary',
    maxTokens: 4000,
    summaryThreshold: 0.8, // Summarize when 80% of budget used
  }}
/>`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Fixed</h3>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Keeps a fixed number of recent messages.
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`<ClarityChat
  api="/api/chat"
  memory={{
    enabled: true,
    strategy: 'fixed',
    maxMessages: 10, // Keep last 10 messages
  }}
/>`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">With useClarityChat</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          For custom UIs, use the hook directly:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow } from '@clarity-chat/react'

function Chat() {
  const { messages, append, memoryInfo } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 8000,
    },
  })

  // Access memory information
  console.log('Memory tokens used:', memoryInfo?.tokensUsed)
  console.log('Memory messages:', memoryInfo?.messageCount)

  return (
    <ChatWindow
      messages={messages}
      onSendMessage={async (content) => {
        await append({ role: 'user', content })
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Memory Persistence</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Persist memory across sessions using localStorage or a backend:
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-4">
          LocalStorage Persistence
        </h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'
import { useEffect } from 'react'

function Chat() {
  const chatId = 'my-chat-session'
  
  const chat = useClarityChat({
    api: '/api/chat',
    chatId,
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  // Load memory from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(\`chat-memory-\${chatId}\`)
    if (saved) {
      const messages = JSON.parse(saved)
      chat.setMessages(messages)
    }
  }, [])

  // Save memory to localStorage
  useEffect(() => {
    if (chat.messages.length > 0) {
      localStorage.setItem(
        \`chat-memory-\${chatId}\`,
        JSON.stringify(chat.messages)
      )
    }
  }, [chat.messages])

  return <ChatWindow messages={chat.messages} />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Backend Persistence</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'
import { useEffect } from 'react'

function Chat() {
  const chatId = 'user-123-session-456'
  
  const chat = useClarityChat({
    api: '/api/chat',
    chatId,
    memory: {
      enabled: true,
      strategy: 'sliding-window',
    },
  })

  // Load memory from backend
  useEffect(() => {
    fetch(\`/api/chat/\${chatId}/memory\`)
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          chat.setMessages(data.messages)
        }
      })
  }, [])

  // Save memory to backend (on message change)
  useEffect(() => {
    if (chat.messages.length > 0) {
      fetch(\`/api/chat/\${chatId}/memory\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chat.messages }),
      })
    }
  }, [chat.messages])

  return <ChatWindow messages={chat.messages} />
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Memory Monitoring</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Monitor memory usage to optimize performance:
        </p>

        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat } from '@clarity-chat/react'

function Chat() {
  const { messages, memoryInfo, memoryErrorInfo } = useClarityChat({
    api: '/api/chat',
    memory: {
      enabled: true,
      strategy: 'sliding-window',
      maxTokens: 8000,
    },
  })

  return (
    <div>
      {memoryInfo && (
        <div className="memory-stats">
          <p>Messages in memory: {memoryInfo.messageCount}</p>
          <p>Tokens used: {memoryInfo.tokensUsed} / {memoryInfo.maxTokens}</p>
          <p>Usage: {((memoryInfo.tokensUsed / memoryInfo.maxTokens) * 100).toFixed(1)}%</p>
        </div>
      )}
      
      {memoryErrorInfo && (
        <div className="memory-error">
          <p>Memory error: {memoryErrorInfo.message}</p>
        </div>
      )}

      <ChatWindow messages={messages} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Best Practices</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>
            <strong>Choose the right strategy</strong> - Sliding window for most
            cases, summary for very long conversations
          </li>
          <li>
            <strong>Set appropriate token budgets</strong> - Balance context vs.
            cost
          </li>
          <li>
            <strong>Monitor memory usage</strong> - Use memoryInfo to track
            usage
          </li>
          <li>
            <strong>Persist important conversations</strong> - Save to backend
            for long-term storage
          </li>
          <li>
            <strong>Clear memory when needed</strong> - Reset conversations with
            chat.setMessages([])
          </li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/clarity-chat" className="docs-card">
            <h3>ClarityChat Component</h3>
            <p>Component with built-in memory support</p>
          </a>
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Hook with memory management</p>
          </a>
          <a href="/guides/memory" className="docs-card">
            <h3>Memory Guide</h3>
            <p>Complete memory management guide</p>
          </a>
          <a href="/cookbook/quick-start-3-lines" className="docs-card">
            <h3>Quick Start Recipe</h3>
            <p>Get started quickly</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{
          title: '3-Line Quick Start',
          href: '/cookbook/quick-start-3-lines',
        }}
        next={{ title: 'Streaming Setup', href: '/cookbook/streaming-setup' }}
      />
    </>
  )
}
