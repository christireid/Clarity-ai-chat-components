import { logger } from '@clarity-chat/utils/logger';
'use client'

import { useState, useCallback } from 'react'
import { ToastProvider, useStreamableUI } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Helper to create a simple async iterable for demo
function createAsyncIterable<T>(
  items: T[],
  delay: number = 100
): AsyncIterable<T> {
  return {
    async *[Symbol.asyncIterator]() {
      for (const item of items) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        yield item
      }
    },
  }
}

// Basic demo component
function BasicStreamableUIDemo() {
  const [source, setSource] = useState<AsyncIterable<string> | null>(null)

  const { values, latest, status, isStreaming, error, reset } = useStreamableUI(
    source,
    {
      mode: 'append',
      onUpdate: (value) => {
        logger.debug('Updated:', value)
      },
      onComplete: (finalValue) => {
        logger.debug('Complete:', finalValue)
      },
    }
  )

  const handleStart = useCallback(() => {
    const stream = createAsyncIterable(
      ['Hello', ' ', 'World', '!', ' This', ' is', ' streaming', '.'],
      200
    )
    setSource(stream)
  }, [])

  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleStart}
            disabled={status === 'streaming'}
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            aria-label="Start streaming"
          >
            Start Stream
          </button>
          <button
            onClick={() => {
              reset()
              setSource(null)
            }}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
            aria-label="Reset stream"
          >
            Reset
          </button>
          <span className="text-sm text-muted-foreground">
            Status: {status}
          </span>
        </div>

        {isStreaming && (
          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="text-sm">Streaming...</p>
          </div>
        )}

        {latest && (
          <div className="p-3 bg-muted rounded">
            <p className="text-sm font-semibold mb-1">Latest Value:</p>
            <p>{latest}</p>
          </div>
        )}

        {values.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              All Values ({values.length}):
            </p>
            <div className="p-2 bg-muted rounded max-h-32 overflow-y-auto">
              {values.map((val, i) => (
                <span key={i} className="text-sm">
                  {val}
                </span>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded">
            <p className="text-sm">Error: {error.message}</p>
          </div>
        )}

        {status === 'complete' && (
          <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
            <p className="text-sm">Stream completed!</p>
          </div>
        )}
      </div>
    </div>
  )
}

const useStreamableUIOptionsProps: Prop[] = [
  {
    name: 'mode',
    type: '"append" | "replace"',
    default: '"append"',
    description:
      'How to handle new values: append to array or replace the array with single value.',
  },
  {
    name: 'transform',
    type: '(value: unknown) => T | null | undefined',
    description:
      'Transform incoming payloads (e.g., decode Uint8Array, parse JSON). Return null/undefined to skip value.',
  },
  {
    name: 'completeWhen',
    type: '(value: unknown) => boolean',
    description:
      'Function to determine when streaming should be marked complete. Called with each value.',
  },
  {
    name: 'onUpdate',
    type: '(value: T) => void',
    description: 'Callback invoked on each transformed update.',
  },
  {
    name: 'onComplete',
    type: '(finalValue: T | null) => void',
    description:
      'Callback invoked when stream completes. Receives final value or latest value if no final value.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback invoked on error.',
  },
]

const useStreamableUIStateProps: Prop[] = [
  {
    name: 'values',
    type: 'T[]',
    description:
      'Array of all received values (accumulated if mode is "append", single value if mode is "replace").',
  },
  {
    name: 'latest',
    type: 'T | null',
    description: 'Latest received value.',
  },
  {
    name: 'status',
    type: '"idle" | "streaming" | "complete" | "error"',
    description: 'Current streaming status.',
  },
  {
    name: 'isStreaming',
    type: 'boolean',
    description: 'Shorthand for status === "streaming".',
  },
  {
    name: 'error',
    type: 'Error | null',
    description: 'Current error if streaming failed.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset state and clear all values.',
  },
]

