import type { Meta, StoryObj } from '@storybook/react'
import { MessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'
import { useState } from 'react'

const meta: Meta<typeof MessageSearch> = {
  title: 'Components/MessageSearch',
  component: MessageSearch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Message search component with React Concurrent Features. Uses useDeferredValue to keep the search input responsive even when filtering large message lists.',
      },
    },
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof MessageSearch>

const mockMessages: Message[] = [
  {
    id: '1',
    role: 'user',
    content: 'What is React?',
    timestamp: Date.now() - 3600000,
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    role: 'assistant',
    content: 'React is a JavaScript library for building user interfaces.',
    timestamp: Date.now() - 3300000,
    createdAt: Date.now() - 3300000,
    updatedAt: Date.now() - 3300000,
  },
  {
    id: '3',
    role: 'user',
    content: 'How do I use hooks?',
    timestamp: Date.now() - 3000000,
    createdAt: Date.now() - 3000000,
    updatedAt: Date.now() - 3000000,
  },
  {
    id: '4',
    role: 'assistant',
    content: 'Hooks are functions that let you hook into React state and lifecycle features.',
    timestamp: Date.now() - 2700000,
    createdAt: Date.now() - 2700000,
    updatedAt: Date.now() - 2700000,
  },
  {
    id: '5',
    role: 'user',
    content: 'Show me an example of useState',
    timestamp: Date.now() - 2400000,
    createdAt: Date.now() - 2400000,
    updatedAt: Date.now() - 2400000,
  },
  {
    id: '6',
    role: 'assistant',
    content: 'Here is an example: const [count, setCount] = useState(0)',
    timestamp: Date.now() - 2100000,
    createdAt: Date.now() - 2100000,
    updatedAt: Date.now() - 2100000,
  },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
    placeholder: 'Search messages...',
  },
}

export const WithResultsCallback: Story = {
  render: () => {
    const [filteredMessages, setFilteredMessages] = useState<Message[]>(mockMessages)

    return (
      <div className="space-y-4">
        <MessageSearch
          messages={mockMessages}
          onResultsChange={setFilteredMessages}
          placeholder="Search messages..."
        />
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Filtered Results ({filteredMessages.length})</h3>
          <div className="space-y-2">
            {filteredMessages.map((msg) => (
              <div key={msg.id} className="text-sm p-2 bg-muted rounded">
                <span className="font-medium">{msg.role}:</span> {msg.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}

export const LargeDataset: Story = {
  args: {
    messages: Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}: This is a test message with some content.`,
      timestamp: Date.now() - (100 - i) * 60000,
      createdAt: Date.now() - (100 - i) * 60000,
      updatedAt: Date.now() - (100 - i) * 60000,
    })),
    placeholder: 'Search through 100 messages...',
  },
}

export const EmptyMessages: Story = {
  args: {
    messages: [],
    placeholder: 'Search messages...',
  },
}

export const CustomPlaceholder: Story = {
  args: {
    messages: mockMessages,
    placeholder: 'Type to search conversation history...',
  },
}
