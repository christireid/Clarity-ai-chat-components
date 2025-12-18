import type { Meta, StoryObj } from '@storybook/react-vite'
import { useStreaming } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useStreaming Hook**
 * 
 * Generic streaming hook for handling ReadableStream data with automatic
 * text decoding and state management.
 * 
 * **Key Features:**
 * - Automatic text decoding from Uint8Array
 * - Chunk-by-chunk processing with callbacks
 * - AbortController support for cancellation
 * - Complete content accumulation
 * - Error handling
 * 
 * **Use Cases:**
 * - Streaming API responses (OpenAI, Anthropic, etc.)
 * - Large file processing
 * - Real-time data feeds
 * - Progressive content rendering
 */
const meta = {
  title: 'Hooks/Streaming/UseStreaming',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useStreaming\` hook provides a generic way to handle streaming data
from ReadableStream sources with automatic text decoding and state management.

## Features

- ✅ Automatic text decoding from Uint8Array
- ✅ Chunk-by-chunk processing with callbacks
- ✅ AbortController support for cancellation
- ✅ Complete content accumulation
- ✅ Error handling
- ✅ Streaming state management

## Basic Usage

\`\`\`tsx
const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming({
  onChunk: (chunk) => SecureLogger.debug('Received:', chunk),
  onComplete: (full) => SecureLogger.debug('Done!', full),
  onError: (error) => SecureLogger.error('Error:', error)
})

// Start streaming
await startStreaming(response.body, { signal: controller.signal })
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// Helper to create a mock stream
function createMockStream(text: string, delay = 50): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const chunks = text.split('')
  
  return new ReadableStream({
    async start(controller) {
      for (const char of chunks) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        controller.enqueue(encoder.encode(char))
      }
      controller.close()
    },
  })
}

function BasicStreamingDemo() {
  const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming({
    onChunk: (chunk) => {
      SecureLogger.debug('Chunk received:', chunk)
    },
    onComplete: (full) => {
      SecureLogger.debug('Streaming complete:', full)
    },
    onError: (error) => {
      SecureLogger.error('Streaming error:', error)
    },
  })

  const handleStart = async () => {
    const stream = createMockStream(
      'This is a streaming response that appears character by character. ' +
      'Each character is streamed individually to demonstrate the progressive ' +
      'rendering capability of the useStreaming hook.'
    )
    await startStreaming(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 min-h-[200px]">
        <div className="text-sm font-medium mb-2">Streamed Content:</div>
        <div className="text-sm whitespace-pre-wrap min-h-[150px]">
          {content || (
            <span className="text-muted-foreground">No content yet. Click "Start Streaming" to begin.</span>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={isStreaming}>
          Start Streaming
        </Button>
        <Button variant="outline" onClick={stopStreaming} disabled={!isStreaming}>
          Stop Streaming
        </Button>
        <Button variant="outline" onClick={reset} disabled={isStreaming}>
          Reset
        </Button>
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Status:</strong> {isStreaming ? 'Streaming...' : 'Idle'}
        </div>
        <div>
          <strong>Content Length:</strong> {content.length} characters
        </div>
      </div>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicStreamingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic streaming example with character-by-character rendering.',
      },
    },
  },
}

function StreamingWithCallbacks() {
  const [chunks, setChunks] = useState<string[]>([])
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const { content, isStreaming, startStreaming, reset } = useStreaming({
    onChunk: (chunk) => {
      setChunks((prev) => [...prev, chunk])
      SecureLogger.debug('Chunk received:', chunk)
    },
    onComplete: (full) => {
      setCompleted(true)
      SecureLogger.debug('Streaming complete! Full content:', full)
    },
    onError: (err) => {
      setError(err)
      SecureLogger.error('Streaming error:', err)
    },
  })

  const handleStart = async () => {
    setChunks([])
    setCompleted(false)
    setError(null)
    
    const stream = createMockStream('Hello, World! This is a test stream.', 100)
    await startStreaming(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 space-y-4">
        <div>
          <div className="text-sm font-medium mb-2">Accumulated Content:</div>
          <div className="text-sm p-3 bg-muted rounded min-h-[100px]">
            {content || <span className="text-muted-foreground">No content</span>}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Chunks Received ({chunks.length}):</div>
          <div className="text-xs space-y-1 max-h-[150px] overflow-y-auto">
            {chunks.length === 0 ? (
              <span className="text-muted-foreground">No chunks yet</span>
            ) : (
              chunks.map((chunk, i) => (
                <div key={i} className="p-2 bg-background rounded border">
                  Chunk {i + 1}: "{chunk}"
                </div>
              ))
            )}
          </div>
        </div>

        {completed && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 rounded-lg text-sm">
            ✓ Streaming completed successfully!
          </div>
        )}

        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            ✗ Error: {error.message}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={isStreaming}>
          Start Streaming
        </Button>
        <Button variant="outline" onClick={reset} disabled={isStreaming}>
          Reset
        </Button>
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Status:</strong> {isStreaming ? 'Streaming...' : 'Idle'}
        </div>
        <div>
          <strong>Completed:</strong> {completed ? 'Yes' : 'No'}
        </div>
        <div>
          <strong>Chunks:</strong> {chunks.length}
        </div>
      </div>
    </div>
  )
}

export const WithCallbacks: Story = {
  render: () => <StreamingWithCallbacks />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates onChunk, onComplete, and onError callbacks.',
      },
    },
  },
}

function StreamingWithCancellation() {
  const { content, isStreaming, startStreaming, stopStreaming, reset } = useStreaming()

  const handleStart = async () => {
    // Create a long stream that can be cancelled
    const stream = createMockStream(
      'This is a very long stream that will take a while to complete. ' +
      'You can cancel it at any time by clicking the Stop button. ' +
      'The stream will be interrupted and the content will stop accumulating. '.repeat(5),
      30
    )
    
    const controller = new AbortController()
    
    try {
      await startStreaming(stream, { signal: controller.signal })
    } catch (error: any) {
      if (error.message !== 'Request cancelled') {
        SecureLogger.error('Streaming error:', error)
      }
    }
  }

  const handleStop = () => {
    stopStreaming()
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 min-h-[200px]">
        <div className="text-sm font-medium mb-2">Streamed Content:</div>
        <div className="text-sm whitespace-pre-wrap min-h-[150px]">
          {content || (
            <span className="text-muted-foreground">No content yet.</span>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={isStreaming}>
          Start Long Stream
        </Button>
        <Button variant="destructive" onClick={handleStop} disabled={!isStreaming}>
          Stop Streaming
        </Button>
        <Button variant="outline" onClick={reset} disabled={isStreaming}>
          Reset
        </Button>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs">
        <strong>Cancellation:</strong> Start a long stream and click "Stop Streaming" 
        to cancel it mid-flight. The content will stop accumulating immediately.
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Status:</strong> {isStreaming ? 'Streaming...' : 'Idle'}
        </div>
        <div>
          <strong>Content Length:</strong> {content.length} characters
        </div>
      </div>
    </div>
  )
}

export const Cancellation: Story = {
  render: () => <StreamingWithCancellation />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates cancelling an in-progress stream.',
      },
    },
  },
}

function StreamingFromAPI() {
  const { content, isStreaming, startStreaming, reset } = useStreaming({
    onComplete: (full) => {
      SecureLogger.debug('API streaming complete:', full)
    },
  })

  const handleStart = async () => {
    // Simulate an API response stream
    const response = await fetch('/api/stream').catch(() => {
      // Fallback to mock stream if API doesn't exist
      return {
        body: createMockStream(
          'This simulates streaming from an API endpoint. ' +
          'In a real application, this would be the response body from fetch(). ' +
          'The useStreaming hook automatically decodes the stream and accumulates the content.'
        ),
      } as Response
    })

    if (response?.body) {
      await startStreaming(response.body)
    }
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="border rounded-lg p-4 min-h-[200px]">
        <div className="text-sm font-medium mb-2">API Stream Content:</div>
        <div className="text-sm whitespace-pre-wrap min-h-[150px]">
          {content || (
            <span className="text-muted-foreground">
              Click "Stream from API" to simulate fetching from an API endpoint.
            </span>
          )}
          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={isStreaming}>
          Stream from API
        </Button>
        <Button variant="outline" onClick={reset} disabled={isStreaming}>
          Reset
        </Button>
      </div>

      <div className="p-3 bg-muted rounded-lg text-xs space-y-1">
        <div>
          <strong>Status:</strong> {isStreaming ? 'Streaming...' : 'Idle'}
        </div>
        <div>
          <strong>Content Length:</strong> {content.length} characters
        </div>
      </div>

      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-xs">
        <strong>Note:</strong> This demo uses a mock stream since the API endpoint doesn't exist.
        In production, replace with your actual API endpoint that returns a ReadableStream.
      </div>
    </div>
  )
}

export const FromAPI: Story = {
  render: () => <StreamingFromAPI />,
  parameters: {
    docs: {
      description: {
        story: 'Example of streaming from a real API endpoint using fetch().',
      },
    },
  },
}
