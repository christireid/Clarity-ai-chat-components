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
  title: 'useCompletion Hook | Clarity Chat',
  description: 'Hook for managing text completion state with streaming support. Ideal for single-turn completions, autocomplete, and text generation.',
}

const useCompletionOptions: Prop[] = [
  {
    name: 'api',
    type: 'string',
    default: '"/api/completion"',
    description: 'API endpoint URL for completion requests.',
  },
  {
    name: 'initialCompletion',
    type: 'string',
    default: '""',
    description: 'Initial completion text.',
  },
  {
    name: 'body',
    type: 'Record<string, any>',
    description: 'Additional body data to send with requests.',
  },
  {
    name: 'headers',
    type: 'Record<string, string>',
    description: 'Custom headers to include in API requests.',
  },
  {
    name: 'onFinish',
    type: '(prompt: string, completion: string) => void | Promise<void>',
    description: 'Callback when completion finishes.',
  },
  {
    name: 'onError',
    type: '(error: Error) => void',
    description: 'Callback when an error occurs.',
  },
  {
    name: 'onProgress',
    type: '(bytes: number) => void',
    description: 'Callback for progress updates (bytes received).',
  },
  {
    name: 'stream',
    type: 'boolean',
    default: 'true',
    description: 'Enable streaming responses.',
  },
  {
    name: 'streamFormat',
    type: '"sse" | "data"',
    default: '"sse"',
    description: 'Streaming format.',
  },
]

const useCompletionReturn: Prop[] = [
  {
    name: 'completion',
    type: 'string',
    description: 'Current completion text (accumulated during streaming).',
  },
  {
    name: 'setCompletion',
    type: 'React.Dispatch<React.SetStateAction<string>>',
    description: 'Set completion text directly.',
  },
  {
    name: 'complete',
    type: '(prompt: string, options?: CompletionRequestOptions) => Promise<string>',
    description: 'Generate completion for a prompt. Returns the full completion.',
  },
  {
    name: 'isLoading',
    type: 'boolean',
    description: 'Whether completion is currently in progress.',
  },
  {
    name: 'error',
    type: 'Error | undefined',
    description: 'Current error state, if any.',
  },
  {
    name: 'stop',
    type: '() => void',
    description: 'Stop the current completion.',
  },
  {
    name: 'reset',
    type: '() => void',
    description: 'Reset completion state.',
  },
]

