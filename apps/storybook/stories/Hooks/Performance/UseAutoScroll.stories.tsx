import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { useAutoScroll } from '../../../packages/react/src/hooks/use-auto-scroll'
import { Button } from '@clarity-chat/primitives'

const meta = {
  title: 'Hooks/Performance/UseAutoScroll',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# useAutoScroll

Automatically scroll to the bottom of a container when new content is added, with intelligent user scroll detection.

## Features

- **Smart Scrolling**: Only scrolls if user is near bottom
- **User Control**: Respects manual scrolling
- **Smooth Animation**: Configurable scroll behavior
- **Threshold Detection**: Customizable "near bottom" threshold
- **Manual Control**: Force scroll or toggle enabled state
- **Performance**: Efficient with debounced checks

## Use Cases

- **Chat Messages**: Auto-scroll as messages arrive
- **Live Feeds**: Keep up with real-time updates
- **Logs**: Automatically show latest log entries
- **Notifications**: Show newest notifications
- **Comments**: Scroll to latest comments

## Basic Usage

\`\`\`tsx
const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
  dependencies: [messages],
  threshold: 100,
  behavior: 'smooth',
})

return (
  <div ref={scrollRef} className="h-96 overflow-y-auto">
    {messages.map(msg => <div key={msg.id}>{msg.content}</div>)}
    {!isNearBottom && (
      <button onClick={scrollToBottom}>↓ Scroll to Bottom</button>
    )}
  </div>
)
\`\`\`

## API Reference

### Options

- \`enabled\`: Enable/disable auto-scroll (default: true)
- \`behavior\`: Scroll behavior - 'smooth' or 'auto' (default: 'smooth')
- \`threshold\`: Distance from bottom in px to trigger (default: 100)
- \`dependencies\`: React deps that trigger scroll check

### Returns

- \`scrollRef\`: Ref to attach to scrollable container
- \`isNearBottom\`: Whether user is near bottom
- \`scrollToBottom()\`: Manually scroll to bottom
- \`setEnabled(boolean)\`: Toggle auto-scroll on/off
`,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

// ============================================================================
// Basic Chat Example
// ============================================================================

export const ChatExample: Story = {
  render: () => {
    const [messages, setMessages] = React.useState([
      { id: 1, content: 'Hello!', sender: 'user' },
      { id: 2, content: 'Hi there! How can I help?', sender: 'bot' },
    ])

    const { scrollRef, isNearBottom, scrollToBottom } = useAutoScroll({
      dependencies: [messages],
      threshold: 50,
    })

    const addMessage = () => {
      const newMessage = {
        id: messages.length + 1,
        content: `Message ${messages.length + 1}`,
        sender: messages.length % 2 === 0 ? 'user' : 'bot',
      }
      setMessages([...messages, newMessage])
    }

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={addMessage}>Add Message</Button>
          <Button onClick={() => setMessages([])} variant="outline">
            Clear All
          </Button>
        </div>

        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-96 overflow-y-auto border rounded-lg p-4 space-y-2 bg-muted/20"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-card'
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>

        {!isNearBottom && (
          <Button onClick={scrollToBottom} className="w-full">
            ↓ New Messages - Scroll to Bottom
          </Button>
        )}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Chat interface with auto-scroll that respects user scrolling.',
      },
    },
  },
}

// ============================================================================
// Live Feed Example
// ============================================================================

export const LiveFeedExample: Story = {
  render: () => {
    const [items, setItems] = React.useState<Array<{ id: number; text: string; time: string }>>([])
    const [isLive, setIsLive] = React.useState(false)

    const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
      dependencies: [items],
      behavior: 'smooth',
    })

    React.useEffect(() => {
      if (!isLive) return

      const interval = setInterval(() => {
        const newItem = {
          id: Date.now(),
          text: `Event ${items.length + 1}: ${['Info', 'Warning', 'Error', 'Success'][Math.floor(Math.random() * 4)]}`,
          time: new Date().toLocaleTimeString(),
        }
        setItems((prev) => [...prev, newItem])
      }, 2000)

      return () => clearInterval(interval)
    }, [isLive, items.length])

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Event Feed</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? 'destructive' : 'default'}
              size="sm"
            >
              {isLive ? 'Stop' : 'Start'} Feed
            </Button>
            <Button
              onClick={() => setItems([])}
              variant="outline"
              size="sm"
            >
              Clear
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-80 overflow-y-auto border rounded-lg p-4 bg-muted/20 font-mono text-sm"
        >
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Click "Start Feed" to begin
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-1">
                <span className="text-muted-foreground">[{item.time}]</span>{' '}
                <span>{item.text}</span>
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className={`flex items-center gap-2 ${isNearBottom ? 'text-green-600' : 'text-yellow-600'}`}>
            <div className={`w-2 h-2 rounded-full ${isNearBottom ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span>{isNearBottom ? 'Auto-scrolling' : 'Paused (scroll manually)'}</span>
          </div>
          {!isNearBottom && (
            <Button onClick={scrollToBottom} size="sm" variant="outline">
              ↓ Jump to Latest
            </Button>
          )}
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Live feed that auto-scrolls but pauses when user scrolls up.',
      },
    },
  },
}

// ============================================================================
// Manual Control
// ============================================================================

export const ManualControlExample: Story = {
  render: () => {
    const [items, setItems] = React.useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`))
    const [autoScrollEnabled, setAutoScrollEnabled] = React.useState(true)

    const { scrollRef, isNearBottom, scrollToBottom, setEnabled } = useAutoScroll({
      dependencies: [items],
      enabled: autoScrollEnabled,
    })

    React.useEffect(() => {
      setEnabled(autoScrollEnabled)
    }, [autoScrollEnabled, setEnabled])

    const addItems = (count: number) => {
      const newItems = Array.from({ length: count }, (_, i) => `Item ${items.length + i + 1}`)
      setItems([...items, ...newItems])
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoScrollEnabled}
              onChange={(e) => setAutoScrollEnabled(e.target.checked)}
            />
            <span className="text-sm">Auto-scroll enabled</span>
          </label>
          <div className="flex-1" />
          <Button onClick={() => addItems(5)} size="sm">
            Add 5 Items
          </Button>
          <Button onClick={() => addItems(1)} size="sm" variant="outline">
            Add 1 Item
          </Button>
        </div>

        <div
          ref={scrollRef as React.RefObject<HTMLDivElement>}
          className="h-64 overflow-y-auto border rounded-lg p-4"
        >
          {items.map((item, index) => (
            <div key={index} className="py-2 border-b last:border-0">
              {item}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-muted-foreground">
            {isNearBottom ? '✓ At bottom' : '⚠ Scrolled up'}
          </div>
          <Button onClick={scrollToBottom} variant="outline" size="sm" disabled={isNearBottom}>
            Scroll to Bottom
          </Button>
        </div>
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates manual control over auto-scroll behavior.',
      },
    },
  },
}
