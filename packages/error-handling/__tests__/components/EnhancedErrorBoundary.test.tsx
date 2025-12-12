import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { EnhancedErrorBoundary, ChatErrorBoundary } from '../../src'
import { ApiError, ApiErrorCode } from '../../src/errors/api-error'
import {
  StreamingError,
  StreamingErrorCode,
} from '../../src/errors/streaming-error'
import {
  ProviderError,
  ProviderErrorCode,
} from '../../src/errors/provider-error'

// Component that throws an error
function ThrowingComponent({ error }: { error: Error }) {
  throw error
}

// Component that doesn't throw
function SafeComponent() {
  return <div>Safe content</div>
}

describe('EnhancedErrorBoundary', () => {
  // Suppress error boundary console errors in tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  it('should render children when no error', () => {
    render(
      <EnhancedErrorBoundary>
        <SafeComponent />
      </EnhancedErrorBoundary>
    )

    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('should render fallback when error occurs', () => {
    const error = new Error('Test error')

    render(
      <EnhancedErrorBoundary>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
  })

  it('should call onError when error occurs', () => {
    const onError = vi.fn()
    const error = new Error('Test error')

    render(
      <EnhancedErrorBoundary onError={onError}>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(error, expect.any(Object))
  })

  it('should show retry button for recoverable errors', () => {
    const error = new ApiError('Not found', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })

    render(
      <EnhancedErrorBoundary>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(screen.getByText('Try again')).toBeInTheDocument()
  })

  it('should not show retry button for non-recoverable errors', () => {
    const error = new ApiError('Server error', {
      code: ApiErrorCode.SERVER_ERROR,
      statusCode: 500,
    })

    render(
      <EnhancedErrorBoundary>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(screen.queryByText('Try again')).not.toBeInTheDocument()
  })

  it('should display user-friendly message for ClarityError', () => {
    const error = new ApiError('Not found', {
      code: ApiErrorCode.NOT_FOUND,
      statusCode: 404,
    })

    render(
      <EnhancedErrorBoundary>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(
      screen.getByText('The requested resource could not be found.')
    ).toBeInTheDocument()
  })

  it('should render custom fallback', () => {
    const error = new Error('Test')

    render(
      <EnhancedErrorBoundary fallback={<div>Custom fallback</div>}>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(screen.getByText('Custom fallback')).toBeInTheDocument()
  })

  it('should render custom FallbackComponent', () => {
    const CustomFallback = ({
      error,
      resetErrorBoundary,
    }: {
      error: Error
      resetErrorBoundary: () => void
    }) => (
      <div>
        <p>Custom: {error.message}</p>
        <button onClick={resetErrorBoundary}>Reset</button>
      </div>
    )

    const error = new Error('Custom error message')

    render(
      <EnhancedErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowingComponent error={error} />
      </EnhancedErrorBoundary>
    )

    expect(screen.getByText('Custom: Custom error message')).toBeInTheDocument()
    expect(screen.getByText('Reset')).toBeInTheDocument()
  })
})

describe('ChatErrorBoundary', () => {
  // Suppress error boundary console errors in tests
  const originalError = console.error
  beforeEach(() => {
    console.error = vi.fn()
  })

  afterEach(() => {
    console.error = originalError
  })

  it('should render children when no error', () => {
    render(
      <ChatErrorBoundary>
        <SafeComponent />
      </ChatErrorBoundary>
    )

    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('should display streaming error correctly', () => {
    const error = new StreamingError('Connection lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'sse',
    })

    render(
      <ChatErrorBoundary>
        <ThrowingComponent error={error} />
      </ChatErrorBoundary>
    )

    expect(screen.getByText('Connection Error')).toBeInTheDocument()
  })

  it('should display provider error correctly', () => {
    const error = new ProviderError('Rate limit exceeded', {
      code: ProviderErrorCode.RATE_LIMIT,
      provider: 'openai',
      retryAfter: 30,
    })

    render(
      <ChatErrorBoundary provider="openai">
        <ThrowingComponent error={error} />
      </ChatErrorBoundary>
    )

    expect(screen.getByText('Openai Error')).toBeInTheDocument()
    // Multiple elements may contain "30 seconds" (user message and retry countdown)
    const elements = screen.getAllByText(/30 seconds/)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('should show partial content message for streaming errors', () => {
    const error = new StreamingError('Connection lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'sse',
      partialContent: 'Hello, I am...',
    })

    render(
      <ChatErrorBoundary>
        <ThrowingComponent error={error} />
      </ChatErrorBoundary>
    )

    expect(
      screen.getByText(/partial response has been preserved/)
    ).toBeInTheDocument()
  })

  it('should call onError with chat context', () => {
    const onError = vi.fn()
    const error = new Error('Test')

    render(
      <ChatErrorBoundary chatId="chat-123" provider="openai" onError={onError}>
        <ThrowingComponent error={error} />
      </ChatErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(error)
  })

  it('should call onRetry when retry button clicked', () => {
    const onRetry = vi.fn()
    const error = new StreamingError('Connection lost', {
      code: StreamingErrorCode.CONNECTION_LOST,
      transport: 'sse',
    })

    render(
      <ChatErrorBoundary onRetry={onRetry}>
        <ThrowingComponent error={error} />
      </ChatErrorBoundary>
    )

    fireEvent.click(screen.getByText('Retry'))
    expect(onRetry).toHaveBeenCalled()
  })
})
