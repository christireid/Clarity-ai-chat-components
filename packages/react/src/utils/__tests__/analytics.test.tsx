/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  analyticsManager,
  useAnalytics,
  useRenderPerformance,
  useInteractionTracking,
  AnalyticsProvider,
  useAnalyticsContext,
  createEventHandler,
  measurePerformance,
} from '../analytics'

// Mock performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
})

// Mock fetch
global.fetch = jest.fn()

// Mock sendBeacon
Object.defineProperty(navigator, 'sendBeacon', {
  value: jest.fn(() => true),
  writable: true,
})

describe('Analytics System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    analyticsManager.updateConfig({ enabled: true })
  })

  describe('AnalyticsManager', () => {
    it('should initialize with default config', () => {
      const config = analyticsManager.getConfig()
      expect(config.enabled).toBe(true)
      expect(config.batchEvents).toBe(true)
      expect(config.batchSize).toBe(10)
    })

    it('should track events when enabled', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackEvent({
        type: 'test',
        action: 'test_action',
      })

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'test',
          action: 'test_action',
          timestamp: expect.any(Number),
          sessionId: expect.any(String),
        })
      )
    })

    it('should not track events when disabled', () => {
      analyticsManager.updateConfig({ enabled: false })
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackEvent({
        type: 'test',
        action: 'test_action',
      })

      expect(mockOnEvent).not.toHaveBeenCalled()
    })

    it('should respect sample rate', () => {
      analyticsManager.updateConfig({ sampleRate: 0 })
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackEvent({
        type: 'test',
        action: 'test_action',
      })

      expect(mockOnEvent).not.toHaveBeenCalled()
    })

    it('should track component usage', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackComponentUsage('TestComponent', 'mount', { prop: 'value' })

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          component: 'TestComponent',
          action: 'mount',
          metadata: { prop: 'value' },
        })
      )
    })

    it('should track performance metrics', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackPerformance('TestComponent', 'render', { duration: 100 })

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'performance',
          component: 'TestComponent',
          action: 'measure',
          category: 'render',
          metadata: { duration: 100 },
        })
      )
    })

    it('should track interactions', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      analyticsManager.trackInteraction('TestComponent', 'click', 'button', { x: 10, y: 20 })

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          component: 'TestComponent',
          action: 'interaction',
          metadata: {
            interactionType: 'click',
            element: 'button',
            x: 10,
            y: 20,
          },
        })
      )
    })

    it('should batch events when configured', () => {
      const mockFetch = jest.fn()
      global.fetch = mockFetch

      analyticsManager.initialize({
        batchEvents: true,
        batchSize: 2,
        endpoint: '/test',
      })

      analyticsManager.trackEvent({ type: 'test1' })
      expect(mockFetch).not.toHaveBeenCalled()

      analyticsManager.trackEvent({ type: 'test2' })
      expect(mockFetch).toHaveBeenCalledWith('/test', expect.any(Object))
    })

    it('should flush events manually', () => {
      const mockFetch = jest.fn()
      global.fetch = mockFetch

      analyticsManager.initialize({
        batchEvents: true,
        endpoint: '/test',
      })

      analyticsManager.trackEvent({ type: 'test' })
      analyticsManager.flush()

      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('useAnalytics hook', () => {
    it('should track component mount and unmount', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const TestComponent = () => {
        useAnalytics('TestComponent')
        return <div>Test</div>
      }

      const { unmount } = render(<TestComponent />)

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          component: 'TestComponent',
          action: 'mount',
        })
      )

      unmount()

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          component: 'TestComponent',
          action: 'unmount',
        })
      )
    })

    it('should track renders', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      let renderCount = 0

      const TestComponent = () => {
        renderCount++
        useAnalytics('TestComponent')
        return <div>Test {renderCount}</div>
      }

      const { rerender } = render(<TestComponent />)

      expect(renderCount).toBe(1)

      rerender(<TestComponent />)

      expect(renderCount).toBe(2)
      // Should track render on second render
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          action: 'render',
        })
      )
    })

    it('should provide interaction tracking methods', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const TestComponent = () => {
        const { trackInteraction } = useAnalytics('TestComponent')
        return (
          <button onClick={() => trackInteraction('click', 'button')}>
            Click me
          </button>
        )
      }

      render(<TestComponent />)

      fireEvent.click(screen.getByRole('button'))

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          action: 'interaction',
          metadata: {
            interactionType: 'click',
            element: 'button',
          },
        })
      )
    })
  })

  describe('useRenderPerformance hook', () => {
    it('should measure render performance', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const TestComponent = () => {
        useRenderPerformance('TestComponent')
        return <div>Test</div>
      }

      render(<TestComponent />)

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'performance',
          component: 'TestComponent',
          category: 'render',
          metadata: {
            duration: expect.any(Number),
          },
        })
      )
    })
  })

  describe('useInteractionTracking hook', () => {
    it('should provide interaction tracking methods', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const TestComponent = () => {
        const { trackClick } = useInteractionTracking('TestComponent')
        return (
          <button onClick={() => trackClick('button')}>
            Click me
          </button>
        )
      }

      render(<TestComponent />)

      fireEvent.click(screen.getByRole('button'))

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          action: 'interaction',
          metadata: {
            interactionType: 'click',
            element: 'button',
          },
        })
      )
    })
  })

  describe('AnalyticsProvider', () => {
    it('should provide analytics context', () => {
      const TestComponent = () => {
        const { config } = useAnalyticsContext()
        return <div>{config.enabled ? 'Enabled' : 'Disabled'}</div>
      }

      render(
        <AnalyticsProvider config={{ enabled: true }}>
          <TestComponent />
        </AnalyticsProvider>
      )

      expect(screen.getByText('Enabled')).toBeInTheDocument()
    })

    it('should update config', () => {
      const TestComponent = () => {
        const { config, updateConfig } = useAnalyticsContext()
        return (
          <div>
            <div>{config.enabled ? 'Enabled' : 'Disabled'}</div>
            <button onClick={() => updateConfig({ enabled: false })}>
              Disable
            </button>
          </div>
        )
      }

      render(
        <AnalyticsProvider config={{ enabled: true }}>
          <TestComponent />
        </AnalyticsProvider>
      )

      expect(screen.getByText('Enabled')).toBeInTheDocument()

      fireEvent.click(screen.getByRole('button'))

      expect(screen.getByText('Disabled')).toBeInTheDocument()
    })
  })

  describe('Utility functions', () => {
    it('should create event handler', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const handler = createEventHandler('TestComponent', 'click', 'button')
      handler({ x: 10, y: 20 })

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'component_usage',
          component: 'TestComponent',
          action: 'interaction',
          metadata: {
            interactionType: 'click',
            element: 'button',
            x: 10,
            y: 20,
          },
        })
      )
    })

    it('should measure performance', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      const result = measurePerformance('TestComponent', 'test', () => {
        return 'result'
      })

      expect(result).toBe('result')
      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'performance',
          component: 'TestComponent',
          category: 'render',
        })
      )
    })

    it('should handle performance measurement errors', () => {
      const mockOnEvent = jest.fn()
      analyticsManager.initialize({ onEvent: mockOnEvent })

      expect(() => {
        measurePerformance('TestComponent', 'test', () => {
          throw new Error('Test error')
        })
      }).toThrow('Test error')

      expect(mockOnEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
          component: 'TestComponent',
        })
      )
    })
  })
})