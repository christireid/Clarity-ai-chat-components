import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useErrorToast } from '../../src/hooks/useErrorToast'

describe('useErrorToast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty toasts array', () => {
    const { result } = renderHook(() => useErrorToast())

    expect(result.current.toasts).toEqual([])
  })

  it('should show a toast', () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Test error message', 'error')
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]?.message).toBe('Test error message')
    expect(result.current.toasts[0]?.type).toBe('error')
    expect(result.current.toasts[0]?.id).toBeDefined()
  })

  it('should show toast with default type', () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Test message')
    })

    expect(result.current.toasts[0]?.type).toBe('error')
  })

  it('should show toast with different types', () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Error', 'error')
      result.current.showToast('Warning', 'warning')
      result.current.showToast('Info', 'info')
    })

    expect(result.current.toasts).toHaveLength(3)
    expect(result.current.toasts[0]?.type).toBe('error')
    expect(result.current.toasts[1]?.type).toBe('warning')
    expect(result.current.toasts[2]?.type).toBe('info')
  })

  it('should auto-dismiss toast after duration', async () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Test message', 'error', 1000)
    })

    expect(result.current.toasts).toHaveLength(1)

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should not auto-dismiss toast with duration 0', async () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Test message', 'error', 0)
    })

    expect(result.current.toasts).toHaveLength(1)

    await act(async () => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.toasts).toHaveLength(1)
  })

  it('should hide a specific toast', () => {
    const { result } = renderHook(() => useErrorToast())

    let toastId: string | undefined
    act(() => {
      toastId = result.current.showToast('Test message 1', 'error')
      result.current.showToast('Test message 2', 'error')
    })

    expect(result.current.toasts).toHaveLength(2)

    act(() => {
      result.current.hideToast(toastId!)
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]?.message).toBe('Test message 2')
  })

  it('should clear all toasts', () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Message 1', 'error')
      result.current.showToast('Message 2', 'warning')
      result.current.showToast('Message 3', 'info')
    })

    expect(result.current.toasts).toHaveLength(3)

    act(() => {
      result.current.clearAll()
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should cancel timeout when hiding toast', async () => {
    const { result } = renderHook(() => useErrorToast())

    let toastId: string | undefined
    act(() => {
      toastId = result.current.showToast('Test message', 'error', 5000)
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.hideToast(toastId!)
    })

    expect(result.current.toasts).toHaveLength(0)

    // Advance time - toast should not reappear
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should cancel all timeouts when clearing all', async () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Message 1', 'error', 5000)
      result.current.showToast('Message 2', 'warning', 5000)
    })

    expect(result.current.toasts).toHaveLength(2)

    act(() => {
      result.current.clearAll()
    })

    expect(result.current.toasts).toHaveLength(0)

    // Advance time - toasts should not reappear
    await act(async () => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })

  it('should return unique toast IDs', () => {
    const { result } = renderHook(() => useErrorToast())

    let id1: string | undefined
    let id2: string | undefined

    act(() => {
      id1 = result.current.showToast('Message 1', 'error')
      id2 = result.current.showToast('Message 2', 'error')
    })

    expect(id1).toBeDefined()
    expect(id2).toBeDefined()
    expect(id1).not.toBe(id2)
  })

  it('should handle multiple toasts with different durations', async () => {
    const { result } = renderHook(() => useErrorToast())

    act(() => {
      result.current.showToast('Short', 'error', 1000)
      result.current.showToast('Long', 'error', 5000)
    })

    expect(result.current.toasts).toHaveLength(2)

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0]?.message).toBe('Long')

    await act(async () => {
      vi.advanceTimersByTime(4000)
    })

    expect(result.current.toasts).toHaveLength(0)
  })
})
