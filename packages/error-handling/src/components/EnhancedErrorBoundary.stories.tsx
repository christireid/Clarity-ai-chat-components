import type { Meta, StoryObj } from '@storybook/react'
import { useState, useCallback } from 'react'
import { EnhancedErrorBoundary } from './EnhancedErrorBoundary'
import { RetryCountdown } from './RetryCountdown'
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

// Component that can trigger errors on demand with type selection
function InteractiveErrorTrigger({
  errorType,
  shouldThrow,
}: {
  errorType: string
  shouldThrow: boolean
}) {
  if (shouldThrow) {
    switch (errorType) {
      case 'api-429':
        throw new ApiError('Rate limit exceeded', {
          code: ApiErrorCode.RATE_LIMITED,
          statusCode: 429,
        })
      case 'api-500':
        throw new ApiError('Internal server error', {
          code: ApiErrorCode.SERVER_ERROR,
          statusCode: 500,
        })
      case 'api-403':
        throw new ApiError('Access forbidden', {
          code: ApiErrorCode.FORBIDDEN,
          statusCode: 403,
        })
      case 'streaming-lost':
        throw StreamingError.connectionLost(
          'sse',
          'Partial message before disconnect...'
        )
      case 'streaming-timeout':
        throw StreamingError.timeout('sse', 30000)
      case 'provider-rate':
        throw ProviderError.rateLimit('openai', 30, 'gpt-4')
      case 'provider-context':
        throw ProviderError.contextLengthExceeded('anthropic', 100000, 200000)
      case 'provider-filter':
        throw ProviderError.contentFiltered('openai', 'gpt-4')
      case 'generic':
      default:
        throw new Error('Something went wrong!')
    }
  }

  return (
    <div
      style={{
        padding: '2rem',
        backgroundColor: '#f0fdf4',
        borderRadius: '0.5rem',
        textAlign: 'center',
      }}
    >
      <p style={{ color: '#16a34a', fontWeight: 500 }}>
        ✓ Component is working normally
      </p>
    </div>
  )
}

// Interactive story with full controls
function InteractiveErrorBoundaryDemo() {
  const [shouldThrow, setShouldThrow] = useState(false)
  const [errorType, setErrorType] = useState<string>('generic')
  const [key, setKey] = useState(0)
  const [lastError, setLastError] = useState<string | null>(null)
  const [errorCount, setErrorCount] = useState(0)

  const handleError = useCallback((error: Error) => {
    setLastError(error.message)
    setErrorCount((c) => c + 1)
  }, [])

  const handleReset = useCallback(() => {
    setShouldThrow(false)
    setLastError(null)
  }, [])

  const triggerError = () => {
    setKey((k) => k + 1)
    setShouldThrow(true)
  }

  const reset = () => {
    setKey((k) => k + 1)
    setShouldThrow(false)
    setLastError(null)
  }

  return (
    <div style={{ width: '450px' }}>
      {/* Controls Panel */}
      <div
        style={{
          marginBottom: '1rem',
          padding: '1rem',
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          color: 'white',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          🎮 Error Boundary Controls
        </h4>

        <div style={{ marginBottom: '0.75rem' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}
          >
            Error Type:
          </label>
          <select
            value={errorType}
            onChange={(e) => setErrorType(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '0.25rem',
              border: '1px solid #374151',
              backgroundColor: '#374151',
              color: 'white',
              fontSize: '0.875rem',
            }}
          >
            <optgroup label="Generic">
              <option value="generic">Generic Error</option>
            </optgroup>
            <optgroup label="API Errors">
              <option value="api-429">API: Rate Limited (429)</option>
              <option value="api-500">API: Server Error (500)</option>
              <option value="api-403">API: Forbidden (403)</option>
            </optgroup>
            <optgroup label="Streaming Errors">
              <option value="streaming-lost">Streaming: Connection Lost</option>
              <option value="streaming-timeout">Streaming: Timeout</option>
            </optgroup>
            <optgroup label="Provider Errors">
              <option value="provider-rate">Provider: Rate Limit</option>
              <option value="provider-context">Provider: Context Length</option>
              <option value="provider-filter">Provider: Content Filter</option>
            </optgroup>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={triggerError}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            🔥 Trigger Error
          </button>
          <button
            onClick={reset}
            style={{
              flex: 1,
              padding: '0.5rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* State Display */}
      <div
        style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fef3c7',
          borderRadius: '0.5rem',
          fontSize: '0.75rem',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '0.5rem',
          }}
        >
          <div>
            <strong>Status:</strong> {shouldThrow ? '❌ Error' : '✅ OK'}
          </div>
          <div>
            <strong>Total Errors:</strong> {errorCount}
          </div>
        </div>
        {lastError && (
          <div style={{ marginTop: '0.5rem', color: '#b45309' }}>
            <strong>Last:</strong> {lastError.substring(0, 50)}
            {lastError.length > 50 ? '...' : ''}
          </div>
        )}
      </div>

      {/* Error Boundary */}
      <EnhancedErrorBoundary
        key={key}
        onError={handleError}
        onReset={handleReset}
        enableLogging
      >
        <InteractiveErrorTrigger
          errorType={errorType}
          shouldThrow={shouldThrow}
        />
      </EnhancedErrorBoundary>
    </div>
  )
}

export const Interactive: Story = {
  render: () => <InteractiveErrorBoundaryDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo with controls to trigger different error types and observe the error boundary behavior.',
      },
    },
  },
}

