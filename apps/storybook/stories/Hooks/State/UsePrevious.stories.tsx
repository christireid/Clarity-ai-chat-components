import type { Meta, StoryObj } from '@storybook/react'
import { usePrevious } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState } from 'react'

/**
 * **usePrevious Hook**
 * 
 * Hook for getting the previous value of state or prop from the last render.
 * Useful for tracking changes and implementing undo/comparison features.
 * 
 * **Key Features:**
 * - Track previous value
 * - Compare current vs previous
 * - Undefined on first render
 * - Automatic updates
 * - Memory efficient
 * 
 * **Use Cases:**
 * - Tracking value changes
 * - Comparing current vs previous
 * - Animation triggers
 * - Undo functionality
 * - Debugging state changes
 */
const meta = {
  title: 'Hooks/State/UsePrevious',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`usePrevious\` hook gets the previous value of state or prop from
the last render. Useful for tracking changes and implementing undo/comparison features.

## Features

- ✅ Track previous value
- ✅ Compare current vs previous
- ✅ Undefined on first render
- ✅ Automatic updates
- ✅ Memory efficient
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [count, setCount] = useState(0)
const prevCount = usePrevious(count)

return (
  <div>
    <p>Current: {count}</p>
    <p>Previous: {prevCount}</p>
    {prevCount !== undefined && (
      <p>Changed by: {count - prevCount}</p>
    )}
    <button onClick={() => setCount(count + 1)}>Increment</button>
  </div>
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

function CounterDemo() {
  const [count, setCount] = useState(0)
  const prevCount = usePrevious(count)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Count:</strong> {count}
          </div>
          <div>
            <strong>Previous Count:</strong> {prevCount !== undefined ? prevCount : 'N/A (first render)'}
          </div>
          {prevCount !== undefined && (
            <div>
              <strong>Change:</strong> {count - prevCount > 0 ? '+' : ''}{count - prevCount}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <Button onClick={() => setCount((prev) => prev - 1)} variant="outline">
          Decrement
        </Button>
        <Button onClick={() => setCount(0)} variant="outline">
          Reset
        </Button>
      </div>
    </div>
  )
}

export const Counter: Story = {
  render: () => <CounterDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Tracking previous count value to show changes.',
      },
    },
  },
}

function InputChangeDemo() {
  const [input, setInput] = useState('')
  const prevInput = usePrevious(input)

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Input:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded-lg"
          placeholder="Type something..."
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Value:</strong> {input || '(empty)'}
          </div>
          <div>
            <strong>Previous Value:</strong> {prevInput !== undefined ? (prevInput || '(empty)') : 'N/A'}
          </div>
          {prevInput !== undefined && prevInput !== input && (
            <div className="text-green-600 dark:text-green-400">
              ✓ Value changed from "{prevInput}" to "{input}"
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const InputChange: Story = {
  render: () => <InputChangeDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Tracking previous input value to detect changes.',
      },
    },
  },
}

function UndoDemo() {
  const [value, setValue] = useState('Initial value')
  const prevValue = usePrevious(value)
  const [history, setHistory] = useState<string[]>([])

  const updateValue = (newValue: string) => {
    if (value !== newValue) {
      setHistory((prev) => [...prev, value])
    }
    setValue(newValue)
  }

  const undo = () => {
    if (prevValue !== undefined) {
      setValue(prevValue)
    }
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Value:</label>
        <input
          type="text"
          value={value}
          onChange={(e) => updateValue(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={undo} disabled={prevValue === undefined} variant="outline">
          Undo (Restore Previous)
        </Button>
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="space-y-2 text-sm">
          <div>
            <strong>Current Value:</strong> {value}
          </div>
          <div>
            <strong>Previous Value:</strong> {prevValue !== undefined ? prevValue : 'N/A'}
          </div>
          {history.length > 0 && (
            <div className="mt-2">
              <strong>History:</strong>
              <div className="mt-1 space-y-1">
                {history.slice(-5).reverse().map((item, index) => (
                  <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Undo: Story = {
  render: () => <UndoDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using previous value for undo functionality.',
      },
    },
  },
}
