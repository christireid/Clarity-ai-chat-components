import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  ChatWindow,
  useClarityChat,
  MemoryProvider,
  ThemeProvider,
} from '@clarity-chat/react'
import { useState } from 'react'
import type { Message } from '@clarity-chat/types'

const meta: Meta<typeof ChatWindow> = {
  title: 'Components/ChatWindow/Enterprise',
  component: ChatWindow,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
Enterprise patterns for production applications. These examples demonstrate
advanced features, performance optimizations, and production-ready configurations.

## Enterprise Features

- Multi-user conversations
- Advanced error handling
- Performance optimizations
- Custom message rendering
- Analytics integration
- Security considerations
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{
          width: '800px',
          height: '700px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      >
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ChatWindow>

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

export const WithAdvancedMemory: Story = {
  render: () => {
    const ChatApp = () => {
      const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
        memory: {
          enabled: true,
          strategy: 'semantic-chunks', // Advanced memory strategy
          maxTokens: 8000, // Higher limit for enterprise
          autoCapture: true,
          includeMetadata: true, // Include message metadata
        },
      })

      return (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={async (content) => {
            await append({ role: 'user', content })
          }}
          showTokenCounter={true}
        />
      )
    }

    return (
      <MemoryProvider
        config={{ maxTokens: 10000, strategy: 'semantic-chunks' }}
      >
        <ChatApp />
      </MemoryProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Enterprise chat with advanced memory configuration. Uses semantic chunking
for better context management in long conversations.

**Features:**
- Semantic chunking strategy
- Higher token limits
- Metadata inclusion
- Auto-capture enabled

**Use Case:** Long-running conversations with complex context requirements.
        `,
      },
    },
  },
}

export const WithErrorRecovery: Story = {
  render: () => {
    const [error, setError] = useState<Error | null>(null)
    const [retryCount, setRetryCount] = useState(0)

    const ChatApp = () => {
      const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
        onError: (err) => {
          setError(err)
          console.error('Chat error:', err)
        },
        retry: {
          maxAttempts: 3,
          delay: 1000,
        },
      })

      const handleSend = async (content: string) => {
        try {
          setError(null)
          await append({ role: 'user', content })
        } catch (err) {
          setError(err as Error)
          setRetryCount((prev) => prev + 1)
        }
      }

      return (
        <div>
          {error && (
            <div
              style={{
                padding: '12px',
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                borderRadius: '4px',
                marginBottom: '16px',
              }}
            >
              <strong>Error:</strong> {error.message}
              {retryCount > 0 && <div>Retry attempts: {retryCount}</div>}
            </div>
          )}
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSend}
          />
        </div>
      )
    }

    return <ChatApp />
  },
  parameters: {
    docs: {
      description: {
        story: `
Enterprise error handling with retry logic and user feedback.

**Features:**
- Automatic retry with exponential backoff
- Error state display
- Retry count tracking
- User-friendly error messages

**Use Case:** Production applications requiring robust error handling.
        `,
      },
    },
  },
}

export const WithAnalytics: Story = {
  render: () => {
    const ChatApp = () => {
      const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
        onMessageSent: (message) => {
          // Track message sent
          console.log('Analytics: Message sent', {
            id: message.id,
            length: message.content.length,
            timestamp: message.createdAt,
          })
        },
        onMessageReceived: (message) => {
          // Track message received
          console.log('Analytics: Message received', {
            id: message.id,
            length: message.content.length,
            timestamp: message.createdAt,
          })
        },
      })

      return (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={async (content) => {
            await append({ role: 'user', content })
          }}
          onFeedback={(messageId, type) => {
            // Track feedback
            console.log('Analytics: Feedback', { messageId, type })
          }}
          onCopy={(messageId, content) => {
            // Track copy
            console.log('Analytics: Message copied', { messageId })
          }}
        />
      )
    }

    return <ChatApp />
  },
  parameters: {
    docs: {
      description: {
        story: `
Enterprise chat with analytics integration. Tracks user interactions
for business intelligence and product improvement.

**Tracked Events:**
- Message sent
- Message received
- User feedback
- Message copy
- Token usage

**Use Case:** Production applications requiring user analytics.
        `,
      },
    },
  },
}

export const MultiUserConversation: Story = {
  render: () => {
    const ChatApp = () => {
      const [currentUser, setCurrentUser] = useState('user1')
      const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
        userId: currentUser, // Track user ID
      })

      return (
        <div>
          <div
            style={{
              padding: '12px',
              background: '#f5f5f5',
              marginBottom: '16px',
              borderRadius: '4px',
            }}
          >
            <label>
              Current User:{' '}
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
              >
                <option value="user1">User 1</option>
                <option value="user2">User 2</option>
                <option value="user3">User 3</option>
              </select>
            </label>
          </div>
          <ChatWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={async (content) => {
              await append({
                role: 'user',
                content,
                metadata: { userId: currentUser }, // Include user metadata
              })
            }}
          />
        </div>
      )
    }

    return <ChatApp />
  },
  parameters: {
    docs: {
      description: {
        story: `
Multi-user conversation support. Tracks different users and maintains
separate conversation contexts.

**Features:**
- User ID tracking
- User-specific metadata
- Context isolation
- User switching

**Use Case:** Applications with multiple users or user impersonation.
        `,
      },
    },
  },
}

export const WithCustomTheme: Story = {
  render: () => {
    const customTheme = {
      colors: {
        primary: '#3b82f6',
        background: '#ffffff',
        foreground: '#000000',
        muted: '#f3f4f6',
        accent: '#8b5cf6',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
    }

    const ChatApp = () => {
      const { messages, append, isLoading } = useClarityChat({
        api: '/api/chat',
      })

      return (
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={async (content) => {
            await append({ role: 'user', content })
          }}
        />
      )
    }

    return (
      <ThemeProvider theme={customTheme}>
        <ChatApp />
      </ThemeProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
Enterprise chat with custom branding. Matches your company's design system.

**Features:**
- Custom color palette
- Brand-consistent styling
- Configurable border radius
- Theme provider integration

**Use Case:** White-label applications or branded deployments.
        `,
      },
    },
  },
}
