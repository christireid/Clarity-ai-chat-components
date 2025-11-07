import type { Meta, StoryObj } from '@storybook/react'
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
  title: 'Messaging/Rendering/Virtualized Message List',
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
      <div className="mx-auto w-full max-w-3xl rounded-xl border border-border bg-card p-4">
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
    onMessageCopy: (id, content) => console.info('[Storybook] Copy message', id, content.slice(0, 40)),
    onMessageFeedback: (id, type) => console.info('[Storybook] Feedback', id, type),
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
}
