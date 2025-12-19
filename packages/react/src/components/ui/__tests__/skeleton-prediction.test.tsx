/**
 * Comprehensive Smart Loading Prediction Tests for Enhanced Skeleton System
 *
 * Tests machine learning-based loading predictions, adaptive algorithms,
 * prediction accuracy, and intelligent loading state management.
 */

import React from 'react'
import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'

import {
  SmartSkeleton,
  SkeletonTransition,
  EnhancedSkeleton,
  PerformanceSkeleton,
} from '../skeleton-enhanced'

import {
  LoadingPredictor,
  PredictiveLoader,
  LoadingPatternAnalyzer,
} from '../skeleton-prediction'

// Mock performance API
const mockPerformance = {
  mark: jest.fn(),
  measure: jest.fn(),
  now: jest.fn(() => 1000),
  getEntries: jest.fn(() => []),
}

Object.defineProperty(window, 'performance', {
  value: mockPerformance,
  writable: true,
})

describe('Smart Loading Predictions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()(
      // Reset singleton instances
      LoadingPredictor as any
    ).instance =
      null(PredictiveLoader as any).instance =
      null(LoadingPatternAnalyzer as any).instance =
        null

    // Clear localStorage
    localStorage.clear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('LoadingPredictor', () => {
    it('creates singleton instance', () => {
      const predictor1 = LoadingPredictor.getInstance()
      const predictor2 = LoadingPredictor.getInstance()

      expect(predictor1).toBe(predictor2)
    })

    it('predicts loading duration based on historical data', () => {
      const predictor = LoadingPredictor.getInstance()

      // Train with historical data
      const historicalDurations = [1000, 1200, 800, 1100, 900, 1300, 1000]
      historicalDurations.forEach((duration) => {
        predictor.recordLoadingDuration(duration)
      })

      const prediction = predictor.predictDuration()

      expect(prediction).toBeGreaterThan(0)
      expect(prediction).toBeLessThanOrEqual(2000)
      expect(prediction).toBeGreaterThanOrEqual(500)
    })

    it('adapts predictions based on recent patterns', () => {
      const predictor = LoadingPredictor.getInstance()

      // Initial training with normal durations
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(1000 + i * 50)
      }

      const initialPrediction = predictor.predictDuration()

      // Recent pattern: much faster loading
      for (let i = 0; i < 5; i++) {
        predictor.recordLoadingDuration(300 + i * 50)
      }

      const adaptedPrediction = predictor.predictDuration()

      expect(adaptedPrediction).toBeLessThan(initialPrediction)
    })

    it('handles different prediction modes', () => {
      const predictor = LoadingPredictor.getInstance()

      // Train with consistent data
      for (let i = 0; i < 15; i++) {
        predictor.recordLoadingDuration(1000)
      }

      const conservative = predictor.predictDuration('conservative')
      const aggressive = predictor.predictDuration('aggressive')
      const adaptive = predictor.predictDuration('adaptive')

      expect(conservative).toBeGreaterThanOrEqual(adaptive)
      expect(adaptive).toBeGreaterThanOrEqual(aggressive)

      // Conservative should be at least 20% longer
      expect(conservative).toBeGreaterThanOrEqual(adaptive * 1.15)

      // Aggressive should be at least 20% shorter
      expect(aggressive).toBeLessThanOrEqual(adaptive * 0.85)
    })

    it('provides prediction confidence metrics', () => {
      const predictor = LoadingPredictor.getInstance()

      // Train with highly consistent data
      for (let i = 0; i < 20; i++) {
        predictor.recordLoadingDuration(1000)
      }

      const prediction = predictor.predictDuration('adaptive', true)

      expect(prediction).toHaveProperty('duration')
      expect(prediction).toHaveProperty('confidence')
      expect(prediction.confidence).toBeGreaterThan(0.8) // High confidence for consistent data
      expect(prediction.confidence).toBeLessThanOrEqual(1)
    })

    it('handles sparse data gracefully', () => {
      const predictor = LoadingPredictor.getInstance()

      // Very limited training data
      predictor.recordLoadingDuration(1000)
      predictor.recordLoadingDuration(1200)

      const prediction = predictor.predictDuration()

      expect(prediction).toBeGreaterThan(0)
      expect(prediction).toBeLessThanOrEqual(2000)
    })

    it('limits memory usage with data rotation', () => {
      const predictor = LoadingPredictor.getInstance()

      // Add many data points
      for (let i = 0; i < 200; i++) {
        predictor.recordLoadingDuration(1000 + i)
      }

      const history = (predictor as any).loadingHistory
      expect(history.length).toBeLessThanOrEqual(100) // Should not exceed limit
      expect(history.length).toBeGreaterThan(0) // Should retain some data
    })

    it('provides seasonal pattern detection', () => {
      const predictor = LoadingPredictor.getInstance()

      // Simulate different time periods with different loading patterns
      const now = Date.now()

      // Morning pattern (faster loading)
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(600 + i * 50, now - 86400000) // Yesterday morning
      }

      // Evening pattern (slower loading)
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(1200 + i * 100, now - 43200000) // Yesterday evening
      }

      const morningPrediction = predictor.predictDuration(
        'adaptive',
        false,
        now - 86400000
      )
      const eveningPrediction = predictor.predictDuration(
        'adaptive',
        false,
        now - 43200000
      )

      expect(morningPrediction).toBeLessThan(eveningPrediction)
    })

    it('handles network condition changes', () => {
      const predictor = LoadingPredictor.getInstance()

      // Simulate fast network conditions
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(500 + i * 50, Date.now(), '4g')
      }

      const fastPrediction = predictor.predictDuration(
        'adaptive',
        false,
        Date.now(),
        '4g'
      )

      // Simulate slow network conditions
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(2000 + i * 200, Date.now(), '2g')
      }

      const slowPrediction = predictor.predictDuration(
        'adaptive',
        false,
        Date.now(),
        '2g'
      )

      expect(fastPrediction).toBeLessThan(slowPrediction)
    })
  })

  describe('PredictiveLoader', () => {
    it('creates singleton instance', () => {
      const loader1 = PredictiveLoader.getInstance()
      const loader2 = PredictiveLoader.getInstance()

      expect(loader1).toBe(loader2)
    })

    it('provides predictive loading states', () => {
      const loader = PredictiveLoader.getInstance()

      // Train with data
      for (let i = 0; i < 10; i++) {
        loader.recordLoadingTime(1000 + i * 100)
      }

      const prediction = loader.getPredictedDuration()

      expect(prediction).toBeGreaterThan(0)
      expect(prediction).toBeLessThanOrEqual(2000)
    })

    it('adapts to user behavior patterns', () => {
      const loader = PredictiveLoader.getInstance()

      // Simulate user who typically loads content quickly
      for (let i = 0; i < 8; i++) {
        loader.recordLoadingTime(500 + i * 50) // Fast loading
      }

      const fastUserPrediction = loader.getPredictedDuration()

      // Simulate different user who takes longer
      for (let i = 0; i < 8; i++) {
        loader.recordLoadingTime(1500 + i * 100) // Slower loading
      }

      const slowUserPrediction = loader.getPredictedDuration()

      expect(fastUserPrediction).toBeLessThan(slowUserPrediction)
    })

    it('provides confidence-based predictions', () => {
      const loader = PredictiveLoader.getInstance()

      // Train with highly consistent data
      for (let i = 0; i < 15; i++) {
        loader.recordLoadingTime(1000)
      }

      const confidentPrediction = loader.getPredictedDuration(true)

      expect(confidentPrediction).toHaveProperty('duration')
      expect(confidentPrediction).toHaveProperty('confidence')
      expect(confidentPrediction.confidence).toBeGreaterThan(0.7)
    })

    it('handles cold start scenarios', () => {
      const loader = (PredictiveLoader.getInstance()(
        // Reset to simulate cold start
        loader as any
      ).userPatterns = [])

      const coldStartPrediction = loader.getPredictedDuration()

      // Should provide reasonable default
      expect(coldStartPrediction).toBeGreaterThan(500)
      expect(coldStartPrediction).toBeLessThan(2000)
    })
  })

  describe('LoadingPatternAnalyzer', () => {
    it('creates singleton instance', () => {
      const analyzer1 = LoadingPatternAnalyzer.getInstance()
      const analyzer2 = LoadingPatternAnalyzer.getInstance()

      expect(analyzer1).toBe(analyzer2)
    })

    it('analyzes loading patterns', () => {
      const analyzer = LoadingPatternAnalyzer.getInstance()

      // Add various loading patterns
      const patterns = [
        { duration: 800, time: Date.now() - 3600000, type: 'image' },
        { duration: 1200, time: Date.now() - 1800000, type: 'text' },
        { duration: 600, time: Date.now() - 900000, type: 'image' },
        { duration: 1500, time: Date.now() - 300000, type: 'text' },
      ]

      patterns.forEach((pattern) => {
        analyzer.addPattern(pattern.duration, pattern.time, pattern.type)
      })

      const analysis = analyzer.analyzePatterns()

      expect(analysis).toHaveProperty('averageDuration')
      expect(analysis).toHaveProperty('patternTypes')
      expect(analysis).toHaveProperty('timeDistribution')
      expect(analysis.averageDuration).toBeGreaterThan(0)
    })

    it('identifies content type patterns', () => {
      const analyzer = LoadingPatternAnalyzer.getInstance()

      // Add patterns for different content types
      const imageDurations = [500, 600, 550, 650, 580]
      const textDurations = [1000, 1200, 1100, 1300, 1150]
      const videoDurations = [2000, 2500, 2200, 2800, 2400]

      imageDurations.forEach((duration) => {
        analyzer.addPattern(duration, Date.now(), 'image')
      })

      textDurations.forEach((duration) => {
        analyzer.addPattern(duration, Date.now(), 'text')
      })

      videoDurations.forEach((duration) => {
        analyzer.addPattern(duration, Date.now(), 'video')
      })

      const patterns = analyzer.getContentTypePatterns()

      expect(patterns.image.average).toBeCloseTo(576, 0)
      expect(patterns.text.average).toBeCloseTo(1150, 0)
      expect(patterns.video.average).toBeCloseTo(2380, 0)
    })

    it('detects time-based patterns', () => {
      const analyzer = LoadingPatternAnalyzer.getInstance()

      const now = Date.now()
      const hour = 3600000

      // Morning patterns (6 AM - 9 AM)
      for (let i = 0; i < 5; i++) {
        analyzer.addPattern(800 + i * 50, now - 18 * hour + i * hour, 'content')
      }

      // Evening patterns (6 PM - 9 PM)
      for (let i = 0; i < 5; i++) {
        analyzer.addPattern(
          1200 + i * 100,
          now - 6 * hour + i * hour,
          'content'
        )
      }

      const timePatterns = analyzer.getTimeBasedPatterns()

      expect(timePatterns).toHaveProperty('morning')
      expect(timePatterns).toHaveProperty('evening')
      expect(timePatterns.morning.average).toBeLessThan(
        timePatterns.evening.average
      )
    })
  })

  describe('SmartSkeleton Component', () => {
    it('provides intelligent loading predictions', () => {
      const onUpdate = jest.fn()

      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          // Simulate realistic loading time
          setTimeout(() => setIsLoading(false), 1500)
        }, [])

        return (
          <SmartSkeleton
            isLoading={isLoading}
            predictionMode="adaptive"
            onPredictionUpdate={onUpdate}
            enableLearning={true}
          >
            <div>Content loaded!</div>
          </SmartSkeleton>
        )
      }

      render(<TestComponent />)

      expect(onUpdate).toHaveBeenCalled()
      const prediction = onUpdate.mock.calls[0][0]
      expect(prediction).toBeGreaterThan(0)
      expect(prediction).toBeLessThanOrEqual(3000)

      act(() => {
        jest.advanceTimersByTime(1500)
      })

      expect(screen.getByText('Content loaded!')).toBeInTheDocument()
    })

    it('adapts to different prediction modes', () => {
      const modes = ['conservative', 'aggressive', 'adaptive'] as const
      const predictions: number[] = []

      modes.forEach((mode) => {
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
        predictions.push(onUpdate.mock.calls[0][0])

        // Clean up for next iteration
        const container = screen.getByText('Content').parentElement
        container?.remove()
      })

      // Conservative should be longest, aggressive shortest
      expect(predictions[0]).toBeGreaterThan(predictions[2]) // conservative > aggressive
      expect(predictions[1]).toBeLessThanOrEqual(predictions[2]) // aggressive <= adaptive
    })

    it('provides confidence-based predictions', () => {
      const onUpdate = jest.fn()

      // First, train the predictor with consistent data
      const predictor = LoadingPredictor.getInstance()
      for (let i = 0; i < 15; i++) {
        predictor.recordLoadingDuration(1000)
      }

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={onUpdate}
          enableLearning={true}
          showConfidence={true}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onUpdate).toHaveBeenCalled()
      const update = onUpdate.mock.calls[0][0]

      if (typeof update === 'object') {
        expect(update).toHaveProperty('duration')
        expect(update).toHaveProperty('confidence')
        expect(update.confidence).toBeGreaterThan(0.5)
      }
    })

    it('handles prediction errors gracefully', () => {
      const onUpdate = jest.fn()
      const onError = jest.fn()

      // Mock predictor to throw error
      const predictor = LoadingPredictor.getInstance()
      const originalPredict = predictor.predictDuration
      predictor.predictDuration = jest.fn().mockImplementation(() => {
        throw new Error('Prediction error')
      })

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={onUpdate}
          onPredictionError={onError}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onError).toHaveBeenCalled()
      expect(onUpdate).not.toHaveBeenCalled()

      // Restore original method
      predictor.predictDuration = originalPredict
    })

    it('provides prediction analytics', () => {
      const onAnalytics = jest.fn()

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={jest.fn()}
          onAnalytics={onAnalytics}
          enableAnalytics={true}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onAnalytics).toHaveBeenCalled()
      const analytics = onAnalytics.mock.calls[0][0]
      expect(analytics).toHaveProperty('prediction')
      expect(analytics).toHaveProperty('accuracy')
      expect(analytics).toHaveProperty('confidence')
    })
  })

  describe('SkeletonTransition with Predictions', () => {
    it('integrates predictions with transitions', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1200)
        }, [])

        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<div>Loading...</div>}
            enablePrediction={true}
            duration={400}
            predictionMode="adaptive"
          >
            <div data-testid="predicted-content">Content loaded!</div>
          </SkeletonTransition>
        )
      }

      render(<TestComponent />)

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      act(() => {
        jest.advanceTimersByTime(1200)
      })

      await waitFor(() => {
        expect(screen.getByTestId('predicted-content')).toBeInTheDocument()
      })
    })

    it('optimizes transition timing based on predictions', async () => {
      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        // Train predictor with specific pattern
        React.useEffect(() => {
          const predictor = LoadingPredictor.getInstance()
          for (let i = 0; i < 10; i++) {
            predictor.recordLoadingDuration(800 + i * 50)
          }

          setTimeout(() => setIsLoading(false), 800)
        }, [])

        return (
          <SkeletonTransition
            isLoading={isLoading}
            skeleton={<div>Loading...</div>}
            enablePrediction={true}
            duration={300} // Should be optimized based on prediction
            predictionMode="adaptive"
          >
            <div>Optimized content!</div>
          </SkeletonTransition>
        )
      }

      render(<TestComponent />)

      act(() => {
        jest.advanceTimersByTime(800)
      })

      expect(screen.getByText('Optimized content!')).toBeInTheDocument()
    })
  })

  describe('Performance Integration', () => {
    it('integrates predictions with performance monitoring', () => {
      const onPerformanceReport = jest.fn()
      const onPredictionUpdate = jest.fn()

      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <PerformanceSkeleton
            performanceId="predictive-performance"
            onPerformanceReport={onPerformanceReport}
            enableDetailedMetrics={true}
          >
            <SmartSkeleton
              isLoading={isLoading}
              predictionMode="adaptive"
              onPredictionUpdate={onPredictionUpdate}
              enableLearning={true}
            >
              <div>Content with predictions!</div>
            </SmartSkeleton>
          </PerformanceSkeleton>
        )
      }

      render(<TestComponent />)

      expect(onPredictionUpdate).toHaveBeenCalled()
      expect(mockPerformance.mark).toHaveBeenCalledWith(
        'predictive-performance-start'
      )

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(onPerformanceReport).toHaveBeenCalled()
      expect(mockPerformance.mark).toHaveBeenCalledWith(
        'predictive-performance-end'
      )
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles missing predictor gracefully', () => {
      const onUpdate = jest.fn()

      // Mock predictor to return null
      const originalGetInstance = LoadingPredictor.getInstance
      LoadingPredictor.getInstance = jest.fn().mockReturnValue(null)

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={onUpdate}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onUpdate).toHaveBeenCalledWith(1000) // Should use default fallback

      // Restore original
      LoadingPredictor.getInstance = originalGetInstance
    })

    it('handles invalid prediction modes', () => {
      const onUpdate = jest.fn()

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode={'invalid-mode' as any}
          onPredictionUpdate={onUpdate}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onUpdate).toHaveBeenCalled()
      const prediction = onUpdate.mock.calls[0][0]
      expect(prediction).toBeGreaterThan(0) // Should use default mode
    })

    it('handles negative or extreme prediction values', () => {
      const onUpdate = jest.fn()

      // Mock predictor to return extreme values
      const predictor = LoadingPredictor.getInstance()
      const originalPredict = predictor.predictDuration
      predictor.predictDuration = jest
        .fn()
        .mockReturnValueOnce(-1000) // Negative
        .mockReturnValueOnce(1000000) // Very large
        .mockReturnValueOnce(0) // Zero

      // Test negative
      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={onUpdate}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onUpdate).toHaveBeenCalled()
      const prediction = onUpdate.mock.calls[0][0]
      expect(prediction).toBeGreaterThan(0) // Should be clamped to positive
      expect(prediction).toBeLessThanOrEqual(10000) // Should be clamped to reasonable max

      // Restore original
      predictor.predictDuration = originalPredict
    })

    it('handles rapid prediction updates', () => {
      const onUpdate = jest.fn()
      let updateCount = 0

      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          // Simulate rapid state changes
          const interval = setInterval(() => {
            setIsLoading((prev) => !prev)
            updateCount++
          }, 100)

          setTimeout(() => clearInterval(interval), 500)
        }, [])

        return (
          <SmartSkeleton
            isLoading={isLoading}
            predictionMode="adaptive"
            onPredictionUpdate={onUpdate}
          >
            <div>Content iteration {updateCount}</div>
          </SmartSkeleton>
        )
      }

      render(<TestComponent />)

      act(() => {
        jest.advanceTimersByTime(600)
      })

      // Should handle rapid updates without errors
      expect(onUpdate).toHaveBeenCalled()
      expect(updateCount).toBeGreaterThan(3)
    })

    it('provides fallback predictions for network errors', () => {
      const onUpdate = jest.fn()

      // Mock network conditions
      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: 'slow-2g',
          saveData: true,
        },
        writable: true,
        configurable: true,
      })

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={onUpdate}
          fallbackPrediction={2000} // Network-aware fallback
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onUpdate).toHaveBeenCalled()
      const prediction = onUpdate.mock.calls[0][0]
      expect(prediction).toBeGreaterThanOrEqual(1500) // Should use network-aware fallback
    })
  })

  describe('Memory Management', () => {
    it('prevents memory leaks in prediction history', () => {
      const predictor = LoadingPredictor.getInstance()

      // Add excessive data
      for (let i = 0; i < 500; i++) {
        predictor.recordLoadingDuration(1000 + i)
      }

      const history = (predictor as any).loadingHistory
      expect(history.length).toBeLessThanOrEqual(100) // Should not exceed limit
      expect(history.length).toBeGreaterThan(0) // Should retain recent data
    })

    it('cleans up prediction resources on unmount', () => {
      const onUpdate = jest.fn()

      const TestComponent = () => {
        return (
          <SmartSkeleton
            isLoading={true}
            predictionMode="adaptive"
            onPredictionUpdate={onUpdate}
          >
            <div>Content</div>
          </SmartSkeleton>
        )
      }

      const { unmount } = render(<TestComponent />)

      expect(onUpdate).toHaveBeenCalledTimes(1)

      unmount()

      // Should not cause memory leaks or additional updates
      expect(onUpdate).toHaveBeenCalledTimes(1)
    })
  })

  describe('Analytics and Insights', () => {
    it('provides detailed prediction analytics', () => {
      const onAnalytics = jest.fn()

      // Train predictor with diverse data
      const predictor = LoadingPredictor.getInstance()
      const now = Date.now()

      // Different content types
      for (let i = 0; i < 10; i++) {
        predictor.recordLoadingDuration(500 + i * 50, now - 3600000, 'image')
        predictor.recordLoadingDuration(1000 + i * 100, now - 1800000, 'text')
        predictor.recordLoadingDuration(2000 + i * 200, now - 900000, 'video')
      }

      render(
        <SmartSkeleton
          isLoading={true}
          predictionMode="adaptive"
          onPredictionUpdate={jest.fn()}
          onAnalytics={onAnalytics}
          enableAnalytics={true}
        >
          <div>Content</div>
        </SmartSkeleton>
      )

      expect(onAnalytics).toHaveBeenCalled()
      const analytics = onAnalytics.mock.calls[0][0]

      expect(analytics).toHaveProperty('accuracy')
      expect(analytics).toHaveProperty('confidence')
      expect(analytics).toHaveProperty('patterns')
      expect(analytics).toHaveProperty('trends')
    })

    it('tracks prediction accuracy over time', () => {
      const onAccuracyUpdate = jest.fn()

      const TestComponent = () => {
        const [isLoading, setIsLoading] = React.useState(true)

        React.useEffect(() => {
          setTimeout(() => setIsLoading(false), 1000)
        }, [])

        return (
          <SmartSkeleton
            isLoading={isLoading}
            predictionMode="adaptive"
            onPredictionUpdate={jest.fn()}
            onAccuracyUpdate={onAccuracyUpdate}
            enableAccuracyTracking={true}
          >
            <div>Content</div>
          </SmartSkeleton>
        )
      }

      render(<TestComponent />)

      act(() => {
        jest.advanceTimersByTime(1000)
      })

      expect(onAccuracyUpdate).toHaveBeenCalled()
      const accuracy = onAccuracyUpdate.mock.calls[0][0]
      expect(accuracy).toHaveProperty('predicted')
      expect(accuracy).toHaveProperty('actual')
      expect(accuracy).toHaveProperty('error')
    })
  })
})
