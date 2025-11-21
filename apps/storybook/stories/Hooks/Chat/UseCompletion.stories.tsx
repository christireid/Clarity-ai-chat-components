import type { Meta, StoryObj } from '@storybook/react'
import { useCompletion } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useCompletion Hook**
 * 
 * Hook for managing text completion state with streaming support.
 * Ideal for single-turn completions, autocomplete, and text generation.
 * 
 * **Key Features:**
 * - Streaming text completion
 * - Single-turn interactions
 * - Error handling and recovery
 * - Request cancellation
 * - Custom API endpoints
 * - Callback support
 * 
 * **Use Cases:**
 * - Text autocomplete
 * - Single-turn AI completions
 * - Text generation
 * - Code completion
 * - Search suggestions
 */
const meta = {
  title: 'Hooks/Chat/UseCompletion',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useCompletion\` hook provides a simple way to handle text completion
with streaming support. It's ideal for single-turn interactions where you
provide a prompt and receive a completion.

## Features

- ✅ Streaming text completion
- ✅ Single-turn interactions
- ✅ Error handling and recovery
- ✅ Request cancellation
- ✅ Custom API endpoints
- ✅ Callback support (onFinish, onError, onResponse)
- ✅ Loading and error states

## Basic Usage

\`\`\`tsx
const { completion, complete, isLoading, error, stop } = useCompletion({
  api: '/api/completion',
  onFinish: (prompt, completion) => {
    console.log('Completed:', completion)
  },
})

// Complete a prompt
await complete('Write a haiku about coding')
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function BasicCompletionDemo() {
  const { completion, complete, isLoading, error, stop } = useCompletion({
    onFinish: (prompt, completion) => {
      console.log('Completion finished:', { prompt, completion })
    },
    onError: (error) => {
      console.error('Completion error:', error)
    },
  })

  const [prompt, setPrompt] = useState('')

  const handleComplete = async () => {
    if (!prompt.trim()) return
    await complete(prompt)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Enter a prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., Write a haiku about coding"
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleComplete} disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Completing...' : 'Complete'}
        </Button>
        {isLoading && (
          <Button onClick={stop} variant="outline">
            Stop
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
          Error: {error.message}
        </div>
      )}

      {completion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Completion:</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg whitespace-pre-wrap">
            {completion}
          </div>
        </div>
      )}

      {isLoading && !completion && (
        <div className="text-sm text-gray-500">Generating completion...</div>
      )}
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicCompletionDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic completion example with prompt input and streaming output.',
      },
    },
  },
}

function MockAPIDemo() {
  const { completion, complete, isLoading, error, stop } = useCompletion({
    // Mock API endpoint
    api: '/api/completion',
    onFinish: (prompt, completion) => {
      console.log('Mock completion finished')
    },
  })

  const [prompt, setPrompt] = useState('')

  const handleComplete = async () => {
    if (!prompt.trim()) return
    
    // Simulate API call with streaming
    const mockStream = new ReadableStream({
      async start(controller) {
        const words = `This is a mock completion for: "${prompt}". `.split(' ')
        for (const word of words) {
          await new Promise((resolve) => setTimeout(resolve, 100))
          controller.enqueue(new TextEncoder().encode(word + ' '))
        }
        controller.close()
      },
    })

    // Convert stream to text
    const reader = mockStream.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      fullText += decoder.decode(value, { stream: true })
      // Update completion state manually for demo
      // In real usage, the hook handles this automatically
    }

    // For demo purposes, we'll use a simplified approach
    await complete(prompt, {
      body: { mock: true },
    })
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleComplete} disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Completing...' : 'Complete'}
        </Button>
        {isLoading && (
          <Button onClick={stop} variant="outline">
            Stop
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-200">
          Error: {error.message}
        </div>
      )}

      {completion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Completion:</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg whitespace-pre-wrap">
            {completion}
          </div>
        </div>
      )}
    </div>
  )
}

export const WithMockAPI: Story = {
  render: () => <MockAPIDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Completion with mock API integration and streaming simulation.',
      },
    },
  },
}

function ErrorHandlingDemo() {
  const { completion, complete, isLoading, error, stop } = useCompletion({
    onError: (error) => {
      console.error('Error caught:', error)
    },
  })

  const [prompt, setPrompt] = useState('')

  const handleComplete = async () => {
    if (!prompt.trim()) return
    
    try {
      // Simulate an error
      if (prompt.toLowerCase().includes('error')) {
        throw new Error('Simulated API error')
      }
      
      await complete(prompt)
    } catch (err) {
      console.error('Completion failed:', err)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt (try "error" to trigger error):</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt (or 'error' to simulate error)"
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleComplete} disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Completing...' : 'Complete'}
        </Button>
        {isLoading && (
          <Button onClick={stop} variant="outline">
            Stop
          </Button>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="font-medium text-red-800 dark:text-red-200">Error:</div>
          <div className="text-sm text-red-700 dark:text-red-300 mt-1">{error.message}</div>
        </div>
      )}

      {completion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Completion:</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg whitespace-pre-wrap">
            {completion}
          </div>
        </div>
      )}
    </div>
  )
}

export const ErrorHandling: Story = {
  render: () => <ErrorHandlingDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Error handling and recovery in completion requests.',
      },
    },
  },
}

function CancellationDemo() {
  const { completion, complete, isLoading, stop } = useCompletion({
    onFinish: (prompt, completion) => {
      console.log('Completion finished (not cancelled)')
    },
  })

  const [prompt, setPrompt] = useState('')

  const handleComplete = async () => {
    if (!prompt.trim()) return
    await complete(prompt)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Prompt:</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt"
          className="w-full p-3 border rounded-lg resize-none"
          rows={3}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={handleComplete} disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Completing...' : 'Start Completion'}
        </Button>
        {isLoading && (
          <Button onClick={stop} variant="outline">
            Cancel Request
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
          Completion in progress... Click "Cancel Request" to stop.
        </div>
      )}

      {completion && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Completion:</label>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg whitespace-pre-wrap">
            {completion}
          </div>
        </div>
      )}
    </div>
  )
}

export const Cancellation: Story = {
  render: () => <CancellationDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Cancelling an in-progress completion request using the stop() function.',
      },
    },
  },
}
