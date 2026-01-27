import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useDebounce, useDebouncedCallback } from '../use-debounce'

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500))
    expect(result.current).toBe('initial')
  })

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 'first' } }
    )

    expect(result.current).toBe('first')

    // Change value multiple times quickly
    rerender({ value: 'second' })
    rerender({ value: 'third' })
    rerender({ value: 'fourth' })

    // Should still be old value
    expect(result.current).toBe('first')

    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('fourth')
      },
      { timeout: 200 }
    )
  })

  it('should use default delay of 500ms', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    })

    rerender({ value: 'updated' })

    // Should not update immediately
    expect(result.current).toBe('initial')

    // Should update after default delay
    await waitFor(
      () => {
        expect(result.current).toBe('updated')
      },
      { timeout: 600 }
    )
  })
})

describe('useDebouncedCallback', () => {
  it('should debounce callback execution', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    // Call multiple times quickly
    act(() => {
      result.current('first')
      result.current('second')
      result.current('third')
    })

    // Should not have been called yet
    expect(callback).not.toHaveBeenCalled()

    // Wait for debounce
    await waitFor(
      () => {
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('third')
      },
      { timeout: 200 }
    )
  })

  it('should cancel previous calls', async () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 100))

    act(() => {
      result.current('first')
    })

    await new Promise((resolve) => setTimeout(resolve, 50))

    act(() => {
      result.current('second')
    })

    await waitFor(
      () => {
        expect(callback).toHaveBeenCalledTimes(1)
        expect(callback).toHaveBeenCalledWith('second')
      },
      { timeout: 200 }
    )
  })
})
