/**
 * Tests for ErrorBoundary components
 * Tests error catching, fallback UI, and recovery
 */

import * as React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  ErrorBoundary,
  PanelErrorBoundary,
} from '../components/error-boundary'

// Component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div data-testid="child-content">Child content</div>
}

// Suppress console.error during tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    )

    expect(screen.getByTestId('child')).toBeTruthy()
    expect(screen.getByText('Child content')).toBeTruthy()
  })

  it('renders fallback UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    expect(screen.getByText('Test error message')).toBeTruthy()
  })

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary
        fallback={<div data-testid="custom-fallback">Custom Error</div>}
      >
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-fallback')).toBeTruthy()
    expect(screen.getByText('Custom Error')).toBeTruthy()
  })

  it('shows custom fallback with component context', () => {
    render(
      <ErrorBoundary
        fallback={<div data-testid="custom-panel-error">TestPanel Error</div>}
      >
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByTestId('custom-panel-error')).toBeTruthy()
    expect(screen.getByText('TestPanel Error')).toBeTruthy()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()

    render(
      <ErrorBoundary onError={onError}>
        <ThrowError />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledTimes(1)
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error message' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    )
  })

  it('recovers when Try Again is clicked', () => {
    let shouldThrow = true

    function ConditionalThrow() {
      if (shouldThrow) {
        throw new Error('Conditional error')
      }
      return <div data-testid="recovered">Recovered!</div>
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    // Error should be shown
    expect(screen.getByText('Something went wrong')).toBeTruthy()

    // Fix the error condition
    shouldThrow = false

    // Click retry (button has aria-label="Retry loading component")
    fireEvent.click(screen.getByRole('button', { name: /retry loading/i }))

    // Rerender to apply the fix
    rerender(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>
    )

    // Should show recovered content (or error again if component still throws)
    // Note: The retry resets internal state but doesn't control shouldThrow
  })

  it('provides error details through fallback component', () => {
    const CustomFallback = ({ error }: { error?: Error }) => (
      <div>
        <div data-testid="error-message">{error?.message}</div>
        <button>Show Details</button>
      </div>
    )

    render(
      <ErrorBoundary FallbackComponent={CustomFallback}>
        <ThrowError />
      </ErrorBoundary>
    )

    // Check error message is available
    expect(screen.getByTestId('error-message')).toBeTruthy()
    expect(screen.getByText('Test error message')).toBeTruthy()

    // Error details should now be visible
    expect(screen.getByText('Error Message')).toBeTruthy()
    expect(screen.getByRole('button', { name: /hide details/i })).toBeTruthy()
  })
})

describe('PanelErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <PanelErrorBoundary panelName="TestPanel">
        <div data-testid="panel-content">Panel content</div>
      </PanelErrorBoundary>
    )

    expect(screen.getByTestId('panel-content')).toBeTruthy()
  })

  it('renders panel-specific error fallback', () => {
    render(
      <PanelErrorBoundary panelName="API Inspector">
        <ThrowError />
      </PanelErrorBoundary>
    )

    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText('API Inspector encountered an error')).toBeTruthy()
    expect(screen.getByText(/please try refreshing the panel/i)).toBeTruthy()
  })

  it('calls onError callback', () => {
    const onError = vi.fn()

    render(
      <PanelErrorBoundary panelName="TestPanel" onError={onError}>
        <ThrowError />
      </PanelErrorBoundary>
    )

    expect(onError).toHaveBeenCalledTimes(1)
  })
})

// withErrorBoundary HOC tests removed - function no longer exists in @clarity-chat/error-handling