export default function UseStreamableUIPage() {
  return (
    <ToastProvider>
      <>
        <Breadcrumbs />

        <h1>useStreamableUI</h1>

        <p className="lead">
          A flexible hook for managing UI state from various streaming sources
          including StreamableValue, AsyncIterable, Promise, and ReadableStream.
          Perfect for handling incremental updates from AI responses.
        </p>

        <Callout type="info">
          <p>
            This hook is designed to work with Vercel AI SDK's{' '}
            <code>StreamableValue</code> and other streaming sources. It
            automatically handles subscription, transformation, and completion
            detection.
          </p>
        </Callout>

        <ViewInStorybook component="useStreamableUI" />

        <section className="my-12">
          <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            Try streaming values! See how values accumulate and status changes.
          </p>
          <CodePlayground
            initialCode={`function Example() {
  const [source, setSource] = useState(null)
  
  const { values, latest, status, isStreaming } = useStreamableUI(source, {
    mode: 'append',
    onComplete: (final) => {
      logger.debug('Complete:', final)
    },
  })

  const startStream = () => {
    // Create async iterable
    const stream = {
      async *[Symbol.asyncIterator]() {
        for (const word of ['Hello', ' ', 'World', '!']) {
          await new Promise(r => setTimeout(r, 200))
          yield word
        }
      },
    }
    setSource(stream)
  }

  return (
    <div>
      <button onClick={startStream} disabled={isStreaming}>
        Start Stream
      </button>
      <p>Status: {status}</p>
      <p>Latest: {latest}</p>
      <p>Values: {values.join('')}</p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'
import type { UseStreamableUIOptions, UseStreamableUIState } from '@clarity-chat/react'`}
          language="tsx"
        />

        <h2 id="basic-usage">Basic Usage</h2>

        <p>Stream values from an AsyncIterable:</p>

        <ComponentPreview
          title="Simple Streaming"
          description="Basic streaming from AsyncIterable"
          code={`import { useStreamableUI } from '@clarity-chat/react'

function SimpleStreaming() {
  const stream = {
    async *[Symbol.asyncIterator]() {
      for (const word of ['Hello', ' ', 'World', '!']) {
        await new Promise(r => setTimeout(r, 200))
        yield word
      }
    },
  }

  const {
    values,
    latest,
    status,
    isStreaming,
  } = useStreamableUI(stream, {
    mode: 'append',
  })

  return (
    <div>
      <p>Status: {status}</p>
      <p>Latest: {latest}</p>
      <p>All: {values.join('')}</p>
    </div>
  )
}`}
        >
          <BasicStreamableUIDemo />
        </ComponentPreview>

        <h2 id="with-streamable-value">With StreamableValue</h2>

        <p>Use with Vercel AI SDK's StreamableValue:</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'
import { createStreamableValue } from 'ai/rsc'

function StreamableValueExample() {
  // In a Server Action or Route Handler
  const streamable = createStreamableValue('')

  // In your component
  const {
    values,
    latest,
    status,
  } = useStreamableUI(streamable, {
    mode: 'append',
  })

  return (
    <div>
      {isStreaming && <p>Streaming...</p>}
      <p>{latest || ''}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-promise">With Promise</h2>

        <p>Handle a Promise that resolves to a value:</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'
import { useState } from 'react'

function PromiseExample() {
  const [promise, setPromise] = useState<Promise<string> | null>(null)

  const {
    latest,
    status,
    error,
  } = useStreamableUI(promise, {
    mode: 'replace',
  })

  const fetchData = () => {
    const p = fetch('/api/data')
      .then(res => res.json())
      .then(data => data.message)
    setPromise(p)
  }

  return (
    <div>
      <button onClick={fetchData}>Fetch</button>
      {status === 'streaming' && <p>Loading...</p>}
      {status === 'complete' && <p>{latest}</p>}
      {error && <p>Error: {error.message}</p>}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="with-readable-stream">With ReadableStream</h2>

        <p>Stream from a ReadableStream (e.g., from fetch):</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'
import { useState } from 'react'

function ReadableStreamExample() {
  const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null)

  const {
    values,
    latest,
    status,
  } = useStreamableUI(stream, {
    mode: 'append',
    transform: (chunk) => {
      // Decode Uint8Array to string
      if (chunk instanceof Uint8Array) {
        return new TextDecoder().decode(chunk)
      }
      return chunk
    },
  })

  const startStream = async () => {
    const response = await fetch('/api/stream')
    if (response.body) {
      setStream(response.body)
    }
  }

  return (
    <div>
      <button onClick={startStream}>Start Stream</button>
      <p>Status: {status}</p>
      <p>{values.join('')}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="append-vs-replace">Append vs Replace Mode</h2>

        <p>Control how values are accumulated:</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'

function AppendMode() {
  const stream = createAsyncIterable(['a', 'b', 'c'])

  // Append mode: values = ['a', 'b', 'c']
  const { values } = useStreamableUI(stream, {
    mode: 'append',
  })

  return <p>{values.join(', ')}</p> // "a, b, c"
}

function ReplaceMode() {
  const stream = createAsyncIterable(['a', 'b', 'c'])

  // Replace mode: values = ['c'] (only latest)
  const { values } = useStreamableUI(stream, {
    mode: 'replace',
  })

  return <p>{values.join(', ')}</p> // "c"
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="transformation">Transformation</h2>

        <p>Transform incoming values (e.g., decode binary, parse JSON):</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'

function TransformExample() {
  const stream = createAsyncIterable([
    '{"name":"Alice"}',
    '{"name":"Bob"}',
    '{"name":"Charlie"}',
  ])

  const {
    values,
    latest,
  } = useStreamableUI(stream, {
    mode: 'append',
    transform: (value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch {
          return null // Skip invalid JSON
        }
      }
      return value
    },
  })

  return (
    <div>
      {values.map((person, i) => (
        <p key={i}>{person.name}</p>
      ))}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="completion-detection">Completion Detection</h2>

        <p>Detect when streaming is complete:</p>

        <EnhancedCodeBlock
          code={`import { useStreamableUI } from '@clarity-chat/react'

function CompletionExample() {
  const stream = createAsyncIterable(['Hello', ' ', 'World', null])

  const {
    values,
    status,
  } = useStreamableUI(stream, {
    mode: 'append',
    completeWhen: (value) => value === null, // Complete when null is received
    onComplete: (finalValue) => {
      logger.debug('Stream complete!', finalValue)
    },
  })

  return (
    <div>
      <p>Status: {status}</p>
      <p>{values.join('')}</p>
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="options">Options</h2>

        <PropsTable props={useStreamableUIOptionsProps} />

        <h2 id="return-values">Return Values</h2>

        <PropsTable props={useStreamableUIStateProps} />

        <h2 id="supported-sources">Supported Sources</h2>

        <p>useStreamableUI supports the following source types:</p>

        <ul>
          <li>
            <strong>StreamableValue:</strong> Vercel AI SDK's streamable value
            with subscribe/onDone
          </li>
          <li>
            <strong>AsyncIterable:</strong> Any async iterable (generators,
            async generators)
          </li>
          <li>
            <strong>Promise:</strong> Promise that resolves to a value
          </li>
          <li>
            <strong>ReadableStream:</strong> Browser ReadableStream API
          </li>
        </ul>

        <h2 id="streamable-value-interface">StreamableValue Interface</h2>

        <p>For StreamableValue-like objects, the hook expects:</p>

        <EnhancedCodeBlock
          code={`interface StreamableValueLike<T> {
  value?: T | null
  /** Subscribe to incremental updates */
  subscribe: (listener: (value: T) => void) => void | (() => void)
  /** Optional completion listener */
  onDone?: (listener: () => void) => void | (() => void)
  /** Hint that streaming completed */
  done?: boolean
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="complete-example">Complete Example</h2>

        <EnhancedCodeBlock
          code={`import { useState, useCallback } from 'react'
import { useStreamableUI } from '@clarity-chat/react'

function CompleteStreamableUIExample() {
  const [source, setSource] = useState<AsyncIterable<string> | null>(null)

  const {
    values,
    latest,
    status,
    isStreaming,
    error,
    reset,
  } = useStreamableUI(source, {
    mode: 'append',
    transform: (value) => {
      // Transform or validate values
      if (typeof value === 'string') {
        return value.trim()
      }
      return null // Skip non-string values
    },
    completeWhen: (value) => {
      // Complete when we receive a special marker
      return value === '[DONE]'
    },
    onUpdate: (value) => {
      logger.debug('New value:', value)
    },
    onComplete: (finalValue) => {
      logger.debug('Stream complete! Final:', finalValue)
    },
    onError: (err) => {
      logger.error('Stream error:', err)
    },
  })

  const startStream = useCallback(() => {
    const stream = {
      async *[Symbol.asyncIterator]() {
        const words = ['Hello', ' ', 'World', '!', ' ', '[DONE]']
        for (const word of words) {
          await new Promise(resolve => setTimeout(resolve, 200))
          yield word
        }
      },
    }
    setSource(stream)
  }, [])

  const handleReset = useCallback(() => {
    reset()
    setSource(null)
  }, [reset])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={startStream}
          disabled={isStreaming}
          className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
        >
          Start Stream
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded"
        >
          Reset
        </button>
      </div>

      <div>
        <p>Status: {status}</p>
        {isStreaming && <p className="text-blue-600">Streaming...</p>}
        {status === 'complete' && <p className="text-green-600">Complete!</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
      </div>

      {latest && (
        <div className="p-3 bg-muted rounded">
          <p className="font-semibold mb-1">Latest:</p>
          <p>{latest}</p>
        </div>
      )}

      {values.length > 0 && (
        <div className="p-3 bg-muted rounded">
          <p className="font-semibold mb-1">All Values ({values.length}):</p>
          <p>{values.join('')}</p>
        </div>
      )}
    </div>
  )
}`}
          language="tsx"
          showLineNumbers
        />

        <h2 id="status-values">Status Values</h2>

        <p>Streaming status can be one of:</p>

        <ul>
          <li>
            <strong>idle:</strong> No source provided or stream not started
          </li>
          <li>
            <strong>streaming:</strong> Actively receiving values
          </li>
          <li>
            <strong>complete:</strong> Stream completed successfully
          </li>
          <li>
            <strong>error:</strong> Stream error occurred
          </li>
        </ul>

        <h2 id="best-practices">Best Practices</h2>

        <ul>
          <li>
            <strong>Use append mode for tokens:</strong> When streaming text
            tokens, use <code>mode: 'append'</code>
          </li>
          <li>
            <strong>Use replace mode for updates:</strong> When streaming
            complete objects that replace each other
          </li>
          <li>
            <strong>Transform binary data:</strong> Use <code>transform</code>{' '}
            to decode Uint8Array chunks
          </li>
          <li>
            <strong>Handle completion:</strong> Use <code>completeWhen</code> or
            rely on stream completion
          </li>
          <li>
            <strong>Clean up:</strong> The hook automatically cleans up
            subscriptions when source changes
          </li>
          <li>
            <strong>Error handling:</strong> Always provide <code>onError</code>{' '}
            callback
          </li>
        </ul>

        <h2 id="related">Related</h2>

        <ul>
          <li>
            <a href="/reference/hooks/use-streaming-sse">useStreamingSSE</a> -
            SSE streaming hook
          </li>
          <li>
            <a href="/reference/hooks/use-streaming-websocket">
              useStreamingWebSocket
            </a>{' '}
            - WebSocket streaming hook
          </li>
          <li>
            <a href="/reference/hooks/use-clarity-chat">useClarityChat</a> -
            Chat hook with streaming support
          </li>
          <li>
            <a href="/reference/components/streaming-message">
              StreamingMessage
            </a>{' '}
            - Display streaming content
          </li>
          <li>
            <a href="/guides/streaming">Streaming Guide</a> - Streaming patterns
            and best practices
          </li>
        </ul>

        <Pagination
          previous={{
            title: 'useStreamingWebSocket',
            href: '/reference/hooks/use-streaming-websocket',
          }}
          next={{
            title: 'useClarityChat',
            href: '/reference/hooks/use-clarity-chat',
          }}
        />
      </>
    </ToastProvider>
  )
}
