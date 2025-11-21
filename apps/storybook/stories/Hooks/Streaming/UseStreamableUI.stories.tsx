import type { Meta, StoryObj } from '@storybook/react'
import { useStreamableUI } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useStreamableUI Hook**
 * 
 * Hook for handling streamable UI values from various sources
 * including StreamableValue, AsyncIterable, Promise, and ReadableStream.
 * 
 * **Key Features:**
 * - Support for multiple source types (StreamableValue, AsyncIterable, Promise, ReadableStream)
 * - Append or replace mode for value accumulation
 * - Custom transformation functions
 * - Completion detection
 * - Error handling
 * - Status tracking (idle, streaming, complete, error)
 * 
 * **Use Cases:**
 * - Vercel AI SDK StreamableValue integration
 * - Progressive UI updates
 * - Real-time data streaming
 * - Async data handling
 */
const meta = {
  title: 'Hooks/Streaming/UseStreamableUI',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useStreamableUI\` hook provides a unified way to handle streamable
UI values from various sources including StreamableValue, AsyncIterable,
Promise, and ReadableStream.

## Features

- ✅ Support for multiple source types
- ✅ Append or replace mode for value accumulation
- ✅ Custom transformation functions
- ✅ Completion detection
- ✅ Error handling
- ✅ Status tracking (idle, streaming, complete, error)
- ✅ Reset functionality

## Basic Usage

\`\`\`tsx
const { values, latest, status, isStreaming, reset } = useStreamableUI(
  streamableSource,
  {
    mode: 'append',
    onUpdate: (value) => console.log('Updated:', value),
    onComplete: (finalValue) => console.log('Complete:', finalValue),
  }
)
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function AsyncIterableDemo() {
  const [source, setSource] = useState<AsyncIterable<string> | null>(null)
  
  const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
    mode: 'append',
    onUpdate: (value) => {
      console.log('Value updated:', value)
    },
    onComplete: (finalValue) => {
      console.log('Streaming complete:', finalValue)
    },
  })

  const startStreaming = () => {
    const words = ['Hello', 'World', 'from', 'AsyncIterable', 'Stream']
    let index = 0

    const asyncIterable: AsyncIterable<string> = {
      [Symbol.asyncIterator]: async function* () {
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          yield word
        }
      },
    }

    setSource(asyncIterable)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-medium">AsyncIterable Source</h3>
        <div className="flex gap-2">
          <Button onClick={startStreaming} disabled={isStreaming}>
            Start Streaming
          </Button>
          <Button onClick={() => { reset(); setSource(null) }} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'idle' ? 'bg-gray-200 dark:bg-gray-800' :
              status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {status}
            </span>
          </div>
          <div>
            <strong>Is Streaming:</strong> {isStreaming ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Values Count:</strong> {values.length}
          </div>
          <div>
            <strong>Latest Value:</strong> {latest || 'None'}
          </div>
        </div>
      </div>

      {values.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">All Values:</h4>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
            <div className="space-y-1">
              {values.map((value, index) => (
                <div key={index} className="text-sm">
                  {index + 1}. {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export const AsyncIterableSource: Story = {
  render: () => <AsyncIterableDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using useStreamableUI with an AsyncIterable source for progressive value updates.',
      },
    },
  },
}

function ReadableStreamDemo() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)
  
  const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
    mode: 'append',
    transform: (value) => {
      // Transform Uint8Array to string if needed
      if (value instanceof Uint8Array) {
        return new TextDecoder().decode(value)
      }
      return String(value)
    },
  })

  const startStreaming = () => {
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = ['Chunk', '1', 'Chunk', '2', 'Chunk', '3']
        for (const chunk of chunks) {
          await new Promise((resolve) => setTimeout(resolve, 400))
          controller.enqueue(chunk)
        }
        controller.close()
      },
    })

    setSource(stream)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-medium">ReadableStream Source</h3>
        <div className="flex gap-2">
          <Button onClick={startStreaming} disabled={isStreaming}>
            Start Streaming
          </Button>
          <Button onClick={() => { reset(); setSource(null) }} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'idle' ? 'bg-gray-200 dark:bg-gray-800' :
              status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
            }`}>
              {status}
            </span>
          </div>
          <div>
            <strong>Latest Value:</strong> {latest || 'None'}
          </div>
          <div>
            <strong>All Values:</strong> {values.join(' ')}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ReadableStreamSource: Story = {
  render: () => <ReadableStreamDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using useStreamableUI with a ReadableStream source with automatic text decoding.',
      },
    },
  },
}

