import type { Meta, StoryObj } from '@storybook/react'
import { useDebounce } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState, useEffect } from 'react'

/**
 * **useDebounce Hook**
 * 
 * Hook for debouncing values - only updates after delay has passed
 * since last change. Useful for reducing API calls during rapid input.
 * 
 * **Key Features:**
 * - Debounce value updates
 * - Configurable delay
 * - Prevents excessive updates
 * - Automatic cleanup
 * 
 * **Use Cases:**
 * - Search input with API calls
 * - Form validation
 * - Auto-save functionality
 * - Filtering large lists
 */
const meta = {
  title: 'Hooks/Performance/UseDebounce',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useDebounce\` hook delays value updates until after a specified
delay has passed since the last change. This is useful for reducing
the frequency of expensive operations like API calls.

## Features

- ✅ Debounce value updates
- ✅ Configurable delay
- ✅ Prevents excessive updates
- ✅ Automatic cleanup
- ✅ Type-safe with TypeScript

## Basic Usage

\`\`\`tsx
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

useEffect(() => {
  // Only fires 500ms after user stops typing
  searchAPI(debouncedSearch)
}, [debouncedSearch])
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function SearchDemo() {
  const [searchTerm, setSearchTerm] = useState('')
  const [delay, setDelay] = useState(500)
  const debouncedSearch = useDebounce(searchTerm, delay)
  const [apiCalls, setApiCalls] = useState(0)

  useEffect(() => {
    if (debouncedSearch) {
      setApiCalls((prev) => prev + 1)
      console.log('API call with:', debouncedSearch)
    }
  }, [debouncedSearch])

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search (debounced):</label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type to search..."
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Debounce Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="100"
          max="2000"
          step="100"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2">
        <div className="text-sm">
          <strong>Current Input:</strong> {searchTerm || '(empty)'}
        </div>
        <div className="text-sm">
          <strong>Debounced Value:</strong> {debouncedSearch || '(empty)'}
        </div>
        <div className="text-sm">
          <strong>API Calls Made:</strong> {apiCalls}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Notice how API calls only happen after you stop typing for {delay}ms
        </p>
      </div>
    </div>
  )
}

export const SearchInput: Story = {
  render: () => <SearchDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Debouncing search input to reduce API calls while user is typing.',
      },
    },
  },
}

function AutoSaveDemo() {
  const [content, setContent] = useState('')
  const [delay, setDelay] = useState(1000)
  const debouncedContent = useDebounce(content, delay)
  const [saves, setSaves] = useState(0)
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    if (debouncedContent && debouncedContent !== content) {
      // Simulate auto-save
      setSaves((prev) => prev + 1)
      setLastSaved(new Date().toLocaleTimeString())
      console.log('Auto-saving:', debouncedContent)
    }
  }, [debouncedContent])

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Document Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your content here..."
          className="w-full p-2 border rounded-lg resize-none"
          rows={6}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Auto-save Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="500"
          max="5000"
          step="500"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg space-y-2">
        <div className="text-sm">
          <strong>Current Content Length:</strong> {content.length} characters
        </div>
        <div className="text-sm">
          <strong>Debounced Content Length:</strong> {debouncedContent.length} characters
        </div>
        <div className="text-sm">
          <strong>Auto-saves Completed:</strong> {saves}
        </div>
        {lastSaved && (
          <div className="text-sm text-green-600 dark:text-green-400">
            ✓ Last saved at: {lastSaved}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Content will auto-save {delay}ms after you stop typing
        </p>
      </div>
    </div>
  )
}

export const AutoSave: Story = {
  render: () => <AutoSaveDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Using debounce for auto-save functionality that saves after user stops typing.',
      },
    },
  },
}

function FilterDemo() {
  const [filter, setFilter] = useState('')
  const [delay, setDelay] = useState(300)
  const debouncedFilter = useDebounce(filter, delay)

  const items = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
    'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
    'Mango', 'Orange', 'Papaya', 'Quince', 'Raspberry',
  ]

  const filteredItems = debouncedFilter
    ? items.filter((item) => item.toLowerCase().includes(debouncedFilter.toLowerCase()))
    : items

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Filter Items:</label>
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Type to filter..."
          className="w-full p-2 border rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Debounce Delay (ms):</label>
        <input
          type="number"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full p-2 border rounded-lg"
          min="0"
          max="1000"
          step="100"
        />
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="text-sm mb-2">
          <strong>Current Filter:</strong> {filter || '(none)'}
        </div>
        <div className="text-sm mb-4">
          <strong>Debounced Filter:</strong> {debouncedFilter || '(none)'}
        </div>
        <div className="text-sm font-medium mb-2">
          Results ({filteredItems.length}):
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredItems.map((item) => (
            <span key={item} className="px-2 py-1 bg-white dark:bg-gray-800 rounded text-sm">
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export const Filtering: Story = {
  render: () => <FilterDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Debouncing filter input to reduce re-renders while user is typing.',
      },
    },
  },
}
