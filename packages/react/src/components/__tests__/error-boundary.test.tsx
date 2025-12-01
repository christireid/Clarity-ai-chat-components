/**
 * ErrorBoundary Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { ErrorBoundary } from '../error-boundary'

// Component that throws an error
const ThrowError: React.FC<{ shouldThrow: boolean; errorMessage?: string }> = ({
  shouldThrow,
  errorMessage = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage)
  }
  return <div>No error</div>
}

// Suppress console.error for expected errors in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})
afterEach(() => {
  console.error = originalConsoleError
})

describe('ErrorBoundary', () => {
  describe('Normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div>Child content</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })

    it('should render multiple children', () => {
      render(
        <ErrorBoundary>
          <div>First child</div>
          <div>Second child</div>
        </ErrorBoundary>
      )

      expect(screen.getByText('First child')).toBeInTheDocument()
      expect(screen.getByText('Second child')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should catch errors and display default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('should display Try Again button in fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} errorMessage="Custom error" />
        </ErrorBoundary>
      )

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Custom error' }),
        expect.objectContaining({ componentStack: expect.any(String) })
      )
    })

    it('should call logError callback when error occurs', () => {
      const logError = vi.fn()

      render(
        <ErrorBoundary logError={logError}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(logError).toHaveBeenCalledTimes(1)
      expect(logError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({ componentStack: expect.any(String) })
      )
    })
  })

  describe('Custom fallback', () => {
    it('should render custom fallback ReactNode', () => {
      render(
        <ErrorBoundary fallback={<div>Custom error UI</div>}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByText('Custom error UI')).toBeInTheDocument()
      expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
    })

    it('should render custom fallback function with error and reset', () => {
      const fallback = vi.fn((error: Error, resetError: () => void) => (
        <div>
          <span>Error: {error.message}</span>
          <button onClick={resetError}>Reset</button>
        </div>
      ))

      render(
        <ErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} errorMessage="Function fallback error" />
        </ErrorBoundary>
      )

      expect(fallback).toHaveBeenCalled()
      expect(screen.getByText('Error: Function fallback error')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument()
    })
  })

  describe('Reset functionality', () => {
    it('should reset error state when reset button is clicked', () => {
      const TestComponent: React.FC = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true)

        return (
          <div>
            <button onClick={() => setShouldThrow(false)}>Fix error</button>
            <ErrorBoundary
              fallback={(error, reset) => (
                <div>
                  <span>Error occurred</span>
                  <button
                    onClick={() => {
                      setShouldThrow(false)
                      reset()
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            >
              <ThrowError shouldThrow={shouldThrow} />
            </ErrorBoundary>
          </div>
        )
      }

      render(<TestComponent />)

      // Initially shows error
      expect(screen.getByText('Error occurred')).toBeInTheDocument()

      // Click reset
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

      // After reset, should show normal content
      expect(screen.getByText('No error')).toBeInTheDocument()
    })

    it('should call onReset callback when reset is triggered', () => {
      const onReset = vi.fn()
      const TestComponent: React.FC = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true)

        return (
          <ErrorBoundary
            onReset={onReset}
            fallback={(error, reset) => (
              <button
                onClick={() => {
                  setShouldThrow(false)
                  reset()
                }}
              >
                Reset
              </button>
            )}
          >
            <ThrowError shouldThrow={shouldThrow} />
          </ErrorBoundary>
        )
      }

      render(<TestComponent />)
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

      expect(onReset).toHaveBeenCalledTimes(1)
    })

    it('should call reset function when Try Again button is clicked', () => {
      // This test verifies that the reset mechanism is triggered
      // The actual re-render behavior depends on whether the error source is fixed
      const onReset = vi.fn()

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      // Should show error initially
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Click Try Again - this should trigger reset
      fireEvent.click(screen.getByRole('button', { name: /try again/i }))

      // onReset should have been called
      expect(onReset).toHaveBeenCalledTimes(1)
    })
  })

  describe('Reset keys', () => {
    it('should reset when resetKeys change', () => {
      const TestComponent: React.FC = () => {
        const [key, setKey] = React.useState(1)
        const [shouldThrow, setShouldThrow] = React.useState(true)

        return (
          <div>
            <button
              onClick={() => {
                setShouldThrow(false)
                setKey((k) => k + 1)
              }}
            >
              Change key
            </button>
            <ErrorBoundary resetKeys={[key]}>
              <ThrowError shouldThrow={shouldThrow} />
            </ErrorBoundary>
          </div>
        )
      }

      render(<TestComponent />)

      // Initially shows error
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()

      // Change key
      fireEvent.click(screen.getByRole('button', { name: 'Change key' }))

      // After key change, should show normal content
      expect(screen.getByText('No error')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have role="alert" on error state', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('should have accessible button in fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} />
        </ErrorBoundary>
      )

      const button = screen.getByRole('button', { name: /try again/i })
      expect(button).toBeInTheDocument()
      expect(button).not.toBeDisabled()
    })
  })

  describe('Error message display', () => {
    it('should display error message in fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError shouldThrow={true} errorMessage="Specific error message" />
        </ErrorBoundary>
      )

      expect(screen.getByText('Specific error message')).toBeInTheDocument()
    })

    it('should display default message for errors without message', () => {
      const ThrowEmptyError: React.FC = () => {
        throw new Error()
      }

      render(
        <ErrorBoundary>
          <ThrowEmptyError />
        </ErrorBoundary>
      )

      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument()
    })
  })
})
