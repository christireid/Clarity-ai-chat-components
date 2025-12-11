/**
 * Tests for ErrorBoundaryDevTools component
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react'
import {
  ErrorBoundaryDevTools,
  useDevToolsRegistration,
} from '../../src/components/ErrorBoundaryDevTools'
import { ErrorAnalyticsProvider } from '../../src/hooks/useErrorAnalytics'

// Store original NODE_ENV
const originalEnv = process.env['NODE_ENV']

describe('ErrorBoundaryDevTools', () => {
  beforeEach(() => {
    // Set to development for tests
    process.env['NODE_ENV'] = 'development'
  })

  afterEach(() => {
    process.env['NODE_ENV'] = originalEnv
  })

  describe('production mode', () => {
    it('should only render children in production', () => {
      process.env['NODE_ENV'] = 'production'

      render(
        <ErrorBoundaryDevTools>
          <div data-testid="child">Child content</div>
        </ErrorBoundaryDevTools>
      )

      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.queryByText('Error DevTools')).not.toBeInTheDocument()
    })
  })

  describe('development mode', () => {
    it('should render toggle button by default', () => {
      render(
        <ErrorBoundaryDevTools>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      expect(screen.getByText('Error DevTools')).toBeInTheDocument()
    })

    it('should render panel when defaultOpen is true', () => {
      render(
        <ErrorBoundaryDevTools defaultOpen>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      expect(screen.getByText('🛠️ Error Boundary DevTools')).toBeInTheDocument()
    })

    it('should open panel when toggle button clicked', () => {
      render(
        <ErrorBoundaryDevTools>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      fireEvent.click(screen.getByText('Error DevTools'))

      expect(screen.getByText('🛠️ Error Boundary DevTools')).toBeInTheDocument()
    })

    it('should close panel when close button clicked', () => {
      render(
        <ErrorBoundaryDevTools defaultOpen>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      fireEvent.click(screen.getByText('✕'))

      expect(
        screen.queryByText('🛠️ Error Boundary DevTools')
      ).not.toBeInTheDocument()
      expect(screen.getByText('Error DevTools')).toBeInTheDocument()
    })

    it('should show "No error boundaries registered" when empty', () => {
      render(
        <ErrorBoundaryDevTools defaultOpen>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      expect(
        screen.getByText('No error boundaries registered')
      ).toBeInTheDocument()
    })

    it('should show stats when ErrorAnalyticsProvider is present', () => {
      render(
        <ErrorAnalyticsProvider>
          <ErrorBoundaryDevTools defaultOpen>
            <div>Child content</div>
          </ErrorBoundaryDevTools>
        </ErrorAnalyticsProvider>
      )

      expect(screen.getByText('Total Errors')).toBeInTheDocument()
      expect(screen.getByText('Retry Rate')).toBeInTheDocument()
      expect(screen.getByText('Circuit Trips')).toBeInTheDocument()
    })

    it('should have Trigger Test Error button', () => {
      render(
        <ErrorBoundaryDevTools defaultOpen>
          <div>Child content</div>
        </ErrorBoundaryDevTools>
      )

      expect(screen.getByText('Trigger Test Error')).toBeInTheDocument()
    })

    it('should have Export Data button when analytics available', () => {
      render(
        <ErrorAnalyticsProvider>
          <ErrorBoundaryDevTools defaultOpen>
            <div>Child content</div>
          </ErrorBoundaryDevTools>
        </ErrorAnalyticsProvider>
      )

      expect(screen.getByText('Export Data')).toBeInTheDocument()
    })
  })
})

describe('useDevToolsRegistration', () => {
  beforeEach(() => {
    process.env['NODE_ENV'] = 'development'
  })

  afterEach(() => {
    process.env['NODE_ENV'] = originalEnv
  })

  it('should return update function', () => {
    function TestComponent() {
      const updateInfo = useDevToolsRegistration('test-id', 'Test Boundary')
      return (
        <button onClick={() => updateInfo({ hasError: true })}>Update</button>
      )
    }

    render(
      <ErrorBoundaryDevTools>
        <TestComponent />
      </ErrorBoundaryDevTools>
    )

    expect(screen.getByText('Update')).toBeInTheDocument()
  })

  it('should register boundary with dev tools', () => {
    function TestBoundary() {
      useDevToolsRegistration('test-boundary', 'My Test Boundary')
      return <div>Boundary content</div>
    }

    render(
      <ErrorBoundaryDevTools defaultOpen>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    expect(screen.getByText('My Test Boundary')).toBeInTheDocument()
  })

  it('should update boundary info', () => {
    function TestBoundary() {
      const updateInfo = useDevToolsRegistration('test-boundary', 'My Boundary')
      return (
        <button
          onClick={() =>
            updateInfo({
              hasError: true,
              error: new Error('Test error message'),
            })
          }
        >
          Trigger Error
        </button>
      )
    }

    render(
      <ErrorBoundaryDevTools defaultOpen>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    fireEvent.click(screen.getByText('Trigger Error'))

    expect(screen.getByText('ERROR')).toBeInTheDocument()
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('should unregister boundary on unmount', () => {
    function TestBoundary() {
      useDevToolsRegistration('test-boundary', 'My Boundary')
      return <div>Boundary content</div>
    }

    const { rerender } = render(
      <ErrorBoundaryDevTools defaultOpen>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    expect(screen.getByText('My Boundary')).toBeInTheDocument()

    rerender(
      <ErrorBoundaryDevTools defaultOpen>
        <div>No boundary</div>
      </ErrorBoundaryDevTools>
    )

    expect(screen.queryByText('My Boundary')).not.toBeInTheDocument()
  })

  it('should show error count on toggle button', () => {
    function TestBoundary() {
      const updateInfo = useDevToolsRegistration('test-boundary', 'My Boundary')
      React.useEffect(() => {
        updateInfo({ hasError: true })
      }, [updateInfo])
      return <div>Boundary content</div>
    }

    render(
      <ErrorBoundaryDevTools>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    // Should show error count badge
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should work without DevTools context', () => {
    function TestBoundary() {
      const updateInfo = useDevToolsRegistration('test-boundary', 'My Boundary')
      return (
        <button onClick={() => updateInfo({ hasError: true })}>Update</button>
      )
    }

    // Render without DevTools wrapper - should not throw
    expect(() => {
      render(<TestBoundary />)
    }).not.toThrow()
  })

  it('should show circuit state badges', () => {
    function TestBoundary() {
      const updateInfo = useDevToolsRegistration('test-boundary', 'My Boundary')
      React.useEffect(() => {
        updateInfo({ circuitState: 'open' })
      }, [updateInfo])
      return <div>Boundary content</div>
    }

    render(
      <ErrorBoundaryDevTools defaultOpen>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    expect(screen.getByText('CIRCUIT OPEN')).toBeInTheDocument()
  })

  it('should show OK badge when no error', () => {
    function TestBoundary() {
      useDevToolsRegistration('test-boundary', 'My Boundary')
      return <div>Boundary content</div>
    }

    render(
      <ErrorBoundaryDevTools defaultOpen>
        <TestBoundary />
      </ErrorBoundaryDevTools>
    )

    expect(screen.getByText('OK')).toBeInTheDocument()
  })
})
