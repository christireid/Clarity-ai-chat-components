import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualizedMessageList as MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { expect, within } from 'storybook/test'

/**
 * **MessageList Component**
 * 
 * Message list component with auto-scroll, scroll-to-bottom button,
 * and comprehensive message management features.
 * 
 * **Key Features:**
 * - Auto-scroll to latest message
 * - Scroll-to-bottom button
 * - Message rendering with animations
 * - Copy, feedback, and retry actions
 * - Empty state handling
 * - Virtual scrolling support
 * 
 * **Use Cases:**
 * - Chat interfaces
 * - Messaging applications
 * - AI assistants
 * - Conversation views
 */
const meta: Meta<typeof MessageList> = {
  title: 'Components/DataDisplay/MessageList',
  component: MessageList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Message list component with auto-scroll, scroll-to-bottom button,
and comprehensive message management features.

## Features

- ✅ Auto-scroll to latest message
- ✅ Scroll-to-bottom button
- ✅ Message rendering with animations
- ✅ Copy, feedback, and retry actions
- ✅ Empty state handling
- ✅ Virtual scrolling support
- ✅ Accessible with proper ARIA attributes

## Basic Usage

\`\`\`tsx
<MessageList
  messages={messages}
  onMessageCopy={(id, content) => SecureLogger.debug('Copied:', content)}
  onMessageFeedback={(id, type) => SecureLogger.debug('Feedback:', type)}
  onMessageRetry={(id) => SecureLogger.debug('Retry:', id)}
/>
\`\`\`
        `,
      },
    },
    status: {
      type: 'stable',
    },
    badges: ['stable', 'tested', 'accessible'],
  },
  tags: ['autodocs', 'stable'],
  argTypes: {
    messages: {
      description: 'Array of messages to display',
      control: { type: 'object' },
    },
    onMessageCopy: {
      description: 'Callback when a message is copied',
      action: 'message-copied',
    },
    onMessageFeedback: {
      description: 'Callback when feedback is given (up/down)',
      action: 'message-feedback',
    },
    onMessageRetry: {
      description: 'Callback when retry is requested',
      action: 'message-retry',
    },
    autoScroll: {
      description: 'Automatically scroll to bottom on new messages',
      control: 'boolean',
    },
    showScrollButton: {
      description: 'Show scroll-to-bottom button',
      control: 'boolean',
    },
    emptyState: {
      description: 'Custom empty state component',
      control: { type: 'object' },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '400px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MessageList>

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me?',
    timestamp: Date.now() - 300000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! I\'d be happy to help. What do you need assistance with?',
    timestamp: Date.now() - 280000,
  },
  {
    id: '3',
    role: 'user',
    content: 'I need help with React hooks',
    timestamp: Date.now() - 260000,
  },
  {
    id: '4',
    role: 'assistant',
    content: `Great! React hooks are a powerful feature. Here are the most common ones:

\`\`\`javascript
// useState for state management
const [count, setCount] = useState(0)

// useEffect for side effects
useEffect(() => {
  document.title = \`Count: \${count}\`
}, [count])
\`\`\`

Would you like to know more about a specific hook?`,
    timestamp: Date.now() - 240000,
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
    onMessageCopy: (id, content) => SecureLogger.debug('Copy:', id, content),
    onMessageFeedback: (id, type) => SecureLogger.debug('Feedback:', id, type),
    onMessageRetry: (id) => SecureLogger.debug('Retry:', id),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test messages render
    await expect(canvas.getByText('Hello! Can you help me?')).toBeInTheDocument()
    await expect(canvas.getByText(/Of course! I'd be happy to help/)).toBeInTheDocument()

    // Test user and assistant messages display
    await expect(canvas.getByText('I need help with React hooks')).toBeInTheDocument()
    await expect(canvas.getByText(/useState for state management/)).toBeInTheDocument()
  },
}

export const EmptyList: Story = {
  args: {
    messages: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // Test empty state renders
    await expect(canvas.getByText(/no messages|empty|start/i)).toBeInTheDocument()
  },
}

export const SingleMessage: Story = {
  args: {
    messages: [mockMessages[0]],
  },
}

export const LongConversation: Story = {
  args: {
    messages: [
      ...mockMessages,
      {
        id: '5',
        role: 'user',
        content: 'Yes, tell me about useEffect',
        timestamp: Date.now() - 220000,
      },
      {
        id: '6',
        role: 'assistant',
        content: `useEffect is used for side effects in React components. Here's a detailed explanation:

1. **Basic syntax:**
\`\`\`javascript
useEffect(() => {
  // Effect code
  return () => {
    // Cleanup (optional)
  }
}, [dependencies])
\`\`\`

2. **Common use cases:**
- Fetching data
- Setting up subscriptions
- Updating the DOM
- Setting up timers

3. **Dependency array:**
- Empty [] = runs once on mount
- [value] = runs when value changes
- No array = runs after every render`,
        timestamp: Date.now() - 200000,
      },
      {
        id: '7',
        role: 'user',
        content: 'What about useContext?',
        timestamp: Date.now() - 180000,
      },
      {
        id: '8',
        role: 'assistant',
        content: 'useContext allows you to consume React context without wrapping components.',
        timestamp: Date.now() - 160000,
      },
    ],
  },
}

export const WithCodeBlocks: Story = {
  args: {
    messages: [
      {
        id: '1',
        role: 'user',
        content: 'Show me a React component example',
        timestamp: Date.now() - 60000,
      },
      {
        id: '2',
        role: 'assistant',
        content: `Here's a complete React component:

\`\`\`tsx
import React, { useState } from 'react'

interface CounterProps {
  initialCount?: number
}

export const Counter: React.FC<CounterProps> = ({ 
  initialCount = 0 
}) => {
  const [count, setCount] = useState(initialCount)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
\`\`\`

This component demonstrates:
- TypeScript interfaces
- Props with default values
- useState hook
- Event handlers`,
        timestamp: Date.now() - 30000,
      },
    ],
  },
}
