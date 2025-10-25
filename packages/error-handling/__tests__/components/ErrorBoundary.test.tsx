import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ErrorBoundary } from '../../src/components/ErrorBoundary'
import { ConfigurationError } from '../../src/errors'

// Component that throws an error
function ThrowError({ error }: { error?: Error }) {
  if (error) {
    throw error
  }
  throw new Error('Test error')
}

// Component with conditional error
function ConditionalError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Conditional error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    )

    expect(screen.getByText('Child component')).toBeInTheDocument()
  })

  it('should catch error and render default fallback', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    const customFallback = ({ error }: { error: Error; resetError: () => void }) => (
      <div>
        <h1>Custom Error UI</h1>
        <p>{error.message}</p>
      </div>
    )

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
    expect(screen.getByText('Test error')).toBeInTheDocument()
  })

  it('should call onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalled()
    const [error, errorInfo] = onError.mock.calls[0] as [Error, any]
    expect(error.message).toBe('Test error')
    expect(errorInfo).toBeDefined()
  })

  it('should display solution for ClarityChatError', () => {
    const error = new ConfigurationError('Missing config', {
      code: 'MISSING_CONFIG',
      solution: 'Add the required configuration',
    })

    render(
      <ErrorBoundary>
        <ThrowError error={error} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/💡 Solution:/)).toBeInTheDocument()
    expect(screen.getByText('Add the required configuration')).toBeInTheDocument()
  })

  it('should reset error when resetError is called', async () => {
    let shouldThrow = true

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    // Error should be caught
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()

    // Change condition
    shouldThrow = false

    // Click reset button
    const resetButton = screen.getByText(/try again/i)
    fireEvent.click(resetButton)

    // Rerender with no error
    rerender(
      <ErrorBoundary>
        <ConditionalError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    )

    // Should show content, not error
    await waitFor(() => {
      expect(screen.queryByText(/something went wrong/i)).not.toBeInTheDocument()
    })
  })

  it('should call onReset callback when error is reset', () => {
    const onReset = vi.fn()

    render(
      <ErrorBoundary onReset={onReset}>
        <ThrowError />
      </ErrorBoundary>
    )

    const resetButton = screen.getByText(/try again/i)
    fireEvent.click(resetButton)

    expect(onReset).toHaveBeenCalled()
  })

  it('should show stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    const details = screen.getByText('Stack trace')
    expect(details).toBeInTheDocument()

    process.env.NODE_ENV = originalEnv
  })

  it('should handle errors from nested components', () => {
    render(
      <ErrorBoundary>
        <div>
          <div>
            <ThrowError />
          </div>
        </div>
      </ErrorBoundary>
    )

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('should maintain separate error state for multiple boundaries', () => {
    render(
      <div>
        <ErrorBoundary>
          <ThrowError error={new Error('Error 1')} />
        </ErrorBoundary>
        <ErrorBoundary>
          <ThrowError error={new Error('Error 2')} />
        </ErrorBoundary>
      </div>
    )

    expect(screen.getByText('Error 1')).toBeInTheDocument()
    expect(screen.getByText('Error 2')).toBeInTheDocument()
  })

  it('should provide resetError function in fallback', () => {
    const fallback = ({ resetError }: { error: Error; resetError: () => void }) => (
      <div>
        <button onClick={resetError}>Custom Reset</button>
      </div>
    )

    render(
      <ErrorBoundary fallback={fallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    const resetButton = screen.getByText('Custom Reset')
    expect(resetButton).toBeInTheDocument()
    
    // Should be able to click without errors
    fireEvent.click(resetButton)
  })
})
