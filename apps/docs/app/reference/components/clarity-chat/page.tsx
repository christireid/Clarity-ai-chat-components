'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, ClarityChat, MemoryProvider } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic demo component
function BasicChatDemo() {
  return (
    <div className="w-full max-w-2xl" style={{ height: '400px' }}>
      <ClarityChat
        api="/api/chat"
        className="border border-border rounded-lg"
      />
    </div>
  )
}

// With memory demo
function MemoryChatDemo() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <div className="w-full max-w-2xl" style={{ height: '400px' }}>
        <ClarityChat
          api="/api/chat"
          memory={{ enabled: true, strategy: 'sliding-window', maxTokens: 4000 }}
          className="border border-border rounded-lg"
        />
      </div>
    </MemoryProvider>
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
    description: 'Callback function triggered when user exports the conversation.',
  },
  {
    name: 'onClear',
    type: '() => void',
    description: 'Callback function triggered when user clears the chat.',
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
    description: 'Theme for the chat interface. Can be "light", "dark", or "auto".',
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
    description: 'Show network connection status indicator.',
  },
  {
    name: 'enableMessageOperations',
    type: 'boolean',
    default: 'false',
    description: 'Enable message operations like edit, delete, and branch.',
  },
  {
    name: 'memoryStrategy',
    type: '"sliding-window" | "semantic-chunks" | "vector-store"',
    description: 'Memory strategy for conversation context. Requires MemoryProvider.',
  },
  {
    name: 'onError',
    type: '(error: Error, errorInfo?: React.ErrorInfo) => void',
    description: 'Error handler callback with error details.',
  },
  {
    name: 'memory',
    type: 'ClarityMemoryOptions',
    description: 'Memory configuration object. See useClarityChat hook for details.',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses for real-time updates.',
  },
  {
    name: 'transport',
    type: '"sse" | "websocket"',
    default: '"sse"',
    description: 'Transport protocol for streaming. SSE is default, WebSocket for bidirectional.',
  },
  {
    name: 'promptOptimization',
    type: 'ClarityPromptOptimizationOptions',
    description: 'Prompt optimization configuration. See useClarityChat hook for details.',
  },
]

export const dynamic = 'force-dynamic'

export default function ClarityChatPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>ClarityChat</h1>

        <p className="lead">
          The simplest way to add AI chat to your React application. Just provide an API endpoint
          and you're done. All the complexity is handled internally.
        </p>

        <Callout type="info">
          <p>
            <strong>Recommended Entry Point:</strong> This is the recommended way to use Clarity
            Chat for most use cases. It combines the hook and component into a single, easy-to-use
            interface with automatic message format conversion, built-in loading states, error
            handling, and more.
          </p>
        </Callout>

        <Callout type="tip">
          <p>
            For more control, use mid-level APIs like <code>ChatWindow</code> +{' '}
            <code>useClarityChat</code> + <code>useChatHandlers</code>. See the{' '}
            <a href="/reference/components/chat-window">ChatWindow documentation</a> for details.
          </p>
        </Callout>

        <ViewInStorybook component="ClarityChat" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Experiment with the ClarityChat component! Try different configurations including
            memory, streaming, and customization options.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  return (
    <ClarityChat api="/api/chat" />
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>
          The simplest way to use ClarityChat is to just provide an API endpoint. Everything else
          is handled automatically:
        </p>

        <ComponentPreview
          title="Simple Chat Interface"
          description="A minimal chat interface with zero configuration"
          code={`import { ClarityChat } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return <ClarityChat api="/api/chat" />
}`}
        >
          <BasicChatDemo />
        </ComponentPreview>

        <Callout type="warning">
          <p>
            <strong>Note:</strong> The demo above uses a placeholder API endpoint. In a real
            application, you'll need to implement the <code>/api/chat</code> route. See the{' '}
            <a href="#examples">Next.js API Route Example</a> below for a complete implementation.
          </p>
        </Callout>

        <h2 id="with-memory">With Memory</h2>

        <p>
          Enable conversation memory for context-aware responses. You'll need to wrap your app with
          a <code>MemoryProvider</code>:
        </p>

        <EnhancedCodeBlock
          code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'sliding-window',
          maxTokens: 4000,
        }}
      />
    </MemoryProvider>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <ComponentPreview
          title="Chat with Memory"
          description="Context-aware conversations with memory enabled"
          code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChat
        api="/api/chat"
        memory={{
          enabled: true,
          strategy: 'sliding-window',
          maxTokens: 4000,
        }}
      />
    </MemoryProvider>
  )
}`}
        >
          <MemoryChatDemo />
        </ComponentPreview>

        <Callout type="info">
          <p>
            Learn more about memory strategies in the{' '}
            <a href="/guides/memory">Memory System Guide</a>.
          </p>
        </Callout>

        <h2 id="with-streaming">With Streaming</h2>

        <p>
          Streaming is enabled by default. You can configure the transport protocol (SSE or
          WebSocket):
        </p>

        <EnhancedCodeBlock
          code={`// SSE (default) - Server-Sent Events
<ClarityChat api="/api/chat" transport="sse" />

