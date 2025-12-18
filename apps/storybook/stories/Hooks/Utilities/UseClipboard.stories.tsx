import type { Meta, StoryObj } from '@storybook/react-vite'
import { useClipboard } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **useClipboard Hook**
 * 
 * Hook for copying text to clipboard with success tracking
 * and automatic reset.
 * 
 * **Key Features:**
 * - Copy text to clipboard
 * - Success state tracking
 * - Automatic reset after timeout
 * - Success/error callbacks
 * - Browser compatibility (modern API + fallback)
 * 
 * **Use Cases:**
 * - Copy buttons
 * - Share functionality
 * - Code snippet copying
 * - Link copying
 */
const meta = {
  title: 'Hooks/Utilities/UseClipboard',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useClipboard\` hook provides a simple way to copy text to clipboard
with success tracking and automatic reset.

## Features

- ✅ Copy text to clipboard
- ✅ Success state tracking
- ✅ Automatic reset after timeout
- ✅ Success/error callbacks
- ✅ Browser compatibility (modern API + fallback)
- ✅ Accessible clipboard operations

## Basic Usage

\`\`\`tsx
const { copy, copied, reset } = useClipboard({ timeout: 3000 })

return (
  <button onClick={() => copy('Hello world')}>
    {copied ? 'Copied!' : 'Copy'}
  </button>
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

function BasicClipboardDemo() {
  const { copy, copied, reset } = useClipboard({
    timeout: 2000,
    onSuccess: () => {
      SecureLogger.debug('Copied successfully!')
    },
    onError: (error) => {
      SecureLogger.error('Copy failed:', error)
    },
  })

  const [text, setText] = useState('Hello, World!')

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Text to Copy:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => copy(text)}>
          {copied ? '✓ Copied!' : 'Copy to Clipboard'}
        </Button>
        {copied && (
          <Button onClick={reset} variant="outline">
            Reset
          </Button>
        )}
      </div>

      {copied && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
          Text copied to clipboard! It will reset automatically after 2 seconds.
        </div>
      )}
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicClipboardDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic clipboard functionality with success state tracking.',
      },
    },
  },
}

function CustomTimeoutDemo() {
  const [timeout, setTimeoutValue] = useState(3000)
  const { copy, copied, reset } = useClipboard({
    timeout,
    onSuccess: () => {
      SecureLogger.debug('Copied with timeout:', timeout)
    },
  })

  const [text, setText] = useState('Custom timeout example')

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Timeout (ms):</label>
        <input
          type="number"
          value={timeout}
          onChange={(e) => setTimeoutValue(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="500"
          max="10000"
          step="500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Text to Copy:</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={() => copy(text)}>
          {copied ? '✓ Copied!' : 'Copy'}
        </Button>
        {copied && (
          <Button onClick={reset} variant="outline">
            Reset Now
          </Button>
        )}
      </div>

      {copied && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-200">
          Copied! Will reset after {timeout}ms
        </div>
      )}
    </div>
  )
}

export const CustomTimeout: Story = {
  render: () => <CustomTimeoutDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Customizing the timeout before the copied state resets.',
      },
    },
  },
}

function CodeSnippetDemo() {
  const { copy, copied } = useClipboard()

  const codeSnippets = [
    {
      name: 'React Component',
      code: `function MyComponent() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}`,
    },
    {
      name: 'API Call',
      code: `const response = await fetch('/api/data')
const data = await response.json()`,
    },
    {
      name: 'TypeScript Type',
      code: `type User = {
  id: string
  name: string
  email: string
}`,
    },
  ]

  return (
    <div className="space-y-4 max-w-2xl">
      <h3 className="font-medium">Code Snippets</h3>
      {codeSnippets.map((snippet, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{snippet.name}</span>
            <Button
              size="sm"
              onClick={() => copy(snippet.code)}
              variant={copied ? 'default' : 'outline'}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </Button>
          </div>
          <pre className="text-xs bg-white dark:bg-gray-800 p-2 rounded overflow-x-auto">
            <code>{snippet.code}</code>
          </pre>
        </div>
      ))}
    </div>
  )
}

export const CodeSnippets: Story = {
  render: () => <CodeSnippetDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using clipboard hook for copying code snippets.',
      },
    },
  },
}
