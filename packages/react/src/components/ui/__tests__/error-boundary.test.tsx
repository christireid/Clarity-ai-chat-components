/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ContentErrorBoundary,
  InlineContentErrorBoundary,
  MediaErrorBoundary,
  AsyncContentErrorBoundary,
  BaseErrorBoundary,
  ContentErrorFallback,
  InlineErrorFallback,
  EmptyStateErrorFallback,
  useErrorHandler,
  useAsyncErrorHandler,
  withErrorBoundary,
  ResilientErrorBoundary,
  errorReporter,
} from '../error-boundary'

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

// Component that throws an error
const ThrowError = ({ message = 'Test error' }: { message?: string }) => {
  throw new Error(message)
}

// Component that throws error on button click
const ThrowOnClick = () => {
  const [shouldThrow, setShouldThrow] = React.useState(false)

  if (shouldThrow) {
    throw new Error('Button error')
  }

  return (
    <button onClick={() => setShouldThrow(true)}>
      Throw Error
    </button>
  )
}

// Async component that throws error
const AsyncThrowError = () => {
  React.useEffect(() => {
    throw new Error('Async error')
  }, [])

  return <div>Async Component</div>
}

describe('Error Boundary Components', () => {
  beforeEach(() => {
    errorReporter.clearReports()
  })

  describe('BaseErrorBoundary', () => {
    it('should render children when no error', () => {
      render(
        <BaseErrorBoundary>
          <div>Normal content</div>
        </BaseErrorBoundary>
      )

      expect(screen.getByText('Normal content')).toBeInTheDocument()
    })

    it('should render fallback when error occurs', () => {
      render(
        <BaseErrorBoundary>
          <ThrowError />
        </BaseErrorBoundary>
      )

      expect(screen.getByText('Content Error')).toBeInTheDocument()
      expect(screen.getByText(/Test error/)).toBeInTheDocument()
    })

    it('should call onError callback when error occurs', () => {
      const mockOnError = jest.fn()

      render(
        <BaseErrorBoundary onError={mockOnError}>
          <ThrowError />
        </BaseErrorBoundary>
      )

      expect(mockOnError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object)
      )
    })

    it('should reset error when resetError is called', async () => {
      const user = userEvent.setup()

      render(
        <BaseErrorBoundary>
          <ThrowOnClick />
        </BaseErrorBoundary>
      )

      // Initially normal
      expect(screen.getByRole('button', { name: 'Throw Error' })).toBeInTheDocument()

      // Click to throw error
      await user.click(screen.getByRole('button', { name: 'Throw Error' }))

      // Should show fallback
      expect(screen.getByText('Content Error')).toBeInTheDocument()

      // Click reset button
      await user.click(screen.getByRole('button', { name: 'Try Again' }))

      // Should be back to normal
      expect(screen.getByRole('button', { name: 'Throw Error' })).toBeInTheDocument()
    })

    it('should reset error when resetKeys change', () => {
      const { rerender } = render(
        <BaseErrorBoundary resetKeys={[1]}>
          <ThrowError />
        </BaseErrorBoundary>
      )

      expect(screen.getByText('Content Error')).toBeInTheDocument()

      // Change reset key
      rerender(
        <BaseErrorBoundary resetKeys={[2]}>
          <div>Recovered</div>
        </BaseErrorBoundary>
      )

      expect(screen.getByText('Recovered')).toBeInTheDocument()
    })
  })

  describe('ContentErrorBoundary', () => {
    it('should render ContentErrorFallback by default', () => {
      render(
        <ContentErrorBoundary>
          <ThrowError />
        </ContentErrorBoundary>
      )

      expect(screen.getByText('Content Error')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
    })

    it('should use custom fallback when provided', () => {
      const CustomFallback = () => <div>Custom Error</div>

      render(
        <ContentErrorBoundary fallback={CustomFallback}>
          <ThrowError />
        </ContentErrorBoundary>
      )

      expect(screen.getByText('Custom Error')).toBeInTheDocument()
    })
  })

  describe('InlineContentErrorBoundary', () => {
    it('should render InlineErrorFallback', () => {
      render(
        <InlineContentErrorBoundary>
          <ThrowError />
        </InlineContentErrorBoundary>
      )

      expect(screen.getByText('Error')).toBeInTheDocument()
    })
  })

  describe('MediaErrorBoundary', () => {
    it('should render media-specific fallback', () => {
      render(
        <MediaErrorBoundary>
          <ThrowError />
        </MediaErrorBoundary>
      )

      expect(screen.getByText(/failed to load/)).toBeInTheDocument()
    })
  })

  describe('AsyncContentErrorBoundary', () => {
    it('should handle async errors', async () => {
      render(
        <AsyncContentErrorBoundary>
          <AsyncThrowError />
        </AsyncContentErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText(/Failed to Load/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Fallback Components', () => {
    const mockError = new Error('Test error')
    const mockReset = jest.fn()

    describe('ContentErrorFallback', () => {
      it('should render error message and reset button', () => {
        render(
          <ContentErrorFallback
            error={mockError}
            resetError={mockReset}
          />
        )

        expect(screen.getByText('Content Error')).toBeInTheDocument()
        expect(screen.getByText('Test error')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument()
      })

      it('should show error details when showDetails is true', () => {
        render(
          <ContentErrorFallback
            error={mockError}
            resetError={mockReset}
            showDetails={true}
          />
        )

        expect(screen.getByText('Error Details')).toBeInTheDocument()
      })

      it('should toggle debug info', async () => {
        const user = userEvent.setup()

        render(
          <ContentErrorFallback
            error={mockError}
            resetError={mockReset}
          />
        )

        const debugButton = screen.getByRole('button', { name: 'Debug' })
        await user.click(debugButton)

        expect(screen.getByText('Error Stack:')).toBeInTheDocument()
      })
    })

    describe('InlineErrorFallback', () => {
      it('should render compact error display', () => {
        render(
          <InlineErrorFallback
            error={mockError}
            resetError={mockReset}
          />
        )

        expect(screen.getByText('Error')).toBeInTheDocument()
      })
    })

    describe('EmptyStateErrorFallback', () => {
      it('should render empty state error', () => {
        render(
          <EmptyStateErrorFallback
            error={mockError}
            resetError={mockReset}
          />
        )

        expect(screen.getByText('Unable to Load Content')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
      })
    })
  })

  describe('Error Handling Hooks', () => {
    describe('useErrorHandler', () => {
      it('should throw error when set', () => {
        const ErrorComponent = () => {
          const { handleError } = useErrorHandler()

          React.useEffect(() => {
            handleError(new Error('Hook error'))
          }, [handleError])

          return <div>Should not render</div>
        }

        expect(() => {
          render(
            <ContentErrorBoundary>
              <ErrorComponent />
            </ContentErrorBoundary>
          )
        }).toThrow('Hook error')
      })

      it('should reset error state', () => {
        const { result } = renderHook(() => useErrorHandler())

        act(() => {
          result.current.handleError(new Error('Test'))
        })

        expect(result.current.hasError).toBe(true)

        act(() => {
          result.current.resetError()
        })

        expect(result.current.hasError).toBe(false)
      })
    })

    describe('useAsyncErrorHandler', () => {
      it('should handle async errors', () => {
        const { result } = renderHook(() => useAsyncErrorHandler())

        act(() => {
          result.current.handleAsyncError(new Error('Async error'))
        })

        expect(result.current.hasAsyncError).toBe(true)
        expect(result.current.asyncError?.message).toBe('Async error')
      })

      it('should wrap async functions', async () => {
        const { result } = renderHook(() => useAsyncErrorHandler())

        const asyncFn = result.current.wrapAsync(async () => {
          throw new Error('Wrapped error')
        })

        await expect(asyncFn()).resolves.toBeUndefined()
        expect(result.current.hasAsyncError).toBe(true)
      })
    })
  })

  describe('Higher-Order Component', () => {
    it('should wrap component with error boundary', () => {
      const TestComponent = () => <ThrowError />
      const WrappedComponent = withErrorBoundary(TestComponent)

      render(<WrappedComponent />)

      expect(screen.getByText('Content Error')).toBeInTheDocument()
    })
  })

  describe('ResilientErrorBoundary', () => {
    it('should auto-retry on error', async () => {
      let throwCount = 0

      const RetryComponent = () => {
        throwCount++
        if (throwCount <= 2) {
          throw new Error(`Error ${throwCount}`)
        }
        return <div>Success</div>
      }

      render(
        <ResilientErrorBoundary maxRetries={3} resetTimeout={100}>
          <RetryComponent />
        </ResilientErrorBoundary>
      )

      // Should eventually succeed
      await waitFor(() => {
        expect(screen.getByText('Success')).toBeInTheDocument()
      }, { timeout: 1000 })
    })

    it('should show fallback after max retries', async () => {
      const AlwaysThrow = () => {
        throw new Error('Always fails')
      }

      render(
        <ResilientErrorBoundary maxRetries={2} resetTimeout={50}>
          <AlwaysThrow />
        </ResilientErrorBoundary>
      )

      await waitFor(() => {
        expect(screen.getByText('Content Error')).toBeInTheDocument()
      })
    })
  })

  describe('Error Reporting', () => {
    it('should report errors by default', () => {
      render(
        <ContentErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ContentErrorBoundary>
      )

      const reports = errorReporter.getReports()
      expect(reports).toHaveLength(1)
      expect(reports[0].componentName).toBe('TestComponent')
      expect(reports[0].error.message).toBe('Test error')
    })

    it('should not report when disabled', () => {
      render(
        <ContentErrorBoundary enableReporting={false}>
          <ThrowError />
        </ContentErrorBoundary>
      )

      const reports = errorReporter.getReports()
      expect(reports).toHaveLength(0)
    })

    it('should provide error summary', () => {
      // Report multiple errors
      errorReporter.report({
        componentName: 'ComponentA',
        error: { name: 'Error', message: 'Error 1' },
      })
      errorReporter.report({
        componentName: 'ComponentA',
        error: { name: 'Error', message: 'Error 2' },
      })
      errorReporter.report({
        componentName: 'ComponentB',
        error: { name: 'Error', message: 'Error 3' },
      })

      const summary = errorReporter.getErrorSummary()

      expect(summary.totalErrors).toBe(3)
      expect(summary.errorsByComponent.ComponentA).toBe(2)
      expect(summary.errorsByComponent.ComponentB).toBe(1)
    })
  })
})

// Helper for renderHook (simplified implementation)
function renderHook<T>(hook: () => T) {
  let result: { current: T } = { current: undefined as any }

  const TestComponent = () => {
    result.current = hook()
    return null
  }

  const renderResult = render(<TestComponent />)

  return { result, ...renderResult }
}

// Helper for act
const act = (fn: () => void) => {
  fn()
}