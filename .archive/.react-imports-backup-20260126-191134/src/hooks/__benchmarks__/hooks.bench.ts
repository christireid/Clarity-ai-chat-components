/**
 * Performance Benchmarks for Critical Hooks
 *
 * Run with: pnpm vitest bench
 *
 * These benchmarks measure the performance characteristics of critical hooks
 * to ensure they meet performance requirements and to catch regressions.
 */

import { describe, bench } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Note: These benchmarks require the hooks to be importable
// Run `pnpm build` in packages/react before running benchmarks

describe('Hook Performance Benchmarks', () => {
  describe('useDebounce', () => {
    bench('debounce value update', async () => {
      const { useDebounce } = await import('../ui/use-debounce')
      const { result, rerender } = renderHook(
        ({ value }) => useDebounce(value, 100),
        { initialProps: { value: 'initial' } }
      )
      rerender({ value: 'updated' })
    })

    bench('debounced callback creation', async () => {
      const { useDebouncedCallback } = await import('../ui/use-debounce')
      const callback = () => {}
      renderHook(() => useDebouncedCallback(callback, 100))
    })
  })

  describe('useThrottle', () => {
    bench('throttle value update', async () => {
      const { useThrottle } = await import('../ui/use-throttle')
      const { rerender } = renderHook(({ value }) => useThrottle(value, 100), {
        initialProps: { value: 'initial' },
      })
      rerender({ value: 'updated' })
    })
  })

  describe('useLocalStorage', () => {
    bench('read from storage', async () => {
      const { useLocalStorage } = await import('../storage/use-local-storage')
      renderHook(() => useLocalStorage('bench-key', 'default'))
    })

    bench('write to storage', async () => {
      const { useLocalStorage } = await import('../storage/use-local-storage')
      const { result } = renderHook(() =>
        useLocalStorage('bench-write-key', 'default')
      )
      act(() => {
        result.current[1]('new value')
      })
    })
  })

  describe('useSafeTimeout', () => {
    bench('set timeout', async () => {
      const { useSafeTimeout } = await import('../ui/use-safe-timeout')
      const { result } = renderHook(() => useSafeTimeout())
      act(() => {
        result.current.setSafeTimeout(() => {}, 1000)
      })
    })
  })

  describe('useCircuitBreaker', () => {
    bench('circuit breaker initialization', async () => {
      const { useCircuitBreaker } =
        await import('../resilience/use-circuit-breaker')
      renderHook(() =>
        useCircuitBreaker({
          name: 'bench-circuit',
          failureThreshold: 5,
          resetTimeout: 30000,
        })
      )
    })

    bench('circuit breaker execute', async () => {
      const { useCircuitBreaker } =
        await import('../resilience/use-circuit-breaker')
      const { result } = renderHook(() =>
        useCircuitBreaker({
          name: 'bench-circuit-exec',
          failureThreshold: 5,
          resetTimeout: 30000,
        })
      )
      await act(async () => {
        try {
          await result.current.execute(async () => 'success')
        } catch {
          // Ignore errors in benchmark
        }
      })
    })
  })

  describe('useKeyboardShortcuts', () => {
    bench('register shortcuts', async () => {
      const { useKeyboardShortcuts } =
        await import('../keyboard/use-keyboard-shortcuts')
      renderHook(() =>
        useKeyboardShortcuts([
          { key: 'mod+k', callback: () => {} },
          { key: 'Escape', callback: () => {} },
        ])
      )
    })
  })

  describe('useAutoScroll', () => {
    bench('auto scroll initialization', async () => {
      const { useAutoScroll } = await import('../ui/use-auto-scroll')
      renderHook(() => useAutoScroll({ enabled: true }))
    })
  })
})

/**
 * Memory Usage Guidelines
 *
 * When profiling hooks for memory usage:
 * 1. Use Chrome DevTools Memory panel
 * 2. Take heap snapshot before and after hook usage
 * 3. Look for retained objects after unmount
 *
 * Expected characteristics:
 * - Hooks should clean up all subscriptions on unmount
 * - Refs should not hold stale closures
 * - Callbacks should be properly memoized
 */

/**
 * Render Performance Guidelines
 *
 * For measuring render performance:
 * 1. Use React DevTools Profiler
 * 2. Check for unnecessary re-renders
 * 3. Verify memoization is effective
 *
 * Target metrics:
 * - useDebounce: < 0.5ms per value change
 * - useLocalStorage: < 1ms for read, < 5ms for write
 * - useCircuitBreaker: < 0.5ms for execute
 * - useKeyboardShortcuts: < 1ms for registration
 */
