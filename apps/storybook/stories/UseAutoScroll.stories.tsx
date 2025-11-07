import type { Meta, StoryObj } from '@storybook/react'
import { useAutoScroll } from '@clarity-chat/react'
import { Button } from '@clarity-chat/primitives'
import { useState, useEffect } from 'react'

/**
 * **useAutoScroll Hook**
 * 
 * Hook for automatically scrolling to the bottom of a container
 * when new content is added, while respecting user scroll position.
 * 
 * **Key Features:**
 * - Auto-scroll to bottom on new content
 * - Respects user scroll position (only scrolls if near bottom)
 * - Manual scroll to bottom function
 * - Enable/disable control
 * - Threshold configuration
 * - Smooth scroll behavior
 * 
 * **Use Cases:**
 * - Chat message lists
 * - Log viewers
 * - Activity feeds
 * - Real-time content updates
 */
const meta = {
  title: 'Hooks/useAutoScroll',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The \`useAutoScroll\` hook automatically scrolls to the bottom of a container
when new content is added, but only if the user is near the bottom to avoid
disrupting manual scrolling.

## Features

- ✅ Auto-scroll to bottom on new content
- ✅ Respects user scroll position (only scrolls if near bottom)
- ✅ Manual scroll to bottom function
- ✅ Enable/disable control
- ✅ Threshold configuration
- ✅ Smooth scroll behavior
- ✅ Returns ref for scrollable container

## Basic Usage

\`\`\`tsx
const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages],
  threshold: 50,
})

return (
  <div ref={scrollRef} className="overflow-y-auto h-96">
    {messages.map(msg => <Message key={msg.id} {...msg} />)}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>Scroll to bottom</button>
    )}
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

function BasicAutoScrollDemo() {
  const [messages, setMessages] = useState<string[]>(['Message 1', 'Message 2'])
  
  const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
    dependencies: [messages],
    threshold: 50,
  })

  const addMessage = () => {
    setMessages((prev) => [...prev, `Message ${prev.length + 1} - ${new Date().toLocaleTimeString()}`])
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <Button onClick={addMessage}>Add Message</Button>
        {!isNearBottom && (
          <Button onClick={scrollToBottom} variant="outline">
            Scroll to Bottom
          </Button>
        )}
        <Button onClick={() => setEnabled(!isNearBottom)} variant="outline">
          Toggle Auto-Scroll
        </Button>
      </div>

      <div className="p-2 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="text-sm">
          <strong>Is Near Bottom:</strong> {isNearBottom ? 'Yes' : 'No'}
        </div>
      </div>

      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

export const BasicUsage: Story = {
  render: () => <BasicAutoScrollDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Basic auto-scroll functionality that scrolls to bottom when new messages are added.',
      },
    },
  },
}

function ThresholdDemo() {
  const [messages, setMessages] = useState<string[]>(['Message 1'])
  const [threshold, setThreshold] = useState(100)
  
  const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
    dependencies: [messages],
    threshold,
  })

  const addMessage = () => {
    setMessages((prev) => [...prev, `Message ${prev.length + 1}`])
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Threshold: {threshold}px
        </label>
        <input
          type="range"
          min="0"
          max="300"
          step="10"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          Distance from bottom (px) to trigger auto-scroll
        </p>
      </div>

      <div className="flex gap-2">
        <Button onClick={addMessage}>Add Message</Button>
        {!isNearBottom && (
          <Button onClick={scrollToBottom} variant="outline">
            Scroll to Bottom
          </Button>
        )}
      </div>

      <div className="p-2 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="text-sm">
          <strong>Is Near Bottom:</strong> {isNearBottom ? 'Yes' : 'No'} (threshold: {threshold}px)
        </div>
      </div>

      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

export const CustomThreshold: Story = {
  render: () => <ThresholdDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Customizing the threshold distance from bottom that triggers auto-scroll.',
      },
    },
  },
}

function ManualControlDemo() {
  const [messages, setMessages] = useState<string[]>(['Message 1'])
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
  
  const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
    enabled: autoScrollEnabled,
    dependencies: [messages],
  })

  const addMessage = () => {
    setMessages((prev) => [...prev, `Message ${prev.length + 1}`])
  }

  const toggleAutoScroll = () => {
    const newValue = !autoScrollEnabled
    setAutoScrollEnabled(newValue)
    setEnabled(newValue)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex gap-2">
        <Button onClick={addMessage}>Add Message</Button>
        <Button onClick={scrollToBottom} variant="outline">
          Manual Scroll to Bottom
        </Button>
        <Button onClick={toggleAutoScroll} variant={autoScrollEnabled ? 'default' : 'outline'}>
          {autoScrollEnabled ? 'Disable' : 'Enable'} Auto-Scroll
        </Button>
      </div>

      <div className="p-2 bg-gray-50 dark:bg-gray-900 border rounded-lg">
        <div className="text-sm space-y-1">
          <div>
            <strong>Auto-Scroll Enabled:</strong> {autoScrollEnabled ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Is Near Bottom:</strong> {isNearBottom ? 'Yes' : 'No'}
          </div>
        </div>
      </div>

      <div
        ref={scrollRef as React.RefObject<HTMLDivElement>}
        className="h-64 overflow-y-auto border rounded-lg p-4 bg-gray-50 dark:bg-gray-900"
      >
        {messages.map((msg, index) => (
          <div key={index} className="mb-2 p-2 bg-white dark:bg-gray-800 rounded">
            {msg}
          </div>
        ))}
      </div>
    </div>
  )
}

export const ManualControl: Story = {
  render: () => <ManualControlDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Manually controlling auto-scroll enable/disable and scrolling to bottom.',
      },
    },
  },
}