export default function UseCompletionPage() {
  return (
    <>
      <Breadcrumbs />

      <h1>useCompletion</h1>

      <p className="lead">
        Hook for managing text completion state with streaming support. Ideal for
        single-turn completions, autocomplete, and text generation.
      </p>

      <Callout type="info" title="Architecture Layer">
        <p>
          <strong>useCompletion</strong> is a mid-level hook for text completions.
          For chat interfaces, use top-level <code>useClarityChat</code> instead.
          For structured output, use <code>useClarityObject</code> instead.
        </p>
      </Callout>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Basic Usage</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          The simplest way to use the hook:
        </p>
        
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useCompletion } from '@clarity-chat/react'

function Autocomplete() {
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
  })

  const handleComplete = async (prompt: string) => {
    const result = await complete(prompt)
    console.log('Completion:', result)
  }

  return (
    <div>
      {isLoading && <div>Generating...</div>}
      <div>{completion}</div>
      <button onClick={() => handleComplete('Write a story about')}>
        Generate
      </button>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Interactive Playground</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Experiment with useCompletion:
        </p>
        <CodePlayground
          initialCode={`import { useCompletion } from '@clarity-chat/react'
import { useState } from 'react'

function Example() {
  const [prompt, setPrompt] = useState('')
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
  })

  const handleSubmit = async () => {
    await complete(prompt)
  }

  return (
    <div>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt..."
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate'}
      </button>
      {completion && <div className="mt-4">{completion}</div>}
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Examples</h2>

        <h3 className="text-xl font-semibold mt-6 mb-4">Autocomplete</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useCompletion } from '@clarity-chat/react'
import { useState, useEffect } from 'react'

function Autocomplete() {
  const [input, setInput] = useState('')
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
  })

  useEffect(() => {
    if (input.length > 3) {
      const timeoutId = setTimeout(() => {
        complete(input)
      }, 300) // Debounce

      return () => clearTimeout(timeoutId)
    }
  }, [input])

  return (
    <div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Start typing..."
      />
      {isLoading && <div>Thinking...</div>}
      {completion && (
        <div className="suggestion">{completion}</div>
      )}
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">Text Generation</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useCompletion } from '@clarity-chat/react'

function TextGenerator() {
  const { completion, complete, isLoading, stop } = useCompletion({
    api: '/api/completion',
    onFinish: (prompt, completion) => {
      console.log('Generated:', completion)
    },
  })

  return (
    <div>
      <button onClick={() => complete('Write a poem about')}>
        Generate Poem
      </button>
      {isLoading && (
        <button onClick={stop}>Stop</button>
      )}
      <div className="output">{completion}</div>
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Progress Tracking</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useCompletion } from '@clarity-chat/react'
import { useState } from 'react'

function CompletionWithProgress() {
  const [bytesReceived, setBytesReceived] = useState(0)
  
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/completion',
    onProgress: (bytes) => {
      setBytesReceived(bytes)
    },
  })

  return (
    <div>
      {isLoading && (
        <div>
          <progress value={bytesReceived} max={1000} />
          <span>{bytesReceived} bytes received</span>
        </div>
      )}
      <div>{completion}</div>
    </div>
  )
}`}
        />

        <h3 className="text-xl font-semibold mt-6 mb-4">With Error Handling</h3>
        <EnhancedCodeBlock
          language="tsx"
          code={`import { useCompletion } from '@clarity-chat/react'

function Completion() {
  const { completion, complete, error, isLoading } = useCompletion({
    api: '/api/completion',
    onError: (error) => {
      console.error('Completion error:', error)
      toast.error('Failed to generate completion')
    },
  })

  if (error) {
    return (
      <div className="error">
        <p>Error: {error.message}</p>
        <button onClick={() => complete('Retry')}>Retry</button>
      </div>
    )
  }

  return (
    <div>
      {isLoading && <div>Generating...</div>}
      <div>{completion}</div>
    </div>
  )
}`}
        />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Options</h2>
        <PropsTable props={useCompletionOptions} title="Hook Options" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Return Values</h2>
        <PropsTable props={useCompletionReturn} title="Hook Return" />
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Use Cases</h2>
        <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600 dark:text-gray-400">
          <li><strong>Autocomplete</strong> - Complete user input as they type</li>
          <li><strong>Text generation</strong> - Generate stories, articles, code</li>
          <li><strong>Code completion</strong> - IDE-like code suggestions</li>
          <li><strong>Email drafting</strong> - Help users write emails</li>
          <li><strong>Content creation</strong> - Generate blog posts, social media content</li>
        </ul>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">vs useClarityChat</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          <code>useCompletion</code> is for single-turn completions, while <code>useClarityChat</code>
          is for multi-turn conversations:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Feature</th>
                <th className="text-left p-2">useCompletion</th>
                <th className="text-left p-2">useClarityChat</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b">
                <td className="p-2">Use Case</td>
                <td className="p-2">Single-turn completions</td>
                <td className="p-2">Multi-turn conversations</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">State</td>
                <td className="p-2">Single completion string</td>
                <td className="p-2">Array of messages</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Context</td>
                <td className="p-2">No conversation history</td>
                <td className="p-2">Full conversation context</td>
              </tr>
              <tr className="border-b">
                <td className="p-2">Best For</td>
                <td className="p-2">Autocomplete, text generation</td>
                <td className="p-2">Chat interfaces, assistants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="my-12">
        <h2 className="text-2xl font-bold mb-4">Related</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/reference/hooks/use-clarity-chat" className="docs-card">
            <h3>useClarityChat Hook</h3>
            <p>Multi-turn conversation hook</p>
          </a>
          <a href="/reference/hooks/use-assistant" className="docs-card">
            <h3>useAssistant Hook</h3>
            <p>Assistant with tool calling</p>
          </a>
          <a href="/reference/hooks/use-clarity-object" className="docs-card">
            <h3>useClarityObject Hook</h3>
            <p>Structured output hook</p>
          </a>
          <a href="/cookbook/autocomplete" className="docs-card">
            <h3>Autocomplete Recipe</h3>
            <p>Recipe for autocomplete</p>
          </a>
        </div>
      </section>

      <Pagination
        prev={{ title: 'useAssistant', href: '/reference/hooks/use-assistant' }}
        next={{ title: 'useMessageOperations', href: '/reference/hooks/use-message-operations' }}
      />
    </>
  )
}
