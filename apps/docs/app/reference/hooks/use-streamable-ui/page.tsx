'use client'

import type { Metadata } from 'next'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'useStreamableUI Hook | Clarity Chat',
  description: 'Hook for consuming streamable values from React Server Components, supporting append/replace modes and custom transforms.',
}

const useStreamableUIOptions: Prop[] = [
  {
    name: 'source',
    type: 'StreamableSource<T> | null | undefined',
    required: true,
    description: 'Streamable source (StreamableValue, AsyncIterable, Promise, or ReadableStream).',
  },
  {
    name: 'mode',
    type: '"append" | "replace"',
    default: '"append"',
    description: 'Append new values to array or replace the current value.',
  },
  {
    name: 'transform',
    type: '(value: unknown) => T | null | undefined',
    description: 'Transform incoming payloads (e.g., decode Uint8Array to string).',
  },
  {
    name: 'completeWhen',
    type: '(value: unknown) => boolean',
    description: 'Function to determine when streaming should be marked complete.',
  },
  {
    name: 'onUpdate',
    type: '(value: T) => void',
    description: 'Callback invoked on each transformed update.',
  },
  {
    name: 'onComplete',
    type: '(finalValue: T | null) => void',
    description: 'Callback invoked when stream completes.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback invoked on error.',
  },
]

const useStreamableUIReturn: Prop[] = [
  {
    name: 'values',
    type: 'T[]',
    description: 'Array of all values received (in append mode) or single value (in replace mode).',
  },
  {
    name: 'latest',
    type: 'T | null',
    description: 'The most recent value received.',
  },
  {
    name: 'status',
    type: '"idle" | "streaming" | "complete" | "error"',
    description: 'Current streaming status.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    description: 'Whether streaming is currently in progress.',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Error state, if any.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset the stream state to initial values.',
  },
]

