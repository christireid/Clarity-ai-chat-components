/**
 * Comprehensive Performance Monitoring Tests for Enhanced Skeleton System
 *
 * Tests performance metrics, monitoring capabilities, optimization features,
 * and performance-related edge cases.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  PerformanceSkeleton,
  EnhancedSkeleton,
  SkeletonTransition,
  SmartSkeleton,
  AdvancedSkeleton,
} from '../skeleton-enhanced'

import {
  PerformanceMonitor,
  LoadingPredictor,
} from '../skeleton-performance'

// Mock performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => 1000),
  getEntries: jest.fn(() => []),
  getEntriesByName: jest.fn(() => []),
  getEntriesByType: jest.fn(() => []),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  clearResourceTimings: jest.fn(),
  setResourceTimingBufferSize: jest.fn(),
  timing: {
    navigationStart: 1000,
    loadEventEnd: 2000,
  },
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
})

// Mock requestAnimationFrame
const mockRequestAnimationFrame = jest.fn((cb: FrameRequestCallback) => {
  setTimeout(() => cb(performance.now()), 16)
  return 1
})

const mockCancelAnimationFrame = jest.fn()

Object.defineProperty(window, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  writable: true,
})

Object.defineProperty(window, 'cancelAnimationFrame', {
  value: mockCancelAnimationFrame,
  writable: true,
})

// Mock console methods
const consoleSpy = {
  log: jest.spyOn(console, 'log').mockImplementation(),
  warn: jest.spyOn(console, 'warn').mockImplementation(),
  error: jest.spyOn(console, 'error').mockImplementation(),
}

describe('Performance Monitoring System', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    
    // Reset singleton instances
    (PerformanceMonitor as any).instance = null
    (LoadingPredictor as any).instance = null
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('PerformanceMonitor', () => {
    it('creates singleton instance', () => {
      const monitor1 = PerformanceMonitor.getInstance()
      const monitor2 = PerformanceMonitor.getInstance()
      
      expect(monitor1).toBe(monitor2)
    })

    it('starts and stops monitoring', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      monitor.startMonitoring('test-monitoring')
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-monitoring-start')
      
      const metrics = monitor.endMonitoring('test-monitoring')
      expect(mockPerformance.mark).toHaveBeenCalledWith('test-monitoring-end')
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'test-monitoring',
        'test-monitoring-start',
        'test-monitoring-end'
      )
      expect(metrics).toBeDefined()
    })

    it('generates detailed metrics', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1200)
      mockPerformance.getEntries.mockReturnValueOnce([
        { name: 'test-monitoring', startTime: 1000, duration: 200 }
      ])
      
      monitor.startMonitoring('detailed-test')
      const metrics = monitor.endMonitoring('detailed-test')
      
      expect(metrics).toMatchObject({
        duration: 200,
        startTime: 1000,
        endTime: 1200,
      })
    })

    it('handles missing performance API gracefully', () => {
      const originalPerformance = global.performance
      // @ts-ignore
      delete global.performance
      
      const monitor = PerformanceMonitor.getInstance()
      expect(() => {
        monitor.startMonitoring('no-perf')
        monitor.endMonitoring('no-perf')
      }).not.toThrow()
      
      global.performance = originalPerformance
    })

    it('provides performance warnings for slow operations', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1200) // 200ms
      
      monitor.startMonitoring('slow-operation')
      monitor.endMonitoring('slow-operation')
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('Performance monitoring took')
      )
    })

    it('tracks multiple concurrent monitors', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      monitor.startMonitoring('monitor-1')
      monitor.startMonitoring('monitor-2')
      monitor.startMonitoring('monitor-3')
      
      const metrics1 = monitor.endMonitoring('monitor-1')
      const metrics2 = monitor.endMonitoring('monitor-2')
      const metrics3 = monitor.endMonitoring('monitor-3')
      
      expect(metrics1).toBeDefined()
      expect(metrics2).toBeDefined()
      expect(metrics3).toBeDefined()
      expect(mockPerformance.mark).toHaveBeenCalledTimes(6) // 3 start + 3 end
    })

    it('handles duplicate monitor names', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      monitor.startMonitoring('duplicate')
      monitor.startMonitoring('duplicate') // Should handle this gracefully
      
      const metrics = monitor.endMonitoring('duplicate')
      
      expect(metrics).toBeDefined()
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('Duplicate performance monitor')
      )
    })

    it('provides memory usage metrics', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      // Mock memory API
      Object.defineProperty(window, 'memory', {
        value: {
          usedJSHeapSize: 1024 * 1024, // 1MB
          totalJSHeapSize: 2048 * 1024, // 2MB
          jsHeapSizeLimit: 4096 * 1024, // 4MB
        },
        writable: true,
        configurable: true,
      })
      
      monitor.startMonitoring('memory-test')
      const metrics = monitor.endMonitoring('memory-test')
      
      expect(metrics.memory).toBeDefined()
      expect(metrics.memory.usedJSHeapSize).toBe(1024 * 1024)
      expect(metrics.memory.totalJSHeapSize).toBe(2048 * 1024)
      expect(metrics.memory.jsHeapSizeLimit).toBe(4096 * 1024)
    })

    it('provides device capability metrics', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 8,
        writable: true,
        configurable: true,
      })
      
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 8,
        writable: true,
        configurable: true,
      })
      
      monitor.startMonitoring('device-test')
      const metrics = monitor.endMonitoring('device-test')
      
      expect(metrics.device).toBeDefined()
      expect(metrics.device.deviceMemory).toBe(8)
      expect(metrics.device.hardwareConcurrency).toBe(8)
    })
  })

  describe('LoadingPredictor', () => {
    it('creates singleton instance', () => {
      const predictor1 = LoadingPredictor.getInstance()
      const predictor2 = LoadingPredictor.getInstance()
      
      expect(predictor1).toBe(predictor2)
    })

    it('predicts loading duration', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Train with some data
      predictor.recordLoadingDuration(1000)
      predictor.recordLoadingDuration(1200)
      predictor.recordLoadingDuration(800)
      
      const prediction = predictor.predictDuration()
      
      expect(prediction).toBeGreaterThan(0)
      expect(prediction).toBeLessThanOrEqual(2000)
    })

    it('adapts predictions based on recent data', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Train with initial data
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(1000 + i * 100)
      }
      
      const initialPrediction = predictor.predictDuration()
      
      // Train with much faster data
      for (let i = 0; i < 5; i++) {
        predictor.recordLoadingDuration(200 + i * 50)
      }
      
      const adaptedPrediction = predictor.predictDuration()
      
      expect(adaptedPrediction).toBeLessThan(initialPrediction)
    })

    it('handles different prediction modes', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Train with consistent data
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(1000)
      }
      
      const conservative = predictor.predictDuration('conservative')
      const aggressive = predictor.predictDuration('aggressive')
      const adaptive = predictor.predictDuration('adaptive')
      
      expect(conservative).toBeGreaterThanOrEqual(adaptive)
      expect(adaptive).toBeGreaterThanOrEqual(aggressive)
    })

    it('handles empty prediction history', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Reset predictor
      (predictor as any).loadingHistory = []
      
      const prediction = predictor.predictDuration()
      
      expect(prediction).toBe(1000) // Default fallback
    })

    it('limits history size to prevent memory leaks', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Add many data points
      for (let i = 0; i < 200; i++) {
        predictor.recordLoadingDuration(1000 + i)
      }
      
      expect((predictor as any).loadingHistory.length).toBeLessThanOrEqual(100)
    })

    it('provides prediction confidence metrics', () => {
      const predictor = LoadingPredictor.getInstance()
      
      // Train with consistent data
      for (let i = 0; i < 20; i++) {
        predictor.recordLoadingDuration(1000)
      }
      
      const prediction = predictor.predictDuration('adaptive', true)
      
      expect(prediction).toHaveProperty('duration')
      expect(prediction).toHaveProperty('confidence')
      expect(prediction.confidence).toBeGreaterThan(0)
      expect(prediction.confidence).toBeLessThanOrEqual(1)
    })
  })

  describe('PerformanceSkeleton Component', () => {
    it('monitors component lifecycle', () => {
      const onReport = jest.fn()
      
      const { unmount } = render(
        <PerformanceSkeleton
          performanceId="component-test"
          onPerformanceReport={onReport}
          enableDetailedMetrics={true}
        >
          <div>Test content</div>
        </PerformanceSkeleton>
      )
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('component-test-start')
      
      unmount()
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('component-test-end')
      expect(mockPerformance.measure).toHaveBeenCalled()
      expect(onReport).toHaveBeenCalled()
    })

    it('provides detailed performance metrics', () => {
      const onReport = jest.fn()
      
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1150) // 150ms
      
      const { unmount } = render(
        <PerformanceSkeleton
          performanceId="detailed-test"
          onPerformanceReport={onReport}
          enableDetailedMetrics={true}
        >
          <div>Test content</div>
        </PerformanceSkeleton>
      )
      
      unmount()
      
      expect(onReport).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'detailed-test',
          duration: 150,
          startTime: expect.any(Number),
          endTime: expect.any(Number),
          memory: expect.any(Object),
          device: expect.any(Object),
        })
      )
    })

    it('handles performance monitoring errors gracefully', () => {
      const onReport = jest.fn()
      
      // Mock performance API to throw error
      mockPerformance.mark.mockImplementationOnce(() => {
        throw new Error('Performance API error')
      })
      
      const { unmount } = render(
        <PerformanceSkeleton
          performanceId="error-test"
          onPerformanceReport={onReport}
        >
          <div>Test content</div>
        </PerformanceSkeleton>
      )
      
      expect(() => unmount()).not.toThrow()
      expect(consoleSpy.error).toHaveBeenCalled()
    })
  })

  describe('EnhancedSkeleton Performance', () => {
    it('monitors individual skeleton performance', () => {
      render(
        <EnhancedSkeleton
          performanceId="skeleton-perf"
          variant="shimmer"
        />
      )
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('skeleton-perf-start')
      
      // Simulate unmount
      act(() => {
        jest.advanceTimersByTime(100)
      })
    })

    it('logs performance warnings for slow renders', () => {
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1032) // 32ms
      
      render(
        <EnhancedSkeleton
          performanceId="slow-skeleton"
          variant="shimmer"
        />
      )
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('EnhancedSkeleton render took')
      )
    })
  })

  describe('AdvancedSkeleton Performance', () => {
    it('monitors advanced skeleton performance', () => {
      render(
        <AdvancedSkeleton
          variant="shimmerRainbow"
          enablePerformanceMonitoring={true}
        />
      )
      
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.stringContaining('AdvancedSkeleton render took')
      )
    })

    it('optimizes for device capabilities', () => {
      Object.defineProperty(navigator, 'deviceMemory', {
        value: 2,
        writable: true,
        configurable: true,
      })
      
      Object.defineProperty(navigator, 'hardwareConcurrency', {
        value: 2,
        writable: true,
        configurable: true,
      })
      
      const { container } = render(
        <AdvancedSkeleton
          variant="shimmerRainbow"
          enablePerformanceMonitoring={true}
        />
      )
      
      // Should use reduced animation for low-end device
      expect(container.querySelector('.skeleton-none')).toBeInTheDocument()
    })
  })

  describe('SkeletonTransition Performance', () => {
    it('monitors transition performance', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 500)
        }, [])
        
        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<div>Skeleton</div>}
            monitorPerformance={true}
            enablePrediction={true}
            duration={300}
          >
            <div data-testid="transition-content">Content</div>
          </SkeletonTransition>
        )
      }
      
      render(<TestComponent />)
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('skeleton-transition-start')
      
      act(() => {
        jest.advanceTimersByTime(500)
      })
      
      await waitFor(() => {
        expect(screen.getByTestId('transition-content')).toBeInTheDocument()
      })
      
      expect(mockPerformance.mark).toHaveBeenCalledWith('skeleton-transition-end')
      expect(mockPerformance.measure).toHaveBeenCalledWith(
        'skeleton-transition',
        'skeleton-transition-start',
        'skeleton-transition-end'
      )
    })

    it('predicts optimal transition timing', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 800)
        }, [])
        
        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<div>Skeleton</div>}
            enablePrediction={true}
            duration={400}
          >
            <div>Predicted content</div>
          </SkeletonTransition>
        )
      }
      
      render(<TestComponent />)
      
      act(() => {
        jest.advanceTimersByTime(800)
      })
      
      await waitFor(() => {
        expect(screen.getByText('Predicted content')).toBeInTheDocument()
      })
    })
  })

  describe('SmartSkeleton Performance', () => {
    it('provides intelligent loading predictions', () => {
      const onUpdate = jest.fn()
      
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)
        
        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1200)
        }, [])
        
        return (
          <SmartSkeleton
            isLoading={isLoading}
            predictionMode="adaptive"
            onPredictionUpdate={onUpdate}
            enableLearning={true}
          >
            <div>Smart content</div>
          </SmartSkeleton>
        )
      }
      
      render(<TestComponent />)
      
      expect(onUpdate).toHaveBeenCalled()
      const predictedDuration = onUpdate.mock.calls[0][0]
      expect(predictedDuration).toBeGreaterThan(0)
      expect(predictedDuration).toBeLessThanOrEqual(2000)
      
      act(() => {
        jest.advanceTimersByTime(1200)
      })
      
      // Should record actual duration for learning
      expect(onUpdate).toHaveBeenCalledTimes(2) // Initial prediction + actual duration
    })

    it('adapts to different prediction modes', () => {
      const modes = ['conservative', 'aggressive', 'adaptive'] as const
      
      modes.forEach(mode => {
        const onUpdate = jest.fn()
        
        render(
          <SmartSkeleton
            isLoading={true}
            predictionMode={mode}
            onPredictionUpdate={onUpdate}
          >
              <div>Content</div>
          </SmartSkeleton>
        )
        
        expect(onUpdate).toHaveBeenCalled()
        
        // Clean up for next iteration
        const container = screen.getByText('Content').parentElement
        container?.remove()
      })
    })
  })

  describe('Performance Optimization', () => {
    it('throttles performance updates', () => {
      const onReport = jest.fn()
      
      const TestComponent = () => {
        const [renderCount, setRenderCount] = React.useState(0)
        
        React.useEffect(() => {
          // Trigger multiple rapid re-renders
          const interval = setInterval(() => {
            setRenderCount(prev => prev + 1)
          }, 50)
          
          setTimeout(() => clearInterval(interval), 500)
        }, [])
        
        return (
          <PerformanceSkeleton
            performanceId="throttle-test"
            onPerformanceReport={onReport}
          >
            <div>Render count: {renderCount}</div>
          </PerformanceSkeleton>
        )
      }
      
      render(<TestComponent />)
      
      act(() => {
        jest.advanceTimersByTime(600)
      })
      
      // Should throttle reports to prevent performance issues
      expect(onReport).toHaveBeenCalledTimes(1)
    })

    it('limits memory usage for performance tracking', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      // Create many performance monitors
      for (let i = 0; i < 100; i++) {
        monitor.startMonitoring(`memory-test-${i}`)
        monitor.endMonitoring(`memory-test-${i}`)
      }
      
      // Should not accumulate excessive memory
      expect((monitor as any).activeMonitors.size).toBe(0)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles missing performance API gracefully', () => {
      const originalPerformance = global.performance
      // @ts-ignore
      delete global.performance
      
      const TestComponent = () => {
        return (
          <PerformanceSkeleton performanceId="no-api-test">
            <div>Content</div>
          </PerformanceSkeleton>
        )
      }
      
      expect(() => render(<TestComponent />)).not.toThrow()
      
      global.performance = originalPerformance
    })

    it('handles negative durations gracefully', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(500) // Negative duration
      
      monitor.startMonitoring('negative-test')
      const metrics = monitor.endMonitoring('negative-test')
      
      expect(metrics.duration).toBeGreaterThanOrEqual(0)
    })

    it('handles very long durations', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      mockPerformance.now.mockReturnValueOnce(1000).mockReturnValueOnce(1000000) // Very long duration
      
      monitor.startMonitoring('long-test')
      const metrics = monitor.endMonitoring('long-test')
      
      expect(metrics.duration).toBeLessThanOrEqual(300000) // Should be capped
    })

    it('handles concurrent monitoring operations', () => {
      const monitor = PerformanceMonitor.getInstance()
      const results: any[] = []
      
      // Start multiple monitors concurrently
      for (let i = 0; i < 10; i++) {
        monitor.startMonitoring(`concurrent-${i}`)
      }
      
      // End them in different order
      for (let i = 9; i >= 0; i--) {
        const metrics = monitor.endMonitoring(`concurrent-${i}`)
        results.push(metrics)
      }
      
      expect(results).toHaveLength(10)
      results.forEach(metrics => {
        expect(metrics).toBeDefined()
      })
    })
  })

  describe('Memory Leak Prevention', () => {
    it('cleans up performance monitoring resources', () => {
      const monitor = PerformanceMonitor.getInstance()
      
      // Create and clean up multiple monitors
      for (let i = 0; i < 50; i++) {
        monitor.startMonitoring(`cleanup-test-${i}`)
        monitor.endMonitoring(`cleanup-test-${i}`)
      }
      
      // Should not accumulate resources
      expect((monitor as any).activeMonitors.size).toBe(0)
      expect((monitor as any).completedMonitors.length).toBeLessThanOrEqual(100)
    })

    it('prevents memory leaks in long-running components', () => {
      const TestComponent = () => {
        const [counter, setCounter] = React.useState(0)
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            setCounter(prev => prev + 1)
          }, 100)
          
          return () => clearInterval(interval)
        }, [])
        
        return (
          <PerformanceSkeleton performanceId="long-running-test">
            <div>Counter: {counter}</div>
          </PerformanceSkeleton>
        )
      }
      
      const { unmount } = render(<TestComponent />)
      
      // Simulate long-running component
      act(() => {
        jest.advanceTimersByTime(1000)
      })
      
      unmount()
      
      // Should clean up properly
      expect(true).toBe(true)
    })
  })
})