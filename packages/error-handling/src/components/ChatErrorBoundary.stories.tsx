import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ChatErrorBoundary } from './ChatErrorBoundary'
import { StreamingError } from '../errors/streaming-error'
import { ProviderError } from '../errors/provider-error'
import { ApiError, ApiErrorCode } from '../errors/api-error'

const meta: Meta<typeof ChatErrorBoundary> = {
  title: 'Components/ChatErrorBoundary',
  component: ChatErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    chatId: {
      control: 'text',
      description: 'Chat session ID for error context',
    },
    provider: {
      control: 'select',
      options: ['openai', 'anthropic', 'google', 'azure', 'cohere'],
      description: 'AI provider name for error context',
    },
  },
}

export default meta
type Story = StoryObj<typeof ChatErrorBoundary>

// Component that throws an error
function ThrowError({ error }: { error?: Error }) {
  throw error || new Error('Something went wrong!')
}

// Mock chat interface
function MockChatInterface({ errorFactory }: { errorFactory?: () => Error }) {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [messages] = useState([
    { role: 'user', content: 'Hello, how are you?' },
    { role: 'assistant', content: 'I am doing well, thank you for asking!' },
    { role: 'user', content: 'Can you help me with something?' },
  ])

  if (shouldThrow) {
    throw errorFactory?.() || new Error('Chat error')
  }

  return (
    <div
      style={{
        width: '400px',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          background: '#f9fafb',
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <h3 style={{ margin: 0 }}>Chat Demo</h3>
      </div>
      <div style={{ padding: '1rem', minHeight: '200px' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              marginBottom: '0.5rem',
              textAlign: msg.role === 'user' ? 'right' : 'left',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '1rem',
                background: msg.role === 'user' ? '#3b82f6' : '#e5e7eb',
                color: msg.role === 'user' ? 'white' : 'black',
              }}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        <input
          type="text"
          placeholder="Type a message..."
          style={{
            flex: 1,
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #d1d5db',
          }}
        />
        <button
          onClick={() => setShouldThrow(true)}
          style={{
            padding: '0.5rem 1rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Simulate Error
        </button>
      </div>
    </div>
  )
}

export const Default: Story = {
  args: {
    chatId: 'chat-123',
    provider: 'openai',
    children: <ThrowError />,
  },
}

export const StreamingConnectionError: Story = {
  args: {
    chatId: 'chat-456',
    provider: 'openai',
    children: <ThrowError error={StreamingError.connectionLost('sse')} />,
    onError: (error) => console.log('Chat error:', error),
  },
}

export const StreamingErrorWithPartialContent: Story = {
  args: {
    chatId: 'chat-789',
    provider: 'anthropic',
    children: (
      <ThrowError
        error={StreamingError.connectionLost('sse', {
          partialContent:
            'The answer to life, the universe, and everything is 42. This is a reference to...',
        })}
      />
    ),
    onError: (error) => console.log('Chat error with partial content:', error),
  },
}

export const ProviderRateLimitError: Story = {
  args: {
    chatId: 'chat-rate',
    provider: 'openai',
    children: (
      <ThrowError
        error={ProviderError.rateLimit('openai', 30, 'gpt-4-turbo')}
      />
    ),
    onRetry: () => console.log('Retrying after rate limit...'),
  },
}

export const ProviderContentFilterError: Story = {
  args: {
    chatId: 'chat-filter',
    provider: 'anthropic',
    children: (
      <ThrowError
        error={ProviderError.contentFiltered('anthropic', 'claude-3-opus')}
      />
    ),
  },
}

export const ProviderContextLengthError: Story = {
  args: {
    chatId: 'chat-context',
    provider: 'openai',
    children: (
      <ThrowError
        error={ProviderError.contextLengthExceeded(
          'openai',
          128000,
          150000,
          'gpt-4-turbo'
        )}
      />
    ),
  },
}

export const ProviderServiceUnavailable: Story = {
  args: {
    chatId: 'chat-unavailable',
    provider: 'google',
    children: <ThrowError error={ProviderError.serviceUnavailable('google')} />,
  },
}

export const GenericApiError: Story = {
  args: {
    chatId: 'chat-api',
    provider: 'openai',
    children: (
      <ThrowError
        error={
          new ApiError('Failed to send message', {
            code: ApiErrorCode.SERVER_ERROR,
            statusCode: 500,
            recoverable: true,
          })
        }
      />
    ),
    onRetry: () => console.log('Retrying API call...'),
  },
}

export const InteractiveDemo: Story = {
  args: {
    chatId: 'interactive-chat',
    provider: 'openai',
    children: (
      <MockChatInterface
        errorFactory={() => StreamingError.connectionLost('sse')}
      />
    ),
    onError: (error) => console.log('Demo error:', error),
    onRetry: () => console.log('Demo retry triggered'),
  },
}

export const InteractiveProviderError: Story = {
  args: {
    chatId: 'interactive-provider',
    provider: 'anthropic',
    children: (
      <MockChatInterface
        errorFactory={() =>
          ProviderError.rateLimit('anthropic', 60, 'claude-3-sonnet')
        }
      />
    ),
    onError: (error) => console.log('Provider error:', error),
    onRetry: () => console.log('Provider retry triggered'),
  },
}

export const WithCallbacks: Story = {
  args: {
    chatId: 'callback-chat',
    provider: 'openai',
    children: <ThrowError error={StreamingError.connectionLost('sse')} />,
    onError: (error) => {
      console.log('Error logged to analytics:', error.message)
    },
    onRetry: () => {
      console.log('User initiated retry - reconnecting...')
    },
  },
}

export const MultipleChatBoundaries: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <ChatErrorBoundary chatId="chat-1" provider="openai">
        <MockChatInterface
          errorFactory={() => StreamingError.connectionLost('sse')}
        />
      </ChatErrorBoundary>
      <ChatErrorBoundary chatId="chat-2" provider="anthropic">
        <MockChatInterface
          errorFactory={() => ProviderError.rateLimit('anthropic', 45)}
        />
      </ChatErrorBoundary>
    </div>
  ),
}
