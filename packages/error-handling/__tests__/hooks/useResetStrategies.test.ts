/**
 * Tests for useResetStrategies hook
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import {
  useResetStrategies,
  dispatchResetEvent,
  useNetworkStatus,
} from '../../src/hooks/useResetStrategies'

describe('useResetStrategies', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('manual reset', () => {
    it('should provide reset function', () => {
      const { result } = renderHook(() => useResetStrategies())

      expect(typeof result.current.reset).toBe('function')
    })

    it('should call onReset with manual reason', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() => useResetStrategies({ onReset }))

      act(() => {
        result.current.reset()
      })

      expect(onReset).toHaveBeenCalledWith('manual')
    })

    it('should call onReset with custom reason', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() => useResetStrategies({ onReset }))

      act(() => {
        result.current.reset('timeout')
      })

      expect(onReset).toHaveBeenCalledWith('timeout')
    })
  })

  describe('timeout reset', () => {
    it('should reset after timeout when error registered', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() =>
        useResetStrategies({
          resetAfterTimeout: 5000,
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      expect(onReset).not.toHaveBeenCalled()

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onReset).toHaveBeenCalledWith('timeout')
    })

    it('should not reset if no error registered', () => {
      const onReset = vi.fn()
      renderHook(() =>
        useResetStrategies({
          resetAfterTimeout: 5000,
          onReset,
        })
      )

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onReset).not.toHaveBeenCalled()
    })

    it('should cancel timeout on clearError', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() =>
        useResetStrategies({
          resetAfterTimeout: 5000,
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      act(() => {
        result.current.clearError()
      })

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      expect(onReset).not.toHaveBeenCalled()
    })
  })

  describe('network restore reset', () => {
    it('should reset on network restore when error registered', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() =>
        useResetStrategies({
          resetOnNetworkRestore: true,
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      act(() => {
        window.dispatchEvent(new Event('online'))
      })

      expect(onReset).toHaveBeenCalledWith('network-restored')
    })

    it('should not reset on network restore without error', () => {
      const onReset = vi.fn()
      renderHook(() =>
        useResetStrategies({
          resetOnNetworkRestore: true,
          onReset,
        })
      )

      act(() => {
        window.dispatchEvent(new Event('online'))
      })

      expect(onReset).not.toHaveBeenCalled()
    })
  })

  describe('custom event reset', () => {
    it('should reset on custom event when error registered', () => {
      const onReset = vi.fn()
      const { result } = renderHook(() =>
        useResetStrategies({
          resetOnCustomEvent: 'app-refresh',
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      act(() => {
        window.dispatchEvent(new CustomEvent('app-refresh'))
      })

      expect(onReset).toHaveBeenCalledWith('custom-event')
    })
  })

  describe('keys change reset', () => {
    it('should reset when keys change after error', () => {
      const onReset = vi.fn()
      let key = 1
      const { result, rerender } = renderHook(() =>
        useResetStrategies({
          resetKeys: [key],
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      key = 2
      rerender()

      expect(onReset).toHaveBeenCalledWith('keys-changed')
    })

    it('should not reset when keys unchanged', () => {
      const onReset = vi.fn()
      const key = 1
      const { result, rerender } = renderHook(() =>
        useResetStrategies({
          resetKeys: [key],
          onReset,
        })
      )

      act(() => {
        result.current.registerError()
      })

      rerender()

      expect(onReset).not.toHaveBeenCalled()
    })
  })
})

describe('dispatchResetEvent', () => {
  it('should dispatch custom event', () => {
    const handler = vi.fn()
    window.addEventListener('test-reset', handler)

    dispatchResetEvent('test-reset')

    expect(handler).toHaveBeenCalled()

    window.removeEventListener('test-reset', handler)
  })
})

describe('useNetworkStatus', () => {
  it('should return current online status', () => {
    const { result } = renderHook(() => useNetworkStatus())

    expect(typeof result.current.isOnline).toBe('boolean')
    expect(typeof result.current.wasOffline).toBe('boolean')
  })

  it('should track if was offline', () => {
    const { result } = renderHook(() => useNetworkStatus())

    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    expect(result.current.wasOffline).toBe(true)
  })
})
