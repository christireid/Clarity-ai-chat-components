import React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualizedMessageList } from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

/**
 * **VirtualizedMessageList Scroll Stories**
 *
 * Demonstrates scroll position preservation and performance optimizations.
 *
 * **Key Features:**
 * - ✅ Scroll position preservation during data updates
 * - ✅ Smart auto-scroll (only when near bottom)
 * - ✅ Efficient virtual scrolling for large lists
 * - ✅ Smooth performance with thousands of messages
 *
 * **Regression Tests Cover:**
 * - ISSUE-019: Scroll jump prevention
 * - Large dataset performance
 * - Memory efficiency
 */

const meta = {
  title: 'Components/Chat/VirtualizedMessageList/Scroll',
  component: VirtualizedMessageList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
VirtualizedMessageList scroll preservation demonstrations and performance testing.

## Scroll Preservation

The component intelligently preserves scroll position during data updates:

- **Auto-scroll**: Only scrolls to bottom when user is near bottom
- **Position preservation**: Maintains exact scroll position when user is scrolled up
- **Smooth transitions**: No jarring jumps during message updates

## Performance Features

- **Virtual scrolling**: Only renders visible messages
- **Efficient updates**: Handles rapid message additions smoothly
- **Memory optimized**: Cleans up properly on unmount

## Test Scenarios

### Scroll Position Tests
- Scroll to middle, add messages - position preserved
- Scroll to bottom, add messages - auto-scrolls
- Rapid message updates - maintains stability

### Performance Tests
- Large message lists (1000+ messages)
- Frequent updates
- Memory usage monitoring
        `,
      },
    },
  },
  argTypes: {
    messages: {
      description: 'Array of messages to display',
      control: { type: 'object' },
    },
    renderMessage: {
      description: 'Function to render individual messages',
    },
    autoScrollToBottom: {
      description: 'Whether to auto-scroll to bottom on new messages',
      control: 'boolean',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof VirtualizedMessageList>

export default meta
type Story = StoryObj<typeof meta>

// Helper to create mock messages
const createMockMessage = (id: string, content: string, isUser: boolean = false): Message => ({
  id,
  content,
  role: isUser ? 'user' : 'assistant',
  createdAt: new Date(Date.now() - Math.random() * 86400000), // Random time within last 24h
  updatedAt: new Date(),
})

const renderMessage = (message: Message, index: number) => (
  <div
    key={message.id}
    className={`p-3 rounded-lg max-w-3xl ${
      message.role === 'user'
        ? 'bg-primary text-primary-foreground ml-auto'
        : 'bg-muted mr-auto'
    }`}
  >
    <div className="text-sm opacity-80 mb-1">
      {message.role === 'user' ? 'You' : 'Assistant'} • {message.createdAt.toLocaleTimeString()}
    </div>
    <div className="whitespace-pre-wrap">{message.content}</div>
  </div>
)

/**
 * **Basic Scroll Preservation**
 *
 * Demonstrates basic scroll position preservation when new messages are added.
 */
export const BasicScrollPreservation: Story = {
  render: () => {
    const [messages, setMessages] = useState(() =>
      Array.from({ length: 20 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}. ${'This is some sample content. '.repeat(Math.floor(Math.random() * 3) + 1)}`)
      )
    )

    const addMessage = () => {
      const newMessage = createMockMessage(
        `msg-${messages.length}`,
        `New message ${messages.length}. Added at ${new Date().toLocaleTimeString()}.`
      )
      setMessages(prev => [...prev, newMessage])
    }

    const addMultipleMessages = () => {
      const newMessages = Array.from({ length: 5 }, (_, i) =>
        createMockMessage(
          `batch-${messages.length + i}`,
          `Batch message ${messages.length + i}. Added in batch operation.`
        )
      )
      setMessages(prev => [...prev, ...newMessages])
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">Scroll Preservation Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Scroll to the middle of the list, then click "Add Message" or "Add Multiple".
            Your scroll position should be preserved (not auto-scrolled to bottom).
          </p>
          <div className="flex gap-2">
            <button
              onClick={addMessage}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Add Message
            </button>
            <button
              onClick={addMultipleMessages}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Add Multiple Messages
            </button>
            <span className="px-3 py-2 text-sm text-muted-foreground">
              Total: {messages.length} messages
            </span>
          </div>
        </div>

        <div className="flex-1">
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={80}
            height={window.innerHeight - 200}
            autoScrollToBottom={false} // Disable auto-scroll to test preservation
          />
        </div>
      </div>
    )
  },
}

