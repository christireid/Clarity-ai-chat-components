import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { EnhancedErrorBoundary } from './EnhancedErrorBoundary'
import { ApiError, ApiErrorCode } from '../errors/api-error'
import { StreamingError } from '../errors/streaming-error'
import { ProviderError } from '../errors/provider-error'

const meta: Meta<typeof EnhancedErrorBoundary> = {
  title: 'Components/EnhancedErrorBoundary',
  component: EnhancedErrorBoundary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    enableLogging: {
      control: 'boolean',
      description: 'Enable console logging of errors',
    },
  },
}

export default meta
type Story = StoryObj<typeof EnhancedErrorBoundary>

// Component that throws an error
function ThrowError({ error }: { error?: Error }) {
  throw error || new Error('Something went wrong!')
}

// Component with button to trigger error
function ErrorTrigger({ errorFactory }: { errorFactory?: () => Error }) {
  const [shouldThrow, setShouldThrow] = useState(false)

  if (shouldThrow) {
    throw errorFactory?.() || new Error('User triggered error')
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h3 style={{ marginBottom: '1rem' }}>Click to trigger error</h3>
      <button
        onClick={() => setShouldThrow(true)}
        style={{
          padding: '0.5rem 1rem',
          fontSize: '1rem',
          cursor: 'pointer',
        }}
      >
        Throw Error
      </button>
    </div>
  )
}

export const Default: Story = {
  args: {
    children: <ThrowError />,
    enableLogging: true,
  },
}

export const WithRecoverableApiError: Story = {
  args: {
    children: (
      <ThrowError
        error={
          new ApiError('Rate limit exceeded', {
            code: ApiErrorCode.RATE_LIMITED,
            statusCode: 429,
            recoverable: true,
          })
        }
      />
    ),
    enableLogging: true,
  },
}

export const WithNonRecoverableError: Story = {
  args: {
    children: (
      <ThrowError
        error={
          new ApiError('Forbidden', {
            code: ApiErrorCode.FORBIDDEN,
            statusCode: 403,
            recoverable: false,
          })
        }
      />
    ),
    enableLogging: true,
  },
}

export const WithStreamingError: Story = {
  args: {
    children: (
      <ThrowError
        error={StreamingError.connectionLost('sse', {
          partialContent: 'The answer to your question is...',
        })}
      />
    ),
    enableLogging: true,
  },
}

export const WithProviderError: Story = {
  args: {
    children: (
      <ThrowError error={ProviderError.rateLimit('openai', 30, 'gpt-4')} />
    ),
    enableLogging: true,
  },
}

export const WithContentFilterError: Story = {
  args: {
    children: (
      <ThrowError
        error={ProviderError.contentFiltered('anthropic', 'claude-3')}
      />
    ),
    enableLogging: true,
  },
}

export const InteractiveTrigger: Story = {
  args: {
    children: <ErrorTrigger />,
    enableLogging: true,
  },
}

export const InteractiveApiError: Story = {
  args: {
    children: (
      <ErrorTrigger
        errorFactory={() =>
          new ApiError('Server Error', {
            code: ApiErrorCode.SERVER_ERROR,
            statusCode: 500,
            recoverable: true,
          })
        }
      />
    ),
    enableLogging: true,
  },
}

export const WithResetKeys: Story = {
  render: () => {
    const [key, setKey] = useState(0)

    return (
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={() => setKey((k) => k + 1)}>
            Change Reset Key (Current: {key})
          </button>
        </div>
        <EnhancedErrorBoundary resetKeys={[key]} enableLogging={true}>
          <ErrorTrigger />
        </EnhancedErrorBoundary>
      </div>
    )
  },
}

export const WithCallbacks: Story = {
  args: {
    children: <ThrowError />,
    enableLogging: true,
    onError: (error, info) => {
      console.log('Error caught by callback:', error.message)
      console.log('Component stack:', info.componentStack)
    },
    onReset: () => {
      console.log('Error boundary was reset!')
    },
  },
}

export const CustomFallbackComponent: Story = {
  args: {
    children: <ThrowError />,
    enableLogging: true,
    FallbackComponent: ({ error, resetErrorBoundary }) => (
      <div
        style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          color: 'white',
          textAlign: 'center',
          maxWidth: '400px',
        }}
      >
        <h2 style={{ marginBottom: '1rem' }}>Custom Error UI</h2>
        <p style={{ opacity: 0.9 }}>{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            background: 'white',
            color: '#764ba2',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Try Again
        </button>
      </div>
    ),
  },
}
