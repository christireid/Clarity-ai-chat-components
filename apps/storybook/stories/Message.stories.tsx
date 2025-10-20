import type { Meta, StoryObj } from '@storybook/react'
import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

const meta = {
  title: 'Components/Message',
  component: Message,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    onCopy: { action: 'copied' },
    onFeedback: { action: 'feedback' },
    onRetry: { action: 'retry' },
  },
} satisfies Meta<typeof Message>

export default meta
type Story = StoryObj<typeof meta>

const baseMessage: MessageType = {
  id: '1',
  chatId: 'chat-1',
  role: 'user',
  content: 'Hello! How can you help me today?',
  status: 'sent',
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const UserMessage: Story = {
  args: {
    message: baseMessage,
  },
}

export const AssistantMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '2',
      role: 'assistant',
      content: 'Hello! I can help you with a variety of tasks including:\n\n- Answering questions\n- Writing code\n- Creative projects\n- And much more!\n\nWhat would you like to work on?',
    },
  },
}

export const AssistantWithCode: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '3',
      role: 'assistant',
      content: 'Here\'s a simple React component:\n\n```tsx\nimport React from \'react\'\n\nfunction Hello() {\n  return <div>Hello World!</div>\n}\n\nexport default Hello\n```\n\nThis component renders a simple greeting.',
    },
  },
}

export const StreamingMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '4',
      role: 'assistant',
      content: 'This message is currently streaming',
      status: 'streaming',
    },
  },
}

export const ErrorMessage: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '5',
      status: 'error',
    },
  },
}

export const WithMetadata: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '6',
      role: 'assistant',
      content: 'This message includes metadata about the generation.',
      metadata: {
        tokens: 145,
        model: 'gpt-4',
        processingTime: 1523,
      },
    },
  },
}

export const WithFeedback: Story = {
  args: {
    message: {
      ...baseMessage,
      id: '7',
      role: 'assistant',
      content: 'This message has received positive feedback.',
      feedback: {
        type: 'up',
        timestamp: new Date(),
      },
    },
  },
}
