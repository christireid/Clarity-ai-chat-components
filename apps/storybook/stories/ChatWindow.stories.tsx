import type { Meta, StoryObj } from '@storybook/react'
import { ChatWindow } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow',
  component: ChatWindow,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Complete chat window component orchestrating MessageList and ChatInput.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello! Can you help me with React?',
    timestamp: Date.now() - 60000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?',
    timestamp: Date.now() - 30000,
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I use hooks?',
    timestamp: Date.now() - 10000,
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const Loading: Story = {
  args: {
    messages: mockMessages,
    isLoading: true,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const EmptyChat: Story = {
  args: {
    messages: [],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

export const LongConversation: Story = {
  args: {
    messages: [
      ...mockMessages,
      {
        id: '4',
        role: 'assistant',
        content: `Hooks are functions that let you "hook into" React state and lifecycle features from function components. Here are the main hooks:

1. **useState** - Manages component state
2. **useEffect** - Handles side effects
3. **useContext** - Accesses context values
4. **useReducer** - Complex state management
5. **useMemo** - Memoizes expensive calculations
6. **useCallback** - Memoizes callback functions`,
        timestamp: Date.now() - 5000,
      },
      {
        id: '5',
        role: 'user',
        content: 'Can you show me an example of useState?',
        timestamp: Date.now() - 2000,
      },
    ],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
  },
}

const InteractiveTemplate = () => {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    }
    
    setMessages([...messages, newMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `You said: "${content}". This is a demo response from the AI assistant.`,
        timestamp: Date.now(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
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
  render: () => <InteractiveTemplate />,
}
