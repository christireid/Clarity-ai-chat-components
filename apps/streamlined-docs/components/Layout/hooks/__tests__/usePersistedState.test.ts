import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { usePersistedState } from '../usePersistedState'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

describe('usePersistedState', () => {
  beforeEach(() => {
    localStorageMock.clear()
    vi.clearAllMocks()
  })

  it('should return default value initially', () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'))

    expect(result.current[0]).toBe('default')
  })

  it('should load value from localStorage after mount', async () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'))

    const { result, rerender } = renderHook(() =>
      usePersistedState('test-key', 'default')
    )

    // Wait for useEffect to run
    await act(async () => {
      rerender()
    })

    // After mount, should load from localStorage
    expect(result.current[0]).toBe('stored-value')
  })

  it('should persist value to localStorage when changed', async () => {
    const { result } = renderHook(() => usePersistedState('test-key', 'default'))

    await act(async () => {
      result.current[1]('new-value')
    })

    expect(result.current[0]).toBe('new-value')
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'test-key',
      JSON.stringify('new-value')
    )
  })

  it('should support function updates', async () => {
    const { result } = renderHook(() => usePersistedState('count', 0))

    await act(async () => {
      result.current[1]((prev) => prev + 1)
    })

    expect(result.current[0]).toBe(1)
  })

  it('should return mounted state', async () => {
    const { result, rerender } = renderHook(() =>
      usePersistedState('test-key', 'default')
    )

    // Initially not mounted (SSR)
    // After first render, mounted should be true
    await act(async () => {
      rerender()
    })

    expect(result.current[2]).toBe(true) // isMounted
  })

  it('should handle complex objects', async () => {
    const defaultValue = { name: 'test', count: 0 }
    const { result } = renderHook(() =>
      usePersistedState('object-key', defaultValue)
    )

    await act(async () => {
      result.current[1]({ name: 'updated', count: 5 })
    })

    expect(result.current[0]).toEqual({ name: 'updated', count: 5 })
  })

  it('should handle boolean values', async () => {
    const { result } = renderHook(() => usePersistedState('bool-key', true))

    await act(async () => {
      result.current[1](false)
    })

    expect(result.current[0]).toBe(false)
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'bool-key',
      JSON.stringify(false)
    )
  })
})
