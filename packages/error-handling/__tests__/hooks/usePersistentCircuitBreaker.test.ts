/**
 * Tests for usePersistentCircuitBreaker hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  usePersistentCircuitBreaker,
  cleanupStaleCircuitBreakers,
} from '../../src/hooks/usePersistentCircuitBreaker'

describe('usePersistentCircuitBreaker', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    localStorage.clear()
  })

  describe('initial state', () => {
    it('should start in closed state', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test' })
      )

      expect(result.current.state).toBe('closed')
      expect(result.current.failureCount).toBe(0)
      expect(result.current.canRequest).toBe(true)
    })

    it('should restore state from localStorage', () => {
      localStorage.setItem(
        'circuit-breaker-test',
        JSON.stringify({
          state: 'open',
          openedAt: Date.now(),
          failureCount: 5,
          lastFailureAt: Date.now(),
        })
      )

      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', resetTime: 30000 })
      )

      expect(result.current.state).toBe('open')
      expect(result.current.failureCount).toBe(5)
      expect(result.current.canRequest).toBe(false)
    })

    it('should transition to half-open if reset time elapsed', () => {
      const pastTime = Date.now() - 60000 // 60 seconds ago
      localStorage.setItem(
        'circuit-breaker-test',
        JSON.stringify({
          state: 'open',
          openedAt: pastTime,
          failureCount: 5,
          lastFailureAt: pastTime,
        })
      )

      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', resetTime: 30000 })
      )

      expect(result.current.state).toBe('half-open')
    })
  })

  describe('recordFailure', () => {
    it('should increment failure count', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 5 })
      )

      act(() => {
        result.current.recordFailure()
      })

      expect(result.current.failureCount).toBe(1)
    })

    it('should open circuit after threshold failures', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 3 })
      )

      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
        result.current.recordFailure()
      })

      expect(result.current.state).toBe('open')
      expect(result.current.canRequest).toBe(false)
    })

    it('should reopen circuit on failure in half-open state', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 3 })
      )

      // Open the circuit
      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
        result.current.recordFailure()
      })

      // Transition to half-open
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(result.current.state).toBe('half-open')

      // Failure in half-open reopens
      act(() => {
        result.current.recordFailure()
      })

      expect(result.current.state).toBe('open')
    })

    it('should persist state to localStorage', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 3 })
      )

      act(() => {
        result.current.recordFailure()
      })

      const stored = JSON.parse(
        localStorage.getItem('circuit-breaker-test') || '{}'
      )
      expect(stored.failureCount).toBe(1)
    })
  })

  describe('recordSuccess', () => {
    it('should reset failure count in closed state', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 5 })
      )

      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      expect(result.current.failureCount).toBe(2)

      act(() => {
        result.current.recordSuccess()
      })

      expect(result.current.failureCount).toBe(0)
    })

    it('should close circuit from half-open state', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 2 })
      )

      // Open circuit
      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      // Transition to half-open
      act(() => {
        vi.advanceTimersByTime(30000)
      })

      expect(result.current.state).toBe('half-open')

      // Success closes circuit
      act(() => {
        result.current.recordSuccess()
      })

      expect(result.current.state).toBe('closed')
      expect(result.current.failureCount).toBe(0)
    })
  })

  describe('reset', () => {
    it('should reset circuit to closed', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 2 })
      )

      // Open circuit
      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      expect(result.current.state).toBe('open')

      act(() => {
        result.current.reset()
      })

      expect(result.current.state).toBe('closed')
      expect(result.current.failureCount).toBe(0)
    })

    it('should reset state in localStorage', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', threshold: 2 })
      )

      // Open circuit
      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      const beforeReset = JSON.parse(
        localStorage.getItem('circuit-breaker-test') || '{}'
      )
      expect(beforeReset.state).toBe('open')

      act(() => {
        result.current.reset()
      })

      // After reset, state persists as closed with 0 failures
      const afterReset = JSON.parse(
        localStorage.getItem('circuit-breaker-test') || '{}'
      )
      expect(afterReset.state).toBe('closed')
      expect(afterReset.failureCount).toBe(0)
    })
  })

  describe('timeUntilReset', () => {
    it('should return null when circuit closed', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({ persistKey: 'test', resetTime: 30000 })
      )

      expect(result.current.timeUntilReset).toBeNull()
    })

    it('should return remaining time when circuit open', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({
          persistKey: 'test',
          threshold: 2,
          resetTime: 30000,
        })
      )

      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      expect(result.current.timeUntilReset).toBeGreaterThan(0)
      expect(result.current.timeUntilReset).toBeLessThanOrEqual(30000)
    })

    it('should update over time', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({
          persistKey: 'test',
          threshold: 2,
          resetTime: 30000,
        })
      )

      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      const initialTime = result.current.timeUntilReset!

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(result.current.timeUntilReset).toBeLessThan(initialTime)
    })
  })

  describe('onStateChange callback', () => {
    it('should call onStateChange when state changes', () => {
      const onStateChange = vi.fn()
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({
          persistKey: 'test',
          threshold: 2,
          onStateChange,
        })
      )

      act(() => {
        result.current.recordFailure()
        result.current.recordFailure()
      })

      expect(onStateChange).toHaveBeenCalledWith('open', 'closed')
    })
  })

  describe('disablePersistence', () => {
    it('should not write to localStorage when disabled', () => {
      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({
          persistKey: 'test',
          disablePersistence: true,
        })
      )

      act(() => {
        result.current.recordFailure()
      })

      expect(localStorage.getItem('circuit-breaker-test')).toBeNull()
    })

    it('should not read from localStorage when disabled', () => {
      localStorage.setItem(
        'circuit-breaker-test',
        JSON.stringify({
          state: 'open',
          openedAt: Date.now(),
          failureCount: 5,
          lastFailureAt: Date.now(),
        })
      )

      const { result } = renderHook(() =>
        usePersistentCircuitBreaker({
          persistKey: 'test',
          disablePersistence: true,
        })
      )

      expect(result.current.state).toBe('closed')
    })
  })
})

describe('cleanupStaleCircuitBreakers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should remove stale entries', () => {
    const staleTime = Date.now() - 100000000 // Very old

    localStorage.setItem(
      'circuit-breaker-stale',
      JSON.stringify({
        state: 'open',
        openedAt: staleTime,
        failureCount: 3,
        lastFailureAt: staleTime,
      })
    )

    localStorage.setItem(
      'circuit-breaker-fresh',
      JSON.stringify({
        state: 'closed',
        openedAt: null,
        failureCount: 0,
        lastFailureAt: Date.now(),
      })
    )

    cleanupStaleCircuitBreakers(86400000) // 1 day max age

    expect(localStorage.getItem('circuit-breaker-stale')).toBeNull()
    expect(localStorage.getItem('circuit-breaker-fresh')).not.toBeNull()
  })

  it('should not remove non-circuit-breaker entries', () => {
    localStorage.setItem('other-key', 'value')

    cleanupStaleCircuitBreakers()

    expect(localStorage.getItem('other-key')).toBe('value')
  })

  it('should remove invalid entries', () => {
    localStorage.setItem('circuit-breaker-invalid', 'not json')

    cleanupStaleCircuitBreakers()

    expect(localStorage.getItem('circuit-breaker-invalid')).toBeNull()
  })
})
