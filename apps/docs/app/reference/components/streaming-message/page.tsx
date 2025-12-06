'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'StreamingMessage Component | Clarity Chat',
  description: 'Display AI responses with token-by-token streaming, tool calls, thinking steps, citations, and error handling.',
}

const streamingMessageProps: Prop[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description: 'Accumulated message content (grows as streaming progresses).',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description: 'Whether streaming is currently in progress.',
  },
  {
    name: 'toolCalls',
    type: 'ToolCall[]',
    description: 'Tool calls made during streaming (for visualization).',
  },
  {
    name: 'citations',
    type: 'Citation[]',
    description: 'Citations/sources referenced in the response.',
  },
  {
    name: 'thinkingSteps',
    type: 'string[]',
    description: 'Chain-of-thought thinking steps (if available).',
  },
  {
    name: 'currentThinkingStep',
    type: 'string',
    description: 'Current thinking step being processed.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Error message if streaming failed.',
  },
  {
    name: 'showThinking',
    type: 'boolean',
    default: 'false',
    description: 'Show thinking steps to the user.',
  },
  {
    name: 'showCitations',
    type: 'boolean',
    default: 'false',
    description: 'Show citations inline with the content.',
  },
  {
    name: 'showTools',
    type: 'boolean',
    default: 'false',
    description: 'Show tool calls and their results.',
  },
  {
    name: 'onToolApprove',
    type: '(toolCall: ToolCall) => void',
    description: 'Callback when user approves a tool call.',
  },
  {
    name: 'onToolReject',
    type: '(toolCall: ToolCall) => void',
    description: 'Callback when user rejects a tool call.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes.',
  },
]

export default function StreamingMessagePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>StreamingMessage</h1>

      <p className="lead">
        Display AI responses with token-by-token streaming, tool calls, thinking steps,
        citations, and error handling. Perfect for real-time AI interactions.
      </p>

      <Callout type="info" title="Real-Time Streaming">
        <p>
          This component is optimized for displaying streaming responses. It handles
          partial JSON parsing, tool call visualization, and provides smooth animations
          during streaming.
        </p>
      </Callout>

      <ViewInStorybook component="StreamingMessage" />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the component:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Try the StreamingMessage component:
        </p>
        <CodePlayground
          initialCode={`import { StreamingMessage } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // Simulate streaming
  const startStream = () => {
    setIsStreaming(true)
    let text = ''
    const words = ['Hello', ' ', 'world', '!', ' ', 'This', ' ', 'is', ' ', 'streaming', '.']
    words.forEach((word, i) => {
      setTimeout(() => {
        text += word
        setContent(text)
        if (i === words.length - 1) setIsStreaming(false)
      }, i * 200)
    })
  }

  return (
    <div>
      <button onClick={startStream}>Start Stream</button>
      <StreamingMessage content={content} isStreaming={isStreaming} />
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">With Tool Calls</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const toolCalls = [
    {
      id: 'call_1',
      name: 'search_web',
      args: { query: 'weather today' },
      state: 'call',
    },
  ]

  return (
    <StreamingMessage
      content="I'll search for that information..."
      isStreaming={false}
      toolCalls={toolCalls}
      showTools
      onToolApprove={(toolCall) => {
        console.log('Tool approved:', toolCall)
      }}
      onToolReject={(toolCall) => {
        console.log('Tool rejected:', toolCall)
      }}
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Citations</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const citations = [
    { id: '1', title: 'Source Document', url: 'https://example.com/doc1' },
    { id: '2', title: 'Reference Paper', url: 'https://example.com/paper2' },
  ]

  return (
    <StreamingMessage
      content="According to the sources..."
      isStreaming={false}
      citations={citations}
      showCitations
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Thinking Steps</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  const thinkingSteps = [
    'First, I need to understand the problem...',
    'Then, I should consider the options...',
    'Finally, I can provide a solution.',
  ]

  return (
    <StreamingMessage
      content="Here's my analysis..."
      isStreaming={false}
      thinkingSteps={thinkingSteps}
      showThinking
    />
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage } from '@clarity-chat/react'

function Chat() {
  return (
    <StreamingMessage
      content=""
      isStreaming={false}
      error="Failed to connect to AI service. Please try again."
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Props</h2>
        <PropsTable props={streamingMessageProps} />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Token-by-token streaming</strong> - Smooth display as content arrives</li>
          <li><strong>Partial JSON parsing</strong> - Handles incomplete JSON during streaming</li>
          <li><strong>Tool call visualization</strong> - Shows tool calls and their results</li>
          <li><strong>Thinking steps</strong> - Displays chain-of-thought reasoning</li>
          <li><strong>Citations</strong> - Shows sources inline or as references</li>
          <li><strong>Error states</strong> - Graceful error display with retry options</li>
          <li><strong>Streaming cursor</strong> - Animated cursor during streaming</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Integration with useStreaming</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use with streaming hooks for complete integration:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { StreamingMessage, useStreamingSSE } from '@clarity-chat/react'

function Chat() {
  const { content, isStreaming, error } = useStreamingSSE({
    url: '/api/chat',
    onMessage: (event) => {
      // Content is automatically accumulated
    },
  })

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      error={error}
    />
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Accessibility</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          StreamingMessage is built with accessibility in mind:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>ARIA live regions for screen readers</li>
          <li>Proper role attributes</li>
          <li>Keyboard navigation support</li>
          <li>Focus management during streaming</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/components/message" className="docs-card">
            <h3>Message Component</h3>
            <p>Static message display (non-streaming)</p>
          </a>
          <a href="/reference/hooks/use-streaming-sse" className="docs-card">
            <h3>useStreamingSSE Hook</h3>
            <p>SSE streaming hook</p>
          </a>
          <a href="/reference/hooks/use-streaming-websocket" className="docs-card">
            <h3>useStreamingWebSocket Hook</h3>
            <p>WebSocket streaming hook</p>
          </a>
          <a href="/guides/streaming" className="docs-card">
            <h3>Streaming Guide</h3>
            <p>Complete streaming guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'Message', href: '/reference/components/message' }}
        next={{ title: 'ThinkingIndicator', href: '/reference/components/thinking-indicator' }}
      />
    </>
  )
}
