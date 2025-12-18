/**
 * Tests for useErrorAnalytics hook and provider
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import {
  ErrorAnalyticsProvider,
  useErrorAnalytics,
  useErrorAnalyticsOptional,
} from '../../src/hooks/useErrorAnalytics'
import {
  ProviderError,
  ProviderErrorCode,
} from '../../src/errors/provider-error'
import { logger, LogLevel, setGlobalLogLevel } from '@clarity-chat/utils/logger'

describe('ErrorAnalyticsProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ErrorAnalyticsProvider>{children}</ErrorAnalyticsProvider>
  )

  describe('recordError', () => {
    it('should record an error', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordError(new Error('Test error'))
      })

      const stats = result.current.getStats()
      expect(stats.totalErrors).toBe(1)
      expect(stats.errorsByType['Error']).toBe(1)
    })

    it('should record ClarityError with code', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      const providerError = ProviderError.rateLimit('openai', 60)

      act(() => {
        result.current.recordError(providerError)
      })

      const stats = result.current.getStats()
      expect(stats.errorsByCode[ProviderErrorCode.RATE_LIMIT]).toBe(1)
    })

    it('should add to history', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordError(new Error('Test error'))
      })

      const history = result.current.getHistory()
      expect(history).toHaveLength(1)
      expect(history[0]?.message).toBe('Test error')
    })

    it('should respect maxHistorySize', () => {
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider maxHistorySize={2}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordError(new Error('Error 1'))
        result.current.recordError(new Error('Error 2'))
        result.current.recordError(new Error('Error 3'))
      })

      const history = result.current.getHistory()
      expect(history).toHaveLength(2)
      // Most recent first
      expect(history[0]?.message).toBe('Error 3')
      expect(history[1]?.message).toBe('Error 2')
    })

    it('should call onErrorRecorded callback', () => {
      const onErrorRecorded = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onErrorRecorded }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordError(new Error('Test error'))
      })

      expect(onErrorRecorded).toHaveBeenCalledWith(
        expect.objectContaining({
          errorType: 'Error',
          message: 'Test error',
        })
      )
    })
  })

  describe('recordRetryAttempt', () => {
    it('should increment retry attempts', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordRetryAttempt('NetworkError', 1)
        result.current.recordRetryAttempt('NetworkError', 2)
      })

      const stats = result.current.getStats()
      expect(stats.retryAttempts).toBe(2)
    })

    it('should call onRetryAttempt callback', () => {
      const onRetryAttempt = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onRetryAttempt }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordRetryAttempt('NetworkError', 1)
      })

      expect(onRetryAttempt).toHaveBeenCalledWith('NetworkError', 1)
    })
  })

  describe('recordRetrySuccess', () => {
    it('should increment retry successes', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordRetryAttempt('NetworkError', 1)
        result.current.recordRetrySuccess('NetworkError', 1, 1000)
      })

      const stats = result.current.getStats()
      expect(stats.retrySuccesses).toBe(1)
    })

    it('should calculate retry success rate', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordRetryAttempt('NetworkError', 1)
        result.current.recordRetryAttempt('NetworkError', 2)
        result.current.recordRetrySuccess('NetworkError', 2, 1000)
      })

      const stats = result.current.getStats()
      expect(stats.retrySuccessRate).toBe(50)
    })

    it('should calculate mean time to recovery', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordRetrySuccess('Error1', 1, 1000)
        result.current.recordRetrySuccess('Error2', 1, 2000)
        result.current.recordRetrySuccess('Error3', 1, 3000)
      })

      const stats = result.current.getStats()
      expect(stats.meanTimeToRecovery).toBe(2000)
    })

    it('should update error entry as recovered', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordError(new Error('Test error'))
        result.current.recordRetrySuccess('Error', 2, 500)
      })

      const history = result.current.getHistory()
      expect(history[0]?.recovered).toBe(true)
      expect(history[0]?.timeToRecovery).toBe(500)
      expect(history[0]?.retryCount).toBe(2)
    })

    it('should call onRetrySuccess callback', () => {
      const onRetrySuccess = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onRetrySuccess }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordRetrySuccess('NetworkError', 2, 1500)
      })

      expect(onRetrySuccess).toHaveBeenCalledWith('NetworkError', 2, 1500)
    })
  })

  describe('recordRetryFailure', () => {
    it('should call onRetryFailure callback', () => {
      const onRetryFailure = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onRetryFailure }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordRetryFailure('NetworkError', 3)
      })

      expect(onRetryFailure).toHaveBeenCalledWith('NetworkError', 3)
    })
  })

  describe('recordCircuitTrip', () => {
    it('should increment circuit breaker trips', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordCircuitTrip('RateLimitError', 5)
      })

      const stats = result.current.getStats()
      expect(stats.circuitBreakerTrips).toBe(1)
    })

    it('should call onCircuitTrip callback', () => {
      const onCircuitTrip = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onCircuitTrip }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordCircuitTrip('RateLimitError', 5)
      })

      expect(onCircuitTrip).toHaveBeenCalledWith('RateLimitError', 5)
    })
  })

  describe('recordCircuitReset', () => {
    it('should call onCircuitReset callback', () => {
      const onCircuitReset = vi.fn()
      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider callbacks={{ onCircuitReset }}>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordCircuitReset('RateLimitError')
      })

      expect(onCircuitReset).toHaveBeenCalledWith('RateLimitError')
    })
  })

  describe('getStats', () => {
    it('should return all statistics', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      const stats = result.current.getStats()

      expect(stats).toEqual({
        totalErrors: 0,
        errorsByType: {},
        errorsByCode: {},
        retryAttempts: 0,
        retrySuccesses: 0,
        retrySuccessRate: 0,
        circuitBreakerTrips: 0,
        meanTimeToRecovery: null,
        errorsPerMinute: 0,
      })
    })

    it('should return 0% success rate when no attempts', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      const stats = result.current.getStats()

      expect(stats.retrySuccessRate).toBe(0)
    })

    it('should return null mean time to recovery when no recoveries', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      const stats = result.current.getStats()

      expect(stats.meanTimeToRecovery).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all analytics data', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordError(new Error('Test'))
        result.current.recordRetryAttempt('Error', 1)
        result.current.recordCircuitTrip('Error', 3)
      })

      expect(result.current.getStats().totalErrors).toBe(1)

      act(() => {
        result.current.clear()
      })

      const stats = result.current.getStats()
      expect(stats.totalErrors).toBe(0)
      expect(stats.retryAttempts).toBe(0)
      expect(stats.circuitBreakerTrips).toBe(0)
      expect(result.current.getHistory()).toHaveLength(0)
    })
  })

  describe('exportData', () => {
    it('should export stats and history', () => {
      const { result } = renderHook(() => useErrorAnalytics(), { wrapper })

      act(() => {
        result.current.recordError(new Error('Test'))
      })

      const exported = result.current.exportData()

      expect(exported.stats).toBeDefined()
      expect(exported.history).toBeDefined()
      expect(exported.exportedAt).toBeDefined()
      expect(exported.stats.totalErrors).toBe(1)
      expect(exported.history).toHaveLength(1)
    })
  })

  describe('enableLogging', () => {
    it('should log when enableLogging is true', () => {
      // Need to set both global and instance levels to ensure log is not filtered
      setGlobalLogLevel(LogLevel.DEBUG)
      logger.setLevel(LogLevel.DEBUG)
      
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <ErrorAnalyticsProvider enableLogging>
          {children}
        </ErrorAnalyticsProvider>
      )

      const { result } = renderHook(() => useErrorAnalytics(), {
        wrapper: customWrapper,
      })

      act(() => {
        result.current.recordError(new Error('Test'))
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.any(String),
        '[ErrorAnalytics] Error recorded',
        expect.anything()
      )

      consoleSpy.mockRestore()
      // Reset levels
      setGlobalLogLevel(LogLevel.INFO)
      logger.setLevel(LogLevel.INFO)
    })
  })
})

describe('useErrorAnalytics', () => {
  it('should throw if used outside provider', () => {
    // Suppress console.error for expected error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useErrorAnalytics())
    }).toThrow('useErrorAnalytics must be used within ErrorAnalyticsProvider')

    consoleSpy.mockRestore()
  })
})

describe('useErrorAnalyticsOptional', () => {
  it('should return null if used outside provider', () => {
    const { result } = renderHook(() => useErrorAnalyticsOptional())

    expect(result.current).toBeNull()
  })

  it('should return context if used inside provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ErrorAnalyticsProvider>{children}</ErrorAnalyticsProvider>
    )

    const { result } = renderHook(() => useErrorAnalyticsOptional(), {
      wrapper,
    })

    expect(result.current).not.toBeNull()
    expect(result.current?.recordError).toBeDefined()
  })
})
