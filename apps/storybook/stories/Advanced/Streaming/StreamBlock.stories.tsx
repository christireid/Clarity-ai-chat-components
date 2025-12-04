import type { Meta, StoryObj } from '@storybook/react-vite'
import { StreamBlock } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **StreamBlock Component**
 * 
 * A flexible component for rendering streaming content from various sources.
 * 
 * **Key Features:**
 * - Supports multiple stream sources (StreamableValue, async iterable, promise, ReadableStream)
 * - Append or replace accumulation modes
 * - Custom render functions
 * - Error handling with fallbacks
 * - Live streaming indicator
 * - Accessible with ARIA attributes
 * 
 * **Use Cases:**
 * - AI chat streaming responses
 * - Real-time data feeds
 * - Progressive content loading
 * - Streaming API responses
 */
const meta = {
  title: 'Advanced/Streaming/StreamBlock',
  component: StreamBlock,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`StreamBlock\` component provides a flexible way to render streaming content
from various sources with automatic accumulation and rendering.

## Features

- ✅ Multiple source types (StreamableValue, async iterable, promise, ReadableStream)
- ✅ Append or replace accumulation modes
- ✅ Custom render functions
- ✅ Error handling with fallbacks
- ✅ Live streaming indicator
- ✅ Accessible with ARIA attributes
- ✅ Configurable spacing

## Basic Usage

\`\`\`tsx
<StreamBlock
  source={streamSource}
  mode="append"
  showIndicator={true}
  fallback={<div>Waiting for stream...</div>}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['append', 'replace'],
      description: 'How incoming fragments should be accumulated',
    },
    spacing: {
      control: 'select',
      options: ['none', 'compact', 'relaxed'],
      description: 'Spacing between streamed entries',
    },
    showIndicator: {
      control: 'boolean',
      description: 'Show live streaming indicator',
    },
  },
} satisfies Meta<typeof StreamBlock>

export default meta
type Story = StoryObj<typeof meta>

// Helper to create a mock async iterable
async function* createMockAsyncIterable(text: string, delay = 50) {
  const chunks = text.split(' ')
  for (const chunk of chunks) {
    await new Promise((resolve) => setTimeout(resolve, delay))
    yield chunk
  }
}

// Helper to create a mock ReadableStream
function createMockStream(text: string, delay = 50): ReadableStream<string> {
  const chunks = text.split(' ')
  
  return new ReadableStream({
    async start(controller) {
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, delay))
        controller.enqueue(chunk)
      }
      controller.close()
    },
  })
}

function BasicStreamBlockDemo() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)

  const handleStart = () => {
    const stream = createMockStream(
      'This is a streaming response that appears word by word. ' +
      'Each word is streamed individually to demonstrate progressive rendering.'
    )
    setSource(stream)
  }

  const handleReset = () => {
    setSource(null)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <StreamBlock
        source={source}
        mode="append"
        showIndicator={true}
        spacing="compact"
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        renderItem={(item, index) => (
          <span key={index} className="inline-block mr-2">
            {item}
          </span>
        )}
      />

      <div className="flex gap-2">
        <Button onClick={handleStart} disabled={source !== null}>
          Start Stream
        </Button>
        <Button variant="outline" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicStreamBlockDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic StreamBlock with word-by-word streaming from a ReadableStream.',
      },
    },
  },
}

function StreamBlockWithAsyncIterable() {
  const [source, setSource] = useState<AsyncIterable<string> | null>(null)

  const handleStart = () => {
    const iterable = createMockAsyncIterable(
      'This demonstrates streaming from an async iterable. ' +
      'Async iterables are great for custom streaming logic and generators.'
    )
    setSource(iterable)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <StreamBlock
        source={source}
        mode="append"
        showIndicator={true}
        spacing="relaxed"
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        renderItem={(item, index) => (
          <div key={index} className="p-2 bg-muted rounded mb-2">
            {item}
          </div>
        )}
      />

      <Button onClick={handleStart} disabled={source !== null}>
        Start Stream
      </Button>
    </div>
  )
}

export const WithAsyncIterable: Story = {
  render: () => <StreamBlockWithAsyncIterable />,
  parameters: {
    docs: {
      description: {
        story: 'StreamBlock using an async iterable as the source.',
      },
    },
  },
}

function StreamBlockWithReplaceMode() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)

  const handleStart = () => {
    const stream = createMockStream(
      'Replace mode replaces the entire content with each new chunk. ' +
      'This is useful when you want to show only the latest state.'
    )
    setSource(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm mb-4">
        <strong>Replace Mode:</strong> Each chunk replaces the previous content instead of appending.
      </div>

      <StreamBlock
        source={source}
        mode="replace"
        showIndicator={true}
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        renderItem={(item) => (
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-2xl font-bold">{item}</div>
            <div className="text-xs text-muted-foreground mt-2">Current chunk</div>
          </div>
        )}
      />

      <Button onClick={handleStart} disabled={source !== null}>
        Start Stream (Replace Mode)
      </Button>
    </div>
  )
}

export const ReplaceMode: Story = {
  render: () => <StreamBlockWithReplaceMode />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates replace mode where each chunk replaces the previous content.',
      },
    },
  },
}

function StreamBlockWithErrorHandling() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)
  const [hasError, setHasError] = useState(false)

  const handleStart = () => {
    setHasError(false)
    // Create a stream that will error
    const stream = new ReadableStream({
      async start(controller) {
        await new Promise((resolve) => setTimeout(resolve, 500))
        controller.enqueue('First chunk')
        await new Promise((resolve) => setTimeout(resolve, 500))
        controller.error(new Error('Stream error occurred!'))
      },
    })
    setSource(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <StreamBlock
        source={source}
        mode="append"
        showIndicator={true}
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        errorFallback={(error) => (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
            <div className="font-semibold mb-2">Stream Error</div>
            <div className="text-sm">{error.message}</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSource(null)
                setHasError(false)
              }}
              className="mt-3"
            >
              Reset
            </Button>
          </div>
        )}
        renderItem={(item, index) => (
          <span key={index} className="inline-block mr-2">
            {item}
          </span>
        )}
      />

      <Button onClick={handleStart} disabled={source !== null && !hasError}>
        Start Stream (Will Error)
      </Button>
    </div>
  )
}

export const ErrorHandling: Story = {
  render: () => <StreamBlockWithErrorHandling />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates error handling with custom error fallback.',
      },
    },
  },
}

function StreamBlockSpacing() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)
  const [spacing, setSpacing] = useState<'none' | 'compact' | 'relaxed'>('compact')

  const handleStart = () => {
    const stream = createMockStream('Item One Item Two Item Three Item Four Item Five')
    setSource(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={spacing === 'none' ? 'default' : 'outline'}
          onClick={() => setSpacing('none')}
        >
          None
        </Button>
        <Button
          size="sm"
          variant={spacing === 'compact' ? 'default' : 'outline'}
          onClick={() => setSpacing('compact')}
        >
          Compact
        </Button>
        <Button
          size="sm"
          variant={spacing === 'relaxed' ? 'default' : 'outline'}
          onClick={() => setSpacing('relaxed')}
        >
          Relaxed
        </Button>
      </div>

      <StreamBlock
        source={source}
        mode="append"
        spacing={spacing}
        showIndicator={true}
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        renderItem={(item, index) => (
          <div key={index} className="p-3 bg-muted rounded border">
            {item}
          </div>
        )}
      />

      <Button onClick={handleStart} disabled={source !== null}>
        Start Stream
      </Button>
    </div>
  )
}

export const SpacingOptions: Story = {
  render: () => <StreamBlockSpacing />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates different spacing options: none, compact, and relaxed.',
      },
    },
  },
}

function StreamBlockCustomElement() {
  const [source, setSource] = useState<ReadableStream<string> | null>(null)

  const handleStart = () => {
    const stream = createMockStream('Paragraph One Paragraph Two Paragraph Three')
    setSource(stream)
  }

  return (
    <div className="space-y-4 w-full max-w-2xl">
      <StreamBlock
        source={source}
        mode="append"
        as="article"
        className="prose dark:prose-invert"
        showIndicator={true}
        spacing="relaxed"
        fallback={<div className="text-muted-foreground">Click "Start Stream" to begin...</div>}
        renderItem={(item, index) => (
          <p key={index} className="mb-4">
            {item}
          </p>
        )}
      />

      <Button onClick={handleStart} disabled={source !== null}>
        Start Stream
      </Button>

      <div className="p-3 bg-muted rounded-lg text-xs">
        <strong>Custom Element:</strong> Using <code>as="article"</code> to render as a semantic HTML article element.
      </div>
    </div>
  )
}

export const CustomElement: Story = {
  render: () => <StreamBlockCustomElement />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates custom HTML element rendering with the `as` prop.',
      },
    },
  },
}
