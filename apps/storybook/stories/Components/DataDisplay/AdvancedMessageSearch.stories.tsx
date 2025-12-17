import { SecureLogger } from '@/lib/security/secureLogger';
import type { Meta, StoryObj } from '@storybook/react-vite'
import { AdvancedMessageSearch } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const meta: Meta<typeof AdvancedMessageSearch> = {
  title: 'Components/DataDisplay/AdvancedMessageSearch',
  component: AdvancedMessageSearch,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof AdvancedMessageSearch>

const sampleMessages: Message[] = [
  {
    id: '1',
    chatId: 'chat-1',
    role: 'user',
    content: 'Hello, how are you?',
    status: 'sent',
    createdAt: new Date('2024-01-15T10:00:00'),
    updatedAt: new Date('2024-01-15T10:00:00'),
    metadata: {
      tokens: 10,
      model: 'gpt-4',
      responseTime: 1200,
    },
  },
  {
    id: '2',
    chatId: 'chat-1',
    role: 'assistant',
    content: 'I am doing well, thank you for asking! How can I help you today?',
    status: 'sent',
    createdAt: new Date('2024-01-15T10:00:01'),
    updatedAt: new Date('2024-01-15T10:00:01'),
    metadata: {
      tokens: 25,
      model: 'gpt-4',
      responseTime: 1500,
    },
  },
  {
    id: '3',
    chatId: 'chat-1',
    role: 'user',
    content: 'Can you help me write a function in Python?',
    status: 'sent',
    createdAt: new Date('2024-01-15T10:05:00'),
    updatedAt: new Date('2024-01-15T10:05:00'),
    metadata: {
      tokens: 15,
      model: 'gpt-4',
    },
  },
  {
    id: '4',
    chatId: 'chat-1',
    role: 'assistant',
    content: `Sure! Here's a simple Python function example:

\`\`\`python
def greet(name):
    return f"Hello, {name}!"
\`\`\`

This function takes a name parameter and returns a greeting string.`,
    status: 'sent',
    createdAt: new Date('2024-01-15T10:05:02'),
    updatedAt: new Date('2024-01-15T10:05:02'),
    metadata: {
      tokens: 45,
      model: 'gpt-4',
      responseTime: 2000,
    },
  },
  {
    id: '5',
    chatId: 'chat-1',
    role: 'user',
    content: 'What about error handling?',
    status: 'sent',
    createdAt: new Date('2024-01-15T10:10:00'),
    updatedAt: new Date('2024-01-15T10:10:00'),
    metadata: {
      tokens: 8,
      model: 'gpt-4',
    },
  },
]

export const Default: Story = {
  args: {
    messages: sampleMessages,
    onResultsChange: (filtered) => {
      SecureLogger.debug('Filtered messages:', filtered.length)
    },
    placeholder: 'Search messages...',
  },
}

export const WithAdvancedFilters: Story = {
  args: {
    messages: sampleMessages,
    onResultsChange: (filtered) => {
      SecureLogger.debug('Filtered messages:', filtered.length)
    },
    enableAdvancedFilters: true,
    showFilterCount: true,
  },
}

export const WithFuzzySearch: Story = {
  args: {
    messages: sampleMessages,
    onResultsChange: (filtered) => {
      SecureLogger.debug('Filtered messages:', filtered.length)
    },
    enableFuzzySearch: true,
    enableAdvancedFilters: true,
  },
}

export const LargeDataset: Story = {
  args: {
    messages: Array.from({ length: 1000 }, (_, i) => ({
      id: `msg-${i}`,
      chatId: 'chat-1',
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `Message ${i}: This is a test message with some content.`,
      status: 'sent' as const,
      createdAt: new Date(2024, 0, 1 + Math.floor(i / 10)),
      updatedAt: new Date(2024, 0, 1 + Math.floor(i / 10)),
      metadata: {
        tokens: Math.floor(Math.random() * 100) + 10,
        model: i % 3 === 0 ? 'gpt-4' : 'gpt-3.5-turbo',
      },
    })),
    onResultsChange: (filtered) => {
      SecureLogger.debug('Filtered messages:', filtered.length)
    },
    enableAdvancedFilters: true,
  },
}
