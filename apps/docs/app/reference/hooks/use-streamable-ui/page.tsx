// TODO: useStreamableUI is planned but not yet implemented in @clarity-chat/react.
// This page documents the intended API and features.

'use client'

import { useState, useCallback } from 'react'
import { ToastProvider } from '@clarity-chat/react'
// TODO: Uncomment when implemented:
// import { useStreamableUI } from '@clarity-chat/react'
import { Breadcrumbs } from '@/components/Navigation/Breadcrumbs'
import { CodePlayground } from '@/components/Playground/CodePlayground'
import { Pagination } from '@/components/Navigation/Pagination'
import { EnhancedCodeBlock } from '@/components/Enhanced/EnhancedCodeBlock'
import { Callout } from '@/components/MDX/Callout'
import { PropsTable, type Prop } from '@/components/Enhanced/PropsTable'
import { ComponentPreview } from '@/components/Demo/ComponentPreview'
import { ViewInStorybook } from '@/components/Links/StorybookLink'

// Placeholder demo component - shows Coming Soon notice
function BasicStreamableUIDemo() {
  return (
    <div className="w-full max-w-2xl border border-border rounded-lg p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <button
            disabled
            className="px-4 py-2 bg-primary text-primary-foreground rounded disabled:opacity-50"
            aria-label="Start streaming"
          >
            Start Stream (Coming Soon)
          </button>
          <button
            disabled
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded disabled:opacity-50"
            aria-label="Reset stream"
          >
            Reset
          </button>
          <span className="text-sm text-muted-foreground">
            Status: idle
          </span>
        </div>

        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-amber-700 dark:text-amber-400 text-sm">
            useStreamableUI is planned but not yet implemented.
          </p>
        </div>
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

        <Callout type="warning" className="mb-6">
          <p>
            <strong>Coming Soon:</strong> useStreamableUI is planned but not yet implemented
            in @clarity-chat/react. This page documents the intended API and features.
          </p>
        </Callout>

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
            initialCode={`// useStreamableUI is coming soon!
// This playground will be functional once the hook is implemented.

function Example() {
  const [source, setSource] = useState(null)

  // Once implemented:
  // const { values, latest, status, isStreaming } = useStreamableUI(source, {
  //   mode: 'append',
  //   onComplete: (final) => {
  //     console.log('Complete:', final)
  //   },
  // })

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
      <p className="text-center text-muted-foreground py-8">
        useStreamableUI coming soon...
      </p>
    </div>
  )
}

render(<Example />)`}
          />
        </section>

        <h2 id="import">Import</h2>

        <EnhancedCodeBlock
          code={`// Coming soon:
import { useStreamableUI } from '@clarity-chat/react'
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
