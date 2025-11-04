import type { Meta, StoryObj } from '@storybook/react'
import { MessageSearch } from '@clarity-chat/react'
import { useState } from 'react'

/**
 * MessageSearch enables full-text search across conversation history.
 * 
 * **Key Features:**
 * - Real-time search
 * - Fuzzy matching
 * - Result highlighting
 * - Keyboard shortcuts
 * 
 * **Use Cases:**
 * - Finding past messages
 * - Knowledge retrieval
 * - Conversation navigation
 */
const meta = {
  title: 'Components/MessageSearch',
  component: MessageSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Search through conversation history with fuzzy matching and result highlighting.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MessageSearch>

export default meta
type Story = StoryObj<typeof meta>

const mockMessages = [
  { id: '1', content: 'How do I use React hooks?', timestamp: Date.now() - 86400000, role: 'user' as const },
  { id: '2', content: 'React hooks allow you to use state and lifecycle features in function components.', timestamp: Date.now() - 86300000, role: 'assistant' as const },
  { id: '3', content: 'Can you show me an example of useState?', timestamp: Date.now() - 86200000, role: 'user' as const },
  { id: '4', content: 'Here is an example of useState: const [count, setCount] = useState(0)', timestamp: Date.now() - 86100000, role: 'assistant' as const },
  { id: '5', content: 'What about useEffect?', timestamp: Date.now() - 3600000, role: 'user' as const },
  { id: '6', content: 'useEffect is used for side effects like data fetching, subscriptions, or DOM manipulation.', timestamp: Date.now() - 3500000, role: 'assistant' as const },
]

export const Default: Story = {
  args: {
    messages: mockMessages,
    onResultClick: (messageId: string) => {
      console.log('Navigate to message:', messageId)
    },
  },
}

export const WithResults: Story = {
  render: () => {
    const [query, setQuery] = useState('hooks')
    
    return (
      <MessageSearch
        messages={mockMessages}
        initialQuery={query}
        onSearch={setQuery}
        onResultClick={(id) => console.log('Clicked:', id)}
      />
    )
  },
}

export const EmptyResults: Story = {
  render: () => (
    <MessageSearch
      messages={mockMessages}
      initialQuery="nonexistent query that returns nothing"
      onResultClick={(id) => console.log('Clicked:', id)}
    />
  ),
}

export const LargeConversation: Story = {
  render: () => {
    const largeMessages = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Message ${i}: ${i % 3 === 0 ? 'React hooks' : i % 3 === 1 ? 'TypeScript types' : 'JavaScript functions'}`,
      timestamp: Date.now() - (100 - i) * 60000,
      role: i % 2 === 0 ? 'user' as const : 'assistant' as const,
    }))
    
    return (
      <MessageSearch
        messages={largeMessages}
        onResultClick={(id) => console.log('Clicked:', id)}
        placeholder="Search 100 messages..."
      />
    )
  },
}

export const WithKeyboardShortcut: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg text-sm">
        <p className="font-semibold mb-2">Keyboard Shortcut:</p>
        <p>Press <kbd className="px-2 py-1 bg-white border rounded shadow-sm">Cmd/Ctrl + K</kbd> to focus search</p>
      </div>
      
      <MessageSearch
        messages={mockMessages}
        onResultClick={(id) => console.log('Clicked:', id)}
        shortcut="cmd+k"
      />
    </div>
  ),
}
