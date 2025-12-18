import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChatWindow, useClarityChat } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow/Essentials',
  component: ChatWindow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The ChatWindow component is a complete, production-ready chat interface that combines
message display, input, and interactions into a single component. This track shows
the essential patterns you'll use in 90% of cases.

## When to Use ChatWindow

- ✅ Quick development and prototyping
- ✅ Standard chat interfaces
- ✅ Production applications needing a complete solution
- ✅ When you need all features out of the box

## When NOT to Use ChatWindow

- ❌ Highly custom layouts (use MessageList + ChatInput instead)
- ❌ When you need to replace most internal components
- ❌ When you need fine-grained control over each part

## Key Features

- **Complete Interface** - Message display, input, and interactions
- **Auto-scroll** - Automatically scrolls to latest message
- **Keyboard Shortcuts** - Enter to send, Shift+Enter for new line
- **Loading States** - Built-in loading indicators
- **Empty States** - Handles empty chat gracefully
- **Accessibility** - WCAG AAA compliant
        `,
      },
    },
  },
  argTypes: {
    messages: {
      description: 'Array of messages to display',
      control: { type: 'object' },
    },
    isLoading: {
      description: 'Whether a message is currently being processed',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    onSendMessage: {
      description: 'Callback function called when a message is sent',
      action: 'message-sent',
    },
    showTokenCounter: {
      description: 'Show token usage counter',
      control: { type: 'boolean' },
      defaultValue: false,
    },
    showAvatar: {
      description: 'Show avatars for messages',
      control: { type: 'boolean' },
      defaultValue: true,
    },
    enableMarkdown: {
      description: 'Enable markdown rendering in messages',
      control: { type: 'boolean' },
      defaultValue: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '600px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

const createMessage = (
  role: 'user' | 'assistant',
  content: string,
  overrides?: Partial<Message>
): Message => ({
  id: `msg-${Date.now()}-${Math.random()}`,
  role,
  content,
  createdAt: Date.now(),
  status: 'sent',
  ...overrides,
})

const mockMessages: Message[] = [
  createMessage('user', 'Hello! Can you help me with React?', {
    createdAt: Date.now() - 60000,
  }),
  createMessage('assistant', 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?', {
    createdAt: Date.now() - 30000,
  }),
  createMessage('user', 'How do I use hooks?', {
    createdAt: Date.now() - 10000,
  }),
]

export const BasicChat: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    onSendMessage: async (content: string) => {
      SecureLogger.debug('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
The most basic chat setup. This is the foundation for all other patterns.

**Key Points:**
- Pass messages array
- Handle onSendMessage callback
- Set isLoading for loading states

This pattern works for 90% of use cases.
        `,
      },
    },
  },
}

export const WithLoadingState: Story = {
  args: {
    messages: mockMessages,
    isLoading: true,
    onSendMessage: async (content: string) => {
      SecureLogger.debug('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Show loading state while waiting for AI response. The ChatWindow automatically
displays a loading indicator when \`isLoading\` is true.

**Usage:**
1. Set \`isLoading={true}\` when sending message
2. Set \`isLoading={false}\` when response arrives
3. ChatWindow handles the visual feedback
        `,
      },
    },
  },
}

export const EmptyChat: Story = {
  args: {
    messages: [],
    isLoading: false,
    onSendMessage: async (content: string) => {
      SecureLogger.debug('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Empty chat state. ChatWindow automatically handles empty states with a helpful
message and maintains full functionality.

**When to Use:**
- Initial state of new conversations
- After clearing chat history
- When starting fresh
        `,
      },
    },
  },
}

export const WithTokenCounter: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    showTokenCounter: true,
    onSendMessage: async (content: string) => {
      SecureLogger.debug('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Enable token counter to track API usage and costs. This is essential for
production applications where cost tracking matters.

**Benefits:**
- Real-time token tracking
- Cost estimation
- Usage monitoring
- Budget management
        `,
      },
    },
  },
}

const InteractiveChat = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage = createMessage('user', content)
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage = createMessage(
        'assistant',
        `You said: "${content}". This is a demo response. In a real app, this would come from your AI API.`
      )
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <ChatWindow
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
    />
  )
}

export const Interactive: Story = {
  render: () => <InteractiveChat />,
  parameters: {
    docs: {
      description: {
        story: `
Fully interactive chat example. Try sending a message to see the complete
flow: user message → loading state → AI response.

**This demonstrates:**
- Real-time message updates
- Loading state management
- Message state handling
- Complete chat flow

**Try it:** Type a message and press Enter or click Send.
        `,
      },
    },
  },
}

export const LongConversation: Story = {
  args: {
    messages: [
      ...mockMessages,
      createMessage('assistant', `Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are the main hooks:

1. **useState** - Manages component state
2. **useEffect** - Handles side effects
3. **useContext** - Accesses context values
4. **useReducer** - Complex state management
5. **useMemo** - Memoizes expensive calculations
6. **useCallback** - Memoizes callback functions`, {
        createdAt: Date.now() - 5000,
      }),
      createMessage('user', 'Can you show me an example of useState?', {
        createdAt: Date.now() - 2000,
      }),
      createMessage('assistant', `Here's a simple useState example:

\`\`\`tsx
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)
  
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

The \`useState\` hook returns an array with the current state value and a function to update it.`, {
        createdAt: Date.now() - 1000,
      }),
    ],
    isLoading: false,
    onSendMessage: async (content: string) => {
      SecureLogger.debug('Message sent:', content)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
ChatWindow handles long conversations gracefully with:
- Virtualized message list (performance)
- Auto-scroll to latest message
- Smooth scrolling
- Efficient rendering

**Performance:** ChatWindow uses virtualization for 100+ messages.
        `,
      },
    },
  },
}
