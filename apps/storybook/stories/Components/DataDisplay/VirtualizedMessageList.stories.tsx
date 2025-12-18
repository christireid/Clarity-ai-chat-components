import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import { VirtualizedMessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const generateMessages = (count: number): Message[] =>
  Array.from({ length: count }, (_, index) => {
    const isAssistant = index % 2 === 1
    return {
      id: `msg-${index}`,
      chatId: 'virtualized-demo',
      role: isAssistant ? 'assistant' : 'user',
      content: isAssistant
        ? `Assistant response #${index}: summarising context and providing recommendations. Bullet ${index % 5}.`
        : `User message #${index}: follow-up question about Phoenix launch timeline and stakeholder alignment.`,
      createdAt: new Date(Date.now() - (count - index) * 1000 * 45),
      status: 'sent',
    }
  })

const baseMessages = generateMessages(120)

const meta = {
  title: 'Components/DataDisplay/VirtualizedMessageList',
  component: VirtualizedMessageList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'High-performance list for long-running conversations. Inspired by Slack, Linear, and Discord storybooks where virtualization keeps UX smooth even with thousands of messages.',
      },
    },
  },
  argTypes: {
    enableVirtualization: { control: 'boolean' },
    estimatedMessageHeight: { control: { type: 'number', min: 80, step: 10 } },
    overscan: { control: { type: 'number', min: 1, max: 10 } },
    loadingCount: { control: { type: 'number', min: 1, max: 10 } },
  },
  args: {
    enableVirtualization: true,
    estimatedMessageHeight: 140,
    overscan: 3,
    loadingCount: 4,
    className: 'h-[480px]',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-border/50 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof VirtualizedMessageList>

export default meta
type Story = StoryObj<typeof meta>

export const LargeConversation: Story = {
  args: {
    messages: baseMessages,
    emptyState: <div className="text-sm text-muted-foreground">Start a conversation to see history.</div>,
    onMessageCopy: (id, content) => SecureLogger.info('[Storybook] Copy message', id, content.slice(0, 40)),
    onMessageFeedback: (id, type) => SecureLogger.info('[Storybook] Feedback', id, type),
  },
}

export const LoadingSkeleton: Story = {
  args: {
    messages: [],
    isLoading: true,
    loadingCount: 5,
  },
}

export const NonVirtualized: Story = {
  args: {
    messages: baseMessages.slice(0, 40),
    enableVirtualization: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disable virtualization for shorter conversations (< 50 messages). Virtualization adds overhead that may not be needed for small lists.',
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    messages: [],
    isLoading: false,
    emptyState: (
      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
        <div className="text-4xl mb-4">💬</div>
        <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
        <p className="text-sm text-muted-foreground">
          Start a conversation to see messages here
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no messages are present. Customize the emptyState prop to match your app\'s design.',
      },
    },
  },
}

export const WithError: Story = {
  args: {
    messages: baseMessages.slice(0, 10),
    error: 'Failed to load messages. Please try again.',
    onRetry: () => SecureLogger.info('[Storybook] Retry clicked'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Error state with retry functionality. The error prop displays a user-friendly error message.',
      },
    },
  },
}

export const StreamingMessage: Story = {
  args: {
    messages: [
      ...baseMessages.slice(0, 5),
      {
        id: 'streaming-msg',
        chatId: 'virtualized-demo',
        role: 'assistant',
        content: 'This is a streaming message that is currently being generated...',
        createdAt: Date.now(),
        status: 'streaming',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Handles streaming messages gracefully. Messages with status "streaming" show a loading indicator.',
      },
    },
  },
}
