import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useToggle } from '../use-toggle'

describe('useToggle', () => {
  it('should initialize with false by default', () => {
    const { result } = renderHook(() => useToggle())
    expect(result.current.value).toBe(false)
  })

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useToggle(true))
    expect(result.current.value).toBe(true)
  })

  it('should toggle value', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      result.current.toggle()
    })
    expect(result.current.value).toBe(true)

    act(() => {
      result.current.toggle()
    })
    expect(result.current.value).toBe(false)
  })

  it('should set to true', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      result.current.setTrue()
    })
    expect(result.current.value).toBe(true)

    // Should stay true
    act(() => {
      result.current.setTrue()
    })
    expect(result.current.value).toBe(true)
  })

  it('should set to false', () => {
    const { result } = renderHook(() => useToggle(true))

    act(() => {
      result.current.setFalse()
    })
    expect(result.current.value).toBe(false)

    // Should stay false
    act(() => {
      result.current.setFalse()
    })
    expect(result.current.value).toBe(false)
  })

  it('should set to specific value', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      result.current.setValue(true)
    })
    expect(result.current.value).toBe(true)

    act(() => {
      result.current.setValue(false)
    })
    expect(result.current.value).toBe(false)
  })

  it('should work with function updater', () => {
    const { result } = renderHook(() => useToggle(false))

    act(() => {
      result.current.setValue((prev) => !prev)
    })
    expect(result.current.value).toBe(true)
  })
})
