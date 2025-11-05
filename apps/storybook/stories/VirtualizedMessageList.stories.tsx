import type { Meta, StoryObj } from '@storybook/react'
import { VirtualizedMessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const meta: Meta<typeof VirtualizedMessageList> = {
  title: 'Components/VirtualizedMessageList',
  component: VirtualizedMessageList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'High-performance message list using virtual scrolling for large datasets. Only renders visible messages to maintain performance with 1000+ messages.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof VirtualizedMessageList>

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'Hello!',
    timestamp: Date.now() - 600000,
    createdAt: Date.now() - 600000,
    updatedAt: Date.now() - 600000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'Hi there! How can I help you?',
    timestamp: Date.now() - 590000,
    createdAt: Date.now() - 590000,
    updatedAt: Date.now() - 590000,
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const LargeDataset: Story = {
  args: {
    messages: Array.from({ length: 500 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}: This is a test message with some content.`,
      timestamp: Date.now() - (500 - i) * 60000,
      createdAt: Date.now() - (500 - i) * 60000,
      updatedAt: Date.now() - (500 - i) * 60000,
    })),
    enableVirtualization: true,
    estimatedMessageHeight: 100,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '800px', height: '600px' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithCallbacks: Story = {
  args: {
    messages: mockMessages,
    onMessageCopy: (messageId, content) => {
      console.log('Copying message:', messageId)
      navigator.clipboard.writeText(content)
      alert('Message copied!')
    },
    onMessageFeedback: (messageId, type) => {
      console.log('Feedback:', messageId, type)
      alert(`Feedback ${type} for message ${messageId}`)
    },
    onMessageRetry: (messageId) => {
      console.log('Retrying message:', messageId)
      alert(`Retrying message ${messageId}`)
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Loading: Story = {
  args: {
    messages: [],
    isLoading: true,
    loadingCount: 5,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const Empty: Story = {
  args: {
    messages: [],
    emptyState: (
      <div className="text-center p-8 text-muted-foreground">
        No messages yet. Start a conversation!
      </div>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}

export const WithoutVirtualization: Story = {
  args: {
    messages: Array.from({ length: 50 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i + 1}`,
      timestamp: Date.now() - (50 - i) * 60000,
      createdAt: Date.now() - (50 - i) * 60000,
      updatedAt: Date.now() - (50 - i) * 60000,
    })),
    enableVirtualization: false,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px' }}>
        <Story />
      </div>
    ),
  ],
}
