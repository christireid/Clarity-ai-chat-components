/**
 * PromptArchitectErrorBoundary Component Tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import * as React from 'react'
import { PromptArchitectErrorBoundary } from '../components/PromptArchitectErrorBoundary'

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

describe('PromptArchitectErrorBoundary', () => {
  describe('Normal rendering', () => {
    it('should render children when no error occurs', () => {
      render(
        <PromptArchitectErrorBoundary>
          <div>Child content</div>
        </PromptArchitectErrorBoundary>
      )

      expect(screen.getByText('Child content')).toBeInTheDocument()
    })
  })

  describe('Error handling', () => {
    it('should catch errors and display fallback', () => {
      render(
        <PromptArchitectErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PromptArchitectErrorBoundary>
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.getByText('Test error')).toBeInTheDocument()
    })

    it('should display Try Again button in fallback', () => {
      render(
        <PromptArchitectErrorBoundary>
          <ThrowError shouldThrow={true} />
        </PromptArchitectErrorBoundary>
      )

      expect(
        screen.getByRole('button', { name: /try again/i })
      ).toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const onError = vi.fn()

      render(
        <PromptArchitectErrorBoundary onError={onError}>
          <ThrowError shouldThrow={true} errorMessage="Custom error" />
        </PromptArchitectErrorBoundary>
      )

      expect(onError).toHaveBeenCalledTimes(1)
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Custom error' }),
        expect.objectContaining({ componentStack: expect.any(String) })
      )
    })
  })

  describe('Custom fallback', () => {
    it('should render custom fallback function', () => {
      const fallback = vi.fn(({ error, resetError }) => (
        <div>
          <span>Custom error: {error.message}</span>
          <button onClick={resetError}>Custom Reset</button>
        </div>
      ))

      render(
        <PromptArchitectErrorBoundary fallback={fallback}>
          <ThrowError shouldThrow={true} errorMessage="Fallback test error" />
        </PromptArchitectErrorBoundary>
      )

      expect(fallback).toHaveBeenCalled()
      expect(
        screen.getByText('Custom error: Fallback test error')
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: 'Custom Reset' })
      ).toBeInTheDocument()
    })
  })

  describe('Reset functionality', () => {
    it('should reset error state when reset button is clicked', () => {
      const TestComponent: React.FC = () => {
        const [shouldThrow, setShouldThrow] = React.useState(true)

        return (
          <div>
            <PromptArchitectErrorBoundary
              fallback={({ error, resetError }) => (
                <div>
                  <span>Error occurred</span>
                  <button
                    onClick={() => {
                      setShouldThrow(false)
                      resetError()
                    }}
                  >
                    Reset
                  </button>
                </div>
              )}
            >
              <ThrowError shouldThrow={shouldThrow} />
            </PromptArchitectErrorBoundary>
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
          <PromptArchitectErrorBoundary
            onReset={onReset}
            fallback={({ resetError }) => (
              <button
                onClick={() => {
                  setShouldThrow(false)
                  resetError()
                }}
              >
                Reset
              </button>
            )}
          >
            <ThrowError shouldThrow={shouldThrow} />
          </PromptArchitectErrorBoundary>
        )
      }

      render(<TestComponent />)
      fireEvent.click(screen.getByRole('button', { name: 'Reset' }))

      expect(onReset).toHaveBeenCalledTimes(1)
    })
  })
})
