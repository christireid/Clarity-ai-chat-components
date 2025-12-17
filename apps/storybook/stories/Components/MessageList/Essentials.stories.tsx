import type { Meta, StoryObj } from '@storybook/react-vite'
import { VirtualizedMessageList as MessageList } from '@clarity-chat/react'
import type { Message } from '@clarity-chat/types'

const meta: Meta<typeof MessageList> = {
  title: 'Components/MessageList/Essentials',
  component: MessageList,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The MessageList component displays a virtualized list of chat messages with
smooth scrolling and performance optimizations. This track shows the essential
patterns you'll use in 90% of cases.

## When to Use MessageList

- ✅ Custom chat layouts (not using ChatWindow)
- ✅ Need virtualized list for performance (100+ messages)
- ✅ Want custom message rendering
- ✅ Need fine-grained control over message display

## When NOT to Use MessageList

- ❌ Using ChatWindow (it includes MessageList)
- ❌ Simple chat with few messages (< 20)
- ❌ Don't need virtualization

## Key Features

- **Virtualization** - Only renders visible messages
- **Auto-Scroll** - Automatically scrolls to latest message
- **Smooth Scrolling** - Optimized scroll performance
- **Empty States** - Handles empty chat gracefully
- **Accessibility** - WCAG AAA compliant
        `,
      },
    },
  },
  argTypes: {
    messages: {
      description: 'Array of messages to display',
      control: { type: 'object' },
    },
    onMessageCopy: {
      description: 'Callback when message is copied',
      action: 'message-copied',
    },
    onMessageFeedback: {
      description: 'Callback when feedback is given (up/down)',
      action: 'message-feedback',
    },
    onMessageRetry: {
      description: 'Callback when retry is requested',
      action: 'message-retry',
    },
    autoScroll: {
      description: 'Automatically scroll to bottom on new messages',
      control: { type: 'boolean' },
      defaultValue: true,
    },
    showScrollButton: {
      description: 'Show scroll-to-bottom button',
      control: { type: 'boolean' },
      defaultValue: true,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', height: '500px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof MessageList>

const createMessage = (
  role: 'user' | 'assistant',
  content: string,
  overrides?: Partial<Message>
): Message => ({
  id: `msg-${Date.now()}-${Math.random()}`,
  role,
  content,
  createdAt: Date.now(),
  status: 'sent',
  ...overrides,
})

const mockMessages: Message[] = [
  createMessage('user', 'Hello! Can you help me with React?', {
    createdAt: Date.now() - 60000,
  }),
  createMessage('assistant', 'Of course! I\'d be happy to help you with React. What specific topic would you like to discuss?', {
    createdAt: Date.now() - 30000,
  }),
  createMessage('user', 'How do I use hooks?', {
    createdAt: Date.now() - 10000,
  }),
]

export const BasicList: Story = {
  args: {
    messages: mockMessages,
    autoScroll: true,
    showScrollButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
The most basic message list setup. This is the foundation for all other patterns.

**Key Points:**
- Pass messages array
- Enable auto-scroll for better UX
- Show scroll button for long conversations

This pattern works for 90% of use cases.
        `,
      },
    },
  },
}

export const EmptyState: Story = {
  args: {
    messages: [],
    autoScroll: true,
    showScrollButton: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Empty state handling. MessageList automatically displays a helpful message
when there are no messages.

**When to Use:**
- Initial state of new conversations
- After clearing chat history
- When starting fresh
        `,
      },
    },
  },
}

export const LongConversation: Story = {
  args: {
    messages: Array.from({ length: 50 }, (_, i) => {
      const isUser = i % 2 === 0
      return createMessage(
        isUser ? 'user' : 'assistant',
        isUser 
          ? `Message ${i + 1} from user`
          : `This is response ${i + 1} from the assistant. It contains some content to demonstrate how the list handles longer conversations.`,
        {
          createdAt: Date.now() - (50 - i) * 1000,
        }
      )
    }),
    autoScroll: true,
    showScrollButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
MessageList handles long conversations efficiently with virtualization.
Only visible messages are rendered, ensuring smooth performance even with
hundreds or thousands of messages.

**Performance:** Automatically virtualizes for 100+ messages.
        `,
      },
    },
  },
}

export const WithActions: Story = {
  args: {
    messages: mockMessages,
    autoScroll: true,
    showScrollButton: true,
    onMessageCopy: (id, content) => {
      console.log('Copied message:', id, content)
    },
    onMessageFeedback: (id, type) => {
      console.log('Feedback:', id, type)
    },
    onMessageRetry: (id) => {
      console.log('Retry message:', id)
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Enable message actions (copy, feedback, retry). These callbacks are called
when users interact with message action buttons.

**Actions:**
- **Copy** - Copy message content to clipboard
- **Feedback** - Upvote/downvote message quality
- **Retry** - Retry failed message generation
        `,
      },
    },
  },
}

export const WithoutAutoScroll: Story = {
  args: {
    messages: mockMessages,
    autoScroll: false,
    showScrollButton: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
Disable auto-scroll when you want users to maintain their scroll position.
Useful for when users are reading older messages and new ones arrive.

**Use Case:** When users are reviewing conversation history and new messages
arrive in the background.
        `,
      },
    },
  },
}