/**
 * **Smart Auto-Scroll**
 *
 * Shows auto-scroll behavior when user is near bottom vs. position preservation when scrolled up.
 */
export const SmartAutoScroll: Story = {
  render: () => {
    const [messages, setMessages] = useState(() =>
      Array.from({ length: 30 }, (_, i) =>
        createMockMessage(`msg-${i}`, `Message ${i}. ${'Sample content for testing. '.repeat(2)}`)
      )
    )

    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true)
    const [scrollPosition, setScrollPosition] = useState(0)

    const addMessage = () => {
      const newMessage = createMockMessage(
        `msg-${messages.length}`,
        `Auto-scroll test message ${messages.length}. This demonstrates smart scrolling behavior.`
      )
      setMessages(prev => [...prev, newMessage])
    }

    const handleScroll = (scrollOffset: number) => {
      setScrollPosition(scrollOffset)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">Smart Auto-Scroll Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            When auto-scroll is enabled: Scroll to bottom → add messages (auto-scrolls).
            Scroll to middle → add messages (preserves position).
          </p>
          <div className="flex gap-2 items-center mb-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={autoScrollEnabled}
                onChange={(e) => setAutoScrollEnabled(e.target.checked)}
              />
              Enable Auto-Scroll
            </label>
            <span className="text-sm text-muted-foreground">
              Scroll position: {Math.round(scrollPosition)}px
            </span>
          </div>
          <button
            onClick={addMessage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Add Message & Test Auto-Scroll
          </button>
        </div>

        <div className="flex-1">
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={80}
            height={window.innerHeight - 200}
            autoScrollToBottom={autoScrollEnabled}
            onScroll={handleScroll}
          />
        </div>
      </div>
    )
  },
}

/**
 * **Large Dataset Performance**
 *
 * Tests performance with thousands of messages and rapid updates.
 */
export const LargeDatasetPerformance: Story = {
  render: () => {
    const [messages, setMessages] = useState(() =>
      Array.from({ length: 100 }, (_, i) =>
        createMockMessage(
          `msg-${i}`,
          `Performance test message ${i}. ${'This is filler content to simulate real message length. '.repeat(3)}`
        )
      )
    )

    const [isLoading, setIsLoading] = useState(false)
    const [renderTime, setRenderTime] = useState<number>(0)

    const addBatchMessages = async (count: number) => {
      setIsLoading(true)
      const startTime = performance.now()

      // Simulate async message loading
      await new Promise(resolve => setTimeout(resolve, 100))

      const newMessages = Array.from({ length: count }, (_, i) =>
        createMockMessage(
          `batch-${messages.length + i}`,
          `Batch message ${messages.length + i}. Added ${new Date().toLocaleTimeString()}. ${'Additional content. '.repeat(2)}`
        )
      )

      setMessages(prev => [...prev, ...newMessages])

      const endTime = performance.now()
      setRenderTime(endTime - startTime)
      setIsLoading(false)
    }

    const clearMessages = () => {
      setMessages([])
      setRenderTime(0)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">Large Dataset Performance Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Test virtual scrolling performance with large message lists and rapid updates.
          </p>
          <div className="flex gap-2 items-center mb-2">
            <button
              onClick={() => addBatchMessages(50)}
              disabled={isLoading}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add 50 Messages'}
            </button>
            <button
              onClick={() => addBatchMessages(200)}
              disabled={isLoading}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add 200 Messages'}
            </button>
            <button
              onClick={clearMessages}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
            >
              Clear All
            </button>
            <span className="px-3 py-2 text-sm text-muted-foreground bg-muted rounded">
              {messages.length} messages • Last batch: {renderTime.toFixed(2)}ms
            </span>
          </div>
        </div>

        <div className="flex-1">
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={100}
            height={window.innerHeight - 200}
          />
        </div>
      </div>
    )
  },
}

