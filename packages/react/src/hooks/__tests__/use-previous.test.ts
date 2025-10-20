import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { usePrevious } from '../use-previous'

describe('usePrevious', () => {
  it('should return undefined on first render', () => {
    const { result } = renderHook(() => usePrevious(0))
    expect(result.current).toBeUndefined()
  })

  it('should return previous value after update', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: 1 })
    expect(result.current).toBe(0)

    rerender({ value: 2 })
    expect(result.current).toBe(1)

    rerender({ value: 3 })
    expect(result.current).toBe(2)
  })

  it('should work with different types', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 'first' as string | number | object },
    })

    rerender({ value: 'second' })
    expect(result.current).toBe('first')

    rerender({ value: 42 })
    expect(result.current).toBe('second')

    const obj = { key: 'value' }
    rerender({ value: obj })
    expect(result.current).toBe(42)
  })

  it('should work with objects', () => {
    const obj1 = { count: 1 }
    const obj2 = { count: 2 }

    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: obj1 },
    })

    expect(result.current).toBeUndefined()

    rerender({ value: obj2 })
    expect(result.current).toBe(obj1)
    expect(result.current).toEqual({ count: 1 })
  })
})
