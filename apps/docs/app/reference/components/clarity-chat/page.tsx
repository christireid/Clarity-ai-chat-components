'use client'

import { useState, useCallback } from 'react'
import { ClarityChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'ClarityChat Component | Clarity Chat',
  description: 'The simplest way to add AI chat to your app. Just provide an API endpoint and you\'re done.',
}

// Basic demo component
function BasicClarityChatDemo() {
  return (
    <div className="w-full max-w-2xl" style={{ height: '500px' }}>
      <ClarityChat api="/api/chat" />
    </div>
  )
}

const clarityChatProps: Prop[] = [
  {
    name: 'api',
    type: 'string',
    required: true,
    description: 'API endpoint URL for chat requests. This is the only required prop.',
  },
  {
    name: 'chatId',
    type: 'string',
    description: 'Optional chat ID for conversation persistence across sessions.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the chat container.',
  },
  {
    name: 'emptyState',
    type: 'ReactNode',
    description: 'Custom content to display when there are no messages.',
  },
  {
    name: 'showHeader',
    type: 'boolean',
    default: 'false',
    description: 'Show header with session information.',
  },
  {
    name: 'sessionTitle',
    type: 'string',
    description: 'Title displayed in the header when showHeader is true.',
  },
  {
    name: 'sessionSubtitle',
    type: 'string',
    description: 'Subtitle displayed in the header when showHeader is true.',
  },
  {
    name: 'headerActions',
    type: 'ReactNode',
    description: 'Custom actions to display in the header.',
  },
  {
    name: 'showMessageCount',
    type: 'boolean',
    default: 'false',
    description: 'Show message count badge in the header.',
  },
  {
    name: 'onExport',
    type: '() => void',
    description: 'Callback when user exports the conversation.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Callback when user clears the chat.',
  },
  {
    name: 'autoScroll',
    type: 'boolean',
    default: 'true',
    description: 'Automatically scroll to bottom when new messages arrive.',
  },
  {
    name: 'onMessageCopy',
    type: '(id: string, content: string) => void',
    description: 'Callback when a message is copied to clipboard.',
  },
  {
    name: 'onMessageFeedback',
    type: '(messageId: string, feedbackType: "positive" | "negative") => void',
    description: 'Callback when user provides feedback on a message.',
  },
  {
    name: 'theme',
    type: 'string',
    description: 'Theme name to apply to the chat interface.',
  },
  {
    name: 'showTokenCounter',
    type: 'boolean',
    default: 'false',
    description: 'Show token counter in the input area.',
  },
  {
    name: 'showNetworkStatus',
    type: 'boolean',
    default: 'false',
    description: 'Show network status indicator.',
  },
  {
    name: 'enableMessageOperations',
    type: 'boolean',
    default: 'false',
    description: 'Enable message operations like edit, delete, and branch.',
  },
  {
    name: 'memory',
    type: 'ClarityMemoryOptions',
    description: 'Memory configuration object for conversation context management. Use { enabled: true, strategy: "sliding-window" } instead of memoryStrategy prop.',
  },
  {
    name: 'onError',
    type: '(error: Error, errorInfo?: React.ErrorInfo) => void',
    description: 'Error handler callback with error details.',
  },
  {
    name: 'initialMessages',
    type: 'CoreMessage[]',
    description: 'Initial messages to load in the chat.',
  },
  {
    name: 'streamProtocol',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Streaming protocol to use for real-time responses.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom headers to include in API requests.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body parameters to include in API requests.',
  },
  {
    name: 'maxTokens',
    type: 'number',
    description: 'Maximum tokens for AI responses.',
  },
  {
    name: 'temperature',
    type: 'number',
    description: 'Temperature setting for AI responses (0-2).',
  },
  {
    name: 'model',
    type: 'string',
    description: 'AI model to use (e.g., "gpt-4", "claude-3-opus").',
  },
]

