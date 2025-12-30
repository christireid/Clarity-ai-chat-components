'use client'

import { useState, useCallback, useEffect } from 'react'
import { StreamingMessage } from '@clarity-chat/react/internal'
import type { ToolCall, Citation } from '@/types/demo-types'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Basic streaming demo
function BasicStreamingDemo() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    const text = 'This is a streaming message that appears token by token...'
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setContent(text.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <StreamingMessage content={content} isStreaming={isStreaming} />
    </div>
  )
}

// With tool calls demo
function StreamingWithToolsDemo() {
  const [content, setContent] = useState('I need to check the weather.')
  const [isStreaming] = useState(false)
  const [toolCalls] = useState<ToolCall[]>([
    {
      id: 'call-1',
      type: 'function',
      function: {
        name: 'get_weather',
        arguments: JSON.stringify({
          location: 'San Francisco',
          unit: 'celsius',
        }),
      },
    },
  ])

  const handleToolApprove = useCallback((tool: ToolCall) => {
    console.log('Tool approved:', tool)
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <StreamingMessage
        content={content}
        isStreaming={isStreaming}
        toolCalls={toolCalls}
        showTools
        onToolApprove={handleToolApprove}
      />
    </div>
  )
}

const streamingMessageProps: Prop[] = [
  {
    name: 'content',
    type: 'string',
    required: true,
    description:
      'Accumulated message content. Updates as streaming progresses.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    default: 'false',
    description:
      'Whether streaming is currently in progress. Shows streaming cursor when true.',
  },
  {
    name: 'toolCalls',
    type: 'ToolCall[]',
    default: '[]',
    description:
      'Array of tool calls made during streaming. Displayed with approve/reject buttons.',
  },
  {
    name: 'citations',
    type: 'Citation[]',
    default: '[]',
    description: 'Array of citations/sources referenced in the response.',
  },
  {
    name: 'thinkingSteps',
    type: 'string[]',
    default: '[]',
    description:
      'Array of thinking steps (chain-of-thought) shown during reasoning.',
  },
  {
    name: 'currentThinkingStep',
    type: 'string',
    description:
      'Current thinking step being processed. Shown with loading indicator.',
  },
  {
    name: 'error',
    type: 'string',
    description: 'Error message to display if streaming failed.',
  },
  {
    name: 'showThinking',
    type: 'boolean',
    default: 'true',
    description: 'Show thinking steps section when available.',
  },
  {
    name: 'showCitations',
    type: 'boolean',
    default: 'true',
    description: 'Show citations section when available.',
  },
  {
    name: 'showTools',
    type: 'boolean',
    default: 'true',
    description: 'Show tool calls section when available.',
  },
  {
    name: 'onToolApprove',
    type: '(toolCall: ToolCall) => void',
    description:
      'Callback when user approves a tool call. Shows approve button.',
  },
  {
    name: 'onToolReject',
    type: '(toolCall: ToolCall) => void',
    description: 'Callback when user rejects a tool call. Shows reject button.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Additional CSS classes to apply to the container element.',
  },
]

export default function StreamingMessagePage() {
  return (
    <>
      <Breadcrumbs />

      <h1>StreamingMessage</h1>

      <p className="lead">
        A specialized component for displaying AI responses with token-by-token
        streaming, tool calls, thinking steps, citations, and error handling.
        Perfect for real-time AI interactions.
      </p>

      <Callout type="info">
        <p>
          StreamingMessage is designed specifically for streaming responses. For
          regular messages, use the{' '}
          <a href="/reference/components/message">Message</a> component instead.
        </p>
      </Callout>

      <ViewInStorybook component="StreamingMessage" />

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Watch a message stream in real-time! See how content appears token by
          token.
        </p>
        <CodePlayground
          initialCode={`function Example() {
  const [content, setContent] = React.useState('')
  const [isStreaming, setIsStreaming] = React.useState(true)

  React.useEffect(() => {
    const text = 'This is a streaming message...'
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setContent(text.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
    />
  )
}

render(<Example />)`}
        />
      </section>

      <h2 id="import">Import</h2>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'
import type { ToolCall, Citation } from '@clarity-chat/react/internal'
import '@clarity-chat/react/styles.css'`}
        language="tsx"
      />

      <h2 id="basic-usage">Basic Usage</h2>

      <p>
        StreamingMessage displays content as it streams in, with a blinking
        cursor indicator:
      </p>

      <ComponentPreview
        title="Simple Streaming Message"
        description="Basic streaming with token-by-token display"
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'
import { useState, useEffect } from 'react'

function SimpleStreaming() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)

  useEffect(() => {
    // Simulate streaming
    const text = 'This message streams in token by token...'
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setContent(text.slice(0, index + 1))
        index++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
    />
  )
}`}
      >
        <BasicStreamingDemo />
      </ComponentPreview>

      <h2 id="with-tool-calls">With Tool Calls</h2>

      <p>
        Display tool calls made during streaming with approve/reject buttons:
      </p>

      <ComponentPreview
        title="Streaming with Tool Calls"
        description="Tool calls with approval workflow"
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'
import type { ToolCall } from '@clarity-chat/react/internal'

function StreamingWithTools() {
  const toolCalls: ToolCall[] = [
    {
      id: 'call-1',
      type: 'function',
      function: {
        name: 'get_weather',
        arguments: JSON.stringify({ location: 'San Francisco' }),
      },
    },
  ]

  const handleToolApprove = (tool: ToolCall) => {
    // Execute the tool
    console.log('Approved:', tool)
  }

  return (
    <StreamingMessage
      content="I'll check the weather for you."
      isStreaming={false}
      toolCalls={toolCalls}
      showTools
      onToolApprove={handleToolApprove}
      onToolReject={(tool) => console.log('Rejected:', tool)}
    />
  )
}`}
      >
        <StreamingWithToolsDemo />
      </ComponentPreview>

      <h2 id="with-citations">With Citations</h2>

      <p>Display citations and sources referenced in the response:</p>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'
import type { Citation } from '@clarity-chat/react/internal'

function StreamingWithCitations() {
  const citations: Citation[] = [
    {
      id: 'cite-1',
      source: 'Research Paper: AI Safety',
      chunkText: 'AI systems should be designed with safety in mind...',
      confidence: 0.95,
      url: 'https://example.com/paper',
    },
    {
      id: 'cite-2',
      source: 'Documentation: Best Practices',
      chunkText: 'Following best practices ensures reliable systems...',
      confidence: 0.87,
    },
  ]

  return (
    <StreamingMessage
      content="Based on recent research..."
      isStreaming={false}
      citations={citations}
      showCitations
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="with-thinking-steps">With Thinking Steps</h2>

      <p>Show chain-of-thought reasoning steps during AI processing:</p>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'

function StreamingWithThinking() {
  const thinkingSteps = [
    'Analyzing the problem...',
    'Breaking it down into steps...',
    'Considering possible solutions...',
    'Evaluating each option...',
  ]

  return (
    <StreamingMessage
      content="Let me think through this step by step."
      isStreaming={true}
      thinkingSteps={thinkingSteps}
      currentThinkingStep="Evaluating each option..."
      showThinking
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="error-handling">Error Handling</h2>

      <p>Display error messages when streaming fails:</p>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'

function StreamingWithError() {
  return (
    <StreamingMessage
      content=""
      isStreaming={false}
      error="Failed to connect to AI service. Please try again."
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="partial-json">Partial JSON Rendering</h2>

      <p>
        StreamingMessage automatically detects and renders partial JSON during
        streaming:
      </p>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'

function StreamingJSON() {
  const [content, setContent] = useState('{"name": "John", "age": 30')

  // As JSON streams in, it's parsed and displayed formatted
  // Incomplete JSON shows as text until complete

  return (
    <StreamingMessage
      content={content}
      isStreaming={true}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="tip">
        <p>
          StreamingMessage uses smart JSON parsing to extract complete JSON
          objects from partial streams, displaying them formatted while showing
          remaining text separately.
        </p>
      </Callout>

      <h2 id="complete-example">Complete Example</h2>

      <EnhancedCodeBlock
        code={`import { useState, useEffect, useCallback } from 'react'
import { StreamingMessage } from '@clarity-chat/react/internal'
import type { ToolCall, Citation } from '@clarity-chat/react/internal'

function CompleteStreamingExample() {
  const [content, setContent] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)
  const [toolCalls, setToolCalls] = useState<ToolCall[]>([])
  const [citations, setCitations] = useState<Citation[]>([])
  const [thinkingSteps, setThinkingSteps] = useState<string[]>([])

  useEffect(() => {
    // Simulate streaming with all features
    const simulateStream = async () => {
      // Add thinking steps
      setThinkingSteps(['Analyzing request...', 'Gathering information...'])
      
      // Add citations
      setCitations([
        {
          id: 'cite-1',
          source: 'Documentation',
          chunkText: 'Relevant information...',
          confidence: 0.9,
        },
      ])

      // Stream content
      const text = 'Here is the answer to your question...'
      for (let i = 0; i < text.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setContent(text.slice(0, i + 1))
      }

      // Add tool call
      setToolCalls([
        {
          id: 'call-1',
          type: 'function',
          function: {
            name: 'search_database',
            arguments: JSON.stringify({ query: 'example' }),
          },
        },
      ])

      setIsStreaming(false)
    }

    simulateStream()
  }, [])

  const handleToolApprove = useCallback((tool: ToolCall) => {
    // Execute tool
    console.log('Executing tool:', tool)
  }, [])

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      toolCalls={toolCalls}
      citations={citations}
      thinkingSteps={thinkingSteps}
      showThinking
      showCitations
      showTools
      onToolApprove={handleToolApprove}
      onToolReject={(tool) => console.log('Rejected:', tool)}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="props">Props</h2>

      <PropsTable props={streamingMessageProps} />

      <h2 id="types">TypeScript Types</h2>

      <h3>ToolCall</h3>

      <EnhancedCodeBlock
        code={`interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string // JSON string
  }
}`}
        language="tsx"
        showLineNumbers
      />

      <h3>Citation</h3>

      <EnhancedCodeBlock
        code={`interface Citation {
  id: string
  source: string
  chunkText: string
  confidence?: number // 0-1
  metadata?: Record<string, unknown>
  url?: string
}`}
        language="tsx"
        showLineNumbers
      />

      <h2 id="integration-with-hooks">Integration with Hooks</h2>

      <p>StreamingMessage works seamlessly with streaming hooks:</p>

      <EnhancedCodeBlock
        code={`import { StreamingMessage } from '@clarity-chat/react/internal'
import { useStreamingSSE } from '@clarity-chat/react/internal'

function StreamingWithHook() {
  const { content, isStreaming, toolCalls, citations, error } = useStreamingSSE({
    api: '/api/stream',
  })

  return (
    <StreamingMessage
      content={content}
      isStreaming={isStreaming}
      toolCalls={toolCalls}
      citations={citations}
      error={error}
    />
  )
}`}
        language="tsx"
        showLineNumbers
      />

      <Callout type="info">
        <p>
          See the{' '}
          <a href="/reference/hooks/use-streaming-sse">useStreamingSSE</a> and{' '}
          <a href="/reference/hooks/use-streaming-websocket">
            useStreamingWebSocket
          </a>{' '}
          hooks for complete streaming integration examples.
        </p>
      </Callout>

      <h2 id="accessibility">Accessibility</h2>

      <p>StreamingMessage is built with accessibility in mind:</p>

      <ul>
        <li>✅ ARIA live regions for streaming content</li>
        <li>✅ Screen reader announcements for tool calls</li>
        <li>✅ Keyboard navigation for tool approval/rejection</li>
        <li>✅ Focus management</li>
        <li>✅ Error announcements</li>
      </ul>

      <h2 id="performance">Performance</h2>

      <p>StreamingMessage is optimized for performance:</p>

      <ul>
        <li>
          <strong>Efficient rendering:</strong> Only re-renders when content
          changes
        </li>
        <li>
          <strong>Memoized parsing:</strong> JSON parsing is memoized to avoid
          re-parsing
        </li>
        <li>
          <strong>Smooth animations:</strong> Streaming cursor and transitions
          are optimized
        </li>
      </ul>

      <h2 id="related">Related</h2>

      <ul>
        <li>
          <a href="/reference/components/message">Message</a> - For
          non-streaming messages
        </li>
        <li>
          <a href="/reference/hooks/use-streaming-sse">useStreamingSSE</a> - SSE
          streaming hook
        </li>
        <li>
          <a href="/reference/hooks/use-streaming-websocket">
            useStreamingWebSocket
          </a>{' '}
          - WebSocket streaming hook
        </li>
        <li>
          <a href="/reference/components/chat-window">ChatWindow</a> - Complete
          chat interface
        </li>
      </ul>

      <Pagination
        previous={{
          title: 'VirtualizedMessageList',
          href: '/reference/components/virtualized-message-list',
        }}
        next={{
          title: 'Hooks Overview',
          href: '/reference/hooks',
        }}
      />
    </>
  )
}
