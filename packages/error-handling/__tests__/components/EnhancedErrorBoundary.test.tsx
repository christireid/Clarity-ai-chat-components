import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

// Mock matchMedia for reduced motion detection
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

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

    expect(screen.getByText('Connection Lost')).toBeInTheDocument()
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

    // ChatErrorBoundary now shows "Please Wait" for rate limit errors
    expect(screen.getByText('Please Wait')).toBeInTheDocument()
    // The countdown shows 30 in the timer
    expect(screen.getByText('30')).toBeInTheDocument()
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

    // The component now shows a different message for partial content
    expect(
      screen.getByText(/Response preserved - you can continue/)
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

  it('should call onRetry when retry button clicked', async () => {
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

    // The button text is now "Try Again"
    fireEvent.click(screen.getByText('Try Again'))

    // Wait for the async retry delay (400ms) to complete
    await waitFor(() => {
      expect(onRetry).toHaveBeenCalled()
    })
  })
})