// Retry Countdown demo
function RetryCountdownDemo() {
  const [isRetrying, setIsRetrying] = useState(false)
  const [retryMs, setRetryMs] = useState(5000)
  const [showProgress, setShowProgress] = useState(true)
  const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [completedCount, setCompletedCount] = useState(0)

  return (
    <div style={{ width: '400px' }}>
      {/* Controls */}
      <div
        style={{
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          color: 'white',
        }}
      >
        <h4
          style={{
            margin: '0 0 0.75rem 0',
            fontSize: '0.875rem',
            fontWeight: 600,
          }}
        >
          ⏱️ Countdown Controls
        </h4>

        <div style={{ marginBottom: '0.75rem' }}>
          <label
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem',
              fontSize: '0.75rem',
              color: '#9ca3af',
            }}
          >
            <span>Retry Delay:</span>
            <span>{retryMs / 1000}s</span>
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="1000"
            value={retryMs}
            onChange={(e) => setRetryMs(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <div
          style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                marginBottom: '0.25rem',
                fontSize: '0.75rem',
                color: '#9ca3af',
              }}
            >
              Size:
            </label>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as 'sm' | 'md' | 'lg')}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.25rem',
                border: '1px solid #374151',
                backgroundColor: '#374151',
                color: 'white',
                fontSize: '0.875rem',
              }}
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.75rem',
                padding: '0.5rem',
                color: '#9ca3af',
              }}
            >
              <input
                type="checkbox"
                checked={showProgress}
                onChange={(e) => setShowProgress(e.target.checked)}
              />
              Show Progress
            </label>
          </div>
        </div>

        <button
          onClick={() => setIsRetrying(true)}
          disabled={isRetrying}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: isRetrying ? '#6b7280' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: isRetrying ? 'not-allowed' : 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          {isRetrying ? '⏳ Running...' : '▶️ Start Countdown'}
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          marginBottom: '1rem',
          padding: '0.75rem',
          backgroundColor: '#dbeafe',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          textAlign: 'center',
        }}
      >
        Countdown completed: <strong>{completedCount}</strong> times
      </div>

      {/* Countdown Display */}
      <div
        style={{
          padding: '2rem',
          backgroundColor: isRetrying ? '#fef2f2' : '#f9fafb',
          borderRadius: '0.5rem',
          minHeight: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isRetrying ? '2px solid #fecaca' : '2px solid #e5e7eb',
        }}
      >
        {isRetrying ? (
          <RetryCountdown
            remainingMs={retryMs}
            showProgress={showProgress}
            size={size}
            onComplete={() => {
              setIsRetrying(false)
              setCompletedCount((c) => c + 1)
            }}
            onRetryNow={() => {
              setIsRetrying(false)
              setCompletedCount((c) => c + 1)
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#6b7280' }}>
            <p style={{ marginBottom: '0.5rem' }}>
              Click "Start Countdown" to see the retry timer
            </p>
            <p style={{ fontSize: '0.75rem' }}>
              This component shows users when automatic retry will occur
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const RetryCountdownInteractive: Story = {
  render: () => <RetryCountdownDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Interactive demo of the RetryCountdown component with adjustable delay, size, and progress ring visibility.',
      },
    },
  },
}

// Static stories for documentation
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
        error={StreamingError.connectionLost(
          'sse',
          'The answer to your question is...'
        )}
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

export const InteractiveTrigger: Story = {
  args: {
    children: <ErrorTrigger />,
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
        <h2 style={{ marginBottom: '1rem' }}>🎨 Custom Error UI</h2>
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