function ReplaceModeDemo() {
  const [source, setSource] = useState<AsyncIterable<number> | null>(null)
  
  const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
    mode: 'replace', // Replace instead of append
    onUpdate: (value) => {
      console.log('Value replaced:', value)
    },
  })

  const startStreaming = () => {
    const numbers = [1, 2, 3, 4, 5]
    let index = 0

    const asyncIterable: AsyncIterable<number> = {
      [Symbol.asyncIterator]: async function* () {
        for (const num of numbers) {
          await new Promise((resolve) => setTimeout(resolve, 600))
          yield num
        }
      },
    }

    setSource(asyncIterable)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-medium">Replace Mode</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          In replace mode, each new value replaces the previous one instead of accumulating.
        </p>
        <div className="flex gap-2">
          <Button onClick={startStreaming} disabled={isStreaming}>
            Start Streaming
          </Button>
          <Button onClick={() => { reset(); setSource(null) }} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              'bg-gray-200 dark:bg-gray-800'
            }`}>
              {status}
            </span>
          </div>
          <div>
            <strong>Latest Value:</strong> {latest !== null ? latest : 'None'}
          </div>
          <div>
            <strong>Values Array:</strong> {values.length > 0 ? `[${values.join(', ')}]` : '[]'}
            <span className="text-gray-500 ml-2">
              (In replace mode, this will only contain the latest value)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ReplaceMode: Story = {
  render: () => <ReplaceModeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using replace mode where each new value replaces the previous one instead of accumulating.',
      },
    },
  },
}

function TransformDemo() {
  const [source, setSource] = useState<AsyncIterable<number> | null>(null)
  
  const { values, latest, status, isStreaming, reset } = useStreamableUI(source, {
    mode: 'append',
    transform: (value) => {
      // Transform numbers to formatted strings
      if (typeof value === 'number') {
        return `Value: ${value} (${value * 2} doubled)`
      }
      return String(value)
    },
    onUpdate: (value) => {
      console.log('Transformed value:', value)
    },
  })

  const startStreaming = () => {
    const numbers = [10, 20, 30, 40, 50]

    const asyncIterable: AsyncIterable<number> = {
      [Symbol.asyncIterator]: async function* () {
        for (const num of numbers) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          yield num
        }
      },
    }

    setSource(asyncIterable)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-medium">Custom Transform</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Transform incoming values using a custom function.
        </p>
        <div className="flex gap-2">
          <Button onClick={startStreaming} disabled={isStreaming}>
            Start Streaming
          </Button>
          <Button onClick={() => { reset(); setSource(null) }} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              status === 'complete' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200' :
              'bg-gray-200 dark:bg-gray-800'
            }`}>
              {status}
            </span>
          </div>
          <div>
            <strong>Latest Transformed Value:</strong> {latest || 'None'}
          </div>
          <div>
            <strong>All Transformed Values:</strong>
            <div className="mt-2 space-y-1">
              {values.map((value, index) => (
                <div key={index} className="text-xs bg-white dark:bg-gray-800 p-2 rounded">
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const CustomTransform: Story = {
  render: () => <TransformDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using a custom transform function to modify incoming values before they are stored.',
      },
    },
  },
}

function ErrorHandlingDemo() {
  const [source, setSource] = useState<AsyncIterable<string> | null>(null)
  
  const { values, latest, status, error, isStreaming, reset } = useStreamableUI(source, {
    mode: 'append',
    onError: (err) => {
      console.error('Stream error:', err)
    },
  })

  const startStreamingWithError = () => {
    const asyncIterable: AsyncIterable<string> = {
      [Symbol.asyncIterator]: async function* () {
        yield 'First value'
        await new Promise((resolve) => setTimeout(resolve, 500))
        throw new Error('Simulated streaming error')
      },
    }

    setSource(asyncIterable)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <h3 className="font-medium">Error Handling</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Demonstrates error handling when streaming fails.
        </p>
        <div className="flex gap-2">
          <Button onClick={startStreamingWithError} disabled={isStreaming}>
            Start Streaming (Will Error)
          </Button>
          <Button onClick={() => { reset(); setSource(null) }} variant="outline">
            Reset
          </Button>
        </div>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Status:</strong>{' '}
            <span className={`px-2 py-1 rounded ${
              status === 'error' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
              status === 'streaming' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' :
              'bg-gray-200 dark:bg-gray-800'
            }`}>
              {status}
            </span>
          </div>
          {error && (
            <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-800 dark:text-red-200">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          <div>
            <strong>Values Received:</strong> {values.length > 0 ? values.join(', ') : 'None'}
          </div>
        </div>
      </div>
    </div>
  )
}

export const ErrorHandling: Story = {
  render: () => <ErrorHandlingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Error handling when streaming encounters an error.',
      },
    },
  },
}