export default function UseStreamableUIPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useStreamableUI</h1>

      <p className="lead">
        Hook for consuming streamable values from React Server Components, supporting
        append/replace modes, custom transforms, and multiple source types.
      </p>

      <Callout type="info" title="React Server Components">
        <p>
          This hook is designed to work with React Server Components and Vercel's
          <code>StreamableValue</code> API. It supports multiple source types including
          AsyncIterable, Promise, and ReadableStream.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { values, latest, isStreaming, status } = useStreamableUI(streamableValue)

  return (
    <div>
      {isStreaming && <div>Streaming...</div>}
      {values.map((value, i) => (
        <div key={i}>{value}</div>
      ))}
      {status === 'complete' && <div>Complete!</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useStreamableUI:
        </p>
        <CodePlayground
          initialCode={`import { useStreamableUI } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function Example() {
  // Simulate a streamable source
  const [source, setSource] = useState(null)
  
  useEffect(() => {
    const asyncIterable = {
      async *[Symbol.asyncIterator]() {
        const words = ['Hello', ' ', 'world', '!']
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 300))
          yield word
        }
      }
    }
    setSource(asyncIterable)
  }, [])

  const { values, latest, isStreaming, status } = useStreamableUI(source, {
    mode: 'append',
  })

  return (
    <div>
      <p>Status: {status}</p>
      <p>Streaming: {isStreaming ? 'Yes' : 'No'}</p>
      <p>Latest: {latest || 'None'}</p>
      <p>All values: {values.join('')}</p>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Append Mode (Default)</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { values, isStreaming } = useStreamableUI(streamableValue, {
    mode: 'append', // Each update appends to the array
  })

  return (
    <div>
      {values.map((chunk, i) => (
        <span key={i}>{chunk}</span>
      ))}
      {isStreaming && <span className="cursor">▋</span>}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Replace Mode</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { latest, isStreaming } = useStreamableUI(streamableValue, {
    mode: 'replace', // Each update replaces the current value
  })

  return (
    <div>
      {latest && <div>{latest}</div>}
      {isStreaming && <div>Updating...</div>}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Transform</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { values } = useStreamableUI(streamableValue, {
    transform: (value) => {
      // Decode Uint8Array to string
      if (value instanceof Uint8Array) {
        return new TextDecoder().decode(value)
      }
      return value
    },
  })

  return <div>{values.join('')}</div>
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Completion Detection</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { values, status } = useStreamableUI(streamableValue, {
    completeWhen: (value) => {
      // Mark complete when we receive a special marker
      return value === '[DONE]'
    },
    onComplete: (finalValue) => {
      console.log('Stream completed:', finalValue)
    },
  })

  return (
    <div>
      {values.map((v, i) => (
        <span key={i}>{v}</span>
      ))}
      {status === 'complete' && <div>✓ Complete</div>}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With ReadableStream</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat() {
  const [stream, setStream] = useState(null)

  useEffect(() => {
    // Create a ReadableStream from fetch
    fetch('/api/stream')
      .then(response => {
        if (!response.body) return
        setStream(response.body)
      })
  }, [])

  const { values, isStreaming } = useStreamableUI(stream, {
    transform: async (chunk) => {
      // Handle ReadableStream chunks
      if (chunk instanceof Uint8Array) {
        return new TextDecoder().decode(chunk)
      }
      return chunk
    },
  })

  return (
    <div>
      {values.join('')}
      {isStreaming && <span>...</span>}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function Chat({ streamableValue }) {
  const { values, error, status, reset } = useStreamableUI(streamableValue, {
    onError: (error) => {
      console.error('Stream error:', error)
      // Send to error tracking
    },
  })

  if (status === 'error') {
    return (
      <div>
        <p>Error: {error?.message}</p>
        <button onClick={reset}>Retry</button>
      </div>
    )
  }

  return <div>{values.join('')}</div>
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useStreamableUIOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useStreamableUIReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Supported Source Types</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <code>useStreamableUI</code> supports multiple source types:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>StreamableValue</strong> - Vercel's StreamableValue API</li>
          <li><strong>AsyncIterable</strong> - Any async iterable (generators, async functions)</li>
          <li><strong>Promise</strong> - Single value promises</li>
          <li><strong>ReadableStream</strong> - Web Streams API ReadableStream</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Mode: Append vs Replace</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Append Mode (Default)</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Each update appends to the <code>values</code> array. Use this for
              streaming text or accumulating chunks.
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`const { values } = useStreamableUI(source, { mode: 'append' })
// values = ['Hello', ' ', 'world'] // Grows with each update`}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Replace Mode</h3>
            <p className="mb-2 text-gray-600 dark:text-gray-400">
              Each update replaces the current value. Use this for updating a single
              value (like progress percentages).
            </p>
            <EnhancedCodeBlock
              language="tsx"
              code={`const { latest } = useStreamableUI(source, { mode: 'replace' })
// latest = 'world' // Replaces previous value`}
            />
          </div>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Integration with React Server Components</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          Use with React Server Components and Vercel's StreamableValue:
        </p>
        <EnhancedCodeBlock
          language="tsx"
          code={`// Server Component
import { createStreamableValue } from 'ai/rsc'

export async function ChatServer() {
  const streamable = createStreamableValue('')

  // Stream updates
  streamable.update('Hello')
  streamable.update(' world')
  streamable.done()

  return <ChatClient streamable={streamable.value} />
}

// Client Component
'use client'
import { useStreamableUI } from '@clarity-chat/react'

export function ChatClient({ streamable }) {
  const { values, isStreaming } = useStreamableUI(streamable)

  return <div>{values.join('')}</div>
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Performance Considerations</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li>Values are automatically memoized to prevent unnecessary re-renders</li>
          <li>Stream cleanup is handled automatically on unmount</li>
          <li>Transform functions are memoized to avoid recreation</li>
          <li>Use <code>completeWhen</code> to avoid unnecessary processing</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-streaming-sse" className="docs-card">
            <h3>useStreamingSSE Hook</h3>
            <p>SSE streaming hook</p>
          </a>
          <a href="/reference/hooks/use-streaming-websocket" className="docs-card">
            <h3>useStreamingWebSocket Hook</h3>
            <p>WebSocket streaming hook</p>
          </a>
          <a href="/reference/components/streaming-message" className="docs-card">
            <h3>StreamingMessage Component</h3>
            <p>Component for displaying streaming content</p>
          </a>
          <a href="/guides/streaming" className="docs-card">
            <h3>Streaming Guide</h3>
            <p>Complete streaming guide</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useStreamingSSE', href: '/reference/hooks/use-streaming-sse' }}
        next={{ title: 'useStreamingWebSocket', href: '/reference/hooks/use-streaming-websocket' }}
      />
    </>
  )
}
