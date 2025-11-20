import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Message } from '@clarity-chat/react'
import type { Message as MessageType } from '@clarity-chat/types'

/**
 * **Message Component - Essentials Track**
 * 
 * This track focuses on the most common use cases for the Message component.
 * These examples are production-ready and can be copied directly into your app.
 * 
 * For advanced patterns, see the "Enterprise" and "Composability" tracks.
 */
const meta: Meta<typeof Message> = {
  title: 'Components/DataDisplay/MessageEssentials',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
The Message component is the foundation of any chat interface. This track shows
the essential patterns you'll use in 90% of cases.

## When to Use

- Displaying chat messages
- Showing user and assistant messages
- Basic markdown rendering
- Simple feedback collection

## Quick Start

\`\`\`tsx
import { Message } from '@clarity-chat/react'

<Message
  message={{
    id: '1',
    role: 'user',
    content: 'Hello!',
    createdAt: Date.now(),
    status: 'sent',
  }}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    message: {
      description: 'The message object to display',
      control: { type: 'object' },
    },
    onFeedback: {
      description: 'Callback when user gives feedback (up/down)',
      action: 'feedback',
    },
    onCopy: {
      description: 'Callback when message is copied',
      action: 'copy',
    },
    showAvatar: {
      description: 'Show avatar for the message',
      control: 'boolean',
      defaultValue: true,
    },
    showTimestamp: {
      description: 'Show timestamp',
      control: 'boolean',
      defaultValue: false,
    },
    enableMarkdown: {
      description: 'Enable markdown rendering',
      control: 'boolean',
      defaultValue: true,
    },
  },
}

export default meta
type Story = StoryObj<typeof Message>

// Helper to create message objects
const createMessage = (
  role: 'user' | 'assistant',
  content: string,
  overrides?: Partial<MessageType>
): MessageType => ({
  id: `msg-${Date.now()}-${Math.random()}`,
  role,
  content,
  createdAt: Date.now(),
  status: 'sent',
  ...overrides,
})

/**
 * **Essential Pattern 1: Basic User Message**
 * 
 * The simplest use case - displaying a user message.
 * This is what you'll use most often.
 */
export const UserMessage: Story = {
  args: {
    message: createMessage('user', 'Hello! How can I help you today?'),
    showAvatar: true,
    showTimestamp: false,
    enableMarkdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Display a user message with minimal configuration. This is the most common
pattern you'll use.

**When to use:**
- Displaying user input
- Simple text messages
- Non-markdown content
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 2: Basic Assistant Message**
 * 
 * Display an assistant response with markdown support.
 * This handles most AI responses.
 */
export const AssistantMessage: Story = {
  args: {
    message: createMessage(
      'assistant',
      'I can help you with that! Here are some options:\n\n1. **Option A** - Quick solution\n2. **Option B** - Comprehensive approach\n3. **Option C** - Custom solution'
    ),
    showAvatar: true,
    showTimestamp: false,
    enableMarkdown: true,
    onFeedback: (type) => console.log('Feedback:', type),
  },
  parameters: {
    docs: {
      description: {
        story: `
Display an assistant message with markdown rendering. This is the standard
pattern for AI responses.

**Features:**
- Markdown rendering (bold, lists, code)
- Feedback buttons (thumbs up/down)
- Copy functionality
- Avatar display
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 3: Conversation Flow**
 * 
 * Show multiple messages in a conversation.
 * This demonstrates the typical chat pattern.
 */
export const Conversation: Story = {
  render: () => {
    const messages: MessageType[] = [
      createMessage('user', 'What is React?'),
      createMessage(
        'assistant',
        'React is a JavaScript library for building user interfaces. It allows you to create reusable UI components and manage application state efficiently.'
      ),
      createMessage('user', 'Can you show me an example?'),
      createMessage(
        'assistant',
        "Sure! Here's a simple React component:\n\n```jsx\nfunction Welcome({ name }) {\n  return <h1>Hello, {name}!</h1>\n}\n```"
      ),
    ]

    return (
      <div className="space-y-4 max-w-3xl">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            showAvatar={true}
            enableMarkdown={msg.role === 'assistant'}
            onFeedback={(type) => console.log(`Feedback for ${msg.id}:`, type)}
          />
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
A complete conversation showing the typical flow between user and assistant.
This is the pattern you'll use in production.

**Key points:**
- User messages: Simple text, no markdown
- Assistant messages: Rich markdown with code blocks
- Consistent styling throughout
- Feedback on assistant messages only
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 4: Loading State**
 * 
 * Show a message that's still being generated.
 * Essential for streaming responses.
 */
export const LoadingState: Story = {
  args: {
    message: createMessage('assistant', 'Thinking...', {
      status: 'streaming',
    }),
    showAvatar: true,
    enableMarkdown: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
Display a message that's currently being generated. This is essential for
streaming AI responses.

**Visual indicators:**
- Streaming cursor animation
- Loading state styling
- Disabled interactions
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 5: Error State**
 * 
 * Show an error message with retry option.
 * Important for handling failures gracefully.
 */
export const ErrorState: Story = {
  args: {
    message: createMessage('assistant', 'Failed to generate response', {
      status: 'error',
    }),
    showAvatar: true,
    enableMarkdown: false,
    onRetry: (id) => {
      console.log('Retrying message:', id)
      alert('Retrying...')
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Display an error state with retry functionality. This provides a good user
experience when things go wrong.

**Features:**
- Clear error indication
- Retry button
- User-friendly messaging
        `,
      },
    },
  },
}

/**
 * **Essential Pattern 6: With Timestamps**
 * 
 * Show messages with timestamps.
 * Useful for longer conversations.
 */
export const WithTimestamps: Story = {
  render: () => {
    const now = Date.now()
    const messages: MessageType[] = [
      createMessage('user', 'Hello!', {
        createdAt: now - 60000, // 1 minute ago
      }),
      createMessage('assistant', 'Hi there! How can I help?', {
        createdAt: now - 30000, // 30 seconds ago
      }),
      createMessage('user', 'What time is it?', {
        createdAt: now,
      }),
    ]

    return (
      <div className="space-y-4 max-w-3xl">
        {messages.map((msg) => (
          <Message
            key={msg.id}
            message={msg}
            showAvatar={true}
            showTimestamp={true}
            enableMarkdown={msg.role === 'assistant'}
          />
        ))}
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Show messages with timestamps. This helps users understand the conversation
timeline, especially in longer chats.

**When to use:**
- Long conversations
- Multi-user chats
- Time-sensitive content
        `,
      },
    },
  },
}