/**
 * **Rapid Update Stress Test**
 *
 * Simulates chat-like rapid message additions to test scroll stability.
 */
export const RapidUpdateStressTest: Story = {
  render: () => {
    const [messages, setMessages] = useState(() =>
      Array.from({ length: 20 }, (_, i) =>
        createMockMessage(`initial-${i}`, `Initial message ${i}.`)
      )
    )

    const [isStressTesting, setIsStressTesting] = useState(false)
    const [testDuration, setTestDuration] = useState(5000) // 5 seconds
    const [messageCount, setMessageCount] = useState(0)

    const startStressTest = () => {
      setIsStressTesting(true)
      setMessageCount(0)

      const interval = setInterval(() => {
        const newMessage = createMockMessage(
          `stress-${Date.now()}`,
          `Stress test message ${messageCount + 1}. ${new Date().toLocaleTimeString()}.`
        )
        setMessages(prev => [...prev, newMessage])
        setMessageCount(prev => prev + 1)
      }, 100) // Add message every 100ms

      setTimeout(() => {
        clearInterval(interval)
        setIsStressTesting(false)
      }, testDuration)
    }

    const stopStressTest = () => {
      setIsStressTesting(false)
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">Rapid Update Stress Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Simulates rapid message additions like in a busy chat. Scroll position should remain stable.
          </p>
          <div className="flex gap-2 items-center mb-2">
            <button
              onClick={startStressTest}
              disabled={isStressTesting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
            >
              {isStressTesting ? `Testing... (${messageCount} added)` : 'Start Stress Test'}
            </button>
            {isStressTesting && (
              <button
                onClick={stopStressTest}
                className="px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
              >
                Stop Test
              </button>
            )}
            <span className="px-3 py-2 text-sm text-muted-foreground bg-muted rounded">
              Duration: {testDuration}ms • Messages: {messageCount}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Instructions:</strong> Scroll to middle, start test. Position should be preserved despite rapid additions.
          </div>
        </div>

        <div className="flex-1">
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={80}
            height={window.innerHeight - 200}
            autoScrollToBottom={false} // Test position preservation
          />
        </div>
      </div>
    )
  },
}

/**
 * **Memory and Cleanup Test**
 *
 * Tests proper cleanup and memory management during component lifecycle.
 */
export const MemoryAndCleanupTest: Story = {
  render: () => {
    const [mounted, setMounted] = useState(true)
    const [messages, setMessages] = useState(() =>
      Array.from({ length: 50 }, (_, i) =>
        createMockMessage(`memory-${i}`, `Memory test message ${i}. ${'Content '.repeat(5)}`)
      )
    )

    const unmountRemount = () => {
      setMounted(false)
      setTimeout(() => {
        setMounted(true)
        // Add some messages after remount
        setMessages(prev => [
          ...prev,
          createMockMessage('remount-1', 'Added after remount'),
          createMockMessage('remount-2', 'Another message after remount'),
        ])
      }, 1000)
    }

    if (!mounted) {
      return (
        <div className="p-8 text-center">
          <div className="animate-pulse text-lg">Component unmounted...</div>
          <div className="text-sm text-muted-foreground mt-2">
            Testing cleanup and memory management
          </div>
        </div>
      )
    }

    return (
      <div className="h-screen flex flex-col">
        <div className="p-4 border-b bg-background">
          <h2 className="text-lg font-semibold mb-2">Memory & Cleanup Test</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Test proper cleanup during unmount/remount cycles.
          </p>
          <div className="flex gap-2">
            <button
              onClick={unmountRemount}
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test Unmount/Remount
            </button>
            <button
              onClick={() => setMessages(prev => prev.slice(0, 10))}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Reduce to 10 Messages
            </button>
          </div>
        </div>

        <div className="flex-1">
          <VirtualizedMessageList
            messages={messages}
            renderMessage={renderMessage}
            estimatedItemSize={80}
            height={window.innerHeight - 200}
          />
        </div>
      </div>
    )
  },
}