import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'
import {
  TanStackMessageList,
  AutoTanStackMessageList,
} from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const generateMessages = (count: number): Message[] =>
  Array.from({ length: count }, (_, index) => {
    const isAssistant = index % 2 === 1
    return {
      id: `msg-${index}`,
      chatId: 'tanstack-demo',
      role: isAssistant ? 'assistant' : 'user',
      content: isAssistant
        ? `Assistant response #${index}: This is a detailed response that demonstrates how TanStack Virtual handles variable-height content. The message includes multiple sentences to show height measurement.`
        : `User message #${index}: What can you tell me about TanStack Virtual and its benefits for chat applications?`,
      createdAt: new Date(Date.now() - (count - index) * 1000 * 45),
      status: 'sent',
    }
  })

const SimpleMessageRenderer = ({ message }: { message: Message }) => (
  <div
    className={`p-3 rounded-lg mb-2 ${
      message.role === 'assistant'
        ? 'bg-muted ml-4'
        : 'bg-primary text-primary-foreground mr-4'
    }`}
  >
    <div className="text-xs font-medium mb-1 opacity-70">
      {message.role === 'assistant' ? 'Assistant' : 'You'}
    </div>
    <div className="text-sm">{message.content as string}</div>
  </div>
)

const baseMessages = generateMessages(100)

const meta = {
  title: 'Components/DataDisplay/TanStackMessageList',
  component: TanStackMessageList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modern virtualized message list powered by @tanstack/react-virtual. Features dynamic height measurement, smooth scrolling, and automatic scroll-to-bottom behavior. Recommended for all new projects.',
      },
    },
  },
  argTypes: {
    estimatedItemSize: { control: { type: 'number', min: 50, max: 300 } },
    overscanCount: { control: { type: 'number', min: 1, max: 20 } },
    autoScrollToBottom: { control: 'boolean' },
    smoothScroll: { control: 'boolean' },
    height: { control: 'text' },
  },
  args: {
    estimatedItemSize: 150,
    overscanCount: 5,
    autoScrollToBottom: true,
    smoothScroll: true,
    height: '400px',
  },
  decorators: [
    (Story) => (
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-border/50 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0_/_0.05)]">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof TanStackMessageList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    messages: baseMessages,
    renderMessage: (message: Message) => (
      <SimpleMessageRenderer message={message} />
    ),
  },
}

export const SmallConversation: Story = {
  args: {
    messages: baseMessages.slice(0, 10),
    renderMessage: (message: Message) => (
      <SimpleMessageRenderer message={message} />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Small conversations still benefit from virtualization infrastructure, ensuring consistent behavior as conversations grow.',
      },
    },
  },
}

export const LargeConversation: Story = {
  args: {
    messages: generateMessages(500),
    renderMessage: (message: Message) => (
      <SimpleMessageRenderer message={message} />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Handles 500+ messages with smooth performance. TanStack Virtual only renders visible items plus overscan.',
      },
    },
  },
}

export const WithStreaming: Story = {
  args: {
    messages: [
      ...baseMessages.slice(0, 5),
      {
        id: 'streaming-msg',
        chatId: 'tanstack-demo',
        role: 'assistant' as const,
        content: 'This message is currently streaming...',
        createdAt: new Date(),
        status: 'streaming' as const,
      },
    ],
    renderMessage: (message: Message) => (
      <div
        className={`p-3 rounded-lg mb-2 ${
          message.role === 'assistant'
            ? 'bg-muted ml-4'
            : 'bg-primary text-primary-foreground mr-4'
        }`}
      >
        <div className="text-xs font-medium mb-1 opacity-70">
          {message.role === 'assistant' ? 'Assistant' : 'You'}
        </div>
        <div className="text-sm">
          {message.content as string}
          {message.status === 'streaming' && (
            <span className="ml-1 animate-pulse">▋</span>
          )}
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Streaming messages maintain scroll position at bottom while content updates.',
      },
    },
  },
}

export const CustomStyling: Story = {
  args: {
    messages: baseMessages.slice(0, 20),
    className: 'bg-gradient-to-b from-background to-muted/20 rounded-xl',
    height: '500px',
    renderMessage: (message: Message) => (
      <div
        className={`p-4 rounded-2xl mb-3 shadow-sm ${
          message.role === 'assistant'
            ? 'bg-card border border-border ml-8'
            : 'bg-primary text-primary-foreground mr-8'
        }`}
      >
        <div className="text-sm">{message.content as string}</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Fully customizable styling via className and renderMessage props.',
      },
    },
  },
}

// AutoTanStackMessageList story
const autoMeta = {
  title: 'Components/DataDisplay/AutoTanStackMessageList',
  component: AutoTanStackMessageList,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Automatically switches between regular rendering and virtualization based on message count. Uses standard rendering for small lists (< threshold) and TanStack Virtual for large lists.',
      },
    },
  },
  argTypes: {
    virtualizationThreshold: { control: { type: 'number', min: 10, max: 200 } },
  },
  args: {
    virtualizationThreshold: 50,
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="mx-auto w-full max-w-3xl rounded-lg border border-border/50 bg-card p-4">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
}

export const AutoVirtualization: StoryObj<typeof AutoTanStackMessageList> = {
  render: () => (
    <AutoTanStackMessageList
      messages={baseMessages.slice(0, 30)}
      renderMessage={(message: Message) => (
        <SimpleMessageRenderer message={message} />
      )}
      virtualizationThreshold={50}
      height="400px"
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'With 30 messages (below threshold of 50), uses standard rendering for optimal performance with small lists.',
      },
    },
  },
}

export const AutoVirtualizationLarge: StoryObj<typeof AutoTanStackMessageList> =
  {
    render: () => (
      <AutoTanStackMessageList
        messages={baseMessages}
        renderMessage={(message: Message) => (
          <SimpleMessageRenderer message={message} />
        )}
        virtualizationThreshold={50}
        height="400px"
      />
    ),
    parameters: {
      docs: {
        description: {
          story:
            'With 100 messages (above threshold of 50), automatically enables virtualization.',
        },
      },
    },
  }