export default function ClarityChatPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>ClarityChat</h1>

      <p className="lead">
        The simplest way to add AI chat to your app. Just provide an API endpoint
        and you're done. All the complexity is handled internally.
      </p>

      <Callout type="success" title="Recommended Entry Point">
        <p>
          <strong>ClarityChat</strong> is the recommended way to get started with Clarity Chat.
          It combines the hook and component into a single, easy-to-use interface.
          For more control, use <code>ChatWindow</code> + <code>useClarityChat</code>.
        </p>
      </Callout>

      <ViewInStorybook component="ClarityChat" />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Get a production-ready AI chat interface in <strong>3 lines of code</strong>:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
        />

        <Callout type="info" title="That's it!">
          <p>
            You now have a production-ready AI chat interface with:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>✨ Beautiful animations and transitions</li>
            <li>⌨️ Full keyboard navigation</li>
            <li>📱 Mobile responsive design</li>
            <li>⚡ Optimized performance</li>
            <li>♿ WCAG AAA accessibility</li>
            <li>🔒 Production-ready security</li>
          </ul>
        </Callout>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try the ClarityChat component with different configurations:
        </p>
        <CodePlayground
          initialCode={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function Example() {
  return (
    <div style={{ height: '500px' }}>
      <ClarityChat api="/api/chat" />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Basic Usage</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Memory</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat 
      api="/api/chat"
      memory={{ enabled: true, strategy: 'sliding-window' }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Custom Header</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat 
      api="/api/chat"
      showHeader
      sessionTitle="AI Assistant"
      sessionSubtitle="Powered by Clarity Chat"
      showMessageCount
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Message Operations</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat 
      api="/api/chat"
      enableMessageOperations
      onMessageCopy={(id, content) => {
        console.log('Copied:', content)
      }}
      onMessageFeedback={(messageId, type) => {
        console.log('Feedback:', type)
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Token Counter</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat 
      api="/api/chat"
      showTokenCounter
      showNetworkStatus
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <ClarityChat 
      api="/api/chat"
      onError={(error, errorInfo) => {
        console.error('Chat error:', error)
        // Send to error tracking service
        if (errorInfo) {
          console.error('Error info:', errorInfo)
        }
      }}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={clarityChatProps} />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">API Endpoint Requirements</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Your API endpoint should accept POST requests and return streaming responses:
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-4">Next.js API Route Example</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`// app/api/chat/route.ts
import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { messages } = await req.json()

  const stream = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    stream: true,
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder()
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content
          if (content) {
            controller.enqueue(encoder.encode(\`data: \${content}\\n\\n\`))
          }
        }
        controller.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    }
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <strong>ClarityChat</strong> is a top-level component that combines:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><code>useClarityChat</code> hook for state management</li>
          <li><code>ChatWindow</code> component for UI rendering</li>
          <li>Automatic message format conversion</li>
          <li>Built-in error handling</li>
          <li>Streaming support</li>
        </ul>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          For more control, you can use these components separately:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useClarityChat, ChatWindow, useChatHandlers } from '@clarity-chat/react'

function CustomChat() {
  const chat = useClarityChat({ api: '/api/chat' })
  const handlers = useChatHandlers({ chat })

  return (
    <ChatWindow
      messages={chat.messages}
      isLoading={chat.isLoading}
      onSendMessage={handlers.onSendMessage}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          ClarityChat is built with accessibility in mind:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>WCAG 2.1 AAA compliant</li>
          <li>Full keyboard navigation support</li>
          <li>Screen reader optimized</li>
          <li>High contrast mode support</li>
          <li>Reduced motion support</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>State management hook used by ClarityChat</p>
          </a>
          <a href="/reference/components/chat-window" className="docs-card">
            <h3>ChatWindow Component</h3>
            <p>UI component used by ClarityChat</p>
          </a>
          <a href="/learn/quick-start" className="docs-card">
            <h3>Quick Start Guide</h3>
            <p>Get started with Clarity Chat</p>
          </a>
          <a href="/guides/getting-started" className="docs-card">
            <h3>Getting Started Guide</h3>
            <p>Comprehensive setup guide</p>
          </a>
        </div>
      </section>

      <Pagination
        previous={{ title: 'Components Overview', href: '/reference/components' }}
        next={{ title: 'ChatWindow', href: '/reference/components/chat-window' }}
      />
    </>
  )
}