// WebSocket - Bidirectional real-time communication
<ClarityChat api="/api/chat" transport="websocket" />`}
          language="tsx"
        />

        <Callout type="tip">
          <p>
            SSE is the default and works with most backends. WebSocket is better for
            bidirectional communication or when you need lower latency.
          </p>
        </Callout>

        <h2 id="with-header">With Header</h2>

        <p>Add a header with session information and custom actions:</p>

        <EnhancedCodeBlock
          code={`<ClarityChat
  api="/api/chat"
  showHeader
  sessionTitle="AI Assistant"
  sessionSubtitle="Always here to help"
  showMessageCount
  headerActions={
    <button onClick={handleExport}>Export</button>
  }
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-customization">Customization</h2>

        <p>Customize the chat appearance and behavior:</p>

        <EnhancedCodeBlock
          code={`<ClarityChat
  api="/api/chat"
  className="h-screen max-w-4xl mx-auto"
  theme="dark"
  showTokenCounter
  showNetworkStatus
  enableMessageOperations
  onMessageCopy={(id, content) => {
    navigator.clipboard.writeText(content)
    console.log('Message copied:', id)
  }}
  onMessageFeedback={(messageId, type) => {
    console.log('Feedback:', messageId, type)
  }}
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="error-handling">Error Handling</h2>

        <p>Handle errors with a custom error handler:</p>

        <EnhancedCodeBlock
          code={`<ClarityChat
  api="/api/chat"
  onError={(error, errorInfo) => {
    console.error('Chat error:', error)
    console.error('Error info:', errorInfo)
    // Send to error tracking service
    errorTrackingService.captureException(error, {
      extra: errorInfo,
    })
  }}
/>`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="props">Props</h2>

        <PropsTable props={clarityChatProps} />

        <h2 id="memory-options">Memory Options</h2>

        <p>
          When using memory, you can configure it with the <code>memory</code> prop:
        </p>

        <EnhancedCodeBlock
          code={`interface ClarityMemoryOptions {
  /** Enable memory integration */
  enabled?: boolean
  /** Memory strategy: sliding-window, semantic-chunks, or vector-store */
  strategy?: 'sliding-window' | 'semantic-chunks' | 'vector-store'
  /** Maximum tokens for memory context */
  maxTokens?: number
  /** Retry failed memory operations (default: true) */
  retryOnError?: boolean
  /** Maximum retry attempts for memory operations (default: 2) */
  maxRetryAttempts?: number
  /** Callback when memory operation fails */
  onMemoryError?: (error: Error, operation: 'query' | 'store') => void
}`}
          language="tsx"
        />

        <h2 id="examples">Examples</h2>

        <h3>Complete Example with All Features</h3>

        <EnhancedCodeBlock
          code={`import { ClarityChat, MemoryProvider } from '@clarity-chat/react'
import '@clarity-chat/react/styles.css'

function App() {
  return (
    <MemoryProvider config={{ maxTokens: 10000 }}>
      <ClarityChat
        api="/api/chat"
        chatId="my-chat-session"
        showHeader
        sessionTitle="AI Assistant"
        sessionSubtitle="Powered by Clarity Chat"
        showMessageCount
        showTokenCounter
        showNetworkStatus
        enableMessageOperations
        memory={{
          enabled: true,
          strategy: 'vector-store',
          maxTokens: 8000,
        }}
        transport="sse"
        onMessageCopy={(id, content) => {
          navigator.clipboard.writeText(content)
        }}
        onMessageFeedback={(messageId, type) => {
          // Track feedback
          analytics.track('message_feedback', { messageId, type })
        }}
        onError={(error) => {
          console.error('Chat error:', error)
        }}
      />
    </MemoryProvider>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h3>Next.js API Route Example</h3>

        <p>Here's how to set up the API route for Next.js App Router:</p>

        <EnhancedCodeBlock
          code={`// app/api/chat/route.ts
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  // Call your AI API (OpenAI, Anthropic, etc.)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${process.env.OPENAI_API_KEY}\`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages,
      stream: true, // Enable streaming
    }),
  })

  // Return streaming response
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
    },
  })
}`}
          language="tsx"
          showLineNumbers
        />

        <Callout type="success">
          <p>
            <strong>Great job!</strong> You now know how to use the ClarityChat component. Check out
            the <a href="/reference/components/clarity-chat-presets">ClarityChatPresets</a> for
            pre-configured variants, or explore{' '}
            <a href="/reference/components/chat-window">ChatWindow</a> for more control.
          </p>
        </Callout>

        <h2 id="accessibility">Accessibility</h2>

        <p>ClarityChat is built with accessibility in mind:</p>

        <ul>
          <li>✅ Full keyboard navigation support</li>
          <li>✅ ARIA labels and roles for screen readers</li>
          <li>✅ Focus management for input and buttons</li>
          <li>✅ High contrast mode compatible</li>
          <li>✅ Reduced motion support</li>
        </ul>

        <h2 id="performance">Performance Tips</h2>

        <Callout type="tip">
          <p>For optimal performance:</p>
          <ul>
            <li>Use memory strategies to limit context size</li>
            <li>Enable prompt optimization for large conversations</li>
            <li>Use virtualized message lists for 1000+ messages</li>
            <li>Debounce typing indicators</li>
            <li>Lazy load message attachments</li>
          </ul>
        </Callout>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/components/clarity-chat-presets">ClarityChatPresets</a> - Pre-configured variants
          </li>
          <li>
            <a href="/reference/components/chat-window">ChatWindow</a> - Composable chat component
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> - Chat state hook
          </li>
          <li>
            <a href="/guides/memory">Memory System Guide</a> - Memory strategies and setup
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - SSE vs WebSocket comparison
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'Components Overview',
            href: '/reference/components',
          }}
          next={{
            title: 'ClarityChatPresets',
            href: '/reference/components/clarity-chat-presets',
          }}
        />
      </>
    </ToastProvider>
  )
}
