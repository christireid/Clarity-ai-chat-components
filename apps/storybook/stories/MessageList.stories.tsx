import type { Meta, StoryObj } from '@storybook/react'
import { MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const meta: Meta<typeof MessageList> = {
  title: 'Components/MessageList',
  component: MessageList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Message list component with auto-scroll and scroll-to-bottom button.',
      },
    },
  },
  tags: ['autodocs'],
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
    onMessageCopy: (id, content) => console.log('Copy:', id, content),
    onMessageFeedback: (id, type) => console.log('Feedback:', id, type),
    onMessageRetry: (id) => console.log('Retry:', id),
  },
}

export const EmptyList: Story = {
  args: {
    messages: [],
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
