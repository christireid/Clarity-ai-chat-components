import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { MessageOptimized } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const baseAssistantMessage: Message = {
  id: 'assistant-1',
  chatId: 'storybook',
  role: 'assistant',
  content: `Here's a polished summary based on the uploaded transcript:

- **Top concern**: onboarding friction for enterprise customers.
- **Opportunities**: automate SSO setup, add guided playbooks, surface usage dashboards.

Let me know if you'd like me to draft the announcement email next.`,
  createdAt: new Date(Date.now() - 60_000),
  status: 'sent',
}

const meta = {
  title: 'Components/DataDisplay/MessageOptimized',
  component: MessageOptimized,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Optimized message renderer with markdown parsing, streaming indicators, and interaction affordances. Mirrors component patterns used by GitHub Copilot and Notion AI documentation.',
      },
    },
  },
  argTypes: {
    showAvatar: { control: 'boolean' },
    showTimestamp: { control: 'boolean' },
  },
  args: {
    showAvatar: true,
    showTimestamp: true,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MessageOptimized>

export default meta
type Story = StoryObj<typeof meta>

export const AssistantResponse: Story = {
  args: {
    message: baseAssistantMessage,
  },
}

export const Streaming: Story = {
  args: {
    message: {
      ...baseAssistantMessage,
      id: 'assistant-stream',
      status: 'streaming',
      content: 'Drafting follow-up message',
    },
  },
}

export const WithFeedback: Story = {
  render: (args) => {
    const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null)

    return (
      <div className="max-w-2xl">
        <MessageOptimized
          {...args}
          message={{
            ...baseAssistantMessage,
            id: 'assistant-rich',
            feedback: feedback ? { type: feedback } : undefined,
            attachments: [
              {
                id: 'attachment-1',
                type: 'link',
                title: 'Components/DataDisplay/MessageOptimized',
              },
              {
                id: 'attachment-2',
                type: 'file',
                title: 'Components/DataDisplay/MessageOptimized',
                size: 1_024_000,
              },
            ],
          }}
          onFeedback={(value) => setFeedback(value)}
          onRetry={() => alert('Retrying message fetch...')}
        />
      </div>
    )
  },
}

export const UserMessage: Story = {
  args: {
    message: {
      id: 'user-1',
      chatId: 'storybook',
      role: 'user',
      content: 'Can you summarise the key risks and draft an update for leadership? Include timelines.',
      createdAt: new Date(),
      status: 'sent',
    },
    showAvatar: false,
  },
}
